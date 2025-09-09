"use client";
import { motion } from 'framer-motion';
import { FileText, User, X, Menu, FolderOpen, LayoutPanelTop, Mail, TrendingUp, BarChart3, Sparkles } from 'lucide-react';
import { useAuth } from './AuthContext';
import React, { useState, useCallback } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

const navLinks = [
    { href: '/dashboard', icon: BarChart3, label: 'Home', requiresAuth: true },
    { href: '/template', icon: LayoutPanelTop, label: 'CV', requiresAuth: false },
    { href: '/resusme', icon: FolderOpen, label: 'My Resumes', requiresAuth: true },
    { href: '/cover-letter', icon: Mail, label: 'Cover Letters', requiresAuth: true },
    { href: '/rateing', icon: TrendingUp, label: 'Resume Reteing', requiresAuth: true },
];

function Navbar() {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const { user, loading } = useAuth();
    const pathname = usePathname();

    const isActiveLink = useCallback((href: string) => pathname === href, [pathname]);

    const closeMenu = useCallback(() => setIsMenuOpen(false), []);

    const toggleMenu = useCallback(() => setIsMenuOpen(prev => !prev), []);

    const renderNavLink = useCallback((link: typeof navLinks[0], isMobile = false) => {
        const { href, icon: Icon, label, requiresAuth } = link;

        if (requiresAuth && !user) return null;

        const isActive = isActiveLink(href);
        const baseClasses = `relative transition-all duration-300 flex items-center space-x-${isMobile ? '3' : '2'} px-${isMobile ? '4' : '3'} py-2 rounded-lg group ${
            isActive 
                ? 'text-blue-600 bg-blue-50 font-semibold shadow-sm' 
                : 'text-gray-700 hover:text-blue-600 hover:bg-blue-50/50'
        }`;

        return (
            <Link
                key={href}
                href={href}
                className={baseClasses}
                onClick={isMobile ? closeMenu : undefined}
            >
                <Icon className={`h-${isMobile ? '5' : '4'} w-${isMobile ? '5' : '4'} ${isActive ? 'text-blue-600' : 'group-hover:text-blue-600'} transition-colors duration-200`} />
                <span className={isMobile ? 'text-base' : 'text-sm'}>{label}</span>
            </Link>
        );
    }, [user, isActiveLink, closeMenu]);

    const renderAuthSection = useCallback((isMobile = false) => {
        if (loading) {
            return (
                <div className="flex items-center space-x-2">
                    <div className="w-8 h-8 bg-gray-200 rounded-full animate-pulse" />
                    {!isMobile && <div className="w-16 h-4 bg-gray-200 rounded animate-pulse" />}
                </div>
            );
        }

        if (user) {
            const profileSection = (
                <Link
                    href="/profile"
                    className={`flex items-center space-x-3 text-gray-700 hover:text-blue-600 transition-all duration-200 px-3 py-2 rounded-lg hover:bg-blue-50/50 group ${isMobile ? 'w-full' : ''}`}
                    onClick={isMobile ? closeMenu : undefined}
                >
                    <div className={`${isMobile ? 'w-8 h-8' : 'w-9 h-9'} bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center shadow-md group-hover:shadow-lg transition-shadow duration-200`}>
                        {user.photoURL ? (
                            <img 
                                src={user.photoURL} 
                                alt="Profile" 
                                className={`${isMobile ? 'w-8 h-8' : 'w-9 h-9'} rounded-full object-cover`} 
                            />
                        ) : (
                            <User className="h-4 w-4 text-white" />
                        )}
                    </div>
                    <div className={`${isMobile ? '' : 'hidden lg:block'}`}>
                        <p className={`${isMobile ? 'text-base' : 'text-sm'} font-medium text-gray-900 group-hover:text-blue-600 transition-colors`}>
                            {user.displayName || user.email?.split('@')[0] || 'User'}
                        </p>
                        {!isMobile && (
                            <p className="text-xs text-gray-500">View Profile</p>
                        )}
                    </div>
                </Link>
            );

            return isMobile ? (
                <div className="flex flex-col space-y-2 pt-4 border-t border-gray-200">
                    {profileSection}
                </div>
            ) : (
                <div className="flex items-center space-x-3">
                    {profileSection}
                </div>
            );
        }

        const authLinks = (
            <>
                <Link
                    href="/sign-in"
                    className={`text-gray-700 hover:text-blue-600 transition-all duration-200 px-4 py-2 rounded-lg hover:bg-blue-50/50 font-medium ${isMobile ? 'text-center text-base' : 'text-sm'}`}
                    onClick={isMobile ? closeMenu : undefined}
                >
                    Sign In
                </Link>
                <Link
                    href="/sign-up"
                    className={`bg-gradient-to-r from-blue-600 to-blue-700 text-white px-6 py-2.5 rounded-lg hover:from-blue-700 hover:to-blue-800 transition-all duration-200 font-medium shadow-md hover:shadow-lg transform hover:scale-105 ${
                        isMobile ? 'text-center text-base' : 'text-sm'
                    }`}
                    onClick={isMobile ? closeMenu : undefined}
                >
                    <span className="flex items-center justify-center space-x-1">
                        <Sparkles className="w-4 h-4" />
                        <span>Sign Up</span>
                    </span>
                </Link>
            </>
        );

        return isMobile ? (
            <div className="flex flex-col space-y-3 pt-4 border-t border-gray-200">
                {authLinks}
            </div>
        ) : (
            <div className="flex items-center space-x-3">
                {authLinks}
            </div>
        );
    }, [loading, user, closeMenu]);

    return (
        <nav className="bg-white/95 backdrop-blur-lg shadow-sm border-b border-gray-200/50 sticky top-0 z-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center h-16">
                    {/* Logo */}
                    <Link href="/" className="flex items-center space-x-3 group">
                        <div className="w-9 h-9 bg-gradient-to-br from-blue-600 to-blue-700 rounded-xl flex items-center justify-center shadow-md group-hover:shadow-lg transition-all duration-200 group-hover:scale-105">
                            <FileText className="h-5 w-5 text-white" />
                        </div>
                        <span className="text-xl font-bold bg-gradient-to-r from-gray-900 to-blue-600 bg-clip-text text-transparent group-hover:from-blue-600 group-hover:to-blue-700 transition-all duration-200">
                            AI Resume Builder
                        </span>
                    </Link>

                    {/* Desktop Navigation */}
                    <div className="hidden md:flex items-center space-x-1">
                        {navLinks.map(link => renderNavLink(link))}
                    </div>

                    {/* Desktop Auth Section */}
                    <div className="hidden md:flex items-center">
                        {renderAuthSection()}
                    </div>

                    {/* Mobile Menu Button */}
                    <div className="md:hidden">
                        <button
                            onClick={toggleMenu}
                            className="text-gray-700 hover:text-blue-600 transition-colors p-2 rounded-lg hover:bg-blue-50/50"
                        >
                            <motion.div
                                animate={{ rotate: isMenuOpen ? 180 : 0 }}
                                transition={{ duration: 0.2 }}
                            >
                                {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
                            </motion.div>
                        </button>
                    </div>
                </div>

                {/* Mobile Menu */}
                {isMenuOpen && (
                    <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.2 }}
                        className="md:hidden border-t border-gray-200/50 py-4"
                    >
                        <div className="flex flex-col space-y-2">
                            {navLinks.map(link => renderNavLink(link, true))}
                            {renderAuthSection(true)}
                        </div>
                    </motion.div>
                )}
            </div>
        </nav>
    );
}

export default Navbar;
