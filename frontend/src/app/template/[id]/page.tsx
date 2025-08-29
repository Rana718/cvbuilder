'use client'

import React, { useEffect } from 'react'
import { useParams } from 'next/navigation'
import { useResumeStore } from '@/store/resumeStore'
import MobileFrom from '@/components/from/MobileFrom'
import DesktopFrom from '@/components/from/DesktopFrom'

function TemplatePage() {
    const params = useParams()
    const { setTemplateId, templateId } = useResumeStore()

    useEffect(() => {
        if (params.id && params.id !== templateId) {
            setTemplateId(params.id as string)
        }
    }, [params.id, setTemplateId, templateId])

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