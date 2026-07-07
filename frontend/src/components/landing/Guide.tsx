import { motion } from 'framer-motion'
import { Zap, FileText, User, Brain, Download, ArrowRight, CheckCircle, Clock, Star } from 'lucide-react'
import React from 'react'


const steps = [
    {
        step: "01",
        title: "Choose Your Template",
        description: "Select from our collection of ATS-optimized, professionally designed templates. Each template is crafted by hiring experts and optimized for different industries and career levels.",
        icon: FileText,
        color: "from-blue-500 to-indigo-600",
        features: [
            "15+ Professional templates",
            "Industry-specific designs",
            "ATS-optimized formatting",
            "Mobile-responsive layouts"
        ],
        action: "Browse Templates",
        link: "/template"
    },
    {
        step: "02",
        title: "Add Your Information",
        description: "Input your personal details, work experience, education, and skills. Our intelligent form guides you through each section with helpful tips and suggestions.",
        icon: User,
        color: "from-purple-500 to-pink-600",
        features: [
            "Smart form validation",
            "Auto-save functionality",
            "Import from LinkedIn",
            "Upload existing resume"
        ],
        action: "Start Building",
        link: "/template"
    },
    {
        step: "03",
        title: "Let AI Optimize",
        description: "Our advanced AI analyzes your content and suggests improvements. Get personalized recommendations for better keywords, stronger action verbs, and compelling achievements.",
        icon: Brain,
        color: "from-emerald-500 to-teal-600",
        features: [
            "AI content suggestions",
            "Keyword optimization",
            "Achievement enhancement",
            "Industry-specific language"
        ],
        action: "See AI Magic",
        link: "/template"
    },
    {
        step: "04",
        title: "Download & Apply",
        description: "Preview your resume in real-time, make final adjustments, and download in multiple formats. Share your resume or create a professional online portfolio.",
        icon: Download,
        color: "from-orange-500 to-red-600",
        features: [
            "Real-time preview",
            "Multiple export formats",
            "Shareable links",
            "Print-ready quality"
        ],
        action: "Get Started Free",
        link: "/template"
    }
]


function Guide() {
    return (
        <section id="how-it-works" className="py-12 sm:py-16 lg:py-24 bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-900 relative overflow-hidden">
            {/* Background pattern */}
            <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff08_1px,transparent_1px),linear-gradient(to_bottom,#ffffff08_1px,transparent_1px)] bg-[size:32px_32px]"></div>

            <div className="container mx-auto px-4 sm:px-6 relative">
                <motion.div
                    initial={{ y: 50, opacity: 0 }}
                    whileInView={{ y: 0, opacity: 1 }}
                    transition={{ duration: 0.8 }}
                    viewport={{ once: true }}
                    className="text-center mb-12 sm:mb-16 lg:mb-20"
                >
                    <div className="inline-flex items-center bg-emerald-500/20 border border-emerald-400/30 text-emerald-300 px-4 sm:px-6 py-2 sm:py-3 rounded-full text-sm font-medium mb-4 sm:mb-6 backdrop-blur-sm">
                        <Zap className="h-4 w-4 mr-2" />
                        Simple 4-Step Process
                    </div>
                    <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-4 sm:mb-6">
                        How to Build Your
                        <span className="block text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-teal-400">
                            Perfect Resume
                        </span>
                    </h2>
                    <p className="text-lg sm:text-xl text-blue-100 max-w-3xl mx-auto leading-relaxed px-2 sm:px-0">
                        From zero to hired in just 4 simple steps. Our AI-powered platform makes creating
                        professional resumes effortless and effective.
                    </p>
                </motion.div>

                <div className="max-w-6xl mx-auto">
                    {/* Steps Grid */}
                    <div className="grid lg:grid-cols-2 gap-8 sm:gap-12 lg:gap-16">
                        {steps.map((step, i) => (
                            <motion.div
                                key={i}
                                initial={{ y: 50, opacity: 0 }}
                                whileInView={{ y: 0, opacity: 1 }}
                                transition={{ duration: 0.6, delay: i * 0.2 }}
                                viewport={{ once: true }}
                                className="relative group"
                            >
                                {/* Step connector line - only show on desktop */}
                                {i < 3 && (
                                    <div className="hidden lg:block absolute top-8 -right-8 w-16 h-0.5 bg-gradient-to-r from-white/20 to-transparent"></div>
                                )}

                                <div className="relative">
                                    {/* Glowing background */}
                                    <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-white/5 blur-xl rounded-3xl group-hover:blur-2xl transition-all duration-300"></div>

                                    <div className="relative bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-xl rounded-3xl p-6 sm:p-8 lg:p-10 border border-white/20 shadow-2xl hover:shadow-3xl transition-all duration-300">
                                        {/* Step number */}
                                        <div className="flex items-center justify-between mb-6 sm:mb-8">
                                            <div className={`bg-gradient-to-r ${step.color} text-white text-xl sm:text-2xl font-bold px-4 sm:px-6 py-2 sm:py-3 rounded-xl shadow-lg`}>
                                                {step.step}
                                            </div>
                                            <div className={`bg-gradient-to-br ${step.color} w-12 sm:w-16 h-12 sm:h-16 rounded-xl sm:rounded-2xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                                                <step.icon className="h-6 sm:h-8 w-6 sm:w-8 text-white" />
                                            </div>
                                        </div>

                                        {/* Content */}
                                        <div className="mb-6 sm:mb-8">
                                            <h3 className="text-xl sm:text-2xl font-bold text-white mb-3 sm:mb-4">
                                                {step.title}
                                            </h3>
                                            <p className="text-blue-100 leading-relaxed mb-6 text-sm sm:text-base">
                                                {step.description}
                                            </p>

                                            {/* Features list */}
                                            <div className="space-y-2 sm:space-y-3 mb-6 sm:mb-8">
                                                {step.features.map((feature, j) => (
                                                    <div key={j} className="flex items-center space-x-3">
                                                        <div className="w-1.5 h-1.5 bg-gradient-to-r from-emerald-400 to-teal-400 rounded-full"></div>
                                                        <span className="text-blue-200 text-sm sm:text-base font-medium">{feature}</span>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>

                                        {/* Action button */}
                                        <a
                                            href={step.link}
                                            className={`group/btn inline-flex items-center bg-gradient-to-r ${step.color} hover:shadow-lg text-white px-6 sm:px-8 py-3 sm:py-4 rounded-xl font-semibold transition-all transform hover:-translate-y-1 shadow-md`}
                                        >
                                            <span>{step.action}</span>
                                            <ArrowRight className="h-4 sm:h-5 w-4 sm:w-5 ml-2 group-hover/btn:translate-x-1 transition-transform" />
                                        </a>
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </div>

                    {/* Bottom CTA */}
                    <motion.div
                        initial={{ y: 30, opacity: 0 }}
                        whileInView={{ y: 0, opacity: 1 }}
                        transition={{ duration: 0.6, delay: 0.8 }}
                        viewport={{ once: true }}
                        className="text-center mt-12 sm:mt-16 lg:mt-20"
                    >
                        <div className="bg-gradient-to-r from-white/10 to-white/5 backdrop-blur-xl rounded-3xl p-6 sm:p-8 lg:p-12 border border-white/20 shadow-2xl max-w-4xl mx-auto">
                            <div className="mb-6 sm:mb-8">
                                <h3 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-white mb-4">
                                    Ready to Transform Your Career?
                                </h3>
                                <p className="text-lg sm:text-xl text-blue-100 leading-relaxed max-w-2xl mx-auto">
                                    Join over 50,000 professionals who have successfully landed their dream jobs
                                    using our AI-powered resume builder.
                                </p>
                            </div>

                            <div className="flex flex-col sm:flex-row gap-4 sm:gap-6 justify-center items-center mb-6 sm:mb-8">
                                <a
                                    href="/template"
                                    className="group bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white px-8 sm:px-12 py-4 sm:py-5 rounded-2xl text-lg sm:text-xl font-bold transition-all transform hover:-translate-y-1 shadow-xl hover:shadow-2xl"
                                >
                                    <span className="flex items-center space-x-3">
                                        <span>Start Building Free</span>
                                        <ArrowRight className="h-5 sm:h-6 w-5 sm:w-6 group-hover:translate-x-1 transition-transform" />
                                    </span>
                                </a>

                                <a
                                    href="/resusme/parse"
                                    className="group bg-white/10 hover:bg-white/20 border border-white/20 text-white px-8 sm:px-12 py-4 sm:py-5 rounded-2xl text-lg sm:text-xl font-bold transition-all backdrop-blur-sm"
                                >
                                    <span className="flex items-center space-x-3">
                                        <Download className="h-5 sm:h-6 w-5 sm:w-6" />
                                        <span>Import Resume</span>
                                    </span>
                                </a>
                            </div>

                            {/* Trust indicators */}
                            <div className="flex flex-wrap items-center justify-center gap-4 sm:gap-8 text-blue-200">
                                <div className="flex items-center space-x-2">
                                    <CheckCircle className="h-4 sm:h-5 w-4 sm:w-5 text-emerald-400" />
                                    <span className="text-sm sm:text-base">No credit card required</span>
                                </div>
                                <div className="flex items-center space-x-2">
                                    <Clock className="h-4 sm:h-5 w-4 sm:w-5 text-blue-400" />
                                    <span className="text-sm sm:text-base">Ready in 10 minutes</span>
                                </div>
                                <div className="flex items-center space-x-2">
                                    <Star className="h-4 sm:h-5 w-4 sm:w-5 text-yellow-400" />
                                    <span className="text-sm sm:text-base">4.9/5 rating</span>
                                </div>
                            </div>
                        </div>
                    </motion.div>
                </div>
            </div>
        </section>
    )
}

export default Guide