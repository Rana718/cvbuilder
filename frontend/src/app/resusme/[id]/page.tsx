'use client'

import React, { useState } from 'react'
import { useParams, useSearchParams, useRouter } from 'next/navigation'
import { useSession } from 'next-auth/react'
import { useResumeStore } from '@/store/resumeStore'
import ResumePreview from '@/components/ui/ResumePreview'
import { ArrowLeft, Download, Save, Edit } from 'lucide-react'
import Link from 'next/link'
import axiosInstance from '@/lib/axios'

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
        education, 
        skills, 
        summary,
        templateId: storeTemplateId 
    } = useResumeStore()

    const [isSaving, setIsSaving] = useState(false)
    const [isDownloading, setIsDownloading] = useState(false)

    const buildResumeData = () => {
        const websites = personalInfo.websites || []
        return {
            name: `${personalInfo.firstName} ${personalInfo.lastName}`.trim(),
            phone: personalInfo.phone || "",
            city: personalInfo.city || "",
            state: "",
            country: personalInfo.country || "",
            postal_code: personalInfo.pincode || "",
            job_title: personalInfo.profession || "",
            summary: summary || "",
            skills: skills.reduce((acc, skill, index) => {
                acc[`skill_${index}`] = {
                    name: skill.name,
                    rating: skill.rating,
                    level: skill.level
                }
                return acc
            }, {} as Record<string, any>),
            experience: workExperience.reduce((acc, exp, index) => {
                acc[`exp_${index}`] = {
                    title: exp.jobTitle,
                    company: exp.employer,
                    location: exp.location,
                    start_date: exp.startDate,
                    end_date: exp.endDate,
                    is_current: exp.isCurrentlyWorking,
                    description: exp.description
                }
                return acc
            }, {} as Record<string, any>),
            education: education.reduce((acc, edu, index) => {
                acc[`edu_${index}`] = {
                    degree: edu.degree,
                    institution: edu.schoolName,
                    field: edu.fieldOfStudy,
                    start_date: edu.startDate,
                    end_date: edu.endDate
                }
                return acc
            }, {} as Record<string, any>),
            certifications: {},
            projects: {},
            languages: {},
            linkedin_url: websites.find(w => w.label.toLowerCase().includes('linkedin'))?.url || "",
            github_url: websites.find(w => w.label.toLowerCase().includes('github'))?.url || "",
            portfolio_url: websites.find(w => w.label.toLowerCase().includes('portfolio'))?.url || "",
            template_id: parseInt(templateId || storeTemplateId || "1"),
            theme_color: "blue"
        }
    }

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
            const resumeData = buildResumeData()
            const response = await axiosInstance.post('/api/resume-op/save', resumeData)
            
            if (response.data) {
                alert('Resume saved successfully!')
            }
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
        if (status === 'loading') return
        
        if (!session) {
            handleAuthRedirect()
            return
        }

        setIsDownloading(true)
        try {
            // First save the resume
            const resumeData = buildResumeData()
            await axiosInstance.post('/api/resume-op/save', resumeData)

            // Generate PDF using browser's print functionality
            // Add a slight delay to ensure the page is rendered properly
            setTimeout(() => {
                const printWindow = window.open('', '_blank')
                if (printWindow) {
                    const resumeContent = document.querySelector('[data-resume-content]')
                    if (resumeContent) {
                        printWindow.document.write(`
                            <!DOCTYPE html>
                            <html>
                            <head>
                                <title>${personalInfo.firstName} ${personalInfo.lastName} - Resume</title>
                                <style>
                                    body { margin: 0; padding: 20px; font-family: Arial, sans-serif; }
                                    @page { margin: 0.5in; }
                                    .print-container { max-width: 8.5in; margin: 0 auto; }
                                </style>
                            </head>
                            <body>
                                <div class="print-container">
                                    ${resumeContent.innerHTML}
                                </div>
                            </body>
                            </html>
                        `)
                        printWindow.document.close()
                        printWindow.focus()
                        printWindow.print()
                        printWindow.close()
                    }
                }
                setIsDownloading(false)
            }, 500)
            
        } catch (error: any) {
            console.error('Failed to download resume:', error)
            if (error.response?.status === 401) {
                handleAuthRedirect()
            } else {
                alert('Failed to download resume. Please try again.')
            }
            setIsDownloading(false)
        }
    }

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