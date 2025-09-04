import React from 'react'
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
        switch (currentStep) {
            case 1:
                return <PersonalInfoStep onNext={nextStep} />
            case 2:
                return <WorkExperienceStep onNext={nextStep} onPrev={prevStep} />
            case 3:
                return <EducationStep onNext={nextStep} onPrev={prevStep} />
            case 4:
                return <SkillsStep onNext={nextStep} onPrev={prevStep} />
            case 5:
                return <ProjectsStep onNext={nextStep} onPrev={prevStep} />
            case 6:
                return <SummaryStep onNext={nextStep} onPrev={prevStep} />
            // case 7:
            //     return <AdditionalInfoStep onPrev={prevStep} />
            default:
                return <PersonalInfoStep onNext={nextStep} />
        }
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
            {/* Step Indicator */}
            <StepIndicator currentStep={currentStep} totalSteps={6} />

            {/* Main Content */}
            <div className="p-0 sm:p-4 pt-2">
                <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
                    <div className="p-2 sm:p-6">
                        {renderCurrentStep()}
                    </div>
                </div>
            </div>
        </div>
    )
}

export default MobileFrom