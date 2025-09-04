"use client";
import { motion } from 'framer-motion';
import { FileText, User, X, Menu, FolderOpen, LayoutPanelTop, Mail, TrendingUp } from 'lucide-react';
import { useAuth } from './AuthContext';
import React, { useState, useCallback } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

const navLinks = [
    { href: '/template', icon: LayoutPanelTop, label: 'Templates', requiresAuth: false },
    { href: '/resusme', icon: FolderOpen, label: 'My Resumes', requiresAuth: true },
    { href: '/cover-letter', icon: Mail, label: 'Cover Letters', requiresAuth: true },
    { href: '/rateing', icon: TrendingUp, label: 'Resume Feedback', requiresAuth: true },
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
        const baseClasses = `transition-colors flex items-center space-x-${isMobile ? '2' : '1'} ${isActive ? 'text-blue-600 font-medium' : 'text-gray-700 hover:text-blue-600'
            }`;

        return (
            <Link
                key={href}
                href={href}
                className={baseClasses}
                onClick={isMobile ? closeMenu : undefined}
            >
                <Icon className="h-4 w-4" />
                <span>{label}</span>
            </Link>
        );
    }, [user, isActiveLink, closeMenu]);

    const renderAuthSection = useCallback((isMobile = false) => {
        if (loading) {
            return <div className="w-8 h-8 bg-gray-200 rounded-full animate-pulse" />;
        }

        if (user) {
            const profileSection = (
                <Link
                    href="/profile"
                    className="flex items-center space-x-2 text-gray-700 hover:text-blue-600 transition-colors"
                    onClick={isMobile ? closeMenu : undefined}
                >
                    <div className={`${isMobile ? 'w-6 h-6' : 'w-8 h-8'} bg-blue-100 rounded-full flex items-center justify-center`}>
                        <User className="h-4 w-4 text-blue-600" />
                    </div>
                    <span className={isMobile ? '' : 'text-sm font-medium'}>
                        {user.displayName || user.email}
                    </span>
                </Link>
            );

            return isMobile ? (
                <div className="flex flex-col space-y-2 pt-4 border-t border-gray-200">
                    {profileSection}
                </div>
            ) : (
                <div className="flex items-center space-x-4">
                    {profileSection}
                </div>
            );
        }

        const authLinks = (
            <>
                <Link
                    href="/sign-in"
                    className="text-gray-700 hover:text-blue-600 transition-colors"
                    onClick={isMobile ? closeMenu : undefined}
                >
                    Sign In
                </Link>
                <Link
                    href="/sign-up"
                    className={`bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors ${isMobile ? 'text-center' : ''
                        }`}
                    onClick={isMobile ? closeMenu : undefined}
                >
                    Sign Up
                </Link>
            </>
        );

        return isMobile ? (
            <div className="flex flex-col space-y-2 pt-4 border-t border-gray-200">
                {authLinks}
            </div>
        ) : (
            <div className="flex items-center space-x-4">
                {authLinks}
            </div>
        );
    }, [loading, user, closeMenu]);

    return (
        <nav className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center h-16">
                    <Link href="/" className="flex items-center space-x-2">
                        <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                            <FileText className="h-5 w-5 text-white" />
                        </div>
                        <span className="text-xl font-bold text-gray-900">AI Resume Builder</span>
                    </Link>

                    <div className="hidden md:flex items-center space-x-8">
                        {navLinks.map(link => renderNavLink(link))}
                    </div>

                    <div className="hidden md:flex items-center space-x-4">
                        {renderAuthSection()}
                    </div>

                    <div className="md:hidden">
                        <button
                            onClick={toggleMenu}
                            className="text-gray-700 hover:text-blue-600 transition-colors"
                        >
                            {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
                        </button>
                    </div>
                </div>

                {isMenuOpen && (
                    <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        className="md:hidden border-t border-gray-200 py-4"
                    >
                        <div className="flex flex-col space-y-4">
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
