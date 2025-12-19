'use client';

import { useState } from 'react';
import { User } from 'lucide-react';
import { mockUsers } from '@/lib/mock-data';

/**
 * Development-only component to switch between users for testing role-based access
 */
export default function UserSwitcher() {
  const [isOpen, setIsOpen] = useState(false);

  const handleSwitchUser = (userId: string) => {
    localStorage.setItem('mockUserId', userId);
    setIsOpen(false);
    window.location.reload(); // Reload to apply new user
  };

  const currentUserId = typeof window !== 'undefined' ? localStorage.getItem('mockUserId') : null;
  const currentUser = mockUsers.find(u => u.id === currentUserId) || mockUsers[0];

  return (
    <div className="fixed bottom-6 left-6 z-50">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="bg-gradient-to-br from-purple-600 to-purple-700 text-white rounded-full p-4 shadow-lg hover:shadow-xl transition-all active:scale-95"
        title="Switch User (Dev Only)"
      >
        <User className="w-6 h-6" />
      </button>

      {isOpen && (
        <div className="absolute bottom-16 left-0 bg-white rounded-xl shadow-2xl p-4 w-80 border-2 border-purple-200">
          <h3 className="text-sm font-bold text-gray-800 mb-3">Switch User (Dev Mode)</h3>
          <p className="text-xs text-gray-500 mb-3">
            Current: <span className="font-semibold text-purple-600">{currentUser.name}</span> ({currentUser.role})
          </p>
          <div className="space-y-2 max-h-96 overflow-y-auto">
            {mockUsers.map((user) => (
              <button
                key={user.id}
                onClick={() => handleSwitchUser(user.id)}
                className={`w-full text-left p-3 rounded-lg transition-all ${
                  user.id === currentUser.id
                    ? 'bg-purple-100 border-2 border-purple-500'
                    : 'bg-gray-50 hover:bg-gray-100 border-2 border-transparent'
                }`}
              >
                <div className="font-semibold text-sm text-gray-800">{user.name}</div>
                <div className="text-xs text-gray-500">{user.email}</div>
                <div className="text-xs font-medium text-purple-600 mt-1">
                  {user.role.replace(/_/g, ' ')}
                </div>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
