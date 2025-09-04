import { create } from 'zustand'
import axiosInstance from '@/lib/axios'
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { storage } from '@/lib/firebase'

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
}

interface ResumeStore extends ResumeState {
    // Navigation
    setCurrentStep: (step: number) => void
    nextStep: () => void
    prevStep: () => void

    // Template
    setTemplateId: (id: string) => void

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

    // Additional Sections
    addAdditionalSection: (section: Omit<AdditionalSection, 'id'>) => void
    updateAdditionalSection: (id: string, section: Partial<AdditionalSection>) => void
    removeAdditionalSection: (id: string) => void

    // Reset
    resetStore: () => void
    
    // Clear store for new resume creation only
    clearForNewResume: () => void
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
    additionalSections: []
}

export const useResumeStore = create<ResumeStore>()((set, get) => ({
    ...initialState,

    // Navigation
    setCurrentStep: (step) => set({ currentStep: step }),
    nextStep: () => set((state) => ({ currentStep: Math.min(state.currentStep + 1, 6) })),
    prevStep: () => set((state) => ({ currentStep: Math.max(state.currentStep - 1, 1) })),

    // Template
    setTemplateId: (id) => set({ templateId: id }),

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
            linkedin_url: state.personalInfo.websites.find(w => w.label.toLowerCase() === 'linkedin')?.url || '',
            github_url: state.personalInfo.websites.find(w => w.label.toLowerCase() === 'github')?.url || '',
            portfolio_url: state.personalInfo.websites.find(w => w.label.toLowerCase() === 'portfolio')?.url || '',
            template_id: parseInt(state.templateId) || 1,
            theme_color: 'blue'
        }

        try {
            const isNewResume = !state.documentId || typeof state.documentId !== 'number'
            
            if (isNewResume) {
                // Create new resume
                const response = await axiosInstance.post('/api/resume-op/save', resumeData)
                set({ documentId: response.data.id })
                // Only reset store for new resumes after a delay to allow navigation
                setTimeout(() => set(initialState), 2000)
            } else {
                // Update existing resume - don't reset store
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
            
            const storageRef = ref(storage, `profile_images/${Date.now()}_${file.name}`);
            await uploadBytes(storageRef, file);
            const downloadURL = await getDownloadURL(storageRef);
            
            set((state) => ({
                personalInfo: {
                    ...state.personalInfo,
                    image_url: downloadURL
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

    // Populate from API data
    populateFromResumeData: (data) => {
        // Create clean website array, filtering out empty URLs
        const websites = [
            ...(data.linkedin_url && data.linkedin_url.trim() ? [{ id: generateId(), label: 'LinkedIn', url: data.linkedin_url.trim() }] : []),
            ...(data.github_url && data.github_url.trim() ? [{ id: generateId(), label: 'GitHub', url: data.github_url.trim() }] : []),
            ...(data.portfolio_url && data.portfolio_url.trim() ? [{ id: generateId(), label: 'Portfolio', url: data.portfolio_url.trim() }] : [])
        ]

        set({
            documentId: data.id,
            shareableUuid: data.sharedable_uuid || null,
            templateId: data.template_id?.toString() || '',
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

    // Reset
    resetStore: () => {
        set(initialState)
    },

    // Clear store for new resume creation only
    clearForNewResume: () => {
        set({ ...initialState, documentId: null, shareableUuid: null })
    }
}))
