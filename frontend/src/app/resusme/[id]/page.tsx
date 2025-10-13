'use client'

import React, { useState, useEffect, Suspense, useMemo, useCallback } from 'react'
import { useParams, useSearchParams } from 'next/navigation'
import { useAuth } from '@/components/AuthContext'
import { useResumeStore } from '@/store/resumeStore'
import { usePremiumStatus } from '@/hooks/usePremiumStatus'
import { useResumeActions } from '@/hooks/useResumeActions'
import ResumePreview from '@/components/ui/ResumePreview'
import { Grid3X3 } from 'lucide-react'
import { CV_TEMPLATES } from '@/constants/templates'
import { motion, AnimatePresence } from 'framer-motion'
import Navbar from '@/components/Navbar'
import TemplateSelectorPanel from '@/components/resume/TemplateSelectorPanel'
import { DesktopActionButtons, MobileActionButtons } from '@/components/resume/ActionButtons'
import QuickEditModal from '@/components/resume/QuickEditModal'
import { LoadingSpinner, EditorLoadingSpinner } from '@/components/resume/LoadingSpinner'
import { BackgroundDecorations } from '@/components/resume/BackgroundDecorations'

function ResumePage() {
    const params = useParams()
    const searchParams = useSearchParams()
    const { user, loading } = useAuth()
    const { isPremium, refreshStatus } = usePremiumStatus()
    const templateId = searchParams.get('template')
    const resumeId = params.id

    const {
        setDocumentId, loadResume, hasData, setTemplateId, colorTheme, setColorTheme
    } = useResumeStore()

    const {
        isSaving,
        isDownloading,
        isSharing,
        showShareSuccess,
        handleSave,
        handleDownload,
        handleShare
    } = useResumeActions(user, isPremium, templateId, refreshStatus)

    const [showQuickEdit, setShowQuickEdit] = useState(false)
    const [hasLoadedOnce, setHasLoadedOnce] = useState(false)
    const [showTemplateSelector, setShowTemplateSelector] = useState(false)
    const [searchTerm, setSearchTerm] = useState("")
    const [selectedCategory, setSelectedCategory] = useState("All")
    const [forceRerender, setForceRerender] = useState(0)
    const [debouncedSearchTerm, setDebouncedSearchTerm] = useState("")
    
    useEffect(() => {
        const timer = setTimeout(() => {
            setDebouncedSearchTerm(searchTerm)
        }, 300)
        
        return () => clearTimeout(timer)
    }, [searchTerm])
    
    const handleSearchTermChange = useCallback((term: string) => {
        setSearchTerm(term)
    }, [])
    
    const handleCategoryChange = useCallback((category: string) => {
        setSelectedCategory(category)
    }, [])

    const handleTemplateChange = useCallback((newTemplateId: number) => {
        setTemplateId(newTemplateId.toString())

        const currentUrl = new URL(window.location.href)
        currentUrl.searchParams.set('template', newTemplateId.toString())
        
        window.history.replaceState({}, '', currentUrl.toString())
        setShowTemplateSelector(false)
        
        setForceRerender(prev => prev + 1)
    }, [setTemplateId])

    const filteredTemplates = useMemo(() => {
        return CV_TEMPLATES.filter(template => {
            const matchesSearch = template.name.toLowerCase().includes(debouncedSearchTerm.toLowerCase()) ||
                template.description.toLowerCase().includes(debouncedSearchTerm.toLowerCase()) ||
                template.category.toLowerCase().includes(debouncedSearchTerm.toLowerCase())
            const matchesCategory = selectedCategory === "All" || template.category === selectedCategory
            return matchesSearch && matchesCategory
        }).sort((a, b) => {
            if (a.isFree && !b.isFree) return -1
            if (!a.isFree && b.isFree) return 1
            return 0
        })
    }, [debouncedSearchTerm, selectedCategory])

    useEffect(() => {
        if (!resumeId || typeof resumeId !== 'string' || isNaN(Number(resumeId)) || loading) return

        if (!user) {
            const currentUrl = window.location.pathname + window.location.search
            window.location.href = `/sign-in?callbackUrl=${encodeURIComponent(currentUrl)}`
            return
        }

        const resumeIdNum = Number(resumeId)

        if (templateId && templateId !== useResumeStore.getState().templateId) {
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
                    if (err.response?.status === 401) {
                        const currentUrl = window.location.pathname + window.location.search
                        window.location.href = `/sign-in?callbackUrl=${encodeURIComponent(currentUrl)}`
                    }
                })
            }
        }
    }, [resumeId, templateId, setTemplateId, setDocumentId, hasData, loadResume, hasLoadedOnce, user, loading])

    if (loading) {
        return <LoadingSpinner />
    }

    return (
        <div className="min-h-screen bg-slate-50 overflow-x-hidden">
            <BackgroundDecorations />

            <Navbar />

            <div className="relative flex flex-col lg:flex-row min-h-[calc(100vh-4rem)]">
                <div className="hidden lg:block w-[450px] xl:w-[500px] 2xl:w-[550px] p-4">
                    <TemplateSelectorPanel 
                        searchTerm={searchTerm}
                        setSearchTerm={handleSearchTermChange}
                        selectedCategory={selectedCategory}
                        setSelectedCategory={handleCategoryChange}
                        filteredTemplates={filteredTemplates}
                        templateId={templateId}
                        onTemplateChange={handleTemplateChange}
                        colorTheme={colorTheme}
                        onColorThemeChange={setColorTheme}
                    />
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
                                    <TemplateSelectorPanel 
                                        searchTerm={searchTerm}
                                        setSearchTerm={handleSearchTermChange}
                                        selectedCategory={selectedCategory}
                                        setSelectedCategory={handleCategoryChange}
                                        filteredTemplates={filteredTemplates}
                                        templateId={templateId}
                                        onTemplateChange={handleTemplateChange}
                                        onClose={() => setShowTemplateSelector(false)}
                                        colorTheme={colorTheme}
                                        onColorThemeChange={setColorTheme}
                                    />
                                </motion.div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>

                {/* Resume Content Area */}
                <div className="flex-1 lg:pr-4 lg:py-4">
                    <div className="print:hidden py-4 lg:py-6">
                        <div className="max-w-6xl mx-auto px-4">
                            <DesktopActionButtons
                                templateId={templateId}
                                resumeId={resumeId as string}
                                isSaving={isSaving}
                                isSharing={isSharing}
                                isDownloading={isDownloading}
                                showShareSuccess={showShareSuccess}
                                isPremium={isPremium}
                                user={user}
                                colorTheme={colorTheme}
                                onSave={() => handleSave(resumeId)}
                                onShare={handleShare}
                                onDownload={handleDownload}
                                onQuickEdit={() => setShowQuickEdit(true)}
                                onColorThemeChange={setColorTheme}
                            />

                            <MobileActionButtons
                                templateId={templateId}
                                resumeId={resumeId as string}
                                isSaving={isSaving}
                                isSharing={isSharing}
                                isDownloading={isDownloading}
                                showShareSuccess={showShareSuccess}
                                isPremium={isPremium}
                                user={user}
                                colorTheme={colorTheme}
                                onSave={() => handleSave(resumeId)}
                                onShare={handleShare}
                                onDownload={handleDownload}
                                onQuickEdit={() => setShowQuickEdit(true)}
                                onColorThemeChange={setColorTheme}
                            />
                        </div>
                    </div>


                    {/* Resume Content */}
                    <div className="flex justify-center items-start pb-6">
                        <div className="w-full">
                            <div className="sm:hidden w-full min-h-[400px] pt-10">
                                <div className="flex flex-col items-center space-y-4 scale-[0.45] origin-top">
                                    <ResumePreview 
                                        pass={isPremium} 
                                        isFree={CV_TEMPLATES.find(t => t.id === Number(templateId))?.isFree || false}
                                        key={`mobile-${forceRerender}-${isPremium}`} 
                                    />
                                </div>
                            </div>
                            
                            <div className="hidden sm:block w-full" data-resume-content>
                                <div className="mx-auto max-w-[794px]">
                                    <ResumePreview 
                                        pass={isPremium} 
                                        isFree={CV_TEMPLATES.find(t => t.id === Number(templateId))?.isFree || false}
                                        key={`desktop-${forceRerender}-${isPremium}`} 
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <AnimatePresence>
                {showQuickEdit && (
                    <QuickEditModal
                        isOpen={showQuickEdit}
                        onClose={() => setShowQuickEdit(false)}
                        onSave={() => handleSave(resumeId)}
                    />
                )}
            </AnimatePresence>
        </div>
    )
}

const ResumePageWrapper = () => (
    <Suspense fallback={<EditorLoadingSpinner />}>
        <ResumePage />
    </Suspense>
)

export default ResumePageWrapper