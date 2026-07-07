import React, { useState } from 'react'
import { User, Briefcase, GraduationCap, Award, FolderOpen, FileText, ChevronRight, Home } from 'lucide-react'
import { useRouter } from 'next/navigation'

interface DesktopSidebarProps {
  currentStep: number
  onStepChange: (step: number) => void
}

const steps = [
  { id: 1, title: 'Personal Information', icon: User },
  { id: 2, title: 'Work Experience', icon: Briefcase },
  { id: 3, title: 'Education', icon: GraduationCap },
  { id: 4, title: 'Skills', icon: Award },
  { id: 5, title: 'Projects', icon: FolderOpen },
  { id: 6, title: 'Summary', icon: FileText }
]

function DesktopSidebar({ currentStep, onStepChange }: DesktopSidebarProps) {
  const [isExpanded, setIsExpanded] = useState(false)
  const router = useRouter()

  return (
    <div 
      className={`transition-all duration-300 bg-gradient-to-b from-blue-600 to-blue-800 h-screen fixed left-0 top-0 z-40 ${
        isExpanded ? 'w-64' : 'w-16'
      }`}
      onMouseEnter={() => setIsExpanded(true)}
      onMouseLeave={() => setIsExpanded(false)}
    >
      {/* Header */}
      <div className="p-4 border-b border-blue-500/20">
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center">
            <span className="text-blue-600 font-bold text-sm">CV</span>
          </div>
          {isExpanded && (
            <div className="text-white">
              <h2 className="font-semibold text-white">Ai-rezume builder</h2>
              <p className="text-blue-200 text-xs">Create your perfect CV</p>
            </div>
          )}
        </div>
      </div>

      {/* Home Button */}
      <div className={`mt-4 ${isExpanded ? 'px-2' : 'px-2'}`}>
        <button
          onClick={() => router.push('/')}
          className={`w-full text-left transition-all duration-200 hover:bg-white/10 rounded-xl ${
            isExpanded ? 'p-3' : 'p-2 flex justify-center'
          }`}
        >
          <div className={`flex items-center ${isExpanded ? 'space-x-3' : 'justify-center'}`}>
            <div className="flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center bg-white/20 text-white border border-white/30">
              <Home className="w-4 h-4 flex-shrink-0" />
            </div>
            {isExpanded && (
              <div className="flex-1">
                <span className="font-medium text-blue-200 block">Home</span>
              </div>
            )}
          </div>
        </button>
      </div>

      {/* Navigation */}
      <nav className={`space-y-2 mt-4 ${isExpanded ? 'p-2' : 'px-2 py-2'}`}>
        {steps.map((step, index) => {
          const Icon = step.icon
          const isCurrent = step.id === currentStep
          const isPast = step.id < currentStep
          
          return (
            <button
              key={step.id}
              onClick={() => onStepChange(step.id)}
              className={`w-full text-left transition-all duration-200 relative group rounded-xl ${
                isExpanded ? 'p-3' : 'p-2 flex justify-center'
              } ${
                isCurrent 
                  ? 'bg-white/20 border border-white/30' 
                  : 'hover:bg-white/10'
              }`}
            >
              <div className={`flex items-center ${isExpanded ? 'space-x-3' : 'justify-center'}`}>
                {/* Step number indicator - Fixed to be perfectly circular */}
                <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center relative z-10 transition-all ${
                  isCurrent
                    ? 'bg-white text-blue-600 shadow-lg'
                    : isPast
                    ? 'bg-green-500 text-white'
                    : 'bg-white/20 text-white border border-white/30'
                }`}>
                  {isPast ? (
                    <svg className="w-4 h-4 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  ) : (
                    <Icon className="w-4 h-4 flex-shrink-0" />
                  )}
                </div>
                
                {/* Step title */}
                {isExpanded && (
                  <div className="flex-1">
                    <span className={`font-medium transition-colors block ${
                      isCurrent
                        ? 'text-white'
                        : isPast
                        ? 'text-blue-100'
                        : 'text-blue-200'
                    }`}>
                      {step.title}
                    </span>
                    {isCurrent && (
                      <span className="text-blue-200 text-xs">Current step</span>
                    )}
                  </div>
                )}

                {/* Arrow indicator for current step */}
                {isCurrent && isExpanded && (
                  <ChevronRight className="w-4 h-4 text-white" />
                )}
              </div>

              {/* Progress line */}
              {index < steps.length - 1 && isExpanded && (
                <div className="absolute left-7 top-12 w-0.5 h-6 bg-white/20">
                  {isPast && <div className="w-full h-full bg-green-500" />}
                </div>
              )}
            </button>
          )
        })}
      </nav>

      {/* Progress indicator */}
      <div className="absolute bottom-4 left-0 right-0 px-4">
        <div className="bg-white/20 rounded-full h-2">
          <div 
            className="bg-white rounded-full h-2 transition-all duration-500"
            style={{ width: `${(currentStep / steps.length) * 100}%` }}
          />
        </div>
        {isExpanded && (
          <p className="text-blue-200 text-xs mt-2 text-center">
            Step {currentStep} of {steps.length}
          </p>
        )}
      </div>
    </div>
  )
}

export default DesktopSidebar