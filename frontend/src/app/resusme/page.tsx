'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useAuth } from '@/components/AuthContext';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Plus, Edit, Trash2, Search, MoreHorizontal, Share2, Calendar, User, Briefcase } from 'lucide-react';
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
                className="p-2 text-gray-400 hover:text-gray-600 hover:bg-white rounded-lg transition-all shadow-sm"
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
        })) : [],
        linkedin_url: '',
        github_url: '',
        portfolio_url: ''
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
        <div className="min-h-screen bg-gray-50">
            <Navbar />

            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-8">
                    <div className="mb-4 sm:mb-0">
                        <h1 className="text-2xl font-bold text-gray-900">Resumes</h1>
                        <p className="text-gray-600 mt-1">
                            Create and manage your professional resumes with our templates
                        </p>
                    </div>

                    <div className="flex items-center space-x-4">
                        <div className="relative">
                            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                            <input
                                type="text"
                                placeholder="Search resumes..."
                                value={searchTerm}
                                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSearchTerm(e.target.value)}
                                className="pl-10 pr-4 py-2 w-64 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                            />
                        </div>

                        <Link
                            href="/template"
                            className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all shadow-sm"
                        >
                            <Plus className="w-4 h-4" />
                            <span>Create New</span>
                        </Link>
                    </div>
                </div>

                {error && (
                    <div className="mb-8 bg-red-50 border border-red-200 text-red-800 px-4 py-3 rounded-lg">
                        {error}
                    </div>
                )}

                {filteredResumes.length === 0 && searchTerm ? (
                    <div className="text-center py-16">
                        <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                            <Search className="w-8 h-8 text-gray-400" />
                        </div>
                        <h3 className="text-lg font-medium text-gray-900 mb-2">No matching resumes</h3>
                        <p className="text-gray-600 mb-4">Try adjusting your search terms or create a new resume</p>
                        <button
                            onClick={() => setSearchTerm('')}
                            className="text-blue-600 hover:text-blue-700 font-medium"
                        >
                            Clear search
                        </button>
                    </div>
                ) : resumes.length === 0 ? (
                    <div className="text-center py-20">
                        <div className="w-24 h-24 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-6">
                            <User className="w-12 h-12 text-blue-600" />
                        </div>
                        <h3 className="text-xl font-semibold text-gray-900 mb-3">Welcome to your resume dashboard</h3>
                        <p className="text-gray-600 mb-6 max-w-md mx-auto">
                            Start building your professional resume with our beautiful templates and AI-powered tools
                        </p>
                        <Link
                            href="/template"
                            className="inline-flex items-center px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium shadow-sm"
                        >
                            <Plus className="w-5 h-5 mr-2" />
                            Create Your First Resume
                        </Link>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                        {filteredResumes.map((resume) => (
                            <div key={resume.id} className="group relative">
                                <Link href={`/resume/${resume.id}?template=${resume.template_id}`} className="block">
                                    <div className="bg-white rounded-lg border border-gray-200 hover:border-blue-300 hover:shadow-lg transition-all duration-200 overflow-hidden">
                                        <div className="aspect-[3/4] bg-gray-50 border-b border-gray-100 p-3 relative">
                                            <div className="absolute top-3 right-3 z-10">
                                                <DropdownMenu
                                                    resumeId={resume.id}
                                                    templateId={resume.template_id}
                                                    onEdit={() => router.push(`/template/${resume.template_id}?resumeId=${resume.id}`)}
                                                    onDelete={() => handleDeleteResume(resume.id)}
                                                    onShare={() => handleShareResume(resume.id, resume.template_id)}
                                                />
                                            </div>

                                            <div className="h-full flex flex-col">
                                                <div className="flex items-start justify-between mb-3">
                                                    <div className="flex-1 pr-8">
                                                        <h4 className="font-semibold text-gray-900 text-sm mb-1 line-clamp-1">
                                                            {resume.name || 'Untitled Resume'}
                                                        </h4>
                                                        <p className="text-xs text-gray-500 line-clamp-1">
                                                            {resume.job_title || 'Position not specified'}
                                                        </p>
                                                    </div>
                                                </div>

                                                <div className="flex-1 overflow-hidden rounded border border-gray-200 bg-white">
                                                    <TemplateRenderer
                                                        templateId={resume.template_id}
                                                        userData={convertToUserData(resume)}
                                                        size="small"
                                                    />
                                                </div>

                                                <div className="flex items-center justify-between mt-3">
                                                    <div className="flex items-center text-xs text-gray-500">
                                                        <Briefcase className="w-3 h-3 mr-1" />
                                                        <span className="line-clamp-1">
                                                            Template {resume.template_id}
                                                        </span>
                                                    </div>
                                                    <div
                                                        className="w-3 h-3 rounded-full border border-gray-200"
                                                        style={{ backgroundColor: resume.theme_color || '#3B82F6' }}
                                                        title="Theme Color"
                                                    />
                                                </div>
                                            </div>
                                        </div>

                                        <div className="p-4 bg-white">
                                            <div className="flex items-center justify-between">
                                                <div className="flex items-center text-xs text-gray-500">
                                                    <Calendar className="w-3 h-3 mr-1" />
                                                    {formatDate(resume.updated_at)}
                                                </div>
                                                <span className="text-xs text-gray-400 bg-gray-100 px-2 py-1 rounded">
                                                    {resume.job_title ? resume.job_title.split(' ').slice(0, 2).join(' ') : 'Resume'}
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                </Link>
                            </div>
                        ))}
                    </div>
                )}
            </main>
        </div>
    );
};

export default ResumePage;