'use client'

import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { Calendar, MapPin, Building2, ArrowRight, Loader2, Briefcase, User, ChevronLeft } from 'lucide-react'
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Calendar as CalendarComponent } from "@/components/ui/calendar"
import { Button } from "@/components/ui/button"
import { Switch } from "@/components/ui/switch"
import type { WorkExperience } from '@/store/resumeStore'

interface ExperienceFormViewProps {
    formData: Omit<WorkExperience, 'id'>
    onFormDataChange: (data: Partial<Omit<WorkExperience, 'id'>>) => void
    onNext: () => void
    onCancel: () => void
    isEditing?: boolean
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

function ExperienceFormView({ formData, onFormDataChange, onNext, onCancel, isEditing = false }: ExperienceFormViewProps) {
    const [isLoading, setIsLoading] = useState(false)

    const handleInputChange = (field: keyof Omit<WorkExperience, 'id'>, value: string | boolean) => {
        if (field === 'isRemote' && value === true) {
            onFormDataChange({ [field]: value, location: '' })
        } else {
            onFormDataChange({ [field]: value })
        }
    }

    const handleCurrentlyWorkingChange = (checked: boolean) => {
        onFormDataChange({
            isCurrentlyWorking: checked,
            endDate: checked ? '' : formData.endDate
        })
    }

    const handleNext = async () => {
        setIsLoading(true)
        await new Promise(resolve => setTimeout(resolve, 1000))
        onNext()
        setIsLoading(false)
    }

    const isFormValid = formData.jobTitle && formData.employer && formData.startDate && (formData.isCurrentlyWorking || formData.endDate)

    return (
        <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -50 }}
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
                    <div className="p-2 md:p-3 bg-blue-100 rounded-full mr-3 md:mr-2">
                        <Briefcase className="w-6 h-6 md:w-8 md:h-8 text-blue-600" />
                    </div>
                    <div className="flex-1">
                        <h3 className="text-2xl md:text-3xl font-bold text-gray-900">
                            {isEditing ? 'Edit Work Experience' : 'Add Work Experience'}
                        </h3>
                        <p className="text-base md:text-lg text-gray-600">
                            {isEditing ? 'Update your role and responsibilities' : 'Tell us about your role and responsibilities'}
                        </p>
                    </div>
                </div>
            </motion.div>

            {/* Form */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="bg-white p-2 md:p-4 space-y-4"
            >
                {/* Job Title, Company, and Role */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 md:gap-4">
                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                            Job Title <span className="text-red-500">*</span>
                        </label>
                        <div className="relative">
                            <Building2 className="absolute left-3 top-2.5 h-4 w-4 text-gray-600" />
                            <input
                                type="text"
                                value={formData.jobTitle}
                                onChange={(e) => handleInputChange('jobTitle', e.target.value)}
                                className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-sm focus:ring-1 focus:ring-blue-500 focus:border-blue-500 transition-all bg-white"
                                placeholder="Software Engineer"
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                            Company <span className="text-red-500">*</span>
                        </label>
                        <div className="relative">
                            <Building2 className="absolute left-3 top-2.5 h-4 w-4 text-gray-600" />
                            <input
                                type="text"
                                value={formData.employer}
                                onChange={(e) => handleInputChange('employer', e.target.value)}
                                className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-sm focus:ring-1 focus:ring-blue-500 focus:border-blue-500 transition-all bg-white"
                                placeholder="Company Name"
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                            Role <span className="text-gray-400 text-xs">(optional)</span>
                        </label>
                        <div className="relative">
                            <User className="absolute left-3 top-2.5 h-4 w-4 text-gray-600" />
                            <input
                                type="text"
                                value={formData.role || ''}
                                onChange={(e) => handleInputChange('role', e.target.value)}
                                className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-sm focus:ring-1 focus:ring-blue-500 focus:border-blue-500 transition-all bg-white"
                                placeholder="Senior, Lead, etc."
                            />
                        </div>
                    </div>
                </div>

                {/* Location and Remote Work */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-4">
                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                            Location
                        </label>
                        <div className="relative">
                            <MapPin className="absolute left-3 top-2.5 h-4 w-4 text-gray-600" />
                            <input
                                type="text"
                                value={formData.location}
                                onChange={(e) => handleInputChange('location', e.target.value)}
                                disabled={formData.isRemote}
                                className={`w-full pl-10 pr-3 py-2 border border-gray-300 rounded-sm focus:ring-1 focus:ring-blue-500 focus:border-blue-500 transition-all ${formData.isRemote
                                    ? 'bg-gray-100 text-gray-500 cursor-not-allowed'
                                    : 'bg-white'
                                    }`}
                                placeholder={formData.isRemote ? "Working remotely" : "New York, NY"}
                            />
                        </div>
                    </div>

                    <div className="flex items-end">
                        <div className="w-full">
                            <label className="block text-sm font-semibold text-gray-700 mb-2">
                                Work Type
                            </label>
                            <div className="flex items-center space-x-3 bg-white p-3 border border-gray-300 rounded-sm">
                                <Switch
                                    checked={formData.isRemote}
                                    onCheckedChange={(checked) => handleInputChange('isRemote', checked)}
                                    className="data-[state=checked]:bg-blue-600 data-[state=unchecked]:bg-gray-300 border border-gray-300"
                                />
                                <span className="text-sm font-medium text-gray-700">
                                    {formData.isRemote ? 'Remote Work' : 'On-site Work'}
                                </span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Start Date, End Date, and Currently Working */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
                    <MonthYearPicker
                        label="Start Date *"
                        value={formData.startDate}
                        onChange={(v) => handleInputChange('startDate', v)}
                    />

                    <MonthYearPicker
                        label={`End Date ${!formData.isCurrentlyWorking ? '*' : ''}`}
                        value={formData.endDate}
                        onChange={(v) => handleInputChange('endDate', v)}
                        disabled={formData.isCurrentlyWorking}
                    />

                    <div className="flex items-end">
                        <div className="w-full">
                            <label className="block text-sm font-semibold text-gray-700 mb-2">
                                Employment Status
                            </label>
                            <div className="flex items-center space-x-3 bg-white p-3 border border-gray-300 rounded-sm">
                                <Switch
                                    checked={formData.isCurrentlyWorking}
                                    onCheckedChange={handleCurrentlyWorkingChange}
                                    className="data-[state=checked]:bg-blue-600 data-[state=unchecked]:bg-gray-300 border border-gray-300"
                                />
                                <span className="text-sm font-medium text-gray-700">
                                    Currently Working
                                </span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Action Buttons */}
                <div className="flex justify-between pt-4 border-t border-gray-300">
                    <motion.button
                        whileHover={{ scale: 1.02, x: -5 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={onCancel}
                        className="flex items-center space-x-2 px-4 py-2 text-gray-600 hover:text-gray-800 font-medium transition-colors"
                    >
                        <ChevronLeft className="w-4 h-4" />
                        <span>Cancel</span>
                    </motion.button>

                    <motion.button
                        whileHover={{ scale: 1.02, x: 5 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={handleNext}
                        disabled={!isFormValid || isLoading}
                        className="flex items-center space-x-2 px-6 py-2 bg-blue-500 text-white rounded-sm hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed font-semibold transition-all"
                    >
                        {isLoading ? (
                            <>
                                <Loader2 className="w-4 h-4 animate-spin" />
                                <span>Processing...</span>
                            </>
                        ) : (
                            <>
                                <span>Next</span>
                                <ArrowRight className="w-4 h-4" />
                            </>
                        )}
                    </motion.button>
                </div>
            </motion.div>
        </motion.div>
    )
}

export default ExperienceFormView