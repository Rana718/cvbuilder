import React from 'react'
import { motion, AnimatePresence } from 'framer-motion'
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
// import AdditionalInfoStep from './steps/AdditionalInfoStep'

function DesktopFrom() {
    const { currentStep, setCurrentStep } = useStepNavigation()

    const nextStep = () => {
        if (currentStep < 6) {  // Changed from 5 to 6
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
            // 7: <AdditionalInfoStep onPrev={prevStep} />
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

            {/* Main Content - responsive layout */}
            <div className="lg:ml-16 flex flex-col lg:flex-row min-h-screen">
                {/* Form Section */}
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

                {/* Right Preview Section - Hidden on mobile/tablet, shown on large screens */}
                <motion.div 
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.4, delay: 0.3 }}
                    className="hidden xl:block w-120"
                >
                    <div className="sticky top-0 h-screen flex items-center justify-center">
                        <div className="w-full pr-1 scale-[0.4]">
                            <ResumePreview />
                        </div>
                    </div>
                </motion.div>

            </div>
        </motion.div>
    )
}

export default DesktopFrom