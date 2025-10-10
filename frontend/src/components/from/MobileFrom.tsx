import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useStepNavigation } from '@/hooks/useStepNavigation'
import { usePremiumStatus } from '@/hooks/usePremiumStatus'
import { ArrowLeft, ChevronDown, FileText, X } from 'lucide-react'
import { useRouter } from 'next/navigation'
import ResumePreview from '@/components/ui/ResumePreview'
import PersonalInfoStep from './steps/PersonalInfoStep'
import WorkExperienceStep from './steps/WorkExperienceStep'
import EducationStep from './steps/EducationStep'
import SkillsStep from './steps/SkillsStep'
import ProjectsStep from './steps/ProjectsStep'
import SummaryStep from './steps/SummaryStep'

const STEPS = [
    { id: 1, name: 'Personal Info', icon: '👤' },
    { id: 2, name: 'Experience', icon: '💼' },
    { id: 3, name: 'Education', icon: '🎓' },
    { id: 4, name: 'Skills', icon: '⚡' },
    { id: 5, name: 'Projects', icon: '🚀' },
    { id: 6, name: 'Summary', icon: '📝' }
]

function MobileFrom() {
    const { currentStep, setCurrentStep } = useStepNavigation()
    const { isPremium } = usePremiumStatus()
    const [showStepMenu, setShowStepMenu] = useState(false)
    const [showResumePreview, setShowResumePreview] = useState(false)
    const router = useRouter()

    const nextStep = () => {
        if (currentStep < 6) {
            setCurrentStep(currentStep + 1)
        }
    }

    const prevStep = () => {
        if (currentStep > 1) {
            setCurrentStep(currentStep - 1)
        }
    }

    const renderCurrentStep = () => {
        const stepComponents = {
            1: <PersonalInfoStep onNext={nextStep} />,
            2: <WorkExperienceStep onNext={nextStep} onPrev={prevStep} />,
            3: <EducationStep onNext={nextStep} onPrev={prevStep} />,
            4: <SkillsStep onNext={nextStep} onPrev={prevStep} />,
            5: <ProjectsStep onNext={nextStep} onPrev={prevStep} />,
            6: <SummaryStep onNext={nextStep} onPrev={prevStep} />
        }
        
        return stepComponents[currentStep as keyof typeof stepComponents] || stepComponents[1]
    }

    const currentStepInfo = STEPS.find(step => step.id === currentStep)
    const completedSteps = currentStep - 1
    const progressPercentage = (completedSteps / STEPS.length) * 100

    return (
        <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3 }}
            className="min-h-screen bg-white"
        >
            {/* Mobile Top Bar */}
            <div className="sticky top-0 z-40 bg-white border-b border-gray-200 px-4 py-3">
                <div className="flex items-center justify-between">
                    {/* Back Button */}
                    <button
                        onClick={() => router.push('/template')}
                        className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                    >
                        <ArrowLeft className="w-5 h-5 text-gray-600" />
                    </button>

                    {/* Step Indicator with Dropdown */}
                    <div className="flex-1 mx-4">
                        <button
                            onClick={() => setShowStepMenu(!showStepMenu)}
                            className="w-full flex items-center justify-center space-x-2 p-2 hover:bg-gray-50 rounded-lg transition-colors"
                        >
                            <span className="text-sm font-medium text-gray-900">
                                Step {currentStep} of {STEPS.length}
                            </span>
                            <ChevronDown className={`w-4 h-4 text-gray-500 transition-transform ${showStepMenu ? 'rotate-180' : ''}`} />
                        </button>

                        {/* Progress Bar */}
                        <div className="mt-2 w-full bg-gray-200 rounded-full h-1">
                            <div 
                                className="bg-blue-600 h-1 rounded-full transition-all duration-300"
                                style={{ width: `${progressPercentage}%` }}
                            />
                        </div>
                    </div>

                    {/* Resume Preview Button */}
                    <button
                        onClick={() => setShowResumePreview(true)}
                        className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                    >
                        <FileText className="w-5 h-5 text-gray-600" />
                    </button>
                </div>

                {/* Step Navigation Dropdown */}
                <AnimatePresence>
                    {showStepMenu && (
                        <motion.div
                            initial={{ opacity: 0, y: -10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                            className="absolute top-full left-0 right-0 bg-white border-b border-gray-200 shadow-lg"
                        >
                            <div className="p-4 space-y-2">
                                {STEPS.map((step) => (
                                    <button
                                        key={step.id}
                                        onClick={() => {
                                            setCurrentStep(step.id)
                                            setShowStepMenu(false)
                                        }}
                                        className={`w-full flex items-center space-x-3 p-3 rounded-lg text-left transition-colors ${
                                            currentStep === step.id
                                                ? 'bg-blue-50 border border-blue-200'
                                                : 'hover:bg-gray-50'
                                        }`}
                                    >
                                        <span className="text-lg">{step.icon}</span>
                                        <div className="flex-1">
                                            <div className="font-medium text-gray-900">{step.name}</div>
                                            <div className="text-sm text-gray-500">Step {step.id}</div>
                                        </div>
                                        {step.id < currentStep && (
                                            <div className="w-5 h-5 bg-green-500 rounded-full flex items-center justify-center">
                                                <div className="w-2 h-2 bg-white rounded-full" />
                                            </div>
                                        )}
                                        {step.id === currentStep && (
                                            <div className="w-5 h-5 bg-blue-500 rounded-full flex items-center justify-center">
                                                <div className="w-2 h-2 bg-white rounded-full" />
                                            </div>
                                        )}
                                    </button>
                                ))}
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>

            {/* Main Content */}
            <div className="px-2 py-1 sm:px-3 sm:py-2">
                <div className="bg-white">
                    <AnimatePresence mode="wait">
                        <motion.div
                            key={currentStep}
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -20 }}
                            transition={{ duration: 0.3 }}
                            className="px-1 py-2 sm:px-2 sm:py-3"
                        >
                            {renderCurrentStep()}
                        </motion.div>
                    </AnimatePresence>
                </div>
            </div>

            {/* Resume Preview Modal */}
            <AnimatePresence>
                {showResumePreview && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-50"
                        style={{ backgroundColor: 'rgba(0, 0, 0, 0.2)' }}
                    >
                        {/* Close button */}
                        <button
                            onClick={() => setShowResumePreview(false)}
                            className="absolute top-4 right-4 z-10 bg-white rounded-full p-2 shadow-lg hover:shadow-xl transition-shadow"
                        >
                            <X className="w-5 h-5 text-gray-600" />
                        </button>

                        {/* Full Resume Preview */}
                        <div className="w-full h-full overflow-y-auto py-5 flex justify-center">
                            <div className="scale-[0.45] origin-top" style={{ width: 'fit-content' }}>
                                <ResumePreview pass={isPremium} />
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </motion.div>
    )
}

export default MobileFrom
