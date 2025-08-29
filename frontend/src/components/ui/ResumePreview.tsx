import React from 'react'
import { useResumeStore } from '@/store/resumeStore'
import TemplateRenderer from '@/components/templates/TemplateRenderer'

function ResumePreview() {
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
        skills: skills.map(skill => skill.name),
        experience: workExperience.map(exp => ({
            title: exp.jobTitle,
            company: exp.employer,
            location: exp.isRemote ? 'Remote' : exp.location,
            start_date: exp.startDate,
            end_date: exp.isCurrentlyWorking ? 'Present' : exp.endDate,
            duration: `${exp.startDate} - ${exp.isCurrentlyWorking ? 'Present' : exp.endDate}`,
            description: exp.description ? exp.description.replace(/<[^>]*>/g, '').trim() : '',
            is_current: exp.isCurrentlyWorking
        })),
        education: education.map(edu => ({
            degree: edu.degree,
            school: edu.schoolName,
            institution: edu.schoolName, // For template compatibility
            field: edu.fieldOfStudy,
            start_date: edu.startDate,
            end_date: edu.endDate,
            year: `${edu.startDate} - ${edu.endDate}` // For template compatibility
        })),
        projects: [], // Add projects if needed later
        certifications: additionalSections
            .filter(section => section.type === 'certifications')
            .map(section => ({
                name: section.title,
                description: section.content.replace(/<[^>]*>/g, '').trim()
            })),
        languages: additionalSections
            .filter(section => section.type === 'languages')
            .map(section => ({
                name: section.title,
                proficiency: section.content.replace(/<[^>]*>/g, '').trim()
            })),
        linkedin_url: personalInfo.websites.find(w => w.label.toLowerCase().includes('linkedin'))?.url,
        github_url: personalInfo.websites.find(w => w.label.toLowerCase().includes('github'))?.url,
        portfolio_url: personalInfo.websites.find(w => 
            w.label.toLowerCase().includes('portfolio') || 
            w.label.toLowerCase().includes('website')
        )?.url
    }

    // Parse templateId to number
    const templateIdNumber = parseInt(templateId) || 2 // Default to Modern Minimalist

    return (
        <div className="w-full">
            <TemplateRenderer 
                templateId={templateIdNumber}
                userData={userData}
            />
        </div>
    )
}

export default ResumePreview
