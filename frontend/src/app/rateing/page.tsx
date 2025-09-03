"use client";

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Upload, FileText, Briefcase, Target, Star, TrendingUp, AlertCircle, CheckCircle, ArrowRight, RotateCcw, Search, Plus } from 'lucide-react';
import axios from '@/lib/axios';
import Navbar from '@/components/Navbar';
import { useAuth } from '@/components/AuthContext';

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
    const [searchTerm, setSearchTerm] = useState('');
    const { user, loading } = useAuth();

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

            if (jobTitle.trim()) {
                formData.append('job_title', jobTitle.trim());
            }

            if (jobDescription.trim()) {
                formData.append('job_description', jobDescription.trim());
            }

            const response = await axios.post('/api/resume-op/analyze', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });

            setResult(response.data);
        } catch (error: any) {
            console.error('Error analyzing resume:', error);
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
        if (rating >= 8) return 'text-emerald-600';
        if (rating >= 6) return 'text-amber-600';
        return 'text-rose-600';
    };

    const getRatingBg = (rating: number) => {
        if (rating >= 8) return 'bg-gradient-to-r from-emerald-50 to-emerald-100 border-emerald-200';
        if (rating >= 6) return 'bg-gradient-to-r from-amber-50 to-amber-100 border-amber-200';
        return 'bg-gradient-to-r from-rose-50 to-rose-100 border-rose-200';
    };

    const renderStars = (rating: number) => {
        const stars = [];
        const fullStars = Math.floor(rating);
        const hasHalfStar = rating % 1 >= 0.5;

        for (let i = 0; i < fullStars; i++) {
            stars.push(<Star key={i} className="h-5 w-5 fill-current text-amber-400" />);
        }

        if (hasHalfStar) {
            stars.push(<Star key="half" className="h-5 w-5 fill-current text-amber-400 opacity-50" />);
        }

        const remainingStars = 10 - Math.ceil(rating);
        for (let i = 0; i < remainingStars; i++) {
            stars.push(<Star key={`empty-${i}`} className="h-5 w-5 text-gray-300" />);
        }

        return stars;
    };

    return (
        <>
            <Navbar />
            <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
                {/* Header with Search and Add Button */}
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
                    {/* Page Header */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-center mb-12"
                    >
                        <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl mb-6 shadow-lg">
                            <TrendingUp className="h-8 w-8 text-white" />
                        </div>
                        <h1 className="text-4xl sm:text-5xl font-bold bg-gradient-to-r from-gray-900 via-blue-800 to-indigo-800 bg-clip-text text-transparent mb-4">
                            AI Resume Analysis
                        </h1>
                        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                            Get AI-powered analysis and actionable recommendations to enhance your resume and land your dream job
                        </p>
                    </motion.div>

                    {!result ? (
                        <div className="space-y-8">
                            {/* Upload Section */}
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="bg-white/70 backdrop-blur-sm rounded-2xl shadow-xl border border-white/50 p-8"
                            >
                                <div className="flex items-center space-x-3 mb-6">
                                    <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-indigo-500 rounded-xl flex items-center justify-center">
                                        <Upload className="h-5 w-5 text-white" />
                                    </div>
                                    <h2 className="text-2xl font-bold text-gray-900">Upload Your Resume</h2>
                                </div>

                                <div
                                    className={`border-2 border-dashed rounded-2xl p-12 text-center transition-all duration-300 ${file
                                        ? 'border-emerald-300 bg-gradient-to-br from-emerald-50 to-green-50 shadow-inner'
                                        : 'border-gray-300 hover:border-blue-400 hover:bg-blue-50/30'
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
                                        <div className="space-y-4">
                                            {file ? (
                                                <>
                                                    <div className="w-16 h-16 bg-emerald-500 rounded-2xl mx-auto flex items-center justify-center shadow-lg">
                                                        <CheckCircle className="h-8 w-8 text-white" />
                                                    </div>
                                                    <div>
                                                        <p className="text-emerald-700 font-semibold text-lg">{file.name}</p>
                                                        <p className="text-emerald-600 text-sm mt-1">
                                                            {(file.size / 1024 / 1024).toFixed(2)} MB • Click to change file
                                                        </p>
                                                    </div>
                                                </>
                                            ) : (
                                                <>
                                                    <div className="w-16 h-16 bg-gray-100 rounded-2xl mx-auto flex items-center justify-center">
                                                        <FileText className="h-8 w-8 text-gray-400" />
                                                    </div>
                                                    <div>
                                                        <p className="text-gray-700 font-medium text-lg">
                                                            Drop your resume here or click to browse
                                                        </p>
                                                        <p className="text-gray-500 text-sm mt-1">
                                                            PDF files only • Maximum 10MB
                                                        </p>
                                                    </div>
                                                </>
                                            )}
                                        </div>
                                    </label>
                                </div>

                                {error && (
                                    <motion.div
                                        initial={{ opacity: 0, scale: 0.95 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        className="bg-rose-50 border border-rose-200 rounded-xl p-4 mt-6"
                                    >
                                        <div className="flex items-center space-x-3">
                                            <AlertCircle className="h-5 w-5 text-rose-600 flex-shrink-0" />
                                            <p className="text-rose-800 font-medium">{error}</p>
                                        </div>
                                    </motion.div>
                                )}
                            </motion.div>

                            {/* Job Details Section */}
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.1 }}
                                className="bg-white/70 backdrop-blur-sm rounded-2xl shadow-xl border border-white/50 p-8"
                            >
                                <div className="flex items-center space-x-3 mb-6">
                                    <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl flex items-center justify-center">
                                        <Target className="h-5 w-5 text-white" />
                                    </div>
                                    <div>
                                        <h2 className="text-2xl font-bold text-gray-900">Job Details</h2>
                                        <p className="text-gray-600 text-sm">Optional but recommended for targeted feedback</p>
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                                    <div>
                                        <label className="block text-sm font-semibold text-gray-700 mb-3">
                                            Job Title
                                        </label>
                                        <input
                                            type="text"
                                            value={jobTitle}
                                            onChange={(e) => setJobTitle(e.target.value)}
                                            className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white/80 backdrop-blur-sm transition-all"
                                            placeholder="e.g., Senior Software Engineer"
                                        />
                                    </div>

                                    <div className="lg:col-span-1">
                                        <label className="block text-sm font-semibold text-gray-700 mb-3">
                                            Company/Industry
                                        </label>
                                        <input
                                            type="text"
                                            className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white/80 backdrop-blur-sm transition-all"
                                            placeholder="e.g., Google, Tech Startup"
                                        />
                                    </div>

                                    <div className="lg:col-span-2">
                                        <label className="block text-sm font-semibold text-gray-700 mb-3">
                                            Job Description
                                        </label>
                                        <textarea
                                            value={jobDescription}
                                            onChange={(e) => setJobDescription(e.target.value)}
                                            className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white/80 backdrop-blur-sm transition-all resize-none"
                                            rows={6}
                                            placeholder="Paste the job description here for personalized recommendations..."
                                        />
                                    </div>
                                </div>
                            </motion.div>

                            {/* Analyze Button */}
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.2 }}
                                className="text-center"
                            >
                                <button
                                    onClick={handleAnalyze}
                                    disabled={!file || isAnalyzing}
                                    className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-12 py-4 rounded-xl hover:from-blue-700 hover:to-indigo-700 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-3 mx-auto text-lg font-semibold shadow-xl hover:shadow-2xl transform hover:scale-105"
                                >
                                    {isAnalyzing ? (
                                        <>
                                            <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                                            <span>Analyzing Your Resume...</span>
                                        </>
                                    ) : (
                                        <>
                                            <TrendingUp className="h-5 w-5" />
                                            <span>Get AI Feedback</span>
                                        </>
                                    )}
                                </button>
                            </motion.div>
                        </div>
                    ) : (
                        <div className="space-y-8">
                            {/* Results Header */}
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="bg-white/70 backdrop-blur-sm rounded-2xl shadow-xl border border-white/50 p-8"
                            >
                                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between space-y-6 sm:space-y-0">
                                    <div className="text-center sm:text-left">
                                        <h2 className="text-3xl font-bold text-gray-900 mb-2">Analysis Complete!</h2>
                                        <p className="text-gray-600">Here's your comprehensive resume feedback</p>
                                    </div>
                                    <button
                                        onClick={handleReset}
                                        className="bg-gradient-to-r from-gray-600 to-gray-700 text-white px-6 py-3 rounded-xl hover:from-gray-700 hover:to-gray-800 transition-all flex items-center space-x-2 shadow-lg hover:shadow-xl transform hover:scale-105 mx-auto sm:mx-0"
                                    >
                                        <RotateCcw className="h-4 w-4" />
                                        <span>Analyze Another</span>
                                    </button>
                                </div>
                            </motion.div>

                            {/* Overall Rating */}
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.1 }}
                                className="bg-white/70 backdrop-blur-sm rounded-2xl shadow-xl border border-white/50 p-8"
                            >
                                <h3 className="text-2xl font-bold text-gray-900 mb-6">Overall Rating</h3>
                                <div className="flex flex-col lg:flex-row items-center justify-center lg:justify-start space-y-6 lg:space-y-0 lg:space-x-8">
                                    <div className={`inline-flex items-center px-8 py-6 rounded-2xl border-2 ${getRatingBg(result.overall_rating)}`}>
                                        <span className={`text-5xl font-bold ${getRatingColor(result.overall_rating)}`}>
                                            {result.overall_rating.toFixed(1)}
                                        </span>
                                        <span className="text-gray-600 ml-2 text-xl">/ 10</span>
                                    </div>
                                    <div className="flex items-center space-x-1">
                                        {renderStars(result.overall_rating)}
                                    </div>
                                </div>
                            </motion.div>

                            {/* Detailed Feedback */}
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.2 }}
                                className="bg-white/70 backdrop-blur-sm rounded-2xl shadow-xl border border-white/50 p-8"
                            >
                                <h3 className="text-2xl font-bold text-gray-900 mb-6">Detailed Analysis</h3>
                                <div className="prose prose-lg max-w-none">
                                    <p className="text-gray-700 leading-relaxed text-lg">{result.feedback}</p>
                                </div>
                            </motion.div>

                            {/* Strengths and Areas for Improvement */}
                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                                {/* Strengths */}
                                <motion.div
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 0.3 }}
                                    className="bg-white/70 backdrop-blur-sm rounded-2xl shadow-xl border border-white/50 p-8"
                                >
                                    <div className="flex items-center space-x-3 mb-6">
                                        <div className="w-10 h-10 bg-gradient-to-br from-emerald-500 to-green-500 rounded-xl flex items-center justify-center">
                                            <CheckCircle className="h-5 w-5 text-white" />
                                        </div>
                                        <h3 className="text-xl font-bold text-gray-900">Key Strengths</h3>
                                    </div>
                                    <ul className="space-y-4">
                                        {result.strengths.map((strength, index) => (
                                            <li key={index} className="flex items-start space-x-4">
                                                <div className="w-2 h-2 bg-emerald-500 rounded-full mt-3 flex-shrink-0"></div>
                                                <span className="text-gray-700 leading-relaxed">{strength}</span>
                                            </li>
                                        ))}
                                    </ul>
                                </motion.div>

                                {/* Areas for Improvement */}
                                <motion.div
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 0.4 }}
                                    className="bg-white/70 backdrop-blur-sm rounded-2xl shadow-xl border border-white/50 p-8"
                                >
                                    <div className="flex items-center space-x-3 mb-6">
                                        <div className="w-10 h-10 bg-gradient-to-br from-amber-500 to-orange-500 rounded-xl flex items-center justify-center">
                                            <AlertCircle className="h-5 w-5 text-white" />
                                        </div>
                                        <h3 className="text-xl font-bold text-gray-900">Areas to Improve</h3>
                                    </div>
                                    <ul className="space-y-4">
                                        {result.areas_for_improvement.map((area, index) => (
                                            <li key={index} className="flex items-start space-x-4">
                                                <div className="w-2 h-2 bg-amber-500 rounded-full mt-3 flex-shrink-0"></div>
                                                <span className="text-gray-700 leading-relaxed">{area}</span>
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
                                className="bg-white/70 backdrop-blur-sm rounded-2xl shadow-xl border border-white/50 p-8"
                            >
                                <div className="flex items-center space-x-3 mb-8">
                                    <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-indigo-500 rounded-xl flex items-center justify-center">
                                        <ArrowRight className="h-5 w-5 text-white" />
                                    </div>
                                    <h3 className="text-2xl font-bold text-gray-900">Action Items</h3>
                                </div>
                                <div className="grid gap-6">
                                    {result.recommendations.map((rec, index) => (
                                        <div key={index} className="flex items-start space-x-4 p-4 rounded-xl bg-blue-50/50 border border-blue-100">
                                            <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-indigo-500 rounded-full flex items-center justify-center flex-shrink-0">
                                                <span className="text-white font-bold text-sm">{index + 1}</span>
                                            </div>
                                            <span className="text-gray-700 leading-relaxed font-medium">{rec}</span>
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