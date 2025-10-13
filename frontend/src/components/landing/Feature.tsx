import { motion } from 'framer-motion'
import { Sparkles, ArrowRight, TrendingUp, CheckCircle, Globe, Star, Award, Brain, FileText, Download, Zap, Shield } from 'lucide-react'
import Link from 'next/link'
import React from 'react'


const stats = [
    { number: "3x", label: "More Interviews", icon: TrendingUp },
    { number: "95%", label: "ATS Pass Rate", icon: CheckCircle },
    { number: "10M+", label: "Resumes Created", icon: Globe },
    { number: "4.9★", label: "User Rating", icon: Star }
]

const feature = [
    "Industry-specific keyword optimization",
    "Achievement-focused bullet points",
    "ATS-friendly formatting",
    "Professional tone and language"
]

const features = [
    {
        icon: Brain,
        title: "AI Content Generation",
        desc: "Advanced machine learning creates compelling, industry-specific content that highlights your unique achievements and skills with precision.",
        color: "from-blue-500 to-indigo-600",
        bgColor: "from-blue-50 to-indigo-50"
    },
    {
        icon: FileText,
        title: "ATS-Optimized Templates",
        desc: "Professionally designed templates that pass through Applicant Tracking Systems while maintaining exceptional visual appeal.",
        color: "from-purple-500 to-pink-600",
        bgColor: "from-purple-50 to-pink-50"
    },
    {
        icon: Download,
        title: "Multi-Format Export",
        desc: "Download in PDF, Word, or create shareable links. Perfect formatting guaranteed across all platforms and devices.",
        color: "from-emerald-500 to-teal-600",
        bgColor: "from-emerald-50 to-teal-50"
    },
    {
        icon: Zap,
        title: "Real-Time Preview",
        desc: "See exactly how your resume looks as you build it. Make instant adjustments with live preview functionality.",
        color: "from-orange-500 to-red-600",
        bgColor: "from-orange-50 to-red-50"
    },
    {
        icon: Shield,
        title: "Enterprise Security",
        desc: "Bank-level encryption protects your personal information. We never sell or share your data with third parties.",
        color: "from-slate-500 to-gray-600",
        bgColor: "from-slate-50 to-gray-50"
    },
    {
        icon: Globe,
        title: "Global Standards",
        desc: "Templates and content optimized for international markets. Perfect for local and global job applications.",
        color: "from-indigo-500 to-blue-600",
        bgColor: "from-indigo-50 to-blue-50"
    }
]

function Feature() {
    return (
        <div>
            <section className="py-12 sm:py-16 lg:py-24 bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-900 relative overflow-hidden">
                {/* Background pattern */}
                <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff08_1px,transparent_1px),linear-gradient(to_bottom,#ffffff08_1px,transparent_1px)] bg-[size:32px_32px]"></div>

                <div className="container mx-auto px-4 sm:px-6 relative">
                    <div className="grid lg:grid-cols-2 gap-8 sm:gap-12 lg:gap-20 items-center">
                        <motion.div
                            initial={{ x: -50, opacity: 0 }}
                            whileInView={{ x: 0, opacity: 1 }}
                            transition={{ duration: 0.8 }}
                            viewport={{ once: true }}
                        >
                            <div className="relative">
                                <div className="absolute inset-0 bg-gradient-to-r from-blue-500/20 to-purple-500/20 blur-3xl rounded-3xl"></div>

                                <div className="relative bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-xl rounded-3xl p-6 sm:p-8 lg:p-10 border border-white/10 shadow-2xl">
                                    <div className="absolute top-4 sm:top-6 right-4 sm:right-6 bg-gradient-to-r from-blue-500 to-purple-600 text-white px-3 sm:px-4 py-1 sm:py-2 rounded-full text-xs sm:text-sm font-semibold">
                                        🤖 AI Powered
                                    </div>

                                    <div className="mb-6 sm:mb-8">
                                        <div className="inline-flex items-center justify-center w-12 sm:w-16 h-12 sm:h-16 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl sm:rounded-2xl mb-4 sm:mb-6">
                                            <Sparkles className="h-6 sm:h-8 w-6 sm:w-8 text-white" />
                                        </div>

                                        <h3 className="text-2xl sm:text-3xl font-bold text-white mb-3 sm:mb-4">
                                            Let AI Write Your Success Story
                                        </h3>
                                        <p className="text-lg sm:text-xl text-blue-100 mb-6 sm:mb-8 leading-relaxed">
                                            Our advanced AI analyzes your role, industry, and career goals to generate
                                            compelling content that showcases your unique value proposition.
                                        </p>
                                    </div>

                                    <div className="space-y-3 sm:space-y-4 mb-6 sm:mb-8">
                                        {feature.map((feature, i) => (
                                            <motion.div
                                                key={i}
                                                initial={{ x: -20, opacity: 0 }}
                                                whileInView={{ x: 0, opacity: 1 }}
                                                transition={{ duration: 0.5, delay: i * 0.1 }}
                                                viewport={{ once: true }}
                                                className="flex items-center space-x-3"
                                            >
                                                <div className="w-2 h-2 bg-gradient-to-r from-blue-400 to-purple-400 rounded-full"></div>
                                                <span className="text-blue-100 font-medium text-sm sm:text-base">{feature}</span>
                                            </motion.div>
                                        ))}
                                    </div>

                                    <Link href={"/template"} className="group bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white px-6 sm:px-8 py-3 sm:py-4 rounded-xl font-semibold transition-all transform hover:-translate-y-1 shadow-lg flex items-center space-x-2">
                                        <span>Experience AI Magic</span>
                                        <ArrowRight className="h-4 sm:h-5 w-4 sm:w-5 group-hover:translate-x-1 transition-transform" />
                                    </Link>
                                </div>
                            </div>
                        </motion.div>

                        <motion.div
                            initial={{ x: 50, opacity: 0 }}
                            whileInView={{ x: 0, opacity: 1 }}
                            transition={{ duration: 0.8 }}
                            viewport={{ once: true }}
                            className="space-y-6 sm:space-y-8"
                        >
                            <div>
                                <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-4 sm:mb-6 leading-tight">
                                    Smart Content Generation That
                                    <span className="block text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-400">
                                        Gets Results
                                    </span>
                                </h2>
                                <p className="text-lg sm:text-xl text-blue-100 leading-relaxed mb-6 sm:mb-8">
                                    Stop struggling with writer's block. Our AI understands what recruiters want
                                    and helps you articulate your achievements in the most impactful way.
                                </p>
                            </div>

                            {/* Stats */}
                            <div className="grid grid-cols-2 gap-4 sm:gap-6">
                                {stats.map((stat, i) => (
                                    <motion.div
                                        key={i}
                                        initial={{ scale: 0.8, opacity: 0 }}
                                        whileInView={{ scale: 1, opacity: 1 }}
                                        transition={{ duration: 0.5, delay: i * 0.1 }}
                                        viewport={{ once: true }}
                                        className="bg-white/5 backdrop-blur-sm rounded-xl sm:rounded-2xl p-4 sm:p-6 border border-white/10 text-center"
                                    >
                                        <stat.icon className="h-6 sm:h-8 w-6 sm:w-8 text-blue-400 mx-auto mb-2 sm:mb-3" />
                                        <div className="text-2xl sm:text-3xl font-bold text-white mb-1">{stat.number}</div>
                                        <div className="text-xs sm:text-sm text-blue-200">{stat.label}</div>
                                    </motion.div>
                                ))}
                            </div>
                        </motion.div>
                    </div>
                </div>
            </section>

            {/* Enhanced Features Section */}
            <section id="features" className="py-12 sm:py-16 lg:py-24 bg-gradient-to-br from-slate-50 to-blue-50/30">
                <div className="container mx-auto px-4 sm:px-6">
                    <motion.div
                        initial={{ y: 50, opacity: 0 }}
                        whileInView={{ y: 0, opacity: 1 }}
                        transition={{ duration: 0.8 }}
                        viewport={{ once: true }}
                        className="text-center mb-12 sm:mb-16 lg:mb-20"
                    >
                        <div className="inline-flex items-center bg-blue-100 text-blue-700 px-4 sm:px-6 py-2 sm:py-3 rounded-full text-sm font-medium mb-4 sm:mb-6">
                            <Award className="h-4 w-4 mr-2" />
                            Premium Features
                        </div>
                        <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-slate-900 mb-4 sm:mb-6">
                            Everything You Need to
                            <span className="block text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600">
                                Stand Out
                            </span>
                        </h2>
                        <p className="text-lg sm:text-xl text-slate-600 max-w-3xl mx-auto leading-relaxed px-2 sm:px-0">
                            Our comprehensive suite of AI-powered tools and professional templates
                            ensures your resume captures attention and drives results.
                        </p>
                    </motion.div>

                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 max-w-7xl mx-auto">
                        {features.map((feature, i) => (
                            <motion.div
                                key={i}
                                initial={{ y: 50, opacity: 0 }}
                                whileInView={{ y: 0, opacity: 1 }}
                                transition={{ duration: 0.6, delay: i * 0.1 }}
                                viewport={{ once: true }}
                                className="group relative"
                            >
                                <div className={`absolute inset-0 bg-gradient-to-br ${feature.bgColor} rounded-3xl opacity-0 group-hover:opacity-100 transition-all duration-300 transform group-hover:scale-105`}></div>

                                <div className="relative bg-white rounded-3xl p-6 sm:p-8 shadow-lg hover:shadow-2xl transition-all duration-300 border border-slate-100 group-hover:border-white">
                                    <div className={`bg-gradient-to-br ${feature.color} w-12 sm:w-16 h-12 sm:h-16 rounded-xl sm:rounded-2xl flex items-center justify-center mb-4 sm:mb-6 group-hover:scale-110 transition-transform duration-300 shadow-lg`}>
                                        <feature.icon className="h-6 sm:h-8 w-6 sm:w-8 text-white" />
                                    </div>

                                    <h3 className="text-lg sm:text-xl font-bold text-slate-900 mb-3 sm:mb-4 group-hover:text-slate-800 transition-colors">
                                        {feature.title}
                                    </h3>
                                    <p className="text-slate-600 leading-relaxed group-hover:text-slate-700 transition-colors text-sm sm:text-base">
                                        {feature.desc}
                                    </p>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>
        </div>
    )
}

export default Feature