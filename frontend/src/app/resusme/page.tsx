'use client'

import React, { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Plus, FileText, Eye, Edit, Trash2, Calendar, User } from 'lucide-react'
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

    if (status === 'loading' || loading) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
                    <p className="mt-4 text-gray-600">Loading your resumes...</p>
                </div>
            </div>
        )
    }

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Header */}
            <div className="bg-white border-b border-gray-200">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex items-center justify-between h-16">
                        <div className="flex items-center space-x-4">
                            <h1 className="text-2xl font-bold text-gray-900">My Resumes</h1>
                            <span className="text-sm text-gray-500">
                                {resumes.length} resume{resumes.length !== 1 ? 's' : ''}
                            </span>
                        </div>
                        <div className="flex items-center space-x-3">
                            <Link
                                href="/profile"
                                className="flex items-center space-x-2 px-4 py-2 text-gray-700 hover:text-gray-900 border border-gray-300 rounded-lg hover:bg-gray-50"
                            >
                                <User className="w-4 h-4" />
                                <span>Profile</span>
                            </Link>
                            <Link
                                href="/template"
                                className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                            >
                                <Plus className="w-4 h-4" />
                                <span>Create New Resume</span>
                            </Link>
                        </div>
                    </div>
                </div>
            </div>

            {/* Content */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {error && (
                    <div className="mb-6 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
                        {error}
                    </div>
                )}

                {resumes.length === 0 ? (
                    <div className="text-center py-12">
                        <FileText className="w-24 h-24 text-gray-300 mx-auto mb-4" />
                        <h3 className="text-lg font-medium text-gray-900 mb-2">No resumes yet</h3>
                        <p className="text-gray-600 mb-6">Get started by creating your first resume</p>
                        <Link
                            href="/template"
                            className="inline-flex items-center px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                        >
                            <Plus className="w-5 h-5 mr-2" />
                            Create Your First Resume
                        </Link>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {resumes.map((resume) => (
                            <div key={resume.id} className="bg-white rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-shadow">
                                <div className="p-6">
                                    <div className="flex items-start justify-between mb-4">
                                        <div className="flex-1">
                                            <h3 className="text-lg font-semibold text-gray-900 mb-1">
                                                {resume.name || 'Untitled Resume'}
                                            </h3>
                                            <p className="text-sm text-gray-600">
                                                {resume.job_title || 'No position specified'}
                                            </p>
                                        </div>
                                        <div className={`w-3 h-3 rounded-full`} style={{ backgroundColor: resume.theme_color || '#3B82F6' }}></div>
                                    </div>

                                    <div className="flex items-center text-xs text-gray-500 mb-4">
                                        <Calendar className="w-3 h-3 mr-1" />
                                        <span>Updated {formatDate(resume.updated_at)}</span>
                                    </div>

                                    <div className="flex items-center justify-between">
                                        <div className="text-xs text-gray-500">
                                            Template #{resume.template_id}
                                        </div>
                                        <div className="flex items-center space-x-2">
                                            <Link
                                                href={`/resusme/${resume.id}?template=${resume.template_id}`}
                                                className="p-2 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded"
                                                title="View Resume"
                                            >
                                                <Eye className="w-4 h-4" />
                                            </Link>
                                            <Link
                                                href={`/template/${resume.template_id}?resumeId=${resume.id}`}
                                                className="p-2 text-gray-600 hover:text-green-600 hover:bg-green-50 rounded"
                                                title="Edit Resume"
                                            >
                                                <Edit className="w-4 h-4" />
                                            </Link>
                                            <button
                                                onClick={() => handleDeleteResume(resume.id)}
                                                className="p-2 text-gray-600 hover:text-red-600 hover:bg-red-50 rounded"
                                                title="Delete Resume"
                                            >
                                                <Trash2 className="w-4 h-4" />
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    )
}

export default ResumePage