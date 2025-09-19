"use client";

import { motion } from "framer-motion";
import { Search } from "lucide-react";
import { useState } from "react";
import { CV_TEMPLATES, TEMPLATE_CATEGORIES } from "@/constants/templates";
import { TemplatePreview } from "@/components/templates/TemplateRenderer";
import TemplateSelector from "@/components/TemplateSelector";
import Navbar from "@/components/Navbar";

export default function TemplatesPage() {
    const [searchTerm, setSearchTerm] = useState("");
    const [selectedCategory, setSelectedCategory] = useState("All");

    const filteredTemplates = CV_TEMPLATES.filter(template => {
        const matchesSearch = template.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            template.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
            template.category.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesCategory = selectedCategory === "All" || template.category === selectedCategory;
        return matchesSearch && matchesCategory;
    });

    return (
        <div className="min-h-screen bg-slate-50">
            <Navbar />

            {/* Background Elements */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className="absolute top-20 left-10 w-96 h-96 bg-gradient-to-r from-blue-400/10 to-indigo-500/10 rounded-full mix-blend-multiply filter blur-3xl animate-pulse"></div>
                <div className="absolute top-40 right-10 w-80 h-80 bg-gradient-to-r from-purple-400/10 to-pink-500/10 rounded-full mix-blend-multiply filter blur-3xl animate-pulse delay-1000"></div>
                <div className="absolute bottom-20 left-1/2 w-72 h-72 bg-gradient-to-r from-emerald-400/10 to-teal-500/10 rounded-full mix-blend-multiply filter blur-3xl animate-pulse delay-2000"></div>
            </div>

            {/* Floating grid pattern */}
            <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808008_1px,transparent_1px),linear-gradient(to_bottom,#80808008_1px,transparent_1px)] bg-[size:24px_24px] pointer-events-none"></div>

            <div className="relative container mx-auto px-4 py-6">
                {/* AI Badge */}
                <motion.div
                    initial={{ y: 20, opacity: 0, scale: 0.9 }}
                    animate={{ y: 0, opacity: 1, scale: 1 }}
                    transition={{ duration: 0.6, delay: 0.2 }}
                    className="flex justify-center mb-6"
                >
                    <div className="relative">
                        <div className="absolute inset-0 bg-gradient-to-r from-blue-500/20 to-purple-500/20 blur-xl rounded-full"></div>
                        <div className="relative inline-flex items-center bg-white/90 backdrop-blur-sm border border-white/20 shadow-lg text-slate-700 px-6 py-3 rounded-full text-sm font-medium">
                            <div className="w-2 h-2 bg-green-500 rounded-full mr-3 animate-pulse"></div>
                            <Search className="h-4 w-4 mr-2 text-blue-600" />
                            <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent font-semibold">
                                Template Selector
                            </span>
                        </div>
                    </div>
                </motion.div>

                {/* Header */}
                <motion.div
                    initial={{ y: 30, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ duration: 0.8, delay: 0.3 }}
                    className="text-center mb-8"
                >
                    <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-slate-900 mb-4 leading-tight">
                        Choose Your
                        <span className="block text-transparent bg-clip-text bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 mt-2">
                            Perfect Template
                        </span>
                        <span className="block text-slate-700 text-2xl md:text-3xl lg:text-4xl font-medium mt-4">
                            Start Building Today
                        </span>
                    </h1>
                </motion.div>

                {/* Search and Filter */}
                <motion.div
                    initial={{ y: 30, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ duration: 0.8, delay: 0.5 }}
                    className="mb-8 space-y-4"
                >
                    <div className="relative max-w-md mx-auto">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                        <input
                            type="text"
                            placeholder="Search templates..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full pl-10 pr-4 py-3 border-0 rounded-full focus:ring-2 focus:ring-blue-500 text-gray-900 text-sm bg-white/90 backdrop-blur-sm shadow-lg"
                        />
                    </div>

                    <div className="flex justify-center">
                        <div className="overflow-x-auto">
                            <div className="flex space-x-2 bg-white/90 backdrop-blur-sm rounded-full p-1 min-w-max">
                                <button
                                    onClick={() => setSelectedCategory("All")}
                                    className={`px-4 py-2 rounded-full text-sm font-medium transition-colors whitespace-nowrap ${"All" === selectedCategory
                                            ? "bg-blue-600 text-white"
                                            : "text-gray-600 hover:text-blue-600"
                                        }`}
                                >
                                    All
                                </button>
                                {TEMPLATE_CATEGORIES.map((category) => (
                                    <button
                                        key={category}
                                        onClick={() => setSelectedCategory(category)}
                                        className={`px-4 py-2 rounded-full text-sm font-medium transition-colors whitespace-nowrap ${selectedCategory === category
                                                ? "bg-blue-600 text-white"
                                                : "text-gray-600 hover:text-blue-600"
                                            }`}
                                    >
                                        {category}
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>
                </motion.div>

                {/* Templates Grid */}
                <motion.div
                    initial={{ y: 30, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ duration: 0.8, delay: 0.7 }}
                    className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
                >
                    {filteredTemplates.map((template, i) => (
                        <motion.div
                            key={template.id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.3, delay: i * 0.05 }}
                            className="group"
                        >
                            <div className="relative aspect-[1/1.414] hover:border-2 hover:border-blue-500 bg-white/90 backdrop-blur-sm rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden">
                                {/* Template Preview - A4 Format */}
                                <TemplateSelector templateId={template.id.toString()}>
                                    <div className="w-full h-full flex items-center justify-center p-2">
                                        <div className="w-full h-full origin-center">
                                            <TemplatePreview templateId={template.id} />
                                        </div>
                                    </div>
                                </TemplateSelector>

                                {/* Choose Button at Bottom */}
                                <div className="absolute bottom-0 left-0 right-0 p-3 z-10">
                                    <TemplateSelector templateId={template.id.toString()}>
                                        <button className="w-full bg-blue-600 hover:shadow-2xl hover:bg-blue-700 text-white py-2 rounded-sm font-medium transition-colors flex items-center justify-center space-x-2 text-sm">
                                            <span>Choose Template</span>
                                        </button>
                                    </TemplateSelector>
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </motion.div>

                {/* Empty State */}
                {filteredTemplates.length === 0 && (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-center py-16"
                    >
                        <Search className="h-16 w-16 mx-auto text-gray-300 mb-4" />
                        <h3 className="text-xl font-medium text-gray-900 mb-2">No templates found</h3>
                        <p className="text-gray-500 mb-6">Try adjusting your search or filter</p>
                        <button
                            onClick={() => {
                                setSearchTerm("");
                                setSelectedCategory("All");
                            }}
                            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-full font-medium transition-colors"
                        >
                            Clear filters
                        </button>
                    </motion.div>
                )}
            </div>
        </div>
    );
}
