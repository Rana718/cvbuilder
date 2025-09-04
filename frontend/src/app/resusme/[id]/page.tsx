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
        const [{ default: html2canvas }, { default: jsPDF }] = await Promise.all([
            import('html2canvas'),
            import('jspdf')
        ])

        const clonedElement = element.cloneNode(true) as HTMLElement
        const tempContainer = document.createElement('div')

        Object.assign(tempContainer.style, {
            position: 'absolute',
            left: '-9999px',
            top: '0',
            width: '794px',
            height: '1123px',
            backgroundColor: '#ffffff'
        })

        tempContainer.appendChild(clonedElement)
        document.body.appendChild(tempContainer)

        Object.assign(clonedElement.style, {
            width: '794px',
            height: '1123px',
            transform: 'scale(1)',
            margin: '0',
            padding: '20px',
            boxSizing: 'border-box'
        })

        await new Promise(resolve => setTimeout(resolve, 100))

        const canvas = await html2canvas(clonedElement, {
            scale: 2,
            useCORS: true,
            allowTaint: true,
            backgroundColor: '#ffffff',
            width: 794,
            height: 1123,
            scrollX: 0,
            scrollY: 0
        })

        document.body.removeChild(tempContainer)

        const imgData = canvas.toDataURL('image/png', 1.0)
        const pdf = new jsPDF({
            orientation: 'portrait',
            unit: 'mm',
            format: 'a4'
        })

        pdf.addImage(imgData, 'PNG', 0, 0, 210, 297)
        const filename = `${personalInfo.firstName || 'Resume'}_${personalInfo.lastName || 'Document'}.pdf`.replace(/\s+/g, '_')
        pdf.save(filename)
    }

    const printFallback = (content: HTMLElement) => {
        const printWindow = window.open('', '_blank')
        if (!printWindow) throw new Error('Unable to open print dialog')

        const styles = Array.from(document.styleSheets)
            .map(styleSheet => {
                try {
                    return Array.from(styleSheet.cssRules)
                        .map(rule => rule.cssText)
                        .join('\n')
                } catch (e) {
                    return ''
                }
            })
            .join('\n')

        printWindow.document.write(`
            <!DOCTYPE html>
            <html>
            <head>
                <title>Resume</title>
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
                        [data-resume-content] {
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
                ${content.outerHTML}
            </body>
            </html>
        `)

        printWindow.document.close()
        setTimeout(() => {
            printWindow.print()
            printWindow.close()
        }, 500)
    }

    const handleDownload = async () => {
        if (isDownloading) return

        if (!user || !isPremium) {
            setShowPaymentCard(true)
            return
        }

        setIsDownloading(true)
        try {
            // Always try to get the desktop version first, then fallback to mobile
            let resumeContent = document.querySelector(".hidden.sm\\:block [data-resume-content]") as HTMLElement
            if (!resumeContent) {
                resumeContent = document.querySelector("[data-resume-content]") as HTMLElement
            }
            
            if (!resumeContent) {
                alert('Resume content not found. Please refresh and try again.')
                return
            }

            try {
                await generatePDF(resumeContent)
            } catch (canvasError) {
                console.warn('Canvas method failed, using print fallback:', canvasError)
                printFallback(resumeContent)
            }
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

        // If UUID already exists and shareUrl is set, just copy it
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
            {/* Header */}
            <div className="bg-white/95 backdrop-blur-sm border-b border-gray-200/50 print:hidden shadow-sm sticky top-0 z-20">
                <div className="max-w-7xl mx-auto px-2 sm:px-4 lg:px-8">
                    <div className="flex items-center justify-between h-12 sm:h-16">
                        <div className="flex items-center space-x-1 sm:space-x-4 min-w-0 flex-1">
                            <Link
                                href="/resusme"
                                className="flex items-center space-x-1 text-gray-600 hover:text-blue-600 transition-colors flex-shrink-0 p-1"
                            >
                                <ArrowLeft className="w-4 h-4" />
                                <span className="text-xs sm:text-sm hidden xs:inline">Back</span>
                            </Link>
                            <div className="h-3 w-px bg-gray-300 hidden sm:block" />
                            <h1 className="text-xs sm:text-lg font-semibold text-gray-900 truncate">
                                <span className="hidden lg:inline">{personalInfo.firstName} {personalInfo.lastName}'s Resume</span>
                                <span className="lg:hidden">{personalInfo.firstName || 'Resume'}</span>
                            </h1>
                        </div>

                        <div className="flex items-center space-x-0.5 sm:space-x-2 flex-shrink-0">
                            <Link
                                href={`/template/${templateId}?resumeId=${resumeId}`}
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

            {/* Resume Content */}
            <div className="flex justify-center items-start min-h-[calc(100vh-3rem)] sm:min-h-[calc(100vh-4rem)] py-1 sm:py-4 px-1 sm:px-4">
                <div className="w-full mx-auto">
                    {/* Mobile view - smaller scale */}
                    <div className="block sm:hidden w-full">
                        <div 
                            className="mx-auto bg-white shadow-lg rounded-lg overflow-hidden"
                            style={{ 
                                width: '95vw',
                                maxWidth: '350px',
                                minHeight: '480px',
                                transform: 'scale(0.98)',
                                transformOrigin: 'top center'
                            }}
                            data-resume-content
                        >
                            <div className="p-3 text-xs leading-tight">
                                <ResumePreview />
                            </div>
                        </div>
                    </div>
                    
                    {/* Desktop view - A4 size */}
                    <div className="hidden sm:block max-w-4xl mx-auto">
                        <div 
                            className="mx-auto bg-white shadow-lg rounded-lg overflow-hidden"
                            style={{ 
                                maxWidth: '794px', 
                                minHeight: '1123px',
                                width: '100%'
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