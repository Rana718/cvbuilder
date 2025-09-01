"use client";

import React, { useState } from "react";
import {
    Shield,
    AlertTriangle,
    Lock,
    Eye,
    Activity,
    Globe,
    Smartphone,
    Monitor,
    Key,
    UserX,
    Clock,
    MapPin,
    RefreshCw,
    Ban,
    CheckCircle,
    XCircle,
    Wifi,
    Fingerprint,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";

// Mock security data
const securityStats = [
    {
        title: "Security Score",
        value: "95%",
        change: "+2%",
        changeType: "increase",
        icon: Shield,
        description: "Overall security rating",
        color: "text-green-600",
        bgColor: "bg-green-50",
    },
    {
        title: "Active Sessions",
        value: "2,847",
        change: "+12%",
        changeType: "increase",
        icon: Activity,
        description: "Current user sessions",
        color: "text-blue-600",
        bgColor: "bg-blue-50",
    },
    {
        title: "Failed Logins",
        value: "23",
        change: "-45%",
        changeType: "decrease",
        icon: UserX,
        description: "Last 24 hours",
        color: "text-orange-600",
        bgColor: "bg-orange-50",
    },
    {
        title: "Security Alerts",
        value: "2",
        change: "-50%",
        changeType: "decrease",
        icon: AlertTriangle,
        description: "Active alerts",
        color: "text-red-600",
        bgColor: "bg-red-50",
    },
];

const securityAlerts = [
    {
        id: "ALT001",
        type: "Suspicious Login",
        severity: "High",
        user: "john@example.com",
        description: "Multiple failed login attempts from unknown IP",
        location: "Russia, Moscow",
        timestamp: "2024-09-01 14:30:00",
        status: "Active",
    },
    {
        id: "ALT002",
        type: "Unusual Activity",
        severity: "Medium",
        user: "sarah@example.com",
        description: "Large number of resume downloads in short time",
        location: "India, Mumbai",
        timestamp: "2024-09-01 12:15:00",
        status: "Investigating",
    },
];

const loginAttempts = [
    {
        user: "john@example.com",
        ip: "192.168.1.100",
        location: "Mumbai, India",
        device: "Desktop",
        browser: "Chrome",
        status: "Success",
        timestamp: "2024-09-01 15:30:00",
    },
    {
        user: "attacker@malicious.com",
        ip: "45.123.456.789",
        location: "Moscow, Russia",
        device: "Unknown",
        browser: "Unknown",
        status: "Failed",
        timestamp: "2024-09-01 14:30:00",
    },
    {
        user: "sarah@example.com",
        ip: "192.168.1.200",
        location: "Delhi, India",
        device: "Mobile",
        browser: "Safari",
        status: "Success",
        timestamp: "2024-09-01 13:45:00",
    },
    {
        user: "mike@example.com",
        ip: "192.168.1.150",
        location: "Bangalore, India",
        device: "Desktop",
        browser: "Firefox",
        status: "Success",
        timestamp: "2024-09-01 12:20:00",
    },
    {
        user: "unknown@spam.com",
        ip: "23.456.789.123",
        location: "Beijing, China",
        device: "Unknown",
        browser: "Unknown",
        status: "Blocked",
        timestamp: "2024-09-01 11:15:00",
    },
];

const activeSessions = [
    {
        user: "John Doe",
        email: "john@example.com",
        ip: "192.168.1.100",
        location: "Mumbai, India",
        device: "Desktop - Chrome",
        loginTime: "2024-09-01 09:30:00",
        lastActivity: "2024-09-01 15:45:00",
        status: "Active",
    },
    {
        user: "Sarah Wilson",
        email: "sarah@example.com",
        ip: "192.168.1.200",
        location: "Delhi, India",
        device: "Mobile - Safari",
        loginTime: "2024-09-01 08:15:00",
        lastActivity: "2024-09-01 15:30:00",
        status: "Active",
    },
    {
        user: "Mike Johnson",
        email: "mike@example.com",
        ip: "192.168.1.150",
        location: "Bangalore, India",
        device: "Desktop - Firefox",
        loginTime: "2024-09-01 07:45:00",
        lastActivity: "2024-09-01 14:20:00",
        status: "Idle",
    },
];

const securitySettings = [
    {
        title: "Two-Factor Authentication",
        description: "Require 2FA for all admin accounts",
        enabled: true,
    },
    {
        title: "Session Timeout",
        description: "Automatically log out inactive users after 30 minutes",
        enabled: true,
    },
    {
        title: "IP Whitelist",
        description: "Only allow access from approved IP addresses",
        enabled: false,
    },
    {
        title: "Failed Login Protection",
        description: "Lock accounts after 5 failed login attempts",
        enabled: true,
    },
    {
        title: "Email Notifications",
        description: "Send security alerts via email",
        enabled: true,
    },
    {
        title: "Device Verification",
        description: "Require verification for new devices",
        enabled: false,
    },
];

export default function SecurityPage() {
    const [settings, setSettings] = useState(securitySettings);

    const getSeverityBadge = (severity: string) => {
        switch (severity) {
            case "High":
                return <Badge className="bg-red-100 text-red-800 hover:bg-red-100">High</Badge>;
            case "Medium":
                return <Badge className="bg-orange-100 text-orange-800 hover:bg-orange-100">Medium</Badge>;
            case "Low":
                return <Badge className="bg-yellow-100 text-yellow-800 hover:bg-yellow-100">Low</Badge>;
            default:
                return <Badge variant="secondary">{severity}</Badge>;
        }
    };

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
            case "Blocked":
                return <Badge className="bg-orange-100 text-orange-800 hover:bg-orange-100">
                    <Ban className="h-3 w-3 mr-1" />
                    Blocked
                </Badge>;
            default:
                return <Badge variant="secondary">{status}</Badge>;
        }
    };

    const getSessionBadge = (status: string) => {
        switch (status) {
            case "Active":
                return <Badge className="bg-green-100 text-green-800 hover:bg-green-100">Active</Badge>;
            case "Idle":
                return <Badge className="bg-yellow-100 text-yellow-800 hover:bg-yellow-100">Idle</Badge>;
            case "Expired":
                return <Badge className="bg-gray-100 text-gray-800 hover:bg-gray-100">Expired</Badge>;
            default:
                return <Badge variant="secondary">{status}</Badge>;
        }
    };

    const toggleSetting = (index: number) => {
        const newSettings = [...settings];
        newSettings[index].enabled = !newSettings[index].enabled;
        setSettings(newSettings);
    };

    return (
        <div className="p-4 lg:p-8 space-y-8">
            {/* Header */}
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900">Security Center</h1>
                    <p className="text-gray-600">Monitor and manage platform security</p>
                </div>
                <div className="flex items-center space-x-3">
                    <Button variant="outline" size="sm">
                        <RefreshCw className="h-4 w-4 mr-2" />
                        Refresh Data
                    </Button>
                    <Button size="sm" variant="destructive">
                        <Ban className="h-4 w-4 mr-2" />
                        Emergency Lock
                    </Button>
                </div>
            </div>

            {/* Security Stats */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {securityStats.map((stat, index) => (
                    <Card key={index} className="hover:shadow-lg transition-shadow">
                        <CardContent className="p-6">
                            <div className="flex items-center justify-between mb-4">
                                <div className={`${stat.bgColor} p-3 rounded-lg`}>
                                    <stat.icon className={`h-6 w-6 ${stat.color}`} />
                                </div>
                                <Badge variant={stat.changeType === 'increase' ? 'default' : 'destructive'} className="text-xs">
                                    {stat.change}
                                </Badge>
                            </div>
                            <div>
                                <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                                <p className="text-sm text-gray-600">{stat.title}</p>
                                <p className="text-xs text-gray-500 mt-1">{stat.description}</p>
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>

            {/* Security Alerts */}
            {securityAlerts.length > 0 && (
                <Card className="border-red-200 bg-red-50">
                    <CardHeader>
                        <CardTitle className="flex items-center space-x-2 text-red-800">
                            <AlertTriangle className="h-5 w-5" />
                            <span>Active Security Alerts</span>
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4">
                            {securityAlerts.map((alert) => (
                                <div key={alert.id} className="bg-white p-4 rounded-lg border border-red-200">
                                    <div className="flex items-start justify-between">
                                        <div className="flex-1">
                                            <div className="flex items-center space-x-3 mb-2">
                                                <h4 className="font-semibold text-red-900">{alert.type}</h4>
                                                {getSeverityBadge(alert.severity)}
                                                <Badge variant="outline" className="text-xs">{alert.id}</Badge>
                                            </div>
                                            <p className="text-sm text-gray-700 mb-2">{alert.description}</p>
                                            <div className="flex items-center space-x-4 text-xs text-gray-500">
                                                <span className="flex items-center space-x-1">
                                                    <MapPin className="h-3 w-3" />
                                                    <span>{alert.location}</span>
                                                </span>
                                                <span className="flex items-center space-x-1">
                                                    <Clock className="h-3 w-3" />
                                                    <span>{alert.timestamp}</span>
                                                </span>
                                                <span>User: {alert.user}</span>
                                            </div>
                                        </div>
                                        <div className="flex items-center space-x-2">
                                            <Button size="sm" variant="outline">
                                                Investigate
                                            </Button>
                                            <Button size="sm" variant="destructive">
                                                Block
                                            </Button>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>
            )}

            {/* Security Tabs */}
            <Tabs defaultValue="sessions" className="space-y-6">
                <TabsList className="grid w-full grid-cols-2 lg:w-auto lg:grid-cols-4">
                    <TabsTrigger value="sessions">Active Sessions</TabsTrigger>
                    <TabsTrigger value="login-attempts">Login Attempts</TabsTrigger>
                    <TabsTrigger value="settings">Security Settings</TabsTrigger>
                    <TabsTrigger value="reports">Security Reports</TabsTrigger>
                </TabsList>

                {/* Active Sessions Tab */}
                <TabsContent value="sessions" className="space-y-6">
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center space-x-2">
                                <Activity className="h-5 w-5" />
                                <span>Active User Sessions</span>
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="overflow-x-auto">
                                <Table>
                                    <TableHeader>
                                        <TableRow>
                                            <TableHead>User</TableHead>
                                            <TableHead>Location</TableHead>
                                            <TableHead>Device</TableHead>
                                            <TableHead>Login Time</TableHead>
                                            <TableHead>Last Activity</TableHead>
                                            <TableHead>Status</TableHead>
                                            <TableHead className="text-right">Actions</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {activeSessions.map((session, index) => (
                                            <TableRow key={index}>
                                                <TableCell>
                                                    <div className="flex items-center space-x-3">
                                                        <Avatar>
                                                            <AvatarFallback className="bg-blue-100 text-blue-700">
                                                                {session.user.split(" ").map((n) => n[0]).join("")}
                                                            </AvatarFallback>
                                                        </Avatar>
                                                        <div>
                                                            <div className="font-medium">{session.user}</div>
                                                            <div className="text-sm text-gray-500">{session.email}</div>
                                                        </div>
                                                    </div>
                                                </TableCell>
                                                <TableCell>
                                                    <div className="flex items-center space-x-2">
                                                        <MapPin className="h-4 w-4 text-gray-400" />
                                                        <span className="text-sm">{session.location}</span>
                                                    </div>
                                                    <div className="text-xs text-gray-500">{session.ip}</div>
                                                </TableCell>
                                                <TableCell>
                                                    <div className="flex items-center space-x-2">
                                                        {session.device.includes("Mobile") ? (
                                                            <Smartphone className="h-4 w-4 text-gray-400" />
                                                        ) : (
                                                            <Monitor className="h-4 w-4 text-gray-400" />
                                                        )}
                                                        <span className="text-sm">{session.device}</span>
                                                    </div>
                                                </TableCell>
                                                <TableCell>{session.loginTime}</TableCell>
                                                <TableCell>{session.lastActivity}</TableCell>
                                                <TableCell>{getSessionBadge(session.status)}</TableCell>
                                                <TableCell className="text-right">
                                                    <Button variant="outline" size="sm" className="text-red-600 hover:text-red-700">
                                                        Terminate
                                                    </Button>
                                                </TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>

                {/* Login Attempts Tab */}
                <TabsContent value="login-attempts" className="space-y-6">
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center space-x-2">
                                <Key className="h-5 w-5" />
                                <span>Recent Login Attempts</span>
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="overflow-x-auto">
                                <Table>
                                    <TableHeader>
                                        <TableRow>
                                            <TableHead>User/Email</TableHead>
                                            <TableHead>IP Address</TableHead>
                                            <TableHead>Location</TableHead>
                                            <TableHead>Device & Browser</TableHead>
                                            <TableHead>Status</TableHead>
                                            <TableHead>Timestamp</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {loginAttempts.map((attempt, index) => (
                                            <TableRow key={index} className={attempt.status === "Failed" || attempt.status === "Blocked" ? "bg-red-50" : ""}>
                                                <TableCell>
                                                    <div className="font-medium">{attempt.user}</div>
                                                </TableCell>
                                                <TableCell>
                                                    <div className="font-mono text-sm">{attempt.ip}</div>
                                                </TableCell>
                                                <TableCell>
                                                    <div className="flex items-center space-x-2">
                                                        <Globe className="h-4 w-4 text-gray-400" />
                                                        <span className="text-sm">{attempt.location}</span>
                                                    </div>
                                                </TableCell>
                                                <TableCell>
                                                    <div className="flex items-center space-x-2">
                                                        {attempt.device === "Mobile" ? (
                                                            <Smartphone className="h-4 w-4 text-gray-400" />
                                                        ) : (
                                                            <Monitor className="h-4 w-4 text-gray-400" />
                                                        )}
                                                        <span className="text-sm">{attempt.device} - {attempt.browser}</span>
                                                    </div>
                                                </TableCell>
                                                <TableCell>{getStatusBadge(attempt.status)}</TableCell>
                                                <TableCell>{attempt.timestamp}</TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>

                {/* Security Settings Tab */}
                <TabsContent value="settings" className="space-y-6">
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center space-x-2">
                                <Lock className="h-5 w-5" />
                                <span>Security Configuration</span>
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-6">
                                {settings.map((setting, index) => (
                                    <div key={index}>
                                        <div className="flex items-center justify-between">
                                            <div className="flex-1">
                                                <h4 className="font-medium text-gray-900">{setting.title}</h4>
                                                <p className="text-sm text-gray-600">{setting.description}</p>
                                            </div>
                                            <Switch
                                                checked={setting.enabled}
                                                onCheckedChange={() => toggleSetting(index)}
                                            />
                                        </div>
                                        {index < settings.length - 1 && <Separator className="mt-6" />}
                                    </div>
                                ))}
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>

                {/* Security Reports Tab */}
                <TabsContent value="reports" className="space-y-6">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        {/* Security Metrics */}
                        <Card>
                            <CardHeader>
                                <CardTitle>Security Metrics</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-6">
                                <div className="p-4 bg-gradient-to-r from-green-50 to-emerald-50 rounded-lg">
                                    <h3 className="font-semibold text-green-900 mb-1">Successful Logins</h3>
                                    <p className="text-2xl font-bold text-green-600">98.7%</p>
                                    <p className="text-sm text-green-600">Success rate today</p>
                                </div>
                                <div className="p-4 bg-gradient-to-r from-blue-50 to-cyan-50 rounded-lg">
                                    <h3 className="font-semibold text-blue-900 mb-1">2FA Adoption</h3>
                                    <p className="text-2xl font-bold text-blue-600">76.3%</p>
                                    <p className="text-sm text-blue-600">Of premium users</p>
                                </div>
                                <div className="p-4 bg-gradient-to-r from-orange-50 to-red-50 rounded-lg">
                                    <h3 className="font-semibold text-orange-900 mb-1">Blocked IPs</h3>
                                    <p className="text-2xl font-bold text-orange-600">234</p>
                                    <p className="text-sm text-orange-600">This month</p>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Security Recommendations */}
                        <Card>
                            <CardHeader>
                                <CardTitle>Security Recommendations</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-4">
                                    <div className="flex items-start space-x-3 p-3 bg-yellow-50 rounded-lg">
                                        <AlertTriangle className="h-5 w-5 text-yellow-600 mt-0.5" />
                                        <div>
                                            <h4 className="font-medium text-yellow-900">Enable IP Whitelist</h4>
                                            <p className="text-sm text-yellow-700">Consider enabling IP whitelist for admin accounts</p>
                                        </div>
                                    </div>
                                    <div className="flex items-start space-x-3 p-3 bg-blue-50 rounded-lg">
                                        <Fingerprint className="h-5 w-5 text-blue-600 mt-0.5" />
                                        <div>
                                            <h4 className="font-medium text-blue-900">Device Verification</h4>
                                            <p className="text-sm text-blue-700">Enable device verification for enhanced security</p>
                                        </div>
                                    </div>
                                    <div className="flex items-start space-x-3 p-3 bg-green-50 rounded-lg">
                                        <CheckCircle className="h-5 w-5 text-green-600 mt-0.5" />
                                        <div>
                                            <h4 className="font-medium text-green-900">Regular Security Audits</h4>
                                            <p className="text-sm text-green-700">Schedule monthly security reviews</p>
                                        </div>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </TabsContent>
            </Tabs>
        </div>
    );
}
