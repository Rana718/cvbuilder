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
        education,
        setDocumentId,
        saveResume,
        loadResume,
        hasData
    } = useResumeStore()

    const [isSaving, setIsSaving] = useState(false)
    const [isDownloading, setIsDownloading] = useState(false)
    const [hasLoadedOnce, setHasLoadedOnce] = useState(false)

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
            
            if (!resumeContent) {
                alert('Resume content not found. Please refresh and try again.')
                return
            }

            // Try modern approach first, fallback to print if needed
            try {
                // Import libraries dynamically
                const [{ default: html2canvas }, { default: jsPDF }] = await Promise.all([
                    import('html2canvas'),
                    import('jspdf')
                ])

                // Clone the element to avoid modifying the original
                const clonedElement = resumeContent.cloneNode(true) as HTMLElement
                
                // Create a temporary container
                const tempContainer = document.createElement('div')
                tempContainer.style.position = 'absolute'
                tempContainer.style.left = '-9999px'
                tempContainer.style.top = '0'
                tempContainer.style.width = '794px'
                tempContainer.style.height = '1123px'
                tempContainer.style.backgroundColor = '#ffffff'
                tempContainer.appendChild(clonedElement)
                document.body.appendChild(tempContainer)

                // Set styles for PDF generation
                clonedElement.style.width = '794px'
                clonedElement.style.height = '1123px'
                clonedElement.style.transform = 'scale(1)'
                clonedElement.style.margin = '0'
                clonedElement.style.padding = '20px'
                clonedElement.style.boxSizing = 'border-box'

                // Wait a bit for styles to apply
                await new Promise(resolve => setTimeout(resolve, 100))

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
                })

                // Remove temporary container
                document.body.removeChild(tempContainer)

                // Create PDF
                const imgData = canvas.toDataURL('image/png', 1.0)
                const pdf = new jsPDF({
                    orientation: 'portrait',
                    unit: 'mm',
                    format: 'a4'
                })

                pdf.addImage(imgData, 'PNG', 0, 0, 210, 297)

                // Generate filename
                const filename = `${personalInfo.firstName || 'Resume'}_${personalInfo.lastName || 'Document'}.pdf`.replace(/\s+/g, '_')

                // Download
                pdf.save(filename)

            } catch (canvasError) {
                console.warn('Canvas method failed, using print fallback:', canvasError)
                
                // Fallback to print method
                const printWindow = window.open('', '_blank')
                if (printWindow) {
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
                            ${resumeContent.outerHTML}
                        </body>
                        </html>
                    `)
                    
                    printWindow.document.close()
                    
                    setTimeout(() => {
                        printWindow.print()
                        printWindow.close()
                    }, 500)
                } else {
                    throw new Error('Unable to open print dialog')
                }
            }

        } catch (error: any) {
            console.error("Download error:", error)
            alert(`Download failed: ${error.message || 'Please try again.'}`)
        } finally {
            setIsDownloading(false)
        }
    }

    // Load resume data when component mounts
    useEffect(() => {
        if (!resumeId || typeof resumeId !== 'string' || isNaN(Number(resumeId))) return

        const resumeIdNum = Number(resumeId)
        setDocumentId(resumeIdNum)

        // Check if we already have data in the store
        const hasExistingData = hasData()
        
        // If no data in store, try to load from server
        if (!hasExistingData && !hasLoadedOnce) {
            setHasLoadedOnce(true) // Set immediately to prevent multiple calls
            loadResume(resumeIdNum).catch(err => {
                console.error('Failed to load resume from server:', err)
            })
        }
    }, [resumeId]) // Minimal dependencies to prevent re-runs

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-100 via-gray-50 to-blue-50">
            {/* Header */}
            <div className="bg-white/90 backdrop-blur-sm border-b border-gray-200/50 print:hidden shadow-sm">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex items-center justify-between h-16">
                        <div className="flex items-center space-x-2 sm:space-x-4 min-w-0">
                            <Link
                                href="/resusme"
                                className="flex items-center space-x-2 text-gray-600 hover:text-blue-600 transition-colors flex-shrink-0"
                            >
                                <ArrowLeft className="w-4 h-4" />
                                <span className="hidden sm:inline">Back to Dashboard</span>
                                <span className="sm:hidden">Back</span>
                            </Link>
                            <div className="h-4 w-px bg-gray-300 hidden sm:block" />
                            <h1 className="text-sm sm:text-lg font-semibold text-gray-900 truncate">
                                <span className="hidden sm:inline">{personalInfo.firstName} {personalInfo.lastName}'s Resume</span>
                                <span className="sm:hidden">Resume</span>
                            </h1>
                        </div>

                        <div className="flex items-center space-x-2 sm:space-x-3 flex-shrink-0">
                            <Link
                                href={`/template/${templateId}?resumeId=${resumeId}`}
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
                                onClick={handleDownload}
                                disabled={isDownloading}
                                className="flex items-center space-x-1 sm:space-x-2 px-2 sm:px-4 py-2 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-lg hover:from-blue-600 hover:to-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-md hover:shadow-lg"
                            >
                                <Download className="w-4 h-4" />
                                <span className="hidden sm:inline">{isDownloading ? 'Downloading...' : 'Download PDF'}</span>
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Resume Content */}
            <div className="flex justify-center items-start min-h-screen py-4 sm:py-8 px-2 sm:px-4">
                <div className="w-fit mx-auto max-w-full">
                    <ResumePreview />
                </div>
            </div>
        </div>
    )
}

export default ResumePage
