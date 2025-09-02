'use client'

import React, { useState } from 'react'
import { useResumeStore } from '@/store/resumeStore'
import axiosInstance from '@/lib/axios'
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
  const [currentView, setCurrentView] = useState<ViewState>('list')
  const [editingId, setEditingId] = useState<string | null>(null)
  const [aiSuggestions, setAiSuggestions] = useState<string[]>([])
  const [isLoadingAI, setIsLoadingAI] = useState(false)
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
    // Show description page after 1 second, don't wait for API completion
    setTimeout(() => {
      setCurrentView('description')
    }, 1000)

    // Generate AI suggestions in background
    try {
      const response = await axiosInstance.post('/api/cv-gen/work-experience', {
        job_title: formData.jobTitle,
        company: formData.employer,
        location: formData.isRemote ? 'Remote' : (formData.location || 'Not specified'),
        role: formData.role || 'Not specified',
        start_date: formData.startDate,
        end_date: formData.isCurrentlyWorking ? 'Present' : formData.endDate,
      })

      if (response.data?.points && Array.isArray(response.data.points)) {
        setAiSuggestions(response.data.points)
      }
    } catch (error) {
      console.error('Failed to fetch AI suggestions:', error)
      setAiSuggestions([])
    } finally {
      setIsLoadingAI(false)
    }
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
        return <AddExperienceView onAddExperience={handleAddExperience} onEditExperience={handleEditExperience} />
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
            isEditing={!!editingId}
          />
        )
      default:
        return <AddExperienceView onAddExperience={handleAddExperience} onEditExperience={handleEditExperience} />
    }
  }

  // Show navigation only on the list view
  const showNavigation = currentView === 'list'

  return (
    <div className="space-y-8">
      {renderCurrentView()}

      {showNavigation && (
        <div className="flex justify-between pt-6 border-t border-gray-200">
          <button
            onClick={onPrev}
            className="px-6 py-3 border border-gray-300 rounded-xl text-gray-700 hover:bg-gray-50 transition-colors font-medium"
          >
            Previous
          </button>
          <button
            onClick={onNext}
            className="px-8 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl hover:from-blue-700 hover:to-indigo-700 font-semibold shadow-lg hover:shadow-xl transition-all"
          >
            Next
          </button>
        </div>
      )}
    </div>
  )
}

export default WorkExperienceStep
