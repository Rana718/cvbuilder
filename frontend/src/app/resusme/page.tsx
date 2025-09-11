'use client';

import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '@/components/AuthContext';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Plus, Edit, Trash2, Search, MoreHorizontal, Share2, Calendar, User, Briefcase, FileText, Upload } from 'lucide-react';
import axiosInstance from '@/lib/axios';
import TemplateRenderer from '@/components/templates/TemplateRenderer';
import Navbar from '@/components/Navbar';

interface Resume {
    id: number;
    name: string;
    job_title: string;
    template_id: number;
    theme_color: string;
    created_at: string;
    updated_at: string;
    email?: string;
    phone?: string;
    city?: string;
    country?: string;
    summary?: string;
    skills?: any;
    experience?: any;
    education?: any;
    projects?: any;
    socail_links?: Array<{
        label: string;
        url: string;
        username?: string;
    }>;
}

interface DropdownMenuProps {
    resumeId: number;
    templateId: number;
    onEdit: () => void;
    onDelete: () => void;
    onShare: () => void;
}

const DropdownMenu: React.FC<DropdownMenuProps> = ({ resumeId, templateId, onEdit, onDelete, onShare }) => {
    const [isOpen, setIsOpen] = useState<boolean>(false);
    const dropdownRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const handleAction = (action: () => void) => {
        action();
        setIsOpen(false);
    };

    return (
        <div className="relative" ref={dropdownRef}>
            <button
                onClick={(e: React.MouseEvent) => {
                    e.preventDefault();
                    e.stopPropagation();
                    setIsOpen(!isOpen);
                }}
                className="p-2 text-gray-600 bg-white rounded-lg shadow-sm"
            >
                <MoreHorizontal className="w-4 h-4" />
            </button>

            {isOpen && (
                <div className="absolute right-0 top-full mt-1 w-40 bg-white rounded-lg shadow-lg border border-gray-200 py-1 z-10">
                    <button
                        onClick={(e: React.MouseEvent) => {
                            e.preventDefault();
                            e.stopPropagation();
                            handleAction(onShare);
                        }}
                        className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition-colors"
                    >
                        <Share2 className="w-4 h-4 mr-3" />
                        Share
                    </button>
                    <button
                        onClick={(e: React.MouseEvent) => {
                            e.preventDefault();
                            e.stopPropagation();
                            handleAction(onEdit);
                        }}
                        className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-green-50 hover:text-green-600 transition-colors"
                    >
                        <Edit className="w-4 h-4 mr-3" />
                        Edit
                    </button>
                    <button
                        onClick={(e: React.MouseEvent) => {
                            e.preventDefault();
                            e.stopPropagation();
                            handleAction(onDelete);
                        }}
                        className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-red-50 hover:text-red-600 transition-colors"
                    >
                        <Trash2 className="w-4 h-4 mr-3" />
                        Delete
                    </button>
                </div>
            )}
        </div>
    );
};

const ResumePage: React.FC = () => {
    const { user, loading: status } = useAuth();
    const router = useRouter();
    const [resumes, setResumes] = useState<Resume[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string>('');
    const [searchTerm, setSearchTerm] = useState<string>('');

    useEffect(() => {
        if (status) return;

        if (!user) {
            router.push('/sign-in?callbackUrl=' + encodeURIComponent('/resume'));
            return;
        }

        fetchResumes();
    }, [user, status, router]);

    const fetchResumes = async (): Promise<void> => {
        try {
            setLoading(true);
            const response = await axiosInstance.get('/api/resume-op/all');
            setResumes(response.data);
        } catch (error: any) {
            console.error('Failed to fetch resumes:', error);
            if (error.response?.status === 401) {
                router.push('/sign-in?callbackUrl=' + encodeURIComponent('/resume'));
            } else {
                setError('Failed to load resumes. Please try again.');
            }
        } finally {
            setLoading(false);
        }
    };

    const handleDeleteResume = async (resumeId: number): Promise<void> => {
        if (!confirm('Are you sure you want to delete this resume?')) return;

        try {
            await axiosInstance.delete(`/api/resume-op/${resumeId}`);
            setResumes(resumes.filter(resume => resume.id !== resumeId));
        } catch (error: any) {
            console.error('Failed to delete resume:', error);
            alert('Failed to delete resume. Please try again.');
        }
    };

    const handleShareResume = (resumeId: number, templateId: number): void => {
        const shareUrl = `${window.location.origin}/resume/${resumeId}?template=${templateId}`;
        if (navigator.share) {
            navigator.share({
                title: 'Resume',
                text: 'Check out my resume',
                url: shareUrl,
            }).catch(console.error);
        } else {
            navigator.clipboard.writeText(shareUrl).then(() => {
                alert('Link copied to clipboard!');
            }).catch(() => {
                alert(`Share this link: ${shareUrl}`);
            });
        }
    };

    const formatDate = (dateString: string): string => {
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        });
    };

    const convertToUserData = (resume: Resume) => ({
        name: resume.name || 'Your Name',
        email: resume.email || 'your.email@example.com',
        phone: resume.phone || '',
        address: [resume.city, resume.country].filter(Boolean).join(', ') || '',
        job_title: resume.job_title || 'Professional Title',
        summary: resume.summary || '',
        social_links: resume.socail_links || [],
        skills: resume.skills ? Object.values(resume.skills).map((skill: any) => ({
            name: skill.name || '',
            rating: skill.rating || 3
        })) : [],
        experience: resume.experience ? Object.values(resume.experience).map((exp: any) => ({
            title: exp.title || '',
            company: exp.company || '',
            duration: `${exp.start_date || ''} - ${exp.end_date || 'Present'}`,
            description: exp.description || ''
        })) : [],
        education: resume.education ? Object.values(resume.education).map((edu: any) => ({
            degree: edu.degree || '',
            institution: edu.institution || '',
            year: `${edu.start_date || ''} - ${edu.end_date || ''}`
        })) : [],
        projects: resume.projects ? Object.values(resume.projects).map((project: any) => ({
            name: project.name || '',
            description: project.description || '',
            url: project.url || '',
            github_url: project.github_url || ''
        })) : []
    });

    const filteredResumes = resumes.filter(resume =>
        resume.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        resume.job_title?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    if (status || (user && loading)) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
                    <p className="text-gray-700 font-medium">
                        {status ? 'Checking authentication...' : 'Loading your resumes...'}
                    </p>
                </div>
            </div>
        );
    }

    if (!status && !user) {
        return null;
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-100/50">
            {/* Enhanced Background Elements */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className="absolute top-20 left-10 w-96 h-96 bg-gradient-to-r from-blue-400/20 to-indigo-500/20 rounded-full mix-blend-multiply filter blur-3xl animate-pulse"></div>
                <div className="absolute top-40 right-10 w-80 h-80 bg-gradient-to-r from-purple-400/20 to-pink-500/20 rounded-full mix-blend-multiply filter blur-3xl animate-pulse delay-1000"></div>
                <div className="absolute bottom-20 left-1/2 w-72 h-72 bg-gradient-to-r from-emerald-400/20 to-teal-500/20 rounded-full mix-blend-multiply filter blur-3xl animate-pulse delay-2000"></div>
            </div>

            {/* Floating grid pattern */}
            {/* <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px] pointer-events-none"></div> */}

            <Navbar />

            <main className="relative max-w-7xl mx-auto px-2 sm:px-4 lg:px-8 py-4 sm:py-8">
                {/* Enhanced Header */}
                <motion.div
                    initial={{ y: 20, opacity: 0, scale: 0.9 }}
                    animate={{ y: 0, opacity: 1, scale: 1 }}
                    transition={{ duration: 0.6, delay: 0.2 }}
                    className="flex justify-center mb-4 sm:mb-6"
                >
                    <div className="relative">
                        <div className="absolute inset-0 bg-gradient-to-r from-blue-500/20 to-purple-500/20 blur-xl rounded-full"></div>
                        <div className="relative inline-flex items-center bg-white/90 backdrop-blur-sm border border-white/20 shadow-lg text-slate-700 px-3 sm:px-6 py-2 sm:py-3 rounded-full text-xs sm:text-sm font-medium">
                            <div className="w-2 h-2 bg-green-500 rounded-full mr-2 sm:mr-3 animate-pulse"></div>
                            <FileText className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2 text-blue-600" />
                            <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent font-semibold">
                                Resume Manager
                            </span>
                        </div>
                    </div>
                </motion.div>

                <div className="flex flex-col space-y-4 sm:space-y-0 sm:flex-row sm:items-center sm:justify-between mb-6 sm:mb-8">
                    <motion.div
                        initial={{ y: 30, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        transition={{ duration: 0.8, delay: 0.3 }}
                        className="mb-4 sm:mb-0"
                    >
                        <h1 className="text-2xl sm:text-3xl lg:text-4xl xl:text-5xl font-bold text-slate-900 mb-1 sm:mb-2">
                            Your
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 ml-2">
                                Resumes
                            </span>
                        </h1>
                        <p className="text-sm sm:text-base lg:text-lg text-slate-600 font-light">
                            Create and manage your professional resumes with our templates
                        </p>
                    </motion.div>

                    <motion.div
                        initial={{ y: 30, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        transition={{ duration: 0.8, delay: 0.5 }}
                        className="flex flex-col space-y-3 sm:space-y-0 sm:flex-row sm:items-center sm:space-x-4"
                    >
                        <div className="relative">
                            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-3 h-3 sm:w-4 sm:h-4 text-slate-400" />
                            <input
                                type="text"
                                placeholder="Search resumes..."
                                value={searchTerm}
                                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSearchTerm(e.target.value)}
                                className="pl-8 sm:pl-10 pr-3 sm:pr-4 py-2 sm:py-3 w-full sm:w-64 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all bg-white/80 backdrop-blur-sm shadow-sm text-sm"
                            />
                        </div>

                        <div className="flex items-center space-x-2">
                            <Link
                                href="/template"
                                className="group flex items-center justify-center space-x-2 px-4 sm:px-6 py-2 sm:py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl hover:from-blue-700 hover:to-purple-700 transition-all shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 font-medium text-sm"
                            >
                                <Plus className="w-3 h-3 sm:w-4 sm:h-4 group-hover:rotate-90 transition-transform duration-300" />
                                <span className="hidden sm:inline">Create New</span>
                                <span className="sm:hidden">Create</span>
                            </Link>
                            <Link
                                href="/resusme/parse"
                                className="group flex items-center justify-center space-x-2 px-4 sm:px-6 py-2 sm:py-3 bg-white/80 backdrop-blur-sm border border-slate-300 hover:border-blue-300 text-slate-700 hover:text-blue-700 rounded-xl transition-all shadow-sm hover:shadow-md font-medium text-sm"
                            >
                                <Upload className="w-3 h-3 sm:w-4 sm:h-4" />
                                <span className="hidden sm:inline">Import PDF</span>
                                <span className="sm:hidden">Import</span>
                            </Link>
                        </div>
                    </motion.div>
                </div>

                {error && (
                    <div className="mb-8 bg-red-50 border border-red-200 text-red-800 px-4 py-3 rounded-lg">
                        {error}
                    </div>
                )}

                {filteredResumes.length === 0 && searchTerm ? (
                    <div className="text-center py-12 sm:py-16">
                        <div className="w-12 h-12 sm:w-16 sm:h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-3 sm:mb-4">
                            <Search className="w-6 h-6 sm:w-8 sm:h-8 text-gray-400" />
                        </div>
                        <h3 className="text-base sm:text-lg font-medium text-gray-900 mb-2">No matching resumes</h3>
                        <p className="text-sm sm:text-base text-gray-600 mb-3 sm:mb-4 px-4">Try adjusting your search terms or create a new resume</p>
                        <button
                            onClick={() => setSearchTerm('')}
                            className="text-blue-600 hover:text-blue-700 font-medium text-sm sm:text-base"
                        >
                            Clear search
                        </button>
                    </div>
                ) : resumes.length === 0 ? (
                    <div className="text-center py-12 sm:py-20">
                        <div className="w-16 h-16 sm:w-24 sm:h-24 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4 sm:mb-6">
                            <User className="w-8 h-8 sm:w-12 sm:h-12 text-blue-600" />
                        </div>
                        <h3 className="text-lg sm:text-xl font-semibold text-gray-900 mb-2 sm:mb-3">Welcome to your resume dashboard</h3>
                        <p className="text-sm sm:text-base text-gray-600 mb-4 sm:mb-6 max-w-xs sm:max-w-md mx-auto px-4">
                            Start building your professional resume with our beautiful templates and AI-powered tools
                        </p>
                        <Link
                            href="/template"
                            className="inline-flex items-center px-4 sm:px-6 py-2 sm:py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium shadow-sm text-sm sm:text-base"
                        >
                            <Plus className="w-4 h-4 sm:w-5 sm:h-5 mr-2" />
                            Create Your First Resume
                        </Link>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                        {filteredResumes.map((resume, index) => (
                            <motion.div 
                                key={resume.id} 
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.3, delay: index * 0.05 }}
                                className="group cursor-pointer"
                            >
                                <Link href={`/resusme/${resume.id}?template=${resume.template_id}`} className="block">
                                    <div className="relative overflow-hidden hover:border-blue-300 transition-all duration-200">
                                        {/* Dropdown Menu */}
                                        <div className="absolute top-2 right-2 z-20">
                                            <DropdownMenu
                                                resumeId={resume.id}
                                                templateId={resume.template_id}
                                                onEdit={() => router.push(`/template/${resume.template_id}?resumeId=${resume.id}`)}
                                                onDelete={() => handleDeleteResume(resume.id)}
                                                onShare={() => handleShareResume(resume.id, resume.template_id)}
                                            />
                                        </div>

                                        {/* Resume Preview */}
                                        <div className="relative">
                                            <div className="aspect-[3/4] overflow-hidden ">
                                                <div className="w-full h-full flex items-center justify-center">
                                                    <div className="transform scale-[0.45] md:scale-[0.34] shadow-xl border border-gray-900">
                                                        <div className="w-[794px] h-[1123px]">
                                                            <TemplateRenderer
                                                                templateId={resume.template_id}
                                                                userData={convertToUserData(resume)}
                                                                size="normal"
                                                            />
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </Link>

                                {/* Resume Info - Outside card */}
                                <div className="text-center mt-3">
                                    <h3 className="font-medium text-gray-900 text-base mb-1 group-hover:text-blue-600 transition-colors line-clamp-1">
                                        {resume.name || 'Untitled Resume'}
                                    </h3>
                                    <p className="text-sm text-gray-500 mb-1">
                                        {resume.job_title || 'Position not specified'}
                                    </p>
                                    <div className="flex items-center justify-center text-xs text-gray-400">
                                        <Calendar className="w-3 h-3 mr-1" />
                                        <span>{formatDate(resume.updated_at)}</span>
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                )}
            </main>
        </div>
    );
};

export default ResumePage;