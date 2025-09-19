"use client";

import React from "react";
import {
    Users,
    CreditCard,
    FileText,
    Bell,
    TrendingUp,
    DollarSign,
    Eye,
    Download,
    RefreshCw,
    AlertCircle
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useDashboardData } from "@/hooks/useDashboardData";

const LoadingCard = () => (
    <Card className="animate-pulse">
        <CardContent className="p-6">
            <div className="flex items-center justify-between">
                <div className="space-y-2">
                    <div className="h-4 bg-gray-200 rounded w-24"></div>
                    <div className="h-8 bg-gray-200 rounded w-16"></div>
                    <div className="h-3 bg-gray-200 rounded w-20"></div>
                </div>
                <div className="w-12 h-12 bg-gray-200 rounded-lg"></div>
            </div>
        </CardContent>
    </Card>
);

const ErrorMessage = ({ error, onRetry }: { error: string; onRetry: () => void }) => (
    <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-center justify-between">
        <div className="flex items-center space-x-3">
            <AlertCircle className="h-5 w-5 text-red-500" />
            <span className="text-red-700">{error}</span>
        </div>
        <Button variant="outline" size="sm" onClick={onRetry}>
            <RefreshCw className="h-4 w-4 mr-2" />
            Retry
        </Button>
    </div>
);



export default function AdminDashboard() {
    const { data, loading, error, refetch } = useDashboardData();

    const formatCurrency = (amount: number) => {
        // Convert paise to rupees by dividing by 100
        const rupees = amount / 100;
        return new Intl.NumberFormat('en-IN', {
            style: 'currency',
            currency: 'INR',
            minimumFractionDigits: 0,
            maximumFractionDigits: 0,
        }).format(rupees);
    };

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('en-IN', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        });
    };

    const formatGrowthPercentage = (percentage: number) => {
        const sign = percentage >= 0 ? '+' : '';
        return `${sign}${percentage}%`;
    };

    if (error) {
        return (
            <div className="p-4 lg:p-8">
                <ErrorMessage error={error} onRetry={refetch} />
            </div>
        );
    }

    const dashboardStats = data ? [
        {
            title: "Total Users",
            value: data.total_users.toLocaleString(),
            change: formatGrowthPercentage(data.user_growth_percentage),
            icon: Users,
            color: "text-blue-600",
            bgColor: "bg-blue-50",
            isPositive: data.user_growth_percentage >= 0
        },
        {
            title: "Active Subscriptions",
            value: data.total_active_subscriptions.toLocaleString(),
            change: "Active",
            icon: CreditCard,
            color: "text-green-600",
            bgColor: "bg-green-50",
            isPositive: true
        },
        {
            title: "Total Resumes",
            value: data.total_resumes.toLocaleString(),
            change: formatGrowthPercentage(data.resume_growth_percentage),
            icon: FileText,
            color: "text-purple-600",
            bgColor: "bg-purple-50",
            isPositive: data.resume_growth_percentage >= 0
        },
        {
            title: "Monthly Revenue",
            value: formatCurrency(data.current_month_revenue),
            change: formatGrowthPercentage(data.revenue_growth_percentage),
            icon: DollarSign,
            color: "text-orange-600",
            bgColor: "bg-orange-50",
            isPositive: data.revenue_growth_percentage >= 0
        },
    ] : [];

    return (
        <div className="p-4 lg:p-8 space-y-8">
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
                    <p className="text-gray-600">Welcome back! Here's your platform overview.</p>
                </div>
                <div className="flex items-center space-x-3">
                    <Button variant="outline" size="sm" onClick={refetch} disabled={loading}>
                        <RefreshCw className={`h-4 w-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
                        Refresh
                    </Button>
                    <Button variant="outline" size="sm">
                        <Download className="h-4 w-4 mr-2" />
                        Export Report
                    </Button>
                </div>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {loading ? (
                    Array.from({ length: 4 }).map((_, index) => (
                        <LoadingCard key={index} />
                    ))
                ) : (
                    dashboardStats.map((stat, index) => (
                        <Card key={index} className="hover:shadow-lg transition-shadow">
                            <CardContent className="p-6">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="text-sm font-medium text-gray-600">{stat.title}</p>
                                        <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                                        <p className={`text-sm mt-1 ${stat.isPositive ? 'text-green-600' : 'text-red-600'
                                            }`}>
                                            {stat.change} {stat.title === "Active Subscriptions" ? "" : "from last month"}
                                        </p>
                                    </div>
                                    <div className={`${stat.bgColor} p-3 rounded-lg`}>
                                        <stat.icon className={`h-6 w-6 ${stat.color}`} />
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    ))
                )}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Recent Users */}
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center space-x-2">
                            <Users className="h-5 w-5" />
                            <span>Recent Users</span>
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        {loading ? (
                            <div className="space-y-4">
                                {Array.from({ length: 4 }).map((_, index) => (
                                    <div key={index} className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg animate-pulse">
                                        <div className="w-10 h-10 bg-gray-200 rounded-full"></div>
                                        <div className="flex-1 space-y-2">
                                            <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                                            <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                                        </div>
                                        <div className="h-6 bg-gray-200 rounded w-16"></div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="space-y-4">
                                {data?.recent_users?.map((user, index) => (
                                    <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                                        <div className="flex items-center space-x-3">
                                            <Avatar>
                                                <AvatarImage src={user.image_url} />
                                                <AvatarFallback className="bg-blue-100 text-blue-700">
                                                    {user.name.split(" ").map((n) => n[0]).join("")}
                                                </AvatarFallback>
                                            </Avatar>
                                            <div>
                                                <p className="font-medium text-gray-900">{user.name}</p>
                                                <p className="text-sm text-gray-500">{user.email}</p>
                                            </div>
                                        </div>
                                        <div className="text-right">
                                            <Badge variant={user.is_premium ? "default" : "secondary"}>
                                                {user.is_premium ? "Premium" : "Free"}
                                            </Badge>
                                            <p className="text-xs text-gray-500 mt-1">
                                                {formatDate(user.registered_date)}
                                            </p>
                                        </div>
                                    </div>
                                )) || (
                                        <p className="text-gray-500 text-center py-4">No recent users found</p>
                                    )}
                            </div>
                        )}
                        <Button variant="outline" className="w-full mt-4">
                            <Eye className="h-4 w-4 mr-2" />
                            View All Users
                        </Button>
                    </CardContent>
                </Card>

                {/* Recent Payments */}
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center space-x-2">
                            <CreditCard className="h-5 w-5" />
                            <span>Recent Payments</span>
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        {loading ? (
                            <div className="space-y-4">
                                {Array.from({ length: 4 }).map((_, index) => (
                                    <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg animate-pulse">
                                        <div className="space-y-2">
                                            <div className="h-4 bg-gray-200 rounded w-24"></div>
                                            <div className="h-3 bg-gray-200 rounded w-16"></div>
                                        </div>
                                        <div className="text-right space-y-2">
                                            <div className="h-4 bg-gray-200 rounded w-16"></div>
                                            <div className="h-6 bg-gray-200 rounded w-20"></div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="space-y-4">
                                {data?.recent_payments?.map((payment, index) => (
                                    <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                                        <div>
                                            <p className="font-medium text-gray-900">{payment.user_name}</p>
                                            <p className="text-sm text-gray-500">
                                                {payment.payment_date ? formatDate(payment.payment_date) : 'N/A'}
                                            </p>
                                        </div>
                                        <div className="text-right">
                                            <p className="font-medium text-gray-900">
                                                {formatCurrency(payment.amount)}
                                            </p>
                                            <Badge variant={payment.status === "captured" ? "default" : "destructive"}>
                                                {payment.status === "captured" ? "Success" : payment.status}
                                            </Badge>
                                        </div>
                                    </div>
                                )) || (
                                        <p className="text-gray-500 text-center py-4">No recent payments found</p>
                                    )}
                            </div>
                        )}
                        <Button variant="outline" className="w-full mt-4">
                            <Eye className="h-4 w-4 mr-2" />
                            View All Payments
                        </Button>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
