import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'
import axiosInstance from '@/lib/axios'
import { COLOR_THEMES } from '@/components/ui/ColorThemePicker'

export interface PersonalInfo {
    firstName: string
    lastName: string
    profession: string
    city: string
    country: string
    pincode: string
    phone: string
    email: string
    image_url?: string
    websites: Array<{
        id: string
        label: string
        url: string
    }>
}

export interface WorkExperience {
    id: string
    jobTitle: string
    employer: string
    role?: string
    location: string
    isRemote: boolean
    startDate: string
    endDate: string
    isCurrentlyWorking: boolean
    description: string
}

export interface Education {
    id: string
    schoolName: string
    degree: string
    fieldOfStudy: string
    startDate: string
    endDate: string
}

export interface Skill {
    id: string
    name: string
    rating: number // 1-5 stars
}

export interface Project {
    id: string
    name: string
    description: string
    url?: string
    github_url?: string
}

export interface AdditionalSection {
    id: string
    type: 'personalDetails' | 'websites' | 'certifications' | 'languages' | 'software' | 'accomplishments' | 'additionalInfo' | 'affiliations' | 'interests' | 'hobbies' | 'custom'
    title: string
    content: string
}

export interface ColorTheme {
    name: string
    colors: {
        primary: string
        secondary: string
        accent: string
        text: string
        background: string
    } | null
}

export interface ResumeState {
    currentStep: number
    templateId: string
    documentId: number | null
    shareableUuid: string | null
    personalInfo: PersonalInfo
    workExperience: WorkExperience[]
    education: Education[]
    skills: Skill[]
    projects: Project[]
    summary: string
    additionalSections: AdditionalSection[]
    colorTheme: ColorTheme
    aiGenerated: {
        skills: boolean
        summary: boolean
    }
    aiSuggestions: {
        skills: string[]
        summary: string[]
    }
}

interface ResumeStore extends ResumeState {
    // Navigation
    setCurrentStep: (step: number) => void
    nextStep: () => void
    prevStep: () => void

    // Template
    setTemplateId: (id: string) => void

    // Color Theme
    setColorTheme: (theme: ColorTheme) => void

    // Document ID
    setDocumentId: (id: number) => void
    clearDocumentId: () => void

    // Shareable UUID
    setShareableUuid: (uuid: string | null) => void

    // API methods
    saveResume: () => Promise<void>
    loadResume: (resumeId: number) => Promise<void>
    hasData: () => boolean
    uploadImage: (file: File) => Promise<void>
    generatePreviewId: () => string
    isPreviewId: (id: string) => boolean
    isCurrentPreview: () => boolean

    // Populate from API data
    populateFromResumeData: (data: any) => void

    // Personal Info
    updatePersonalInfo: (info: Partial<PersonalInfo>) => void
    addWebsite: (website: { label: string; url: string }) => void
    removeWebsite: (id: string) => void

    // Work Experience
    addWorkExperience: (experience: Omit<WorkExperience, 'id'>) => void
    updateWorkExperience: (id: string, experience: Partial<WorkExperience>) => void
    removeWorkExperience: (id: string) => void

    // Education
    addEducation: (education: Omit<Education, 'id'>) => void
    updateEducation: (id: string, education: Partial<Education>) => void
    removeEducation: (id: string) => void

    // Projects
    addProject: (project: Omit<Project, 'id'>) => void
    updateProject: (id: string, project: Partial<Project>) => void
    removeProject: (id: string) => void

    // Skills
    addSkill: (skill: Omit<Skill, 'id'>) => void
    updateSkill: (id: string, skill: Partial<Skill>) => void
    removeSkill: (id: string) => void
    setSkills: (skills: Skill[]) => void

    // Summary
    setSummary: (summary: string) => void

    // AI Generation tracking
    setAiGenerated: (field: 'skills' | 'summary', value: boolean) => void
    isAiGenerated: (field: 'skills' | 'summary') => boolean
    setAiSuggestions: (field: 'skills' | 'summary', suggestions: string[]) => void
    getAiSuggestions: (field: 'skills' | 'summary') => string[]

    // Additional Sections
    addAdditionalSection: (section: Omit<AdditionalSection, 'id'>) => void
    updateAdditionalSection: (id: string, section: Partial<AdditionalSection>) => void
    removeAdditionalSection: (id: string) => void

    // Reset - only when explicitly called
    resetStore: () => void
    startNewResume: () => void
    clearResumeData: () => void
}

const generateId = () => Math.random().toString(36).substr(2, 9)

const initialState: ResumeState = {
    currentStep: 1,
    templateId: '',
    documentId: null,
    shareableUuid: null,
    personalInfo: {
        firstName: '',
        lastName: '',
        profession: '',
        city: '',
        country: '',
        pincode: '',
        phone: '',
        email: '',
        image_url: '',
        websites: []
    },
    workExperience: [],
    education: [],
    skills: [],
    projects: [],
    summary: '',
    additionalSections: [],
    colorTheme: {
        name: 'Default',
        colors: null
    },
    aiGenerated: {
        skills: false,
        summary: false
    },
    aiSuggestions: {
        skills: [],
        summary: []
    }
}

export const useResumeStore = create<ResumeStore>()(
    persist(
        (set, get) => ({
            ...initialState,

            // Navigation
            setCurrentStep: (step) => set({ currentStep: step }),
            nextStep: () => set((state) => ({ currentStep: Math.min(state.currentStep + 1, 6) })),
            prevStep: () => set((state) => ({ currentStep: Math.max(state.currentStep - 1, 1) })),

            // Template
            setTemplateId: (id) => set({ templateId: id }),

            // Color Theme
            setColorTheme: (theme) => set({ colorTheme: theme }),

            // Document ID
            setDocumentId: (id) => set({ documentId: id }),

            clearDocumentId: () => {
                set({ documentId: null })
            },

            // Shareable UUID
            setShareableUuid: (uuid) => set({ shareableUuid: uuid }),

    // API methods
    saveResume: async () => {
        const state = get()
        
        // Transform frontend data to backend format
        const resumeData = {
            name: `${state.personalInfo.firstName} ${state.personalInfo.lastName}`.trim(),
            email: state.personalInfo.email,
            phone: state.personalInfo.phone,
            city: state.personalInfo.city,
            country: state.personalInfo.country,
            postal_code: state.personalInfo.pincode,
            job_title: state.personalInfo.profession,
            summary: state.summary,
            image_url: state.personalInfo.image_url || '',
            skills: state.skills.reduce((acc, skill, index) => {
                acc[`skill_${index}`] = { name: skill.name, rating: skill.rating }
                return acc
            }, {} as Record<string, any>),
            experience: state.workExperience.reduce((acc, exp, index) => {
                acc[`exp_${index}`] = {
                    title: exp.jobTitle,
                    company: exp.employer,
                    location: exp.location,
                    start_date: exp.startDate,
                    end_date: exp.endDate,
                    is_current: exp.isCurrentlyWorking,
                    description: exp.description
                }
                return acc
            }, {} as Record<string, any>),
            education: state.education.reduce((acc, edu, index) => {
                acc[`edu_${index}`] = {
                    institution: edu.schoolName,
                    degree: edu.degree,
                    field: edu.fieldOfStudy,
                    start_date: edu.startDate,
                    end_date: edu.endDate
                }
                return acc
            }, {} as Record<string, any>),
            certifications: {},
            projects: state.projects.reduce((acc, project, index) => {
                acc[`project_${index}`] = {
                    name: project.name,
                    description: project.description,
                    url: project.url || '',
                    github_url: project.github_url || ''
                }
                return acc
            }, {} as Record<string, any>),
            languages: {},
            socail_links: state.personalInfo.websites.map(website => ({
                label: website.label,
                url: website.url,
                username: website.label.toLowerCase() === 'linkedin' 
                    ? website.url.split('/').pop() || '' 
                    : website.label.toLowerCase() === 'github'
                    ? website.url.split('/').pop() || ''
                    : website.url.replace(/^https?:\/\//, '').replace(/\/$/, '')
            })),
            template_id: parseInt(state.templateId) || 1,
            theme_color: state.colorTheme.name.toLowerCase().replace(/\s+/g, '_')
        }

        try {
            const isNewResume = !state.documentId || typeof state.documentId !== 'number'
            
            if (isNewResume) {
                // Create new resume
                const response = await axiosInstance.post('/api/resume-op/save', resumeData)
                set({ documentId: response.data.id })
            } else {
                // Update existing resume
                const response = await axiosInstance.put(`/api/resume-op/${state.documentId}`, resumeData)
                set({ documentId: response.data.id })
            }
        } catch (error) {
            console.error('Failed to save resume:', error)
            throw error
        }
    },

    loadResume: async (resumeId: number) => {
        try {
            const response = await axiosInstance.get(`/api/resume-op/${resumeId}`)
            get().populateFromResumeData(response.data)
        } catch (error) {
            console.error('Failed to load resume:', error)
            throw error
        }
    },

    uploadImage: async (file: File) => {
        try {
            if (!file) return;
            
            const formData = new FormData();
            formData.append('file', file);
            
            const response = await axiosInstance.post('/api/upload', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });
            
            const imageUrl = response.data.image_url;
            
            set((state) => ({
                personalInfo: {
                    ...state.personalInfo,
                    image_url: imageUrl
                }
            }))
        } catch (error) {
            console.error('Failed to upload image:', error)
            throw error
        }
    },

    // Check if store has data
    hasData: () => {
        const state = get()
        return !!(
            state.personalInfo.firstName || 
            state.personalInfo.lastName || 
            state.summary || 
            state.workExperience.length > 0 || 
            state.skills.length > 0 || 
            state.education.length > 0 ||
            state.projects.length > 0
        )
    },

    generatePreviewId: () => {
        return 'preview-' + Date.now() + '-' + Math.random().toString(36).substr(2, 9)
    },

    isPreviewId: (id: string) => {
        return !!(id && id.startsWith('preview-'))
    },

    isCurrentPreview: (): boolean => {
        const state = get()
        return !state.documentId || get().isPreviewId(state.documentId.toString())
    },

    // Populate from API data
    populateFromResumeData: (data) => {
        let websites = []
        
        if (data.socail_links && Array.isArray(data.socail_links)) {
            websites = data.socail_links
                .filter((link: any) => link.url && link.url.trim())
                .map((link: any) => ({
                    id: generateId(),
                    label: link.label || 'Link',
                    url: link.url.trim()
                }))
        } 
        else {
            websites = [
                ...(data.linkedin_url && data.linkedin_url.trim() ? [{ id: generateId(), label: 'LinkedIn', url: data.linkedin_url.trim() }] : []),
                ...(data.github_url && data.github_url.trim() ? [{ id: generateId(), label: 'GitHub', url: data.github_url.trim() }] : []),
                ...(data.portfolio_url && data.portfolio_url.trim() ? [{ id: generateId(), label: 'Portfolio', url: data.portfolio_url.trim() }] : [])
            ]
        }

        // Find color theme by name or use default
        const themeColorName = data.theme_color || 'blue_professional'
        const colorTheme = COLOR_THEMES.find(theme => 
            theme.name.toLowerCase().replace(/\s+/g, '_') === themeColorName.toLowerCase()
        ) || COLOR_THEMES[0]

        set({
            documentId: data.id,
            shareableUuid: data.sharedable_uuid || null,
            templateId: data.template_id?.toString() || '',
            colorTheme: colorTheme,
            personalInfo: {
                firstName: data.name?.split(' ')[0] || '',
                lastName: data.name?.split(' ').slice(1).join(' ') || '',
                profession: data.job_title || '',
                city: data.city || '',
                country: data.country || '',
                pincode: data.postal_code || '',
                phone: data.phone || '',
                email: data.email || '',
                image_url: data.image_url || '',
                websites: websites
            },
            summary: data.summary || '',
            workExperience: data.experience && typeof data.experience === 'object' ? 
                Object.values(data.experience).map((exp: any) => ({
                    id: generateId(),
                    jobTitle: exp.title || '',
                    employer: exp.company || '',
                    location: exp.location || '',
                    isRemote: false,
                    startDate: exp.start_date || '',
                    endDate: exp.end_date || '',
                    isCurrentlyWorking: exp.is_current || false,
                    description: exp.description || ''
                })) : [],
            education: data.education && typeof data.education === 'object' ? 
                Object.values(data.education).map((edu: any) => ({
                    id: generateId(),
                    schoolName: edu.institution || '',
                    degree: edu.degree || '',
                    fieldOfStudy: edu.field || '',
                    startDate: edu.start_date || '',
                    endDate: edu.end_date || ''
                })) : [],
            skills: data.skills && typeof data.skills === 'object' ? 
                Object.values(data.skills).map((skill: any) => ({
                    id: generateId(),
                    name: skill.name || '',
                    rating: skill.rating || 3
                })) : [],
            projects: data.projects && typeof data.projects === 'object' ? 
                Object.values(data.projects).map((project: any) => ({
                    id: generateId(),
                    name: project.name || '',
                    description: project.description || '',
                    url: project.url || '',
                    github_url: project.github_url || ''
                })) : []
        })
    },

    // Personal Info
    updatePersonalInfo: (info) =>
        set((state) => ({
            personalInfo: { ...state.personalInfo, ...info }
        })),

    addWebsite: (website) =>
        set((state) => ({
            personalInfo: {
                ...state.personalInfo,
                websites: [...state.personalInfo.websites, { ...website, id: generateId() }]
            }
        })),

    removeWebsite: (id) =>
        set((state) => ({
            personalInfo: {
                ...state.personalInfo,
                websites: state.personalInfo.websites.filter(w => w.id !== id)
            }
        })),

    // Work Experience
    addWorkExperience: (experience) =>
        set((state) => ({
            workExperience: [...state.workExperience, { ...experience, id: generateId() }]
        })),

    updateWorkExperience: (id, experience) =>
        set((state) => ({
            workExperience: state.workExperience.map(exp =>
                exp.id === id ? { ...exp, ...experience } : exp
            )
        })),

    removeWorkExperience: (id) =>
        set((state) => ({
            workExperience: state.workExperience.filter(exp => exp.id !== id)
        })),

    // Education
    addEducation: (education) =>
        set((state) => ({
            education: [...state.education, { ...education, id: generateId() }]
        })),

    updateEducation: (id, education) =>
        set((state) => ({
            education: state.education.map(edu =>
                edu.id === id ? { ...edu, ...education } : edu
            )
        })),

    removeEducation: (id) =>
        set((state) => ({
            education: state.education.filter(edu => edu.id !== id)
        })),

    // Projects
    addProject: (project) =>
        set((state) => ({
            projects: [...state.projects, { ...project, id: generateId() }]
        })),

    updateProject: (id, project) =>
        set((state) => ({
            projects: state.projects.map(proj =>
                proj.id === id ? { ...proj, ...project } : proj
            )
        })),

    removeProject: (id) =>
        set((state) => ({
            projects: state.projects.filter(proj => proj.id !== id)
        })),

    // Skills
    addSkill: (skill) =>
        set((state) => ({
            skills: [...state.skills, { ...skill, id: generateId() }]
        })),

    updateSkill: (id, skill) =>
        set((state) => ({
            skills: state.skills.map(s =>
                s.id === id ? { ...s, ...skill } : s
            )
        })),

    removeSkill: (id) =>
        set((state) => ({
            skills: state.skills.filter(s => s.id !== id)
        })),

    setSkills: (skills) => set({ skills }),

    // Summary
    setSummary: (summary) => set({ summary }),

    // AI Generation tracking
    setAiGenerated: (field, value) => 
        set((state) => ({
            aiGenerated: { ...state.aiGenerated, [field]: value }
        })),

    isAiGenerated: (field) => get().aiGenerated[field],

    setAiSuggestions: (field, suggestions) =>
        set((state) => ({
            aiSuggestions: { ...state.aiSuggestions, [field]: suggestions }
        })),

    getAiSuggestions: (field) => get().aiSuggestions[field],

    // Additional Sections
    addAdditionalSection: (section) =>
        set((state) => ({
            additionalSections: [...state.additionalSections, { ...section, id: generateId() }]
        })),

    updateAdditionalSection: (id, section) =>
        set((state) => ({
            additionalSections: state.additionalSections.map(s =>
                s.id === id ? { ...s, ...section } : s
            )
        })),

    removeAdditionalSection: (id) =>
        set((state) => ({
            additionalSections: state.additionalSections.filter(s => s.id !== id)
        })),

    // Reset - only when explicitly called
    resetStore: () => {
        set(initialState)
    },

    // Start new resume - explicitly called when user wants to create new
    startNewResume: () => {
        set({ ...initialState, documentId: null, shareableUuid: null })
    },

    // Clear resume data but keep current session info
    clearResumeData: () => {
        set({
            personalInfo: initialState.personalInfo,
            workExperience: [],
            education: [],
            skills: [],
            projects: [],
            summary: '',
            additionalSections: [],
            currentStep: 1,
            documentId: null,
            shareableUuid: null
        })
    }
}),
{
    name: 'resume-storage',
    version: 1,
    storage: createJSONStorage(() => localStorage),
    // Only persist essential data, not loading states
    partialize: (state) => ({
        templateId: state.templateId,
        documentId: state.documentId,
        shareableUuid: state.shareableUuid,
        personalInfo: state.personalInfo,
        workExperience: state.workExperience,
        education: state.education,
        skills: state.skills,
        projects: state.projects,
        summary: state.summary,
        additionalSections: state.additionalSections,
        currentStep: state.currentStep,
        colorTheme: state.colorTheme
    }),
    // Migration function for version updates
    migrate: (persistedState: any, version: number) => {
        if (version === 0) {
            // Migration from version 0 to 1
            return persistedState
        }
        return persistedState
    },
}
))
