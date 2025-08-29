import React from 'react'
import { useStepNavigation } from '@/hooks/useStepNavigation'
import StepIndicator from '@/components/ui/StepIndicator'
import PersonalInfoStep from './steps/PersonalInfoStep'
import WorkExperienceStep from './steps/WorkExperienceStep'
import EducationStep from './steps/EducationStep'
import SkillsSummaryStep from './steps/SkillsSummaryStep'
import AdditionalInfoStep from './steps/AdditionalInfoStep'

function MobileFrom() {
    const { currentStep, setCurrentStep } = useStepNavigation()

    const nextStep = () => {
        if (currentStep < 5) {
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
                return <SkillsSummaryStep onNext={nextStep} onPrev={prevStep} />
            case 5:
                return <AdditionalInfoStep onPrev={prevStep} />
            default:
                return <PersonalInfoStep onNext={nextStep} />
        }
    }

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Step Indicator */}
            <StepIndicator currentStep={currentStep} totalSteps={5} />
            
            {/* Main Content */}
            <div className="p-4">
                <div className="bg-white rounded-lg shadow-sm p-6">
                    {renderCurrentStep()}
                </div>
            </div>
        </div>
    )
}

export default MobileFrom