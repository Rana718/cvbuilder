"use client";
import { motion, AnimatePresence } from 'framer-motion';
import { FileText, User, X, Menu, FolderOpen, Mail, TrendingUp, BarChart3, Sparkles, ChevronDown, Plus, RefreshCw, Star, BookOpen } from 'lucide-react';
import { useAuth } from './AuthContext';
import React, { useState, useCallback, useRef, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

const resumeDropdownItems = [
    { href: '/resusme', icon: FolderOpen, label: 'My Resumes' },
    { href: '/template', icon: Plus, label: 'Create New Resume' },
    { href: '/resusme/parse', icon: RefreshCw, label: 'Use Old Resume' },
    { href: '/resusme/rateing', icon: Star, label: 'Resume Rating' },
];

const coverLetterDropdownItems = [
    { href: '/cover-letter/create', icon: Plus, label: 'Create Cover Letter' },
    { href: '/cover-letter', icon: Mail, label: 'My Cover Letters' },
];

interface DropdownProps {
    label: string;
    items: typeof resumeDropdownItems;
    icon: React.ElementType;
    isActive: boolean;
    isMobile?: boolean;
    onItemClick?: () => void;
}

const Dropdown: React.FC<DropdownProps> = ({ label, items, icon: Icon, isActive, isMobile = false, onItemClick }) => {
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);
    const timeoutRef = useRef<NodeJS.Timeout | null>(null);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const handleMouseEnter = () => {
        if (!isMobile) {
            if (timeoutRef.current) clearTimeout(timeoutRef.current);
            setIsOpen(true);
        }
    };

    const handleMouseLeave = () => {
        if (!isMobile) {
            timeoutRef.current = setTimeout(() => setIsOpen(false), 150);
        }
    };

    const handleClick = () => {
        if (isMobile) {
            setIsOpen(!isOpen);
        }
    };

    const handleItemClick = () => {
        setIsOpen(false);
        if (onItemClick) {
            onItemClick();
        }
    };

    if (isMobile) {
        return (
            <div className="w-full">
                <button
                    onClick={handleClick}
                    className={`w-full flex items-center justify-between px-4 py-3 text-left transition-all duration-300 rounded-lg ${
                        isActive 
                            ? 'text-blue-600 bg-blue-50 font-semibold' 
                            : 'text-gray-700 hover:text-blue-600 hover:bg-blue-50/50'
                    }`}
                >
                    <div className="flex items-center space-x-3">
                        <Icon className={`h-5 w-5 ${isActive ? 'text-blue-600' : 'text-gray-500'} transition-colors duration-200`} />
                        <span className="text-base font-medium">{label}</span>
                    </div>
                    <motion.div
                        animate={{ rotate: isOpen ? 180 : 0 }}
                        transition={{ duration: 0.2 }}
                    >
                        <ChevronDown className={`h-4 w-4 ${isActive ? 'text-blue-600' : 'text-gray-500'} transition-colors duration-200`} />
                    </motion.div>
                </button>

                <AnimatePresence>
                    {isOpen && (
                        <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: 'auto' }}
                            exit={{ opacity: 0, height: 0 }}
                            transition={{ duration: 0.2 }}
                            className="overflow-hidden ml-4 mt-1"
                        >
                            {items.map((item, index) => (
                                <motion.div
                                    key={item.href}
                                    initial={{ opacity: 0, x: -10 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: index * 0.05 }}
                                >
                                    <Link
                                        href={item.href}
                                        className="flex items-center space-x-3 px-4 py-3 text-gray-600 hover:text-blue-600 hover:bg-blue-50/30 rounded-lg transition-all duration-200 border-l-2 border-transparent hover:border-blue-200"
                                        onClick={handleItemClick}
                                    >
                                        <item.icon className="h-4 w-4 text-gray-400" />
                                        <span className="text-sm font-medium">{item.label}</span>
                                    </Link>
                                </motion.div>
                            ))}
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        );
    }

    // Desktop dropdown (unchanged)
    return (
        <div 
            className="relative" 
            ref={dropdownRef}
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
        >
            <button
                onClick={handleClick}
                className={`relative transition-all duration-300 flex items-center space-x-2 px-3 py-2 rounded-lg group ${
                    isActive 
                        ? 'text-blue-600 font-semibold' 
                        : 'text-gray-700 hover:text-blue-600 hover:bg-blue-50/50'
                }`}
            >
                <Icon className={`h-4 w-4 ${isActive ? 'text-blue-600' : 'group-hover:text-blue-600'} transition-colors duration-200`} />
                <span className="text-sm">{label}</span>
                <motion.div
                    animate={{ rotate: isOpen ? 180 : 0 }}
                    transition={{ duration: 0.2 }}
                >
                    <ChevronDown className={`h-3 w-3 ${isActive ? 'text-blue-600' : 'group-hover:text-blue-600'} transition-colors duration-200`} />
                </motion.div>
                
                <motion.div
                    className="absolute bottom-0 left-3 right-3 h-0.5 bg-blue-600 rounded-full"
                    initial={{ scaleX: 0 }}
                    animate={{ scaleX: isActive ? 1 : 0 }}
                    transition={{ duration: 0.2 }}
                />
            </button>

            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: -10, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: -10, scale: 0.95 }}
                        transition={{ duration: 0.15 }}
                        className="absolute top-full left-0 mt-2 w-56 bg-white rounded-xl shadow-xl border border-gray-200/80 backdrop-blur-lg py-2 z-50 overflow-hidden"
                        style={{ boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)' }}
                    >
                        {items.map((item, index) => (
                            <motion.div
                                key={item.href}
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: index * 0.05 }}
                            >
                                <Link
                                    href={item.href}
                                    className="flex items-center space-x-3 px-4 py-3 text-gray-700 hover:text-blue-600 hover:bg-blue-50/50 transition-all duration-200 group"
                                    onClick={() => setIsOpen(false)}
                                >
                                    <item.icon className="h-4 w-4 text-gray-500 group-hover:text-blue-600 transition-colors duration-200" />
                                    <span className="text-sm font-medium">{item.label}</span>
                                </Link>
                            </motion.div>
                        ))}
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

function Navbar() {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const { user, loading } = useAuth();
    const pathname = usePathname();

    const isActiveDropdown = useCallback((items: typeof resumeDropdownItems) => {
        return items.some(item => pathname.startsWith(item.href.split('?')[0]));
    }, [pathname]);

    const isActiveLink = useCallback((href: string) => pathname === href, [pathname]);

    const closeMenu = useCallback(() => setIsMenuOpen(false), []);

    const toggleMenu = useCallback(() => setIsMenuOpen(prev => !prev), []);

    const renderAuthSection = useCallback((isMobile = false) => {
        if (loading) {
            return (
                <div className={`flex items-center space-x-2 ${isMobile ? 'justify-center py-3' : ''}`}>
                    <div className="w-8 h-8 bg-gray-200 rounded-full animate-pulse" />
                    {!isMobile && <div className="w-12 h-3 bg-gray-200 rounded animate-pulse" />}
                </div>
            );
        }

        if (user) {
            const profileSection = (
                <Link
                    href="/profile"
                    className={`flex items-center space-x-2 text-gray-700 hover:text-blue-600 transition-colors px-3 py-2 rounded-lg hover:bg-blue-50 group ${isMobile ? 'w-full' : ''}`}
                    onClick={isMobile ? closeMenu : undefined}
                >
                    <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center shadow-sm">
                        {user.photoURL ? (
                            <img 
                                src={user.photoURL} 
                                alt="Profile" 
                                className="w-8 h-8 rounded-full object-cover" 
                            />
                        ) : (
                            <User className="h-4 w-4 text-white" />
                        )}
                    </div>
                    <div className={`${isMobile ? 'flex-1' : 'hidden lg:block'}`}>
                        <p className="text-sm font-medium text-gray-900 group-hover:text-blue-600 transition-colors">
                            {user.displayName || user.email?.split('@')[0] || 'User'}
                        </p>
                        <p className="text-xs text-gray-500">
                            View Profile
                        </p>
                    </div>
                </Link>
            );

            if (isMobile) {
                return (
                    <div className="border-t border-gray-200 pt-4 mt-4">
                        {profileSection}
                    </div>
                );
            }

            return profileSection;
        }

        if (isMobile) {
            return (
                <div className="border-t border-gray-200 pt-4 mt-4 flex flex-col gap-3">
                    <Link
                        href="/sign-in"
                        className="w-full border border-gray-200 text-gray-700 hover:text-blue-600 transition-all duration-200 px-4 py-2 rounded-lg hover:bg-blue-50 font-medium text-center"
                        onClick={closeMenu}
                    >
                        Sign In
                    </Link>
                    <Link
                        href="/sign-up"
                        className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-blue-600 to-blue-700 text-white px-4 py-2 rounded-lg hover:from-blue-700 hover:to-blue-800 transition-all duration-200 font-medium shadow-sm hover:shadow-md text-center"
                        onClick={closeMenu}
                    >
                        <Sparkles className="w-4 h-4" />
                        <span>Sign Up Free</span>
                    </Link>
                </div>
            );
        }

        return (
            <div className="flex items-center gap-3">
                <Link
                    href="/sign-in"
                    className="text-gray-700 hover:text-blue-600 transition-all duration-200 px-4 py-2 rounded-lg hover:bg-blue-50 font-medium text-sm"
                >
                    Sign In
                </Link>
                <Link
                    href="/sign-up"
                    className="inline-flex items-center gap-2 bg-gradient-to-r from-blue-600 to-blue-700 text-white px-4 py-2 rounded-lg hover:from-blue-700 hover:to-blue-800 transition-all duration-200 font-medium shadow-sm hover:shadow-md text-sm"
                >
                    <Sparkles className="w-4 h-4" />
                    <span>Sign Up Free</span>
                </Link>
            </div>
        );
    }, [loading, user, closeMenu]);

    const renderNavLink = useCallback((href: string, Icon: React.ElementType, label: string, isMobile = false) => {
        const isActive = isActiveLink(href);
        const baseClasses = `relative transition-colors flex items-center space-x-2 px-3 py-2 rounded-lg group ${
            isActive 
                ? 'text-blue-600 font-medium' 
                : 'text-gray-700 hover:text-blue-600 hover:bg-blue-50'
        } ${isMobile ? 'w-full' : ''}`;

        return (
            <Link
                key={href}
                href={href}
                className={baseClasses}
                onClick={isMobile ? closeMenu : undefined}
            >
                <Icon className={`h-4 w-4 ${isActive ? 'text-blue-600' : 'group-hover:text-blue-600'} transition-colors`} />
                <span className="text-sm font-medium">{label}</span>
                
                {!isMobile && (
                    <motion.div
                        className="absolute bottom-0 left-2 right-2 h-0.5 bg-blue-600 rounded-full"
                        initial={{ scaleX: 0 }}
                        animate={{ scaleX: isActive ? 1 : 0 }}
                        transition={{ duration: 0.2 }}
                    />
                )}
            </Link>
        );
    }, [isActiveLink, closeMenu]);

    return (
        <nav className="bg-white/95 backdrop-blur-sm shadow-sm border-b border-gray-200 sticky top-0 z-50">
            <div className="max-w-7xl mx-auto px-4">
                <div className="flex justify-between items-center h-14">
                    {/* Logo */}
                    <Link href="/" className="flex items-center group" onClick={closeMenu}>
                        <img 
                            src="/img/logo.png" 
                            alt="Logo" 
                            className="h-8 w-auto object-contain" 
                            style={{ maxHeight: '32px' }}
                        />
                    </Link>

                    {/* Desktop Navigation */}
                    <div className="hidden lg:flex items-center space-x-1">
                        {renderNavLink('/dashboard', BarChart3, 'Dashboard')}
                        
                        <Dropdown
                            label="Resume"
                            items={resumeDropdownItems}
                            icon={FolderOpen}
                            isActive={isActiveDropdown(resumeDropdownItems)}
                        />
                        
                        <Dropdown
                            label="Cover Letters"
                            items={coverLetterDropdownItems}
                            icon={Mail}
                            isActive={isActiveDropdown(coverLetterDropdownItems)}
                        />
                        
                        {renderNavLink('/blog', BookOpen, 'Blog')}
                    </div>

                    {/* Desktop Auth Section */}
                    <div className="hidden lg:flex items-center">
                        {renderAuthSection()}
                    </div>

                    {/* Mobile Menu Button */}
                    <div className="lg:hidden">
                        <button
                            onClick={toggleMenu}
                            className="text-gray-700 hover:text-blue-600 transition-colors p-2 rounded-lg hover:bg-blue-50"
                        >
                            {isMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
                        </button>
                    </div>
                </div>

                {/* Mobile Menu */}
                <AnimatePresence>
                    {isMenuOpen && (
                        <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: 'auto' }}
                            exit={{ opacity: 0, height: 0 }}
                            transition={{ duration: 0.3, ease: "easeInOut" }}
                            className="lg:hidden border-t border-gray-200/50 overflow-hidden"
                        >
                            <div className="py-4 space-y-2 max-h-[calc(100vh-4rem)] overflow-y-auto">
                                {/* Navigation Links */}
                                <div className="space-y-1">
                                    {renderNavLink('/dashboard', BarChart3, 'Dashboard', true)}
                                    
                                    <Dropdown
                                        label="Resume"
                                        items={resumeDropdownItems}
                                        icon={FolderOpen}
                                        isActive={isActiveDropdown(resumeDropdownItems)}
                                        isMobile={true}
                                        onItemClick={closeMenu}
                                    />
                                    
                                    <Dropdown
                                        label="Cover Letters"
                                        items={coverLetterDropdownItems}
                                        icon={Mail}
                                        isActive={isActiveDropdown(coverLetterDropdownItems)}
                                        isMobile={true}
                                        onItemClick={closeMenu}
                                    />
                                    
                                    {renderNavLink('/blog', BookOpen, 'Blog', true)}
                                </div>
                                
                                {/* Auth Section */}
                                {renderAuthSection(true)}
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </nav>
    );
}

export default Navbar;