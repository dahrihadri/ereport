# Delete Operation Best Practices

## 🎯 Recommended Pattern: Modal Confirm + Toast Result

### Why This Pattern?

1. **Modal (ConfirmDialog)**: Prevents accidental deletions - user must explicitly confirm
2. **Toast (Sonner)**: Shows the result of the action - success or error

This gives users:
- ✅ Safety (can't accidentally delete)
- ✅ Immediate feedback (knows it worked)
- ✅ Professional UX (like modern apps)

---

## 📝 Implementation Example

### Single Item Delete

```typescript
'use client';

import { useState } from 'react';
import { toast } from 'sonner';
import ConfirmDialog from '@/components/ui/ConfirmDialog';
import { deleteUser } from '@/lib/admin-mock-data';
import { logAuditEvent } from '@/lib/audit-trail';

export default function UserManagement() {
  const [deleteConfirm, setDeleteConfirm] = useState<{
    isOpen: boolean;
    userId: string | null;
    userName: string | null;
  }>({
    isOpen: false,
    userId: null,
    userName: null,
  });
  const [isDeleting, setIsDeleting] = useState(false);

  // Step 1: Show confirmation modal
  const handleDeleteClick = (userId: string, userName: string) => {
    setDeleteConfirm({
      isOpen: true,
      userId,
      userName,
    });
  };

  // Step 2: Execute delete and show toast
  const handleDeleteConfirm = async () => {
    if (!deleteConfirm.userId) return;

    setIsDeleting(true);

    try {
      const success = deleteUser(deleteConfirm.userId);

      if (success) {
        // Log the deletion
        logAuditEvent(
          currentUser.id,
          currentUser.name,
          'DELETE',
          'USER',
          deleteConfirm.userId,
          deleteConfirm.userName || 'Unknown'
        );

        // Show success toast
        toast.success(`${deleteConfirm.userName} deleted successfully`);

        // Refresh the list
        refreshUsers();
      } else {
        toast.error('User not found');
      }
    } catch (error) {
      // Show error toast
      toast.error(error.message || 'Failed to delete user');
    } finally {
      setIsDeleting(false);
      setDeleteConfirm({ isOpen: false, userId: null, userName: null });
    }
  };

  return (
    <div>
      {/* Your table with delete buttons */}
      <button
        onClick={() => handleDeleteClick(user.id, user.name)}
        className="text-red-600 hover:text-red-700"
      >
        Delete
      </button>

      {/* Confirmation Modal */}
      <ConfirmDialog
        isOpen={deleteConfirm.isOpen}
        onClose={() => setDeleteConfirm({ isOpen: false, userId: null, userName: null })}
        onConfirm={handleDeleteConfirm}
        title="Delete User?"
        message={`Are you sure you want to delete ${deleteConfirm.userName}? This action cannot be undone.`}
        confirmText="Delete"
        cancelText="Cancel"
        variant="danger"
        loading={isDeleting}
      />
    </div>
  );
}
```

---

## 🔥 Bulk Delete Pattern

For bulk operations, same pattern but with counts:

```typescript
'use client';

import { useState } from 'react';
import { toast } from 'sonner';
import ConfirmDialog from '@/components/ui/ConfirmDialog';
import { bulkDeleteUsers } from '@/lib/admin-mock-data';

export default function UserManagement() {
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [showBulkDeleteConfirm, setShowBulkDeleteConfirm] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  // Step 1: Show confirmation with count
  const handleBulkDeleteClick = () => {
    if (selectedIds.length === 0) {
      toast.warning('Please select users to delete');
      return;
    }
    setShowBulkDeleteConfirm(true);
  };

  // Step 2: Execute bulk delete
  const handleBulkDeleteConfirm = async () => {
    setIsDeleting(true);

    try {
      const { success, failed } = bulkDeleteUsers(selectedIds);

      // Show appropriate toast based on results
      if (failed === 0) {
        toast.success(`Successfully deleted ${success} user${success > 1 ? 's' : ''}`);
      } else if (success === 0) {
        toast.error(`Failed to delete ${failed} user${failed > 1 ? 's' : ''}`);
      } else {
        toast.warning(`Deleted ${success} user${success > 1 ? 's' : ''}, ${failed} failed`);
      }

      // Clear selection and refresh
      setSelectedIds([]);
      refreshUsers();
    } catch (error) {
      toast.error('Bulk delete operation failed');
    } finally {
      setIsDeleting(false);
      setShowBulkDeleteConfirm(false);
    }
  };

  return (
    <div>
      {/* Bulk action toolbar */}
      {selectedIds.length > 0 && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-blue-900">
              {selectedIds.length} user{selectedIds.length > 1 ? 's' : ''} selected
            </span>
            <button
              onClick={handleBulkDeleteClick}
              className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
            >
              Delete Selected
            </button>
          </div>
        </div>
      )}

      {/* Bulk Delete Confirmation */}
      <ConfirmDialog
        isOpen={showBulkDeleteConfirm}
        onClose={() => setShowBulkDeleteConfirm(false)}
        onConfirm={handleBulkDeleteConfirm}
        title="Delete Multiple Users?"
        message={`Are you sure you want to delete ${selectedIds.length} user${selectedIds.length > 1 ? 's' : ''}? This action cannot be undone.`}
        confirmText={`Delete ${selectedIds.length} User${selectedIds.length > 1 ? 's' : ''}`}
        cancelText="Cancel"
        variant="danger"
        loading={isDeleting}
      />
    </div>
  );
}
```

---

## 🎨 Alternative: Toast-Only Pattern (Quick Deletes)

For low-risk items or when you want faster workflow, you can use toast with undo:

```typescript
import { toast } from 'sonner';

const handleQuickDelete = (userId: string, userName: string) => {
  let deleted = false;

  toast.error(`Deleting ${userName}...`, {
    duration: 5000,
    action: {
      label: 'Undo',
      onClick: () => {
        if (!deleted) {
          toast.success('Delete cancelled');
        } else {
          // Restore the user
          toast.info('Restoring user...');
        }
      }
    },
    onDismiss: () => {
      if (!deleted) {
        // Actually delete when toast expires
        deleteUser(userId);
        deleted = true;
        toast.success(`${userName} deleted`);
      }
    }
  });
};
```

**Note**: This pattern is risky for permanent deletes! Only use for:
- Soft deletes (can be restored)
- Non-critical items
- Draft items
- Temporary data

---

## 🚀 Enhanced: Delete with Cascade Warning

For items with dependencies (sectors with divisions, divisions with projects):

```typescript
const handleDeleteSector = async (sectorId: string, sectorName: string) => {
  // Check for dependencies first
  const divisions = getDivisionsBySectorId(sectorId);

  if (divisions.length > 0) {
    // Show warning toast instead of allowing delete
    toast.error(
      `Cannot delete ${sectorName}. It has ${divisions.length} division${divisions.length > 1 ? 's' : ''}.`,
      {
        description: 'Delete or reassign the divisions first.',
        duration: 5000,
      }
    );
    return;
  }

  // If no dependencies, show confirmation modal
  setDeleteConfirm({
    isOpen: true,
    sectorId,
    sectorName,
  });
};

const handleDeleteConfirm = async () => {
  setIsDeleting(true);

  try {
    const success = deleteSector(deleteConfirm.sectorId);

    if (success) {
      toast.success(`${deleteConfirm.sectorName} deleted successfully`);
      refreshSectors();
    }
  } catch (error) {
    // This catches "Cannot delete sector with divisions" error
    toast.error(error.message, {
      description: 'Remove associated divisions first',
    });
  } finally {
    setIsDeleting(false);
    setDeleteConfirm({ isOpen: false, sectorId: null, sectorName: null });
  }
};
```

---

## 📊 Comparison: Different Delete Patterns

### Pattern 1: Modal + Toast (RECOMMENDED) ⭐
```
User clicks Delete
  → Modal appears: "Are you sure?"
    → User confirms
      → Item deleted
        → Toast: "Deleted successfully!"
```

**Pros**:
- ✅ Safest - prevents accidents
- ✅ Professional UX
- ✅ Clear feedback
- ✅ Consistent with industry standards

**Cons**:
- ⚠️ Two steps (slower for power users)

**Best for**:
- Critical data (users, projects)
- Permanent deletions
- Production apps

---

### Pattern 2: Toast with Undo
```
User clicks Delete
  → Toast appears: "Deleting... [Undo]"
    → 5 seconds to undo
      → If no undo: Item deleted
        → Toast: "Deleted!"
```

**Pros**:
- ✅ Faster workflow
- ✅ Can undo mistakes
- ✅ Modern UX (like Gmail)

**Cons**:
- ⚠️ Risky for permanent deletes
- ⚠️ Requires undo implementation
- ⚠️ User might miss the undo

**Best for**:
- Soft deletes
- Draft items
- Non-critical data
- Apps with undo/restore features

---

### Pattern 3: Keyboard Shortcut Delete
```
User selects item + presses Delete key
  → Modal appears: "Delete item?"
    → User confirms (Enter) or cancels (Esc)
      → Toast shows result
```

**Pros**:
- ✅ Fastest for power users
- ✅ Still safe (confirmation)
- ✅ Keyboard-driven workflow

**Cons**:
- ⚠️ Requires keyboard shortcut setup
- ⚠️ Less discoverable

**Best for**:
- Power users
- Frequent deletions
- Admin panels

---

## 🎯 Recommended Implementation

### For Your Admin Panel:

**Single Deletes**:
```typescript
Modal Confirm → Delete → Toast Result
```

**Bulk Deletes**:
```typescript
Toolbar Button → Modal Confirm (with count) → Bulk Delete → Toast Result
```

**Cascade Errors**:
```typescript
Check Dependencies → Toast Warning (if has dependencies)
                   → Modal Confirm (if safe to delete)
                     → Delete → Toast Result
```

---

## 💡 Pro Tips

### 1. Show Context in Confirmation
```typescript
<ConfirmDialog
  message={`Are you sure you want to delete ${userName}? They have created ${reportCount} reports.`}
/>
```

### 2. Disable Actions While Deleting
```typescript
<button
  disabled={isDeleting}
  className={isDeleting ? 'opacity-50 cursor-not-allowed' : ''}
>
  {isDeleting ? 'Deleting...' : 'Delete'}
</button>
```

### 3. Different Toast Durations
```typescript
toast.success('Deleted!', { duration: 2000 }); // Quick success
toast.error('Failed to delete', { duration: 5000 }); // Longer for errors
```

### 4. Rich Toast Messages
```typescript
toast.error('Cannot delete user', {
  description: 'User has 5 active reports. Archive them first.',
  action: {
    label: 'View Reports',
    onClick: () => router.push(`/reports?user=${userId}`)
  }
});
```

---

## ✅ Summary

**BEST APPROACH FOR YOUR ADMIN PANEL**:

1. **Use ConfirmDialog** for all delete confirmations
2. **Use Sonner toasts** for success/error feedback
3. **Add loading states** during deletion
4. **Log audit events** after successful deletes
5. **Handle cascade errors** gracefully

This gives you:
- Professional UX ✨
- Safety first 🔒
- Clear feedback 📢
- Audit trail 📝
- Error handling 🛡️

The pattern works for:
- ✅ Single item deletes
- ✅ Bulk deletes
- ✅ Cascade validation
- ✅ Keyboard shortcuts
- ✅ Mobile responsive
