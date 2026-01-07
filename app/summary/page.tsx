'use client';

import { useState } from 'react';
import DashboardLayout from '@/components/layout/DashboardLayout';
import StatCard from '@/components/ui/StatCard';
import { mockReportsWithRelations, getUserById, mockUsers } from '@/lib/mock-data';
import { ReportWithRelations, Task } from '@/types';
import { CheckCircle2, RefreshCw, FileText, Clock } from 'lucide-react';
import { useCurrentUser } from '@/lib/use-current-user';

export default function SummaryPage() {
  const [allReports] = useState<ReportWithRelations[]>(mockReportsWithRelations);

  // Get current logged-in user from localStorage
  const currentUser = useCurrentUser();

  // Show loading while user is being loaded
  if (!currentUser) {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  }

  // Filter reports by user's division(s)
  // Chief of Sector and Deputy MD can see all reports
  const reports = (currentUser.role === 'CHIEF_OF_SECTOR' || currentUser.role === 'DEPUTY_MD')
    ? allReports
    : allReports.filter(report =>
        currentUser.divisionIds.includes(report.division.id)
      );

  // Calculate statistics
  const stats = {
    completed: reports.filter(r => r.currentStatus === 'final_approved').length,
    updated: reports.filter(r => {
      const weekAgo = new Date();
      weekAgo.setDate(weekAgo.getDate() - 7);
      return new Date(r.updatedAt) > weekAgo;
    }).length,
    created: reports.filter(r => {
      const weekAgo = new Date();
      weekAgo.setDate(weekAgo.getDate() - 7);
      return new Date(r.createdAt) > weekAgo;
    }).length,
    dueSoon: 2, // Mock value - could be calculated if you add dueDate to reports
  };

  // Status breakdown
  const statusBreakdown = {
    draft: reports.filter(r => r.currentStatus === 'draft').length,
    underReview: reports.filter(r =>
      r.currentStatus === 'under_review_sector' ||
      r.currentStatus === 'under_review_dmd' ||
      r.currentStatus === 'approved_by_sector'
    ).length,
    approved: reports.filter(r => r.currentStatus === 'final_approved').length,
    returned: reports.filter(r =>
      r.currentStatus === 'returned_for_revision_sector' ||
      r.currentStatus === 'returned_for_revision_dmd'
    ).length,
  };

  // Priority breakdown
  const priorityBreakdown = {
    critical: reports.filter(r => r.priority === 'critical').length,
    high: reports.filter(r => r.priority === 'high').length,
    medium: reports.filter(r => r.priority === 'medium').length,
    low: reports.filter(r => r.priority === 'low').length,
  };

  // Recent activity
  const recentActivity = reports
    .sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime())
    .slice(0, 5);

  // User workload - based on actual mock data, filtered by division
  // Chief of Sector and Deputy MD can see all users
  // Other roles only see users from their division(s)
  const divisionUsers = (currentUser.role === 'CHIEF_OF_SECTOR' || currentUser.role === 'DEPUTY_MD')
    ? mockUsers
    : mockUsers.filter(user =>
        user.divisionIds.some(divId => currentUser.divisionIds.includes(divId))
      );

  const userReportCounts = divisionUsers.map(user => ({
    user,
    count: reports.filter(r => r.createdByUserId === user.id).length
  })).filter(item => item.count > 0);

  const totalReports = userReportCounts.reduce((sum, item) => sum + item.count, 0);
  const userWorkload = userReportCounts.map(item => ({
    name: item.user.name,
    percentage: totalReports > 0 ? Math.round((item.count / totalReports) * 100) : 0,
    count: item.count
  })).sort((a, b) => b.percentage - a.percentage);
  const handleCreateReport = () => {  };
  return (
    <DashboardLayout
      user={{
        name: currentUser.name,
        email: currentUser.email,
        role: currentUser.role,
      }}
      currentUser={currentUser}
    >
      {/* Top Statistics Cards */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
              <StatCard
                title="Completed"
                value={stats.completed}
                color="green"
                icon={CheckCircle2}
                subtitle="in the last 7 days"
              />
              <StatCard
                title="Updated"
                value={stats.updated}
                color="blue"
                icon={RefreshCw}
                subtitle="in the last 7 days"
              />
              <StatCard
                title="Created"
                value={stats.created}
                color="purple"
                icon={FileText}
                subtitle="in the last 7 days"
              />
              <StatCard
                title="Due Soon"
                value={stats.dueSoon}
                color="yellow"
                icon={Clock}
                subtitle="in the next 7 days"
              />
            </div>

            {/* Main Content Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">

              {/* Status Overview - Donut Chart */}
              <div className="bg-white rounded-xl sm:rounded-2xl shadow-lg border border-gray-200 p-4 sm:p-5 md:p-6">
                <div className="flex items-center justify-between mb-4 sm:mb-6">
                  <h3 className="text-lg sm:text-xl font-semibold text-gray-800">Status Overview</h3>
                  <button
                    className="text-xs text-blue-600 hover:text-blue-700 font-semibold transition-colors"
                    onClick={() => window.location.href = '/reports'}
                  >
                    View all
                  </button>
                </div>
                <p className="text-sm text-gray-600 mb-6">Get a snapshot of the status of your reports.</p>

                <div className="flex items-center justify-center mb-6">
                  <div className="relative w-48 h-48">
                    <svg className="w-full h-full transform -rotate-90">
                      {/* Draft - Yellow */}
                      <circle
                        cx="96"
                        cy="96"
                        r="70"
                        fill="none"
                        stroke="#fbbf24"
                        strokeWidth="24"
                        strokeDasharray={`${(statusBreakdown.draft / reports.length) * 440} 440`}
                        strokeDashoffset="0"
                      />
                      {/* Under Review - Purple */}
                      <circle
                        cx="96"
                        cy="96"
                        r="70"
                        fill="none"
                        stroke="#a855f7"
                        strokeWidth="24"
                        strokeDasharray={`${(statusBreakdown.underReview / reports.length) * 440} 440`}
                        strokeDashoffset={`-${(statusBreakdown.draft / reports.length) * 440}`}
                      />
                      {/* Approved - Green */}
                      <circle
                        cx="96"
                        cy="96"
                        r="70"
                        fill="none"
                        stroke="#22c55e"
                        strokeWidth="24"
                        strokeDasharray={`${(statusBreakdown.approved / reports.length) * 440} 440`}
                        strokeDashoffset={`-${((statusBreakdown.draft + statusBreakdown.underReview) / reports.length) * 440}`}
                      />
                      {/* Returned - Red */}
                      {statusBreakdown.returned > 0 && (
                        <circle
                          cx="96"
                          cy="96"
                          r="70"
                          fill="none"
                          stroke="#ef4444"
                          strokeWidth="24"
                          strokeDasharray={`${(statusBreakdown.returned / reports.length) * 440} 440`}
                          strokeDashoffset={`-${((statusBreakdown.draft + statusBreakdown.underReview + statusBreakdown.approved) / reports.length) * 440}`}
                        />
                      )}
                    </svg>
                    <div className="absolute inset-0 flex flex-col items-center justify-center">
                      <p className="text-4xl font-bold text-gray-800">{reports.length}</p>
                      <p className="text-sm text-gray-600">Total reports</p>
                    </div>
                  </div>
</div>

                <div className="space-y-3">
                  <div className="flex items-center justify-between text-sm">
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 bg-yellow-400 rounded-sm"></div>
                      <span className="text-gray-700">Draft</span>
                    </div>
                    <span className="font-semibold text-gray-800">{statusBreakdown.draft}</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 bg-purple-500 rounded-sm"></div>
                      <span className="text-gray-700">Under Review</span>
                    </div>
                    <span className="font-semibold text-gray-800">{statusBreakdown.underReview}</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 bg-green-500 rounded-sm"></div>
                      <span className="text-gray-700">Approved</span>
                    </div>
                    <span className="font-semibold text-gray-800">{statusBreakdown.approved}</span>
                  </div>
                  {statusBreakdown.returned > 0 && (
                    <div className="flex items-center justify-between text-sm">
                      <div className="flex items-center gap-2">
                        <div className="w-3 h-3 bg-red-500 rounded-sm"></div>
                        <span className="text-gray-700">Returned</span>
                      </div>
                      <span className="font-semibold text-gray-800">{statusBreakdown.returned}</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Recent Activity */}
              <div className="bg-white rounded-xl sm:rounded-2xl shadow-lg border border-gray-200 p-4 sm:p-5 md:p-6">
                <h3 className="text-lg sm:text-xl font-semibold text-gray-800 mb-4 sm:mb-6">Recent Activity</h3>
                <p className="text-sm text-gray-600 mb-6">Stay up to date with what&apos;s happening in your division.</p>

                <div className="space-y-4">
                  {recentActivity.length === 0 ? (
                    <div className="text-center py-8 text-gray-500">
                      <p className="text-sm">No recent activity</p>
                    </div>
                  ) : (
                    recentActivity.map((report, idx) => (
                      <div
                        key={report.id}
                        className="flex gap-3 hover:bg-gray-50 p-2 rounded-lg transition-colors cursor-pointer"
                        onClick={() => window.location.href = `/reports/${report.id}`}
                      >
                        <div className="flex-shrink-0">
                          <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center">
                            <span className="text-xs font-semibold text-blue-700">
                              {report.createdBy.name.split(' ').map(n => n[0]).join('')}
                            </span>
                          </div>
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm text-gray-800">
                            <span className="font-semibold">{report.createdBy.name}</span>
                            {' '}updated{' '}
                            <span className="text-blue-600 hover:underline">
                              {report.title}
                            </span>
                          </p>
                          <p className="text-xs text-gray-500 mt-1">
                            {new Date(report.updatedAt).toLocaleDateString('en-MY', {
                              year: 'numeric',
                              month: 'short',
                              day: 'numeric',
                              hour: '2-digit',
                              minute: '2-digit'
                            })}
                          </p>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            </div>

            {/* Priority Breakdown & Team Workload */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">

              {/* Priority Breakdown */}
              <div className="bg-white rounded-xl sm:rounded-2xl shadow-lg border border-gray-200 p-4 sm:p-5 md:p-6">
                <div className="flex items-center justify-between mb-4 sm:mb-6">
                  <h3 className="text-lg sm:text-xl font-semibold text-gray-800">Priority Breakdown</h3>
                </div>
                <p className="text-sm text-gray-600 mb-6">Get a holistic view of how reports are being prioritized.</p>

                <div className="h-64 flex items-end justify-between gap-3 mb-4">
                  <div className="flex-1 flex flex-col items-center">
                    <div
                      className="w-full bg-red-500 rounded-t-lg transition-all hover:bg-red-600 cursor-pointer"
                      style={{ height: `${(priorityBreakdown.critical / Math.max(...Object.values(priorityBreakdown), 1)) * 100}%`, minHeight: priorityBreakdown.critical > 0 ? '24px' : '0' }}
                    ></div>
                    <p className="text-xs text-gray-600 mt-2 text-center font-medium">Critical</p>
                    <p className="text-sm font-bold text-gray-800">{priorityBreakdown.critical}</p>
                  </div>
                  <div className="flex-1 flex flex-col items-center">
                    <div
                      className="w-full bg-orange-500 rounded-t-lg transition-all hover:bg-orange-600 cursor-pointer"
                      style={{ height: `${(priorityBreakdown.high / Math.max(...Object.values(priorityBreakdown), 1)) * 100}%`, minHeight: priorityBreakdown.high > 0 ? '24px' : '0' }}
                    ></div>
                    <p className="text-xs text-gray-600 mt-2 text-center font-medium">High</p>
                    <p className="text-sm font-bold text-gray-800">{priorityBreakdown.high}</p>
                  </div>
                  <div className="flex-1 flex flex-col items-center">
                    <div
                      className="w-full bg-yellow-500 rounded-t-lg transition-all hover:bg-yellow-600 cursor-pointer"
                      style={{ height: `${(priorityBreakdown.medium / Math.max(...Object.values(priorityBreakdown), 1)) * 100}%`, minHeight: priorityBreakdown.medium > 0 ? '24px' : '0' }}
                    ></div>
                    <p className="text-xs text-gray-600 mt-2 text-center font-medium">Medium</p>
                    <p className="text-sm font-bold text-gray-800">{priorityBreakdown.medium}</p>
                  </div>
                  <div className="flex-1 flex flex-col items-center">
                    <div
                      className="w-full bg-blue-500 rounded-t-lg transition-all hover:bg-blue-600 cursor-pointer"
                      style={{ height: `${(priorityBreakdown.low / Math.max(...Object.values(priorityBreakdown), 1)) * 100}%`, minHeight: priorityBreakdown.low > 0 ? '24px' : '0' }}
                    ></div>
                    <p className="text-xs text-gray-600 mt-2 text-center font-medium">Low</p>
                    <p className="text-sm font-bold text-gray-800">{priorityBreakdown.low}</p>
                  </div>
                </div>
              </div>

              {/* Team Workload */}
              <div className="bg-white rounded-xl sm:rounded-2xl shadow-lg border border-gray-200 p-4 sm:p-5 md:p-6">
                <div className="flex items-center justify-between mb-4 sm:mb-6">
                  <h3 className="text-lg sm:text-xl font-semibold text-gray-800">Team Workload</h3>
                </div>
                <p className="text-sm text-gray-600 mb-6">Monitor report distribution across your team.</p>

                <div className="space-y-4">
                  {userWorkload.map((user, idx) => (
                    <div key={idx}>
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center">
                            <span className="text-xs font-semibold text-blue-700">
                              {user.name.split(' ').map(n => n[0]).join('')}
                            </span>
                          </div>
                          <span className="text-sm font-medium text-gray-700">{user.name}</span>
                        </div>
                        <span className="text-sm font-semibold text-gray-800">{user.percentage}%</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div
                          className="bg-blue-600 h-2 rounded-full transition-all"
                          style={{ width: `${user.percentage}%` }}
                        ></div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

      {/* Task Modal */}
    </DashboardLayout>
  );
}
