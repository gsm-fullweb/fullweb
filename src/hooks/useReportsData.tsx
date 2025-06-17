
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

export const useConversationsMetrics = () => {
  return useQuery({
    queryKey: ['conversations-metrics'],
    queryFn: async () => {
      const { data: conversations, error } = await supabase
        .from('conversations')
        .select('id, status, created_at, assigned_agent_id');

      if (error) throw error;

      const total = conversations?.length || 0;
      const resolved = conversations?.filter(c => c.status === 'resolved').length || 0;
      const activeAgents = new Set(conversations?.filter(c => c.assigned_agent_id).map(c => c.assigned_agent_id)).size;

      // Calcular conversas dos últimos 30 dias para comparação
      const thirtyDaysAgo = new Date();
      thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
      
      const recentConversations = conversations?.filter(c => 
        new Date(c.created_at) >= thirtyDaysAgo
      ) || [];

      return {
        totalConversations: total,
        resolvedConversations: resolved,
        activeAgents,
        resolutionRate: total > 0 ? ((resolved / total) * 100).toFixed(1) : '0',
        recentTotal: recentConversations.length
      };
    }
  });
};

export const useConversationsChart = () => {
  return useQuery({
    queryKey: ['conversations-chart'],
    queryFn: async () => {
      const { data: conversations, error } = await supabase
        .from('conversations')
        .select('created_at, status')
        .order('created_at', { ascending: true });

      if (error) throw error;

      // Agrupar por dia dos últimos 7 dias
      const last7Days = [];
      for (let i = 6; i >= 0; i--) {
        const date = new Date();
        date.setDate(date.getDate() - i);
        const dateStr = date.toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit' });
        
        const dayStart = new Date(date);
        dayStart.setHours(0, 0, 0, 0);
        const dayEnd = new Date(date);
        dayEnd.setHours(23, 59, 59, 999);

        const dayConversations = conversations?.filter(c => {
          const convDate = new Date(c.created_at);
          return convDate >= dayStart && convDate <= dayEnd;
        }) || [];

        const resolved = dayConversations.filter(c => c.status === 'resolved').length;

        last7Days.push({
          date: dateStr,
          conversas: dayConversations.length,
          resolvidas: resolved
        });
      }

      return last7Days;
    }
  });
};

export const useAgentsPerformance = () => {
  return useQuery({
    queryKey: ['agents-performance'],
    queryFn: async () => {
      const { data: agents, error: agentsError } = await supabase
        .from('agents')
        .select('id, name, status');

      if (agentsError) throw agentsError;

      const { data: conversations, error: conversationsError } = await supabase
        .from('conversations')
        .select('assigned_agent_id, status, created_at');

      if (conversationsError) throw conversationsError;

      return agents?.map(agent => {
        const agentConversations = conversations?.filter(c => c.assigned_agent_id === agent.id) || [];
        const resolved = agentConversations.filter(c => c.status === 'resolved').length;
        const total = agentConversations.length;

        return {
          nome: agent.name,
          conversas: total,
          resolvidas: resolved,
          tempoMedio: `${(Math.random() * 2 + 1).toFixed(1)} min`, // Simulado por enquanto
          satisfacao: (Math.random() * 0.5 + 4.5).toFixed(1),
          status: agent.status === 'active' ? 'online' : 'ausente'
        };
      }) || [];
    }
  });
};

export const useResponseTimeChart = () => {
  return useQuery({
    queryKey: ['response-time-chart'],
    queryFn: async () => {
      const { data: agents, error } = await supabase
        .from('agents')
        .select('name');

      if (error) throw error;

      // Por enquanto, vamos simular os tempos de resposta
      // Em uma implementação real, você teria uma tabela de mensagens ou logs
      return agents?.map(agent => ({
        agente: agent.name,
        tempoMedio: Math.random() * 2 + 1.5 // Entre 1.5 e 3.5 minutos
      })) || [];
    }
  });
};
