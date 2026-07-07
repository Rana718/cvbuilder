'use client'

import React, { useState, useEffect } from 'react'
import axiosInstance from '@/lib/axios'
import {
    CreditCard,
    Calendar,
    CheckCircle,
    XCircle,
    AlertCircle,
    ChevronLeft,
    ChevronRight,
    RefreshCw,
    Download,
    X as XIcon,
    Clock,
    DollarSign,
    Building2,
    Trash2
} from 'lucide-react'
import { showAlert } from './ui/alert-utils'

interface PaymentHistoryItem {
    id: number
    razorpay_payment_id: string
    amount: number
    currency: string
    status: string
    method: string
    description: string
    payment_date: string | null
    created_at: string
    card_last4?: string
    card_network?: string
    bank?: string
}

interface PaymentHistoryResponse {
    payments: PaymentHistoryItem[]
    pagination: {
        page: number
        limit: number
        total: number
        pages: number
    }
}

interface SubscriptionDetails {
    has_subscription: boolean
    is_premium: boolean
    status: string
    plan?: string
    current_period_end?: string
    created_at?: string
    razorpay_customer_id?: string
    subscription_id?: string
    recent_payments?: PaymentHistoryItem[]
    razorpay_status?: string
    next_charge_at?: number
    charge_at?: number
    total_count?: number
    paid_count?: number
    remaining_count?: number
}

interface PaymentHistoryProps {
    onRefreshStatus?: () => void
}

const PaymentHistory: React.FC<PaymentHistoryProps> = ({ onRefreshStatus }) => {
    const [paymentHistory, setPaymentHistory] = useState<PaymentHistoryItem[]>([])
    const [subscriptionDetails, setSubscriptionDetails] = useState<SubscriptionDetails | null>(null)
    const [loading, setLoading] = useState(true)
    const [currentPage, setCurrentPage] = useState(1)
    const [totalPages, setTotalPages] = useState(1)
    const [showCancelModal, setShowCancelModal] = useState(false)
    const [cancelling, setCancelling] = useState(false)

    const fetchPaymentHistory = async (page: number = 1) => {
        try {
            setLoading(true)
            const response = await axiosInstance.get<PaymentHistoryResponse>(
                `/api/payment/payment-history?page=${page}&limit=10`
            )
            setPaymentHistory(response.data.payments)
            setCurrentPage(response.data.pagination.page)
            setTotalPages(response.data.pagination.pages)
        } catch (error) {
            console.error('Failed to fetch payment history:', error)
        } finally {
            setLoading(false)
        }
    }

    const fetchSubscriptionDetails = async () => {
        try {
            const response = await axiosInstance.get<SubscriptionDetails>('/api/payment/subscription-details')
            setSubscriptionDetails(response.data)
        } catch (error) {
            console.error('Failed to fetch subscription details:', error)
        }
    }

    const handleCancelSubscription = async () => {
        if (!subscriptionDetails?.has_subscription) return

        try {
            setCancelling(true)
            const response = await axiosInstance.post('/api/payment/cancel-subscription')

            // Refresh data
            await Promise.all([
                fetchSubscriptionDetails(),
                fetchPaymentHistory(currentPage)
            ])

            if (onRefreshStatus) {
                onRefreshStatus()
            }

            setShowCancelModal(false)
            showAlert('Subscription cancelled successfully. You will retain premium access until your current billing period ends.')
        } catch (error: any) {
            console.error('Failed to cancel subscription:', error)
            showAlert(error.response?.data?.detail || 'Failed to cancel subscription')
        } finally {
            setCancelling(false)
        }
    }

    const handleReactivateSubscription = async () => {
        try {
            const response = await axiosInstance.post('/api/payment/reactivate-subscription')

            // Refresh data
            await Promise.all([
                fetchSubscriptionDetails(),
                fetchPaymentHistory(currentPage)
            ])

            if (onRefreshStatus) {
                onRefreshStatus()
            }

            showAlert('Subscription reactivated successfully!')
        } catch (error: any) {
            console.error('Failed to reactivate subscription:', error)
            showAlert(error.response?.data?.detail || 'Failed to reactivate subscription')
        }
    }

    useEffect(() => {
        fetchPaymentHistory()
        fetchSubscriptionDetails()
    }, [])

    const getStatusIcon = (status: string) => {
        switch (status.toLowerCase()) {
            case 'captured':
            case 'paid':
            case 'active':
                return <CheckCircle className="w-4 h-4 text-green-500" />
            case 'failed':
            case 'cancelled':
                return <XCircle className="w-4 h-4 text-red-500" />
            case 'pending':
            case 'created':
                return <Clock className="w-4 h-4 text-yellow-500" />
            default:
                return <AlertCircle className="w-4 h-4 text-gray-500" />
        }
    }

    const getStatusColor = (status: string) => {
        switch (status.toLowerCase()) {
            case 'captured':
            case 'paid':
            case 'active':
                return 'text-green-600 bg-green-50 border-green-200'
            case 'failed':
            case 'cancelled':
                return 'text-red-600 bg-red-50 border-red-200'
            case 'pending':
            case 'created':
                return 'text-yellow-600 bg-yellow-50 border-yellow-200'
            default:
                return 'text-gray-600 bg-gray-50 border-gray-200'
        }
    }

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        })
    }

    const formatAmount = (amount: number, currency: string = 'INR') => {
        return new Intl.NumberFormat('en-IN', {
            style: 'currency',
            currency: currency
        }).format(amount)
    }

    const getPaymentMethodDisplay = (payment: PaymentHistoryItem) => {
        if (payment.card_last4 && payment.card_network) {
            return `${payment.card_network} **** ${payment.card_last4}`
        }
        if (payment.bank) {
            return `${payment.method} - ${payment.bank}`
        }
        return payment.method || 'Unknown'
    }

    return (
        <div className="space-y-6">
            {/* Subscription Details Card */}
            {subscriptionDetails?.has_subscription && (
                <div className="bg-white border border-gray-200 rounded-lg p-6">
                    <div className="flex items-center justify-between mb-4">
                        <h3 className="text-lg font-semibold text-gray-900">Subscription Details</h3>
                        <button
                            onClick={() => {
                                fetchSubscriptionDetails()
                                fetchPaymentHistory(currentPage)
                            }}
                            className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg"
                        >
                            <RefreshCw className="w-4 h-4" />
                        </button>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                        <div className="space-y-3">
                            <div className="flex items-center space-x-2">
                                <span className="text-sm font-medium text-gray-600">Plan:</span>
                                <span className="text-sm text-gray-900 capitalize">{subscriptionDetails.plan}</span>
                            </div>
                            <div className="flex items-center space-x-2">
                                <span className="text-sm font-medium text-gray-600">Status:</span>
                                <div className={`flex items-center space-x-1 px-2 py-1 rounded text-xs font-medium border ${getStatusColor(subscriptionDetails.status)}`}>
                                    {getStatusIcon(subscriptionDetails.status)}
                                    <span className="capitalize">{subscriptionDetails.status}</span>
                                </div>
                            </div>
                            {subscriptionDetails.current_period_end && (
                                <div className="flex items-center space-x-2">
                                    <span className="text-sm font-medium text-gray-600">
                                        {subscriptionDetails.status === 'cancelled' ? 'Premium Until:' : 'Next Billing:'}
                                    </span>
                                    <span className="text-sm text-gray-900">
                                        {formatDate(subscriptionDetails.current_period_end)}
                                    </span>
                                </div>
                            )}
                        </div>

                        <div className="space-y-3">
                            {subscriptionDetails.paid_count !== undefined && (
                                <div className="flex items-center space-x-2">
                                    <span className="text-sm font-medium text-gray-600">Payments Made:</span>
                                    <span className="text-sm text-gray-900">
                                        {subscriptionDetails.paid_count} / {subscriptionDetails.total_count}
                                    </span>
                                </div>
                            )}
                            {subscriptionDetails.created_at && (
                                <div className="flex items-center space-x-2">
                                    <span className="text-sm font-medium text-gray-600">Started:</span>
                                    <span className="text-sm text-gray-900">
                                        {formatDate(subscriptionDetails.created_at)}
                                    </span>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex space-x-3">
                        {subscriptionDetails.status === 'active' && (
                            <button
                                onClick={() => setShowCancelModal(true)}
                                className="flex items-center space-x-2 px-4 py-2 text-red-600 hover:text-red-700 hover:bg-red-50 rounded-lg border border-red-200 hover:border-red-300 transition-colors"
                            >
                                <Trash2 className="w-4 h-4" />
                                <span>Cancel Subscription</span>
                            </button>
                        )}

                        {subscriptionDetails.status === 'cancelled' && subscriptionDetails.current_period_end &&
                            new Date(subscriptionDetails.current_period_end) > new Date() && (
                                <button
                                    onClick={handleReactivateSubscription}
                                    className="flex items-center space-x-2 px-4 py-2 text-green-600 hover:text-green-700 hover:bg-green-50 rounded-lg border border-green-200 hover:border-green-300 transition-colors"
                                >
                                    <RefreshCw className="w-4 h-4" />
                                    <span>Reactivate Subscription</span>
                                </button>
                            )}
                    </div>
                </div>
            )}

            {/* Payment History Card */}
            <div className="bg-white border border-gray-200 rounded-lg p-6">
                <div className="flex items-center justify-between mb-6">
                    <h3 className="text-lg font-semibold text-gray-900">Payment History</h3>
                    <button
                        onClick={() => fetchPaymentHistory(currentPage)}
                        className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg"
                    >
                        <RefreshCw className="w-4 h-4" />
                    </button>
                </div>

                {loading ? (
                    <div className="flex items-center justify-center py-12">
                        <div className="animate-spin rounded-full h-8 w-8 border-2 border-blue-500 border-t-transparent"></div>
                    </div>
                ) : paymentHistory.length === 0 ? (
                    <div className="text-center py-12">
                        <CreditCard className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                        <p className="text-gray-600 font-medium">No payment history found</p>
                        <p className="text-gray-500 text-sm">Your payment transactions will appear here</p>
                    </div>
                ) : (
                    <>
                        {/* Payment History List */}
                        <div className="space-y-4">
                            {paymentHistory.map((payment) => (
                                <div
                                    key={payment.id}
                                    className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50 transition-colors"
                                >
                                    <div className="flex items-center justify-between mb-3">
                                        <div className="flex items-center space-x-3">
                                            <CreditCard className="w-5 h-5 text-gray-400" />
                                            <div>
                                                <p className="font-medium text-gray-900">
                                                    {formatAmount(payment.amount, payment.currency)}
                                                </p>
                                                <p className="text-sm text-gray-600">{payment.description}</p>
                                            </div>
                                        </div>
                                        <div className={`flex items-center space-x-1 px-2 py-1 rounded text-xs font-medium border ${getStatusColor(payment.status)}`}>
                                            {getStatusIcon(payment.status)}
                                            <span className="capitalize">{payment.status}</span>
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                                        <div className="flex items-center space-x-2">
                                            <Calendar className="w-4 h-4 text-gray-400" />
                                            <span className="text-gray-600">
                                                {payment.payment_date ? formatDate(payment.payment_date) : formatDate(payment.created_at)}
                                            </span>
                                        </div>

                                        <div className="flex items-center space-x-2">
                                            <DollarSign className="w-4 h-4 text-gray-400" />
                                            <span className="text-gray-600 capitalize">
                                                {getPaymentMethodDisplay(payment)}
                                            </span>
                                        </div>

                                        <div className="flex items-center space-x-2">
                                            <Building2 className="w-4 h-4 text-gray-400" />
                                            <span className="text-gray-600 text-xs font-mono">
                                                {payment.razorpay_payment_id}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* Pagination */}
                        {totalPages > 1 && (
                            <div className="flex items-center justify-between mt-6 pt-6 border-t border-gray-200">
                                <div className="text-sm text-gray-600">
                                    Page {currentPage} of {totalPages}
                                </div>
                                <div className="flex space-x-2">
                                    <button
                                        onClick={() => fetchPaymentHistory(currentPage - 1)}
                                        disabled={currentPage === 1}
                                        className={`flex items-center space-x-1 px-3 py-2 rounded-lg border transition-colors ${currentPage === 1
                                                ? 'text-gray-400 border-gray-200 cursor-not-allowed'
                                                : 'text-gray-600 border-gray-300 hover:bg-gray-50'
                                            }`}
                                    >
                                        <ChevronLeft className="w-4 h-4" />
                                        <span>Previous</span>
                                    </button>
                                    <button
                                        onClick={() => fetchPaymentHistory(currentPage + 1)}
                                        disabled={currentPage === totalPages}
                                        className={`flex items-center space-x-1 px-3 py-2 rounded-lg border transition-colors ${currentPage === totalPages
                                                ? 'text-gray-400 border-gray-200 cursor-not-allowed'
                                                : 'text-gray-600 border-gray-300 hover:bg-gray-50'
                                            }`}
                                    >
                                        <span>Next</span>
                                        <ChevronRight className="w-4 h-4" />
                                    </button>
                                </div>
                            </div>
                        )}
                    </>
                )}
            </div>

            {/* Cancel Subscription Modal */}
            {showCancelModal && (
                <div className="fixed inset-0 bg-white/20 backdrop-blur-sm flex items-center justify-center z-50">
                    <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4 shadow-lg border border-gray-200">
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="text-lg font-semibold text-gray-900">Cancel Subscription</h3>
                            <button
                                onClick={() => setShowCancelModal(false)}
                                className="text-gray-400 hover:text-gray-600"
                            >
                                <XIcon className="w-5 h-5" />
                            </button>
                        </div>

                        <div className="mb-6">
                            <p className="text-gray-600 mb-3">
                                Are you sure you want to cancel your subscription?
                            </p>
                            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
                                <p className="text-yellow-800 text-sm">
                                    <strong>Note:</strong> You will retain premium access until your current billing period ends
                                    {subscriptionDetails?.current_period_end && (
                                        <span> on {formatDate(subscriptionDetails.current_period_end)}</span>
                                    )}.
                                </p>
                            </div>
                        </div>

                        <div className="flex space-x-3">
                            <button
                                onClick={() => setShowCancelModal(false)}
                                className="flex-1 px-4 py-2 text-gray-600 hover:text-gray-700 hover:bg-gray-50 rounded-lg border border-gray-300"
                            >
                                Keep Subscription
                            </button>
                            <button
                                onClick={handleCancelSubscription}
                                disabled={cancelling}
                                className="flex-1 px-4 py-2 bg-red-600 text-white hover:bg-red-700 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {cancelling ? 'Cancelling...' : 'Cancel Subscription'}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}

export default PaymentHistory
