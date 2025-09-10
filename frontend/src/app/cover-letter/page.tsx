'use client';

import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '@/components/AuthContext';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Plus, Edit, Trash2, Search, FileText, MoreHorizontal, Share2, Calendar, Building2 } from 'lucide-react';
import axiosInstance from '@/lib/axios';
import Navbar from '@/components/Navbar';

interface CoverLetter {
    id: number;
    name: string;
    email: string;
    recipient_company?: string;
    recipient_title?: string;
    body: string;
    template_id: number;
    created_at: string;
    updated_at: string;
}

interface DropdownMenuProps {
    coverId: number;
    onEdit: () => void;
    onDelete: () => void;
    onShare: () => void;
}

const DropdownMenu: React.FC<DropdownMenuProps> = ({ coverId, onEdit, onDelete, onShare }) => {
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

const CoverLetterPage: React.FC = () => {
    const { user, loading: status } = useAuth();
    const router = useRouter();
    const [coverLetters, setCoverLetters] = useState<CoverLetter[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string>('');
    const [searchTerm, setSearchTerm] = useState<string>('');

    useEffect(() => {
        if (status) return;

        if (!user) {
            router.push('/sign-in?callbackUrl=' + encodeURIComponent('/cover-letter'));
            return;
        }

        fetchCoverLetters();
    }, [user, status, router]);

    const fetchCoverLetters = async (): Promise<void> => {
        try {
            setLoading(true);
            const response = await axiosInstance.get('/api/cover-letters/all');
            setCoverLetters(response.data);
        } catch (error: any) {
            console.error('Failed to fetch cover letters:', error);
            if (error.response?.status === 401) {
                router.push('/sign-in?callbackUrl=' + encodeURIComponent('/cover-letter'));
            } else {
                setError('Failed to load cover letters. Please try again.');
            }
        } finally {
            setLoading(false);
        }
    };

    const handleDeleteCoverLetter = async (coverLetterId: number): Promise<void> => {
        if (!confirm('Are you sure you want to delete this cover letter?')) return;

        try {
            await axiosInstance.delete(`/api/cover-letters/${coverLetterId}`);
            setCoverLetters(coverLetters.filter(letter => letter.id !== coverLetterId));
        } catch (error: any) {
            console.error('Failed to delete cover letter:', error);
            alert('Failed to delete cover letter. Please try again.');
        }
    };

    const handleShareCoverLetter = (coverLetterId: number): void => {
        const shareUrl = `${window.location.origin}/cover-letter/${coverLetterId}`;
        if (navigator.share) {
            navigator.share({
                title: 'Cover Letter',
                text: 'Check out my cover letter',
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

    const filteredCoverLetters = coverLetters.filter(letter =>
        letter.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        letter.recipient_company?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        letter.recipient_title?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    if (status || (user && loading)) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
                    <p className="text-gray-700 font-medium">
                        {status ? 'Checking authentication...' : 'Loading your cover letters...'}
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
                                Cover Letter Manager
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
                            Cover
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 ml-2">
                                Letters
                            </span>
                        </h1>
                        <p className="text-sm sm:text-base lg:text-lg text-slate-600 font-light">
                            Manage and organize your professional cover letters
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
                                placeholder="Search cover letters..."
                                value={searchTerm}
                                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSearchTerm(e.target.value)}
                                className="pl-8 sm:pl-10 pr-3 sm:pr-4 py-2 sm:py-3 w-full sm:w-64 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all bg-white/80 backdrop-blur-sm shadow-sm text-sm"
                            />
                        </div>

                        <Link
                            href="/createcover-letter"
                            className="group flex items-center justify-center space-x-2 px-4 sm:px-6 py-2 sm:py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl hover:from-blue-700 hover:to-purple-700 transition-all shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 font-medium text-sm"
                        >
                            <Plus className="w-3 h-3 sm:w-4 sm:h-4 group-hover:rotate-90 transition-transform duration-300" />
                            <span>Create New</span>
                        </Link>
                    </motion.div>
                </div>

                {error && (
                    <div className="mb-8 bg-red-50 border border-red-200 text-red-800 px-4 py-3 rounded-lg">
                        {error}
                    </div>
                )}

                {filteredCoverLetters.length === 0 && searchTerm ? (
                    <div className="text-center py-12 sm:py-16">
                        <div className="w-12 h-12 sm:w-16 sm:h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-3 sm:mb-4">
                            <Search className="w-6 h-6 sm:w-8 sm:h-8 text-gray-400" />
                        </div>
                        <h3 className="text-base sm:text-lg font-medium text-gray-900 mb-2">No matching cover letters</h3>
                        <p className="text-sm sm:text-base text-gray-600 mb-3 sm:mb-4 px-4">Try adjusting your search terms or create a new cover letter</p>
                        <button
                            onClick={() => setSearchTerm('')}
                            className="text-blue-600 hover:text-blue-700 font-medium text-sm sm:text-base"
                        >
                            Clear search
                        </button>
                    </div>
                ) : coverLetters.length === 0 ? (
                    <motion.div 
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8 }}
                        className="text-center py-12 sm:py-20"
                    >
                        <div className="relative mb-6 sm:mb-8">
                            <div className="w-20 h-20 sm:w-32 sm:h-32 bg-gradient-to-br from-blue-100 to-indigo-100 rounded-2xl sm:rounded-3xl flex items-center justify-center mx-auto mb-4 sm:mb-6 shadow-xl">
                                <FileText className="w-10 h-10 sm:w-16 sm:h-16 text-blue-600" />
                            </div>
                            <div className="absolute -top-1 -right-1 sm:-top-2 sm:-right-2 w-8 h-8 sm:w-12 sm:h-12 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full flex items-center justify-center shadow-lg">
                                <Plus className="w-4 h-4 sm:w-6 sm:h-6 text-white" />
                            </div>
                        </div>
                        <h3 className="text-xl sm:text-2xl lg:text-3xl font-bold text-slate-900 mb-3 sm:mb-4">
                            Welcome to your
                            <span className="block text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600 mt-1">
                                Cover Letter Hub
                            </span>
                        </h3>
                        <p className="text-sm sm:text-base lg:text-lg text-slate-600 mb-6 sm:mb-8 max-w-sm sm:max-w-md mx-auto font-light leading-relaxed px-4">
                            Start building your professional cover letters with our AI-powered tools and stunning templates
                        </p>
                        <Link
                            href="/createcover-letter"
                            className="group inline-flex items-center px-6 sm:px-8 py-3 sm:py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl hover:from-blue-700 hover:to-purple-700 font-semibold shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-300 text-sm sm:text-base"
                        >
                            <Plus className="w-4 h-4 sm:w-5 sm:h-5 mr-2 sm:mr-3 group-hover:rotate-90 transition-transform duration-300" />
                            Create Your First Cover Letter
                        </Link>
                    </motion.div>
                ) : (
                    <motion.div 
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, staggerChildren: 0.1 }}
                        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6"
                    >
                        {filteredCoverLetters.map((letter, index) => (
                            <motion.div 
                                key={letter.id} 
                                initial={{ opacity: 0, y: 30 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: index * 0.05 }}
                                className="group cursor-pointer"
                            >
                                <Link href={`/cover-letter/${letter.id}`} className="block">
                                    <div className="relative bg-white border border-gray-200 rounded-lg overflow-hidden hover:border-blue-300 hover:shadow-lg transition-all duration-200">
                                        {/* Cover Letter Preview */}
                                        <div className="relative aspect-[3/4] bg-gradient-to-br from-blue-50 to-indigo-50 p-3 sm:p-4">
                                            <div className="absolute top-2 right-2 z-10">
                                                <DropdownMenu
                                                    coverId={letter.id}
                                                    onEdit={() => router.push(`/createcover-letter?coverLetterId=${letter.id}&edit=true`)}
                                                    onDelete={() => handleDeleteCoverLetter(letter.id)}
                                                    onShare={() => handleShareCoverLetter(letter.id)}
                                                />
                                            </div>

                                            <div className="h-full flex flex-col">
                                                <div className="flex items-start justify-between mb-2 sm:mb-3">
                                                    <div className="flex-1 pr-6 sm:pr-8">
                                                        <div className="w-6 h-6 sm:w-8 sm:h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center mb-2 sm:mb-3 shadow-lg">
                                                            <FileText className="w-3 h-3 sm:w-4 sm:h-4 text-white" />
                                                        </div>
                                                        <h4 className="font-semibold text-slate-900 text-xs sm:text-sm mb-1 line-clamp-1 group-hover:text-blue-600 transition-colors">
                                                            {letter.name || 'Untitled Cover Letter'}
                                                        </h4>
                                                        <p className="text-xs text-slate-600 line-clamp-1 font-medium">
                                                            {letter.recipient_title || 'Position not specified'}
                                                        </p>
                                                    </div>
                                                </div>

                                                <div className="flex-1 text-xs text-slate-600 line-clamp-6 sm:line-clamp-8 mb-2 sm:mb-3 leading-relaxed">
                                                    {letter.body.replace(/<[^>]*>/g, '').substring(0, 200)}...
                                                </div>

                                                <div className="flex items-center text-xs text-slate-500">
                                                    <Building2 className="w-3 h-3 mr-1 text-blue-500" />
                                                    <span className="line-clamp-1 font-medium">
                                                        {letter.recipient_company || 'Company not specified'}
                                                    </span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </Link>

                                {/* Cover Letter Info - Outside card */}
                                <div className="text-center mt-3">
                                    <h3 className="font-medium text-gray-900 text-sm sm:text-base mb-1 group-hover:text-blue-600 transition-colors line-clamp-1">
                                        {letter.name || 'Untitled Cover Letter'}
                                    </h3>
                                    <div className="flex items-center justify-center space-x-2 text-xs sm:text-sm text-gray-500">
                                        <Calendar className="w-3 h-3 text-emerald-500" />
                                        <span>{formatDate(letter.updated_at)}</span>
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </motion.div>
                )}
            </main>
        </div>
    );
};

export default CoverLetterPage;