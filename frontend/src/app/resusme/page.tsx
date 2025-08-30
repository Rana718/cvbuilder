'use client'

import React, { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Plus, FileText, Eye, Edit, Trash2, Calendar, User, Search, Grid, List } from 'lucide-react'
import axiosInstance from '@/lib/axios'

interface Resume {
    id: number
    name: string
    job_title: string
    template_id: number
    theme_color: string
    created_at: string
    updated_at: string
}

function ResumePage() {
    const { data: session, status } = useSession()
    const router = useRouter()
    const [resumes, setResumes] = useState<Resume[]>([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState('')
    const [searchTerm, setSearchTerm] = useState('')
    const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')

    useEffect(() => {
        if (status === 'loading') return
        
        if (!session) {
            router.push('/sign-in?callbackUrl=' + encodeURIComponent('/resusme'))
            return
        }

        fetchResumes()
    }, [session, status])

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

    if (status === 'loading' || loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-center">
                    <p className="mt-6 text-gray-700 font-medium">Loading your resumes...</p>
                </div>
            </div>
        )
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-50">
            <div className="bg-white/80 backdrop-blur-sm border-b border-blue-100 sticky top-0 z-10">
                <div className="max-w-7xl mx-auto px-6 lg:px-8">
                    <div className="flex items-center justify-between h-20">
                        <div className="flex items-center space-x-6">
                            <div className="flex items-center space-x-3">
                                <div className="bg-gradient-to-r from-blue-500 to-blue-600 p-2 rounded-xl">
                                    <FileText className="w-6 h-6 text-white" />
                                </div>
                                <div>
                                    <h1 className="text-2xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">
                                        My Resumes
                                    </h1>
                                    <p className="text-sm text-gray-500">
                                        {filteredResumes.length} of {resumes.length} resume{resumes.length !== 1 ? 's' : ''}
                                    </p>
                                </div>
                            </div>
                        </div>
                        
                        <div className="flex items-center space-x-4">
                            <div className="relative">
                                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                                <input
                                    type="text"
                                    placeholder="Search resumes..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    className="pl-10 pr-4 py-2 w-64 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                                />
                            </div>
                            
                            <div className="flex items-center bg-gray-100 rounded-xl p-1">
                                <button
                                    onClick={() => setViewMode('grid')}
                                    className={`p-2 rounded-lg transition-all ${viewMode === 'grid' ? 'bg-white text-blue-600 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
                                >
                                    <Grid className="w-4 h-4" />
                                </button>
                                <button
                                    onClick={() => setViewMode('list')}
                                    className={`p-2 rounded-lg transition-all ${viewMode === 'list' ? 'bg-white text-blue-600 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
                                >
                                    <List className="w-4 h-4" />
                                </button>
                            </div>

                            <Link
                                href="/profile"
                                className="flex items-center space-x-2 px-4 py-2 text-gray-700 hover:text-blue-600 border border-gray-200 rounded-xl hover:border-blue-200 hover:bg-blue-50/50 transition-all"
                            >
                                <User className="w-4 h-4" />
                                <span className="font-medium">Profile</span>
                            </Link>
                            <Link
                                href="/template"
                                className="flex items-center space-x-2 px-6 py-2 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-xl hover:from-blue-600 hover:to-blue-700 shadow-lg hover:shadow-xl transition-all transform hover:scale-105"
                            >
                                <Plus className="w-4 h-4" />
                                <span className="font-semibold">Create New</span>
                            </Link>
                        </div>
                    </div>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-6 lg:px-8 py-8">
                {error && (
                    <div className="mb-8 bg-red-50 border border-red-200 text-red-800 px-6 py-4 rounded-xl">
                        <div className="flex items-center">
                            <div className="w-2 h-2 bg-red-500 rounded-full mr-3"></div>
                            {error}
                        </div>
                    </div>
                )}

                {filteredResumes.length === 0 && searchTerm ? (
                    <div className="text-center py-16">
                        <Search className="w-20 h-20 text-gray-300 mx-auto mb-6" />
                        <h3 className="text-xl font-semibold text-gray-900 mb-2">No matching resumes</h3>
                        <p className="text-gray-600 mb-6">Try adjusting your search terms or create a new resume</p>
                        <button
                            onClick={() => setSearchTerm('')}
                            className="text-blue-600 hover:text-blue-700 font-medium"
                        >
                            Clear search
                        </button>
                    </div>
                ) : resumes.length === 0 ? (
                    <div className="text-center py-20">
                        <div className="bg-gradient-to-br from-blue-100 to-blue-200 w-32 h-32 rounded-3xl flex items-center justify-center mx-auto mb-8 shadow-lg">
                            <FileText className="w-16 h-16 text-blue-600" />
                        </div>
                        <h3 className="text-2xl font-bold text-gray-900 mb-3">Welcome to your resume dashboard</h3>
                        <p className="text-gray-600 mb-8 max-w-md mx-auto leading-relaxed">
                            Start building your professional resume with our AI-powered tools and beautiful templates
                        </p>
                        <Link
                            href="/template"
                            className="inline-flex items-center px-8 py-4 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-xl hover:from-blue-600 hover:to-blue-700 font-semibold shadow-lg hover:shadow-xl transition-all transform hover:scale-105"
                        >
                            <Plus className="w-5 h-5 mr-2" />
                            Create Your First Resume
                        </Link>
                    </div>
                ) : (
                    <div className={viewMode === 'grid' ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6' : 'space-y-4'}>
                        {filteredResumes.map((resume) => (
                            <div 
                                key={resume.id} 
                                className={`group bg-white rounded-2xl border border-gray-200 hover:border-blue-300 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 ${
                                    viewMode === 'list' ? 'flex items-center p-6' : 'p-6'
                                }`}
                            >
                                {viewMode === 'grid' ? (
                                    <>
                                        <div className="flex items-start justify-between mb-6">
                                            <div className="flex-1">
                                                <div className="flex items-center space-x-3 mb-2">
                                                    <div 
                                                        className="w-4 h-4 rounded-full shadow-sm"
                                                        style={{ backgroundColor: resume.theme_color || '#3B82F6' }}
                                                    ></div>
                                                    <h3 className="text-lg font-bold text-gray-900 group-hover:text-blue-600 transition-colors">
                                                        {resume.name || 'Untitled Resume'}
                                                    </h3>
                                                </div>
                                                <p className="text-gray-600 font-medium">
                                                    {resume.job_title || 'No position specified'}
                                                </p>
                                            </div>
                                        </div>

                                        <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl p-4 mb-6 border">
                                            <div className="flex items-center justify-center h-24">
                                                <FileText className="w-12 h-12 text-gray-400" />
                                            </div>
                                        </div>

                                        <div className="flex items-center justify-between text-sm text-gray-500 mb-6">
                                            <div className="flex items-center space-x-2">
                                                <Calendar className="w-4 h-4" />
                                                <span>Updated {formatDate(resume.updated_at)}</span>
                                            </div>
                                            <div className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-xs font-medium">
                                                Template #{resume.template_id}
                                            </div>
                                        </div>

                                        <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                                            <div className="text-xs text-gray-400 font-medium">
                                                ACTIONS
                                            </div>
                                            <div className="flex items-center space-x-2">
                                                <Link
                                                    href={`/resusme/${resume.id}?template=${resume.template_id}`}
                                                    className="p-3 text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded-xl transition-all"
                                                    title="View Resume"
                                                >
                                                    <Eye className="w-4 h-4" />
                                                </Link>
                                                <Link
                                                    href={`/template/${resume.template_id}?resumeId=${resume.id}`}
                                                    className="p-3 text-gray-500 hover:text-green-600 hover:bg-green-50 rounded-xl transition-all"
                                                    title="Edit Resume"
                                                >
                                                    <Edit className="w-4 h-4" />
                                                </Link>
                                                <button
                                                    onClick={() => handleDeleteResume(resume.id)}
                                                    className="p-3 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-xl transition-all"
                                                    title="Delete Resume"
                                                >
                                                    <Trash2 className="w-4 h-4" />
                                                </button>
                                            </div>
                                        </div>
                                    </>
                                ) : (
                                    <>
                                        <div className="flex items-center space-x-4 flex-1">
                                            <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl p-4 border">
                                                <FileText className="w-8 h-8 text-gray-400" />
                                            </div>
                                            <div className="flex-1">
                                                <div className="flex items-center space-x-3 mb-1">
                                                    <div 
                                                        className="w-3 h-3 rounded-full"
                                                        style={{ backgroundColor: resume.theme_color || '#3B82F6' }}
                                                    ></div>
                                                    <h3 className="text-lg font-bold text-gray-900 group-hover:text-blue-600 transition-colors">
                                                        {resume.name || 'Untitled Resume'}
                                                    </h3>
                                                    <div className="bg-blue-100 text-blue-700 px-2 py-1 rounded-lg text-xs font-medium">
                                                        #{resume.template_id}
                                                    </div>
                                                </div>
                                                <p className="text-gray-600 font-medium mb-2">
                                                    {resume.job_title || 'No position specified'}
                                                </p>
                                                <div className="flex items-center text-sm text-gray-500">
                                                    <Calendar className="w-4 h-4 mr-2" />
                                                    <span>Updated {formatDate(resume.updated_at)}</span>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="flex items-center space-x-2">
                                            <Link
                                                href={`/resusme/${resume.id}?template=${resume.template_id}`}
                                                className="p-3 text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded-xl transition-all"
                                                title="View Resume"
                                            >
                                                <Eye className="w-5 h-5" />
                                            </Link>
                                            <Link
                                                href={`/template/${resume.template_id}?resumeId=${resume.id}`}
                                                className="p-3 text-gray-500 hover:text-green-600 hover:bg-green-50 rounded-xl transition-all"
                                                title="Edit Resume"
                                            >
                                                <Edit className="w-5 h-5" />
                                            </Link>
                                            <button
                                                onClick={() => handleDeleteResume(resume.id)}
                                                className="p-3 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-xl transition-all"
                                                title="Delete Resume"
                                            >
                                                <Trash2 className="w-5 h-5" />
                                            </button>
                                        </div>
                                    </>
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