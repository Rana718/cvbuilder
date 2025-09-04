"use client";

import React, { useState } from "react";
import {
    FileText,
    TrendingUp,
    Users,
    Download,
    Eye,
    Calendar,
    BarChart3,
    PieChart,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
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
    PieChart as RechartsPieChart,
    Pie,
    Cell,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    Legend,
    ResponsiveContainer,
} from "recharts";

const resumeStats = [
    {
        title: "Total Resumes",
        value: "15,439",
        change: "+24.1%",
        icon: FileText,
        color: "text-blue-600",
        bgColor: "bg-blue-50",
    },
    {
        title: "Completed Resumes",
        value: "12,847",
        change: "+18.5%",
        icon: TrendingUp,
        color: "text-green-600",
        bgColor: "bg-green-50",
    },
    {
        title: "Downloads",
        value: "8,456",
        change: "+32.2%",
        icon: Download,
        color: "text-purple-600",
        bgColor: "bg-purple-50",
    },
    {
        title: "Active Users",
        value: "2,847",
        change: "+12.5%",
        icon: Users,
        color: "text-orange-600",
        bgColor: "bg-orange-50",
    },
];

const resumeCreationData = [
    { month: "Jan", created: 1200, completed: 980, downloaded: 756 },
    { month: "Feb", created: 1450, completed: 1189, downloaded: 892 },
    { month: "Mar", created: 1680, completed: 1378, downloaded: 1034 },
    { month: "Apr", created: 1920, completed: 1574, downloaded: 1245 },
    { month: "May", created: 2150, completed: 1763, downloaded: 1398 },
    { month: "Jun", created: 2380, completed: 1952, downloaded: 1567 },
    { month: "Jul", created: 2580, completed: 2118, downloaded: 1689 },
    { month: "Aug", created: 2750, completed: 2258, downloaded: 1834 },
];

const templateUsageData = [
    { name: "Modern Professional", value: 35, count: 2847, color: "#3B82F6" },
    { name: "Creative Designer", value: 24, count: 1923, color: "#10B981" },
    { name: "Executive Elite", value: 20, count: 1654, color: "#8B5CF6" },
    { name: "Minimalist Clean", value: 15, count: 1234, color: "#F59E0B" },
    { name: "Others", value: 6, count: 481, color: "#6B7280" },
];

const sectionCompletionData = [
    { section: "Personal Info", completion: 98 },
    { section: "Work Experience", completion: 87 },
    { section: "Education", completion: 92 },
    { section: "Skills", completion: 89 },
    { section: "Summary", completion: 76 },
    { section: "Projects", completion: 64 },
    { section: "Certifications", completion: 45 },
];

const userEngagementData = [
    { day: "Mon", sessions: 420, avgTime: 18 },
    { day: "Tue", sessions: 380, avgTime: 22 },
    { day: "Wed", sessions: 450, avgTime: 19 },
    { day: "Thu", sessions: 520, avgTime: 25 },
    { day: "Fri", sessions: 480, avgTime: 21 },
    { day: "Sat", sessions: 320, avgTime: 16 },
    { day: "Sun", sessions: 280, avgTime: 14 },
];

// Custom label function for pie charts
const renderCustomLabel = (entry: any) => {
    const { cx, cy, midAngle, innerRadius, outerRadius, percent } = entry;
    const RADIAN = Math.PI / 180;
    const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
    const x = cx + radius * Math.cos(-midAngle * RADIAN);
    const y = cy + radius * Math.sin(-midAngle * RADIAN);

    // Only show label if percentage is >= 5% to avoid clutter
    if (percent * 100 >= 5) {
        return (
            <text 
                x={x} 
                y={y} 
                fill="white" 
                textAnchor={x > cx ? 'start' : 'end'} 
                dominantBaseline="central"
                fontSize={12}
                fontWeight="bold"
            >
                {`${(percent * 100).toFixed(0)}%`}
            </text>
        );
    }
    return null;
};

export default function ResumeAnalytics() {
    const [timeRange, setTimeRange] = useState("30d");

    return (
        <div className="p-4 lg:p-8 space-y-8">
            {/* Header */}
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900">Resume Analytics</h1>
                    <p className="text-gray-600">Comprehensive insights into resume creation and usage</p>
                </div>
                <div className="flex items-center space-x-3">
                    <Select value={timeRange} onValueChange={setTimeRange}>
                        <SelectTrigger className="w-40">
                            <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="7d">Last 7 days</SelectItem>
                            <SelectItem value="30d">Last 30 days</SelectItem>
                            <SelectItem value="90d">Last 90 days</SelectItem>
                            <SelectItem value="1y">Last year</SelectItem>
                        </SelectContent>
                    </Select>
                    <Button variant="outline" size="sm">
                        <Download className="h-4 w-4 mr-2" />
                        Export Report
                    </Button>
                </div>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {resumeStats.map((stat, index) => (
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

            {/* Analytics Tabs */}
            <Tabs defaultValue="overview" className="space-y-6">
                <TabsList className="grid w-full grid-cols-2 lg:w-auto lg:grid-cols-4">
                    <TabsTrigger value="overview">Overview</TabsTrigger>
                    <TabsTrigger value="templates">Templates</TabsTrigger>
                    <TabsTrigger value="completion">Completion</TabsTrigger>
                    <TabsTrigger value="engagement">Engagement</TabsTrigger>
                </TabsList>

                {/* Overview Tab */}
                <TabsContent value="overview" className="space-y-6">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        {/* Resume Creation Trend */}
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center space-x-2">
                                    <BarChart3 className="h-5 w-5" />
                                    <span>Resume Creation Trend</span>
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <ResponsiveContainer width="100%" height={300}>
                                    <AreaChart data={resumeCreationData}>
                                        <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                                        <XAxis dataKey="month" axisLine={false} tickLine={false} />
                                        <YAxis axisLine={false} tickLine={false} />
                                        <Tooltip />
                                        <Legend />
                                        <Area
                                            type="monotone"
                                            dataKey="created"
                                            stackId="1"
                                            stroke="#3B82F6"
                                            fill="#3B82F6"
                                            fillOpacity={0.6}
                                            name="Created"
                                        />
                                        <Area
                                            type="monotone"
                                            dataKey="completed"
                                            stackId="2"
                                            stroke="#10B981"
                                            fill="#10B981"
                                            fillOpacity={0.6}
                                            name="Completed"
                                        />
                                        <Area
                                            type="monotone"
                                            dataKey="downloaded"
                                            stackId="3"
                                            stroke="#8B5CF6"
                                            fill="#8B5CF6"
                                            fillOpacity={0.6}
                                            name="Downloaded"
                                        />
                                    </AreaChart>
                                </ResponsiveContainer>
                            </CardContent>
                        </Card>

                        {/* User Engagement */}
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center space-x-2">
                                    <Users className="h-5 w-5" />
                                    <span>Daily User Engagement</span>
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <ResponsiveContainer width="100%" height={300}>
                                    <BarChart data={userEngagementData}>
                                        <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                                        <XAxis dataKey="day" axisLine={false} tickLine={false} />
                                        <YAxis axisLine={false} tickLine={false} />
                                        <Tooltip />
                                        <Bar dataKey="sessions" fill="#3B82F6" radius={[4, 4, 0, 0]} name="Sessions" />
                                    </BarChart>
                                </ResponsiveContainer>
                            </CardContent>
                        </Card>
                    </div>

                    {/* Key Metrics */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <Card>
                            <CardContent className="p-6">
                                <div className="text-center">
                                    <div className="text-3xl font-bold text-blue-600 mb-2">83.2%</div>
                                    <p className="text-sm text-gray-600">Completion Rate</p>
                                    <p className="text-xs text-green-600 mt-1">+5.2% from last month</p>
                                </div>
                            </CardContent>
                        </Card>
                        <Card>
                            <CardContent className="p-6">
                                <div className="text-center">
                                    <div className="text-3xl font-bold text-green-600 mb-2">65.8%</div>
                                    <p className="text-sm text-gray-600">Download Rate</p>
                                    <p className="text-xs text-green-600 mt-1">+8.1% from last month</p>
                                </div>
                            </CardContent>
                        </Card>
                        <Card>
                            <CardContent className="p-6">
                                <div className="text-center">
                                    <div className="text-3xl font-bold text-purple-600 mb-2">19.5</div>
                                    <p className="text-sm text-gray-600">Avg. Time (minutes)</p>
                                    <p className="text-xs text-red-600 mt-1">-2.3% from last month</p>
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </TabsContent>

                {/* Templates Tab */}
                <TabsContent value="templates" className="space-y-6">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        {/* Template Usage Pie Chart */}
                        <Card>
                            <CardHeader>
                                <CardTitle>Template Usage Distribution</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <ResponsiveContainer width="100%" height={300}>
                                    <RechartsPieChart>
                                        <Pie
                                            data={templateUsageData}
                                            cx="50%"
                                            cy="50%"
                                            labelLine={false}
                                            label={renderCustomLabel}
                                            outerRadius={80}
                                            fill="#8884d8"
                                            dataKey="value"
                                        >
                                            {templateUsageData.map((entry, index) => (
                                                <Cell key={`cell-${index}`} fill={entry.color} />
                                            ))}
                                        </Pie>
                                        <Tooltip formatter={(value, name) => [`${value}%`, name]} />
                                        <Legend 
                                            formatter={(value, entry: any) =>
                                                entry && entry.payload && entry.payload.name
                                                    ? `${entry.payload.name}: ${value}%`
                                                    : `${value}%`
                                            }
                                        />
                                    </RechartsPieChart>
                                </ResponsiveContainer>
                            </CardContent>
                        </Card>

                        {/* Template Performance */}
                        <Card>
                            <CardHeader>
                                <CardTitle>Template Performance</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-4">
                                    {templateUsageData.map((template, index) => (
                                        <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                                            <div className="flex items-center space-x-3">
                                                <div
                                                    className="w-4 h-4 rounded-full"
                                                    style={{ backgroundColor: template.color }}
                                                ></div>
                                                <div>
                                                    <h4 className="font-medium text-gray-900">{template.name}</h4>
                                                    <p className="text-sm text-gray-600">{template.count} uses</p>
                                                </div>
                                            </div>
                                            <Badge variant="outline">{template.value}%</Badge>
                                        </div>
                                    ))}
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </TabsContent>

                {/* Completion Tab */}
                <TabsContent value="completion" className="space-y-6">
                    <Card>
                        <CardHeader>
                            <CardTitle>Section Completion Rates</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <ResponsiveContainer width="100%" height={400}>
                                <RechartsPieChart>
                                    <Pie
                                        data={sectionCompletionData.map((section, index) => ({
                                            ...section,
                                            color: ['#3B82F6', '#10B981', '#8B5CF6', '#F59E0B', '#EF4444', '#6B7280', '#EC4899'][index]
                                        }))}
                                        cx="50%"
                                        cy="50%"
                                        labelLine={false}
                                        label={({ section, percent }: any) => {
                                            if (typeof percent === 'number') {
                                                return `${section}: ${(percent * 100).toFixed(0)}%`;
                                            }
                                            return `${section}`;
                                        }}
                                        outerRadius={120}
                                        fill="#8884d8"
                                        dataKey="completion"
                                    >
                                        {sectionCompletionData.map((entry, index) => (
                                            <Cell key={`cell-${index}`} fill={['#3B82F6', '#10B981', '#8B5CF6', '#F59E0B', '#EF4444', '#6B7280', '#EC4899'][index]} />
                                        ))}
                                    </Pie>
                                    <Tooltip formatter={(value, name) => [`${value}%`, name]} />
                                </RechartsPieChart>
                            </ResponsiveContainer>
                        </CardContent>
                    </Card>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <Card>
                            <CardHeader>
                                <CardTitle>Drop-off Points</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-3">
                                    {[
                                        { step: "Work Experience", dropoff: "13%" },
                                        { step: "Summary Writing", dropoff: "24%" },
                                        { step: "Projects Section", dropoff: "36%" },
                                        { step: "Certifications", dropoff: "55%" },
                                    ].map((item, index) => (
                                        <div key={index} className="flex items-center justify-between p-3 bg-red-50 rounded-lg border border-red-100">
                                            <span className="text-sm font-medium text-gray-900">{item.step}</span>
                                            <Badge variant="destructive">{item.dropoff}</Badge>
                                        </div>
                                    ))}
                                </div>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader>
                                <CardTitle>Completion Time Analysis</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-4">
                                    <div className="text-center p-4 bg-blue-50 rounded-lg">
                                        <div className="text-2xl font-bold text-blue-600">19.5 min</div>
                                        <p className="text-sm text-gray-600">Average completion time</p>
                                    </div>
                                    <div className="grid grid-cols-2 gap-4 text-center">
                                        <div className="p-3 bg-green-50 rounded-lg">
                                            <div className="text-lg font-bold text-green-600">12.3 min</div>
                                            <p className="text-xs text-gray-600">Fastest 25%</p>
                                        </div>
                                        <div className="p-3 bg-orange-50 rounded-lg">
                                            <div className="text-lg font-bold text-orange-600">28.7 min</div>
                                            <p className="text-xs text-gray-600">Slowest 25%</p>
                                        </div>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </TabsContent>

                {/* Engagement Tab */}
                <TabsContent value="engagement" className="space-y-6">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        <Card>
                            <CardHeader>
                                <CardTitle>Session Duration Trends</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <ResponsiveContainer width="100%" height={300}>
                                    <LineChart data={userEngagementData}>
                                        <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                                        <XAxis dataKey="day" axisLine={false} tickLine={false} />
                                        <YAxis axisLine={false} tickLine={false} />
                                        <Tooltip />
                                        <Line
                                            type="monotone"
                                            dataKey="avgTime"
                                            stroke="#8B5CF6"
                                            strokeWidth={3}
                                            dot={{ fill: '#8B5CF6', strokeWidth: 2, r: 4 }}
                                            name="Avg Time (min)"
                                        />
                                    </LineChart>
                                </ResponsiveContainer>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader>
                                <CardTitle>User Behavior Insights</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-4">
                                    {[
                                        { metric: "Return Users", value: "68%", trend: "+5.2%" },
                                        { metric: "Multiple Resumes", value: "34%", trend: "+12.1%" },
                                        { metric: "Template Switches", value: "2.3", trend: "-8.5%" },
                                        { metric: "AI Suggestions Used", value: "78%", trend: "+15.3%" },
                                    ].map((item, index) => (
                                        <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                                            <div>
                                                <h4 className="font-medium text-gray-900">{item.metric}</h4>
                                                <p className="text-2xl font-bold text-blue-600">{item.value}</p>
                                            </div>
                                            <Badge variant={item.trend.startsWith('+') ? 'default' : 'destructive'}>
                                                {item.trend}
                                            </Badge>
                                        </div>
                                    ))}
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </TabsContent>
            </Tabs>
        </div>
    );
}