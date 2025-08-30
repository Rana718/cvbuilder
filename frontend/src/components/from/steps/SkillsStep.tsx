import React, { useEffect, useState, useRef } from 'react'
import { Plus, Award, Star } from 'lucide-react'
import { useResumeStore, Skill } from '@/store/resumeStore'
import axiosInstance from '@/lib/axios'

interface SkillsStepProps {
  onNext: () => void
  onPrev: () => void
}

function SkillsStep({ onNext, onPrev }: SkillsStepProps) {
  const { skills, addSkill, updateSkill, removeSkill, getOrCreateDocumentId, workExperience } = useResumeStore()
  const [showAddForm, setShowAddForm] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [aiSuggestedSkills, setAiSuggestedSkills] = useState<string[]>([])
  const [isLoadingSkills, setIsLoadingSkills] = useState(false)
  const { documentId } = useResumeStore()
  const hasCalledAPI = useRef(false)
  const [formData, setFormData] = useState<Omit<Skill, 'id'>>({
    name: '',
    rating: 3
  })

  const fetchAISkills = async () => {
    // Prevent multiple API calls
    if (hasCalledAPI.current) {
      return
    }
    
    // Ensure we have a consistent document ID
    const docId = getOrCreateDocumentId()
    
    // Transform work experience to the required format
    const experienceData = workExperience.map(exp => ({
      title: exp.jobTitle,
      company: exp.employer,
      duration: `${exp.startDate} - ${exp.isCurrentlyWorking ? 'Present' : exp.endDate}`
    }))
    
    setIsLoadingSkills(true)
    hasCalledAPI.current = true
    
    try {
      const response = await axiosInstance.post('/api/cv-gen/skills', {
        experience: experienceData
      })
      
      if (response.data?.skills && Array.isArray(response.data.skills)) {
        setAiSuggestedSkills(response.data.skills)
      }
    } catch (error) {
      console.error('Failed to fetch AI skills:', error)
      // Reset the flag on error so user can retry
      hasCalledAPI.current = false
    } finally {
      setIsLoadingSkills(false)
    }
  }

  useEffect(() => {
    // Only fetch AI skills when component mounts and we have work experience data
    if (workExperience.length > 0) {
      fetchAISkills()
    }
  }, [workExperience.length]) // Depend on work experience length to trigger when data is available

  const resetForm = () => {
    setFormData({
      name: '',
      rating: 3
    })
    setShowAddForm(false)
    setEditingId(null)
  }

  const handleSave = () => {
    if (editingId) {
      updateSkill(editingId, formData)
    } else {
      addSkill(formData)
    }
    resetForm()
  }

  const handleEdit = (skill: Skill) => {
    setFormData(skill)
    setEditingId(skill.id)
    setShowAddForm(true)
  }

  const addSuggestedSkill = (skillName: string) => {
    if (!skills.find(skill => skill.name.toLowerCase() === skillName.toLowerCase())) {
      addSkill({ name: skillName, rating: 3 })
    }
  }

  const retryFetchSkills = () => {
    hasCalledAPI.current = false
    fetchAISkills()
  }

  const renderStars = (rating: number, interactive: boolean = false, onRatingChange?: (rating: number) => void) => {
    return (
      <div className="flex space-x-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <button
            key={star}
            type="button"
            onClick={() => interactive && onRatingChange && onRatingChange(star)}
            disabled={!interactive}
            className={`${interactive
                ? 'cursor-pointer hover:scale-110 transition-transform'
                : 'cursor-default'
              }`}
          >
            <Star
              className={`w-4 h-4 ${star <= rating
                  ? 'fill-yellow-400 text-yellow-400'
                  : 'text-gray-300'
                }`}
            />
          </button>
        ))}
      </div>
    )
  }

  const isFormValid = formData.name.trim().length > 0

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Skills</h2>
        <p className="text-gray-600">Add your professional skills and rate your proficiency</p>
      </div>

      {/* Existing Skills */}
      {skills.length > 0 && (
        <div className="space-y-4">
          <h3 className="text-lg font-medium text-gray-900">Your Skills</h3>
          {skills.map((skill) => (
            <div key={skill.id} className="border border-gray-200 rounded-lg p-4 bg-white">
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <h4 className="font-semibold text-gray-900">{skill.name}</h4>
                  <div className="flex items-center space-x-2 mt-2">
                    <span className="text-sm text-gray-600">Proficiency:</span>
                    {renderStars(skill.rating)}
                    <span className="text-sm text-gray-500">({skill.rating}/5)</span>
                  </div>
                </div>
                <div className="flex space-x-2 ml-4">
                  <button
                    onClick={() => handleEdit(skill)}
                    className="text-blue-600 hover:text-blue-700 text-sm font-medium"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => removeSkill(skill.id)}
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

      {/* Add Skill Button */}
      {!showAddForm && (
        <button
          onClick={() => setShowAddForm(true)}
          className="flex items-center space-x-2 text-blue-600 hover:text-blue-700 font-medium"
        >
          <Plus className="w-5 h-5" />
          <span>Add Skill</span>
        </button>
      )}

      {/* Add/Edit Form */}
      {showAddForm && (
        <div className="border border-gray-300 rounded-lg p-6 bg-white">
          <h4 className="font-medium text-gray-900 mb-4">
            {editingId ? 'Edit Skill' : 'Add Skill'}
          </h4>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Skill Name *
              </label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="e.g., JavaScript, Project Management"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Proficiency Rating *
              </label>
              <div className="flex items-center space-x-2">
                {renderStars(formData.rating, true, (rating) => setFormData({ ...formData, rating }))}
                <span className="text-sm text-gray-500 ml-2">({formData.rating}/5)</span>
              </div>
              <p className="text-xs text-gray-500 mt-1">
                1 = Beginner, 2 = Basic, 3 = Intermediate, 4 = Advanced, 5 = Expert
              </p>
            </div>
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
              {editingId ? 'Update Skill' : 'Add Skill'}
            </button>
          </div>
        </div>
      )}

      {/* AI-Generated Suggested Skills */}
      {!showAddForm && (
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h4 className="text-sm font-medium text-gray-700">AI-Suggested Skills (click to add):</h4>
            {workExperience.length > 0 && !isLoadingSkills && (
              <button
                onClick={retryFetchSkills}
                className="text-xs text-blue-600 hover:text-blue-700 font-medium"
              >
                Regenerate Skills
              </button>
            )}
          </div>
          
          {workExperience.length === 0 && (
            <div className="text-center py-6 text-sm text-gray-500">
              Add work experience first to get AI-suggested skills.
            </div>
          )}
          
          {workExperience.length > 0 && isLoadingSkills && (
            <div className="flex items-center justify-center py-6">
              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-blue-500"></div>
              <span className="ml-2 text-sm text-gray-600">Generating personalized skills...</span>
            </div>
          )}
          
          {workExperience.length > 0 && aiSuggestedSkills.length > 0 && !isLoadingSkills && (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2">
              {aiSuggestedSkills.map((skillName: string) => {
                const isAdded = skills.find(s => s.name.toLowerCase() === skillName.toLowerCase())
                return (
                  <button
                    key={skillName}
                    onClick={() => addSuggestedSkill(skillName)}
                    disabled={!!isAdded}
                    className={`text-left p-2 text-sm rounded border transition-colors ${isAdded
                        ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                        : 'bg-white text-gray-700 hover:bg-blue-50 hover:text-blue-700 border-gray-200'
                      }`}
                  >
                    {skillName}
                  </button>
                )
              })}
            </div>
          )}
          
          {workExperience.length > 0 && aiSuggestedSkills.length === 0 && !isLoadingSkills && (
            <div className="text-center py-6 text-sm text-gray-500">
              No AI suggestions available. Add skills manually or try regenerating.
            </div>
          )}
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
          disabled={skills.length === 0}
          className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed font-medium"
        >
          Next: Summary
        </button>
      </div>
    </div>
  )
}

export default SkillsStep
