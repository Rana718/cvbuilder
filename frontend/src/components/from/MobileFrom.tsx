import React from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useStepNavigation } from '@/hooks/useStepNavigation'
import StepIndicator from '@/components/ui/StepIndicator'
import PersonalInfoStep from './steps/PersonalInfoStep'
import WorkExperienceStep from './steps/WorkExperienceStep'
import EducationStep from './steps/EducationStep'
import SkillsStep from './steps/SkillsStep'
import ProjectsStep from './steps/ProjectsStep'
import SummaryStep from './steps/SummaryStep'
// import AdditionalInfoStep from './steps/AdditionalInfoStep'

function MobileFrom() {
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
            {/* Step Indicator */}
            <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 0.1 }}
            >
                <StepIndicator currentStep={currentStep} totalSteps={6} />
            </motion.div>

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
        </motion.div>
    )
}

export default MobileFrom