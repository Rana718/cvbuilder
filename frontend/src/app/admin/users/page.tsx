"use client";

import React, { useState } from "react";
import {
    Search,
    Filter,
    Download,
    Plus,
    MoreHorizontal,
    Eye,
    Edit,
    Trash2,
    Crown,
    Mail,
    Phone,
    Calendar,
    MapPin,
    Ban,
    CheckCircle,
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
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";

// Extended user data
const usersData = [
    {
        id: 1,
        name: "John Doe",
        email: "john@example.com",
        phone: "+91 9876543210",
        avatar: "",
        status: "Active",
        subscription: "Premium",
        resumes: 5,
        joinDate: "2024-01-15",
        lastLogin: "2024-09-01",
        location: "Mumbai, India",
        totalSpent: "₹270",
        loginCount: 45,
    },
    {
        id: 2,
        name: "Sarah Wilson",
        email: "sarah@example.com",
        phone: "+91 8765432109",
        avatar: "",
        status: "Active",
        subscription: "Free",
        resumes: 1,
        joinDate: "2024-02-20",
        lastLogin: "2024-08-30",
        location: "Delhi, India",
        totalSpent: "₹0",
        loginCount: 12,
    },
    {
        id: 3,
        name: "Mike Johnson",
        email: "mike@example.com",
        phone: "+91 7654321098",
        avatar: "",
        status: "Suspended",
        subscription: "Premium",
        resumes: 8,
        joinDate: "2024-01-08",
        lastLogin: "2024-08-25",
        location: "Bangalore, India",
        totalSpent: "₹450",
        loginCount: 89,
    },
    {
        id: 4,
        name: "Emily Chen",
        email: "emily@example.com",
        phone: "+91 6543210987",
        avatar: "",
        status: "Active",
        subscription: "Free",
        resumes: 1,
        joinDate: "2024-03-10",
        lastLogin: "2024-09-01",
        location: "Chennai, India",
        totalSpent: "₹0",
        loginCount: 8,
    },
    {
        id: 5,
        name: "David Brown",
        email: "david@example.com",
        phone: "+91 5432109876",
        avatar: "",
        status: "Active",
        subscription: "Premium",
        resumes: 12,
        joinDate: "2024-01-25",
        lastLogin: "2024-08-31",
        location: "Pune, India",
        totalSpent: "₹360",
        loginCount: 156,
    },
    {
        id: 6,
        name: "Lisa Rodriguez",
        email: "lisa@example.com",
        phone: "+91 4321098765",
        avatar: "",
        status: "Inactive",
        subscription: "Free",
        resumes: 0,
        joinDate: "2024-04-05",
        lastLogin: "2024-07-15",
        location: "Hyderabad, India",
        totalSpent: "₹0",
        loginCount: 3,
    },
];

export default function UsersPage() {
    const [searchTerm, setSearchTerm] = useState("");
    const [statusFilter, setStatusFilter] = useState("all");
    const [subscriptionFilter, setSubscriptionFilter] = useState("all");
    const [selectedUser, setSelectedUser] = useState<any>(null);

    const getStatusBadge = (status: string) => {
        switch (status) {
            case "Active":
                return <Badge className="bg-green-100 text-green-800 hover:bg-green-100">Active</Badge>;
            case "Inactive":
                return <Badge className="bg-gray-100 text-gray-800 hover:bg-gray-100">Inactive</Badge>;
            case "Suspended":
                return <Badge className="bg-red-100 text-red-800 hover:bg-red-100">Suspended</Badge>;
            default:
                return <Badge variant="secondary">{status}</Badge>;
        }
    };

    const getSubscriptionBadge = (subscription: string) => {
        switch (subscription) {
            case "Premium":
                return <Badge className="bg-purple-100 text-purple-800 hover:bg-purple-100">
                    <Crown className="h-3 w-3 mr-1" />
                    Premium
                </Badge>;
            case "Free":
                return <Badge className="bg-gray-100 text-gray-800 hover:bg-gray-100">Free</Badge>;
            default:
                return <Badge variant="secondary">{subscription}</Badge>;
        }
    };

    const filteredUsers = usersData.filter((user) => {
        const matchesSearch =
            user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
            user.phone.includes(searchTerm);
        const matchesStatus = statusFilter === "all" || user.status.toLowerCase() === statusFilter;
        const matchesSubscription = subscriptionFilter === "all" || user.subscription.toLowerCase() === subscriptionFilter;
        return matchesSearch && matchesStatus && matchesSubscription;
    });

    return (
        <div className="p-4 lg:p-8 space-y-6">
            {/* Header */}
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900">User Management</h1>
                    <p className="text-gray-600">Manage and monitor all platform users</p>
                </div>
                <div className="flex items-center space-x-3">
                    <Button variant="outline" size="sm">
                        <Download className="h-4 w-4 mr-2" />
                        Export Users
                    </Button>
                    <Button size="sm">
                        <Plus className="h-4 w-4 mr-2" />
                        Add User
                    </Button>
                </div>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <Card>
                    <CardContent className="p-4">
                        <div className="text-2xl font-bold text-blue-600">{usersData.length}</div>
                        <p className="text-sm text-gray-600">Total Users</p>
                    </CardContent>
                </Card>
                <Card>
                    <CardContent className="p-4">
                        <div className="text-2xl font-bold text-green-600">
                            {usersData.filter(u => u.status === "Active").length}
                        </div>
                        <p className="text-sm text-gray-600">Active Users</p>
                    </CardContent>
                </Card>
                <Card>
                    <CardContent className="p-4">
                        <div className="text-2xl font-bold text-purple-600">
                            {usersData.filter(u => u.subscription === "Premium").length}
                        </div>
                        <p className="text-sm text-gray-600">Premium Users</p>
                    </CardContent>
                </Card>
                <Card>
                    <CardContent className="p-4">
                        <div className="text-2xl font-bold text-orange-600">
                            {usersData.reduce((sum, u) => sum + u.resumes, 0)}
                        </div>
                        <p className="text-sm text-gray-600">Total Resumes</p>
                    </CardContent>
                </Card>
            </div>

            {/* Filters */}
            <Card>
                <CardContent className="p-6">
                    <div className="flex flex-col lg:flex-row space-y-4 lg:space-y-0 lg:space-x-4">
                        <div className="relative flex-1">
                            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                            <Input
                                placeholder="Search by name, email, or phone..."
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
                                <SelectItem value="inactive">Inactive</SelectItem>
                                <SelectItem value="suspended">Suspended</SelectItem>
                            </SelectContent>
                        </Select>
                        <Select value={subscriptionFilter} onValueChange={setSubscriptionFilter}>
                            <SelectTrigger className="w-full lg:w-40 border border-black">
                                <SelectValue placeholder="Subscription" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">All Plans</SelectItem>
                                <SelectItem value="free">Free</SelectItem>
                                <SelectItem value="premium">Premium</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                </CardContent>
            </Card>

            {/* Users Table */}
            <Card>
                <CardContent className="p-0">
                    <div className="overflow-x-auto">
                        <Table>
                            <TableHeader>
                                <TableRow className="bg-gray-50">
                                    <TableHead>User</TableHead>
                                    <TableHead>Contact</TableHead>
                                    <TableHead>Status</TableHead>
                                    <TableHead>Subscription</TableHead>
                                    <TableHead>Resumes</TableHead>
                                    <TableHead>Total Spent</TableHead>
                                    <TableHead>Last Login</TableHead>
                                    <TableHead className="text-right">Actions</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {filteredUsers.map((user) => (
                                    <TableRow key={user.id} className="hover:bg-gray-50">
                                        <TableCell>
                                            <div className="flex items-center space-x-3">
                                                <Avatar>
                                                    <AvatarImage src={user.avatar} />
                                                    <AvatarFallback className="bg-blue-100 text-blue-700">
                                                        {user.name.split(" ").map((n) => n[0]).join("")}
                                                    </AvatarFallback>
                                                </Avatar>
                                                <div>
                                                    <div className="font-medium text-gray-900">{user.name}</div>
                                                    <div className="text-sm text-gray-500">ID: {user.id}</div>
                                                </div>
                                            </div>
                                        </TableCell>
                                        <TableCell>
                                            <div className="space-y-1">
                                                <div className="flex items-center text-sm text-gray-600">
                                                    <Mail className="h-3 w-3 mr-2" />
                                                    {user.email}
                                                </div>
                                                <div className="flex items-center text-sm text-gray-600">
                                                    <Phone className="h-3 w-3 mr-2" />
                                                    {user.phone}
                                                </div>
                                            </div>
                                        </TableCell>
                                        <TableCell>{getStatusBadge(user.status)}</TableCell>
                                        <TableCell>{getSubscriptionBadge(user.subscription)}</TableCell>
                                        <TableCell>
                                            <div className="font-medium">{user.resumes}</div>
                                        </TableCell>
                                        <TableCell>
                                            <div className="font-medium text-green-600">{user.totalSpent}</div>
                                        </TableCell>
                                        <TableCell>
                                            <div className="text-sm">{user.lastLogin}</div>
                                        </TableCell>
                                        <TableCell className="text-right">
                                            <DropdownMenu>
                                                <DropdownMenuTrigger asChild>
                                                    <Button variant="ghost" size="sm">
                                                        <MoreHorizontal className="h-4 w-4" />
                                                    </Button>
                                                </DropdownMenuTrigger>
                                                <DropdownMenuContent align="end">
                                                    <Dialog>
                                                        <DialogTrigger asChild>
                                                            <DropdownMenuItem onSelect={(e) => {
                                                                e.preventDefault();
                                                                setSelectedUser(user);
                                                            }}>
                                                                <Eye className="h-4 w-4 mr-2" />
                                                                View Details
                                                            </DropdownMenuItem>
                                                        </DialogTrigger>
                                                    </Dialog>
                                                    <DropdownMenuItem>
                                                        <Edit className="h-4 w-4 mr-2" />
                                                        Edit User
                                                    </DropdownMenuItem>
                                                    <DropdownMenuSeparator />
                                                    {user.status === "Active" ? (
                                                        <DropdownMenuItem className="text-orange-600">
                                                            <Ban className="h-4 w-4 mr-2" />
                                                            Suspend User
                                                        </DropdownMenuItem>
                                                    ) : (
                                                        <DropdownMenuItem className="text-green-600">
                                                            <CheckCircle className="h-4 w-4 mr-2" />
                                                            Activate User
                                                        </DropdownMenuItem>
                                                    )}
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

            {/* User Details Dialog */}
            {selectedUser && (
                <Dialog open={!!selectedUser} onOpenChange={() => setSelectedUser(null)}>
                    <DialogContent className="max-w-2xl">
                        <DialogHeader>
                            <DialogTitle>User Details</DialogTitle>
                            <DialogDescription>
                                Complete information about {selectedUser.name}
                            </DialogDescription>
                        </DialogHeader>
                        <div className="space-y-6">
                            {/* Profile Section */}
                            <div className="flex items-center space-x-4 p-4 bg-gray-50 rounded-lg">
                                <Avatar className="h-16 w-16">
                                    <AvatarImage src={selectedUser.avatar} />
                                    <AvatarFallback className="bg-blue-100 text-blue-700 text-lg">
                                        {selectedUser.name.split(" ").map((n: string) => n[0]).join("")}
                                    </AvatarFallback>
                                </Avatar>
                                <div className="flex-1">
                                    <h3 className="text-xl font-semibold text-gray-900">{selectedUser.name}</h3>
                                    <div className="flex items-center space-x-4 mt-1">
                                        {getStatusBadge(selectedUser.status)}
                                        {getSubscriptionBadge(selectedUser.subscription)}
                                    </div>
                                </div>
                            </div>

                            {/* Details Grid */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="space-y-3">
                                    <div className="flex items-center space-x-3">
                                        <Mail className="h-4 w-4 text-gray-400" />
                                        <span className="text-sm text-gray-600">Email</span>
                                    </div>
                                    <p className="text-sm font-medium ml-7">{selectedUser.email}</p>

                                    <div className="flex items-center space-x-3">
                                        <Phone className="h-4 w-4 text-gray-400" />
                                        <span className="text-sm text-gray-600">Phone</span>
                                    </div>
                                    <p className="text-sm font-medium ml-7">{selectedUser.phone}</p>

                                    <div className="flex items-center space-x-3">
                                        <MapPin className="h-4 w-4 text-gray-400" />
                                        <span className="text-sm text-gray-600">Location</span>
                                    </div>
                                    <p className="text-sm font-medium ml-7">{selectedUser.location}</p>
                                </div>

                                <div className="space-y-3">
                                    <div className="flex items-center space-x-3">
                                        <Calendar className="h-4 w-4 text-gray-400" />
                                        <span className="text-sm text-gray-600">Join Date</span>
                                    </div>
                                    <p className="text-sm font-medium ml-7">{selectedUser.joinDate}</p>

                                    <div className="flex items-center space-x-3">
                                        <CheckCircle className="h-4 w-4 text-gray-400" />
                                        <span className="text-sm text-gray-600">Last Login</span>
                                    </div>
                                    <p className="text-sm font-medium ml-7">{selectedUser.lastLogin}</p>

                                    <div className="flex items-center space-x-3">
                                        <Crown className="h-4 w-4 text-gray-400" />
                                        <span className="text-sm text-gray-600">Total Spent</span>
                                    </div>
                                    <p className="text-sm font-medium ml-7 text-green-600">{selectedUser.totalSpent}</p>
                                </div>
                            </div>

                            {/* Stats */}
                            <div className="grid grid-cols-3 gap-4 pt-4 border-t">
                                <div className="text-center">
                                    <div className="text-2xl font-bold text-blue-600">{selectedUser.resumes}</div>
                                    <p className="text-sm text-gray-600">Resumes Created</p>
                                </div>
                                <div className="text-center">
                                    <div className="text-2xl font-bold text-green-600">{selectedUser.loginCount}</div>
                                    <p className="text-sm text-gray-600">Total Logins</p>
                                </div>
                                <div className="text-center">
                                    <div className="text-2xl font-bold text-purple-600">
                                        {Math.floor((new Date().getTime() - new Date(selectedUser.joinDate).getTime()) / (1000 * 60 * 60 * 24))}
                                    </div>
                                    <p className="text-sm text-gray-600">Days Active</p>
                                </div>
                            </div>
                        </div>
                    </DialogContent>
                </Dialog>
            )}
        </div>
    );
}
