import { create } from 'zustand'
import { persist } from 'zustand/middleware'

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

export const useResumeStore = create<ResumeStore>()(
    persist(
        (set, get) => ({
            ...initialState,

            // Navigation
            setCurrentStep: (step) => set({ currentStep: step }),
            nextStep: () => set((state) => ({ currentStep: Math.min(state.currentStep + 1, 5) })),
            prevStep: () => set((state) => ({ currentStep: Math.max(state.currentStep - 1, 1) })),

            // Template
            setTemplateId: (id) => set({ templateId: id }),

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
            resetStore: () => set(initialState)
        }),
        {
            name: 'resume-storage',
        }
    )
)
