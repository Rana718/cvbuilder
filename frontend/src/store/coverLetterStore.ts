import { create } from 'zustand'
import axiosInstance from '@/lib/axios'

export interface CoverLetterFormData {
    templateId: string
    documentId: number | null
    shareableUuid: string | null
    name: string
    email: string
    phone?: string
    address?: string
    recipient_title?: string
    recipient_company?: string
    body: string
    resume_id?: number
}

interface CoverLetterStore {
    // Form data fields
    templateId: string
    documentId: number | null
    shareableUuid: string | null
    name: string
    email: string
    phone?: string
    address?: string
    recipient_title?: string
    recipient_company?: string
    body: string
    resume_id?: number
    
    // Navigation and state
    isLoading: boolean
    tempCoverLetter: CoverLetterFormData | null

    // Template
    setTemplateId: (id: string) => void

    // Document ID
    setDocumentId: (id: number) => void
    clearDocumentId: () => void

    // Shareable UUID
    setShareableUuid: (uuid: string | null) => void

    // API methods
    saveCoverLetter: () => Promise<void>
    loadCoverLetter: (coverLetterId: number) => Promise<void>
    saveToTemp: (tempId: string) => Promise<void>
    hasData: () => boolean

    // Populate from API data
    populateFromCoverLetterData: (data: any) => void

    // Form data updates
    updateFormData: (data: Partial<CoverLetterFormData>) => void
    updateField: (field: keyof CoverLetterFormData, value: any) => void
    setFormData: (data: Partial<CoverLetterFormData>) => void

    // Loading state
    setLoading: (loading: boolean) => void

    // Reset
    resetStore: () => void
    
    // Clear store for new cover letter
    clearForNew: () => void
}

const initialState: CoverLetterFormData = {
    templateId: '1',
    documentId: null,
    shareableUuid: null,
    name: '',
    email: '',
    phone: '',
    address: '',
    recipient_title: '',
    recipient_company: '',
    body: '',
    resume_id: undefined
}

export const useCoverLetterStore = create<CoverLetterStore>()((set, get) => ({
    ...initialState,
    isLoading: false,
    tempCoverLetter: null,

    // Template
    setTemplateId: (id) => set({ templateId: id }),

    // Document ID
    setDocumentId: (id) => set({ documentId: id }),
    clearDocumentId: () => set({ documentId: null }),

    // Shareable UUID
    setShareableUuid: (uuid) => set({ shareableUuid: uuid }),

    // API methods
    saveCoverLetter: async () => {
        const state = get()

        // Transform frontend data to backend format
        const coverLetterData = {
            name: state.name,
            email: state.email,
            phone: state.phone || '',
            address: state.address || '',
            recipient_title: state.recipient_title || '',
            recipient_company: state.recipient_company || '',
            body: state.body,
            template_id: parseInt(state.templateId) || 1,
            resume_id: state.resume_id || null
        }

        try {
            set({ isLoading: true })

            if (state.documentId && typeof state.documentId === 'number') {
                // Update existing cover letter
                const response = await axiosInstance.put(`/api/cover-letters/${state.documentId}`, coverLetterData)
                set({ documentId: response.data.id })
            } else {
                // Create new cover letter
                const response = await axiosInstance.post('/api/cover-letters/', coverLetterData)
                set({ documentId: response.data.id })
            }
        } catch (error) {
            console.error('Failed to save cover letter:', error)
            throw error
        } finally {
            set({ isLoading: false })
        }
    },

    loadCoverLetter: async (coverLetterId: number) => {
        try {
            set({ isLoading: true })
            const response = await axiosInstance.get(`/api/cover-letters/${coverLetterId}`)
            get().populateFromCoverLetterData(response.data)
        } catch (error) {
            console.error('Failed to load cover letter:', error)
            throw error
        } finally {
            set({ isLoading: false })
        }
    },

    // Check if store has data
    hasData: () => {
        const state = get()
        return !!(
            state.name ||
            state.email ||
            state.body ||
            state.recipient_title ||
            state.recipient_company
        )
    },

    // Populate from API data
    populateFromCoverLetterData: (data) => {
        set({
            documentId: data.id,
            shareableUuid: data.shared_uuid || null,
            templateId: data.template_id?.toString() || '1',
            name: data.name || '',
            email: data.email || '',
            phone: data.phone || '',
            address: data.address || '',
            recipient_title: data.recipient_title || '',
            recipient_company: data.recipient_company || '',
            body: data.body || '',
            resume_id: data.resume_id || undefined
        })
    },

    // Form data updates
    updateFormData: (data) => set((state) => ({ ...state, ...data })),

    updateField: (field, value) => set((state) => ({ ...state, [field]: value })),

    setFormData: (data) => set((state) => ({ ...state, ...data })),

    saveToTemp: async (tempId: string) => {
        const state = get()
        const tempData = {
            templateId: state.templateId,
            documentId: null, // Temp data doesn't have a real ID
            shareableUuid: null,
            name: state.name,
            email: state.email,
            phone: state.phone,
            address: state.address,
            recipient_title: state.recipient_title,
            recipient_company: state.recipient_company,
            body: state.body,
            resume_id: state.resume_id
        }

        // Store in localStorage for temporary access
        localStorage.setItem(`temp-cover-letter-${tempId}`, JSON.stringify(tempData))
        set({ tempCoverLetter: tempData })
    },

    // Loading state
    setLoading: (loading) => set({ isLoading: loading }),

    // Reset
    resetStore: () => {
        set({ ...initialState, isLoading: false, tempCoverLetter: null })
    },

    // Clear store for new cover letter
    clearForNew: () => {
        set({ 
            ...initialState, 
            isLoading: false, 
            tempCoverLetter: null,
            documentId: null,
            shareableUuid: null 
        })
    }
}));
