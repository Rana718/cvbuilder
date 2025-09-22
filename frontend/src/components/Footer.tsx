import React from "react";
import Link from "next/link";
import { 
    FileText, Mail, Phone, MapPin, Twitter, Linkedin, Github, Facebook,
    Instagram, Youtube, Star, Award, Users, Zap, Shield, Heart,
    ArrowRight, Download, Sparkles, Globe, Clock
} from "lucide-react";

function Footer() {
    const currentYear = new Date().getFullYear();
    
    const handleRedirect = () => {
        window.open("https://aydpm.in/", "_blank");
    };

    const socialLinks = [
        { icon: Twitter, href: "#", label: "Twitter", color: "hover:text-blue-400" },
        { icon: Facebook, href: "#", label: "Facebook", color: "hover:text-blue-500" },
        { icon: Linkedin, href: "#", label: "LinkedIn", color: "hover:text-blue-600" },
        { icon: Instagram, href: "#", label: "Instagram", color: "hover:text-pink-500" },
        { icon: Github, href: "#", label: "GitHub", color: "hover:text-gray-300" }
    ];

    const quickLinks = [
        { href: "/template", label: "Resume Templates", icon: FileText },
        { href: "/createcover-letter", label: "Cover Letters", icon: Mail },
        { href: "/resusme/rateing", label: "Resume Analysis", icon: Star },
        { href: "/resusme", label: "My Resumes", icon: Users }
    ];

    const legalLinks = [
        { href: "/terms/privacy", label: "Privacy Policy" },
        { href: "/terms/policy", label: "Terms of Service" },
        { href: "/terms/refund", label: "Refund Policy" },
        { href: "/terms/shipping", label: "Service Delivery" }
    ];

    return (
        <footer className="bg-gradient-to-br from-slate-900 via-gray-900 to-slate-800 text-white relative overflow-hidden">
            <div className="absolute inset-0 opacity-30">
                <div className="w-full h-full" style={{
                    backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.02'%3E%3Ccircle cx='30' cy='30' r='2'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
                }}></div>
            </div>
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-pink-500 via-purple-500 to-blue-500"></div>
            
            <div className="container mx-auto px-3 sm:px-4 lg:px-6 relative">
                <div className="py-8 sm:py-10">
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
                        
                        <div className="sm:col-span-2 lg:col-span-1">
                            <div className="flex items-center space-x-2 mb-4">
                                <div className="w-8 h-8 bg-gradient-to-br from-pink-500 to-purple-600 rounded-lg flex items-center justify-center">
                                    <FileText className="h-4 w-4 text-white" />
                                </div>
                                <span className="text-lg sm:text-xl font-bold bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
                                    ResumeAI
                                </span>
                            </div>
                            
                            <p className="text-gray-400 text-sm leading-relaxed mb-4">
                                Empowering professionals worldwide with AI-powered resume creation tools. 
                                Build stunning resumes that get you hired faster.
                            </p>

                            <div className="flex items-center space-x-2">
                                {socialLinks.map((social, index) => (
                                    <a
                                        key={index}
                                        href={social.href}
                                        aria-label={social.label}
                                        className={`w-8 h-8 bg-white/10 rounded-lg flex items-center justify-center transition-all duration-200 hover:bg-white/20 hover:scale-105 ${social.color}`}
                                    >
                                        <social.icon className="h-4 w-4" />
                                    </a>
                                ))}
                            </div>
                        </div>

                        <div>
                            <h3 className="text-base font-semibold mb-4 flex items-center text-blue-500">
                                <Zap className="h-4 w-4 mr-2" />
                                Quick Links
                            </h3>
                            <ul className="space-y-2">
                                {quickLinks.map((link, index) => (
                                    <li key={index}>
                                        <Link
                                            href={link.href}
                                            className="flex items-center space-x-2 text-gray-400 hover:text-white transition-colors duration-200 group"
                                        >
                                            <link.icon className="h-3 w-3 text-gray-500 group-hover:text-blue-500 transition-colors" />
                                            <span className="text-sm group-hover:translate-x-1 transition-transform duration-200">
                                                {link.label}
                                            </span>
                                        </Link>
                                    </li>
                                ))}
                            </ul>
                        </div>

                        <div>
                            <h3 className="text-base font-semibold mb-4 flex items-center text-purple-500">
                                <Mail className="h-4 w-4 mr-2" />
                                Support
                            </h3>
                            <div className="space-y-2">
                                <div className="flex items-center space-x-2 text-gray-400">
                                    <Mail className="h-3 w-3 text-blue-500 flex-shrink-0" />
                                    <a href="mailto:arhaanresumeai@gmail.com" className="text-xs hover:text-white transition-colors break-all">
                                        arhaanresumeai@gmail.com
                                    </a>
                                </div>
                                <div className="flex items-center space-x-2 text-gray-400">
                                    <Clock className="h-3 w-3 text-purple-500 flex-shrink-0" />
                                    <span className="text-xs">24/7 Support Available</span>
                                </div>
                                <div className="flex items-center space-x-2 text-gray-400">
                                    <Globe className="h-3 w-3 text-green-500 flex-shrink-0" />
                                    <span className="text-xs">Available Worldwide</span>
                                </div>
                            </div>
                        </div>

                        <div>
                            <h3 className="text-base font-semibold mb-4 flex items-center text-yellow-500">
                                <Award className="h-4 w-4 mr-2" />
                                ResumeAI 
                            </h3>
                            <ul className="space-y-2">
                                {legalLinks.map((link, index) => (
                                    <li key={index}>
                                        <Link
                                            href={link.href}
                                            className="text-gray-400 hover:text-white transition-colors duration-200 text-sm group"
                                        >
                                            <span className="group-hover:translate-x-1 transition-transform duration-200 inline-block">
                                                {link.label}
                                            </span>
                                        </Link>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>
                </div>

                <div className="py-6 border-t border-white/10">
                    <div className="flex flex-col space-y-4 sm:space-y-0 sm:flex-row sm:items-center sm:justify-between">
                        <div className="text-center sm:text-left">
                            <h3 className="text-base font-semibold text-white mb-1 flex items-center justify-center sm:justify-start">
                                <Mail className="h-4 w-4 mr-2 text-blue-500" />
                                Stay Updated
                            </h3>
                            <p className="text-gray-400 text-xs">Get career tips and resume trends.</p>
                        </div>
                        
                        <div className="flex flex-col space-y-2 sm:flex-row sm:space-y-0 sm:space-x-2 w-full sm:w-auto">
                            <input
                                type="email"
                                placeholder="Enter your email"
                                className="px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm w-full sm:w-48"
                            />
                            <button className="px-4 py-2 bg-gradient-to-r from-pink-500 to-purple-600 text-white font-medium rounded-lg hover:from-pink-600 hover:to-purple-700 transition-all duration-200 hover:scale-105 flex items-center justify-center space-x-1 text-sm">
                                <span>Subscribe</span>
                                <ArrowRight className="h-3 w-3" />
                            </button>
                        </div>
                    </div>
                </div>

                <div className="py-4 border-t border-white/10">
                    <div className="flex flex-col space-y-3 sm:space-y-0 sm:flex-row sm:justify-between sm:items-center">
                        <div className="flex flex-col space-y-2 sm:flex-row sm:items-center sm:space-y-0 sm:space-x-3 text-center sm:text-left">
                            <p className="text-gray-400 text-xs">
                                © {currentYear} ResumeAI. All rights reserved.
                            </p>
                            <p 
                                className="text-gray-400 hover:text-white transition cursor-pointer text-xs flex items-center justify-center sm:justify-start space-x-1"
                                onClick={handleRedirect}
                            >
                                <span>Developed with</span>
                                <Heart className="h-3 w-3 text-red-500 fill-current" />
                                <span>by AYD Software</span>
                            </p>
                        </div>
                        
                        <div className="flex items-center justify-center sm:justify-end space-x-3">
                            <div className="flex items-center space-x-1 text-xs text-gray-400">
                                <Shield className="h-3 w-3 text-green-500" />
                                <span>SSL Secured</span>
                            </div>
                            <div className="flex items-center space-x-1 text-xs text-gray-400">
                                <Award className="h-3 w-3 text-yellow-500" />
                                <span>GDPR Compliant</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </footer>
    );
}

export default Footer;