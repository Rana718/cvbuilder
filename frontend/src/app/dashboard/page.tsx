'use client'

import React, { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { FileText, Mail, Plus, Crown, User, CreditCard, Sparkles, Download, Edit, Star, Target, ChevronRight } from 'lucide-react'
import { useAuth } from '@/components/AuthContext'
import axiosInstance from '@/lib/axios'
import Navbar from '@/components/Navbar'
import PaymentHistory from '@/components/PaymentHistory'

// Interfaces
interface DashboardStats {
    totalResumes: number
    totalCoverLetters: number
    completionRate: number
    isPremium: boolean
}

interface Resume {
    id: number
    name: string
    job_title: string
    template_id: number
    created_at: string
    updated_at: string
}

interface SubscriptionStatus {
    has_subscription: boolean;
    is_premium: boolean;
    status: string;
    current_period_end?: string;
    plan?: string;
}

interface PremiumStatus {
    isPremium: boolean;
    loading: boolean;
    subscriptionStatus?: SubscriptionStatus;
    refreshStatus: () => Promise<void>;
}

// Premium Status Hook
const usePremiumStatus = (): PremiumStatus => {
    const { user } = useAuth();
    const [isPremium, setIsPremium] = useState(false);
    const [loading, setLoading] = useState(true);
    const [subscriptionStatus, setSubscriptionStatus] = useState<SubscriptionStatus>();

    const checkPremiumStatus = async () => {
        if (!user) {
            setIsPremium(false);
            setSubscriptionStatus(undefined);
            setLoading(false);
            return;
        }

        try {
            const response = await axiosInstance.get('/api/payment/subscription-status');
            const data: SubscriptionStatus = response.data;
            setSubscriptionStatus(data);
            setIsPremium(data.is_premium);
        } catch (error: any) {
            console.error('Failed to check premium status:', error);
            try {
                const tokenResult = await user.getIdTokenResult(true);
                const premium = tokenResult.claims.premium === "true" || tokenResult.claims.premium === true;
                setIsPremium(premium);
            } catch (tokenError) {
                console.error('Failed to get token claims:', tokenError);
                setIsPremium(false);
            }
        } finally {
            setLoading(false);
        }
    };

    const refreshStatus = async () => {
        setLoading(true);
        await checkPremiumStatus();
    };

    useEffect(() => {
        checkPremiumStatus();
    }, [user]);

    return {
        isPremium,
        loading,
        subscriptionStatus,
        refreshStatus
    };
};

function Dashboard() {
    const { user, loading: authLoading } = useAuth()
    const router = useRouter()
    const { isPremium, loading: premiumLoading, subscriptionStatus, refreshStatus } = usePremiumStatus()

    const [stats, setStats] = useState<DashboardStats>({
        totalResumes: 0,
        totalCoverLetters: 0,
        completionRate: 0,
        isPremium: false
    })

    const [resumes, setResumes] = useState<Resume[]>([])
    const [loading, setLoading] = useState(true)
    const [showPaymentHistory, setShowPaymentHistory] = useState(false)

    useEffect(() => {
        if (authLoading || premiumLoading) return
        if (!user) {
            router.push('/sign-in?callbackUrl=' + encodeURIComponent('/dashboard'))
            return
        }

        fetchDashboardData()
    }, [user, authLoading, premiumLoading, router])

    const fetchDashboardData = async () => {
        try {
            setLoading(true)
            const response = await axiosInstance.get('/api/dashboard/data')
            const data = response.data

            if (data.error) {
                console.error('Dashboard API error:', data.error)
                setStats({
                    totalResumes: 0,
                    totalCoverLetters: 0,
                    completionRate: 0,
                    isPremium: isPremium
                })
                setResumes([])
            } else {
                setStats({
                    totalResumes: data.totalResumes || 0,
                    totalCoverLetters: data.totalCoverLetters || 0,
                    completionRate: data.completionRate || 0,
                    isPremium: isPremium
                })
                setResumes(data.resumes || [])
            }
        } catch (error) {
            console.error('Failed to fetch dashboard data:', error)
            setStats({
                totalResumes: 0,
                totalCoverLetters: 0,
                completionRate: 0,
                isPremium: isPremium
            })
            setResumes([])
        } finally {
            setLoading(false)
        }
    }

    const getGreeting = () => {
        const hour = new Date().getHours()
        if (hour < 12) return 'Good morning'
        if (hour < 18) return 'Good afternoon'
        return 'Good evening'
    }

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric'
        })
    }

    if (authLoading || loading || premiumLoading) {
        return (
            <>
                <Navbar />
                <div className="min-h-screen bg-slate-50 flex items-center justify-center">
                    <div className="text-center">
                        <div className="relative w-16 h-16 mx-auto mb-6">
                            <div className="absolute inset-0 border-3 border-slate-200 rounded-full"></div>
                            <div className="absolute inset-0 border-3 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
                        </div>
                        <h3 className="text-lg font-medium text-slate-700 mb-2">Loading Dashboard</h3>
                        <p className="text-sm text-slate-500">Preparing your workspace...</p>
                    </div>
                </div>
            </>
        )
    }

    return (
        <>
            <Navbar />
            <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
                {/* Hero Header */}
                <div className="relative bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-700 text-white overflow-hidden">
                    <div className="absolute inset-0 bg-black/10"></div>
                    <div className="absolute inset-0 opacity-20">
                        <div className="absolute inset-0" style={{
                            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.3'%3E%3Ccircle cx='30' cy='30' r='1'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
                        }}></div>
                    </div>
                    <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
                            <div>
                                <div className="flex items-center gap-4 mb-3">
                                    <h1 className="text-3xl sm:text-4xl font-bold text-white">
                                        {getGreeting()}, {user?.displayName?.split(' ')[0] || user?.email?.split('@')[0] || 'User'}!
                                    </h1>
                                    {isPremium && (
                                        <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/20 backdrop-blur-sm border border-white/30 rounded-full">
                                            <Crown className="w-5 h-5 text-yellow-300" />
                                            <span className="text-white text-sm font-semibold">Pro Member</span>
                                        </div>
                                    )}
                                </div>
                                <p className="text-blue-100 text-lg">
                                    Ready to build your career? Let's create something amazing together.
                                </p>
                            </div>
                            <button
                                onClick={() => router.push('/profile')}
                                className="inline-flex items-center gap-2 px-6 py-3 text-sm font-medium text-blue-600 bg-white hover:bg-blue-50 rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 transform hover:scale-105"
                            >
                                <User className="w-4 h-4" />
                                View Profile
                            </button>
                        </div>
                    </div>
                </div>

                {/* Main Content */}
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                    {/* Stats Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
                        {[
                            {
                                label: 'Total Resumes',
                                value: stats.totalResumes,
                                icon: FileText,
                                bgColor: 'bg-gradient-to-br from-blue-500 to-blue-600',
                                textColor: 'text-blue-700',
                                bgLight: 'bg-blue-50',
                                borderColor: 'border-blue-200',
                            },
                            {
                                label: 'Cover Letters',
                                value: stats.totalCoverLetters,
                                icon: Mail,
                                bgColor: 'bg-gradient-to-br from-emerald-500 to-emerald-600',
                                textColor: 'text-emerald-700',
                                bgLight: 'bg-emerald-50',
                                borderColor: 'border-emerald-200',
                            },
                            {
                                label: 'Success Rate',
                                value: `${stats.completionRate}%`,
                                icon: Target,
                                bgColor: 'bg-gradient-to-br from-amber-500 to-orange-500',
                                textColor: 'text-orange-700',
                                bgLight: 'bg-orange-50',
                                borderColor: 'border-orange-200',
                            }
                        ].map((stat, index) => (
                            <motion.div
                                key={stat.label}
                                initial={{ opacity: 0, y: 30 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: index * 0.15 }}
                                className={`relative overflow-hidden bg-white rounded-2xl border ${stat.borderColor} shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105`}
                            >
                                <div className="absolute top-0 right-0 w-20 h-20 -mr-10 -mt-10 rounded-full bg-gradient-to-br from-white/20 to-white/5"></div>
                                <div className="relative p-6">
                                    <div className="flex items-center justify-between mb-4">
                                        <div className={`w-14 h-14 ${stat.bgColor} rounded-xl flex items-center justify-center shadow-lg`}>
                                            <stat.icon className="w-7 h-7 text-white" />
                                        </div>
                                        <div className={`px-3 py-1 ${stat.bgLight} rounded-full`}>
                                            <span className={`text-xs font-semibold ${stat.textColor}`}>Active</span>
                                        </div>
                                    </div>
                                    <div className="text-3xl font-bold text-slate-900 mb-2">{stat.value}</div>
                                    <div className="text-sm font-medium text-slate-600">{stat.label}</div>
                                </div>
                            </motion.div>
                        ))}
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                        {/* Recent Resumes - Takes 2 columns */}
                        <div className="lg:col-span-2">
                            <motion.div
                                initial={{ opacity: 0, y: 30 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.3 }}
                                className="bg-white rounded-2xl border border-slate-200 shadow-lg overflow-hidden"
                            >
                                <div className="bg-gradient-to-r from-slate-50 to-blue-50 p-6 border-b border-slate-200">
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <h3 className="text-xl font-semibold text-slate-900 mb-1">Recent Documents</h3>
                                            <p className="text-sm text-slate-600">Your latest resumes and cover letters</p>
                                        </div>
                                        <button
                                            onClick={() => router.push('/resusme')}
                                            className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-blue-600 hover:text-blue-700 bg-white hover:bg-blue-50 rounded-lg border border-blue-200 transition-all duration-200 hover:shadow-md"
                                        >
                                            View all
                                            <ChevronRight className="w-4 h-4" />
                                        </button>
                                    </div>
                                </div>

                                <div className="p-6">
                                    {resumes.length > 0 ? (
                                        <div className="space-y-4">
                                            {resumes.slice(0, 4).map((resume, index) => (
                                                <motion.div
                                                    key={resume.id}
                                                    initial={{ opacity: 0, x: -20 }}
                                                    animate={{ opacity: 1, x: 0 }}
                                                    transition={{ delay: 0.4 + index * 0.1 }}
                                                    className="group flex items-center justify-between p-4 hover:bg-gradient-to-r hover:from-blue-50 hover:to-indigo-50 rounded-xl transition-all duration-200 cursor-pointer border border-transparent hover:border-blue-200"
                                                >
                                                    <div className="flex items-center gap-4">
                                                        <div className="relative">
                                                            <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center shadow-lg group-hover:shadow-xl transition-shadow duration-200">
                                                                <FileText className="w-6 h-6 text-white" />
                                                            </div>
                                                            <div className="absolute -top-1 -right-1 w-4 h-4 bg-emerald-500 rounded-full border-2 border-white"></div>
                                                        </div>
                                                        <div>
                                                            <h4 className="font-semibold text-slate-900 group-hover:text-blue-700 transition-colors">
                                                                {resume.name || `Resume ${resume.id}`}
                                                            </h4>
                                                            <p className="text-sm text-slate-600 font-medium">
                                                                {resume.job_title || 'No job title specified'}
                                                            </p>
                                                            <p className="text-xs text-slate-500 mt-1">
                                                                Updated {formatDate(resume.updated_at)}
                                                            </p>
                                                        </div>
                                                    </div>
                                                    <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-all duration-200">
                                                        <button className="p-2 hover:bg-blue-100 rounded-lg transition-colors">
                                                            <Edit className="w-4 h-4 text-blue-600" />
                                                        </button>
                                                        <button className="p-2 hover:bg-emerald-100 rounded-lg transition-colors">
                                                            <Download className="w-4 h-4 text-emerald-600" />
                                                        </button>
                                                    </div>
                                                </motion.div>
                                            ))}
                                        </div>
                                    ) : (
                                        <div className="text-center py-16">
                                            <div className="relative mb-6">
                                                <div className="w-20 h-20 bg-gradient-to-br from-blue-100 to-indigo-100 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg">
                                                    <FileText className="w-10 h-10 text-blue-600" />
                                                </div>
                                                <div className="absolute -top-2 -right-2 w-8 h-8 bg-yellow-400 rounded-full flex items-center justify-center">
                                                    <Plus className="w-4 h-4 text-yellow-800" />
                                                </div>
                                            </div>
                                            <h4 className="text-xl font-semibold text-slate-700 mb-3">No documents yet</h4>
                                            <p className="text-slate-500 mb-8 text-sm max-w-sm mx-auto">
                                                Create your first professional resume to get started on your career journey
                                            </p>
                                            <button
                                                onClick={() => router.push('/template')}
                                                className="inline-flex items-center gap-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-6 py-3 rounded-xl hover:from-blue-700 hover:to-indigo-700 transition-all duration-200 font-semibold shadow-lg hover:shadow-xl transform hover:scale-105"
                                            >
                                                <Plus className="w-5 h-5" />
                                                Create Your First Resume
                                            </button>
                                        </div>
                                    )}
                                </div>
                            </motion.div>
                        </div>

                        {/* Right Sidebar */}
                        <div className="space-y-8">
                            {/* Quick Actions */}
                            <motion.div
                                initial={{ opacity: 0, y: 30 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.5 }}
                                className="bg-white rounded-2xl border border-slate-200 shadow-lg overflow-hidden"
                            >
                                <div className="bg-gradient-to-r from-slate-50 to-purple-50 p-6 border-b border-slate-200">
                                    <h3 className="text-lg font-semibold text-slate-900 flex items-center gap-2">
                                        <Sparkles className="w-5 h-5 text-purple-600" />
                                        Quick Actions
                                    </h3>
                                </div>
                                <div className="p-6 space-y-4">
                                    <button
                                        onClick={() => router.push('/template')}
                                        className="w-full flex items-center gap-4 p-4 text-left hover:bg-gradient-to-r hover:from-blue-50 hover:to-indigo-50 rounded-xl transition-all duration-200 group border border-transparent hover:border-blue-200"
                                    >
                                        <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 group-hover:from-blue-600 group-hover:to-indigo-600 rounded-xl flex items-center justify-center shadow-lg group-hover:shadow-xl transition-all duration-200">
                                            <FileText className="w-6 h-6 text-white" />
                                        </div>
                                        <div className="flex-1">
                                            <div className="font-semibold text-slate-900 group-hover:text-blue-700 transition-colors">New Resume</div>
                                            <div className="text-sm text-slate-600">Create from professional template</div>
                                        </div>
                                        <ChevronRight className="w-5 h-5 text-slate-400 group-hover:text-blue-600 transition-colors" />
                                    </button>

                                    <button
                                        onClick={() => router.push('/cover-letter')}
                                        className="w-full flex items-center gap-4 p-4 text-left hover:bg-gradient-to-r hover:from-emerald-50 hover:to-green-50 rounded-xl transition-all duration-200 group border border-transparent hover:border-emerald-200"
                                    >
                                        <div className="w-12 h-12 bg-gradient-to-br from-emerald-500 to-emerald-600 group-hover:from-emerald-600 group-hover:to-green-600 rounded-xl flex items-center justify-center shadow-lg group-hover:shadow-xl transition-all duration-200">
                                            <Mail className="w-6 h-6 text-white" />
                                        </div>
                                        <div className="flex-1">
                                            <div className="font-semibold text-slate-900 group-hover:text-emerald-700 transition-colors">Cover Letter</div>
                                            <div className="text-sm text-slate-600">Write compelling cover letter</div>
                                        </div>
                                        <ChevronRight className="w-5 h-5 text-slate-400 group-hover:text-emerald-600 transition-colors" />
                                    </button>

                                    <button
                                        onClick={() => router.push('/rateing')}
                                        className="w-full flex items-center gap-4 p-4 text-left hover:bg-gradient-to-r hover:from-purple-50 hover:to-pink-50 rounded-xl transition-all duration-200 group border border-transparent hover:border-purple-200"
                                    >
                                        <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-purple-600 group-hover:from-purple-600 group-hover:to-pink-600 rounded-xl flex items-center justify-center shadow-lg group-hover:shadow-xl transition-all duration-200">
                                            <Star className="w-6 h-6 text-white" />
                                        </div>
                                        <div className="flex-1">
                                            <div className="font-semibold text-slate-900 group-hover:text-purple-700 transition-colors">Get Feedback</div>
                                            <div className="text-sm text-slate-600">AI-powered resume analysis</div>
                                        </div>
                                        <ChevronRight className="w-5 h-5 text-slate-400 group-hover:text-purple-600 transition-colors" />
                                    </button>
                                </div>
                            </motion.div>

                            {/* Account Status */}
                            <motion.div
                                initial={{ opacity: 0, y: 30 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.6 }}
                                className="bg-white rounded-2xl border border-slate-200 shadow-lg overflow-hidden"
                            >
                                {!isPremium ? (
                                    <>
                                        <div className="bg-gradient-to-r from-yellow-50 via-orange-50 to-amber-50 p-6 border-b border-amber-200">
                                            <h3 className="text-lg font-semibold text-slate-900 flex items-center gap-2">
                                                <div className="w-8 h-8 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-lg flex items-center justify-center">
                                                    <Sparkles className="w-4 h-4 text-white" />
                                                </div>
                                                Upgrade to Pro
                                            </h3>
                                            <p className="text-sm text-amber-700 mt-1">Unlock premium features</p>
                                        </div>
                                        <div className="p-6">
                                            <div className="space-y-4 mb-6">
                                                {[
                                                    { text: 'Unlimited downloads', icon: '🚀' },
                                                    { text: 'Premium templates', icon: '✨' },
                                                    { text: 'AI suggestions', icon: '🤖' },
                                                    { text: 'Priority support', icon: '💬' }
                                                ].map((feature, index) => (
                                                    <div key={index} className="flex items-center gap-3 text-sm text-slate-700">
                                                        <span className="text-lg">{feature.icon}</span>
                                                        <span className="font-medium">{feature.text}</span>
                                                    </div>
                                                ))}
                                            </div>
                                            <button
                                                onClick={() => router.push('/pricing')}
                                                className="w-full bg-gradient-to-r from-yellow-400 via-orange-500 to-red-500 text-white py-3 px-4 rounded-xl font-semibold hover:from-yellow-500 hover:via-orange-600 hover:to-red-600 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105"
                                            >
                                                Upgrade Now
                                            </button>
                                        </div>
                                    </>
                                ) : (
                                    <>
                                        <div className="bg-gradient-to-r from-emerald-50 via-blue-50 to-indigo-50 p-6 border-b border-emerald-200">
                                            <h3 className="text-lg font-semibold text-slate-900 flex items-center gap-2">
                                                <div className="w-8 h-8 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-lg flex items-center justify-center">
                                                    <Crown className="w-4 h-4 text-white" />
                                                </div>
                                                Pro Member
                                            </h3>
                                            <p className="text-sm text-emerald-700 mt-1">Premium features unlocked</p>
                                        </div>
                                        <div className="p-6">
                                            {subscriptionStatus?.current_period_end && (
                                                <div className="mb-6 p-4 bg-gradient-to-r from-emerald-50 to-green-50 border border-emerald-200 rounded-xl">
                                                    <div className="flex items-center gap-2 mb-2">
                                                        <div className="w-3 h-3 bg-emerald-500 rounded-full animate-pulse"></div>
                                                        <span className="text-sm font-semibold text-emerald-800">Active Subscription</span>
                                                    </div>
                                                    <div className="text-xs text-emerald-600 font-medium">
                                                        Renews on {formatDate(subscriptionStatus.current_period_end)}
                                                    </div>
                                                </div>
                                            )}
                                            <button
                                                onClick={() => setShowPaymentHistory(!showPaymentHistory)}
                                                className="w-full flex items-center justify-center gap-3 px-4 py-3 bg-gradient-to-r from-slate-50 to-blue-50 hover:from-slate-100 hover:to-blue-100 text-slate-700 rounded-xl transition-all duration-200 font-semibold border border-slate-200 hover:border-blue-300"
                                            >
                                                <CreditCard className="w-5 h-5" />
                                                {showPaymentHistory ? 'Hide Billing' : 'View Billing'}
                                            </button>
                                        </div>
                                    </>
                                )}
                            </motion.div>


                        </div>
                    </div>

                    {/* Payment History Modal */}
                    {isPremium && showPaymentHistory && (
                        <motion.div
                            initial={{ opacity: 0, y: 30 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="mt-8 bg-white rounded-2xl border border-slate-200 shadow-lg overflow-hidden"
                        >
                            <div className="bg-gradient-to-r from-blue-50 via-indigo-50 to-purple-50 p-6 border-b border-slate-200">
                                <h3 className="text-xl font-semibold text-slate-900 flex items-center gap-3">
                                    <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center shadow-lg">
                                        <CreditCard className="w-5 h-5 text-white" />
                                    </div>
                                    Payment History
                                </h3>
                                <p className="text-sm text-slate-600 mt-1">Your billing and subscription details</p>
                            </div>
                            <div className="p-6">
                                <PaymentHistory onRefreshStatus={refreshStatus} />
                            </div>
                        </motion.div>
                    )}
                </div>
            </div>
        </>
    )
}

export default Dashboard