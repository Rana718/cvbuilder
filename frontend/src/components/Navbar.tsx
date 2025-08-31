"use client";

import { motion } from 'framer-motion';
import { FileText, User, X, Menu, LogOut, Settings, FolderOpen, LayoutPanelTop } from 'lucide-react';
import { signOut } from 'firebase/auth';
import { auth } from '@/lib/firebase';
import { useAuth } from './AuthContext';
import React, { useState, useRef, useEffect } from 'react';
import Link from 'next/link';

function Navbar() {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [isProfileOpen, setIsProfileOpen] = useState(false);
    const { user, loading } = useAuth();
    const profileRef = useRef<HTMLDivElement>(null);

    // Close profile dropdown when clicking outside
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (profileRef.current && !profileRef.current.contains(event.target as Node)) {
                setIsProfileOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    const handleSignOut = async () => {
        try {
            await signOut(auth);
            setIsProfileOpen(false);
        } catch (error) {
            console.error('Sign out error:', error);
        }
    };

    return (
        <nav className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center h-16">
                    {/* Logo */}
                    <Link href="/" className="flex items-center space-x-2">
                        <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                            <FileText className="h-5 w-5 text-white" />
                        </div>
                        <span className="text-xl font-bold text-gray-900">AI Resume Builder</span>
                    </Link>

                    {/* Desktop Navigation */}
                    <div className="hidden md:flex items-center space-x-8">
                        <Link href="/template" className="text-gray-700 hover:text-blue-600 transition-colors flex items-center space-x-1">
                            <LayoutPanelTop className="h-4 w-4" />
                            <span>Templates</span>
                        </Link>
                        
                        {user && (
                            <Link href="/resusme" className="text-gray-700 hover:text-blue-600 transition-colors flex items-center space-x-1">
                                <FolderOpen className="h-4 w-4" />
                                <span>My Resumes</span>
                            </Link>
                        )}
                    </div>

                    {/* Auth Section */}
                    <div className="hidden md:flex items-center space-x-4">
                        {loading ? (
                            <div className="w-8 h-8 bg-gray-200 rounded-full animate-pulse"></div>
                        ) : user ? (
                            <div className="relative" ref={profileRef}>
                                <button
                                    onClick={() => setIsProfileOpen(!isProfileOpen)}
                                    className="flex items-center space-x-2 text-gray-700 hover:text-blue-600 transition-colors"
                                >
                                    <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                                        <User className="h-4 w-4 text-blue-600" />
                                    </div>
                                    <span className="text-sm font-medium">{user.displayName || user.email}</span>
                                </button>

                                {isProfileOpen && (
                                    <motion.div
                                        initial={{ opacity: 0, y: -10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0, y: -10 }}
                                        className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-1"
                                    >
                                        <Link
                                            href="/profile"
                                            className="flex items-center space-x-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                                            onClick={() => setIsProfileOpen(false)}
                                        >
                                            <Settings className="h-4 w-4" />
                                            <span>Profile Settings</span>
                                        </Link>
                                        <Link
                                            href="/resusme"
                                            className="flex items-center space-x-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                                            onClick={() => setIsProfileOpen(false)}
                                        >
                                            <FolderOpen className="h-4 w-4" />
                                            <span>My Resumes</span>
                                        </Link>
                                        <hr className="my-1" />
                                        <button
                                            onClick={handleSignOut}
                                            className="flex items-center space-x-2 px-4 py-2 text-sm text-red-600 hover:bg-red-50 w-full text-left"
                                        >
                                            <LogOut className="h-4 w-4" />
                                            <span>Sign Out</span>
                                        </button>
                                    </motion.div>
                                )}
                            </div>
                        ) : (
                            <div className="flex items-center space-x-4">
                                <Link
                                    href="/sign-in"
                                    className="text-gray-700 hover:text-blue-600 transition-colors"
                                >
                                    Sign In
                                </Link>
                                <Link
                                    href="/sign-up"
                                    className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                                >
                                    Sign Up
                                </Link>
                            </div>
                        )}
                    </div>

                    {/* Mobile menu button */}
                    <div className="md:hidden">
                        <button
                            onClick={() => setIsMenuOpen(!isMenuOpen)}
                            className="text-gray-700 hover:text-blue-600 transition-colors"
                        >
                            {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
                        </button>
                    </div>
                </div>

                {/* Mobile Navigation */}
                {isMenuOpen && (
                    <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        className="md:hidden border-t border-gray-200 py-4"
                    >
                        <div className="flex flex-col space-y-4">
                            <Link
                                href="/template"
                                className="text-gray-700 hover:text-blue-600 transition-colors flex items-center space-x-2"
                                onClick={() => setIsMenuOpen(false)}
                            >
                                <LayoutPanelTop className="h-4 w-4" />
                                <span>Templates</span>
                            </Link>
                            
                            {user && (
                                <Link
                                    href="/resusme"
                                    className="text-gray-700 hover:text-blue-600 transition-colors flex items-center space-x-2"
                                    onClick={() => setIsMenuOpen(false)}
                                >
                                    <FolderOpen className="h-4 w-4" />
                                    <span>My Resumes</span>
                                </Link>
                            )}

                            {user ? (
                                <div className="flex flex-col space-y-2 pt-4 border-t border-gray-200">
                                    <div className="flex items-center space-x-2 text-gray-700">
                                        <User className="h-4 w-4" />
                                        <span className="text-sm">{user.displayName || user.email}</span>
                                    </div>
                                    <Link
                                        href="/profile"
                                        className="text-gray-700 hover:text-blue-600 transition-colors flex items-center space-x-2"
                                        onClick={() => setIsMenuOpen(false)}
                                    >
                                        <Settings className="h-4 w-4" />
                                        <span>Profile Settings</span>
                                    </Link>
                                    <button
                                        onClick={() => {
                                            handleSignOut();
                                            setIsMenuOpen(false);
                                        }}
                                        className="text-red-600 hover:text-red-700 transition-colors flex items-center space-x-2 text-left"
                                    >
                                        <LogOut className="h-4 w-4" />
                                        <span>Sign Out</span>
                                    </button>
                                </div>
                            ) : (
                                <div className="flex flex-col space-y-2 pt-4 border-t border-gray-200">
                                    <Link
                                        href="/sign-in"
                                        className="text-gray-700 hover:text-blue-600 transition-colors"
                                        onClick={() => setIsMenuOpen(false)}
                                    >
                                        Sign In
                                    </Link>
                                    <Link
                                        href="/sign-up"
                                        className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors text-center"
                                        onClick={() => setIsMenuOpen(false)}
                                    >
                                        Sign Up
                                    </Link>
                                </div>
                            )}
                        </div>
                    </motion.div>
                )}
            </div>
        </nav>
    );
}

export default Navbar;
