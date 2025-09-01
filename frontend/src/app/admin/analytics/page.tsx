"use client";

import React, { useState } from "react";
import {
    BarChart3,
    TrendingUp,
    TrendingDown,
    Users,
    FileText,
    CreditCard,
    Download,
    Calendar,
    Globe,
    Smartphone,
    Monitor,
    Eye,
    MousePointer,
    Clock,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
    LineChart,
    Line,
    AreaChart,
    Area,
    BarChart,
    Bar,
    PieChart,
    Pie,
    Cell,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    Legend,
    ResponsiveContainer,
} from "recharts";

// Mock analytics data
const overviewStats = [
    {
        title: "Total Revenue",
        value: "₹2,45,680",
        change: "+12.5%",
        changeType: "increase",
        icon: CreditCard,
        description: "vs last month",
    },
    {
        title: "New Users",
        value: "1,234",
        change: "+8.2%",
        changeType: "increase",
        icon: Users,
        description: "this month",
    },
    {
        title: "Resume Downloads",
        value: "8,456",
        change: "+24.1%",
        changeType: "increase",
        icon: Download,
        description: "total downloads",
    },
    {
        title: "Conversion Rate",
        value: "3.2%",
        change: "-0.4%",
        changeType: "decrease",
        icon: TrendingUp,
        description: "free to premium",
    },
];

const userGrowthData = [
    { month: "Jan", totalUsers: 1200, premiumUsers: 380, freeUsers: 820 },
    { month: "Feb", totalUsers: 1450, premiumUsers: 420, freeUsers: 1030 },
    { month: "Mar", totalUsers: 1680, premiumUsers: 480, freeUsers: 1200 },
    { month: "Apr", totalUsers: 1920, premiumUsers: 540, freeUsers: 1380 },
    { month: "May", totalUsers: 2150, premiumUsers: 620, freeUsers: 1530 },
    { month: "Jun", totalUsers: 2380, premiumUsers: 710, freeUsers: 1670 },
    { month: "Jul", totalUsers: 2580, premiumUsers: 780, freeUsers: 1800 },
    { month: "Aug", totalUsers: 2750, premiumUsers: 850, freeUsers: 1900 },
];

const revenueData = [
    { month: "Jan", revenue: 34200, subscriptions: 380, growth: 12 },
    { month: "Feb", revenue: 37800, subscriptions: 420, growth: 15 },
    { month: "Mar", revenue: 43200, subscriptions: 480, growth: 18 },
    { month: "Apr", revenue: 48600, subscriptions: 540, growth: 22 },
    { month: "May", revenue: 55800, subscriptions: 620, growth: 25 },
    { month: "Jun", revenue: 63900, subscriptions: 710, growth: 28 },
    { month: "Jul", revenue: 70200, subscriptions: 780, growth: 32 },
    { month: "Aug", revenue: 78300, subscriptions: 850, growth: 35 },
];

const deviceStats = [
    { device: "Desktop", users: 45, count: 1238, color: "#3B82F6" },
    { device: "Mobile", users: 35, count: 963, color: "#10B981" },
    { device: "Tablet", users: 20, count: 550, color: "#8B5CF6" },
];

const geographicData = [
    { country: "India", users: 5240, percentage: 45, color: "#3B82F6" },
    { country: "United States", users: 2890, percentage: 25, color: "#10B981" },
    { country: "United Kingdom", users: 1156, percentage: 10, color: "#F59E0B" },
    { country: "Canada", users: 867, percentage: 7, color: "#EF4444" },
    { country: "Australia", users: 578, percentage: 5, color: "#8B5CF6" },
    { country: "Others", users: 923, percentage: 8, color: "#6B7280" },
];

const userEngagement = [
    { metric: "Avg. Session Duration", value: "8m 32s", change: "+2.3%", changeType: "increase" },
    { metric: "Pages per Session", value: "4.2", change: "+1.8%", changeType: "increase" },
    { metric: "Bounce Rate", value: "34.2%", change: "-2.1%", changeType: "increase" },
    { metric: "Return Visitors", value: "68.5%", change: "+5.4%", changeType: "increase" },
];

const COLORS = ['#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6', '#6B7280'];

export default function AnalyticsPage() {
    const [timeRange, setTimeRange] = useState("30d");

    return (
        <div className="p-4 lg:p-8 space-y-8 bg-gray-50 min-h-screen">
            {/* Header */}
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900">Analytics Dashboard</h1>
                    <p className="text-gray-600">Comprehensive insights into your platform performance</p>
                </div>
                <div className="flex items-center space-x-3">
                    <Select value={timeRange} onValueChange={setTimeRange}>
                        <SelectTrigger className="w-40 bg-white border-gray-300">
                            <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="7d">Last 7 days</SelectItem>
                            <SelectItem value="30d">Last 30 days</SelectItem>
                            <SelectItem value="90d">Last 3 months</SelectItem>
                            <SelectItem value="1y">Last year</SelectItem>
                        </SelectContent>
                    </Select>
                    <Button variant="outline" size="sm" className="bg-white border-gray-300">
                        <Download className="h-4 w-4 mr-2" />
                        Export Report
                    </Button>
                </div>
            </div>

            {/* Overview Stats */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {overviewStats.map((stat, index) => (
                    <Card key={index} className="hover:shadow-lg transition-shadow bg-white border-gray-200">
                        <CardContent className="p-6">
                            <div className="flex items-center justify-between mb-4">
                                <div className={`p-3 rounded-lg ${stat.changeType === 'increase' ? 'bg-green-100' : 'bg-red-100'}`}>
                                    <stat.icon className={`h-6 w-6 ${stat.changeType === 'increase' ? 'text-green-600' : 'text-red-600'}`} />
                                </div>
                                <Badge variant={stat.changeType === 'increase' ? 'default' : 'destructive'} className="text-xs font-medium">
                                    {stat.changeType === 'increase' ? (
                                        <TrendingUp className="h-3 w-3 mr-1" />
                                    ) : (
                                        <TrendingDown className="h-3 w-3 mr-1" />
                                    )}
                                    {stat.change}
                                </Badge>
                            </div>
                            <div>
                                <p className="text-3xl font-bold text-gray-900 mb-1">{stat.value}</p>
                                <p className="text-sm font-medium text-gray-700">{stat.title}</p>
                                <p className="text-xs text-gray-500 mt-1">{stat.description}</p>
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>

            {/* Analytics Tabs */}
            <Tabs defaultValue="users" className="space-y-6">
                <TabsList className="grid w-full grid-cols-2 lg:w-auto lg:grid-cols-4 bg-white border border-gray-200">
                    <TabsTrigger value="users" className="data-[state=active]:bg-blue-600 data-[state=active]:text-white">Users</TabsTrigger>
                    <TabsTrigger value="revenue" className="data-[state=active]:bg-blue-600 data-[state=active]:text-white">Revenue</TabsTrigger>
                    <TabsTrigger value="geographic" className="data-[state=active]:bg-blue-600 data-[state=active]:text-white">Geographic</TabsTrigger>
                    <TabsTrigger value="engagement" className="data-[state=active]:bg-blue-600 data-[state=active]:text-white">Engagement</TabsTrigger>
                </TabsList>

                {/* Users Analytics */}
                <TabsContent value="users" className="space-y-6">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        {/* User Growth Chart */}
                        <Card className="bg-white border-gray-200">
                            <CardHeader className="border-b border-gray-100">
                                <CardTitle className="flex items-center space-x-2 text-gray-800">
                                    <BarChart3 className="h-5 w-5 text-blue-600" />
                                    <span>User Growth Trend</span>
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="p-6">
                                <ResponsiveContainer width="100%" height={300}>
                                    <AreaChart data={userGrowthData}>
                                        <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                                        <XAxis
                                            dataKey="month"
                                            axisLine={false}
                                            tickLine={false}
                                            tick={{ fill: '#6B7280', fontSize: 12 }}
                                        />
                                        <YAxis
                                            axisLine={false}
                                            tickLine={false}
                                            tick={{ fill: '#6B7280', fontSize: 12 }}
                                        />
                                        <Tooltip
                                            contentStyle={{
                                                backgroundColor: 'white',
                                                border: '1px solid #e5e7eb',
                                                borderRadius: '8px',
                                                boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)'
                                            }}
                                        />
                                        <Legend />
                                        <Area
                                            type="monotone"
                                            dataKey="totalUsers"
                                            stackId="1"
                                            stroke="#3B82F6"
                                            fill="#3B82F6"
                                            fillOpacity={0.3}
                                            name="Total Users"
                                        />
                                        <Area
                                            type="monotone"
                                            dataKey="premiumUsers"
                                            stackId="2"
                                            stroke="#10B981"
                                            fill="#10B981"
                                            fillOpacity={0.6}
                                            name="Premium Users"
                                        />
                                    </AreaChart>
                                </ResponsiveContainer>
                            </CardContent>
                        </Card>

                        {/* Device Stats */}
                        <Card className="bg-white border-gray-200">
                            <CardHeader className="border-b border-gray-100">
                                <CardTitle className="flex items-center space-x-2 text-gray-800">
                                    <Monitor className="h-5 w-5 text-blue-600" />
                                    <span>Device Usage Distribution</span>
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="p-6">
                                <ResponsiveContainer width="100%" height={300}>
                                    <PieChart>
                                        <Pie
                                            data={deviceStats}
                                            cx="50%"
                                            cy="50%"
                                            outerRadius={80}
                                            fill="#8884d8"
                                            dataKey="users"
                                            label={({ device, users }) => `${device}: ${users}%`}
                                        >
                                            {deviceStats.map((entry, index) => (
                                                <Cell key={`cell-${index}`} fill={entry.color} />
                                            ))}
                                        </Pie>
                                        <Tooltip
                                            contentStyle={{
                                                backgroundColor: 'white',
                                                border: '1px solid #e5e7eb',
                                                borderRadius: '8px',
                                                boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)'
                                            }}
                                        />
                                    </PieChart>
                                </ResponsiveContainer>
                                <div className="mt-4 space-y-2">
                                    {deviceStats.map((device, index) => (
                                        <div key={index} className="flex items-center justify-between text-sm p-2 bg-gray-50 rounded border border-gray-100">
                                            <div className="flex items-center space-x-2">
                                                <div
                                                    className="w-3 h-3 rounded-full"
                                                    style={{ backgroundColor: device.color }}
                                                ></div>
                                                <span className="text-gray-700 font-medium">{device.device}</span>
                                            </div>
                                            <span className="text-gray-900 font-semibold">{device.count} users</span>
                                        </div>
                                    ))}
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </TabsContent>

                {/* Revenue Analytics */}
                <TabsContent value="revenue" className="space-y-6">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        {/* Revenue Trend */}
                        <Card className="bg-white border-gray-200">
                            <CardHeader className="border-b border-gray-100">
                                <CardTitle className="flex items-center space-x-2 text-gray-800">
                                    <CreditCard className="h-5 w-5 text-blue-600" />
                                    <span>Revenue Growth</span>
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="p-6">
                                <ResponsiveContainer width="100%" height={300}>
                                    <LineChart data={revenueData}>
                                        <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                                        <XAxis
                                            dataKey="month"
                                            axisLine={false}
                                            tickLine={false}
                                            tick={{ fill: '#6B7280', fontSize: 12 }}
                                        />
                                        <YAxis
                                            axisLine={false}
                                            tickLine={false}
                                            tick={{ fill: '#6B7280', fontSize: 12 }}
                                            tickFormatter={(value) => `₹${(value / 1000).toFixed(0)}k`}
                                        />
                                        <Tooltip
                                            contentStyle={{
                                                backgroundColor: 'white',
                                                border: '1px solid #e5e7eb',
                                                borderRadius: '8px',
                                                boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)'
                                            }}
                                            formatter={(value: any) => [`₹${value.toLocaleString()}`, 'Revenue']}
                                        />
                                        <Line
                                            type="monotone"
                                            dataKey="revenue"
                                            stroke="#10B981"
                                            strokeWidth={3}
                                            dot={{ fill: '#10B981', strokeWidth: 2, r: 4 }}
                                            activeDot={{ r: 6, stroke: '#10B981', strokeWidth: 2 }}
                                        />
                                    </LineChart>
                                </ResponsiveContainer>
                            </CardContent>
                        </Card>

                        {/* Subscription Growth */}
                        <Card className="bg-white border-gray-200">
                            <CardHeader className="border-b border-gray-100">
                                <CardTitle className="flex items-center space-x-2 text-gray-800">
                                    <TrendingUp className="h-5 w-5 text-blue-600" />
                                    <span>Subscription Growth</span>
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="p-6">
                                <ResponsiveContainer width="100%" height={300}>
                                    <BarChart data={revenueData}>
                                        <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                                        <XAxis
                                            dataKey="month"
                                            axisLine={false}
                                            tickLine={false}
                                            tick={{ fill: '#6B7280', fontSize: 12 }}
                                        />
                                        <YAxis
                                            axisLine={false}
                                            tickLine={false}
                                            tick={{ fill: '#6B7280', fontSize: 12 }}
                                        />
                                        <Tooltip
                                            contentStyle={{
                                                backgroundColor: 'white',
                                                border: '1px solid #e5e7eb',
                                                borderRadius: '8px',
                                                boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)'
                                            }}
                                        />
                                        <Bar
                                            dataKey="subscriptions"
                                            fill="#8B5CF6"
                                            radius={[4, 4, 0, 0]}
                                            name="Subscriptions"
                                        />
                                    </BarChart>
                                </ResponsiveContainer>
                            </CardContent>
                        </Card>
                    </div>
                </TabsContent>

                {/* Geographic Analytics */}
                <TabsContent value="geographic" className="space-y-6">
                    <Card className="bg-white border-gray-200">
                        <CardHeader className="border-b border-gray-100">
                            <CardTitle className="flex items-center space-x-2 text-gray-800">
                                <Globe className="h-5 w-5 text-blue-600" />
                                <span>Geographic Distribution</span>
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="p-6">
                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                                <ResponsiveContainer width="100%" height={300}>
                                    <PieChart>
                                        <Pie
                                            data={geographicData}
                                            cx="50%"
                                            cy="50%"
                                            outerRadius={100}
                                            fill="#8884d8"
                                            dataKey="users"
                                            label={({ country, percentage }) => `${country}: ${percentage}%`}
                                        >
                                            {geographicData.map((entry, index) => (
                                                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                            ))}
                                        </Pie>
                                        <Tooltip
                                            contentStyle={{
                                                backgroundColor: 'white',
                                                border: '1px solid #e5e7eb',
                                                borderRadius: '8px',
                                                boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)'
                                            }}
                                        />
                                    </PieChart>
                                </ResponsiveContainer>
                                <div className="space-y-3">
                                    {geographicData.map((country, index) => (
                                        <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg border border-gray-200">
                                            <div className="flex items-center space-x-3">
                                                <div
                                                    className="w-4 h-4 rounded-full"
                                                    style={{ backgroundColor: COLORS[index % COLORS.length] }}
                                                ></div>
                                                <span className="font-medium text-gray-800">{country.country}</span>
                                            </div>
                                            <div className="text-right">
                                                <p className="font-semibold text-gray-900">{country.users.toLocaleString()}</p>
                                                <p className="text-sm text-gray-600">{country.percentage}%</p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>

                {/* Engagement Analytics */}
                <TabsContent value="engagement" className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                        {userEngagement.map((engagement, index) => (
                            <Card key={index} className="bg-white border-gray-200">
                                <CardContent className="p-6">
                                    <div className="flex items-center justify-between mb-2">
                                        <Eye className="h-5 w-5 text-blue-600" />
                                        <Badge variant={engagement.changeType === 'increase' ? 'default' : 'destructive'} className="text-xs">
                                            {engagement.changeType === 'increase' ? (
                                                <TrendingUp className="h-3 w-3 mr-1" />
                                            ) : (
                                                <TrendingDown className="h-3 w-3 mr-1" />
                                            )}
                                            {engagement.change}
                                        </Badge>
                                    </div>
                                    <div>
                                        <p className="text-2xl font-bold text-gray-900 mb-1">{engagement.value}</p>
                                        <p className="text-sm font-medium text-gray-700">{engagement.metric}</p>
                                    </div>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                </TabsContent>
            </Tabs>
        </div>
    );
}
