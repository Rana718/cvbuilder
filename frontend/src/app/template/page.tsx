"use client";

import { motion } from "framer-motion";
import { Search, Crown } from "lucide-react";
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
        <div className="min-h-screen bg-white">
            <Navbar />

            <div className="container mx-auto px-4 py-6">
                {/* Simple Header */}
                <div className="mb-8">
                    <h1 className="text-2xl font-semibold text-gray-900 mb-1">Templates</h1>
                    <p className="text-gray-600">Choose a professional template for your resume</p>
                </div>

                {/* Search and Filter Section */}
                <div className="mb-8">
                    {/* Search Bar */}
                    <div className="relative mb-4">
                        <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                        <input
                            type="text"
                            placeholder="Search templates..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900"
                        />
                    </div>

                    {/* Category Filter - Horizontal Scrollable */}
                    <div className="overflow-x-auto scrollbar-hide">
                        <div className="flex space-x-3 pb-2 min-w-max">
                            <button
                                onClick={() => setSelectedCategory("All")}
                                className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-colors ${
                                    "All" === selectedCategory
                                        ? "bg-blue-600 text-white"
                                        : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                                }`}
                            >
                                All Templates
                            </button>
                            {TEMPLATE_CATEGORIES.map((category) => (
                                <button
                                    key={category}
                                    onClick={() => setSelectedCategory(category)}
                                    className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-colors ${
                                        selectedCategory === category
                                            ? "bg-blue-600 text-white"
                                            : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                                    }`}
                                >
                                    {category}
                                </button>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Templates Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {filteredTemplates.map((template, i) => (
                        <TemplateSelector key={template.id} templateId={template.id.toString()}>
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.3, delay: i * 0.05 }}
                                className="group cursor-pointer"
                            >
                                <div className="relative bg-white border border-gray-200 rounded-lg overflow-hidden hover:border-blue-300 hover:shadow-lg transition-all duration-200">
                                    {/* Template Preview */}
                                    <div className="relative">
                                        <TemplatePreview templateId={template.id} scale={1} />
                                        
                                        {/* Premium Badge */}
                                        {template.isPremium && (
                                            <div className="absolute top-3 right-3 bg-amber-500 text-white rounded-md px-2 py-1 text-xs font-medium flex items-center space-x-1">
                                                <Crown className="h-3 w-3" />
                                                <span>PRO</span>
                                            </div>
                                        )}
                                    </div>

                                </div>

                                {/* Template Info - Outside card */}
                                <div className="text-center mt-3">
                                    <h3 className="font-medium text-gray-900 text-base mb-1 group-hover:text-blue-600 transition-colors">
                                        {template.name}
                                    </h3>
                                    <span className="text-sm text-gray-500">
                                        {template.category}
                                    </span>
                                </div>
                            </motion.div>
                        </TemplateSelector>
                    ))}
                </div>

                {/* Empty State */}
                {filteredTemplates.length === 0 && (
                    <div className="text-center py-12">
                        <div className="text-gray-400 mb-4">
                            <Search className="h-12 w-12 mx-auto" />
                        </div>
                        <h3 className="text-lg font-medium text-gray-900 mb-2">No templates found</h3>
                        <p className="text-gray-500 mb-4">Try adjusting your search or filter</p>
                        <button 
                            onClick={() => {
                                setSearchTerm("");
                                setSelectedCategory("All");
                            }}
                            className="text-blue-600 hover:text-blue-700 font-medium"
                        >
                            Clear filters
                        </button>
                    </div>
                )}
            </div>

            <style jsx global>{`
                .scrollbar-hide {
                    -ms-overflow-style: none;
                    scrollbar-width: none;
                }
                .scrollbar-hide::-webkit-scrollbar {
                    display: none;
                }
            `}</style>
        </div>
    );
}