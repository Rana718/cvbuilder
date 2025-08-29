import React from 'react'
import { useStepNavigation } from '@/hooks/useStepNavigation'
import DesktopSidebar from '@/components/ui/DesktopSidebar'
import ResumePreview from '@/components/ui/ResumePreview'
import PersonalInfoStep from './steps/PersonalInfoStep'
import WorkExperienceStep from './steps/WorkExperienceStep'
import EducationStep from './steps/EducationStep'
import SkillsSummaryStep from './steps/SkillsSummaryStep'
import AdditionalInfoStep from './steps/AdditionalInfoStep'

function DesktopFrom() {
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
        <div className="min-h-screen bg-gray-50 flex">
            {/* Left Sidebar */}
            <DesktopSidebar currentStep={currentStep} onStepChange={setCurrentStep} />
            
            {/* Main Content */}
            <div className="flex-1 flex">
                {/* Form Section */}
                <div className="flex-1 max-w-4xl mx-auto p-8">
                    <div className="bg-white rounded-lg shadow-sm p-8">
                        {renderCurrentStep()}
                    </div>
                </div>

                {/* Right Preview Section */}
                <div className="w-96 p-6 border-l border-gray-200 bg-white">
                    <div className="sticky top-6">
                        <h3 className="text-lg font-semibold text-gray-900 mb-4">Live Preview</h3>
                        <div className="transform scale-75 origin-top-left" style={{ width: '133%', height: '800px', overflow: 'hidden' }}>
                            <ResumePreview />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default DesktopFrom