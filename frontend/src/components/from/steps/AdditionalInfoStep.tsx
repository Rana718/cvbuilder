import React, { useState } from 'react'
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
    summary
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

  const handleFinish = () => {
    // Log all resume data
    const resumeData = {
      templateId,
      personalInfo,
      workExperience,
      education,
      skills,
      summary,
      additionalSections
    }
    
    console.log('Resume Data:', resumeData)
    
    // Generate a unique resume ID (in real app, this would come from API)
    const resumeId = Math.random().toString(36).substr(2, 9)
    
    // Redirect to resume page
    router.push(`/resusme/${resumeId}?template=${templateId}`)
  }

  const isFormValid = formData.title && formData.content

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Additional Information</h2>
        <p className="text-gray-600">Do you have anything else to add?</p>
        <p className="text-sm text-gray-500 mt-1">These sections are optional.</p>
      </div>

      {/* Existing Additional Sections */}
      {additionalSections.length > 0 && (
        <div className="space-y-4">
          <h3 className="text-lg font-medium text-gray-900">Added Sections</h3>
          {additionalSections.map((section) => {
            const sectionType = additionalSectionTypes.find(t => t.type === section.type)
            const Icon = sectionType?.icon || Plus
            
            return (
              <div key={section.id} className="border border-gray-200 rounded-lg p-4 bg-white">
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <div className="flex items-center space-x-2 mb-2">
                      <Icon className="w-5 h-5 text-gray-600" />
                      <h4 className="font-semibold text-gray-900">{section.title}</h4>
                    </div>
                    <div 
                      className="text-sm text-gray-600 prose prose-sm max-w-none"
                      dangerouslySetInnerHTML={{ __html: section.content }}
                    />
                  </div>
                  <div className="flex space-x-2 ml-4">
                    <button
                      onClick={() => handleEdit(section)}
                      className="text-blue-600 hover:text-blue-700 text-sm font-medium"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => removeAdditionalSection(section.id)}
                      className="text-red-600 hover:text-red-700 text-sm font-medium"
                    >
                      Remove
                    </button>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      )}

      {/* Add Section Button */}
      {!showSectionPicker && (
        <button
          onClick={() => setShowSectionPicker(true)}
          className="flex items-center space-x-2 text-blue-600 hover:text-blue-700 font-medium"
        >
          <Plus className="w-5 h-5" />
          <span>Add Section</span>
        </button>
      )}

      {/* Section Type Picker */}
      {showSectionPicker && !editingId && (
        <div className="border border-gray-300 rounded-lg p-6 bg-white">
          <h4 className="font-medium text-gray-900 mb-4">Choose a section to add:</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {additionalSectionTypes.map((sectionType) => {
              const Icon = sectionType.icon
              const isAlreadyAdded = additionalSections.find(s => s.type === sectionType.type)
              
              return (
                <button
                  key={sectionType.type}
                  onClick={() => selectSectionType(sectionType)}
                  disabled={!!isAlreadyAdded}
                  className={`flex items-start space-x-3 p-4 text-left rounded-lg border transition-colors ${
                    isAlreadyAdded
                      ? 'bg-gray-50 border-gray-200 text-gray-400 cursor-not-allowed'
                      : 'bg-white border-gray-200 hover:bg-blue-50 hover:border-blue-300'
                  }`}
                >
                  <Icon className="w-5 h-5 text-gray-600 mt-0.5" />
                  <div>
                    <div className="font-medium text-gray-900">{sectionType.title}</div>
                    <div className="text-sm text-gray-600 mt-1">{sectionType.description}</div>
                    {sectionType.type === 'languages' && (
                      <div className="text-xs text-blue-600 mt-1 font-medium">NEW!</div>
                    )}
                  </div>
                </button>
              )
            })}
            
            {/* Custom Section */}
            <button
              onClick={() => setFormData({ ...formData, type: 'custom', title: 'Custom Section' })}
              className="flex items-start space-x-3 p-4 text-left rounded-lg border border-gray-200 hover:bg-blue-50 hover:border-blue-300 transition-colors"
            >
              <Settings className="w-5 h-5 text-gray-600 mt-0.5" />
              <div>
                <div className="font-medium text-gray-900">Add Your Own</div>
                <div className="text-sm text-gray-600 mt-1">Create a custom section</div>
              </div>
            </button>
          </div>
          
          <div className="flex justify-end mt-4">
            <button
              onClick={resetForm}
              className="px-4 py-2 text-gray-600 hover:text-gray-800"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* Section Form */}
      {(formData.title || editingId) && (
        <div className="border border-gray-300 rounded-lg p-6 bg-white">
          <h4 className="font-medium text-gray-900 mb-4">
            {editingId ? `Edit ${formData.title}` : `Add ${formData.title}`}
          </h4>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Section Title
              </label>
              <input
                type="text"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Section title"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
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
              {editingId ? 'Update Section' : 'Add Section'}
            </button>
          </div>
        </div>
      )}

      {/* Change Template Option */}
      <div className="border-t border-gray-200 pt-6">
        <h3 className="text-lg font-medium text-gray-900 mb-2">Change Template</h3>
        <p className="text-gray-600 mb-4">Want to use a different template for your resume?</p>
        <button
          onClick={() => router.push('/template')}
          className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
        >
          Browse Templates
        </button>
      </div>

      {/* Navigation Buttons */}
      <div className="flex justify-between">
        <button
          onClick={onPrev}
          className="px-6 py-3 text-gray-600 hover:text-gray-800 font-medium"
        >
          Previous
        </button>
        <button
          onClick={handleFinish}
          className="px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 font-medium"
        >
          Finish & Preview Resume
        </button>
      </div>
    </div>
  )
}

export default AdditionalInfoStep
