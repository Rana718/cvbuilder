"use client";

import { motion } from "framer-motion";
import { FileText, Sparkles, Download, ArrowRight, User, Star, Clock, Shield, Zap, CheckCircle, TrendingUp, Globe, Award, Brain, Mail } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import PaymentCard from "@/components/PaymentCard";
import { useAuth } from "@/components/AuthContext";
import { usePremiumStatus } from "@/hooks/usePremiumStatus";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";

export default function Home() {
  const { user } = useAuth();
  const { isPremium, refreshStatus } = usePremiumStatus();
  const router = useRouter();
  const [showPaymentCard, setShowPaymentCard] = useState(false);
  
  useEffect(() => {
    console.log("Current user:", user);
  }, [user])

  const handlePremiumUpgrade = () => {
    if (!user) {
      router.push('/sign-in');
      return;
    }

    if (isPremium) {
      alert('You are already a premium user!');
      return;
    }

    setShowPaymentCard(true);
  };

  const handlePaymentSuccess = async () => {
    await refreshStatus();
    setShowPaymentCard(false);
    alert('Welcome to Premium! You now have access to all premium features.');
  };

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Navbar */}
      <Navbar />
      
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-100/50 min-h-screen flex items-center">
        {/* Enhanced Background Elements */}
        <div className="absolute inset-0">
          <div className="absolute top-20 left-10 w-96 h-96 bg-gradient-to-r from-blue-400/20 to-indigo-500/20 rounded-full mix-blend-multiply filter blur-3xl animate-pulse"></div>
          <div className="absolute top-40 right-10 w-80 h-80 bg-gradient-to-r from-purple-400/20 to-pink-500/20 rounded-full mix-blend-multiply filter blur-3xl animate-pulse delay-1000"></div>
          <div className="absolute bottom-20 left-1/2 w-72 h-72 bg-gradient-to-r from-emerald-400/20 to-teal-500/20 rounded-full mix-blend-multiply filter blur-3xl animate-pulse delay-2000"></div>
        </div>

        {/* Floating grid pattern */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]"></div>

        <div className="relative container mx-auto px-4 pt-8 md:pt-0">
          {/* Enhanced AI Badge */}
          <motion.div
            initial={{ y: 20, opacity: 0, scale: 0.9 }}
            animate={{ y: 0, opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="flex justify-center mb-6 sm:mb-8"
          >
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-blue-500/20 to-purple-500/20 blur-xl rounded-full"></div>
              <div className="relative inline-flex items-center bg-white/90 backdrop-blur-sm border border-white/20 shadow-lg text-slate-700 px-4 sm:px-6 py-2 sm:py-3 rounded-full text-sm font-medium">
                <div className="w-2 h-2 bg-green-500 rounded-full mr-2 sm:mr-3 animate-pulse"></div>
                <Sparkles className="h-4 w-4 mr-2 text-blue-600" />
                <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent font-semibold">
                  AI-Powered Resume Builder
                </span>
              </div>
            </div>
          </motion.div>

          <div className="grid lg:grid-cols-2 gap-8 lg:gap-16 items-center max-w-7xl mx-auto">
            {/* Enhanced Left Content */}
            <div className="text-center lg:text-left">
              <motion.h1
                initial={{ y: 30, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.8, delay: 0.3 }}
                className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold text-slate-900 mb-4 sm:mb-6 leading-[1.1]"
              >
                Build Your
                <span className="block text-transparent bg-clip-text bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 mt-2 relative">
                  Dream Career
                  <div className="absolute -bottom-2 left-0 right-0 h-1 bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 rounded-full transform scale-x-0 animate-pulse"></div>
                </span>
                <span className="block text-slate-700 text-xl sm:text-2xl md:text-3xl lg:text-4xl font-medium mt-2 sm:mt-4">
                  with AI Precision
                </span>
              </motion.h1>

              <motion.p
                initial={{ y: 30, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.8, delay: 0.5 }}
                className="text-lg sm:text-xl lg:text-2xl text-slate-600 mb-8 sm:mb-10 leading-relaxed max-w-2xl lg:max-w-none font-light px-2 sm:px-0"
              >
                Transform your career journey with our intelligent AI that crafts compelling resumes, 
                optimizes for ATS systems, and helps you land interviews at top companies.
              </motion.p>

              <motion.div
                initial={{ y: 30, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.8, delay: 0.7 }}
                className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center lg:justify-start mb-8 sm:mb-12"
              >
                <button
                  className="group relative bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 sm:px-10 py-4 sm:py-5 rounded-2xl text-base sm:text-lg font-semibold flex items-center justify-center space-x-3 transition-all duration-300 shadow-xl hover:shadow-2xl transform hover:-translate-y-1 overflow-hidden"
                  onClick={() => router.push("/template")}
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-blue-700 to-purple-700 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  <span className="relative z-10">Create Resume Now</span>
                  <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform relative z-10" />
                </button>
                <button className="group bg-white/80 backdrop-blur-sm border-2 border-slate-200 hover:border-blue-300 text-slate-700 hover:text-blue-700 px-6 sm:px-10 py-4 sm:py-5 rounded-2xl text-base sm:text-lg font-semibold transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1">
                  <span className="flex items-center space-x-2">
                    <Download className="h-5 w-5" />
                    <span>Import Resume</span>
                  </span>
                </button>
              </motion.div>

              {/* Enhanced Trust Indicators */}
              <motion.div
                initial={{ y: 30, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.8, delay: 0.9 }}
                className="flex flex-wrap items-center justify-center lg:justify-start gap-4 sm:gap-8 text-sm px-2 sm:px-0"
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
                    alt="AI Resume Builder Preview"
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

      {/* Enhanced AI Feature Highlight */}
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
                {/* Glowing effect */}
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
                    {[
                      "Industry-specific keyword optimization",
                      "Achievement-focused bullet points",
                      "ATS-friendly formatting",
                      "Professional tone and language"
                    ].map((feature, i) => (
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
                  
                  <button className="group bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white px-6 sm:px-8 py-3 sm:py-4 rounded-xl font-semibold transition-all transform hover:-translate-y-1 shadow-lg flex items-center space-x-2">
                    <span>Experience AI Magic</span>
                    <ArrowRight className="h-4 sm:h-5 w-4 sm:w-5 group-hover:translate-x-1 transition-transform" />
                  </button>
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
                {[
                  { number: "3x", label: "More Interviews", icon: TrendingUp },
                  { number: "95%", label: "ATS Pass Rate", icon: CheckCircle },
                  { number: "10M+", label: "Resumes Created", icon: Globe },
                  { number: "4.9★", label: "User Rating", icon: Star }
                ].map((stat, i) => (
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
            {[
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
            ].map((feature, i) => (
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

      {/* Enhanced Pricing Plans */}
      <section id="pricing" className="py-12 sm:py-16 lg:py-24 bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-900 relative overflow-hidden">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff08_1px,transparent_1px),linear-gradient(to_bottom,#ffffff08_1px,transparent_1px)] bg-[size:40px_40px]"></div>
        
        <div className="container mx-auto px-4 sm:px-6 relative">
          <motion.div
            initial={{ y: 50, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-12 sm:mb-16 lg:mb-20"
          >
            <div className="inline-flex items-center bg-blue-500/20 border border-blue-400/30 text-blue-300 px-4 sm:px-6 py-2 sm:py-3 rounded-full text-sm font-medium mb-4 sm:mb-6 backdrop-blur-sm">
              <Star className="h-4 w-4 mr-2" />
              Simple, Transparent Pricing
            </div>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-4 sm:mb-6">
              Choose Your 
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-400">
                Success Plan
              </span>
            </h2>
            <p className="text-lg sm:text-xl text-blue-100 max-w-3xl mx-auto leading-relaxed px-2 sm:px-0">
              Start building for free or unlock premium features for unlimited professional resumes
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 gap-6 sm:gap-8 max-w-5xl mx-auto">
            {/* Free Plan - Enhanced */}
            <motion.div
              initial={{ y: 50, opacity: 0 }}
              whileInView={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
              className="relative group"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-slate-800/50 to-blue-800/50 blur-xl rounded-3xl group-hover:blur-2xl transition-all duration-300"></div>
              
              <div className="relative bg-white/10 backdrop-blur-xl rounded-3xl p-6 sm:p-8 lg:p-10 border border-white/20 shadow-2xl hover:shadow-3xl transition-all duration-300 flex flex-col h-full">
                <div className="text-center mb-6 sm:mb-8">
                  <div className="inline-flex items-center bg-white/10 text-white px-3 sm:px-4 py-1 sm:py-2 rounded-full text-sm font-medium mb-3 sm:mb-4">
                    <CheckCircle className="h-4 w-4 mr-2" />
                    Free Forever
                  </div>
                  <h3 className="text-xl sm:text-2xl font-bold text-white mb-3 sm:mb-4">Starter Plan</h3>
                  <div className="text-4xl sm:text-5xl font-bold text-white mb-2">₹0</div>
                  <p className="text-blue-200">Perfect to get started</p>
                </div>

                <div className="space-y-3 sm:space-y-4 mb-6 sm:mb-8 flex-grow">
                  {[
                    "1 Professional resume",
                    "AI content suggestions",
                    "3 Premium templates",
                    "PDF download",
                    "Basic customization",
                    "Resume includes watermark"
                  ].map((feature, i) => (
                    <div key={i} className="flex items-center space-x-3">
                      <CheckCircle className="h-4 sm:h-5 w-4 sm:w-5 text-blue-400 flex-shrink-0" />
                      <span className="text-blue-100 text-sm sm:text-base">{feature}</span>
                    </div>
                  ))}
                </div>

                <button className="w-full bg-white/10 hover:bg-white/20 border border-white/20 text-white py-3 sm:py-4 rounded-xl font-semibold transition-all duration-300 backdrop-blur-sm">
                  Start Building Free
                </button>
              </div>
            </motion.div>

            {/* Premium Plan - Enhanced */}
            <motion.div
              initial={{ y: 50, opacity: 0 }}
              whileInView={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              viewport={{ once: true }}
              className="relative group"
            >
              {/* Popular badge */}
              <div className="absolute -top-4 sm:-top-6 left-1/2 transform -translate-x-1/2 z-20">
                <div className="bg-gradient-to-r from-orange-500 to-pink-600 text-white px-4 sm:px-8 py-2 sm:py-3 rounded-full text-sm font-bold shadow-lg">
                  ⭐ Most Popular
                </div>
              </div>

              <div className="absolute inset-0 bg-gradient-to-br from-blue-500/30 to-purple-600/30 blur-xl rounded-3xl group-hover:blur-2xl transition-all duration-300"></div>
              
              <div className="relative bg-gradient-to-br from-white/15 to-white/10 backdrop-blur-xl rounded-3xl p-6 sm:p-8 lg:p-10 border border-white/30 shadow-2xl hover:shadow-3xl transition-all duration-300 flex flex-col h-full">
                <div className="text-center mb-6 sm:mb-8">
                  <div className="inline-flex items-center bg-gradient-to-r from-blue-500/20 to-purple-600/20 border border-blue-400/30 text-blue-300 px-3 sm:px-4 py-1 sm:py-2 rounded-full text-sm font-medium mb-3 sm:mb-4 backdrop-blur-sm">
                    <Award className="h-4 w-4 mr-2" />
                    Premium Access
                  </div>
                  <h3 className="text-xl sm:text-2xl font-bold text-white mb-3 sm:mb-4">Professional Plan</h3>
                  <div className="text-4xl sm:text-5xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent mb-2">₹90</div>
                  <p className="text-blue-200 mb-2">per month</p>
                  <p className="text-sm text-blue-300">Cancel anytime • 30-day guarantee</p>
                </div>

                <div className="space-y-3 sm:space-y-4 mb-6 sm:mb-8 flex-grow">
                  {[
                    "Unlimited professional resumes",
                    "Advanced AI content generation", 
                    "15+ Premium templates",
                    "Multiple export formats",
                    "No watermarks",
                    "Priority customer support",
                    "Advanced customization",
                    "Resume analytics & insights"
                  ].map((feature, i) => (
                    <div key={i} className="flex items-center space-x-3">
                      <CheckCircle className="h-4 sm:h-5 w-4 sm:w-5 text-emerald-400 flex-shrink-0" />
                      <span className="text-white font-medium text-sm sm:text-base">{feature}</span>
                    </div>
                  ))}
                </div>

                <button 
                  onClick={handlePremiumUpgrade}
                  className="w-full bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white py-3 sm:py-4 rounded-xl font-bold transition-all duration-300 transform hover:-translate-y-1 shadow-lg hover:shadow-xl"
                >
                  {isPremium ? 'Already Premium ✓' : 'Upgrade to Premium'}
                </button>
              </div>
            </motion.div>
          </div>

          {/* Money Back Guarantee */}
          <motion.div
            initial={{ y: 30, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            viewport={{ once: true }}
            className="text-center mt-12 sm:mt-16"
          >
            <div className="inline-flex items-center bg-emerald-500/20 border border-emerald-400/30 text-emerald-300 px-6 sm:px-8 py-3 sm:py-4 rounded-full backdrop-blur-sm">
              <Shield className="h-5 sm:h-6 w-5 sm:w-6 mr-2 sm:mr-3" />
              <span className="font-semibold text-base sm:text-lg">30-Day Money-Back Guarantee</span>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Enhanced Templates Preview */}
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
            {[
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
            ].map((template, i) => (
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

      {/* Enhanced Reviews Section */}
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
            {[
              {
                name: "Sarah Johnson",
                role: "Marketing Director",
                company: "Fortune 500 Company",
                rating: 5,
                avatar: "SJ",
                text: "This AI resume builder transformed my career search! The intelligent suggestions helped me articulate my achievements perfectly. I landed my dream role within 3 weeks of updating my resume."
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
            ].map((review, i) => (
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
            {[
              { number: "50K+", label: "Happy Users" },
              { number: "95%", label: "Success Rate" },
              { number: "4.9/5", label: "User Rating" },
              { number: "24/7", label: "Support" }
            ].map((stat, i) => (
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

      {/* FAQ Section */}
      <section className="py-16 sm:py-24 bg-white">
        <div className="container mx-auto px-4 sm:px-6 max-w-4xl">
          <motion.div
            initial={{ y: 30, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 mb-4">
              Frequently Asked Questions
            </h2>
            <p className="text-lg text-slate-600">
              Everything you need to know about our AI resume builder
            </p>
          </motion.div>

          <motion.div
            initial={{ y: 20, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            viewport={{ once: true }}
          >
            <Accordion type="single" collapsible className="space-y-4">
              {[
                {
                  question: "Is the resume builder really free?",
                  answer: "Yes! You can create and download your first resume completely free. Premium features unlock additional templates and AI enhancements."
                },
                {
                  question: "How does the AI help with my resume?",
                  answer: "Our AI analyzes your experience and suggests optimized content, skills, and formatting to help you stand out to employers and pass ATS systems."
                },
                {
                  question: "Are the resumes ATS-friendly?",
                  answer: "Absolutely! All our templates are designed to be ATS-compatible, ensuring your resume gets past automated screening systems."
                },
                {
                  question: "Can I edit my resume after downloading?",
                  answer: "Yes, you can return anytime to edit your saved resumes. Premium users get unlimited edits and downloads."
                },
                {
                  question: "What file formats are available?",
                  answer: "You can download your resume as a high-quality PDF, which is the preferred format by most employers."
                },
                {
                  question: "How secure is my personal information?",
                  answer: "We use enterprise-grade security with SSL encryption. Your data is never shared with third parties and you can delete it anytime."
                }
              ].map((faq, index) => (
                <AccordionItem key={index} value={`item-${index}`} className="bg-slate-50 rounded-xl px-6 border-0">
                  <AccordionTrigger className="text-lg font-semibold text-slate-900 hover:no-underline">
                    {faq.question}
                  </AccordionTrigger>
                  <AccordionContent className="text-slate-600 leading-relaxed">
                    {faq.answer}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </motion.div>

          <motion.div
            initial={{ y: 20, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.8 }}
            viewport={{ once: true }}
            className="text-center mt-12"
          >
            <p className="text-slate-600 mb-4">Still have questions?</p>
            <a
              href="mailto:support@airesumebuidler.com"
              className="inline-flex items-center space-x-2 text-blue-600 hover:text-blue-700 font-medium"
            >
              <Mail className="h-5 w-5" />
              <span>Contact our support team</span>
            </a>
          </motion.div>
        </div>
      </section>

      <Footer />

      {/* Payment Card Modal */}
      <PaymentCard
        isOpen={showPaymentCard}
        onClose={() => setShowPaymentCard(false)}
        onSuccess={handlePaymentSuccess}
      />
    </div>
  );
}