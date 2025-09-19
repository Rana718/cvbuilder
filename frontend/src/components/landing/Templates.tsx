import { motion } from 'framer-motion'
import { FileText, ArrowRight } from 'lucide-react'
import React from 'react'

const templates = [
    {
        id: 1,
        name: "Executive Professional",
        category: "Leadership",
        color: "from-blue-500 to-indigo-600",
        description: "Perfect for senior roles and C-level positions"
    },
    {
        id: 2,
        name: "Creative Designer",
        category: "Design & Creative",
        color: "from-purple-500 to-pink-600",
        description: "Showcase your creativity with visual appeal"
    },
    {
        id: 3,
        name: "Tech Specialist",
        category: "Technology",
        color: "from-emerald-500 to-teal-600",
        description: "Clean, modern design for technical roles"
    }
]

function Templates() {
    return (
        <section id="templates" className="py-12 sm:py-16 lg:py-24 bg-gradient-to-br from-slate-50 to-blue-50/30">
            <div className="container mx-auto px-4 sm:px-6">
                <motion.div
                    initial={{ y: 50, opacity: 0 }}
                    whileInView={{ y: 0, opacity: 1 }}
                    transition={{ duration: 0.8 }}
                    viewport={{ once: true }}
                    className="text-center mb-12 sm:mb-16 lg:mb-20"
                >
                    <div className="inline-flex items-center bg-purple-100 text-purple-700 px-4 sm:px-6 py-2 sm:py-3 rounded-full text-sm font-medium mb-4 sm:mb-6">
                        <FileText className="h-4 w-4 mr-2" />
                        Professional Templates
                    </div>
                    <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-slate-900 mb-4 sm:mb-6">
                        Templates That
                        <span className="block text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-pink-600">
                            Win Interviews
                        </span>
                    </h2>
                    <p className="text-lg sm:text-xl text-slate-600 max-w-3xl mx-auto leading-relaxed px-2 sm:px-0">
                        Choose from our expertly crafted templates designed by hiring professionals.
                        Each template is optimized for ATS systems and modern recruiting practices.
                    </p>
                </motion.div>

                <div className="grid md:grid-cols-3 gap-8 sm:gap-12 mb-12 sm:mb-16 max-w-6xl mx-auto">
                    {templates.map((template, i) => (
                        <motion.div
                            key={i}
                            initial={{ y: 50, opacity: 0 }}
                            whileInView={{ y: 0, opacity: 1 }}
                            transition={{ duration: 0.6, delay: i * 0.1 }}
                            viewport={{ once: true }}
                            className="group cursor-pointer relative"
                        >
                            <div className="relative bg-white rounded-3xl shadow-xl overflow-hidden border border-slate-100 group-hover:shadow-2xl transition-all duration-500 group-hover:-translate-y-2">
                                {/* Template Preview */}
                                <div className="relative aspect-[1/1.4] bg-gradient-to-br from-slate-50 to-white p-4 sm:p-6 lg:p-8">
                                    {/* Header */}
                                    <div className="text-center mb-4 sm:mb-6 border-b border-slate-100 pb-3 sm:pb-4">
                                        <div className="w-12 sm:w-16 h-12 sm:h-16 bg-gradient-to-br from-slate-200 to-slate-300 rounded-full mx-auto mb-2 sm:mb-3"></div>
                                        <div className="h-3 sm:h-4 bg-slate-300 rounded-lg w-24 sm:w-32 mx-auto mb-1 sm:mb-2"></div>
                                        <div className="h-2 bg-slate-200 rounded w-16 sm:w-24 mx-auto"></div>
                                    </div>

                                    {/* Content Sections */}
                                    <div className="space-y-3 sm:space-y-4">
                                        {[1, 2, 3].map((section, j) => (
                                            <div key={j}>
                                                <div className={`h-2 sm:h-3 bg-gradient-to-r ${template.color} rounded w-16 sm:w-20 mb-2 sm:mb-3 opacity-80`}></div>
                                                <div className="space-y-1 sm:space-y-2">
                                                    <div className="h-1.5 sm:h-2 bg-slate-200 rounded w-full"></div>
                                                    <div className="h-1.5 sm:h-2 bg-slate-200 rounded w-4/5"></div>
                                                    <div className="h-1.5 sm:h-2 bg-slate-200 rounded w-3/4"></div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>

                                    {/* Hover overlay */}
                                    <div className="absolute inset-0 bg-gradient-to-br from-white/90 to-white/80 opacity-0 group-hover:opacity-100 transition-all duration-300 flex items-center justify-center backdrop-blur-sm">
                                        <div className="text-center transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300">
                                            <button className={`bg-gradient-to-r ${template.color} text-white px-6 sm:px-8 py-2 sm:py-3 rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all mb-3 sm:mb-4`}>
                                                Preview Template
                                            </button>
                                            <div className="flex items-center justify-center space-x-2">
                                                <div className="w-2 h-2 bg-emerald-500 rounded-full"></div>
                                                <span className="text-sm text-slate-600 font-medium">ATS Optimized</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Template Info */}
                                <div className="p-4 sm:p-6 bg-white border-t border-slate-100">
                                    <div className="flex items-center justify-between mb-2 sm:mb-3">
                                        <h3 className="font-bold text-slate-900 text-base sm:text-lg">{template.name}</h3>
                                        <span className={`bg-gradient-to-r ${template.color} text-white px-2 sm:px-3 py-1 rounded-full text-xs font-medium`}>
                                            {template.category}
                                        </span>
                                    </div>
                                    <p className="text-slate-600 text-sm leading-relaxed">{template.description}</p>
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </div>

                <div className="text-center">
                    <motion.div
                        initial={{ y: 30, opacity: 0 }}
                        whileInView={{ y: 0, opacity: 1 }}
                        transition={{ duration: 0.6 }}
                        viewport={{ once: true }}
                    >
                        <a
                            href="/template"
                            className="group inline-flex items-center bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white px-8 sm:px-10 py-3 sm:py-4 rounded-2xl font-semibold transition-all transform hover:-translate-y-1 shadow-xl hover:shadow-2xl"
                        >
                            <span>Explore All Templates</span>
                            <ArrowRight className="h-4 sm:h-5 w-4 sm:w-5 ml-2 group-hover:translate-x-1 transition-transform" />
                        </a>
                    </motion.div>
                </div>
            </div>
        </section>
    )
}

export default Templates