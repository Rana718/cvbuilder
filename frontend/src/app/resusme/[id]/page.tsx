'use client'

import React from 'react'
import { useParams, useSearchParams } from 'next/navigation'
import { useResumeStore } from '@/store/resumeStore'
import ResumePreview from '@/components/ui/ResumePreview'
import { ArrowLeft, Download, Share, Edit } from 'lucide-react'
import Link from 'next/link'

function ResumePage() {
    const params = useParams()
    const searchParams = useSearchParams()
    const templateId = searchParams.get('template')
    const resumeId = params.id

    const { personalInfo } = useResumeStore()

    const handleDownload = () => {
        // In real implementation, this would generate and download PDF
        console.log('Downloading resume...', { resumeId, templateId })
        alert('Download functionality would be implemented here')
    }

    const handleShare = () => {
        // In real implementation, this would create shareable link
        const shareUrl = `${window.location.origin}/resusme/${resumeId}?template=${templateId}`
        navigator.clipboard.writeText(shareUrl)
        alert('Resume link copied to clipboard!')
    }

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Header */}
            <div className="bg-white border-b border-gray-200">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex items-center justify-between h-16">
                        <div className="flex items-center space-x-4">
                            <Link 
                                href="/template"
                                className="flex items-center space-x-2 text-gray-600 hover:text-gray-900"
                            >
                                <ArrowLeft className="w-4 h-4" />
                                <span>Back to Templates</span>
                            </Link>
                            <div className="h-4 w-px bg-gray-300" />
                            <h1 className="text-lg font-semibold text-gray-900">
                                {personalInfo.firstName} {personalInfo.lastName}'s Resume
                            </h1>
                        </div>

                        <div className="flex items-center space-x-3">
                            <Link
                                href={`/template/${templateId}`}
                                className="flex items-center space-x-2 px-4 py-2 text-gray-700 hover:text-gray-900 border border-gray-300 rounded-lg hover:bg-gray-50"
                            >
                                <Edit className="w-4 h-4" />
                                <span>Edit</span>
                            </Link>
                            <button
                                onClick={handleShare}
                                className="flex items-center space-x-2 px-4 py-2 text-blue-700 hover:text-blue-800 border border-blue-300 rounded-lg hover:bg-blue-50"
                            >
                                <Share className="w-4 h-4" />
                                <span>Share</span>
                            </button>
                            <button
                                onClick={handleDownload}
                                className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                            >
                                <Download className="w-4 h-4" />
                                <span>Download PDF</span>
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Resume Content */}
            <div className="max-w-4xl mx-auto p-6">
                <div className="bg-white rounded-lg shadow-lg p-8">
                    <ResumePreview />
                </div>

                {/* Resume Info */}
                <div className="mt-6 bg-white rounded-lg shadow-sm p-6">
                    <h2 className="text-lg font-semibold text-gray-900 mb-4">Resume Details</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                        <div>
                            <span className="text-gray-600">Resume ID:</span>
                            <span className="ml-2 font-mono">{resumeId}</span>
                        </div>
                        <div>
                            <span className="text-gray-600">Template ID:</span>
                            <span className="ml-2 font-mono">{templateId}</span>
                        </div>
                        <div>
                            <span className="text-gray-600">Created:</span>
                            <span className="ml-2">{new Date().toLocaleDateString()}</span>
                        </div>
                        <div>
                            <span className="text-gray-600">Last Modified:</span>
                            <span className="ml-2">{new Date().toLocaleDateString()}</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default ResumePage