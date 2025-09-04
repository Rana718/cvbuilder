"use client";

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Upload, FileText, Target, Star, TrendingUp, AlertCircle, CheckCircle, ArrowRight, RotateCcw } from 'lucide-react';
import axios from '@/lib/axios';
import Navbar from '@/components/Navbar';

interface FeedbackResult {
    overall_rating: number;
    feedback: string;
    strengths: string[];
    areas_for_improvement: string[];
    recommendations: string[];
}

export default function ResumeFeedbackPage() {
    const [file, setFile] = useState<File | null>(null);
    const [jobTitle, setJobTitle] = useState('');
    const [jobDescription, setJobDescription] = useState('');
    const [isAnalyzing, setIsAnalyzing] = useState(false);
    const [result, setResult] = useState<FeedbackResult | null>(null);
    const [error, setError] = useState('');

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const selectedFile = e.target.files?.[0];
        if (selectedFile) {
            if (selectedFile.type !== 'application/pdf') {
                setError('Please select a PDF file');
                return;
            }
            if (selectedFile.size > 10 * 1024 * 1024) {
                setError('File size must be less than 10MB');
                return;
            }
            setFile(selectedFile);
            setError('');
        }
    };

    const handleAnalyze = async () => {
        if (!file) {
            setError('Please select a resume file');
            return;
        }

        setIsAnalyzing(true);
        setError('');

        try {
            const formData = new FormData();
            formData.append('resume_file', file);
            if (jobTitle.trim()) formData.append('job_title', jobTitle.trim());
            if (jobDescription.trim()) formData.append('job_description', jobDescription.trim());

            const response = await axios.post('/api/resume-op/analyze', formData, {
                headers: { 'Content-Type': 'multipart/form-data' },
            });

            setResult(response.data);
        } catch (error: any) {
            setError(error.response?.data?.detail || 'Failed to analyze resume. Please try again.');
        } finally {
            setIsAnalyzing(false);
        }
    };

    const handleReset = () => {
        setFile(null);
        setJobTitle('');
        setJobDescription('');
        setResult(null);
        setError('');
    };

    const getRatingColor = (rating: number) => {
        if (rating >= 8) return 'text-green-600';
        if (rating >= 6) return 'text-orange-600';
        return 'text-red-600';
    };

    const getRatingBg = (rating: number) => {
        if (rating >= 8) return 'bg-green-50 border-green-300';
        if (rating >= 6) return 'bg-orange-50 border-orange-300';
        return 'bg-red-50 border-red-300';
    };

    const renderStars = (rating: number) => {
        const stars = [];
        const fullStars = Math.floor(rating);
        const hasHalfStar = rating % 1 >= 0.5;

        for (let i = 0; i < fullStars; i++) {
            stars.push(<Star key={i} className="h-3 w-3 md:h-4 md:w-4 fill-current text-orange-400" />);
        }
        if (hasHalfStar) {
            stars.push(<Star key="half" className="h-3 w-3 md:h-4 md:w-4 fill-current text-orange-400 opacity-50" />);
        }
        const remainingStars = 10 - Math.ceil(rating);
        for (let i = 0; i < remainingStars; i++) {
            stars.push(<Star key={`empty-${i}`} className="h-3 w-3 md:h-4 md:w-4 text-gray-300" />);
        }

        return stars;
    };

    return (
        <>
            <Navbar />
            <div className="min-h-screen bg-gray-50">
                <div className="max-w-4xl mx-auto px-4 py-6">
                    {/* Header */}
                    <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                        className="text-left mb-8"
                    >
                        <div className="flex items-start mb-4">
                            <div className="p-2 md:p-3 bg-blue-100 rounded-full mr-3 md:mr-2">
                                <TrendingUp className="w-6 h-6 md:w-8 md:h-8 text-blue-600" />
                            </div>
                            <div className="flex-1">
                                <h1 className="text-2xl md:text-3xl font-bold text-gray-900">Resume Analysis</h1>
                                <p className="text-base md:text-lg text-gray-600">Get AI-powered feedback and recommendations to improve your resume</p>
                            </div>
                        </div>
                    </motion.div>

                    {!result ? (
                        <div className="space-y-4">
                            {/* Upload Section */}
                            <motion.div
                                initial={{ opacity: 0, scale: 0.95 }}
                                animate={{ opacity: 1, scale: 1 }}
                                transition={{ delay: 0.2 }}
                                className="p-2"
                            >
                                <div className="flex items-center space-x-3 mb-4">
                                    <Upload className="h-4 w-4 md:h-5 md:w-5 text-blue-600" />
                                    <h2 className="text-base md:text-lg font-semibold text-gray-900">Upload Resume</h2>
                                </div>

                                <div
                                    className={`border-2 border-dashed rounded-sm p-6 md:p-8 text-center transition-colors ${file
                                            ? 'border-green-300 bg-green-50'
                                            : 'border-gray-300 hover:border-blue-400 hover:bg-blue-50'
                                        }`}
                                >
                                    <input
                                        type="file"
                                        accept=".pdf"
                                        onChange={handleFileChange}
                                        className="hidden"
                                        id="resume-upload"
                                    />
                                    <label htmlFor="resume-upload" className="cursor-pointer">
                                        {file ? (
                                            <div className="space-y-2">
                                                <CheckCircle className="h-6 w-6 md:h-8 md:w-8 text-green-600 mx-auto" />
                                                <p className="text-green-700 font-medium text-sm md:text-base">{file.name}</p>
                                                <p className="text-green-600 text-xs md:text-sm">
                                                    {(file.size / 1024 / 1024).toFixed(2)} MB • Click to change
                                                </p>
                                            </div>
                                        ) : (
                                            <div className="space-y-2">
                                                <FileText className="h-6 w-6 md:h-8 md:w-8 text-gray-400 mx-auto" />
                                                <p className="text-gray-700 font-medium text-sm md:text-base">
                                                    Drop your resume here or click to browse
                                                </p>
                                                <p className="text-gray-500 text-xs md:text-sm">
                                                    PDF files only • Maximum 10MB
                                                </p>
                                            </div>
                                        )}
                                    </label>
                                </div>

                                {error && (
                                    <motion.div
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        className="bg-red-50 border border-red-300 rounded-sm p-3 mt-4"
                                    >
                                        <div className="flex items-center space-x-2">
                                            <AlertCircle className="h-4 w-4 text-red-600" />
                                            <p className="text-red-800 text-sm">{error}</p>
                                        </div>
                                    </motion.div>
                                )}
                            </motion.div>

                            {/* Job Details Section */}
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.3 }}
                                className="p-2"
                            >
                                <div className="flex items-center space-x-3 mb-4">
                                    <Target className="h-4 w-4 md:h-5 md:w-5 text-blue-600" />
                                    <div>
                                        <h2 className="text-base md:text-lg font-semibold text-gray-900">Job Details</h2>
                                        <p className="text-gray-500 text-xs md:text-sm">Optional - for targeted feedback</p>
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-semibold text-gray-800 mb-2">
                                            Job Title
                                        </label>
                                        <input
                                            type="text"
                                            value={jobTitle}
                                            onChange={(e) => setJobTitle(e.target.value)}
                                            className="w-full px-3 py-2 border border-gray-300 rounded-sm focus:ring-1 focus:ring-blue-500 focus:border-blue-500 transition-all"
                                            placeholder="e.g., Senior Software Engineer"
                                        />
                                    </div>

                                    <div className="lg:col-span-2">
                                        <label className="block text-sm font-semibold text-gray-800 mb-2">
                                            Job Description
                                        </label>
                                        <textarea
                                            value={jobDescription}
                                            onChange={(e) => setJobDescription(e.target.value)}
                                            className="w-full px-3 py-2 border border-gray-300 rounded-sm focus:ring-1 focus:ring-blue-500 focus:border-blue-500 transition-all resize-none"
                                            rows={4}
                                            placeholder="Paste the job description for personalized recommendations..."
                                        />
                                    </div>
                                </div>
                            </motion.div>

                            {/* Analyze Button */}
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.4 }}
                                className="flex justify-end pt-4 border-t border-gray-300"
                            >
                                <motion.button
                                    whileHover={{ scale: 1.02, x: 5 }}
                                    whileTap={{ scale: 0.98 }}
                                    onClick={handleAnalyze}
                                    disabled={!file || isAnalyzing}
                                    className="flex items-center space-x-2 px-8 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-sm hover:from-blue-700 hover:to-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed font-semibold shadow-lg hover:shadow-xl transition-all"
                                >
                                    {isAnalyzing ? (
                                        <>
                                            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                                            <span>Analyzing...</span>
                                        </>
                                    ) : (
                                        <>
                                            <TrendingUp className="h-4 w-4" />
                                            <span>Analyze Resume</span>
                                        </>
                                    )}
                                </motion.button>
                            </motion.div>
                        </div>
                    ) : (
                        <div className="space-y-4">
                            {/* Results Header */}
                            <motion.div
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                className="bg-white p-2 rounded-sm border border-gray-200"
                            >
                                <div className="flex flex-col md:flex-row md:items-center justify-between space-y-4 md:space-y-0">
                                    <div>
                                        <h2 className="text-lg md:text-xl font-bold text-gray-900">Analysis Complete</h2>
                                        <p className="text-gray-600 text-sm md:text-base">Your comprehensive resume feedback</p>
                                    </div>
                                    <button
                                        onClick={handleReset}
                                        className="bg-gray-600 text-white px-4 py-2 rounded-sm hover:bg-gray-700 flex items-center space-x-2 text-sm w-fit"
                                    >
                                        <RotateCcw className="h-4 w-4" />
                                        <span>Analyze Another</span>
                                    </button>
                                </div>
                            </motion.div>

                            {/* Overall Rating */}
                            <motion.div
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: 0.1 }}
                                className="bg-white p-3 rounded-xl border border-gray-200"
                            >
                                <h3 className="text-base md:text-lg font-semibold text-gray-900 mb-4">Overall Rating</h3>
                                <div className="flex flex-col sm:flex-row sm:items-center space-y-4 sm:space-y-0 sm:space-x-6">
                                    <div className={`flex items-center px-3 md:px-4 py-2 md:py-3 rounded-sm border ${getRatingBg(result.overall_rating)}`}>
                                        <span className={`text-2xl md:text-3xl font-bold ${getRatingColor(result.overall_rating)}`}>
                                            {result.overall_rating.toFixed(1)}
                                        </span>
                                        <span className="text-gray-600 ml-1 text-sm md:text-base">/ 10</span>
                                    </div>
                                    <div className="flex items-center space-x-1">
                                        {renderStars(result.overall_rating)}
                                    </div>
                                </div>
                            </motion.div>

                            {/* Detailed Feedback */}
                            <motion.div
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: 0.2 }}
                                className="bg-white p-3 rounded-xl border border-gray-200"
                            >
                                <h3 className="text-base md:text-lg font-semibold text-gray-900 mb-4">Analysis Details</h3>
                                <p className="text-gray-700 leading-relaxed text-sm md:text-base">{result.feedback}</p>
                            </motion.div>

                            {/* Strengths and Areas for Improvement */}
                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                                <motion.div
                                    initial={{ opacity: 0, x: -20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: 0.3 }}
                                    className="bg-white p-3 rounded-xl border border-gray-200"
                                >
                                    <div className="flex items-center space-x-2 mb-4">
                                        <CheckCircle className="h-4 w-4 md:h-5 md:w-5 text-green-600" />
                                        <h3 className="text-base md:text-lg font-semibold text-gray-900">Strengths</h3>
                                    </div>
                                    <ul className="space-y-3">
                                        {result.strengths.map((strength, index) => (
                                            <li key={index} className="flex items-start space-x-3">
                                                <div className="w-2 h-2 bg-green-500 rounded-full mt-2 flex-shrink-0"></div>
                                                <span className="text-gray-700 text-sm">{strength}</span>
                                            </li>
                                        ))}
                                    </ul>
                                </motion.div>

                                <motion.div
                                    initial={{ opacity: 0, x: -20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: 0.4 }}
                                    className="bg-white p-3 rounded-xl border border-gray-200"
                                >
                                    <div className="flex items-center space-x-2 mb-4">
                                        <AlertCircle className="h-4 w-4 md:h-5 md:w-5 text-orange-600" />
                                        <h3 className="text-base md:text-lg font-semibold text-gray-900">Areas to Improve</h3>
                                    </div>
                                    <ul className="space-y-3">
                                        {result.areas_for_improvement.map((area, index) => (
                                            <li key={index} className="flex items-start space-x-3">
                                                <div className="w-2 h-2 bg-orange-500 rounded-full mt-2 flex-shrink-0"></div>
                                                <span className="text-gray-700 text-sm">{area}</span>
                                            </li>
                                        ))}
                                    </ul>
                                </motion.div>
                            </div>

                            {/* Recommendations */}
                            <motion.div
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: 0.5 }}
                                className="bg-white p-3 rounded-xl border border-gray-200"
                            >
                                <div className="flex items-center space-x-2 mb-6">
                                    <ArrowRight className="h-4 w-4 md:h-5 md:w-5 text-blue-600" />
                                    <h3 className="text-base md:text-lg font-semibold text-gray-900">Recommendations</h3>
                                </div>
                                <div className="space-y-4">
                                    {result.recommendations.map((rec, index) => (
                                        <div key={index} className="flex items-start space-x-3 p-3 bg-blue-50 rounded-sm border border-blue-200">
                                            <div className="w-5 h-5 md:w-6 md:h-6 bg-blue-600 rounded-full flex items-center justify-center flex-shrink-0">
                                                <span className="text-white font-medium text-xs">{index + 1}</span>
                                            </div>
                                            <span className="text-gray-700 text-sm font-medium">{rec}</span>
                                        </div>
                                    ))}
                                </div>
                            </motion.div>
                        </div>
                    )}
                </div>
            </div>
        </>
    );
}