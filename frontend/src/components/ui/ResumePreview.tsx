import React from 'react'
import { useResumeStore } from '@/store/resumeStore'
import TemplateRenderer from '@/components/templates/TemplateRenderer'

interface ResumePreviewProps {
    mode?: 'default' | 'live'
}

function ResumePreview({ mode = 'default' }: ResumePreviewProps) {
    const { 
        personalInfo, 
        workExperience, 
        education, 
        skills, 
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
        projects: additionalSections
            .filter(section => section.type === 'custom' && section.title.toLowerCase().includes('project'))
            .map(section => ({
                name: section.title,
                description: section.content.replace(/<[^>]*>/g, '').trim(),
                technologies: []
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

    return (
        <div 
            className={`bg-white shadow-lg border border-gray-200 overflow-hidden ${isLiveMode ? '' : 'mx-auto'}`}
            style={{
                aspectRatio: '210/297', // A4 ratio
                width: isLiveMode ? '100%' : '210mm',
                maxWidth: isLiveMode ? '100%' : '210mm'
            }}
            data-resume-content
        >
            <TemplateRenderer 
                templateId={templateIdNumber}
                userData={userData}
                scale={isLiveMode ? 0.8 : 1}
                mode={mode}
            />
        </div>
    )
}

export default ResumePreview
