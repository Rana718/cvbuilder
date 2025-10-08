'use client'

import React, { useEffect, Suspense } from 'react'
import { useParams, useSearchParams } from 'next/navigation'
import { useResumeStore } from '@/store/resumeStore'
import MobileFrom from '@/components/from/MobileFrom'
import DesktopFrom from '@/components/from/DesktopFrom'
import axiosInstance from '@/lib/axios'

function TemplatePage() {
    const params = useParams()
    const searchParams = useSearchParams()
    const { setTemplateId, templateId, populateFromResumeData } = useResumeStore()

    const edit = searchParams.get('edit')
    const resumeId = searchParams.get('resumeId')

    useEffect(() => {
        if (params.id && params.id !== templateId) {
            setTemplateId(params.id as string)
        }
    }, [params.id, setTemplateId, templateId])

    useEffect(() => {
        if (resumeId) {
            const fetchResumeData = async () => {
                try {
                    const response = await axiosInstance.get(`/api/resume-op/${resumeId}`)
                    populateFromResumeData(response.data)
                } catch (error) {
                    console.error('Failed to fetch resume data:', error)
                    // showAlert('Failed to load resume data. Starting with a blank resume.')
                }
            }
            fetchResumeData()
        }
    }, [resumeId, populateFromResumeData])

    return (
        <>
            {/* Desktop Version */}
            <div className="hidden lg:block">
                <DesktopFrom />
            </div>

            {/* Mobile Version */}
            <div className="lg:hidden">
                <MobileFrom />
            </div>
        </>
    )
}

const TemplatePageWrapper = () => {
    return (
        <Suspense fallback={
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="animate-spin rounded-full h-8 w-8 border-2 border-blue-500 border-t-transparent"></div>
            </div>
        }>
            <TemplatePage />
        </Suspense>
    )
}

export default TemplatePageWrapper
