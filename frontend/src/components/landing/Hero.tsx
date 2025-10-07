"use client"
import { motion } from 'framer-motion'
import { Sparkles, ArrowRight, Download, CheckCircle, Shield, Award, Brain, TrendingUp } from 'lucide-react'
import { useRouter } from 'next/navigation'
import React from 'react'

function Hero() {
    const router = useRouter();

    return (
        <section className="relative overflow-hidden bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-100/50 min-h-screen flex items-start md:items-center pt-6 md:pt-0">
            <div className="absolute inset-0">
                <div className="absolute top-20 left-10 w-72 h-72 bg-gradient-to-r from-blue-400/10 to-indigo-500/10 rounded-full mix-blend-multiply filter blur-3xl animate-pulse"></div>
                <div className="absolute top-40 right-10 w-64 h-64 bg-gradient-to-r from-purple-400/10 to-pink-500/10 rounded-full mix-blend-multiply filter blur-3xl animate-pulse delay-1000"></div>
            </div>

            <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808008_1px,transparent_1px),linear-gradient(to_bottom,#80808008_1px,transparent_1px)] bg-[size:24px_24px] pointer-events-none"></div>

            <div className="relative container mx-auto px-4">
                {/* AI Badge */}
                <motion.div
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ duration: 0.6, delay: 0.2 }}
                    className="flex justify-center mb-6"
                >
                    <div className="inline-flex items-center bg-white/90 backdrop-blur-sm border border-white/20 shadow-sm text-slate-700 px-4 py-2 rounded-full text-sm font-medium">
                        <div className="w-2 h-2 bg-green-500 rounded-full mr-2 animate-pulse"></div>
                        <Sparkles className="h-4 w-4 mr-2 text-blue-600" />
                        <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent font-semibold">
                            AI-Powered Resume Builder
                        </span>
                    </div>
                </motion.div>

                <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-center max-w-6xl mx-auto">
                    {/* Left Content */}
                    <div className="text-center lg:text-left">
                        <motion.h1
                            initial={{ y: 30, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            transition={{ duration: 0.8, delay: 0.3 }}
                            className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-slate-900 mb-4 leading-tight"
                        >
                            Build Your
                            <span className="block text-transparent bg-clip-text bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 mt-2">
                                Dream Career
                            </span>
                            <span className="block text-slate-700 text-xl sm:text-2xl md:text-3xl font-medium mt-2">
                                with AI Precision
                            </span>
                        </motion.h1>

                        <motion.p
                            initial={{ y: 30, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            transition={{ duration: 0.8, delay: 0.5 }}
                            className="text-base sm:text-lg lg:text-xl text-slate-600 mb-8 leading-relaxed max-w-2xl lg:max-w-none"
                        >
                            Transform your career journey with our intelligent AI that crafts compelling resumes,
                            optimizes for ATS systems, and helps you land interviews at top companies.
                        </motion.p>

                        <motion.div
                            initial={{ y: 30, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            transition={{ duration: 0.8, delay: 0.7 }}
                            className="flex flex-col sm:flex-row gap-3 justify-center lg:justify-start mb-8"
                        >
                            <button
                                className="group bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-3 rounded-xl text-base font-semibold flex items-center justify-center space-x-2 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1"
                                onClick={() => router.push("/template")}
                            >
                                <span>Create Resume Now</span>
                                <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
                            </button>
                            <button
                                onClick={() => router.push('/resusme/parse')}
                                className="bg-white/80 backdrop-blur-sm border border-slate-200 hover:border-blue-300 text-slate-700 hover:text-blue-700 px-6 py-3 rounded-xl text-base font-semibold transition-all duration-300 shadow-sm hover:shadow-md transform hover:-translate-y-1"
                            >
                                <span className="flex items-center space-x-2">
                                    <Download className="h-5 w-5" />
                                    <span>Import Resume</span>
                                </span>
                            </button>
                        </motion.div>

                        {/* Trust Indicators */}
                        <motion.div
                            initial={{ y: 30, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            transition={{ duration: 0.8, delay: 0.9 }}
                            className="flex flex-wrap items-center justify-center lg:justify-start gap-4 text-sm"
                        >
                            {[
                                { icon: CheckCircle, text: "No credit card required", color: "text-emerald-600" },
                                { icon: Shield, text: "100% Free to start", color: "text-blue-600" },
                                { icon: Award, text: "ATS-optimized", color: "text-purple-600" }
                            ].map((item, i) => (
                                <div key={i} className="flex items-center space-x-2 text-slate-600">
                                    <item.icon className={`h-4 sm:h-5 w-4 sm:w-5 ${item.color}`} />
                                    <span className="font-medium text-xs sm:text-sm">{item.text}</span>
                                </div>
                            ))}
                        </motion.div>
                    </div>

                    {/* Enhanced Right Content */}
                    <motion.div
                        initial={{ x: 50, opacity: 0 }}
                        animate={{ x: 0, opacity: 1 }}
                        transition={{ duration: 1, delay: 0.5 }}
                        className="relative lg:mt-0 mt-8 sm:mt-12 px-4 sm:px-0"
                    >
                        <div className="relative">
                            {/* Main image with enhanced styling */}
                            <div className="relative rounded-3xl overflow-hidden shadow-2xl bg-white p-2">
                                <img
                                    src="/img/banner.png"
                                    alt="ResumeAI Preview"
                                    className="w-full max-w-lg xl:max-w-2xl mx-auto rounded-2xl"
                                />
                            </div>

                            {/* Enhanced floating elements - Hidden on mobile for cleaner look */}
                            <motion.div
                                initial={{ scale: 0, opacity: 0, rotate: -10 }}
                                animate={{ scale: 1, opacity: 1, rotate: 0 }}
                                transition={{ duration: 0.5, delay: 1.2 }}
                                className="absolute -top-3 sm:-top-6 -left-3 sm:-left-6 bg-gradient-to-r from-emerald-500 to-teal-600 text-white rounded-xl sm:rounded-2xl shadow-xl p-2 sm:p-4 hidden sm:block"
                            >
                                <div className="flex items-center space-x-2 sm:space-x-3">
                                    <Brain className="h-4 sm:h-6 w-4 sm:w-6" />
                                    <div>
                                        <p className="text-xs sm:text-sm font-semibold">Smart AI Assistant</p>
                                        <p className="text-xs opacity-90">Writes better content</p>
                                    </div>
                                </div>
                            </motion.div>

                            <motion.div
                                initial={{ scale: 0, opacity: 0, rotate: 10 }}
                                animate={{ scale: 1, opacity: 1, rotate: 0 }}
                                transition={{ duration: 0.5, delay: 1.4 }}
                                className="absolute -bottom-3 sm:-bottom-6 -right-3 sm:-right-6 bg-gradient-to-r from-orange-500 to-red-500 text-white rounded-xl sm:rounded-2xl shadow-xl p-2 sm:p-4 hidden sm:block"
                            >
                                <div className="flex items-center space-x-2 sm:space-x-3">
                                    <TrendingUp className="h-4 sm:h-6 w-4 sm:w-6" />
                                    <div>
                                        <p className="text-xs sm:text-sm font-semibold">3x More Interviews</p>
                                        <p className="text-xs opacity-90">Proven results</p>
                                    </div>
                                </div>
                            </motion.div>

                            <motion.div
                                initial={{ scale: 0, opacity: 0 }}
                                animate={{ scale: 1, opacity: 1 }}
                                transition={{ duration: 0.5, delay: 1.6 }}
                                className="absolute top-1/2 -left-4 sm:-left-8 transform -translate-y-1/2 bg-white rounded-xl sm:rounded-2xl shadow-xl p-2 sm:p-4 border border-slate-100 hidden lg:block"
                            >
                                <div className="flex items-center space-x-2 sm:space-x-3">
                                    <div className="w-2 sm:w-3 h-2 sm:h-3 bg-green-500 rounded-full animate-pulse"></div>
                                    <div>
                                        <p className="text-xs sm:text-sm font-semibold text-slate-800">Live Preview</p>
                                        <p className="text-xs text-slate-600">Real-time editing</p>
                                    </div>
                                </div>
                            </motion.div>
                        </div>
                    </motion.div>
                </div>
            </div>
        </section>
    )
}

export default Hero