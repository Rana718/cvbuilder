'use client';

import React from 'react';
import { CoverLetterData } from '@/types/coverletter';
import CoverLetterTemplate from '@/components/templates/CoverLetterTemplate';
import { usePremiumStatus } from '@/hooks/usePremiumStatus';

interface CoverLetterPreviewProps {
    data: CoverLetterData;
    size?: 'normal' | 'small';
    className?: string;
}

const CoverLetterPreview: React.FC<CoverLetterPreviewProps> = ({
    data,
    size = 'normal',
    className = ''
}) => {
    const { isPremium } = usePremiumStatus();
    
    return (
        <div className={`cover-letter-preview ${className}`}>
            <CoverLetterTemplate
                data={data}
                isPreview={true}
                isPremium={isPremium}
                size={size}
            />
        </div>
    );
};

export default CoverLetterPreview;
