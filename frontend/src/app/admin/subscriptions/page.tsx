"use client";

import React, { useState } from "react";
import {
    CreditCard,
    Crown,
    Users,
    TrendingUp,
    TrendingDown,
    Calendar,
    DollarSign,
    RefreshCw,
    XCircle,
    CheckCircle,
    Search,
    Filter,
    Download,
    MoreHorizontal,
    Eye,
    Ban,
    AlertTriangle,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
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

// Mock subscription data
const subscriptionStats = [
    {
        title: "Total Subscribers",
        value: "892",
        change: "+12.5%",
        changeType: "increase",
        icon: Crown,
        description: "Premium users",
    },
    {
        title: "Monthly Revenue",
        value: "₹80,280",
        change: "+8.2%",
        changeType: "increase",
        icon: DollarSign,
        description: "This month",
    },
    {
        title: "Conversion Rate",
        value: "31.3%",
        change: "+2.1%",
        changeType: "increase",
        icon: TrendingUp,
        description: "Free to Premium",
    },
    {
        title: "Churn Rate",
        value: "2.4%",
        change: "-0.8%",
        changeType: "decrease",
        icon: RefreshCw,
        description: "Monthly churn",
    },
];

const subscriptionsData = [
    {
        id: "SUB001",
        user: {
            name: "John Doe",
            email: "john@example.com",
            avatar: "",
        },
        plan: "Premium",
        status: "Active",
        startDate: "2024-01-15",
        nextBilling: "2024-09-15",
        amount: "₹90",
        paymentMethod: "Credit Card",
        resumes: 12,
    },
    {
        id: "SUB002",
        user: {
            name: "Sarah Wilson",
            email: "sarah@example.com",
            avatar: "",
        },
        plan: "Premium",
        status: "Active",
        startDate: "2024-02-20",
        nextBilling: "2024-09-20",
        amount: "₹90",
        paymentMethod: "UPI",
        resumes: 8,
    },
    {
        id: "SUB003",
        user: {
            name: "Mike Johnson",
            email: "mike@example.com",
            avatar: "",
        },
        plan: "Premium",
        status: "Cancelled",
        startDate: "2024-01-08",
        nextBilling: "N/A",
        amount: "₹90",
        paymentMethod: "Credit Card",
        resumes: 15,
    },
    {
        id: "SUB004",
        user: {
            name: "Emily Chen",
            email: "emily@example.com",
            avatar: "",
        },
        plan: "Premium",
        status: "Past Due",
        startDate: "2024-03-10",
        nextBilling: "2024-08-25",
        amount: "₹90",
        paymentMethod: "Debit Card",
        resumes: 6,
    },
    {
        id: "SUB005",
        user: {
            name: "David Brown",
            email: "david@example.com",
            avatar: "",
        },
        plan: "Premium",
        status: "Active",
        startDate: "2024-01-25",
        nextBilling: "2024-09-25",
        amount: "₹90",
        paymentMethod: "Net Banking",
        resumes: 20,
    },
];

const revenueBreakdown = [
    { month: "Jan", revenue: 34200, subscribers: 380 },
    { month: "Feb", revenue: 37800, subscribers: 420 },
    { month: "Mar", revenue: 43200, subscribers: 480 },
    { month: "Apr", revenue: 48600, subscribers: 540 },
    { month: "May", revenue: 55800, subscribers: 620 },
    { month: "Jun", revenue: 63900, subscribers: 710 },
    { month: "Jul", revenue: 70200, subscribers: 780 },
    { month: "Aug", revenue: 78300, subscribers: 870 },
];

const paymentMethods = [
    { method: "UPI", percentage: 45, count: 401 },
    { method: "Credit Card", percentage: 30, count: 268 },
    { method: "Debit Card", percentage: 15, count: 134 },
    { method: "Net Banking", percentage: 10, count: 89 },
];

const upcomingRenewals = [
    { user: "John Doe", plan: "Premium", renewDate: "2024-09-15", amount: "₹90" },
    { user: "Sarah Wilson", plan: "Premium", renewDate: "2024-09-17", amount: "₹90" },
    { user: "Lisa Rodriguez", plan: "Premium", renewDate: "2024-09-20", amount: "₹90" },
    { user: "David Brown", plan: "Premium", renewDate: "2024-09-25", amount: "₹90" },
    { user: "Emily Chen", plan: "Premium", renewDate: "2024-09-28", amount: "₹90" },
];

// Color palette for charts
const COLORS = ['#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6', '#6B7280'];

export default function SubscriptionsPage() {
    const [searchTerm, setSearchTerm] = useState("");
    const [statusFilter, setStatusFilter] = useState("all");

    const getStatusBadge = (status: string) => {
        switch (status) {
            case "Active":
                return <Badge className="bg-green-100 text-green-800 hover:bg-green-100">
                    <CheckCircle className="h-3 w-3 mr-1" />
                    Active
                </Badge>;
            case "Cancelled":
                return <Badge className="bg-red-100 text-red-800 hover:bg-red-100">
                    <XCircle className="h-3 w-3 mr-1" />
                    Cancelled
                </Badge>;
            case "Past Due":
                return <Badge className="bg-orange-100 text-orange-800 hover:bg-orange-100">
                    <AlertTriangle className="h-3 w-3 mr-1" />
                    Past Due
                </Badge>;
            default:
                return <Badge variant="secondary">{status}</Badge>;
        }
    };

    const filteredSubscriptions = subscriptionsData.filter((sub) => {
        const matchesSearch =
            sub.user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            sub.user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
            sub.id.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesStatus = statusFilter === "all" || sub.status.toLowerCase() === statusFilter;
        return matchesSearch && matchesStatus;
    });

    return (
        <div className="p-4 lg:p-8 space-y-8 bg-gray-50 min-h-screen">
            {/* Header */}
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900">Subscription Management</h1>
                    <p className="text-gray-600">Monitor and manage all premium subscriptions</p>
                </div>
                <div className="flex items-center space-x-3">
                    <Button variant="outline" size="sm">
                        <Download className="h-4 w-4 mr-2" />
                        Export Data
                    </Button>
                    <Button size="sm">
                        <Filter className="h-4 w-4 mr-2" />
                        Advanced Filters
                    </Button>
                </div>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {subscriptionStats.map((stat, index) => (
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

            {/* Subscription Analytics Tabs */}
            <Tabs defaultValue="overview" className="space-y-6">
                <TabsList className="grid w-full grid-cols-2 lg:w-auto lg:grid-cols-4 bg-white border border-gray-200">
                    <TabsTrigger value="overview" className="data-[state=active]:bg-blue-600 data-[state=active]:text-white">Overview</TabsTrigger>
                    <TabsTrigger value="subscriptions" className="data-[state=active]:bg-blue-600 data-[state=active]:text-white">Subscriptions</TabsTrigger>
                    <TabsTrigger value="revenue" className="data-[state=active]:bg-blue-600 data-[state=active]:text-white">Revenue</TabsTrigger>
                    <TabsTrigger value="renewals" className="data-[state=active]:bg-blue-600 data-[state=active]:text-white">Renewals</TabsTrigger>
                </TabsList>

                {/* Overview Tab */}
                <TabsContent value="overview" className="space-y-6">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        {/* Revenue Growth Chart */}
                        <Card className="bg-white border-gray-200">
                            <CardHeader className="border-b border-gray-100">
                                <CardTitle className="flex items-center space-x-2 text-gray-800">
                                    <DollarSign className="h-5 w-5 text-blue-600" />
                                    <span>Revenue Growth</span>
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="p-6">
                                <ResponsiveContainer width="100%" height={300}>
                                    <LineChart data={revenueBreakdown}>
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
                                            formatter={(value: any, name: string) => [
                                                name === 'revenue' ? `₹${value.toLocaleString()}` : value,
                                                name === 'revenue' ? 'Revenue' : 'Subscribers'
                                            ]}
                                        />
                                        <Legend />
                                        <Line
                                            type="monotone"
                                            dataKey="revenue"
                                            stroke="#10B981"
                                            strokeWidth={3}
                                            dot={{ fill: '#10B981', strokeWidth: 2, r: 4 }}
                                            activeDot={{ r: 6, stroke: '#10B981', strokeWidth: 2 }}
                                            name="Revenue"
                                        />
                                        <Line
                                            type="monotone"
                                            dataKey="subscribers"
                                            stroke="#3B82F6"
                                            strokeWidth={2}
                                            dot={{ fill: '#3B82F6', strokeWidth: 2, r: 3 }}
                                            activeDot={{ r: 5, stroke: '#3B82F6', strokeWidth: 2 }}
                                            name="Subscribers"
                                        />
                                    </LineChart>
                                </ResponsiveContainer>
                            </CardContent>
                        </Card>

                        {/* Payment Methods Chart */}
                        <Card className="bg-white border-gray-200">
                            <CardHeader className="border-b border-gray-100">
                                <CardTitle className="flex items-center space-x-2 text-gray-800">
                                    <CreditCard className="h-5 w-5 text-blue-600" />
                                    <span>Payment Methods Distribution</span>
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="p-6">
                                <ResponsiveContainer width="100%" height={300}>
                                    <PieChart>
                                        <Pie
                                            data={paymentMethods}
                                            cx="50%"
                                            cy="50%"
                                            outerRadius={80}
                                            fill="#8884d8"
                                            dataKey="percentage"
                                            label={({ method, percentage }) => `${method}: ${percentage}%`}
                                        >
                                            {paymentMethods.map((entry, index) => (
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
                                <div className="mt-4 space-y-2">
                                    {paymentMethods.map((method, index) => (
                                        <div key={index} className="flex items-center justify-between text-sm p-2 bg-gray-50 rounded border border-gray-100">
                                            <div className="flex items-center space-x-2">
                                                <div
                                                    className="w-3 h-3 rounded-full"
                                                    style={{ backgroundColor: COLORS[index % COLORS.length] }}
                                                ></div>
                                                <span className="text-gray-700 font-medium">{method.method}</span>
                                            </div>
                                            <div className="text-right">
                                                <span className="text-gray-900 font-semibold">{method.count} users</span>
                                                <span className="text-gray-600 ml-2">({method.percentage}%)</span>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </TabsContent>

                {/* Subscriptions Tab */}
                <TabsContent value="subscriptions" className="space-y-6">
                    {/* Filters */}
                    <Card>
                        <CardContent className="p-6">
                            <div className="flex flex-col lg:flex-row space-y-4 lg:space-y-0 lg:space-x-4">
                                <div className="relative flex-1">
                                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                                    <Input
                                        placeholder="Search by name, email, or subscription ID..."
                                        value={searchTerm}
                                        onChange={(e) => setSearchTerm(e.target.value)}
                                        className="pl-10 border border-black"
                                    />
                                </div>
                                <Select value={statusFilter} onValueChange={setStatusFilter}>
                                    <SelectTrigger className="w-full lg:w-40 border border-black">
                                        <SelectValue placeholder="Status" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="all">All Status</SelectItem>
                                        <SelectItem value="active">Active</SelectItem>
                                        <SelectItem value="cancelled">Cancelled</SelectItem>
                                        <SelectItem value="past due">Past Due</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Subscriptions Table */}
                    <Card>
                        <CardContent className="p-0">
                            <div className="overflow-x-auto">
                                <Table>
                                    <TableHeader>
                                        <TableRow className="bg-gray-50">
                                            <TableHead>Subscriber</TableHead>
                                            <TableHead>Subscription ID</TableHead>
                                            <TableHead>Status</TableHead>
                                            <TableHead>Plan</TableHead>
                                            <TableHead>Start Date</TableHead>
                                            <TableHead>Next Billing</TableHead>
                                            <TableHead>Amount</TableHead>
                                            <TableHead>Resumes</TableHead>
                                            <TableHead className="text-right">Actions</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {filteredSubscriptions.map((subscription) => (
                                            <TableRow key={subscription.id} className="hover:bg-gray-50">
                                                <TableCell>
                                                    <div className="flex items-center space-x-3">
                                                        <Avatar>
                                                            <AvatarImage src={subscription.user.avatar} />
                                                            <AvatarFallback className="bg-purple-100 text-purple-700">
                                                                {subscription.user.name.split(" ").map((n) => n[0]).join("")}
                                                            </AvatarFallback>
                                                        </Avatar>
                                                        <div>
                                                            <div className="font-medium text-gray-900">{subscription.user.name}</div>
                                                            <div className="text-sm text-gray-500">{subscription.user.email}</div>
                                                        </div>
                                                    </div>
                                                </TableCell>
                                                <TableCell>
                                                    <div className="font-mono text-sm">{subscription.id}</div>
                                                </TableCell>
                                                <TableCell>{getStatusBadge(subscription.status)}</TableCell>
                                                <TableCell>
                                                    <Badge className="bg-purple-100 text-purple-800 hover:bg-purple-100">
                                                        <Crown className="h-3 w-3 mr-1" />
                                                        {subscription.plan}
                                                    </Badge>
                                                </TableCell>
                                                <TableCell>{subscription.startDate}</TableCell>
                                                <TableCell>{subscription.nextBilling}</TableCell>
                                                <TableCell>
                                                    <div className="font-medium text-green-600">{subscription.amount}</div>
                                                </TableCell>
                                                <TableCell>{subscription.resumes}</TableCell>
                                                <TableCell className="text-right">
                                                    <DropdownMenu>
                                                        <DropdownMenuTrigger asChild>
                                                            <Button variant="ghost" size="sm">
                                                                <MoreHorizontal className="h-4 w-4" />
                                                            </Button>
                                                        </DropdownMenuTrigger>
                                                        <DropdownMenuContent align="end">
                                                            <DropdownMenuItem>
                                                                <Eye className="h-4 w-4 mr-2" />
                                                                View Details
                                                            </DropdownMenuItem>
                                                            <DropdownMenuItem>
                                                                <RefreshCw className="h-4 w-4 mr-2" />
                                                                Manage Billing
                                                            </DropdownMenuItem>
                                                            <DropdownMenuSeparator />
                                                            <DropdownMenuItem className="text-red-600">
                                                                <Ban className="h-4 w-4 mr-2" />
                                                                Cancel Subscription
                                                            </DropdownMenuItem>
                                                        </DropdownMenuContent>
                                                    </DropdownMenu>
                                                </TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>

                {/* Revenue Tab */}
                <TabsContent value="revenue" className="space-y-6">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        {/* Monthly Revenue Chart */}
                        <Card className="bg-white border-gray-200">
                            <CardHeader className="border-b border-gray-100">
                                <CardTitle className="flex items-center space-x-2 text-gray-800">
                                    <DollarSign className="h-5 w-5 text-blue-600" />
                                    <span>Monthly Revenue Breakdown</span>
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="p-6">
                                <ResponsiveContainer width="100%" height={300}>
                                    <BarChart data={revenueBreakdown}>
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
                                        <Bar
                                            dataKey="revenue"
                                            fill="#10B981"
                                            radius={[4, 4, 0, 0]}
                                            name="Revenue"
                                        />
                                    </BarChart>
                                </ResponsiveContainer>
                            </CardContent>
                        </Card>

                        {/* Revenue Summary */}
                        <Card className="bg-white border-gray-200">
                            <CardHeader className="border-b border-gray-100">
                                <CardTitle className="text-gray-800">Revenue Summary</CardTitle>
                            </CardHeader>
                            <CardContent className="p-6 space-y-4">
                                <div className="p-4 bg-gradient-to-r from-green-50 to-emerald-50 rounded-lg border border-green-100">
                                    <h3 className="font-semibold text-green-900 mb-1">Total Revenue</h3>
                                    <p className="text-2xl font-bold text-green-600">₹4,32,080</p>
                                    <p className="text-sm text-green-600">All time</p>
                                </div>
                                <div className="p-4 bg-gradient-to-r from-blue-50 to-cyan-50 rounded-lg border border-blue-100">
                                    <h3 className="font-semibold text-blue-900 mb-1">This Month</h3>
                                    <p className="text-2xl font-bold text-blue-600">₹78,300</p>
                                    <p className="text-sm text-blue-600">+11.5% from last month</p>
                                </div>
                                <div className="p-4 bg-gradient-to-r from-purple-50 to-violet-50 rounded-lg border border-purple-100">
                                    <h3 className="font-semibold text-purple-900 mb-1">Average Per User</h3>
                                    <p className="text-2xl font-bold text-purple-600">₹90</p>
                                    <p className="text-sm text-purple-600">Monthly revenue</p>
                                </div>
                                <div className="p-4 bg-gradient-to-r from-orange-50 to-amber-50 rounded-lg border border-orange-100">
                                    <h3 className="font-semibold text-orange-900 mb-1">Growth Rate</h3>
                                    <p className="text-2xl font-bold text-orange-600">+12.5%</p>
                                    <p className="text-sm text-orange-600">vs last month</p>
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </TabsContent>

                {/* Renewals Tab */}
                <TabsContent value="renewals" className="space-y-6">
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center space-x-2">
                                <Calendar className="h-5 w-5" />
                                <span>Upcoming Renewals</span>
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-4">
                                {upcomingRenewals.map((renewal, index) => (
                                    <div key={index} className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50">
                                        <div className="flex items-center space-x-4">
                                            <Avatar>
                                                <AvatarFallback className="bg-blue-100 text-blue-700">
                                                    {renewal.user.split(" ").map((n) => n[0]).join("")}
                                                </AvatarFallback>
                                            </Avatar>
                                            <div>
                                                <h4 className="font-medium">{renewal.user}</h4>
                                                <p className="text-sm text-gray-500">{renewal.plan} Plan</p>
                                            </div>
                                        </div>
                                        <div className="text-right">
                                            <p className="font-medium">{renewal.renewDate}</p>
                                            <p className="text-sm text-green-600">{renewal.amount}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>
            </Tabs>
        </div>
    );
}
