
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { 
  MoreHorizontal, 
  Play, 
  Edit, 
  Trash2, 
  MessageSquare,
  Clock,
  Users
} from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useAutomations } from '@/hooks/useAutomations';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

const getTypeLabel = (type: string) => {
  const labels = {
    welcome: 'Boas-vindas',
    away: 'Ausência',
    keyword: 'Palavra-chave',
    schedule: 'Agendada'
  };
  return labels[type as keyof typeof labels] || type;
};

const getTypeColor = (type: string) => {
  const colors = {
    welcome: 'bg-green-100 text-green-800',
    away: 'bg-yellow-100 text-yellow-800',
    keyword: 'bg-blue-100 text-blue-800',
    schedule: 'bg-purple-100 text-purple-800'
  };
  return colors[type as keyof typeof colors] || 'bg-gray-100 text-gray-800';
};

const getStatusColor = (status: string) => {
  const colors = {
    active: 'bg-green-100 text-green-800',
    inactive: 'bg-red-100 text-red-800',
    pending: 'bg-yellow-100 text-yellow-800'
  };
  return colors[status as keyof typeof colors] || 'bg-gray-100 text-gray-800';
};

const getStatusLabel = (status: string) => {
  const labels = {
    active: 'Ativa',
    inactive: 'Inativa',
    pending: 'Pendente'
  };
  return labels[status as keyof typeof labels] || status;
};

export const AutomationsList = () => {
  const { automations, isLoading, updateAutomation, deleteAutomation } = useAutomations();

  const handleToggleStatus = (id: string, currentStatus: string) => {
    const newStatus = currentStatus === 'active' ? 'inactive' : 'active';
    updateAutomation({ 
      id, 
      updates: { status: newStatus as 'active' | 'inactive' | 'pending' } 
    });
  };

  const handleDelete = (id: string) => {
    deleteAutomation(id);
  };

  if (isLoading) {
    return (
      <div className="grid gap-4">
        {[1, 2, 3].map((i) => (
          <Card key={i} className="animate-pulse">
            <CardHeader>
              <div className="h-6 bg-gray-200 rounded w-1/3"></div>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="h-4 bg-gray-200 rounded w-2/3"></div>
                <div className="h-4 bg-gray-200 rounded w-1/2"></div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  if (automations.length === 0) {
    return (
      <Card>
        <CardContent className="flex flex-col items-center justify-center py-8">
          <MessageSquare className="w-12 h-12 text-gray-400 mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            Nenhuma automação encontrada
          </h3>
          <p className="text-gray-500 text-center">
            Crie sua primeira automação para começar a automatizar suas respostas no WhatsApp.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="grid gap-4">
      {automations.map((automation) => (
        <Card key={automation.id} className="hover:shadow-md transition-shadow">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <CardTitle className="text-lg">{automation.name}</CardTitle>
                <Badge className={getTypeColor(automation.type)}>
                  {getTypeLabel(automation.type)}
                </Badge>
                <Badge className={getStatusColor(automation.status)}>
                  {getStatusLabel(automation.status)}
                </Badge>
              </div>
              
              <div className="flex items-center gap-2">
                <Switch 
                  checked={automation.status === 'active'}
                  onCheckedChange={() => handleToggleStatus(automation.id, automation.status)}
                />
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="sm">
                      <MoreHorizontal className="w-4 h-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem>
                      <Edit className="w-4 h-4 mr-2" />
                      Editar
                    </DropdownMenuItem>
                    <DropdownMenuItem>
                      <Play className="w-4 h-4 mr-2" />
                      Testar
                    </DropdownMenuItem>
                    <DropdownMenuItem 
                      className="text-red-600"
                      onClick={() => handleDelete(automation.id)}
                    >
                      <Trash2 className="w-4 h-4 mr-2" />
                      Excluir
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>
          </CardHeader>
          
          <CardContent>
            {automation.description && (
              <p className="text-gray-600 dark:text-gray-300 mb-4">
                {automation.description}
              </p>
            )}
            
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-sm">
              <div className="flex items-center gap-2">
                <MessageSquare className="w-4 h-4 text-gray-500" />
                <span className="text-gray-500">Gatilho:</span>
                <span className="font-medium">{automation.trigger_condition}</span>
              </div>
              
              <div className="flex items-center gap-2">
                <Users className="w-4 h-4 text-gray-500" />
                <span className="text-gray-500">Respostas:</span>
                <span className="font-medium">{automation.responses_count}</span>
              </div>
              
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-gray-500" />
                <span className="text-gray-500">Último uso:</span>
                <span className="font-medium">
                  {automation.last_triggered_at 
                    ? format(new Date(automation.last_triggered_at), 'dd/MM/yyyy HH:mm', { locale: ptBR })
                    : 'Nunca'
                  }
                </span>
              </div>
              
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-gray-500" />
                <span className="text-gray-500">Criada em:</span>
                <span className="font-medium">
                  {format(new Date(automation.created_at), 'dd/MM/yyyy', { locale: ptBR })}
                </span>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};
