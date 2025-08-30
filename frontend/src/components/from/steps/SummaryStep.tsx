import React, { useEffect, useState, useRef } from 'react'
import { FileText } from 'lucide-react'
import { useResumeStore } from '@/store/resumeStore'
import SimpleRichTextEditor from '@/components/ui/SimpleRichTextEditor'
import axiosInstance from '@/lib/axios'

interface SummaryStepProps {
    onNext: () => void
    onPrev: () => void
}

function SummaryStep({ onNext, onPrev }: SummaryStepProps) {
    const { 
        summary, 
        setSummary,  
        personalInfo, 
        workExperience, 
        education, 
        skills 
    } = useResumeStore()
    
    const [aiSuggestions, setAiSuggestions] = useState<string[]>([])
    const [isLoadingSuggestions, setIsLoadingSuggestions] = useState(false)
    const { getOrCreateDocumentId } = useResumeStore()
    const { documentId } = useResumeStore()
    const hasCalledAPI = useRef(false)

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
        
        // Ensure we have a consistent document ID
        const docId = getOrCreateDocumentId()
        
        setIsLoadingSuggestions(true)
        hasCalledAPI.current = true
        
        try {
            const cvData = buildCvData()
            const response = await axiosInstance.post('/api/cv-gen/summary', cvData)
            
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

    useEffect(() => {
        // Only fetch AI summary when component mounts and we have sufficient data
        if (personalInfo.firstName || workExperience.length > 0 || skills.length > 0) {
            fetchAISummary()
        }
    }, [personalInfo.firstName, workExperience.length, skills.length]) // Depend on key data to trigger when available

    const retryFetchSummary = () => {
        hasCalledAPI.current = false
        fetchAISummary()
    }

    const useSummaryTemplate = (template: string) => {
        setSummary(template)
    }

    const isStepValid = summary.trim().length > 0

    return (
        <div className="space-y-6">
            <div>
                <h2 className="text-2xl font-bold text-gray-900 mb-2">Professional Summary</h2>
                <p className="text-gray-600">Write a compelling summary that highlights your experience and career objectives</p>
            </div>

            {/* Professional Summary Section */}
            <div className="space-y-4">
                <div className="flex items-center">
                    <h3 className="text-lg font-medium text-gray-900 flex items-center">
                        <FileText className="w-5 h-5 mr-2" />
                        Your Professional Summary
                    </h3>
                </div>

                <p className="text-sm text-gray-600">
                    Write a brief summary that highlights your experience, skills, and career objectives.
                </p>

                <SimpleRichTextEditor
                    value={summary}
                    onChange={setSummary}
                    placeholder="Write a compelling summary that showcases your professional background, key skills, and what you bring to potential employers..."
                    height="120px"
                />

                {/* AI Summary Suggestions */}
                <div className="space-y-3">
                    <div className="flex items-center justify-between">
                        <h4 className="text-sm font-medium text-gray-700">AI-Generated Summary Suggestions (click to use):</h4>
                        {(personalInfo.firstName || workExperience.length > 0 || skills.length > 0) && !isLoadingSuggestions && (
                            <button
                                onClick={retryFetchSummary}
                                className="text-xs text-blue-600 hover:text-blue-700 font-medium"
                            >
                                Regenerate Summary
                            </button>
                        )}
                    </div>
                    
                    {(!personalInfo.firstName && workExperience.length === 0 && skills.length === 0) && (
                        <div className="text-center py-6 text-sm text-gray-500">
                            Add personal information, work experience, or skills first to get AI-generated summary suggestions.
                        </div>
                    )}
                    
                    {(personalInfo.firstName || workExperience.length > 0 || skills.length > 0) && isLoadingSuggestions && (
                        <div className="flex items-center justify-center py-6">
                            <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-blue-500"></div>
                            <span className="ml-2 text-sm text-gray-600">Generating personalized summary suggestions...</span>
                        </div>
                    )}
                    
                    {(personalInfo.firstName || workExperience.length > 0 || skills.length > 0) && aiSuggestions.length > 0 && !isLoadingSuggestions && (
                        <div className="space-y-2">
                            {aiSuggestions.map((suggestion: string, index: number) => (
                                <button
                                    key={index}
                                    onClick={() => useSummaryTemplate(suggestion)}
                                    className="w-full text-left p-3 text-sm text-gray-600 hover:bg-blue-50 hover:text-blue-700 rounded border border-gray-200 transition-colors"
                                >
                                    {suggestion}
                                </button>
                            ))}
                        </div>
                    )}
                    
                    {(personalInfo.firstName || workExperience.length > 0 || skills.length > 0) && aiSuggestions.length === 0 && !isLoadingSuggestions && (
                        <div className="text-center py-6 text-sm text-gray-500">
                            No AI suggestions available. Write your summary manually or try regenerating.
                        </div>
                    )}
                </div>
            </div>

            {/* Navigation Buttons */}
            <div className="flex justify-between">
                <button
                    onClick={onPrev}
                    className="px-6 py-3 text-gray-600 hover:text-gray-800 font-medium"
                >
                    Previous
                </button>
                <button
                    onClick={onNext}
                    disabled={!isStepValid}
                    className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed font-medium"
                >
                    Next: Additional Information
                </button>
            </div>
        </div>
    )
}

export default SummaryStep
