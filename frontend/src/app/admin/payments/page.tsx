"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
    DollarSign,
    TrendingUp,
    Users,
    CheckCircle,
    Clock,
    X,
    Search,
    RefreshCw,
    AlertTriangle,
} from "lucide-react";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from "recharts";
import { usePaymentManagement } from "@/hooks/usePaymentManagement";

export default function PaymentManagement() {
    const [searchTerm, setSearchTerm] = useState("");
    const [statusFilter, setStatusFilter] = useState("all");
    const { data, loading, error, refetch } = usePaymentManagement();

    // Format currency values
    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat('en-IN', {
            style: 'currency',
            currency: 'INR',
            minimumFractionDigits: 0,
        }).format(amount / 100); // Convert paise to rupees
    };

    // Format percentage
    const formatPercentage = (percentage: number) => {
        const sign = percentage >= 0 ? '+' : '';
        return `${sign}${percentage.toFixed(1)}%`;
    };

    // Prepare stats data
    const paymentStats = data ? [
        {
            title: "Total Revenue",
            value: formatCurrency(data.revenue_metrics.total_revenue),
            change: formatPercentage(data.revenue_metrics.revenue_growth_percentage),
            icon: DollarSign,
            color: "text-green-600",
            bgColor: "bg-green-50",
        },
        {
            title: "This Month",
            value: formatCurrency(data.revenue_metrics.current_month_revenue),
            change: formatPercentage(data.revenue_metrics.revenue_growth_percentage),
            icon: TrendingUp,
            color: "text-blue-600",
            bgColor: "bg-blue-50",
        },
        {
            title: "Active Subscriptions",
            value: data.subscription_metrics.active_subscriptions.toString(),
            change: formatPercentage(data.subscription_metrics.subscription_growth_percentage),
            icon: Users,
            color: "text-purple-600",
            bgColor: "bg-purple-50",
        },
        {
            title: "Success Rate",
            value: `${data.success_rate_metrics.current_success_rate.toFixed(1)}%`,
            change: formatPercentage(data.success_rate_metrics.success_rate_change),
            icon: CheckCircle,
            color: "text-emerald-600",
            bgColor: "bg-emerald-50",
        },
    ] : [];

    const getStatusBadge = (status: string) => {
        const normalizedStatus = status.toLowerCase();
        switch (normalizedStatus) {
            case "captured":
            case "success":
            case "completed":
                return (
                    <Badge className="bg-green-100 text-green-800 hover:bg-green-100">
                        <CheckCircle className="h-3 w-3 mr-1" />
                        Success
                    </Badge>
                );
            case "failed":
            case "error":
                return (
                    <Badge className="bg-red-100 text-red-800 hover:bg-red-100">
                        <X className="h-3 w-3 mr-1" />
                        Failed
                    </Badge>
                );
            case "pending":
            case "processing":
                return (
                    <Badge className="bg-yellow-100 text-yellow-800 hover:bg-yellow-100">
                        <Clock className="h-3 w-3 mr-1" />
                        Pending
                    </Badge>
                );
            default:
                return <Badge variant="secondary">{status}</Badge>;
        }
    };

    const filteredPayments = data?.payment_transactions.filter((payment) => {
        const matchesSearch =
            payment.user_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            payment.user_email.toLowerCase().includes(searchTerm.toLowerCase()) ||
            payment.transaction_id.toLowerCase().includes(searchTerm.toLowerCase());

        const normalizedStatus = payment.status.toLowerCase();
        let matchesStatus = false;

        if (statusFilter === "all") {
            matchesStatus = true;
        } else if (statusFilter === "success") {
            matchesStatus = normalizedStatus === "captured" || normalizedStatus === "success" || normalizedStatus === "completed";
        } else if (statusFilter === "failed") {
            matchesStatus = normalizedStatus === "failed" || normalizedStatus === "error";
        } else if (statusFilter === "pending") {
            matchesStatus = normalizedStatus === "pending" || normalizedStatus === "processing";
        }

        return matchesSearch && matchesStatus;
    }) || [];

    // Prepare chart data for payment methods
    const chartData = data?.payment_method_distribution.map((method, index) => ({
        name: method.method || "Unknown",
        value: method.count,
        percentage: method.percentage,
        fill: `hsl(${(index * 137.5) % 360}, 70%, 50%)`, // Generate distinct colors
    })) || [];

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-[400px]">
                <div className="flex items-center space-x-2">
                    <RefreshCw className="h-6 w-6 animate-spin" />
                    <span>Loading payment data...</span>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="p-4 lg:p-8">
                <Alert variant="destructive">
                    <AlertTriangle className="h-4 w-4" />
                    <AlertDescription>
                        Failed to load payment data. Please try again.
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={refetch}
                            className="ml-4"
                        >
                            <RefreshCw className="h-4 w-4 mr-2" />
                            Retry
                        </Button>
                    </AlertDescription>
                </Alert>
            </div>
        );
    }

    return (
        <div className="p-4 lg:p-8 space-y-8">
            {/* Header */}
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Payment Management</h1>
                    <p className="text-muted-foreground">Monitor and manage payment transactions and revenue</p>
                </div>
                <Button onClick={refetch} variant="outline">
                    <RefreshCw className="h-4 w-4 mr-2" />
                    Refresh Data
                </Button>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {paymentStats.map((stat, index) => {
                    const Icon = stat.icon;
                    const isPositive = !stat.change.includes('-');
                    return (
                        <Card key={index}>
                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
                                <div className={`p-2 rounded-lg ${stat.bgColor}`}>
                                    <Icon className={`h-4 w-4 ${stat.color}`} />
                                </div>
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold">{stat.value}</div>
                                <p className={`text-xs ${isPositive ? 'text-green-600' : 'text-red-600'}`}>
                                    {stat.change} from last month
                                </p>
                            </CardContent>
                        </Card>
                    );
                })}
            </div>

            {/* Payment Method Distribution */}
            {data && data.payment_method_distribution.length > 0 && (
                <Card>
                    <CardHeader>
                        <CardTitle>Payment Method Distribution</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="flex flex-col lg:flex-row items-center space-y-4 lg:space-y-0 lg:space-x-8">
                            <div className="w-full lg:w-1/2 h-64">
                                <ResponsiveContainer width="100%" height="100%">
                                    <PieChart>
                                        <Pie
                                            data={chartData}
                                            cx="50%"
                                            cy="50%"
                                            innerRadius={60}
                                            outerRadius={100}
                                            paddingAngle={5}
                                            dataKey="value"
                                        >
                                            {chartData.map((entry, index) => (
                                                <Cell key={`cell-${index}`} fill={entry.fill} />
                                            ))}
                                        </Pie>
                                        <Tooltip
                                            formatter={(value, name) => [`${value} transactions`, name]}
                                        />
                                    </PieChart>
                                </ResponsiveContainer>
                            </div>
                            <div className="w-full lg:w-1/2 space-y-3">
                                {data.payment_method_distribution.map((method, index) => (
                                    <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                                        <div className="flex items-center space-x-3">
                                            <div
                                                className="w-4 h-4 rounded-full"
                                                style={{ backgroundColor: chartData[index]?.fill }}
                                            />
                                            <span className="font-medium">{method.method || "Unknown"}</span>
                                        </div>
                                        <div className="text-right">
                                            <div className="font-semibold">{method.count} transactions</div>
                                            <div className="text-sm text-gray-600">{method.percentage.toFixed(1)}%</div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </CardContent>
                </Card>
            )}

            {/* Recent Failed Payments */}
            {data && data.recent_failed_payments.length > 0 && (
                <Card>
                    <CardHeader>
                        <CardTitle className="text-red-600">Recent Failed Payments</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-3">
                            {data.recent_failed_payments.slice(0, 5).map((payment, index) => (
                                <div key={index} className="flex items-center justify-between p-3 bg-red-50 rounded-lg border border-red-200">
                                    <div className="flex items-center space-x-3">
                                        <Avatar className="h-8 w-8">
                                            <AvatarFallback className="bg-red-100 text-red-600">
                                                {payment.user_name.charAt(0).toUpperCase()}
                                            </AvatarFallback>
                                        </Avatar>
                                        <div>
                                            <p className="font-medium">{payment.user_name}</p>
                                            <p className="text-sm text-gray-600">{payment.user_email}</p>
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <p className="font-semibold text-red-600">{formatCurrency(payment.amount)}</p>
                                        <p className="text-sm text-gray-600">{payment.date}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>
            )}

            {/* Filters */}
            <Card>
                <CardHeader>
                    <CardTitle>Payment Transactions</CardTitle>
                    <div className="flex flex-col sm:flex-row gap-4">
                        <div className="relative flex-1">
                            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                            <Input
                                placeholder="Search by name, email, or transaction ID..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="pl-10"
                            />
                        </div>
                        <Select value={statusFilter} onValueChange={setStatusFilter}>
                            <SelectTrigger className="w-full sm:w-48">
                                <SelectValue placeholder="Filter by status" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">All Status</SelectItem>
                                <SelectItem value="success">Success</SelectItem>
                                <SelectItem value="failed">Failed</SelectItem>
                                <SelectItem value="pending">Pending</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                </CardHeader>
                <CardContent>
                    <div className="rounded-md border">
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>User</TableHead>
                                    <TableHead>Transaction ID</TableHead>
                                    <TableHead>Amount</TableHead>
                                    <TableHead>Method</TableHead>
                                    <TableHead>Status</TableHead>
                                    <TableHead>Date</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {filteredPayments.length === 0 ? (
                                    <TableRow>
                                        <TableCell colSpan={6} className="text-center py-8 text-gray-500">
                                            No payments found matching your criteria
                                        </TableCell>
                                    </TableRow>
                                ) : (
                                    filteredPayments.map((payment, index) => (
                                        <TableRow key={index}>
                                            <TableCell>
                                                <div className="flex items-center space-x-3">
                                                    <Avatar className="h-8 w-8">
                                                        <AvatarImage src={payment.user_image || undefined} />
                                                        <AvatarFallback>
                                                            {payment.user_name.charAt(0).toUpperCase()}
                                                        </AvatarFallback>
                                                    </Avatar>
                                                    <div>
                                                        <p className="font-medium">{payment.user_name}</p>
                                                        <p className="text-sm text-gray-600">{payment.user_email}</p>
                                                    </div>
                                                </div>
                                            </TableCell>
                                            <TableCell className="font-mono text-sm">{payment.transaction_id}</TableCell>
                                            <TableCell className="font-semibold">{formatCurrency(payment.amount)}</TableCell>
                                            <TableCell>{payment.method || "N/A"}</TableCell>
                                            <TableCell>{getStatusBadge(payment.status)}</TableCell>
                                            <TableCell>{payment.purchase_date}</TableCell>
                                        </TableRow>
                                    ))
                                )}
                            </TableBody>
                        </Table>
                    </div>

                    {filteredPayments.length > 0 && (
                        <div className="flex items-center justify-between pt-4">
                            <p className="text-sm text-gray-600">
                                Showing {filteredPayments.length} of {data?.payment_transactions.length || 0} transactions
                            </p>
                        </div>
                    )}
                </CardContent>
            </Card>
        </div>
    );
}
