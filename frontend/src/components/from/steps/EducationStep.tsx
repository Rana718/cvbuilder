import React, { useState } from 'react'
import { Plus, GraduationCap, Calendar } from 'lucide-react'
import { useResumeStore, Education } from '@/store/resumeStore'
import axiosInstance from '@/lib/axios'

interface EducationStepProps {
  onNext: () => void
  onPrev: () => void
}

function EducationStep({ onNext, onPrev }: EducationStepProps) {
  const { education, addEducation, updateEducation, removeEducation } = useResumeStore()
  const [showAddForm, setShowAddForm] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [formData, setFormData] = useState<Omit<Education, 'id'>>({
    schoolName: '',
    degree: '',
    fieldOfStudy: '',
    startDate: '',
    endDate: ''
  })

  const resetForm = () => {
    setFormData({
      schoolName: '',
      degree: '',
      fieldOfStudy: '',
      startDate: '',
      endDate: ''
    })
    setShowAddForm(false)
    setEditingId(null)
  }

  const handleSave = () => {
    if (editingId) {
      updateEducation(editingId, formData)
    } else {
      addEducation(formData)
    }
    resetForm()
  }

  const handleEdit = (edu: Education) => {
    setFormData(edu)
    setEditingId(edu.id)
    setShowAddForm(true)
  }

  const isFormValid = formData.schoolName && formData.degree && formData.startDate && formData.endDate

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Education</h2>
        <p className="text-gray-600">Tell us about your education</p>
      </div>

      {/* Existing Education */}
      {education.length > 0 && (
        <div className="space-y-4">
          <h3 className="text-lg font-medium text-gray-900">Education History</h3>
          {education.map((edu) => (
            <div key={edu.id} className="border border-gray-200 rounded-lg p-4 bg-white">
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <h4 className="font-semibold text-gray-900">{edu.degree}</h4>
                  <p className="text-gray-700">{edu.schoolName}</p>
                  {edu.fieldOfStudy && (
                    <p className="text-gray-600">Field of Study: {edu.fieldOfStudy}</p>
                  )}
                  <div className="flex items-center text-sm text-gray-600 mt-1">
                    <Calendar className="w-4 h-4 mr-1" />
                    <span>{edu.startDate} - {edu.endDate}</span>
                  </div>
                </div>
                <div className="flex space-x-2 ml-4">
                  <button
                    onClick={() => handleEdit(edu)}
                    className="text-blue-600 hover:text-blue-700 text-sm font-medium"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => removeEducation(edu.id)}
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

      {/* Add Education Button */}
      {!showAddForm && (
        <button
          onClick={() => setShowAddForm(true)}
          className="flex items-center space-x-2 text-blue-600 hover:text-blue-700 font-medium"
        >
          <Plus className="w-5 h-5" />
          <span>Add Education</span>
        </button>
      )}

      {/* Add/Edit Form */}
      {showAddForm && (
        <div className="border border-gray-300 rounded-lg p-6 bg-white">
          <h4 className="font-medium text-gray-900 mb-4">
            {editingId ? 'Edit Education' : 'Add Education'}
          </h4>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                School Name *
              </label>
              <input
                type="text"
                value={formData.schoolName}
                onChange={(e) => setFormData({ ...formData, schoolName: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="University of California, Berkeley"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Degree *
              </label>
              <input
                type="text"
                value={formData.degree}
                onChange={(e) => setFormData({ ...formData, degree: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Bachelor of Science"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Field of Study
              </label>
              <input
                type="text"
                value={formData.fieldOfStudy}
                onChange={(e) => setFormData({ ...formData, fieldOfStudy: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Computer Science"
              />
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
                End Date *
              </label>
              <input
                type="month"
                value={formData.endDate}
                onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
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
              {editingId ? 'Update Education' : 'Add Education'}
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
          disabled={education.length === 0}
          className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed font-medium"
        >
          Next: Skills
        </button>
      </div>
    </div>
  )
}

export default EducationStep
