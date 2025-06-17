
import React from 'react';
import { DashboardLayout } from '@/components/Layout/DashboardLayout';
import { AutomationsHeader } from '@/components/Automations/AutomationsHeader';
import { AutomationsList } from '@/components/Automations/AutomationsList';
import { useAuth } from '@/hooks/useAuth';

const Automations = () => {
  const { user } = useAuth();
  
  return (
    <DashboardLayout userRole="admin">
      <div className="space-y-6">
        <AutomationsHeader />
        <AutomationsList />
      </div>
    </DashboardLayout>
  );
};

export default Automations;
