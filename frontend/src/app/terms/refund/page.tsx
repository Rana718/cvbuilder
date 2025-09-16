"use client";
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
    Shield, 
    Clock, 
    CreditCard, 
    CheckCircle, 
    XCircle, 
    Mail, 
    Calendar,
    AlertTriangle,
    FileText,
    ArrowRight,
    ChevronRight,
    RefreshCcw,
    DollarSign,
    Phone,
    Hash
} from 'lucide-react';

const sections = [
    { id: 'guarantee', title: '2-Day Money Back Guarantee' },
    { id: 'eligibility', title: 'Refund Eligibility' },
    { id: 'process', title: 'How to Request a Refund' },
    { id: 'processing', title: 'Processing Time' },
    { id: 'non-refundable', title: 'Non-Refundable Items' },
    { id: 'partial-refunds', title: 'Partial Refunds' },
    { id: 'chargebacks', title: 'Chargebacks & Disputes' },
    { id: 'contact', title: 'Contact Support' }
];

export default function RefundPolicy() {
    const [activeSection, setActiveSection] = useState('guarantee');
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
                            <div className="w-10 h-10 bg-gradient-to-br from-pink-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg">
                                <RefreshCcw className="h-5 w-5 text-white" />
                            </div>
                            <div>
                                <h1 className="text-xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">
                                    Refund Policy
                                </h1>
                                <p className="text-sm text-gray-600">AI Resume Builder</p>
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
                                                ? 'bg-gradient-to-r from-pink-500 to-purple-600 text-white shadow-lg'
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
                                className="mt-8 p-4 bg-gradient-to-br from-blue-50 to-purple-50 rounded-xl border border-blue-200/50"
                            >
                                <div className="flex items-center space-x-2 mb-3">
                                    <Phone className="h-4 w-4 text-blue-600" />
                                    <span className="text-sm font-semibold text-gray-900">Need Help?</span>
                                </div>
                                <p className="text-xs text-gray-600 mb-3">
                                    Contact our support team for quick assistance with refund requests.
                                </p>
                                <button className="w-full bg-gradient-to-r from-blue-500 to-purple-600 text-white text-xs font-semibold py-2 px-4 rounded-lg hover:shadow-lg transition-all duration-200">
                                    Contact Support
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
                            {sections.slice(0, 6).map((section, index) => (
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
                            <div className="inline-flex items-center bg-gradient-to-r from-pink-100 to-purple-100 border border-pink-200/50 text-pink-700 px-6 py-3 rounded-full text-sm font-medium mb-6 backdrop-blur-sm">
                                <Shield className="h-4 w-4 mr-2" />
                                Your Satisfaction Guaranteed
                            </div>
                            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-gray-900 mb-6 leading-tight">
                                Refund 
                                <span className="block text-transparent bg-clip-text bg-gradient-to-r from-pink-500 via-purple-600 to-blue-600">
                                    Policy
                                </span>
                            </h1>
                            <p className="text-lg sm:text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
                                We stand behind our AI Resume Builder with a comprehensive refund policy. 
                                Your satisfaction is our priority, and we're committed to making things right.
                            </p>
                        </motion.div>

                        {/* Content Sections */}
                        <div className="space-y-12">
                            
                            {/* 2-Day Guarantee */}
                            <motion.section 
                                id="guarantee"
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.3 }}
                                className="bg-white/80 backdrop-blur-lg rounded-2xl border border-gray-200/50 shadow-lg p-6 lg:p-8"
                            >
                                <div className="flex items-start space-x-4 mb-6">
                                    <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-emerald-600 rounded-xl flex items-center justify-center shadow-lg flex-shrink-0">
                                        <Shield className="h-6 w-6 text-white" />
                                    </div>
                                    <div>
                                        <h2 className="text-2xl lg:text-3xl font-bold text-gray-900 mb-3">2-Day Money Back Guarantee</h2>
                                        <p className="text-gray-600 text-lg leading-relaxed">
                                            We offer a comprehensive 2-day money-back guarantee for all premium subscriptions and one-time purchases. 
                                            If you're not completely satisfied with AI Resume Builder, you can request a full refund within 2 days 
                                            of your initial purchase - no questions asked.
                                        </p>
                                    </div>
                                </div>
                                
                                <div className="grid md:grid-cols-3 gap-4 mt-6">
                                    <div className="bg-green-50 border border-green-200 rounded-xl p-4">
                                        <CheckCircle className="h-6 w-6 text-green-600 mb-2" />
                                        <h3 className="font-semibold text-gray-900 mb-1">Full Refund</h3>
                                        <p className="text-sm text-gray-600">100% money back guarantee</p>
                                    </div>
                                    <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
                                        <Calendar className="h-6 w-6 text-blue-600 mb-2" />
                                        <h3 className="font-semibold text-gray-900 mb-1">2 Days</h3>
                                        <p className="text-sm text-gray-600">Generous refund window</p>
                                    </div>
                                    <div className="bg-purple-50 border border-purple-200 rounded-xl p-4">
                                        <CheckCircle className="h-6 w-6 text-purple-600 mb-2" />
                                        <h3 className="font-semibold text-gray-900 mb-1">No Questions</h3>
                                        <p className="text-sm text-gray-600">Simple, hassle-free process</p>
                                    </div>
                                </div>
                            </motion.section>

                            {/* Eligibility */}
                            <motion.section 
                                id="eligibility"
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.4 }}
                                className="bg-white/80 backdrop-blur-lg rounded-2xl border border-gray-200/50 shadow-lg p-6 lg:p-8"
                            >
                                <div className="flex items-start space-x-4 mb-6">
                                    <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center shadow-lg flex-shrink-0">
                                        <CheckCircle className="h-6 w-6 text-white" />
                                    </div>
                                    <div>
                                        <h2 className="text-2xl lg:text-3xl font-bold text-gray-900 mb-3">Refund Eligibility Criteria</h2>
                                        <p className="text-gray-600 text-lg leading-relaxed mb-6">
                                            To ensure fair usage and maintain our service quality, please review our eligibility requirements 
                                            for refund requests. Most requests are approved automatically when these criteria are met.
                                        </p>
                                    </div>
                                </div>

                                <div className="grid lg:grid-cols-2 gap-6">
                                    <div className="space-y-4">
                                        <h3 className="font-semibold text-gray-900 mb-3 flex items-center">
                                            <CheckCircle className="h-5 w-5 text-green-600 mr-2" />
                                            Eligible Requests
                                        </h3>
                                        <div className="space-y-3">
                                            {[
                                                'Request made within 2 days of purchase',
                                                'Account in good standing with our Terms of Service',
                                                'Reasonable usage of premium features',
                                                'Valid technical or satisfaction concerns',
                                                'Proper refund request documentation'
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
                                            <XCircle className="h-5 w-5 text-red-600 mr-2" />
                                            Limitations
                                        </h3>
                                        <div className="space-y-3">
                                            {[
                                                'Excessive downloads (over 100 resumes)',
                                                'Violation of Terms of Service',
                                                'Fraudulent or duplicate accounts',
                                                'Requests after 2-day period',
                                                'Abuse of refund policy'
                                            ].map((item, index) => (
                                                <div key={index} className="flex items-start space-x-3">
                                                    <XCircle className="h-4 w-4 text-red-500 mt-0.5 flex-shrink-0" />
                                                    <span className="text-gray-700 text-sm">{item}</span>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            </motion.section>

                            {/* Request Process */}
                            <motion.section 
                                id="process"
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.5 }}
                                className="bg-white/80 backdrop-blur-lg rounded-2xl border border-gray-200/50 shadow-lg p-6 lg:p-8"
                            >
                                <div className="flex items-start space-x-4 mb-6">
                                    <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-600 rounded-xl flex items-center justify-center shadow-lg flex-shrink-0">
                                        <Mail className="h-6 w-6 text-white" />
                                    </div>
                                    <div>
                                        <h2 className="text-2xl lg:text-3xl font-bold text-gray-900 mb-3">How to Request a Refund</h2>
                                        <p className="text-gray-600 text-lg leading-relaxed">
                                            Our streamlined refund process ensures quick resolution. Follow these simple steps to submit your refund request.
                                        </p>
                                    </div>
                                </div>

                                <div className="grid md:grid-cols-2 gap-8">
                                    <div>
                                        <h3 className="font-semibold text-gray-900 mb-4">Required Information</h3>
                                        <div className="space-y-3">
                                            {[
                                                { icon: Mail, text: 'Your registered email address' },
                                                { icon: Hash, text: 'Order/Transaction ID' },
                                                { icon: Calendar, text: 'Date of purchase' },
                                                { icon: FileText, text: 'Reason for refund request' }
                                            ].map((item, index) => (
                                                <div key={index} className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                                                    <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                                                        <item.icon className="h-4 w-4 text-blue-600" />
                                                    </div>
                                                    <span className="text-gray-700 text-sm font-medium">{item.text}</span>
                                                </div>
                                            ))}
                                        </div>
                                    </div>

                                    <div>
                                        <h3 className="font-semibold text-gray-900 mb-4">Contact Methods</h3>
                                        <div className="space-y-4">
                                            <div className="p-4 bg-gradient-to-r from-blue-50 to-purple-50 border border-blue-200 rounded-xl">
                                                <div className="flex items-center space-x-2 mb-2">
                                                    <Mail className="h-5 w-5 text-blue-600" />
                                                    <span className="font-semibold text-gray-900">Email Support</span>
                                                </div>
                                                <p className="text-sm text-gray-600 mb-2">Primary method - fastest response</p>
                                                <a href="mailto:support@airesumebuidler.com" className="text-blue-600 font-medium text-sm hover:text-blue-700 transition-colors">
                                                    support@airesumebuidler.com
                                                </a>
                                            </div>

                                            <div className="p-4 bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 rounded-xl">
                                                <div className="flex items-center space-x-2 mb-2">
                                                    <Phone className="h-5 w-5 text-green-600" />
                                                    <span className="font-semibold text-gray-900">Live Chat</span>
                                                </div>
                                                <p className="text-sm text-gray-600 mb-2">Available 24/7 for urgent requests</p>
                                                <button className="bg-green-600 text-white text-xs font-semibold py-2 px-4 rounded-lg hover:bg-green-700 transition-colors">
                                                    Start Chat
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </motion.section>

                            {/* Processing Time */}
                            <motion.section 
                                id="processing"
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.6 }}
                                className="bg-white/80 backdrop-blur-lg rounded-2xl border border-gray-200/50 shadow-lg p-6 lg:p-8"
                            >
                                <div className="flex items-start space-x-4 mb-6">
                                    <div className="w-12 h-12 bg-gradient-to-br from-orange-500 to-red-600 rounded-xl flex items-center justify-center shadow-lg flex-shrink-0">
                                        <Clock className="h-6 w-6 text-white" />
                                    </div>
                                    <div>
                                        <h2 className="text-2xl lg:text-3xl font-bold text-gray-900 mb-3">Processing Timeline</h2>
                                        <p className="text-gray-600 text-lg leading-relaxed">
                                            We process refunds efficiently to get your money back as quickly as possible. Here's what to expect at each stage.
                                        </p>
                                    </div>
                                </div>

                                <div className="grid md:grid-cols-3 gap-6">
                                    <div className="text-center p-6 bg-blue-50 border border-blue-200 rounded-xl">
                                        <div className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
                                            <span className="text-white font-bold">1</span>
                                        </div>
                                        <h3 className="font-semibold text-gray-900 mb-2">Request Review</h3>
                                        <p className="text-sm text-gray-600 mb-2">24-48 hours</p>
                                        <p className="text-xs text-gray-500">Initial review and validation</p>
                                    </div>

                                    <div className="text-center p-6 bg-green-50 border border-green-200 rounded-xl">
                                        <div className="w-12 h-12 bg-green-600 rounded-full flex items-center justify-center mx-auto mb-4">
                                            <span className="text-white font-bold">2</span>
                                        </div>
                                        <h3 className="font-semibold text-gray-900 mb-2">Approval</h3>
                                        <p className="text-sm text-gray-600 mb-2">1-2 business days</p>
                                        <p className="text-xs text-gray-500">Refund approval and processing</p>
                                    </div>

                                    <div className="text-center p-6 bg-purple-50 border border-purple-200 rounded-xl">
                                        <div className="w-12 h-12 bg-purple-600 rounded-full flex items-center justify-center mx-auto mb-4">
                                            <span className="text-white font-bold">3</span>
                                        </div>
                                        <h3 className="font-semibold text-gray-900 mb-2">Credit to Account</h3>
                                        <p className="text-sm text-gray-600 mb-2">3-7 business days</p>
                                        <p className="text-xs text-gray-500">Funds appear in your account</p>
                                    </div>
                                </div>

                                <div className="mt-6 p-4 bg-yellow-50 border border-yellow-200 rounded-xl">
                                    <div className="flex items-start space-x-3">
                                        <AlertTriangle className="h-5 w-5 text-yellow-600 mt-0.5 flex-shrink-0" />
                                        <div>
                                            <h4 className="font-semibold text-gray-900 mb-1">Processing Note</h4>
                                            <p className="text-sm text-gray-600">
                                                Refund timing may vary depending on your payment method and banking institution. 
                                                Credit card refunds typically appear faster than bank transfers.
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </motion.section>

                            {/* Non-Refundable Items */}
                            <motion.section 
                                id="non-refundable"
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.7 }}
                                className="bg-white/80 backdrop-blur-lg rounded-2xl border border-gray-200/50 shadow-lg p-6 lg:p-8"
                            >
                                <div className="flex items-start space-x-4 mb-6">
                                    <div className="w-12 h-12 bg-gradient-to-br from-red-500 to-pink-600 rounded-xl flex items-center justify-center shadow-lg flex-shrink-0">
                                        <XCircle className="h-6 w-6 text-white" />
                                    </div>
                                    <div>
                                        <h2 className="text-2xl lg:text-3xl font-bold text-gray-900 mb-3">Non-Refundable Items</h2>
                                        <p className="text-gray-600 text-lg leading-relaxed">
                                            While we strive to accommodate all reasonable refund requests, certain items and situations are not eligible for refunds.
                                        </p>
                                    </div>
                                </div>

                                <div className="grid lg:grid-cols-2 gap-6">
                                    <div className="space-y-4">
                                        {[
                                            { title: 'Expired Subscriptions', desc: 'Subscriptions older than 2 days from purchase' },
                                            { title: 'Policy Violations', desc: 'Accounts that have violated our Terms of Service' },
                                            { title: 'Free Accounts', desc: 'Free trial accounts with no payment made' }
                                        ].map((item, index) => (
                                            <div key={index} className="p-4 border border-red-200 bg-red-50 rounded-xl">
                                                <div className="flex items-start space-x-3">
                                                    <XCircle className="h-5 w-5 text-red-600 mt-0.5 flex-shrink-0" />
                                                    <div>
                                                        <h4 className="font-semibold text-gray-900 mb-1">{item.title}</h4>
                                                        <p className="text-sm text-gray-600">{item.desc}</p>
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>

                                    <div className="space-y-4">
                                        {[
                                            { title: 'Excessive Usage', desc: 'Accounts with abnormally high usage patterns' },
                                            { title: 'Fraudulent Activity', desc: 'Accounts involved in fraudulent or suspicious activity' },
                                            { title: 'Third-party Services', desc: 'Costs for third-party integrations or services' }
                                        ].map((item, index) => (
                                            <div key={index} className="p-4 border border-red-200 bg-red-50 rounded-xl">
                                                <div className="flex items-start space-x-3">
                                                    <XCircle className="h-5 w-5 text-red-600 mt-0.5 flex-shrink-0" />
                                                    <div>
                                                        <h4 className="font-semibold text-gray-900 mb-1">{item.title}</h4>
                                                        <p className="text-sm text-gray-600">{item.desc}</p>
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </motion.section>

                            {/* Partial Refunds */}
                            <motion.section 
                                id="partial-refunds"
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.8 }}
                                className="bg-white/80 backdrop-blur-lg rounded-2xl border border-gray-200/50 shadow-lg p-6 lg:p-8"
                            >
                                <div className="flex items-start space-x-4 mb-6">
                                    <div className="w-12 h-12 bg-gradient-to-br from-yellow-500 to-orange-600 rounded-xl flex items-center justify-center shadow-lg flex-shrink-0">
                                        <DollarSign className="h-6 w-6 text-white" />
                                    </div>
                                    <div>
                                        <h2 className="text-2xl lg:text-3xl font-bold text-gray-900 mb-3">Partial Refunds</h2>
                                        <p className="text-gray-600 text-lg leading-relaxed">
                                            In certain situations, we may offer partial refunds based on usage and circumstances. 
                                            These are evaluated on a case-by-case basis.
                                        </p>
                                    </div>
                                </div>

                                <div className="bg-gradient-to-r from-yellow-50 to-orange-50 border border-yellow-200 rounded-xl p-6">
                                    <h3 className="font-semibold text-gray-900 mb-4">Partial Refund Scenarios</h3>
                                    <div className="grid md:grid-cols-2 gap-4">
                                        {[
                                            'Subscription cancelled mid-cycle with limited usage',
                                            'Technical issues affecting service for extended periods',
                                            'Feature limitations discovered after purchase',
                                            'Downgrade from premium to basic plan'
                                        ].map((item, index) => (
                                            <div key={index} className="flex items-start space-x-3">
                                                <div className="w-2 h-2 bg-yellow-500 rounded-full mt-2 flex-shrink-0"></div>
                                                <span className="text-sm text-gray-700">{item}</span>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </motion.section>

                            {/* Chargebacks */}
                            <motion.section 
                                id="chargebacks"
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.9 }}
                                className="bg-white/80 backdrop-blur-lg rounded-2xl border border-gray-200/50 shadow-lg p-6 lg:p-8"
                            >
                                <div className="flex items-start space-x-4 mb-6">
                                    <div className="w-12 h-12 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg flex-shrink-0">
                                        <CreditCard className="h-6 w-6 text-white" />
                                    </div>
                                    <div>
                                        <h2 className="text-2xl lg:text-3xl font-bold text-gray-900 mb-3">Chargebacks & Disputes</h2>
                                        <p className="text-gray-600 text-lg leading-relaxed">
                                            Before initiating a chargeback, please contact us directly. We resolve most issues quickly 
                                            and can often provide faster resolution than the chargeback process.
                                        </p>
                                    </div>
                                </div>

                                <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-xl p-6">
                                    <div className="flex items-start space-x-3">
                                        <AlertTriangle className="h-6 w-6 text-blue-600 mt-0.5 flex-shrink-0" />
                                        <div>
                                            <h4 className="font-semibold text-gray-900 mb-2">Important Notice</h4>
                                            <p className="text-sm text-gray-600 mb-3">
                                                Chargebacks may result in account suspension and additional fees. We prefer to work 
                                                with you directly to resolve any payment disputes amicably.
                                            </p>
                                            <div className="flex items-center space-x-2">
                                                <ArrowRight className="h-4 w-4 text-blue-600" />
                                                <span className="text-sm font-medium text-blue-600">Contact us first at support@airesumebuidler.com</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </motion.section>

                            {/* Contact Support */}
                            <motion.section 
                                id="contact"
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 1.0 }}
                                className="bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 border border-purple-200/50 rounded-2xl shadow-lg p-6 lg:p-8"
                            >
                                <div className="text-center mb-8">
                                    <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg">
                                        <Phone className="h-8 w-8 text-white" />
                                    </div>
                                    <h2 className="text-2xl lg:text-3xl font-bold text-gray-900 mb-3">Need Help? Contact Our Support Team</h2>
                                    <p className="text-gray-600 text-lg leading-relaxed max-w-2xl mx-auto">
                                        Our dedicated support team is here to help with any questions about refunds, billing, or account issues. 
                                        We typically respond within 2-4 hours during business days.
                                    </p>
                                </div>

                                <div className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto">
                                    <div className="bg-white/80 backdrop-blur-lg rounded-xl border border-gray-200/50 p-6 text-center">
                                        <Mail className="h-8 w-8 text-blue-600 mx-auto mb-4" />
                                        <h3 className="font-semibold text-gray-900 mb-2">Email Support</h3>
                                        <p className="text-sm text-gray-600 mb-4">For detailed refund requests and documentation</p>
                                        <a 
                                            href="mailto:support@airesumebuidler.com" 
                                            className="inline-flex items-center space-x-2 bg-gradient-to-r from-blue-500 to-purple-600 text-white font-semibold py-2 px-6 rounded-lg hover:shadow-lg transition-all duration-200"
                                        >
                                            <Mail className="h-4 w-4" />
                                            <span>Send Email</span>
                                        </a>
                                    </div>

                                    <div className="bg-white/80 backdrop-blur-lg rounded-xl border border-gray-200/50 p-6 text-center">
                                        <Phone className="h-8 w-8 text-green-600 mx-auto mb-4" />
                                        <h3 className="font-semibold text-gray-900 mb-2">Live Chat</h3>
                                        <p className="text-sm text-gray-600 mb-4">Get immediate assistance with urgent requests</p>
                                        <button className="inline-flex items-center space-x-2 bg-gradient-to-r from-green-500 to-emerald-600 text-white font-semibold py-2 px-6 rounded-lg hover:shadow-lg transition-all duration-200">
                                            <Phone className="h-4 w-4" />
                                            <span>Start Chat</span>
                                        </button>
                                    </div>
                                </div>

                                <div className="mt-8 text-center">
                                    <div className="inline-flex items-center space-x-2 text-sm text-gray-600">
                                        <Clock className="h-4 w-4" />
                                        <span>Support Hours: Monday - Friday, 9 AM - 6 PM PST</span>
                                    </div>
                                </div>
                            </motion.section>
                        </div>

                        {/* Back to Top */}
                        <motion.div 
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 1.2 }}
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
