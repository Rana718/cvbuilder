'use client'

import React, { useEffect } from 'react'
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
    const resumeId = searchParams.get('resumeId') // Fix parameter name

    useEffect(() => {
        if (params.id && params.id !== templateId) {
            setTemplateId(params.id as string)
        }
    }, [params.id, setTemplateId, templateId])

    useEffect(() => {
        // Load existing resume data if resumeId is provided
        if (resumeId) {
            const fetchResumeData = async () => {
                try {
                    const response = await axiosInstance.get(`/api/resume-op/${resumeId}`)
                    populateFromResumeData(response.data)
                } catch (error) {
                    console.error('Failed to fetch resume data:', error)
                    alert('Failed to load resume data. Starting with a blank resume.')
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

export default TemplatePage
