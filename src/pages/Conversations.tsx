
import React from 'react';
import { DashboardLayout } from '@/components/Layout/DashboardLayout';
import { KanbanBoard } from '@/components/Kanban/KanbanBoard';
import { Conversation, KanbanColumnType } from '@/types/conversation';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { KanbanBoardSkeleton } from '@/components/Kanban/KanbanBoardSkeleton';
import { useAuth } from '@/hooks/useAuth';

const Conversations = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: conversations = [], isLoading } = useQuery<Conversation[]>({
    queryKey: ['conversations'],
    queryFn: async () => {
      console.log('Fetching conversations...');
      
      // Primeiro busca as conversas sem o join
      const { data: conversationsData, error: conversationsError } = await supabase
        .from('conversations')
        .select(`
          id,
          customer_name,
          customer_phone,
          status,
          priority,
          sla_status,
          last_message_at,
          created_at,
          updated_at,
          assigned_agent_id,
          conversation_tags ( tags ( id, name, color ) )
        `)
        .order('created_at', { ascending: false });

      if (conversationsError) {
        console.error('Error fetching conversations:', conversationsError);
        toast({
          title: "Erro ao buscar conversas",
          description: conversationsError.message,
          variant: "destructive",
        });
        throw new Error(conversationsError.message);
      }

      console.log('Conversations fetched:', conversationsData?.length);

      // Busca todos os agentes separadamente
      const { data: agentsData, error: agentsError } = await supabase
        .from('agents')
        .select('id, name');

      if (agentsError) {
        console.error('Error fetching agents:', agentsError);
      }

      console.log('Agents fetched:', agentsData?.length);

      // Cria um mapa de agentes para lookup rápido
      const agentsMap = new Map();
      agentsData?.forEach(agent => {
        agentsMap.set(agent.id, agent);
      });

      // Map DB response to frontend Conversation type
      return conversationsData.map((conv: any) => ({
        id: conv.id,
        customerName: conv.customer_name,
        customerPhone: conv.customer_phone,
        status: conv.status,
        priority: conv.priority,
        slaStatus: conv.sla_status,
        lastMessageTime: conv.last_message_at || conv.created_at,
        createdAt: conv.created_at,
        updatedAt: conv.updated_at,
        assignedAgent: conv.assigned_agent_id ? agentsMap.get(conv.assigned_agent_id) : null,
        tags: conv.conversation_tags.map((ct: any) => ct.tags).filter(Boolean),
        // Placeholder data for fields not yet in DB
        lastMessage: '...', // We need to query messages table for this
        unreadCount: 0,
        messageCount: 0,
        customerOnline: false,
      }));
    },
    enabled: !!user,
  });

  // Fetch kanban columns from database
  const { data: kanbanColumns = [], isLoading: isLoadingColumns } = useQuery<KanbanColumnType[]>({
    queryKey: ['kanban-columns'],
    queryFn: async () => {
      const { data, error } = await (supabase as any)
        .from('kanban_columns')
        .select('*')
        .order('display_order', { ascending: true });

      if (error) {
        console.error('Error fetching kanban columns:', error);
        toast({
          title: "Erro ao buscar colunas",
          description: error.message,
          variant: "destructive",
        });
        throw new Error(error.message);
      }

      // Map DB response to frontend KanbanColumnType
      return data.map((col: any) => ({
        id: col.column_key,
        title: col.title,
        color: col.color,
        count: 0, // Will be calculated in KanbanBoard
      }));
    },
  });

  // Realtime subscription for conversations
  React.useEffect(() => {
    const channel = (supabase as any)
      .channel('db-conversations')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'conversations' },
        (payload: any) => {
          console.log('Change received on conversations!', payload);
          queryClient.invalidateQueries({ queryKey: ['conversations'] });
        }
      )
      .subscribe();

    return () => {
      (supabase as any).removeChannel(channel);
    };
  }, [queryClient]);

  const updateConversationMutation = useMutation({
    mutationFn: async ({ conversationId, newStatus }: { conversationId: string, newStatus: string }) => {
      const { error } = await (supabase as any)
        .from('conversations')
        .update({ status: newStatus as any, updated_at: new Date().toISOString() })
        .eq('id', conversationId);
      if (error) throw error;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['conversations'] });
      toast({
        title: "Conversa atualizada",
        description: `Status alterado para: ${variables.newStatus}`,
      });
    },
    onError: (error: any) => {
      toast({
        title: "Erro ao atualizar",
        description: error.message,
        variant: "destructive",
      });
    }
  });

  // Mutation for updating column names
  const updateColumnMutation = useMutation({
    mutationFn: async ({ columnKey, newTitle }: { columnKey: string, newTitle: string }) => {
      const { error } = await (supabase as any)
        .from('kanban_columns')
        .update({ title: newTitle, updated_at: new Date().toISOString() })
        .eq('column_key', columnKey);
      if (error) throw error;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['kanban-columns'] });
      toast({
        title: "Coluna renomeada",
        description: `Coluna renomeada para: ${variables.newTitle}`,
      });
    },
    onError: (error: any) => {
      toast({
        title: "Erro ao renomear coluna",
        description: error.message,
        variant: "destructive",
      });
    }
  });
  
  const handleConversationMove = (conversationId: string, newStatus: string) => {
    updateConversationMutation.mutate({ conversationId, newStatus });
  };

  const handleConversationClick = (conversation: Conversation) => {
    toast({
      title: "Abrindo conversa",
      description: `Conversa com ${conversation.customerName}`,
    });
    // Aqui seria implementada a abertura do chat
  };

  const handleRefreshConversations = () => {
    queryClient.invalidateQueries({ queryKey: ['conversations'] });
  };

  const handleColumnRename = (columnId: string, newTitle: string) => {
    updateColumnMutation.mutate({ columnKey: columnId, newTitle });
  };

  return (
    <DashboardLayout userRole="admin">
      <div className="h-full">
        {isLoading || isLoadingColumns ? (
          <KanbanBoardSkeleton />
        ) : (
          <KanbanBoard
            conversations={conversations}
            columns={kanbanColumns}
            onConversationMove={handleConversationMove}
            onConversationClick={handleConversationClick}
            onRefreshConversations={handleRefreshConversations}
            onColumnRename={handleColumnRename}
          />
        )}
      </div>
    </DashboardLayout>
  );
};

export default Conversations;
