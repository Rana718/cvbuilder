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
            <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-100/50">
                {/* Enhanced Background Elements */}
                <div className="absolute inset-0 overflow-hidden pointer-events-none">
                    <div className="absolute top-20 left-10 w-96 h-96 bg-gradient-to-r from-blue-400/20 to-indigo-500/20 rounded-full mix-blend-multiply filter blur-3xl animate-pulse"></div>
                    <div className="absolute top-40 right-10 w-80 h-80 bg-gradient-to-r from-purple-400/20 to-pink-500/20 rounded-full mix-blend-multiply filter blur-3xl animate-pulse delay-1000"></div>
                    <div className="absolute bottom-20 left-1/2 w-72 h-72 bg-gradient-to-r from-emerald-400/20 to-teal-500/20 rounded-full mix-blend-multiply filter blur-3xl animate-pulse delay-2000"></div>
                </div>

                {/* Floating grid pattern */}
                <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px] pointer-events-none"></div>

                <div className="relative max-w-4xl mx-auto px-4 py-6">
                    {/* Enhanced Header */}
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
                                <TrendingUp className="h-4 w-4 mr-2 text-blue-600" />
                                <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent font-semibold">
                                    AI Resume Analyzer
                                </span>
                            </div>
                        </div>
                    </motion.div>

                    {/* Header */}
                    <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                        className="text-center mb-8"
                    >
                        <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-slate-900 mb-4">
                            Resume
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 ml-2">
                                Analysis
                            </span>
                        </h1>
                        <p className="text-lg md:text-xl text-slate-600 font-light leading-relaxed max-w-2xl mx-auto">
                            Get AI-powered feedback and recommendations to improve your resume
                        </p>
                    </motion.div>

                    {!result ? (
                        <div className="space-y-4">
                            {/* Upload Section */}
                            <motion.div
                                initial={{ opacity: 0, scale: 0.95 }}
                                animate={{ opacity: 1, scale: 1 }}
                                transition={{ delay: 0.2 }}
                                className="bg-white/80 backdrop-blur-sm rounded-2xl border border-white/20 shadow-xl p-6"
                            >
                                <div className="flex items-center space-x-3 mb-6">
                                    <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg">
                                        <Upload className="h-5 w-5 text-white" />
                                    </div>
                                    <h2 className="text-lg md:text-xl font-semibold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                                        Upload Resume
                                    </h2>
                                </div>

                                <div
                                    className={`border-2 border-dashed rounded-2xl p-8 md:p-12 text-center transition-all duration-300 ${file
                                            ? 'border-green-300 bg-gradient-to-br from-green-50 to-emerald-50 shadow-lg'
                                            : 'border-slate-300 hover:border-blue-400 hover:bg-gradient-to-br hover:from-blue-50 hover:to-indigo-50 hover:shadow-md'
                                        }`}
                                >
                                    <input
                                        type="file"
                                        accept=".pdf"
                                        onChange={handleFileChange}
                                        className="hidden"
                                        id="resume-upload"
                                    />
                                    <label htmlFor="resume-upload" className="cursor-pointer block">
                                        {file ? (
                                            <div className="space-y-4">
                                                <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-emerald-600 rounded-2xl flex items-center justify-center mx-auto shadow-xl">
                                                    <CheckCircle className="h-8 w-8 text-white" />
                                                </div>
                                                <p className="text-green-700 font-semibold text-lg">{file.name}</p>
                                                <p className="text-green-600 text-sm font-medium">
                                                    {(file.size / 1024 / 1024).toFixed(2)} MB • Click to change
                                                </p>
                                            </div>
                                        ) : (
                                            <div className="space-y-4">
                                                <div className="w-16 h-16 bg-gradient-to-br from-slate-100 to-slate-200 rounded-2xl flex items-center justify-center mx-auto shadow-lg group-hover:shadow-xl transition-shadow">
                                                    <FileText className="h-8 w-8 text-slate-600" />
                                                </div>
                                                <div>
                                                    <p className="text-slate-700 font-semibold text-lg mb-2">
                                                        Drop your resume here or click to browse
                                                    </p>
                                                    <p className="text-slate-500 text-sm font-medium">
                                                        PDF files only, max 10MB
                                                    </p>
                                                </div>
                                            </div>
                                        )}
                                    </label>
                                </div>

                                {error && (
                                    <motion.div
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        className="bg-red-50/80 backdrop-blur-sm border border-red-200 rounded-xl p-4 mt-6"
                                    >
                                        <div className="flex items-center space-x-2">
                                            <AlertCircle className="h-4 w-4 text-red-600" />
                                            <p className="text-red-800 text-sm font-medium">{error}</p>
                                        </div>
                                    </motion.div>
                                )}
                            </motion.div>

                            {/* Job Details Section */}
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.3 }}
                                className="bg-white/80 backdrop-blur-sm rounded-2xl border border-white/20 shadow-xl p-6"
                            >
                                <div className="flex items-center space-x-3 mb-6">
                                    <div className="w-10 h-10 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-xl flex items-center justify-center shadow-lg">
                                        <Target className="h-5 w-5 text-white" />
                                    </div>
                                    <div>
                                        <h2 className="text-lg md:text-xl font-semibold bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">
                                            Job Details
                                        </h2>
                                        <p className="text-slate-600 text-sm font-medium">Optional - for targeted feedback</p>
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                                    <div>
                                        <label className="block text-sm font-medium text-slate-700 mb-2">
                                            Target Job Title
                                        </label>
                                        <input
                                            type="text"
                                            value={jobTitle}
                                            onChange={(e) => setJobTitle(e.target.value)}
                                            className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all bg-white/80 backdrop-blur-sm"
                                            placeholder="e.g., Senior Software Engineer"
                                        />
                                    </div>

                                    <div className="lg:col-span-1">
                                        <label className="block text-sm font-medium text-slate-700 mb-2">
                                            Job Description
                                        </label>
                                        <textarea
                                            value={jobDescription}
                                            onChange={(e) => setJobDescription(e.target.value)}
                                            className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all bg-white/80 backdrop-blur-sm resize-none"
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
                                className="flex justify-center pt-4"
                            >
                                <motion.button
                                    whileHover={{ scale: 1.02, y: -2 }}
                                    whileTap={{ scale: 0.98 }}
                                    onClick={handleAnalyze}
                                    disabled={!file || isAnalyzing}
                                    className="flex items-center space-x-3 px-10 py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl hover:from-blue-700 hover:to-purple-700 disabled:opacity-50 disabled:cursor-not-allowed font-semibold shadow-lg hover:shadow-xl transition-all duration-300"
                                >
                                    {isAnalyzing ? (
                                        <>
                                            <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                                            <span>Analyzing...</span>
                                        </>
                                    ) : (
                                        <>
                                            <TrendingUp className="h-5 w-5" />
                                            <span>Analyze Resume</span>
                                        </>
                                    )}
                                </motion.button>
                            </motion.div>
                        </div>
                    ) : (
                        <div className="space-y-6">
                            {/* Results Header */}
                            <motion.div
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                className="bg-white/80 backdrop-blur-sm rounded-2xl border border-white/20 shadow-xl p-6"
                            >
                                <div className="flex flex-col md:flex-row md:items-center justify-between space-y-4 md:space-y-0">
                                    <div>
                                        <h2 className="text-xl md:text-2xl font-bold text-slate-900 mb-2">Analysis Complete</h2>
                                        <p className="text-slate-600 text-sm md:text-base font-medium">Your comprehensive resume feedback</p>
                                    </div>
                                    <motion.button
                                        whileHover={{ scale: 1.05 }}
                                        whileTap={{ scale: 0.95 }}
                                        onClick={handleReset}
                                        className="bg-gradient-to-r from-slate-600 to-slate-700 text-white px-6 py-3 rounded-xl hover:from-slate-700 hover:to-slate-800 flex items-center space-x-2 text-sm font-semibold shadow-lg hover:shadow-xl transition-all duration-300 w-fit"
                                    >
                                        <RotateCcw className="h-4 w-4" />
                                        <span>Analyze Another</span>
                                    </motion.button>
                                </div>
                            </motion.div>

                            {/* Overall Rating */}
                            <motion.div
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: 0.1 }}
                                className="bg-white/80 backdrop-blur-sm rounded-2xl border border-white/20 shadow-xl p-6"
                            >
                                <h3 className="text-lg md:text-xl font-semibold text-slate-900 mb-6">Overall Rating</h3>
                                <div className="flex flex-col sm:flex-row sm:items-center space-y-4 sm:space-y-0 sm:space-x-6">
                                    <div className={`flex items-center px-6 py-4 rounded-2xl border-2 shadow-lg ${getRatingBg(result.overall_rating)}`}>
                                        <span className={`text-3xl md:text-4xl font-bold ${getRatingColor(result.overall_rating)}`}>
                                            {result.overall_rating.toFixed(1)}
                                        </span>
                                        <span className="text-slate-600 ml-2 text-lg font-medium">/ 10</span>
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
                                className="bg-white/80 backdrop-blur-sm rounded-2xl border border-white/20 shadow-xl p-6"
                            >
                                <h3 className="text-lg md:text-xl font-semibold text-slate-900 mb-4">Analysis Details</h3>
                                <p className="text-slate-700 leading-relaxed text-sm md:text-base font-medium">{result.feedback}</p>
                            </motion.div>

                            {/* Strengths and Areas for Improvement */}
                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                                <motion.div
                                    initial={{ opacity: 0, x: -20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: 0.3 }}
                                    className="bg-white/80 backdrop-blur-sm rounded-2xl border border-white/20 shadow-xl p-6"
                                >
                                    <div className="flex items-center space-x-3 mb-6">
                                        <div className="w-10 h-10 bg-gradient-to-br from-green-500 to-emerald-600 rounded-xl flex items-center justify-center shadow-lg">
                                            <CheckCircle className="h-5 w-5 text-white" />
                                        </div>
                                        <h3 className="text-lg md:text-xl font-semibold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">Strengths</h3>
                                    </div>
                                    <ul className="space-y-3">
                                        {result.strengths.map((strength, index) => (
                                            <li key={index} className="flex items-start space-x-3">
                                                <div className="w-2 h-2 bg-green-500 rounded-full mt-2 flex-shrink-0"></div>
                                                <span className="text-slate-700 text-sm font-medium">{strength}</span>
                                            </li>
                                        ))}
                                    </ul>
                                </motion.div>

                                <motion.div
                                    initial={{ opacity: 0, x: -20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: 0.4 }}
                                    className="bg-white/80 backdrop-blur-sm rounded-2xl border border-white/20 shadow-xl p-6"
                                >
                                    <div className="flex items-center space-x-3 mb-6">
                                        <div className="w-10 h-10 bg-gradient-to-br from-orange-500 to-red-500 rounded-xl flex items-center justify-center shadow-lg">
                                            <AlertCircle className="h-5 w-5 text-white" />
                                        </div>
                                        <h3 className="text-lg md:text-xl font-semibold bg-gradient-to-r from-orange-600 to-red-600 bg-clip-text text-transparent">Areas to Improve</h3>
                                    </div>
                                    <ul className="space-y-3">
                                        {result.areas_for_improvement.map((area, index) => (
                                            <li key={index} className="flex items-start space-x-3">
                                                <div className="w-2 h-2 bg-orange-500 rounded-full mt-2 flex-shrink-0"></div>
                                                <span className="text-slate-700 text-sm font-medium">{area}</span>
                                            </li>
                                        ))}
                                    </ul>
                                </motion.div>
                            </div>

                            {/* Recommendations */}
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.5 }}
                                className="bg-white/80 backdrop-blur-sm rounded-2xl border border-white/20 shadow-xl p-6"
                            >
                                <div className="flex items-center space-x-3 mb-6">
                                    <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg">
                                        <ArrowRight className="h-5 w-5 text-white" />
                                    </div>
                                    <h3 className="text-lg md:text-xl font-semibold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                                        Personalized Recommendations
                                    </h3>
                                </div>
                                <div className="space-y-4">
                                    {result.recommendations.map((rec, index) => (
                                        <motion.div 
                                            key={index} 
                                            initial={{ opacity: 0, x: -20 }}
                                            animate={{ opacity: 1, x: 0 }}
                                            transition={{ delay: 0.6 + index * 0.1 }}
                                            className="flex items-start space-x-4 p-4 bg-gradient-to-br from-blue-50 to-purple-50 rounded-xl border border-blue-100 hover:border-blue-200 transition-colors"
                                        >
                                            <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center flex-shrink-0 shadow-lg">
                                                <span className="text-white font-semibold text-sm">{index + 1}</span>
                                            </div>
                                            <span className="text-slate-700 text-sm font-medium leading-relaxed">{rec}</span>
                                        </motion.div>
                                    ))}
                                </div>
                            </motion.div>
                        </div>
                    )}
                </div>

                {/* Floating background elements */}
                <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none">
                    <div className="absolute top-0 -right-4 w-72 h-72 bg-purple-300 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob"></div>
                    <div className="absolute top-0 -left-4 w-72 h-72 bg-yellow-300 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-2000"></div>
                    <div className="absolute -bottom-8 left-20 w-72 h-72 bg-pink-300 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-4000"></div>
                </div>
            </div>
        </>
    );
}