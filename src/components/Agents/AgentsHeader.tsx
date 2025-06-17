
import React from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Plus, Search, Users } from 'lucide-react';

interface AgentsHeaderProps {
  onNewAgent: () => void;
  searchQuery: string;
  onSearchChange: (query: string) => void;
  totalAgents: number;
}

export const AgentsHeader: React.FC<AgentsHeaderProps> = ({
  onNewAgent,
  searchQuery,
  onSearchChange,
  totalAgents
}) => {
  return (
    <div className="flex flex-col space-y-4 sm:flex-row sm:items-center sm:justify-between sm:space-y-0">
      <div className="flex items-center space-x-2">
        <Users className="w-6 h-6 text-whatsapp-primary" />
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            Agentes
          </h1>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            {totalAgents} agente{totalAgents !== 1 ? 's' : ''} cadastrado{totalAgents !== 1 ? 's' : ''}
          </p>
        </div>
      </div>

      <div className="flex items-center space-x-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
          <Input
            placeholder="Buscar agentes..."
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            className="pl-10 w-64"
          />
        </div>
        
        <Button 
          onClick={onNewAgent}
          className="bg-whatsapp-primary hover:bg-whatsapp-primary/90"
        >
          <Plus className="w-4 h-4 mr-2" />
          Novo Agente
        </Button>
      </div>
    </div>
  );
};
