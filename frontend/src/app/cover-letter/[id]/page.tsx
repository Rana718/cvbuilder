'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useParams, useSearchParams, useRouter } from 'next/navigation';
import { useAuth } from '@/components/AuthContext';
import { useCoverLetterStore } from '@/store/coverLetterStore';
import { usePremiumStatus } from '@/hooks/usePremiumStatus';
import PaymentCard from '@/components/PaymentCard';
import CoverLetterTemplate from '@/components/templates/CoverLetterTemplate';
import { ArrowLeft, Download, Save, Edit, Share, CheckCircle } from 'lucide-react';
import Link from 'next/link';
import axiosInstance from '@/lib/axios';

function CoverLetterPage() {
    const params = useParams();
    const router = useRouter();
    const { user, loading } = useAuth();
    const { isPremium, refreshStatus } = usePremiumStatus();
    const coverLetterId = params.id;

    const {
        name, email, phone, address, recipient_company, recipient_title, body,
        setDocumentId, saveCoverLetter, loadCoverLetter, hasData, documentId,
        shareableUuid, setShareableUuid
    } = useCoverLetterStore();

    const [isSaving, setIsSaving] = useState(false);
    const [isDownloading, setIsDownloading] = useState(false);
    const [isSharing, setIsSharing] = useState(false);
    const [shareUrl, setShareUrl] = useState('');
    const [showShareSuccess, setShowShareSuccess] = useState(false);
    const [hasLoadedOnce, setHasLoadedOnce] = useState(false);
    const [showPaymentCard, setShowPaymentCard] = useState(false);

    const redirectToAuth = () => {
        const currentUrl = window.location.pathname + window.location.search;
        router.push(`/sign-in?callbackUrl=${encodeURIComponent(currentUrl)}`);
    };

    const handleSave = async () => {
        if (isSaving || !user) {
            if (!user) redirectToAuth();
            return;
        }

        setIsSaving(true);
        try {
            if (coverLetterId && typeof coverLetterId === 'string' && !isNaN(Number(coverLetterId))) {
                setDocumentId(Number(coverLetterId));
            }
            await saveCoverLetter();
            alert('Cover letter saved successfully!');
        } catch (error) {
            console.error('Save error:', error);
            alert('Failed to save cover letter. Please try again.');
        } finally {
            setIsSaving(false);
        }
    };

    const generatePDF = async (element: HTMLElement) => {
        try {
            const response = await fetch("/api", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    html: element.outerHTML, // send HTML for Puppeteer
                }),
            });

            if (!response.ok) {
                throw new Error(`PDF generation failed: ${response.statusText}`);
            }

            const blob = await response.blob();
            const url = window.URL.createObjectURL(blob);
            const link = document.createElement("a");
            link.href = url;
            const filename = `${name || 'CoverLetter'}_${recipient_company || 'Document'}.pdf`.replace(/\s+/g, '_');
            link.download = filename;
            link.click();
            window.URL.revokeObjectURL(url);
        } catch (error) {
            console.error("PDF generation error:", error);
            throw error;
        }
    };

    const handleDownload = async () => {
        if (isDownloading) return;

        if (!user || !isPremium) {
            setShowPaymentCard(true);
            await saveCoverLetter();
            return;
        }

        setIsDownloading(true);
        try {
            let content = document.querySelector(".hidden.sm\\:block [data-cover-letter-content]") as HTMLElement;
            if (!content) {
                content = document.querySelector("[data-cover-letter-content]") as HTMLElement;
            }

            if (!content) {
                alert('Cover letter content not found. Please refresh and try again.');
                return;
            }

            await generatePDF(content);
        } catch (error: any) {
            console.error("Download error:", error);
            alert(`Download failed: ${error.message || 'Please try again.'}`);
        } finally {
            setIsDownloading(false);
        }
    };

    const handleShare = async () => {
        if (isSharing || !user) {
            if (!user) redirectToAuth();
            return;
        }

        if(!isPremium){
            alert('Sharing is a premium feature. Please upgrade to share your cover letter.')
            return
        }

        if (shareableUuid && shareUrl) {
            copyShareUrl();
            return;
        }

        setIsSharing(true);
        try {
            if (!documentId) {
                await handleSave();
                if (!documentId) {
                    alert('Please save the cover letter first before sharing.');
                    return;
                }
            }

            let uuid = shareableUuid;
            if (!uuid) {
                const response = await axiosInstance.post(`/api/cover-letters/share/${documentId}`);
                uuid = response.data.shareable_uuid;
                setShareableUuid(uuid);
            }

            const newShareUrl = `${window.location.origin}/share?uuid=${uuid}&cover-letter=true`;
            setShareUrl(newShareUrl);

            await navigator.clipboard.writeText(newShareUrl);
            setShowShareSuccess(true);
            setTimeout(() => setShowShareSuccess(false), 3000);
        } catch (error) {
            console.error('Share error:', error);
            alert('Failed to generate share link. Please try again.');
        } finally {
            setIsSharing(false);
        }
    };

    const handlePaymentSuccess = async () => {
        await refreshStatus();
        setShowPaymentCard(false);
        setTimeout(() => handleDownload(), 1000);
    };

    const copyShareUrl = async () => {
        if (shareUrl) {
            try {
                await navigator.clipboard.writeText(shareUrl);
                setShowShareSuccess(true);
                setTimeout(() => setShowShareSuccess(false), 2000);
            } catch (error) {
                console.error('Failed to copy to clipboard:', error);
                alert('Failed to copy URL to clipboard');
            }
        }
    };

    const handleTempCoverLetter = () => {
        if (typeof coverLetterId === 'string' && coverLetterId.startsWith('temp-')) {
            const tempId = coverLetterId.replace('temp-', '');
            const tempData = localStorage.getItem(`temp-cover-letter-${tempId}`);
            if (tempData) {
                try {
                    const parsedData = JSON.parse(tempData);
                    useCoverLetterStore.getState().updateFormData(parsedData);
                    return true;
                } catch (error) {
                    console.error('Failed to parse temp cover letter data:', error);
                }
            }
        }
        return false;
    };

    useEffect(() => {
        if (!coverLetterId || typeof coverLetterId !== 'string' || loading) return;

        if (coverLetterId.startsWith('temp-')) {
            handleTempCoverLetter();
            return;
        }

        if (!isNaN(Number(coverLetterId)) && user) {
            const coverLetterIdNum = Number(coverLetterId);
            setDocumentId(coverLetterIdNum);

            if (!hasData() && !hasLoadedOnce) {
                setHasLoadedOnce(true);
                loadCoverLetter(coverLetterIdNum).catch(err => {
                    console.error('Failed to load cover letter:', err);
                    if (err.response?.status === 401) redirectToAuth();
                });
            }
        } else if (!user && !loading) {
            redirectToAuth();
        }
    }, [coverLetterId, user, loading]);

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-100 via-gray-50 to-blue-50">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-8 w-8 sm:h-12 sm:w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
                    <p className="text-sm sm:text-base text-gray-700 font-medium">Loading...</p>
                </div>
            </div>
        );
    }

    if (!loading && !user) return null;

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-100 via-gray-50 to-blue-50 overflow-x-hidden">
            {/* Simplified Header */}
            <div className="bg-white shadow-sm print:hidden sticky top-0 z-20 border-b">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex items-center justify-between h-16">
                        <div className="flex items-center space-x-4">
                            <Link
                                href="/cover-letter"
                                className="flex items-center space-x-2 text-gray-600 hover:text-gray-800 transition-colors"
                            >
                                <ArrowLeft className="w-5 h-5" />
                                <span className="font-medium">Back to Dashboard</span>
                            </Link>
                        </div>

                        <div className="flex-1 text-center">
                            <h1 className="text-xl font-semibold text-gray-900">
                                {name}'s Cover Letter
                            </h1>
                        </div>

                        <div className="w-32"></div> {/* Spacer for balance */}
                    </div>
                </div>
            </div>

            {/* Action Buttons - Centered above PDF */}
            <div className="print:hidden py-6">
                <div className="max-w-4xl mx-auto px-4">
                    <div className="flex justify-center items-center space-x-6">
                        <Link
                            href={`/createcover-letter?coverLetterId=${coverLetterId}&edit=true`}
                            className="text-gray-700 hover:text-blue-600 font-medium transition-colors flex items-center space-x-2"
                        >
                            <Edit className="w-4 h-4" />
                            <span>Edit Cover Letter</span>
                        </Link>

                        <button
                            onClick={handleSave}
                            disabled={isSaving}
                            className="text-green-700 hover:text-green-800 font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
                        >
                            <Save className="w-4 h-4" />
                            <span>{isSaving ? 'Saving...' : 'Save Cover Letter'}</span>
                        </button>

                        <button
                            onClick={handleShare}
                            disabled={isSharing}
                            className="text-purple-700 hover:text-purple-800 font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
                        >
                            {showShareSuccess ? (
                                <CheckCircle className="w-4 h-4 text-green-600" />
                            ) : (
                                <Share className="w-4 h-4" />
                            )}
                            <span>
                                {isSharing ? 'Sharing...' : showShareSuccess ? 'Link Copied!' : 'Share Cover Letter'}
                            </span>
                        </button>

                        <button
                            onClick={handleDownload}
                            disabled={isDownloading}
                            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2 shadow-md"
                            title={(!user || !isPremium) ? 'Premium feature - Upgrade to download' : ''}
                        >
                            <Download className="w-4 h-4" />
                            <span>
                                {isDownloading ? 'Downloading...' : (!user || !isPremium) ? 'Upgrade to Download' : 'Download PDF'}
                            </span>
                        </button>
                    </div>
                </div>
            </div>

            {/* Cover Letter Content */}
            <div className="flex justify-center items-start pb-8 px-4">
                <div className="w-full mx-auto">
                    {/* Mobile view - smaller scale */}
                    <div className="block sm:hidden w-full">
                        <div
                            data-cover-letter-content
                            className="bg-white shadow-xl rounded-lg overflow-hidden mx-auto border"
                            style={{
                                width: '95vw',
                                maxWidth: '350px',
                                minHeight: '480px',
                                transform: 'scale(0.98)',
                                transformOrigin: 'top center'
                            }}
                        >
                            <div className="p-3 text-xs leading-tight">
                                <CoverLetterTemplate
                                    data={{
                                        name,
                                        email,
                                        phone,
                                        address,
                                        recipient_title,
                                        recipient_company,
                                        body,
                                        template_id: 1
                                    }}
                                    isPremium={isPremium}
                                    isPreview={true}
                                    size="small"
                                />
                            </div>
                        </div>
                    </div>

                    {/* Desktop view - A4 size */}
                    <div className="hidden sm:block max-w-4xl mx-auto">
                        <div
                            data-cover-letter-content
                            className="bg-white shadow-xl rounded-lg overflow-hidden mx-auto border"
                            style={{
                                maxWidth: '794px',
                                minHeight: '1123px',
                                width: '100%'
                            }}
                        >
                            <CoverLetterTemplate
                                data={{
                                    name,
                                    email,
                                    phone,
                                    address,
                                    recipient_title,
                                    recipient_company,
                                    body,
                                    template_id: 1
                                }}
                                isPremium={isPremium}
                                isPreview={true}
                                size="normal"
                            />
                        </div>
                    </div>
                </div>
            </div>

            {/* Payment Card Modal */}
            <PaymentCard
                isOpen={showPaymentCard}
                onClose={() => setShowPaymentCard(false)}
                onSuccess={handlePaymentSuccess}
                redirectAfterLogin={true}
            />
        </div>
    );
}

const CoverLetterPageWrapper = () => {
    return (
        <Suspense fallback={
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="animate-spin rounded-full h-8 w-8 border-2 border-blue-500 border-t-transparent"></div>
            </div>
        }>
            <CoverLetterPage />
        </Suspense>
    );
}

export default CoverLetterPageWrapper;