import React, { useState, useRef, useEffect } from 'react'
import { Plus, Award, Star, ChevronLeft, ChevronRight, Sparkles, Trash } from 'lucide-react'
import { useResumeStore, Skill } from '@/store/resumeStore'
import { useStreamingSkills } from '@/utils/cvStreamingApi'
import { motion, AnimatePresence } from 'framer-motion'

interface SkillsStepProps {
  onNext: () => void
  onPrev: () => void
}

function SkillsStep({ onNext, onPrev }: SkillsStepProps) {
  const { 
    skills, 
    addSkill, 
    updateSkill, 
    removeSkill, 
    workExperience, 
    setAiGenerated, 
    isAiGenerated,
    setAiSuggestions,
    getAiSuggestions
  } = useResumeStore()
  const { generateSkills } = useStreamingSkills()
  const [showAddForm, setShowAddForm] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [isLoadingSkills, setIsLoadingSkills] = useState(false)
  const [streamingContent, setStreamingContent] = useState('')
  const { documentId } = useResumeStore()
  const isInitialized = useRef(false)
  const [formData, setFormData] = useState<Omit<Skill, 'id'>>({
    name: '',
    rating: 3
  })

  // Get suggestions from store
  const aiSuggestedSkills = getAiSuggestions('skills')

  // Auto-generate skills on component mount - ONLY ONCE
  useEffect(() => {
    if (!isInitialized.current && !isAiGenerated('skills') && !isLoadingSkills) {
      isInitialized.current = true
      fetchAISkills()
    }
  }, [])

  const handleRegenerateSkills = () => {
    isInitialized.current = false
    setAiGenerated('skills', false)
    setAiSuggestions('skills', [])
    // Clear existing skills before regenerating
    skills.forEach(skill => removeSkill(skill.id))
    fetchAISkills()
  }

  const fetchAISkills = async () => {
    if (isLoadingSkills || isAiGenerated('skills')) return

    const experienceData = workExperience.map(exp => ({
      title: exp.jobTitle,
      company: exp.employer,
      duration: `${exp.startDate} - ${exp.isCurrentlyWorking ? 'Present' : exp.endDate}`
    }))

    setIsLoadingSkills(true)
    setStreamingContent('')

    try {
      await generateSkills(
        {
          workExperience: JSON.stringify(experienceData)
        },
        // onChunk - update streaming content
        (content: string) => {
          setStreamingContent(prev => prev + content)
        },
        // onComplete - set final skills
        (skills: string[]) => {
          setAiSuggestions('skills', skills)
          setAiGenerated('skills', true)
          setIsLoadingSkills(false)
          setStreamingContent('')
        },
        // onError
        (error: string) => {
          console.error('Failed to fetch AI skills:', error)
          setIsLoadingSkills(false)
          setStreamingContent('')
        }
      )
    } catch (error) {
      console.error('Failed to fetch AI skills:', error)
      setIsLoadingSkills(false)
      setStreamingContent('')
    }
  }

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
    const existingSkill = skills.find(skill => skill.name.toLowerCase() === skillName.toLowerCase())
    if (existingSkill) {
      // If skill exists, remove it (toggle off)
      removeSkill(existingSkill.id)
    } else {
      // If skill doesn't exist, add it (toggle on)
      addSkill({ name: skillName, rating: 3 })
    }
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
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.3 }}
      className="space-y-4 md:space-y-6 lg:space-y-8"
    >
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="text-left"
      >
        <div className="flex items-start mb-3 md:mb-4">
          <div className="p-1.5 md:p-2 lg:p-3 bg-blue-100 rounded-full mr-2 md:mr-3">
            <Award className="w-5 h-5 md:w-6 md:h-6 lg:w-8 lg:h-8 text-blue-600" />
          </div>
          <div className="flex-1">
            <h2 className="text-xl md:text-2xl lg:text-3xl font-bold text-gray-900">Skills</h2>
            <p className="text-sm md:text-base lg:text-lg text-gray-600">Showcase your professional skills and expertise</p>
          </div>
        </div>
      </motion.div>

      {/* Existing Skills */}
      <AnimatePresence>
        {skills.length > 0 && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2 }}
            className="space-y-4"
          >
            <h3 className="text-lg md:text-xl font-semibold text-gray-900 flex items-center">
              <Award className="w-4 h-4 md:w-5 md:h-5 mr-2 text-blue-600" />
              Your Skills
            </h3>
            {skills.map((skill, index) => (
              <motion.div
                key={skill.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.1 * index }}
                className="bg-white border border-gray-300 rounded-sm p-3 md:p-4 hover:border-blue-600 transition-all duration-300"
              >
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <h4 className="font-bold text-base md:text-lg text-gray-900 mb-2">{skill.name}</h4>
                    <div className="flex items-center space-x-3">
                      <span className="text-sm font-medium text-gray-600">Proficiency:</span>
                      <div className="flex items-center space-x-1">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <motion.button
                            key={star}
                            whileHover={{ scale: 1.2 }}
                            whileTap={{ scale: 0.9 }}
                            onClick={() => updateSkill(skill.id, { ...skill, rating: star })}
                            className="focus:outline-none"
                          >
                            <Star
                              className={`w-5 h-5 transition-colors ${star <= skill.rating
                                  ? 'text-yellow-400 fill-current'
                                  : 'text-gray-300 hover:text-yellow-200'
                                }`}
                            />
                          </motion.button>
                        ))}
                      </div>
                      <span className="text-sm text-blue-600 font-semibold bg-blue-100 px-2 py-1 rounded-full">
                        {skill.rating}/5
                      </span>
                    </div>
                  </div>
                  <div className="flex space-x-2 ml-4">
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => removeSkill(skill.id)}
                      className="p-2 text-red-600 hover:text-red-700 hover:bg-red-50 rounded-sm transition-colors"
                    >
                      <Trash className="w-4 h-4" />
                    </motion.button>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Add Skill Button */}
      {!showAddForm && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="flex justify-center"
        >
          <motion.button
            whileHover={{ scale: 1.02, y: -2 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => setShowAddForm(true)}
            className="flex items-center space-x-2 md:space-x-3 px-6 md:px-8 py-3 bg-blue-600 text-white rounded-sm font-semibold hover:bg-blue-700 transition-all duration-300 border border-gray-300"
          >
            <Plus className="w-4 h-4 md:w-5 md:h-5" />
            <span className="text-sm md:text-base">Add Skill</span>
          </motion.button>
        </motion.div>
      )}

      {/* Add/Edit Form */}
      <AnimatePresence>
        {showAddForm && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: -20 }}
            transition={{ duration: 0.3 }}
            className="bg-white border-2 border-blue-200 p-4 md:p-6 rounded-sm shadow-lg"
          >
            <h4 className="text-lg md:text-xl font-bold text-gray-900 mb-6">
              {editingId ? 'Edit Skill' : 'Add Skill'}
            </h4>

            <div className="space-y-6">
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.1 }}
              >
                <label className="block text-sm font-semibold text-gray-700 mb-3">
                  Skill Name *
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
                  placeholder="e.g., JavaScript, Project Management"
                />
              </motion.div>

              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2 }}
              >
                <label className="block text-sm font-semibold text-gray-700 mb-3">
                  Proficiency Rating *
                </label>
                <div className="flex items-center space-x-3 mb-2">
                  {renderStars(formData.rating, true, (rating) => setFormData({ ...formData, rating }))}
                  <span className="text-sm font-semibold text-blue-600 bg-blue-100 px-3 py-1 rounded-full">
                    {formData.rating}/5
                  </span>
                </div>
              </motion.div>
            </div>

            <div className="flex justify-end space-x-4 mt-8">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={resetForm}
                className="px-6 py-3 text-gray-700 bg-gray-200 rounded-sm hover:bg-gray-300 transition-all duration-200 font-medium"
              >
                Cancel
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={handleSave}
                disabled={!isFormValid}
                className="px-6 py-3 bg-blue-600 text-white rounded-sm hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 font-medium shadow-lg"
              >
                {editingId ? 'Update Skill' : 'Add Skill'}
              </motion.button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* AI-Generated Suggested Skills */}
      {!showAddForm && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="space-y-4"
        >
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 sm:gap-4">
            <h4 className="text-base md:text-lg font-semibold text-gray-700 flex items-center">
              <Sparkles className="w-4 h-4 md:w-5 md:h-5 mr-2 text-blue-500" />
              AI-Suggested Skills
            </h4>
            {workExperience.length > 0 && !isLoadingSkills && (
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleRegenerateSkills}
                className="flex items-center space-x-2 px-3 md:px-4 py-1.5 md:py-2 bg-blue-600 text-white rounded-sm hover:bg-blue-700 text-xs md:text-sm font-medium transition-all"
              >
                <Sparkles className="w-3 h-3 md:w-4 md:h-4" />
                <span>Generate Skills</span>
              </motion.button>
            )}
          </div>

          <AnimatePresence>
            {workExperience.length === 0 && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-center py-8 bg-gray-50 rounded-sm border border-gray-200"
              >
                <Award className="w-12 h-12 mx-auto mb-3 text-gray-400" />
                <p className="text-sm text-gray-500">
                  Add work experience first to get AI-suggested skills.
                </p>
              </motion.div>
            )}

            {workExperience.length > 0 && isLoadingSkills && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="space-y-4"
              >
                <div className="flex items-center justify-center py-8 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-sm border border-blue-200">
                  <div className="text-center">
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                      className="w-8 h-8 border-3 border-blue-500 border-t-transparent rounded-full mx-auto mb-4"
                    />
                    <p className="text-sm text-gray-600 font-medium">
                      AI is analyzing your experience to suggest relevant skills...
                    </p>
                  </div>
                </div>
                
                {/* Show streaming content in real-time */}
                {streamingContent && (
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                    <div className="flex items-center space-x-2 mb-2">
                      <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
                      <span className="text-sm font-medium text-blue-700">Live Generation</span>
                    </div>
                    <div className="text-sm text-gray-700 font-mono bg-white p-3 rounded border">
                      {streamingContent}
                      <span className="animate-pulse">|</span>
                    </div>
                  </div>
                )}
              </motion.div>
            )}

            {workExperience.length > 0 && aiSuggestedSkills.length > 0 && !isLoadingSkills && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2 md:gap-3"
              >
                {aiSuggestedSkills.map((skillName: string, index: number) => {
                  const isAdded = skills.find(s => s.name.toLowerCase() === skillName.toLowerCase())
                  return (
                    <motion.button
                      key={skillName}
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: index * 0.05 }}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => addSuggestedSkill(skillName)}
                      className={`text-left p-3 md:p-4 text-xs md:text-sm rounded-sm border transition-all duration-200 font-medium ${isAdded
                          ? 'bg-blue-50 text-blue-700 border-blue-500'
                          : 'bg-white text-gray-700 hover:bg-blue-50 hover:text-blue-700 border-gray-200 hover:border-blue-300'
                        }`}
                    >
                      <div className="flex items-center justify-between">
                        <span>{skillName}</span>
                      </div>
                    </motion.button>
                  )
                })}
              </motion.div>
            )}

            {workExperience.length > 0 && aiSuggestedSkills.length === 0 && !isLoadingSkills && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-center py-8 bg-gray-50 rounded-sm border border-gray-200"
              >
                <Award className="w-12 h-12 mx-auto mb-3 text-gray-400" />
                <p className="text-sm text-gray-500">
                  No AI suggestions available. Add skills manually or try regenerating.
                </p>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      )}

      {/* Navigation Buttons */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
        className="flex justify-between pt-6 border-t border-gray-300"
      >
        <motion.button
          whileHover={{ scale: 1.02, x: -5 }}
          whileTap={{ scale: 0.98 }}
          onClick={onPrev}
          className="flex items-center space-x-1 md:space-x-2 px-4 md:px-6 py-3 text-gray-700 hover:text-gray-800 font-medium transition-colors border border-gray-300 bg-white rounded-sm hover:bg-gray-50"
        >
          <ChevronLeft className="w-4 h-4 md:w-5 md:h-5" />
          <span className="text-sm md:text-base">Previous</span>
        </motion.button>
        <motion.button
          whileHover={{ scale: 1.02, x: 5 }}
          whileTap={{ scale: 0.98 }}
          onClick={onNext}
          disabled={skills.length === 0}
          className="flex items-center space-x-1 md:space-x-2 px-4 md:px-6 py-3 bg-blue-600 text-white rounded-sm hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed font-medium transition-all border border-gray-300"
        >
          <span className="text-sm md:text-base">Next: Summary</span>
          <ChevronRight className="w-4 h-4 md:w-5 md:h-5" />
        </motion.button>
      </motion.div>
    </motion.div>
  )
}

export default SkillsStep