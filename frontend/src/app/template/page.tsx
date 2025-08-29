"use client";

import { motion } from "framer-motion";
import { Search, Filter, FileText, Eye, Star, ArrowRight, Grid, List, Crown } from "lucide-react";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { CV_TEMPLATES, TEMPLATE_CATEGORIES, Template } from "@/constants/templates";
import { TemplatePreview } from "@/components/templates/TemplateRenderer";

export default function TemplatesPage() {
    const [searchTerm, setSearchTerm] = useState("");
    const [selectedCategory, setSelectedCategory] = useState("All");
    const [viewMode, setViewMode] = useState("grid");
    const [showPremiumOnly, setShowPremiumOnly] = useState(false);
    const router = useRouter();

    // Filter templates based on search, category, and premium filter
    const filteredTemplates = CV_TEMPLATES.filter(template => {
        const matchesSearch = template.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            template.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
            template.category.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesCategory = selectedCategory === "All" || template.category === selectedCategory;
        const matchesPremium = !showPremiumOnly || template.isPremium;
        return matchesSearch && matchesCategory && matchesPremium;
    });

    const handleTemplateClick = (templateId: number) => {
        console.log('Clicking template with ID:', templateId);
        router.push(`/template/${templateId}`);
    };

    return (
        <div className="min-h-screen bg-white">
            {/* Header */}
            <motion.header
                initial={{ y: -50, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.6 }}
                className="bg-white shadow-sm border-b border-gray-100"
            >
                <div className="container mx-auto px-6 py-8">
                    <div className="text-center">
                        <h1 className="text-4xl font-bold text-gray-900 mb-4">Resume Templates</h1>
                        <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                            Choose from our collection of professionally designed templates that pass ATS systems and impress recruiters.
                        </p>
                    </div>
                </div>
            </motion.header>

            {/* Search and Filter Section */}
            <motion.section
                initial={{ y: 50, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                className="bg-gray-50 py-8"
            >
                <div className="container mx-auto px-6">
                    <div className="flex flex-col lg:flex-row gap-6 items-center justify-between">
                        {/* Search Bar */}
                        <div className="relative flex-1 max-w-md">
                            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                            <input
                                type="text"
                                placeholder="Search templates..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            />
                        </div>

                        {/* Category Filter */}
                        <div className="flex flex-wrap gap-2">
                            <button
                                onClick={() => setSelectedCategory("All")}
                                className={`px-4 py-2 rounded-lg font-medium transition-all ${"All" === selectedCategory
                                        ? "bg-blue-500 text-white"
                                        : "bg-white text-gray-600 hover:bg-blue-50 hover:text-blue-500"
                                    }`}
                            >
                                All
                            </button>
                            {TEMPLATE_CATEGORIES.map((category) => (
                                <button
                                    key={category}
                                    onClick={() => setSelectedCategory(category)}
                                    className={`px-4 py-2 rounded-lg font-medium transition-all ${selectedCategory === category
                                            ? "bg-blue-500 text-white"
                                            : "bg-white text-gray-600 hover:bg-blue-50 hover:text-blue-500"
                                        }`}
                                >
                                    {category}
                                </button>
                            ))}
                        </div>

                        {/* Premium Filter Toggle */}
                        <div className="flex items-center space-x-2">
                            <label className="flex items-center space-x-2 cursor-pointer">
                                <input
                                    type="checkbox"
                                    checked={showPremiumOnly}
                                    onChange={(e) => setShowPremiumOnly(e.target.checked)}
                                    className="rounded border-gray-300 text-blue-500 focus:ring-blue-500"
                                />
                                <span className="text-sm text-gray-600">Premium only</span>
                                <Crown className="h-4 w-4 text-yellow-500" />
                            </label>
                        </div>

                        {/* View Mode Toggle */}
                        <div className="flex items-center space-x-2 bg-white rounded-lg p-1 border border-gray-300">
                            <button
                                onClick={() => setViewMode("grid")}
                                className={`p-2 rounded ${viewMode === "grid" ? "bg-blue-500 text-white" : "text-gray-600"}`}
                            >
                                <Grid className="h-4 w-4" />
                            </button>
                            <button
                                onClick={() => setViewMode("list")}
                                className={`p-2 rounded ${viewMode === "list" ? "bg-blue-500 text-white" : "text-gray-600"}`}
                            >
                                <List className="h-4 w-4" />
                            </button>
                        </div>
                    </div>

                    {/* Results Count */}
                    <div className="mt-4 text-sm text-gray-600">
                        Showing {filteredTemplates.length} template{filteredTemplates.length !== 1 ? 's' : ''}
                        {selectedCategory !== "All" && ` in ${selectedCategory}`}
                        {searchTerm && ` matching "${searchTerm}"`}
                    </div>
                </div>
            </motion.section>

            {/* Templates Grid/List */}
            <section className="container mx-auto px-6 py-12">
                {filteredTemplates.length === 0 ? (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="text-center py-16"
                    >
                        <FileText className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                        <h3 className="text-xl font-semibold text-gray-900 mb-2">No templates found</h3>
                        <p className="text-gray-600">Try adjusting your search or filter criteria</p>
                    </motion.div>
                ) : (
                    <div className={viewMode === "grid" ? "grid md:grid-cols-2 lg:grid-cols-3 gap-8" : "space-y-6"}>
                        {filteredTemplates.map((template, i) => (
                            <motion.div
                                key={template.id}
                                initial={{ y: 50, opacity: 0 }}
                                animate={{ y: 0, opacity: 1 }}
                                transition={{ duration: 0.6, delay: i * 0.1 }}
                                className={`group cursor-pointer ${viewMode === "list" ? "flex gap-6 bg-white border border-gray-200 rounded-lg p-6 hover:shadow-lg transition-all" : ""
                                    }`}
                                onClick={() => handleTemplateClick(template.id)}
                            >
                                {viewMode === "grid" ? (
                                    // Grid View
                                    <div>
                                        <div className="h-64 rounded-lg mb-4 border-2 border-gray-200 group-hover:border-blue-300 transition-all relative overflow-hidden bg-white shadow-sm">
                                            <TemplatePreview templateId={template.id} scale={0.25} />
                                            {/* Overlay with premium badge */}
                                            {template.isPremium && (
                                                <div className="absolute top-2 left-2 bg-yellow-500 text-white rounded-full px-2 py-1 text-xs font-medium flex items-center space-x-1">
                                                    <Crown className="h-3 w-3" />
                                                    <span>Premium</span>
                                                </div>
                                            )}
                                            {/* Preview button overlay */}
                                            <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-all flex items-center justify-center">
                                                <div className="opacity-0 group-hover:opacity-100 transition-opacity">
                                                    <button className="bg-white text-blue-500 px-4 py-2 rounded-lg shadow-md flex items-center space-x-2">
                                                        <Eye className="h-4 w-4" />
                                                        <span>Preview</span>
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="space-y-2">
                                            <div className="flex justify-between items-start">
                                                <h3 className="font-semibold text-gray-900 group-hover:text-blue-500 transition-colors">
                                                    {template.name}
                                                </h3>
                                                {template.isPremium && (
                                                    <Crown className="h-4 w-4 text-yellow-500" />
                                                )}
                                            </div>
                                            <p className="text-sm text-blue-500 font-medium">{template.category}</p>
                                            <p className="text-sm text-gray-600">{template.description}</p>
                                            <div className="flex items-center justify-between text-xs text-gray-500">
                                                <span className={`px-2 py-1 rounded text-xs ${template.isPremium ? 'bg-yellow-50 text-yellow-700' : 'bg-green-50 text-green-700'}`}>
                                                    {template.isPremium ? 'Premium' : 'Free'}
                                                </span>
                                                <ArrowRight className="h-4 w-4 opacity-0 group-hover:opacity-100 transition-opacity" />
                                            </div>
                                        </div>
                                    </div>
                                ) : (
                                    // List View
                                    <>
                                        <div className="w-32 h-32 rounded-lg border-2 border-gray-200 group-hover:border-blue-300 transition-all flex-shrink-0 overflow-hidden bg-white shadow-sm relative">
                                            <TemplatePreview templateId={template.id} scale={0.15} />
                                            {template.isPremium && (
                                                <div className="absolute top-1 left-1 bg-yellow-500 text-white rounded-full p-1">
                                                    <Crown className="h-2 w-2" />
                                                </div>
                                            )}
                                        </div>
                                        <div className="flex-1 space-y-2">
                                            <div className="flex justify-between items-start">
                                                <h3 className="text-xl font-semibold text-gray-900 group-hover:text-blue-500 transition-colors">
                                                    {template.name}
                                                </h3>
                                                <div className="flex items-center space-x-2">
                                                    {template.isPremium && (
                                                        <div className="flex items-center space-x-1 bg-yellow-50 text-yellow-700 px-2 py-1 rounded text-xs">
                                                            <Crown className="h-3 w-3" />
                                                            <span>Premium</span>
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                            <p className="text-blue-500 font-medium">{template.category}</p>
                                            <p className="text-gray-600">{template.description}</p>
                                            <div className="flex flex-wrap gap-2">
                                                <span className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded">
                                                    {template.layout}
                                                </span>
                                                <span className="px-2 py-1 bg-blue-50 text-blue-600 text-xs rounded">
                                                    {template.fonts.heading}
                                                </span>
                                            </div>
                                            <div className="flex items-center justify-between">
                                                <span className={`text-sm px-2 py-1 rounded ${template.isPremium ? 'bg-yellow-50 text-yellow-700' : 'bg-green-50 text-green-700'}`}>
                                                    {template.isPremium ? 'Premium Template' : 'Free Template'}
                                                </span>
                                                <button className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors flex items-center space-x-2">
                                                    <span>Use Template</span>
                                                    <ArrowRight className="h-4 w-4" />
                                                </button>
                                            </div>
                                        </div>
                                    </>
                                )}
                            </motion.div>
                        ))}
                    </div>
                )}
            </section>

            {/* Load More / Pagination could go here */}
            {filteredTemplates.length > 0 && (
                <section className="container mx-auto px-6 py-8">
                    <div className="text-center">
                        <button className="bg-blue-500 hover:bg-blue-600 text-white px-8 py-3 rounded-lg font-semibold transition-colors">
                            Load More Templates
                        </button>
                    </div>
                </section>
            )}
        </div>
    );
}