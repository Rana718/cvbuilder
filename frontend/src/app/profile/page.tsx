'use client'

import React, { useState, useEffect } from 'react'
import { useAuth } from '@/components/AuthContext'
import { useAdminAuth } from '@/hooks/useAdminAuth'
import { signOut } from 'firebase/auth'
import { auth } from '@/lib/firebase'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import LinkedInMini from '@/components/LinkedInMini'
import PaymentHistory from '@/components/PaymentHistory'
import {
    User,
    Mail,
    Calendar,
    FileText,
    LogOut,
    ArrowLeft,
    Edit,
    Save,
    X,
    Plus,
    Crown,
    Award,
    BarChart3,
    Clock,
    CreditCard,
    Shield,
    Settings,
    Sparkles,
    Zap
} from 'lucide-react'
import axiosInstance from '@/lib/axios'

// Premium Status Hook
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

            // Fallback to token claims if API fails
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

interface UserProfile {
    id: number
    email: string
    full_name?: string
    created_at: string
    phone?: string
}

interface ProfileStats {
    totalResumes: number
    lastResumeCreated: string | null
}

function ProfilePage() {
    const { user, loading: authLoading } = useAuth()
    const { isAdmin, isSuperAdmin, loading: adminLoading } = useAdminAuth()
    const { isPremium, loading: premiumLoading, subscriptionStatus, refreshStatus } = usePremiumStatus()
    const router = useRouter()
    const [profile, setProfile] = useState<UserProfile | null>(null)
    const [stats, setStats] = useState<ProfileStats>({ totalResumes: 0, lastResumeCreated: null })
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState('')
    const [isEditing, setIsEditing] = useState(false)
    const [showPaymentHistory, setShowPaymentHistory] = useState(false)
    const [editForm, setEditForm] = useState({
        full_name: ''
    })

    useEffect(() => {
        if (authLoading) return

        if (!user) {
            router.push('/sign-in?callbackUrl=' + encodeURIComponent('/profile'))
            return
        }

        fetchProfile()
        fetchStats()
    }, [user, authLoading, router])

    const fetchProfile = async () => {
        try {
            const response = await axiosInstance.get('/api/auth/profile')
            setProfile({
                id: response.data.id,
                email: response.data.email,
                full_name: response.data.full_name,
                phone: response.data.phone,
                created_at: user?.metadata?.creationTime || new Date().toISOString()
            })
            setEditForm({
                full_name: response.data.full_name || ''
            })
        } catch (error: any) {
            console.error('Failed to fetch profile:', error)
            if (error.response?.status === 401) {
                router.push('/sign-in?callbackUrl=' + encodeURIComponent('/profile'))
            } else {
                // Fallback to Firebase user data if API fails
                const mockProfile: UserProfile = {
                    id: 1,
                    email: user?.email || '',
                    full_name: user?.displayName || '',
                    created_at: user?.metadata?.creationTime || new Date().toISOString()
                }
                setProfile(mockProfile)
                setEditForm({
                    full_name: mockProfile.full_name || ''
                })
            }
        }
    }

    const fetchStats = async () => {
        try {
            setLoading(true)
            const response = await axiosInstance.get('/api/resume-op/all')
            const resumes = response.data

            setStats({
                totalResumes: resumes.length,
                lastResumeCreated: resumes.length > 0 ?
                    resumes.sort((a: any, b: any) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())[0].created_at
                    : null
            })
        } catch (error: any) {
            console.error('Failed to fetch stats:', error)
        } finally {
            setLoading(false)
        }
    }

    const handleSaveProfile = async () => {
        try {
            if (profile) {
                setProfile({
                    ...profile,
                    full_name: editForm.full_name
                })
            }
            setIsEditing(false)
        } catch (error: any) {
            console.error('Failed to update profile:', error)
            alert('Failed to update profile. Please try again.')
        }
    }

    const handleCancelEdit = () => {
        if (profile) {
            setEditForm({
                full_name: profile.full_name || ''
            })
        }
        setIsEditing(false)
    }

    const handleSignOut = async () => {
        if (confirm('Are you sure you want to sign out?')) {
            try {
                await signOut(auth)
                router.push('/')
            } catch (error) {
                console.error('Sign out error:', error)
            }
        }
    }

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        })
    }

    if (authLoading || loading || premiumLoading || adminLoading) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-3 border-blue-500 border-t-transparent mx-auto"></div>
                    <p className="mt-4 text-gray-600 font-medium">Loading your profile...</p>
                </div>
            </div>
        )
    }

    if (!profile) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 flex items-center justify-center">
                <div className="text-center">
                    <p className="text-gray-600">Failed to load profile</p>
                </div>
            </div>
        )
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
            {/* Header */}
            <div className="bg-white/80 backdrop-blur-sm border-b border-gray-200/50 sticky top-0 z-10">
                <div className="max-w-6xl mx-auto px-4 py-4">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-4">
                            <Link
                                href="/resusme"
                                className="flex items-center space-x-2 text-gray-600 hover:text-blue-600 transition-colors group"
                            >
                                <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
                                <span className="font-medium">Back</span>
                            </Link>
                            <div className="h-6 w-px bg-gray-300" />
                            <h1 className="text-2xl font-bold bg-gradient-to-r from-gray-900 to-blue-600 bg-clip-text text-transparent">My Profile</h1>
                        </div>
                    </div>
                </div>
            </div>

            {/* Content */}
            <div className="max-w-6xl mx-auto px-4 py-8">
                {error && (
                    <div className="mb-6 bg-red-50/80 backdrop-blur-sm border border-red-200 text-red-700 px-4 py-3 rounded-xl">
                        {error}
                    </div>
                )}

                <div className="grid grid-cols-1 xl:grid-cols-4 gap-8">
                    {/* Main Profile Section */}
                    <div className="xl:col-span-3 space-y-6">
                        {/* Profile Header */}
                        <div className="bg-white/80 backdrop-blur-sm border border-gray-200/50 rounded-2xl p-8 shadow-sm">
                            <div className="flex items-start justify-between mb-8">
                                <h2 className="text-xl font-semibold text-gray-900">Profile Information</h2>
                                {!isEditing ? (
                                    <button
                                        onClick={() => setIsEditing(true)}
                                        className="flex items-center space-x-2 px-6 py-3 text-blue-600 hover:text-white hover:bg-blue-600 transition-all duration-200 font-medium"
                                    >
                                        <Edit className="w-4 h-4" />
                                        <span>Edit Profile</span>
                                    </button>
                                ) : (
                                    <div className="flex items-center space-x-3">
                                        <button
                                            onClick={handleSaveProfile}
                                            className="flex items-center space-x-2 px-6 py-3 bg-blue-600 text-white hover:bg-blue-700 transition-all duration-200 font-medium"
                                        >
                                            <Save className="w-4 h-4" />
                                            <span>Save</span>
                                        </button>
                                        <button
                                            onClick={handleCancelEdit}
                                            className="flex items-center space-x-2 px-6 py-3 text-gray-600 hover:text-gray-800 hover:bg-gray-100 transition-all duration-200 font-medium"
                                        >
                                            <X className="w-4 h-4" />
                                            <span>Cancel</span>
                                        </button>
                                    </div>
                                )}
                            </div>

                            {/* Avatar and Basic Info */}
                            <div className="flex items-start space-x-6 mb-8">
                                <div className="relative">
                                    {user?.photoURL ? (
                                        <img
                                            src={user.photoURL}
                                            alt="Profile"
                                            className="w-24 h-24 object-cover"
                                        />
                                    ) : (
                                        <div className="w-24 h-24 bg-gradient-to-br from-blue-100 to-blue-200 flex items-center justify-center">
                                            <User className="w-12 h-12 text-blue-600" />
                                        </div>
                                    )}
                                    {isPremium && (
                                        <div className="absolute -top-2 -right-2 w-8 h-8 bg-gradient-to-r from-yellow-400 to-yellow-500 flex items-center justify-center">
                                            <Crown className="w-4 h-4 text-white" />
                                        </div>
                                    )}
                                </div>
                                <div className="flex-1">
                                    <div className="flex items-center space-x-3 mb-3">
                                        <h3 className="text-2xl font-bold text-gray-900">
                                            {profile.full_name || 'User'}
                                        </h3>
                                        {isPremium && (
                                            <div className="flex items-center space-x-2 bg-gradient-to-r from-yellow-400 to-yellow-500 text-white px-3 py-1 rounded-full text-sm font-medium shadow-sm">
                                                <Award className="w-4 h-4" />
                                                <span>Premium</span>
                                            </div>
                                        )}
                                    </div>
                                    <p className="text-gray-600 flex items-center mb-2">
                                        <Mail className="w-5 h-5 mr-3 text-blue-500" />
                                        {profile.email}
                                    </p>
                                    <p className="text-gray-500 flex items-center">
                                        <Calendar className="w-5 h-5 mr-3 text-blue-500" />
                                        Member since {formatDate(profile.created_at)}
                                    </p>
                                </div>
                            </div>

                            {/* Form Fields */}
                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-3">
                                        Full Name
                                    </label>
                                    {isEditing ? (
                                        <input
                                            type="text"
                                            value={editForm.full_name}
                                            onChange={(e) => setEditForm({ ...editForm, full_name: e.target.value })}
                                            className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
                                            placeholder="Enter your full name"
                                        />
                                    ) : (
                                        <div className="px-4 py-3 bg-gray-50/50 rounded-xl border border-gray-200">
                                            <p className="text-gray-900 font-medium">{profile.full_name || 'Not provided'}</p>
                                        </div>
                                    )}
                                </div>

                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-3">
                                        Email Address
                                    </label>
                                    <div className="px-4 py-3 bg-gray-50/50 rounded-xl border border-gray-200">
                                        <p className="text-gray-900 font-medium">{profile.email}</p>
                                    </div>
                                </div>
                            </div>

                            {/* LinkedIn Integration Mini */}
                            <div className="mb-8 p-6 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl border border-blue-200">
                                <LinkedInMini />
                            </div>

                            {/* Admin Panel Access */}
                            {(isAdmin || isSuperAdmin) && (
                                <div className="mb-8">
                                    <Link
                                        href="/admin"
                                        className="flex items-center space-x-3 px-6 py-4 text-purple-600 hover:text-white hover:bg-gradient-to-r from-purple-600 to-purple-700 rounded-xl border border-purple-200 hover:border-purple-600 transition-all duration-200 font-medium group"
                                    >
                                        <Shield className="w-5 h-5" />
                                        <span>Admin Panel</span>
                                        {isSuperAdmin && (
                                            <Crown className="w-5 h-5 ml-auto group-hover:rotate-12 transition-transform" />
                                        )}
                                    </Link>
                                </div>
                            )}

                            {/* Sign Out Button */}
                            <div className="pt-8 border-t border-gray-200">
                                <button
                                    onClick={handleSignOut}
                                    className="flex items-center space-x-3 px-6 py-3 text-red-600 hover:text-white hover:bg-red-600 rounded-xl border border-red-200 hover:border-red-600 transition-all duration-200 font-medium"
                                >
                                    <LogOut className="w-5 h-5" />
                                    <span>Sign Out</span>
                                </button>
                            </div>
                        </div>

                        {/* Payment History */}
                        {isPremium && (
                            <div className="bg-white/80 backdrop-blur-sm border border-gray-200/50 rounded-2xl shadow-sm">
                                <div className="p-6 border-b border-gray-200">
                                    <div className="flex items-center justify-between">
                                        <h2 className="text-xl font-semibold text-gray-900 flex items-center">
                                            <CreditCard className="w-6 h-6 mr-3 text-blue-500" />
                                            Billing & Payments
                                        </h2>
                                        <button
                                            onClick={() => setShowPaymentHistory(!showPaymentHistory)}
                                            className="text-blue-600 hover:text-blue-700 font-medium px-4 py-2 rounded-lg hover:bg-blue-50 transition-all duration-200"
                                        >
                                            {showPaymentHistory ? 'Hide' : 'Show'} Details
                                        </button>
                                    </div>
                                </div>
                                {showPaymentHistory && (
                                    <div className="p-6">
                                        <PaymentHistory onRefreshStatus={refreshStatus} />
                                    </div>
                                )}
                            </div>
                        )}
                    </div>

                    {/* Sidebar */}
                    <div className="space-y-6">
                        {/* Account Status */}
                        <div className="bg-white/80 backdrop-blur-sm border border-gray-200/50 rounded-2xl p-6 shadow-sm">
                            <h3 className="text-lg font-semibold text-gray-900 mb-4">Account Status</h3>
                            <div className="space-y-4">
                                {isPremium ? (
                                    <div className="bg-gradient-to-r from-yellow-400 to-yellow-500 text-white p-4 rounded-xl">
                                        <div className="flex items-center space-x-3 mb-2">
                                            <Crown className="w-6 h-6" />
                                            <span className="text-lg font-bold">Premium Member</span>
                                        </div>
                                        {subscriptionStatus?.current_period_end && (
                                            <p className="text-yellow-100 text-sm">
                                                Valid until {formatDate(subscriptionStatus.current_period_end)}
                                            </p>
                                        )}
                                    </div>
                                ) : (
                                    <div className="space-y-4">
                                        <div className="p-4 bg-gradient-to-r from-gray-50 to-blue-50 rounded-xl border border-gray-200">
                                            <div className="flex items-center space-x-3 mb-3">
                                                <User className="w-5 h-5 text-gray-600" />
                                                <span className="text-gray-700 font-medium">Free Account</span>
                                            </div>
                                            <p className="text-sm text-gray-600 mb-4">Unlock premium features to supercharge your resume building experience</p>
                                            <Link
                                                href="/pricing"
                                                className="flex items-center justify-center space-x-2 w-full px-4 py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-xl hover:from-blue-700 hover:to-blue-800 transition-all duration-200 font-semibold shadow-sm hover:shadow-md"
                                            >
                                                <Sparkles className="w-5 h-5" />
                                                <span>Upgrade to Premium</span>
                                            </Link>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Resume Stats */}
                        <div className="bg-white/80 backdrop-blur-sm border border-gray-200/50 rounded-2xl p-6 shadow-sm">
                            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                                <BarChart3 className="w-6 h-6 mr-3 text-blue-500" />
                                Statistics
                            </h3>
                            <div className="space-y-4">
                                <div className="p-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl border border-blue-200">
                                    <div className="text-3xl font-bold text-blue-600 mb-1">{stats.totalResumes}</div>
                                    <div className="text-sm text-blue-700 font-medium">Total Resumes Created</div>
                                </div>
                                {stats.lastResumeCreated && (
                                    <div className="p-4 bg-gradient-to-r from-gray-50 to-slate-50 rounded-xl border border-gray-200">
                                        <div className="flex items-center text-sm text-gray-600 mb-2">
                                            <Clock className="w-4 h-4 mr-2" />
                                            <span className="font-medium">Last Resume</span>
                                        </div>
                                        <div className="text-sm font-semibold text-gray-900">
                                            {formatDate(stats.lastResumeCreated)}
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Quick Actions */}
                        <div className="bg-white/80 backdrop-blur-sm border border-gray-200/50 rounded-2xl p-6 shadow-sm">
                            <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
                            <div className="space-y-3">
                                <Link
                                    href="/template"
                                    className="flex items-center space-x-3 w-full px-4 py-3 text-gray-700 hover:text-blue-600 hover:bg-blue-50 rounded-xl transition-all duration-200 font-medium border border-gray-200 hover:border-blue-300 group"
                                >
                                    <Plus className="w-5 h-5 group-hover:rotate-90 transition-transform" />
                                    <span>Create New Resume</span>
                                </Link>
                                <Link
                                    href="/resusme"
                                    className="flex items-center space-x-3 w-full px-4 py-3 text-gray-700 hover:text-blue-600 hover:bg-blue-50 rounded-xl transition-all duration-200 font-medium border border-gray-200 hover:border-blue-300"
                                >
                                    <FileText className="w-5 h-5" />
                                    <span>My Resumes</span>
                                </Link>
                                {isPremium && (
                                    <button
                                        onClick={() => setShowPaymentHistory(!showPaymentHistory)}
                                        className="flex items-center space-x-3 w-full px-4 py-3 text-gray-700 hover:text-blue-600 hover:bg-blue-50 rounded-xl transition-all duration-200 font-medium border border-gray-200 hover:border-blue-300"
                                    >
                                        <CreditCard className="w-5 h-5" />
                                        <span>Billing & Payments</span>
                                    </button>
                                )}
                                {(isAdmin || isSuperAdmin) && (
                                    <Link
                                        href="/admin"
                                        className="flex items-center space-x-3 w-full px-4 py-3 text-purple-700 hover:text-purple-600 hover:bg-purple-50 rounded-xl transition-all duration-200 font-medium border border-purple-200 hover:border-purple-300 group"
                                    >
                                        <Shield className="w-5 h-5" />
                                        <span>Admin Panel</span>
                                        {isSuperAdmin && (
                                            <Crown className="w-4 h-4 ml-auto group-hover:rotate-12 transition-transform" />
                                        )}
                                    </Link>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default ProfilePage