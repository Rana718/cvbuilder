'use client';

import React from 'react';
import { COVER_LETTER_TEMPLATES } from '@/constants/coverLetterTemplates';
import { CoverLetterTemplate } from '@/types/coverletter';
import { Crown, Check } from 'lucide-react';

interface CoverLetterTemplateSelectorProps {
    selectedTemplateId: number;
    onTemplateSelect: (templateId: number) => void;
    userIsPremium?: boolean;
}

const CoverLetterTemplateSelector: React.FC<CoverLetterTemplateSelectorProps> = ({
    selectedTemplateId,
    onTemplateSelect,
    userIsPremium = false
}) => {
    const handleTemplateClick = (template: CoverLetterTemplate) => {
        if (template.isPremium && !userIsPremium) {
            return;
        }
        onTemplateSelect(template.id);
    };

    return (
        <div className="space-y-6">
            <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Choose Template</h3>
                <p className="text-gray-600 text-sm">Select a professional cover letter template</p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {COVER_LETTER_TEMPLATES.map((template) => {
                    const isSelected = selectedTemplateId === template.id;
                    const isLocked = template.isPremium && !userIsPremium;

                    return (
                        <div
                            key={template.id}
                            className={`
                relative border-2 rounded-xl p-3 sm:p-4 cursor-pointer transition-all duration-200
                ${isSelected
                                    ? 'border-blue-500 bg-blue-50 shadow-md'
                                    : 'border-gray-200 hover:border-gray-300 hover:shadow-sm'
                                }
                ${isLocked ? 'opacity-60' : ''}
              `}
                            onClick={() => handleTemplateClick(template)}
                        >
                            {/* Premium Badge */}
                            {template.isPremium && (
                                <div className="absolute top-2 right-2 z-10">
                                    <div className="flex items-center bg-gradient-to-r from-yellow-400 to-orange-500 text-white px-2 py-1 rounded-full text-xs font-medium">
                                        <Crown className="w-3 h-3 mr-1" />
                                        Pro
                                    </div>
                                </div>
                            )}

                            {/* Selected Indicator */}
                            {isSelected && (
                                <div className="absolute top-2 left-2 z-10">
                                    <div className="bg-blue-500 text-white rounded-full p-1">
                                        <Check className="w-3 h-3" />
                                    </div>
                                </div>
                            )}

                            {/* Template Preview */}
                            <div className="relative mb-3 sm:mb-4">
                                <div className="w-full h-24 sm:h-32 bg-gray-100 rounded-lg flex items-center justify-center border">
                                    <div className="text-center">
                                        <div className="text-xl sm:text-2xl mb-1 sm:mb-2">📄</div>
                                        <div className="text-xs text-gray-500">Preview</div>
                                    </div>
                                </div>

                                {isLocked && (
                                    <div className="absolute inset-0 bg-black bg-opacity-20 rounded-lg flex items-center justify-center">
                                        <div className="bg-white rounded-full p-2">
                                            <Crown className="w-6 h-6 text-yellow-500" />
                                        </div>
                                    </div>
                                )}
                            </div>

                            {/* Template Info */}
                            <div>
                                <h4 className="font-medium text-gray-900 mb-1 text-sm sm:text-base">{template.name}</h4>
                                <p className="text-gray-600 text-xs sm:text-sm">{template.description}</p>
                            </div>

                            {/* Upgrade prompt for locked templates */}
                            {isLocked && (
                                <div className="mt-2 sm:mt-3 text-center">
                                    <button className="text-blue-600 text-xs sm:text-sm font-medium hover:text-blue-700">
                                        Upgrade to Premium
                                    </button>
                                </div>
                            )}
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

export default CoverLetterTemplateSelector;
