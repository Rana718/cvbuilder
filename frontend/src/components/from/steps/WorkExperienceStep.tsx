'use client'

import React, { useState } from 'react'
import { useResumeStore } from '@/store/resumeStore'
import { useStreamingWorkExperience } from '@/utils/cvStreamingApi'
import type { WorkExperience } from '@/store/resumeStore'
import AddExperienceView from './work-experience/AddExperienceView'
import ExperienceFormView from './work-experience/ExperienceFormView'
import DescriptionView from './work-experience/DescriptionView'

interface WorkExperienceStepProps {
  onNext: () => void
  onPrev: () => void
}

type ViewState = 'list' | 'form' | 'description'

function WorkExperienceStep({ onNext, onPrev }: WorkExperienceStepProps) {
  const { addWorkExperience, updateWorkExperience, workExperience } = useResumeStore()
  const { generateWorkExperience } = useStreamingWorkExperience()
  const [currentView, setCurrentView] = useState<ViewState>('list')
  const [editingId, setEditingId] = useState<string | null>(null)
  const [aiSuggestions, setAiSuggestions] = useState<string[]>([])
  const [isLoadingAI, setIsLoadingAI] = useState(false)
  const [streamingContent, setStreamingContent] = useState('')
  const [formData, setFormData] = useState<Omit<WorkExperience, 'id'>>({
    jobTitle: '',
    employer: '',
    role: '',
    location: '',
    isRemote: false,
    startDate: '',
    endDate: '',
    isCurrentlyWorking: false,
    description: ''
  })

  const handleSkip = () => {
    onNext()
  }

  const resetForm = () => {
    setFormData({
      jobTitle: '',
      employer: '',
      role: '',
      location: '',
      isRemote: false,
      startDate: '',
      endDate: '',
      isCurrentlyWorking: false,
      description: ''
    })
    setEditingId(null)
    setAiSuggestions([])
  }

  const handleAddExperience = () => {
    resetForm()
    setCurrentView('form')
  }

  const handleEditExperience = (experience: WorkExperience) => {
    setFormData({
      jobTitle: experience.jobTitle,
      employer: experience.employer,
      role: experience.role,
      location: experience.location,
      isRemote: experience.isRemote,
      startDate: experience.startDate,
      endDate: experience.endDate,
      isCurrentlyWorking: experience.isCurrentlyWorking,
      description: experience.description
    })
    setEditingId(experience.id)
    setCurrentView('form')
  }

  const handleFormNext = async () => {
    setIsLoadingAI(true)
    setStreamingContent('')
    setAiSuggestions([])

    // Show description page immediately
    setCurrentView('description')

    // Generate AI suggestions using streaming
    await generateWorkExperience(
      {
        jobTitle: formData.jobTitle,
        company: formData.employer,
        location: formData.isRemote ? 'Remote' : (formData.location || 'Not specified'),
        role: formData.role || 'Not specified',
        startDate: formData.startDate,
        endDate: formData.isCurrentlyWorking ? 'Present' : formData.endDate,
      },
      // onChunk - update streaming content
      (content: string) => {
        setStreamingContent(prev => prev + content)
      },
      // onComplete - set final suggestions
      (points: string[]) => {
        setAiSuggestions(points)
        setIsLoadingAI(false)
        setStreamingContent('')
      },
      // onError
      (error: string) => {
        console.error('Failed to fetch AI suggestions:', error)
        setAiSuggestions([])
        setIsLoadingAI(false)
        setStreamingContent('')
      }
    )
  }

  const handleSave = () => {
    if (editingId) {
      updateWorkExperience(editingId, formData)
    } else {
      addWorkExperience(formData)
    }
    resetForm()
    setCurrentView('list')
  }

  const handleCancel = () => {
    resetForm()
    setCurrentView('list')
  }

  const handleFormDataChange = (data: Partial<Omit<WorkExperience, 'id'>>) => {
    setFormData(prev => ({ ...prev, ...data }))
  }

  const renderCurrentView = () => {
    switch (currentView) {
      case 'list':
        return <AddExperienceView onAddExperience={handleAddExperience} onEditExperience={handleEditExperience} onSkip={handleSkip} />
      case 'form':
        return (
          <ExperienceFormView
            formData={formData}
            onFormDataChange={handleFormDataChange}
            onNext={handleFormNext}
            onCancel={handleCancel}
            isEditing={!!editingId}
          />
        )
      case 'description':
        return (
          <DescriptionView
            formData={formData}
            onFormDataChange={handleFormDataChange}
            onSave={handleSave}
            onBack={() => setCurrentView('form')}
            aiSuggestions={aiSuggestions}
            isLoadingAI={isLoadingAI}
            streamingContent={streamingContent}
            isEditing={!!editingId}
          />
        )
      default:
        return <AddExperienceView onAddExperience={handleAddExperience} onEditExperience={handleEditExperience} onSkip={handleSkip} />
    }
  }

  // Show navigation only on the list view
  const showNavigation = currentView === 'list'

  return (
    <div className="space-y-8">
      {renderCurrentView()}

      {showNavigation && (
        <div className="flex justify-between pt-4 border-t border-black">
          <button
            onClick={onPrev}
            className="px-4 py-2 border border-black rounded-sm text-gray-700 hover:bg-gray-50 transition-colors font-medium"
          >
            Previous
          </button>
          <button
            onClick={onNext}
            className="px-8 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-sm hover:from-blue-700 hover:to-indigo-700 font-semibold shadow-lg hover:shadow-xl transition-all"
          >
            Next
          </button>
        </div>
      )}
    </div>
  )
}

export default WorkExperienceStep
