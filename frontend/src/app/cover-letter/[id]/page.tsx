'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useParams, useSearchParams, useRouter } from 'next/navigation';
import { useAuth } from '@/components/AuthContext';
import { useCoverLetterStore } from '@/store/coverLetterStore';
import { usePremiumStatus } from '@/hooks/usePremiumStatus';
import CoverLetterTemplate from '@/components/templates/CoverLetterTemplate';
import { ArrowLeft, Download, Save, Edit, Share, CheckCircle, Mail, Brain } from 'lucide-react';
import Link from 'next/link';
import axiosInstance from '@/lib/axios';
import { motion } from 'framer-motion';
import Navbar from '@/components/Navbar';

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

    const redirectToAuth = () => {
        const currentUrl = window.location.pathname + window.location.search;
        router.push(`/sign-in?callbackUrl=${encodeURIComponent(currentUrl)}`);
    };

    const redirectToPayment = () => {
        const currentUrl = window.location.pathname + window.location.search;
        router.push(`/payment?redirect=${encodeURIComponent(currentUrl)}`);
    };

    const download_url = process.env.NEXT_PUBLIC_API_KEY_DOWN || '';

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
            const response = await fetch(download_url, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    html: element.outerHTML,
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

        if (!user) {
            redirectToAuth();
            return;
        }

        await refreshStatus();

        if (!isPremium) {
            await saveCoverLetter();
            redirectToPayment();
            return;
        }

        setIsDownloading(true);
        try {
            let content = document.querySelector("[data-cover-letter-content]") as HTMLElement;

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

        if (!isPremium) {
            redirectToPayment();
            return;
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
            <div className="min-h-screen bg-slate-50 flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-8 w-8 border-2 border-blue-500 border-t-transparent mx-auto mb-4"></div>
                    <p className="text-gray-700 font-medium">Loading...</p>
                </div>
            </div>
        );
    }

    if (!loading && !user) return null;

    return (
        <div className="min-h-screen bg-slate-50">
            <Navbar />

            {/* Background Elements */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className="absolute top-20 left-10 w-96 h-96 bg-gradient-to-r from-blue-400/10 to-indigo-500/10 rounded-full mix-blend-multiply filter blur-3xl animate-pulse"></div>
                <div className="absolute top-40 right-10 w-80 h-80 bg-gradient-to-r from-purple-400/10 to-pink-500/10 rounded-full mix-blend-multiply filter blur-3xl animate-pulse delay-1000"></div>
                <div className="absolute bottom-20 left-1/2 w-72 h-72 bg-gradient-to-r from-emerald-400/10 to-teal-500/10 rounded-full mix-blend-multiply filter blur-3xl animate-pulse delay-2000"></div>
            </div>

            <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808008_1px,transparent_1px),linear-gradient(to_bottom,#80808008_1px,transparent_1px)] bg-[size:24px_24px] pointer-events-none"></div>

            <div className="relative container mx-auto px-4 py-6">

                {/* Action Buttons */}
                <motion.div
                    initial={{ y: 30, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ duration: 0.8, delay: 0.5 }}
                    className="mb-8"
                >
                    {/* Desktop Layout */}
                    <div className="hidden sm:flex justify-center items-center space-x-4">
                        <Link
                            href={`/cover-letter/create?coverLetterId=${coverLetterId}&edit=true`}
                            className="flex items-center space-x-2 px-4 py-2 bg-white/80 backdrop-blur-sm border border-gray-200 hover:border-blue-300 text-gray-700 hover:text-blue-700 rounded-lg transition-all shadow-sm hover:shadow-md"
                        >
                            <Edit className="w-4 h-4" />
                            <span>Edit</span>
                        </Link>

                        <button
                            onClick={handleSave}
                            disabled={isSaving}
                            className="flex items-center space-x-2 px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors disabled:opacity-50 shadow-sm"
                        >
                            <Save className="w-4 h-4" />
                            <span>{isSaving ? 'Saving...' : 'Save'}</span>
                        </button>

                        <button
                            onClick={handleShare}
                            disabled={isSharing}
                            className="flex items-center space-x-2 px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition-colors disabled:opacity-50 shadow-sm"
                        >
                            {showShareSuccess ? (
                                <CheckCircle className="w-4 h-4" />
                            ) : (
                                <Share className="w-4 h-4" />
                            )}
                            <span>
                                {isSharing ? 'Sharing...' : showShareSuccess ? 'Copied!' : 'Share'}
                            </span>
                        </button>

                        <button
                            onClick={handleDownload}
                            disabled={isDownloading}
                            className="flex items-center space-x-2 px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors disabled:opacity-50 shadow-lg font-medium"
                        >
                            <Download className="w-4 h-4" />
                            <span>
                                {isDownloading ? 'Downloading...' : (!user || !isPremium) ? 'Upgrade to Download' : 'Download PDF'}
                            </span>
                        </button>
                    </div>

                    {/* Mobile Layout */}
                    <div className="sm:hidden space-y-3">
                        <div className="flex space-x-2">
                            <Link
                                href={`/cover-letter/create?coverLetterId=${coverLetterId}&edit=true`}
                                className="flex-1 flex items-center justify-center space-x-2 px-3 py-2 bg-white/80 backdrop-blur-sm border border-gray-200 text-gray-700 rounded-lg shadow-sm"
                            >
                                <Edit className="w-4 h-4" />
                                <span>Edit</span>
                            </Link>

                            <button
                                onClick={handleSave}
                                disabled={isSaving}
                                className="flex-1 flex items-center justify-center space-x-2 px-3 py-2 bg-green-600 text-white rounded-lg disabled:opacity-50 shadow-sm"
                            >
                                <Save className="w-4 h-4" />
                                <span>{isSaving ? 'Saving...' : 'Save'}</span>
                            </button>
                        </div>

                        <div className="flex space-x-2">
                            <button
                                onClick={handleShare}
                                disabled={isSharing}
                                className="flex-1 flex items-center justify-center space-x-2 px-3 py-2 bg-purple-600 text-white rounded-lg disabled:opacity-50 shadow-sm"
                            >
                                {showShareSuccess ? (
                                    <CheckCircle className="w-4 h-4" />
                                ) : (
                                    <Share className="w-4 h-4" />
                                )}
                                <span>
                                    {isSharing ? 'Sharing...' : showShareSuccess ? 'Copied!' : 'Share'}
                                </span>
                            </button>

                            <button
                                onClick={handleDownload}
                                disabled={isDownloading}
                                className="flex-1 flex items-center justify-center space-x-2 px-3 py-2 bg-blue-600 text-white rounded-lg disabled:opacity-50 shadow-lg"
                            >
                                <Download className="w-4 h-4" />
                                <span>
                                    {isDownloading ? 'Downloading...' : (!user || !isPremium) ? 'Upgrade' : 'Download'}
                                </span>
                            </button>
                        </div>
                    </div>
                </motion.div>

                {/* Cover Letter Content */}
                <motion.div
                    initial={{ y: 30, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ duration: 0.8, delay: 0.7 }}
                    className="flex justify-center"
                >
                    <div className="w-full max-w-4xl">
                        {/* Mobile view */}
                        <div className="sm:hidden">
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

                        {/* Desktop view */}
                        <div className="hidden sm:block">
                            <div className="bg-white/90 backdrop-blur-sm rounded-xl shadow-xl border border-white/50 overflow-hidden max-w-[794px] mx-auto">
                                <div
                                    data-cover-letter-content
                                    className="w-full aspect-[210/297]"
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
                </motion.div>
            </div>
        </div>
    );
}

const CoverLetterPageWrapper = () => {
    return (
        <Suspense fallback={
            <div className="min-h-screen bg-slate-50 flex items-center justify-center">
                <div className="animate-spin rounded-full h-8 w-8 border-2 border-blue-500 border-t-transparent"></div>
            </div>
        }>
            <CoverLetterPage />
        </Suspense>
    );
}

export default CoverLetterPageWrapper;
