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
        if (rating >= 8) return 'bg-green-50 border-green-200';
        if (rating >= 6) return 'bg-orange-50 border-orange-200';
        return 'bg-red-50 border-red-200';
    };

    const renderStars = (rating: number) => {
        const stars = [];
        const fullStars = Math.floor(rating);
        const hasHalfStar = rating % 1 >= 0.5;

        for (let i = 0; i < fullStars; i++) {
            stars.push(<Star key={i} className="h-4 w-4 fill-current text-orange-400" />);
        }
        if (hasHalfStar) {
            stars.push(<Star key="half" className="h-4 w-4 fill-current text-orange-400 opacity-50" />);
        }
        const remainingStars = 10 - Math.ceil(rating);
        for (let i = 0; i < remainingStars; i++) {
            stars.push(<Star key={`empty-${i}`} className="h-4 w-4 text-gray-300" />);
        }

        return stars;
    };

    return (
        <>
            <Navbar />
            <div className="min-h-screen bg-gray-50">
                <div className="max-w-6xl mx-auto px-4 py-6">
                    {/* Header */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-center mb-8"
                    >
                        <div className="inline-flex items-center justify-center w-12 h-12 bg-blue-600 rounded-lg mb-4">
                            <TrendingUp className="h-6 w-6 text-white" />
                        </div>
                        <h1 className="text-3xl font-bold text-gray-900 mb-2">
                            Resume Analysis
                        </h1>
                        <p className="text-gray-600 max-w-xl mx-auto">
                            Get AI-powered feedback and recommendations to improve your resume
                        </p>
                    </motion.div>

                    {!result ? (
                        <div className="space-y-6">
                            {/* Upload Section */}
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="bg-white rounded-lg shadow-sm border p-6"
                            >
                                <div className="flex items-center space-x-3 mb-4">
                                    <Upload className="h-5 w-5 text-blue-600" />
                                    <h2 className="text-lg font-semibold text-gray-900">Upload Resume</h2>
                                </div>

                                <div
                                    className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${file
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
                                                <CheckCircle className="h-8 w-8 text-green-600 mx-auto" />
                                                <p className="text-green-700 font-medium">{file.name}</p>
                                                <p className="text-green-600 text-sm">
                                                    {(file.size / 1024 / 1024).toFixed(2)} MB • Click to change
                                                </p>
                                            </div>
                                        ) : (
                                            <div className="space-y-2">
                                                <FileText className="h-8 w-8 text-gray-400 mx-auto" />
                                                <p className="text-gray-700 font-medium">
                                                    Drop your resume here or click to browse
                                                </p>
                                                <p className="text-gray-500 text-sm">
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
                                        className="bg-red-50 border border-red-200 rounded-lg p-3 mt-4"
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
                                transition={{ delay: 0.1 }}
                                className="bg-white rounded-lg shadow-sm border p-6"
                            >
                                <div className="flex items-center space-x-3 mb-4">
                                    <Target className="h-5 w-5 text-blue-600" />
                                    <div>
                                        <h2 className="text-lg font-semibold text-gray-900">Job Details</h2>
                                        <p className="text-gray-500 text-sm">Optional - for targeted feedback</p>
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Job Title
                                        </label>
                                        <input
                                            type="text"
                                            value={jobTitle}
                                            onChange={(e) => setJobTitle(e.target.value)}
                                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                            placeholder="e.g., Senior Software Engineer"
                                        />
                                    </div>

                                    <div className="lg:col-span-2">
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Job Description
                                        </label>
                                        <textarea
                                            value={jobDescription}
                                            onChange={(e) => setJobDescription(e.target.value)}
                                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
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
                                transition={{ delay: 0.2 }}
                                className="text-center"
                            >
                                <button
                                    onClick={handleAnalyze}
                                    disabled={!file || isAnalyzing}
                                    className="bg-blue-600 text-white px-8 py-3 rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2 mx-auto font-medium shadow-sm"
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
                                </button>
                            </motion.div>
                        </div>
                    ) : (
                        <div className="space-y-6">
                            {/* Results Header */}
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="bg-white rounded-lg shadow-sm border p-6"
                            >
                                <div className="flex items-center justify-between">
                                    <div>
                                        <h2 className="text-xl font-bold text-gray-900">Analysis Complete</h2>
                                        <p className="text-gray-600">Your comprehensive resume feedback</p>
                                    </div>
                                    <button
                                        onClick={handleReset}
                                        className="bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700 flex items-center space-x-2 text-sm"
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
                                className="bg-white rounded-lg shadow-sm border p-6"
                            >
                                <h3 className="text-lg font-semibold text-gray-900 mb-4">Overall Rating</h3>
                                <div className="flex items-center space-x-6">
                                    <div className={`flex items-center px-4 py-3 rounded-lg border ${getRatingBg(result.overall_rating)}`}>
                                        <span className={`text-3xl font-bold ${getRatingColor(result.overall_rating)}`}>
                                            {result.overall_rating.toFixed(1)}
                                        </span>
                                        <span className="text-gray-600 ml-1">/ 10</span>
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
                                className="bg-white rounded-lg shadow-sm border p-6"
                            >
                                <h3 className="text-lg font-semibold text-gray-900 mb-4">Analysis Details</h3>
                                <p className="text-gray-700 leading-relaxed">{result.feedback}</p>
                            </motion.div>

                            {/* Strengths and Areas for Improvement */}
                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                                <motion.div
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 0.3 }}
                                    className="bg-white rounded-lg shadow-sm border p-6"
                                >
                                    <div className="flex items-center space-x-2 mb-4">
                                        <CheckCircle className="h-5 w-5 text-green-600" />
                                        <h3 className="text-lg font-semibold text-gray-900">Strengths</h3>
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
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 0.4 }}
                                    className="bg-white rounded-lg shadow-sm border p-6"
                                >
                                    <div className="flex items-center space-x-2 mb-4">
                                        <AlertCircle className="h-5 w-5 text-orange-600" />
                                        <h3 className="text-lg font-semibold text-gray-900">Areas to Improve</h3>
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
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.5 }}
                                className="bg-white rounded-lg shadow-sm border p-6"
                            >
                                <div className="flex items-center space-x-2 mb-6">
                                    <ArrowRight className="h-5 w-5 text-blue-600" />
                                    <h3 className="text-lg font-semibold text-gray-900">Recommendations</h3>
                                </div>
                                <div className="space-y-4">
                                    {result.recommendations.map((rec, index) => (
                                        <div key={index} className="flex items-start space-x-3 p-3 bg-blue-50 rounded-lg border border-blue-100">
                                            <div className="w-6 h-6 bg-blue-600 rounded-full flex items-center justify-center flex-shrink-0">
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