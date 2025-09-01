import React from 'react'
import { User, Briefcase, GraduationCap, Award, FileText, Plus } from 'lucide-react'
import { useResumeStore } from '@/store/resumeStore'

interface DesktopSidebarProps {
  currentStep: number
  onStepChange: (step: number) => void
}

const steps = [
  { id: 1, title: 'Personal Information', icon: User },
  { id: 2, title: 'Work Experience', icon: Briefcase },
  { id: 3, title: 'Education', icon: GraduationCap },
  { id: 4, title: 'Skills', icon: Award },
  { id: 5, title: 'Summary', icon: FileText }
]

function DesktopSidebar({ currentStep, onStepChange }: DesktopSidebarProps) {
  return (
    <div className="w-64 bg-white ml-2 rounded-2xl h-full mt-20 relative">
      
      <nav className="p-4 space-y-6">
        {steps.map((step, index) => {
          const Icon = step.icon
          const isCurrent = step.id === currentStep
          const isPast = step.id < currentStep
          
          return (
            <button
              key={step.id}
              onClick={() => onStepChange(step.id)}
              className="w-full text-left transition-all duration-200 relative"
            >
              <div className="flex items-center space-x-4">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center relative z-10 transition-all ${
                  isCurrent
                    ? 'bg-blue-500 text-white shadow-lg shadow-blue-500/30'
                    : isPast
                    ? 'bg-blue-100 text-blue-600'
                    : 'bg-gray-100 text-gray-400'
                }`}>
                  <Icon className="w-4 h-4" />
                </div>
                
                <span className={`font-medium transition-colors ${
                  isCurrent
                    ? 'text-blue-600'
                    : isPast
                    ? 'text-gray-700'
                    : 'text-gray-500'
                }`}>
                  {step.title}
                </span>
              </div>
              

            </button>
          )
        })}
      </nav>
    </div>
  )
}

export default DesktopSidebar