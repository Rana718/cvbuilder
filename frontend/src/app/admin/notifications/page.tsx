"use client";

import React, { useState } from "react";
import {
    Bell,
    Send,
    Users,
    Mail,
    Smartphone,
    Eye,
    Edit,
    Trash2,
    Plus,
    Filter,
    Search,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";

const notificationStats = [
    {
        title: "Total Sent",
        value: "12,847",
        icon: Send,
        color: "text-blue-600",
        bgColor: "bg-blue-50",
    },
    {
        title: "Email Notifications",
        value: "8,234",
        icon: Mail,
        color: "text-green-600",
        bgColor: "bg-green-50",
    },
    {
        title: "Push Notifications",
        value: "4,613",
        icon: Smartphone,
        color: "text-purple-600",
        bgColor: "bg-purple-50",
    },
    {
        title: "Active Recipients",
        value: "2,847",
        icon: Users,
        color: "text-orange-600",
        bgColor: "bg-orange-50",
    },
];

const notificationsData = [
    {
        id: "NOT001",
        title: "Welcome to Premium!",
        message: "Thank you for upgrading to Premium. Enjoy unlimited resumes!",
        type: "Email",
        recipients: 45,
        status: "Sent",
        date: "2024-09-01 14:30",
        openRate: "78%",
    },
    {
        id: "NOT002",
        title: "New Template Available",
        message: "Check out our new Creative Designer template!",
        type: "Push",
        recipients: 2847,
        status: "Sent",
        date: "2024-08-31 10:15",
        openRate: "65%",
    },
    {
        id: "NOT003",
        title: "Payment Failed",
        message: "Your payment could not be processed. Please update your payment method.",
        type: "Email",
        recipients: 12,
        status: "Sent",
        date: "2024-08-30 16:45",
        openRate: "92%",
    },
    {
        id: "NOT004",
        title: "Resume Tips Weekly",
        message: "5 tips to make your resume stand out from the crowd",
        type: "Email",
        recipients: 1234,
        status: "Scheduled",
        date: "2024-09-05 09:00",
        openRate: "-",
    },
];

export default function NotificationManagement() {
    const [searchTerm, setSearchTerm] = useState("");
    const [typeFilter, setTypeFilter] = useState("all");
    const [newNotification, setNewNotification] = useState({
        title: "",
        message: "",
        type: "email",
        audience: "all",
    });

    const getStatusBadge = (status: string) => {
        switch (status) {
            case "Sent":
                return <Badge className="bg-green-100 text-green-800 hover:bg-green-100">Sent</Badge>;
            case "Scheduled":
                return <Badge className="bg-blue-100 text-blue-800 hover:bg-blue-100">Scheduled</Badge>;
            case "Draft":
                return <Badge className="bg-gray-100 text-gray-800 hover:bg-gray-100">Draft</Badge>;
            default:
                return <Badge variant="secondary">{status}</Badge>;
        }
    };

    const filteredNotifications = notificationsData.filter((notification) => {
        const matchesSearch = notification.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                            notification.message.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesType = typeFilter === "all" || notification.type.toLowerCase() === typeFilter;
        return matchesSearch && matchesType;
    });

    const handleSendNotification = () => {
        console.log("Sending notification:", newNotification);
        // Reset form
        setNewNotification({
            title: "",
            message: "",
            type: "email",
            audience: "all",
        });
    };

    return (
        <div className="p-4 lg:p-8 space-y-8">
            {/* Header */}
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900">Notification Management</h1>
                    <p className="text-gray-600">Send and manage notifications to your users</p>
                </div>
                <Dialog>
                    <DialogTrigger asChild>
                        <Button>
                            <Plus className="h-4 w-4 mr-2" />
                            Create Notification
                        </Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-2xl">
                        <DialogHeader>
                            <DialogTitle>Create New Notification</DialogTitle>
                            <DialogDescription>
                                Send a notification to your users via email or push notification
                            </DialogDescription>
                        </DialogHeader>
                        <div className="space-y-6">
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-gray-700">Title</label>
                                <Input
                                    value={newNotification.title}
                                    onChange={(e) => setNewNotification({...newNotification, title: e.target.value})}
                                    placeholder="Enter notification title"
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-gray-700">Message</label>
                                <Textarea
                                    value={newNotification.message}
                                    onChange={(e) => setNewNotification({...newNotification, message: e.target.value})}
                                    placeholder="Enter notification message"
                                    rows={4}
                                />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-gray-700">Type</label>
                                    <Select
                                        value={newNotification.type}
                                        onValueChange={(value) => setNewNotification({...newNotification, type: value})}
                                    >
                                        <SelectTrigger>
                                            <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="email">Email</SelectItem>
                                            <SelectItem value="push">Push Notification</SelectItem>
                                            <SelectItem value="both">Both</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-gray-700">Audience</label>
                                    <Select
                                        value={newNotification.audience}
                                        onValueChange={(value) => setNewNotification({...newNotification, audience: value})}
                                    >
                                        <SelectTrigger>
                                            <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="all">All Users</SelectItem>
                                            <SelectItem value="premium">Premium Users</SelectItem>
                                            <SelectItem value="free">Free Users</SelectItem>
                                            <SelectItem value="inactive">Inactive Users</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                            </div>
                            <div className="flex justify-end space-x-3">
                                <Button variant="outline">Save as Draft</Button>
                                <Button onClick={handleSendNotification}>
                                    <Send className="h-4 w-4 mr-2" />
                                    Send Now
                                </Button>
                            </div>
                        </div>
                    </DialogContent>
                </Dialog>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {notificationStats.map((stat, index) => (
                    <Card key={index} className="hover:shadow-lg transition-shadow">
                        <CardContent className="p-6">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm font-medium text-gray-600">{stat.title}</p>
                                    <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                                </div>
                                <div className={`${stat.bgColor} p-3 rounded-lg`}>
                                    <stat.icon className={`h-6 w-6 ${stat.color}`} />
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>

            {/* Notification Management */}
            <Tabs defaultValue="all" className="space-y-6">
                <TabsList>
                    <TabsTrigger value="all">All Notifications</TabsTrigger>
                    <TabsTrigger value="templates">Templates</TabsTrigger>
                    <TabsTrigger value="scheduled">Scheduled</TabsTrigger>
                </TabsList>

                <TabsContent value="all" className="space-y-6">
                    {/* Filters */}
                    <Card>
                        <CardContent className="p-6">
                            <div className="flex flex-col lg:flex-row space-y-4 lg:space-y-0 lg:space-x-4">
                                <div className="relative flex-1">
                                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                                    <Input
                                        placeholder="Search notifications..."
                                        value={searchTerm}
                                        onChange={(e) => setSearchTerm(e.target.value)}
                                        className="pl-10"
                                    />
                                </div>
                                <Select value={typeFilter} onValueChange={setTypeFilter}>
                                    <SelectTrigger className="w-full lg:w-40">
                                        <SelectValue placeholder="Type" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="all">All Types</SelectItem>
                                        <SelectItem value="email">Email</SelectItem>
                                        <SelectItem value="push">Push</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Notifications Table */}
                    <Card>
                        <CardContent className="p-0">
                            <div className="overflow-x-auto">
                                <Table>
                                    <TableHeader>
                                        <TableRow className="bg-gray-50">
                                            <TableHead>Title</TableHead>
                                            <TableHead>Type</TableHead>
                                            <TableHead>Recipients</TableHead>
                                            <TableHead>Status</TableHead>
                                            <TableHead>Open Rate</TableHead>
                                            <TableHead>Date</TableHead>
                                            <TableHead className="text-right">Actions</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {filteredNotifications.map((notification) => (
                                            <TableRow key={notification.id} className="hover:bg-gray-50">
                                                <TableCell>
                                                    <div>
                                                        <div className="font-medium text-gray-900">{notification.title}</div>
                                                        <div className="text-sm text-gray-500 truncate max-w-xs">
                                                            {notification.message}
                                                        </div>
                                                    </div>
                                                </TableCell>
                                                <TableCell>
                                                    <Badge variant="outline" className="flex items-center w-fit">
                                                        {notification.type === "Email" ? (
                                                            <Mail className="h-3 w-3 mr-1" />
                                                        ) : (
                                                            <Smartphone className="h-3 w-3 mr-1" />
                                                        )}
                                                        {notification.type}
                                                    </Badge>
                                                </TableCell>
                                                <TableCell>{notification.recipients.toLocaleString()}</TableCell>
                                                <TableCell>{getStatusBadge(notification.status)}</TableCell>
                                                <TableCell>
                                                    <span className="font-medium text-green-600">{notification.openRate}</span>
                                                </TableCell>
                                                <TableCell>{notification.date}</TableCell>
                                                <TableCell className="text-right">
                                                    <div className="flex items-center justify-end space-x-2">
                                                        <Button variant="ghost" size="sm">
                                                            <Eye className="h-4 w-4" />
                                                        </Button>
                                                        <Button variant="ghost" size="sm">
                                                            <Edit className="h-4 w-4" />
                                                        </Button>
                                                        <Button variant="ghost" size="sm">
                                                            <Trash2 className="h-4 w-4" />
                                                        </Button>
                                                    </div>
                                                </TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>

                <TabsContent value="templates">
                    <Card>
                        <CardHeader>
                            <CardTitle>Notification Templates</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                {[
                                    { name: "Welcome Email", description: "Welcome new users to the platform" },
                                    { name: "Payment Success", description: "Confirm successful payment" },
                                    { name: "Payment Failed", description: "Notify about failed payment" },
                                    { name: "New Feature", description: "Announce new features" },
                                    { name: "Weekly Tips", description: "Send weekly resume tips" },
                                    { name: "Subscription Expiry", description: "Remind about expiring subscription" },
                                ].map((template, index) => (
                                    <Card key={index} className="hover:shadow-md transition-shadow cursor-pointer">
                                        <CardContent className="p-4">
                                            <h3 className="font-medium text-gray-900 mb-2">{template.name}</h3>
                                            <p className="text-sm text-gray-600 mb-4">{template.description}</p>
                                            <div className="flex justify-end space-x-2">
                                                <Button variant="outline" size="sm">Edit</Button>
                                                <Button size="sm">Use</Button>
                                            </div>
                                        </CardContent>
                                    </Card>
                                ))}
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>

                <TabsContent value="scheduled">
                    <Card>
                        <CardHeader>
                            <CardTitle>Scheduled Notifications</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-4">
                                {notificationsData.filter(n => n.status === "Scheduled").map((notification, index) => (
                                    <div key={index} className="flex items-center justify-between p-4 border rounded-lg">
                                        <div>
                                            <h3 className="font-medium text-gray-900">{notification.title}</h3>
                                            <p className="text-sm text-gray-600">{notification.message}</p>
                                            <p className="text-xs text-gray-500 mt-1">
                                                Scheduled for {notification.date} • {notification.recipients} recipients
                                            </p>
                                        </div>
                                        <div className="flex items-center space-x-2">
                                            <Button variant="outline" size="sm">Edit</Button>
                                            <Button variant="outline" size="sm">Cancel</Button>
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
