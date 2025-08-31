'use client'

import React, { useState, useEffect } from 'react'
import { useParams, useSearchParams, useRouter } from 'next/navigation'
import { useAuth } from '@/components/AuthContext'
import { useResumeStore } from '@/store/resumeStore'
import ResumePreview from '@/components/ui/ResumePreview'
import { ArrowLeft, Download, Save, Edit } from 'lucide-react'
import Link from 'next/link'

function ResumePage() {
    const params = useParams()
    const searchParams = useSearchParams()
    const router = useRouter()
    const { user, loading } = useAuth()
    const templateId = searchParams.get('template')
    const resumeId = params.id

    const {
        personalInfo,
        workExperience,
        skills,
        summary,
        setDocumentId,
        saveResume,
        loadResume
    } = useResumeStore()

    const [isSaving, setIsSaving] = useState(false)
    const [isDownloading, setIsDownloading] = useState(false)

    const handleAuthRedirect = () => {
        const currentUrl = window.location.pathname + window.location.search
        router.push(`/sign-in?callbackUrl=${encodeURIComponent(currentUrl)}`)
    }

    const handleSave = async () => {
        if (isSaving) return

        if (!user) {
            handleAuthRedirect()
            return
        }

        setIsSaving(true)
        try {
            if (resumeId && typeof resumeId === 'string' && !isNaN(Number(resumeId))) {
                setDocumentId(Number(resumeId))
            }
            await saveResume()
            alert('Resume saved successfully!')
        } catch (error: any) {
            console.error('Failed to save resume:', error)
            alert('Failed to save resume. Please try again.')
        } finally {
            setIsSaving(false)
        }
    }

    const handleDownload = async () => {
        if (isDownloading) return

        setIsDownloading(true)
        try {
            const resumeContent = document.querySelector("[data-resume-content]") as HTMLElement
            
            if (resumeContent) {
                // Create a new window for printing
                const printWindow = window.open('', '_blank')
                if (printWindow) {
                    // Get all stylesheets from current page
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
                                        margin: 0; 
                                    }
                                    body { 
                                        margin: 0; 
                                        padding: 0; 
                                    }
                                    [data-resume-content] {
                                        width: 100% !important;
                                        max-width: 100% !important;
                                        margin: 0 !important;
                                        box-shadow: none !important;
                                        border: none !important;
                                        aspect-ratio: 210/297 !important;
                                    }
                                }
                            </style>
                        </head>
                        <body>
                            ${resumeContent.outerHTML}
                        </body>
                        </html>
                    `)
                    
                    printWindow.document.close()
                    
                    // Wait for content to load then print
                    setTimeout(() => {
                        printWindow.print()
                        printWindow.close()
                    }, 500)
                }
            } else {
                alert('Resume content not found. Please refresh and try again.')
            }
        } catch (error: any) {
            console.error("Download error:", error)
            alert("Download failed. Please try again.")
        } finally {
            setIsDownloading(false)
        }
    }

    // Load resume data when component mounts
    useEffect(() => {
        if (!resumeId || typeof resumeId !== 'string' || isNaN(Number(resumeId))) return

        const resumeIdNum = Number(resumeId)
        setDocumentId(resumeIdNum)

        const shouldFetch = () => {
            const noPersonal = !(personalInfo.firstName || personalInfo.lastName || summary)
            const noWork = !workExperience || workExperience.length === 0
            const noSkills = !skills || skills.length === 0
            return (noPersonal && noWork && noSkills)
        }

        if (shouldFetch()) {
            loadResume(resumeIdNum).catch(err => {
                console.error('Failed to load resume from server:', err)
            })
        }
    }, [resumeId, setDocumentId, loadResume])

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Header */}
            <div className="bg-white border-b border-gray-200 print:hidden">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex items-center justify-between h-16">
                        <div className="flex items-center space-x-4">
                            <Link
                                href="/dashboard"
                                className="flex items-center space-x-2 text-gray-600 hover:text-gray-900 transition-colors"
                            >
                                <ArrowLeft className="w-4 h-4" />
                                <span>Back to Dashboard</span>
                            </Link>
                            <div className="h-4 w-px bg-gray-300" />
                            <h1 className="text-lg font-semibold text-gray-900">
                                {personalInfo.firstName} {personalInfo.lastName}'s Resume
                            </h1>
                        </div>

                        <div className="flex items-center space-x-3">
                            <Link
                                href={`/template/${templateId}?resumeId=${resumeId}`}
                                className="flex items-center space-x-2 px-4 py-2 text-gray-700 hover:text-gray-900 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                            >
                                <Edit className="w-4 h-4" />
                                <span>Edit</span>
                            </Link>
                            <button
                                onClick={handleSave}
                                disabled={isSaving}
                                className="flex items-center space-x-2 px-4 py-2 text-green-700 hover:text-green-800 border border-green-300 rounded-lg hover:bg-green-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                            >
                                <Save className="w-4 h-4" />
                                <span>{isSaving ? 'Saving...' : 'Save'}</span>
                            </button>
                            <button
                                onClick={handleDownload}
                                disabled={isDownloading}
                                className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                            >
                                <Download className="w-4 h-4" />
                                <span>{isDownloading ? 'Downloading...' : 'Download PDF'}</span>
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Resume Content */}
            <div className="max-w-5xl mx-auto p-4">
                <div className="rounded-lg shadow-lg">
                    <ResumePreview />
                </div>
            </div>
        </div>
    )
}

export default ResumePage
