'use client';

import { useState } from 'react';
import DashboardLayout from '@/components/layout/DashboardLayout';
import AwaitingActionWidget from '@/components/dashboard/AwaitingActionWidget';
import OverdueReportsWidget from '@/components/dashboard/OverdueReportsWidget';
import MyDivisionReports from '@/components/dashboard/MyDivisionReports';
import UserSwitcher from '@/components/ui/UserSwitcher';
import { ReportWithRelations } from '@/types';
import { mockReportsWithRelations } from '@/lib/mock-data';
import { useCurrentUser } from '@/lib/use-current-user';

export default function DashboardPage() {
  const [reports] = useState<ReportWithRelations[]>(mockReportsWithRelations);

  // Get current logged-in user from localStorage
  const currentUser = useCurrentUser();

  // Show loading or fallback while user is being loaded
  if (!currentUser) {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  }

  return (
    <DashboardLayout
      user={{
        name: currentUser.name,
        email: currentUser.email,
        role: currentUser.role,
      }}
      currentUser={currentUser}
    >
      {/* Balance Card */}
      <div
        className="relative rounded-xl sm:rounded-2xl p-4 sm:p-5 md:p-6 text-white shadow-xl overflow-hidden h-40 flex flex-col justify-center"
        style={{
          backgroundImage: 'url(/balanceCard.png)',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat'
        }}
      >
        {/* Overlay for better text readability */}
        <div className="absolute inset-0 bg-black/20"></div>

        {/* Content */}
        <div className="relative z-10">
          <div className="mb-0">
            <p className="text-xs sm:text-sm opacity-90">
              Peace Be Upon You! {currentUser.name.toUpperCase()}
            </p>
            <h2 className="text-2xl sm:text-3xl font-bold mt-1 sm:mt-2">
              Welcome to Your Dashboard
            </h2>
          </div>
        </div>
      </div>

      {/* Awaiting Action Widget */}
      <AwaitingActionWidget
        reports={reports}
        userRole={currentUser.role}
        userId={currentUser.id}
      />

      {/* Overdue Reports Widget */}
      <OverdueReportsWidget
        reports={reports}
        userRole={currentUser.role}
        userId={currentUser.id}
      />

      {/* My Division Reports - Only for HoD and Secretary */}
      {(currentUser.role === 'HEAD_OF_DIVISION' || currentUser.role === 'DIVISION_SECRETARY') && currentUser.divisionIds[0] && (
        <MyDivisionReports
          reports={reports}
          divisionId={currentUser.divisionIds[0]}
          divisionName="IT Development Division"
        />
      )}

      {/* User Switcher - Development Only */}
      <UserSwitcher />
    </DashboardLayout>
  );
}
