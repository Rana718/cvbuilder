'use client'

import React, { useState, useEffect, memo, useMemo, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { FileText, Mail, Plus, Crown, User, CreditCard, Sparkles, Trash2, Edit, Star, Target, ChevronRight, Loader2 } from 'lucide-react'
import { useAuth } from '@/components/AuthContext'
import axiosInstance from '@/lib/axios'
import Navbar from '@/components/Navbar'
import PaymentHistory from '@/components/PaymentHistory'
import { showAlert } from '@/components/ui/alert-utils'

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
    download_limit?: number | null;
    downloads_used?: number;
}

const usePremiumStatus = () => {
    const { user } = useAuth();
    const [isPremium, setIsPremium] = useState(false);
    const [loading, setLoading] = useState(true);
    const [subscriptionStatus, setSubscriptionStatus] = useState<SubscriptionStatus>();

    const checkPremiumStatus = useCallback(async () => {
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
        } catch (error) {
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
    }, [user]);

    const refreshStatus = useCallback(async () => {
        setLoading(true);
        await checkPremiumStatus();
    }, [checkPremiumStatus]);

    useEffect(() => {
        checkPremiumStatus();
    }, [checkPremiumStatus]);

    return { isPremium, loading, subscriptionStatus, refreshStatus };
};

const LoadingSpinner = memo(() => (
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
));

const StatCard = memo(({ stat, index }: { stat: any; index: number }) => (
    <motion.div
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
));

const ResumeCard = memo(({ resume, index, onEdit, onDelete, isDeletingId }: {
    resume: Resume;
    index: number;
    onEdit: (id: number) => void;
    onDelete: (id: number, event: React.MouseEvent) => void;
    isDeletingId: number | null;
}) => {
    const formatDate = useCallback((dateString: string) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric'
        });
    }, []);

    return (
        <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4 + index * 0.1 }}
            onClick={() => onEdit(resume.id)}
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
                <button
                    onClick={(e) => { e.stopPropagation(); onEdit(resume.id); }}
                    className="p-2 hover:bg-blue-100 rounded-lg transition-colors">
                    <Edit className="w-4 h-4 text-blue-600" />
                </button>
                <button
                    onClick={(e) => onDelete(resume.id, e)}
                    disabled={isDeletingId === resume.id}
                    className="p-2 hover:bg-red-100 rounded-lg transition-colors disabled:opacity-50">
                    {isDeletingId === resume.id ? (
                        <Loader2 className="w-4 h-4 text-red-600 animate-spin" />
                    ) : (
                        <Trash2 className="w-4 h-4 text-red-600" />
                    )}
                </button>
            </div>
        </motion.div>
    );
});

const QuickActionButton = memo(({ action, router }: { action: any; router: any }) => (
    <button
        onClick={() => router.push(action.path)}
        className={`w-full flex items-center gap-4 p-4 text-left hover:bg-gradient-to-r hover:${action.hoverBg} rounded-xl transition-all duration-200 group border border-transparent hover:${action.hoverBorder}`}
    >
        <div className={`w-12 h-12 bg-gradient-to-br ${action.bgGradient} group-hover:${action.hoverGradient} rounded-xl flex items-center justify-center shadow-lg group-hover:shadow-xl transition-all duration-200`}>
            <action.icon className="w-6 h-6 text-white" />
        </div>
        <div className="flex-1">
            <div className={`font-semibold text-slate-900 group-hover:${action.textColor} transition-colors`}>{action.title}</div>
            <div className="text-sm text-slate-600">{action.subtitle}</div>
        </div>
        <ChevronRight className={`w-5 h-5 text-slate-400 group-hover:${action.textColor} transition-colors`} />
    </button>
));

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
    const [deletingResumeId, setDeletingResumeId] = useState<number | null>(null)

    const fetchDashboardData = useCallback(async () => {
        try {
            setLoading(true)
            const response = await axiosInstance.get('/api/dashboard/data')
            const data = response.data

            if (data.error) {
                console.error('Dashboard API error:', data.error)
                setStats({ totalResumes: 0, totalCoverLetters: 0, completionRate: 0, isPremium })
                setResumes([])
            } else {
                setStats({
                    totalResumes: data.totalResumes || 0,
                    totalCoverLetters: data.totalCoverLetters || 0,
                    completionRate: data.completionRate || 0,
                    isPremium
                })
                setResumes(data.resumes || [])
            }
        } catch (error) {
            console.error('Failed to fetch dashboard data:', error)
            setStats({ totalResumes: 0, totalCoverLetters: 0, completionRate: 0, isPremium })
            setResumes([])
        } finally {
            setLoading(false)
        }
    }, [isPremium])

    const handleDeleteResume = useCallback(async (resumeId: number, event: React.MouseEvent) => {
        event.stopPropagation()

        if (deletingResumeId) return

        const confirmDelete = window.confirm('Are you sure you want to delete this resume? This action cannot be undone.')
        if (!confirmDelete) return

        try {
            setDeletingResumeId(resumeId)
            await axiosInstance.delete(`/api/resume-op/${resumeId}`)
            setResumes(prev => prev.filter(resume => resume.id !== resumeId))
            setStats(prev => ({ ...prev, totalResumes: Math.max(0, prev.totalResumes - 1) }))
        } catch (error) {
            console.error('Failed to delete resume:', error)
            showAlert('Failed to delete resume. Please try again.', 'error')
        } finally {
            setDeletingResumeId(null)
        }
    }, [deletingResumeId])

    const handleEditResume = useCallback((resumeId: number) => {
        router.push(`/template/${resumeId}`)
    }, [router])

    useEffect(() => {
        if (authLoading || premiumLoading) return
        if (!user) {
            router.push('/sign-in?callbackUrl=' + encodeURIComponent('/dashboard'))
            return
        }
        fetchDashboardData()
    }, [user, authLoading, premiumLoading, router, fetchDashboardData])

    const getGreeting = useMemo(() => {
        const hour = new Date().getHours()
        if (hour < 12) return 'Good morning'
        if (hour < 18) return 'Good afternoon'
        return 'Good evening'
    }, [])

    const formatDate = useCallback((dateString: string) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric'
        })
    }, [])

    const statsData = useMemo(() => [
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
    ], [stats])

    const quickActions = useMemo(() => [
        {
            title: 'New Resume',
            subtitle: 'Create from professional template',
            icon: FileText,
            path: '/template',
            bgGradient: 'from-blue-500 to-blue-600',
            hoverGradient: 'from-blue-600 to-indigo-600',
            hoverBg: 'from-blue-50 to-indigo-50',
            hoverBorder: 'border-blue-200',
            textColor: 'text-blue-700'
        },
        {
            title: 'Cover Letter',
            subtitle: 'Write compelling cover letter',
            icon: Mail,
            path: '/cover-letter',
            bgGradient: 'from-emerald-500 to-emerald-600',
            hoverGradient: 'from-emerald-600 to-green-600',
            hoverBg: 'from-emerald-50 to-green-50',
            hoverBorder: 'border-emerald-200',
            textColor: 'text-emerald-700'
        },
        {
            title: 'Get Feedback',
            subtitle: 'AI-powered resume analysis',
            icon: Star,
            path: '/resusme/rateing',
            bgGradient: 'from-purple-500 to-purple-600',
            hoverGradient: 'from-purple-600 to-pink-600',
            hoverBg: 'from-purple-50 to-pink-50',
            hoverBorder: 'border-purple-200',
            textColor: 'text-purple-700'
        }
    ], [])

    const premiumFeatures = useMemo(() => [
        { text: 'Unlimited downloads', icon: '🚀' },
        { text: 'Premium templates', icon: '✨' },
        { text: 'AI suggestions', icon: '🤖' },
        { text: 'Priority support', icon: '💬' }
    ], [])

    if (authLoading || loading || premiumLoading) {
        return (
            <>
                <Navbar />
                <LoadingSpinner />
            </>
        )
    }

    return (
        <>
            <Navbar />
            <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-100/50">
                <div className="absolute inset-0 overflow-hidden pointer-events-none">
                    <div className="absolute top-20 left-10 w-96 h-96 bg-gradient-to-r from-blue-400/20 to-indigo-500/20 rounded-full mix-blend-multiply filter blur-3xl animate-pulse"></div>
                    <div className="absolute top-40 right-10 w-80 h-80 bg-gradient-to-r from-purple-400/20 to-pink-500/20 rounded-full mix-blend-multiply filter blur-3xl animate-pulse delay-1000"></div>
                    <div className="absolute bottom-20 left-1/2 w-72 h-72 bg-gradient-to-r from-emerald-400/20 to-teal-500/20 rounded-full mix-blend-multiply filter blur-3xl animate-pulse delay-2000"></div>
                </div>

                <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px] pointer-events-none"></div>

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
                                <motion.div
                                    initial={{ y: 20, opacity: 0, scale: 0.9 }}
                                    animate={{ y: 0, opacity: 1, scale: 1 }}
                                    transition={{ duration: 0.6, delay: 0.2 }}
                                    className="flex items-center mb-4"
                                >
                                    <div className="relative">
                                        <div className="absolute inset-0 bg-gradient-to-r from-white/20 to-white/10 blur-xl rounded-full"></div>
                                        <div className="relative inline-flex items-center bg-white/20 backdrop-blur-sm border border-white/30 shadow-lg text-white px-4 py-2 rounded-full text-sm font-medium">
                                            <div className="w-2 h-2 bg-green-400 rounded-full mr-3 animate-pulse"></div>
                                            <Sparkles className="h-4 w-4 mr-2" />
                                            <span className="font-semibold">Dashboard</span>
                                        </div>
                                    </div>
                                </motion.div>
                                <motion.h1
                                    initial={{ y: 30, opacity: 0 }}
                                    animate={{ y: 0, opacity: 1 }}
                                    transition={{ duration: 0.8, delay: 0.3 }}
                                    className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-4 text-white"
                                >
                                    {getGreeting}, {user?.displayName?.split(' ')[0] || 'User'}!
                                </motion.h1>
                                <motion.p
                                    initial={{ y: 30, opacity: 0 }}
                                    animate={{ y: 0, opacity: 1 }}
                                    transition={{ duration: 0.8, delay: 0.5 }}
                                    className="text-xl text-white/90 font-light"
                                >
                                    Welcome back to your professional workspace
                                </motion.p>
                            </div>
                            <motion.button
                                initial={{ y: 30, opacity: 0 }}
                                animate={{ y: 0, opacity: 1 }}
                                transition={{ duration: 0.8, delay: 0.7 }}
                                onClick={() => router.push('/profile')}
                                className="inline-flex items-center gap-2 px-6 py-3 text-sm font-medium text-blue-600 bg-white/90 hover:bg-white backdrop-blur-sm rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 transform hover:scale-105"
                            >
                                <User className="w-4 h-4" />
                                View Profile
                            </motion.button>
                        </div>
                    </div>
                </div>

                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
                        {statsData.map((stat, index) => (
                            <StatCard key={stat.label} stat={stat} index={index} />
                        ))}
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
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
                                                <ResumeCard
                                                    key={resume.id}
                                                    resume={resume}
                                                    index={index}
                                                    onEdit={handleEditResume}
                                                    onDelete={handleDeleteResume}
                                                    isDeletingId={deletingResumeId}
                                                />
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

                        <div className="space-y-8">
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
                                    {quickActions.map((action) => (
                                        <QuickActionButton key={action.title} action={action} router={router} />
                                    ))}
                                </div>
                            </motion.div>

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
                                                {premiumFeatures.map((feature, index) => (
                                                    <div key={index} className="flex items-center gap-3 text-sm text-slate-700">
                                                        <span className="text-lg">{feature.icon}</span>
                                                        <span className="font-medium">{feature.text}</span>
                                                    </div>
                                                ))}
                                            </div>
                                            <button
                                                onClick={() => router.push('/payment?returnUrl=' + encodeURIComponent('/dashboard'))}
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
                                                    <div className="flex items-center gap-4 text-xs text-emerald-600 font-medium">
                                                        <div className="flex items-center gap-1">
                                                            <span>📅</span>
                                                            <span>
                                                                {Math.max(0, Math.ceil((new Date(subscriptionStatus.current_period_end).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24)))} days left
                                                            </span>
                                                        </div>
                                                        {subscriptionStatus.download_limit ? (
                                                            <div className="flex items-center gap-1">
                                                                <span>⬇️</span>
                                                                <span>
                                                                    {Math.max(0, subscriptionStatus.download_limit - (subscriptionStatus.downloads_used || 0))} downloads left
                                                                </span>
                                                            </div>
                                                        ) : (
                                                            <div className="flex items-center gap-1">
                                                                <span>⬇️</span>
                                                                <span>Unlimited downloads</span>
                                                            </div>
                                                        )}
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