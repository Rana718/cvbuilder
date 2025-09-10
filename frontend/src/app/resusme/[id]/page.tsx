'use client'

import React, { useState, useEffect, Suspense } from 'react'
import { useParams, useSearchParams, useRouter } from 'next/navigation'
import { useAuth } from '@/components/AuthContext'
import { useResumeStore } from '@/store/resumeStore'
import { usePremiumStatus } from '@/hooks/usePremiumStatus'
import ResumePreview from '@/components/ui/ResumePreview'
import PaymentCard from '@/components/PaymentCard'
import { ArrowLeft, Download, Save, Edit, Share, CheckCircle, Search, Grid3X3, X } from 'lucide-react'
import Link from 'next/link'
import axiosInstance from '@/lib/axios'
import { CV_TEMPLATES, TEMPLATE_CATEGORIES } from '@/constants/templates'
import TemplateRenderer from '@/components/templates/TemplateRenderer'
import { motion } from 'framer-motion'

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
        shareableUuid, setShareableUuid, setTemplateId
    } = useResumeStore()

    const [isSaving, setIsSaving] = useState(false)
    const [isDownloading, setIsDownloading] = useState(false)
    const [isSharing, setIsSharing] = useState(false)
    const [shareUrl, setShareUrl] = useState('')
    const [showShareSuccess, setShowShareSuccess] = useState(false)
    const [hasLoadedOnce, setHasLoadedOnce] = useState(false)
    const [showPaymentCard, setShowPaymentCard] = useState(false)
    const [showTemplateSelector, setShowTemplateSelector] = useState(false)
    const [searchTerm, setSearchTerm] = useState("")
    const [selectedCategory, setSelectedCategory] = useState("All")

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
            await saveResume()
            return
        }

        setIsDownloading(true)
        try {
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

        if(!isPremium){
            alert('Sharing is a premium feature. Please upgrade to share your resume.')
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

    const handleTemplateChange = (newTemplateId: number) => {
        // Always update the store's templateId, regardless of whether it's local or saved data
        setTemplateId(newTemplateId.toString())
        
        const currentUrl = new URL(window.location.href)
        currentUrl.searchParams.set('template', newTemplateId.toString())
        router.push(currentUrl.toString())
        setShowTemplateSelector(false)
    }

    const filteredTemplates = CV_TEMPLATES.filter(template => {
        const matchesSearch = template.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            template.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
            template.category.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesCategory = selectedCategory === "All" || template.category === selectedCategory;
        return matchesSearch && matchesCategory;
    })

    useEffect(() => {
        if (!resumeId || typeof resumeId !== 'string' || isNaN(Number(resumeId)) || loading) return

        if (!user) {
            redirectToAuth()
            return
        }

        const resumeIdNum = Number(resumeId)
        
        // Always update templateId in store when URL parameter changes
        if (templateId) {
            setTemplateId(templateId)
        }

        // Handle different resume types
        if (useResumeStore.getState().isPreviewId(resumeId)) {
            // This is a preview/local resume, just set the document ID but don't load from API
            setDocumentId(resumeIdNum)
        } else {
            // This is a saved resume, set document ID and load if no data
            setDocumentId(resumeIdNum)
            
            if (!hasData() && !hasLoadedOnce) {
                setHasLoadedOnce(true)
                loadResume(resumeIdNum).catch(err => {
                    console.error('Failed to load resume:', err)
                    if (err.response?.status === 401) redirectToAuth()
                })
            }
        }
    }, [resumeId, loading, user, router, templateId, setTemplateId, setDocumentId, hasData, loadResume, hasLoadedOnce])

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

    const TemplateSelectorPanel = () => (
        <div className="bg-white shadow-lg rounded-lg h-full overflow-hidden flex flex-col">
            <div className="p-2 border-b">
                <div className="flex items-center justify-between mb-2">
                    <h3 className="text-base font-semibold text-gray-900">Templates</h3>
                    <button
                        onClick={() => setShowTemplateSelector(false)}
                        className="lg:hidden p-1 hover:bg-gray-100 rounded"
                    >
                        <X className="w-5 h-5" />
                    </button>
                </div>

                {/* Search Bar */}
                <div className="relative mb-2">
                    <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <input
                        type="text"
                        placeholder="Search..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full pl-8 pr-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
                    />
                </div>

                {/* Category Filter */}
                <div className="flex flex-wrap gap-1">
                    <button
                        onClick={() => setSelectedCategory("All")}
                        className={`px-2 py-1 rounded-md text-xs font-medium transition-colors ${"All" === selectedCategory
                            ? "bg-blue-600 text-white"
                            : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                            }`}
                    >
                        All
                    </button>
                    {TEMPLATE_CATEGORIES.map((category) => (
                        <button
                            key={category}
                            onClick={() => setSelectedCategory(category)}
                            className={`px-2 py-1 rounded-md text-xs font-medium transition-colors ${selectedCategory === category
                                ? "bg-blue-600 text-white"
                                : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                                }`}
                        >
                            {category}
                        </button>
                    ))}
                </div>
            </div>

            {/* Templates Grid */}
            <div className="flex-1 overflow-y-auto p-2">
                <div className="grid grid-cols-1 xl:grid-cols-2 gap-3">
                    {filteredTemplates.map((template, i) => (
                        <motion.div
                            key={template.id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.3, delay: i * 0.05 }}
                            className="cursor-pointer"
                            onClick={() => handleTemplateChange(template.id)}
                        >
                            <div className={`relative bg-white border-2 rounded-lg overflow-hidden transition-all duration-200 ${template.id === Number(templateId)
                                ? 'border-blue-500 shadow-md'
                                : 'border-gray-200 hover:border-blue-300 hover:shadow-sm'
                                }`}>
                                {/* Template Preview */}
                                <div className="w-full relative overflow-hidden bg-white aspect-[210/297]">
                                    <div className="absolute inset-0 w-full h-full p-1">
                                        <div className="w-full h-full transform scale-100 origin-top-left">
                                            <div className="w-full h-full overflow-hidden rounded border bg-white">
                                                <TemplateRenderer templateId={template.id} userData={{
                                                    name: "John Doe",
                                                    email: "john@example.com",
                                                    phone: "+1 (555) 123-4567",
                                                    address: "New York, NY",
                                                    job_title: "Senior Professional",
                                                    summary: "Experienced professional with proven track record of success in leading teams and driving business growth.",
                                                    skills: [
                                                        { name: "Leadership", rating: 5 },
                                                        { name: "Strategy", rating: 4 },
                                                        { name: "Innovation", rating: 5 },
                                                        { name: "Management", rating: 4 }
                                                    ],
                                                    experience: [{
                                                        title: "Senior Position",
                                                        company: "Tech Company",
                                                        duration: "2020 - Present",
                                                        description: "Led strategic initiatives and drove business growth."
                                                    }, {
                                                        title: "Manager",
                                                        company: "Previous Company",
                                                        duration: "2018 - 2020",
                                                        description: "Managed team and projects."
                                                    }],
                                                    education: [{
                                                        degree: "Master's Degree",
                                                        institution: "University",
                                                        year: "2018"
                                                    }],
                                                    projects: [{
                                                        title: "Sample Project",
                                                        description: "Project description"
                                                    }]
                                                }} size="small" />
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Template Name */}
                                <div className="p-2 text-center border-t bg-gray-50">
                                    <p className="text-xs font-medium text-gray-800 truncate">{template.name}</p>
                                </div>

                                {/* Selected Indicator */}
                                {template.id === Number(templateId) && (
                                    <div className="absolute top-2 left-2 bg-blue-500 text-white rounded-full p-1 z-10 shadow-md">
                                        <CheckCircle className="w-4 h-4" />
                                    </div>
                                )}
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>
        </div>
    )

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-100 via-gray-50 to-blue-50 overflow-x-hidden">
            {/* Simplified Header */}
            <div className="bg-white shadow-sm print:hidden sticky top-0 z-20 border-b">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex items-center justify-self-start h-16">
                        <div className="flex items-center space-x-4">
                            <Link
                                href="/resusme"
                                className="flex items-center space-x-2 text-gray-600 hover:text-gray-800 transition-colors"
                            >
                                <ArrowLeft className="w-5 h-5" />
                                <span className="font-medium">Back</span>
                            </Link>
                        </div>

                        <div className="w-32"></div> {/* Spacer for balance */}
                    </div>
                </div>
            </div>

            {/* Main Content Layout */}
            <div className="flex flex-col lg:flex-row min-h-[calc(100vh-4rem)]">
                {/* Template Selector - Left Side for Desktop */}
                <div className="hidden lg:block w-[450px] xl:w-[500px] 2xl:w-[550px] p-4">
                    <TemplateSelectorPanel />
                </div>

                {/* Template Selector Toggle Button - Mobile/Tablet */}
                <div className="lg:hidden p-3">
                    <button
                        onClick={() => setShowTemplateSelector(!showTemplateSelector)}
                        className="w-full bg-blue-600 hover:bg-blue-700 text-white px-4 py-3 rounded-lg font-medium transition-colors flex items-center justify-center space-x-2"
                    >
                        <Grid3X3 className="w-5 h-5" />
                        <span>Change Template</span>
                    </button>

                    {/* Mobile Template Selector Modal */}
                    {showTemplateSelector && (
                        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-end lg:hidden">
                            <div className="bg-white w-full h-[90vh] rounded-t-2xl transform transition-transform overflow-hidden">
                                <TemplateSelectorPanel />
                            </div>
                        </div>
                    )}
                </div>

                {/* Resume Content Area */}
                <div className="flex-1 lg:pr-4 lg:py-4">
                    {/* Action Buttons - Responsive Layout */}
                    <div className="print:hidden py-3 lg:py-4">
                        <div className="max-w-4xl mx-auto px-3">
                            {/* Desktop Layout */}
                            <div className="hidden sm:flex justify-center items-center space-x-4">
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

                            {/* Mobile Layout */}
                            <div className="sm:hidden space-y-2">
                                {/* Row 1 */}
                                <div className="flex space-x-2">
                                    <Link
                                        href={`/template/${templateId}?resumeId=${resumeId}`}
                                        className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-700 px-3 py-2.5 rounded-lg font-medium transition-colors flex items-center justify-center space-x-2 text-sm"
                                    >
                                        <Edit className="w-4 h-4" />
                                        <span>Edit</span>
                                    </Link>

                                    <button
                                        onClick={handleSave}
                                        disabled={isSaving}
                                        className="flex-1 bg-green-100 hover:bg-green-200 text-green-700 px-3 py-2.5 rounded-lg font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2 text-sm"
                                    >
                                        <Save className="w-4 h-4" />
                                        <span>{isSaving ? 'Saving...' : 'Save'}</span>
                                    </button>
                                </div>

                                {/* Row 2 */}
                                <div className="flex space-x-2">
                                    <button
                                        onClick={handleShare}
                                        disabled={isSharing}
                                        className="flex-1 bg-purple-100 hover:bg-purple-200 text-purple-700 px-3 py-2.5 rounded-lg font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2 text-sm"
                                    >
                                        {showShareSuccess ? (
                                            <CheckCircle className="w-4 h-4 text-green-600" />
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
                                        className="flex-1 bg-blue-600 hover:bg-blue-700 text-white px-3 py-2.5 rounded-lg font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2 shadow-md text-sm"
                                    >
                                        <Download className="w-4 h-4" />
                                        <span>
                                            {isDownloading ? 'Downloading...' : (!user || !isPremium) ? 'Upgrade' : 'Download'}
                                        </span>
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>


                    {/* Resume Content */}
                    <div className="flex justify-center items-start pb-6">
                        <div className="w-full">
                            <div className="sm:hidden w-full min-h-[400px] pt-10 flex justify-center items-center">
                                <div className="scale-[0.45] origin-top">
                                    <ResumePreview />
                                </div>
                            </div>
                            {/* Tablet view - A4 ratio ONLY */}
                            <div className="hidden sm:block md:hidden w-full">
                                <div
                                    className="mx-auto bg-white shadow-xl rounded-lg overflow-hidden border aspect-[210/297] w-full max-w-[600px]"
                                    data-resume-content
                                >
                                    <ResumePreview />
                                </div>
                            </div>

                            {/* Desktop view - A4 ratio ONLY */}
                            <div className="hidden md:block max-w-4xl mx-auto">
                                <div
                                    className="mx-auto bg-white shadow-xl rounded-lg overflow-hidden border aspect-[210/297] w-full max-w-[794px]"
                                    data-resume-content
                                >
                                    <ResumePreview />
                                </div>
                            </div>
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