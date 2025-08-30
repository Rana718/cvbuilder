"use client"

import { useState } from "react"
import { Plus, CalendarIcon, Edit, Trash } from "lucide-react"
import { useResumeStore, type Education } from "@/store/resumeStore"
import { Button } from "@/components/ui/button"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Calendar } from "@/components/ui/calendar"
import { cn } from "@/lib/utils"

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
  placeholder = "Select month",
}: {
  label: string
  value?: string
  onChange: (v: string) => void
  fromYear?: number
  toYear?: number
  placeholder?: string
}) {
  const [open, setOpen] = useState(false)
  const selected = parseMonthString(value)

  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-2">{label}</label>
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            className={cn("w-full justify-start text-left font-normal", !selected && "text-muted-foreground")}
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

function EducationStep({ onNext, onPrev }: EducationStepProps) {
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
    setFormData({ schoolName: "", degree: "", fieldOfStudy: "", startDate: "", endDate: "" })
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
      {education.length > 0 && (
        <div className="space-y-4">
          <h3 className="text-lg font-medium text-gray-900">Education History</h3>
          {education.map((edu) => (
            <div key={edu.id} className="border border-gray-200 rounded-lg p-4 bg-white">
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <h4 className="font-semibold text-gray-900">{edu.degree}</h4>
                  <p className="text-gray-700">{edu.schoolName}</p>
                  {edu.fieldOfStudy && <p className="text-gray-600">Field of Study: {edu.fieldOfStudy}</p>}
                  <div className="flex items-center text-sm text-gray-600 mt-1">
                    <CalendarIcon className="w-4 h-4 mr-1" />
                    <span>
                      {displayMonth(edu.startDate)} - {displayMonth(edu.endDate)}
                    </span>
                  </div>
                </div>
                <div className="flex space-x-2 ml-4">
                  <button
                    onClick={() => handleEdit(edu)}
                    className="text-blue-600 hover:text-blue-700 p-2 rounded-md"
                    aria-label="Edit education"
                    title="Edit"
                  >
                    <Edit className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => removeEducation(edu.id)}
                    className="text-red-600 hover:text-red-700 p-2 rounded-md"
                    aria-label="Remove education"
                    title="Remove"
                  >
                    <Trash className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
      {!showAddForm && (
        <button
          onClick={() => setShowAddForm(true)}
          className="flex items-center space-x-2 text-blue-600 hover:text-blue-700 font-medium"
        >
          <Plus className="w-5 h-5" />
          <span>Add Education</span>
        </button>
      )}
      {showAddForm && (
        <div className="border border-gray-300 rounded-lg p-6 bg-white">
          <h4 className="font-medium text-gray-900 mb-4">{editingId ? "Edit Education" : "Add Education"}</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2"> School Name * </label>
              <input
                type="text"
                value={formData.schoolName}
                onChange={(e) => setFormData({ ...formData, schoolName: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="University of California, Berkeley"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2"> Degree * </label>
              <input
                type="text"
                value={formData.degree}
                onChange={(e) => setFormData({ ...formData, degree: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Bachelor of Science"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2"> Field of Study </label>
              <input
                type="text"
                value={formData.fieldOfStudy}
                onChange={(e) => setFormData({ ...formData, fieldOfStudy: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Computer Science"
              />
            </div>
            <MonthYearPicker
              label="Start Date *"
              value={formData.startDate}
              onChange={(v) => setFormData({ ...formData, startDate: v })}
            />
            <MonthYearPicker
              label="End Date *"
              value={formData.endDate}
              onChange={(v) => setFormData({ ...formData, endDate: v })}
            />
          </div>
          <div className="flex justify-end space-x-3 mt-6">
            <button onClick={resetForm} className="px-4 py-2 text-gray-600 hover:text-gray-800">
              Cancel
            </button>
            <button
              onClick={handleSave}
              disabled={!isFormValid}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {editingId ? "Update Education" : "Add Education"}
            </button>
          </div>
        </div>
      )}
      <div className="flex justify-between">
        <button onClick={onPrev} className="px-6 py-3 text-gray-600 hover:text-gray-800 font-medium">
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
