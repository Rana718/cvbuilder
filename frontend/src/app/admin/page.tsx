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
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

const dashboardStats = [
    {
        title: "Total Users",
        value: "2,847",
        change: "+12.5%",
        icon: Users,
        color: "text-blue-600",
        bgColor: "bg-blue-50",
    },
    {
        title: "Active Subscriptions",
        value: "892",
        change: "+8.2%",
        icon: CreditCard,
        color: "text-green-600",
        bgColor: "bg-green-50",
    },
    {
        title: "Total Resumes",
        value: "15,439",
        change: "+24.1%",
        icon: FileText,
        color: "text-purple-600",
        bgColor: "bg-purple-50",
    },
    {
        title: "Monthly Revenue",
        value: "₹80,280",
        change: "+15.3%",
        icon: DollarSign,
        color: "text-orange-600",
        bgColor: "bg-orange-50",
    },
];

const recentUsers = [
    { name: "John Doe", email: "john@example.com", status: "Premium", joinDate: "2024-09-01" },
    { name: "Sarah Wilson", email: "sarah@example.com", status: "Free", joinDate: "2024-09-01" },
    { name: "Mike Johnson", email: "mike@example.com", status: "Premium", joinDate: "2024-08-31" },
    { name: "Emily Chen", email: "emily@example.com", status: "Free", joinDate: "2024-08-31" },
];

const recentPayments = [
    { user: "John Doe", amount: "₹90", status: "Success", date: "2024-09-01" },
    { user: "Sarah Wilson", amount: "₹90", status: "Success", date: "2024-08-31" },
    { user: "Mike Johnson", amount: "₹90", status: "Failed", date: "2024-08-30" },
    { user: "Emily Chen", amount: "₹90", status: "Success", date: "2024-08-29" },
];

const resumeStats = [
    { template: "Modern Professional", count: 2847, percentage: 35 },
    { template: "Creative Designer", count: 1923, percentage: 24 },
    { template: "Executive Elite", count: 1654, percentage: 20 },
    { template: "Minimalist", count: 1234, percentage: 15 },
    { template: "Others", count: 481, percentage: 6 },
];

export default function AdminDashboard() {
    return (
        <div className="p-4 lg:p-8 space-y-8">
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
                    <p className="text-gray-600">Welcome back! Here's your platform overview.</p>
                </div>
                <div className="flex items-center space-x-3">
                    <Button variant="outline" size="sm">
                        <Download className="h-4 w-4 mr-2" />
                        Export Report
                    </Button>
                </div>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {dashboardStats.map((stat, index) => (
                    <Card key={index} className="hover:shadow-lg transition-shadow">
                        <CardContent className="p-6">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm font-medium text-gray-600">{stat.title}</p>
                                    <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                                    <p className="text-sm text-green-600 mt-1">{stat.change} from last month</p>
                                </div>
                                <div className={`${stat.bgColor} p-3 rounded-lg`}>
                                    <stat.icon className={`h-6 w-6 ${stat.color}`} />
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                ))}
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
                        <div className="space-y-4">
                            {recentUsers.map((user, index) => (
                                <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                                    <div className="flex items-center space-x-3">
                                        <Avatar>
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
                                        <Badge variant={user.status === "Premium" ? "default" : "secondary"}>
                                            {user.status}
                                        </Badge>
                                        <p className="text-xs text-gray-500 mt-1">{user.joinDate}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
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
                        <div className="space-y-4">
                            {recentPayments.map((payment, index) => (
                                <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                                    <div>
                                        <p className="font-medium text-gray-900">{payment.user}</p>
                                        <p className="text-sm text-gray-500">{payment.date}</p>
                                    </div>
                                    <div className="text-right">
                                        <p className="font-medium text-gray-900">{payment.amount}</p>
                                        <Badge variant={payment.status === "Success" ? "default" : "destructive"}>
                                            {payment.status}
                                        </Badge>
                                    </div>
                                </div>
                            ))}
                        </div>
                        <Button variant="outline" className="w-full mt-4">
                            <Eye className="h-4 w-4 mr-2" />
                            View All Payments
                        </Button>
                    </CardContent>
                </Card>
            </div>

            {/* Resume Analytics */}
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center space-x-2">
                        <FileText className="h-5 w-5" />
                        <span>Resume Template Analytics</span>
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="space-y-4">
                        {resumeStats.map((stat, index) => (
                            <div key={index} className="flex items-center justify-between">
                                <div className="flex-1">
                                    <div className="flex items-center justify-between mb-2">
                                        <span className="text-sm font-medium text-gray-900">{stat.template}</span>
                                        <span className="text-sm text-gray-500">{stat.count} resumes</span>
                                    </div>
                                    <div className="w-full bg-gray-200 rounded-full h-2">
                                        <div
                                            className="bg-blue-600 h-2 rounded-full"
                                            style={{ width: `${stat.percentage}%` }}
                                        ></div>
                                    </div>
                                </div>
                                <div className="ml-4 text-sm font-medium text-gray-900">
                                    {stat.percentage}%
                                </div>
                            </div>
                        ))}
                    </div>
                </CardContent>
            </Card>

            {/* Quick Actions */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <Button className="h-20 flex-col space-y-2" variant="outline">
                    <Users className="h-6 w-6" />
                    <span>Manage Users</span>
                </Button>
                <Button className="h-20 flex-col space-y-2" variant="outline">
                    <CreditCard className="h-6 w-6" />
                    <span>View Payments</span>
                </Button>
                <Button className="h-20 flex-col space-y-2" variant="outline">
                    <Bell className="h-6 w-6" />
                    <span>Send Notification</span>
                </Button>
                <Button className="h-20 flex-col space-y-2" variant="outline">
                    <FileText className="h-6 w-6" />
                    <span>Edit Templates</span>
                </Button>
            </div>
        </div>
    );
}
