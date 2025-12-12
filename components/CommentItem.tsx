'use client';

import { useState } from 'react';
import { Comment, User } from '@/types';
import { getUserById } from '@/lib/mock-data';
import {
  MessageSquare,
  Reply,
  Edit2,
  Trash2,
  MoreVertical,
  Check,
  X,
} from 'lucide-react';
import CommentForm from './CommentForm';

interface CommentItemProps {
  comment: Comment;
  currentUserId: string;
  onReply: (parentId: string, text: string) => void;
  onEdit: (commentId: string, text: string) => void;
  onDelete: (commentId: string) => void;
  depth?: number;
  maxDepth?: number;
  canComment?: boolean;
  canEdit?: boolean;
  canDelete?: boolean;
}

export default function CommentItem({
  comment,
  currentUserId,
  onReply,
  onEdit,
  onDelete,
  depth = 0,
  maxDepth = 3,
  canComment = true,
  canEdit = true,
  canDelete = true,
}: CommentItemProps) {
  const [isReplying, setIsReplying] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [showMenu, setShowMenu] = useState(false);
  const [editText, setEditText] = useState(comment.commentText);

  const user = getUserById(comment.userId);
  const isOwner = comment.userId === currentUserId;
  const canReply = canComment && depth < maxDepth;

  const handleReply = (text: string) => {
    onReply(comment.id, text);
    setIsReplying(false);
  };

  const handleEdit = () => {
    if (editText.trim() && editText !== comment.commentText) {
      onEdit(comment.id, editText.trim());
    }
    setIsEditing(false);
  };

  const handleCancelEdit = () => {
    setEditText(comment.commentText);
    setIsEditing(false);
  };

  const handleDelete = () => {
    if (window.confirm('Are you sure you want to delete this comment?')) {
      onDelete(comment.id);
    }
    setShowMenu(false);
  };

  const getCommentTypeColor = (type: string) => {
    switch (type) {
      case 'review':
        return 'bg-purple-100 text-purple-700';
      case 'approval':
        return 'bg-green-100 text-green-700';
      case 'rejection':
        return 'bg-red-100 text-red-700';
      case 'system':
        return 'bg-gray-100 text-gray-700';
      default:
        return 'bg-blue-100 text-blue-700';
    }
  };

  const indentClass = depth > 0 ? `ml-${Math.min(depth * 8, 24)} border-l-2 border-gray-200 pl-4` : '';

  return (
    <div className={`${indentClass}`}>
      <div className="bg-white rounded-xl border border-gray-200 p-4 hover:border-gray-300 transition-all">
        {/* Header */}
        <div className="flex items-start justify-between mb-3">
          <div className="flex items-center gap-3 flex-1">
            {/* Avatar */}
            <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center text-white font-semibold shadow-md flex-shrink-0">
              {user?.name.charAt(0) || 'U'}
            </div>

            {/* User Info */}
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 flex-wrap">
                <p className="text-sm font-semibold text-gray-800">{user?.name || 'Unknown User'}</p>
                {user?.role && (
                  <span className="text-xs px-2 py-0.5 bg-gray-100 text-gray-600 rounded font-medium">
                    {user.role.replace(/_/g, ' ')}
                  </span>
                )}
                <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${getCommentTypeColor(comment.type)}`}>
                  {comment.type}
                </span>
              </div>
              <p className="text-xs text-gray-500 mt-0.5">
                {new Date(comment.createdAt).toLocaleString()}
                {comment.updatedAt && comment.updatedAt !== comment.createdAt && (
                  <span className="ml-2 italic">(edited)</span>
                )}
              </p>
            </div>
          </div>

          {/* Actions Menu */}
          {isOwner && (canEdit || canDelete) && (
            <div className="relative">
              <button
                onClick={() => setShowMenu(!showMenu)}
                className="p-1.5 hover:bg-gray-100 rounded-lg transition-all"
              >
                <MoreVertical className="w-4 h-4 text-gray-600" />
              </button>

              {showMenu && (
                <div className="absolute right-0 top-8 bg-white border border-gray-200 rounded-lg shadow-lg z-10 min-w-[120px]">
                  {canEdit && (
                    <button
                      onClick={() => {
                        setIsEditing(true);
                        setShowMenu(false);
                      }}
                      className="w-full flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-all"
                    >
                      <Edit2 className="w-4 h-4" />
                      Edit
                    </button>
                  )}
                  {canDelete && (
                    <button
                      onClick={handleDelete}
                      className="w-full flex items-center gap-2 px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-all"
                    >
                      <Trash2 className="w-4 h-4" />
                      Delete
                    </button>
                  )}
                </div>
              )}
            </div>
          )}
        </div>

        {/* Comment Content */}
        {isEditing ? (
          <div className="space-y-2">
            <textarea
              value={editText}
              onChange={(e) => setEditText(e.target.value)}
              className="w-full px-3 py-2 text-base text-gray-900 border-2 border-blue-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none bg-white"
              rows={3}
              autoFocus
            />
            <div className="flex gap-2 justify-end">
              <button
                onClick={handleCancelEdit}
                className="px-3 py-1.5 text-sm text-gray-600 bg-gray-100 rounded-lg hover:bg-gray-200 transition-all flex items-center gap-1"
              >
                <X className="w-3.5 h-3.5" />
                Cancel
              </button>
              <button
                onClick={handleEdit}
                disabled={!editText.trim() || editText === comment.commentText}
                className="px-3 py-1.5 text-sm text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-1"
              >
                <Check className="w-3.5 h-3.5" />
                Save
              </button>
            </div>
          </div>
        ) : (
          <p className="text-base text-gray-900 leading-relaxed whitespace-pre-wrap mb-3">
            {comment.commentText}
          </p>
        )}

        {/* Action Buttons */}
        {!isEditing && (
          <div className="flex items-center gap-3 pt-2 border-t border-gray-100">
            {canReply && (
              <button
                onClick={() => setIsReplying(!isReplying)}
                className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-blue-600 hover:bg-blue-50 rounded-lg transition-all"
              >
                <Reply className="w-3.5 h-3.5" />
                Reply
              </button>
            )}
          </div>
        )}
      </div>

      {/* Reply Form */}
      {isReplying && (
        <div className="mt-3 ml-8">
          <CommentForm
            onSubmit={handleReply}
            onCancel={() => setIsReplying(false)}
            placeholder="Write a reply..."
            submitLabel="Reply"
            autoFocus
          />
        </div>
      )}
    </div>
  );
}
