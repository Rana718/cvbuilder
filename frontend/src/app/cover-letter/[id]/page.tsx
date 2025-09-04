'use client';

import React, { useState, useEffect } from 'react';
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
        const [{ default: html2canvas }, { default: jsPDF }] = await Promise.all([
            import('html2canvas'),
            import('jspdf')
        ]);

        const clonedElement = element.cloneNode(true) as HTMLElement;
        const tempContainer = document.createElement('div');
        
        Object.assign(tempContainer.style, {
            position: 'absolute',
            left: '-9999px',
            top: '0',
            width: '794px',
            height: '1123px',
            backgroundColor: '#ffffff'
        });
        
        tempContainer.appendChild(clonedElement);
        document.body.appendChild(tempContainer);

        Object.assign(clonedElement.style, {
            width: '794px',
            height: '1123px',
            transform: 'scale(1)',
            margin: '0',
            padding: '20px',
            boxSizing: 'border-box'
        });

        await new Promise(resolve => setTimeout(resolve, 100));

        const canvas = await html2canvas(clonedElement, {
            scale: 2,
            useCORS: true,
            allowTaint: true,
            backgroundColor: '#ffffff',
            width: 794,
            height: 1123,
            scrollX: 0,
            scrollY: 0
        });

        document.body.removeChild(tempContainer);

        const imgData = canvas.toDataURL('image/png', 1.0);
        const pdf = new jsPDF({
            orientation: 'portrait',
            unit: 'mm',
            format: 'a4'
        });

        pdf.addImage(imgData, 'PNG', 0, 0, 210, 297);
        const filename = `${name || 'CoverLetter'}_${recipient_company || 'Document'}.pdf`.replace(/\s+/g, '_');
        pdf.save(filename);
    };

    const handleDownload = async () => {
        if (isDownloading) return;

        if (!user || !isPremium) {
            setShowPaymentCard(true);
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

        // If UUID already exists and shareUrl is set, just copy it
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
            {/* Header */}
            <div className="bg-white/95 backdrop-blur-sm border-b border-gray-200/50 print:hidden shadow-sm sticky top-0 z-20">
                <div className="max-w-7xl mx-auto px-2 sm:px-4 lg:px-8">
                    <div className="flex items-center justify-between h-12 sm:h-16">
                        <div className="flex items-center space-x-1 sm:space-x-4 min-w-0 flex-1">
                            <Link
                                href="/cover-letter"
                                className="flex items-center space-x-1 text-gray-600 hover:text-blue-600 transition-colors flex-shrink-0 p-1"
                            >
                                <ArrowLeft className="w-4 h-4" />
                                <span className="text-xs sm:text-sm hidden xs:inline">Back</span>
                            </Link>
                            <div className="h-3 w-px bg-gray-300 hidden sm:block" />
                            <h1 className="text-xs sm:text-lg font-semibold text-gray-900 truncate">
                                <span className="hidden lg:inline">{name}'s Cover Letter</span>
                                <span className="lg:hidden">{name || 'Cover Letter'}</span>
                            </h1>
                        </div>

                        <div className="flex items-center space-x-0.5 sm:space-x-2 flex-shrink-0">
                            <Link
                                href={`/createcover-letter?coverLetterId=${coverLetterId}&edit=true`}
                                className="flex items-center space-x-0.5 sm:space-x-1 px-1.5 sm:px-3 py-1 sm:py-2 text-xs text-gray-700 hover:text-blue-600 border border-gray-300 rounded hover:bg-blue-50 hover:border-blue-300 transition-all"
                            >
                                <Edit className="w-3 h-3 sm:w-4 sm:h-4" />
                                <span className="hidden sm:inline">Edit</span>
                            </Link>
                            
                            <button
                                onClick={handleSave}
                                disabled={isSaving}
                                className="flex items-center space-x-0.5 sm:space-x-1 px-1.5 sm:px-3 py-1 sm:py-2 text-xs text-green-700 hover:text-green-800 border border-green-300 rounded hover:bg-green-50 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                            >
                                <Save className="w-3 h-3 sm:w-4 sm:h-4" />
                                <span className="hidden sm:inline">{isSaving ? 'Saving...' : 'Save'}</span>
                            </button>
                            
                            <button
                                onClick={handleShare}
                                disabled={isSharing}
                                className="flex items-center space-x-0.5 sm:space-x-1 px-1.5 sm:px-3 py-1 sm:py-2 text-xs text-purple-700 hover:text-purple-800 border border-purple-300 rounded hover:bg-purple-50 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                            >
                                {showShareSuccess ? (
                                    <CheckCircle className="w-3 h-3 sm:w-4 sm:h-4 text-green-600" />
                                ) : (
                                    <Share className="w-3 h-3 sm:w-4 sm:h-4" />
                                )}
                                <span className="hidden sm:inline">
                                    {isSharing ? 'Sharing...' : showShareSuccess ? 'Copied!' : 'Share'}
                                </span>
                            </button>
                            
                            <button
                                onClick={handleDownload}
                                disabled={isDownloading}
                                className="flex items-center space-x-0.5 sm:space-x-1 px-1.5 sm:px-3 py-1 sm:py-2 text-xs bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded hover:from-blue-600 hover:to-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-md hover:shadow-lg"
                                title={(!user || !isPremium) ? 'Premium feature - Upgrade to download' : ''}
                            >
                                <Download className="w-3 h-3 sm:w-4 sm:h-4" />
                                <span className="hidden sm:inline">
                                    {isDownloading ? 'Downloading...' : (!user || !isPremium) ? 'Premium' : 'Download'}
                                </span>
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Cover Letter Content */}
            <div className="flex justify-center items-start min-h-[calc(100vh-3rem)] sm:min-h-[calc(100vh-4rem)] py-1 sm:py-4 px-1 sm:px-4">
                <div className="w-full mx-auto">
                    {/* Mobile view - smaller scale */}
                    <div className="block sm:hidden w-full">
                        <div
                            data-cover-letter-content
                            className="bg-white shadow-lg rounded-lg overflow-hidden mx-auto"
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
                            className="bg-white shadow-lg rounded-lg overflow-hidden mx-auto"
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

export default CoverLetterPage;