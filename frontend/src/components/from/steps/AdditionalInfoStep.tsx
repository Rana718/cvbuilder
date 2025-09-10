import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Plus, X, Award, Globe, BookOpen, Users, Heart, Settings, User, Trophy } from 'lucide-react'
import { useResumeStore, AdditionalSection } from '@/store/resumeStore'
import SimpleRichTextEditor from '@/components/ui/SimpleRichTextEditor'
import { useRouter } from 'next/navigation'

interface AdditionalInfoStepProps {
  onPrev: () => void
}

const additionalSectionTypes = [
  { 
    type: 'personalDetails' as const, 
    title: 'Personal Details', 
    icon: User, 
    description: 'Date of birth, nationality, marital status' 
  },
  { 
    type: 'websites' as const, 
    title: 'Websites, Portfolios, Profiles', 
    icon: Globe, 
    description: 'Additional online presence' 
  },
  { 
    type: 'certifications' as const, 
    title: 'Certifications', 
    icon: Award, 
    description: 'Professional certifications and licenses' 
  },
  { 
    type: 'languages' as const, 
    title: 'Languages', 
    icon: Globe, 
    description: 'Languages you speak and proficiency level' 
  },
  { 
    type: 'software' as const, 
    title: 'Software', 
    icon: Settings, 
    description: 'Software and tools you\'re proficient with' 
  },
  { 
    type: 'accomplishments' as const, 
    title: 'Accomplishments', 
    icon: Trophy, 
    description: 'Awards, honors, and achievements' 
  },
  { 
    type: 'additionalInfo' as const, 
    title: 'Additional Information', 
    icon: Plus, 
    description: 'Any other relevant information' 
  },
  { 
    type: 'affiliations' as const, 
    title: 'Affiliations', 
    icon: Users, 
    description: 'Professional organizations and memberships' 
  },
  { 
    type: 'interests' as const, 
    title: 'Interests', 
    icon: Heart, 
    description: 'Professional interests and passions' 
  },
  { 
    type: 'hobbies' as const, 
    title: 'Hobbies', 
    icon: Heart, 
    description: 'Personal hobbies and activities' 
  }
]

function AdditionalInfoStep({ onPrev }: AdditionalInfoStepProps) {
  const router = useRouter()
  const { 
    additionalSections, 
    addAdditionalSection, 
    updateAdditionalSection, 
    removeAdditionalSection,
    templateId,
    personalInfo,
    workExperience,
    education,
    skills,
    summary,
    saveResume,
    documentId
  } = useResumeStore()
  
  const [showSectionPicker, setShowSectionPicker] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [formData, setFormData] = useState<Omit<AdditionalSection, 'id'>>({
    type: 'personalDetails',
    title: '',
    content: ''
  })

  const resetForm = () => {
    setFormData({
      type: 'personalDetails',
      title: '',
      content: ''
    })
    setShowSectionPicker(false)
    setEditingId(null)
  }

  const handleSave = () => {
    if (editingId) {
      updateAdditionalSection(editingId, formData)
    } else {
      addAdditionalSection(formData)
    }
    resetForm()
  }

  const handleEdit = (section: AdditionalSection) => {
    setFormData(section)
    setEditingId(section.id)
    setShowSectionPicker(true)
  }

  const selectSectionType = (sectionType: typeof additionalSectionTypes[0]) => {
    setFormData({
      ...formData,
      type: sectionType.type,
      title: sectionType.title
    })
  }

  const handleFinish = async () => {
    try {
      // Save the resume first
      await saveResume()
      
      // Get the resume ID after saving
      const resumeId = documentId
      
      if (resumeId && templateId) {
        // Redirect to the resume preview page
        router.push(`/resusme/${resumeId}?template=${templateId}`)
      } else {
        console.error('Missing resume ID or template ID after save')
        alert('Resume saved successfully!')
      }
    } catch (error) {
      console.error('Failed to save resume:', error)
      alert('Failed to save resume. Please try again.')
    }
  }

  const isFormValid = formData.title && formData.content

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.3 }}
      className="space-y-4 md:space-y-6"
    >
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
      >
        <h2 className="text-xl md:text-2xl font-bold text-gray-900 mb-2">Additional Information</h2>
        <p className="text-sm md:text-base text-gray-600">Do you have anything else to add?</p>
        <p className="text-xs md:text-sm text-gray-500 mt-1">These sections are optional.</p>
      </motion.div>

      {/* Existing Additional Sections */}
      <AnimatePresence>
        {additionalSections.length > 0 && (
          <motion.div 
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="space-y-3 md:space-y-4"
          >
            <h3 className="text-base md:text-lg font-medium text-gray-900">Added Sections</h3>
            {additionalSections.map((section, index) => {
              const sectionType = additionalSectionTypes.find(t => t.type === section.type)
              const Icon = sectionType?.icon || Plus
              
              return (
                <motion.div 
                  key={section.id} 
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  transition={{ delay: index * 0.1 }}
                  className="border border-gray-200 rounded-lg p-3 md:p-4 bg-white"
                >
                  <div className="flex justify-between items-start">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center space-x-2 mb-2">
                        <Icon className="w-4 h-4 md:w-5 md:h-5 text-gray-600 flex-shrink-0" />
                        <h4 className="font-semibold text-gray-900 text-sm md:text-base">{section.title}</h4>
                      </div>
                      <div 
                        className="text-xs md:text-sm text-gray-600 prose prose-sm max-w-none"
                        dangerouslySetInnerHTML={{ __html: section.content }}
                      />
                    </div>
                    <div className="flex flex-col sm:flex-row gap-1 sm:gap-2 ml-2 md:ml-4 flex-shrink-0">
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => handleEdit(section)}
                        className="text-blue-600 hover:text-blue-700 text-xs md:text-sm font-medium px-2 py-1"
                      >
                        Edit
                      </motion.button>
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => removeAdditionalSection(section.id)}
                        className="text-red-600 hover:text-red-700 text-xs md:text-sm font-medium px-2 py-1"
                      >
                        Remove
                      </motion.button>
                    </div>
                  </div>
                </motion.div>
            )
          })}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Add Section Button */}
      <AnimatePresence>
        {!showSectionPicker && (
          <motion.button
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => setShowSectionPicker(true)}
            className="flex items-center space-x-2 text-blue-600 hover:text-blue-700 font-medium text-sm md:text-base"
          >
            <Plus className="w-4 h-4 md:w-5 md:h-5" />
            <span>Add Section</span>
          </motion.button>
        )}
      </AnimatePresence>

      {/* Section Type Picker */}
      <AnimatePresence>
        {showSectionPicker && !editingId && (
          <motion.div 
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: -20 }}
            className="border border-gray-300 rounded-lg p-4 md:p-6 bg-white"
          >
            <h4 className="font-medium text-gray-900 mb-3 md:mb-4 text-sm md:text-base">Choose a section to add:</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2 md:gap-3">
              {additionalSectionTypes.map((sectionType, index) => {
                const Icon = sectionType.icon
              const isAlreadyAdded = additionalSections.find(s => s.type === sectionType.type)
              
              return (
                <motion.button
                  key={sectionType.type}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                  whileHover={{ scale: isAlreadyAdded ? 1 : 1.02 }}
                  whileTap={{ scale: isAlreadyAdded ? 1 : 0.98 }}
                  onClick={() => selectSectionType(sectionType)}
                  disabled={!!isAlreadyAdded}
                  className={`flex items-start space-x-2 md:space-x-3 p-3 md:p-4 text-left rounded-lg border transition-colors ${
                    isAlreadyAdded
                      ? 'bg-gray-50 border-gray-200 text-gray-400 cursor-not-allowed'
                      : 'bg-white border-gray-200 hover:bg-blue-50 hover:border-blue-300'
                  }`}
                >
                  <Icon className="w-4 h-4 md:w-5 md:h-5 text-gray-600 mt-0.5 flex-shrink-0" />
                  <div className="min-w-0">
                    <div className="font-medium text-gray-900 text-sm md:text-base">{sectionType.title}</div>
                    <div className="text-xs md:text-sm text-gray-600 mt-1">{sectionType.description}</div>
                    {sectionType.type === 'languages' && (
                      <div className="text-xs text-blue-600 mt-1 font-medium">NEW!</div>
                    )}
                  </div>
                </motion.button>
              )
            })}
            
            {/* Custom Section */}
            <motion.button
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: additionalSectionTypes.length * 0.05 }}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => setFormData({ ...formData, type: 'custom', title: 'Custom Section' })}
              className="flex items-start space-x-2 md:space-x-3 p-3 md:p-4 text-left rounded-lg border border-gray-200 hover:bg-blue-50 hover:border-blue-300 transition-colors"
            >
              <Settings className="w-4 h-4 md:w-5 md:h-5 text-gray-600 mt-0.5 flex-shrink-0" />
              <div className="min-w-0">
                <div className="font-medium text-gray-900 text-sm md:text-base">Add Your Own</div>
                <div className="text-xs md:text-sm text-gray-600 mt-1">Create a custom section</div>
              </div>
            </motion.button>
          </div>
          
          <div className="flex justify-end mt-3 md:mt-4">
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={resetForm}
              className="px-3 md:px-4 py-1.5 md:py-2 text-gray-600 hover:text-gray-800 text-sm md:text-base"
            >
              Cancel
            </motion.button>
          </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Section Form */}
      <AnimatePresence>
        {(formData.title || editingId) && (
          <motion.div 
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: -20 }}
            className="border border-gray-300 rounded-lg p-4 md:p-6 bg-white"
          >
            <h4 className="font-medium text-gray-900 mb-3 md:mb-4 text-sm md:text-base">
              {editingId ? `Edit ${formData.title}` : `Add ${formData.title}`}
            </h4>

            <div className="space-y-3 md:space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5 md:mb-2">
                  Section Title
                </label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm md:text-base"
                  placeholder="Section title"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5 md:mb-2">
                  Content
                </label>
                <SimpleRichTextEditor
                  value={formData.content}
                  onChange={(value: string) => setFormData({ ...formData, content: value })}
                  placeholder="Add your content here..."
                  height="120px"
                />
              </div>
            </div>

            <div className="flex flex-col sm:flex-row justify-end gap-2 sm:gap-3 mt-4 md:mt-6">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={resetForm}
                className="px-3 md:px-4 py-1.5 md:py-2 text-gray-600 hover:text-gray-800 text-sm md:text-base"
              >
                Cancel
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={handleSave}
                disabled={!isFormValid}
                className="px-3 md:px-4 py-1.5 md:py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed text-sm md:text-base"
              >
                {editingId ? 'Update Section' : 'Add Section'}
              </motion.button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Change Template Option */}
      <motion.div 
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="border-t border-gray-200 pt-4 md:pt-6"
      >
        <h3 className="text-base md:text-lg font-medium text-gray-900 mb-2">Change Template</h3>
        <p className="text-sm md:text-base text-gray-600 mb-3 md:mb-4">Want to use a different template for your resume?</p>
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => router.push('/template')}
          className="px-3 md:px-4 py-1.5 md:py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 text-sm md:text-base"
        >
          Browse Templates
        </motion.button>
      </motion.div>

      {/* Navigation Buttons */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="flex flex-col sm:flex-row justify-between gap-3 sm:gap-4"
      >
        <motion.button
          whileHover={{ scale: 1.02, x: -3 }}
          whileTap={{ scale: 0.98 }}
          onClick={onPrev}
          className="px-4 md:px-6 py-2 md:py-3 text-gray-600 hover:text-gray-800 font-medium text-sm md:text-base"
        >
          Previous
        </motion.button>
        <motion.button
          whileHover={{ scale: 1.02, x: 3 }}
          whileTap={{ scale: 0.98 }}
          onClick={handleFinish}
          className="px-4 md:px-6 py-2 md:py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 font-medium text-sm md:text-base"
        >
          Finish & Preview Resume
        </motion.button>
      </motion.div>
    </motion.div>
  )
}

export default AdditionalInfoStep
