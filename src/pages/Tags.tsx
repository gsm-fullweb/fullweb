
import React from 'react';
import { DashboardLayout } from '@/components/Layout/DashboardLayout';
import { TagsHeader } from '@/components/Tags/TagsHeader';
import { TagsList } from '@/components/Tags/TagsList';
import { useAuth } from '@/hooks/useAuth';

const Tags = () => {
  const { user } = useAuth();
  
  return (
    <DashboardLayout userRole="admin">
      <div className="space-y-6">
        <TagsHeader />
        <TagsList />
      </div>
    </DashboardLayout>
  );
};

export default Tags;
