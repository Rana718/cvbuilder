import React from 'react'
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
            {/* Mobile Step Indicator - shown on small/medium screens */}
            <div className="lg:hidden">
                <StepIndicator currentStep={currentStep} totalSteps={6} />
            </div>

            {/* Left Sidebar - Hidden on mobile */}
            <div className="hidden lg:block">
                <DesktopSidebar currentStep={currentStep} onStepChange={setCurrentStep} />
            </div>

            {/* Main Content - responsive layout */}
            <div className="lg:ml-16 flex flex-col lg:flex-row min-h-screen">
                {/* Form Section */}
                <div className="flex-1 p-3 md:p-6">
                    <div className="max-w-4xl mx-auto">
                        <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
                            <div className="p-4 md:p-8">
                                {renderCurrentStep()}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Right Preview Section - Hidden on mobile/tablet, shown on large screens */}
                <div className="hidden xl:block w-96 border-l">
                    <div className="sticky top-0 h-screen flex flex-col">
                        <div className="flex-1 p-6 overflow-hidden">
                            <div className="scale-75 origin-top h-full overflow-hidden">
                                <div className="h-full">
                                    <ResumePreview mode="live" />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default DesktopFrom