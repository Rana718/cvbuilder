"use client";

import { motion } from "framer-motion";
import { FileText, Sparkles, Download, ArrowRight, User, Star, Clock, Shield, Zap, CheckCircle } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { useAuth } from "@/components/AuthContext";
import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function Home() {
  const { user } = useAuth();
  const router = useRouter();
  useEffect(() => {
    console.log("Current user:", user);
  }, [user])

  return (
    <div className="min-h-screen bg-white">
      {/* Navbar */}
      <Navbar />
      <section className="relative overflow-hidden bg-gradient-to-br from-blue-50 via-white to-purple-50">
        {/* Background Elements */}
        <div className="absolute top-20 left-10 w-72 h-72 bg-blue-200 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse"></div>
        <div className="absolute top-40 right-10 w-80 h-80 bg-purple-200 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse delay-1000"></div>

        <div className="relative container mx-auto px-6 pt-12 pb-20">
          {/* AI Badge */}
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="flex justify-center mb-8"
          >
            <div className="inline-flex items-center bg-blue-100 text-blue-700 px-4 py-2 rounded-full text-sm font-medium">
              <Sparkles className="h-4 w-4 mr-2" />
              AI-Powered Resume Builder
            </div>
          </motion.div>

          <div className="grid lg:grid-cols-2 gap-12 items-center max-w-7xl mx-auto">
            {/* Left Content */}
            <div className="text-center lg:text-left">
              <motion.h1
                initial={{ y: 30, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.8, delay: 0.3 }}
                className="text-4xl lg:text-5xl xl:text-6xl font-bold text-gray-900 mb-6 leading-tight"
              >
                AI Resume Builder
                <span className="block text-transparent bg-clip-text bg-gradient-to-r from-blue-500 to-purple-600 mt-2">
                  Fast, Easy & Free
                </span>
              </motion.h1>

              <motion.p
                initial={{ y: 30, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.8, delay: 0.5 }}
                className="text-lg lg:text-xl text-gray-600 mb-8 leading-relaxed max-w-xl lg:max-w-none"
              >
                Land your next job with our intelligent AI resume builder. Work from your computer or phone with professionally designed templates and get AI-powered content suggestions tailored to your career.
              </motion.p>

              <motion.div
                initial={{ y: 30, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.8, delay: 0.7 }}
                className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start mb-10"
              >
                <button 
                  className="group bg-[#ffc05a] text-black px-8 py-4 rounded-xl text-lg font-semibold flex items-center justify-center space-x-2 transition-all shadow-lg hover:shadow-xl transform hover:-translate-y-1"
                  onClick={()=> router.push("/template")}  
                >
                  <span>Create my resume</span>
                  <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
                </button>
                <button className="bg-orange-400 hover:bg-orange-500 text-white px-8 py-4 rounded-xl text-lg font-semibold transition-all shadow-lg hover:shadow-xl transform hover:-translate-y-1">
                  Import your resume
                </button>
              </motion.div>

              {/* Trust Indicators */}
              <motion.div
                initial={{ y: 30, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.8, delay: 0.9 }}
                className="flex flex-wrap items-center justify-center lg:justify-start gap-6 text-sm text-gray-500"
              >
                <div className="flex items-center space-x-2">
                  <CheckCircle className="h-4 w-4 text-green-500" />
                  <span>No credit card required</span>
                </div>
                <div className="flex items-center space-x-2">
                  <CheckCircle className="h-4 w-4 text-green-500" />
                  <span>Free to use</span>
                </div>
                <div className="flex items-center space-x-2">
                  <CheckCircle className="h-4 w-4 text-green-500" />
                  <span>ATS-friendly</span>
                </div>
              </motion.div>
            </div>

            {/* Right Content - Image */}
            <motion.div
              initial={{ x: 50, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ duration: 1, delay: 0.5 }}
              className="relative lg:mt-0 mt-8"
            >
              <div className="relative">
                <img
                  src="/img/banner.png"
                  alt="AI Resume Builder Preview"
                  className="w-full max-w-lg xl:max-w-xl mx-auto rounded-2xl shadow-2xl border border-gray-200"
                />

                {/* Floating elements - repositioned */}
                <motion.div
                  initial={{ scale: 0, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ duration: 0.5, delay: 1.2 }}
                  className="absolute -top-4 -left-4 bg-white rounded-xl shadow-lg p-3 border border-gray-100"
                >
                  <div className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                    <span className="text-xs font-medium text-gray-700">Smart AI Help</span>
                  </div>
                </motion.div>

                <motion.div
                  initial={{ scale: 0, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ duration: 0.5, delay: 1.4 }}
                  className="absolute -bottom-4 -right-4 bg-white rounded-xl shadow-lg p-3 border border-gray-100"
                >
                  <div className="flex items-center space-x-2">
                    <Zap className="h-4 w-4 text-yellow-500" />
                    <span className="text-xs font-medium text-gray-700">2x Faster</span>
                  </div>
                </motion.div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* AI Feature Highlight */}
      <section className="py-20 bg-gradient-to-r from-purple-50 to-blue-50">
        <div className="container mx-auto px-6">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <motion.div
              initial={{ x: -50, opacity: 0 }}
              whileInView={{ x: 0, opacity: 1 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
            >
              <div className="bg-gradient-to-br from-purple-100 to-blue-100 rounded-2xl p-8 relative overflow-hidden">
                <div className="absolute top-4 right-4 bg-purple-500 text-white px-3 py-1 rounded-full text-sm font-medium">
                  AI Powered
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-4">🎯 Let AI do the work!</h3>
                <p className="text-gray-700 mb-6 leading-relaxed">
                  Describe your role in a few words, and we'll generate tailored content for your work experience section.
                </p>
                <button className="bg-purple-500 hover:bg-purple-600 text-white px-6 py-3 rounded-lg font-medium transition-colors flex items-center space-x-2">
                  <span>Try it first</span>
                  <ArrowRight className="h-4 w-4" />
                </button>
              </div>
            </motion.div>

            <motion.div
              initial={{ x: 50, opacity: 0 }}
              whileInView={{ x: 0, opacity: 1 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
              className="space-y-6"
            >
              <h2 className="text-4xl font-bold text-gray-900">Generate Your Resume Bullet Points with AI</h2>
              <p className="text-xl text-gray-600 leading-relaxed">
                Our advanced AI analyzes millions of successful resumes to provide you with industry-specific content suggestions that get results.
              </p>

              <div className="space-y-4">
                {[
                  "AI-generated content tailored to your industry",
                  "Professional language and keywords",
                  "ATS-optimized formatting",
                  "Real-time suggestions as you type"
                ].map((feature, i) => (
                  <div key={i} className="flex items-center space-x-3">
                    <CheckCircle className="h-5 w-5 text-green-500" />
                    <span className="text-gray-700">{feature}</span>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="bg-gray-50 py-20">
        <div className="container mx-auto px-6">
          <motion.div
            initial={{ y: 50, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Why Choose Our AI Resume Builder?</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Create professional resumes that stand out to employers with intelligent AI assistance and modern design principles.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {[
              {
                icon: Sparkles,
                title: "Intelligent Content Generation",
                desc: "AI analyzes your role and suggests powerful, industry-specific bullet points that highlight your achievements and skills effectively.",
                color: "blue",
                gradient: "from-blue-500 to-blue-600"
              },
              {
                icon: FileText,
                title: "ATS-Optimized Templates",
                desc: "Choose from carefully crafted templates designed to pass Applicant Tracking Systems while maintaining visual appeal.",
                color: "purple",
                gradient: "from-purple-500 to-purple-600"
              },
              {
                icon: Download,
                title: "Flexible Export Options",
                desc: "Download your resume as PDF or Word document, or create shareable links for easy online applications.",
                color: "green",
                gradient: "from-green-500 to-green-600"
              },
              {
                icon: Clock,
                title: "Save Time & Effort",
                desc: "Skip the blank page struggle. Our AI helps you write compelling content quickly, so you can focus on job hunting.",
                color: "orange",
                gradient: "from-orange-500 to-orange-600"
              },
              {
                icon: Shield,
                title: "Secure & Private",
                desc: "Your personal information stays protected. We prioritize data privacy and never sell or share your details.",
                color: "red",
                gradient: "from-red-500 to-red-600"
              },
              {
                icon: Zap,
                title: "Live Preview & Editing",
                desc: "See exactly how your resume looks as you build it. Make instant adjustments with real-time preview functionality.",
                color: "indigo",
                gradient: "from-indigo-500 to-indigo-600"
              }
            ].map((feature, i) => (
              <motion.div
                key={i}
                initial={{ y: 50, opacity: 0 }}
                whileInView={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.6, delay: i * 0.1 }}
                viewport={{ once: true }}
                className="bg-white rounded-2xl p-8 text-center hover:shadow-xl transition-all duration-300 border border-gray-100 group hover:-translate-y-2"
              >
                <div className={`bg-gradient-to-r ${feature.gradient} w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300`}>
                  <feature.icon className="h-8 w-8 text-white" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-4">{feature.title}</h3>
                <p className="text-gray-600 leading-relaxed">{feature.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Templates Preview */}
      <section id="templates" className="py-20">
        <div className="container mx-auto px-6">
          <motion.div
            initial={{ y: 50, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Professional Templates</h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Choose from our collection of expertly designed templates that pass ATS systems and impress recruiters.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8 mb-12 max-w-5xl mx-auto">
            {[
              { id: 1, name: "Modern Professional" },
              { id: 2, name: "Creative Designer" },
              { id: 3, name: "Tech Specialist" }
            ].map((template, i) => (
              <motion.div
                key={i}
                initial={{ y: 50, opacity: 0 }}
                whileInView={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.6, delay: i * 0.1 }}
                viewport={{ once: true }}
                className="group cursor-pointer"
              >
                <div className="relative">
                  {/* Choose Button on Top */}
                  <div className="absolute top-4 left-1/2 transform -translate-x-1/2 z-10">
                    <button className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg font-medium transition-all shadow-lg opacity-0 group-hover:opacity-100 transform translate-y-2 group-hover:translate-y-0">
                      Choose
                    </button>
                  </div>

                  {/* A4 Template Preview */}
                  <div className="relative bg-white border border-gray-200 rounded-lg shadow-md group-hover:shadow-lg transition-all aspect-[1/1.414] overflow-hidden">
                    {/* Template Content - A4 Ratio */}
                    <div className="p-4 h-full">
                      {/* Header */}
                      <div className="text-center mb-3 border-b border-gray-100 pb-3">
                        <div className="w-16 h-16 bg-gray-200 rounded-full mx-auto mb-2"></div>
                        <div className="h-3 bg-gray-300 rounded w-24 mx-auto mb-1"></div>
                        <div className="h-2 bg-gray-200 rounded w-20 mx-auto"></div>
                      </div>

                      {/* Content Sections */}
                      <div className="space-y-3">
                        {/* Section 1 */}
                        <div>
                          <div className="h-2 bg-blue-300 rounded w-16 mb-2"></div>
                          <div className="space-y-1">
                            <div className="h-1.5 bg-gray-200 rounded w-full"></div>
                            <div className="h-1.5 bg-gray-200 rounded w-4/5"></div>
                            <div className="h-1.5 bg-gray-200 rounded w-3/4"></div>
                          </div>
                        </div>

                        {/* Section 2 */}
                        <div>
                          <div className="h-2 bg-blue-300 rounded w-20 mb-2"></div>
                          <div className="space-y-1">
                            <div className="h-1.5 bg-gray-200 rounded w-full"></div>
                            <div className="h-1.5 bg-gray-200 rounded w-5/6"></div>
                          </div>
                        </div>

                        {/* Section 3 */}
                        <div>
                          <div className="h-2 bg-blue-300 rounded w-14 mb-2"></div>
                          <div className="space-y-1">
                            <div className="h-1.5 bg-gray-200 rounded w-4/5"></div>
                            <div className="h-1.5 bg-gray-200 rounded w-3/5"></div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          <div className="text-center">
            <a href="/template" className="bg-blue-500 hover:bg-blue-600 text-white px-8 py-3 rounded-lg font-semibold transition-colors inline-block">
              View All Templates
            </a>
          </div>
        </div>
      </section>

      {/* Feedback/Reviews */}
      <section id="feedback" className="bg-gray-50 py-20">
        <div className="container mx-auto px-6">
          <motion.div
            initial={{ y: 50, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-bold text-gray-900 mb-4">What Our Users Say</h2>
            <p className="text-xl text-gray-600">Join thousands of professionals who landed their dream jobs</p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                name: "Sarah Johnson",
                role: "Marketing Manager",
                company: "Tech Corp",
                rating: 5,
                text: "This AI CV builder helped me land my dream job! The suggestions were spot-on and the templates look incredibly professional."
              },
              {
                name: "Michael Chen",
                role: "Software Engineer",
                company: "StartupXYZ",
                rating: 5,
                text: "I was amazed by how quickly I could create a polished resume. The AI suggestions saved me hours of writing and editing."
              },
              {
                name: "Emily Rodriguez",
                role: "Project Manager",
                company: "Global Inc",
                rating: 5,
                text: "The ATS-friendly templates made all the difference. I started getting more interview calls within a week of updating my resume."
              }
            ].map((review, i) => (
              <motion.div
                key={i}
                initial={{ y: 50, opacity: 0 }}
                whileInView={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.6, delay: i * 0.2 }}
                viewport={{ once: true }}
                className="bg-white rounded-xl p-8 shadow-sm border border-gray-100"
              >
                <div className="flex items-center mb-4">
                  {[...Array(review.rating)].map((_, j) => (
                    <Star key={j} className="h-5 w-5 text-yellow-400 fill-current" />
                  ))}
                </div>
                <p className="text-gray-600 mb-6 leading-relaxed">"{review.text}"</p>
                <div className="flex items-center">
                  <div className="bg-gray-200 w-12 h-12 rounded-full flex items-center justify-center mr-4">
                    <User className="h-6 w-6 text-gray-600" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900">{review.name}</h4>
                    <p className="text-sm text-gray-500">{review.role} at {review.company}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20">
        <div className="container mx-auto px-6 text-center">
          <motion.div
            initial={{ y: 50, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl font-bold text-gray-900 mb-6">Ready to Transform Your Career?</h2>
            <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
              Join professionals who have successfully built their perfect resume with our AI-powered platform and landed great opportunities.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a href="/template" className="bg-blue-500 hover:bg-blue-600 text-white px-12 py-4 rounded-lg text-xl font-semibold transition-all text-center">
                Start Building Now
              </a>
              <a href="/template" className="border-2 border-blue-500 text-blue-500 hover:bg-blue-500 hover:text-white px-12 py-4 rounded-lg text-xl font-semibold transition-all text-center">
                Try Free Demo
              </a>
            </div>
          </motion.div>
        </div>
      </section>
      <Footer />
    </div>
  );
}