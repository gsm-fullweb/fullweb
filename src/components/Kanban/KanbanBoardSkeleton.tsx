
import React from 'react';
import { Skeleton } from '@/components/ui/skeleton';

export const KanbanBoardSkeleton = () => {
  return (
    <div className="h-full">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-4">
          <Skeleton className="h-8 w-48" />
          <Skeleton className="h-6 w-24" />
        </div>
        <div className="flex items-center space-x-2">
          <Skeleton className="h-9 w-24" />
          <Skeleton className="h-9 w-9" />
          <Skeleton className="h-9 w-36" />
        </div>
      </div>
      <div className="flex space-x-6 overflow-x-auto pb-6">
        {[...Array(5)].map((_, i) => (
          <div key={i} className="flex-shrink-0 w-80 space-y-4">
            <div className="flex items-center justify-between">
              <Skeleton className="h-6 w-32" />
              <Skeleton className="h-6 w-16" />
            </div>
            <div className="space-y-3">
              <Skeleton className="h-36 w-full" />
              <Skeleton className="h-36 w-full" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
