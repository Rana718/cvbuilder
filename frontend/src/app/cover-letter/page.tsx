'use client';

import React, { useState, useEffect, useRef } from 'react';
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
        <div className="min-h-screen bg-gray-50">
            <Navbar />

            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-8">
                    <div className="mb-4 sm:mb-0">
                        <h1 className="text-2xl font-bold text-gray-900">Cover Letters</h1>
                        <p className="text-gray-600 mt-1">
                            Manage and organize your professional cover letters
                        </p>
                    </div>

                    <div className="flex items-center space-x-4">
                        <div className="relative">
                            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                            <input
                                type="text"
                                placeholder="Search cover letters..."
                                value={searchTerm}
                                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSearchTerm(e.target.value)}
                                className="pl-10 pr-4 py-2 w-64 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                            />
                        </div>

                        <Link
                            href="/createcover-letter"
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

                {filteredCoverLetters.length === 0 && searchTerm ? (
                    <div className="text-center py-16">
                        <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                            <Search className="w-8 h-8 text-gray-400" />
                        </div>
                        <h3 className="text-lg font-medium text-gray-900 mb-2">No matching cover letters</h3>
                        <p className="text-gray-600 mb-4">Try adjusting your search terms or create a new cover letter</p>
                        <button
                            onClick={() => setSearchTerm('')}
                            className="text-blue-600 hover:text-blue-700 font-medium"
                        >
                            Clear search
                        </button>
                    </div>
                ) : coverLetters.length === 0 ? (
                    <div className="text-center py-20">
                        <div className="w-24 h-24 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-6">
                            <FileText className="w-12 h-12 text-blue-600" />
                        </div>
                        <h3 className="text-xl font-semibold text-gray-900 mb-3">Welcome to your cover letter dashboard</h3>
                        <p className="text-gray-600 mb-6 max-w-md mx-auto">
                            Start building your professional cover letters with our AI-powered tools and templates
                        </p>
                        <Link
                            href="/createcover-letter"
                            className="inline-flex items-center px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium shadow-sm"
                        >
                            <Plus className="w-5 h-5 mr-2" />
                            Create Your First Cover Letter
                        </Link>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                        {filteredCoverLetters.map((letter) => (
                            <div key={letter.id} className="group relative">
                                <Link href={`/cover-letter/${letter.id}`} className="block">
                                    <div className="bg-white rounded-lg border border-gray-200 hover:border-blue-300 hover:shadow-lg transition-all duration-200 overflow-hidden">
                                        <div className="aspect-[3/4] bg-gray-50 border-b border-gray-100 p-4 relative">
                                            <div className="absolute top-3 right-3 z-10">
                                                <DropdownMenu
                                                    coverId={letter.id}
                                                    onEdit={() => router.push(`/createcover-letter?coverLetterId=${letter.id}&edit=true`)}
                                                    onDelete={() => handleDeleteCoverLetter(letter.id)}
                                                    onShare={() => handleShareCoverLetter(letter.id)}
                                                />
                                            </div>

                                            <div className="h-full flex flex-col">
                                                <div className="flex items-start justify-between mb-3">
                                                    <div className="flex-1 pr-8">
                                                        <h4 className="font-semibold text-gray-900 text-sm mb-1 line-clamp-1">
                                                            {letter.name || 'Untitled Cover Letter'}
                                                        </h4>
                                                        <p className="text-xs text-gray-500 line-clamp-1">
                                                            {letter.recipient_title || 'Position not specified'}
                                                        </p>
                                                    </div>
                                                </div>

                                                <div className="flex-1 text-xs text-gray-600 line-clamp-8 mb-3">
                                                    {letter.body.replace(/<[^>]*>/g, '').substring(0, 300)}...
                                                </div>

                                                <div className="flex items-center text-xs text-gray-400">
                                                    <Building2 className="w-3 h-3 mr-1" />
                                                    <span className="line-clamp-1">
                                                        {letter.recipient_company || 'Company not specified'}
                                                    </span>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="p-4 bg-white">
                                            <div className="flex items-center justify-between">
                                                <div className="flex items-center text-xs text-gray-500">
                                                    <Calendar className="w-3 h-3 mr-1" />
                                                    {formatDate(letter.updated_at)}
                                                </div>
                                                <span className="text-xs text-gray-400 bg-gray-100 px-2 py-1 rounded">
                                                    Template {letter.template_id}
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

export default CoverLetterPage;