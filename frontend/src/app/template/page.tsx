"use client";

import { motion } from "framer-motion";
import { Search, FileText, Eye, Star, ArrowRight, Grid, List, Crown, LayoutPanelTop } from "lucide-react";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { CV_TEMPLATES, TEMPLATE_CATEGORIES, Template } from "@/constants/templates";
import { TemplatePreview } from "@/components/templates/TemplateRenderer";
import TemplateSelector from "@/components/TemplateSelector";
import Navbar from "@/components/Navbar";

export default function TemplatesPage() {
    const [searchTerm, setSearchTerm] = useState("");
    const [selectedCategory, setSelectedCategory] = useState("All");
    const [viewMode, setViewMode] = useState("grid");
    const [showPremiumOnly, setShowPremiumOnly] = useState(false);
    const router = useRouter();

    const filteredTemplates = CV_TEMPLATES.filter(template => {
        const matchesSearch = template.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            template.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
            template.category.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesCategory = selectedCategory === "All" || template.category === selectedCategory;
        const matchesPremium = !showPremiumOnly || template.isPremium;
        return matchesSearch && matchesCategory && matchesPremium;
    });

    return (
        <div className="min-h-screen bg-gray-50">
            <Navbar />

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                className="container mx-auto px-4 py-6"
            >
                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                    <div className="bg-gradient-to-r from-blue-600 to-blue-700 px-6 py-8 text-white">
                        <div className="flex items-center space-x-3 mb-4">
                            <div className="p-2 bg-white/20 rounded-lg">
                                <LayoutPanelTop className="h-6 w-6" />
                            </div>
                            <h1 className="text-2xl md:text-3xl font-bold">Resume Templates</h1>
                        </div>
                        <p className="text-blue-100 max-w-2xl">
                            Professional templates designed to pass ATS systems and impress recruiters
                        </p>
                    </div>

                    <div className="p-6 space-y-6">
                        <div className="flex flex-col lg:flex-row gap-4 items-center justify-between">
                            <div className="relative w-full max-w-md">
                                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                                <input
                                    type="text"
                                    placeholder="Search templates..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-gray-50 hover:bg-white transition-all"
                                />
                            </div>

                            <div className="flex flex-wrap gap-2">
                                <button
                                    onClick={() => setSelectedCategory("All")}
                                    className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${"All" === selectedCategory
                                            ? "bg-blue-600 text-white shadow-md"
                                            : "bg-gray-100 text-gray-600 hover:bg-blue-50 hover:text-blue-600"
                                        }`}
                                >
                                    All
                                </button>
                                {TEMPLATE_CATEGORIES.map((category) => (
                                    <button
                                        key={category}
                                        onClick={() => setSelectedCategory(category)}
                                        className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${selectedCategory === category
                                                ? "bg-blue-600 text-white shadow-md"
                                                : "bg-gray-100 text-gray-600 hover:bg-blue-50 hover:text-blue-600"
                                            }`}
                                    >
                                        {category}
                                    </button>
                                ))}
                            </div>

                            <div className="flex items-center space-x-4">
                                <label className="flex items-center space-x-2 cursor-pointer bg-gray-50 px-3 py-2 rounded-lg hover:bg-gray-100 transition-colors">
                                    <input
                                        type="checkbox"
                                        checked={showPremiumOnly}
                                        onChange={(e) => setShowPremiumOnly(e.target.checked)}
                                        className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                                    />
                                    <Crown className="h-4 w-4 text-yellow-500" />
                                    <span className="text-sm text-gray-700">Premium</span>
                                </label>

                                <div className="flex items-center bg-gray-100 rounded-lg p-1">
                                    <button
                                        onClick={() => setViewMode("grid")}
                                        className={`p-2 rounded-md transition-all ${viewMode === "grid"
                                                ? "bg-blue-600 text-white shadow-sm"
                                                : "text-gray-500 hover:text-gray-700"
                                            }`}
                                    >
                                        <Grid className="h-4 w-4" />
                                    </button>
                                    <button
                                        onClick={() => setViewMode("list")}
                                        className={`p-2 rounded-md transition-all ${viewMode === "list"
                                                ? "bg-blue-600 text-white shadow-sm"
                                                : "text-gray-500 hover:text-gray-700"
                                            }`}
                                    >
                                        <List className="h-4 w-4" />
                                    </button>
                                </div>
                            </div>
                        </div>

                        <div className="flex items-center justify-between text-sm text-gray-600 bg-gray-50 px-4 py-2 rounded-lg">
                            <span>
                                {filteredTemplates.length} template{filteredTemplates.length !== 1 ? 's' : ''}
                                {selectedCategory !== "All" && ` in ${selectedCategory}`}
                                {searchTerm && ` matching "${searchTerm}"`}
                            </span>
                            {filteredTemplates.length > 0 && (
                                <div className="flex items-center space-x-1 text-blue-600">
                                    <Star className="h-4 w-4 fill-current" />
                                    <span>Professional Quality</span>
                                </div>
                            )}
                        </div>

                        {filteredTemplates.length === 0 ? (
                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                className="text-center py-16"
                            >
                                <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                    <FileText className="h-8 w-8 text-gray-400" />
                                </div>
                                <h3 className="text-lg font-semibold text-gray-900 mb-2">No templates found</h3>
                                <p className="text-gray-500">Try adjusting your search or filter criteria</p>
                            </motion.div>
                        ) : (
                            <div className={
                                viewMode === "grid"
                                    ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
                                    : "space-y-4"
                            }>
                                {filteredTemplates.map((template, i) => (
                                    <TemplateSelector key={template.id} templateId={template.id.toString()}>
                                        <motion.div
                                            initial={{ y: 30, opacity: 0 }}
                                            animate={{ y: 0, opacity: 1 }}
                                            transition={{ duration: 0.4, delay: i * 0.05 }}
                                            className={`group cursor-pointer bg-white border border-gray-200 rounded-xl overflow-hidden hover:shadow-lg transition-all duration-300 hover:border-blue-300 ${viewMode === "list" ? "flex gap-4 p-4" : "p-4"
                                                }`}
                                        >
                                            {viewMode === "grid" ? (
                                                <>
                                                    <div className="relative h-48 rounded-lg border border-gray-100 overflow-hidden bg-gray-50 mb-4">
                                                        <TemplatePreview templateId={template.id} scale={0.25} />
                                                        {template.isPremium && (
                                                            <div className="absolute top-2 right-2 bg-yellow-500 text-white rounded-full px-2 py-1 text-xs font-medium flex items-center space-x-1">
                                                                <Crown className="h-3 w-3" />
                                                                <span>Pro</span>
                                                            </div>
                                                        )}
                                                        <div className="absolute inset-0 bg-blue-600/0 group-hover:bg-blue-600/10 transition-all flex items-center justify-center">
                                                            <div className="opacity-0 group-hover:opacity-100 transition-opacity">
                                                                <button className="bg-white text-blue-600 px-4 py-2 rounded-lg shadow-lg flex items-center space-x-2 font-medium">
                                                                    <Eye className="h-4 w-4" />
                                                                    <span>Preview</span>
                                                                </button>
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <div className="space-y-2">
                                                        <div className="flex items-start justify-between">
                                                            <h3 className="font-semibold text-gray-900 group-hover:text-blue-600 transition-colors">
                                                                {template.name}
                                                            </h3>
                                                            {template.isPremium && (
                                                                <Crown className="h-4 w-4 text-yellow-500 flex-shrink-0 ml-2" />
                                                            )}
                                                        </div>
                                                        <p className="text-sm text-blue-600 font-medium">{template.category}</p>
                                                        <p className="text-sm text-gray-600 line-clamp-2">{template.description}</p>
                                                        <div className="flex items-center justify-between pt-2">
                                                            <span className={`px-2 py-1 rounded-md text-xs font-medium ${template.isPremium
                                                                    ? 'bg-yellow-50 text-yellow-700'
                                                                    : 'bg-green-50 text-green-700'
                                                                }`}>
                                                                {template.isPremium ? 'Premium' : 'Free'}
                                                            </span>
                                                            <ArrowRight className="h-4 w-4 text-gray-400 group-hover:text-blue-600 group-hover:translate-x-1 transition-all" />
                                                        </div>
                                                    </div>
                                                </>
                                            ) : (
                                                <>
                                                    <div className="relative w-24 h-24 rounded-lg border border-gray-100 overflow-hidden bg-gray-50 flex-shrink-0">
                                                        <TemplatePreview templateId={template.id} scale={0.15} />
                                                        {template.isPremium && (
                                                            <div className="absolute top-1 right-1 bg-yellow-500 text-white rounded-full p-1">
                                                                <Crown className="h-2 w-2" />
                                                            </div>
                                                        )}
                                                    </div>
                                                    <div className="flex-1 space-y-2">
                                                        <div className="flex items-start justify-between">
                                                            <div>
                                                                <h3 className="font-semibold text-gray-900 group-hover:text-blue-600 transition-colors">
                                                                    {template.name}
                                                                </h3>
                                                                <p className="text-sm text-blue-600 font-medium">{template.category}</p>
                                                            </div>
                                                            <div className="flex items-center space-x-2">
                                                                <span className={`px-2 py-1 rounded-md text-xs font-medium ${template.isPremium
                                                                        ? 'bg-yellow-50 text-yellow-700'
                                                                        : 'bg-green-50 text-green-700'
                                                                    }`}>
                                                                    {template.isPremium ? 'Pro' : 'Free'}
                                                                </span>
                                                                <button className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1.5 rounded-lg text-sm font-medium transition-colors flex items-center space-x-1">
                                                                    <span>Use</span>
                                                                    <ArrowRight className="h-3 w-3" />
                                                                </button>
                                                            </div>
                                                        </div>
                                                        <p className="text-sm text-gray-600 line-clamp-2">{template.description}</p>
                                                    </div>
                                                </>
                                            )}
                                        </motion.div>
                                    </TemplateSelector>
                                ))}
                            </div>
                        )}

                        {filteredTemplates.length > 12 && (
                            <div className="text-center pt-6">
                                <button className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-xl font-medium transition-all duration-200 transform hover:scale-105 shadow-lg">
                                    Load More Templates
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            </motion.div>
        </div>
    );
}