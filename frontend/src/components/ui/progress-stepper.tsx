import * as React from "react"
import { cn } from "@/lib/utils"
import { Check } from "lucide-react"

interface Step {
  id: string
  title: string
  description?: string
}

interface ProgressStepperProps {
  steps: Step[]
  currentStep: string
  completedSteps: string[]
  className?: string
}

const ProgressStepper = React.forwardRef<HTMLDivElement, ProgressStepperProps>(
  ({ steps, currentStep, completedSteps, className }, ref) => {
    const currentIndex = steps.findIndex(step => step.id === currentStep)
    
    return (
      <div ref={ref} className={cn("w-full", className)}>
        <div className="flex items-center justify-between">
          {steps.map((step, index) => {
            const isCompleted = completedSteps.includes(step.id)
            const isCurrent = step.id === currentStep
            const isUpcoming = index > currentIndex
            
            return (
              <React.Fragment key={step.id}>
                <div className="flex flex-col items-center">
                  {/* Step Circle */}
                  <div
                    className={cn(
                      "flex h-12 w-12 items-center justify-center rounded-full border-2 transition-all duration-200",
                      {
                        "bg-primary border-primary text-primary-foreground shadow-md": isCompleted,
                        "bg-primary/10 border-primary text-primary shadow-md scale-110": isCurrent,
                        "bg-muted border-border text-muted-foreground": isUpcoming,
                      }
                    )}
                  >
                    {isCompleted ? (
                      <Check className="h-5 w-5" />
                    ) : (
                      <span className="text-sm font-semibold">{index + 1}</span>
                    )}
                  </div>
                  
                  {/* Step Label */}
                  <div className="mt-3 text-center">
                    <p
                      className={cn(
                        "text-sm font-medium transition-colors",
                        {
                          "text-primary": isCompleted || isCurrent,
                          "text-muted-foreground": isUpcoming,
                        }
                      )}
                    >
                      {step.title}
                    </p>
                    {step.description && (
                      <p className="text-xs text-muted-foreground mt-1">
                        {step.description}
                      </p>
                    )}
                  </div>
                </div>
                
                {/* Connector Line */}
                {index < steps.length - 1 && (
                  <div className="flex-1 mx-4 mb-8">
                    <div
                      className={cn(
                        "h-0.5 transition-colors duration-200",
                        {
                          "bg-primary": index < currentIndex,
                          "bg-border": index >= currentIndex,
                        }
                      )}
                    />
                  </div>
                )}
              </React.Fragment>
            )
          })}
        </div>
      </div>
    )
  }
)

ProgressStepper.displayName = "ProgressStepper"

export { ProgressStepper, type Step }
