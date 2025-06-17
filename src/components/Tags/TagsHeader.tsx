
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import { NewTagDialog } from './NewTagDialog';

export const TagsHeader = () => {
  const [isNewTagDialogOpen, setIsNewTagDialogOpen] = useState(false);

  return (
    <>
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            Gerenciamento de Tags
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-2">
            Organize suas conversas com tags personalizadas
          </p>
        </div>
        <Button 
          onClick={() => setIsNewTagDialogOpen(true)}
          className="bg-whatsapp-primary hover:bg-whatsapp-primary/90"
        >
          <Plus className="w-4 h-4 mr-2" />
          Nova Tag
        </Button>
      </div>

      <NewTagDialog 
        open={isNewTagDialogOpen}
        onOpenChange={setIsNewTagDialogOpen}
      />
    </>
  );
};
