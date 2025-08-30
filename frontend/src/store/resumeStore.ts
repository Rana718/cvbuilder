import { create } from 'zustand'

export interface PersonalInfo {
    firstName: string
    lastName: string
    profession: string
    city: string
    country: string
    pincode: string
    phone: string
    email: string
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
    level?: 'Beginner' | 'Intermediate' | 'Advanced' | 'Expert'
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
    personalInfo: PersonalInfo
    workExperience: WorkExperience[]
    education: Education[]
    skills: Skill[]
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
    getOrCreateDocumentId: () => number
    clearDocumentId: () => void

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
}

const generateId = () => Math.random().toString(36).substr(2, 9)

const initialState: ResumeState = {
    currentStep: 1,
    templateId: '',
    documentId: null,
    personalInfo: {
        firstName: '',
        lastName: '',
        profession: '',
        city: '',
        country: '',
        pincode: '',
        phone: '',
        email: '',
        websites: []
    },
    workExperience: [],
    education: [],
    skills: [],
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

    getOrCreateDocumentId: () => {
        const state = get()
        if (state.documentId) {
            return state.documentId
        }
        // Generate a consistent document ID based on user data or session
        // Use a combination of timestamp and random for uniqueness but consistency within session
        const sessionDocId = sessionStorage.getItem('resume_document_id')
        if (sessionDocId) {
            const docId = parseInt(sessionDocId)
            set({ documentId: docId })
            return docId
        }
        
        // Generate new document ID and store in session
        const newDocId = Date.now() + Math.floor(Math.random() * 1000)
        sessionStorage.setItem('resume_document_id', newDocId.toString())
        set({ documentId: newDocId })
        return newDocId
    },

    clearDocumentId: () => {
        sessionStorage.removeItem('resume_document_id')
        set({ documentId: null })
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
                websites: websites
            },
            summary: data.summary || '',
            workExperience: Array.isArray(data.experience) ? data.experience.map((exp: any) => ({
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
            education: Array.isArray(data.education) ? data.education.map((edu: any) => ({
                id: generateId(),
                schoolName: edu.institution || '',
                degree: edu.degree || '',
                fieldOfStudy: edu.field || '',
                startDate: edu.start_date || '',
                endDate: edu.end_date || ''
            })) : [],
            skills: Array.isArray(data.skills) ? data.skills.map((skill: any) => ({
                id: generateId(),
                name: typeof skill === 'string' ? skill : skill.name || '',
                rating: skill.rating || 3,
                level: skill.level || 'Intermediate'
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
        // Clear session storage for document ID
        sessionStorage.removeItem('resume_document_id')
        set(initialState)
    }
}))
