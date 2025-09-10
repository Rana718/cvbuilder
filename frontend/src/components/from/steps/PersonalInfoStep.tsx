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
      className="max-w-4xl mx-auto space-y-3 md:space-y-4"
    >
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="text-left"
      >
        <div className="flex items-start mb-3 md:mb-4">
          <div className="p-1.5 md:p-2 lg:p-3 bg-blue-100 rounded-full mr-2 md:mr-3">
            <User className="w-5 h-5 md:w-6 md:h-6 lg:w-8 lg:h-8 text-blue-600" />
          </div>
          <div className="flex-1">
            <h2 className="text-xl md:text-2xl lg:text-3xl font-bold text-gray-900">Personal Information</h2>
            <p className="text-sm md:text-base lg:text-lg text-gray-600">Let's start with your basic details</p>
          </div>
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.2 }}
        className="bg-white p-1.5 md:p-2"
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-4">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <label className="block text-sm font-semibold text-gray-800 mb-1.5 md:mb-2">First Name *</label>
            <input
              type="text"
              value={personalInfo.firstName}
              onChange={(e) => handleInputChange('firstName', e.target.value)}
              className="w-full px-2.5 md:px-3 py-1.5 md:py-2 border border-gray-300 rounded-sm focus:ring-1 focus:ring-blue-500 focus:border-blue-500 transition-all text-sm md:text-base"
              placeholder="John"
            />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            <label className="block text-sm font-semibold text-gray-800 mb-1.5 md:mb-2">Last Name *</label>
            <input
              type="text"
              value={personalInfo.lastName}
              onChange={(e) => handleInputChange('lastName', e.target.value)}
              className="w-full px-2.5 md:px-3 py-1.5 md:py-2 border border-gray-300 rounded-sm focus:ring-1 focus:ring-blue-500 focus:border-blue-500 transition-all text-sm md:text-base"
              placeholder="Doe"
            />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="md:col-span-2"
          >
            <label className="block text-sm font-semibold text-gray-800 mb-1.5 md:mb-2">Profession *</label>
            <input
              type="text"
              value={personalInfo.profession}
              onChange={(e) => handleInputChange('profession', e.target.value)}
              className="w-full px-2.5 md:px-3 py-1.5 md:py-2 border border-gray-300 rounded-sm focus:ring-1 focus:ring-blue-500 focus:border-blue-500 transition-all text-sm md:text-base"
              placeholder="Software Engineer"
            />
          </motion.div>

          {showImageUpload && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
              className="md:col-span-2"
            >
              <ImageUpload />
            </motion.div>
          )}

          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7 }}
          >
            <label className="block text-sm font-semibold text-gray-800 mb-1.5 md:mb-2">Email *</label>
            <input
              type="email"
              value={personalInfo.email}
              onChange={(e) => handleInputChange('email', e.target.value)}
              className="w-full px-2.5 md:px-3 py-1.5 md:py-2 border border-gray-300 rounded-sm focus:ring-1 focus:ring-blue-500 focus:border-blue-500 transition-all text-sm md:text-base"
              placeholder="john.doe@example.com"
            />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8 }}
          >
            <label className="block text-sm font-semibold text-gray-800 mb-1.5 md:mb-2">Phone</label>
            <input
              type="tel"
              value={personalInfo.phone}
              onChange={(e) => handleInputChange('phone', e.target.value)}
              className="w-full px-2.5 md:px-3 py-1.5 md:py-2 border border-gray-300 rounded-sm focus:ring-1 focus:ring-blue-500 focus:border-blue-500 transition-all text-sm md:text-base"
              placeholder="+1 (555) 123-4567"
            />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.9 }}
          >
            <label className="block text-sm font-semibold text-gray-800 mb-1.5 md:mb-2">City</label>
            <input
              type="text"
              value={personalInfo.city}
              onChange={(e) => handleInputChange('city', e.target.value)}
              className="w-full px-2.5 md:px-3 py-1.5 md:py-2 border border-gray-300 rounded-sm focus:ring-1 focus:ring-blue-500 focus:border-blue-500 transition-all text-sm md:text-base"
              placeholder="New York"
            />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.0 }}
          >
            <label className="block text-sm font-semibold text-gray-800 mb-1.5 md:mb-2">Country</label>
            <input
              type="text"
              value={personalInfo.country}
              onChange={(e) => handleInputChange('country', e.target.value)}
              className="w-full px-2.5 md:px-3 py-1.5 md:py-2 border border-gray-300 rounded-sm focus:ring-1 focus:ring-blue-500 focus:border-blue-500 transition-all text-sm md:text-base"
              placeholder="United States"
            />
          </motion.div>
        </div>
      </motion.div>

      <AnimatePresence>
        {personalInfo.websites.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ delay: 0.3 }}
            className="bg-white p-2 md:p-3"
          >
            <h3 className="text-base md:text-lg lg:text-xl font-bold text-gray-900 mb-2 md:mb-3">Professional Links</h3>
            <div className="grid grid-cols-1 gap-2 md:gap-3">
              {personalInfo.websites.map((website, index) => {
                const IconComponent = getWebsiteIcon(website.label)

                return (
                  <motion.div 
                    key={website.id} 
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 20 }}
                    transition={{ delay: index * 0.1 }}
                    className="flex items-center justify-between p-2 md:p-3 bg-white border border-gray-300 rounded-sm"
                  >
                    <div className="flex items-center space-x-2 md:space-x-3 flex-1 min-w-0">
                      <IconComponent className="w-4 h-4 md:w-5 md:h-5 text-blue-600 flex-shrink-0" />
                      <div className="min-w-0 flex-1">
                        <div className="font-semibold text-gray-900 text-sm md:text-base">{website.label}</div>
                        <div className="text-xs md:text-sm text-gray-600 truncate">{website.url}</div>
                      </div>
                    </div>
                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      onClick={() => removeWebsite(website.id)}
                      className="text-gray-600 hover:text-red-600 p-1.5 md:p-2 hover:bg-gray-50 rounded-sm transition-all flex-shrink-0"
                    >
                      <X className="w-3 h-3 md:w-4 md:h-4" />
                    </motion.button>
                  </motion.div>
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
        className="bg-white p-2 md:p-3"
      >
        <div className="flex items-center justify-between mb-3 md:mb-4">
          <h3 className="text-base md:text-lg lg:text-xl font-bold text-gray-900">Add Website</h3>
        </div>

        {!showAddWebsite ? (
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => setShowAddWebsite(true)}
            className="w-full p-2.5 md:p-3 border border-gray-300 border-dashed rounded-sm hover:bg-gray-50 hover:border-gray-400 transition-all text-gray-600 hover:text-gray-800"
          >
            <Plus className="w-5 h-5 md:w-6 md:h-6 mx-auto mb-1 md:mb-2" />
            <span className="font-medium text-sm md:text-base">Add Professional Website</span>
          </motion.button>
        ) : (
          <motion.div 
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="space-y-3 md:space-y-4"
          >
            <div className="grid grid-cols-3 gap-2 md:gap-3">
              {websiteOptions.map((option, index) => {
                const Icon = option.icon
                return (
                  <motion.button
                    key={option.label}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setNewWebsite({ label: option.label, url: option.placeholder })}
                    className="flex flex-col items-center p-2 md:p-3 border border-gray-300 rounded-sm hover:bg-gray-50 hover:border-gray-400 transition-all"
                  >
                    <Icon className="w-5 h-5 md:w-6 md:h-6 text-gray-600 mb-1 md:mb-2" />
                    <span className="text-xs md:text-sm font-medium text-gray-700">{option.label}</span>
                  </motion.button>
                )
              })}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-4">
              <div>
                <label className="block text-sm font-semibold text-gray-800 mb-1.5 md:mb-2">Website Type</label>
                <input
                  type="text"
                  value={newWebsite.label}
                  onChange={(e) => setNewWebsite({ ...newWebsite, label: e.target.value })}
                  className="w-full px-2.5 md:px-3 py-1.5 md:py-2 border border-gray-300 rounded-sm focus:ring-1 focus:ring-blue-500 focus:border-blue-500 transition-all text-sm md:text-base"
                  placeholder="LinkedIn, GitHub, Portfolio"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-800 mb-1.5 md:mb-2">URL</label>
                <input
                  type="url"
                  value={newWebsite.url}
                  onChange={(e) => setNewWebsite({ ...newWebsite, url: e.target.value })}
                  className="w-full px-2.5 md:px-3 py-1.5 md:py-2 border border-gray-300 rounded-sm focus:ring-1 focus:ring-blue-500 focus:border-blue-500 transition-all text-sm md:text-base"
                  placeholder="https://yourwebsite.com"
                />
              </div>
            </div>

            <div className="flex flex-col sm:flex-row justify-end gap-2 sm:gap-3">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => {
                  setShowAddWebsite(false)
                  setNewWebsite({ label: '', url: '' })
                }}
                className="px-3 md:px-4 py-1.5 md:py-2 text-gray-600 hover:text-gray-800 font-medium text-sm md:text-base"
              >
                Cancel
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={handleAddWebsite}
                disabled={!newWebsite.label || !newWebsite.url}
                className="px-3 md:px-4 py-1.5 md:py-2 bg-blue-600 text-white rounded-sm hover:bg-blue-700 disabled:opacity-50 font-medium transition-all text-sm md:text-base"
              >
                Add Website
              </motion.button>
            </div>
          </motion.div>
        )}
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="flex justify-end pt-3 md:pt-4 border-t border-gray-300"
      >
        <motion.button
          whileHover={{ scale: 1.02, x: 5 }}
          whileTap={{ scale: 0.98 }}
          onClick={onNext}
          disabled={!isFormValid}
          className="flex items-center space-x-2 px-6 md:px-8 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-sm hover:from-blue-700 hover:to-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed font-semibold shadow-lg hover:shadow-xl transition-all text-sm md:text-base"
        >
          <span>Continue</span>
          <ChevronRight className="w-5 h-5" />
        </motion.button>
      </motion.div>
    </motion.div>
  )
}

export default PersonalInfoStep