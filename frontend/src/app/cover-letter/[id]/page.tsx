'use client';

import React, { useState, useEffect } from 'react';
import { useParams, useSearchParams, useRouter } from 'next/navigation';
import { useAuth } from '@/components/AuthContext';
import { useCoverLetterStore } from '@/store/coverLetterStore';
import { usePremiumStatus } from '@/hooks/usePremiumStatus';
import CoverLetterTemplate from '@/components/templates/CoverLetterTemplate';
import { ArrowLeft, Download, Save, Edit, Share, Copy, CheckCircle, FileText } from 'lucide-react';
import Link from 'next/link';
import axiosInstance from '@/lib/axios';

function CoverLetterPage() {
    const params = useParams();
    const searchParams = useSearchParams();
    const router = useRouter();
    const { user, loading } = useAuth();
    const { isPremium } = usePremiumStatus();
    const coverLetterId = params.id;

    const {
        name,
        email,
        phone,
        address,
        recipient_company,
        recipient_title,
        body,
        setDocumentId,
        saveCoverLetter,
        loadCoverLetter,
        hasData,
        documentId,
        shareableUuid,
        setShareableUuid
    } = useCoverLetterStore();

    const [isSaving, setIsSaving] = useState(false);
    const [isDownloading, setIsDownloading] = useState(false);
    const [isSharing, setIsSharing] = useState(false);
    const [shareUrl, setShareUrl] = useState('');
    const [showShareSuccess, setShowShareSuccess] = useState(false);
    const [hasLoadedOnce, setHasLoadedOnce] = useState(false);

    const handleAuthRedirect = () => {
        const currentUrl = window.location.pathname + window.location.search;
        router.push(`/sign-in?callbackUrl=${encodeURIComponent(currentUrl)}`);
    };

    const handleSave = async () => {
        if (isSaving) return;

        if (!user) {
            handleAuthRedirect();
            return;
        }

        setIsSaving(true);
        try {
            if (coverLetterId && typeof coverLetterId === 'string' && !isNaN(Number(coverLetterId))) {
                setDocumentId(Number(coverLetterId));
            }
            await saveCoverLetter();
            alert('Cover letter saved successfully!');
        } catch (error: any) {
            console.error('Failed to save cover letter:', error);
            alert('Failed to save cover letter. Please try again.');
        } finally {
            setIsSaving(false);
        }
    };

    const handleDownload = async () => {
        if (isDownloading) return;

        // Check if user is premium for download
        if (!user || !isPremium) {
            alert('Download feature is only available for premium users. Please upgrade your account to download your cover letter.');
            return;
        }

        setIsDownloading(true);
        try {
            const coverLetterContent = document.querySelector("[data-cover-letter-content]") as HTMLElement;

            if (!coverLetterContent) {
                alert('Cover letter content not found. Please refresh and try again.');
                return;
            }

            // Try modern approach first, fallback to print if needed
            try {
                // Import libraries dynamically
                const [{ default: html2canvas }, { default: jsPDF }] = await Promise.all([
                    import('html2canvas'),
                    import('jspdf')
                ]);

                // Clone the element to avoid modifying the original
                const clonedElement = coverLetterContent.cloneNode(true) as HTMLElement;

                // Create a temporary container
                const tempContainer = document.createElement('div');
                tempContainer.style.position = 'absolute';
                tempContainer.style.left = '-9999px';
                tempContainer.style.top = '0';
                tempContainer.style.width = '794px';
                tempContainer.style.height = '1123px';
                tempContainer.style.backgroundColor = '#ffffff';
                tempContainer.appendChild(clonedElement);
                document.body.appendChild(tempContainer);

                // Set styles for PDF generation
                clonedElement.style.width = '794px';
                clonedElement.style.height = '1123px';
                clonedElement.style.transform = 'scale(1)';
                clonedElement.style.margin = '0';
                clonedElement.style.padding = '20px';
                clonedElement.style.boxSizing = 'border-box';

                // Wait a bit for styles to apply
                await new Promise(resolve => setTimeout(resolve, 100));

                // Capture the content
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

                // Remove temporary container
                document.body.removeChild(tempContainer);

                // Create PDF
                const imgData = canvas.toDataURL('image/png', 1.0);
                const pdf = new jsPDF({
                    orientation: 'portrait',
                    unit: 'mm',
                    format: 'a4'
                });

                pdf.addImage(imgData, 'PNG', 0, 0, 210, 297);

                // Generate filename
                const filename = `${name || 'CoverLetter'}_${recipient_company || 'Document'}.pdf`.replace(/\s+/g, '_');

                // Download
                pdf.save(filename);

            } catch (canvasError) {
                console.warn('Canvas method failed, using print fallback:', canvasError);

                // Fallback to print method
                const printWindow = window.open('', '_blank');
                if (printWindow) {
                    const styles = Array.from(document.styleSheets)
                        .map(styleSheet => {
                            try {
                                return Array.from(styleSheet.cssRules)
                                    .map(rule => rule.cssText)
                                    .join('\n');
                            } catch (e) {
                                return '';
                            }
                        })
                        .join('\n');

                    printWindow.document.write(`
                        <!DOCTYPE html>
                        <html>
                        <head>
                            <title>Cover Letter</title>
                            <style>
                                ${styles}
                                @media print {
                                    * { 
                                        -webkit-print-color-adjust: exact !important;
                                        color-adjust: exact !important;
                                        print-color-adjust: exact !important;
                                    }
                                    @page { 
                                        size: A4; 
                                        margin: 10mm; 
                                    }
                                    body { 
                                        margin: 0; 
                                        padding: 0; 
                                        font-family: system-ui, -apple-system, sans-serif;
                                    }
                                    [data-cover-letter-content] {
                                        width: 100% !important;
                                        max-width: 100% !important;
                                        margin: 0 !important;
                                        box-shadow: none !important;
                                        border: none !important;
                                    }
                                }
                            </style>
                        </head>
                        <body>
                            ${coverLetterContent.outerHTML}
                        </body>
                        </html>
                    `);

                    printWindow.document.close();

                    setTimeout(() => {
                        printWindow.print();
                        printWindow.close();
                    }, 500);
                } else {
                    throw new Error('Unable to open print dialog');
                }
            }

        } catch (error: any) {
            console.error("Download error:", error);
            alert(`Download failed: ${error.message || 'Please try again.'}`);
        } finally {
            setIsDownloading(false);
        }
    };

    const handleShare = async () => {
        if (isSharing) return;

        if (!user) {
            handleAuthRedirect();
            return;
        }

        setIsSharing(true);
        try {
            // Check if cover letter is saved first
            if (!documentId) {
                // Save the cover letter first
                await handleSave();
                if (!documentId) {
                    alert('Please save the cover letter first before sharing.');
                    return;
                }
            }

            let uuid = shareableUuid;

            // If no shareable UUID exists, generate one
            if (!uuid) {
                const response = await axiosInstance.post(`/api/cover-letters/share/${documentId}`);
                uuid = response.data.shareable_uuid;
                setShareableUuid(uuid);
            }

            // Create share URL
            const baseUrl = window.location.origin;
            const shareUrl = `${baseUrl}/share?uuid=${uuid}&cover-letter=true`;
            setShareUrl(shareUrl);

            // Copy to clipboard
            await navigator.clipboard.writeText(shareUrl);
            setShowShareSuccess(true);
            setTimeout(() => setShowShareSuccess(false), 3000);

        } catch (error: any) {
            console.error('Failed to generate share link:', error);
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
            }
        }
    };

    // Handle temp cover letters
    const handleTempCoverLetter = () => {
        if (typeof coverLetterId === 'string' && coverLetterId.startsWith('temp-')) {
            const tempId = coverLetterId.replace('temp-', '');
            const tempData = localStorage.getItem(`temp-cover-letter-${tempId}`);
            if (tempData) {
                try {
                    const parsedData = JSON.parse(tempData);
                    // Update the store with temp data
                    useCoverLetterStore.getState().updateFormData(parsedData);
                    return true;
                } catch (error) {
                    console.error('Failed to parse temp cover letter data:', error);
                }
            }
        }
        return false;
    };

    // Load cover letter data when component mounts
    useEffect(() => {
        if (!coverLetterId || typeof coverLetterId !== 'string') return;
        
        // Don't load if auth is still loading
        if (loading) return;

        // Handle temp cover letters
        if (coverLetterId.startsWith('temp-')) {
            handleTempCoverLetter();
            return;
        }

        // Handle regular cover letters - only if user is authenticated
        if (!isNaN(Number(coverLetterId)) && user) {
            const coverLetterIdNum = Number(coverLetterId);
            setDocumentId(coverLetterIdNum);

            // Check if we already have data in the store
            const hasExistingData = hasData();

            // If no data in store, try to load from server
            if (!hasExistingData && !hasLoadedOnce) {
                setHasLoadedOnce(true); // Set immediately to prevent multiple calls
                loadCoverLetter(coverLetterIdNum).catch(err => {
                    console.error('Failed to load cover letter from server:', err);
                    // If auth error, redirect to login
                    if (err.response?.status === 401) {
                        handleAuthRedirect();
                    }
                });
            }
        } else if (!user && !loading) {
            // If not authenticated and not loading, redirect
            handleAuthRedirect();
        }
    }, [coverLetterId, user, loading]); // Add user and loading as dependencies

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-100 via-gray-50 to-blue-50">
            {/* Header */}
            <div className="bg-white/90 backdrop-blur-sm border-b border-gray-200/50 print:hidden shadow-sm">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex items-center justify-between h-16">
                        <div className="flex items-center space-x-2 sm:space-x-4 min-w-0">
                            <Link
                                href="/cover-letter"
                                className="flex items-center space-x-2 text-gray-600 hover:text-blue-600 transition-colors flex-shrink-0"
                            >
                                <ArrowLeft className="w-4 h-4" />
                                <span className="hidden sm:inline">Back to Dashboard</span>
                                <span className="sm:hidden">Back</span>
                            </Link>
                            <div className="h-4 w-px bg-gray-300 hidden sm:block" />
                            <h1 className="text-sm sm:text-lg font-semibold text-gray-900 truncate">
                                <span className="hidden sm:inline">{name}'s Cover Letter</span>
                                <span className="sm:hidden">Cover Letter</span>
                            </h1>
                        </div>

                        <div className="flex items-center space-x-2 sm:space-x-3 flex-shrink-0">
                            <Link
                                href={`/createcover-letter?coverLetterId=${coverLetterId}&edit=true`}
                                className="flex items-center space-x-1 sm:space-x-2 px-2 sm:px-4 py-2 text-gray-700 hover:text-blue-600 border border-gray-300 rounded-lg hover:bg-blue-50 hover:border-blue-300 transition-all"
                            >
                                <Edit className="w-4 h-4" />
                                <span className="hidden sm:inline">Edit</span>
                            </Link>
                            <button
                                onClick={handleSave}
                                disabled={isSaving}
                                className="flex items-center space-x-1 sm:space-x-2 px-2 sm:px-4 py-2 text-green-700 hover:text-green-800 border border-green-300 rounded-lg hover:bg-green-50 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                            >
                                <Save className="w-4 h-4" />
                                <span className="hidden sm:inline">{isSaving ? 'Saving...' : 'Save'}</span>
                            </button>
                            <button
                                onClick={handleShare}
                                disabled={isSharing}
                                className="flex items-center space-x-1 sm:space-x-2 px-2 sm:px-4 py-2 text-purple-700 hover:text-purple-800 border border-purple-300 rounded-lg hover:bg-purple-50 disabled:opacity-50 disabled:cursor-not-allowed transition-all relative"
                            >
                                {showShareSuccess ? (
                                    <CheckCircle className="w-4 h-4 text-green-600" />
                                ) : (
                                    <Share className="w-4 h-4" />
                                )}
                                <span className="hidden sm:inline">
                                    {isSharing ? 'Sharing...' : showShareSuccess ? 'Copied!' : 'Share'}
                                </span>
                            </button>
                            <button
                                onClick={handleDownload}
                                disabled={isDownloading || (!user || !isPremium)}
                                className="flex items-center space-x-1 sm:space-x-2 px-2 sm:px-4 py-2 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-lg hover:from-blue-600 hover:to-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-md hover:shadow-lg"
                                title={(!user || !isPremium) ? 'Premium feature - Upgrade to download' : ''}
                            >
                                <Download className="w-4 h-4" />
                                <span className="hidden sm:inline">
                                    {isDownloading ? 'Downloading...' : (!user || !isPremium) ? 'Premium' : 'Download PDF'}
                                </span>
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Cover Letter Content */}
            <div className="flex justify-center items-start min-h-screen py-4 sm:py-8 px-2 sm:px-4">
                <div className="w-full max-w-4xl mx-auto">
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
    );
}

export default CoverLetterPage;
