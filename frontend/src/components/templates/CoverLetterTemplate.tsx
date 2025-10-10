'use client';

import React from 'react';
import { CoverLetterData } from '@/types/coverletter';
import Watermark from '@/components/ui/Watermark';

interface CoverLetterTemplateProps {
    data: CoverLetterData;
    isPreview?: boolean;
    isPremium?: boolean;
    size?: 'normal' | 'small';
    hideWatermark?: boolean;
}

const CoverLetterTemplate: React.FC<CoverLetterTemplateProps> = ({
    data,
    isPreview = false,
    isPremium = false,
    size = 'normal',
    hideWatermark = false
}) => {
    const isSmall = size === 'small';
    const showWatermark = !hideWatermark && !isPremium && isPreview;

    return (
        <div className={`
      cover-letter-template relative bg-white shadow-lg mx-auto
      ${isSmall ? 'w-[280px] sm:w-[320px] md:w-[420px] h-[396px] sm:h-[452px] md:h-[594px] text-xs' : 'w-full max-w-[210mm] h-auto min-h-[297mm] text-sm'}
      ${isSmall ? 'scale-90 sm:scale-75 md:scale-50 origin-top' : ''}
      print:shadow-none print:w-[210mm] print:h-[297mm] print:text-sm
    `}>
            {/* Watermark for non-premium users */}
            {showWatermark && (
                <Watermark text="AI CV Builder - Premium Required" opacity={0.15} />
            )}

            <div className={`h-full ${isSmall ? 'p-4 sm:p-6' : 'p-8 sm:p-12'} flex flex-col`}>
                {/* Header Section */}
                <div className="text-center mb-6 sm:mb-8">
                    <h1 className={`${isSmall ? 'text-lg sm:text-xl' : 'text-xl sm:text-2xl'} font-bold text-gray-900 mb-2`}>
                        {data.name || 'Your Name'}
                    </h1>
                    <div className={`${isSmall ? 'text-xs' : 'text-sm'} text-gray-600 space-y-1`}>
                        {data.email && <div className="break-all">{data.email}</div>}
                        {data.phone && <div>{data.phone}</div>}
                    </div>
                </div>

                {/* Date and Recipient */}
                <div className={`mb-4 sm:mb-6 ${isSmall ? 'text-xs' : 'text-sm'} text-gray-700`}>
                    <div className="mb-3 sm:mb-4">
                        {new Date().toLocaleDateString('en-US', {
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric'
                        })}
                    </div>

                    {(data.recipient_title || data.recipient_company) && (
                        <div className="space-y-1">
                            {data.recipient_title && <div>{data.recipient_title}</div>}
                            {data.recipient_company && <div>{data.recipient_company}</div>}
                        </div>
                    )}
                </div>

                {/* Divider Line */}
                <div className="w-full h-px bg-gradient-to-r from-blue-500 to-indigo-500 mb-4 sm:mb-6"></div>

                {/* Body */}
                <div className={`flex-1 ${isSmall ? 'text-xs' : 'text-sm'} text-gray-800 leading-relaxed`}>
                    {data.body ? (
                        <div
                            dangerouslySetInnerHTML={{ __html: data.body }}
                            className="prose prose-sm max-w-none prose-p:mb-4"
                        />
                    ) : (
                        <div className="text-gray-400 italic">
                            Your cover letter content will appear here...
                        </div>
                    )}
                </div>

                {/* Closing */}
                <div className={`mt-6 ${isSmall ? 'text-xs' : 'text-sm'} text-gray-700`}>
                    <div className="mb-4 sm:mb-6">
                        <div className="mb-1">Sincerely,</div>
                        <div className="font-medium">{data.name || 'Your Name'}</div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CoverLetterTemplate;