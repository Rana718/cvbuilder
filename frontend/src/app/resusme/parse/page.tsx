'use client'

import React, { useState } from 'react'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { Upload, FileText, Loader2, CheckCircle, ArrowRight, User, Briefcase, GraduationCap, Award, MapPin, Mail, Phone, Globe, Sparkles, Brain, Zap } from 'lucide-react'
import axiosInstance from '@/lib/axios'
import { useResumeStore } from '@/store/resumeStore'
import Navbar from '@/components/Navbar'
import TemplateSelector from '@/components/TemplateSelector'
import { CV_TEMPLATES } from '@/constants/templates'
import { TemplatePreview } from '@/components/templates/TemplateRenderer'

interface ParsedData {
    name: string
    email: string
    phone: string
    city: string
    state: string
    country: string
    postal_code: string
    job_title: string
    summary: string
    skills: string[]
    experience: Array<{
        title: string
        company: string
        duration: string
        description: string
    }>
    education: Array<{
        degree: string
        institution: string
        year: string
        gpa?: string
    }>
    certifications: Array<{
        name: string
        issuer: string
        date: string
        credential_id?: string
    }>
    projects: Array<{
        name: string
        description: string
        technologies: string[]
        url?: string
    }>
    languages: Array<{
        name: string
        proficiency: string
    }>
    socail_links: Array<{
        label: string
        url: string
        username?: string
    }>
}

const containerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
        opacity: 1,
        y: 0,
        transition: {
            duration: 0.6,
            staggerChildren: 0.1
        }
    }
}

const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
        opacity: 1,
        y: 0,
        transition: { duration: 0.5 }
    }
}

export default function ResumeParsePage() {
    const [selectedFile, setSelectedFile] = useState<File | null>(null)
    const [isUploading, setIsUploading] = useState(false)
    const [uploadProgress, setUploadProgress] = useState(0)
    const [parsedData, setParsedData] = useState<ParsedData | null>(null)
    const [step, setStep] = useState<'upload' | 'parsing' | 'preview' | 'templates'>('upload')
    const [error, setError] = useState<string | null>(null)
    
    const { 
        updatePersonalInfo, 
        addWorkExperience, 
        addEducation, 
        setSkills, 
        addProject, 
        setSummary,
        addWebsite,
        clearResumeData
    } = useResumeStore()

    const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0]
        if (file && file.type === 'application/pdf') {
            setSelectedFile(file)
            setError(null)
        } else {
            setError('Please select a valid PDF file')
        }
    }

    const handleUpload = async () => {
        if (!selectedFile) return

        setIsUploading(true)
        setStep('parsing')
        setUploadProgress(0)
        setError(null)

        try {
            const formData = new FormData()
            formData.append('cv_file', selectedFile)

            // Simulate progress
            const progressInterval = setInterval(() => {
                setUploadProgress(prev => {
                    if (prev >= 90) return prev
                    return prev + 10
                })
            }, 500)

            const response = await axiosInstance.post('/api/cv-parser/parse-cv', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            })

            clearInterval(progressInterval)
            setUploadProgress(100)

            setTimeout(() => {
                setParsedData(response.data)
                setStep('preview')
                setIsUploading(false)
            }, 1000)

        } catch (err: any) {
            setIsUploading(false)
            setError(err.response?.data?.detail || 'Failed to parse resume. Please try again.')
            setStep('upload')
        }
    }

    const handleUseData = () => {
        if (!parsedData) return

        // Clear existing resume data completely
        clearResumeData()

        // Transform parsed data to store format
        updatePersonalInfo({
            firstName: parsedData.name.split(' ')[0] || '',
            lastName: parsedData.name.split(' ').slice(1).join(' ') || '',
            profession: parsedData.job_title || '',
            city: parsedData.city || '',
            country: parsedData.country || '',
            pincode: parsedData.postal_code || '',
            phone: parsedData.phone || '',
            email: parsedData.email || '',
        })

        // Add social links/websites
        if (parsedData.socail_links) {
            parsedData.socail_links.forEach(link => {
                addWebsite({
                    label: link.label,
                    url: link.url
                })
            })
        }

        // Add summary
        if (parsedData.summary) {
            setSummary(parsedData.summary)
        }

        // Add work experience
        if (parsedData.experience) {
            parsedData.experience.forEach(exp => {
                addWorkExperience({
                    jobTitle: exp.title,
                    employer: exp.company,
                    location: '',
                    isRemote: false,
                    startDate: exp.duration.split(' - ')[0] || '',
                    endDate: exp.duration.split(' - ')[1] || '',
                    isCurrentlyWorking: exp.duration.includes('Present') || exp.duration.includes('Current'),
                    description: exp.description
                })
            })
        }

        // Add education
        if (parsedData.education) {
            parsedData.education.forEach(edu => {
                addEducation({
                    schoolName: edu.institution,
                    degree: edu.degree,
                    fieldOfStudy: '',
                    startDate: edu.year,
                    endDate: edu.year
                })
            })
        }

        // Add skills
        if (parsedData.skills) {
            const skillsArray = parsedData.skills.map((skill, index) => ({
                id: `skill-${index}-${Date.now()}`,
                name: skill,
                rating: 4 // Default rating
            }))
            setSkills(skillsArray)
        }

        // Add projects
        if (parsedData.projects) {
            parsedData.projects.forEach(project => {
                addProject({
                    name: project.name,
                    description: project.description,
                    url: project.url
                })
            })
        }

        setStep('templates')
    }

    const handleStartOver = () => {
        setSelectedFile(null)
        setParsedData(null)
        setStep('upload')
        setError(null)
        setUploadProgress(0)
        // Clear any previously parsed data when starting over
        clearResumeData()
    }

    return (
        <div className="min-h-screen bg-slate-50">
            <Navbar />
            
            {/* Background Elements */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className="absolute top-20 left-10 w-96 h-96 bg-gradient-to-r from-blue-400/10 to-indigo-500/10 rounded-full mix-blend-multiply filter blur-3xl animate-pulse"></div>
                <div className="absolute top-40 right-10 w-80 h-80 bg-gradient-to-r from-purple-400/10 to-pink-500/10 rounded-full mix-blend-multiply filter blur-3xl animate-pulse delay-1000"></div>
                <div className="absolute bottom-20 left-1/2 w-72 h-72 bg-gradient-to-r from-emerald-400/10 to-teal-500/10 rounded-full mix-blend-multiply filter blur-3xl animate-pulse delay-2000"></div>
            </div>
            
            {/* Floating grid pattern */}
            <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808008_1px,transparent_1px),linear-gradient(to_bottom,#80808008_1px,transparent_1px)] bg-[size:24px_24px] pointer-events-none"></div>

            <div className="relative container mx-auto px-4 py-8">
                {/* AI Badge and Header */}
                <motion.div
                    initial={{ y: 20, opacity: 0, scale: 0.9 }}
                    animate={{ y: 0, opacity: 1, scale: 1 }}
                    transition={{ duration: 0.6, delay: 0.2 }}
                    className="flex justify-center mb-6"
                >
                    <div className="relative">
                        <div className="absolute inset-0 bg-gradient-to-r from-blue-500/20 to-purple-500/20 blur-xl rounded-full"></div>
                        <div className="relative inline-flex items-center bg-white/90 backdrop-blur-sm border border-white/20 shadow-lg text-slate-700 px-6 py-3 rounded-full text-sm font-medium">
                            <div className="w-2 h-2 bg-green-500 rounded-full mr-3 animate-pulse"></div>
                            <Brain className="h-4 w-4 mr-2 text-blue-600" />
                            <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent font-semibold">
                                AI Resume Parser
                            </span>
                        </div>
                    </div>
                </motion.div>

                <motion.div
                    initial={{ y: 30, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ duration: 0.8, delay: 0.3 }}
                    className="text-center mb-8"
                >
                    <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-slate-900 mb-4 leading-tight">
                        Transform Your
                        <span className="block text-transparent bg-clip-text bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 mt-2">
                            PDF Resume
                        </span>
                        <span className="block text-slate-700 text-2xl md:text-3xl lg:text-4xl font-medium mt-4">
                            into Professional Magic
                        </span>
                    </h1>
                    <p className="text-lg md:text-xl text-slate-600 mb-8 leading-relaxed max-w-3xl mx-auto font-light">
                        Upload your PDF resume and let our AI extract, enhance, and transform it into a stunning professional template
                    </p>
                </motion.div>

                {/* Progress Steps */}
                <motion.div
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ duration: 0.6, delay: 0.5 }}
                    className="flex justify-center mb-12"
                >
                    <div className="flex items-center space-x-4 bg-white/80 backdrop-blur-sm rounded-2xl p-4 shadow-lg border border-white/20">
                        {[
                            { step: 'upload', label: 'Upload', icon: Upload },
                            { step: 'parsing', label: 'Parse', icon: Brain },
                            { step: 'preview', label: 'Review', icon: CheckCircle },
                            { step: 'templates', label: 'Templates', icon: Sparkles }
                        ].map((item, index) => (
                            <React.Fragment key={item.step}>
                                <div className={`flex items-center space-x-2 ${
                                    step === item.step ? 'text-blue-600' : 
                                    ['parsing', 'preview', 'templates'].includes(step) && index < ['upload', 'parsing', 'preview', 'templates'].indexOf(step) ? 'text-green-600' : 
                                    'text-slate-400'
                                }`}>
                                    <div className={`w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300 ${
                                        step === item.step ? 'bg-blue-100 border-2 border-blue-600 shadow-md' : 
                                        ['parsing', 'preview', 'templates'].includes(step) && index < ['upload', 'parsing', 'preview', 'templates'].indexOf(step) ? 'bg-green-100 border-2 border-green-600' : 
                                        'bg-slate-100 border-2 border-slate-300'
                                    }`}>
                                        {step === item.step && item.step === 'parsing' ? (
                                            <Loader2 className="w-5 h-5 animate-spin" />
                                        ) : ['parsing', 'preview', 'templates'].includes(step) && index < ['upload', 'parsing', 'preview', 'templates'].indexOf(step) ? (
                                            <CheckCircle className="w-5 h-5" />
                                        ) : (
                                            <item.icon className="w-5 h-5" />
                                        )}
                                    </div>
                                    <span className="font-medium hidden sm:block">{item.label}</span>
                                </div>
                                {index < 3 && <ArrowRight className="w-4 h-4 text-slate-400" />}
                            </React.Fragment>
                        ))}
                    </div>
                </motion.div>

                {/* Upload Step */}
                {step === 'upload' && (
                    <motion.div
                        variants={containerVariants}
                        initial="hidden"
                        animate="visible"
                        className="max-w-2xl mx-auto"
                    >
                        <Card className="border-0 shadow-xl bg-white/80 backdrop-blur-sm">
                            <CardHeader className="text-center pb-4">
                                <CardTitle className="flex items-center justify-center space-x-2 text-2xl">
                                    <Upload className="w-7 h-7 text-blue-600" />
                                    <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                                        Upload Your Resume
                                    </span>
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-6">
                                <motion.div 
                                    variants={itemVariants}
                                    className="border-2 border-dashed border-slate-300 hover:border-blue-400 rounded-2xl p-12 text-center transition-all duration-300 group cursor-pointer"
                                    whileHover={{ scale: 1.02 }}
                                    whileTap={{ scale: 0.98 }}
                                >
                                    <div className="relative">
                                        <FileText className="w-16 h-16 text-slate-400 group-hover:text-blue-500 mx-auto mb-6 transition-colors duration-300" />
                                        <div className="absolute -top-2 -right-2 w-6 h-6 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center">
                                            <Zap className="w-3 h-3 text-white" />
                                        </div>
                                    </div>
                                    <div className="space-y-3">
                                        <p className="text-xl font-semibold text-slate-700 group-hover:text-blue-600 transition-colors">
                                            {selectedFile ? selectedFile.name : 'Choose a PDF file to upload'}
                                        </p>
                                        <p className="text-sm text-slate-500">PDF files only, max 10MB</p>
                                        <div className="flex items-center justify-center space-x-4 text-xs text-slate-400">
                                            <div className="flex items-center space-x-1">
                                                <CheckCircle className="w-3 h-3 text-green-500" />
                                                <span>AI-Powered</span>
                                            </div>
                                            <div className="flex items-center space-x-1">
                                                <CheckCircle className="w-3 h-3 text-green-500" />
                                                <span>Secure Processing</span>
                                            </div>
                                            <div className="flex items-center space-x-1">
                                                <CheckCircle className="w-3 h-3 text-green-500" />
                                                <span>Instant Results</span>
                                            </div>
                                        </div>
                                    </div>
                                    <input
                                        type="file"
                                        accept=".pdf"
                                        onChange={handleFileSelect}
                                        className="hidden"
                                        id="resume-upload"
                                    />
                                    <label
                                        htmlFor="resume-upload"
                                        className="inline-block mt-6 px-8 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl cursor-pointer hover:from-blue-700 hover:to-purple-700 transition-all duration-300 font-semibold shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
                                    >
                                        {selectedFile ? 'Change File' : 'Select File'}
                                    </label>
                                </motion.div>

                                {error && (
                                    <motion.div
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        className="p-4 border border-red-200 rounded-xl bg-red-50/80 backdrop-blur-sm text-red-700"
                                    >
                                        {error}
                                    </motion.div>
                                )}

                                {selectedFile && (
                                    <motion.div
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        className="flex justify-center"
                                    >
                                        <Button 
                                            onClick={handleUpload} 
                                            size="lg" 
                                            className="px-10 py-4 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-lg font-semibold rounded-xl shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-300"
                                        >
                                            <Brain className="mr-3 w-5 h-5" />
                                            Parse with AI
                                            <ArrowRight className="ml-3 w-5 h-5" />
                                        </Button>
                                    </motion.div>
                                )}
                            </CardContent>
                        </Card>
                    </motion.div>
                )}

                {/* Parsing Step */}
                {step === 'parsing' && (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.5 }}
                        className="max-w-2xl mx-auto"
                    >
                        <Card className="border-0 shadow-xl bg-white/80 backdrop-blur-sm">
                            <CardHeader className="text-center pb-4">
                                <CardTitle className="flex items-center justify-center space-x-2 text-2xl">
                                    <div className="relative">
                                        <Brain className="w-7 h-7 text-blue-600 animate-pulse" />
                                        <div className="absolute -inset-1 bg-blue-500/20 rounded-full animate-ping"></div>
                                    </div>
                                    <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                                        AI is Analyzing Your Resume
                                    </span>
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-8">
                                <div className="text-center">
                                    <motion.div
                                        animate={{ rotate: 360 }}
                                        transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                                        className="w-20 h-20 mx-auto mb-6 relative"
                                    >
                                        <div className="w-full h-full border-4 border-blue-200 rounded-full"></div>
                                        <div className="absolute inset-0 border-4 border-transparent border-t-blue-600 rounded-full animate-spin"></div>
                                        <div className="absolute inset-2 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center">
                                            <Sparkles className="w-6 h-6 text-white" />
                                        </div>
                                    </motion.div>
                                    <p className="text-lg text-slate-600 mb-6 font-medium">
                                        Our AI is extracting and organizing your information with precision...
                                    </p>
                                    <div className="relative">
                                        <Progress value={uploadProgress} className="w-full max-w-md mx-auto h-3 bg-slate-200 rounded-full overflow-hidden" />
                                        <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full" style={{ width: `${uploadProgress}%` }}></div>
                                    </div>
                                    <p className="text-sm text-slate-500 mt-3 font-medium">{uploadProgress}% complete</p>
                                    
                                    <div className="flex justify-center space-x-6 mt-8 text-xs text-slate-400">
                                        <motion.div 
                                            animate={{ opacity: [0.5, 1, 0.5] }}
                                            transition={{ duration: 2, repeat: Infinity }}
                                            className="flex items-center space-x-1"
                                        >
                                            <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                                            <span>Extracting text</span>
                                        </motion.div>
                                        <motion.div 
                                            animate={{ opacity: [0.5, 1, 0.5] }}
                                            transition={{ duration: 2, repeat: Infinity, delay: 0.5 }}
                                            className="flex items-center space-x-1"
                                        >
                                            <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                                            <span>Analyzing structure</span>
                                        </motion.div>
                                        <motion.div 
                                            animate={{ opacity: [0.5, 1, 0.5] }}
                                            transition={{ duration: 2, repeat: Infinity, delay: 1 }}
                                            className="flex items-center space-x-1"
                                        >
                                            <div className="w-2 h-2 bg-indigo-500 rounded-full"></div>
                                            <span>Organizing data</span>
                                        </motion.div>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </motion.div>
                )}

                {/* Preview Step */}
                {step === 'preview' && parsedData && (
                    <motion.div
                        variants={containerVariants}
                        initial="hidden"
                        animate="visible"
                        className="space-y-8"
                    >
                        <Card className="max-w-5xl mx-auto border-0 shadow-xl bg-white/80 backdrop-blur-sm">
                            <CardHeader className="pb-6">
                                <motion.div variants={itemVariants}>
                                    <CardTitle className="flex items-center space-x-2 text-2xl">
                                        <CheckCircle className="w-7 h-7 text-green-600" />
                                        <span className="bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">
                                            Resume Parsed Successfully!
                                        </span>
                                    </CardTitle>
                                    <p className="text-slate-600 mt-2">Review the extracted information below and make any necessary corrections.</p>
                                </motion.div>
                            </CardHeader>
                            <CardContent className="space-y-8">
                                {/* Personal Information */}
                                <motion.div variants={itemVariants}>
                                    <h3 className="flex items-center space-x-2 text-xl font-semibold mb-4">
                                        <User className="w-6 h-6 text-blue-600" />
                                        <span>Personal Information</span>
                                    </h3>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-6 bg-gradient-to-r from-slate-50 to-blue-50/30 rounded-2xl border border-slate-200">
                                        <div className="flex items-center space-x-2">
                                            <User className="w-4 h-4 text-slate-500" />
                                            <span><strong>Name:</strong> {parsedData.name}</span>
                                        </div>
                                        <div className="flex items-center space-x-2">
                                            <Briefcase className="w-4 h-4 text-slate-500" />
                                            <span><strong>Job Title:</strong> {parsedData.job_title}</span>
                                        </div>
                                        <div className="flex items-center space-x-2">
                                            <Mail className="w-4 h-4 text-slate-500" />
                                            <span>{parsedData.email}</span>
                                        </div>
                                        <div className="flex items-center space-x-2">
                                            <Phone className="w-4 h-4 text-slate-500" />
                                            <span>{parsedData.phone}</span>
                                        </div>
                                        <div className="flex items-center space-x-2">
                                            <MapPin className="w-4 h-4 text-slate-500" />
                                            <span>{[parsedData.city, parsedData.state, parsedData.country].filter(Boolean).join(', ')}</span>
                                        </div>
                                    </div>
                                </motion.div>

                                {/* Summary */}
                                {parsedData.summary && (
                                    <motion.div variants={itemVariants}>
                                        <h3 className="text-xl font-semibold mb-4">Professional Summary</h3>
                                        <p className="p-6 bg-gradient-to-r from-slate-50 to-purple-50/30 rounded-2xl border border-slate-200 leading-relaxed">
                                            {parsedData.summary}
                                        </p>
                                    </motion.div>
                                )}

                                {/* Skills */}
                                {parsedData.skills && parsedData.skills.length > 0 && (
                                    <motion.div variants={itemVariants}>
                                        <h3 className="text-xl font-semibold mb-4">Skills</h3>
                                        <div className="flex flex-wrap gap-3">
                                            {parsedData.skills.map((skill, index) => (
                                                <motion.div
                                                    key={index}
                                                    initial={{ opacity: 0, scale: 0.8 }}
                                                    animate={{ opacity: 1, scale: 1 }}
                                                    transition={{ delay: index * 0.1 }}
                                                >
                                                    <Badge 
                                                        variant="secondary" 
                                                        className="px-4 py-2 bg-gradient-to-r from-blue-100 to-purple-100 text-blue-700 border border-blue-200 hover:from-blue-200 hover:to-purple-200 transition-all duration-200"
                                                    >
                                                        {skill}
                                                    </Badge>
                                                </motion.div>
                                            ))}
                                        </div>
                                    </motion.div>
                                )}

                                {/* Experience */}
                                {parsedData.experience && parsedData.experience.length > 0 && (
                                    <motion.div variants={itemVariants}>
                                        <h3 className="flex items-center space-x-2 text-xl font-semibold mb-4">
                                            <Briefcase className="w-6 h-6 text-blue-600" />
                                            <span>Work Experience</span>
                                        </h3>
                                        <div className="space-y-4">
                                            {parsedData.experience.map((exp, index) => (
                                                <motion.div
                                                    key={index}
                                                    initial={{ opacity: 0, x: -20 }}
                                                    animate={{ opacity: 1, x: 0 }}
                                                    transition={{ delay: index * 0.1 }}
                                                    className="p-6 bg-gradient-to-r from-slate-50 to-emerald-50/30 rounded-2xl border border-slate-200 hover:shadow-md transition-shadow duration-200"
                                                >
                                                    <div className="flex justify-between items-start mb-3">
                                                        <div>
                                                            <h4 className="font-semibold text-lg text-slate-800">{exp.title}</h4>
                                                            <p className="text-slate-600 font-medium">{exp.company}</p>
                                                        </div>
                                                        <Badge variant="outline" className="bg-white/80 border-emerald-200 text-emerald-700">
                                                            {exp.duration}
                                                        </Badge>
                                                    </div>
                                                    <p className="text-sm text-slate-700 leading-relaxed">{exp.description}</p>
                                                </motion.div>
                                            ))}
                                        </div>
                                    </motion.div>
                                )}

                                {/* Education */}
                                {parsedData.education && parsedData.education.length > 0 && (
                                    <motion.div variants={itemVariants}>
                                        <h3 className="flex items-center space-x-2 text-xl font-semibold mb-4">
                                            <GraduationCap className="w-6 h-6 text-blue-600" />
                                            <span>Education</span>
                                        </h3>
                                        <div className="space-y-4">
                                            {parsedData.education.map((edu, index) => (
                                                <motion.div
                                                    key={index}
                                                    initial={{ opacity: 0, x: -20 }}
                                                    animate={{ opacity: 1, x: 0 }}
                                                    transition={{ delay: index * 0.1 }}
                                                    className="p-6 bg-gradient-to-r from-slate-50 to-indigo-50/30 rounded-2xl border border-slate-200 hover:shadow-md transition-shadow duration-200"
                                                >
                                                    <div className="flex justify-between items-start">
                                                        <div>
                                                            <h4 className="font-semibold text-lg text-slate-800">{edu.degree}</h4>
                                                            <p className="text-slate-600 font-medium">{edu.institution}</p>
                                                        </div>
                                                        <Badge variant="outline" className="bg-white/80 border-indigo-200 text-indigo-700">
                                                            {edu.year}
                                                        </Badge>
                                                    </div>
                                                </motion.div>
                                            ))}
                                        </div>
                                    </motion.div>
                                )}

                                <Separator className="my-8" />

                                <motion.div 
                                    variants={itemVariants}
                                    className="flex justify-center space-x-4"
                                >
                                    <Button 
                                        variant="outline" 
                                        onClick={handleStartOver}
                                        className="px-8 py-3 rounded-xl border-2 hover:bg-slate-50 transition-all duration-200"
                                    >
                                        Start Over
                                    </Button>
                                    <Button 
                                        onClick={handleUseData} 
                                        size="lg"
                                        className="px-10 py-3 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-lg font-semibold rounded-xl shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-300"
                                    >
                                        <CheckCircle className="mr-3 w-5 h-5" />
                                        Use This Data
                                        <ArrowRight className="ml-3 w-5 h-5" />
                                    </Button>
                                </motion.div>
                            </CardContent>
                        </Card>
                    </motion.div>
                )}

                {/* Templates Step */}
                {step === 'templates' && (
                    <motion.div
                        variants={containerVariants}
                        initial="hidden"
                        animate="visible"
                        className="space-y-8"
                    >
                        <motion.div variants={itemVariants} className="text-center">
                            <h2 className="text-4xl md:text-5xl font-bold text-slate-900 mb-4">
                                Choose Your
                                <span className="block text-transparent bg-clip-text bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 mt-2">
                                    Perfect Template
                                </span>
                            </h2>
                            <p className="text-lg md:text-xl text-slate-600 leading-relaxed max-w-3xl mx-auto">
                                Your data is ready! Select a professional template to showcase your experience in style
                            </p>
                        </motion.div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                            {CV_TEMPLATES.slice(0, 12).map((template, i) => (
                                <TemplateSelector key={template.id} templateId={template.id.toString()}>
                                    <motion.div
                                        variants={itemVariants}
                                        custom={i}
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ duration: 0.5, delay: i * 0.05 }}
                                        className="group cursor-pointer"
                                        whileHover={{ y: -8 }}
                                        whileTap={{ scale: 0.98 }}
                                    >
                                        <div className="relative bg-white/80 backdrop-blur-sm border border-slate-200 rounded-2xl overflow-hidden hover:border-blue-300 hover:shadow-2xl transition-all duration-300 group-hover:bg-white">
                                            {/* Template Preview */}
                                            <div className="relative overflow-hidden">
                                                <TemplatePreview templateId={template.id} size="small" />
                                                
                                                {/* Hover Overlay */}
                                                <div className="absolute inset-0 bg-gradient-to-t from-blue-600/20 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-all duration-300"></div>
                                                
                                                {/* Premium Badge */}
                                                {template.isPremium && (
                                                    <div className="absolute top-3 right-3 bg-gradient-to-r from-amber-500 to-orange-500 text-white rounded-lg px-3 py-1 text-xs font-semibold flex items-center space-x-1 shadow-lg">
                                                        <Sparkles className="h-3 w-3" />
                                                        <span>PRO</span>
                                                    </div>
                                                )}

                                                {/* Select Button Overlay */}
                                                <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300">
                                                    <Button className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-6 py-2 rounded-xl font-semibold shadow-lg transform scale-95 group-hover:scale-100 transition-all duration-200">
                                                        Select Template
                                                    </Button>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Template Info */}
                                        <div className="text-center mt-4 px-2">
                                            <h3 className="font-semibold text-slate-900 text-base mb-1 group-hover:text-blue-600 transition-colors duration-200">
                                                {template.name}
                                            </h3>
                                            <span className="text-sm text-slate-500 bg-slate-100 px-3 py-1 rounded-full">
                                                {template.category}
                                            </span>
                                        </div>
                                    </motion.div>
                                </TemplateSelector>
                            ))}
                        </div>

                        <motion.div variants={itemVariants} className="text-center">
                            <Button 
                                variant="outline" 
                                onClick={handleStartOver}
                                className="px-8 py-3 rounded-xl border-2 hover:bg-slate-50 transition-all duration-200"
                            >
                                Upload Different Resume
                            </Button>
                        </motion.div>
                    </motion.div>
                )}
            </div>
        </div>
    )
}