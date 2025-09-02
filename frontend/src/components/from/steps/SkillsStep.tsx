import React, { useState, useRef } from 'react'
import { Plus, Award, Star, ChevronLeft, ChevronRight, Sparkles, Target } from 'lucide-react'
import { useResumeStore, Skill } from '@/store/resumeStore'
import axiosInstance from '@/lib/axios'
import { motion, AnimatePresence } from 'framer-motion'

interface SkillsStepProps {
  onNext: () => void
  onPrev: () => void
}

function SkillsStep({ onNext, onPrev }: SkillsStepProps) {
  const { skills, addSkill, updateSkill, removeSkill, workExperience } = useResumeStore()
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
    if (hasCalledAPI.current) return

    if (!workExperience || workExperience.length === 0) return

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
    } finally {
      setIsLoadingSkills(false)
      // keep hasCalledAPI true to prevent additional automatic calls; allow manual retry only by page refresh
    }
  }
  // Removed automatic fetch; user must click the button to generate AI suggestions.

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
      className="space-y-8"
    >
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="text-center"
      >
        <div className="flex items-center justify-center mb-4">
          <div className="p-3 bg-blue-100 rounded-full">
            <Award className="w-8 h-8 text-blue-600" />
          </div>
        </div>
        <h2 className="text-3xl font-bold text-gray-900 mb-2">Skills</h2>
        <p className="text-lg text-gray-600">Showcase your professional skills and expertise</p>
        <div className="w-24 h-1 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-full mx-auto mt-4"></div>
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
            <h3 className="text-xl font-semibold text-gray-900 flex items-center">
              <Target className="w-5 h-5 mr-2 text-blue-600" />
              Your Skills
            </h3>
            {skills.map((skill, index) => (
              <motion.div
                key={skill.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.1 * index }}
                className="group relative overflow-hidden border border-gray-200 rounded-xl p-4 md:p-6 bg-white hover:shadow-lg transition-all duration-300 hover:border-blue-300"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-blue-50 to-indigo-50 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                <div className="relative">
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <h4 className="font-bold text-lg text-gray-900 mb-2">{skill.name}</h4>
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
                                className={`w-5 h-5 transition-colors ${
                                  star <= skill.rating
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
                    <div className="flex space-x-2 ml-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => removeSkill(skill.id)}
                        className="px-4 py-2 text-blue-600 hover:text-blue-700 hover:bg-blue-50 rounded-lg text-sm font-medium transition-colors"
                      >
                        Remove
                      </motion.button>
                    </div>
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
            className="flex items-center space-x-3 px-8 py-4 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all duration-300"
          >
            <Plus className="w-5 h-5" />
            <span>Add Skill</span>
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
            className="border-2 border-blue-200 rounded-2xl p-4 md:p-8 bg-gradient-to-br from-white to-blue-50 shadow-lg"
          >
            <h4 className="text-xl font-bold text-gray-900 mb-6">
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
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
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
                <div className="grid grid-cols-5 gap-2 text-xs text-gray-500 mt-3">
                  <span className="text-center">Beginner</span>
                  <span className="text-center">Basic</span>
                  <span className="text-center">Intermediate</span>
                  <span className="text-center">Advanced</span>
                  <span className="text-center">Expert</span>
                </div>
              </motion.div>
            </div>

            <div className="flex justify-end space-x-4 mt-8">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={resetForm}
                className="px-6 py-3 text-gray-700 bg-gray-200 rounded-xl hover:bg-gray-300 transition-all duration-200 font-medium"
              >
                Cancel
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={handleSave}
                disabled={!isFormValid}
                className="px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl hover:from-blue-700 hover:to-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 font-medium shadow-lg"
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
          <div className="flex items-center justify-between">
            <h4 className="text-lg font-semibold text-gray-700 flex items-center">
              <Sparkles className="w-5 h-5 mr-2 text-blue-500" />
              AI-Suggested Skills
            </h4>
            {workExperience.length > 0 && !isLoadingSkills && (
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={fetchAISkills}
                className="flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-blue-500 to-indigo-600 text-white rounded-lg hover:from-blue-600 hover:to-indigo-700 text-sm font-medium transition-all shadow-md"
              >
                <Sparkles className="w-4 h-4" />
                <span>Generate Skills</span>
              </motion.button>
            )}
          </div>
          
          <AnimatePresence>
            {workExperience.length === 0 && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-center py-8 bg-gray-50 rounded-xl border border-gray-200"
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
                className="flex items-center justify-center py-12 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl border border-blue-200"
              >
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
                      whileHover={{ scale: isAdded ? 1 : 1.05, y: isAdded ? 0 : -2 }}
                      whileTap={{ scale: isAdded ? 1 : 0.95 }}
                      onClick={() => addSuggestedSkill(skillName)}
                      disabled={!!isAdded}
                      className={`text-left p-3 md:p-4 text-xs md:text-sm rounded-xl border-2 transition-all duration-200 font-medium ${
                        isAdded
                          ? 'bg-green-100 text-green-700 border-green-300 cursor-not-allowed'
                          : 'bg-white text-gray-700 hover:bg-blue-50 hover:text-blue-700 border-gray-200 hover:border-blue-300 shadow-sm hover:shadow-md'
                      }`}
                    >
                      {isAdded && <span className="text-green-600 mr-1">✓</span>}
                      {skillName}
                    </motion.button>
                  )
                })}
              </motion.div>
            )}
            
            {workExperience.length > 0 && aiSuggestedSkills.length === 0 && !isLoadingSkills && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-center py-8 bg-gray-50 rounded-xl border border-gray-200"
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

      {/* Add Skill Form */}
      <AnimatePresence>
        {showAddForm && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="bg-gradient-to-br from-blue-50 to-indigo-50 p-4 md:p-6 rounded-xl border border-blue-200 shadow-lg"
          >
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h4 className="text-lg font-semibold text-gray-700 flex items-center">
                  <Plus className="w-5 h-5 mr-2 text-blue-500" />
                  Add New Skill
                </h4>
                <motion.button
                  whileHover={{ scale: 1.1, rotate: 90 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={() => setShowAddForm(false)}
                  className="w-8 h-8 flex items-center justify-center rounded-full bg-gray-200 text-gray-600 hover:bg-gray-300 transition-colors"
                >
                  ×
                </motion.button>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Skill Name
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                  className="w-full p-2 md:p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all shadow-sm text-sm md:text-base"
                  placeholder="e.g., JavaScript, Project Management"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Proficiency Level (1-5 stars)
                </label>
                <div className="flex items-center space-x-1">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <motion.button
                      key={star}
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      onClick={() => setFormData(prev => ({ ...prev, rating: star }))}
                      className="text-2xl focus:outline-none"
                    >
                      <Star
                        className={`w-6 h-6 ${
                          star <= formData.rating
                            ? 'text-yellow-400 fill-current'
                            : 'text-gray-300'
                        }`}
                      />
                    </motion.button>
                  ))}
                  <span className="ml-2 text-sm text-gray-600">
                    {formData.rating} star{formData.rating !== 1 ? 's' : ''}
                  </span>
                </div>
              </div>
              <div className="flex justify-end space-x-3">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={resetForm}
                  className="px-6 py-2 text-sm text-gray-600 hover:text-gray-800 font-medium"
                >
                  Cancel
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={handleSave}
                  disabled={!formData.name.trim()}
                  className="px-6 py-2 bg-gradient-to-r from-blue-500 to-indigo-500 text-white text-sm rounded-lg hover:from-blue-600 hover:to-indigo-600 disabled:opacity-50 disabled:cursor-not-allowed font-medium shadow-md transition-all"
                >
                  {editingId ? 'Update Skill' : 'Add Skill'}
                </motion.button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Navigation Buttons */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
        className="flex justify-between pt-6"
      >
        <motion.button
          whileHover={{ scale: 1.02, x: -5 }}
          whileTap={{ scale: 0.98 }}
          onClick={onPrev}
          className="flex items-center space-x-2 px-6 py-3 text-gray-600 hover:text-gray-800 font-medium transition-colors"
        >
          <ChevronLeft className="w-4 h-4" />
          <span>Previous</span>
        </motion.button>
        <motion.button
          whileHover={{ scale: 1.02, x: 5 }}
          whileTap={{ scale: 0.98 }}
          onClick={onNext}
          disabled={skills.length === 0}
          className="flex items-center space-x-2 px-6 py-3 bg-gradient-to-r from-blue-500 to-indigo-500 text-white rounded-lg hover:from-blue-600 hover:to-indigo-600 disabled:opacity-50 disabled:cursor-not-allowed font-medium shadow-md transition-all"
        >
          <span>Next: Summary</span>
          <ChevronRight className="w-4 h-4" />
        </motion.button>
      </motion.div>
    </motion.div>
  )
}

export default SkillsStep
