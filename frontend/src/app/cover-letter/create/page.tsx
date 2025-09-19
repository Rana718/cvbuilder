'use client';

import React, { useState, useRef, useEffect, Suspense } from 'react';
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
    X,
    Mail,
    Brain
} from 'lucide-react';
import { toast } from 'sonner';
import { motion, AnimatePresence } from 'framer-motion';
import Navbar from '@/components/Navbar';

interface AIGenerationPopupProps {
    isOpen: boolean;
    onClose: () => void;
    onGenerate: (resumeFile: File, jobDescription: string) => void;
    isLoading: boolean;
    jobTitle: string;
    companyName: string;
}

const FloatingIcon = ({ icon: Icon, delay, duration = 6 }: { icon: any, delay: number, duration?: number }) => (
    <motion.div
        className="absolute opacity-10 text-blue-200"
        initial={{ y: 0, x: 0, rotate: 0 }}
        animate={{
            y: [-20, 20, -20],
            x: [-10, 10, -10],
            rotate: [0, 10, -10, 0]
        }}
        transition={{
            duration,
            delay,
            repeat: Infinity,
            ease: "easeInOut"
        }}
    >
        <Icon className="w-8 h-8" />
    </motion.div>
);

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

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-white/20 backdrop-blur-md flex items-center justify-center z-[9999] p-4">
            <FloatingIcon icon={Sparkles} delay={0} />
            <FloatingIcon icon={FileText} delay={1} />
            <FloatingIcon icon={Wand2} delay={2} />

            <motion.div
                initial={{ opacity: 0, scale: 0.95, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: 20 }}
                className="bg-white/90 backdrop-blur-sm rounded-xl shadow-2xl w-full max-w-2xl max-h-[90vh] flex flex-col border border-white/50"
                onClick={(e: React.MouseEvent) => e.stopPropagation()}
            >
                <div className="flex justify-between items-center p-6 border-b border-gray-200/50 flex-shrink-0">
                    <div className="flex items-center">
                        <motion.div
                            className="p-2 bg-blue-100 rounded-full mr-3"
                            animate={{ rotate: [0, 10, -10, 0] }}
                            transition={{ duration: 4, repeat: Infinity }}
                        >
                            <Wand2 className="w-6 h-6 text-blue-600" />
                        </motion.div>
                        <h3 className="text-xl font-semibold text-gray-900">AI Cover Letter Generation</h3>
                    </div>
                    <button
                        onClick={onClose}
                        className="p-2 hover:bg-gray-100 rounded-sm transition-colors"
                    >
                        <X className="w-5 h-5 text-gray-500" />
                    </button>
                </div>

                <div className="flex-1 overflow-y-auto p-6">
                    <div className="space-y-6">
                        <div className="bg-blue-50 rounded-sm p-4 border border-blue-100">
                            <h4 className="font-medium text-gray-900 mb-2">Job Details</h4>
                            <div className="text-sm text-gray-700">
                                <p><span className="font-medium">Position:</span> {jobTitle}</p>
                                <p><span className="font-medium">Company:</span> {companyName}</p>
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-semibold text-gray-800 mb-2">
                                Upload Resume (PDF) *
                            </label>
                            <div
                                onClick={() => fileInputRef.current?.click()}
                                className="border-2 border-dashed border-blue-300 rounded-sm p-6 text-center cursor-pointer hover:border-blue-400 hover:bg-blue-50 transition-all"
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
                            <label className="block text-sm font-semibold text-gray-800 mb-2">
                                Job Description (Optional)
                            </label>
                            <textarea
                                value={jobDescription}
                                onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setJobDescription(e.target.value)}
                                rows={6}
                                className="w-full px-3 py-2 border border-gray-300 rounded-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none transition-all"
                                placeholder="Paste the job description here for better AI generation..."
                            />
                        </div>
                    </div>
                </div>

                <div className="flex justify-end space-x-3 p-6 border-t border-gray-200/50 flex-shrink-0">
                    <button
                        onClick={onClose}
                        disabled={isLoading}
                        className="px-6 py-2 text-gray-600 hover:text-gray-800 border border-gray-300 rounded-sm hover:bg-gray-100 transition-colors disabled:opacity-50"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={handleGenerate}
                        disabled={isLoading || !resumeFile}
                        className="px-6 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-sm hover:from-blue-700 hover:to-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center shadow-lg"
                    >
                        {isLoading ? (
                            <>
                                <Loader2 className="w-4 h-4 animate-spin mr-2" />
                                <span>Generating...</span>
                            </>
                        ) : (
                            <>
                                <Sparkles className="w-4 h-4 mr-2" />
                                <span>Generate Cover Letter</span>
                            </>
                        )}
                    </button>
                </div>
            </motion.div>
        </div>
    );
};

const CreateCoverLetterPage: React.FC = () => {
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
    } = useCoverLetterStore();

    const [showAIPopup, setShowAIPopup] = useState<boolean>(false);
    const [isLoadingAI, setIsLoadingAI] = useState<boolean>(false);

    const edit: string | null = searchParams.get('edit');
    const coverLetterId: string | null = searchParams.get('coverLetterId');

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

            const response = await axiosInstance.post('/api/public/cover-letter/generate', formDataToSend, {
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
        <div className="min-h-screen bg-slate-50">
            <Navbar />
            
            {/* Background Elements */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className="absolute top-20 left-10 w-96 h-96 bg-gradient-to-r from-blue-400/10 to-indigo-500/10 rounded-full mix-blend-multiply filter blur-3xl animate-pulse"></div>
                <div className="absolute top-40 right-10 w-80 h-80 bg-gradient-to-r from-purple-400/10 to-pink-500/10 rounded-full mix-blend-multiply filter blur-3xl animate-pulse delay-1000"></div>
                <div className="absolute bottom-20 left-1/2 w-72 h-72 bg-gradient-to-r from-emerald-400/10 to-teal-500/10 rounded-full mix-blend-multiply filter blur-3xl animate-pulse delay-2000"></div>
            </div>
            
            {/* Floating grid pattern */}
            <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808008_1px,transparent_1px),linear-gradient(to_bottom,#80808008_1px,transparent_1px)] bg-[size:24px_24px] pointer-events-none"></div>

            <div className="relative container mx-auto px-4 py-8">
                {/* AI Badge and Header */}
                <motion.div
                    initial={{ y: 20, opacity: 0, scale: 0.9 }}
                    animate={{ y: 0, opacity: 1, scale: 1 }}
                    transition={{ duration: 0.6, delay: 0.2 }}
                    className="flex justify-center mb-6"
                >
                    <div className="relative">
                        <div className="absolute inset-0 bg-gradient-to-r from-blue-500/20 to-purple-500/20 blur-xl rounded-full"></div>
                        <div className="relative inline-flex items-center bg-white/90 backdrop-blur-sm border border-white/20 shadow-lg text-slate-700 px-6 py-3 rounded-full text-sm font-medium">
                            <div className="w-2 h-2 bg-green-500 rounded-full mr-3 animate-pulse"></div>
                            <Mail className="h-4 w-4 mr-2 text-blue-600" />
                            <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent font-semibold">
                                AI Cover Letter Builder
                            </span>
                        </div>
                    </div>
                </motion.div>

                <motion.div
                    initial={{ y: 30, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ duration: 0.8, delay: 0.3 }}
                    className="text-center mb-8"
                >
                    <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-slate-900 mb-4 leading-tight">
                        Create Your
                        <span className="block text-transparent bg-clip-text bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 mt-2">
                            Perfect Cover Letter
                        </span>
                        <span className="block text-slate-700 text-2xl md:text-3xl lg:text-4xl font-medium mt-4">
                            Land Your Dream Job
                        </span>
                    </h1>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5 }}
                    className="max-w-4xl mx-auto"
                >
                    <div className="space-y-6">
                        {/* Personal Information Section */}
                        <motion.section
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ delay: 0.6 }}
                            className="bg-white/90 backdrop-blur-sm p-6 rounded-xl border border-white/50 shadow-lg"
                        >
                            <div className="flex items-center mb-6">
                                <User className="w-6 h-6 text-blue-600 mr-3" />
                                <h2 className="text-xl font-semibold text-gray-900">Personal Information</h2>
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div>
                                    <label htmlFor="name" className="block text-sm font-semibold text-gray-800 mb-2">
                                        Full Name *
                                    </label>
                                    <input
                                        id="name"
                                        type="text"
                                        value={name}
                                        onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleInputChange('name', e.target.value)}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                                        placeholder="Your full name"
                                        required
                                    />
                                </div>
                                <div>
                                    <label htmlFor="email" className="block text-sm font-semibold text-gray-800 mb-2">
                                        Email Address *
                                    </label>
                                    <input
                                        id="email"
                                        type="email"
                                        value={email}
                                        onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleInputChange('email', e.target.value)}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                                        placeholder="your.email@example.com"
                                        required
                                    />
                                </div>
                                <div>
                                    <label htmlFor="phone" className="block text-sm font-semibold text-gray-800 mb-2">
                                        Phone Number
                                    </label>
                                    <input
                                        id="phone"
                                        type="tel"
                                        value={phone || ''}
                                        onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleInputChange('phone', e.target.value)}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                                        placeholder="Your phone number"
                                    />
                                </div>
                                <div>
                                    <label htmlFor="address" className="block text-sm font-semibold text-gray-800 mb-2">
                                        Address
                                    </label>
                                    <input
                                        id="address"
                                        type="text"
                                        value={address || ''}
                                        onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleInputChange('address', e.target.value)}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                                        placeholder="Your address"
                                    />
                                </div>
                            </div>
                        </motion.section>

                        {/* Position Details Section */}
                        <motion.section
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.7 }}
                            className="bg-white/90 backdrop-blur-sm p-6 rounded-xl border border-white/50 shadow-lg"
                        >
                            <div className="flex items-center mb-6">
                                <Briefcase className="w-6 h-6 text-blue-600 mr-3" />
                                <h2 className="text-xl font-semibold text-gray-900">Position Details</h2>
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div>
                                    <label htmlFor="jobTitle" className="block text-sm font-semibold text-gray-800 mb-2">
                                        Job Title *
                                    </label>
                                    <input
                                        id="jobTitle"
                                        type="text"
                                        value={recipient_title || ''}
                                        onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleInputChange('recipient_title', e.target.value)}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                                        placeholder="e.g., Software Engineer"
                                        required
                                    />
                                </div>
                                <div>
                                    <label htmlFor="company" className="block text-sm font-semibold text-gray-800 mb-2">
                                        Company Name *
                                    </label>
                                    <input
                                        id="company"
                                        type="text"
                                        value={recipient_company || ''}
                                        onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleInputChange('recipient_company', e.target.value)}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                                        placeholder="e.g., Google Inc."
                                        required
                                    />
                                </div>
                            </div>
                        </motion.section>

                        {/* Cover Letter Content Section */}
                        <motion.section
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.8 }}
                            className="bg-white/90 backdrop-blur-sm p-6 rounded-xl border border-white/50 shadow-lg"
                        >
                            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6 gap-4">
                                <div className="flex items-center">
                                    <Type className="w-6 h-6 text-blue-600 mr-3" />
                                    <h2 className="text-xl font-semibold text-gray-900">Cover Letter Content *</h2>
                                </div>
                                <button
                                    onClick={() => setShowAIPopup(true)}
                                    disabled={isLoadingAI}
                                    className="flex items-center justify-center space-x-2 px-4 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-sm hover:from-blue-700 hover:to-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-lg hover:shadow-xl text-sm font-medium"
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

                        {/* Next Button */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.9 }}
                            className="flex justify-end pt-6"
                        >
                            <button
                                onClick={handleNext}
                                disabled={!isFormValid}
                                className="flex items-center space-x-2 px-8 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-sm hover:from-blue-700 hover:to-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed font-semibold shadow-lg hover:shadow-xl transition-all"
                            >
                                <span>Preview Cover Letter</span>
                                <ChevronRight className="w-5 h-5" />
                            </button>
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

const CreateCoverLetterPageWrapper: React.FC = () => {
    return (
        <Suspense fallback={
            <div className="min-h-screen bg-slate-50 flex items-center justify-center">
                <div className="animate-spin rounded-full h-8 w-8 border-2 border-blue-500 border-t-transparent"></div>
            </div>
        }>
            <CreateCoverLetterPage />
        </Suspense>
    );
};

export default CreateCoverLetterPageWrapper;
