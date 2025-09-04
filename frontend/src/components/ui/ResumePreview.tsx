import React from 'react'
import { useResumeStore } from '@/store/resumeStore'
import TemplateRenderer from '@/components/templates/TemplateRenderer'
import { useAuth } from '@/components/AuthContext'
import { usePremiumStatus } from '@/hooks/usePremiumStatus'
import Watermark from '@/components/ui/Watermark'

interface ResumePreviewProps {
    mode?: 'default' | 'live'
    pass?: boolean
}

function ResumePreview({ mode = 'default', pass}: ResumePreviewProps) {
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
        templateId 
    } = useResumeStore()
    
    // Convert resume store data to UserData format expected by templates
    const userData = {
        name: `${personalInfo.firstName} ${personalInfo.lastName}`.trim() || 'Your Name',
        email: personalInfo.email || 'your.email@example.com',
        phone: personalInfo.phone,
        address: [personalInfo.city, personalInfo.country].filter(Boolean).join(', ') || undefined,
        job_title: personalInfo.profession || 'Professional Title',
        summary: summary ? summary.replace(/<[^>]*>/g, '').trim() : undefined,
        linkedin_url: personalInfo.websites?.find(w => w.label.toLowerCase().includes('linkedin'))?.url || '',
        github_url: personalInfo.websites?.find(w => w.label.toLowerCase().includes('github'))?.url || '',
        portfolio_url: personalInfo.websites?.find(w => 
            w.label.toLowerCase().includes('portfolio') || 
            w.label.toLowerCase().includes('website')
        )?.url || '',
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
    
    // Show watermark if user is not logged in or not premium, but not on shared pages when pass=true
    const showWatermark = pass ? false : (!user || !isPremium)

    return (
        <div 
            className={`bg-white overflow-hidden relative ${isLiveMode ? 'border border-black rounded-[4px]' : 'shadow-2xl border border-gray-300'}`}
            style={{
                aspectRatio: '210/297', // A4 ratio
                width: isLiveMode ? '100%' : '210mm',
                maxWidth: isLiveMode ? '100%' : '210mm',
                minHeight: isLiveMode ? 'auto' : '297mm'
            }}
            data-resume-content
        >
            <TemplateRenderer 
                templateId={templateIdNumber}
                userData={userData}
                size={resumeSize}
                mode={mode}
            />
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
