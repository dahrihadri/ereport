'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { LogOut, Loader2 } from 'lucide-react';
import ConfirmDialog from '@/components/ui/ConfirmDialog';
import { toast } from 'sonner';

interface SignOutButtonProps {
  variant?: 'default' | 'icon' | 'text';
  className?: string;
}

export default function SignOutButton({
  variant = 'default',
  className = '',
}: SignOutButtonProps) {
  const router = useRouter();
  const [showConfirm, setShowConfirm] = useState(false);
  const [isSigningOut, setIsSigningOut] = useState(false);

  const handleSignOut = async () => {
    setIsSigningOut(true);

    try {
      // Clear localStorage
      localStorage.removeItem('mockUserId');
      localStorage.removeItem('mockUserRole');

      // Show success message
      toast.success('Signed out successfully', {
        description: 'You have been logged out of your account',
      });

      // Small delay for better UX
      await new Promise((resolve) => setTimeout(resolve, 500));

      // Redirect to login page
      router.push('/');
    } catch (error) {
      toast.error('Sign out failed', {
        description: 'An error occurred while signing out. Please try again.',
      });
      setIsSigningOut(false);
    }
  };

  if (variant === 'icon') {
    return (
      <>
        <button
          onClick={() => setShowConfirm(true)}
          disabled={isSigningOut}
          className={`
            p-2 text-gray-600 hover:text-red-600 hover:bg-red-50
            rounded-lg transition-all
            disabled:opacity-50 disabled:cursor-not-allowed
            focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2
            ${className}
          `}
          title="Sign Out"
          aria-label="Sign Out"
        >
          {isSigningOut ? (
            <Loader2 className="w-5 h-5 animate-spin" />
          ) : (
            <LogOut className="w-5 h-5" />
          )}
        </button>

        <ConfirmDialog
          isOpen={showConfirm}
          onClose={() => !isSigningOut && setShowConfirm(false)}
          onConfirm={handleSignOut}
          title="Sign Out?"
          message="Are you sure you want to sign out of your account?"
          confirmText="Sign Out"
          cancelText="Cancel"
          variant="warning"
          loading={isSigningOut}
        />
      </>
    );
  }

  if (variant === 'text') {
    return (
      <>
        <button
          onClick={() => setShowConfirm(true)}
          disabled={isSigningOut}
          className={`
            text-gray-600 hover:text-red-600
            font-medium transition-colors
            disabled:opacity-50 disabled:cursor-not-allowed
            focus:outline-none focus:underline
            ${className}
          `}
          aria-label="Sign Out"
        >
          {isSigningOut ? 'Signing out...' : 'Sign Out'}
        </button>

        <ConfirmDialog
          isOpen={showConfirm}
          onClose={() => !isSigningOut && setShowConfirm(false)}
          onConfirm={handleSignOut}
          title="Sign Out?"
          message="Are you sure you want to sign out of your account?"
          confirmText="Sign Out"
          cancelText="Cancel"
          variant="warning"
          loading={isSigningOut}
        />
      </>
    );
  }

  // Default variant - full button
  return (
    <>
      <button
        onClick={() => setShowConfirm(true)}
        disabled={isSigningOut}
        className={`
          flex items-center gap-2 px-4 py-2
          bg-white text-gray-700 border border-gray-300
          rounded-lg font-medium
          hover:bg-gray-50 hover:border-gray-400
          transition-all
          disabled:opacity-50 disabled:cursor-not-allowed
          focus:outline-none focus:ring-2 focus:ring-gray-400 focus:ring-offset-2
          ${className}
        `}
        aria-label="Sign Out"
      >
        {isSigningOut ? (
          <>
            <Loader2 className="w-4 h-4 animate-spin" />
            <span>Signing out...</span>
          </>
        ) : (
          <>
            <LogOut className="w-4 h-4" />
            <span>Sign Out</span>
          </>
        )}
      </button>

      <ConfirmDialog
        isOpen={showConfirm}
        onClose={() => !isSigningOut && setShowConfirm(false)}
        onConfirm={handleSignOut}
        title="Sign Out?"
        message="Are you sure you want to sign out of your account?"
        confirmText="Sign Out"
        cancelText="Cancel"
        variant="warning"
        loading={isSigningOut}
      />
    </>
  );
}
