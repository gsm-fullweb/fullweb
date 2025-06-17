
import React, { useState } from 'react';
import { DashboardLayout } from '@/components/Layout/DashboardLayout';
import { CustomersTable } from '@/components/Customers/CustomersTable';
import { CustomersHeader } from '@/components/Customers/CustomersHeader';
import { NewCustomerDialog } from '@/components/Customers/NewCustomerDialog';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { Skeleton } from '@/components/ui/skeleton';
import { useAuth } from '@/hooks/useAuth';

export interface Customer {
  id: string;
  name: string;
  phone: string;
  email?: string;
  status: 'active' | 'inactive' | 'blocked';
  createdAt: string;
  updatedAt: string;
}

const Customers = () => {
  const { user } = useAuth();
  const [userRole] = useState<'super_admin' | 'admin' | 'agent'>('admin');
  const [searchQuery, setSearchQuery] = useState('');
  const [newCustomerOpen, setNewCustomerOpen] = useState(false);
  const { toast } = useToast();

  const { data: customers = [], isLoading, refetch } = useQuery<Customer[]>({
    queryKey: ['customers', searchQuery],
    queryFn: async () => {
      let query = supabase
        .from('customers')
        .select('*')
        .order('created_at', { ascending: false });

      // Apply search filter if there's a search query
      if (searchQuery) {
        query = query.or(`name.ilike.%${searchQuery}%,phone.ilike.%${searchQuery}%,email.ilike.%${searchQuery}%`);
      }

      const { data, error } = await query;

      if (error) {
        console.error('Error fetching customers:', error);
        toast({
          title: "Erro ao buscar clientes",
          description: error.message,
          variant: "destructive",
        });
        throw error;
      }

      // Map database response to frontend Customer type
      return data.map((customer: any) => ({
        id: customer.id,
        name: customer.name,
        phone: customer.phone,
        email: customer.email,
        status: customer.status,
        createdAt: customer.created_at,
        updatedAt: customer.updated_at,
      }));
    },
    enabled: !!user,
  });

  const handleNewCustomer = () => {
    setNewCustomerOpen(true);
  };

  const handleCustomerCreated = () => {
    setNewCustomerOpen(false);
    refetch();
    toast({
      title: "Cliente criado",
      description: "Novo cliente foi adicionado com sucesso.",
    });
  };

  if (isLoading) {
    return (
      <DashboardLayout userRole={userRole}>
        <div className="space-y-6">
          <Skeleton className="h-8 w-48" />
          <div className="space-y-4">
            {[...Array(5)].map((_, i) => (
              <Skeleton key={i} className="h-16 w-full" />
            ))}
          </div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout userRole={userRole}>
      <div className="space-y-6">
        <CustomersHeader
          onNewCustomer={handleNewCustomer}
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          totalCustomers={customers.length}
        />
        
        <CustomersTable customers={customers} onRefresh={refetch} />
        
        <NewCustomerDialog
          open={newCustomerOpen}
          onOpenChange={setNewCustomerOpen}
          onCustomerCreated={handleCustomerCreated}
        />
      </div>
    </DashboardLayout>
  );
};

export default Customers;
