import React, { useState, useRef } from 'react'
import { Plus, X, Briefcase, MapPin, Calendar as CalendarIcon, Sparkles, ChevronLeft, ChevronRight } from 'lucide-react'
import { useResumeStore, WorkExperience } from '@/store/resumeStore'
import SimpleRichTextEditor from '@/components/ui/SimpleRichTextEditor'
import axiosInstance from '@/lib/axios'
import { Button } from '@/components/ui/button'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { Calendar } from '@/components/ui/calendar'
import { cn } from '@/lib/utils'
import { motion, AnimatePresence } from 'framer-motion'

interface WorkExperienceStepProps {
  onNext: () => void
  onPrev: () => void
}

function WorkExperienceStep({ onNext, onPrev }: WorkExperienceStepProps) {
  const { workExperience, addWorkExperience, updateWorkExperience, removeWorkExperience } = useResumeStore()
  const [showAddForm, setShowAddForm] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [aiSuggestions, setAiSuggestions] = useState<string[]>([])
  const [selectedSuggestions, setSelectedSuggestions] = useState<string[]>([])
  const [isLoadingSuggestions, setIsLoadingSuggestions] = useState(false)
  const [startDateOpen, setStartDateOpen] = useState(false)
  const [endDateOpen, setEndDateOpen] = useState(false)
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
  const editorRef = useRef<HTMLDivElement | null>(null)

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
    setSelectedSuggestions([])
    setStartDateOpen(false)
    setEndDateOpen(false)
  }

  function formatMonth(date: Date) {
    return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`
  }

  function parseMonthString(value?: string) {
    if (!value) return undefined
    const [y, m] = value.split('-').map(Number)
    if (!y || !m) return undefined
    return new Date(y, m - 1, 1)
  }

  function displayMonth(value?: string) {
    const d = parseMonthString(value)
    return d ? d.toLocaleString(undefined, { month: 'short', year: 'numeric' }) : 'Select month'
  }

  function MonthYearPicker({
    label,
    value,
    onChange,
    fromYear = 1950,
    toYear = new Date().getFullYear() + 10,
    placeholder = 'Select month',
    isStart = false
  }: {
    label: string
    value?: string
    onChange: (v: string) => void
    fromYear?: number
    toYear?: number
    placeholder?: string
    isStart?: boolean
  }) {
    const open = isStart ? startDateOpen : endDateOpen
    const setOpen = isStart ? setStartDateOpen : setEndDateOpen
    const selected = parseMonthString(value)

    return (
      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-2">{label}</label>
        <Popover open={open} onOpenChange={setOpen}>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              className={cn('w-full justify-start text-left font-normal', !selected && 'text-muted-foreground')}
            >
              <CalendarIcon className="mr-2 h-4 w-4" />
              {selected ? displayMonth(value) : placeholder}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0" align="start">
            <Calendar
              mode="single"
              captionLayout="dropdown"
              fromYear={fromYear}
              toYear={toYear}
              selected={selected}
              onSelect={(d) => {
                if (!d) return
                const normalized = new Date(d.getFullYear(), d.getMonth(), 1)
                onChange(formatMonth(normalized))
                setOpen(false)
              }}
              initialFocus
            />
          </PopoverContent>
        </Popover>
      </div>
    )
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
    const cleanSuggestion = suggestion
      .replace(/^["']|["']$/g, '')
      .replace(/^,\s*|,\s*$/g, '')
      .replace(/^•\s*/, '')
      .trim()

    // Check if suggestion is already selected
    if (selectedSuggestions.includes(suggestion)) {
      // Remove from description and selected suggestions
      const currentDesc = formData.description
      const suggestionRegex = new RegExp(`<br>•\\s*${cleanSuggestion.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}|•\\s*${cleanSuggestion.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}<br>|•\\s*${cleanSuggestion.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}`, 'gi')
      const newDesc = currentDesc.replace(suggestionRegex, '').replace(/<br><br>/g, '<br>').replace(/^<br>|<br>$/g, '')
      
      setFormData({ ...formData, description: newDesc })
      setSelectedSuggestions(prev => prev.filter(s => s !== suggestion))
      
      if (editorRef.current) {
        editorRef.current.innerHTML = newDesc
      }
      return
    }

    // Add to description and selected suggestions
    const currentDesc = formData.description.trim()
    let newDesc = ''

    if (currentDesc && !currentDesc.includes('text-gray-400')) {
      newDesc = `${currentDesc}<br>• ${cleanSuggestion}`
    } else {
      newDesc = `• ${cleanSuggestion}`
    }

    setFormData({ ...formData, description: newDesc })
    setSelectedSuggestions(prev => [...prev, suggestion])

    if (editorRef.current) {
      editorRef.current.innerHTML = newDesc
      editorRef.current.focus()
      const range = document.createRange()
      range.selectNodeContents(editorRef.current)
      range.collapse(false)
      const sel = window.getSelection()
      if (sel) {
        sel.removeAllRanges()
        sel.addRange(range)
      }
    }
  }

  const isFormValid = formData.jobTitle && formData.employer && formData.startDate && (formData.isCurrentlyWorking || formData.endDate)

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="space-y-8 max-w-4xl mx-auto"
    >
      {/* Header Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="text-center"
      >
        <motion.div
          animate={{ rotate: [0, 5, -5, 0] }}
          transition={{ duration: 2, repeat: Infinity, repeatDelay: 3 }}
          className="w-16 h-16 mx-auto mb-4 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl flex items-center justify-center shadow-lg"
        >
          <Briefcase className="w-8 h-8 text-white" />
        </motion.div>
        <h2 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent mb-3">
          Work Experience
        </h2>
        <p className="text-gray-600 text-lg">
          Tell us about your professional experience
        </p>
      </motion.div>

      {/* Existing Work Experience */}
      {workExperience.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="space-y-4"
        >
          <h3 className="text-xl font-semibold text-gray-800 flex items-center">
            <motion.div
              whileHover={{ scale: 1.1, rotate: 5 }}
              className="w-8 h-8 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-lg flex items-center justify-center mr-3 shadow-md"
            >
              <Briefcase className="w-4 h-4 text-white" />
            </motion.div>
            Work History Summary
          </h3>
          {workExperience.map((exp, index) => (
            <motion.div
              key={exp.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 + index * 0.1 }}
              className="bg-white border border-gray-200 rounded-xl p-6 shadow-lg hover:shadow-xl transition-all duration-300"
            >
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <h4 className="font-semibold text-gray-900 text-lg">{exp.jobTitle}</h4>
                  <p className="text-blue-700 font-medium">{exp.employer}</p>
                  <div className="flex items-center space-x-4 text-sm text-gray-600 mt-2">
                    <span className="flex items-center bg-white px-3 py-1 rounded-full shadow-sm">
                      <MapPin className="w-4 h-4 mr-1 text-blue-500" />
                      {exp.isRemote ? 'Remote' : exp.location}
                    </span>
                    <span className="flex items-center bg-white px-3 py-1 rounded-full shadow-sm">
                      <CalendarIcon className="w-4 h-4 mr-1 text-blue-500" />
                      {exp.startDate} - {exp.isCurrentlyWorking ? 'Present' : exp.endDate}
                    </span>
                  </div>
                  {exp.description && (
                    <div
                      className="mt-4 text-sm text-gray-700 prose prose-sm max-w-none bg-white p-4 rounded-lg shadow-sm"
                      dangerouslySetInnerHTML={{ __html: exp.description }}
                    />
                  )}
                </div>
                <div className="flex space-x-2 ml-4">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => handleEdit(exp)}
                    className="px-4 py-2 text-blue-600 hover:text-blue-700 hover:bg-blue-100 rounded-lg text-sm font-medium transition-all"
                  >
                    Edit
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => removeWorkExperience(exp.id)}
                    className="px-4 py-2 text-red-600 hover:text-red-700 hover:bg-red-100 rounded-lg text-sm font-medium transition-all"
                  >
                    Remove
                  </motion.button>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>
      )}

      {/* Add Experience Button */}
      {!showAddForm && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="flex justify-center"
        >
          <motion.button
            whileHover={{ scale: 1.05, y: -2 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setShowAddForm(true)}
            className="flex items-center space-x-2 px-6 py-3 bg-gradient-to-r from-blue-500 to-indigo-600 text-white rounded-xl hover:from-blue-600 hover:to-indigo-700 font-medium shadow-lg transition-all"
          >
            <Plus className="w-5 h-5" />
            <span>Add Work Experience</span>
          </motion.button>
        </motion.div>
      )}

      {/* Add/Edit Form */}
      <AnimatePresence>
        {showAddForm && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="bg-white border border-gray-200 rounded-2xl p-8 shadow-lg"
          >
            <div className="flex items-center justify-between mb-6">
              <h4 className="text-xl font-semibold text-gray-800 flex items-center">
                <motion.div
                  whileHover={{ scale: 1.1, rotate: 5 }}
                  className="w-8 h-8 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-lg flex items-center justify-center mr-3 shadow-md"
                >
                  <Briefcase className="w-4 h-4 text-white" />
                </motion.div>
                {editingId ? 'Edit Experience' : 'Add Work Experience'}
              </h4>
              <motion.button
                whileHover={{ scale: 1.1, rotate: 90 }}
                whileTap={{ scale: 0.9 }}
                onClick={resetForm}
                className="w-8 h-8 flex items-center justify-center rounded-full bg-gray-200 text-gray-600 hover:bg-gray-300 transition-colors"
              >
                ×
              </motion.button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
              {/* Row 1: Job Title, Employer, Role */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="space-y-2"
              >
                <label className="block text-sm font-semibold text-gray-700">
                  Job Title <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={formData.jobTitle}
                  onChange={(e) => setFormData({ ...formData, jobTitle: e.target.value })}
                  className="w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all shadow-sm text-sm"
                  placeholder="Software Engineer"
                />
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.15 }}
                className="space-y-2"
              >
                <label className="block text-sm font-semibold text-gray-700">
                  Employer <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={formData.employer}
                  onChange={(e) => setFormData({ ...formData, employer: e.target.value })}
                  className="w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all shadow-sm text-sm"
                  placeholder="Company Name"
                />
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="space-y-2"
              >
                <label className="block text-sm font-semibold text-gray-700">
                  Role <span className="text-gray-400 text-xs">(optional)</span>
                </label>
                <input
                  type="text"
                  value={formData.role || ''}
                  onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                  className="w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all shadow-sm text-sm"
                  placeholder="Team Lead, Senior Dev..."
                />
              </motion.div>
            </div>

            {/* Row 2: Location and Remote Work */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.25 }}
                className="space-y-2"
              >
                <label className="block text-sm font-semibold text-gray-700">
                  Location
                </label>
                <input
                  type="text"
                  value={formData.location}
                  onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                  className="w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all shadow-sm text-sm"
                  placeholder="New York, NY"
                  disabled={formData.isRemote}
                />
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="flex items-end"
              >
                <label className="flex items-center space-x-3 cursor-pointer bg-gray-50 px-4 py-2.5 rounded-lg border border-gray-300 hover:bg-gray-100 transition-colors w-full">
                  <input
                    type="checkbox"
                    checked={formData.isRemote}
                    onChange={(e) => setFormData({ ...formData, isRemote: e.target.checked, location: e.target.checked ? '' : formData.location })}
                    className="rounded border-gray-300 text-blue-500 focus:ring-blue-500"
                  />
                  <span className="text-sm font-medium text-gray-700">Remote Work</span>
                </label>
              </motion.div>
            </div>

            {/* Row 3: Dates and Currently Working */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.35 }}
                className="space-y-2"
              >
                <MonthYearPicker
                  label="Start Date *"
                  value={formData.startDate}
                  onChange={(v) => setFormData({ ...formData, startDate: v })}
                  isStart={true}
                />
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="space-y-2"
              >
                <MonthYearPicker
                  label={`End Date ${!formData.isCurrentlyWorking ? '*' : ''}`}
                  value={formData.endDate}
                  onChange={(v) => setFormData({ ...formData, endDate: v })}
                  isStart={false}
                />
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.45 }}
                className="flex items-end"
              >
                <label className="flex items-center space-x-3 cursor-pointer bg-gray-50 px-4 py-2.5 rounded-lg border border-gray-300 hover:bg-gray-100 transition-colors w-full">
                  <input
                    type="checkbox"
                    checked={formData.isCurrentlyWorking}
                    onChange={(e) => handleCurrentlyWorkingChange(e.target.checked)}
                    className="rounded border-gray-300 text-blue-500 focus:ring-blue-500"
                  />
                  <span className="text-sm font-medium text-gray-700">Currently Working</span>
                </label>
              </motion.div>
            </div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="mt-6"
            >
              <label className="block text-sm font-semibold text-gray-700 mb-3">
                Job Description
              </label>
              <div className="bg-white rounded-lg border border-gray-300 overflow-hidden shadow-sm">
                <SimpleRichTextEditor
                  value={formData.description}
                  onChange={(value: string) => setFormData({ ...formData, description: value })}
                  placeholder="Describe your responsibilities and achievements..."
                  height="120px"
                />
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
              className="mt-6"
            >
              <div className="flex items-center justify-between mb-4">
                <h5 className="text-lg font-semibold text-gray-700 flex items-center">
                  <Sparkles className="w-5 h-5 mr-2 text-blue-500" />
                  AI-Generated Suggestions
                </h5>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={generateAISuggestions}
                  disabled={!formData.jobTitle || !formData.employer || isLoadingSuggestions}
                  className="flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-blue-500 to-indigo-600 text-white rounded-lg hover:from-blue-600 hover:to-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed text-sm font-medium transition-all shadow-md"
                >
                  <Sparkles className="w-4 h-4" />
                  <span>{isLoadingSuggestions ? 'Generating...' : 'Generate Suggestions'}</span>
                </motion.button>
              </div>

              <AnimatePresence>
                {isLoadingSuggestions && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="flex items-center justify-center py-12 bg-white rounded-xl border border-gray-200"
                  >
                    <div className="text-center">
                      <motion.div
                        animate={{ rotate: 360 }}
                        transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                        className="w-8 h-8 border-3 border-blue-500 border-t-transparent rounded-full mx-auto mb-4"
                      />
                      <p className="text-sm text-gray-600 font-medium">
                        AI is generating personalized suggestions...
                      </p>
                    </div>
                  </motion.div>
                )}

                {aiSuggestions.length > 0 && !isLoadingSuggestions && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="grid grid-cols-1 md:grid-cols-2 gap-3"
                  >
                    {aiSuggestions.map((suggestion, index) => {
                      const isSelected = selectedSuggestions.includes(suggestion)
                      return (
                        <motion.button
                          key={index}
                          initial={{ opacity: 0, scale: 0.9 }}
                          animate={{ opacity: 1, scale: 1 }}
                          transition={{ delay: index * 0.05 }}
                          whileHover={{ scale: isSelected ? 0.98 : 1.02, y: isSelected ? 0 : -2 }}
                          whileTap={{ scale: 0.98 }}
                          onClick={() => addSuggestionToDescription(suggestion)}
                          className={`p-4 text-left border rounded-lg transition-all text-sm shadow-sm hover:shadow-md ${
                            isSelected 
                              ? 'bg-blue-100 border-blue-300 text-blue-800' 
                              : 'bg-white border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                          }`}
                        >
                          <div className="flex items-start justify-between">
                            <span className={isSelected ? 'line-through opacity-75' : ''}>{suggestion}</span>
                            {isSelected && (
                              <span className="ml-2 text-blue-600 font-medium text-xs">✓ Added</span>
                            )}
                          </div>
                        </motion.button>
                      )
                    })}
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7 }}
              className="flex justify-end space-x-4 mt-8 pt-6 border-t border-gray-200"
            >
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={resetForm}
                className="px-6 py-3 text-gray-600 hover:text-gray-800 font-medium transition-colors"
              >
                Cancel
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={handleSave}
                disabled={!isFormValid}
                className="px-6 py-3 bg-gradient-to-r from-blue-500 to-indigo-600 text-white rounded-lg hover:from-blue-600 hover:to-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed font-medium shadow-lg transition-all"
              >
                {editingId ? 'Update Experience' : 'Add Experience'}
              </motion.button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Navigation Buttons */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="flex justify-between pt-8"
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
          className="flex items-center space-x-2 px-6 py-3 bg-gradient-to-r from-blue-500 to-indigo-600 text-white rounded-lg hover:from-blue-600 hover:to-indigo-700 font-medium shadow-lg transition-all"
        >
          <span>Next: Education</span>
          <ChevronRight className="w-4 h-4" />
        </motion.button>
      </motion.div>
    </motion.div>
  )
}

export default WorkExperienceStep
