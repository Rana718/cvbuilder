"use client";

import React, { useState } from "react";
import {
    CreditCard,
    Search,
    Filter,
    Download,
    Eye,
    RefreshCw,
    CheckCircle,
    XCircle,
    Clock,
    DollarSign,
    TrendingUp,
    Users,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import {
    PieChart,
    Pie,
    Cell,
    Tooltip,
    ResponsiveContainer,
} from "recharts";

const paymentStats = [
    {
        title: "Total Revenue",
        value: "₹2,45,680",
        change: "+12.5%",
        icon: DollarSign,
        color: "text-green-600",
        bgColor: "bg-green-50",
    },
    {
        title: "This Month",
        value: "₹80,280",
        change: "+8.2%",
        icon: TrendingUp,
        color: "text-blue-600",
        bgColor: "bg-blue-50",
    },
    {
        title: "Active Subscriptions",
        value: "892",
        change: "+15.3%",
        icon: Users,
        color: "text-purple-600",
        bgColor: "bg-purple-50",
    },
    {
        title: "Success Rate",
        value: "98.5%",
        change: "+0.8%",
        icon: CheckCircle,
        color: "text-emerald-600",
        bgColor: "bg-emerald-50",
    },
];

const paymentsData = [
    {
        id: "PAY001",
        user: { name: "John Doe", email: "john@example.com" },
        amount: "₹90",
        status: "Success",
        method: "UPI",
        date: "2024-09-01 14:30",
        transactionId: "TXN123456789",
        plan: "Premium Monthly",
    },
    {
        id: "PAY002",
        user: { name: "Sarah Wilson", email: "sarah@example.com" },
        amount: "₹90",
        status: "Success",
        method: "Credit Card",
        date: "2024-09-01 12:15",
        transactionId: "TXN123456788",
        plan: "Premium Monthly",
    },
    {
        id: "PAY003",
        user: { name: "Mike Johnson", email: "mike@example.com" },
        amount: "₹90",
        status: "Failed",
        method: "Debit Card",
        date: "2024-08-31 18:45",
        transactionId: "TXN123456787",
        plan: "Premium Monthly",
    },
    {
        id: "PAY004",
        user: { name: "Emily Chen", email: "emily@example.com" },
        amount: "₹90",
        status: "Pending",
        method: "Net Banking",
        date: "2024-08-31 16:20",
        transactionId: "TXN123456786",
        plan: "Premium Monthly",
    },
    {
        id: "PAY005",
        user: { name: "David Brown", email: "david@example.com" },
        amount: "₹90",
        status: "Success",
        method: "UPI",
        date: "2024-08-30 10:30",
        transactionId: "TXN123456785",
        plan: "Premium Monthly",
    },
];

export default function PaymentManagement() {
    const [searchTerm, setSearchTerm] = useState("");
    const [statusFilter, setStatusFilter] = useState("all");

    const getStatusBadge = (status: string) => {
        switch (status) {
            case "Success":
                return <Badge className="bg-green-100 text-green-800 hover:bg-green-100">
                    <CheckCircle className="h-3 w-3 mr-1" />
                    Success
                </Badge>;
            case "Failed":
                return <Badge className="bg-red-100 text-red-800 hover:bg-red-100">
                    <XCircle className="h-3 w-3 mr-1" />
                    Failed
                </Badge>;
            case "Pending":
                return <Badge className="bg-yellow-100 text-yellow-800 hover:bg-yellow-100">
                    <Clock className="h-3 w-3 mr-1" />
                    Pending
                </Badge>;
            default:
                return <Badge variant="secondary">{status}</Badge>;
        }
    };

    const filteredPayments = paymentsData.filter((payment) => {
        const matchesSearch =
            payment.user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            payment.user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
            payment.transactionId.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesStatus = statusFilter === "all" || payment.status.toLowerCase() === statusFilter;
        return matchesSearch && matchesStatus;
    });

    return (
        <div className="p-4 lg:p-8 space-y-8">
            {/* Header */}
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900">Payment Management</h1>
                    <p className="text-gray-600">Monitor and manage all payment transactions</p>
                </div>
                <div className="flex items-center space-x-3">
                    <Button variant="outline" size="sm">
                        <Download className="h-4 w-4 mr-2" />
                        Export Payments
                    </Button>
                    <Button size="sm">
                        <RefreshCw className="h-4 w-4 mr-2" />
                        Refresh
                    </Button>
                </div>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {paymentStats.map((stat, index) => (
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

            {/* Filters */}
            <Card>
                <CardContent className="p-6">
                    <div className="flex flex-col lg:flex-row space-y-4 lg:space-y-0 lg:space-x-4">
                        <div className="relative flex-1">
                            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                            <Input
                                placeholder="Search by user, email, or transaction ID..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="pl-10"
                            />
                        </div>
                        <Select value={statusFilter} onValueChange={setStatusFilter}>
                            <SelectTrigger className="w-full lg:w-40">
                                <SelectValue placeholder="Status" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">All Status</SelectItem>
                                <SelectItem value="success">Success</SelectItem>
                                <SelectItem value="failed">Failed</SelectItem>
                                <SelectItem value="pending">Pending</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                </CardContent>
            </Card>

            {/* Payments Table */}
            <Card>
                <CardHeader>
                    <CardTitle>Payment Transactions</CardTitle>
                </CardHeader>
                <CardContent className="p-0">
                    <div className="overflow-x-auto">
                        <Table>
                            <TableHeader>
                                <TableRow className="bg-gray-50">
                                    <TableHead>User</TableHead>
                                    <TableHead>Transaction ID</TableHead>
                                    <TableHead>Amount</TableHead>
                                    <TableHead>Status</TableHead>
                                    <TableHead>Method</TableHead>
                                    <TableHead>Plan</TableHead>
                                    <TableHead>Date</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {filteredPayments.map((payment) => (
                                    <TableRow key={payment.id} className="hover:bg-gray-50">
                                        <TableCell>
                                            <div className="flex items-center space-x-3">
                                                <Avatar>
                                                    <AvatarFallback className="bg-blue-100 text-blue-700">
                                                        {payment.user.name.split(" ").map((n) => n[0]).join("")}
                                                    </AvatarFallback>
                                                </Avatar>
                                                <div>
                                                    <div className="font-medium text-gray-900">{payment.user.name}</div>
                                                    <div className="text-sm text-gray-500">{payment.user.email}</div>
                                                </div>
                                            </div>
                                        </TableCell>
                                        <TableCell>
                                            <div className="font-mono text-sm">{payment.transactionId}</div>
                                        </TableCell>
                                        <TableCell>
                                            <div className="font-medium text-green-600">{payment.amount}</div>
                                        </TableCell>
                                        <TableCell>{getStatusBadge(payment.status)}</TableCell>
                                        <TableCell>
                                            <Badge variant="outline">{payment.method}</Badge>
                                        </TableCell>
                                        <TableCell>{payment.plan}</TableCell>
                                        <TableCell>{payment.date}</TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </div>
                </CardContent>
            </Card>

            {/* Payment Methods Summary */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card>
                    <CardHeader>
                        <CardTitle>Payment Methods</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <ResponsiveContainer width="100%" height={300}>
                            <PieChart>
                                <Pie
                                    data={[
                                        { method: "UPI", count: 450, percentage: 45, color: "#3B82F6" },
                                        { method: "Credit Card", count: 300, percentage: 30, color: "#10B981" },
                                        { method: "Debit Card", count: 150, percentage: 15, color: "#F59E0B" },
                                        { method: "Net Banking", count: 100, percentage: 10, color: "#8B5CF6" },
                                    ]}
                                    cx="50%"
                                    cy="50%"
                                    outerRadius={80}
                                    fill="#8884d8"
                                    dataKey="percentage"
                                    label={({ method, percentage }) => `${method}: ${percentage}%`}
                                >
                                    {[
                                        { method: "UPI", count: 450, percentage: 45, color: "#3B82F6" },
                                        { method: "Credit Card", count: 300, percentage: 30, color: "#10B981" },
                                        { method: "Debit Card", count: 150, percentage: 15, color: "#F59E0B" },
                                        { method: "Net Banking", count: 100, percentage: 10, color: "#8B5CF6" },
                                    ].map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={entry.color} />
                                    ))}
                                </Pie>
                                <Tooltip />
                            </PieChart>
                        </ResponsiveContainer>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle>Recent Failed Payments</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-3">
                            {paymentsData.filter(p => p.status === "Failed").map((payment, index) => (
                                <div key={index} className="flex items-center justify-between p-3 bg-red-50 rounded-lg border border-red-100">
                                    <div>
                                        <p className="font-medium text-gray-900">{payment.user.name}</p>
                                        <p className="text-sm text-gray-500">{payment.transactionId}</p>
                                    </div>
                                    <div className="text-right">
                                        <p className="font-medium text-red-600">{payment.amount}</p>
                                        <p className="text-xs text-gray-500">{payment.date}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
