'use client'

import React, { useState, useEffect } from 'react'
import { useParams, useSearchParams, useRouter } from 'next/navigation'
import { useSession } from 'next-auth/react'
import { useResumeStore } from '@/store/resumeStore'
import ResumePreview from '@/components/ui/ResumePreview'
import { ArrowLeft, Download, Save, Edit } from 'lucide-react'
import Link from 'next/link'
import html2pdf from "html2pdf.js"

function ResumePage() {
    const params = useParams()
    const searchParams = useSearchParams()
    const router = useRouter()
    const { data: session, status } = useSession()
    const templateId = searchParams.get('template')
    const resumeId = params.id

    const {
        personalInfo,
        workExperience,
        skills,
        summary,
        templateId: storeTemplateId,
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
        if (status === 'loading') return

        if (!session) {
            handleAuthRedirect()
            return
        }

        setIsSaving(true)
        try {
            // Set the document ID if we have a resumeId from URL
            if (resumeId && typeof resumeId === 'string' && !isNaN(Number(resumeId))) {
                setDocumentId(Number(resumeId))
            }

            await saveResume()
            alert('Resume saved successfully!')
        } catch (error: any) {
            console.error('Failed to save resume:', error)
            if (error.response?.status === 401) {
                handleAuthRedirect()
            } else {
                alert('Failed to save resume. Please try again.')
            }
        } finally {
            setIsSaving(false)
        }
    }

    const handleDownload = async () => {
        if (status === "loading") return

        if (!session) {
            handleAuthRedirect()
            return
        }

        setIsDownloading(true)
        try {
            // await handleSave()

            const resumeContent = document.querySelector("[data-resume-content]") as HTMLElement
            if (resumeContent) {
                const opt = {
                    margin: 0.5,
                    filename: `${personalInfo.firstName}-${personalInfo.lastName}-Resume.pdf`,
                    image: { type: "jpeg", quality: 0.98 },
                    html2canvas: { scale: 2 },
                    jsPDF: { unit: "in", format: "letter", orientation: "portrait" }
                }

                await html2pdf().set(opt).from(resumeContent).save()
            }
        } catch (error: any) {
            console.error("Failed to download resume:", error)
            if (error.response?.status === 401) {
                handleAuthRedirect()
            } else {
                alert("Failed to download resume. Please try again.")
            }
        } finally {
            setIsDownloading(false)
        }
    }

    // Load resume data when component mounts
    useEffect(() => {
        if (!resumeId || typeof resumeId !== 'string' || isNaN(Number(resumeId))) return

        const resumeIdNum = Number(resumeId)

        // Set the document ID in store
        setDocumentId(resumeIdNum)

        // Load resume data if store is empty
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
                                href="/template"
                                className="flex items-center space-x-2 text-gray-600 hover:text-gray-900"
                            >
                                <ArrowLeft className="w-4 h-4" />
                                <span>Back to Templates</span>
                            </Link>
                            <div className="h-4 w-px bg-gray-300" />
                            <h1 className="text-lg font-semibold text-gray-900">
                                {personalInfo.firstName} {personalInfo.lastName}'s Resume
                            </h1>
                        </div>

                        <div className="flex items-center space-x-3">
                            <Link
                                href={`/template/${templateId}`}
                                className="flex items-center space-x-2 px-4 py-2 text-gray-700 hover:text-gray-900 border border-gray-300 rounded-lg hover:bg-gray-50"
                            >
                                <Edit className="w-4 h-4" />
                                <span>Edit</span>
                            </Link>
                            <button
                                onClick={handleSave}
                                disabled={isSaving}
                                className="flex items-center space-x-2 px-4 py-2 text-green-700 hover:text-green-800 border border-green-300 rounded-lg hover:bg-green-50 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                <Save className="w-4 h-4" />
                                <span>{isSaving ? 'Saving...' : 'Save'}</span>
                            </button>
                            <button
                                onClick={handleDownload}
                                disabled={isDownloading}
                                className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                <Download className="w-4 h-4" />
                                <span>{isDownloading ? 'Downloading...' : 'Download PDF'}</span>
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Resume Content - Full Width for Better Display */}
            <div className="max-w-5xl mx-auto p-6">
                <div className="bg-white rounded-lg shadow-lg">
                    <ResumePreview />
                </div>
            </div>
        </div>
    )
}

export default ResumePage
