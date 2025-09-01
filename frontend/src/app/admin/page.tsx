"use client";

import React, { useState } from "react";
import {
    Users,
    CreditCard,
    FileText,
    TrendingUp,
    Search,
    Filter,
    Download,
    MoreHorizontal,
    Crown,
    CheckCircle,
    XCircle,
    Clock,
    Eye,
    Edit,
    Trash2,
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

// Mock data
const statsData = [
    {
        title: "Total Users",
        value: "2,847",
        change: "+12.5%",
        icon: Users,
        color: "text-blue-600",
        bgColor: "bg-blue-50",
    },
    {
        title: "Subscribed Users",
        value: "892",
        change: "+8.2%",
        icon: Crown,
        color: "text-purple-600",
        bgColor: "bg-purple-50",
    },
    {
        title: "Total Resumes",
        value: "15,439",
        change: "+24.1%",
        icon: FileText,
        color: "text-green-600",
        bgColor: "bg-green-50",
    },
    {
        title: "Revenue",
        value: "₹80,280",
        change: "+15.3%",
        icon: TrendingUp,
        color: "text-orange-600",
        bgColor: "bg-orange-50",
    },
];

const usersData = [
    {
        id: 1,
        name: "John Doe",
        email: "john@example.com",
        avatar: "",
        status: "Active",
        subscription: "Premium",
        resumes: 5,
        joinDate: "2024-01-15",
        lastLogin: "2024-09-01",
    },
    {
        id: 2,
        name: "Sarah Wilson",
        email: "sarah@example.com",
        avatar: "",
        status: "Active",
        subscription: "Free",
        resumes: 1,
        joinDate: "2024-02-20",
        lastLogin: "2024-08-30",
    },
    {
        id: 3,
        name: "Mike Johnson",
        email: "mike@example.com",
        avatar: "",
        status: "Inactive",
        subscription: "Premium",
        resumes: 8,
        joinDate: "2024-01-08",
        lastLogin: "2024-08-25",
    },
    {
        id: 4,
        name: "Emily Chen",
        email: "emily@example.com",
        avatar: "",
        status: "Active",
        subscription: "Free",
        resumes: 1,
        joinDate: "2024-03-10",
        lastLogin: "2024-09-01",
    },
    {
        id: 5,
        name: "David Brown",
        email: "david@example.com",
        avatar: "",
        status: "Active",
        subscription: "Premium",
        resumes: 12,
        joinDate: "2024-01-25",
        lastLogin: "2024-08-31",
    },
];

const recentActivities = [
    {
        user: "John Doe",
        action: "Created new resume",
        time: "2 minutes ago",
        type: "resume",
    },
    {
        user: "Sarah Wilson",
        action: "Upgraded to Premium",
        time: "15 minutes ago",
        type: "subscription",
    },
    {
        user: "Mike Johnson",
        action: "Downloaded resume PDF",
        time: "1 hour ago",
        type: "download",
    },
    {
        user: "Emily Chen",
        action: "Signed up",
        time: "2 hours ago",
        type: "signup",
    },
];

export default function AdminDashboard() {
    const [searchTerm, setSearchTerm] = useState("");
    const [statusFilter, setStatusFilter] = useState("all");

    const getStatusBadge = (status: string) => {
        switch (status) {
            case "Active":
                return <Badge className="bg-green-100 text-green-800 hover:bg-green-100">Active</Badge>;
            case "Inactive":
                return <Badge className="bg-red-100 text-red-800 hover:bg-red-100">Inactive</Badge>;
            default:
                return <Badge variant="secondary">{status}</Badge>;
        }
    };

    const getSubscriptionBadge = (subscription: string) => {
        switch (subscription) {
            case "Premium":
                return <Badge className="bg-purple-100 text-purple-800 hover:bg-purple-100">Premium</Badge>;
            case "Free":
                return <Badge className="bg-gray-100 text-gray-800 hover:bg-gray-100">Free</Badge>;
            default:
                return <Badge variant="secondary">{subscription}</Badge>;
        }
    };

    const filteredUsers = usersData.filter((user) => {
        const matchesSearch =
            user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            user.email.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesStatus = statusFilter === "all" || user.status.toLowerCase() === statusFilter;
        return matchesSearch && matchesStatus;
    });

    return (
        <div className="p-4 lg:p-8 space-y-8">
            {/* Header */}
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
                    <p className="text-gray-600">Welcome back! Here's what's happening with your platform.</p>
                </div>
                <div className="flex items-center space-x-3">
                    <Button variant="outline" size="sm">
                        <Download className="h-4 w-4 mr-2" />
                        Export Data
                    </Button>
                    <Button size="sm">
                        <Filter className="h-4 w-4 mr-2" />
                        Filters
                    </Button>
                </div>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {statsData.map((stat, index) => (
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

            {/* Main Content Tabs */}
            <Tabs defaultValue="users" className="space-y-6">
                <TabsList className="grid w-full grid-cols-2 lg:w-auto lg:grid-cols-3">
                    <TabsTrigger value="users">Users</TabsTrigger>
                    <TabsTrigger value="subscriptions">Subscriptions</TabsTrigger>
                    <TabsTrigger value="activity">Activity</TabsTrigger>
                </TabsList>

                {/* Users Tab */}
                <TabsContent value="users" className="space-y-6">
                    <Card>
                        <CardHeader>
                            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
                                <CardTitle>User Management</CardTitle>
                                <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-3">
                                    <div className="relative">
                                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                                        <Input
                                            placeholder="Search users..."
                                            value={searchTerm}
                                            onChange={(e) => setSearchTerm(e.target.value)}
                                            className="pl-10 w-full sm:w-80"
                                        />
                                    </div>
                                    <Select value={statusFilter} onValueChange={setStatusFilter}>
                                        <SelectTrigger className="w-full sm:w-40">
                                            <SelectValue placeholder="Filter by status" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="all">All Status</SelectItem>
                                            <SelectItem value="active">Active</SelectItem>
                                            <SelectItem value="inactive">Inactive</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                            </div>
                        </CardHeader>
                        <CardContent>
                            <div className="overflow-x-auto">
                                <Table>
                                    <TableHeader>
                                        <TableRow>
                                            <TableHead>User</TableHead>
                                            <TableHead>Status</TableHead>
                                            <TableHead>Subscription</TableHead>
                                            <TableHead>Resumes</TableHead>
                                            <TableHead>Join Date</TableHead>
                                            <TableHead>Last Login</TableHead>
                                            <TableHead className="text-right">Actions</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {filteredUsers.map((user) => (
                                            <TableRow key={user.id}>
                                                <TableCell>
                                                    <div className="flex items-center space-x-3">
                                                        <Avatar>
                                                            <AvatarImage src={user.avatar} />
                                                            <AvatarFallback>
                                                                {user.name.split(" ").map((n) => n[0]).join("")}
                                                            </AvatarFallback>
                                                        </Avatar>
                                                        <div>
                                                            <div className="font-medium">{user.name}</div>
                                                            <div className="text-sm text-gray-500">{user.email}</div>
                                                        </div>
                                                    </div>
                                                </TableCell>
                                                <TableCell>{getStatusBadge(user.status)}</TableCell>
                                                <TableCell>{getSubscriptionBadge(user.subscription)}</TableCell>
                                                <TableCell>{user.resumes}</TableCell>
                                                <TableCell>{user.joinDate}</TableCell>
                                                <TableCell>{user.lastLogin}</TableCell>
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
                                                                <Edit className="h-4 w-4 mr-2" />
                                                                Edit User
                                                            </DropdownMenuItem>
                                                            <DropdownMenuItem className="text-red-600">
                                                                <Trash2 className="h-4 w-4 mr-2" />
                                                                Delete User
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

                {/* Subscriptions Tab */}
                <TabsContent value="subscriptions">
                    <Card>
                        <CardHeader>
                            <CardTitle>Subscription Analytics</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                <div className="bg-gradient-to-r from-purple-50 to-blue-50 p-6 rounded-lg">
                                    <h3 className="font-semibold text-purple-900 mb-2">Premium Subscribers</h3>
                                    <p className="text-3xl font-bold text-purple-600">892</p>
                                    <p className="text-sm text-purple-600">31.3% of total users</p>
                                </div>
                                <div className="bg-gradient-to-r from-green-50 to-emerald-50 p-6 rounded-lg">
                                    <h3 className="font-semibold text-green-900 mb-2">Monthly Revenue</h3>
                                    <p className="text-3xl font-bold text-green-600">₹80,280</p>
                                    <p className="text-sm text-green-600">+15.3% this month</p>
                                </div>
                                <div className="bg-gradient-to-r from-orange-50 to-red-50 p-6 rounded-lg">
                                    <h3 className="font-semibold text-orange-900 mb-2">Avg. Revenue Per User</h3>
                                    <p className="text-3xl font-bold text-orange-600">₹90</p>
                                    <p className="text-sm text-orange-600">Per subscription</p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>

                {/* Activity Tab */}
                <TabsContent value="activity">
                    <Card>
                        <CardHeader>
                            <CardTitle>Recent Activity</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-4">
                                {recentActivities.map((activity, index) => (
                                    <div key={index} className="flex items-center space-x-4 p-4 bg-gray-50 rounded-lg">
                                        <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                                        <div className="flex-1">
                                            <p className="text-sm">
                                                <span className="font-medium">{activity.user}</span> {activity.action}
                                            </p>
                                            <p className="text-xs text-gray-500">{activity.time}</p>
                                        </div>
                                        <Badge variant="outline" className="text-xs">
                                            {activity.type}
                                        </Badge>
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