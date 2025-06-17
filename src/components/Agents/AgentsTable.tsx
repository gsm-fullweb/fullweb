
import React, { useState } from 'react';
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
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { MoreHorizontal, Edit, Trash2, Phone, Mail } from 'lucide-react';
import { Agent } from '@/types/agent';
import { EditAgentDialog } from './EditAgentDialog';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { formatDistanceToNow } from 'date-fns';
import { ptBR } from 'date-fns/locale';

interface AgentsTableProps {
  agents: Agent[];
  onRefresh: () => void;
}

export const AgentsTable: React.FC<AgentsTableProps> = ({
  agents,
  onRefresh
}) => {
  const [editingAgent, setEditingAgent] = useState<Agent | null>(null);
  const { toast } = useToast();

  const getStatusBadge = (status: string) => {
    const statusMap = {
      active: { label: 'Ativo', variant: 'default' as const },
      inactive: { label: 'Inativo', variant: 'secondary' as const },
      suspended: { label: 'Suspenso', variant: 'destructive' as const }
    };
    
    const statusInfo = statusMap[status as keyof typeof statusMap] || statusMap.active;
    return (
      <Badge variant={statusInfo.variant}>
        {statusInfo.label}
      </Badge>
    );
  };

  const getRoleBadge = (role: string) => {
    const roleMap = {
      super_admin: { label: 'Super Admin', variant: 'destructive' as const },
      admin: { label: 'Admin', variant: 'default' as const },
      agent: { label: 'Agente', variant: 'secondary' as const }
    };
    
    const roleInfo = roleMap[role as keyof typeof roleMap] || roleMap.agent;
    return (
      <Badge variant={roleInfo.variant}>
        {roleInfo.label}
      </Badge>
    );
  };

  const handleDelete = async (agent: Agent) => {
    if (!confirm(`Tem certeza que deseja excluir o agente ${agent.name}?`)) {
      return;
    }

    try {
      const { error } = await supabase
        .from('agents')
        .delete()
        .eq('id', agent.id);

      if (error) {
        console.error('Error deleting agent:', error);
        toast({
          title: "Erro ao excluir agente",
          description: error.message,
          variant: "destructive",
        });
        return;
      }

      toast({
        title: "Agente excluído",
        description: `${agent.name} foi removido com sucesso.`,
      });

      onRefresh();
    } catch (error) {
      console.error('Unexpected error:', error);
      toast({
        title: "Erro ao excluir agente",
        description: "Tente novamente em alguns instantes.",
        variant: "destructive",
      });
    }
  };

  if (agents.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-500 dark:text-gray-400">
          Nenhum agente encontrado.
        </p>
      </div>
    );
  }

  return (
    <>
      <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Agente</TableHead>
              <TableHead>Contato</TableHead>
              <TableHead>Role</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Departamento</TableHead>
              <TableHead>Conversas</TableHead>
              <TableHead>Último Acesso</TableHead>
              <TableHead className="text-right">Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {agents.map((agent) => (
              <TableRow key={agent.id}>
                <TableCell>
                  <div className="flex items-center space-x-3">
                    <Avatar className="w-8 h-8">
                      <AvatarImage src={agent.avatar_url} />
                      <AvatarFallback>
                        {agent.name.split(' ').map(n => n[0]).join('').toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <div className="font-medium text-gray-900 dark:text-white">
                        {agent.name}
                      </div>
                    </div>
                  </div>
                </TableCell>
                <TableCell>
                  <div className="space-y-1">
                    <div className="flex items-center text-sm text-gray-500">
                      <Mail className="w-3 h-3 mr-1" />
                      {agent.email}
                    </div>
                    {agent.phone && (
                      <div className="flex items-center text-sm text-gray-500">
                        <Phone className="w-3 h-3 mr-1" />
                        {agent.phone}
                      </div>
                    )}
                  </div>
                </TableCell>
                <TableCell>
                  {getRoleBadge(agent.role)}
                </TableCell>
                <TableCell>
                  {getStatusBadge(agent.status)}
                </TableCell>
                <TableCell>
                  <span className="text-gray-600 dark:text-gray-400">
                    {agent.department || '-'}
                  </span>
                </TableCell>
                <TableCell>
                  <div className="text-sm">
                    <div className="font-medium">
                      {agent.current_conversations}/{agent.max_conversations}
                    </div>
                    <div className="text-gray-500">
                      conversas
                    </div>
                  </div>
                </TableCell>
                <TableCell>
                  <span className="text-sm text-gray-500">
                    {agent.last_active_at 
                      ? formatDistanceToNow(new Date(agent.last_active_at), { 
                          addSuffix: true, 
                          locale: ptBR 
                        })
                      : 'Nunca'
                    }
                  </span>
                </TableCell>
                <TableCell className="text-right">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="sm">
                        <MoreHorizontal className="w-4 h-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem onClick={() => setEditingAgent(agent)}>
                        <Edit className="w-4 h-4 mr-2" />
                        Editar
                      </DropdownMenuItem>
                      <DropdownMenuItem 
                        onClick={() => handleDelete(agent)}
                        className="text-red-600"
                      >
                        <Trash2 className="w-4 h-4 mr-2" />
                        Excluir
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <EditAgentDialog
        agent={editingAgent}
        open={!!editingAgent}
        onOpenChange={(open) => !open && setEditingAgent(null)}
        onAgentUpdated={() => {
          setEditingAgent(null);
          onRefresh();
        }}
      />
    </>
  );
};
