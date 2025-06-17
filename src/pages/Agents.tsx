
import React, { useState } from 'react';
import { DashboardLayout } from '@/components/Layout/DashboardLayout';
import { AgentsTable } from '@/components/Agents/AgentsTable';
import { AgentsHeader } from '@/components/Agents/AgentsHeader';
import { NewAgentDialog } from '@/components/Agents/NewAgentDialog';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { Skeleton } from '@/components/ui/skeleton';
import { useAuth } from '@/hooks/useAuth';
import { Agent } from '@/types/agent';

const Agents = () => {
  const { user } = useAuth();
  const [userRole] = useState<'super_admin' | 'admin' | 'agent'>('admin');
  const [searchQuery, setSearchQuery] = useState('');
  const [newAgentOpen, setNewAgentOpen] = useState(false);
  const { toast } = useToast();

  const { data: agents = [], isLoading, refetch } = useQuery<Agent[]>({
    queryKey: ['agents', searchQuery],
    queryFn: async () => {
      let query = supabase
        .from('agents')
        .select('*')
        .order('created_at', { ascending: false });

      // Apply search filter if there's a search query
      if (searchQuery) {
        query = query.or(`name.ilike.%${searchQuery}%,email.ilike.%${searchQuery}%,department.ilike.%${searchQuery}%`);
      }

      const { data, error } = await query;

      if (error) {
        console.error('Error fetching agents:', error);
        toast({
          title: "Erro ao buscar agentes",
          description: error.message,
          variant: "destructive",
        });
        throw error;
      }

      // Map database response to frontend Agent type
      return data.map((agent: any) => ({
        id: agent.id,
        user_id: agent.user_id,
        name: agent.name,
        email: agent.email,
        phone: agent.phone,
        role: agent.role,
        status: agent.status,
        avatar_url: agent.avatar_url,
        department: agent.department,
        max_conversations: agent.max_conversations,
        current_conversations: agent.current_conversations,
        last_active_at: agent.last_active_at,
        created_at: agent.created_at,
        updated_at: agent.updated_at,
      }));
    },
    enabled: !!user,
  });

  const handleNewAgent = () => {
    setNewAgentOpen(true);
  };

  const handleAgentCreated = () => {
    setNewAgentOpen(false);
    refetch();
    toast({
      title: "Agente criado",
      description: "Novo agente foi adicionado com sucesso.",
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
        <AgentsHeader
          onNewAgent={handleNewAgent}
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          totalAgents={agents.length}
        />
        
        <AgentsTable agents={agents} onRefresh={refetch} />
        
        <NewAgentDialog
          open={newAgentOpen}
          onOpenChange={setNewAgentOpen}
          onAgentCreated={handleAgentCreated}
        />
      </div>
    </DashboardLayout>
  );
};

export default Agents;
