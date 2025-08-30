"use client";

import React, { useState, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import axios from 'axios';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Eye, EyeOff, Mail, Lock, User, Sparkles, CheckCircle } from 'lucide-react';

const api_key = process.env.NEXT_PUBLIC_API_KEY;

function SignUpForm() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [fullName, setFullName] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState(false);
    const [acceptTerms, setAcceptTerms] = useState(false);
    const router = useRouter();
    const searchParams = useSearchParams();
    const callbackUrl = searchParams.get('callbackUrl') || '/sign-in';

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        if (!acceptTerms) {
            setError('Please accept the terms and conditions');
            setLoading(false);
            return;
        }

        try {
            const response = await axios.post(`${api_key || 'http://localhost:8000'}/api/auth/signup`, {
                email,
                password,
                full_name: fullName,
            });

            if (response.data) {
                setSuccess(true);
                setTimeout(() => {
                    // Redirect to sign-in page with the original callback URL
                    const signInUrl = callbackUrl !== '/sign-in' 
                        ? `/sign-in?callbackUrl=${encodeURIComponent(callbackUrl)}`
                        : '/sign-in';
                    router.push(signInUrl);
                }, 3000);
            }
        } catch (error: any) {
            setError(error.response?.data?.detail || 'An error occurred. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    if (success) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-50 via-white to-purple-50 p-4">
                {/* Background decoration */}
                <div className="absolute inset-0 overflow-hidden">
                    <div className="absolute -top-40 -right-40 w-80 h-80 bg-indigo-400 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse"></div>
                    <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-purple-400 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse"></div>
                </div>

                <Card className="w-full max-w-md relative backdrop-blur-sm bg-white/80 border-0 shadow-2xl">
                    <CardContent className="text-center py-12">
                        <div className="mx-auto w-20 h-20 bg-gradient-to-r from-green-500 to-emerald-600 rounded-full flex items-center justify-center mb-6 animate-bounce">
                            <CheckCircle className="w-10 h-10 text-white" />
                        </div>
                        <h3 className="text-2xl font-bold text-gray-900 mb-2">Account Created!</h3>
                        <p className="text-gray-600 mb-4">
                            Welcome aboard! Your account has been successfully created.
                        </p>
                        <div className="bg-green-50 border border-green-200 rounded-xl p-4">
                            <p className="text-green-700 font-medium">
                                Redirecting to sign in page...
                            </p>
                            <div className="mt-3 w-full bg-green-200 rounded-full h-2">
                                <div className="bg-green-500 h-2 rounded-full animate-pulse" style={{width: '100%'}}></div>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>
        );
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-50 via-white to-purple-50 p-4">
            {/* Background decoration */}
            <div className="absolute inset-0 overflow-hidden">
                <div className="absolute -top-40 -right-40 w-80 h-80 bg-indigo-400 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse"></div>
                <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-purple-400 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse"></div>
            </div>

            <Card className="w-full max-w-md relative backdrop-blur-sm bg-white/80 border-0 shadow-2xl">
                <CardHeader className="text-center space-y-4 pb-6">
                    <div className="mx-auto w-16 h-16 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-full flex items-center justify-center mb-2">
                        <Sparkles className="w-8 h-8 text-white" />
                    </div>
                    <div>
                        <CardTitle className="text-3xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                            Join Us Today
                        </CardTitle>
                        <CardDescription className="text-gray-600 mt-2">
                            Create your account to get started
                        </CardDescription>
                    </div>
                </CardHeader>

                <CardContent className="space-y-6">
                    <form onSubmit={handleSubmit} className="space-y-4">
                        {error && (
                            <Alert className="border-red-200 bg-red-50">
                                <AlertDescription className="text-red-700">
                                    {error}
                                </AlertDescription>
                            </Alert>
                        )}

                        <div className="space-y-4">
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <User className="h-5 w-5 text-gray-400" />
                                </div>
                                <input
                                    id="fullName"
                                    name="fullName"
                                    type="text"
                                    required
                                    value={fullName}
                                    onChange={(e) => setFullName(e.target.value)}
                                    className="block w-full pl-10 pr-3 py-3 border border-gray-200 rounded-xl shadow-sm placeholder-gray-400 text-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200 bg-gray-50/50 hover:bg-white focus:bg-white"
                                    placeholder="Enter your full name"
                                />
                            </div>

                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <Mail className="h-5 w-5 text-gray-400" />
                                </div>
                                <input
                                    id="email"
                                    name="email"
                                    type="email"
                                    required
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className="block w-full pl-10 pr-3 py-3 border border-gray-200 rounded-xl shadow-sm placeholder-gray-400 text-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200 bg-gray-50/50 hover:bg-white focus:bg-white"
                                    placeholder="Enter your email"
                                />
                            </div>

                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <Lock className="h-5 w-5 text-gray-400" />
                                </div>
                                <input
                                    id="password"
                                    name="password"
                                    type={showPassword ? 'text' : 'password'}
                                    required
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className="block w-full pl-10 pr-12 py-3 border border-gray-200 rounded-xl shadow-sm placeholder-gray-400 text-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200 bg-gray-50/50 hover:bg-white focus:bg-white"
                                    placeholder="Create a password"
                                />
                                <button
                                    type="button"
                                    className="absolute inset-y-0 right-0 pr-3 flex items-center"
                                    onClick={() => setShowPassword(!showPassword)}
                                >
                                    {showPassword ? (
                                        <EyeOff className="h-5 w-5 text-gray-400 hover:text-gray-600" />
                                    ) : (
                                        <Eye className="h-5 w-5 text-gray-400 hover:text-gray-600" />
                                    )}
                                </button>
                            </div>
                        </div>

                        {/* Password Strength Indicator */}
                        <div className="space-y-2">
                            <div className="text-sm text-gray-600">Password strength:</div>
                            <div className="flex space-x-1">
                                <div className={`h-1 w-1/4 rounded ${password.length >= 8 ? 'bg-green-500' : 'bg-gray-200'}`}></div>
                                <div className={`h-1 w-1/4 rounded ${/[A-Z]/.test(password) ? 'bg-green-500' : 'bg-gray-200'}`}></div>
                                <div className={`h-1 w-1/4 rounded ${/[0-9]/.test(password) ? 'bg-green-500' : 'bg-gray-200'}`}></div>
                                <div className={`h-1 w-1/4 rounded ${/[^A-Za-z0-9]/.test(password) ? 'bg-green-500' : 'bg-gray-200'}`}></div>
                            </div>
                            <div className="text-xs text-gray-500 space-y-1">
                                <p className={password.length >= 8 ? 'text-green-600' : ''}>• At least 8 characters</p>
                                <p className={/[A-Z]/.test(password) ? 'text-green-600' : ''}>• One uppercase letter</p>
                                <p className={/[0-9]/.test(password) ? 'text-green-600' : ''}>• One number</p>
                                <p className={/[^A-Za-z0-9]/.test(password) ? 'text-green-600' : ''}>• One special character</p>
                            </div>
                        </div>

                        <div className="flex items-start">
                            <input
                                type="checkbox"
                                id="acceptTerms"
                                checked={acceptTerms}
                                onChange={(e) => setAcceptTerms(e.target.checked)}
                                className="mt-1 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                            />
                            <label htmlFor="acceptTerms" className="ml-2 text-sm text-gray-600">
                                I agree to the{' '}
                                <Link href="/terms" className="text-indigo-600 hover:text-indigo-500 font-medium">
                                    Terms of Service
                                </Link>{' '}
                                and{' '}
                                <Link href="/privacy" className="text-indigo-600 hover:text-indigo-500 font-medium">
                                    Privacy Policy
                                </Link>
                            </label>
                        </div>

                        <button
                            type="submit"
                            disabled={loading || !acceptTerms}
                            className="w-full flex justify-center py-3 px-4 border border-transparent rounded-xl text-sm font-semibold text-white bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 transform hover:scale-[1.02] active:scale-[0.98] shadow-lg hover:shadow-xl"
                        >
                            {loading ? (
                                <div className="flex items-center">
                                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                                    Creating account...
                                </div>
                            ) : (
                                'Create account'
                            )}
                        </button>
                    </form>

                    <div className="relative">
                        <div className="absolute inset-0 flex items-center">
                            <div className="w-full border-t border-gray-200"></div>
                        </div>
                        <div className="relative flex justify-center text-sm">
                            <span className="px-2 bg-white text-gray-500">Or continue with</span>
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                        <button className="w-full inline-flex justify-center py-2.5 px-4 rounded-xl border border-gray-200 bg-white text-sm font-medium text-gray-500 hover:text-gray-900 hover:bg-gray-50 transition-all duration-200">
                            <svg className="w-5 h-5" viewBox="0 0 24 24">
                                <path fill="#4285f4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                                <path fill="#34a853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                                <path fill="#fbbc05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                                <path fill="#ea4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                            </svg>
                            <span className="ml-2">Google</span>
                        </button>
                        <button className="w-full inline-flex justify-center py-2.5 px-4 rounded-xl border border-gray-200 bg-white text-sm font-medium text-gray-500 hover:text-gray-900 hover:bg-gray-50 transition-all duration-200">
                            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                                <path d="M12.017 0C5.396 0 .029 5.367.029 11.987c0 5.079 3.158 9.417 7.618 11.174-.105-.949-.199-2.403.041-3.439.219-.937 1.406-5.957 1.406-5.957s-.359-.72-.359-1.781c0-1.663.967-2.911 2.168-2.911 1.024 0 1.518.769 1.518 1.688 0 1.029-.653 2.567-.992 3.992-.285 1.193.6 2.165 1.775 2.165 2.128 0 3.768-2.245 3.768-5.487 0-2.861-2.063-4.869-5.008-4.869-3.41 0-5.409 2.562-5.409 5.199 0 1.033.394 2.143.889 2.741.097.118.112.221.085.345-.09.375-.293 1.199-.334 1.363-.053.225-.172.271-.402.165-1.495-.69-2.433-2.878-2.433-4.646 0-3.776 2.748-7.252 7.92-7.252 4.158 0 7.392 2.967 7.392 6.923 0 4.135-2.607 7.462-6.233 7.462-1.214 0-2.357-.629-2.750-1.378l-.748 2.853c-.271 1.043-1.002 2.35-1.492 3.146C9.57 23.812 10.763 24.009 12.017 24c6.624 0 11.99-5.367 11.99-11.987C24.007 5.367 18.641.001 12.017.001z"/>
                            </svg>
                            <span className="ml-2">GitHub</span>
                        </button>
                    </div>

                    <div className="text-center">
                        <p className="text-gray-600">
                            Already have an account?{' '}
                            <Link
                                href={callbackUrl !== '/sign-in' ? `/sign-in?callbackUrl=${encodeURIComponent(callbackUrl)}` : '/sign-in'}
                                className="font-semibold text-indigo-600 hover:text-indigo-500 transition-colors"
                            >
                                Sign in instead
                            </Link>
                        </p>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}

function SignUpPage() {
    return (
        <Suspense fallback={
            <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-50 via-white to-purple-50">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
            </div>
        }>
            <SignUpForm />
        </Suspense>
    );
}

export default SignUpPage;