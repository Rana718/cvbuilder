import React, { useState } from 'react'
import { Plus, X, Briefcase, MapPin, Calendar, Sparkles } from 'lucide-react'
import { useResumeStore, WorkExperience } from '@/store/resumeStore'
import SimpleRichTextEditor from '@/components/ui/SimpleRichTextEditor'
import axiosInstance from '@/lib/axios'

interface WorkExperienceStepProps {
  onNext: () => void
  onPrev: () => void
}

function WorkExperienceStep({ onNext, onPrev }: WorkExperienceStepProps) {
  const { workExperience, addWorkExperience, updateWorkExperience, removeWorkExperience, getOrCreateDocumentId } = useResumeStore()
  const [showAddForm, setShowAddForm] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [aiSuggestions, setAiSuggestions] = useState<string[]>([])
  const [isLoadingSuggestions, setIsLoadingSuggestions] = useState(false)
  const [formData, setFormData] = useState<Omit<WorkExperience, 'id'> & { role?: string }>({
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
    setShowAddForm(false)
    setEditingId(null)
    setAiSuggestions([])
  }

  const generateAISuggestions = async () => {
    if (!formData.jobTitle || !formData.employer) {
      alert('Please fill in Job Title and Employer first to generate AI suggestions')
      return
    }

    setIsLoadingSuggestions(true)
    try {
      const response = await axiosInstance.post('/api/cv-gen/work-experience', {
        job_title: formData.jobTitle,
        company: formData.employer,
        location: formData.isRemote ? 'Remote' : formData.location,
        role: formData.role,
        start_date: formData.startDate,
        end_date: formData.isCurrentlyWorking ? 'Present' : formData.endDate,
      })

      if (response.data?.points) {
        setAiSuggestions(response.data.points)
      }
    } catch (error) {
      console.error('Failed to generate AI suggestions:', error)
      alert('Failed to generate AI suggestions. Please try again.')
    } finally {
      setIsLoadingSuggestions(false)
    }
  }

  const handleSave = () => {
    if (editingId) {
      updateWorkExperience(editingId, formData)
    } else {
      addWorkExperience(formData)
    }
    resetForm()
  }

  const handleEdit = (experience: WorkExperience) => {
    setFormData(experience)
    setEditingId(experience.id)
    setShowAddForm(true)
  }

  const handleCurrentlyWorkingChange = (checked: boolean) => {
    setFormData({
      ...formData,
      isCurrentlyWorking: checked,
      endDate: checked ? '' : formData.endDate
    })
  }

  const addSuggestionToDescription = (suggestion: string) => {
    const currentDesc = formData.description.replace(/<[^>]*>/g, '').trim()
    const newDesc = currentDesc ? `${currentDesc}\n• ${suggestion}` : `• ${suggestion}`
    setFormData({ ...formData, description: newDesc })
  }

  const isFormValid = formData.jobTitle && formData.employer && formData.startDate && (formData.isCurrentlyWorking || formData.endDate)

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Work Experience</h2>
        <p className="text-gray-600">Tell us about your professional experience</p>
      </div>

      {/* Existing Work Experience */}
      {workExperience.length > 0 && (
        <div className="space-y-4">
          <h3 className="text-lg font-medium text-gray-900">Work History Summary</h3>
          {workExperience.map((exp) => (
            <div key={exp.id} className="border border-gray-200 rounded-lg p-4 bg-white">
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <h4 className="font-semibold text-gray-900">{exp.jobTitle}</h4>
                  <p className="text-gray-700">{exp.employer}</p>
                  <div className="flex items-center space-x-4 text-sm text-gray-600 mt-1">
                    <span className="flex items-center">
                      <MapPin className="w-4 h-4 mr-1" />
                      {exp.isRemote ? 'Remote' : exp.location}
                    </span>
                    <span className="flex items-center">
                      <Calendar className="w-4 h-4 mr-1" />
                      {exp.startDate} - {exp.isCurrentlyWorking ? 'Present' : exp.endDate}
                    </span>
                  </div>
                  {exp.description && (
                    <div
                      className="mt-2 text-sm text-gray-600 prose prose-sm max-w-none"
                      dangerouslySetInnerHTML={{ __html: exp.description }}
                    />
                  )}
                </div>
                <div className="flex space-x-2 ml-4">
                  <button
                    onClick={() => handleEdit(exp)}
                    className="text-blue-600 hover:text-blue-700 text-sm font-medium"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => removeWorkExperience(exp.id)}
                    className="text-red-600 hover:text-red-700 text-sm font-medium"
                  >
                    Remove
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Add Experience Button */}
      {!showAddForm && (
        <button
          onClick={() => setShowAddForm(true)}
          className="flex items-center space-x-2 text-blue-600 hover:text-blue-700 font-medium"
        >
          <Plus className="w-5 h-5" />
          <span>Add Work Experience</span>
        </button>
      )}

      {/* Add/Edit Form */}
      {showAddForm && (
        <div className="border border-gray-300 rounded-lg p-6 bg-white">
          <h4 className="font-medium text-gray-900 mb-4">
            {editingId ? 'Edit Experience' : 'Add Work Experience'}
          </h4>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Job Title *
              </label>
              <input
                type="text"
                value={formData.jobTitle}
                onChange={(e) => setFormData({ ...formData, jobTitle: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Software Engineer"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Employer *
              </label>
              <input
                type="text"
                value={formData.employer}
                onChange={(e) => setFormData({ ...formData, employer: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Company Name"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Role (optional)
              </label>
              <input
                type="text"
                value={formData.role || ''}
                onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="e.g. Frontend Developer, Team Lead"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Location
              </label>
              <input
                type="text"
                value={formData.location}
                onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="New York, NY"
                disabled={formData.isRemote}
              />
            </div>

            <div className="flex items-center">
              <label className="flex items-center space-x-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.isRemote}
                  onChange={(e) => setFormData({ ...formData, isRemote: e.target.checked, location: e.target.checked ? '' : formData.location })}
                  className="rounded border-gray-300 text-blue-500 focus:ring-blue-500"
                />
                <span className="text-sm text-gray-700">Remote Work</span>
              </label>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Start Date *
              </label>
              <input
                type="month"
                value={formData.startDate}
                onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                End Date {!formData.isCurrentlyWorking && '*'}
              </label>
              <input
                type="month"
                value={formData.endDate}
                onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                disabled={formData.isCurrentlyWorking}
              />
              <div className="mt-2">
                <label className="flex items-center space-x-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.isCurrentlyWorking}
                    onChange={(e) => handleCurrentlyWorkingChange(e.target.checked)}
                    className="rounded border-gray-300 text-blue-500 focus:ring-blue-500"
                  />
                  <span className="text-sm text-gray-700">I currently work here</span>
                </label>
              </div>
            </div>
          </div>

          <div className="mt-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Job Description
            </label>
            <SimpleRichTextEditor
              value={formData.description}
              onChange={(value: string) => setFormData({ ...formData, description: value })}
              placeholder="Describe your responsibilities and achievements..."
              height="150px"
            />
          </div>

          {/* Description Suggestions */}
          <div className="mt-4">
            <div className="flex items-center justify-between mb-3">
              <h5 className="text-sm font-medium text-gray-700">AI-Generated Bullet Points:</h5>
              <button
                onClick={generateAISuggestions}
                disabled={!formData.jobTitle || !formData.employer || isLoadingSuggestions}
                className="flex items-center space-x-2 px-3 py-1.5 bg-gradient-to-r from-purple-500 to-blue-500 text-white rounded-lg hover:from-purple-600 hover:to-blue-600 disabled:opacity-50 disabled:cursor-not-allowed text-xs font-medium transition-all"
              >
                <Sparkles className="w-4 h-4" />
                <span>{isLoadingSuggestions ? 'Generating...' : 'Generate AI Suggestions'}</span>
              </button>
            </div>

            {isLoadingSuggestions && (
              <div className="flex items-center justify-center py-8">
                <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-500"></div>
                <span className="ml-2 text-sm text-gray-600">Generating personalized suggestions...</span>
              </div>
            )}

            {aiSuggestions.length > 0 && !isLoadingSuggestions && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                {aiSuggestions.map((suggestion: string, index: number) => (
                  <button
                    key={index}
                    onClick={() => addSuggestionToDescription(suggestion)}
                    className="text-left p-2 text-xs text-gray-600 hover:bg-blue-50 hover:text-blue-700 rounded border border-gray-200 transition-colors"
                  >
                    {suggestion}
                  </button>
                ))}
              </div>
            )}

            {aiSuggestions.length === 0 && !isLoadingSuggestions && (
              <div className="text-center py-4 text-sm text-gray-500">
                Fill in Job Title and Employer, then click "Generate AI Suggestions" to get personalized bullet points for your role.
              </div>
            )}
          </div>

          <div className="flex justify-end space-x-3 mt-6">
            <button
              onClick={resetForm}
              className="px-4 py-2 text-gray-600 hover:text-gray-800"
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              disabled={!isFormValid}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {editingId ? 'Update Experience' : 'Add Experience'}
            </button>
          </div>
        </div>
      )}

      {/* Navigation Buttons */}
      <div className="flex justify-between">
        <button
          onClick={onPrev}
          className="px-6 py-3 text-gray-600 hover:text-gray-800 font-medium"
        >
          Previous
        </button>
        <button
          onClick={onNext}
          disabled={workExperience.length === 0}
          className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed font-medium"
        >
          Next: Education
        </button>
      </div>
    </div>
  )
}

export default WorkExperienceStep
