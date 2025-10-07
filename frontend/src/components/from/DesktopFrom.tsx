import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useRouter } from 'next/navigation'
import { useStepNavigation } from '@/hooks/useStepNavigation'
import DesktopSidebar from '@/components/ui/DesktopSidebar'
import StepIndicator from '@/components/ui/StepIndicator'
import ResumePreview from '@/components/ui/ResumePreview'
import PersonalInfoStep from './steps/PersonalInfoStep'
import WorkExperienceStep from './steps/WorkExperienceStep'
import EducationStep from './steps/EducationStep'
import SkillsStep from './steps/SkillsStep'
import ProjectsStep from './steps/ProjectsStep'
import SummaryStep from './steps/SummaryStep'
import TemplateSelector from '@/components/TemplateSelector'
import { CV_TEMPLATES } from '@/constants/templates'
import { useResumeStore } from '@/store/resumeStore'
import { TemplatePreview } from '@/components/templates/TemplateRenderer'
import { COLOR_THEMES } from '@/components/ui/ColorThemePicker'
import { Palette, X, Eye } from 'lucide-react'

function DesktopFrom() {
    const router = useRouter()
    const { currentStep, setCurrentStep } = useStepNavigation()
    const { templateId, setTemplateId, colorTheme, setColorTheme } = useResumeStore()
    const [showTemplateSelector, setShowTemplateSelector] = useState(false)
    const [showResumePopup, setShowResumePopup] = useState(false)

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

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3 }}
            className="min-h-screen bg-white"
        >
            {/* Mobile Step Indicator - shown on small/medium screens */}
            <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 0.1 }}
                className="lg:hidden"
            >
                <StepIndicator currentStep={currentStep} totalSteps={6} />
            </motion.div>

            {/* Left Sidebar - Hidden on mobile */}
            <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.4, delay: 0.2 }}
                className="hidden lg:block"
            >
                <DesktopSidebar currentStep={currentStep} onStepChange={setCurrentStep} />
            </motion.div>

            <div className="lg:ml-10 flex flex-col lg:flex-row min-h-screen">
                <div className="flex-1 px-2 py-1 md:px-3 md:py-2">
                    <div className="max-w-4xl mx-auto">
                        <div className="bg-white">
                            <AnimatePresence mode="wait">
                                <motion.div
                                    key={currentStep}
                                    initial={{ opacity: 0, x: 20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    exit={{ opacity: 0, x: -20 }}
                                    transition={{ duration: 0.3 }}
                                    className="px-1 py-2 md:px-2 md:py-3"
                                >
                                    {renderCurrentStep()}
                                </motion.div>
                            </AnimatePresence>
                        </div>
                    </div>
                </div>

                <motion.div
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.4, delay: 0.3 }}
                    className="hidden xl:block w-96 pointer-events-none pr-20"
                >
                    <div className="sticky top-0 h-screen flex flex-col justify-center">
                        <div className="flex flex-col items-center space-y-4">
                            <div
                                className="relative group scale-[0.52] cursor-pointer pointer-events-auto"
                                onClick={() => setShowResumePopup(true)}
                            >
                                <ResumePreview onlyonepage={true} />
                                {/* Hover overlay with view icon */}
                                <div className="absolute inset-0 bg-black/10 group-hover:bg-opacity-20 transition-all duration-200 flex items-center justify-center opacity-0 group-hover:opacity-100 pointer-events-none">
                                    <div className="bg-white rounded-full p-3 shadow-lg pointer-events-auto">
                                        <Eye className="w-6 h-6 text-gray-700" />
                                    </div>
                                </div>
                            </div>
                            <button
                                onClick={() => setShowTemplateSelector(true)}
                                className="absolute bottom-14 bg-blue-600 hover:bg-blue-700 text-white px-3 py-2 rounded-lg flex items-center space-x-2 transition-colors shadow-lg font-medium text-xs whitespace-nowrap z-50 pointer-events-auto"
                            >
                                <Palette className="w-3 h-3" />
                                <span>Change Template</span>
                            </button>
                        </div>
                    </div>
                </motion.div>
            </div>

            {/* Template Selector Modal */}
            {showTemplateSelector && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
                    <div className="bg-white rounded-2xl shadow-2xl max-w-6xl w-full max-h-[90vh] overflow-hidden">
                        <div className="flex items-center justify-between p-6 border-b">
                            <h2 className="text-2xl font-bold text-gray-900">Choose Template</h2>
                            <button
                                onClick={() => setShowTemplateSelector(false)}
                                className="text-gray-400 hover:text-gray-600 p-1"
                            >
                                <X className="w-6 h-6" />
                            </button>
                        </div>

                        <div className="p-6 border-b">
                            <p className="text-sm font-medium text-gray-700 mb-3">Color Theme</p>
                            <div className="flex gap-2 overflow-x-auto">
                                {COLOR_THEMES.map((theme) => (
                                    <button
                                        key={theme.name}
                                        onClick={() => setColorTheme(theme)}
                                        className={`flex-shrink-0 p-2 rounded-lg border-2 transition-all ${
                                            colorTheme.name === theme.name
                                                ? 'border-blue-500 bg-blue-50'
                                                : 'border-gray-200 hover:border-gray-300'
                                        }`}
                                        title={theme.name}
                                    >
                                        <div 
                                            className="w-4 h-4 rounded border border-gray-300" 
                                            style={{ 
                                            backgroundColor: theme.colors?.primary || '#ffffff',
                                            backgroundImage: theme.colors ? undefined : 'linear-gradient(45deg, #e5e7eb 25%, transparent 25%), linear-gradient(-45deg, #e5e7eb 25%, transparent 25%), linear-gradient(45deg, transparent 75%, #e5e7eb 75%), linear-gradient(-45deg, transparent 75%, #e5e7eb 75%)',
                                            backgroundSize: theme.colors ? undefined : '4px 4px',
                                            backgroundPosition: theme.colors ? undefined : '0 0, 0 2px, 2px -2px, -2px 0px'
                                        }}
                                        />
                                    </button>
                                ))}
                            </div>
                        </div>

                        <div className="p-6 overflow-y-auto max-h-[calc(90vh-120px)]">
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                {CV_TEMPLATES.map((template) => (
                                    <div
                                        key={template.id}
                                        className={`relative cursor-pointer rounded-xl border-2 transition-all overflow-hidden bg-white shadow-sm hover:shadow-md ${templateId === template.id.toString()
                                            ? 'border-blue-500 ring-2 ring-blue-200'
                                            : 'border-gray-200 hover:border-blue-300'
                                            }`}
                                        onClick={() => {
                                            setTemplateId(template.id.toString())
                                            setShowTemplateSelector(false)
                                            const currentUrl = new URL(window.location.href)
                                            currentUrl.pathname = `/template/${template.id}`
                                            router.push(currentUrl.toString())
                                        }}
                                    >
                                        <div className="aspect-[1/1.414] overflow-hidden relative bg-white flex items-center justify-center p-1">
                                            <div className="w-full h-full origin-center">
                                                <TemplatePreview 
                                                    templateId={template.id} 
                                                    size="small" 
                                                    colors={colorTheme.colors}
                                                />
                                            </div>
                                        </div>

                                        <div className="absolute bottom-0 left-0 right-0 p-3">
                                            <div className="text-center">
                                                <button className="w-full bg-blue-600 hover:bg-blue-700 text-white py-1.5 px-3 rounded text-xs transition-colors font-medium">
                                                    {templateId === template.id.toString() ? 'Selected' : 'Use This Template'}
                                                </button>
                                            </div>
                                        </div>

                                        {/* Selected Indicator */}
                                        {templateId === template.id.toString() && (
                                            <div className="absolute top-2 right-2 bg-blue-500 text-white rounded-full p-1">
                                                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                                                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                                </svg>
                                            </div>
                                        )}
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Resume Preview Popup */}
            {showResumePopup && (
                <div className="fixed inset-0 z-50" style={{ backgroundColor: 'rgba(0, 0, 0, 0.2)' }}>
                    {/* Close button */}
                    <button
                        onClick={() => setShowResumePopup(false)}
                        className="absolute top-4 right-6 z-10 bg-white rounded-full p-2 shadow-lg hover:shadow-xl transition-shadow"
                    >
                        <X className="w-5 h-5 text-gray-600" />
                    </button>

                    {/* Full Resume Preview */}
                    <div className="w-full h-full overflow-y-auto py-5" style={{ display: 'block' }}>
                        <div className="mx-auto" style={{ width: 'fit-content' }}>
                            <ResumePreview />
                        </div>
                    </div>
                </div>
            )}
        </motion.div>
    )
}

export default DesktopFrom