"use client";
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
    Truck, 
    Package, 
    Clock, 
    MapPin, 
    RefreshCcw, 
    Shield, 
    Mail, 
    Calendar,
    AlertTriangle,
    FileText,
    ArrowRight,
    ChevronRight,
    Globe,
    Phone,
    CheckCircle,
    XCircle,
    CreditCard,
    Download,
    Upload,
    Zap,
    DollarSign
} from 'lucide-react';

const sections = [
    { id: 'overview', title: 'Digital Service Overview' },
    { id: 'delivery', title: 'Service Delivery' },
    { id: 'access', title: 'Access & Downloads' },
    { id: 'exchanges', title: 'Service Exchanges' },
    { id: 'modifications', title: 'Template Modifications' },
    { id: 'technical-support', title: 'Technical Support' },
    { id: 'satisfaction', title: 'Satisfaction Guarantee' },
    { id: 'limitations', title: 'Service Limitations' },
    { id: 'contact', title: 'Contact Support' }
];

export default function ShippingAndExchange() {
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
                            <div className="w-10 h-10 bg-gradient-to-br from-green-500 to-blue-600 rounded-xl flex items-center justify-center shadow-lg">
                                <Truck className="h-5 w-5 text-white" />
                            </div>
                            <div>
                                <h1 className="text-xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">
                                    Service Delivery & Exchange
                                </h1>
                                <p className="text-sm text-gray-600">ResumeAI</p>
                            </div>
                        </div>
                        <div className="hidden md:flex items-center space-x-2 text-sm text-gray-600">
                            <Calendar className="h-4 w-4" />
                            <span>Last updated: September 2025</span>
                        </div>
                    </div>
                </div>
            </motion.div>

            <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
                    {/* Navigation Sidebar */}
                    <motion.div 
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.1 }}
                        className="lg:col-span-1"
                    >
                        <div className="sticky top-24">
                            <div className="bg-white/80 backdrop-blur-sm rounded-xl shadow-lg border border-gray-200/50 p-6">
                                <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                                    <FileText className="h-5 w-5 mr-2 text-blue-600" />
                                    Contents
                                </h3>
                                <nav className="space-y-2">
                                    {sections.map((section) => (
                                        <button
                                            key={section.id}
                                            onClick={() => scrollToSection(section.id)}
                                            className={`w-full text-left px-3 py-2 rounded-sm text-sm transition-all duration-200 flex items-center justify-between group ${
                                                activeSection === section.id
                                                    ? 'bg-blue-50 text-blue-700'
                                                    : 'text-gray-600 hover:text-blue-600 hover:bg-gray-50'
                                            }`}
                                        >
                                            <span>{section.title}</span>
                                            <ChevronRight className={`h-4 w-4 transition-transform ${
                                                activeSection === section.id ? 'rotate-90' : 'group-hover:translate-x-1'
                                            }`} />
                                        </button>
                                    ))}
                                </nav>
                            </div>
                        </div>
                    </motion.div>

                    {/* Main Content */}
                    <motion.div 
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                        className="lg:col-span-3"
                    >
                        <div className="space-y-8">
                            {/* Overview Section */}
                            <section id="overview" className="bg-white/80 backdrop-blur-sm rounded-xl shadow-lg border border-gray-200/50 p-8">
                                <div className="flex items-start space-x-4 mb-6">
                                    <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-blue-600 rounded-xl flex items-center justify-center flex-shrink-0">
                                        <Globe className="h-6 w-6 text-white" />
                                    </div>
                                    <div>
                                        <h2 className="text-2xl font-bold text-gray-900 mb-2">Digital Service Overview</h2>
                                        <p className="text-gray-600">Understanding our digital service delivery model</p>
                                    </div>
                                </div>

                                <div className="prose prose-gray max-w-none">
                                    <p className="text-gray-700 leading-relaxed mb-4">
                                        ResumeAI is a digital service platform that provides instant access to AI-powered resume creation tools, 
                                        templates, and career resources. Since our services are entirely digital, there are no physical products 
                                        to ship or traditional shipping policies to consider.
                                    </p>

                                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
                                        <div className="flex items-start space-x-3">
                                            <Zap className="h-5 w-5 text-blue-600 flex-shrink-0 mt-0.5" />
                                            <div>
                                                <h4 className="font-semibold text-blue-900 mb-1">Instant Digital Access</h4>
                                                <p className="text-blue-800 text-sm">
                                                    All our services and features are delivered instantly upon successful payment and account creation.
                                                </p>
                                            </div>
                                        </div>
                                    </div>

                                    <h3 className="text-xl font-semibold text-gray-900 mb-3">What We Deliver:</h3>
                                    <ul className="space-y-3 mb-6">
                                        <li className="flex items-start space-x-3">
                                            <CheckCircle className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
                                            <span className="text-gray-700">Access to AI-powered resume builder platform</span>
                                        </li>
                                        <li className="flex items-start space-x-3">
                                            <CheckCircle className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
                                            <span className="text-gray-700">Professional resume templates and designs</span>
                                        </li>
                                        <li className="flex items-start space-x-3">
                                            <CheckCircle className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
                                            <span className="text-gray-700">Cover letter creation tools</span>
                                        </li>
                                        <li className="flex items-start space-x-3">
                                            <CheckCircle className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
                                            <span className="text-gray-700">Resume analysis and optimization features</span>
                                        </li>
                                        <li className="flex items-start space-x-3">
                                            <CheckCircle className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
                                            <span className="text-gray-700">Downloadable documents in multiple formats (PDF, DOCX)</span>
                                        </li>
                                    </ul>
                                </div>
                            </section>

                            {/* Service Delivery */}
                            <section id="delivery" className="bg-white/80 backdrop-blur-sm rounded-xl shadow-lg border border-gray-200/50 p-8">
                                <div className="flex items-start space-x-4 mb-6">
                                    <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-600 rounded-xl flex items-center justify-center flex-shrink-0">
                                        <Package className="h-6 w-6 text-white" />
                                    </div>
                                    <div>
                                        <h2 className="text-2xl font-bold text-gray-900 mb-2">Service Delivery</h2>
                                        <p className="text-gray-600">How and when you receive access to our services</p>
                                    </div>
                                </div>

                                <div className="grid md:grid-cols-2 gap-6 mb-6">
                                    <div className="bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 rounded-lg p-6">
                                        <div className="flex items-center space-x-3 mb-3">
                                            <Clock className="h-6 w-6 text-green-600" />
                                            <h3 className="text-lg font-semibold text-green-900">Instant Activation</h3>
                                        </div>
                                        <p className="text-green-800 text-sm mb-3">
                                            Your account is activated immediately upon successful payment processing.
                                        </p>
                                        <ul className="text-green-700 text-sm space-y-1">
                                            <li>• Payment verification: 30 seconds - 2 minutes</li>
                                            <li>• Account activation: Immediate</li>
                                            <li>• Feature access: Instant</li>
                                        </ul>
                                    </div>

                                    <div className="bg-gradient-to-r from-blue-50 to-cyan-50 border border-blue-200 rounded-lg p-6">
                                        <div className="flex items-center space-x-3 mb-3">
                                            <Mail className="h-6 w-6 text-blue-600" />
                                            <h3 className="text-lg font-semibold text-blue-900">Email Confirmation</h3>
                                        </div>
                                        <p className="text-blue-800 text-sm mb-3">
                                            You'll receive confirmation and access details via email.
                                        </p>
                                        <ul className="text-blue-700 text-sm space-y-1">
                                            <li>• Welcome email with login details</li>
                                            <li>• Service activation confirmation</li>
                                            <li>• Getting started guide</li>
                                        </ul>
                                    </div>
                                </div>

                                <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
                                    <div className="flex items-start space-x-3">
                                        <AlertTriangle className="h-5 w-5 text-amber-600 flex-shrink-0 mt-0.5" />
                                        <div>
                                            <h4 className="font-semibold text-amber-900 mb-1">Delivery Delays</h4>
                                            <p className="text-amber-800 text-sm">
                                                In rare cases, payment verification may take up to 24 hours. If you experience delays, 
                                                please contact our support team for immediate assistance.
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </section>

                            {/* Access & Downloads */}
                            <section id="access" className="bg-white/80 backdrop-blur-sm rounded-xl shadow-lg border border-gray-200/50 p-8">
                                <div className="flex items-start space-x-4 mb-6">
                                    <div className="w-12 h-12 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl flex items-center justify-center flex-shrink-0">
                                        <Download className="h-6 w-6 text-white" />
                                    </div>
                                    <div>
                                        <h2 className="text-2xl font-bold text-gray-900 mb-2">Access & Downloads</h2>
                                        <p className="text-gray-600">Managing your digital assets and downloads</p>
                                    </div>
                                </div>

                                <div className="space-y-6">
                                    <div>
                                        <h3 className="text-xl font-semibold text-gray-900 mb-4">Download Capabilities</h3>
                                        <div className="grid md:grid-cols-3 gap-4">
                                            <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 text-center">
                                                <FileText className="h-8 w-8 text-red-600 mx-auto mb-2" />
                                                <h4 className="font-semibold text-gray-900 mb-1">PDF Format</h4>
                                                <p className="text-gray-600 text-sm">High-quality, print-ready resumes</p>
                                            </div>
                                            <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 text-center">
                                                <FileText className="h-8 w-8 text-blue-600 mx-auto mb-2" />
                                                <h4 className="font-semibold text-gray-900 mb-1">DOCX Format</h4>
                                                <p className="text-gray-600 text-sm">Editable Word documents</p>
                                            </div>
                                            <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 text-center">
                                                <Globe className="h-8 w-8 text-green-600 mx-auto mb-2" />
                                                <h4 className="font-semibold text-gray-900 mb-1">Online Access</h4>
                                                <p className="text-gray-600 text-sm">Edit anytime, anywhere</p>
                                            </div>
                                        </div>
                                    </div>

                                    <div>
                                        <h3 className="text-xl font-semibold text-gray-900 mb-3">Access Policies</h3>
                                        <ul className="space-y-3">
                                            <li className="flex items-start space-x-3">
                                                <CheckCircle className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
                                                <span className="text-gray-700">Unlimited downloads during subscription period</span>
                                            </li>
                                            <li className="flex items-start space-x-3">
                                                <CheckCircle className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
                                                <span className="text-gray-700">24/7 online platform access</span>
                                            </li>
                                            <li className="flex items-start space-x-3">
                                                <CheckCircle className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
                                                <span className="text-gray-700">Cloud storage for all your resumes</span>
                                            </li>
                                            <li className="flex items-start space-x-3">
                                                <CheckCircle className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
                                                <span className="text-gray-700">Cross-device synchronization</span>
                                            </li>
                                        </ul>
                                    </div>
                                </div>
                            </section>

                            {/* Service Exchanges */}
                            <section id="exchanges" className="bg-white/80 backdrop-blur-sm rounded-xl shadow-lg border border-gray-200/50 p-8">
                                <div className="flex items-start space-x-4 mb-6">
                                    <div className="w-12 h-12 bg-gradient-to-br from-orange-500 to-red-600 rounded-xl flex items-center justify-center flex-shrink-0">
                                        <RefreshCcw className="h-6 w-6 text-white" />
                                    </div>
                                    <div>
                                        <h2 className="text-2xl font-bold text-gray-900 mb-2">Service Exchanges</h2>
                                        <p className="text-gray-600">How to modify or exchange your service plan</p>
                                    </div>
                                </div>

                                <div className="space-y-6">
                                    <div>
                                        <h3 className="text-xl font-semibold text-gray-900 mb-4">Plan Upgrades & Changes</h3>
                                        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-lg p-6 mb-4">
                                            <h4 className="font-semibold text-blue-900 mb-2">Instant Upgrades Available</h4>
                                            <p className="text-blue-800 text-sm mb-3">
                                                You can upgrade your plan at any time to access additional features and templates.
                                            </p>
                                            <ul className="text-blue-700 text-sm space-y-1">
                                                <li>• Immediate access to new features</li>
                                                <li>• Pro-rated billing for upgrade differences</li>
                                                <li>• No service interruption</li>
                                            </ul>
                                        </div>
                                    </div>

                                    <div>
                                        <h3 className="text-xl font-semibold text-gray-900 mb-3">Exchange Policies</h3>
                                        <div className="grid md:grid-cols-2 gap-6">
                                            <div className="border border-green-200 rounded-lg p-4">
                                                <div className="flex items-center space-x-2 mb-2">
                                                    <CheckCircle className="h-5 w-5 text-green-600" />
                                                    <h4 className="font-semibold text-green-900">Allowed Exchanges</h4>
                                                </div>
                                                <ul className="text-green-700 text-sm space-y-1">
                                                    <li>• Plan upgrades (any time)</li>
                                                    <li>• Template style changes</li>
                                                    <li>• Feature additions</li>
                                                    <li>• Billing cycle modifications</li>
                                                </ul>
                                            </div>

                                            <div className="border border-red-200 rounded-lg p-4">
                                                <div className="flex items-center space-x-2 mb-2">
                                                    <XCircle className="h-5 w-5 text-red-600" />
                                                    <h4 className="font-semibold text-red-900">Limited Exchanges</h4>
                                                </div>
                                                <ul className="text-red-700 text-sm space-y-1">
                                                    <li>• Plan downgrades (restrictions apply)</li>
                                                    <li>• Service cancellations (see refund policy)</li>
                                                    <li>• Custom template requests</li>
                                                </ul>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </section>

                            {/* Template Modifications */}
                            <section id="modifications" className="bg-white/80 backdrop-blur-sm rounded-xl shadow-lg border border-gray-200/50 p-8">
                                <div className="flex items-start space-x-4 mb-6">
                                    <div className="w-12 h-12 bg-gradient-to-br from-teal-500 to-green-600 rounded-xl flex items-center justify-center flex-shrink-0">
                                        <Upload className="h-6 w-6 text-white" />
                                    </div>
                                    <div>
                                        <h2 className="text-2xl font-bold text-gray-900 mb-2">Template Modifications</h2>
                                        <p className="text-gray-600">Customizing and personalizing your resume templates</p>
                                    </div>
                                </div>

                                <div className="space-y-6">
                                    <div>
                                        <h3 className="text-xl font-semibold text-gray-900 mb-4">Available Modifications</h3>
                                        <div className="grid md:grid-cols-2 gap-4">
                                            <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                                                <h4 className="font-semibold text-green-900 mb-2">Free Customizations</h4>
                                                <ul className="text-green-700 text-sm space-y-1">
                                                    <li>• Color scheme changes</li>
                                                    <li>• Font selections</li>
                                                    <li>• Section reordering</li>
                                                    <li>• Content modifications</li>
                                                    <li>• Layout adjustments</li>
                                                </ul>
                                            </div>

                                            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                                                <h4 className="font-semibold text-blue-900 mb-2">Premium Features</h4>
                                                <ul className="text-blue-700 text-sm space-y-1">
                                                    <li>• Advanced design elements</li>
                                                    <li>• Custom branding options</li>
                                                    <li>• Premium template access</li>
                                                    <li>• Multi-page layouts</li>
                                                    <li>• Portfolio integration</li>
                                                </ul>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
                                        <div className="flex items-start space-x-3">
                                            <AlertTriangle className="h-5 w-5 text-amber-600 flex-shrink-0 mt-0.5" />
                                            <div>
                                                <h4 className="font-semibold text-amber-900 mb-1">Modification Limitations</h4>
                                                <p className="text-amber-800 text-sm">
                                                    While we offer extensive customization options, certain template structural 
                                                    changes may not be possible due to design constraints. Our support team can 
                                                    help you find alternative solutions.
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </section>

                            {/* Technical Support */}
                            <section id="technical-support" className="bg-white/80 backdrop-blur-sm rounded-xl shadow-lg border border-gray-200/50 p-8">
                                <div className="flex items-start space-x-4 mb-6">
                                    <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-indigo-600 rounded-xl flex items-center justify-center flex-shrink-0">
                                        <Shield className="h-6 w-6 text-white" />
                                    </div>
                                    <div>
                                        <h2 className="text-2xl font-bold text-gray-900 mb-2">Technical Support</h2>
                                        <p className="text-gray-600">Getting help with our platform and services</p>
                                    </div>
                                </div>

                                <div className="grid md:grid-cols-3 gap-6 mb-6">
                                    <div className="text-center">
                                        <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-emerald-600 rounded-full flex items-center justify-center mx-auto mb-3">
                                            <Clock className="h-8 w-8 text-white" />
                                        </div>
                                        <h3 className="font-semibold text-gray-900 mb-2">24/7 Support</h3>
                                        <p className="text-gray-600 text-sm">Round-the-clock technical assistance</p>
                                    </div>

                                    <div className="text-center">
                                        <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-cyan-600 rounded-full flex items-center justify-center mx-auto mb-3">
                                            <Mail className="h-8 w-8 text-white" />
                                        </div>
                                        <h3 className="font-semibold text-gray-900 mb-2">Email Support</h3>
                                        <p className="text-gray-600 text-sm">Detailed help via email</p>
                                    </div>

                                    <div className="text-center">
                                        <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-pink-600 rounded-full flex items-center justify-center mx-auto mb-3">
                                            <Phone className="h-8 w-8 text-white" />
                                        </div>
                                        <h3 className="font-semibold text-gray-900 mb-2">Live Chat</h3>
                                        <p className="text-gray-600 text-sm">Instant help when you need it</p>
                                    </div>
                                </div>

                                <div>
                                    <h3 className="text-xl font-semibold text-gray-900 mb-3">Support Coverage</h3>
                                    <ul className="space-y-3">
                                        <li className="flex items-start space-x-3">
                                            <CheckCircle className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
                                            <span className="text-gray-700">Platform navigation and feature guidance</span>
                                        </li>
                                        <li className="flex items-start space-x-3">
                                            <CheckCircle className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
                                            <span className="text-gray-700">Template customization assistance</span>
                                        </li>
                                        <li className="flex items-start space-x-3">
                                            <CheckCircle className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
                                            <span className="text-gray-700">Download and formatting troubleshooting</span>
                                        </li>
                                        <li className="flex items-start space-x-3">
                                            <CheckCircle className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
                                            <span className="text-gray-700">Account and billing support</span>
                                        </li>
                                        <li className="flex items-start space-x-3">
                                            <CheckCircle className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
                                            <span className="text-gray-700">Career advice and resume optimization tips</span>
                                        </li>
                                    </ul>
                                </div>
                            </section>

                            {/* Satisfaction Guarantee */}
                            <section id="satisfaction" className="bg-white/80 backdrop-blur-sm rounded-xl shadow-lg border border-gray-200/50 p-8">
                                <div className="flex items-start space-x-4 mb-6">
                                    <div className="w-12 h-12 bg-gradient-to-br from-yellow-500 to-orange-600 rounded-xl flex items-center justify-center flex-shrink-0">
                                        <CheckCircle className="h-6 w-6 text-white" />
                                    </div>
                                    <div>
                                        <h2 className="text-2xl font-bold text-gray-900 mb-2">Satisfaction Guarantee</h2>
                                        <p className="text-gray-600">Our commitment to your success and satisfaction</p>
                                    </div>
                                </div>

                                <div className="bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 rounded-lg p-6 mb-6">
                                    <div className="flex items-center space-x-3 mb-3">
                                        <DollarSign className="h-6 w-6 text-green-600" />
                                        <h3 className="text-lg font-semibold text-green-900">Money-Back Guarantee</h3>
                                    </div>
                                    <p className="text-green-800 mb-3">
                                        We're so confident in our service that we offer a 48-hour money-back guarantee. 
                                        If you're not completely satisfied with our platform, request a full refund within 
                                        2 days of purchase.
                                    </p>
                                    <div className="text-green-700 text-sm">
                                        <p><strong>No questions asked policy:</strong> Simply contact our support team within the guarantee period.</p>
                                    </div>
                                </div>

                                <div>
                                    <h3 className="text-xl font-semibold text-gray-900 mb-3">What We Guarantee</h3>
                                    <ul className="space-y-3">
                                        <li className="flex items-start space-x-3">
                                            <CheckCircle className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
                                            <span className="text-gray-700">Professional-quality resume templates</span>
                                        </li>
                                        <li className="flex items-start space-x-3">
                                            <CheckCircle className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
                                            <span className="text-gray-700">AI-powered optimization suggestions</span>
                                        </li>
                                        <li className="flex items-start space-x-3">
                                            <CheckCircle className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
                                            <span className="text-gray-700">99.9% platform uptime availability</span>
                                        </li>
                                        <li className="flex items-start space-x-3">
                                            <CheckCircle className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
                                            <span className="text-gray-700">Responsive customer support</span>
                                        </li>
                                        <li className="flex items-start space-x-3">
                                            <CheckCircle className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
                                            <span className="text-gray-700">Regular feature updates and improvements</span>
                                        </li>
                                    </ul>
                                </div>
                            </section>

                            {/* Service Limitations */}
                            <section id="limitations" className="bg-white/80 backdrop-blur-sm rounded-xl shadow-lg border border-gray-200/50 p-8">
                                <div className="flex items-start space-x-4 mb-6">
                                    <div className="w-12 h-12 bg-gradient-to-br from-red-500 to-pink-600 rounded-xl flex items-center justify-center flex-shrink-0">
                                        <AlertTriangle className="h-6 w-6 text-white" />
                                    </div>
                                    <div>
                                        <h2 className="text-2xl font-bold text-gray-900 mb-2">Service Limitations</h2>
                                        <p className="text-gray-600">Understanding the scope and boundaries of our services</p>
                                    </div>
                                </div>

                                <div className="space-y-6">
                                    <div>
                                        <h3 className="text-xl font-semibold text-gray-900 mb-4">Service Boundaries</h3>
                                        <div className="grid md:grid-cols-2 gap-6">
                                            <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                                                <h4 className="font-semibold text-red-900 mb-2">What We Don't Provide</h4>
                                                <ul className="text-red-700 text-sm space-y-1">
                                                    <li>• Job placement guarantees</li>
                                                    <li>• Interview coaching services</li>
                                                    <li>• Custom template design from scratch</li>
                                                    <li>• Content writing services</li>
                                                    <li>• Career counseling sessions</li>
                                                </ul>
                                            </div>

                                            <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
                                                <h4 className="font-semibold text-amber-900 mb-2">Technical Limitations</h4>
                                                <ul className="text-amber-700 text-sm space-y-1">
                                                    <li>• Internet connection required</li>
                                                    <li>• Modern browser compatibility needed</li>
                                                    <li>• File size limits for uploads</li>
                                                    <li>• Storage limits per account</li>
                                                    <li>• Download limits for free plans</li>
                                                </ul>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                                        <div className="flex items-start space-x-3">
                                            <Shield className="h-5 w-5 text-blue-600 flex-shrink-0 mt-0.5" />
                                            <div>
                                                <h4 className="font-semibold text-blue-900 mb-1">Fair Use Policy</h4>
                                                <p className="text-blue-800 text-sm">
                                                    Our services are intended for personal and professional use. Commercial redistribution 
                                                    of templates or excessive resource usage may result in account limitations. Please 
                                                    refer to our Terms of Service for detailed usage guidelines.
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </section>

                            {/* Contact Support */}
                            <section id="contact" className="bg-white/80 backdrop-blur-sm rounded-xl shadow-lg border border-gray-200/50 p-8">
                                <div className="flex items-start space-x-4 mb-6">
                                    <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center flex-shrink-0">
                                        <Mail className="h-6 w-6 text-white" />
                                    </div>
                                    <div>
                                        <h2 className="text-2xl font-bold text-gray-900 mb-2">Contact Support</h2>
                                        <p className="text-gray-600">Get help with service delivery, exchanges, or technical issues</p>
                                    </div>
                                </div>

                                <div className="grid md:grid-cols-2 gap-8">
                                    <div>
                                        <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Contact</h3>
                                        <div className="space-y-4">
                                            <div className="flex items-center space-x-3 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                                                <Mail className="h-5 w-5 text-blue-600" />
                                                <div>
                                                    <p className="font-medium text-blue-900">Email Support</p>
                                                    <p className="text-blue-700 text-sm">arhaanresumeai@gmail.com</p>
                                                </div>
                                            </div>

                                            <div className="flex items-center space-x-3 p-3 bg-green-50 border border-green-200 rounded-lg">
                                                <Clock className="h-5 w-5 text-green-600" />
                                                <div>
                                                    <p className="font-medium text-green-900">Response Time</p>
                                                    <p className="text-green-700 text-sm">Within 24 hours</p>
                                                </div>
                                            </div>

                                            <div className="flex items-center space-x-3 p-3 bg-purple-50 border border-purple-200 rounded-lg">
                                                <Globe className="h-5 w-5 text-purple-600" />
                                                <div>
                                                    <p className="font-medium text-purple-900">Available Worldwide</p>
                                                    <p className="text-purple-700 text-sm">24/7 Support Coverage</p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    <div>
                                        <h3 className="text-lg font-semibold text-gray-900 mb-4">Before Contacting Support</h3>
                                        <div className="space-y-3">
                                            <div className="flex items-start space-x-3">
                                                <CheckCircle className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
                                                <div>
                                                    <p className="text-gray-900 font-medium">Check your email</p>
                                                    <p className="text-gray-600 text-sm">Look for activation and confirmation emails</p>
                                                </div>
                                            </div>

                                            <div className="flex items-start space-x-3">
                                                <CheckCircle className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
                                                <div>
                                                    <p className="text-gray-900 font-medium">Clear browser cache</p>
                                                    <p className="text-gray-600 text-sm">Refresh your browser and try again</p>
                                                </div>
                                            </div>

                                            <div className="flex items-start space-x-3">
                                                <CheckCircle className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
                                                <div>
                                                    <p className="text-gray-900 font-medium">Check account status</p>
                                                    <p className="text-gray-600 text-sm">Verify your subscription is active</p>
                                                </div>
                                            </div>

                                            <div className="flex items-start space-x-3">
                                                <CheckCircle className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
                                                <div>
                                                    <p className="text-gray-900 font-medium">Try different browser</p>
                                                    <p className="text-gray-600 text-sm">Test with Chrome, Firefox, or Safari</p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div className="mt-8 bg-gradient-to-r from-blue-50 to-purple-50 border border-blue-200 rounded-lg p-6">
                                    <div className="text-center">
                                        <h4 className="text-lg font-semibold text-gray-900 mb-2">Need Immediate Help?</h4>
                                        <p className="text-gray-600 mb-4">
                                            For urgent technical issues or service delivery problems, our support team is here to help.
                                        </p>
                                        <button className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-3 rounded-lg font-medium hover:from-blue-700 hover:to-purple-700 transition-all duration-200 flex items-center space-x-2 mx-auto group">
                                            <Mail className="h-5 w-5" />
                                            <span>Contact Support Now</span>
                                            <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                                        </button>
                                    </div>
                                </div>
                            </section>
                        </div>
                    </motion.div>
                </div>
            </div>
        </div>
    );
}