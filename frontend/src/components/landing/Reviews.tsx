import { motion } from 'framer-motion'
import { Star, Zap, ArrowRight, FileText, CheckCircle, Shield } from 'lucide-react'
import React from 'react'


const reviews = [
    {
        name: "Sarah Johnson",
        role: "Marketing Director",
        company: "Fortune 500 Company",
        rating: 5,
        avatar: "SJ",
        text: "This Resumeai world transformed my career search! The intelligent suggestions helped me articulate my achievements perfectly. I landed my dream role within 3 weeks of updating my resume."
    },
    {
        name: "Michael Chen",
        role: "Senior Software Engineer",
        company: "Tech Unicorn",
        rating: 5,
        avatar: "MC",
        text: "As a developer, I was skeptical about AI writing tools. But this platform understood my technical background and generated compelling content that actually got me past ATS systems."
    },
    {
        name: "Emily Rodriguez",
        role: "Project Manager",
        company: "Global Consulting Firm",
        rating: 5,
        avatar: "ER",
        text: "The professional templates and AI optimization made all the difference. My interview rate increased by 300% after switching to this platform. Absolutely worth the investment."
    }
]

const stats = [
    { number: "50K+", label: "Happy Users" },
    { number: "95%", label: "Success Rate" },
    { number: "4.9/5", label: "User Rating" },
    { number: "24/7", label: "Support" }
]

function Reviews() {
    return (
        <div>
            <section id="feedback" className="py-12 sm:py-16 lg:py-24 bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-900 relative overflow-hidden">
                <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff08_1px,transparent_1px),linear-gradient(to_bottom,#ffffff08_1px,transparent_1px)] bg-[size:32px_32px]"></div>

                <div className="container mx-auto px-4 sm:px-6 relative">
                    <motion.div
                        initial={{ y: 50, opacity: 0 }}
                        whileInView={{ y: 0, opacity: 1 }}
                        transition={{ duration: 0.8 }}
                        viewport={{ once: true }}
                        className="text-center mb-12 sm:mb-16 lg:mb-20"
                    >
                        <div className="inline-flex items-center bg-yellow-500/20 border border-yellow-400/30 text-yellow-300 px-4 sm:px-6 py-2 sm:py-3 rounded-full text-sm font-medium mb-4 sm:mb-6 backdrop-blur-sm">
                            <Star className="h-4 w-4 mr-2" />
                            Success Stories
                        </div>
                        <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-4 sm:mb-6">
                            Loved by
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-orange-500">
                                Professionals
                            </span>
                            <span className="block">Worldwide</span>
                        </h2>
                        <p className="text-lg sm:text-xl text-blue-100 max-w-3xl mx-auto leading-relaxed px-2 sm:px-0">
                            Join thousands of professionals who transformed their careers with our AI-powered resume builder
                        </p>
                    </motion.div>

                    <div className="grid md:grid-cols-3 gap-6 sm:gap-8 mb-12 sm:mb-16">
                        {reviews.map((review, i) => (
                            <motion.div
                                key={i}
                                initial={{ y: 50, opacity: 0 }}
                                whileInView={{ y: 0, opacity: 1 }}
                                transition={{ duration: 0.6, delay: i * 0.2 }}
                                viewport={{ once: true }}
                                className="relative group"
                            >
                                <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-white/5 blur-xl rounded-3xl group-hover:blur-2xl transition-all duration-300"></div>

                                <div className="relative bg-white/10 backdrop-blur-xl rounded-3xl p-6 sm:p-8 border border-white/20 shadow-2xl hover:shadow-3xl transition-all duration-300">
                                    {/* Rating */}
                                    <div className="flex items-center mb-4 sm:mb-6">
                                        {[...Array(review.rating)].map((_, j) => (
                                            <Star key={j} className="h-4 sm:h-5 w-4 sm:w-5 text-yellow-400 fill-current" />
                                        ))}
                                        <span className="ml-2 text-yellow-400 font-medium text-sm">5.0</span>
                                    </div>

                                    {/* Review Text */}
                                    <p className="text-blue-100 mb-6 sm:mb-8 leading-relaxed font-medium text-sm sm:text-base">
                                        "{review.text}"
                                    </p>

                                    {/* Reviewer Info */}
                                    <div className="flex items-center">
                                        <div className="bg-gradient-to-br from-blue-500 to-purple-600 w-10 sm:w-12 h-10 sm:h-12 rounded-full flex items-center justify-center mr-3 sm:mr-4 text-white font-bold text-sm sm:text-base">
                                            {review.avatar}
                                        </div>
                                        <div>
                                            <h4 className="font-bold text-white text-base sm:text-lg">{review.name}</h4>
                                            <p className="text-blue-200 text-sm">{review.role}</p>
                                            <p className="text-blue-300 text-xs">{review.company}</p>
                                        </div>
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </div>

                    {/* Trust indicators */}
                    <motion.div
                        initial={{ y: 30, opacity: 0 }}
                        whileInView={{ y: 0, opacity: 1 }}
                        transition={{ duration: 0.6 }}
                        viewport={{ once: true }}
                        className="grid grid-cols-2 md:grid-cols-4 gap-6 sm:gap-8 text-center"
                    >
                        {stats.map((stat, i) => (
                            <div key={i} className="text-center">
                                <div className="text-2xl sm:text-3xl font-bold text-white mb-1 sm:mb-2">{stat.number}</div>
                                <div className="text-blue-200 text-xs sm:text-sm">{stat.label}</div>
                            </div>
                        ))}
                    </motion.div>
                </div>
            </section>

            {/* Enhanced CTA Section */}
            <section className="py-12 sm:py-16 lg:py-24 bg-gradient-to-br from-slate-50 to-blue-50/30 relative overflow-hidden">
                {/* Background elements */}
                <div className="absolute top-20 left-10 w-72 h-72 bg-blue-400/10 rounded-full mix-blend-multiply filter blur-3xl animate-pulse"></div>
                <div className="absolute bottom-20 right-10 w-96 h-96 bg-purple-400/10 rounded-full mix-blend-multiply filter blur-3xl animate-pulse delay-1000"></div>

                <div className="container mx-auto px-4 sm:px-6 text-center relative">
                    <motion.div
                        initial={{ y: 50, opacity: 0 }}
                        whileInView={{ y: 0, opacity: 1 }}
                        transition={{ duration: 0.8 }}
                        viewport={{ once: true }}
                        className="max-w-4xl mx-auto"
                    >
                        <div className="inline-flex items-center bg-gradient-to-r from-blue-100 to-purple-100 text-slate-700 px-4 sm:px-6 py-2 sm:py-3 rounded-full text-sm font-medium mb-6 sm:mb-8">
                            <Zap className="h-4 w-4 mr-2" />
                            <span>Ready to Transform Your Career?</span>
                        </div>

                        <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-slate-900 mb-6 sm:mb-8 leading-tight px-2 sm:px-0">
                            Your Dream Job is Just
                            <span className="block text-transparent bg-clip-text bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600">
                                One Resume Away
                            </span>
                        </h2>

                        <p className="text-lg sm:text-xl lg:text-2xl text-slate-600 mb-8 sm:mb-12 max-w-3xl mx-auto leading-relaxed px-2 sm:px-0">
                            Join thousands of successful professionals who landed their perfect roles
                            with our AI-powered resume builder. Start your success story today.
                        </p>

                        <div className="flex flex-col sm:flex-row gap-4 sm:gap-6 justify-center mb-8 sm:mb-12">
                            <motion.a
                                href="/template"
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                className="group bg-gradient-to-r from-blue-600 to-purple-600 text-white px-8 sm:px-12 py-4 sm:py-5 rounded-2xl text-lg sm:text-xl font-bold transition-all shadow-xl hover:shadow-2xl"
                            >
                                <span className="flex items-center justify-center space-x-3">
                                    <span>Start Building Now</span>
                                    <ArrowRight className="h-5 sm:h-6 w-5 sm:w-6 group-hover:translate-x-1 transition-transform" />
                                </span>
                            </motion.a>

                            <motion.a
                                href="/template"
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                className="group bg-white border-2 border-slate-200 hover:border-blue-300 text-slate-700 hover:text-blue-700 px-8 sm:px-12 py-4 sm:py-5 rounded-2xl text-lg sm:text-xl font-bold transition-all shadow-lg hover:shadow-xl"
                            >
                                <span className="flex items-center justify-center space-x-3">
                                    <FileText className="h-5 sm:h-6 w-5 sm:w-6" />
                                    <span>View Templates</span>
                                </span>
                            </motion.a>
                        </div>

                        {/* Final trust indicators */}
                        <div className="flex flex-wrap items-center justify-center gap-4 sm:gap-8 text-slate-500 px-2 sm:px-0">
                            <div className="flex items-center space-x-2">
                                <CheckCircle className="h-4 sm:h-5 w-4 sm:w-5 text-emerald-500" />
                                <span className="text-sm sm:text-base">Free to start</span>
                            </div>
                            <div className="flex items-center space-x-2">
                                <Shield className="h-4 sm:h-5 w-4 sm:w-5 text-blue-500" />
                                <span className="text-sm sm:text-base">Secure & private</span>
                            </div>
                            <div className="flex items-center space-x-2">
                                <Star className="h-4 sm:h-5 w-4 sm:w-5 text-yellow-500" />
                                <span className="text-sm sm:text-base">Rated 4.9/5</span>
                            </div>
                        </div>
                    </motion.div>
                </div>
            </section>
        </div>
    )
}

export default Reviews