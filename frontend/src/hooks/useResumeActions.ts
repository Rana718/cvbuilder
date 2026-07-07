import { useState, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { showAlert } from '@/components/ui/alert-utils'
import { useResumeStore } from '@/store/resumeStore'
import { CV_TEMPLATES } from '@/constants/templates'
import axiosInstance from '@/lib/axios'
import ResumePreview from '@/components/ui/ResumePreview'
import React from 'react'

export const useResumeActions = (
    user: any,
    isPremium: boolean,
    templateId: string | null,
    refreshStatus: () => Promise<void>
) => {
    const router = useRouter()
    const { personalInfo, saveResume, documentId, shareableUuid, setShareableUuid, setDocumentId } = useResumeStore()
    const [isSaving, setIsSaving] = useState(false)
    const [isDownloading, setIsDownloading] = useState(false)
    const [isSharing, setIsSharing] = useState(false)
    const [shareUrl, setShareUrl] = useState('')
    const [showShareSuccess, setShowShareSuccess] = useState(false)

    const download_url = process.env.NEXT_PUBLIC_API_KEY_DOWN || ''

    const redirectToAuth = useCallback(() => {
        const currentUrl = window.location.pathname + window.location.search
        router.push(`/sign-in?callbackUrl=${encodeURIComponent(currentUrl)}`)
    }, [router])

    const redirectToPayment = useCallback(() => {
        const currentUrl = window.location.pathname + window.location.search
        router.push(`/payment?redirect=${encodeURIComponent(currentUrl)}`)
    }, [router])

    const handleSave = useCallback(async (resumeId?: string | string[]) => {
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
            showAlert('Resume saved successfully!')
        } catch (error) {
            console.error('Save error:', error)
            showAlert('Failed to save resume. Please try again.')
        } finally {
            setIsSaving(false)
        }
    }, [isSaving, user, saveResume, setDocumentId, redirectToAuth])

    const generatePDF = useCallback(async () => {
        const currentTemplate = CV_TEMPLATES.find(t => t.id === Number(templateId))
        const isFreeTemplate = currentTemplate?.isFree || false
        
        let resumeContent = document.querySelector("[data-resume-content]") as HTMLElement
        let shouldCleanup = false
        let root: any = null
        let tempContainer: HTMLElement | null = null

        if (!resumeContent) {
            tempContainer = document.createElement('div')
            tempContainer.style.position = 'absolute'
            tempContainer.style.top = '-9999px'
            tempContainer.style.left = '-9999px'
            tempContainer.style.width = '210mm'
            tempContainer.style.height = 'auto'
            tempContainer.style.visibility = 'hidden'
            document.body.appendChild(tempContainer)

            const { createRoot } = await import('react-dom/client')
            root = createRoot(tempContainer)
            
            await new Promise<void>((resolve) => {
                root.render(
                    React.createElement(ResumePreview, {
                        forPDF: true,
                        pass: isPremium,
                        isFree: isFreeTemplate
                    })
                )
                setTimeout(resolve, 2000)
            })

            resumeContent = tempContainer.querySelector("[data-resume-content]") as HTMLElement
            shouldCleanup = true
        }

        if (!resumeContent) {
            if (shouldCleanup && root && tempContainer) {
                root.unmount()
                document.body.removeChild(tempContainer)
            }
            showAlert('Resume content not found. Please refresh and try again.')
            return
        }

        const clonedContent = resumeContent.cloneNode(true) as HTMLElement
        
        if (isPremium && !isFreeTemplate) {
            const watermarks = clonedContent.querySelectorAll('.watermark-element, [data-watermark="true"], [class*="watermark"]')
            watermarks.forEach(watermark => watermark.remove())
        }

        clonedContent.style.position = 'static'
        clonedContent.style.margin = '0'
        clonedContent.style.padding = '0'
        clonedContent.style.width = '210mm'
        clonedContent.style.minHeight = 'auto'
        clonedContent.style.background = 'white'
        
        const allPages = clonedContent.querySelectorAll('[data-page], .page, .resume-page, [class*="page"]')
        allPages.forEach((page: any) => {
            page.style.display = 'block'
            page.style.visibility = 'visible'
            page.style.opacity = '1'
            page.style.pageBreakAfter = 'always'
            page.style.pageBreakInside = 'avoid'
            page.style.width = '210mm'
            page.style.minHeight = '297mm'
        })
        
        if (allPages.length > 0) {
            (allPages[allPages.length - 1] as any).style.pageBreakAfter = 'auto'
        }

        const response = await fetch(download_url, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ html: clonedContent.outerHTML }),
        })

        if (shouldCleanup && root && tempContainer) {
            root.unmount()
            document.body.removeChild(tempContainer)
        }

        if (!response.ok) {
            throw new Error(`PDF generation failed: ${response.statusText}`)
        }

        const blob = await response.blob()
        const url = window.URL.createObjectURL(blob)
        const link = document.createElement("a")
        link.href = url
        const filename = `${personalInfo.firstName || 'Resume'}_${personalInfo.lastName || 'Document'}.pdf`.replace(/\s+/g, '_')
        link.download = filename
        link.click()
        window.URL.revokeObjectURL(url)
    }, [templateId, isPremium, personalInfo, download_url])

    const handleDownload = useCallback(async () => {
        if (isDownloading) return

        if (!user) {
            redirectToAuth()
            return
        }

        await refreshStatus()

        
        let savedBeforeDownload = false
        if (user) {
            try {
                await saveResume()
                savedBeforeDownload = true
            } catch (saveError) {
                console.error('Auto-save before download failed:', saveError)
            }
        }

        const currentTemplate = CV_TEMPLATES.find(t => t.id === Number(templateId))
        const isFreeTemplate = currentTemplate?.isFree || false

        if (!isPremium && !isFreeTemplate) {
            if (!savedBeforeDownload) {
                try {
                    await saveResume()
                } catch (saveError) {
                    console.error('Save before payment redirect failed:', saveError)
                }
            }
            redirectToPayment()
            return
        }

        setIsDownloading(true)
        try {
            await generatePDF()
            
            if (isPremium && !isFreeTemplate) {
                try {
                    const response = await axiosInstance.post('/api/downloads/track-download')
                    const trackResult = response.data
                    await refreshStatus()
                    
                    if (trackResult.plan_expired) {
                        showAlert('This was your last download. Your plan has expired. Please upgrade to continue.')
                    } else if (trackResult.remaining_downloads !== null && trackResult.remaining_downloads <= 2) {
                        showAlert(`Download successful! You have ${trackResult.remaining_downloads} downloads remaining.`)
                    }
                } catch (trackError) {
                    console.error("Download tracking error:", trackError)
                }
            }
        } catch (error: any) {
            console.error("Download error:", error)
            showAlert(`Download failed: ${error.message || 'Please try again.'}`)
        } finally {
            setIsDownloading(false)
        }
    }, [isDownloading, user, isPremium, templateId, generatePDF, saveResume, refreshStatus, redirectToAuth, redirectToPayment])

    const copyShareUrl = useCallback(async () => {
        if (shareUrl) {
            try {
                await navigator.clipboard.writeText(shareUrl)
                setShowShareSuccess(true)
                setTimeout(() => setShowShareSuccess(false), 2000)
            } catch (error) {
                console.error('Failed to copy to clipboard:', error)
                showAlert('Failed to copy URL to clipboard')
            }
        }
    }, [shareUrl])

    const handleShare = useCallback(async () => {
        if (isSharing || !user) {
            if (!user) redirectToAuth()
            return
        }

        if (!isPremium) {
            showAlert('Sharing is a premium feature. Please upgrade to share your resume.')
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
                    showAlert('Please save the resume first before sharing.')
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
            showAlert('Failed to generate share link. Please try again.')
        } finally {
            setIsSharing(false)
        }
    }, [isSharing, user, isPremium, documentId, shareableUuid, shareUrl, templateId, handleSave, copyShareUrl, setShareableUuid, redirectToAuth])

    return {
        isSaving,
        isDownloading,
        isSharing,
        shareUrl,
        showShareSuccess,
        handleSave,
        handleDownload,
        handleShare
    }
}
