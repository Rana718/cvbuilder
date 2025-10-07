import React, { JSX, useEffect, useRef, useState } from 'react'
import { useResumeStore } from '@/store/resumeStore'
import TemplateRenderer from '@/components/templates/TemplateRenderer'
import { useAuth } from '@/components/AuthContext'
import { usePremiumStatus } from '@/hooks/usePremiumStatus'
import Watermark from '@/components/ui/Watermark'

interface ResumePreviewProps {
    mode?: 'default' | 'live'
    pass?: boolean
    onlyonepage?: boolean
}

function ResumePreview({ mode = 'default', pass, onlyonepage }: ResumePreviewProps) {
    const { user } = useAuth()
    const { isPremium } = usePremiumStatus()
    const {
        personalInfo,
        workExperience,
        education,
        skills,
        projects,
        summary,
        additionalSections,
        templateId,
        colorTheme
    } = useResumeStore()

    const [pages, setPages] = useState<JSX.Element[]>([])
    const contentRef = useRef<HTMLDivElement>(null)

    const userData = {
        name: `${personalInfo.firstName} ${personalInfo.lastName}`.trim() || 'Your Name',
        email: personalInfo.email || 'your.email@example.com',
        phone: personalInfo.phone,
        address: [personalInfo.city, personalInfo.country].filter(Boolean).join(', ') || undefined,
        job_title: personalInfo.profession || 'Professional Title',
        summary: summary ? summary.replace(/<[^>]*>/g, '').trim() : undefined,
        social_links: personalInfo.websites?.map(website => ({
            label: website.label,
            url: website.url,
            username: website.label.toLowerCase() === 'linkedin'
                ? website.url.split('/').pop() || ''
                : website.label.toLowerCase() === 'github'
                    ? website.url.split('/').pop() || ''
                    : website.url.replace(/^https?:\/\//, '').replace(/\/$/, '')
        })) || [],
        image_url: personalInfo.image_url || '',
        skills: skills.map(skill => ({
            name: skill.name,
            rating: skill.rating || 3
        })),
        experience: workExperience.map(exp => ({
            title: exp.jobTitle,
            company: exp.employer,
            location: exp.isRemote ? 'Remote' : exp.location,
            start_date: exp.startDate,
            end_date: exp.isCurrentlyWorking ? 'Present' : exp.endDate,
            duration: `${exp.startDate} - ${exp.isCurrentlyWorking ? 'Present' : exp.endDate}`,
            description: exp.description ? exp.description.replace(/<[^>]*>/g, '').trim() : '',
            is_current: exp.isCurrentlyWorking,
            isRemote: exp.isRemote
        })),
        education: education.map(edu => ({
            degree: edu.degree,
            school: edu.schoolName,
            institution: edu.schoolName,
            field: edu.fieldOfStudy,
            start_date: edu.startDate,
            end_date: edu.endDate,
            year: `${edu.startDate} - ${edu.endDate}`
        })),
        projects: projects.map(project => ({
            name: project.name,
            description: project.description ? project.description.replace(/<[^>]*>/g, '').trim() : '',
            url: project.url || '',
            github_url: project.github_url || ''
        })),
        certifications: additionalSections
            .filter(section => section.type === 'certifications')
            .map(section => ({
                name: section.title,
                issuer: 'Certification Body',
                date: new Date().getFullYear().toString(),
                description: section.content.replace(/<[^>]*>/g, '').trim()
            })),
        languages: additionalSections
            .filter(section => section.type === 'languages')
            .map(section => ({
                name: section.title,
                proficiency: section.content.replace(/<[^>]*>/g, '').trim()
            }))
    }

    const templateIdNumber = parseInt(templateId) || 2
    const isLiveMode = mode === 'live'
    const resumeSize = isLiveMode ? 'small' : 'normal'

    const showWatermark = pass ? false : (!user || !isPremium)

    useEffect(() => {
        if (isLiveMode || onlyonepage) return // Skip pagination for live mode or when only one page is requested

        const timer = setTimeout(() => {
            if (contentRef.current) {
                const contentHeight = contentRef.current.scrollHeight
                const pageHeight = 297 * 3.779527559 // 297mm to pixels (1mm = 3.779527559px)
                const headerMargin = 20 * 3.779527559 // 20mm top margin
                const footerMargin = 15 * 3.779527559 // 15mm bottom margin
                const safePageHeight = pageHeight - headerMargin - footerMargin

                if (contentHeight > safePageHeight) {
                    // Content overflows, create multiple pages with intelligent page breaks
                    const pageCount = Math.ceil(contentHeight / safePageHeight)
                    const newPages = []

                    for (let i = 0; i < pageCount; i++) {
                        newPages.push(
                            <div
                                key={i}
                                className="bg-white relative page-break"
                                style={{
                                    width: '210mm',
                                    height: '297mm',
                                    overflow: 'hidden',
                                    pageBreakAfter: i < pageCount - 1 ? 'always' : 'auto',
                                    position: 'relative'
                                }}
                            >
                                <div
                                    style={{
                                        transform: `translateY(-${i * safePageHeight}px)`,
                                        height: `${contentHeight + footerMargin}px`,
                                        position: 'relative',
                                        paddingBottom: '15px' // Small padding at bottom for better appearance
                                    }}
                                >
                                    <TemplateRenderer
                                        templateId={templateIdNumber}
                                        userData={userData}
                                        colors={colorTheme.colors}
                                        size={resumeSize}
                                        mode={mode}
                                    />
                                </div>
                                {showWatermark && (
                                    <Watermark
                                        text="AI CV Builder - Upgrade to Premium"
                                        opacity={0.15}
                                    />
                                )}
                            </div>
                        )
                    }
                    setPages(newPages)
                } else {
                    setPages([])
                }
            }
        }, 100)

        return () => clearTimeout(timer)
    }, [userData, templateIdNumber, colorTheme, resumeSize, mode, showWatermark, isLiveMode, onlyonepage])

    // If we have multiple pages, render them (but not if onlyonepage is true)
    if (pages.length > 0 && !isLiveMode && !onlyonepage) {
        return (
            <div className="space-y-4">
                {pages.map((page, index) => (
                    <div key={index} className="shadow-2xl border border-gray-300">
                        {page}
                    </div>
                ))}
            </div>
        )
    }

    return (
        <div
            className={`bg-white overflow-hidden relative ${isLiveMode ? 'border border-black rounded-[4px]' : 'shadow-2xl border border-gray-300'}`}
            style={{
                aspectRatio: isLiveMode ? '210/297' : undefined,
                width: isLiveMode ? '100%' : onlyonepage ? '210mm' : '280mm',
                maxWidth: isLiveMode ? '100%' : onlyonepage ? '210mm' : '280mm',
                minHeight: isLiveMode ? 'auto' : onlyonepage ? '297mm' : 'auto',
                height: onlyonepage ? '297mm' : 'auto',
                overflow: onlyonepage ? 'hidden' : 'visible'
            }}
            data-resume-content
        >
            <div 
                ref={contentRef} 
                style={{ 
                    minHeight: isLiveMode ? 'auto' : onlyonepage ? '297mm' : '297mm',
                    height: onlyonepage ? '100%' : 'auto',
                    paddingBottom: onlyonepage ? '0' : '20px'
                }}
            >
                <TemplateRenderer
                    templateId={templateIdNumber}
                    userData={userData}
                    colors={colorTheme.colors}
                    size={resumeSize}
                    mode={mode}
                />
            </div>
            {showWatermark && (
                <Watermark
                    text="AI CV Builder - Upgrade to Premium"
                    opacity={0.15}
                />
            )}
        </div>
    )
}

export default ResumePreview
