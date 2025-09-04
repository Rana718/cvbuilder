"use client"

import { useState } from "react"
import { Plus, CalendarIcon, Edit, Trash, GraduationCap, ChevronLeft, ChevronRight, Calendar } from "lucide-react"
import { useResumeStore, type Education } from "@/store/resumeStore"
import { Button } from "@/components/ui/button"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Calendar as CalendarComponent } from "@/components/ui/calendar"
import { motion, AnimatePresence } from 'framer-motion'

interface EducationStepProps {
  onNext: () => void
  onPrev: () => void
}

function formatMonth(date: Date) {
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}`
}

function parseMonthString(value?: string) {
  if (!value) return undefined
  const [y, m] = value.split("-").map(Number)
  if (!y || !m) return undefined
  return new Date(y, m - 1, 1)
}

function displayMonth(value?: string) {
  const d = parseMonthString(value)
  return d ? d.toLocaleString(undefined, { month: "short", year: "numeric" }) : "Select month"
}

function MonthYearPicker({
  label,
  value,
  onChange,
  fromYear = 1950,
  toYear = new Date().getFullYear() + 10,
  placeholder = 'Select month',
  disabled = false
}: {
  label: string
  value?: string
  onChange: (v: string) => void
  fromYear?: number
  toYear?: number
  placeholder?: string
  disabled?: boolean
}) {
  const [open, setOpen] = useState(false)
  const selected = parseMonthString(value)

  return (
    <div>
      <label className="block text-sm font-semibold text-gray-700 mb-2">{label}</label>
      <Popover open={open && !disabled} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            disabled={disabled}
            className={`w-full justify-start text-left font-normal border-gray-300 rounded-sm hover:bg-gray-50 hover:border-gray-400 ${disabled
              ? 'bg-gray-100 text-gray-400 cursor-not-allowed opacity-60'
              : 'bg-white'
              } ${!selected && !disabled && 'text-gray-500'}`}
          >
            <Calendar className={`mr-2 h-4 w-4 ${disabled ? 'text-gray-400' : 'text-gray-600'}`} />
            {disabled && !selected
              ? 'Currently working'
              : selected
                ? displayMonth(value)
                : placeholder
            }
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0" align="start">
          <CalendarComponent
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

export default function EducationStep({ onNext, onPrev }: EducationStepProps) {
  const { education, addEducation, updateEducation, removeEducation } = useResumeStore()
  const [showAddForm, setShowAddForm] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [formData, setFormData] = useState<Omit<Education, "id">>({
    schoolName: "",
    degree: "",
    fieldOfStudy: "",
    startDate: "",
    endDate: "",
  })

  const resetForm = () => {
    setFormData({
      schoolName: "",
      degree: "",
      fieldOfStudy: "",
      startDate: "",
      endDate: "",
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
    setFormData({
      schoolName: edu.schoolName,
      degree: edu.degree,
      fieldOfStudy: edu.fieldOfStudy,
      startDate: edu.startDate,
      endDate: edu.endDate,
    })
    setEditingId(edu.id)
    setShowAddForm(true)
  }

  const isFormValid = formData.schoolName && formData.degree && formData.startDate && formData.endDate

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
        className="text-left"
      >
        <div className="flex items-start mb-4">
          <div className="p-3 bg-blue-100 rounded-full mr-2">
            <GraduationCap className="w-5 h-5 md:h-8 md:w-8 text-blue-600" />
          </div>
          <div>
            <h2 className=" md:text-3xl text-xl font-bold text-gray-900">Education</h2>
            <p className="md:text-lg text-base text-gray-600">Add your educational background</p>
          </div>
        </div>
      </motion.div>

      <AnimatePresence>
        {education.length > 0 && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2 }}
            className="space-y-4"
          >
            <h3 className="text-xl font-semibold text-gray-900 flex items-center">
              <GraduationCap className="w-5 h-5 mr-2 text-blue-600" />
              Your Education
            </h3>
            {education.map((edu, index) => (
              <motion.div
                key={edu.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.1 * index }}
                className="border border-gray-300 rounded-sm p-4 md:p-6 bg-white hover:border-black transition-all duration-300"
              >
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <h4 className="font-bold text-lg text-gray-900">{edu.degree}</h4>
                    <p className="text-blue-600 font-semibold text-lg">{edu.schoolName}</p>
                    {edu.fieldOfStudy && <p className="text-gray-600 mt-1">Field of Study: {edu.fieldOfStudy}</p>}
                    <div className="flex items-center text-sm text-gray-600 mt-2">
                      <CalendarIcon className="w-4 h-4 mr-1" />
                      <span className="bg-gray-100 px-3 py-1 rounded-sm border border-gray-300">
                        {displayMonth(edu.startDate)} - {displayMonth(edu.endDate)}
                      </span>
                    </div>
                  </div>
                  <div className="flex space-x-2 ml-4">
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => handleEdit(edu)}
                      className="p-1.5 md:p-2 text-blue-600 hover:text-blue-700 hover:bg-blue-50 rounded-sm transition-colors"
                    >
                      <Edit className="w-3 h-3 md:w-4 md:h-4" />
                    </motion.button>
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => removeEducation(edu.id)}
                      className="p-1.5 md:p-2 text-red-600 hover:text-red-700 hover:bg-red-50 rounded-sm transition-colors"
                    >
                      <Trash className="w-3 h-3 md:w-4 md:h-4" />
                    </motion.button>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>

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
            className="flex items-center space-x-3 px-8 py-3 bg-blue-600 text-white rounded-sm font-semibold hover:bg-blue-700 transition-all duration-300 border border-black"
          >
            <Plus className="w-5 h-5" />
            <span>Add Education</span>
          </motion.button>
        </motion.div>
      )}

      <AnimatePresence>
        {showAddForm && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: -20 }}
            transition={{ duration: 0.3 }}
            className="border-2 border-blue-200 rounded-2xl p-4 md:p-8 bg-white shadow-lg"
          >
            <h4 className="text-xl font-bold text-gray-900 mb-6">
              {editingId ? "Edit Education" : "Add Education"}
            </h4>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
              <div className="md:col-span-2">
                <label className="block text-sm font-semibold text-gray-700 mb-2">School Name *</label>
                <input
                  type="text"
                  value={formData.schoolName}
                  onChange={(e) => setFormData({ ...formData, schoolName: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-sm focus:ring-2 focus:ring-blue-500 focus:border-black transition-all duration-200"
                  placeholder="Harvard University"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Degree *</label>
                <input
                  type="text"
                  value={formData.degree}
                  onChange={(e) => setFormData({ ...formData, degree: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-sm focus:ring-2 focus:ring-blue-500 focus:border-black transition-all duration-200"
                  placeholder="Bachelor of Science"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Field of Study</label>
                <input
                  type="text"
                  value={formData.fieldOfStudy}
                  onChange={(e) => setFormData({ ...formData, fieldOfStudy: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-sm focus:ring-2 focus:ring-blue-500 focus:border-black transition-all duration-200"
                  placeholder="Computer Science"
                />
              </div>

              <div>
                <MonthYearPicker
                  label="Start Date *"
                  value={formData.startDate}
                  onChange={(v) => setFormData({ ...formData, startDate: v })}
                />
              </div>

              <div>
                <MonthYearPicker
                  label="End Date *"
                  value={formData.endDate}
                  onChange={(v) => setFormData({ ...formData, endDate: v })}
                />
              </div>
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
                className="px-6 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 font-medium shadow-lg"
              >
                {editingId ? "Update Education" : "Add Education"}
              </motion.button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Navigation */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="flex justify-between pt-6 border-t border-gray-200"
      >
        <motion.button
          whileHover={{ scale: 1.02, x: -5 }}
          whileTap={{ scale: 0.98 }}
          onClick={onPrev}
          className="flex items-center space-x-1 md:space-x-2 px-4 md:px-6 py-3 text-gray-700 bg-white border border-black rounded-sm hover:bg-gray-50 transition-all duration-200 font-medium"
        >
          <ChevronLeft className="w-4 h-4 md:w-5 md:h-5" />
          <span className="text-sm md:text-base">Previous</span>
        </motion.button>

        <motion.button
          whileHover={{ scale: 1.02, x: 5 }}
          whileTap={{ scale: 0.98 }}
          onClick={onNext}
          disabled={education.length === 0}
          className="flex items-center space-x-1 md:space-x-2 px-6 md:px-8 py-3 bg-blue-600 text-white rounded-sm hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 font-medium border border-black"
        >
          <span className="text-sm md:text-base">Next</span>
          <ChevronRight className="w-4 h-4 md:w-5 md:h-5" />
        </motion.button>
      </motion.div>
    </motion.div>
  )
}