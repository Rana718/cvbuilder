"use client";

import React, { useState } from "react";
import {
    Settings,
    Save,
    RotateCcw,
    Bell,
    Mail,
    Smartphone,
    Globe,
    Shield,
    Database,
    Palette,
    Users,
    CreditCard,
    FileText,
    Zap,
    Lock,
    Eye,
    EyeOff,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { Textarea } from "@/components/ui/textarea";

// Settings data structure
const initialSettings = {
    general: {
        siteName: "AI CV Builder",
        siteDescription: "Create professional resumes with AI assistance",
        adminEmail: "admin@aicvbuilder.com",
        supportEmail: "support@aicvbuilder.com",
        timezone: "Asia/Kolkata",
        language: "en",
    },
    notifications: {
        emailNotifications: true,
        smsNotifications: false,
        pushNotifications: true,
        newUserAlerts: true,
        paymentAlerts: true,
        securityAlerts: true,
        systemMaintenance: true,
    },
    security: {
        twoFactorAuth: true,
        sessionTimeout: 30,
        passwordExpiry: 90,
        maxLoginAttempts: 5,
        ipWhitelist: false,
        encryptionLevel: "AES-256",
    },
    payment: {
        currency: "INR",
        freeTrialDays: 7,
        premiumPrice: 90,
        taxRate: 18,
        paymentMethods: {
            razorpay: true,
            stripe: false,
            paypal: false,
        },
    },
    features: {
        aiSuggestions: true,
        templateCustomization: true,
        pdfExport: true,
        publicSharing: true,
        resumeAnalytics: false,
        collaborativeEditing: false,
    },
    limits: {
        freeUserResumes: 1,
        premiumUserResumes: -1, // -1 means unlimited
        maxFileSize: 10, // MB
        maxTemplates: 50,
        apiRateLimit: 1000, // requests per hour
    },
};

export default function SettingsPage() {
    const [settings, setSettings] = useState(initialSettings);
    const [hasChanges, setHasChanges] = useState(false);
    const [showPassword, setShowPassword] = useState(false);

    const updateSetting = (category: string, key: string, value: any) => {
        setSettings(prev => ({
            ...prev,
            [category]: {
                ...(prev as any)[category],
                [key]: value,
            },
        }));
        setHasChanges(true);
    };

    const updateNestedSetting = (category: string, parentKey: string, key: string, value: any) => {
        setSettings(prev => ({
            ...prev,
            [category]: {
                ...(prev as any)[category],
                [parentKey]: {
                    ...(prev as any)[category][parentKey],
                    [key]: value,
                },
            },
        }));
        setHasChanges(true);
    };

    const saveSettings = () => {
        // Here you would typically send the settings to your backend
        console.log("Saving settings:", settings);
        setHasChanges(false);
        // Show success message
    };

    const resetSettings = () => {
        setSettings(initialSettings);
        setHasChanges(false);
    };

    return (
        <div className="p-4 lg:p-8 space-y-8">
            {/* Header */}
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900">Admin Settings</h1>
                    <p className="text-gray-600">Configure and customize your platform</p>
                </div>
                <div className="flex items-center space-x-3">
                    {hasChanges && (
                        <Badge variant="destructive" className="text-xs">
                            Unsaved Changes
                        </Badge>
                    )}
                    <Button variant="outline" onClick={resetSettings} disabled={!hasChanges}>
                        <RotateCcw className="h-4 w-4 mr-2" />
                        Reset
                    </Button>
                    <Button onClick={saveSettings} disabled={!hasChanges}>
                        <Save className="h-4 w-4 mr-2" />
                        Save Changes
                    </Button>
                </div>
            </div>

            {/* Settings Tabs */}
            <Tabs defaultValue="general" className="space-y-6">
                <TabsList className="grid w-full grid-cols-3 lg:w-auto lg:grid-cols-6">
                    <TabsTrigger value="general">General</TabsTrigger>
                    <TabsTrigger value="notifications">Notifications</TabsTrigger>
                    <TabsTrigger value="security">Security</TabsTrigger>
                    <TabsTrigger value="payment">Payment</TabsTrigger>
                    <TabsTrigger value="features">Features</TabsTrigger>
                    <TabsTrigger value="limits">Limits</TabsTrigger>
                </TabsList>

                {/* General Settings */}
                <TabsContent value="general" className="space-y-6">
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center space-x-2">
                                <Globe className="h-5 w-5" />
                                <span>Site Configuration</span>
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-6">
                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-gray-700">Site Name</label>
                                    <Input
                                        className="border border-gray-300 focus:border-blue-500"
                                        value={settings.general.siteName}
                                        onChange={(e) => updateSetting('general', 'siteName', e.target.value)}
                                        placeholder="Enter site name"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-gray-700">Admin Email</label>
                                    <Input
                                        className="border border-gray-300 focus:border-blue-500"
                                        type="email"
                                        value={settings.general.adminEmail}
                                        onChange={(e) => updateSetting('general', 'adminEmail', e.target.value)}
                                        placeholder="admin@example.com"
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm font-medium text-gray-700">Site Description</label>
                                <Textarea
                                    value={settings.general.siteDescription}
                                    onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => updateSetting('general', 'siteDescription', e.target.value)}
                                    placeholder="Enter site description"
                                    rows={3}
                                />
                            </div>

                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-gray-700">Support Email</label>
                                    <Input
                                        className="border border-gray-300 focus:border-blue-500"
                                        type="email"
                                        value={settings.general.supportEmail}
                                        onChange={(e) => updateSetting('general', 'supportEmail', e.target.value)}
                                        placeholder="support@example.com"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-gray-700">Timezone</label>
                                    <Select
                                        value={settings.general.timezone}
                                        onValueChange={(value) => updateSetting('general', 'timezone', value)}
                                    >
                                        <SelectTrigger>
                                            <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="Asia/Kolkata">Asia/Kolkata (IST)</SelectItem>
                                            <SelectItem value="America/New_York">America/New_York (EST)</SelectItem>
                                            <SelectItem value="Europe/London">Europe/London (GMT)</SelectItem>
                                            <SelectItem value="Asia/Tokyo">Asia/Tokyo (JST)</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>

                {/* Notifications Settings */}
                <TabsContent value="notifications" className="space-y-6">
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center space-x-2">
                                <Bell className="h-5 w-5" />
                                <span>Notification Preferences</span>
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-6">
                                {[
                                    { key: 'emailNotifications', label: 'Email Notifications', icon: Mail, description: 'Receive notifications via email' },
                                    { key: 'smsNotifications', label: 'SMS Notifications', icon: Smartphone, description: 'Receive notifications via SMS' },
                                    { key: 'pushNotifications', label: 'Push Notifications', icon: Bell, description: 'Browser push notifications' },
                                    { key: 'newUserAlerts', label: 'New User Alerts', icon: Users, description: 'Alert when new users register' },
                                    { key: 'paymentAlerts', label: 'Payment Alerts', icon: CreditCard, description: 'Alert for payment events' },
                                    { key: 'securityAlerts', label: 'Security Alerts', icon: Shield, description: 'Alert for security events' },
                                    { key: 'systemMaintenance', label: 'System Maintenance', icon: Settings, description: 'Maintenance notifications' },
                                ].map((item, index) => (
                                    <div key={index}>
                                        <div className="flex items-center justify-between">
                                            <div className="flex items-center space-x-3">
                                                <item.icon className="h-5 w-5 text-gray-400" />
                                                <div>
                                                    <h4 className="font-medium text-gray-900">{item.label}</h4>
                                                    <p className="text-sm text-gray-600">{item.description}</p>
                                                </div>
                                            </div>
                                            <Switch
                                                checked={(settings.notifications as any)[item.key]}
                                                onCheckedChange={(checked) => updateSetting('notifications', item.key, checked)}
                                            />
                                        </div>
                                        {index < 6 && <Separator className="mt-6" />}
                                    </div>
                                ))}
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>

                {/* Security Settings */}
                <TabsContent value="security" className="space-y-6">
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center space-x-2">
                                <Shield className="h-5 w-5" />
                                <span>Security Configuration</span>
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-6">
                            <div className="flex items-center justify-between">
                                <div>
                                    <h4 className="font-medium text-gray-900">Two-Factor Authentication</h4>
                                    <p className="text-sm text-gray-600">Require 2FA for admin accounts</p>
                                </div>
                                <Switch
                                    checked={settings.security.twoFactorAuth}
                                    onCheckedChange={(checked) => updateSetting('security', 'twoFactorAuth', checked)}
                                />
                            </div>

                            <Separator />

                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-gray-700">Session Timeout (minutes)</label>
                                    <Input
                                        className="border border-gray-300 focus:border-blue-500"
                                        type="number"
                                        value={settings.security.sessionTimeout}
                                        onChange={(e) => updateSetting('security', 'sessionTimeout', parseInt(e.target.value))}
                                        min="5"
                                        max="1440"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-gray-700">Password Expiry (days)</label>
                                    <Input
                                        className="border border-gray-300 focus:border-blue-500"
                                        type="number"
                                        value={settings.security.passwordExpiry}
                                        onChange={(e) => updateSetting('security', 'passwordExpiry', parseInt(e.target.value))}
                                        min="30"
                                        max="365"
                                    />
                                </div>
                            </div>

                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-gray-700">Max Login Attempts</label>
                                    <Input
                                        className="border border-gray-300 focus:border-blue-500"
                                        type="number"
                                        value={settings.security.maxLoginAttempts}
                                        onChange={(e) => updateSetting('security', 'maxLoginAttempts', parseInt(e.target.value))}
                                        min="3"
                                        max="10"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-gray-700">Encryption Level</label>
                                    <Select
                                        value={settings.security.encryptionLevel}
                                        onValueChange={(value) => updateSetting('security', 'encryptionLevel', value)}
                                    >
                                        <SelectTrigger>
                                            <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="AES-128">AES-128</SelectItem>
                                            <SelectItem value="AES-256">AES-256</SelectItem>
                                            <SelectItem value="RSA-2048">RSA-2048</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                            </div>

                            <Separator />

                            <div className="flex items-center justify-between">
                                <div>
                                    <h4 className="font-medium text-gray-900">IP Whitelist</h4>
                                    <p className="text-sm text-gray-600">Only allow access from approved IPs</p>
                                </div>
                                <Switch
                                    checked={settings.security.ipWhitelist}
                                    onCheckedChange={(checked) => updateSetting('security', 'ipWhitelist', checked)}
                                />
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>

                {/* Payment Settings */}
                <TabsContent value="payment" className="space-y-6">
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center space-x-2">
                                <CreditCard className="h-5 w-5" />
                                <span>Payment Configuration</span>
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-6">
                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-gray-700">Currency</label>
                                    <Select
                                        value={settings.payment.currency}
                                        onValueChange={(value) => updateSetting('payment', 'currency', value)}
                                    >
                                        <SelectTrigger>
                                            <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="INR">Indian Rupee (INR)</SelectItem>
                                            <SelectItem value="USD">US Dollar (USD)</SelectItem>
                                            <SelectItem value="EUR">Euro (EUR)</SelectItem>
                                            <SelectItem value="GBP">British Pound (GBP)</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-gray-700">Premium Price (Monthly)</label>
                                    <Input
                                        className="border border-gray-300 focus:border-blue-500"
                                        type="number"
                                        value={settings.payment.premiumPrice}
                                        onChange={(e) => updateSetting('payment', 'premiumPrice', parseInt(e.target.value))}
                                        min="1"
                                    />
                                </div>
                            </div>

                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-gray-700">Free Trial Days</label>
                                    <Input
                                        className="border border-gray-300 focus:border-blue-500"
                                        type="number"
                                        value={settings.payment.freeTrialDays}
                                        onChange={(e) => updateSetting('payment', 'freeTrialDays', parseInt(e.target.value))}
                                        min="0"
                                        max="30"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-gray-700">Tax Rate (%)</label>
                                    <Input
                                        className="border border-gray-300 focus:border-blue-500"
                                        type="number"
                                        value={settings.payment.taxRate}
                                        onChange={(e) => updateSetting('payment', 'taxRate', parseInt(e.target.value))}
                                        min="0"
                                        max="50"
                                    />
                                </div>
                            </div>

                            <Separator />

                            <div className="space-y-4">
                                <h4 className="font-medium text-gray-900">Payment Methods</h4>
                                {Object.entries(settings.payment.paymentMethods).map(([method, enabled]) => (
                                    <div key={method} className="flex items-center justify-between">
                                        <div>
                                            <h5 className="capitalize font-medium">{method}</h5>
                                            <p className="text-sm text-gray-600">Accept payments via {method}</p>
                                        </div>
                                        <Switch
                                            checked={enabled}
                                            onCheckedChange={(checked) => updateNestedSetting('payment', 'paymentMethods', method, checked)}
                                        />
                                    </div>
                                ))}
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>

                {/* Features Settings */}
                <TabsContent value="features" className="space-y-6">
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center space-x-2">
                                <Zap className="h-5 w-5" />
                                <span>Platform Features</span>
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-6">
                                {[
                                    { key: 'aiSuggestions', label: 'AI Suggestions', description: 'Enable AI-powered content suggestions' },
                                    { key: 'templateCustomization', label: 'Template Customization', description: 'Allow users to customize templates' },
                                    { key: 'pdfExport', label: 'PDF Export', description: 'Enable PDF download functionality' },
                                    { key: 'publicSharing', label: 'Public Sharing', description: 'Allow users to share resumes publicly' },
                                    { key: 'resumeAnalytics', label: 'Resume Analytics', description: 'Provide analytics for resume performance' },
                                    { key: 'collaborativeEditing', label: 'Collaborative Editing', description: 'Enable multiple users to edit same resume' },
                                ].map((feature, index) => (
                                    <div key={index}>
                                        <div className="flex items-center justify-between">
                                            <div>
                                                <h4 className="font-medium text-gray-900">{feature.label}</h4>
                                                <p className="text-sm text-gray-600">{feature.description}</p>
                                            </div>
                                            <Switch
                                                checked={(settings.features as any)[feature.key]}
                                                onCheckedChange={(checked) => updateSetting('features', feature.key, checked)}
                                            />
                                        </div>
                                        {index < 5 && <Separator className="mt-6" />}
                                    </div>
                                ))}
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>

                {/* Limits Settings */}
                <TabsContent value="limits" className="space-y-6">
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center space-x-2">
                                <Database className="h-5 w-5" />
                                <span>System Limits</span>
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-6">
                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-gray-700">Free User Resume Limit</label>
                                    <Input
                                        className="border border-gray-300 focus:border-blue-500"
                                        type="number"
                                        value={settings.limits.freeUserResumes}
                                        onChange={(e) => updateSetting('limits', 'freeUserResumes', parseInt(e.target.value))}
                                        min="1"
                                        max="5"
                                    />
                                    <p className="text-xs text-gray-500">Number of resumes free users can create</p>
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-gray-700">Premium User Resume Limit</label>
                                    <Input
                                        className="border border-gray-300 focus:border-blue-500"
                                        type="number"
                                        value={settings.limits.premiumUserResumes === -1 ? '' : settings.limits.premiumUserResumes}
                                        onChange={(e) => updateSetting('limits', 'premiumUserResumes', e.target.value === '' ? -1 : parseInt(e.target.value))}
                                        placeholder="Unlimited (-1)"
                                    />
                                    <p className="text-xs text-gray-500">-1 for unlimited resumes</p>
                                </div>
                            </div>

                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-gray-700">Max File Size (MB)</label>
                                    <Input
                                        className="border border-gray-300 focus:border-blue-500"
                                        type="number"
                                        value={settings.limits.maxFileSize}
                                        onChange={(e) => updateSetting('limits', 'maxFileSize', parseInt(e.target.value))}
                                        min="1"
                                        max="100"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-gray-700">Max Templates</label>
                                    <Input
                                        className="border border-gray-300 focus:border-blue-500"
                                        type="number"
                                        value={settings.limits.maxTemplates}
                                        onChange={(e) => updateSetting('limits', 'maxTemplates', parseInt(e.target.value))}
                                        min="10"
                                        max="200"
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm font-medium text-gray-700">API Rate Limit (requests/hour)</label>
                                <Input
                                    className="border border-gray-300 focus:border-blue-500"
                                    type="number"
                                    value={settings.limits.apiRateLimit}
                                    onChange={(e) => updateSetting('limits', 'apiRateLimit', parseInt(e.target.value))}
                                    min="100"
                                    max="10000"
                                />
                                <p className="text-xs text-gray-500">API requests allowed per hour per user</p>
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>
            </Tabs>
        </div>
    );
}
