
import React from 'react';
import { DashboardLayout } from '@/components/Layout/DashboardLayout';
import { ReportsHeader } from '@/components/Reports/ReportsHeader';
import { ReportsOverview } from '@/components/Reports/ReportsOverview';
import { ConversationsChart } from '@/components/Reports/ConversationsChart';
import { AgentsPerformance } from '@/components/Reports/AgentsPerformance';
import { ResponseTimeChart } from '@/components/Reports/ResponseTimeChart';
import { useAuth } from '@/hooks/useAuth';

const Reports = () => {
  const { user } = useAuth();

  return (
    <DashboardLayout userRole="admin">
      <div className="space-y-6">
        <ReportsHeader />
        <ReportsOverview />
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <ConversationsChart />
          <ResponseTimeChart />
        </div>
        
        <AgentsPerformance />
      </div>
    </DashboardLayout>
  );
};

export default Reports;
