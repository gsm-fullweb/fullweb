
import React, { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Conversation } from '@/types/conversation';
import { Agent } from '@/types/agent';
import { Loader2, UserCheck } from 'lucide-react';

interface AssignAgentDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  conversation: Conversation | null;
  onConversationAssigned: () => void;
}

export const AssignAgentDialog: React.FC<AssignAgentDialogProps> = ({
  open,
  onOpenChange,
  conversation,
  onConversationAssigned,
}) => {
  const [selectedAgentId, setSelectedAgentId] = useState<string>('');
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Fetch available agents
  const { data: agents = [], isLoading: isLoadingAgents } = useQuery({
    queryKey: ['agents', 'active'],
    queryFn: async (): Promise<Agent[]> => {
      const { data, error } = await supabase
        .from('agents')
        .select('*')
        .eq('status', 'active')
        .order('name');

      if (error) {
        console.error('Error fetching agents:', error);
        throw new Error(error.message);
      }

      // Map database response to frontend Agent type
      return data.map((agent: any) => ({
        id: agent.id,
        user_id: agent.user_id,
        name: agent.name,
        email: agent.email,
        phone: agent.phone,
        role: agent.role as 'super_admin' | 'admin' | 'agent',
        status: agent.status as 'active' | 'inactive' | 'suspended',
        avatar_url: agent.avatar_url,
        department: agent.department,
        max_conversations: agent.max_conversations,
        current_conversations: agent.current_conversations,
        last_active_at: agent.last_active_at,
        created_at: agent.created_at,
        updated_at: agent.updated_at,
      }));
    },
    enabled: open,
  });

  const assignAgentMutation = useMutation({
    mutationFn: async ({ conversationId, agentId }: { conversationId: string; agentId: string | null }) => {
      console.log('Assigning conversation:', conversationId, 'to agent:', agentId);
      
      const { error } = await supabase
        .from('conversations')
        .update({ 
          assigned_agent_id: agentId,
          updated_at: new Date().toISOString()
        })
        .eq('id', conversationId);

      if (error) {
        console.error('Error assigning agent:', error);
        throw error;
      }
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['conversations'] });
      
      const assignedAgent = agents.find(agent => agent.id === variables.agentId);
      const actionText = variables.agentId 
        ? `atribuída ao agente ${assignedAgent?.name}`
        : 'desatribuída';

      toast({
        title: "Conversa atualizada",
        description: `Conversa ${actionText} com sucesso.`,
      });

      onConversationAssigned();
      onOpenChange(false);
      setSelectedAgentId('');
    },
    onError: (error: any) => {
      console.error('Assignment error:', error);
      toast({
        title: "Erro ao atribuir conversa",
        description: error.message,
        variant: "destructive",
      });
    }
  });

  const handleAssign = () => {
    if (!conversation) return;
    
    const agentId = selectedAgentId === 'unassign' ? null : selectedAgentId;
    console.log('Selected agent ID:', selectedAgentId, 'Processed agent ID:', agentId);
    
    assignAgentMutation.mutate({ 
      conversationId: conversation.id, 
      agentId 
    });
  };

  const handleOpenChange = (open: boolean) => {
    if (!open) {
      setSelectedAgentId('');
    }
    onOpenChange(open);
  };

  if (!conversation) return null;

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center space-x-2">
            <UserCheck className="w-5 h-5 text-whatsapp-primary" />
            <span>Atribuir Agente</span>
          </DialogTitle>
          <DialogDescription>
            Selecione um agente para atribuir à conversa com {conversation.customerName}.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <div>
            <label className="text-sm font-medium mb-2 block">
              Agente
            </label>
            <Select 
              value={selectedAgentId} 
              onValueChange={setSelectedAgentId}
              disabled={isLoadingAgents}
            >
              <SelectTrigger>
                <SelectValue placeholder="Selecione um agente" />
              </SelectTrigger>
              <SelectContent>
                {conversation.assignedAgent && (
                  <SelectItem value="unassign">
                    Remover atribuição
                  </SelectItem>
                )}
                {agents.map((agent) => (
                  <SelectItem key={agent.id} value={agent.id}>
                    <div className="flex items-center space-x-2">
                      <span>{agent.name}</span>
                      <span className="text-xs text-gray-500">
                        ({agent.current_conversations}/{agent.max_conversations})
                      </span>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {conversation.assignedAgent && (
            <div className="text-sm text-gray-600">
              <span className="font-medium">Atualmente atribuída a:</span> {conversation.assignedAgent.name}
            </div>
          )}
        </div>

        <DialogFooter>
          <Button
            type="button"
            variant="outline"
            onClick={() => handleOpenChange(false)}
          >
            Cancelar
          </Button>
          <Button
            onClick={handleAssign}
            disabled={!selectedAgentId || assignAgentMutation.isPending}
            className="bg-whatsapp-primary hover:bg-whatsapp-primary/90"
          >
            {assignAgentMutation.isPending && (
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
            )}
            {selectedAgentId === 'unassign' ? 'Remover Atribuição' : 'Atribuir'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
