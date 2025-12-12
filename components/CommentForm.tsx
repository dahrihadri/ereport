'use client';

import { useState } from 'react';
import { CommentType } from '@/types';
import { Send, X } from 'lucide-react';

interface CommentFormProps {
  onSubmit: (text: string, type?: CommentType) => void;
  onCancel?: () => void;
  initialValue?: string;
  placeholder?: string;
  submitLabel?: string;
  showTypeSelector?: boolean;
  defaultType?: CommentType;
  autoFocus?: boolean;
  minRows?: number;
}

export default function CommentForm({
  onSubmit,
  onCancel,
  initialValue = '',
  placeholder = 'Add a comment...',
  submitLabel = 'Comment',
  showTypeSelector = false,
  defaultType = 'general',
  autoFocus = false,
  minRows = 3,
}: CommentFormProps) {
  const [text, setText] = useState(initialValue);
  const [type, setType] = useState<CommentType>(defaultType);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (text.trim()) {
      onSubmit(text.trim(), showTypeSelector ? type : undefined);
      setText('');
      setType(defaultType);
    }
  };

  const handleCancel = () => {
    setText(initialValue);
    setType(defaultType);
    onCancel?.();
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-3">
      <div>
        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder={placeholder}
          rows={minRows}
          autoFocus={autoFocus}
          className="w-full px-4 py-3 text-base text-gray-900 border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none transition-all placeholder:text-gray-500 bg-white"
        />
      </div>

      {showTypeSelector && (
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Comment Type
          </label>
          <select
            value={type}
            onChange={(e) => setType(e.target.value as CommentType)}
            className="px-3 py-2 text-base text-gray-900 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all bg-white"
          >
            <option value="general">General</option>
            <option value="review">Review</option>
            <option value="approval">Approval</option>
            <option value="rejection">Rejection</option>
          </select>
        </div>
      )}

      <div className="flex justify-end gap-2">
        {onCancel && (
          <button
            type="button"
            onClick={handleCancel}
            className="px-4 py-2 text-sm text-gray-600 bg-gray-100 rounded-lg hover:bg-gray-200 transition-all font-medium flex items-center gap-2"
          >
            <X className="w-4 h-4" />
            Cancel
          </button>
        )}
        <button
          type="submit"
          disabled={!text.trim()}
          className="px-4 py-2 text-sm text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed font-medium flex items-center gap-2"
        >
          <Send className="w-4 h-4" />
          {submitLabel}
        </button>
      </div>
    </form>
  );
}
