"use client";

import React, { useState } from "react";
import {
    Search,
    Download,
    Plus,
    MoreHorizontal,
    Trash2,
    Crown,
    Mail,
    Phone,
    Users,
    Settings,
    UserX,
    Edit,
    RefreshCw,
    AlertCircle,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
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
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import {
    Tabs,
    TabsContent,
    TabsList,
    TabsTrigger,
} from "@/components/ui/tabs";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { useUserManagement } from "@/hooks/useUserManagement";

const LoadingTable = () => (
    <div className="space-y-4">
        {Array.from({ length: 5 }).map((_, index) => (
            <div key={index} className="flex items-center space-x-4 p-4 bg-gray-50 rounded-lg animate-pulse">
                <div className="w-10 h-10 bg-gray-200 rounded-full"></div>
                <div className="flex-1 space-y-2">
                    <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                    <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                </div>
                <div className="h-6 bg-gray-200 rounded w-16"></div>
                <div className="h-6 bg-gray-200 rounded w-20"></div>
                <div className="h-8 bg-gray-200 rounded w-8"></div>
            </div>
        ))}
    </div>
);

const ErrorMessage = ({ error, onRetry }: { error: string; onRetry: () => void }) => (
    <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-center justify-between">
        <div className="flex items-center space-x-3">
            <AlertCircle className="h-5 w-5 text-red-500" />
            <span className="text-red-700">{error}</span>
        </div>
        <Button variant="outline" size="sm" onClick={onRetry}>
            <RefreshCw className="h-4 w-4 mr-2" />
            Retry
        </Button>
    </div>
);

export default function UsersPage() {
    const {
        usersData,
        adminUsers,
        loading,
        error,
        currentUser,
        addingAdmin,
        updatingAdminRole,
        deleteUser,
        updateAdminRole,
        addAdmin,
        removeAdminAccess,
        refetch,
        refreshAdminStatus
    } = useUserManagement();

    const [activeTab, setActiveTab] = useState("regular");
    const [searchTerm, setSearchTerm] = useState("");
    const [statusFilter, setStatusFilter] = useState("all");
    const [subscriptionFilter, setSubscriptionFilter] = useState("all");
    const [showAddAdminDialog, setShowAddAdminDialog] = useState(false);
    const [showEditAdminDialog, setShowEditAdminDialog] = useState(false);
    const [selectedAdminUser, setSelectedAdminUser] = useState<any>(null);
    const [addAdminForm, setAddAdminForm] = useState({
        user_email: "",
        make_admin: true,
        make_super_admin: false,
    });

    const getStatusBadge = (status: string) => {
        switch (status.toLowerCase()) {
            case "active":
                return <Badge className="bg-green-100 text-green-800 hover:bg-green-100">Active</Badge>;
            case "inactive":
                return <Badge className="bg-gray-100 text-gray-800 hover:bg-gray-100">Inactive</Badge>;
            case "suspended":
                return <Badge className="bg-red-100 text-red-800 hover:bg-red-100">Suspended</Badge>;
            default:
                return <Badge variant="secondary">{status}</Badge>;
        }
    };

    const getSubscriptionBadge = (isPremium: boolean) => {
        return isPremium ? (
            <Badge className="bg-purple-100 text-purple-800 hover:bg-purple-100">
                <Crown className="h-3 w-3 mr-1" />
                Premium
            </Badge>
        ) : (
            <Badge className="bg-gray-100 text-gray-800 hover:bg-gray-100">Free</Badge>
        );
    };

    const handleDeleteUser = async (userId: number) => {
        if (window.confirm('Are you sure you want to delete this user? This action cannot be undone.')) {
            await deleteUser(userId);
        }
    };

    const handleUpdateAdminRole = async () => {
        if (selectedAdminUser && !updatingAdminRole) {
            await updateAdminRole(
                selectedAdminUser.id,
                selectedAdminUser.is_admin,
                selectedAdminUser.is_super_admin
            );
            setShowEditAdminDialog(false);
            setSelectedAdminUser(null);
        }
    };

    const handleAddAdmin = async () => {
        if (!addingAdmin) {
            await addAdmin(
                addAdminForm.user_email,
                addAdminForm.make_admin,
                addAdminForm.make_super_admin
            );
            setShowAddAdminDialog(false);
            setAddAdminForm({
                user_email: "",
                make_admin: true,
                make_super_admin: false,
            });
        }
    };

    const handleRemoveAdminAccess = async (userId: number) => {
        if (window.confirm('Are you sure you want to remove admin access for this user?')) {
            await removeAdminAccess(userId);
        }
    };

    const filteredUsers = usersData?.users?.filter((user) => {
        const matchesSearch =
            user.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
            user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
            user.phone.includes(searchTerm);
        const matchesStatus = statusFilter === "all" || user.status.toLowerCase() === statusFilter;
        const matchesSubscription = subscriptionFilter === "all" || 
            (subscriptionFilter === "premium" && user.is_premium) ||
            (subscriptionFilter === "free" && !user.is_premium);
        return matchesSearch && matchesStatus && matchesSubscription;
    }) || [];

    const filteredAdminUsers = adminUsers.filter((user) => {
        return user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
               user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
               user.phone.includes(searchTerm);
    });

    if (error) {
        return (
            <div className="p-4 lg:p-8">
                <ErrorMessage error={error} onRetry={refetch} />
            </div>
        );
    }

    return (
        <div className="p-4 lg:p-8 space-y-6">
            {/* Header */}
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900">User Management</h1>
                    <p className="text-gray-600">Manage and monitor all platform users</p>
                </div>
                <div className="flex items-center space-x-3">
                    <Button variant="outline" size="sm" onClick={refetch} disabled={loading}>
                        <RefreshCw className={`h-4 w-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
                        Refresh Data
                    </Button>
                    <Button variant="outline" size="sm" onClick={refreshAdminStatus}>
                        <RefreshCw className="h-4 w-4 mr-2" />
                        Refresh Permissions
                    </Button>
                    {(currentUser.isSuperAdmin || currentUser.isAdmin) && (
                        <Button size="sm" onClick={() => setShowAddAdminDialog(true)}>
                            <Plus className="h-4 w-4 mr-2" />
                            Add Admin
                        </Button>
                    )}
                </div>
            </div>

            {/* Stats Cards */}
            {usersData?.stats && (
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <Card>
                        <CardContent className="p-4">
                            <div className="text-2xl font-bold text-blue-600">{usersData.stats.total_users}</div>
                            <p className="text-sm text-gray-600">Total Users</p>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardContent className="p-4">
                            <div className="text-2xl font-bold text-green-600">{usersData.stats.active_users}</div>
                            <p className="text-sm text-gray-600">Active Users</p>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardContent className="p-4">
                            <div className="text-2xl font-bold text-purple-600">{usersData.stats.premium_users}</div>
                            <p className="text-sm text-gray-600">Premium Users</p>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardContent className="p-4">
                            <div className="text-2xl font-bold text-orange-600">{usersData.stats.total_resumes}</div>
                            <p className="text-sm text-gray-600">Total Resumes</p>
                        </CardContent>
                    </Card>
                </div>
            )}

            {/* Tabs */}
            <Tabs value={activeTab} onValueChange={setActiveTab}>
                <TabsList className="grid w-full grid-cols-2">
                    <TabsTrigger value="regular" className="flex items-center space-x-2">
                        <Users className="h-4 w-4" />
                        <span>Regular Users</span>
                    </TabsTrigger>
                    <TabsTrigger value="admin" className="flex items-center space-x-2">
                        <Settings className="h-4 w-4" />
                        <span>Admin Users</span>
                    </TabsTrigger>
                </TabsList>

                {/* Filters */}
                <Card className="mt-4">
                    <CardContent className="p-6">
                        <div className="flex flex-col lg:flex-row space-y-4 lg:space-y-0 lg:space-x-4">
                            <div className="relative flex-1">
                                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                                <Input
                                    placeholder="Search by name, email, or phone..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    className="pl-10"
                                />
                            </div>
                            {activeTab === "regular" && (
                                <>
                                    <Select value={statusFilter} onValueChange={setStatusFilter}>
                                        <SelectTrigger className="w-full lg:w-40">
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
                                        <SelectTrigger className="w-full lg:w-40">
                                            <SelectValue placeholder="Subscription" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="all">All Plans</SelectItem>
                                            <SelectItem value="free">Free</SelectItem>
                                            <SelectItem value="premium">Premium</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </>
                            )}
                        </div>
                    </CardContent>
                </Card>

                {/* Regular Users Tab */}
                <TabsContent value="regular">
                    <Card>
                        <CardContent className="p-0">
                            {loading ? (
                                <div className="p-6">
                                    <LoadingTable />
                                </div>
                            ) : (
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
                                                {currentUser.isSuperAdmin && (
                                                    <TableHead className="text-right">Actions</TableHead>
                                                )}
                                            </TableRow>
                                        </TableHeader>
                                        <TableBody>
                                            {filteredUsers.length === 0 ? (
                                                <TableRow>
                                                    <TableCell colSpan={7} className="text-center py-8 text-gray-500">
                                                        No users found
                                                    </TableCell>
                                                </TableRow>
                                            ) : (
                                                filteredUsers.map((user) => (
                                                    <TableRow key={user.id} className="hover:bg-gray-50">
                                                        <TableCell>
                                                            <div className="flex items-center space-x-3">
                                                                <Avatar>
                                                                    <AvatarImage src={user.image_url} />
                                                                    <AvatarFallback className="bg-blue-100 text-blue-700">
                                                                        {user.username.split(" ").map((n) => n[0]).join("")}
                                                                    </AvatarFallback>
                                                                </Avatar>
                                                                <div>
                                                                    <div className="font-medium text-gray-900">{user.username}</div>
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
                                                        <TableCell>{getSubscriptionBadge(user.is_premium)}</TableCell>
                                                        <TableCell>
                                                            <div className="font-medium">{user.total_resumes}</div>
                                                        </TableCell>
                                                        <TableCell>
                                                            <div className="font-medium text-green-600">₹{user.total_spent}</div>
                                                        </TableCell>
                                                        <TableCell className="text-right">
                                                            {(currentUser.isSuperAdmin) && (
                                                                <DropdownMenu>
                                                                    <DropdownMenuTrigger asChild>
                                                                        <Button variant="ghost" size="sm">
                                                                            <MoreHorizontal className="h-4 w-4" />
                                                                        </Button>
                                                                    </DropdownMenuTrigger>
                                                                    <DropdownMenuContent align="end">
                                                                        {currentUser.isSuperAdmin && (
                                                                            <DropdownMenuItem 
                                                                                className="text-red-600"
                                                                                onClick={() => handleDeleteUser(user.id)}
                                                                            >
                                                                                <Trash2 className="h-4 w-4 mr-2" />
                                                                                Delete User
                                                                            </DropdownMenuItem>
                                                                        )}
                                                                    </DropdownMenuContent>
                                                                </DropdownMenu>
                                                            )}
                                                        </TableCell>
                                                    </TableRow>
                                                ))
                                            )}
                                        </TableBody>
                                    </Table>
                                </div>
                            )}
                        </CardContent>
                    </Card>
                </TabsContent>

                {/* Admin Users Tab */}
                <TabsContent value="admin">
                    <Card>
                        <CardContent className="p-0">
                            {loading ? (
                                <div className="p-6">
                                    <LoadingTable />
                                </div>
                            ) : (
                                <div className="overflow-x-auto">
                                    <Table>
                                        <TableHeader>
                                            <TableRow className="bg-gray-50">
                                                <TableHead>Admin User</TableHead>
                                                <TableHead>Contact</TableHead>
                                                <TableHead>Role</TableHead>
                                                <TableHead className="text-right">Actions</TableHead>
                                            </TableRow>
                                        </TableHeader>
                                        <TableBody>
                                            {filteredAdminUsers.length === 0 ? (
                                                <TableRow>
                                                    <TableCell colSpan={4} className="text-center py-8 text-gray-500">
                                                        No admin users found
                                                    </TableCell>
                                                </TableRow>
                                            ) : (
                                                filteredAdminUsers.map((user) => (
                                                    <TableRow key={user.id} className="hover:bg-gray-50">
                                                        <TableCell>
                                                            <div className="flex items-center space-x-3">
                                                                <Avatar>
                                                                    <AvatarImage src={user.image_url} />
                                                                    <AvatarFallback className="bg-red-100 text-red-700">
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
                                                        <TableCell>
                                                            <div className="space-y-1">
                                                                {user.is_super_admin && (
                                                                    <Badge className="bg-red-100 text-red-800 hover:bg-red-100">
                                                                        <Crown className="h-3 w-3 mr-1" />
                                                                        Super Admin
                                                                    </Badge>
                                                                )}
                                                                {user.is_admin && !user.is_super_admin && (
                                                                    <Badge className="bg-blue-100 text-blue-800 hover:bg-blue-100">
                                                                        <Settings className="h-3 w-3 mr-1" />
                                                                        Admin
                                                                    </Badge>
                                                                )}
                                                            </div>
                                                        </TableCell>
                                                        <TableCell className="text-right">
                                                            {currentUser.isSuperAdmin && (
                                                                <DropdownMenu>
                                                                    <DropdownMenuTrigger asChild>
                                                                        <Button variant="ghost" size="sm">
                                                                            <MoreHorizontal className="h-4 w-4" />
                                                                        </Button>
                                                                    </DropdownMenuTrigger>
                                                                    <DropdownMenuContent align="end">
                                                                        <DropdownMenuItem 
                                                                            onClick={() => {
                                                                                setSelectedAdminUser(user);
                                                                                setShowEditAdminDialog(true);
                                                                            }}
                                                                        >
                                                                            <Edit className="h-4 w-4 mr-2" />
                                                                            Edit Admin Access
                                                                        </DropdownMenuItem>
                                                                        <DropdownMenuItem 
                                                                            className="text-orange-600"
                                                                            onClick={() => handleRemoveAdminAccess(user.id)}
                                                                        >
                                                                            <UserX className="h-4 w-4 mr-2" />
                                                                            Remove Admin Access
                                                                        </DropdownMenuItem>
                                                                    </DropdownMenuContent>
                                                                </DropdownMenu>
                                                            )}
                                                        </TableCell>
                                                    </TableRow>
                                                ))
                                            )}
                                        </TableBody>
                                    </Table>
                                </div>
                            )}
                        </CardContent>
                    </Card>
                </TabsContent>
            </Tabs>

            {/* Add Admin Dialog */}
            <Dialog 
                open={showAddAdminDialog} 
                onOpenChange={(open) => {
                    if (!addingAdmin) {
                        setShowAddAdminDialog(open);
                    }
                }}
            >
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Add New Admin</DialogTitle>
                        <DialogDescription>
                            Add admin or super admin privileges to an existing user
                        </DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4">
                        <div>
                            <Label htmlFor="email">User Email</Label>
                            <Input
                                id="email"
                                placeholder="Enter user email"
                                value={addAdminForm.user_email}
                                onChange={(e) => setAddAdminForm({
                                    ...addAdminForm,
                                    user_email: e.target.value
                                })}
                                disabled={addingAdmin}
                            />
                        </div>
                        <div className="space-y-2">
                            <div className="flex items-center space-x-2">
                                <Checkbox
                                    id="admin"
                                    checked={addAdminForm.make_admin}
                                    onCheckedChange={(checked) => setAddAdminForm({
                                        ...addAdminForm,
                                        make_admin: !!checked
                                    })}
                                    disabled={addingAdmin}
                                />
                                <Label htmlFor="admin">Admin Access</Label>
                            </div>
                            <div className="flex items-center space-x-2">
                                <Checkbox
                                    id="super-admin"
                                    checked={addAdminForm.make_super_admin}
                                    onCheckedChange={(checked) => setAddAdminForm({
                                        ...addAdminForm,
                                        make_super_admin: !!checked,
                                        make_admin: !!checked || addAdminForm.make_admin
                                    })}
                                    disabled={addingAdmin}
                                />
                                <Label htmlFor="super-admin">Super Admin Access</Label>
                            </div>
                        </div>
                        <div className="flex justify-end space-x-2">
                            <Button 
                                variant="outline" 
                                onClick={() => {
                                    if (!addingAdmin) {
                                        setShowAddAdminDialog(false);
                                    }
                                }}
                                disabled={addingAdmin}
                            >
                                Cancel
                            </Button>
                            <Button 
                                onClick={handleAddAdmin}
                                disabled={addingAdmin || !addAdminForm.user_email.trim()}
                            >
                                {addingAdmin && <RefreshCw className="h-4 w-4 mr-2 animate-spin" />}
                                {addingAdmin ? 'Adding...' : 'Add Admin'}
                            </Button>
                        </div>
                    </div>
                </DialogContent>
            </Dialog>

            {/* Edit Admin Dialog */}
            <Dialog 
                open={showEditAdminDialog} 
                onOpenChange={(open) => {
                    if (!updatingAdminRole) {
                        setShowEditAdminDialog(open);
                    }
                }}
            >
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Edit Admin Access</DialogTitle>
                        <DialogDescription>
                            Modify admin privileges for {selectedAdminUser?.name}
                        </DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4">
                        <div className="space-y-2">
                            <div className="flex items-center space-x-2">
                                <Checkbox
                                    id="edit-admin"
                                    checked={selectedAdminUser?.is_admin || false}
                                    onCheckedChange={(checked) => {
                                        if (selectedAdminUser) {
                                            setSelectedAdminUser({
                                                ...selectedAdminUser,
                                                is_admin: !!checked
                                            });
                                        }
                                    }}
                                    disabled={updatingAdminRole}
                                />
                                <Label htmlFor="edit-admin">Admin Access</Label>
                            </div>
                            <div className="flex items-center space-x-2">
                                <Checkbox
                                    id="edit-super-admin"
                                    checked={selectedAdminUser?.is_super_admin || false}
                                    onCheckedChange={(checked) => {
                                        if (selectedAdminUser) {
                                            setSelectedAdminUser({
                                                ...selectedAdminUser,
                                                is_super_admin: !!checked,
                                                is_admin: !!checked || selectedAdminUser.is_admin
                                            });
                                        }
                                    }}
                                    disabled={updatingAdminRole}
                                />
                                <Label htmlFor="edit-super-admin">Super Admin Access</Label>
                            </div>
                        </div>
                        <div className="flex justify-end space-x-2">
                            <Button 
                                variant="outline" 
                                onClick={() => {
                                    if (!updatingAdminRole) {
                                        setShowEditAdminDialog(false);
                                    }
                                }}
                                disabled={updatingAdminRole}
                            >
                                Cancel
                            </Button>
                            <Button 
                                onClick={handleUpdateAdminRole}
                                disabled={updatingAdminRole}
                            >
                                {updatingAdminRole && <RefreshCw className="h-4 w-4 mr-2 animate-spin" />}
                                {updatingAdminRole ? 'Updating...' : 'Update Access'}
                            </Button>
                        </div>
                    </div>
                </DialogContent>
            </Dialog>
        </div>
    );
}
