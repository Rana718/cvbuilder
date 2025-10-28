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
    
    isLoading: boolean
    tempCoverLetter: CoverLetterFormData | null

    setTemplateId: (id: string) => void

    setDocumentId: (id: number) => void
    clearDocumentId: () => void

    setShareableUuid: (uuid: string | null) => void

    saveCoverLetter: () => Promise<void>
    loadCoverLetter: (coverLetterId: number) => Promise<void>
    saveToTemp: (tempId: string) => Promise<void>
    hasData: () => boolean

    populateFromCoverLetterData: (data: any) => void

    updateFormData: (data: Partial<CoverLetterFormData>) => void
    updateField: (field: keyof CoverLetterFormData, value: any) => void
    setFormData: (data: Partial<CoverLetterFormData>) => void

    setLoading: (loading: boolean) => void

    resetStore: () => void
    startNewCoverLetter: () => void
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

    setTemplateId: (id) => set({ templateId: id }),

    setDocumentId: (id) => set({ documentId: id }),
    clearDocumentId: () => set({ documentId: null }),

    setShareableUuid: (uuid) => set({ shareableUuid: uuid }),

    saveCoverLetter: async () => {
        const state = get()

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

            const isNewCoverLetter = !state.documentId || typeof state.documentId !== 'number'
            
            if (isNewCoverLetter) {
                const response = await axiosInstance.post('/api/cover-letters/', coverLetterData)
                set({ documentId: response.data.id })
            } else {
                const response = await axiosInstance.put(`/api/cover-letters/${state.documentId}`, coverLetterData)
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

    updateFormData: (data) => set((state) => ({ ...state, ...data })),

    updateField: (field, value) => set((state) => ({ ...state, [field]: value })),

    setFormData: (data) => set((state) => ({ ...state, ...data })),

    saveToTemp: async (tempId: string) => {
        const state = get()
        const tempData = {
            templateId: state.templateId,
            documentId: null,
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

        localStorage.setItem(`temp-cover-letter-${tempId}`, JSON.stringify(tempData))
        set({ tempCoverLetter: tempData })
    },

    setLoading: (loading) => set({ isLoading: loading }),

    resetStore: () => {
        set({ ...initialState, isLoading: false, tempCoverLetter: null })
    },

    startNewCoverLetter: () => {
        set({ 
            ...initialState, 
            isLoading: false, 
            tempCoverLetter: null,
            documentId: null,
            shareableUuid: null 
        })
    }
}));
