import { useRouter, useSearchParams, usePathname } from 'next/navigation'
import { useEffect, useCallback } from 'react'
import { useResumeStore } from '@/store/resumeStore'

export function useStepNavigation() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const pathname = usePathname()
  const { currentStep, setCurrentStep: setStoreStep } = useResumeStore()

  // Update URL when step changes
  const updateURL = useCallback((step: number) => {
    const params = new URLSearchParams(searchParams.toString())
    const currentUrlStep = params.get('step')

    if (currentUrlStep !== step.toString()) {
      params.set('step', step.toString())
      router.push(`${pathname}?${params.toString()}`, { scroll: false })
    }
  }, [pathname, router, searchParams])

  // Read step from URL on mount and when URL changes
  useEffect(() => {
    const stepFromURL = searchParams.get('step')
    if (stepFromURL) {
      const step = parseInt(stepFromURL, 10)
      if (step >= 1 && step <= 6 && step !== currentStep) {
        setStoreStep(step)
      }
    } else {
      // If no step in URL, set step 1 and update URL
      if (currentStep !== 1) {
        setStoreStep(1)
      }
      updateURL(1)
    }
  }, [searchParams, setStoreStep, currentStep, updateURL])

  // Custom setCurrentStep that updates both store and URL
  const setCurrentStep = useCallback((step: number) => {
    setStoreStep(step)
    updateURL(step)
  }, [setStoreStep, updateURL])

  return {
    currentStep,
    setCurrentStep
  }
}
