"use client";
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
    Shield, 
    Lock, 
    Eye, 
    Users, 
    Database, 
    Globe,
    Mail, 
    Calendar,
    AlertTriangle,
    FileText,
    ArrowRight,
    ChevronRight,
    UserCheck,
    Settings,
    Share2,
    Cookie,
    Phone,
    Server,
    Trash2,
    Edit,
    Download
} from 'lucide-react';

const sections = [
    { id: 'overview', title: 'Privacy Overview' },
    { id: 'information-collected', title: 'Information We Collect' },
    { id: 'how-we-use', title: 'How We Use Your Information' },
    { id: 'data-sharing', title: 'Data Sharing & Disclosure' },
    { id: 'data-security', title: 'Data Security & Protection' },
    { id: 'your-rights', title: 'Your Privacy Rights' },
    { id: 'cookies', title: 'Cookies & Tracking' },
    { id: 'data-retention', title: 'Data Retention' },
    { id: 'international-transfers', title: 'International Data Transfers' },
    { id: 'updates', title: 'Policy Updates' },
    { id: 'contact', title: 'Contact Us' }
];

export default function PrivacyPolicy() {
    const [activeSection, setActiveSection] = useState('overview');
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
                            <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg">
                                <Shield className="h-5 w-5 text-white" />
                            </div>
                            <div>
                                <h1 className="text-xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">
                                    Privacy Policy
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
                                <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                                    <FileText className="h-4 w-4 text-white" />
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
                                                ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-lg'
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

                            {/* Quick Contact */}
                            <motion.div 
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.8 }}
                                className="mt-8 p-4 bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl border border-green-200/50"
                            >
                                <div className="flex items-center space-x-2 mb-3">
                                    <UserCheck className="h-4 w-4 text-green-600" />
                                    <span className="text-sm font-semibold text-gray-900">Privacy Questions?</span>
                                </div>
                                <p className="text-xs text-gray-600 mb-3">
                                    Contact our privacy team for questions about data handling and your rights.
                                </p>
                                <button className="w-full bg-gradient-to-r from-green-500 to-emerald-600 text-white text-xs font-semibold py-2 px-4 rounded-lg hover:shadow-lg transition-all duration-200">
                                    Contact Privacy Team
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
                            <FileText className="h-5 w-5 mr-2 text-blue-600" />
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
                            <div className="inline-flex items-center bg-gradient-to-r from-blue-100 to-purple-100 border border-blue-200/50 text-blue-700 px-6 py-3 rounded-full text-sm font-medium mb-6 backdrop-blur-sm">
                                <Shield className="h-4 w-4 mr-2" />
                                Your Privacy Matters
                            </div>
                            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-gray-900 mb-6 leading-tight">
                                Privacy 
                                <span className="block text-transparent bg-clip-text bg-gradient-to-r from-blue-500 via-purple-600 to-pink-600">
                                    Policy
                                </span>
                            </h1>
                            <p className="text-lg sm:text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
                                We are committed to protecting your privacy and ensuring transparency in how we collect, 
                                use, and safeguard your personal information while using ResumeAI.
                            </p>
                        </motion.div>

                        {/* Content Sections */}
                        <div className="space-y-12">
                            
                            {/* Privacy Overview */}
                            <motion.section 
                                id="overview"
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.3 }}
                                className="bg-white/80 backdrop-blur-lg rounded-2xl border border-gray-200/50 shadow-lg p-6 lg:p-8"
                            >
                                <div className="flex items-start space-x-4 mb-6">
                                    <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center shadow-lg flex-shrink-0">
                                        <Eye className="h-6 w-6 text-white" />
                                    </div>
                                    <div>
                                        <h2 className="text-2xl lg:text-3xl font-bold text-gray-900 mb-3">Privacy Overview</h2>
                                        <p className="text-gray-600 text-lg leading-relaxed">
                                            At ResumeAI, we believe privacy is a fundamental right. This policy explains how we handle 
                                            your personal data with care, transparency, and in compliance with global privacy regulations 
                                            including GDPR, CCPA, and other applicable laws.
                                        </p>
                                    </div>
                                </div>
                                
                                <div className="grid md:grid-cols-3 gap-4 mt-6">
                                    <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
                                        <Lock className="h-6 w-6 text-blue-600 mb-2" />
                                        <h3 className="font-semibold text-gray-900 mb-1">Data Protection</h3>
                                        <p className="text-sm text-gray-600">Enterprise-grade security measures</p>
                                    </div>
                                    <div className="bg-green-50 border border-green-200 rounded-xl p-4">
                                        <UserCheck className="h-6 w-6 text-green-600 mb-2" />
                                        <h3 className="font-semibold text-gray-900 mb-1">Your Rights</h3>
                                        <p className="text-sm text-gray-600">Full control over your data</p>
                                    </div>
                                    <div className="bg-purple-50 border border-purple-200 rounded-xl p-4">
                                        <Globe className="h-6 w-6 text-purple-600 mb-2" />
                                        <h3 className="font-semibold text-gray-900 mb-1">Global Compliance</h3>
                                        <p className="text-sm text-gray-600">GDPR, CCPA compliant</p>
                                    </div>
                                </div>
                            </motion.section>

                            {/* Information We Collect */}
                            <motion.section 
                                id="information-collected"
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.4 }}
                                className="bg-white/80 backdrop-blur-lg rounded-2xl border border-gray-200/50 shadow-lg p-6 lg:p-8"
                            >
                                <div className="flex items-start space-x-4 mb-6">
                                    <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-emerald-600 rounded-xl flex items-center justify-center shadow-lg flex-shrink-0">
                                        <Database className="h-6 w-6 text-white" />
                                    </div>
                                    <div>
                                        <h2 className="text-2xl lg:text-3xl font-bold text-gray-900 mb-3">Information We Collect</h2>
                                        <p className="text-gray-600 text-lg leading-relaxed mb-6">
                                            We collect only the information necessary to provide you with the best resume building experience. 
                                            Here's exactly what we collect and why we need it.
                                        </p>
                                    </div>
                                </div>

                                <div className="grid lg:grid-cols-2 gap-6">
                                    <div className="space-y-4">
                                        <h3 className="font-semibold text-gray-900 mb-3 flex items-center">
                                            <Users className="h-5 w-5 text-blue-600 mr-2" />
                                            Personal Information
                                        </h3>
                                        <div className="space-y-3">
                                            {[
                                                { title: 'Account Information', desc: 'Name, email address, password' },
                                                { title: 'Profile Data', desc: 'Professional details, work experience, education' },
                                                { title: 'Contact Details', desc: 'Phone number, address (optional)' },
                                                { title: 'Resume Content', desc: 'Skills, achievements, project details' }
                                            ].map((item, index) => (
                                                <div key={index} className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
                                                    <h4 className="font-medium text-gray-900 mb-1">{item.title}</h4>
                                                    <p className="text-sm text-gray-600">{item.desc}</p>
                                                </div>
                                            ))}
                                        </div>
                                    </div>

                                    <div className="space-y-4">
                                        <h3 className="font-semibold text-gray-900 mb-3 flex items-center">
                                            <Settings className="h-5 w-5 text-purple-600 mr-2" />
                                            Technical Information
                                        </h3>
                                        <div className="space-y-3">
                                            {[
                                                { title: 'Usage Analytics', desc: 'Feature usage, session duration, preferences' },
                                                { title: 'Device Information', desc: 'Browser type, operating system, IP address' },
                                                { title: 'Cookies & Storage', desc: 'Session data, preferences, authentication' },
                                                { title: 'Payment Data', desc: 'Billing information, transaction history' }
                                            ].map((item, index) => (
                                                <div key={index} className="p-3 bg-purple-50 border border-purple-200 rounded-lg">
                                                    <h4 className="font-medium text-gray-900 mb-1">{item.title}</h4>
                                                    <p className="text-sm text-gray-600">{item.desc}</p>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            </motion.section>

                            {/* How We Use Information */}
                            <motion.section 
                                id="how-we-use"
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.5 }}
                                className="bg-white/80 backdrop-blur-lg rounded-2xl border border-gray-200/50 shadow-lg p-6 lg:p-8"
                            >
                                <div className="flex items-start space-x-4 mb-6">
                                    <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-600 rounded-xl flex items-center justify-center shadow-lg flex-shrink-0">
                                        <Settings className="h-6 w-6 text-white" />
                                    </div>
                                    <div>
                                        <h2 className="text-2xl lg:text-3xl font-bold text-gray-900 mb-3">How We Use Your Information</h2>
                                        <p className="text-gray-600 text-lg leading-relaxed">
                                            Your data is used exclusively to enhance your experience and provide our resume building services. 
                                            We never sell your personal information to third parties.
                                        </p>
                                    </div>
                                </div>

                                <div className="grid md:grid-cols-2 gap-6">
                                    <div className="space-y-4">
                                        <h3 className="font-semibold text-gray-900 mb-3">Core Services</h3>
                                        <div className="space-y-3">
                                            {[
                                                'Create and customize professional resumes',
                                                'AI-powered content suggestions and improvements',
                                                'Template personalization and formatting',
                                                'Account management and user authentication',
                                                'Progress saving and data synchronization'
                                            ].map((item, index) => (
                                                <div key={index} className="flex items-start space-x-3">
                                                    <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
                                                    <span className="text-gray-700 text-sm">{item}</span>
                                                </div>
                                            ))}
                                        </div>
                                    </div>

                                    <div className="space-y-4">
                                        <h3 className="font-semibold text-gray-900 mb-3">Service Enhancement</h3>
                                        <div className="space-y-3">
                                            {[
                                                'Payment processing and billing management',
                                                'Customer support and technical assistance',
                                                'Product improvements and new feature development',
                                                'Security monitoring and fraud prevention',
                                                'Communication about updates and features'
                                            ].map((item, index) => (
                                                <div key={index} className="flex items-start space-x-3">
                                                    <div className="w-2 h-2 bg-purple-500 rounded-full mt-2 flex-shrink-0"></div>
                                                    <span className="text-gray-700 text-sm">{item}</span>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            </motion.section>

                            {/* Data Sharing */}
                            <motion.section 
                                id="data-sharing"
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.6 }}
                                className="bg-white/80 backdrop-blur-lg rounded-2xl border border-gray-200/50 shadow-lg p-6 lg:p-8"
                            >
                                <div className="flex items-start space-x-4 mb-6">
                                    <div className="w-12 h-12 bg-gradient-to-br from-orange-500 to-red-600 rounded-xl flex items-center justify-center shadow-lg flex-shrink-0">
                                        <Share2 className="h-6 w-6 text-white" />
                                    </div>
                                    <div>
                                        <h2 className="text-2xl lg:text-3xl font-bold text-gray-900 mb-3">Data Sharing & Disclosure</h2>
                                        <p className="text-gray-600 text-lg leading-relaxed">
                                            We maintain strict controls over your data and only share information in limited, specific circumstances 
                                            that are clearly outlined below.
                                        </p>
                                    </div>
                                </div>

                                <div className="grid lg:grid-cols-2 gap-6">
                                    <div className="p-6 bg-green-50 border border-green-200 rounded-xl">
                                        <h3 className="font-semibold text-gray-900 mb-4 flex items-center">
                                            <UserCheck className="h-5 w-5 text-green-600 mr-2" />
                                            What We Don't Share
                                        </h3>
                                        <div className="space-y-3">
                                            {[
                                                'Personal resume content or career details',
                                                'Contact information or personal identifiers',
                                                'Account passwords or authentication data',
                                                'Payment information or financial details',
                                                'Individual usage patterns or behaviors'
                                            ].map((item, index) => (
                                                <div key={index} className="flex items-start space-x-3">
                                                    <Lock className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                                                    <span className="text-gray-700 text-sm">{item}</span>
                                                </div>
                                            ))}
                                        </div>
                                    </div>

                                    <div className="p-6 bg-blue-50 border border-blue-200 rounded-xl">
                                        <h3 className="font-semibold text-gray-900 mb-4 flex items-center">
                                            <Share2 className="h-5 w-5 text-blue-600 mr-2" />
                                            Limited Sharing Scenarios
                                        </h3>
                                        <div className="space-y-3">
                                            {[
                                                'Legal compliance when required by law',
                                                'Service providers with strict confidentiality',
                                                'Anonymized analytics for product improvement',
                                                'Business transfers with privacy protection',
                                                'Security threats and fraud prevention'
                                            ].map((item, index) => (
                                                <div key={index} className="flex items-start space-x-3">
                                                    <AlertTriangle className="h-4 w-4 text-blue-500 mt-0.5 flex-shrink-0" />
                                                    <span className="text-gray-700 text-sm">{item}</span>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            </motion.section>

                            {/* Data Security */}
                            <motion.section 
                                id="data-security"
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.7 }}
                                className="bg-white/80 backdrop-blur-lg rounded-2xl border border-gray-200/50 shadow-lg p-6 lg:p-8"
                            >
                                <div className="flex items-start space-x-4 mb-6">
                                    <div className="w-12 h-12 bg-gradient-to-br from-red-500 to-pink-600 rounded-xl flex items-center justify-center shadow-lg flex-shrink-0">
                                        <Shield className="h-6 w-6 text-white" />
                                    </div>
                                    <div>
                                        <h2 className="text-2xl lg:text-3xl font-bold text-gray-900 mb-3">Data Security & Protection</h2>
                                        <p className="text-gray-600 text-lg leading-relaxed">
                                            We implement industry-leading security measures to protect your personal information against 
                                            unauthorized access, alteration, disclosure, or destruction.
                                        </p>
                                    </div>
                                </div>

                                <div className="grid md:grid-cols-3 gap-6">
                                    <div className="text-center p-6 bg-blue-50 border border-blue-200 rounded-xl">
                                        <div className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
                                            <Lock className="h-6 w-6 text-white" />
                                        </div>
                                        <h3 className="font-semibold text-gray-900 mb-2">Encryption</h3>
                                        <p className="text-sm text-gray-600">256-bit SSL encryption for all data transmission and storage</p>
                                    </div>

                                    <div className="text-center p-6 bg-green-50 border border-green-200 rounded-xl">
                                        <div className="w-12 h-12 bg-green-600 rounded-full flex items-center justify-center mx-auto mb-4">
                                            <Server className="h-6 w-6 text-white" />
                                        </div>
                                        <h3 className="font-semibold text-gray-900 mb-2">Secure Hosting</h3>
                                        <p className="text-sm text-gray-600">Enterprise-grade cloud infrastructure with 99.9% uptime</p>
                                    </div>

                                    <div className="text-center p-6 bg-purple-50 border border-purple-200 rounded-xl">
                                        <div className="w-12 h-12 bg-purple-600 rounded-full flex items-center justify-center mx-auto mb-4">
                                            <Eye className="h-6 w-6 text-white" />
                                        </div>
                                        <h3 className="font-semibold text-gray-900 mb-2">Monitoring</h3>
                                        <p className="text-sm text-gray-600">24/7 security monitoring and threat detection systems</p>
                                    </div>
                                </div>

                                <div className="mt-6 p-4 bg-gradient-to-r from-blue-50 to-purple-50 border border-blue-200 rounded-xl">
                                    <h4 className="font-semibold text-gray-900 mb-2">Additional Security Measures</h4>
                                    <div className="grid md:grid-cols-2 gap-4 text-sm text-gray-700">
                                        <div className="space-y-2">
                                            <div className="flex items-center space-x-2">
                                                <div className="w-1.5 h-1.5 bg-blue-500 rounded-full"></div>
                                                <span>Multi-factor authentication support</span>
                                            </div>
                                            <div className="flex items-center space-x-2">
                                                <div className="w-1.5 h-1.5 bg-blue-500 rounded-full"></div>
                                                <span>Regular security audits and penetration testing</span>
                                            </div>
                                        </div>
                                        <div className="space-y-2">
                                            <div className="flex items-center space-x-2">
                                                <div className="w-1.5 h-1.5 bg-purple-500 rounded-full"></div>
                                                <span>Employee security training and background checks</span>
                                            </div>
                                            <div className="flex items-center space-x-2">
                                                <div className="w-1.5 h-1.5 bg-purple-500 rounded-full"></div>
                                                <span>Data backup and disaster recovery procedures</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </motion.section>

                            {/* Your Rights */}
                            <motion.section 
                                id="your-rights"
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.8 }}
                                className="bg-white/80 backdrop-blur-lg rounded-2xl border border-gray-200/50 shadow-lg p-6 lg:p-8"
                            >
                                <div className="flex items-start space-x-4 mb-6">
                                    <div className="w-12 h-12 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg flex-shrink-0">
                                        <UserCheck className="h-6 w-6 text-white" />
                                    </div>
                                    <div>
                                        <h2 className="text-2xl lg:text-3xl font-bold text-gray-900 mb-3">Your Privacy Rights</h2>
                                        <p className="text-gray-600 text-lg leading-relaxed">
                                            You have full control over your personal data. We provide easy-to-use tools and processes 
                                            to exercise your privacy rights at any time.
                                        </p>
                                    </div>
                                </div>

                                <div className="grid md:grid-cols-2 gap-6">
                                    {[
                                        {
                                            icon: Eye,
                                            title: 'Right to Access',
                                            desc: 'Request a copy of all personal data we have about you',
                                            color: 'blue'
                                        },
                                        {
                                            icon: Edit,
                                            title: 'Right to Rectification',
                                            desc: 'Correct any inaccurate or incomplete personal information',
                                            color: 'green'
                                        },
                                        {
                                            icon: Trash2,
                                            title: 'Right to Erasure',
                                            desc: 'Request deletion of your personal data and account',
                                            color: 'red'
                                        },
                                        {
                                            icon: Download,
                                            title: 'Data Portability',
                                            desc: 'Download your data in a machine-readable format',
                                            color: 'purple'
                                        }
                                    ].map((right, index) => (
                                        <div key={index} className={`p-6 bg-${right.color}-50 border border-${right.color}-200 rounded-xl`}>
                                            <div className={`w-10 h-10 bg-${right.color}-600 rounded-lg flex items-center justify-center mb-4`}>
                                                <right.icon className="h-5 w-5 text-white" />
                                            </div>
                                            <h3 className="font-semibold text-gray-900 mb-2">{right.title}</h3>
                                            <p className="text-sm text-gray-600">{right.desc}</p>
                                        </div>
                                    ))}
                                </div>

                                <div className="mt-6 p-4 bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 rounded-xl">
                                    <div className="flex items-start space-x-3">
                                        <Mail className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
                                        <div>
                                            <h4 className="font-semibold text-gray-900 mb-1">Exercise Your Rights</h4>
                                            <p className="text-sm text-gray-600 mb-3">
                                                To exercise any of these rights, contact our privacy team at privacy@airesumebuidler.com. 
                                                We respond to all requests within 30 days.
                                            </p>
                                            <button className="bg-gradient-to-r from-green-500 to-emerald-600 text-white text-sm font-semibold py-2 px-4 rounded-lg hover:shadow-lg transition-all duration-200">
                                                Contact Privacy Team
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </motion.section>

                            {/* Cookies & Tracking */}
                            <motion.section 
                                id="cookies"
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.9 }}
                                className="bg-white/80 backdrop-blur-lg rounded-2xl border border-gray-200/50 shadow-lg p-6 lg:p-8"
                            >
                                <div className="flex items-start space-x-4 mb-6">
                                    <div className="w-12 h-12 bg-gradient-to-br from-yellow-500 to-orange-600 rounded-xl flex items-center justify-center shadow-lg flex-shrink-0">
                                        <Cookie className="h-6 w-6 text-white" />
                                    </div>
                                    <div>
                                        <h2 className="text-2xl lg:text-3xl font-bold text-gray-900 mb-3">Cookies & Tracking</h2>
                                        <p className="text-gray-600 text-lg leading-relaxed">
                                            We use cookies and similar technologies to enhance your experience, remember your preferences, 
                                            and analyze how our service is used.
                                        </p>
                                    </div>
                                </div>

                                <div className="grid lg:grid-cols-3 gap-6">
                                    {[
                                        {
                                            title: 'Essential Cookies',
                                            desc: 'Required for basic website functionality and security',
                                            items: ['Authentication', 'Session management', 'Security features', 'Basic functionality'],
                                            color: 'green'
                                        },
                                        {
                                            title: 'Analytics Cookies',
                                            desc: 'Help us understand how users interact with our service',
                                            items: ['Usage statistics', 'Performance metrics', 'Error tracking', 'Feature adoption'],
                                            color: 'blue'
                                        },
                                        {
                                            title: 'Preference Cookies',
                                            desc: 'Remember your settings and personalize your experience',
                                            items: ['UI preferences', 'Language settings', 'Theme choices', 'Saved templates'],
                                            color: 'purple'
                                        }
                                    ].map((category, index) => (
                                        <div key={index} className={`p-6 bg-${category.color}-50 border border-${category.color}-200 rounded-xl`}>
                                            <h3 className="font-semibold text-gray-900 mb-2">{category.title}</h3>
                                            <p className="text-sm text-gray-600 mb-4">{category.desc}</p>
                                            <div className="space-y-2">
                                                {category.items.map((item, itemIndex) => (
                                                    <div key={itemIndex} className="flex items-center space-x-2">
                                                        <div className={`w-1.5 h-1.5 bg-${category.color}-500 rounded-full`}></div>
                                                        <span className="text-xs text-gray-600">{item}</span>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </motion.section>

                            {/* Data Retention */}
                            <motion.section 
                                id="data-retention"
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 1.0 }}
                                className="bg-white/80 backdrop-blur-lg rounded-2xl border border-gray-200/50 shadow-lg p-6 lg:p-8"
                            >
                                <div className="flex items-start space-x-4 mb-6">
                                    <div className="w-12 h-12 bg-gradient-to-br from-teal-500 to-cyan-600 rounded-xl flex items-center justify-center shadow-lg flex-shrink-0">
                                        <Database className="h-6 w-6 text-white" />
                                    </div>
                                    <div>
                                        <h2 className="text-2xl lg:text-3xl font-bold text-gray-900 mb-3">Data Retention</h2>
                                        <p className="text-gray-600 text-lg leading-relaxed">
                                            We retain your personal data only for as long as necessary to provide our services 
                                            and comply with legal obligations.
                                        </p>
                                    </div>
                                </div>

                                <div className="bg-gradient-to-r from-teal-50 to-cyan-50 border border-teal-200 rounded-xl p-6">
                                    <h3 className="font-semibold text-gray-900 mb-4">Retention Periods</h3>
                                    <div className="grid md:grid-cols-2 gap-6">
                                        <div className="space-y-3">
                                            {[
                                                { type: 'Active Account Data', period: 'While account is active' },
                                                { type: 'Resume Content', period: 'Until deletion requested' },
                                                { type: 'Payment Records', period: '7 years (legal requirement)' }
                                            ].map((item, index) => (
                                                <div key={index} className="flex justify-between items-center p-3 bg-white rounded-lg">
                                                    <span className="text-sm font-medium text-gray-900">{item.type}</span>
                                                    <span className="text-sm text-gray-600">{item.period}</span>
                                                </div>
                                            ))}
                                        </div>
                                        <div className="space-y-3">
                                            {[
                                                { type: 'Analytics Data', period: '2 years maximum' },
                                                { type: 'Support Communications', period: '3 years' },
                                                { type: 'Deleted Account Data', period: '30 days backup retention' }
                                            ].map((item, index) => (
                                                <div key={index} className="flex justify-between items-center p-3 bg-white rounded-lg">
                                                    <span className="text-sm font-medium text-gray-900">{item.type}</span>
                                                    <span className="text-sm text-gray-600">{item.period}</span>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            </motion.section>

                            {/* International Transfers */}
                            <motion.section 
                                id="international-transfers"
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 1.1 }}
                                className="bg-white/80 backdrop-blur-lg rounded-2xl border border-gray-200/50 shadow-lg p-6 lg:p-8"
                            >
                                <div className="flex items-start space-x-4 mb-6">
                                    <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center shadow-lg flex-shrink-0">
                                        <Globe className="h-6 w-6 text-white" />
                                    </div>
                                    <div>
                                        <h2 className="text-2xl lg:text-3xl font-bold text-gray-900 mb-3">International Data Transfers</h2>
                                        <p className="text-gray-600 text-lg leading-relaxed">
                                            Your data may be processed in countries other than your own. We ensure appropriate 
                                            safeguards are in place for all international data transfers.
                                        </p>
                                    </div>
                                </div>

                                <div className="grid md:grid-cols-2 gap-6">
                                    <div className="p-6 bg-blue-50 border border-blue-200 rounded-xl">
                                        <h3 className="font-semibold text-gray-900 mb-3">Transfer Safeguards</h3>
                                        <div className="space-y-2">
                                            {[
                                                'EU-US Data Privacy Framework compliance',
                                                'Standard Contractual Clauses (SCCs)',
                                                'Adequacy decisions recognition',
                                                'Regular compliance audits'
                                            ].map((item, index) => (
                                                <div key={index} className="flex items-start space-x-3">
                                                    <Shield className="h-4 w-4 text-blue-500 mt-0.5 flex-shrink-0" />
                                                    <span className="text-sm text-gray-700">{item}</span>
                                                </div>
                                            ))}
                                        </div>
                                    </div>

                                    <div className="p-6 bg-green-50 border border-green-200 rounded-xl">
                                        <h3 className="font-semibold text-gray-900 mb-3">Data Locations</h3>
                                        <div className="space-y-2">
                                            {[
                                                'Primary servers: United States (AWS)',
                                                'Backup systems: European Union',
                                                'CDN: Global network with regional optimization',
                                                'Analytics: Anonymized, region-specific'
                                            ].map((item, index) => (
                                                <div key={index} className="flex items-start space-x-3">
                                                    <Server className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                                                    <span className="text-sm text-gray-700">{item}</span>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            </motion.section>

                            {/* Policy Updates */}
                            <motion.section 
                                id="updates"
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 1.2 }}
                                className="bg-white/80 backdrop-blur-lg rounded-2xl border border-gray-200/50 shadow-lg p-6 lg:p-8"
                            >
                                <div className="flex items-start space-x-4 mb-6">
                                    <div className="w-12 h-12 bg-gradient-to-br from-orange-500 to-red-600 rounded-xl flex items-center justify-center shadow-lg flex-shrink-0">
                                        <Calendar className="h-6 w-6 text-white" />
                                    </div>
                                    <div>
                                        <h2 className="text-2xl lg:text-3xl font-bold text-gray-900 mb-3">Policy Updates</h2>
                                        <p className="text-gray-600 text-lg leading-relaxed">
                                            We may update this privacy policy from time to time. We'll notify you of any significant 
                                            changes and provide clear information about what has changed.
                                        </p>
                                    </div>
                                </div>

                                <div className="bg-gradient-to-r from-orange-50 to-red-50 border border-orange-200 rounded-xl p-6">
                                    <h3 className="font-semibold text-gray-900 mb-4">How We Notify You</h3>
                                    <div className="grid md:grid-cols-3 gap-4">
                                        <div className="text-center p-4 bg-white rounded-lg">
                                            <Mail className="h-8 w-8 text-orange-600 mx-auto mb-2" />
                                            <h4 className="font-medium text-gray-900 mb-1">Email Notification</h4>
                                            <p className="text-xs text-gray-600">30 days advance notice</p>
                                        </div>
                                        <div className="text-center p-4 bg-white rounded-lg">
                                            <AlertTriangle className="h-8 w-8 text-red-600 mx-auto mb-2" />
                                            <h4 className="font-medium text-gray-900 mb-1">In-App Banner</h4>
                                            <p className="text-xs text-gray-600">Prominent notification</p>
                                        </div>
                                        <div className="text-center p-4 bg-white rounded-lg">
                                            <Calendar className="h-8 w-8 text-purple-600 mx-auto mb-2" />
                                            <h4 className="font-medium text-gray-900 mb-1">Effective Date</h4>
                                            <p className="text-xs text-gray-600">Clear implementation timeline</p>
                                        </div>
                                    </div>
                                </div>
                            </motion.section>

                            {/* Contact Section */}
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
                                    <h2 className="text-2xl lg:text-3xl font-bold text-gray-900 mb-3">Questions About Your Privacy?</h2>
                                    <p className="text-gray-600 text-lg leading-relaxed max-w-2xl mx-auto">
                                        Our dedicated privacy team is here to help with any questions about how we handle your data, 
                                        your privacy rights, or this policy. We typically respond within 24 hours.
                                    </p>
                                </div>

                                <div className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto">
                                    <div className="bg-white/80 backdrop-blur-lg rounded-xl border border-gray-200/50 p-6 text-center">
                                        <Mail className="h-8 w-8 text-blue-600 mx-auto mb-4" />
                                        <h3 className="font-semibold text-gray-900 mb-2">Privacy Team</h3>
                                        <p className="text-sm text-gray-600 mb-4">For privacy-related questions and data requests</p>
                                        <a 
                                            href="mailto:privacy@airesumebuidler.com" 
                                            className="inline-flex items-center space-x-2 bg-gradient-to-r from-blue-500 to-purple-600 text-white font-semibold py-2 px-6 rounded-lg hover:shadow-lg transition-all duration-200"
                                        >
                                            <Mail className="h-4 w-4" />
                                            <span>privacy@airesumebuidler.com</span>
                                        </a>
                                    </div>

                                    <div className="bg-white/80 backdrop-blur-lg rounded-xl border border-gray-200/50 p-6 text-center">
                                        <UserCheck className="h-8 w-8 text-green-600 mx-auto mb-4" />
                                        <h3 className="font-semibold text-gray-900 mb-2">Data Protection Officer</h3>
                                        <p className="text-sm text-gray-600 mb-4">For formal privacy complaints and escalations</p>
                                        <a 
                                            href="mailto:dpo@airesumebuidler.com" 
                                            className="inline-flex items-center space-x-2 bg-gradient-to-r from-green-500 to-emerald-600 text-white font-semibold py-2 px-6 rounded-lg hover:shadow-lg transition-all duration-200"
                                        >
                                            <Mail className="h-4 w-4" />
                                            <span>dpo@airesumebuidler.com</span>
                                        </a>
                                    </div>
                                </div>

                                <div className="mt-8 text-center">
                                    <div className="inline-flex items-center space-x-2 text-sm text-gray-600">
                                        <Shield className="h-4 w-4" />
                                        <span>Your privacy is our priority - we're here to help</span>
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
