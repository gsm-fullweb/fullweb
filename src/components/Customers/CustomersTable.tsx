
import React from 'react';
import { Phone, Mail, MoreHorizontal, MessageSquare, Users } from 'lucide-react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Card } from '@/components/ui/card';
import { Customer } from '@/pages/Customers';
import { formatDistanceToNow } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface CustomersTableProps {
  customers: Customer[];
  onRefresh: () => void;
}

export const CustomersTable: React.FC<CustomersTableProps> = ({ customers, onRefresh }) => {
  const { toast } = useToast();

  const getStatusColor = (status: Customer['status']) => {
    switch (status) {
      case 'active':
        return 'bg-green-100 text-green-800';
      case 'inactive':
        return 'bg-yellow-100 text-yellow-800';
      case 'blocked':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusLabel = (status: Customer['status']) => {
    switch (status) {
      case 'active':
        return 'Ativo';
      case 'inactive':
        return 'Inativo';
      case 'blocked':
        return 'Bloqueado';
      default:
        return status;
    }
  };

  const formatLastContact = (dateString?: string) => {
    if (!dateString) return 'Nunca';
    
    try {
      return formatDistanceToNow(new Date(dateString), {
        addSuffix: true,
        locale: ptBR
      });
    } catch {
      return 'Data inválida';
    }
  };

  const handleStatusUpdate = async (customerId: string, newStatus: Customer['status']) => {
    try {
      const { error } = await supabase
        .from('customers')
        .update({ status: newStatus })
        .eq('id', customerId);

      if (error) throw error;

      toast({
        title: "Status atualizado",
        description: `Cliente ${newStatus === 'blocked' ? 'bloqueado' : newStatus === 'inactive' ? 'inativado' : 'ativado'} com sucesso.`,
      });

      onRefresh();
    } catch (error: any) {
      toast({
        title: "Erro ao atualizar status",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const handleDeleteCustomer = async (customerId: string) => {
    try {
      const { error } = await supabase
        .from('customers')
        .delete()
        .eq('id', customerId);

      if (error) throw error;

      toast({
        title: "Cliente removido",
        description: "Cliente foi removido com sucesso.",
      });

      onRefresh();
    } catch (error: any) {
      toast({
        title: "Erro ao remover cliente",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  if (customers.length === 0) {
    return (
      <Card className="p-8 text-center">
        <div className="flex flex-col items-center space-y-4">
          <Users className="w-12 h-12 text-gray-400" />
          <div>
            <h3 className="text-lg font-medium text-gray-900 dark:text-white">
              Nenhum cliente encontrado
            </h3>
            <p className="text-gray-600 dark:text-gray-300">
              Comece adicionando seu primeiro cliente.
            </p>
          </div>
        </div>
      </Card>
    );
  }

  return (
    <Card>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Cliente</TableHead>
            <TableHead>Contato</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Criado em</TableHead>
            <TableHead className="w-[50px]"></TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {customers.map((customer) => (
            <TableRow key={customer.id}>
              <TableCell>
                <div>
                  <div className="font-medium text-gray-900 dark:text-white">
                    {customer.name}
                  </div>
                </div>
              </TableCell>
              
              <TableCell>
                <div className="space-y-1">
                  <div className="flex items-center space-x-2 text-sm">
                    <Phone className="w-4 h-4 text-gray-400" />
                    <span>{customer.phone}</span>
                  </div>
                  {customer.email && (
                    <div className="flex items-center space-x-2 text-sm text-gray-600 dark:text-gray-300">
                      <Mail className="w-4 h-4 text-gray-400" />
                      <span>{customer.email}</span>
                    </div>
                  )}
                </div>
              </TableCell>
              
              <TableCell>
                <Badge className={getStatusColor(customer.status)}>
                  {getStatusLabel(customer.status)}
                </Badge>
              </TableCell>
              
              <TableCell>
                <span className="text-sm text-gray-600 dark:text-gray-300">
                  {formatLastContact(customer.createdAt)}
                </span>
              </TableCell>
              
              <TableCell>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="sm">
                      <MoreHorizontal className="w-4 h-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem>
                      Ver Conversas
                    </DropdownMenuItem>
                    {customer.status !== 'blocked' && (
                      <DropdownMenuItem onClick={() => handleStatusUpdate(customer.id, 'blocked')}>
                        Bloquear Cliente
                      </DropdownMenuItem>
                    )}
                    {customer.status !== 'active' && (
                      <DropdownMenuItem onClick={() => handleStatusUpdate(customer.id, 'active')}>
                        Ativar Cliente
                      </DropdownMenuItem>
                    )}
                    {customer.status !== 'inactive' && (
                      <DropdownMenuItem onClick={() => handleStatusUpdate(customer.id, 'inactive')}>
                        Inativar Cliente
                      </DropdownMenuItem>
                    )}
                    <DropdownMenuItem 
                      onClick={() => handleDeleteCustomer(customer.id)}
                      className="text-red-600"
                    >
                      Remover Cliente
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </Card>
  );
};
