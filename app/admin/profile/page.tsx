'use client';

import { useState } from 'react';
import { User, Mail, Shield, Calendar, Edit2, Save, X, Key, Building2 } from 'lucide-react';

export default function AdminProfilePage() {
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: 'System Administrator',
    email: 'admin@mcmc.gov.my',
  });

  // Mock admin data
  const adminUser = {
    id: 'admin-1',
    name: 'System Administrator',
    email: 'admin@mcmc.gov.my',
    role: 'SYSTEM_ADMIN',
    permissions: [
      'Manage Users',
      'Manage Sectors',
      'Manage Divisions',
      'Manage Projects',
      'View Audit Logs',
      'System Configuration',
    ],
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date(),
    isActive: true,
  };

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleCancel = () => {
    setFormData({
      name: adminUser.name,
      email: adminUser.email,
    });
    setIsEditing(false);
  };

  const handleSave = () => {
    console.log('Saving admin profile:', formData);
    setIsEditing(false);
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Admin Profile</h1>
        <p className="text-sm text-gray-600 mt-1">Manage your administrator account information</p>
      </div>

      {/* Profile Card */}
      <div className="bg-white rounded-xl sm:rounded-2xl shadow-lg border border-gray-200 overflow-hidden">
        {/* Header Section with Avatar */}
        <div className="bg-gradient-to-r from-red-500 to-red-600 px-6 py-8 sm:px-8 sm:py-10">
          <div className="flex flex-col sm:flex-row items-center gap-6">
            <div className="w-24 h-24 sm:w-32 sm:h-32 bg-white rounded-full flex items-center justify-center text-red-600 font-bold text-4xl sm:text-5xl shadow-xl">
              {adminUser.name.charAt(0).toUpperCase()}
            </div>
            <div className="text-center sm:text-left text-white">
              <h2 className="text-2xl sm:text-3xl font-bold">{adminUser.name}</h2>
              <p className="text-red-100 mt-1">{adminUser.email}</p>
              <div className="mt-3 inline-flex items-center gap-2 bg-white/20 backdrop-blur-sm px-4 py-2 rounded-full">
                <Shield className="w-4 h-4" />
                <span className="text-sm font-semibold">System Administrator</span>
              </div>
            </div>
          </div>
        </div>

        {/* Profile Information */}
        <div className="p-6 sm:p-8">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-semibold text-gray-800">Account Information</h3>
            {!isEditing ? (
              <button
                onClick={handleEdit}
                className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-red-600 hover:text-red-700 hover:bg-red-50 rounded-lg transition-colors"
              >
                <Edit2 className="w-4 h-4" />
                Edit Profile
              </button>
            ) : (
              <div className="flex gap-2">
                <button
                  onClick={handleCancel}
                  className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-600 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <X className="w-4 h-4" />
                  Cancel
                </button>
                <button
                  onClick={handleSave}
                  className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-red-600 hover:bg-red-700 rounded-lg transition-colors"
                >
                  <Save className="w-4 h-4" />
                  Save Changes
                </button>
              </div>
            )}
          </div>

          <div className="space-y-6">
            {/* Name Field */}
            <div>
              <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
                <User className="w-4 h-4" />
                Full Name
              </label>
              {isEditing ? (
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-colors"
                  placeholder="Enter your full name"
                />
              ) : (
                <p className="text-gray-900 px-4 py-2.5 bg-gray-50 rounded-lg">{adminUser.name}</p>
              )}
            </div>

            {/* Email Field */}
            <div>
              <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
                <Mail className="w-4 h-4" />
                Email Address
              </label>
              {isEditing ? (
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-colors"
                  placeholder="Enter your email"
                />
              ) : (
                <p className="text-gray-900 px-4 py-2.5 bg-gray-50 rounded-lg">{adminUser.email}</p>
              )}
            </div>

            {/* Role Field (Read-only) */}
            <div>
              <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
                <Shield className="w-4 h-4" />
                Role
              </label>
              <p className="text-gray-900 px-4 py-2.5 bg-gray-50 rounded-lg">System Administrator</p>
              <p className="text-xs text-gray-500 mt-1">Highest level of system access</p>
            </div>

            {/* Permissions */}
            <div>
              <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
                <Key className="w-4 h-4" />
                Permissions
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {adminUser.permissions.map((permission, idx) => (
                  <div key={idx} className="flex items-center gap-2 px-4 py-2 bg-red-50 border border-red-200 rounded-lg">
                    <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                    <span className="text-sm text-gray-900">{permission}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Account Info */}
            <div>
              <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
                <Calendar className="w-4 h-4" />
                Account Details
              </label>
              <div className="px-4 py-3 bg-gray-50 rounded-lg space-y-1">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Admin ID:</span>
                  <span className="text-gray-900 font-mono">{adminUser.id}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Account Created:</span>
                  <span className="text-gray-900">{new Date(adminUser.createdAt).toLocaleDateString('en-MY', { year: 'numeric', month: 'long', day: 'numeric' })}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Last Updated:</span>
                  <span className="text-gray-900">{new Date(adminUser.updatedAt).toLocaleDateString('en-MY', { year: 'numeric', month: 'long', day: 'numeric' })}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Account Status:</span>
                  <span className={`font-medium ${adminUser.isActive ? 'text-green-600' : 'text-red-600'}`}>
                    {adminUser.isActive ? 'Active' : 'Inactive'}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Security Notice */}
      <div className="bg-red-50 border border-red-200 rounded-xl p-4 sm:p-6">
        <div className="flex items-start gap-3">
          <Shield className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
          <div>
            <h4 className="text-sm font-semibold text-red-900 mb-1">Administrator Account Security</h4>
            <p className="text-sm text-red-700">
              As a system administrator, you have full access to all system features and user data. Please ensure your account credentials are kept secure and follow best security practices.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
