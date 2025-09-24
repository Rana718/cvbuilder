"use client";
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
    FileText, 
    Shield, 
    Users, 
    AlertTriangle, 
    Scale, 
    Lock,
    Mail, 
    Calendar,
    CheckCircle,
    XCircle,
    ArrowRight,
    ChevronRight,
    UserCheck,
    Gavel,
    Globe,
    Eye,
    Phone,
    Book,
    CreditCard,
    Ban,
    Settings,
    Zap
} from 'lucide-react';

const sections = [
    { id: 'acceptance', title: 'Acceptance of Terms' },
    { id: 'description', title: 'Service Description' },
    { id: 'user-accounts', title: 'User Accounts & Registration' },
    { id: 'acceptable-use', title: 'Acceptable Use Policy' },
    { id: 'intellectual-property', title: 'Intellectual Property' },
    { id: 'privacy', title: 'Privacy & Data Protection' },
    { id: 'payment-terms', title: 'Payment Terms' },
    { id: 'limitation-liability', title: 'Limitation of Liability' },
    { id: 'termination', title: 'Account Termination' },
    { id: 'governing-law', title: 'Governing Law' },
    { id: 'changes', title: 'Changes to Terms' },
    { id: 'contact', title: 'Contact Information' }
];

export default function TermsOfService() {
    const [activeSection, setActiveSection] = useState('acceptance');
    const [isScrolled, setIsScrolled] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 20);
            
            // Update active section based on scroll position
            const sectionElements = sections.map(section => ({
                id: section.id,
                element: document.getElementById(section.id),
            }));

            for (let i = sectionElements.length - 1; i >= 0; i--) {
                const element = sectionElements[i].element;
                if (element && element.getBoundingClientRect().top <= 100) {
                    setActiveSection(sectionElements[i].id);
                    break;
                }
            }
        };

        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const scrollToSection = (sectionId: string) => {
        const element = document.getElementById(sectionId);
        if (element) {
            element.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-purple-50/20">
            {/* Header */}
            <motion.div 
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                className={`sticky top-0 z-40 transition-all duration-300 ${
                    isScrolled 
                        ? 'bg-white/95 backdrop-blur-lg shadow-lg border-b border-gray-200/50' 
                        : 'bg-transparent'
                }`}
            >
                <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-4">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                            <div className="w-10 h-10 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg">
                                <Scale className="h-5 w-5 text-white" />
                            </div>
                            <div>
                                <h1 className="text-xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">
                                    Terms of Service
                                </h1>
                                <p className="text-sm text-gray-600">ResumeAI</p>
                            </div>
                        </div>
                        <div className="hidden md:flex items-center space-x-2 text-sm text-gray-600">
                            <Calendar className="h-4 w-4" />
                            <span>Last updated: December 2024</span>
                        </div>
                    </div>
                </div>
            </motion.div>

            <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 lg:py-12">
                <div className="flex flex-col lg:flex-row gap-8 lg:gap-12 max-w-7xl mx-auto">
                    
                    {/* Table of Contents - Desktop Sidebar */}
                    <motion.div 
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.2 }}
                        className="hidden lg:block lg:w-80 xl:w-96"
                    >
                        <div className="sticky top-32 bg-white/80 backdrop-blur-lg rounded-2xl border border-gray-200/50 shadow-lg p-6">
                            <div className="flex items-center space-x-3 mb-6">
                                <div className="w-8 h-8 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-lg flex items-center justify-center">
                                    <Book className="h-4 w-4 text-white" />
                                </div>
                                <h2 className="text-lg font-semibold text-gray-900">Table of Contents</h2>
                            </div>
                            
                            <nav className="space-y-2">
                                {sections.map((section, index) => (
                                    <motion.button
                                        key={section.id}
                                        initial={{ opacity: 0, x: -10 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        transition={{ delay: 0.1 * index }}
                                        onClick={() => scrollToSection(section.id)}
                                        className={`w-full text-left px-4 py-3 rounded-xl transition-all duration-200 flex items-center space-x-3 group ${
                                            activeSection === section.id
                                                ? 'bg-gradient-to-r from-indigo-500 to-purple-600 text-white shadow-lg'
                                                : 'text-gray-700 hover:bg-gray-100 hover:text-gray-900'
                                        }`}
                                    >
                                        <span className={`text-xs font-semibold w-6 h-6 rounded-full flex items-center justify-center ${
                                            activeSection === section.id
                                                ? 'bg-white/20 text-white'
                                                : 'bg-gray-200 text-gray-600 group-hover:bg-gray-300'
                                        }`}>
                                            {index + 1}
                                        </span>
                                        <span className="text-sm font-medium flex-1">{section.title}</span>
                                        <ChevronRight className={`h-4 w-4 transition-transform ${
                                            activeSection === section.id ? 'transform rotate-90' : ''
                                        }`} />
                                    </motion.button>
                                ))}
                            </nav>

                            {/* Legal Notice */}
                            <motion.div 
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.8 }}
                                className="mt-8 p-4 bg-gradient-to-br from-amber-50 to-orange-50 rounded-xl border border-amber-200/50"
                            >
                                <div className="flex items-center space-x-2 mb-3">
                                    <Gavel className="h-4 w-4 text-amber-600" />
                                    <span className="text-sm font-semibold text-gray-900">Legal Questions?</span>
                                </div>
                                <p className="text-xs text-gray-600 mb-3">
                                    Contact our legal team for questions about these terms and conditions.
                                </p>
                                <button className="w-full bg-gradient-to-r from-amber-500 to-orange-600 text-white text-xs font-semibold py-2 px-4 rounded-lg hover:shadow-lg transition-all duration-200">
                                    Contact Legal Team
                                </button>
                            </motion.div>
                        </div>
                    </motion.div>

                    {/* Mobile Table of Contents */}
                    <motion.div 
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                        className="lg:hidden bg-white/80 backdrop-blur-lg rounded-2xl border border-gray-200/50 shadow-lg p-4 mb-8"
                    >
                        <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                            <Book className="h-5 w-5 mr-2 text-indigo-600" />
                            Quick Navigation
                        </h2>
                        <div className="grid grid-cols-2 gap-2">
                            {sections.slice(0, 8).map((section, index) => (
                                <button
                                    key={section.id}
                                    onClick={() => scrollToSection(section.id)}
                                    className="text-left p-3 rounded-lg bg-gray-50 hover:bg-gray-100 transition-colors text-sm font-medium text-gray-700 hover:text-gray-900"
                                >
                                    {section.title}
                                </button>
                            ))}
                        </div>
                    </motion.div>

                    {/* Main Content */}
                    <div className="flex-1 max-w-4xl">
                        {/* Hero Section */}
                        <motion.div 
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="text-center mb-12 lg:mb-16"
                        >
                            <div className="inline-flex items-center bg-gradient-to-r from-indigo-100 to-purple-100 border border-indigo-200/50 text-indigo-700 px-6 py-3 rounded-full text-sm font-medium mb-6 backdrop-blur-sm">
                                <Scale className="h-4 w-4 mr-2" />
                                Legal Agreement
                            </div>
                            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-gray-900 mb-6 leading-tight">
                                Terms of 
                                <span className="block text-transparent bg-clip-text bg-gradient-to-r from-indigo-500 via-purple-600 to-pink-600">
                                    Service
                                </span>
                            </h1>
                            <p className="text-lg sm:text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
                                Please read these Terms of Service carefully before using ResumeAI. 
                                By accessing or using our service, you agree to be bound by these terms.
                            </p>
                        </motion.div>

                        {/* Content Sections */}
                        <div className="space-y-12">
                            
                            {/* Acceptance of Terms */}
                            <motion.section 
                                id="acceptance"
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.3 }}
                                className="bg-white/80 backdrop-blur-lg rounded-2xl border border-gray-200/50 shadow-lg p-6 lg:p-8"
                            >
                                <div className="flex items-start space-x-4 mb-6">
                                    <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-emerald-600 rounded-xl flex items-center justify-center shadow-lg flex-shrink-0">
                                        <CheckCircle className="h-6 w-6 text-white" />
                                    </div>
                                    <div>
                                        <h2 className="text-2xl lg:text-3xl font-bold text-gray-900 mb-3">Acceptance of Terms</h2>
                                        <p className="text-gray-600 text-lg leading-relaxed mb-6">
                                            By accessing and using ResumeAI, you accept and agree to be bound by the terms 
                                            and provisions of this agreement. If you do not agree to these terms, please do not use our service.
                                        </p>
                                    </div>
                                </div>
                                
                                <div className="grid md:grid-cols-3 gap-4 mt-6">
                                    <div className="bg-green-50 border border-green-200 rounded-xl p-4">
                                        <UserCheck className="h-6 w-6 text-green-600 mb-2" />
                                        <h3 className="font-semibold text-gray-900 mb-1">User Agreement</h3>
                                        <p className="text-sm text-gray-600">Binding legal contract upon use</p>
                                    </div>
                                    <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
                                        <Calendar className="h-6 w-6 text-blue-600 mb-2" />
                                        <h3 className="font-semibold text-gray-900 mb-1">Effective Date</h3>
                                        <p className="text-sm text-gray-600">Terms apply immediately</p>
                                    </div>
                                    <div className="bg-purple-50 border border-purple-200 rounded-xl p-4">
                                        <Globe className="h-6 w-6 text-purple-600 mb-2" />
                                        <h3 className="font-semibold text-gray-900 mb-1">Global Coverage</h3>
                                        <p className="text-sm text-gray-600">Applies to all users worldwide</p>
                                    </div>
                                </div>
                            </motion.section>

                            {/* Service Description */}
                            <motion.section 
                                id="description"
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.4 }}
                                className="bg-white/80 backdrop-blur-lg rounded-2xl border border-gray-200/50 shadow-lg p-6 lg:p-8"
                            >
                                <div className="flex items-start space-x-4 mb-6">
                                    <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center shadow-lg flex-shrink-0">
                                        <Zap className="h-6 w-6 text-white" />
                                    </div>
                                    <div>
                                        <h2 className="text-2xl lg:text-3xl font-bold text-gray-900 mb-3">Service Description</h2>
                                        <p className="text-gray-600 text-lg leading-relaxed mb-6">
                                            resumeai world is an online platform that provides AI-powered resume creation tools, 
                                            professional templates, and career enhancement features.
                                        </p>
                                    </div>
                                </div>

                                <div className="grid lg:grid-cols-2 gap-6">
                                    <div className="space-y-4">
                                        <h3 className="font-semibold text-gray-900 mb-3 flex items-center">
                                            <CheckCircle className="h-5 w-5 text-blue-600 mr-2" />
                                            Included Services
                                        </h3>
                                        <div className="space-y-3">
                                            {[
                                                'AI-powered resume content generation',
                                                'Professional resume templates',
                                                'Cover letter creation tools',
                                                'PDF and document export',
                                                'Resume analytics and feedback',
                                                'Cloud storage and synchronization'
                                            ].map((item, index) => (
                                                <div key={index} className="flex items-start space-x-3">
                                                    <CheckCircle className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                                                    <span className="text-gray-700 text-sm">{item}</span>
                                                </div>
                                            ))}
                                        </div>
                                    </div>

                                    <div className="space-y-4">
                                        <h3 className="font-semibold text-gray-900 mb-3 flex items-center">
                                            <Settings className="h-5 w-5 text-purple-600 mr-2" />
                                            Service Availability
                                        </h3>
                                        <div className="space-y-3">
                                            {[
                                                'Services provided "as is" and "as available"',
                                                'We strive for 99.9% uptime but don\'t guarantee it',
                                                'Features may change or be discontinued',
                                                'Some features require premium subscription',
                                                'Technical support during business hours',
                                                'Regular updates and improvements'
                                            ].map((item, index) => (
                                                <div key={index} className="flex items-start space-x-3">
                                                    <AlertTriangle className="h-4 w-4 text-amber-500 mt-0.5 flex-shrink-0" />
                                                    <span className="text-gray-700 text-sm">{item}</span>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            </motion.section>

                            {/* User Accounts */}
                            <motion.section 
                                id="user-accounts"
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.5 }}
                                className="bg-white/80 backdrop-blur-lg rounded-2xl border border-gray-200/50 shadow-lg p-6 lg:p-8"
                            >
                                <div className="flex items-start space-x-4 mb-6">
                                    <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-600 rounded-xl flex items-center justify-center shadow-lg flex-shrink-0">
                                        <Users className="h-6 w-6 text-white" />
                                    </div>
                                    <div>
                                        <h2 className="text-2xl lg:text-3xl font-bold text-gray-900 mb-3">User Accounts & Registration</h2>
                                        <p className="text-gray-600 text-lg leading-relaxed">
                                            You are responsible for maintaining the confidentiality of your account credentials 
                                            and for all activities that occur under your account.
                                        </p>
                                    </div>
                                </div>

                                <div className="grid md:grid-cols-2 gap-6">
                                    <div className="space-y-4">
                                        <h3 className="font-semibold text-gray-900 mb-3">Account Responsibilities</h3>
                                        <div className="space-y-3">
                                            {[
                                                'Provide accurate and complete information',
                                                'Maintain security of login credentials',
                                                'Notify us of unauthorized access',
                                                'Use only one account per person',
                                                'Keep account information up to date'
                                            ].map((item, index) => (
                                                <div key={index} className="flex items-start space-x-3">
                                                    <div className="w-2 h-2 bg-purple-500 rounded-full mt-2 flex-shrink-0"></div>
                                                    <span className="text-gray-700 text-sm">{item}</span>
                                                </div>
                                            ))}
                                        </div>
                                    </div>

                                    <div className="space-y-4">
                                        <h3 className="font-semibold text-gray-900 mb-3">Account Restrictions</h3>
                                        <div className="space-y-3">
                                            {[
                                                'Must be 18 years or older to register',
                                                'No sharing accounts with other users',
                                                'Prohibited from creating fake accounts',
                                                'Cannot transfer accounts to others',
                                                'Must comply with applicable laws'
                                            ].map((item, index) => (
                                                <div key={index} className="flex items-start space-x-3">
                                                    <div className="w-2 h-2 bg-red-500 rounded-full mt-2 flex-shrink-0"></div>
                                                    <span className="text-gray-700 text-sm">{item}</span>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            </motion.section>

                            {/* Acceptable Use */}
                            <motion.section 
                                id="acceptable-use"
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.6 }}
                                className="bg-white/80 backdrop-blur-lg rounded-2xl border border-gray-200/50 shadow-lg p-6 lg:p-8"
                            >
                                <div className="flex items-start space-x-4 mb-6">
                                    <div className="w-12 h-12 bg-gradient-to-br from-orange-500 to-red-600 rounded-xl flex items-center justify-center shadow-lg flex-shrink-0">
                                        <Shield className="h-6 w-6 text-white" />
                                    </div>
                                    <div>
                                        <h2 className="text-2xl lg:text-3xl font-bold text-gray-900 mb-3">Acceptable Use Policy</h2>
                                        <p className="text-gray-600 text-lg leading-relaxed">
                                            You agree to use our service only for lawful purposes and in accordance with these terms. 
                                            Prohibited activities may result in account suspension or termination.
                                        </p>
                                    </div>
                                </div>

                                <div className="grid lg:grid-cols-2 gap-6">
                                    <div className="p-6 bg-red-50 border border-red-200 rounded-xl">
                                        <h3 className="font-semibold text-gray-900 mb-4 flex items-center">
                                            <Ban className="h-5 w-5 text-red-600 mr-2" />
                                            Prohibited Activities
                                        </h3>
                                        <div className="space-y-3">
                                            {[
                                                'Violating any applicable laws or regulations',
                                                'Infringing on intellectual property rights',
                                                'Uploading malicious code or viruses',
                                                'Attempting to gain unauthorized access',
                                                'Interfering with service functionality',
                                                'Creating false or misleading content',
                                                'Harassing other users or staff',
                                                'Using automated tools to abuse the service'
                                            ].map((item, index) => (
                                                <div key={index} className="flex items-start space-x-3">
                                                    <XCircle className="h-4 w-4 text-red-500 mt-0.5 flex-shrink-0" />
                                                    <span className="text-gray-700 text-sm">{item}</span>
                                                </div>
                                            ))}
                                        </div>
                                    </div>

                                    <div className="p-6 bg-green-50 border border-green-200 rounded-xl">
                                        <h3 className="font-semibold text-gray-900 mb-4 flex items-center">
                                            <CheckCircle className="h-5 w-5 text-green-600 mr-2" />
                                            Encouraged Practices
                                        </h3>
                                        <div className="space-y-3">
                                            {[
                                                'Using the service for legitimate career purposes',
                                                'Providing honest and accurate information',
                                                'Respecting other users\' privacy',
                                                'Following content guidelines',
                                                'Reporting suspicious activities',
                                                'Keeping software and browsers updated',
                                                'Using strong, unique passwords',
                                                'Providing constructive feedback'
                                            ].map((item, index) => (
                                                <div key={index} className="flex items-start space-x-3">
                                                    <CheckCircle className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                                                    <span className="text-gray-700 text-sm">{item}</span>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            </motion.section>

                            {/* Intellectual Property */}
                            <motion.section 
                                id="intellectual-property"
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.7 }}
                                className="bg-white/80 backdrop-blur-lg rounded-2xl border border-gray-200/50 shadow-lg p-6 lg:p-8"
                            >
                                <div className="flex items-start space-x-4 mb-6">
                                    <div className="w-12 h-12 bg-gradient-to-br from-indigo-500 to-blue-600 rounded-xl flex items-center justify-center shadow-lg flex-shrink-0">
                                        <Lock className="h-6 w-6 text-white" />
                                    </div>
                                    <div>
                                        <h2 className="text-2xl lg:text-3xl font-bold text-gray-900 mb-3">Intellectual Property Rights</h2>
                                        <p className="text-gray-600 text-lg leading-relaxed">
                                            resumeai world and its content are protected by intellectual property laws. 
                                            We respect the intellectual property rights of others and expect users to do the same.
                                        </p>
                                    </div>
                                </div>

                                <div className="grid md:grid-cols-2 gap-6">
                                    <div className="space-y-4">
                                        <h3 className="font-semibold text-gray-900 mb-3">Our Rights</h3>
                                        <div className="p-4 bg-blue-50 border border-blue-200 rounded-xl">
                                            <div className="space-y-3">
                                                {[
                                                    'Platform design and functionality',
                                                    'Resume templates and layouts',
                                                    'AI algorithms and technology',
                                                    'Brand names, logos, and trademarks',
                                                    'Content and marketing materials'
                                                ].map((item, index) => (
                                                    <div key={index} className="flex items-start space-x-3">
                                                        <Lock className="h-4 w-4 text-blue-500 mt-0.5 flex-shrink-0" />
                                                        <span className="text-gray-700 text-sm">{item}</span>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    </div>

                                    <div className="space-y-4">
                                        <h3 className="font-semibold text-gray-900 mb-3">Your Rights</h3>
                                        <div className="p-4 bg-green-50 border border-green-200 rounded-xl">
                                            <div className="space-y-3">
                                                {[
                                                    'Ownership of your resume content',
                                                    'Personal information you provide',
                                                    'Custom modifications you make',
                                                    'Right to export your data',
                                                    'Right to delete your content'
                                                ].map((item, index) => (
                                                    <div key={index} className="flex items-start space-x-3">
                                                        <UserCheck className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                                                        <span className="text-gray-700 text-sm">{item}</span>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </motion.section>

                            {/* Payment Terms */}
                            <motion.section 
                                id="payment-terms"
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.8 }}
                                className="bg-white/80 backdrop-blur-lg rounded-2xl border border-gray-200/50 shadow-lg p-6 lg:p-8"
                            >
                                <div className="flex items-start space-x-4 mb-6">
                                    <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-emerald-600 rounded-xl flex items-center justify-center shadow-lg flex-shrink-0">
                                        <CreditCard className="h-6 w-6 text-white" />
                                    </div>
                                    <div>
                                        <h2 className="text-2xl lg:text-3xl font-bold text-gray-900 mb-3">Payment Terms</h2>
                                        <p className="text-gray-600 text-lg leading-relaxed">
                                            Our premium features require payment. All payments are processed securely through trusted 
                                            payment processors with industry-standard encryption.
                                        </p>
                                    </div>
                                </div>

                                <div className="grid md:grid-cols-3 gap-6">
                                    <div className="text-center p-6 bg-green-50 border border-green-200 rounded-xl">
                                        <div className="w-12 h-12 bg-green-600 rounded-full flex items-center justify-center mx-auto mb-4">
                                            <CreditCard className="h-6 w-6 text-white" />
                                        </div>
                                        <h3 className="font-semibold text-gray-900 mb-2">Billing</h3>
                                        <p className="text-sm text-gray-600">Automatic recurring payments for subscriptions</p>
                                    </div>

                                    <div className="text-center p-6 bg-blue-50 border border-blue-200 rounded-xl">
                                        <div className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
                                            <Shield className="h-6 w-6 text-white" />
                                        </div>
                                        <h3 className="font-semibold text-gray-900 mb-2">Security</h3>
                                        <p className="text-sm text-gray-600">PCI DSS compliant payment processing</p>
                                    </div>

                                    <div className="text-center p-6 bg-purple-50 border border-purple-200 rounded-xl">
                                        <div className="w-12 h-12 bg-purple-600 rounded-full flex items-center justify-center mx-auto mb-4">
                                            <CheckCircle className="h-6 w-6 text-white" />
                                        </div>
                                        <h3 className="font-semibold text-gray-900 mb-2">Refunds</h3>
                                        <p className="text-sm text-gray-600">30-day money-back guarantee</p>
                                    </div>
                                </div>
                            </motion.section>

                            {/* Limitation of Liability */}
                            <motion.section 
                                id="limitation-liability"
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.9 }}
                                className="bg-white/80 backdrop-blur-lg rounded-2xl border border-gray-200/50 shadow-lg p-6 lg:p-8"
                            >
                                <div className="flex items-start space-x-4 mb-6">
                                    <div className="w-12 h-12 bg-gradient-to-br from-red-500 to-pink-600 rounded-xl flex items-center justify-center shadow-lg flex-shrink-0">
                                        <AlertTriangle className="h-6 w-6 text-white" />
                                    </div>
                                    <div>
                                        <h2 className="text-2xl lg:text-3xl font-bold text-gray-900 mb-3">Limitation of Liability</h2>
                                        <p className="text-gray-600 text-lg leading-relaxed">
                                            To the maximum extent permitted by law, ResumeAI shall not be liable for any 
                                            indirect, incidental, special, consequential, or punitive damages.
                                        </p>
                                    </div>
                                </div>

                                <div className="bg-gradient-to-r from-amber-50 to-orange-50 border border-amber-200 rounded-xl p-6">
                                    <div className="flex items-start space-x-3">
                                        <AlertTriangle className="h-6 w-6 text-amber-600 mt-0.5 flex-shrink-0" />
                                        <div>
                                            <h4 className="font-semibold text-gray-900 mb-2">Important Legal Notice</h4>
                                            <p className="text-sm text-gray-600 mb-3">
                                                Our service is provided "as is" without warranties of any kind. We do not guarantee 
                                                employment outcomes, interview success, or career advancement as a result of using our platform.
                                            </p>
                                            <div className="text-xs text-gray-500">
                                                Maximum liability limited to the amount paid for our service in the month 
                                                preceding the claim.
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </motion.section>

                            {/* Termination */}
                            <motion.section 
                                id="termination"
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 1.0 }}
                                className="bg-white/80 backdrop-blur-lg rounded-2xl border border-gray-200/50 shadow-lg p-6 lg:p-8"
                            >
                                <div className="flex items-start space-x-4 mb-6">
                                    <div className="w-12 h-12 bg-gradient-to-br from-gray-500 to-gray-600 rounded-xl flex items-center justify-center shadow-lg flex-shrink-0">
                                        <Ban className="h-6 w-6 text-white" />
                                    </div>
                                    <div>
                                        <h2 className="text-2xl lg:text-3xl font-bold text-gray-900 mb-3">Account Termination</h2>
                                        <p className="text-gray-600 text-lg leading-relaxed">
                                            Either party may terminate this agreement at any time. You can delete your account 
                                            through your account settings, and we may terminate accounts that violate our terms.
                                        </p>
                                    </div>
                                </div>

                                <div className="grid md:grid-cols-2 gap-6">
                                    <div className="p-4 bg-blue-50 border border-blue-200 rounded-xl">
                                        <h3 className="font-semibold text-gray-900 mb-3">User-Initiated Termination</h3>
                                        <div className="space-y-2 text-sm text-gray-700">
                                            <div className="flex items-center space-x-2">
                                                <div className="w-1.5 h-1.5 bg-blue-500 rounded-full"></div>
                                                <span>Cancel subscription anytime</span>
                                            </div>
                                            <div className="flex items-center space-x-2">
                                                <div className="w-1.5 h-1.5 bg-blue-500 rounded-full"></div>
                                                <span>Export data before deletion</span>
                                            </div>
                                            <div className="flex items-center space-x-2">
                                                <div className="w-1.5 h-1.5 bg-blue-500 rounded-full"></div>
                                                <span>Data deleted within 30 days</span>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="p-4 bg-red-50 border border-red-200 rounded-xl">
                                        <h3 className="font-semibold text-gray-900 mb-3">Service-Initiated Termination</h3>
                                        <div className="space-y-2 text-sm text-gray-700">
                                            <div className="flex items-center space-x-2">
                                                <div className="w-1.5 h-1.5 bg-red-500 rounded-full"></div>
                                                <span>Terms of service violations</span>
                                            </div>
                                            <div className="flex items-center space-x-2">
                                                <div className="w-1.5 h-1.5 bg-red-500 rounded-full"></div>
                                                <span>Fraudulent activity</span>
                                            </div>
                                            <div className="flex items-center space-x-2">
                                                <div className="w-1.5 h-1.5 bg-red-500 rounded-full"></div>
                                                <span>Non-payment of fees</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </motion.section>

                            {/* Governing Law */}
                            <motion.section 
                                id="governing-law"
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 1.1 }}
                                className="bg-white/80 backdrop-blur-lg rounded-2xl border border-gray-200/50 shadow-lg p-6 lg:p-8"
                            >
                                <div className="flex items-start space-x-4 mb-6">
                                    <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-indigo-600 rounded-xl flex items-center justify-center shadow-lg flex-shrink-0">
                                        <Gavel className="h-6 w-6 text-white" />
                                    </div>
                                    <div>
                                        <h2 className="text-2xl lg:text-3xl font-bold text-gray-900 mb-3">Governing Law & Disputes</h2>
                                        <p className="text-gray-600 text-lg leading-relaxed">
                                            These terms are governed by the laws of the jurisdiction where our company is incorporated. 
                                            Disputes will be resolved through binding arbitration or applicable court systems.
                                        </p>
                                    </div>
                                </div>

                                <div className="bg-gradient-to-r from-purple-50 to-indigo-50 border border-purple-200 rounded-xl p-6">
                                    <h3 className="font-semibold text-gray-900 mb-4">Dispute Resolution Process</h3>
                                    <div className="grid md:grid-cols-3 gap-4">
                                        <div className="text-center p-4 bg-white rounded-lg">
                                            <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center mx-auto mb-2">
                                                <span className="text-white font-bold text-sm">1</span>
                                            </div>
                                            <h4 className="font-medium text-gray-900 mb-1">Direct Contact</h4>
                                            <p className="text-xs text-gray-600">Contact support first</p>
                                        </div>
                                        <div className="text-center p-4 bg-white rounded-lg">
                                            <div className="w-8 h-8 bg-purple-600 rounded-full flex items-center justify-center mx-auto mb-2">
                                                <span className="text-white font-bold text-sm">2</span>
                                            </div>
                                            <h4 className="font-medium text-gray-900 mb-1">Mediation</h4>
                                            <p className="text-xs text-gray-600">Attempt mediation</p>
                                        </div>
                                        <div className="text-center p-4 bg-white rounded-lg">
                                            <div className="w-8 h-8 bg-indigo-600 rounded-full flex items-center justify-center mx-auto mb-2">
                                                <span className="text-white font-bold text-sm">3</span>
                                            </div>
                                            <h4 className="font-medium text-gray-900 mb-1">Arbitration</h4>
                                            <p className="text-xs text-gray-600">Binding arbitration</p>
                                        </div>
                                    </div>
                                </div>
                            </motion.section>

                            {/* Changes to Terms */}
                            <motion.section 
                                id="changes"
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 1.2 }}
                                className="bg-white/80 backdrop-blur-lg rounded-2xl border border-gray-200/50 shadow-lg p-6 lg:p-8"
                            >
                                <div className="flex items-start space-x-4 mb-6">
                                    <div className="w-12 h-12 bg-gradient-to-br from-teal-500 to-cyan-600 rounded-xl flex items-center justify-center shadow-lg flex-shrink-0">
                                        <FileText className="h-6 w-6 text-white" />
                                    </div>
                                    <div>
                                        <h2 className="text-2xl lg:text-3xl font-bold text-gray-900 mb-3">Changes to Terms</h2>
                                        <p className="text-gray-600 text-lg leading-relaxed">
                                            We may update these terms from time to time to reflect changes in our services, 
                                            legal requirements, or business practices. We'll notify users of significant changes.
                                        </p>
                                    </div>
                                </div>

                                <div className="bg-gradient-to-r from-teal-50 to-cyan-50 border border-teal-200 rounded-xl p-6">
                                    <h3 className="font-semibold text-gray-900 mb-4">Notification Methods</h3>
                                    <div className="grid md:grid-cols-2 gap-6">
                                        <div className="space-y-3">
                                            {[
                                                { icon: Mail, text: 'Email notification to all users' },
                                                { icon: Eye, text: 'Prominent website announcement' },
                                                { icon: Calendar, text: '30-day notice for major changes' }
                                            ].map((item, index) => (
                                                <div key={index} className="flex items-center space-x-3">
                                                    <div className="w-8 h-8 bg-teal-100 rounded-lg flex items-center justify-center">
                                                        <item.icon className="h-4 w-4 text-teal-600" />
                                                    </div>
                                                    <span className="text-gray-700 text-sm">{item.text}</span>
                                                </div>
                                            ))}
                                        </div>
                                        <div className="space-y-3">
                                            {[
                                                { icon: AlertTriangle, text: 'In-app notification banner' },
                                                { icon: FileText, text: 'Updated terms page' },
                                                { icon: Calendar, text: 'Clear effective date' }
                                            ].map((item, index) => (
                                                <div key={index} className="flex items-center space-x-3">
                                                    <div className="w-8 h-8 bg-cyan-100 rounded-lg flex items-center justify-center">
                                                        <item.icon className="h-4 w-4 text-cyan-600" />
                                                    </div>
                                                    <span className="text-gray-700 text-sm">{item.text}</span>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            </motion.section>

                            {/* Contact Information */}
                            <motion.section 
                                id="contact"
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 1.3 }}
                                className="bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 border border-purple-200/50 rounded-2xl shadow-lg p-6 lg:p-8"
                            >
                                <div className="text-center mb-8">
                                    <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg">
                                        <Phone className="h-8 w-8 text-white" />
                                    </div>
                                    <h2 className="text-2xl lg:text-3xl font-bold text-gray-900 mb-3">Questions About These Terms?</h2>
                                    <p className="text-gray-600 text-lg leading-relaxed max-w-2xl mx-auto">
                                        If you have any questions about these Terms of Service, need clarification on any provisions, 
                                        or require legal assistance, please don't hesitate to contact our legal team.
                                    </p>
                                </div>

                                <div className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto">
                                    <div className="bg-white/80 backdrop-blur-lg rounded-xl border border-gray-200/50 p-6 text-center">
                                        <Mail className="h-8 w-8 text-blue-600 mx-auto mb-4" />
                                        <h3 className="font-semibold text-gray-900 mb-2">Legal Team</h3>
                                        <p className="text-sm text-gray-600 mb-4">For questions about terms and legal matters</p>
                                        <a 
                                            href="mailto:legal@airesumebuidler.com" 
                                            className="inline-flex items-center space-x-2 bg-gradient-to-r from-blue-500 to-purple-600 text-white font-semibold py-2 px-6 rounded-lg hover:shadow-lg transition-all duration-200"
                                        >
                                            <Mail className="h-4 w-4" />
                                            <span>legal@airesumebuidler.com</span>
                                        </a>
                                    </div>

                                    <div className="bg-white/80 backdrop-blur-lg rounded-xl border border-gray-200/50 p-6 text-center">
                                        <Gavel className="h-8 w-8 text-amber-600 mx-auto mb-4" />
                                        <h3 className="font-semibold text-gray-900 mb-2">General Support</h3>
                                        <p className="text-sm text-gray-600 mb-4">For general questions and account support</p>
                                        <a 
                                            href="mailto:arhaanresumeai@gmail.com" 
                                            className="inline-flex items-center space-x-2 bg-gradient-to-r from-amber-500 to-orange-600 text-white font-semibold py-2 px-6 rounded-lg hover:shadow-lg transition-all duration-200"
                                        >
                                            <Mail className="h-4 w-4" />
                                            <span>arhaanresumeai@gmail.com</span>
                                        </a>
                                    </div>
                                </div>

                                <div className="mt-8 text-center">
                                    <div className="inline-flex items-center space-x-2 text-sm text-gray-600">
                                        <Scale className="h-4 w-4" />
                                        <span>These terms are effective as of December 1, 2024</span>
                                    </div>
                                </div>
                            </motion.section>
                        </div>

                        {/* Back to Top */}
                        <motion.div 
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 1.4 }}
                            className="text-center mt-12"
                        >
                            <button 
                                onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
                                className="inline-flex items-center space-x-2 text-gray-600 hover:text-gray-900 transition-colors"
                            >
                                <ArrowRight className="h-4 w-4 transform rotate-270" />
                                <span className="text-sm font-medium">Back to Top</span>
                            </button>
                        </motion.div>
                    </div>
                </div>
            </div>
        </div>
    );
}
