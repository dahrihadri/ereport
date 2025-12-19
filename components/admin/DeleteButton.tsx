'use client';

import { useState, useCallback } from 'react';
import { toast } from 'sonner';
import { Trash2, Loader2 } from 'lucide-react';
import ConfirmDialog from '@/components/ui/ConfirmDialog';

interface DeleteButtonProps {
  itemId: string;
  itemName: string;
  itemType: 'user' | 'sector' | 'division' | 'project';
  onDelete: (id: string) => Promise<boolean> | boolean;
  onSuccess?: () => void;
  onError?: (error: Error) => void;
  disabled?: boolean;
  variant?: 'icon' | 'button' | 'text' | 'outline';
  size?: 'sm' | 'md' | 'lg';
  confirmTitle?: string;
  confirmMessage?: string;
  className?: string;
  showToast?: boolean;
  requireDoubleConfirm?: boolean;
  customSuccessMessage?: string;
  customErrorMessage?: string;
  buttonText?: string;
  ariaLabel?: string;
}

/**
 * Enhanced Reusable Delete Button with Confirmation Modal + Toast Feedback
 *
 * Features:
 * - Multiple variants (icon, button, text, outline)
 * - Configurable sizes
 * - Optional double confirmation for critical deletions
 * - Custom toast messages
 * - Error callbacks
 * - Accessibility support
 * - Loading states
 *
 * Usage:
 * <DeleteButton
 *   itemId="user-123"
 *   itemName="John Doe"
 *   itemType="user"
 *   onDelete={deleteUser}
 *   onSuccess={refreshList}
 *   variant="button"
 *   size="md"
 * />
 */
export default function DeleteButton({
  itemId,
  itemName,
  itemType,
  onDelete,
  onSuccess,
  onError,
  disabled = false,
  variant = 'icon',
  size = 'md',
  confirmTitle,
  confirmMessage,
  className = '',
  showToast = true,
  requireDoubleConfirm = false,
  customSuccessMessage,
  customErrorMessage,
  buttonText,
  ariaLabel,
}: DeleteButtonProps) {
  const [showConfirm, setShowConfirm] = useState(false);
  const [showDoubleConfirm, setShowDoubleConfirm] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const itemTypeLabel = {
    user: 'User',
    sector: 'Sector',
    division: 'Division',
    project: 'Project',
  }[itemType];

  const handleDeleteClick = useCallback(() => {
    setShowConfirm(true);
  }, []);

  const handleConfirm = useCallback(async () => {
    // If double confirm is required and not yet shown
    if (requireDoubleConfirm && !showDoubleConfirm) {
      setShowDoubleConfirm(true);
      return;
    }

    setIsDeleting(true);

    try {
      const result = await onDelete(itemId);

      if (result) {
        // Success
        if (showToast) {
          toast.success(
            customSuccessMessage || `${itemTypeLabel} deleted successfully`,
            {
              description: `${itemName} has been removed`,
            }
          );
        }

        // Close modals
        setShowConfirm(false);
        setShowDoubleConfirm(false);

        // Callback
        if (onSuccess) {
          onSuccess();
        }
      } else {
        // Failed but didn't throw error
        if (showToast) {
          toast.error(
            customErrorMessage ||
              `Failed to delete ${itemTypeLabel.toLowerCase()}`,
            {
              description: `${itemName} could not be found or deleted`,
            }
          );
        }

        // Reset double confirm state
        setShowDoubleConfirm(false);
      }
    } catch (error: unknown) {
      // Error thrown
      const errorMessage =
        error instanceof Error ? error.message : 'An unexpected error occurred';

      if (showToast) {
        toast.error(
          customErrorMessage ||
            `Cannot delete ${itemTypeLabel.toLowerCase()}`,
          {
            description: errorMessage,
            duration: 5000,
          }
        );
      }

      // Call error callback if provided
      if (onError) {
        onError(error instanceof Error ? error : new Error(errorMessage));
      }

      // Reset double confirm state
      setShowDoubleConfirm(false);
    } finally {
      setIsDeleting(false);
    }
  }, [
    itemId,
    itemName,
    itemTypeLabel,
    onDelete,
    onSuccess,
    onError,
    showToast,
    customSuccessMessage,
    customErrorMessage,
    requireDoubleConfirm,
    showDoubleConfirm,
  ]);

  const handleCancel = useCallback(() => {
    if (showDoubleConfirm) {
      setShowDoubleConfirm(false);
    } else {
      setShowConfirm(false);
    }
  }, [showDoubleConfirm]);

  // Size classes
  const sizeClasses = {
    sm: 'w-7 h-7 text-xs',
    md: 'w-9 h-9 text-sm',
    lg: 'w-10 h-10 text-base',
  };

  const iconSizes = {
    sm: 'w-3.5 h-3.5',
    md: 'w-4 h-4',
    lg: 'w-5 h-5',
  };

  const buttonSizeClasses = {
    sm: 'px-3 py-1.5 text-xs',
    md: 'px-4 py-2 text-sm',
    lg: 'px-5 py-2.5 text-base',
  };

  // Render different variants
  const renderButton = () => {
    const defaultAriaLabel = ariaLabel || `Delete ${itemName}`;

    if (variant === 'icon') {
      return (
        <button
          onClick={handleDeleteClick}
          disabled={disabled || isDeleting}
          className={`
            ${sizeClasses[size]}
            flex items-center justify-center
            rounded-lg
            text-red-600 hover:text-red-700
            hover:bg-red-50
            transition-all duration-200
            disabled:opacity-50 disabled:cursor-not-allowed
            focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2
            ${className}
          `}
          title={defaultAriaLabel}
          aria-label={defaultAriaLabel}
        >
          {isDeleting ? (
            <Loader2 className={`${iconSizes[size]} animate-spin`} />
          ) : (
            <Trash2 className={iconSizes[size]} />
          )}
        </button>
      );
    }

    if (variant === 'button') {
      return (
        <button
          onClick={handleDeleteClick}
          disabled={disabled || isDeleting}
          className={`
            ${buttonSizeClasses[size]}
            flex items-center justify-center gap-2
            bg-red-600 text-white
            rounded-lg
            font-semibold
            hover:bg-red-700
            transition-all duration-200
            disabled:opacity-50 disabled:cursor-not-allowed
            focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2
            ${className}
          `}
          aria-label={defaultAriaLabel}
        >
          {isDeleting ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              Deleting...
            </>
          ) : (
            <>
              <Trash2 className="w-4 h-4" />
              {buttonText || 'Delete'}
            </>
          )}
        </button>
      );
    }

    if (variant === 'outline') {
      return (
        <button
          onClick={handleDeleteClick}
          disabled={disabled || isDeleting}
          className={`
            ${buttonSizeClasses[size]}
            flex items-center justify-center gap-2
            border-2 border-red-600 text-red-600
            bg-white
            rounded-lg
            font-semibold
            hover:bg-red-50
            transition-all duration-200
            disabled:opacity-50 disabled:cursor-not-allowed
            focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2
            ${className}
          `}
          aria-label={defaultAriaLabel}
        >
          {isDeleting ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              Deleting...
            </>
          ) : (
            <>
              <Trash2 className="w-4 h-4" />
              {buttonText || 'Delete'}
            </>
          )}
        </button>
      );
    }

    // variant === 'text'
    return (
      <button
        onClick={handleDeleteClick}
        disabled={disabled || isDeleting}
        className={`
          text-red-600 hover:text-red-700
          font-medium
          transition-all duration-200
          disabled:opacity-50 disabled:cursor-not-allowed
          focus:outline-none focus:underline
          ${className}
        `}
        aria-label={defaultAriaLabel}
      >
        {isDeleting ? 'Deleting...' : buttonText || 'Delete'}
      </button>
    );
  };

  return (
    <>
      {renderButton()}

      {/* First confirmation dialog */}
      <ConfirmDialog
        isOpen={showConfirm && !showDoubleConfirm}
        onClose={() => !isDeleting && setShowConfirm(false)}
        onConfirm={handleConfirm}
        title={confirmTitle || `Delete ${itemTypeLabel}?`}
        message={
          confirmMessage ||
          `Are you sure you want to delete ${itemName}? This action cannot be undone.`
        }
        confirmText={requireDoubleConfirm ? 'Continue' : 'Delete'}
        cancelText="Cancel"
        variant="danger"
        loading={isDeleting && !requireDoubleConfirm}
      />

      {/* Double confirmation dialog */}
      {requireDoubleConfirm && (
        <ConfirmDialog
          isOpen={showDoubleConfirm}
          onClose={handleCancel}
          onConfirm={handleConfirm}
          title="Final Confirmation Required"
          message={`This is a critical action and cannot be reversed! You are about to permanently delete "${itemName}". All associated data will be lost. Click "Delete Forever" to confirm, or "Go Back" to cancel.`}
          confirmText="Delete Forever"
          cancelText="Go Back"
          variant="danger"
          loading={isDeleting}
        />
      )}
    </>
  );
}
