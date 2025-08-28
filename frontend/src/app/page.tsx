"use client";

import { motion } from "framer-motion";
import { FileText, Sparkles, Download, ArrowRight, User, Star, Menu, X, Eye, Edit, Share2, Clock, Shield, Zap } from "lucide-react";
import { useState } from "react";

export default function Home() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <div className="min-h-screen bg-white">
      {/* Navbar */}
      <motion.header 
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.8 }}
        className="bg-white shadow-sm border-b border-gray-100 sticky top-0 z-50"
      >
        <nav className="container mx-auto px-6 py-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-2">
              <FileText className="h-8 w-8 text-blue-500" />
              <span className="text-2xl font-bold text-gray-900">AI CV Builder</span>
            </div>
            
            <div className="hidden md:flex items-center space-x-8">
              <a href="#templates" className="text-gray-600 hover:text-blue-500 transition-colors">Templates</a>
              <a href="#features" className="text-gray-600 hover:text-blue-500 transition-colors">Features</a>
              <a href="#feedback" className="text-gray-600 hover:text-blue-500 transition-colors">Reviews</a>
              <a href="#pricing" className="text-gray-600 hover:text-blue-500 transition-colors">Pricing</a>
            </div>

            <div className="hidden md:flex items-center space-x-4">
              <button className="flex items-center space-x-2 text-gray-600 hover:text-blue-500 transition-colors">
                <User className="h-5 w-5" />
                <span>My Account</span>
              </button>
              <button className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-2 rounded-lg transition-colors">
                Get Started
              </button>
            </div>

            <button 
              className="md:hidden"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>

          {/* Mobile Menu */}
          {isMenuOpen && (
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              className="md:hidden mt-4 pb-4 border-t border-gray-100"
            >
              <div className="flex flex-col space-y-4 pt-4">
                <a href="#templates" className="text-gray-600 hover:text-blue-500">Templates</a>
                <a href="#features" className="text-gray-600 hover:text-blue-500">Features</a>
                <a href="#feedback" className="text-gray-600 hover:text-blue-500">Reviews</a>
                <a href="#pricing" className="text-gray-600 hover:text-blue-500">Pricing</a>
                <button className="flex items-center space-x-2 text-gray-600 hover:text-blue-500 justify-start">
                  <User className="h-5 w-5" />
                  <span>My Account</span>
                </button>
              </div>
            </motion.div>
          )}
        </nav>
      </motion.header>

      {/* Hero Section */}
      <section className="container mx-auto px-6 py-20">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div className="text-center md:text-left">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="mb-8"
            >
              <div className="bg-blue-50 w-20 h-20 rounded-full flex items-center justify-center mx-auto md:mx-0 mb-6">
                <Sparkles className="h-10 w-10 text-blue-500" />
              </div>
            </motion.div>
          
                      
            <motion.h1
              initial={{ y: 50, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="text-4xl md:text-5xl font-bold text-gray-900 mb-6"
            >
              Create Your Perfect Resume with
              <span className="text-blue-500"> AI Power</span>
            </motion.h1>
            
            <motion.p
              initial={{ y: 50, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.6 }}
              className="text-lg text-gray-600 mb-8 leading-relaxed"
            >
              Transform your career with AI-powered resume building. Get personalized content suggestions, 
              professional templates, and expert guidance to land your dream job faster than ever before.
            </motion.p>
            
            <motion.div
              initial={{ y: 50, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.8 }}
              className="flex flex-col sm:flex-row gap-4 justify-center md:justify-start mb-8"
            >
              <button className="bg-blue-500 hover:bg-blue-600 text-white px-8 py-3 rounded-lg text-lg font-semibold flex items-center justify-center space-x-2 transition-all">
                <span>Build My Resume</span>
                <ArrowRight className="h-5 w-5" />
              </button>
              <button className="border-2 border-blue-500 text-blue-500 hover:bg-blue-500 hover:text-white px-8 py-3 rounded-lg text-lg font-semibold transition-all">
                View Templates
              </button>
            </motion.div>

            <motion.div
              initial={{ y: 50, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.8, delay: 1 }}
              className="text-sm text-gray-500"
            >
              ✨ No credit card required • ⚡ Create in 5 minutes • 🎯 ATS-friendly templates
            </motion.div>
          </div>

          <motion.div
            initial={{ x: 50, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            className="text-center"
          >
            <img 
              src="/img/banner.png" 
              alt="AI CV Builder Banner" 
              className="w-full max-w-lg mx-auto rounded-lg shadow-lg"
            />
          </motion.div>
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
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Why Choose Our AI CV Builder?</h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Experience the future of resume building with cutting-edge AI technology and professional design.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              { icon: Sparkles, title: "AI-Powered Content", desc: "Smart suggestions tailored to your industry and role", color: "blue" },
              { icon: FileText, title: "Professional Templates", desc: "50+ modern, ATS-optimized designs that get noticed", color: "blue" },
              { icon: Download, title: "Multiple Formats", desc: "Export as PDF, Word, or share with custom links", color: "blue" },
              { icon: Clock, title: "Quick & Easy", desc: "Build a complete resume in under 10 minutes", color: "blue" },
              { icon: Shield, title: "Privacy Protected", desc: "Your data is secure and never shared with third parties", color: "blue" },
              { icon: Zap, title: "Real-time Preview", desc: "See changes instantly as you build your resume", color: "blue" }
            ].map((feature, i) => (
              <motion.div
                key={i}
                initial={{ y: 50, opacity: 0 }}
                whileInView={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.6, delay: i * 0.1 }}
                viewport={{ once: true }}
                className="bg-white rounded-xl p-8 text-center hover:shadow-lg transition-all border border-gray-100"
              >
                <div className={`bg-${feature.color}-50 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4`}>
                  <feature.icon className={`h-8 w-8 text-${feature.color}-500`} />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">{feature.title}</h3>
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

          <div className="grid md:grid-cols-3 gap-8 mb-12">
            {[
              { name: "Modern Professional", category: "Business", preview: "bg-gradient-to-br from-blue-50 to-blue-100" },
              { name: "Creative Designer", category: "Creative", preview: "bg-gradient-to-br from-purple-50 to-purple-100" },
              { name: "Tech Specialist", category: "Technology", preview: "bg-gradient-to-br from-green-50 to-green-100" },
              { name: "Executive Leader", category: "Management", preview: "bg-gradient-to-br from-gray-50 to-gray-100" },
              { name: "Fresh Graduate", category: "Entry Level", preview: "bg-gradient-to-br from-orange-50 to-orange-100" },
              { name: "Healthcare Pro", category: "Healthcare", preview: "bg-gradient-to-br from-red-50 to-red-100" }
            ].map((template, i) => (
              <motion.div
                key={i}
                initial={{ y: 50, opacity: 0 }}
                whileInView={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.6, delay: i * 0.1 }}
                viewport={{ once: true }}
                className="group cursor-pointer"
              >
                <div className={`${template.preview} h-64 rounded-lg mb-4 flex items-center justify-center border-2 border-gray-200 group-hover:border-blue-300 transition-all`}>
                  <div className="text-center">
                    <FileText className="h-12 w-12 text-gray-400 mx-auto mb-2" />
                    <div className="opacity-0 group-hover:opacity-100 transition-opacity">
                      <button className="bg-white text-blue-500 px-4 py-2 rounded-lg shadow-md flex items-center space-x-2 mx-auto">
                        <Eye className="h-4 w-4" />
                        <span>Preview</span>
                      </button>
                    </div>
                  </div>
                </div>
                <h3 className="font-semibold text-gray-900">{template.name}</h3>
                <p className="text-sm text-gray-500">{template.category}</p>
              </motion.div>
            ))}
          </div>

          <div className="text-center">
            <button className="bg-blue-500 hover:bg-blue-600 text-white px-8 py-3 rounded-lg font-semibold transition-colors">
              View All Templates
            </button>
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
              Join over 50,000 professionals who have successfully built their perfect resume with our AI-powered platform.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button className="bg-blue-500 hover:bg-blue-600 text-white px-12 py-4 rounded-lg text-xl font-semibold transition-all">
                Start Building Now
              </button>
              <button className="border-2 border-blue-500 text-blue-500 hover:bg-blue-500 hover:text-white px-12 py-4 rounded-lg text-xl font-semibold transition-all">
                Try Free Demo
              </button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-16">
        <div className="container mx-auto px-6">
          <div className="grid md:grid-cols-4 gap-8 mb-8">
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <FileText className="h-8 w-8 text-blue-300" />
                <span className="text-2xl font-bold">AI CV Builder</span>
              </div>
              <p className="text-gray-400 mb-4">
                Empowering professionals worldwide with AI-powered resume building technology.
              </p>
              <div className="flex space-x-4">
                <button className="bg-gray-800 hover:bg-gray-700 p-2 rounded-lg transition-colors">
                  <Share2 className="h-5 w-5" />
                </button>
                <button className="bg-gray-800 hover:bg-gray-700 p-2 rounded-lg transition-colors">
                  <Edit className="h-5 w-5" />
                </button>
              </div>
            </div>
            
            <div>
              <h3 className="font-semibold mb-4">Product</h3>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#" className="hover:text-white transition-colors">Templates</a></li>
                <li><a href="#" className="hover:text-white transition-colors">AI Writer</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Cover Letters</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Resume Examples</a></li>
              </ul>
            </div>
            
            <div>
              <h3 className="font-semibold mb-4">Resources</h3>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#" className="hover:text-white transition-colors">Career Tips</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Interview Guide</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Salary Tools</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Job Search</a></li>
              </ul>
            </div>
            
            <div>
              <h3 className="font-semibold mb-4">Support</h3>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#" className="hover:text-white transition-colors">Help Center</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Contact Us</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Privacy Policy</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Terms of Service</a></li>
              </ul>
            </div>
          </div>
          
          <div className="border-t border-gray-800 pt-8 text-center text-gray-400">
            <p>&copy; 2024 AI CV Builder. All rights reserved. Made with ❤️ for job seekers worldwide.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
