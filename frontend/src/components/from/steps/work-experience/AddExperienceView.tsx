'use client'

import React from 'react'
import { motion } from 'framer-motion'
import { Plus, Briefcase, ArrowRight } from 'lucide-react'
import { useResumeStore } from '@/store/resumeStore'
import type { WorkExperience } from '@/store/resumeStore'

interface AddExperienceViewProps {
    onAddExperience: () => void
    onEditExperience: (experience: WorkExperience) => void
    onSkip: () => void
}

function AddExperienceView({ onAddExperience, onEditExperience, onSkip }: AddExperienceViewProps) {
    const { workExperience, removeWorkExperience } = useResumeStore()

    const handleEdit = (experience: WorkExperience) => {
        onEditExperience(experience)
    }

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
            className="space-y-3 md:space-y-4 lg:space-y-6 px-1 md:px-0"
        >
            {/* Header */}
            <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="text-center"
            >
                <div className="flex items-center justify-center mb-3 md:mb-4">
                    <div className="p-1.5 md:p-2 lg:p-3 bg-blue-100 rounded-full mr-2">
                        <Briefcase className="w-4 h-4 md:w-6 md:h-6 lg:w-8 lg:h-8 text-blue-600" />
                    </div>
                </div>
                <h2 className="text-lg md:text-2xl lg:text-3xl font-bold text-black">Work Experience</h2>
                <p className="text-sm md:text-base lg:text-lg text-gray-600">Tell us about your professional journey</p>
                <div className="w-16 md:w-20 lg:w-24 h-1 bg-blue-600 rounded-sm mx-auto mt-3 md:mt-4"></div>
            </motion.div>

            {/* Existing Experiences */}
            {workExperience.length > 0 && (
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    className="space-y-4"
                >
                    <h3 className="text-lg font-semibold text-gray-800 mb-4">Your Experiences</h3>
                    {workExperience.map((experience, index) => (
                        <motion.div
                            key={experience.id}
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: index * 0.1 }}
                            className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-xl p-4 md:p-6 hover:shadow-md transition-all"
                        >
                            <div className="flex flex-col sm:flex-row justify-between items-start gap-4">
                                <div className="flex-1">
                                    <h4 className="font-semibold text-gray-900 text-base md:text-lg">
                                        {experience.jobTitle}
                                        {experience.role && (
                                            <span className="text-blue-600 font-normal ml-2">({experience.role})</span>
                                        )}
                                    </h4>
                                    <p className="text-blue-600 font-medium text-sm md:text-base">{experience.employer}</p>
                                    <p className="text-gray-600 text-xs md:text-sm">
                                        {experience.startDate} - {experience.isCurrentlyWorking ? 'Present' : experience.endDate}
                                    </p>
                                    <p className="text-gray-500 text-xs md:text-sm">
                                        {experience.isRemote ? 'Remote' : experience.location || 'Location not specified'}
                                    </p>
                                </div>
                                <div className="flex space-x-2 self-start sm:self-center">
                                    <button
                                        onClick={() => handleEdit(experience)}
                                        className="p-1.5 md:p-2 text-blue-600 hover:bg-blue-100 rounded-lg transition-colors"
                                    >
                                        <svg className="w-3 h-3 md:w-4 md:h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                        </svg>
                                    </button>
                                    <button
                                        onClick={() => removeWorkExperience(experience.id)}
                                        className="p-1.5 md:p-2 text-red-600 hover:bg-red-100 rounded-lg transition-colors"
                                    >
                                        <svg className="w-3 h-3 md:w-4 md:h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                        </svg>
                                    </button>
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </motion.div>
            )}

            {/* Add Experience Button */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="flex justify-center"
            >
                <motion.button
                    whileHover={{ scale: 1.05, y: -2 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={onAddExperience}
                    className="group bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white px-6 md:px-8 py-3 md:py-4 rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all flex items-center space-x-2 md:space-x-3 text-sm md:text-base"
                >
                    <Plus className="w-4 h-4 md:w-5 md:h-5 group-hover:rotate-90 transition-transform" />
                    <span>Add Work Experience</span>
                </motion.button>
            </motion.div>

            {/* Skip Option - Always show for better UX */}
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.4 }}
                className="text-center pt-6 border-t border-gray-200"
            >
                {workExperience.length === 0 ? (
                    <>
                        <p className="text-gray-500 text-sm mb-4">
                            Don't have work experience yet? That's perfectly fine!
                        </p>
                        <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={onSkip}
                            className="inline-flex items-center space-x-2 px-6 py-3 text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition-all font-medium shadow-md"
                        >
                            <span>Skip Work Experience</span>
                            <ArrowRight className="w-4 h-4" />
                        </motion.button>
                    </>
                ) : (
                    <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={onSkip}
                        className="inline-flex items-center space-x-2 px-4 py-2 text-gray-600 hover:text-gray-800 bg-gray-100 hover:bg-gray-200 rounded-lg transition-all font-medium"
                    >
                        <span>Continue without adding more</span>
                        <ArrowRight className="w-4 h-4" />
                    </motion.button>
                )}
            </motion.div>
        </motion.div>
    )
}

export default AddExperienceView
