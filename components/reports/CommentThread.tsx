'use client';

import { useState, useMemo, ReactElement } from 'react';
import { Comment, CommentType, UserRole } from '@/types';
import CommentItem from '../CommentItem';
import CommentForm from '../CommentForm';
import { MessageSquare, Filter } from 'lucide-react';

interface CommentThreadProps {
  comments: Comment[];
  currentUserId: string;
  currentUserRole: UserRole;
  onAddComment: (text: string, type: CommentType, parentId?: string) => void;
  onEditComment: (commentId: string, text: string) => void;
  onDeleteComment: (commentId: string) => void;
  showAddForm?: boolean;
  maxDepth?: number;
}

export default function CommentThread({
  comments,
  currentUserId,
  currentUserRole,
  onAddComment,
  onEditComment,
  onDeleteComment,
  showAddForm = true,
  maxDepth = 3,
}: CommentThreadProps) {
  const [filterType, setFilterType] = useState<'all' | CommentType>('all');

  // Permission checks based on role
  const canComment = ['HEAD_OF_DIVISION', 'DIVISION_SECRETARY', 'CHIEF_OF_SECTOR', 'DEPUTY_MD'].includes(currentUserRole);
  const canEdit = true; // Users can edit their own comments
  const canDelete = currentUserRole === 'SYSTEM_ADMIN' || currentUserRole === 'DEPUTY_MD';

  // Build comment tree structure
  const commentTree = useMemo(() => {
    const filtered = filterType === 'all'
      ? comments
      : comments.filter(c => c.type === filterType);

    const topLevel: Comment[] = [];
    const childrenMap = new Map<string, Comment[]>();

    filtered.forEach(comment => {
      if (comment.parentCommentId) {
        const siblings = childrenMap.get(comment.parentCommentId) || [];
        siblings.push(comment);
        childrenMap.set(comment.parentCommentId, siblings);
      } else {
        topLevel.push(comment);
      }
    });

    // Sort by date (newest first for top level, oldest first for replies)
    topLevel.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    childrenMap.forEach(children => {
      children.sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());
    });

    return { topLevel, childrenMap };
  }, [comments, filterType]);

  const handleAddComment = (text: string, type?: CommentType) => {
    onAddComment(text, type || 'general');
  };

  const handleReply = (parentId: string, text: string) => {
    onAddComment(text, 'general', parentId);
  };

  const renderComment = (comment: Comment, depth = 0): ReactElement => {
    const children = commentTree.childrenMap.get(comment.id) || [];

    return (
      <div key={comment.id} className="space-y-3">
        <CommentItem
          comment={comment}
          currentUserId={currentUserId}
          onReply={handleReply}
          onEdit={onEditComment}
          onDelete={onDeleteComment}
          depth={depth}
          maxDepth={maxDepth}
          canComment={canComment}
          canEdit={canEdit}
          canDelete={canDelete || comment.userId === currentUserId}
        />

        {children.length > 0 && (
          <div className="space-y-3">
            {children.map(child => renderComment(child, depth + 1))}
          </div>
        )}
      </div>
    );
  };

  const typeOptions: Array<{ value: 'all' | CommentType; label: string; count: number }> = [
    { value: 'all', label: 'All', count: comments.length },
    { value: 'general', label: 'General', count: comments.filter(c => c.type === 'general').length },
    { value: 'review', label: 'Review', count: comments.filter(c => c.type === 'review').length },
    { value: 'approval', label: 'Approval', count: comments.filter(c => c.type === 'approval').length },
    { value: 'rejection', label: 'Rejection', count: comments.filter(c => c.type === 'rejection').length },
  ];

  return (
    <div className="space-y-6">
      {/* Header with Count and Filter */}
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
          <MessageSquare className="w-5 h-5 text-blue-600" />
          Comments ({comments.length})
        </h3>

        {comments.length > 0 && (
          <div className="flex items-center gap-2">
            <Filter className="w-4 h-4 text-gray-500" />
            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value as 'all' | CommentType)}
              className="px-3 py-1.5 text-base text-gray-900 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white"
            >
              {typeOptions.map(option => (
                <option key={option.value} value={option.value}>
                  {option.label} ({option.count})
                </option>
              ))}
            </select>
          </div>
        )}
      </div>

      {/* Add Comment Form */}
      {showAddForm && canComment && (
        <div className="bg-blue-50 border-2 border-blue-200 rounded-xl p-4">
          <CommentForm
            onSubmit={handleAddComment}
            placeholder="Add your comment..."
            submitLabel="Post Comment"
            showTypeSelector
            defaultType="general"
          />
        </div>
      )}

      {/* Comments List */}
      {commentTree.topLevel.length === 0 ? (
        <div className="text-center py-12 bg-gray-50 rounded-xl border-2 border-dashed border-gray-200">
          <MessageSquare className="w-12 h-12 text-gray-300 mx-auto mb-3" />
          <p className="text-gray-500 text-sm font-medium">
            {filterType === 'all'
              ? 'No comments yet. Be the first to comment!'
              : `No ${filterType} comments found.`}
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {commentTree.topLevel.map(comment => renderComment(comment))}
        </div>
      )}

      {/* Comment Guidelines */}
      {canComment && comments.length === 0 && (
        <div className="bg-gray-50 rounded-xl p-4 border border-gray-200">
          <h4 className="text-sm font-semibold text-gray-700 mb-2">Comment Guidelines:</h4>
          <ul className="text-xs text-gray-600 space-y-1 list-disc list-inside">
            <li>Be respectful and professional</li>
            <li>Use <span className="font-semibold">Review</span> type for feedback on report content</li>
            <li>Use <span className="font-semibold">Approval/Rejection</span> for formal decisions</li>
            <li>You can reply to comments up to {maxDepth} levels deep</li>
          </ul>
        </div>
      )}
    </div>
  );
}
