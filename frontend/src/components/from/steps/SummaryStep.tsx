import React, { useEffect, useState, useRef } from 'react'
import { FileText, ChevronLeft, ChevronRight, Sparkles, Target, User } from 'lucide-react'
import { useResumeStore } from '@/store/resumeStore'
import SimpleRichTextEditor from '@/components/ui/SimpleRichTextEditor'
import axiosInstance from '@/lib/axios'
import { motion, AnimatePresence } from 'framer-motion'
import { useRouter, useSearchParams } from 'next/navigation'

interface SummaryStepProps {
    onNext: () => void
    onPrev: () => void
}

function SummaryStep({ onNext, onPrev }: SummaryStepProps) {
    const router = useRouter()
    const searchParams = useSearchParams()
    const resumeStore = useResumeStore()
    const { 
        summary, 
        setSummary,  
        personalInfo, 
        workExperience, 
        education, 
        skills,
        saveResume,
        documentId,
        templateId,
        generatePreviewId
    } = resumeStore
    
    const [aiSuggestions, setAiSuggestions] = useState<string[]>([])
    const [isLoadingSuggestions, setIsLoadingSuggestions] = useState(false)
    const [isSaving, setIsSaving] = useState(false)
    
    const hasCalledAPI = useRef(false)

    const handleFinish = () => {
        if (isSaving) return
        
        setIsSaving(true)
        
        // Get the resume ID from either documentId or URL params
        const resumeId = documentId || searchParams.get('resumeId')
        const currentTemplateId = templateId || searchParams.get('template')
        
        if (resumeId && currentTemplateId) {
            // Redirect to existing resume preview page
            router.push(`/resusme/${resumeId}?template=${currentTemplateId}`)
        } else if (currentTemplateId) {
            // For new resume, generate a temporary ID for preview
            // The data will be stored locally in the store until user saves
            const tempResumeId = generatePreviewId()
            router.push(`/resusme/${tempResumeId}?template=${currentTemplateId}`)
        } else {
            // Fallback if no template is selected
            alert('Please select a template first.')
            setIsSaving(false)
        }
    }

    const buildCvData = () => {
        return {
            name: `${personalInfo.firstName} ${personalInfo.lastName}`.trim(),
            skills: skills.map(skill => skill.name),
            experience: workExperience.map(exp => ({
                title: exp.jobTitle,
                company: exp.employer,
                duration: `${exp.startDate} - ${exp.isCurrentlyWorking ? 'Present' : exp.endDate}`
            }))
        }
    }

    const fetchAISummary = async () => {
        // Prevent multiple API calls
        if (hasCalledAPI.current) {
            return
        }
        
        setIsLoadingSuggestions(true)
        hasCalledAPI.current = true
        
        try {
            const cvData = buildCvData()
            const response = await axiosInstance.post('/api/public/cv-gen/summary', cvData)
            
            if (response.data?.suggestions && Array.isArray(response.data.suggestions)) {
                setAiSuggestions(response.data.suggestions)
            }
        } catch (error) {
            console.error('Failed to fetch AI summary suggestions:', error)
            // Reset the flag on error so user can retry
            hasCalledAPI.current = false
        } finally {
            setIsLoadingSuggestions(false)
        }
    }

    // Removed automatic fetch; user triggers with button below
    const retryFetchSummary = () => fetchAISummary()

    const useSummaryTemplate = (template: string) => {
        setSummary(template)
    }

    const isStepValid = summary.trim().length > 0

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="space-y-8 max-w-4xl mx-auto"
        >
            {/* Header Section */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="text-left"
            >
                <div className="flex items-start mb-4">
                    <div className="p-3 bg-blue-100 rounded-full mr-2">
                        <Target className="w-8 h-8 text-blue-600" />
                    </div>
                    <div>
                        <h2 className="text-3xl font-bold text-gray-900 mb-2">
                            Professional Summary
                        </h2>
                        <p className="text-lg text-gray-600">
                            Create a compelling summary that highlights your experience and career objectives
                        </p>
                    </div>
                </div>
            </motion.div>

            {/* Professional Summary Section */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="bg-gradient-to-br from-blue-50 to-indigo-50 p-8 rounded-2xl border border-blue-200 shadow-lg"
            >
                <div className="space-y-6">
                    <div className="flex items-center">
                        <motion.div
                            whileHover={{ scale: 1.1, rotate: 5 }}
                            className="w-10 h-10 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center mr-3 shadow-md"
                        >
                            <FileText className="w-5 h-5 text-white" />
                        </motion.div>
                        <h3 className="text-xl font-semibold text-gray-800">
                            Your Professional Summary
                        </h3>
                    </div>

                    <motion.p
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.3 }}
                        className="text-gray-600 leading-relaxed"
                    >
                        Write a brief summary that highlights your experience, skills, and career objectives.
                    </motion.p>

                    <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.4 }}
                        className="relative"
                    >
                        <SimpleRichTextEditor
                            value={summary}
                            onChange={setSummary}
                            placeholder="Write a compelling summary that showcases your professional background, key skills, and what you bring to potential employers..."
                            height="120px"
                        />
                    </motion.div>

                    {/* AI Summary Suggestions */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.3 }}
                        className="space-y-4"
                    >
                        <div className="flex items-center justify-between">
                            <h4 className="text-lg font-semibold text-gray-700 flex items-center">
                                <Sparkles className="w-5 h-5 mr-2 text-blue-500" />
                                AI-Generated Summary Suggestions
                            </h4>
                            {(personalInfo.firstName || workExperience.length > 0 || skills.length > 0) && !isLoadingSuggestions && (
                                <motion.button
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                    onClick={fetchAISummary}
                                    className="flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-blue-500 to-indigo-600 text-white rounded-lg hover:from-blue-600 hover:to-indigo-700 text-sm font-medium transition-all shadow-md"
                                >
                                    <Sparkles className="w-4 h-4" />
                                    <span>Generate Summary</span>
                                </motion.button>
                            )}
                        </div>
                        
                        <AnimatePresence>
                            {(!personalInfo.firstName && workExperience.length === 0 && skills.length === 0) && (
                                <motion.div
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    className="text-center py-8 bg-white rounded-sm border border-gray-300"
                                >
                                    <User className="w-12 h-12 mx-auto mb-3 text-gray-400" />
                                    <p className="text-sm text-gray-500">
                                        Add personal information, work experience, or skills first to get AI-generated summary suggestions.
                                    </p>
                                </motion.div>
                            )}
                            
                            {(personalInfo.firstName || workExperience.length > 0 || skills.length > 0) && isLoadingSuggestions && (
                                <motion.div
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: -10 }}
                                    className="flex items-center justify-center py-12 bg-white rounded-sm border border-blue-500"
                                >
                                    <div className="text-center">
                                        <motion.div
                                            animate={{ rotate: 360 }}
                                            transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                                            className="w-8 h-8 border-3 border-blue-500 border-t-transparent rounded-full mx-auto mb-4"
                                        />
                                        <p className="text-sm text-gray-600 font-medium">
                                            AI is crafting personalized summary suggestions...
                                        </p>
                                    </div>
                                </motion.div>
                            )}
                            
                            {(personalInfo.firstName || workExperience.length > 0 || skills.length > 0) && aiSuggestions.length > 0 && !isLoadingSuggestions && (
                                <motion.div
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    className="space-y-3"
                                >
                                    {aiSuggestions.map((suggestion: string, index: number) => (
                                        <motion.button
                                            key={index}
                                            initial={{ opacity: 0, x: -20 }}
                                            animate={{ opacity: 1, x: 0 }}
                                            transition={{ delay: index * 0.1 }}
                                            whileHover={{ scale: 1.02, y: -2 }}
                                            whileTap={{ scale: 0.98 }}
                                            onClick={() => useSummaryTemplate(suggestion)}
                                            className="w-full text-left p-4 text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-700 rounded-xl border border-gray-200 hover:border-blue-300 transition-all shadow-sm hover:shadow-md"
                                        >
                                            {suggestion}
                                        </motion.button>
                                    ))}
                                </motion.div>
                            )}
                            
                            {(personalInfo.firstName || workExperience.length > 0 || skills.length > 0) && aiSuggestions.length === 0 && !isLoadingSuggestions && (
                                <motion.div
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    className="text-center py-8 bg-gray-50 rounded-xl border border-gray-200"
                                >
                                    <FileText className="w-12 h-12 mx-auto mb-3 text-gray-400" />
                                    <p className="text-sm text-gray-500">
                                        No AI suggestions available. Write your summary manually or try regenerating.
                                    </p>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </motion.div>
                </div>
            </motion.div>

            {/* Navigation Buttons */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
                className="flex justify-between pt-6"
            >
                <motion.button
                    whileHover={{ scale: 1.02, x: -5 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={onPrev}
                    className="flex items-center space-x-2 px-6 py-3 text-gray-700 bg-white border border-black rounded-sm hover:bg-gray-50 font-medium transition-colors"
                >
                    <ChevronLeft className="w-4 h-4" />
                    <span>Previous</span>
                </motion.button>
                <motion.button
                    whileHover={{ scale: 1.02, x: 5 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={handleFinish}
                    disabled={!isStepValid || isSaving}
                    className="flex items-center space-x-2 px-6 py-3 bg-blue-600 text-white rounded-sm hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed font-medium border border-black transition-all"
                >
                    <span>{isSaving ? 'Loading Preview...' : 'Preview Resume'}</span>
                    <ChevronRight className="w-4 h-4" />
                </motion.button>
            </motion.div>
        </motion.div>
    )
}

export default SummaryStep
