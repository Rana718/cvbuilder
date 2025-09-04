'use client';

import React, { useState, useEffect } from 'react';
import { X, Check, Crown, Download, Sparkles } from 'lucide-react';
import { useAuth } from '@/components/AuthContext';
import { useRouter } from 'next/navigation';
import axiosInstance from '@/lib/axios';

interface PaymentCardProps {
    isOpen: boolean;
    onClose: () => void;
    onSuccess?: () => void;
    redirectAfterLogin?: boolean;
}

interface PaymentPlan {
    id: string;
    name: string;
    price: number;
    currency: string;
    interval: string;
    features: string[];
}

declare global {
    interface Window {
        Razorpay: any;
    }
}

function PaymentCard({ isOpen, onClose, onSuccess, redirectAfterLogin = false }: PaymentCardProps) {
    const { user, loading } = useAuth();
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(false);
    const [plans, setPlans] = useState<PaymentPlan[]>([]);
    const [selectedPlan, setSelectedPlan] = useState<PaymentPlan | null>(null);

    useEffect(() => {
        if (isOpen && !loading) {
            if (!user && redirectAfterLogin) {
                console.log('User not authenticated, redirecting to login...');
                sessionStorage.setItem('showPaymentAfterLogin', 'true');
                sessionStorage.setItem('returnUrl', window.location.pathname + window.location.search);
                
                router.push(`/sign-in?callbackUrl=${encodeURIComponent(window.location.pathname + window.location.search)}`);
                onClose();
                return;
            }
            
            if (user || !redirectAfterLogin) {
                fetchPaymentPlans();
            }
        }
    }, [isOpen, user, loading, redirectAfterLogin, router, onClose]);

    useEffect(() => {
        if (user && !loading && sessionStorage.getItem('showPaymentAfterLogin') === 'true') {
            console.log('User logged in, showing payment modal...');
            sessionStorage.removeItem('showPaymentAfterLogin');
            sessionStorage.removeItem('returnUrl');
            setTimeout(() => {
                fetchPaymentPlans();
            }, 100);
        }
    }, [user, loading]);

    const fetchPaymentPlans = async () => {
        try {
            const response = await axiosInstance.get('/api/payment/payment-plans');
            setPlans(response.data.plans);
            if (response.data.plans.length > 0) {
                setSelectedPlan(response.data.plans[0]);
            }
        } catch (error) {
            console.error('Error fetching payment plans:', error);
        }
    };

    const handlePaymentClick = () => {
        console.log('Payment click - User:', !!user, 'Loading:', loading);
        if (!user && !loading) {
            console.log('Redirecting to login from payment click...');
            sessionStorage.setItem('showPaymentAfterLogin', 'true');
            sessionStorage.setItem('returnUrl', window.location.pathname + window.location.search);
            router.push(`/sign-in?callbackUrl=${encodeURIComponent(window.location.pathname + window.location.search)}`);
            onClose();
            return;
        }
        
        if (user) {
            createSubscription();
        }
    };

    const createSubscription = async () => {
        if (!user || !selectedPlan) return;

        setIsLoading(true);
        try {
            const response = await axiosInstance.post('/api/payment/create-subscription');
            const subscriptionData = response.data;
            await initiateRazorpayPayment(subscriptionData);
        } catch (error: any) {
            console.error('Error creating subscription:', error);
            const errorMessage = error.response?.data?.detail || error.message || 'Failed to create subscription. Please try again.';
            alert(errorMessage);
        } finally {
            setIsLoading(false);
        }
    };

    const initiateRazorpayPayment = async (subscriptionData: any) => {
        if (!window.Razorpay) {
            const script = document.createElement('script');
            script.src = 'https://checkout.razorpay.com/v1/checkout.js';
            script.async = true;
            document.body.appendChild(script);

            await new Promise((resolve) => {
                script.onload = resolve;
            });
        }

        const options = {
            key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
            subscription_id: subscriptionData.subscription_id,
            name: 'AI CV Builder Premium',
            description: 'Premium Subscription (12 Months)',
            image: '/logo.png',
            handler: async function (response: any) {
                await handlePaymentSuccess(response);
            },
            prefill: {
                name: user?.displayName || '',
                email: user?.email || '',
            },
            notes: {
                user_id: user?.uid,
                plan: selectedPlan?.id
            },
            theme: {
                color: '#3B82F6'
            },
            modal: {
                ondismiss: function () {
                    setIsLoading(false);
                }
            }
        };

        const rzp = new window.Razorpay(options);
        rzp.open();
    };

    const handlePaymentSuccess = async (response: any) => {
        try {
            console.log('Payment successful:', response);
            alert('Payment successful! Your premium subscription is now active.');

            if (onSuccess) {
                onSuccess();
            }

            onClose();
        } catch (error) {
            console.error('Error handling payment success:', error);
            alert('Payment was successful, but there was an error updating your account. Please contact support.');
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4">
            {/* Blurred Background Overlay */}
            <div 
                className="absolute inset-0 bg-gradient-to-br from-blue-600/30 via-purple-600/20 to-indigo-600/30 backdrop-blur-md"
                onClick={onClose}
            />
            
            {/* Modal Content */}
            <div className="relative bg-white/95 backdrop-blur-xl rounded-2xl shadow-2xl border border-white/20 w-full max-w-md max-h-[95vh] overflow-hidden">
                {/* Animated Background Elements */}
                <div className="absolute inset-0 overflow-hidden pointer-events-none">
                    <div className="absolute -top-4 -right-4 w-20 h-20 bg-gradient-to-br from-blue-400/20 to-purple-400/20 rounded-full blur-xl animate-pulse" />
                    <div className="absolute -bottom-4 -left-4 w-16 h-16 bg-gradient-to-br from-purple-400/20 to-indigo-400/20 rounded-full blur-xl animate-pulse delay-1000" />
                    <div className="absolute top-1/2 -right-2 w-12 h-12 bg-gradient-to-br from-indigo-400/20 to-blue-400/20 rounded-full blur-xl animate-pulse delay-500" />
                </div>

                <div className="relative overflow-y-auto max-h-[95vh]">
                    {/* Header */}
                    <div className="flex items-center justify-between p-4 sm:p-6 border-b border-gray-200/50 bg-gradient-to-r from-blue-50/50 to-purple-50/50">
                        <div className="flex items-center space-x-2">
                            <div className="relative">
                                <Crown className="h-6 w-6 text-yellow-500" />
                                <Sparkles className="absolute -top-1 -right-1 h-3 w-3 text-yellow-400 animate-pulse" />
                            </div>
                            <h2 className="text-lg sm:text-xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">
                                Upgrade to Premium
                            </h2>
                        </div>
                        <button
                            onClick={onClose}
                            className="text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full p-1 transition-all duration-200"
                        >
                            <X className="h-5 w-5 sm:h-6 sm:w-6" />
                        </button>
                    </div>

                    {/* Content */}
                    <div className="p-4 sm:p-6">
                        {/* Premium Benefits */}
                        <div className="mb-5 sm:mb-6">
                            <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-3 sm:mb-4 flex items-center space-x-2">
                                <span>Unlock Premium Features</span>
                                <div className="px-2 py-1 bg-gradient-to-r from-blue-500 to-purple-500 text-white text-xs rounded-full">
                                    NEW
                                </div>
                            </h3>
                            <div className="space-y-2.5 sm:space-y-3">
                                {selectedPlan?.features.map((feature, index) => (
                                    <div key={index} className="flex items-center space-x-3 group">
                                        <div className="flex-shrink-0 w-5 h-5 bg-gradient-to-br from-green-400 to-green-500 rounded-full flex items-center justify-center">
                                            <Check className="h-3 w-3 text-white" />
                                        </div>
                                        <span className="text-sm sm:text-base text-gray-700 group-hover:text-gray-900 transition-colors">
                                            {feature}
                                        </span>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Pricing */}
                        {selectedPlan && (
                            <div className="bg-gradient-to-br from-blue-50/80 to-purple-50/80 backdrop-blur-sm rounded-xl p-4 sm:p-5 mb-5 sm:mb-6 border border-blue-200/30">
                                <div className="text-center">
                                    <div className="flex items-baseline justify-center space-x-1">
                                        <span className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                                            ₹{selectedPlan.price}
                                        </span>
                                        <span className="text-sm sm:text-base text-gray-600 font-medium">/month</span>
                                    </div>
                                    <div className="text-xs sm:text-sm text-gray-600 mt-1">
                                        Billed monthly • Cancel anytime
                                    </div>
                                    <div className="flex items-center justify-center space-x-1 text-xs sm:text-sm text-green-600 font-medium mt-2 bg-green-50 rounded-full px-3 py-1 w-fit mx-auto">
                                        <Sparkles className="w-3 h-3" />
                                        <span>12-month subscription plan</span>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* CTA Button */}
                        <button
                            onClick={handlePaymentClick}
                            disabled={loading || isLoading || (!selectedPlan && !!user)}
                            className="w-full bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 hover:from-blue-700 hover:via-purple-700 hover:to-indigo-700 text-white py-3 px-6 rounded-xl font-semibold transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2 shadow-lg hover:shadow-xl transform hover:scale-[1.02] active:scale-[0.98] relative overflow-hidden group"
                        >
                            {/* Button shine effect */}
                            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-1000 ease-in-out" />
                            
                            {loading ? (
                                <>
                                    <div className="animate-spin rounded-full h-4 w-4 sm:h-5 sm:w-5 border-b-2 border-white"></div>
                                    <span className="text-sm sm:text-base">Loading...</span>
                                </>
                            ) : isLoading ? (
                                <>
                                    <div className="animate-spin rounded-full h-4 w-4 sm:h-5 sm:w-5 border-b-2 border-white"></div>
                                    <span className="text-sm sm:text-base">Processing...</span>
                                </>
                            ) : !user ? (
                                <>
                                    <Download className="h-4 w-4 sm:h-5 sm:w-5" />
                                    <span className="text-sm sm:text-base">Login to Subscribe</span>
                                </>
                            ) : (
                                <>
                                    <Crown className="h-4 w-4 sm:h-5 sm:w-5" />
                                    <span className="text-sm sm:text-base">Subscribe Now</span>
                                </>
                            )}
                        </button>

                        {/* Security Note */}
                        <div className="mt-4 text-center space-y-1">
                            <div className="flex items-center justify-center space-x-2 text-xs text-gray-500">
                                <div className="w-3 h-3 bg-green-500 rounded-full flex items-center justify-center">
                                    <div className="w-1 h-1 bg-white rounded-full animate-pulse" />
                                </div>
                                <span>Secure payment powered by Razorpay</span>
                            </div>
                            <p className="text-xs text-gray-500">
                                Your payment information is encrypted and secure
                            </p>
                        </div>

                        {/* Trust Indicators */}
                        <div className="mt-4 flex items-center justify-center space-x-4 text-xs text-gray-400">
                            <div className="flex items-center space-x-1">
                                <div className="w-2 h-2 bg-blue-400 rounded-full" />
                                <span>256-bit SSL</span>
                            </div>
                            <div className="w-px h-3 bg-gray-300" />
                            <div className="flex items-center space-x-1">
                                <div className="w-2 h-2 bg-green-400 rounded-full" />
                                <span>PCI Compliant</span>
                            </div>
                            <div className="w-px h-3 bg-gray-300" />
                            <div className="flex items-center space-x-1">
                                <div className="w-2 h-2 bg-purple-400 rounded-full" />
                                <span>Bank Grade</span>
                            </div>
                        </div>

                        {/* Terms */}
                        <div className="mt-4 text-center">
                            <p className="text-xs text-gray-500 leading-relaxed">
                                By subscribing, you agree to our{' '}
                                <a href="/terms" className="text-blue-600 hover:text-blue-700 hover:underline font-medium transition-colors">
                                    Terms of Service
                                </a>{' '}
                                and{' '}
                                <a href="/privacy" className="text-blue-600 hover:text-blue-700 hover:underline font-medium transition-colors">
                                    Privacy Policy
                                </a>
                            </p>
                        </div>

                        {/* Money Back Guarantee */}
                        <div className="mt-3 text-center">
                            <div className="inline-flex items-center space-x-1 px-3 py-1 bg-green-50 text-green-700 text-xs rounded-full border border-green-200">
                                <Check className="w-3 h-3" />
                                <span>30-day money-back guarantee</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default PaymentCard;