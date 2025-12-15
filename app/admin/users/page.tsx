'use client';

import { useState, useEffect } from 'react';
import { User, UserRole } from '@/types';
import {
  getAllUsers,
  createUser,
  updateUser,
  deleteUser,
  deactivateUser,
  activateUser,
} from '@/lib/admin-mock-data';
import UserTable from '@/components/admin/UserTable';
import UserForm from '@/components/admin/UserForm';
import { Plus, Search, Filter } from 'lucide-react';

export default function UsersPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [filteredUsers, setFilteredUsers] = useState<User[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterRole, setFilterRole] = useState<UserRole | 'all'>('all');
  const [filterStatus, setFilterStatus] = useState<'all' | 'active' | 'inactive'>('all');
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | undefined>(undefined);

  // Load users
  useEffect(() => {
    loadUsers();
  }, []);

  // Apply filters
  useEffect(() => {
    let filtered = users;

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(
        (user) =>
          user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          user.email.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Role filter
    if (filterRole !== 'all') {
      filtered = filtered.filter((user) => user.role === filterRole);
    }

    // Status filter
    if (filterStatus !== 'all') {
      filtered = filtered.filter((user) =>
        filterStatus === 'active' ? user.isActive : !user.isActive
      );
    }

    setFilteredUsers(filtered);
  }, [users, searchTerm, filterRole, filterStatus]);

  const loadUsers = () => {
    setUsers(getAllUsers());
  };

  const handleCreateUser = () => {
    setSelectedUser(undefined);
    setIsFormOpen(true);
  };

  const handleEditUser = (user: User) => {
    setSelectedUser(user);
    setIsFormOpen(true);
  };

  const handleSaveUser = (userData: Partial<User>) => {
    if (selectedUser) {
      // Update existing user
      updateUser(selectedUser.id, userData);
    } else {
      // Create new user
      createUser(userData as Omit<User, 'id' | 'createdAt' | 'updatedAt'>);
    }
    loadUsers();
    setIsFormOpen(false);
  };

  const handleDeleteUser = (userId: string) => {
    deleteUser(userId);
    loadUsers();
  };

  const handleToggleActive = (userId: string, isActive: boolean) => {
    if (isActive) {
      activateUser(userId);
    } else {
      deactivateUser(userId);
    }
    loadUsers();
  };

  const roleOptions: { value: UserRole | 'all'; label: string }[] = [
    { value: 'all', label: 'All Roles' },
    { value: 'SYSTEM_ADMIN', label: 'System Admin' },
    { value: 'DEPUTY_MD', label: 'Deputy MD' },
    { value: 'CHIEF_OF_SECTOR', label: 'Chief of Sector' },
    { value: 'HEAD_OF_DIVISION', label: 'Head of Division' },
    { value: 'DIVISION_SECRETARY', label: 'Secretary' },
  ];

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-0">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-gray-900">User Management</h1>
          <p className="text-xs sm:text-sm text-gray-600 mt-1">
            Manage system users, roles, and organizational assignments
          </p>
        </div>
        <button
          onClick={handleCreateUser}
          className="flex items-center justify-center space-x-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 text-sm sm:text-base whitespace-nowrap"
        >
          <Plus className="w-4 h-4 sm:w-5 sm:h-5" />
          <span>Create User</span>
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4">
        <div className="bg-white rounded-lg shadow p-3 sm:p-4">
          <div className="text-xs sm:text-sm text-gray-600">Total Users</div>
          <div className="text-xl sm:text-2xl font-bold text-gray-900">{users.length}</div>
        </div>
        <div className="bg-white rounded-lg shadow p-3 sm:p-4">
          <div className="text-xs sm:text-sm text-gray-600">Active Users</div>
          <div className="text-xl sm:text-2xl font-bold text-green-600">
            {users.filter((u) => u.isActive).length}
          </div>
        </div>
        <div className="bg-white rounded-lg shadow p-3 sm:p-4">
          <div className="text-xs sm:text-sm text-gray-600">Inactive Users</div>
          <div className="text-xl sm:text-2xl font-bold text-red-600">
            {users.filter((u) => !u.isActive).length}
          </div>
        </div>
        <div className="bg-white rounded-lg shadow p-3 sm:p-4">
          <div className="text-xs sm:text-sm text-gray-600">Admins</div>
          <div className="text-xl sm:text-2xl font-bold text-purple-600">
            {users.filter((u) => u.role === 'SYSTEM_ADMIN').length}
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-lg shadow p-3 sm:p-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 sm:gap-4">
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4 sm:w-5 sm:h-5" />
            <input
              type="text"
              placeholder="Search by name or email..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 sm:pl-10 pr-3 sm:pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 text-xs sm:text-sm"
            />
          </div>

          {/* Role Filter */}
          <div className="relative">
            <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4 sm:w-5 sm:h-5" />
            <select
              value={filterRole}
              onChange={(e) => setFilterRole(e.target.value as UserRole | 'all')}
              className="w-full pl-9 sm:pl-10 pr-3 sm:pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 appearance-none text-xs sm:text-sm"
            >
              {roleOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>

          {/* Status Filter */}
          <div className="relative">
            <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4 sm:w-5 sm:h-5" />
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value as 'all' | 'active' | 'inactive')}
              className="w-full pl-9 sm:pl-10 pr-3 sm:pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 appearance-none text-xs sm:text-sm"
            >
              <option value="all">All Status</option>
              <option value="active">Active Only</option>
              <option value="inactive">Inactive Only</option>
            </select>
          </div>
        </div>
      </div>

      {/* Users Table */}
      <UserTable
        users={filteredUsers}
        onEdit={handleEditUser}
        onDelete={handleDeleteUser}
        onToggleActive={handleToggleActive}
      />

      {/* User Form Modal */}
      <UserForm
        isOpen={isFormOpen}
        onClose={() => setIsFormOpen(false)}
        onSave={handleSaveUser}
        user={selectedUser}
      />
    </div>
  );
}
