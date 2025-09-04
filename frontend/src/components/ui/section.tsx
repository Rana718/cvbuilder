import * as React from "react"
import { cn } from "@/lib/utils"
import { Separator } from "./separator"

interface SectionProps extends React.HTMLAttributes<HTMLDivElement> {
  title?: string
  description?: string
  children: React.ReactNode
  showDivider?: boolean
}

const Section = React.forwardRef<HTMLDivElement, SectionProps>(
  ({ className, title, description, children, showDivider = true, ...props }, ref) => {
    return (
      <>
        <div
          ref={ref}
          className={cn("section-spacing", className)}
          {...props}
        >
          {title && (
            <div className="mb-6">
              <h2 className="text-2xl font-semibold text-foreground mb-2">
                {title}
              </h2>
              {description && (
                <p className="text-muted-foreground text-base">
                  {description}
                </p>
              )}
            </div>
          )}
          <div className="space-y-6">
            {children}
          </div>
        </div>
        {showDivider && <Separator className="my-0" />}
      </>
    )
  }
)

Section.displayName = "Section"

interface FormSectionProps extends React.HTMLAttributes<HTMLDivElement> {
  title: string
  description?: string
  children: React.ReactNode
}

const FormSection = React.forwardRef<HTMLDivElement, FormSectionProps>(
  ({ className, title, description, children, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn("space-y-6", className)}
        {...props}
      >
        <div>
          <h3 className="text-xl font-semibold text-foreground mb-2">
            {title}
          </h3>
          {description && (
            <p className="text-muted-foreground text-sm">
              {description}
            </p>
          )}
        </div>
        <div className="grid gap-4">
          {children}
        </div>
      </div>
    )
  }
)

FormSection.displayName = "FormSection"

export { Section, FormSection }
