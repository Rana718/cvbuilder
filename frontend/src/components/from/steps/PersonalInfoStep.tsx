import React, { useState } from 'react'
import { Plus, X, Globe, Linkedin, Github, Twitter } from 'lucide-react'
import { useResumeStore } from '@/store/resumeStore'

interface PersonalInfoStepProps {
  onNext: () => void
}

const websiteOptions = [
  { label: 'LinkedIn', icon: Linkedin, placeholder: 'https://linkedin.com/in/yourname' },
  { label: 'GitHub', icon: Github, placeholder: 'https://github.com/yourname' },
  { label: 'Portfolio', icon: Globe, placeholder: 'https://yourwebsite.com' },
  { label: 'Twitter', icon: Twitter, placeholder: 'https://twitter.com/yourname' },
  { label: 'Other', icon: Globe, placeholder: 'https://example.com' }
]

function PersonalInfoStep({ onNext }: PersonalInfoStepProps) {
  const { personalInfo, updatePersonalInfo, addWebsite, removeWebsite } = useResumeStore()
  const [showAddWebsite, setShowAddWebsite] = useState(false)
  const [newWebsite, setNewWebsite] = useState({ label: '', url: '' })

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

  const selectWebsiteType = (option: typeof websiteOptions[0]) => {
    setNewWebsite({ label: option.label, url: option.placeholder })
  }

  const isFormValid = personalInfo.firstName && personalInfo.lastName && personalInfo.email && personalInfo.profession

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Personal Information</h2>
        <p className="text-gray-600">Let's start with your basic information</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            First Name *
          </label>
          <input
            type="text"
            value={personalInfo.firstName}
            onChange={(e) => handleInputChange('firstName', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="John"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Last Name *
          </label>
          <input
            type="text"
            value={personalInfo.lastName}
            onChange={(e) => handleInputChange('lastName', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="Doe"
          />
        </div>

        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Profession *
          </label>
          <input
            type="text"
            value={personalInfo.profession}
            onChange={(e) => handleInputChange('profession', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="Software Engineer"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            City
          </label>
          <input
            type="text"
            value={personalInfo.city}
            onChange={(e) => handleInputChange('city', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="New York"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Country
          </label>
          <input
            type="text"
            value={personalInfo.country}
            onChange={(e) => handleInputChange('country', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="United States"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Pincode
          </label>
          <input
            type="text"
            value={personalInfo.pincode}
            onChange={(e) => handleInputChange('pincode', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="10001"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Phone
          </label>
          <input
            type="tel"
            value={personalInfo.phone}
            onChange={(e) => handleInputChange('phone', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="+1 (555) 123-4567"
          />
        </div>

        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Email *
          </label>
          <input
            type="email"
            value={personalInfo.email}
            onChange={(e) => handleInputChange('email', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="john.doe@example.com"
          />
        </div>
      </div>

      {/* Professional Websites */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-medium text-gray-900">Professional Websites</h3>
          <button
            onClick={() => setShowAddWebsite(true)}
            className="flex items-center space-x-2 text-blue-600 hover:text-blue-700 font-medium"
          >
            <Plus className="w-4 h-4" />
            <span>Add Website</span>
          </button>
        </div>

        {personalInfo.websites.length > 0 && (
          <div className="space-y-3 mb-4">
            {personalInfo.websites.map((website) => (
              <div key={website.id} className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                <div className="flex-1">
                  <div className="font-medium text-gray-900">{website.label}</div>
                  <div className="text-sm text-gray-600">{website.url}</div>
                </div>
                <button
                  onClick={() => removeWebsite(website.id)}
                  className="text-red-500 hover:text-red-700"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        )}

        {showAddWebsite && (
          <div className="border border-gray-300 rounded-lg p-4 bg-white">
            <h4 className="font-medium text-gray-900 mb-3">Add Professional Website</h4>
            
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-2 mb-4">
              {websiteOptions.map((option) => {
                const Icon = option.icon
                return (
                  <button
                    key={option.label}
                    onClick={() => selectWebsiteType(option)}
                    className="flex flex-col items-center p-3 border border-gray-300 rounded-lg hover:bg-blue-50 hover:border-blue-300 transition-colors"
                  >
                    <Icon className="w-5 h-5 text-gray-600 mb-1" />
                    <span className="text-xs text-gray-700">{option.label}</span>
                  </button>
                )
              })}
            </div>

            <div className="space-y-3">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Website Type
                </label>
                <input
                  type="text"
                  value={newWebsite.label}
                  onChange={(e) => setNewWebsite({ ...newWebsite, label: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="LinkedIn, GitHub, Portfolio, etc."
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  URL
                </label>
                <input
                  type="url"
                  value={newWebsite.url}
                  onChange={(e) => setNewWebsite({ ...newWebsite, url: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="https://..."
                />
              </div>
            </div>

            <div className="flex justify-end space-x-3 mt-4">
              <button
                onClick={() => {
                  setShowAddWebsite(false)
                  setNewWebsite({ label: '', url: '' })
                }}
                className="px-4 py-2 text-gray-600 hover:text-gray-800"
              >
                Cancel
              </button>
              <button
                onClick={handleAddWebsite}
                disabled={!newWebsite.label || !newWebsite.url}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Add Website
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Next Button */}
      <div className="flex justify-end">
        <button
          onClick={onNext}
          disabled={!isFormValid}
          className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed font-medium"
        >
          Next: Work Experience
        </button>
      </div>
    </div>
  )
}

export default PersonalInfoStep
