import { motion } from 'framer-motion'
import { Star, CheckCircle, Award, Shield } from 'lucide-react'
import React, { useEffect, useState } from 'react'
import { useRouter } from "next/navigation";
import { useAuth } from "@/components/AuthContext";
import { showAlert } from '@/components/ui/alert-utils'
import { usePremiumStatus } from '@/hooks/usePremiumStatus';
import { plansAPI, Plan } from '@/lib/api/plans';

function Pricing() {
    const router = useRouter();
    const { user } = useAuth();
    const { isPremium } = usePremiumStatus();
    const [plans, setPlans] = useState<Plan[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchPlans = async () => {
            try {
                const plansData = await plansAPI.getPlans();
                setPlans(plansData);
            } catch (error) {
                console.error('Error fetching plans:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchPlans();
    }, []);

    const handlePlanSelect = (plan: Plan) => {
        if (!user) {
            router.push('/sign-in');
            return;
        }

        if (plan.slug === 'free') {
            showAlert('You are already on the free plan!');
            return;
        }

        if (isPremium && plan.slug !== 'free') {
            showAlert('You are already a premium user!');
            return;
        }

        router.push(`/payment?plan_id=${plan.id}&redirect=/dashboard`);
    };

    if (loading) {
        return (
            <section className="py-12 sm:py-16 lg:py-24 bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-900">
                <div className="container mx-auto px-4 sm:px-6">
                    <div className="text-center">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white mx-auto"></div>
                        <p className="text-white mt-4">Loading plans...</p>
                    </div>
                </div>
            </section>
        );
    }

    const freePlan = plans.find(p => p.slug === 'free');
    const premiumPlans = plans.filter(p => p.slug !== 'free');

    return (
        <section id="pricing" className="py-12 sm:py-16 lg:py-24 bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-900 relative overflow-hidden">
            <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff08_1px,transparent_1px),linear-gradient(to_bottom,#ffffff08_1px,transparent_1px)] bg-[size:40px_40px]"></div>

            <div className="container mx-auto px-4 sm:px-6 relative">
                <motion.div
                    initial={{ y: 50, opacity: 0 }}
                    whileInView={{ y: 0, opacity: 1 }}
                    transition={{ duration: 0.8 }}
                    viewport={{ once: true }}
                    className="text-center mb-12 sm:mb-16 lg:mb-20"
                >
                    <div className="inline-flex items-center bg-blue-500/20 border border-blue-400/30 text-blue-300 px-4 sm:px-6 py-2 sm:py-3 rounded-full text-sm font-medium mb-4 sm:mb-6 backdrop-blur-sm">
                        <Star className="h-4 w-4 mr-2" />
                        Simple, Transparent Pricing
                    </div>
                    <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-4 sm:mb-6">
                        Choose Your
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-400">
                            Success Plan
                        </span>
                    </h2>
                    <p className="text-lg sm:text-xl text-blue-100 max-w-3xl mx-auto leading-relaxed px-2 sm:px-0">
                        Start building for free or unlock premium features for unlimited professional resumes
                    </p>
                </motion.div>

                <div className="grid md:grid-cols-2 gap-6 sm:gap-8 max-w-5xl mx-auto">
                    {/* Free Plan */}
                    {freePlan && (
                        <motion.div
                            initial={{ y: 50, opacity: 0 }}
                            whileInView={{ y: 0, opacity: 1 }}
                            transition={{ duration: 0.6 }}
                            viewport={{ once: true }}
                            className="relative group"
                        >
                            <div className="absolute inset-0 bg-gradient-to-br from-slate-800/50 to-blue-800/50 blur-xl rounded-3xl group-hover:blur-2xl transition-all duration-300"></div>

                            <div className="relative bg-white/10 backdrop-blur-xl rounded-3xl p-6 sm:p-8 lg:p-10 border border-white/20 shadow-2xl hover:shadow-3xl transition-all duration-300 flex flex-col h-full">
                                <div className="text-center mb-6 sm:mb-8">
                                    <div className="inline-flex items-center bg-white/10 text-white px-3 sm:px-4 py-1 sm:py-2 rounded-full text-sm font-medium mb-3 sm:mb-4">
                                        <CheckCircle className="h-4 w-4 mr-2" />
                                        Free Forever
                                    </div>
                                    <h3 className="text-xl sm:text-2xl font-bold text-white mb-3 sm:mb-4">{freePlan.name}</h3>
                                    <div className="text-4xl sm:text-5xl font-bold text-white mb-2">
                                        {freePlan.currency === 'INR' ? '₹' : '$'}{freePlan.price / 100}
                                    </div>
                                    <p className="text-blue-200">Perfect to get started</p>
                                </div>

                                <div className="space-y-3 sm:space-y-4 mb-6 sm:mb-8 flex-grow">
                                    {freePlan.features.map((feature, i) => (
                                        <div key={i} className="flex items-center space-x-3">
                                            <CheckCircle className="h-4 sm:h-5 w-4 sm:w-5 text-blue-400 flex-shrink-0" />
                                            <span className="text-blue-100 text-sm sm:text-base">{feature}</span>
                                        </div>
                                    ))}
                                </div>

                                <button 
                                    onClick={() => handlePlanSelect(freePlan)}
                                    className="w-full bg-white/10 hover:bg-white/20 border border-white/20 text-white py-3 sm:py-4 rounded-xl font-semibold transition-all duration-300 backdrop-blur-sm"
                                >
                                    Start Building Free
                                </button>
                            </div>
                        </motion.div>
                    )}

                    {/* Premium Plans */}
                    {premiumPlans.map((plan, index) => (
                        <motion.div
                            key={plan.id}
                            initial={{ y: 50, opacity: 0 }}
                            whileInView={{ y: 0, opacity: 1 }}
                            transition={{ duration: 0.6, delay: 0.1 * (index + 1) }}
                            viewport={{ once: true }}
                            className="relative group"
                        >
                            {/* Popular badge */}
                            {plan.is_popular && (
                                <div className="absolute -top-4 sm:-top-6 left-1/2 transform -translate-x-1/2 z-20">
                                    <div className="bg-gradient-to-r from-orange-500 to-pink-600 text-white px-4 sm:px-8 py-2 sm:py-3 rounded-full text-sm font-bold shadow-lg">
                                        ⭐ Most Popular
                                    </div>
                                </div>
                            )}

                            <div className="absolute inset-0 bg-gradient-to-br from-blue-500/30 to-purple-600/30 blur-xl rounded-3xl group-hover:blur-2xl transition-all duration-300"></div>

                            <div className="relative bg-gradient-to-br from-white/15 to-white/10 backdrop-blur-xl rounded-3xl p-6 sm:p-8 lg:p-10 border border-white/30 shadow-2xl hover:shadow-3xl transition-all duration-300 flex flex-col h-full">
                                <div className="text-center mb-6 sm:mb-8">
                                    <div className="inline-flex items-center bg-gradient-to-r from-blue-500/20 to-purple-600/20 border border-blue-400/30 text-blue-300 px-3 sm:px-4 py-1 sm:py-2 rounded-full text-sm font-medium mb-3 sm:mb-4 backdrop-blur-sm">
                                        <Award className="h-4 w-4 mr-2" />
                                        Premium Access
                                    </div>
                                    <h3 className="text-xl sm:text-2xl font-bold text-white mb-3 sm:mb-4">{plan.name}</h3>
                                    <div className="text-4xl sm:text-5xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent mb-2">
                                        {plan.currency === 'INR' ? '₹' : '$'}{plan.price / 100}
                                    </div>
                                    <p className="text-blue-200 mb-2">per {plan.interval}</p>
                                    <p className="text-sm text-blue-300">Cancel anytime • 2-day guarantee</p>
                                </div>

                                <div className="space-y-3 sm:space-y-4 mb-6 sm:mb-8 flex-grow">
                                    {plan.features.map((feature, i) => (
                                        <div key={i} className="flex items-center space-x-3">
                                            <CheckCircle className="h-4 sm:h-5 w-4 sm:w-5 text-emerald-400 flex-shrink-0" />
                                            <span className="text-white font-medium text-sm sm:text-base">{feature}</span>
                                        </div>
                                    ))}
                                </div>

                                <button
                                    onClick={() => handlePlanSelect(plan)}
                                    className="w-full bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white py-3 sm:py-4 rounded-xl font-bold transition-all duration-300 transform hover:-translate-y-1 shadow-lg hover:shadow-xl"
                                >
                                    {isPremium ? 'Already Premium ✓' : `Upgrade to ${plan.name}`}
                                </button>
                            </div>
                        </motion.div>
                    ))}
                </div>

                {/* Money Back Guarantee */}
                <motion.div
                    initial={{ y: 30, opacity: 0 }}
                    whileInView={{ y: 0, opacity: 1 }}
                    transition={{ duration: 0.6, delay: 0.4 }}
                    viewport={{ once: true }}
                    className="text-center mt-12 sm:mt-16"
                >
                    <div className="inline-flex items-center bg-emerald-500/20 border border-emerald-400/30 text-emerald-300 px-6 sm:px-8 py-3 sm:py-4 rounded-full backdrop-blur-sm">
                        <Shield className="h-5 sm:h-6 w-5 sm:w-6 mr-2 sm:mr-3" />
                        <span className="font-semibold text-base sm:text-lg">2-Day Money-Back Guarantee</span>
                    </div>
                </motion.div>
            </div>
        </section>
    )
}

export default Pricing
