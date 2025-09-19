'use client'

import React, { useState, useEffect, Suspense } from 'react'
import { useParams, useSearchParams, useRouter } from 'next/navigation'
import { useAuth } from '@/components/AuthContext'
import { useResumeStore } from '@/store/resumeStore'
import { usePremiumStatus } from '@/hooks/usePremiumStatus'
import ResumePreview from '@/components/ui/ResumePreview'
import { ArrowLeft, Download, Save, Edit, Share, CheckCircle, Search, Grid3X3, X } from 'lucide-react'
import Link from 'next/link'
import axiosInstance from '@/lib/axios'
import { CV_TEMPLATES, TEMPLATE_CATEGORIES } from '@/constants/templates'
import TemplateRenderer from '@/components/templates/TemplateRenderer'
import { motion, AnimatePresence } from 'framer-motion'
import Navbar from '@/components/Navbar'

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

    const redirectToPayment = () => {
        const currentUrl = window.location.pathname + window.location.search
        router.push(`/payment?redirect=${encodeURIComponent(currentUrl)}`)
    }

    const download_url = process.env.NEXT_PUBLIC_API_KEY_DOWN || '';

    const redirectToAuth = () => {
        const currentUrl = window.location.pathname + window.location.search
        router.push(`/auth?redirect=${encodeURIComponent(currentUrl)}`)
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

        if (!user) {
            redirectToAuth()
            return
        }

        console.log("User premium status:", isPremium)
        const tokenResult = await user.getIdTokenResult(true);

        console.log("Token claims:", tokenResult.claims)
        await refreshStatus()

        if (!isPremium) {
            await saveResume()
            redirectToPayment()
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

        if (!isPremium) {
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

    const handleTemplateChange = (newTemplateId: number) => {
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

        if (templateId) {
            setTemplateId(templateId)
        }

        if (useResumeStore.getState().isPreviewId(resumeId)) {
            setDocumentId(resumeIdNum)
        } else {
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
            <div className="min-h-screen bg-slate-50 flex items-center justify-center">
                <div className="text-center">
                    <div className="relative">
                        <div className="absolute inset-0 bg-gradient-to-r from-blue-500/20 to-purple-500/20 blur-xl rounded-full"></div>
                        <div className="relative animate-spin rounded-full h-12 w-12 border-2 border-blue-500 border-t-transparent mx-auto mb-4"></div>
                    </div>
                    <p className="text-slate-700 font-medium">Loading your resume...</p>
                </div>
            </div>
        )
    }

    if (!loading && !user) return null

    const TemplateSelectorPanel = () => (
        <div className="bg-white/90 backdrop-blur-sm shadow-xl rounded-2xl h-full overflow-hidden flex flex-col border border-white/20">
            <div className="p-4 border-b border-gray-200/50">
                <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-semibold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">Templates</h3>
                    <button
                        onClick={() => setShowTemplateSelector(false)}
                        className="lg:hidden p-2 hover:bg-gray-100 rounded-lg transition-colors"
                    >
                        <X className="w-5 h-5 text-gray-500" />
                    </button>
                </div>

                {/* Search Bar */}
                <div className="relative mb-3">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <input
                        type="text"
                        placeholder="Search templates..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl bg-gray-50/50 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500/50 focus:bg-white text-sm transition-all duration-200"
                    />
                </div>

                {/* Category Filter */}
                <div className="flex flex-wrap gap-2">
                    <button
                        onClick={() => setSelectedCategory("All")}
                        className={`px-3 py-2 rounded-lg text-xs font-medium transition-all duration-200 ${"All" === selectedCategory
                            ? "bg-gradient-to-r from-blue-600 to-blue-700 text-white shadow-md"
                            : "bg-gray-100/80 text-gray-700 hover:bg-gray-200/80 hover:shadow-sm"
                            }`}
                    >
                        All
                    </button>
                    {TEMPLATE_CATEGORIES.map((category) => (
                        <button
                            key={category}
                            onClick={() => setSelectedCategory(category)}
                            className={`px-3 py-2 rounded-lg text-xs font-medium transition-all duration-200 ${selectedCategory === category
                                ? "bg-gradient-to-r from-blue-600 to-blue-700 text-white shadow-md"
                                : "bg-gray-100/80 text-gray-700 hover:bg-gray-200/80 hover:shadow-sm"
                                }`}
                        >
                            {category}
                        </button>
                    ))}
                </div>
            </div>

            {/* Templates Grid */}
            <div className="flex-1 overflow-y-auto p-3">
                <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
                    {filteredTemplates.map((template, i) => (
                        <motion.div
                            key={template.id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.3, delay: i * 0.05 }}
                            className="cursor-pointer"
                            onClick={() => handleTemplateChange(template.id)}
                        >
                            <div className={`relative overflow-hidden transition-all duration-200 bg-white rounded-xl border-2 hover:shadow-lg ${
                                template.id === Number(templateId) 
                                    ? 'border-blue-500 shadow-lg ring-2 ring-blue-500/20' 
                                    : 'border-gray-200 hover:border-gray-300'
                            }`}>
                                {/* Template Preview */}
                                <div className="w-full bg-white overflow-hidden flex justify-center" style={{ height: '320px' }}>
                                    <div className="w-[794px] h-[1200px] transform scale-[0.3] origin-top bg-white border border-gray-500">
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
                                        }} size="normal" />
                                    </div>
                                </div>

                                <div className="p-3 text-center border-t border-gray-100">
                                    <h4 className="text-sm font-semibold text-slate-800">{template.name}</h4>
                                    <p className="text-xs text-gray-500 mt-1">{template.category}</p>
                                </div>
                                {/* Selected Indicator */}
                                {template.id === Number(templateId) && (
                                    <div className="absolute top-3 right-3 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-full p-1.5 z-10 shadow-lg">
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
        <div className="min-h-screen bg-slate-50 overflow-x-hidden">
            {/* Background Elements */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className="absolute top-20 left-10 w-96 h-96 bg-gradient-to-r from-blue-400/10 to-indigo-500/10 rounded-full mix-blend-multiply filter blur-3xl animate-pulse"></div>
                <div className="absolute top-40 right-10 w-80 h-80 bg-gradient-to-r from-purple-400/10 to-pink-500/10 rounded-full mix-blend-multiply filter blur-3xl animate-pulse delay-1000"></div>
                <div className="absolute bottom-20 left-1/2 w-72 h-72 bg-gradient-to-r from-emerald-400/10 to-teal-500/10 rounded-full mix-blend-multiply filter blur-3xl animate-pulse delay-2000"></div>
            </div>

            {/* Floating grid pattern */}
            <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808008_1px,transparent_1px),linear-gradient(to_bottom,#80808008_1px,transparent_1px)] bg-[size:24px_24px] pointer-events-none"></div>

            <Navbar />

            <div className="relative flex flex-col lg:flex-row min-h-[calc(100vh-4rem)]">
                <div className="hidden lg:block w-[450px] xl:w-[500px] 2xl:w-[550px] p-4">
                    <TemplateSelectorPanel />
                </div>

                <div className="lg:hidden p-4">
                    <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => setShowTemplateSelector(!showTemplateSelector)}
                        className="w-full bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white px-4 py-3 rounded-xl font-medium transition-all duration-200 flex items-center justify-center space-x-2 shadow-lg hover:shadow-xl"
                    >
                        <Grid3X3 className="w-5 h-5" />
                        <span>Change Template</span>
                    </motion.button>

                    <AnimatePresence>
                        {showTemplateSelector && (
                            <motion.div 
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                className="fixed inset-0 z-50 flex items-center justify-center lg:hidden p-4 bg-black/50 backdrop-blur-sm"
                                onClick={(e) => {
                                    if (e.target === e.currentTarget) {
                                        setShowTemplateSelector(false)
                                    }
                                }}
                            >
                                <motion.div 
                                    initial={{ scale: 0.9, opacity: 0 }}
                                    animate={{ scale: 1, opacity: 1 }}
                                    exit={{ scale: 0.9, opacity: 0 }}
                                    className="bg-white w-full max-w-4xl h-[85vh] rounded-2xl overflow-hidden shadow-2xl"
                                >
                                    <TemplateSelectorPanel />
                                </motion.div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>

                {/* Resume Content Area */}
                <div className="flex-1 lg:pr-4 lg:py-4">
                    <div className="print:hidden py-4 lg:py-6">
                        <div className="max-w-6xl mx-auto px-4">
                            {/* Desktop Layout */}
                            <div className="hidden sm:flex justify-center items-center space-x-3">
                                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                                    <Link
                                        href={`/template/${templateId}?resumeId=${resumeId}`}
                                        className="inline-flex items-center space-x-2 px-4 py-2.5 bg-white hover:bg-gray-50 text-gray-700 hover:text-blue-600 font-medium transition-all duration-200 rounded-xl border border-gray-200 hover:border-blue-200 shadow-sm hover:shadow-md"
                                    >
                                        <Edit className="w-4 h-4" />
                                        <span>Edit</span>
                                    </Link>
                                </motion.div>

                                <motion.button
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                    onClick={handleSave}
                                    disabled={isSaving}
                                    className="inline-flex items-center space-x-2 px-4 py-2.5 bg-green-50 hover:bg-green-100 text-green-700 hover:text-green-800 font-medium transition-all duration-200 rounded-xl border border-green-200 hover:border-green-300 shadow-sm hover:shadow-md disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    <Save className="w-4 h-4" />
                                    <span>{isSaving ? 'Saving...' : 'Save'}</span>
                                </motion.button>

                                <motion.button
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                    onClick={handleShare}
                                    disabled={isSharing}
                                    className="inline-flex items-center space-x-2 px-4 py-2.5 bg-purple-50 hover:bg-purple-100 text-purple-700 hover:text-purple-800 font-medium transition-all duration-200 rounded-xl border border-purple-200 hover:border-purple-300 shadow-sm hover:shadow-md disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    {showShareSuccess ? (
                                        <CheckCircle className="w-4 h-4 text-green-600" />
                                    ) : (
                                        <Share className="w-4 h-4" />
                                    )}
                                    <span>
                                        {isSharing ? 'Sharing...' : showShareSuccess ? 'Link Copied!' : 'Share'}
                                    </span>
                                </motion.button>

                                <motion.button
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                    onClick={handleDownload}
                                    disabled={isDownloading}
                                    className="inline-flex items-center space-x-2 px-6 py-2.5 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-medium transition-all duration-200 rounded-xl shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed"
                                    title={(!user || !isPremium) ? 'Premium feature - Upgrade to download' : ''}
                                >
                                    <Download className="w-4 h-4" />
                                    <span>
                                        {isDownloading ? 'Downloading...' : (!user || !isPremium) ? 'Upgrade to Download' : 'Download'}
                                    </span>
                                </motion.button>
                            </div>

                            {/* Mobile Layout */}
                            <div className="sm:hidden space-y-3">
                                {/* Row 1 */}
                                <div className="flex space-x-3">
                                    <Link
                                        href={`/template/${templateId}?resumeId=${resumeId}`}
                                        className="flex-1 bg-white hover:bg-gray-50 text-gray-700 hover:text-blue-600 px-4 py-3 rounded-xl font-medium transition-all duration-200 flex items-center justify-center space-x-2 text-sm border border-gray-200 hover:border-blue-200 shadow-sm hover:shadow-md"
                                    >
                                        <Edit className="w-4 h-4" />
                                        <span>Edit</span>
                                    </Link>

                                    <button
                                        onClick={handleSave}
                                        disabled={isSaving}
                                        className="flex-1 bg-green-50 hover:bg-green-100 text-green-700 px-4 py-3 rounded-xl font-medium transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2 text-sm border border-green-200 shadow-sm hover:shadow-md"
                                    >
                                        <Save className="w-4 h-4" />
                                        <span>{isSaving ? 'Saving...' : 'Save'}</span>
                                    </button>
                                </div>

                                {/* Row 2 */}
                                <div className="flex space-x-3">
                                    <button
                                        onClick={handleShare}
                                        disabled={isSharing}
                                        className="flex-1 bg-purple-50 hover:bg-purple-100 text-purple-700 px-4 py-3 rounded-xl font-medium transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2 text-sm border border-purple-200 shadow-sm hover:shadow-md"
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
                                        className="flex-1 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white px-4 py-3 rounded-xl font-medium transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2 shadow-lg text-sm"
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
                                    className="mx-auto bg-white shadow-2xl rounded-2xl overflow-hidden border border-gray-200/50 aspect-[210/297] w-full max-w-[600px]"
                                    data-resume-content
                                >
                                    <ResumePreview />
                                </div>
                            </div>

                            {/* Desktop view - A4 ratio ONLY */}
                            <div className="hidden md:block max-w-4xl mx-auto">
                                <div
                                    className="mx-auto bg-white shadow-2xl rounded-2xl overflow-hidden border border-gray-200/50 aspect-[210/297] w-full max-w-[794px]"
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
        </div>
    )
}

const ResumePageWrapper = () => {
    return (
        <Suspense fallback={
            <div className="min-h-screen bg-slate-50 flex items-center justify-center">
                <div className="text-center">
                    <div className="relative">
                        <div className="absolute inset-0 bg-gradient-to-r from-blue-500/20 to-purple-500/20 blur-xl rounded-full"></div>
                        <div className="relative animate-spin rounded-full h-12 w-12 border-2 border-blue-500 border-t-transparent mx-auto mb-4"></div>
                    </div>
                    <p className="text-slate-700 font-medium">Loading resume editor...</p>
                </div>
            </div>
        }>
            <ResumePage />
        </Suspense>
    )
}

export default ResumePageWrapper