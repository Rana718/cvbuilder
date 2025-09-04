import * as React from "react"
import { cn } from "@/lib/utils"
import { Button } from "./button"
import { ProgressStepper, type Step } from "./progress-stepper"

interface FormLayoutProps {
  children: React.ReactNode
  className?: string
  steps?: Step[]
  currentStep?: string
  completedSteps?: string[]
  onNext?: () => void
  onPrevious?: () => void
  nextLabel?: string
  previousLabel?: string
  showNavigation?: boolean
  isNextDisabled?: boolean
  isPreviousDisabled?: boolean
}

const FormLayout = React.forwardRef<HTMLDivElement, FormLayoutProps>(
  ({
    children,
    className,
    steps,
    currentStep,
    completedSteps = [],
    onNext,
    onPrevious,
    nextLabel = "next",
    previousLabel = "back",
    showNavigation = true,
    isNextDisabled = false,
    isPreviousDisabled = false,
    ...props
  }, ref) => {
    return (
      <div
        ref={ref}
        className={cn("min-h-screen bg-background", className)}
        {...props}
      >
        {/* Progress Stepper */}
        {steps && currentStep && (
          <div className="">
            <div className="max-w-4xl mx-auto px-6 py-8">
              <ProgressStepper
                steps={steps}
                currentStep={currentStep}
                completedSteps={completedSteps}
              />
            </div>
          </div>
        )}

        {/* Main Content */}
        <div className="max-w-4xl mx-auto">
          <div className="bg-white min-h-[calc(100vh-200px)]">
            {children}
          </div>
        </div>

        {/* Navigation */}
        {showNavigation && (
          <div className="sticky bottom-0">
            <div className="max-w-4xl mx-auto px-6 py-6">
              <div className="flex justify-between items-center">
                <div>
                  {onPrevious && (
                    <Button
                      variant="outline"
                      onClick={onPrevious}
                      disabled={isPreviousDisabled}
                      className="min-w-[120px]"
                    >
                      {previousLabel}
                    </Button>
                  )}
                </div>
                <div className="flex gap-3">
                  {onNext && (
                    <Button
                      onClick={onNext}
                      disabled={isNextDisabled}
                      className="min-w-[140px]"
                    >
                      {nextLabel}
                    </Button>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    )
  }
)

FormLayout.displayName = "FormLayout"

export { FormLayout }
