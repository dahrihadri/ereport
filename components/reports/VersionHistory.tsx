'use client';

import { useState } from 'react';
import { ReportVersion } from '@/types';
import { getUserById } from '@/lib/mock-data';
import { History, User, Clock, FileText, ChevronDown, ChevronRight, GitBranch } from 'lucide-react';

interface VersionHistoryProps {
  versions: ReportVersion[];
}

export default function VersionHistory({ versions }: VersionHistoryProps) {
  const [expandedVersions, setExpandedVersions] = useState<Set<string>>(new Set());
  const [compareMode, setCompareMode] = useState(false);
  const [selectedVersions, setSelectedVersions] = useState<string[]>([]);

  const sortedVersions = [...versions].sort((a, b) => b.versionNumber - a.versionNumber);

  const toggleExpand = (versionId: string) => {
    const newExpanded = new Set(expandedVersions);
    if (newExpanded.has(versionId)) {
      newExpanded.delete(versionId);
    } else {
      newExpanded.add(versionId);
    }
    setExpandedVersions(newExpanded);
  };

  const toggleVersionSelection = (versionId: string) => {
    if (selectedVersions.includes(versionId)) {
      setSelectedVersions(selectedVersions.filter(id => id !== versionId));
    } else if (selectedVersions.length < 2) {
      setSelectedVersions([...selectedVersions, versionId]);
    }
  };

  const getVersionDiff = (v1: ReportVersion, v2: ReportVersion) => {
    const changes: Array<{ field: string; oldValue: string; newValue: string }> = [];
    const allKeys = new Set([...Object.keys(v1.content), ...Object.keys(v2.content)]);

    allKeys.forEach(key => {
      const oldValue = v1.content[key] as string;
      const newValue = v2.content[key] as string;
      if (oldValue !== newValue) {
        changes.push({
          field: key,
          oldValue: oldValue || '(empty)',
          newValue: newValue || '(empty)',
        });
      }
    });

    return changes;
  };

  if (sortedVersions.length === 0) {
    return (
      <div className="text-center py-12">
        <History className="w-16 h-16 text-gray-300 mx-auto mb-4" />
        <p className="text-gray-500 text-sm">No version history available</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header with Compare Toggle */}
      <div className="flex items-center justify-between bg-gradient-to-r from-blue-50 to-blue-100 rounded-xl p-4 border-2 border-blue-200">
        <div className="flex items-center gap-2">
          <GitBranch className="w-5 h-5 text-blue-600" />
          <h3 className="text-lg font-bold text-gray-800">
            Version History ({sortedVersions.length} versions)
          </h3>
        </div>
        <button
          onClick={() => {
            setCompareMode(!compareMode);
            setSelectedVersions([]);
          }}
          className={`px-4 py-2 rounded-lg font-medium text-sm transition-all ${
            compareMode
              ? 'bg-blue-600 text-white'
              : 'bg-white text-blue-600 border-2 border-blue-600 hover:bg-blue-50'
          }`}
        >
          {compareMode ? 'Exit Compare Mode' : 'Compare Versions'}
        </button>
      </div>

      {/* Compare Mode Instructions */}
      {compareMode && (
        <div className="bg-yellow-50 border-2 border-yellow-200 rounded-xl p-4">
          <p className="text-sm text-yellow-800 font-medium">
            Select two versions to compare changes. {selectedVersions.length}/2 selected
          </p>
        </div>
      )}

      {/* Comparison View */}
      {compareMode && selectedVersions.length === 2 && (
        <div className="bg-white border-2 border-blue-300 rounded-xl p-6">
          <h4 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
            <FileText className="w-5 h-5 text-blue-600" />
            Comparison Results
          </h4>
          {(() => {
            const v1 = sortedVersions.find(v => v.id === selectedVersions[0]);
            const v2 = sortedVersions.find(v => v.id === selectedVersions[1]);
            if (!v1 || !v2) return null;

            const [older, newer] = v1.versionNumber < v2.versionNumber ? [v1, v2] : [v2, v1];
            const changes = getVersionDiff(older, newer);

            return (
              <div className="space-y-4">
                <div className="flex items-center justify-between text-sm bg-gray-50 rounded-lg p-3">
                  <span className="font-medium text-gray-700">
                    Version {older.versionNumber} → Version {newer.versionNumber}
                  </span>
                  <span className="text-gray-500">
                    {changes.length} change{changes.length !== 1 ? 's' : ''}
                  </span>
                </div>

                {changes.length === 0 ? (
                  <p className="text-gray-500 text-center py-8">No changes detected</p>
                ) : (
                  <div className="space-y-4">
                    {changes.map((change, idx) => (
                      <div key={idx} className="border border-gray-200 rounded-lg overflow-hidden">
                        <div className="bg-gray-50 px-4 py-2 border-b border-gray-200">
                          <h5 className="font-semibold text-gray-800 text-sm capitalize">
                            {change.field.replace(/([A-Z])/g, ' $1').trim()}
                          </h5>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 divide-y md:divide-y-0 md:divide-x">
                          <div className="p-4 bg-red-50">
                            <p className="text-xs font-semibold text-red-700 mb-2">
                              Version {older.versionNumber}
                            </p>
                            <p className="text-sm text-gray-700 whitespace-pre-wrap">
                              {change.oldValue}
                            </p>
                          </div>
                          <div className="p-4 bg-green-50">
                            <p className="text-xs font-semibold text-green-700 mb-2">
                              Version {newer.versionNumber}
                            </p>
                            <p className="text-sm text-gray-700 whitespace-pre-wrap">
                              {change.newValue}
                            </p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            );
          })()}
        </div>
      )}

      {/* Version List */}
      <div className="space-y-4">
        {sortedVersions.map((version, index) => {
          const author = getUserById(version.createdByUserId);
          const isExpanded = expandedVersions.has(version.id);
          const isSelected = selectedVersions.includes(version.id);
          const isLatest = index === 0;

          return (
            <div
              key={version.id}
              className={`bg-white rounded-xl border-2 transition-all ${
                isSelected
                  ? 'border-blue-500 shadow-lg'
                  : isLatest
                  ? 'border-green-300 shadow-md'
                  : 'border-gray-200 shadow-sm'
              }`}
            >
              <div className="p-4">
                <div className="flex items-start justify-between">
                  <div className="flex items-start gap-3 flex-1">
                    {compareMode && (
                      <input
                        type="checkbox"
                        checked={isSelected}
                        onChange={() => toggleVersionSelection(version.id)}
                        disabled={!isSelected && selectedVersions.length >= 2}
                        className="mt-1 w-5 h-5 text-blue-600 rounded focus:ring-2 focus:ring-blue-500"
                      />
                    )}
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <h4 className="text-base font-bold text-gray-800">
                          Version {version.versionNumber}
                        </h4>
                        {isLatest && (
                          <span className="px-2.5 py-1 bg-green-100 text-green-700 text-xs font-semibold rounded-full">
                            Latest
                          </span>
                        )}
                      </div>

                      <div className="flex flex-wrap items-center gap-3 text-sm text-gray-600 mb-2">
                        <div className="flex items-center gap-1.5">
                          <User className="w-3.5 h-3.5" />
                          <span>{author?.name || 'Unknown'}</span>
                        </div>
                        <div className="flex items-center gap-1.5">
                          <Clock className="w-3.5 h-3.5" />
                          <span>{new Date(version.createdAt).toLocaleString()}</span>
                        </div>
                      </div>

                      {version.changeDescription && (
                        <p className="text-sm text-gray-700 bg-gray-50 rounded-lg p-3">
                          {version.changeDescription}
                        </p>
                      )}
                    </div>
                  </div>

                  <button
                    onClick={() => toggleExpand(version.id)}
                    className="p-2 hover:bg-gray-100 rounded-lg transition-all"
                  >
                    {isExpanded ? (
                      <ChevronDown className="w-5 h-5 text-gray-600" />
                    ) : (
                      <ChevronRight className="w-5 h-5 text-gray-600" />
                    )}
                  </button>
                </div>

                {/* Expanded Content */}
                {isExpanded && (
                  <div className="mt-4 pt-4 border-t border-gray-200 space-y-3">
                    <h5 className="text-sm font-semibold text-gray-700 mb-2">Version Content:</h5>
                    {Object.entries(version.content).map(([key, value]) => (
                      <div key={key} className="bg-gray-50 rounded-lg p-3">
                        <p className="text-xs font-semibold text-gray-600 mb-1 capitalize">
                          {key.replace(/([A-Z])/g, ' $1').trim()}:
                        </p>
                        <p className="text-sm text-gray-700 whitespace-pre-wrap">
                          {String(value) || '(empty)'}
                        </p>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
