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
        <div className="min-h-screen bg-gray-50">
            <Navbar />

            <div className="container mx-auto px-4 py-8">
                <div className="text-center mb-8">
                    <h1 className="text-4xl font-bold text-gray-900 mb-4">Choose Your Template</h1>
                    <p className="text-xl text-gray-600">Professional templates designed to get you hired</p>
                </div>

                <div className="flex flex-col lg:flex-row gap-4 items-center justify-between mb-8">
                    <div className="relative w-full max-w-md">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                        <input
                            type="text"
                            placeholder="Search templates..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white"
                        />
                    </div>

                    <div className="flex flex-wrap gap-2">
                        <button
                            onClick={() => setSelectedCategory("All")}
                            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${"All" === selectedCategory
                                    ? "bg-blue-600 text-white"
                                    : "bg-white text-gray-600 hover:bg-blue-50"
                                }`}
                        >
                            All
                        </button>
                        {TEMPLATE_CATEGORIES.map((category) => (
                            <button
                                key={category}
                                onClick={() => setSelectedCategory(category)}
                                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${selectedCategory === category
                                        ? "bg-blue-600 text-white"
                                        : "bg-white text-gray-600 hover:bg-blue-50"
                                    }`}
                            >
                                {category}
                            </button>
                        ))}
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                    {filteredTemplates.map((template, i) => (
                        <TemplateSelector key={template.id} templateId={template.id.toString()}>
                            <motion.div
                                initial={{ y: 30, opacity: 0 }}
                                animate={{ y: 0, opacity: 1 }}
                                transition={{ duration: 0.4, delay: i * 0.05 }}
                                className="group cursor-pointer hover:scale-105 transition-transform duration-300"
                            >
                                <div className="relative">
                                    <TemplatePreview templateId={template.id} scale={1} />
                                    {template.isPremium && (
                                        <div className="absolute top-3 right-3 bg-yellow-500 text-white rounded-full px-2 py-1 text-xs font-medium flex items-center space-x-1">
                                            <Crown className="h-3 w-3" />
                                            <span>Pro</span>
                                        </div>
                                    )}
                                </div>
                                <div className="mt-4 text-center">
                                    <h3 className="font-semibold text-gray-900 group-hover:text-blue-600 transition-colors text-lg">
                                        {template.name}
                                    </h3>
                                    <p className="text-sm text-blue-600 font-medium mt-1">{template.category}</p>
                                </div>
                            </motion.div>
                        </TemplateSelector>
                    ))}
                </div>

                {filteredTemplates.length === 0 && (
                    <div className="text-center py-16">
                        <h3 className="text-lg font-semibold text-gray-900 mb-2">No templates found</h3>
                        <p className="text-gray-500">Try adjusting your search or filter criteria</p>
                    </div>
                )}
            </div>
        </div>
    );
}
