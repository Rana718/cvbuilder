import React from 'react'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { motion } from 'framer-motion'

interface StepNavigationProps {
  onPrev?: () => void
  onNext?: () => void
  nextText?: string
  prevText?: string
  nextDisabled?: boolean
  prevDisabled?: boolean
  isLoading?: boolean
  showPrev?: boolean
  showNext?: boolean
}

export function StepNavigation({
  onPrev,
  onNext,
  nextText = "Next",
  prevText = "Previous", 
  nextDisabled = false,
  prevDisabled = false,
  isLoading = false,
  showPrev = true,
  showNext = true
}: StepNavigationProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex justify-between items-center p-3 md:p-4 bg-white border-t border-gray-200"
    >
      {showPrev ? (
        <motion.button
          whileHover={{ scale: 1.02, x: -5 }}
          whileTap={{ scale: 0.98 }}
          onClick={onPrev}
          disabled={prevDisabled}
          className="flex items-center space-x-2 px-4 md:px-6 py-2 md:py-3 text-gray-600 hover:text-gray-800 font-medium transition-colors disabled:opacity-50"
        >
          <ChevronLeft className="w-4 h-4" />
          <span className="hidden sm:inline">{prevText}</span>
        </motion.button>
      ) : <div />}

      {showNext && (
        <motion.button
          whileHover={{ scale: 1.02, x: 5 }}
          whileTap={{ scale: 0.98 }}
          onClick={onNext}
          disabled={nextDisabled || isLoading}
          className="flex items-center space-x-2 px-4 md:px-8 py-2 md:py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl hover:from-blue-700 hover:to-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed font-semibold shadow-lg hover:shadow-xl transition-all"
        >
          <span>{isLoading ? 'Loading...' : nextText}</span>
          <ChevronRight className="w-4 h-4" />
        </motion.button>
      )}
    </motion.div>
  )
}
