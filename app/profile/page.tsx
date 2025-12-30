'use client';

import { useState } from 'react';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { useCurrentUser } from '@/lib/use-current-user';
import { User, Mail, Building2, Shield, Calendar, Edit2, Save, X } from 'lucide-react';
import { mockDivisions, mockSectors } from '@/lib/mock-data';

export default function ProfilePage() {
  const currentUser = useCurrentUser();
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
  });

  // Show loading while user is being loaded
  if (!currentUser) {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  }

  // Initialize form data when user is loaded
  if (formData.name === '' && currentUser) {
    setFormData({
      name: currentUser.name,
      email: currentUser.email,
    });
  }

  // Get user's divisions and sectors
  const userDivisions = mockDivisions.filter(div =>
    currentUser.divisionIds.includes(div.id)
  );
  const userSectors = mockSectors.filter(sec =>
    currentUser.sectorIds.includes(sec.id)
  );

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleCancel = () => {
    setFormData({
      name: currentUser.name,
      email: currentUser.email,
    });
    setIsEditing(false);
  };

  const handleSave = () => {
    // TODO: Implement actual save functionality
    console.log('Saving profile:', formData);
    setIsEditing(false);
    // In a real app, you would update localStorage or make an API call here
  };

  const getRoleLabel = (role: string) => {
    switch (role) {
      case 'HEAD_OF_DIVISION':
        return 'Head of Division';
      case 'DIVISION_SECRETARY':
        return 'Division Secretary';
      case 'CHIEF_OF_SECTOR':
        return 'Chief of Sector';
      case 'DEPUTY_MD':
        return 'Deputy Managing Director';
      case 'SYSTEM_ADMIN':
        return 'System Administrator';
      default:
        return role;
    }
  };

  return (
    <DashboardLayout
      user={{
        name: currentUser.name,
        email: currentUser.email,
        role: currentUser.role,
      }}
      currentUser={currentUser}
    >
      {/* Page Header */}
      <div className="mb-6">
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Profile Settings</h1>
        <p className="text-sm text-gray-600 mt-1">Manage your account information and preferences</p>
      </div>

      {/* Profile Card */}
      <div className="bg-white rounded-xl sm:rounded-2xl shadow-lg border border-gray-200 overflow-hidden">
        {/* Header Section with Avatar */}
        <div className="bg-gradient-to-r from-blue-500 to-blue-600 px-6 py-8 sm:px-8 sm:py-10">
          <div className="flex flex-col sm:flex-row items-center gap-6">
            <div className="w-24 h-24 sm:w-32 sm:h-32 bg-white rounded-full flex items-center justify-center text-blue-600 font-bold text-4xl sm:text-5xl shadow-xl">
              {currentUser.name.charAt(0).toUpperCase()}
            </div>
            <div className="text-center sm:text-left text-white">
              <h2 className="text-2xl sm:text-3xl font-bold">{currentUser.name}</h2>
              <p className="text-blue-100 mt-1">{currentUser.email}</p>
              <div className="mt-3 inline-flex items-center gap-2 bg-white/20 backdrop-blur-sm px-4 py-2 rounded-full">
                <Shield className="w-4 h-4" />
                <span className="text-sm font-semibold">{getRoleLabel(currentUser.role)}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Profile Information */}
        <div className="p-6 sm:p-8">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-semibold text-gray-800">Personal Information</h3>
            {!isEditing ? (
              <button
                onClick={handleEdit}
                className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-blue-600 hover:text-blue-700 hover:bg-blue-50 rounded-lg transition-colors"
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
                  className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors"
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
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                  placeholder="Enter your full name"
                />
              ) : (
                <p className="text-gray-900 px-4 py-2.5 bg-gray-50 rounded-lg">{currentUser.name}</p>
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
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                  placeholder="Enter your email"
                />
              ) : (
                <p className="text-gray-900 px-4 py-2.5 bg-gray-50 rounded-lg">{currentUser.email}</p>
              )}
            </div>

            {/* Role Field (Read-only) */}
            <div>
              <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
                <Shield className="w-4 h-4" />
                Role
              </label>
              <p className="text-gray-900 px-4 py-2.5 bg-gray-50 rounded-lg">{getRoleLabel(currentUser.role)}</p>
              <p className="text-xs text-gray-500 mt-1">Your role is managed by system administrators</p>
            </div>

            {/* Divisions */}
            {userDivisions.length > 0 && (
              <div>
                <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
                  <Building2 className="w-4 h-4" />
                  Division{userDivisions.length > 1 ? 's' : ''}
                </label>
                <div className="space-y-2">
                  {userDivisions.map((division) => (
                    <div key={division.id} className="px-4 py-2.5 bg-gray-50 rounded-lg">
                      <p className="text-gray-900 font-medium">{division.name}</p>
                      <p className="text-xs text-gray-500 mt-0.5">{division.code}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Sectors */}
            {userSectors.length > 0 && (
              <div>
                <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
                  <Building2 className="w-4 h-4" />
                  Sector{userSectors.length > 1 ? 's' : ''}
                </label>
                <div className="space-y-2">
                  {userSectors.map((sector) => (
                    <div key={sector.id} className="px-4 py-2.5 bg-gray-50 rounded-lg">
                      <p className="text-gray-900 font-medium">{sector.name}</p>
                      <p className="text-xs text-gray-500 mt-0.5">{sector.code}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Account Info */}
            <div>
              <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
                <Calendar className="w-4 h-4" />
                Account Information
              </label>
              <div className="px-4 py-3 bg-gray-50 rounded-lg space-y-1">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">User ID:</span>
                  <span className="text-gray-900 font-mono">{currentUser.id}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Account Created:</span>
                  <span className="text-gray-900">{new Date(currentUser.createdAt).toLocaleDateString('en-MY', { year: 'numeric', month: 'long', day: 'numeric' })}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Last Updated:</span>
                  <span className="text-gray-900">{new Date(currentUser.updatedAt).toLocaleDateString('en-MY', { year: 'numeric', month: 'long', day: 'numeric' })}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Account Status:</span>
                  <span className={`font-medium ${currentUser.isActive ? 'text-green-600' : 'text-red-600'}`}>
                    {currentUser.isActive ? 'Active' : 'Inactive'}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Additional Info Card */}
      <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 sm:p-6 mt-6">
        <h4 className="text-sm font-semibold text-blue-900 mb-2">Need to update other information?</h4>
        <p className="text-sm text-blue-700">
          For changes to your role, division assignment, or other sensitive information, please contact your system administrator or HR department.
        </p>
      </div>
    </DashboardLayout>
  );
}
