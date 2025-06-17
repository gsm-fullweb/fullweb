
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Plus, Settings } from 'lucide-react';
import { NewEmailDialog } from './NewEmailDialog';
import { EmailConfigDialog } from './EmailConfigDialog';

export const EmailsHeader = () => {
  const [isNewEmailDialogOpen, setIsNewEmailDialogOpen] = useState(false);
  const [isConfigDialogOpen, setIsConfigDialogOpen] = useState(false);

  return (
    <>
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            Gerenciamento de Emails
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-2">
            Configure templates de email e gerencie campanhas automatizadas
          </p>
        </div>
        <div className="flex gap-3">
          <Button 
            onClick={() => setIsConfigDialogOpen(true)}
            variant="outline"
            className="border-whatsapp-primary text-whatsapp-primary hover:bg-whatsapp-primary/10"
          >
            <Settings className="w-4 h-4 mr-2" />
            Configurações
          </Button>
          <Button 
            onClick={() => setIsNewEmailDialogOpen(true)}
            className="bg-whatsapp-primary hover:bg-whatsapp-primary/90"
          >
            <Plus className="w-4 h-4 mr-2" />
            Novo Template
          </Button>
        </div>
      </div>

      <NewEmailDialog 
        open={isNewEmailDialogOpen}
        onOpenChange={setIsNewEmailDialogOpen}
      />
      
      <EmailConfigDialog 
        open={isConfigDialogOpen}
        onOpenChange={setIsConfigDialogOpen}
      />
    </>
  );
};
