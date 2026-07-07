'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/components/AuthContext';
import { useAdminAuth } from '@/hooks/useAdminAuth';
import axiosInstance from '@/lib/axios';
import { toast } from 'sonner';

interface User {
    id: number;
    username: string;
    email: string;
    phone: string;
    image_url: string;
    status: string;
    is_premium: boolean;
    total_resumes: number;
    total_spent: number;
}

interface AdminUser {
    id: number;
    name: string;
    email: string;
    phone: string;
    image_url: string;
    is_admin: boolean;
    is_super_admin: boolean;
}

interface UserStats {
    total_users: number;
    active_users: number;
    premium_users: number;
    total_resumes: number;
}

interface UsersData {
    stats: UserStats;
    users: User[];
}

interface UserManagementState {
    usersData: UsersData | null;
    adminUsers: AdminUser[];
    loading: boolean;
    error: string | null;
    addingAdmin: boolean;
    updatingAdminRole: boolean;
}

export const useUserManagement = () => {
    const { user } = useAuth();
    const { isAdmin, isSuperAdmin, loading: adminLoading, refreshAdminStatus } = useAdminAuth();
    const [state, setState] = useState<UserManagementState>({
        usersData: null,
        adminUsers: [],
        loading: true,
        error: null,
        addingAdmin: false,
        updatingAdminRole: false
    });

    const fetchUsers = async () => {
        try {
            const response = await axiosInstance.get('/api/admin/users/users-info');
            setState(prev => ({
                ...prev,
                usersData: response.data,
                error: null
            }));
        } catch (error: any) {
            console.error('Failed to fetch users:', error);
            setState(prev => ({
                ...prev,
                error: error.response?.data?.detail || 'Failed to fetch users'
            }));
        }
    };

    const fetchAdminUsers = async () => {
        try {
            const response = await axiosInstance.get('/api/admin/users/admin-users');
            setState(prev => ({
                ...prev,
                adminUsers: response.data,
                error: null
            }));
        } catch (error: any) {
            console.error('Failed to fetch admin users:', error);
            setState(prev => ({
                ...prev,
                error: error.response?.data?.detail || 'Failed to fetch admin users'
            }));
        }
    };

    const fetchCurrentUserInfo = async () => {
        // No need to fetch user info manually, useAdminAuth already provides it
        console.log('Admin status from useAdminAuth:', { isAdmin, isSuperAdmin });
    };

    const deleteUser = async (userId: number) => {
        try {
            await axiosInstance.delete('/api/admin/users/delete-user', {
                data: { user_id: userId }
            });
            toast.success('User deleted successfully');
            await fetchUsers();
        } catch (error: any) {
            console.error('Failed to delete user:', error);
            toast.error(error.response?.data?.detail || 'Failed to delete user');
        }
    };

    const updateAdminRole = async (userId: number, isAdmin: boolean, isSuperAdmin: boolean) => {
        try {
            setState(prev => ({ ...prev, updatingAdminRole: true }));
            
            await axiosInstance.post('/api/admin/users/update-admin-role', {
                user_id: userId,
                is_admin: isAdmin,
                is_super_admin: isSuperAdmin,
            });
            toast.success('Admin role updated successfully');
            await fetchAdminUsers();
            
            // Refresh current user's admin status in case they updated their own role
            await refreshAdminStatus();
        } catch (error: any) {
            console.error('Failed to update admin role:', error);
            toast.error(error.response?.data?.detail || 'Failed to update admin role');
        } finally {
            setState(prev => ({ ...prev, updatingAdminRole: false }));
        }
    };

    const addAdmin = async (userEmail: string, makeAdmin: boolean, makeSuperAdmin: boolean) => {
        try {
            setState(prev => ({ ...prev, addingAdmin: true }));
            
            await axiosInstance.post('/api/admin/admin-roles/add-admin', {
                user_email: userEmail,
                make_admin: makeAdmin,
                make_super_admin: makeSuperAdmin,
            });
            toast.success('Admin added successfully');
            await fetchAdminUsers();
            
            // Refresh admin status to update UI permissions
            await refreshAdminStatus();
        } catch (error: any) {
            console.error('Failed to add admin:', error);
            toast.error(error.response?.data?.detail || 'Failed to add admin');
        } finally {
            setState(prev => ({ ...prev, addingAdmin: false }));
        }
    };

    const removeAdminAccess = async (userId: number) => {
        await updateAdminRole(userId, false, false);
    };

    const fetchAllData = async () => {
        if (!user || adminLoading) {
            setState(prev => ({
                ...prev,
                loading: true,
                error: null
            }));
            return;
        }

        if (!isAdmin && !isSuperAdmin) {
            setState(prev => ({
                ...prev,
                loading: false,
                error: 'Admin access required'
            }));
            return;
        }

        try {
            setState(prev => ({ ...prev, loading: true, error: null }));
            
            await Promise.all([
                fetchCurrentUserInfo(),
                fetchUsers(),
                fetchAdminUsers()
            ]);

            setState(prev => ({ ...prev, loading: false }));
        } catch (error: any) {
            console.error('Failed to fetch data:', error);
            setState(prev => ({
                ...prev,
                loading: false,
                error: error.message || 'Failed to fetch data'
            }));
        }
    };

    useEffect(() => {
        fetchAllData();
    }, [user, isAdmin, isSuperAdmin, adminLoading]);    return {
        ...state,
        currentUser: {
            isAdmin,
            isSuperAdmin
        },
        loading: state.loading || adminLoading,
        deleteUser,
        updateAdminRole,
        addAdmin,
        removeAdminAccess,
        refetch: fetchAllData,
        refetchUsers: fetchUsers,
        refetchAdminUsers: fetchAdminUsers,
        refreshAdminStatus
    };
};
