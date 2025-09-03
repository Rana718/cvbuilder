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
    Building,
    Briefcase,
    Type,
    Sparkles,
    ChevronRight,
    Loader2,
    X,
    ChevronDown
} from 'lucide-react';
import { toast } from 'sonner';
import { motion, AnimatePresence } from 'framer-motion';

// AI Generation Popup Component
const AIGenerationPopup = ({
    isOpen,
    onClose,
    onGenerate,
    isLoading,
    jobTitle,
    companyName
}: {
    isOpen: boolean;
    onClose: () => void;
    onGenerate: (resumeFile: File, jobDescription: string) => void;
    isLoading: boolean;
    jobTitle: string;
    companyName: string;
}) => {
    const [resumeFile, setResumeFile] = useState<File | null>(null);
    const [jobDescription, setJobDescription] = useState('');
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file && file.type === 'application/pdf') {
            setResumeFile(file);
            toast.success('Resume uploaded successfully!');
        } else {
            toast.error('Please upload a PDF file');
        }
    };

    const handleGenerate = () => {
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
                    className="fixed inset-0 bg-white bg-opacity-80 backdrop-blur-sm flex items-center justify-center z-[999] p-4"
                    onClick={onClose}
                >
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.95 }}
                        className="bg-white rounded-xl p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl border border-gray-200"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <div className="flex justify-between items-center mb-6">
                            <div className="flex items-center">
                                <Wand2 className="w-6 h-6 text-purple-600 mr-3" />
                                <h3 className="text-xl font-semibold text-gray-900">AI Cover Letter Generation</h3>
                            </div>
                            <button
                                onClick={onClose}
                                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                            >
                                <X className="w-5 h-5 text-gray-500" />
                            </button>
                        </div>

                        <div className="space-y-6">
                            {/* Job Details Preview */}
                            <div className="bg-blue-50 rounded-lg p-4">
                                <h4 className="font-medium text-gray-900 mb-2">Job Details</h4>
                                <div className="text-sm text-gray-700">
                                    <p><span className="font-medium">Position:</span> {jobTitle}</p>
                                    <p><span className="font-medium">Company:</span> {companyName}</p>
                                </div>
                            </div>

                            {/* Resume Upload */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Upload Resume (PDF) *
                                </label>
                                <div
                                    onClick={() => fileInputRef.current?.click()}
                                    className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center cursor-pointer hover:border-purple-400 transition-colors"
                                >
                                    <Upload className="w-8 h-8 text-gray-400 mx-auto mb-2" />
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

                            {/* Job Description */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Job Description (Optional)
                                </label>
                                <textarea
                                    value={jobDescription}
                                    onChange={(e) => setJobDescription(e.target.value)}
                                    rows={6}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent resize-none"
                                    placeholder="Paste the job description here for better AI generation..."
                                />
                            </div>

                            {/* Action Buttons */}
                            <div className="flex justify-end space-x-3">
                                <button
                                    onClick={onClose}
                                    disabled={isLoading}
                                    className="px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={handleGenerate}
                                    disabled={isLoading || !resumeFile}
                                    className="px-6 py-2 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-lg hover:from-purple-700 hover:to-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center"
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

export default function CreateCoverLetterPage() {
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
    const [showAIPopup, setShowAIPopup] = useState(false);
    const [isLoadingAI, setIsLoadingAI] = useState(false);

    const edit = searchParams.get('edit');
    const coverLetterId = searchParams.get('coverLetterId');

    // Clear store when creating new cover letter (not editing)
    useEffect(() => {
        if (!coverLetterId && !edit) {
            clearForNew();
        }
    }, [coverLetterId, edit, clearForNew]);

    // Load existing cover letter data if coverLetterId is provided
    useEffect(() => {
        if (coverLetterId) {
            const fetchCoverLetterData = async () => {
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

    const handleInputChange = (field: string, value: string) => {
        setFormData({ [field]: value });
    };

    const handleAIGeneration = async (resumeFile: File, jobDescription: string) => {
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

    const handleNext = async () => {
        if (!name || !email || !recipient_title || !recipient_company || !body) {
            toast.error('Please fill in all required fields (name, email, job title, company, and content)');
            return;
        }

        // Save to temporary storage and redirect
        const tempId = Date.now().toString();
        await saveToTemp(tempId);
        router.push(`/cover-letter/temp-${tempId}`);
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="max-w-4xl mx-auto"
                >
                    {/* Header */}
                    <div className="text-center mb-8">
                        <motion.div
                            animate={{ rotate: [0, 5, -5, 0] }}
                            transition={{ duration: 2, repeat: Infinity, repeatDelay: 3 }}
                            className="w-16 h-16 mx-auto mb-4 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl flex items-center justify-center shadow-lg"
                        >
                            <FileText className="w-8 h-8 text-white" />
                        </motion.div>
                        <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent mb-3">
                            {edit ? 'Edit Cover Letter' : 'Create Cover Letter'}
                        </h1>
                        <p className="text-gray-600 text-lg">
                            Build your professional cover letter and land your dream job.
                        </p>
                    </div>

                    <div className="space-y-8">
                        {/* Personal Information */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.1 }}
                            className="bg-white rounded-xl p-6 shadow-lg border border-gray-100"
                        >
                            <div className="flex items-center mb-6">
                                <User className="w-6 h-6 text-blue-600 mr-3" />
                                <h3 className="text-lg font-semibold text-gray-900">Personal Information</h3>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Full Name *
                                    </label>
                                    <input
                                        type="text"
                                        value={name}
                                        onChange={(e) => handleInputChange('name', e.target.value)}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                        placeholder="Your full name"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Email Address *
                                    </label>
                                    <input
                                        type="email"
                                        value={email}
                                        onChange={(e) => handleInputChange('email', e.target.value)}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                        placeholder="your.email@example.com"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Phone Number
                                    </label>
                                    <input
                                        type="tel"
                                        value={phone || ''}
                                        onChange={(e) => handleInputChange('phone', e.target.value)}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                        placeholder="Your phone number"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Your Address
                                    </label>
                                    <input
                                        type="text"
                                        value={address || ''}
                                        onChange={(e) => handleInputChange('address', e.target.value)}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                        placeholder="Your address"
                                    />
                                </div>
                            </div>
                        </motion.div>

                        {/* Job Information */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.2 }}
                            className="bg-white rounded-xl p-6 shadow-lg border border-gray-100"
                        >
                            <div className="flex items-center mb-6">
                                <Briefcase className="w-6 h-6 text-green-600 mr-3" />
                                <h3 className="text-lg font-semibold text-gray-900">Job Information</h3>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Job Title *
                                    </label>
                                    <input
                                        type="text"
                                        value={recipient_title || ''}
                                        onChange={(e) => handleInputChange('recipient_title', e.target.value)}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                                        placeholder="e.g., Software Engineer"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Company Name *
                                    </label>
                                    <input
                                        type="text"
                                        value={recipient_company || ''}
                                        onChange={(e) => handleInputChange('recipient_company', e.target.value)}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                                        placeholder="e.g., Google"
                                    />
                                </div>
                            </div>

                        </motion.div>

                        {/* Cover Letter Content */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.3 }}
                            className="bg-white rounded-xl p-6 shadow-lg border border-gray-100"
                        >
                            <div className="flex items-center justify-between mb-6">
                                <div className="flex items-center">
                                    <Type className="w-6 h-6 text-purple-600 mr-3" />
                                    <h3 className="text-lg font-semibold text-gray-900">Cover Letter Content *</h3>
                                </div>
                                <button
                                    onClick={() => setShowAIPopup(true)}
                                    disabled={isLoadingAI}
                                    className="flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-purple-600 to-blue-600 text-white text-sm rounded-lg hover:from-purple-700 hover:to-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
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
                                onChange={(value) => handleInputChange('body', value)}
                                placeholder="Write your cover letter content here. You can use the AI generation button above to get started, or write your own compelling story about why you're the perfect fit for this position..."
                                height="300px"
                            />
                        </motion.div>

                        {/* Next Button */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.4 }}
                            className="flex justify-end pt-6"
                        >
                            <motion.button
                                whileHover={{ scale: 1.02, x: 5 }}
                                whileTap={{ scale: 0.98 }}
                                onClick={handleNext}
                                disabled={!name || !email || !recipient_title || !recipient_company || !body}
                                className="flex items-center space-x-2 px-8 py-3 bg-gradient-to-r from-blue-500 to-indigo-600 text-white rounded-lg hover:from-blue-600 hover:to-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed font-medium shadow-md transition-all"
                            >
                                <span>Next: Preview Cover Letter</span>
                                <ChevronRight className="w-4 h-4" />
                            </motion.button>
                        </motion.div>
                    </div>
                </motion.div>
            </div>

            {/* AI Generation Popup */}
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
}