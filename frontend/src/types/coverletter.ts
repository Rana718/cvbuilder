export interface CoverLetterData {
    id?: number;
    user_id?: number;
    resume_id?: number;
    template_id: number;
    name: string;
    email: string;
    phone?: string;
    address?: string;
    recipient_title?: string;
    recipient_company?: string;
    body: string;
    created_at?: string;
    updated_at?: string;
}

export interface CoverLetterCreateRequest {
    name: string;
    email: string;
    phone?: string;
    address?: string;
    recipient_title?: string;
    recipient_company?: string;
    body: string;
    template_id: number;
    resume_id?: number;
}

export interface CoverLetterGenerateRequest {
    job_title: string;
    job_description: string;
    company_name: string;
}

export interface CoverLetterGenerateResponse {
    body: string;
}

export interface CoverLetterTemplate {
    id: number;
    name: string;
    description: string;
    preview: string;
    isPremium: boolean;
}
