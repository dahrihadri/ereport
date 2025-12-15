'use client';

import { useEffect, useState } from 'react';
import { User } from '@/types';
import { mockUsers } from './mock-data';

/**
 * Hook to get current logged-in user from localStorage
 * Falls back to first user (Ahmad Faizal) if not set
 */
export function useCurrentUser(): User | null {
  const [currentUser, setCurrentUser] = useState<User | null>(null);

  useEffect(() => {
    // Get user info from localStorage (set during login)
    const mockUserId = localStorage.getItem('mockUserId');
    const mockUserRole = localStorage.getItem('mockUserRole');

    // Try to find user by ID first
    if (mockUserId) {
      const user = mockUsers.find(u => u.id === mockUserId);
      if (user) {
        setCurrentUser(user);
        return;
      }
    }

    // Try to find by role (legacy support)
    if (mockUserRole) {
      const user = mockUsers.find(u => u.role === mockUserRole);
      if (user) {
        setCurrentUser(user);
        return;
      }
    }

    // Fallback to first user (Ahmad Faizal - Head of Division)
    setCurrentUser(mockUsers[0]);
  }, []);

  return currentUser;
}
