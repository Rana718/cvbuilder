import React, { useState } from 'react'
import { Plus, X, Globe, Linkedin, Github, User, ChevronRight } from 'lucide-react'
import { useResumeStore } from '@/store/resumeStore'
import { CV_TEMPLATES } from '@/constants/templates'
import ImageUpload from '@/components/ImageUpload'
import { motion, AnimatePresence } from 'framer-motion'

interface PersonalInfoStepProps {
  onNext: () => void
}

const websiteOptions = [
  { label: 'LinkedIn', icon: Linkedin, placeholder: 'linkedin.com/in/yourname' },
  { label: 'GitHub', icon: Github, placeholder: 'github.com/yourname' },
  { label: 'Portfolio', icon: Globe, placeholder: 'yourwebsite.com' }
]

function PersonalInfoStep({ onNext }: PersonalInfoStepProps) {
  const { personalInfo, updatePersonalInfo, addWebsite, removeWebsite, templateId } = useResumeStore()
  const [showAddWebsite, setShowAddWebsite] = useState(false)
  const [newWebsite, setNewWebsite] = useState({ label: '', url: '' })

  const currentTemplate = CV_TEMPLATES.find(t => t.id === parseInt(templateId))
  const showImageUpload = currentTemplate?.hasPhoto || false

  const handleInputChange = (field: string, value: string) => {
    updatePersonalInfo({ [field]: value })
  }

  const handleAddWebsite = () => {
    if (newWebsite.label && newWebsite.url) {
      addWebsite(newWebsite)
      setNewWebsite({ label: '', url: '' })
      setShowAddWebsite(false)
    }
  }

  const getWebsiteIcon = (label: string) => {
    const lowerLabel = label.toLowerCase()
    if (lowerLabel.includes('linkedin')) return Linkedin
    if (lowerLabel.includes('github')) return Github
    return Globe
  }

  const isFormValid = personalInfo.firstName && personalInfo.lastName && personalInfo.email && personalInfo.profession

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.3 }}
      className="max-w-4xl mx-auto space-y-4"
    >
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="text-left"
      >
        <div className="flex items-start mb-4">
          <div className="p-2 md:p-3 bg-blue-100 rounded-full mr-3 md:mr-2">
            <User className="w-6 h-6 md:w-8 md:h-8 text-blue-600" />
          </div>
          <div className="flex-1">
            <h2 className="text-2xl md:text-3xl font-bold text-gray-900">Personal Information</h2>
            <p className="text-base md:text-lg text-gray-600">Let's start with your basic details</p>
          </div>
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.2 }}
        className="bg-white p-2"
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-semibold text-gray-800 mb-2">First Name *</label>
            <input
              type="text"
              value={personalInfo.firstName}
              onChange={(e) => handleInputChange('firstName', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-sm focus:ring-1 focus:ring-blue-500 focus:border-blue-500 transition-all"
              placeholder="John"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-800 mb-2">Last Name *</label>
            <input
              type="text"
              value={personalInfo.lastName}
              onChange={(e) => handleInputChange('lastName', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-sm focus:ring-1 focus:ring-blue-500 focus:border-blue-500 transition-all"
              placeholder="Doe"
            />
          </div>

          <div className="md:col-span-2">
            <label className="block text-sm font-semibold text-gray-800 mb-2">Profession *</label>
            <input
              type="text"
              value={personalInfo.profession}
              onChange={(e) => handleInputChange('profession', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-sm focus:ring-1 focus:ring-blue-500 focus:border-blue-500 transition-all"
              placeholder="Software Engineer"
            />
          </div>

          {showImageUpload && (
            <div className="md:col-span-2">
              <ImageUpload />
            </div>
          )}

          <div>
            <label className="block text-sm font-semibold text-gray-800 mb-2">Email *</label>
            <input
              type="email"
              value={personalInfo.email}
              onChange={(e) => handleInputChange('email', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-sm focus:ring-1 focus:ring-blue-500 focus:border-blue-500 transition-all"
              placeholder="john.doe@example.com"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-800 mb-2">Phone</label>
            <input
              type="tel"
              value={personalInfo.phone}
              onChange={(e) => handleInputChange('phone', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-sm focus:ring-1 focus:ring-blue-500 focus:border-blue-500 transition-all"
              placeholder="+1 (555) 123-4567"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-800 mb-2">City</label>
            <input
              type="text"
              value={personalInfo.city}
              onChange={(e) => handleInputChange('city', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-sm focus:ring-1 focus:ring-blue-500 focus:border-blue-500 transition-all"
              placeholder="New York"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-800 mb-2">Country</label>
            <input
              type="text"
              value={personalInfo.country}
              onChange={(e) => handleInputChange('country', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-sm focus:ring-1 focus:ring-blue-500 focus:border-blue-500 transition-all"
              placeholder="United States"
            />
          </div>
        </div>
      </motion.div>

      <AnimatePresence>
        {personalInfo.websites.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ delay: 0.3 }}
            className="bg-white p-4"
          >
            <h3 className="text-lg md:text-xl font-bold text-gray-900 mb-4">Professional Links</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {personalInfo.websites.map((website) => {
                const IconComponent = getWebsiteIcon(website.label)

                return (
                  <div key={website.id} className="flex items-center justify-between p-3 bg-white border border-gray-300 rounded-sm">
                    <div className="flex items-center space-x-3">
                      <IconComponent className="w-5 h-5 text-blue-600" />
                      <div>
                        <div className="font-semibold text-gray-900">{website.label}</div>
                        <div className="text-sm text-gray-600 truncate">{website.url}</div>
                      </div>
                    </div>
                    <button
                      onClick={() => removeWebsite(website.id)}
                      className="text-gray-600 hover:text-red-600 p-2 hover:bg-gray-50 rounded-sm transition-all"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                )
              })}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="bg-white p-3"
      >
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg md:text-xl font-bold text-gray-900">Add Website</h3>
        </div>

        {!showAddWebsite ? (
          <button
            onClick={() => setShowAddWebsite(true)}
            className="w-full p-3 border border-gray-300 border-dashed rounded-sm hover:bg-gray-50 hover:border-gray-400 transition-all text-gray-600 hover:text-gray-800"
          >
            <Plus className="w-6 h-6 mx-auto mb-2" />
            <span className="font-medium">Add Professional Website</span>
          </button>
        ) : (
          <div className="space-y-4">
            <div className="grid grid-cols-3 gap-3">
              {websiteOptions.map((option) => {
                const Icon = option.icon
                return (
                  <button
                    key={option.label}
                    onClick={() => setNewWebsite({ label: option.label, url: option.placeholder })}
                    className="flex flex-col items-center p-3 border border-gray-300 rounded-sm hover:bg-gray-50 hover:border-gray-400 transition-all"
                  >
                    <Icon className="w-6 h-6 text-gray-600 mb-2" />
                    <span className="text-sm font-medium text-gray-700">{option.label}</span>
                  </button>
                )
              })}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold text-gray-800 mb-2">Website Type</label>
                <input
                  type="text"
                  value={newWebsite.label}
                  onChange={(e) => setNewWebsite({ ...newWebsite, label: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-sm focus:ring-1 focus:ring-blue-500 focus:border-blue-500 transition-all"
                  placeholder="LinkedIn, GitHub, Portfolio"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-800 mb-2">URL</label>
                <input
                  type="url"
                  value={newWebsite.url}
                  onChange={(e) => setNewWebsite({ ...newWebsite, url: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-sm focus:ring-1 focus:ring-blue-500 focus:border-blue-500 transition-all"
                  placeholder="https://yourwebsite.com"
                />
              </div>
            </div>

            <div className="flex justify-end space-x-3">
              <button
                onClick={() => {
                  setShowAddWebsite(false)
                  setNewWebsite({ label: '', url: '' })
                }}
                className="px-4 py-2 text-gray-600 hover:text-gray-800 font-medium"
              >
                Cancel
              </button>
              <button
                onClick={handleAddWebsite}
                disabled={!newWebsite.label || !newWebsite.url}
                className="px-4 py-2 bg-blue-600 text-white rounded-sm hover:bg-blue-700 disabled:opacity-50 font-medium transition-all"
              >
                Add Website
              </button>
            </div>
          </div>
        )}
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="flex justify-end pt-4 border-t border-gray-300"
      >
        <motion.button
          whileHover={{ scale: 1.02, x: 5 }}
          whileTap={{ scale: 0.98 }}
          onClick={onNext}
          disabled={!isFormValid}
          className="flex items-center space-x-2 px-8 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-sm hover:from-blue-700 hover:to-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed font-semibold shadow-lg hover:shadow-xl transition-all"
        >
          <span>Continue</span>
          <ChevronRight className="w-5 h-5" />
        </motion.button>
      </motion.div>
    </motion.div>
  )
}

export default PersonalInfoStep