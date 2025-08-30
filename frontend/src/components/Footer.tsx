import { Edit, FileText, Share2 } from 'lucide-react'
import React from 'react'

function Footer() {
    return (
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
    )
}

export default Footer