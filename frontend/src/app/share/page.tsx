'use client'

import React, { useState, useEffect } from 'react'
import { useSearchParams } from 'next/navigation'
import axiosInstance from '@/lib/axios'
import ResumePreview from '@/components/ui/ResumePreview'
import CoverLetterTemplate from '@/components/templates/CoverLetterTemplate'
import { useResumeStore } from '@/store/resumeStore'
import { useCoverLetterStore } from '@/store/coverLetterStore'

function SharePage() {
    const searchParams = useSearchParams()
    const uuid = searchParams.get('uuid')
    const templateId = searchParams.get('template')
    const shareType = searchParams.get('resume') ? 'resume' : searchParams.get('cover-letter') ? 'cover-letter' : 'resume'

    const { populateFromResumeData, setTemplateId } = useResumeStore()
    const { 
        name,
        email,
        phone,
        address,
        recipient_company,
        recipient_title,
        body,
        populateFromCoverLetterData 
    } = useCoverLetterStore()
    
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState('')
    const [coverLetterData, setCoverLetterData] = useState(null)

    useEffect(() => {
        const loadSharedContent = async () => {
            if (!uuid) {
                setError('Invalid share link')
                setLoading(false)
                return
            }

            try {
                if (shareType === 'cover-letter') {
                    // Load shared cover letter
                    const response = await axiosInstance.get(`/api/public/shared/cover-letter/${uuid}`)
                    setCoverLetterData(response.data)
                    populateFromCoverLetterData(response.data)
                } else {
                    // Load shared resume
                    if (templateId) {
                        setTemplateId(templateId)
                    }
                    const response = await axiosInstance.get(`/api/public/shared/resume/${uuid}`)
                    populateFromResumeData(response.data)
                }

            } catch (error: any) {
                console.error('Failed to load shared content:', error)
                setError(`Failed to load shared ${shareType}. The link may be invalid or expired.`)
            } finally {
                setLoading(false)
            }
        }

        loadSharedContent()
    }, [uuid, templateId, shareType, populateFromResumeData, setTemplateId, populateFromCoverLetterData])

    if (loading) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-gray-100 via-gray-50 to-blue-50 flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
                    <p className="mt-4 text-gray-600">Loading shared {shareType}...</p>
                </div>
            </div>
        )
    }

    if (error) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-gray-100 via-gray-50 to-blue-50 flex items-center justify-center">
                <div className="text-center">
                    <div className="text-red-500 text-xl mb-4">⚠️</div>
                    <h1 className="text-2xl font-bold text-gray-900 mb-2">{shareType === 'cover-letter' ? 'Cover Letter' : 'Resume'} Not Found</h1>
                    <p className="text-gray-600">{error}</p>
                </div>
            </div>
        )
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-100 via-gray-50 to-blue-50">
            <div className="flex justify-center items-start min-h-screen py-4 sm:py-8 px-2 sm:px-4">
                <div className="w-fit mx-auto max-w-full">
                    {shareType === 'cover-letter' ? (
                        <CoverLetterTemplate 
                            data={{
                                name: name || '',
                                email: email || '',
                                phone: phone || '',
                                address: address || '',
                                recipient_company: recipient_company || '',
                                recipient_title: recipient_title || '',
                                body: body || '',
                                template_id: 1,
                                id: 0,
                                created_at: '',
                                updated_at: ''
                            }}
                            isPreview={true}
                            hideWatermark={true}
                        />
                    ) : (
                        <ResumePreview pass={true} />
                    )}
                </div>
            </div>
        </div>
    )
}

export default SharePage