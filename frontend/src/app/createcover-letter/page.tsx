'use client';

import React, { useState, useRef, useEffect } from 'react';
import { useParams, useSearchParams, useRouter } from 'next/navigation';
import { useCoverLetterStore } from '@/store/coverLetterStore';
import SimpleRichTextEditor from '@/components/ui/SimpleRichTextEditor';
import axiosInstance from '@/lib/axios';
import {
    Upload,
    Wand2,
    FileText,
    User,
    Briefcase,
    Type,
    Sparkles,
    ChevronRight,
    Loader2,
    X
} from 'lucide-react';
import { toast } from 'sonner';
import { motion, AnimatePresence } from 'framer-motion';

interface AIGenerationPopupProps {
    isOpen: boolean;
    onClose: () => void;
    onGenerate: (resumeFile: File, jobDescription: string) => void;
    isLoading: boolean;
    jobTitle: string;
    companyName: string;
}

const AIGenerationPopup: React.FC<AIGenerationPopupProps> = ({
    isOpen,
    onClose,
    onGenerate,
    isLoading,
    jobTitle,
    companyName
}) => {
    const [resumeFile, setResumeFile] = useState<File | null>(null);
    const [jobDescription, setJobDescription] = useState<string>('');
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>): void => {
        const file = event.target.files?.[0];
        if (file && file.type === 'application/pdf') {
            setResumeFile(file);
            toast.success('Resume uploaded successfully!');
        } else {
            toast.error('Please upload a PDF file');
        }
    };

    const handleGenerate = (): void => {
        if (!resumeFile) {
            toast.error('Please upload your resume first');
            return;
        }
        onGenerate(resumeFile, jobDescription);
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="fixed inset-0 bg-white bg-opacity-90 backdrop-blur-sm flex items-center justify-center z-[999] p-4"
                    onClick={onClose}
                >
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.95 }}
                        className="bg-white rounded-lg p-8 max-w-2xl w-full max-h-[90vh] overflow-y-auto border border-blue-200"
                        onClick={(e: React.MouseEvent) => e.stopPropagation()}
                    >
                        <div className="flex justify-between items-center mb-8">
                            <div className="flex items-center">
                                <Wand2 className="w-6 h-6 text-blue-600 mr-3" />
                                <h3 className="text-xl font-semibold text-gray-900">AI Cover Letter Generation</h3>
                            </div>
                            <button
                                onClick={onClose}
                                className="p-2 hover:bg-gray-50 rounded-lg transition-colors"
                            >
                                <X className="w-5 h-5 text-gray-500" />
                            </button>
                        </div>

                        <div className="space-y-6">
                            <div className="bg-blue-50 rounded-lg p-4 border border-blue-100">
                                <h4 className="font-medium text-gray-900 mb-2">Job Details</h4>
                                <div className="text-sm text-gray-700">
                                    <p><span className="font-medium">Position:</span> {jobTitle}</p>
                                    <p><span className="font-medium">Company:</span> {companyName}</p>
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Upload Resume (PDF) *
                                </label>
                                <div
                                    onClick={() => fileInputRef.current?.click()}
                                    className="border-2 border-dashed border-blue-300 rounded-lg p-6 text-center cursor-pointer hover:border-blue-400 hover:bg-blue-50 transition-all"
                                >
                                    <Upload className="w-8 h-8 text-blue-400 mx-auto mb-2" />
                                    <p className="text-sm text-gray-600">
                                        {resumeFile ? resumeFile.name : 'Click to upload your resume'}
                                    </p>
                                </div>
                                <input
                                    ref={fileInputRef}
                                    type="file"
                                    accept=".pdf"
                                    onChange={handleFileUpload}
                                    className="hidden"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Job Description (Optional)
                                </label>
                                <textarea
                                    value={jobDescription}
                                    onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setJobDescription(e.target.value)}
                                    rows={6}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none"
                                    placeholder="Paste the job description here for better AI generation..."
                                />
                            </div>

                            <div className="flex justify-end space-x-3 pt-4">
                                <button
                                    onClick={onClose}
                                    disabled={isLoading}
                                    className="px-6 py-2 text-gray-600 hover:text-gray-800 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={handleGenerate}
                                    disabled={isLoading || !resumeFile}
                                    className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center"
                                >
                                    {isLoading ? (
                                        <>
                                            <Loader2 className="w-4 h-4 animate-spin mr-2" />
                                            Generating...
                                        </>
                                    ) : (
                                        <>
                                            <Sparkles className="w-4 h-4 mr-2" />
                                            Generate Cover Letter
                                        </>
                                    )}
                                </button>
                            </div>
                        </div>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
};

const CreateCoverLetterPage: React.FC = () => {
    const params = useParams();
    const searchParams = useSearchParams();
    const router = useRouter();

    const {
        name,
        email,
        phone,
        address,
        recipient_title,
        recipient_company,
        body,
        populateFromCoverLetterData,
        saveToTemp,
        setFormData,
        clearForNew
    } = useCoverLetterStore();
    
    const [showAIPopup, setShowAIPopup] = useState<boolean>(false);
    const [isLoadingAI, setIsLoadingAI] = useState<boolean>(false);

    const edit: string | null = searchParams.get('edit');
    const coverLetterId: string | null = searchParams.get('coverLetterId');

    useEffect(() => {
        if (!coverLetterId && !edit) {
            clearForNew();
        }
    }, [coverLetterId, edit, clearForNew]);

    useEffect(() => {
        if (coverLetterId) {
            const fetchCoverLetterData = async (): Promise<void> => {
                try {
                    const response = await axiosInstance.get(`/api/cover-letters/${coverLetterId}`);
                    populateFromCoverLetterData(response.data);
                } catch (error) {
                    console.error('Failed to fetch cover letter data:', error);
                    toast.error('Failed to load cover letter data. Starting with a blank cover letter.');
                }
            };
            fetchCoverLetterData();
        }
    }, [coverLetterId, populateFromCoverLetterData]);

    const handleInputChange = (field: string, value: string): void => {
        setFormData({ [field]: value });
    };

    const handleAIGeneration = async (resumeFile: File, jobDescription: string): Promise<void> => {
        if (!recipient_title || !recipient_company) {
            toast.error('Please fill in job title and company name first');
            return;
        }

        setIsLoadingAI(true);
        try {
            const formDataToSend = new FormData();
            formDataToSend.append('resume_file', resumeFile);
            formDataToSend.append('job_title', recipient_title);
            formDataToSend.append('job_description', jobDescription);
            formDataToSend.append('company_name', recipient_company);

            const response = await axiosInstance.post('/api/public/cover-letters/generate', formDataToSend, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });

            if (response.data?.body) {
                setFormData({ body: response.data.body });
                toast.success('Cover letter generated successfully!');
                setShowAIPopup(false);
            }
        } catch (error) {
            console.error('Error generating cover letter:', error);
            toast.error('Failed to generate cover letter');
        } finally {
            setIsLoadingAI(false);
        }
    };

    const handleNext = async (): Promise<void> => {
        if (!name || !email || !recipient_title || !recipient_company || !body) {
            toast.error('Please fill in all required fields (name, email, job title, company, and content)');
            return;
        }

        const tempId: string = Date.now().toString();
        await saveToTemp(tempId);
        router.push(`/cover-letter/temp-${tempId}`);
    };

    const isFormValid: boolean = !!(name && email && recipient_title && recipient_company && body);

    return (
        <div className="min-h-screen bg-gray-50">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="max-w-4xl mx-auto"
                >
                    <div className="text-center mb-12">
                        <div className="w-16 h-16 mx-auto mb-6 bg-blue-600 rounded-full flex items-center justify-center">
                            <FileText className="w-8 h-8 text-white" />
                        </div>
                        <h1 className="text-3xl font-bold text-gray-900 mb-4">
                            {edit ? 'Edit Cover Letter' : 'Create Professional Cover Letter'}
                        </h1>
                        <p className="text-gray-600 text-lg max-w-2xl mx-auto">
                            Build a compelling cover letter that showcases your qualifications and helps you stand out to employers.
                        </p>
                    </div>

                    <div className="space-y-10">
                        <motion.section
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.1 }}
                            className="bg-white border-l-4 border-blue-500 p-8"
                        >
                            <div className="flex items-center mb-6">
                                <User className="w-6 h-6 text-blue-600 mr-3" />
                                <h2 className="text-xl font-semibold text-gray-900">Personal Information</h2>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                                        Full Name *
                                    </label>
                                    <input
                                        id="name"
                                        type="text"
                                        value={name}
                                        onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleInputChange('name', e.target.value)}
                                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                                        placeholder="Your full name"
                                        required
                                    />
                                </div>
                                <div>
                                    <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                                        Email Address *
                                    </label>
                                    <input
                                        id="email"
                                        type="email"
                                        value={email}
                                        onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleInputChange('email', e.target.value)}
                                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                                        placeholder="your.email@example.com"
                                        required
                                    />
                                </div>
                                <div>
                                    <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-2">
                                        Phone Number
                                    </label>
                                    <input
                                        id="phone"
                                        type="tel"
                                        value={phone || ''}
                                        onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleInputChange('phone', e.target.value)}
                                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                                        placeholder="Your phone number"
                                    />
                                </div>
                                <div>
                                    <label htmlFor="address" className="block text-sm font-medium text-gray-700 mb-2">
                                        Address
                                    </label>
                                    <input
                                        id="address"
                                        type="text"
                                        value={address || ''}
                                        onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleInputChange('address', e.target.value)}
                                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                                        placeholder="Your address"
                                    />
                                </div>
                            </div>
                        </motion.section>

                        <motion.section
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.2 }}
                            className="bg-white border-l-4 border-blue-500 p-8"
                        >
                            <div className="flex items-center mb-6">
                                <Briefcase className="w-6 h-6 text-blue-600 mr-3" />
                                <h2 className="text-xl font-semibold text-gray-900">Position Details</h2>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <label htmlFor="jobTitle" className="block text-sm font-medium text-gray-700 mb-2">
                                        Job Title *
                                    </label>
                                    <input
                                        id="jobTitle"
                                        type="text"
                                        value={recipient_title || ''}
                                        onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleInputChange('recipient_title', e.target.value)}
                                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                                        placeholder="e.g., Software Engineer"
                                        required
                                    />
                                </div>
                                <div>
                                    <label htmlFor="company" className="block text-sm font-medium text-gray-700 mb-2">
                                        Company Name *
                                    </label>
                                    <input
                                        id="company"
                                        type="text"
                                        value={recipient_company || ''}
                                        onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleInputChange('recipient_company', e.target.value)}
                                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                                        placeholder="e.g., Google Inc."
                                        required
                                    />
                                </div>
                            </div>
                        </motion.section>

                        <motion.section
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.3 }}
                            className="bg-white border-l-4 border-blue-500 p-8"
                        >
                            <div className="flex items-center justify-between mb-6">
                                <div className="flex items-center">
                                    <Type className="w-6 h-6 text-blue-600 mr-3" />
                                    <h2 className="text-xl font-semibold text-gray-900">Cover Letter Content *</h2>
                                </div>
                                <button
                                    onClick={() => setShowAIPopup(true)}
                                    disabled={isLoadingAI}
                                    className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                                >
                                    {isLoadingAI ? (
                                        <>
                                            <Loader2 className="w-4 h-4 animate-spin" />
                                            <span>Generating...</span>
                                        </>
                                    ) : (
                                        <>
                                            <Wand2 className="w-4 h-4" />
                                            <span>AI Generate</span>
                                        </>
                                    )}
                                </button>
                            </div>

                            <SimpleRichTextEditor
                                value={body}
                                onChange={(value: string) => handleInputChange('body', value)}
                                placeholder="Write your cover letter content here. Use the AI generation button above to get started, or craft your own compelling narrative about why you're the ideal candidate for this position..."
                                height="350px"
                            />
                        </motion.section>

                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.4 }}
                            className="flex justify-end pt-8"
                        >
                            <motion.button
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                                onClick={handleNext}
                                disabled={!isFormValid}
                                className="flex items-center space-x-2 px-8 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed font-medium transition-all"
                            >
                                <span>Preview Cover Letter</span>
                                <ChevronRight className="w-4 h-4" />
                            </motion.button>
                        </motion.div>
                    </div>
                </motion.div>
            </div>

            <AIGenerationPopup
                isOpen={showAIPopup}
                onClose={() => setShowAIPopup(false)}
                onGenerate={handleAIGeneration}
                isLoading={isLoadingAI}
                jobTitle={recipient_title || ''}
                companyName={recipient_company || ''}
            />
        </div>
    );
};

export default CreateCoverLetterPage;