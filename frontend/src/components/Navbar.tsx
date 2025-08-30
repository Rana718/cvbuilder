"use client";

import { motion } from 'framer-motion';
import { FileText, User, X, Menu, LogOut, Settings, FolderOpen, LayoutPanelTop } from 'lucide-react';
import { useSession, signOut } from 'next-auth/react';
import React, { useState, useRef, useEffect } from 'react';
import Link from 'next/link';

function Navbar() {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [isProfileOpen, setIsProfileOpen] = useState(false);
    const { data: session, status } = useSession();
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

    const handleSignOut = () => {
        signOut({ callbackUrl: '/' });
        setIsProfileOpen(false);
    };

    return (
        <motion.header
            initial={{ y: -100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.8 }}
            className="bg-white/95 backdrop-blur-md shadow-sm border-b border-gray-100 sticky top-0 z-50"
        >
            <nav className="container mx-auto px-4 py-3">
                <div className="flex justify-between items-center">
                    {/* Logo */}
                    <Link href="/" className="flex items-center space-x-2 hover:opacity-80 transition-opacity">
                        <div className="p-1.5 bg-blue-600 rounded-lg">
                            <FileText className="h-6 w-6 text-white" />
                        </div>
                        <span className="text-xl font-bold text-blue-600 hidden sm:block">
                            AI CV Builder
                        </span>
                        <span className="text-xl font-bold text-blue-600 sm:hidden">
                            CV Builder
                        </span>
                    </Link>

                    {/* Desktop Navigation */}
                    <div className="hidden md:flex items-center space-x-6">
                        {session && (
                            <>
                                <Link 
                                    href="/my-resumes" 
                                    className="flex items-center space-x-2 text-gray-600 hover:text-blue-600 transition-colors px-3 py-2 rounded-lg hover:bg-blue-50"
                                >
                                    <FolderOpen className="h-4 w-4" />
                                    <span className="font-medium">My Resumes</span>
                                </Link>
                                <Link 
                                    href="/templates" 
                                    className="flex items-center space-x-2 text-gray-600 hover:text-blue-600 transition-colors px-3 py-2 rounded-lg hover:bg-blue-50"
                                >
                                    <LayoutPanelTop className="h-4 w-4" />
                                    <span className="font-medium">Templates</span>
                                </Link>
                            </>
                        )}
                    </div>

                    {/* Right Side - Auth/Profile */}
                    <div className="hidden md:flex items-center space-x-3">
                        {status === "loading" ? (
                            <div className="flex items-center space-x-2">
                                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-blue-600"></div>
                                <span className="text-gray-600 text-sm">Loading...</span>
                            </div>
                        ) : session ? (
                            <div className="relative" ref={profileRef}>
                                <button
                                    onClick={() => setIsProfileOpen(!isProfileOpen)}
                                    className="flex items-center space-x-3 bg-gray-50 hover:bg-gray-100 rounded-xl px-3 py-2 transition-colors"
                                >
                                    <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center">
                                        <span className="text-white font-semibold text-sm">
                                            {session.user?.name?.charAt(0)?.toUpperCase() || 'U'}
                                        </span>
                                    </div>
                                    <div className="text-left">
                                        <p className="text-sm font-medium text-gray-900">
                                            {session.user?.name || 'User'}
                                        </p>
                                        <p className="text-xs text-gray-500">
                                            {session.user?.email}
                                        </p>
                                    </div>
                                </button>

                                {/* Profile Dropdown */}
                                {isProfileOpen && (
                                    <motion.div
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        className="absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-lg border border-gray-100 py-2 z-10"
                                    >
                                        <Link
                                            href="/profile"
                                            className="flex items-center space-x-3 px-4 py-2 text-gray-700 hover:bg-gray-50 transition-colors"
                                            onClick={() => setIsProfileOpen(false)}
                                        >
                                            <User className="h-4 w-4" />
                                            <span>Profile</span>
                                        </Link>
                                        <Link
                                            href="/settings"
                                            className="flex items-center space-x-3 px-4 py-2 text-gray-700 hover:bg-gray-50 transition-colors"
                                            onClick={() => setIsProfileOpen(false)}
                                        >
                                            <Settings className="h-4 w-4" />
                                            <span>Settings</span>
                                        </Link>
                                        <hr className="my-2 border-gray-100" />
                                        <button
                                            onClick={handleSignOut}
                                            className="flex items-center space-x-3 px-4 py-2 text-red-600 hover:bg-red-50 transition-colors w-full text-left"
                                        >
                                            <LogOut className="h-4 w-4" />
                                            <span>Sign Out</span>
                                        </button>
                                    </motion.div>
                                )}
                            </div>
                        ) : (
                            <div className="flex items-center space-x-3">
                                <Link href="/sign-in">
                                    <button className="flex items-center space-x-2 text-gray-600 hover:text-blue-600 transition-colors px-4 py-2 rounded-lg hover:bg-blue-50">
                                        <User className="h-4 w-4" />
                                        <span className="font-medium">Sign In</span>
                                    </button>
                                </Link>
                                <Link href="/sign-up">
                                    <button className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded-lg transition-all duration-200 transform hover:scale-105 font-medium shadow-lg">
                                        Get Started
                                    </button>
                                </Link>
                            </div>
                        )}
                    </div>

                    {/* Mobile Menu Button */}
                    <button
                        className="md:hidden p-2 rounded-lg hover:bg-gray-100 transition-colors"
                        onClick={() => setIsMenuOpen(!isMenuOpen)}
                    >
                        {isMenuOpen ? (
                            <X className="h-5 w-5 text-gray-600" />
                        ) : (
                            <Menu className="h-5 w-5 text-gray-600" />
                        )}
                    </button>
                </div>

                {/* Mobile Menu */}
                {isMenuOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="md:hidden mt-4 pb-4 border-t border-gray-100"
                    >
                        <div className="flex flex-col space-y-2 pt-4">
                            {session ? (
                                <>
                                    {/* User Info */}
                                    <div className="flex items-center space-x-3 px-3 py-3 bg-gray-50 rounded-lg mb-2">
                                        <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center">
                                            <span className="text-white font-semibold">
                                                {session.user?.name?.charAt(0)?.toUpperCase() || 'U'}
                                            </span>
                                        </div>
                                        <div>
                                            <p className="font-medium text-gray-900">{session.user?.name}</p>
                                            <p className="text-sm text-gray-500">{session.user?.email}</p>
                                        </div>
                                    </div>

                                    {/* Navigation Links */}
                                    <Link
                                        href="/my-resumes"
                                        className="flex items-center space-x-3 px-3 py-2 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                                        onClick={() => setIsMenuOpen(false)}
                                    >
                                        <FolderOpen className="h-5 w-5" />
                                        <span>My Resumes</span>
                                    </Link>
                                    <Link
                                        href="/templates"
                                        className="flex items-center space-x-3 px-3 py-2 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                                        onClick={() => setIsMenuOpen(false)}
                                    >
                                        <LayoutPanelTop className="h-5 w-5" />
                                        <span>Templates</span>
                                    </Link>
                                    <Link
                                        href="/profile"
                                        className="flex items-center space-x-3 px-3 py-2 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                                        onClick={() => setIsMenuOpen(false)}
                                    >
                                        <User className="h-5 w-5" />
                                        <span>Profile</span>
                                    </Link>
                                    <Link
                                        href="/settings"
                                        className="flex items-center space-x-3 px-3 py-2 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                                        onClick={() => setIsMenuOpen(false)}
                                    >
                                        <Settings className="h-5 w-5" />
                                        <span>Settings</span>
                                    </Link>
                                    <hr className="my-2 border-gray-200" />
                                    <button
                                        onClick={() => {
                                            handleSignOut();
                                            setIsMenuOpen(false);
                                        }}
                                        className="flex items-center space-x-3 px-3 py-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors w-full text-left"
                                    >
                                        <LogOut className="h-5 w-5" />
                                        <span>Sign Out</span>
                                    </button>
                                </>
                            ) : (
                                <>
                                    <Link href="/sign-in">
                                        <button 
                                            className="flex items-center space-x-3 px-3 py-2 text-gray-600 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors w-full text-left"
                                            onClick={() => setIsMenuOpen(false)}
                                        >
                                            <User className="h-5 w-5" />
                                            <span>Sign In</span>
                                        </button>
                                    </Link>
                                    <Link href="/sign-up">
                                        <button 
                                            className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-4 py-2 rounded-lg transition-all duration-200 font-medium shadow-lg w-full mt-2"
                                            onClick={() => setIsMenuOpen(false)}
                                        >
                                            Get Started
                                        </button>
                                    </Link>
                                </>
                            )}
                        </div>
                    </motion.div>
                )}
            </nav>
        </motion.header>
    );
}

export default Navbar;