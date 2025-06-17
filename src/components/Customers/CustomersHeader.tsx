
import React from 'react';
import { Search, Plus, Users } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';

interface CustomersHeaderProps {
  onNewCustomer: () => void;
  searchQuery: string;
  onSearchChange: (query: string) => void;
  totalCustomers: number;
}

export const CustomersHeader: React.FC<CustomersHeaderProps> = ({
  onNewCustomer,
  searchQuery,
  onSearchChange,
  totalCustomers
}) => {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            Clientes
          </h1>
          <p className="text-gray-600 dark:text-gray-300">
            Gerencie seus clientes e histórico de conversas
          </p>
        </div>
        
        <Button onClick={onNewCustomer} className="bg-whatsapp-primary hover:bg-whatsapp-primary/90">
          <Plus className="w-4 h-4 mr-2" />
          Novo Cliente
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <Users className="h-8 w-8 text-whatsapp-primary" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600 dark:text-gray-300">
                  Total de Clientes
                </p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                  {totalCustomers}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="flex items-center space-x-4">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
          <Input
            placeholder="Buscar por nome, telefone ou email..."
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            className="pl-10"
          />
        </div>
      </div>
    </div>
  );
};
