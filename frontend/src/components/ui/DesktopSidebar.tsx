import React from 'react'
import { Check, User, Briefcase, GraduationCap, Award, Plus } from 'lucide-react'
import { useResumeStore } from '@/store/resumeStore'

interface DesktopSidebarProps {
  currentStep: number
  onStepChange: (step: number) => void
}

const steps = [
  {
    id: 1,
    title: 'Personal Information',
    icon: User,
    description: 'Basic contact details and profession'
  },
  {
    id: 2,
    title: 'Work Experience',
    icon: Briefcase,
    description: 'Employment history and achievements'
  },
  {
    id: 3,
    title: 'Education',
    icon: GraduationCap,
    description: 'Academic background and qualifications'
  },
  {
    id: 4,
    title: 'Skills & Summary',
    icon: Award,
    description: 'Professional skills and career summary'
  },
  {
    id: 5,
    title: 'Additional Information',
    icon: Plus,
    description: 'Certifications, languages, and more'
  }
]

function DesktopSidebar({ currentStep, onStepChange }: DesktopSidebarProps) {
  const { personalInfo, workExperience, education, skills, summary } = useResumeStore()
  
  const isStepCompleted = (stepId: number) => {
    switch (stepId) {
      case 1:
        return personalInfo.firstName && personalInfo.lastName && personalInfo.email && personalInfo.profession
      case 2:
        return workExperience.length > 0
      case 3:
        return education.length > 0
      case 4:
        return skills.length > 0 || summary
      case 5:
        return true // Optional step
      default:
        return false
    }
  }

  const canAccessStep = (stepId: number) => {
    if (stepId === 1) return true
    return isStepCompleted(stepId - 1) || stepId <= currentStep
  }

  return (
    <div className="w-80 bg-white border-r border-gray-200 h-full flex flex-col">
      <div className="p-6 border-b border-gray-200">
        <h2 className="text-xl font-bold text-gray-900">Create Your Resume</h2>
        <p className="text-sm text-gray-600 mt-1">Complete each step to build your professional resume</p>
      </div>
      
      <div className="flex-1 overflow-y-auto">
        <nav className="p-4 space-y-2">
          {steps.map((step) => {
            const Icon = step.icon
            const isCompleted = isStepCompleted(step.id)
            const isCurrent = step.id === currentStep
            const canAccess = canAccessStep(step.id)
            
            return (
              <button
                key={step.id}
                onClick={() => canAccess && onStepChange(step.id)}
                disabled={!canAccess}
                className={`w-full p-4 rounded-lg text-left transition-all duration-200 ${
                  isCurrent
                    ? 'bg-blue-50 border-l-4 border-blue-500 shadow-sm'
                    : canAccess
                    ? 'hover:bg-gray-50 border-l-4 border-transparent'
                    : 'opacity-50 cursor-not-allowed border-l-4 border-transparent'
                }`}
              >
                <div className="flex items-start space-x-3">
                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                      isCompleted
                        ? 'bg-green-500 text-white'
                        : isCurrent
                        ? 'bg-blue-500 text-white'
                        : canAccess
                        ? 'bg-gray-200 text-gray-600'
                        : 'bg-gray-100 text-gray-400'
                    }`}
                  >
                    {isCompleted ? (
                      <Check className="w-4 h-4" />
                    ) : (
                      <Icon className="w-4 h-4" />
                    )}
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center space-x-2">
                      <h3 className={`font-medium ${
                        isCurrent ? 'text-blue-900' : 'text-gray-900'
                      }`}>
                        {step.title}
                      </h3>
                      {isCompleted && (
                        <div className="w-2 h-2 bg-green-500 rounded-full" />
                      )}
                    </div>
                    <p className={`text-sm mt-1 ${
                      isCurrent ? 'text-blue-700' : 'text-gray-600'
                    }`}>
                      {step.description}
                    </p>
                  </div>
                </div>
              </button>
            )
          })}
        </nav>
      </div>
      
      <div className="p-4 border-t border-gray-200">
        <div className="text-center">
          <div className="text-sm text-gray-600 mb-2">Progress</div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div
              className="bg-blue-500 h-2 rounded-full transition-all duration-300"
              style={{
                width: `${(steps.filter(s => isStepCompleted(s.id)).length / steps.length) * 100}%`
              }}
            />
          </div>
          <div className="text-xs text-gray-500 mt-1">
            {steps.filter(s => isStepCompleted(s.id)).length} of {steps.length} completed
          </div>
        </div>
      </div>
    </div>
  )
}

export default DesktopSidebar
