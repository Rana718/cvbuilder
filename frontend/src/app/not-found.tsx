"use client"
import React from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import {
    Home,
    Search,
    ArrowLeft,
    FileText,
    Mail,
    Star,
    Users,
    Compass,
    RefreshCw,
    MapPin,
    AlertCircle,
    Sparkles,
    ChevronRight
} from 'lucide-react';
import Footer from '@/components/Footer';

function Page() {
    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                duration: 0.6,
                staggerChildren: 0.2
            }
        }
    };

    const itemVariants = {
        hidden: { y: 20, opacity: 0 },
        visible: {
            y: 0,
            opacity: 1,
            transition: {
                duration: 0.5
            }
        }
    };

    const floatingVariants = {
        animate: {
            y: [-10, 10, -10],
            rotate: [0, 5, -5, 0],
            transition: {
                duration: 3,
                repeat: Infinity
            }
        }
    };

    const pulseVariants = {
        animate: {
            scale: [1, 1.05, 1],
            transition: {
                duration: 2,
                repeat: Infinity
            }
        }
    };

    const quickLinks = [
        { href: '/', label: 'Home', icon: Home, color: 'bg-blue-500' },
        { href: '/template', label: 'Resume Templates', icon: FileText, color: 'bg-blue-600' },
        { href: '/createcover-letter', label: 'Cover Letters', icon: Mail, color: 'bg-blue-400' },
        { href: '/resusme/rateing', label: 'Resume Analysis', icon: Star, color: 'bg-blue-700' },
        { href: '/resusme', label: 'My Resumes', icon: Users, color: 'bg-blue-500' },
    ];

    return (
        <div className="min-h-screen bg-gray-50 relative overflow-hidden">
            {/* Animated Background Elements */}
            <div className="absolute inset-0 overflow-hidden">
                {/* Floating Circles */}
                <motion.div
                    className="absolute top-10 sm:top-20 left-4 sm:left-10 w-20 sm:w-32 h-20 sm:h-32 bg-blue-400/20 rounded-full blur-xl"
                    animate={{
                        x: [0, 60, 0],
                        y: [0, -30, 0],
                    }}
                    transition={{
                        duration: 8,
                        repeat: Infinity,
                        ease: "easeInOut"
                    }}
                />
                <motion.div
                    className="absolute top-20 sm:top-40 right-4 sm:right-20 w-16 sm:w-24 h-16 sm:h-24 bg-blue-500/20 rounded-full blur-xl"
                    animate={{
                        x: [0, -40, 0],
                        y: [0, 40, 0],
                    }}
                    transition={{
                        duration: 6,
                        repeat: Infinity,
                        ease: "easeInOut",
                        delay: 1
                    }}
                />
                <motion.div
                    className="absolute bottom-10 sm:bottom-20 left-1/4 w-24 sm:w-40 h-24 sm:h-40 bg-blue-300/15 rounded-full blur-xl"
                    animate={{
                        x: [0, 40, 0],
                        y: [0, -30, 0],
                    }}
                    transition={{
                        duration: 10,
                        repeat: Infinity,
                        ease: "easeInOut",
                        delay: 2
                    }}
                />

                {/* Grid Pattern */}
                <div className="absolute inset-0 opacity-[0.02]">
                    <div className="w-full h-full" style={{
                        backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23000000' fill-opacity='0.4'%3E%3Ccircle cx='30' cy='30' r='2'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
                    }}></div>
                </div>
            </div>

            {/* Main Content */}
            <div className="relative z-10 min-h-screen flex items-center justify-center px-4 sm:px-6 lg:px-8">
                <motion.div
                    className="max-w-4xl w-full text-center"
                    variants={containerVariants}
                    initial="hidden"
                    animate="visible"
                >
                    {/* 404 Animation */}
                    <motion.div
                        className="mb-8"
                        variants={itemVariants}
                    >
                        <motion.div
                            className="relative inline-block"
                            variants={floatingVariants}
                            animate="animate"
                        >
                            <h1 className="text-6xl sm:text-8xl md:text-9xl lg:text-[12rem] font-bold text-blue-600 leading-none">
                                404
                            </h1>
                            <motion.div
                                className="absolute -top-2 sm:-top-4 -right-2 sm:-right-4 w-6 sm:w-8 h-6 sm:h-8 bg-blue-500 rounded-full flex items-center justify-center"
                                variants={pulseVariants}
                                animate="animate"
                            >
                                <Sparkles className="h-3 sm:h-4 w-3 sm:w-4 text-white" />
                            </motion.div>
                        </motion.div>
                    </motion.div>

                    {/* Error Icon and Message */}
                    <motion.div
                        className="mb-8"
                        variants={itemVariants}
                    >
                        <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-gray-800 mb-4">
                            Oops! Page Not Found
                        </h2>
                        <p className="text-lg sm:text-xl text-gray-600 max-w-2xl mx-auto leading-relaxed">
                            The page you're looking for seems to have wandered off into the digital wilderness.
                            Don't worry, let's get you back on track to building that perfect resume!
                        </p>
                    </motion.div>

                    {/* Main Action Buttons */}
                    <motion.div
                        className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12"
                        variants={itemVariants}
                    >
                        <Link href="/" className="w-full sm:w-auto">
                            <motion.button
                                className="group inline-flex items-center justify-center space-x-3 px-6 sm:px-8 py-3 sm:py-4 bg-blue-600 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl hover:bg-blue-700 transition-all duration-300 transform hover:scale-105 w-full sm:w-auto"
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                            >
                                <Home className="h-5 w-5" />
                                <span>Back to Home</span>
                                <ChevronRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                            </motion.button>
                        </Link>

                        <motion.button
                            onClick={() => window.history.back()}
                            className="group inline-flex items-center justify-center space-x-3 px-6 sm:px-8 py-3 sm:py-4 bg-white/80 backdrop-blur-sm text-gray-700 font-semibold rounded-xl border border-gray-200 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 w-full sm:w-auto"
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                        >
                            <ArrowLeft className="h-5 w-5" />
                            <span>Go Back</span>
                        </motion.button>

                        <motion.button
                            onClick={() => window.location.reload()}
                            className="group inline-flex items-center justify-center space-x-3 px-6 sm:px-8 py-3 sm:py-4 bg-white/80 backdrop-blur-sm text-gray-700 font-semibold rounded-xl border border-gray-200 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 w-full sm:w-auto"
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                        >
                            <RefreshCw className="h-5 w-5 group-hover:rotate-180 transition-transform duration-500" />
                            <span>Refresh Page</span>
                        </motion.button>
                    </motion.div>

                    {/* Quick Links Grid */}
                    <motion.div
                        className="mb-12"
                        variants={itemVariants}
                    >
                        <h3 className="text-xl sm:text-2xl font-bold text-gray-800 mb-6 sm:mb-8 flex items-center justify-center">
                            <Compass className="h-5 sm:h-6 w-5 sm:w-6 mr-2 sm:mr-3 text-blue-500" />
                            Explore Our Features
                        </h3>

                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 max-w-4xl mx-auto">
                            {quickLinks.map((link, index) => (
                                <motion.div
                                    key={index}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 0.7 + index * 0.1 }}
                                >
                                    <Link href={link.href}>
                                        <motion.div
                                            className="group relative p-6 bg-white/80 backdrop-blur-sm rounded-xl border border-gray-200 shadow-lg hover:shadow-xl transition-all duration-300 cursor-pointer overflow-hidden"
                                            whileHover={{ scale: 1.02, y: -2 }}
                                            whileTap={{ scale: 0.98 }}
                                        >
                                            {/* Background on Hover */}
                                            <div className="absolute inset-0 bg-blue-50 opacity-0 group-hover:opacity-50 transition-opacity duration-300"></div>

                                            <div className="relative z-10 flex items-center space-x-3 sm:space-x-4">
                                                <div className={`w-10 sm:w-12 h-10 sm:h-12 ${link.color} rounded-lg flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                                                    <link.icon className="h-5 sm:h-6 w-5 sm:w-6 text-white" />
                                                </div>
                                                <div className="text-left flex-1">
                                                    <h4 className="font-semibold text-sm sm:text-base text-gray-800 group-hover:text-gray-900 transition-colors">
                                                        {link.label}
                                                    </h4>
                                                    {/* <ChevronRight className="h-3 sm:h-4 w-3 sm:w-4 text-gray-400 group-hover:text-gray-600 group-hover:translate-x-1 transition-all duration-300 mt-1" /> */}
                                                </div>
                                            </div>
                                        </motion.div>
                                    </Link>
                                </motion.div>
                            ))}
                        </div>
                    </motion.div>

                    {/* Help Section */}
                    <motion.div
                        className="bg-white/60 backdrop-blur-sm mb-20 rounded-2xl p-8 border border-gray-200 shadow-lg max-w-2xl mx-auto"
                        variants={itemVariants}
                    >
                        <div className="flex items-center justify-center mb-4">
                            <MapPin className="h-6 w-6 text-purple-500 mr-2" />
                            <h3 className="text-xl font-bold text-gray-800">Need Help?</h3>
                        </div>
                        <p className="text-gray-600 mb-6">
                            If you believe this is an error or need assistance, feel free to reach out to our support team.
                        </p>
                        <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center">
                            <Link href="/contact" className="w-full sm:w-auto">
                                <motion.button
                                    className="inline-flex items-center justify-center space-x-2 px-4 sm:px-6 py-2 sm:py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-all duration-300 w-full sm:w-auto"
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                >
                                    <Mail className="h-4 w-4" />
                                    <span>Contact Support</span>
                                </motion.button>
                            </Link>
                            <Link href="/help" className="w-full sm:w-auto">
                                <motion.button
                                    className="inline-flex items-center justify-center space-x-2 px-4 sm:px-6 py-2 sm:py-3 bg-white text-gray-700 font-medium rounded-lg border border-gray-300 hover:bg-gray-50 transition-all duration-300 w-full sm:w-auto"
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                >
                                    <Search className="h-4 w-4" />
                                    <span>Help Center</span>
                                </motion.button>
                            </Link>
                        </div>
                    </motion.div>
                </motion.div>
            </div>

            <Footer/>
        </div>
    );
}

export default Page;