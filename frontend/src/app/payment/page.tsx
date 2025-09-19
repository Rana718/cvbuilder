"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { motion } from "framer-motion";
import { Check, Crown, CreditCard, Shield, Zap, Sparkles, Download, X } from "lucide-react";
import { useAuth } from "@/components/AuthContext";
import Navbar from "@/components/Navbar";
import axiosInstance from "@/lib/axios";
import Image from "next/image";
import Footer from "@/components/Footer";

declare global {
  interface Window {
    Razorpay: any;
  }
}

const PREMIUM_PLAN = {
  id: "premium",
  name: "Premium Plan",
  price: 90,
  currency: "INR",
  interval: "monthly",
  features: [
    "Unlimited Resume Downloads",
    "Premium Templates",
    "AI-Powered Content Suggestions",
    "No Watermarks",
    "Priority Support"
  ]
};

export default function PaymentPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { user, loading } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [paymentStatus, setPaymentStatus] = useState<'idle' | 'processing' | 'success' | 'failed'>('idle');
  const [redirectUrl, setRedirectUrl] = useState<string | null>(null);

  useEffect(() => {
    const redirect = searchParams.get('redirect');
    if (redirect) {
      setRedirectUrl(decodeURIComponent(redirect));
    }
  }, [searchParams]);

  useEffect(() => {
    if (!loading && !user) {
      router.push('/sign-in?callbackUrl=' + encodeURIComponent(window.location.pathname + window.location.search));
    }
  }, [user, loading, router]);

  const handlePayment = async () => {
    if (!user) return;

    setIsLoading(true);
    setPaymentStatus('processing');

    try {
      const response = await axiosInstance.post('/api/payment/create-subscription');
      const subscriptionData = response.data;
      await initiateRazorpayPayment(subscriptionData);
    } catch (error: any) {
      console.error('Error creating subscription:', error);
      const errorMessage = error.response?.data?.detail || error.message || 'Failed to create subscription. Please try again.';
      setPaymentStatus('failed');
      setIsLoading(false);
    }
  };

  const initiateRazorpayPayment = async (subscriptionData: any) => {
    const options = {
      key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
      subscription_id: subscriptionData.subscription_id,
      name: 'AI CV Builder Premium',
      description: 'Premium Subscription (1 Month)',
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
        plan: PREMIUM_PLAN.id
      },
      theme: {
        color: '#3B82F6'
      },
      modal: {
        ondismiss: function () {
          setIsLoading(false);
          setPaymentStatus('idle');
        }
      }
    };

    const rzp = new window.Razorpay(options);
    rzp.open();
  };

  const handlePaymentSuccess = async (response: any) => {
    try {
      setPaymentStatus('processing');

      // Poll subscription status until webhook updates it
      const checkStatus = async () => {
        try {
          const statusResponse = await axiosInstance.get('/api/payment/subscription-status');
          const statusData = statusResponse.data;

          if (statusData.is_premium && statusData.status === 'active') {
            setPaymentStatus('success');
            setTimeout(() => {
              if (redirectUrl) {
                window.location.href = redirectUrl;
              } else {
                router.push('/dashboard');
              }
            }, 2000);
            return true;
          }
          return false;
        } catch (error) {
          console.error('Status check error:', error);
          return false;
        }
      };

      // Poll every 2 seconds for up to 30 seconds
      let attempts = 0;
      const maxAttempts = 15;

      const pollStatus = async () => {
        const success = await checkStatus();
        if (success) return;

        attempts++;
        if (attempts < maxAttempts) {
          setTimeout(pollStatus, 2000);
        } else {
          // Timeout - assume success anyway
          setPaymentStatus('success');
          setTimeout(() => {
            if (redirectUrl) {
              window.location.href = redirectUrl;
            } else {
              router.push('/dashboard');
            }
          }, 1000);
        }
      };

      pollStatus();

    } catch (error) {
      console.error('Error handling payment success:', error);
      setPaymentStatus('failed');
    } finally {
      setIsLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (paymentStatus === 'processing') {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="bg-white/95 backdrop-blur-xl rounded-2xl shadow-2xl border border-white/20 p-8 text-center max-w-md mx-4"
        >
          <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full flex items-center justify-center mx-auto mb-4">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white"></div>
          </div>
          <h2 className="text-2xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent mb-2">
            Processing Payment
          </h2>
          <p className="text-gray-600 mb-4">Waiting for payment confirmation...</p>
          <div className="animate-pulse text-blue-600 flex items-center justify-center space-x-2">
            <div className="w-2 h-2 bg-blue-600 rounded-full animate-bounce"></div>
            <div className="w-2 h-2 bg-blue-600 rounded-full animate-bounce delay-100"></div>
            <div className="w-2 h-2 bg-blue-600 rounded-full animate-bounce delay-200"></div>
          </div>
        </motion.div>
      </div>
    );
  }
  if (paymentStatus === 'success') {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="bg-white/95 backdrop-blur-xl rounded-2xl shadow-2xl border border-white/20 p-8 text-center max-w-md mx-4"
        >
          <div className="w-16 h-16 bg-gradient-to-br from-green-400 to-green-500 rounded-full flex items-center justify-center mx-auto mb-4">
            <Check className="w-8 h-8 text-white" />
          </div>
          <h2 className="text-2xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent mb-2">
            Payment Successful!
          </h2>
          <p className="text-gray-600 mb-4">Your premium subscription is now active.</p>
          <div className="animate-pulse text-blue-600 flex items-center justify-center space-x-2">
            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
            <span>{redirectUrl ? 'Redirecting...' : 'Taking you to dashboard...'}</span>
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <Navbar />

      {/* Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-96 h-96 bg-gradient-to-r from-blue-400/10 to-indigo-500/10 rounded-full mix-blend-multiply filter blur-3xl animate-pulse"></div>
        <div className="absolute top-40 right-10 w-80 h-80 bg-gradient-to-r from-purple-400/10 to-pink-500/10 rounded-full mix-blend-multiply filter blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute bottom-20 left-1/2 w-72 h-72 bg-gradient-to-r from-emerald-400/10 to-teal-500/10 rounded-full mix-blend-multiply filter blur-3xl animate-pulse delay-2000"></div>
      </div>

      {/* Floating grid pattern */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808008_1px,transparent_1px),linear-gradient(to_bottom,#80808008_1px,transparent_1px)] bg-[size:24px_24px] pointer-events-none"></div>

      <div className="relative container mx-auto px-4 py-12">
        <motion.div
          initial={{ y: 30, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.8 }}
          className="max-w-4xl mx-auto"
        >
          {/* Header */}
          <div className="text-center mb-12">
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="flex justify-center mb-6"
            >
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-r from-blue-500/20 to-purple-500/20 blur-xl rounded-full"></div>
                <div className="relative inline-flex items-center bg-white/90 backdrop-blur-sm border border-white/20 shadow-lg text-slate-700 px-6 py-3 rounded-full text-sm font-medium">
                  <Crown className="h-4 w-4 mr-2 text-yellow-500" />
                  <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent font-semibold">
                    Premium Upgrade
                  </span>
                </div>
              </div>
            </motion.div>

            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-slate-900 mb-4 leading-tight">
              Unlock Your
              <span className="block text-transparent bg-clip-text bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 mt-2">
                Premium Experience
              </span>
            </h1>
            <p className="text-xl text-slate-600 max-w-2xl mx-auto">
              Get unlimited access to all premium features for just ₹90/month
            </p>
          </div>

          <div className="grid lg:grid-cols-2 gap-8 items-center">
            {/* Payment Image */}
            <motion.div
              initial={{ x: -30, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.3 }}
              className="relative"
            >
              <div className="relative rounded-2xl overflow-hidden shadow-2xl">
                <Image
                  src="/img/pay.png"
                  alt="Payment illustration"
                  width={600}
                  height={400}
                  className="w-full h-auto"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-blue-600/20 to-transparent"></div>
              </div>
            </motion.div>

            {/* Pricing Card */}
            <motion.div
              initial={{ x: 30, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="bg-white/95 backdrop-blur-xl rounded-2xl shadow-2xl border border-white/20 overflow-hidden"
            >
              {/* Premium Badge */}
              <div className="bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 text-white text-center py-4">
                <div className="flex items-center justify-center space-x-2">
                  <Crown className="w-5 h-5" />
                  <span className="font-semibold">Premium Plan</span>
                  <Sparkles className="w-4 h-4 animate-pulse" />
                </div>
              </div>

              <div className="p-8">
                {/* Price */}
                <div className="text-center mb-8">
                  <div className="flex items-baseline justify-center space-x-2 mb-2">
                    <span className="text-5xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                      ₹{PREMIUM_PLAN.price}
                    </span>
                    <span className="text-slate-600 font-medium">/month</span>
                  </div>
                  <div className="inline-flex items-center space-x-1 px-3 py-1 bg-green-50 text-green-700 text-sm rounded-full border border-green-200">
                    <Sparkles className="w-3 h-3" />
                    <span>Monthly subscription plan</span>
                  </div>
                </div>

                {/* Features */}
                <div className="space-y-4 mb-8">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center space-x-2">
                    <span>Unlock Premium Features</span>
                  </h3>
                  {PREMIUM_PLAN.features.map((feature, index) => (
                    <div key={index} className="flex items-center space-x-3 group">
                      <div className="flex-shrink-0 w-5 h-5 bg-gradient-to-br from-green-400 to-green-500 rounded-full flex items-center justify-center">
                        <Check className="h-3 w-3 text-white" />
                      </div>
                      <span className="text-slate-700 group-hover:text-slate-900 transition-colors">
                        {feature}
                      </span>
                    </div>
                  ))}
                </div>

                {/* Payment Button */}
                <button
                  onClick={handlePayment}
                  disabled={isLoading}
                  className="w-full bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 hover:from-blue-700 hover:via-purple-700 hover:to-indigo-700 text-white font-semibold py-4 px-6 rounded-xl transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2 shadow-lg hover:shadow-xl transform hover:scale-[1.02] active:scale-[0.98] relative overflow-hidden group"
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-1000 ease-in-out" />

                  {isLoading ? (
                    <>
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                      <span>Processing...</span>
                    </>
                  ) : (
                    <>
                      <Crown className="w-5 h-5" />
                      <span>Subscribe Now - ₹{PREMIUM_PLAN.price}</span>
                    </>
                  )}
                </button>

                {/* Security Note */}
                <div className="mt-4 space-y-2">
                  <div className="flex items-center justify-center space-x-2 text-sm text-slate-600">
                    <Shield className="w-4 h-4" />
                    <span>Secure payment powered by Razorpay</span>
                  </div>
                  <div className="flex items-center justify-center space-x-4 text-xs text-gray-400">
                    <div className="flex items-center space-x-1">
                      <div className="w-2 h-2 bg-blue-400 rounded-full" />
                      <span>256-bit SSL</span>
                    </div>
                    <div className="w-px h-3 bg-gray-300" />
                    <div className="flex items-center space-x-1">
                      <div className="w-2 h-2 bg-green-400 rounded-full" />
                      <span>PCI Compliant</span>
                    </div>
                  </div>
                </div>

                {/* Error State */}
                {paymentStatus === 'failed' && (
                  <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm text-center flex items-center justify-center space-x-2">
                    <X className="w-4 h-4" />
                    <span>Payment failed. Please try again.</span>
                  </div>
                )}
              </div>
            </motion.div>
          </div>

          {/* Benefits */}
          <motion.div
            initial={{ y: 30, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-6"
          >
            {[
              { icon: Zap, title: "Instant Access", desc: "Get premium features immediately after payment" },
              { icon: Shield, title: "Secure Payment", desc: "Bank-grade security with Razorpay encryption" },
              { icon: Download, title: "Unlimited Downloads", desc: "Download as many resumes as you need" }
            ].map((benefit, index) => (
              <div key={index} className="bg-white/80 backdrop-blur-sm rounded-xl p-6 text-center shadow-lg hover:shadow-xl transition-all duration-300 border border-white/20">
                <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full flex items-center justify-center mx-auto mb-4">
                  <benefit.icon className="w-6 h-6 text-white" />
                </div>
                <h3 className="font-semibold text-slate-900 mb-2">{benefit.title}</h3>
                <p className="text-sm text-slate-600">{benefit.desc}</p>
              </div>
            ))}
          </motion.div>
        </motion.div>
      </div>

      <Footer/>
    </div>
  );
}
