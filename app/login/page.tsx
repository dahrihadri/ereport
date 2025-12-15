'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { User } from '@/types';
import { mockUsers } from '@/lib/mock-data';
import { Shield, Users, Building2, UserCog, FileText } from 'lucide-react';

export default function LoginPage() {
  const router = useRouter();
  const [selectedUser, setSelectedUser] = useState<User>(mockUsers[0]);

  // Group users by role for display
  const getRoleIcon = (role: string) => {
    switch (role) {
      case 'SYSTEM_ADMIN': return Shield;
      case 'DEPUTY_MD': return Users;
      case 'CHIEF_OF_SECTOR': return Building2;
      case 'HEAD_OF_DIVISION': return UserCog;
      case 'DIVISION_SECRETARY': return FileText;
      default: return UserCog;
    }
  };

  const getRoleColor = (role: string) => {
    switch (role) {
      case 'SYSTEM_ADMIN': return 'from-red-500 to-red-600';
      case 'DEPUTY_MD': return 'from-purple-500 to-purple-600';
      case 'CHIEF_OF_SECTOR': return 'from-blue-500 to-blue-600';
      case 'HEAD_OF_DIVISION': return 'from-green-500 to-green-600';
      case 'DIVISION_SECRETARY': return 'from-gray-500 to-gray-600';
      default: return 'from-gray-500 to-gray-600';
    }
  };

  const getRoleLabel = (role: string) => {
    switch (role) {
      case 'SYSTEM_ADMIN': return 'System Admin';
      case 'DEPUTY_MD': return 'Deputy MD';
      case 'CHIEF_OF_SECTOR': return 'Chief of Sector';
      case 'HEAD_OF_DIVISION': return 'Head of Division';
      case 'DIVISION_SECRETARY': return 'Secretary';
      default: return role;
    }
  };

  const handleAzureADLogin = () => {
    // Store selected user info in localStorage for wireframe testing
    localStorage.setItem('mockUserId', selectedUser.id);
    localStorage.setItem('mockUserRole', selectedUser.role);
    localStorage.setItem('mockUserName', selectedUser.name);
    localStorage.setItem('mockUserEmail', selectedUser.email);

    // Redirect based on role
    if (selectedUser.role === 'SYSTEM_ADMIN') {
      router.push('/admin');
    } else {
      router.push('/dashboard');
    }
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Two Column Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-2 min-h-screen">

        {/* LEFT SIDE - Branding Section */}
        <div className="relative bg-gradient-to-br from-blue-600 to-blue-800 p-8 lg:p-12 flex flex-col justify-between overflow-hidden">
          {/* Subtle decorative pattern */}
          <div className="absolute inset-0 opacity-10">
            <div className="absolute top-20 left-20">
              <div className="grid grid-cols-4 gap-3">
                {[...Array(20)].map((_, i) => (
                  <div key={i} className="w-2 h-2 bg-white rounded-full" />
                ))}
              </div>
            </div>
            <div className="absolute bottom-32 right-20">
              <div className="grid grid-cols-4 gap-3">
                {[...Array(16)].map((_, i) => (
                  <div key={i} className="w-2 h-2 bg-white rounded-full" />
                ))}
              </div>
            </div>
          </div>

          {/* Content */}
          <div className="relative z-10">
            <div className="flex items-center gap-4 mb-8">
              <div className="relative w-16 h-16 bg-white rounded-lg p-2">
                <Image
                  src="/MCMC_Logo.png"
                  alt="MCMC Logo"
                  width={48}
                  height={48}
                  className="object-contain"
                />
              </div>
              <div>
                <h2 className="text-white text-2xl font-bold">MCMC</h2>
                <p className="text-blue-100 text-sm">Malaysian Communications and Multimedia Commission</p>
              </div>
            </div>
          </div>

          {/* Main message */}
          <div className="relative z-10 my-auto">
            <h1 className="text-white text-4xl lg:text-5xl font-bold mb-6 leading-tight">
              DMDPR<br />Management System
            </h1>
            <p className="text-blue-100 text-lg lg:text-xl max-w-md">
              Streamline your divisional monthly performance reporting with our 3-tier approval workflow system.
            </p>
          </div>

          {/* Footer info */}
          <div className="relative z-10">
            <p className="text-blue-100 text-sm">
              Secure access powered by Azure Active Directory
            </p>
          </div>
        </div>

        {/* RIGHT SIDE - Login Section */}
        <div className="flex items-center justify-center p-8 lg:p-12 bg-gray-50">
          <div className="w-full max-w-md">
            {/* Login Card */}
            <div className="bg-white rounded-2xl shadow-xl border border-gray-200 p-8 lg:p-10">
              {/* Welcome message */}
              <div className="mb-6">
                <h2 className="text-3xl font-bold text-gray-800 mb-2">
                  Welcome Back
                </h2>
                <p className="text-gray-600">
                  Sign in to access your dashboard
                </p>
              </div>

              {/* Wireframe Mode Banner */}
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3 mb-6">
                <p className="text-xs text-yellow-800 font-medium mb-1">
                  🎨 Wireframe Mode
                </p>
                <p className="text-xs text-yellow-700">
                  Select a user below to simulate Azure AD login
                </p>
              </div>

              {/* User Selection */}
              <div className="mb-6">
                <label className="block text-sm font-semibold text-gray-700 mb-3">
                  Select User Account
                </label>
                <div className="space-y-2 max-h-80 overflow-y-auto pr-2">
                  {mockUsers.map((user) => {
                    const Icon = getRoleIcon(user.role);
                    return (
                      <button
                        key={user.id}
                        onClick={() => setSelectedUser(user)}
                        className={`w-full text-left p-3 rounded-lg border-2 transition-all ${
                          selectedUser.id === user.id
                            ? 'border-blue-500 bg-blue-50'
                            : 'border-gray-200 hover:border-gray-300 bg-white'
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <div className={`w-10 h-10 rounded-lg bg-gradient-to-br ${getRoleColor(user.role)} flex items-center justify-center flex-shrink-0`}>
                            <Icon className="w-5 h-5 text-white" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 mb-0.5">
                              <p className="font-semibold text-gray-900 text-sm">
                                {user.name}
                              </p>
                              {selectedUser.id === user.id && (
                                <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
                              )}
                            </div>
                            <p className="text-xs text-gray-600">
                              {user.email}
                            </p>
                            <p className="text-xs text-gray-500 mt-0.5">
                              {getRoleLabel(user.role)}
                            </p>
                          </div>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Single Sign-On Section */}
              <div className="mb-4">
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 mb-4">
                  <p className="text-xs text-blue-800 font-medium mb-1">
                    Single Sign-On (SSO)
                  </p>
                  <p className="text-xs text-blue-600">
                    Currently simulating: <span className="font-semibold">{selectedUser.name}</span>
                  </p>
                </div>

                {/* Azure AD Button */}
                <button
                  onClick={handleAzureADLogin}
                  className="block w-full bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-semibold py-4 px-6 rounded-lg transition-all shadow-lg hover:shadow-xl text-center"
                >
                  Sign in with Azure AD
                </button>
              </div>

              {/* Production Note */}
              <div className="bg-gray-50 rounded-lg p-3">
                <p className="text-xs text-gray-600">
                  <span className="font-semibold">Wireframe Mode:</span> User selection simulates Azure AD authentication. In production, Azure AD will automatically identify users.
                </p>
              </div>
            </div>

            {/* Footer Links */}
            <div className="mt-8">
              <p className="text-xs text-gray-500 text-center mb-3">
                © 2025 Malaysian Communications and Multimedia Commission. All rights reserved.
              </p>
              <div className="flex justify-center gap-6 text-xs">
                <Link href="#" className="text-gray-500 hover:text-blue-600 transition-colors">
                  Privacy Policy
                </Link>
                <Link href="#" className="text-gray-500 hover:text-blue-600 transition-colors">
                  Terms of Use
                </Link>
                <Link href="#" className="text-gray-500 hover:text-blue-600 transition-colors">
                  Cookie Policy
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
