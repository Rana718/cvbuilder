'use client'

import React, { useState, useRef, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Check, Plus, Sparkles, ChevronLeft } from 'lucide-react'
import SimpleRichTextEditor from '@/components/ui/SimpleRichTextEditor'
import type { WorkExperience } from '@/store/resumeStore'

interface DescriptionViewProps {
    formData: Omit<WorkExperience, 'id'>
    onFormDataChange: (data: Partial<Omit<WorkExperience, 'id'>>) => void
    onSave: () => void
    onBack: () => void
    aiSuggestions: string[]
    isLoadingAI?: boolean
    streamingContent?: string
    isEditing?: boolean
}

function DescriptionView({ formData, onFormDataChange, onSave, onBack, aiSuggestions, isLoadingAI = false, streamingContent = '', isEditing = false }: DescriptionViewProps) {
    const [selectedSuggestions, setSelectedSuggestions] = useState<string[]>([])
    const editorRef = useRef<HTMLDivElement | null>(null)

    const addSuggestionToDescription = (suggestion: string) => {
        const cleanSuggestion = suggestion
            .replace(/^["']|["']$/g, '')
            .replace(/^,\s*|,\s*$/g, '')
            .replace(/^•\s*/, '')
            .trim()

        // Check if suggestion is already selected
        if (selectedSuggestions.includes(suggestion)) {
            return
        }

        // Add to description and selected suggestions
        const currentDesc = formData.description.trim()
        let newDesc = ''

        if (currentDesc && !currentDesc.includes('text-gray-400')) {
            newDesc = currentDesc + '<br>• ' + cleanSuggestion
        } else {
            newDesc = '• ' + cleanSuggestion
        }

        onFormDataChange({ description: newDesc })
        setSelectedSuggestions(prev => [...prev, suggestion])
    }

    const handleDescriptionChange = (value: string) => {
        onFormDataChange({ description: value })
    }

    return (
        <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -50 }}
            transition={{ duration: 0.3 }}
            className="space-y-4 md:space-y-6 px-2 md:px-0"
        >
            {/* Header */}
            <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="text-left"
            >
                <div className="flex items-start mb-4">
                    <div className="p-3 bg-blue-100 rounded-full mr-2">
                        <Sparkles className="md:w-8 md:h-8 h-5 w-5 text-blue-600" />
                    </div>
                    <div>
                        <h3 className="text-xl md:text-3xl font-bold text-gray-900">
                            Job Description
                        </h3>
                        <p className="text-base md:text-lg text-gray-600">Add details about your role and achievements</p>
                    </div>
                </div>
            </motion.div>

            {/* Description Input - Moved to top */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="space-y-3"
            >
                <label className="block text-sm font-medium text-gray-700">
                    Job Description & Achievements
                </label>
                <div className="bg-white overflow-hidden rounded-sm">
                    <SimpleRichTextEditor
                        value={formData.description}
                        onChange={handleDescriptionChange}
                        placeholder="• Describe your key responsibilities and achievements
• Use bullet points for better readability
• Include specific metrics and results when possible
• Highlight your impact and contributions"
                        height="200px"
                    />
                </div>
                <p className="text-gray-500 text-xs">
                    Use bullet points (•) to organize your description for better readability
                </p>
            </motion.div>

            {/* AI Suggestions - Moved to bottom */}
            {(isLoadingAI || aiSuggestions.length > 0 || streamingContent) && (
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                    className="space-y-4"
                >
                    <div className="flex items-center space-x-2">
                        <Sparkles className="w-5 h-5 text-blue-600" />
                        <h4 className="text-lg font-semibold text-gray-900">AI-Generated Suggestions</h4>
                        <span className="bg-blue-100 text-blue-700 text-xs px-2 py-1 rounded-full">
                            {isLoadingAI ? 'Generating...' : 'Auto-generated'}
                        </span>
                    </div>

                    {isLoadingAI ? (
                        <div className="space-y-4">
                            <div className="flex items-center justify-center py-4">
                                <div className="flex items-center space-x-3">
                                    <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
                                    <p className="text-gray-600">AI is generating personalized suggestions...</p>
                                </div>
                            </div>

                            {/* Show streaming content in real-time */}
                            {streamingContent && (
                                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                                    <div className="flex items-center space-x-2 mb-2">
                                        <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
                                        <span className="text-sm font-medium text-blue-700">Live Generation</span>
                                    </div>
                                    <div className="text-sm text-gray-700 font-mono bg-white p-3 rounded border">
                                        {streamingContent}
                                        <span className="animate-pulse">|</span>
                                    </div>
                                </div>
                            )}
                        </div>
                    ) : (
                        <>
                            <p className="text-gray-600 text-sm">
                                Click on any suggestion to add it to your description
                            </p>

                            <div className="grid gap-2 md:gap-3">
                                {aiSuggestions.map((suggestion, index) => {
                                    const isSelected = selectedSuggestions.includes(suggestion)
                                    const cleanSuggestion = suggestion
                                        .replace(/^["']|["']$/g, '')
                                        .replace(/^,\s*|,\s*$/g, '')
                                        .replace(/^•\s*/, '')
                                        .trim()

                                    return (
                                        <motion.button
                                            key={index}
                                            initial={{ opacity: 0, x: -20 }}
                                            animate={{ opacity: 1, x: 0 }}
                                            transition={{ delay: 0.1 * index }}
                                            onClick={() => addSuggestionToDescription(suggestion)}
                                            disabled={isSelected}
                                            className={`text-left p-3 md:p-4 rounded-sm border transition-all ${isSelected
                                                ? 'bg-green-50 border-green-200 cursor-not-allowed'
                                                : 'bg-white border-gray-300 hover:border-blue-600 hover:bg-blue-50 cursor-pointer'
                                                }`}
                                        >
                                            <div className="flex items-start space-x-3">
                                                <div className={`mt-1 w-5 h-5 rounded-full border-2 flex items-center justify-center ${isSelected
                                                    ? 'bg-green-500 border-green-500'
                                                    : 'border-gray-300'
                                                    }`}>
                                                    {isSelected && <Check className="w-3 h-3 text-white" />}
                                                </div>
                                                <span className={`text-sm ${isSelected ? 'text-green-700' : 'text-gray-700'}`}>
                                                    {cleanSuggestion}
                                                </span>
                                            </div>
                                        </motion.button>
                                    )
                                })}
                            </div>
                        </>
                    )}
                </motion.div>
            )}

            {/* Action Buttons */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="flex justify-between pt-4 border-t border-gray-300"
            >
                <motion.button
                    whileHover={{ scale: 1.02, x: -5 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={onBack}
                    className="flex items-center space-x-2 px-4 py-2 text-gray-600 hover:text-gray-800 font-medium transition-colors border border-black bg-white rounded-sm"
                >
                    <ChevronLeft className="w-4 h-4" />
                    <span>Back</span>
                </motion.button>

                <motion.button
                    whileHover={{ scale: 1.02, x: 5 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={onSave}
                    className="flex items-center space-x-2 px-6 py-2 bg-blue-600 text-white rounded-sm hover:bg-blue-700 font-semibold transition-all"
                >
                    <Check className="w-5 h-5" />
                    <span>{isEditing ? 'Update Experience' : 'Add Experience'}</span>
                </motion.button>
            </motion.div>
        </motion.div>
    )
}

export default DescriptionView
