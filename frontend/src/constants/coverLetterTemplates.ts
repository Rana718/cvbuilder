import { CoverLetterTemplate } from '@/types/coverletter';

export const COVER_LETTER_TEMPLATES: CoverLetterTemplate[] = [
    {
        id: 1,
        name: 'Professional Classic',
        description: 'A clean, traditional cover letter format perfect for corporate positions',
        preview: '/templates/cover-letter-classic.jpg',
        isPremium: false,
    }
];

export const getTemplateById = (id: number): CoverLetterTemplate | undefined => {
    return COVER_LETTER_TEMPLATES.find(template => template.id === id);
};
