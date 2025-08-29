import React from 'react'
import { Check } from 'lucide-react'

interface StepIndicatorProps {
  currentStep: number
  totalSteps: number
}

const stepLabels = [
  'Personal Info',
  'Experience', 
  'Education',
  'Skills & Summary',
  'Additional Info'
]

function StepIndicator({ currentStep, totalSteps }: StepIndicatorProps) {
  return (
    <div className="w-full bg-white border-b border-gray-200 px-4 py-4">
      <div className="flex items-center justify-between">
        {Array.from({ length: totalSteps }, (_, index) => {
          const step = index + 1
          const isCompleted = step < currentStep
          const isCurrent = step === currentStep
          
          return (
            <React.Fragment key={step}>
              <div className="flex flex-col items-center">
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                    isCompleted
                      ? 'bg-green-500 text-white'
                      : isCurrent
                      ? 'bg-blue-500 text-white'
                      : 'bg-gray-200 text-gray-600'
                  }`}
                >
                  {isCompleted ? (
                    <Check className="w-4 h-4" />
                  ) : (
                    step
                  )}
                </div>
                <span className={`text-xs mt-1 hidden sm:block ${
                  isCurrent ? 'text-blue-600 font-medium' : 'text-gray-500'
                }`}>
                  {stepLabels[index]}
                </span>
              </div>
              {step < totalSteps && (
                <div
                  className={`flex-1 h-0.5 mx-2 ${
                    isCompleted ? 'bg-green-500' : 'bg-gray-200'
                  }`}
                />
              )}
            </React.Fragment>
          )
        })}
      </div>
      
      {/* Show current step label on smaller screens */}
      <div className="text-center mt-2 sm:hidden">
        <span className="text-sm font-medium text-gray-800">
          {stepLabels[currentStep - 1]}
        </span>
        <span className="text-xs text-gray-500 ml-2">
          {currentStep} of {totalSteps}
        </span>
      </div>
    </div>
  )
}

export default StepIndicator
