"use client";

import React, { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import {
  Users,
  CreditCard,
  FileText,
  Bell,
  Edit3,
  Menu,
  Home,
  LogOut,
  Crown,
  Shield,
  HomeIcon
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import AdminProtectedLayout from "@/components/AdminProtectedLayout";
import { useAuth } from "@/components/AuthContext";
import { signOut } from "firebase/auth";
import { auth } from "@/lib/firebase";

interface AdminLayoutProps {
  children: React.ReactNode;
}

const sidebarItems = [
  { icon: Home, label: "Dashboard", href: "/admin" },
  { icon: Users, label: "User Management", href: "/admin/users" },
  { icon: CreditCard, label: "Payment Management", href: "/admin/payments" },
  { icon: HomeIcon, label: "Home Page", href: "/" },
  // { icon: FileText, label: "Resume Analytics", href: "/admin/analytics" },
  // { icon: Bell, label: "Notifications", href: "/admin/notifications" },
  // { icon: Edit3, label: "Template Editor", href: "/admin/templates" },
];

function SidebarContent() {
  const pathname = usePathname();
  const { user } = useAuth();
  const [adminStatus, setAdminStatus] = useState({
    isAdmin: false,
    isSuperAdmin: false,
    loading: true
  });

  useEffect(() => {
    const checkAdminStatus = async () => {
      if (!user) {
        setAdminStatus({ isAdmin: false, isSuperAdmin: false, loading: false });
        return;
      }

      try {
        const tokenResult = await user.getIdTokenResult(true);
        const claims = tokenResult.claims;

        setAdminStatus({
          isAdmin: claims.admin === true || claims.admin === "true",
          isSuperAdmin: claims.superAdmin === true || claims.superAdmin === "true",
          loading: false
        });
      } catch (error) {
        console.error('Failed to get admin status:', error);
        setAdminStatus({ isAdmin: false, isSuperAdmin: false, loading: false });
      }
    };

    checkAdminStatus();
  }, [user]);

  const handleLogout = async () => {
    try {
      await signOut(auth);
      window.location.href = '/';
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  return (
    <div className="flex flex-col h-full">
      <div className="p-6 border-b border-gray-200">
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
            <FileText className="h-5 w-5 text-white" />
          </div>
          <h2 className="text-xl font-bold text-gray-900">Admin Panel</h2>
        </div>
      </div>

      <nav className="flex-1 p-4 space-y-2">
        {sidebarItems.map((item, index) => {
          const isActive = pathname === item.href;
          return (
            <a
              key={index}
              href={item.href}
              className={`flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors ${isActive
                  ? "bg-blue-50 text-blue-700 border border-blue-200"
                  : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                }`}
            >
              <item.icon className="h-5 w-5" />
              <span className="font-medium">{item.label}</span>
            </a>
          );
        })}
      </nav>

      <div className="p-4 border-t border-gray-200">
        <div className="flex items-center space-x-3 px-4 py-3">
          <Avatar>
            <AvatarImage src={user?.photoURL || undefined} />
            <AvatarFallback className="bg-gray-300">
              {user?.displayName?.split(" ").map((n: string) => n[0]).join("") ||
                user?.email?.charAt(0).toUpperCase() || "A"}
            </AvatarFallback>
          </Avatar>
          <div className="flex-1 min-w-0">
            <div className="flex items-center space-x-2">
              <p className="text-sm font-medium text-gray-900 truncate">
                {user?.displayName || user?.email?.split('@')[0] || "Admin User"}
              </p>
              {adminStatus.isSuperAdmin && (
                <Badge variant="default" className="bg-purple-100 text-purple-700">
                  <Crown className="h-3 w-3 mr-1" />
                  Super
                </Badge>
              )}
              {adminStatus.isAdmin && !adminStatus.isSuperAdmin && (
                <Badge variant="secondary" className="bg-blue-100 text-blue-700">
                  <Shield className="h-3 w-3 mr-1" />
                  Admin
                </Badge>
              )}
            </div>
            <p className="text-xs text-gray-500 truncate">
              {user?.email || "admin@aicvbuilder.com"}
            </p>
          </div>
        </div>
        <Button
          variant="ghost"
          className="w-full justify-start text-gray-600 hover:text-gray-900 mt-2"
          onClick={handleLogout}
        >
          <LogOut className="h-4 w-4 mr-3" />
          Logout
        </Button>
      </div>
    </div>
  );
}

export default function AdminLayout({ children }: AdminLayoutProps) {
  return (
    <AdminProtectedLayout>
      <div className="min-h-screen bg-gray-50">
        <div className="hidden lg:fixed lg:inset-y-0 lg:flex lg:w-72 lg:flex-col">
          <div className="flex flex-col flex-grow bg-white shadow-sm">
            <SidebarContent />
          </div>
        </div>

        <div className="lg:hidden">
          <div className="flex items-center justify-between p-4 bg-white shadow-sm">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                <FileText className="h-5 w-5 text-white" />
              </div>
              <h1 className="text-xl font-bold text-gray-900">Admin Panel</h1>
            </div>

            <Sheet>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon">
                  <Menu className="h-6 w-6" />
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="p-0 w-72">
                <SidebarContent />
              </SheetContent>
            </Sheet>
          </div>
        </div>

        <div className="lg:pl-72">
          <main className="flex-1">
            {children}
          </main>
        </div>
      </div>
    </AdminProtectedLayout>
  );
}
