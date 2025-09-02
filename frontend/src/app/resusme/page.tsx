'use client'

import React, { useState, useEffect } from 'react'
import { useAuth } from '@/components/AuthContext'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Plus, Edit, Trash2, Calendar, User, Search, Grid, List } from 'lucide-react'
import axiosInstance from '@/lib/axios'
import TemplateRenderer from '@/components/templates/TemplateRenderer'

interface Resume {
    id: number
    name: string
    job_title: string
    template_id: number
    theme_color: string
    created_at: string
    updated_at: string
    // Add other resume data fields
    email?: string
    phone?: string
    city?: string
    country?: string
    summary?: string
    skills?: any
    experience?: any
    education?: any
    projects?: any
}

function ResumePage() {
    const { user, loading: status } = useAuth();
    const router = useRouter()
    const [resumes, setResumes] = useState<Resume[]>([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState('')
    const [searchTerm, setSearchTerm] = useState('')
    const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')

    useEffect(() => {
        if (status) return // Still loading auth

        if (!user) {
            router.push('/sign-in?callbackUrl=' + encodeURIComponent('/resusme'))
            return
        }

        fetchResumes()
    }, [user, status, router])

    const fetchResumes = async () => {
        try {
            setLoading(true)
            const response = await axiosInstance.get('/api/resume-op/all')
            setResumes(response.data)
        } catch (error: any) {
            console.error('Failed to fetch resumes:', error)
            if (error.response?.status === 401) {
                router.push('/sign-in?callbackUrl=' + encodeURIComponent('/resusme'))
            } else {
                setError('Failed to load resumes. Please try again.')
            }
        } finally {
            setLoading(false)
        }
    }

    const handleDeleteResume = async (resumeId: number) => {
        if (!confirm('Are you sure you want to delete this resume?')) return

        try {
            await axiosInstance.delete(`/api/resume-op/${resumeId}`)
            setResumes(resumes.filter(resume => resume.id !== resumeId))
        } catch (error: any) {
            console.error('Failed to delete resume:', error)
            alert('Failed to delete resume. Please try again.')
        }
    }

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        })
    }

    const filteredResumes = resumes.filter(resume =>
        resume.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        resume.job_title?.toLowerCase().includes(searchTerm.toLowerCase())
    )

    // Convert resume data to UserData format for template rendering
    const convertToUserData = (resume: Resume) => ({
        name: resume.name || 'Your Name',
        email: resume.email || 'your.email@example.com',
        phone: resume.phone || '',
        address: [resume.city, resume.country].filter(Boolean).join(', ') || '',
        job_title: resume.job_title || 'Professional Title',
        summary: resume.summary || '',
        skills: resume.skills ? Object.values(resume.skills).map((skill: any) => ({
            name: skill.name || '',
            rating: skill.rating || 3
        })) : [],
        experience: resume.experience ? Object.values(resume.experience).map((exp: any) => ({
            title: exp.title || '',
            company: exp.company || '',
            duration: `${exp.start_date || ''} - ${exp.end_date || 'Present'}`,
            description: exp.description || ''
        })) : [],
        education: resume.education ? Object.values(resume.education).map((edu: any) => ({
            degree: edu.degree || '',
            institution: edu.institution || '',
            year: `${edu.start_date || ''} - ${edu.end_date || ''}`
        })) : [],
        projects: resume.projects ? Object.values(resume.projects).map((project: any) => ({
            name: project.name || '',
            description: project.description || '',
            url: project.url || '',
            github_url: project.github_url || ''
        })) : [],
        linkedin_url: '',
        github_url: '',
        portfolio_url: ''
    })

    // Show loading while auth is loading or resumes are loading
    if (status || (user && loading)) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
                    <p className="mt-6 text-gray-700 font-medium">
                        {status ? 'Checking authentication...' : 'Loading your resumes...'}
                    </p>
                </div>
            </div>
        )
    }

    // If auth is done and no user, redirect will happen in useEffect
    if (!status && !user) {
        return null
    }

    return (
        <div className="min-h-screen bg-gray-50/50">
            {/* Header */}
            <div className="bg-white/95 backdrop-blur-sm border-b border-gray-200/50 sticky top-0 z-10 shadow-sm">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex items-center justify-between h-16">
                        <div className="flex items-center space-x-2 sm:space-x-4">
                            <h1 className="text-lg sm:text-xl font-semibold text-gray-900">My Resumes</h1>
                            <span className="text-xs sm:text-sm text-gray-500">
                                ({filteredResumes.length} of {resumes.length})
                            </span>
                        </div>

                        <div className="flex items-center space-x-2 sm:space-x-4">
                            <div className="relative hidden sm:block">
                                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                                <input
                                    type="text"
                                    placeholder="Search resumes..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    className="pl-10 pr-4 py-2 w-48 lg:w-64 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                />
                            </div>

                            <div className="flex items-center bg-gray-100 rounded-lg p-1">
                                <button
                                    onClick={() => setViewMode('grid')}
                                    className={`p-2 rounded transition-all ${viewMode === 'grid' ? 'bg-white text-blue-600 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
                                >
                                    <Grid className="w-4 h-4" />
                                </button>
                                <button
                                    onClick={() => setViewMode('list')}
                                    className={`p-2 rounded transition-all ${viewMode === 'list' ? 'bg-white text-blue-600 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
                                >
                                    <List className="w-4 h-4" />
                                </button>
                            </div>

                            <Link
                                href="/profile"
                                className="hidden sm:flex items-center space-x-2 px-4 py-2 text-gray-700 hover:text-blue-600 border border-gray-300 rounded-lg hover:border-blue-300 transition-all"
                            >
                                <User className="w-4 h-4" />
                                <span>Profile</span>
                            </Link>
                            <Link
                                href="/template"
                                className="flex items-center space-x-2 px-3 sm:px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all"
                            >
                                <Plus className="w-4 h-4" />
                                <span className="hidden sm:inline">Create New</span>
                                <span className="sm:hidden">New</span>
                            </Link>
                        </div>
                    </div>
                    
                    {/* Mobile Search */}
                    <div className="sm:hidden pb-4">
                        <div className="relative">
                            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                            <input
                                type="text"
                                placeholder="Search resumes..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            />
                        </div>
                    </div>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 lg:py-12">
                {error && (
                    <div className="mb-8 bg-red-50 border border-red-200 text-red-800 px-4 py-3 rounded-lg">
                        {error}
                    </div>
                )}

                {filteredResumes.length === 0 && searchTerm ? (
                    <div className="text-center py-16">
                        <Search className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                        <h3 className="text-lg font-medium text-gray-900 mb-2">No matching resumes</h3>
                        <p className="text-gray-600 mb-4">Try adjusting your search terms or create a new resume</p>
                        <button
                            onClick={() => setSearchTerm('')}
                            className="text-blue-600 hover:text-blue-700 font-medium"
                        >
                            Clear search
                        </button>
                    </div>
                ) : resumes.length === 0 ? (
                    <div className="text-center py-20">
                        <div className="bg-blue-100 w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-6">
                            <Plus className="w-12 h-12 text-blue-600" />
                        </div>
                        <h3 className="text-xl font-semibold text-gray-900 mb-3">Welcome to your resume dashboard</h3>
                        <p className="text-gray-600 mb-6 max-w-md mx-auto">
                            Start building your professional resume with our templates
                        </p>
                        <Link
                            href="/template"
                            className="inline-flex items-center px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium"
                        >
                            <Plus className="w-5 h-5 mr-2" />
                            Create Your First Resume
                        </Link>
                    </div>
                ) : (
                    <div className={viewMode === 'grid' ? 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6' : 'space-y-1 divide-y divide-gray-100'}>
                        {filteredResumes.map((resume) => (
                            <div key={resume.id} className={viewMode === 'grid' ? 'group' : 'py-3'}>
                                {viewMode === 'grid' ? (
                                    <div className="space-y-3">
                                        {/* Action Buttons */}
                                        <div className="flex items-center justify-between">
                                            <span className="text-xs sm:text-sm text-gray-500">
                                                {formatDate(resume.updated_at)}
                                            </span>
                                            <div className="flex items-center space-x-1">
                                                <Link
                                                    href={`/template/${resume.template_id}?resumeId=${resume.id}`}
                                                    className="p-2 text-gray-400 hover:text-green-600 hover:bg-green-50 rounded-md transition-all"
                                                    title="Edit Resume"
                                                >
                                                    <Edit className="w-4 h-4" />
                                                </Link>
                                                <button
                                                    onClick={() => handleDeleteResume(resume.id)}
                                                    className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-md transition-all"
                                                    title="Delete Resume"
                                                >
                                                    <Trash2 className="w-4 h-4" />
                                                </button>
                                            </div>
                                        </div>

                                        {/* Resume Preview - Clickable */}
                                        <Link href={`/resusme/${resume.id}?template=${resume.template_id}`}>
                                            <div className="aspect-[1/1.414] bg-white shadow-sm hover:shadow-md transition-shadow border border-gray-100 rounded-sm overflow-hidden cursor-pointer">
                                                <TemplateRenderer
                                                    templateId={resume.template_id}
                                                    userData={convertToUserData(resume)}
                                                    size="small"
                                                />
                                            </div>
                                        </Link>

                                        {/* Resume Info */}
                                        <div className="space-y-1">
                                            <p className="font-medium text-gray-900 text-sm truncate">
                                                {resume.job_title || 'No position specified'}
                                            </p>
                                            <div className="flex items-center justify-between">
                                                <span className="text-xs text-gray-400">
                                                    Template #{resume.template_id}
                                                </span>
                                                <div
                                                    className="w-2 h-2 rounded-full"
                                                    style={{ backgroundColor: resume.theme_color || '#3B82F6' }}
                                                />
                                            </div>
                                        </div>
                                    </div>
                                ) : (
                                    <div className="flex items-center space-x-4 py-3 hover:bg-gray-50 -mx-6 px-6 transition-colors">
                                        {/* Small Resume Preview - Clickable */}
                                        <Link href={`/resusme/${resume.id}?template=${resume.template_id}`} className="flex-shrink-0">
                                            <div className="w-12 h-16 overflow-hidden rounded border border-gray-200 bg-white shadow-sm cursor-pointer hover:shadow-md transition-shadow">
                                                <TemplateRenderer
                                                    templateId={resume.template_id}
                                                    userData={convertToUserData(resume)}
                                                    size="small"
                                                />
                                            </div>
                                        </Link>

                                        {/* Resume Info - Clickable */}
                                        <Link href={`/resusme/${resume.id}?template=${resume.template_id}`} className="flex-1 min-w-0">
                                            <div className="flex items-center space-x-2 mb-1">
                                                <div
                                                    className="w-2 h-2 rounded-full flex-shrink-0"
                                                    style={{ backgroundColor: resume.theme_color || '#3B82F6' }}
                                                />
                                                <h3 className="font-medium text-gray-900 truncate">
                                                    {resume.job_title || 'No position specified'}
                                                </h3>
                                                <span className="text-xs text-gray-400 bg-gray-100 px-2 py-0.5 rounded flex-shrink-0 hidden sm:inline">
                                                    #{resume.template_id}
                                                </span>
                                            </div>
                                            <div className="flex items-center text-sm text-gray-500">
                                                <Calendar className="w-3 h-3 mr-1" />
                                                <span className="text-xs sm:text-sm">{formatDate(resume.updated_at)}</span>
                                            </div>
                                        </Link>

                                        {/* Action Buttons */}
                                        <div className="flex items-center space-x-1 flex-shrink-0">
                                            <Link
                                                href={`/template/${resume.template_id}?resumeId=${resume.id}`}
                                                className="p-2 text-gray-400 hover:text-green-600 hover:bg-green-50 rounded-md transition-all"
                                                title="Edit Resume"
                                            >
                                                <Edit className="w-4 h-4" />
                                            </Link>
                                            <button
                                                onClick={() => handleDeleteResume(resume.id)}
                                                className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-md transition-all"
                                                title="Delete Resume"
                                            >
                                                <Trash2 className="w-4 h-4" />
                                            </button>
                                        </div>
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    )
}

export default ResumePage
