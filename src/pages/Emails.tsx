
import React from 'react';
import { DashboardLayout } from '@/components/Layout/DashboardLayout';
import { EmailsHeader } from '@/components/Emails/EmailsHeader';
import { EmailsList } from '@/components/Emails/EmailsList';

const Emails = () => {
  return (
    <DashboardLayout userRole="admin">
      <div className="space-y-6">
        <EmailsHeader />
        <EmailsList />
      </div>
    </DashboardLayout>
  );
};

export default Emails;
