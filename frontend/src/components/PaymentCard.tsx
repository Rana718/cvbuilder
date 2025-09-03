'use client';

import React, { useState, useEffect } from 'react';
import { X, Check, Crown, Download } from 'lucide-react';
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
            // Only check authentication after loading is complete
            if (!user && redirectAfterLogin) {
                console.log('User not authenticated, redirecting to login...');
                // Store payment intent in session storage
                sessionStorage.setItem('showPaymentAfterLogin', 'true');
                sessionStorage.setItem('returnUrl', window.location.pathname + window.location.search);
                
                // Redirect to login
                router.push(`/sign-in?callbackUrl=${encodeURIComponent(window.location.pathname + window.location.search)}`);
                onClose();
                return;
            }
            
            if (user || !redirectAfterLogin) {
                fetchPaymentPlans();
            }
        }
    }, [isOpen, user, loading, redirectAfterLogin, router, onClose]);

    // Check if we should show payment modal after login
    useEffect(() => {
        if (user && !loading && sessionStorage.getItem('showPaymentAfterLogin') === 'true') {
            console.log('User logged in, showing payment modal...');
            sessionStorage.removeItem('showPaymentAfterLogin');
            sessionStorage.removeItem('returnUrl');
            // Small delay to ensure component is properly mounted
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
            // Store payment intent and redirect to login
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
        // Load Razorpay script if not already loaded
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
            image: '/logo.png', // Add your logo here
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
            // Payment successful - the webhook will handle updating the user's premium status
            console.log('Payment successful:', response);

            // Optional: Verify payment on frontend
            // You can call your backend to verify the payment if needed

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
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-xl shadow-2xl max-w-md w-full max-h-[90vh] overflow-y-auto">
                {/* Header */}
                <div className="flex items-center justify-between p-6 border-b">
                    <div className="flex items-center space-x-2">
                        <Crown className="h-6 w-6 text-yellow-500" />
                        <h2 className="text-xl font-bold text-gray-900">Upgrade to Premium</h2>
                    </div>
                    <button
                        onClick={onClose}
                        className="text-gray-400 hover:text-gray-600 transition-colors"
                    >
                        <X className="h-6 w-6" />
                    </button>
                </div>

                {/* Content */}
                <div className="p-6">
                    {/* Premium Benefits */}
                    <div className="mb-6">
                        <h3 className="text-lg font-semibold text-gray-900 mb-4">
                            Unlock Premium Features
                        </h3>
                        <div className="space-y-3">
                            {selectedPlan?.features.map((feature, index) => (
                                <div key={index} className="flex items-center space-x-3">
                                    <Check className="h-5 w-5 text-green-500 flex-shrink-0" />
                                    <span className="text-gray-700">{feature}</span>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Pricing */}
                    {selectedPlan && (
                        <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg p-4 mb-6">
                            <div className="text-center">
                                <div className="text-3xl font-bold text-gray-900">
                                    ₹{selectedPlan.price}
                                    <span className="text-lg text-gray-600 font-normal">/month</span>
                                </div>
                                <div className="text-sm text-gray-600 mt-1">
                                    Billed monthly • Cancel anytime
                                </div>
                                <div className="text-sm text-green-600 font-medium mt-2">
                                    ✨ 12-month subscription plan
                                </div>
                            </div>
                        </div>
                    )}

          {/* CTA Button */}
          <button
            onClick={handlePaymentClick}
            disabled={loading || isLoading || (!selectedPlan && !!user)}
            className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-3 px-6 rounded-lg font-medium hover:from-blue-700 hover:to-purple-700 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
          >
            {loading ? (
              <>
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                <span>Loading...</span>
              </>
            ) : isLoading ? (
              <>
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                <span>Processing...</span>
              </>
            ) : !user ? (
              <>
                <Download className="h-5 w-5" />
                <span>Login to Subscribe</span>
              </>
            ) : (
              <>
                <Download className="h-5 w-5" />
                <span>Subscribe Now</span>
              </>
            )}
          </button>                    {/* Security Note */}
                    <div className="mt-4 text-center">
                        <p className="text-xs text-gray-500">
                            🔒 Secure payment powered by Razorpay
                        </p>
                        <p className="text-xs text-gray-500 mt-1">
                            Your payment information is encrypted and secure
                        </p>
                    </div>

                    {/* Terms */}
                    <div className="mt-4 text-center">
                        <p className="text-xs text-gray-500">
                            By subscribing, you agree to our{' '}
                            <a href="/terms" className="text-blue-600 hover:underline">
                                Terms of Service
                            </a>{' '}
                            and{' '}
                            <a href="/privacy" className="text-blue-600 hover:underline">
                                Privacy Policy
                            </a>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default PaymentCard;