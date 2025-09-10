'use client'

import React, { useState, useEffect, Suspense } from 'react'
import { useParams, useSearchParams, useRouter } from 'next/navigation'
import { useAuth } from '@/components/AuthContext'
import { useResumeStore } from '@/store/resumeStore'
import { usePremiumStatus } from '@/hooks/usePremiumStatus'
import ResumePreview from '@/components/ui/ResumePreview'
import PaymentCard from '@/components/PaymentCard'
import { ArrowLeft, Download, Save, Edit, Share, CheckCircle } from 'lucide-react'
import Link from 'next/link'
import axiosInstance from '@/lib/axios'

function ResumePage() {
    const params = useParams()
    const searchParams = useSearchParams()
    const router = useRouter()
    const { user, loading } = useAuth()
    const { isPremium, refreshStatus } = usePremiumStatus()
    const templateId = searchParams.get('template')
    const resumeId = params.id

    const {
        personalInfo, setDocumentId, saveResume, loadResume, hasData, documentId,
        shareableUuid, setShareableUuid
    } = useResumeStore()

    const [isSaving, setIsSaving] = useState(false)
    const [isDownloading, setIsDownloading] = useState(false)
    const [isSharing, setIsSharing] = useState(false)
    const [shareUrl, setShareUrl] = useState('')
    const [showShareSuccess, setShowShareSuccess] = useState(false)
    const [hasLoadedOnce, setHasLoadedOnce] = useState(false)
    const [showPaymentCard, setShowPaymentCard] = useState(false)

    const redirectToAuth = () => {
        const currentUrl = window.location.pathname + window.location.search
        router.push(`/sign-in?callbackUrl=${encodeURIComponent(currentUrl)}`)
    }

    const handleSave = async () => {
        if (isSaving || !user) {
            if (!user) redirectToAuth()
            return
        }

        setIsSaving(true)
        try {
            if (resumeId && typeof resumeId === 'string' && !isNaN(Number(resumeId))) {
                setDocumentId(Number(resumeId))
            }
            await saveResume()
            alert('Resume saved successfully!')
        } catch (error) {
            console.error('Save error:', error)
            alert('Failed to save resume. Please try again.')
        } finally {
            setIsSaving(false)
        }
    }

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
            const filename = `${personalInfo.firstName || 'Resume'}_${personalInfo.lastName || 'Document'}.pdf`.replace(/\s+/g, '_');
            link.download = filename;
            link.click();
            window.URL.revokeObjectURL(url);
        } catch (error) {
            console.error("PDF generation error:", error);
            throw error;
        }
    }

    const handleDownload = async () => {
        if (isDownloading) return

        if (!user || !isPremium) {
            setShowPaymentCard(true)
            return
        }

        setIsDownloading(true)
        try {
            // Look for resume content using the data attribute
            let resumeContent = document.querySelector("[data-resume-content]") as HTMLElement
            
            if (!resumeContent) {
                alert('Resume content not found. Please refresh and try again.')
                return
            }

            await generatePDF(resumeContent)
        } catch (error: any) {
            console.error("Download error:", error)
            alert(`Download failed: ${error.message || 'Please try again.'}`)
        } finally {
            setIsDownloading(false)
        }
    }

    const copyShareUrl = async () => {
        if (shareUrl) {
            try {
                await navigator.clipboard.writeText(shareUrl)
                setShowShareSuccess(true)
                setTimeout(() => setShowShareSuccess(false), 2000)
            } catch (error) {
                console.error('Failed to copy to clipboard:', error)
                alert('Failed to copy URL to clipboard')
            }
        }
    }

    const handleShare = async () => {
        if (isSharing || !user) {
            if (!user) redirectToAuth()
            return
        }

        if (shareableUuid && shareUrl) {
            copyShareUrl()
            return
        }

        setIsSharing(true)
        try {
            if (!documentId) {
                await handleSave()
                if (!documentId) {
                    alert('Please save the resume first before sharing.')
                    return
                }
            }

            let uuid = shareableUuid
            if (!uuid) {
                const response = await axiosInstance.post(`/api/resume-op/share/${documentId}`)
                uuid = response.data.shareable_uuid
                setShareableUuid(uuid)
            }

            const newShareUrl = `${window.location.origin}/share?uuid=${uuid}&template=${templateId}&resume=true`
            setShareUrl(newShareUrl)

            await navigator.clipboard.writeText(newShareUrl)
            setShowShareSuccess(true)
            setTimeout(() => setShowShareSuccess(false), 3000)
        } catch (error) {
            console.error('Share error:', error)
            alert('Failed to generate share link. Please try again.')
        } finally {
            setIsSharing(false)
        }
    }

    const handlePaymentSuccess = async () => {
        await refreshStatus()
        setShowPaymentCard(false)
        setTimeout(() => handleDownload(), 1000)
    }

    useEffect(() => {
        if (!resumeId || typeof resumeId !== 'string' || isNaN(Number(resumeId)) || loading) return

        if (!user) {
            redirectToAuth()
            return
        }

        const resumeIdNum = Number(resumeId)
        setDocumentId(resumeIdNum)

        if (!hasData() && !hasLoadedOnce) {
            setHasLoadedOnce(true)
            loadResume(resumeIdNum).catch(err => {
                console.error('Failed to load resume:', err)
                if (err.response?.status === 401) redirectToAuth()
            })
        }
    }, [resumeId, loading, user, router])

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-100 via-gray-50 to-blue-50">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-8 w-8 sm:h-12 sm:w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
                    <p className="text-sm sm:text-base text-gray-700 font-medium">Loading...</p>
                </div>
            </div>
        )
    }

    if (!loading && !user) return null

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-100 via-gray-50 to-blue-50 overflow-x-hidden">
            {/* Simplified Header */}
            <div className="bg-white shadow-sm print:hidden sticky top-0 z-20 border-b">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex items-center justify-between h-16">
                        <div className="flex items-center space-x-4">
                            <Link
                                href="/resusme"
                                className="flex items-center space-x-2 text-gray-600 hover:text-gray-800 transition-colors"
                            >
                                <ArrowLeft className="w-5 h-5" />
                                <span className="font-medium">Back to Dashboard</span>
                            </Link>
                        </div>

                        <div className="flex-1 text-center">
                            <h1 className="text-xl font-semibold text-gray-900">
                                {personalInfo.firstName} {personalInfo.lastName}'s Resume
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
                            href={`/template/${templateId}?resumeId=${resumeId}`}
                            className="text-gray-700 hover:text-blue-600 font-medium transition-colors flex items-center space-x-2"
                        >
                            <Edit className="w-4 h-4" />
                            <span>Edit Resume</span>
                        </Link>

                        <button
                            onClick={handleSave}
                            disabled={isSaving}
                            className="text-green-700 hover:text-green-800 font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
                        >
                            <Save className="w-4 h-4" />
                            <span>{isSaving ? 'Saving...' : 'Save Resume'}</span>
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
                                {isSharing ? 'Sharing...' : showShareSuccess ? 'Link Copied!' : 'Share Resume'}
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

            {/* Resume Content */}
            <div className="flex justify-center items-start pb-8 px-4">
                <div className="w-full mx-auto">
                    {/* Mobile view - smaller scale */}
                    <div className="block sm:hidden w-full">
                        <div
                            className="mx-auto bg-white shadow-xl rounded-lg overflow-hidden border"
                            style={{
                                aspectRatio: '210/297', // A4 ratio
                                width: '95vw',
                                maxWidth: '350px',
                                transform: 'scale(0.98)',
                                transformOrigin: 'top center'
                            }}
                            data-resume-content
                        >
                            <ResumePreview mode="live" />
                        </div>
                    </div>

                    {/* Desktop view - A4 size */}
                    <div className="hidden sm:block max-w-4xl mx-auto">
                        <div
                            className="mx-auto bg-white shadow-xl rounded-lg overflow-hidden border"
                            style={{
                                aspectRatio: '210/297', // A4 ratio
                                width: '100%',
                                maxWidth: '794px'
                            }}
                            data-resume-content
                        >
                            <ResumePreview />
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
    )
}

const ResumePageWrapper = () => {
    return (
        <Suspense fallback={
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="animate-spin rounded-full h-8 w-8 border-2 border-blue-500 border-t-transparent"></div>
            </div>
        }>
            <ResumePage />
        </Suspense>
    )
}

export default ResumePageWrapper