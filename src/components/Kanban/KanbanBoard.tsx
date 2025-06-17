
import React, { useState } from 'react';
import { DragDropContext, Droppable, Draggable, DropResult } from 'react-beautiful-dnd';
import { KanbanColumn } from './KanbanColumn';
import { ConversationCard } from './ConversationCard';
import { NewConversationDialog } from './NewConversationDialog';
import { ConvertToCustomerDialog } from '../Conversations/ConvertToCustomerDialog';
import { AssignAgentDialog } from '../Conversations/AssignAgentDialog';
import { Conversation, KanbanColumnType } from '@/types/conversation';
import { Plus, Filter, MoreHorizontal } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useToast } from '@/hooks/use-toast';

interface KanbanBoardProps {
  conversations: Conversation[];
  columns: KanbanColumnType[];
  onConversationMove: (conversationId: string, newStatus: string) => void;
  onConversationClick: (conversation: Conversation) => void;
  onRefreshConversations?: () => void;
  onColumnRename?: (columnId: string, newTitle: string) => void;
}

export const KanbanBoard: React.FC<KanbanBoardProps> = ({
  conversations,
  columns: initialColumns,
  onConversationMove,
  onConversationClick,
  onRefreshConversations,
  onColumnRename,
}) => {
  const [filters, setFilters] = useState({
    agent: '',
    priority: '',
    tag: ''
  });
  const [isNewConversationDialogOpen, setIsNewConversationDialogOpen] = useState(false);
  const [isConvertToCustomerDialogOpen, setIsConvertToCustomerDialogOpen] = useState(false);
  const [isAssignAgentDialogOpen, setIsAssignAgentDialogOpen] = useState(false);
  const [selectedConversation, setSelectedConversation] = useState<Conversation | null>(null);
  const { toast } = useToast();

  // Group conversations by status
  const groupedConversations = conversations.reduce((acc, conversation) => {
    if (!acc[conversation.status]) {
      acc[conversation.status] = [];
    }
    acc[conversation.status].push(conversation);
    return acc;
  }, {} as Record<string, Conversation[]>);

  // Update column counts based on conversations
  const columnsWithCounts = initialColumns.map(column => ({
    ...column,
    count: groupedConversations[column.id]?.length || 0
  }));

  const handleDragEnd = (result: DropResult) => {
    const { destination, source, draggableId } = result;

    if (!destination) return;

    if (
      destination.droppableId === source.droppableId &&
      destination.index === source.index
    ) {
      return;
    }

    onConversationMove(draggableId, destination.droppableId);
  };

  const handleNewConversation = () => {
    setIsNewConversationDialogOpen(true);
  };

  const handleConversationCreated = () => {
    if (onRefreshConversations) {
      onRefreshConversations();
    }
  };

  const handleConvertToCustomer = (conversation: Conversation) => {
    setSelectedConversation(conversation);
    setIsConvertToCustomerDialogOpen(true);
  };

  const handleAssignAgent = (conversation: Conversation) => {
    setSelectedConversation(conversation);
    setIsAssignAgentDialogOpen(true);
  };

  const handleCustomerCreated = () => {
    setIsConvertToCustomerDialogOpen(false);
    setSelectedConversation(null);
    if (onRefreshConversations) {
      onRefreshConversations();
    }
  };

  const handleConversationAssigned = () => {
    setIsAssignAgentDialogOpen(false);
    setSelectedConversation(null);
    if (onRefreshConversations) {
      onRefreshConversations();
    }
  };

  const handleFilters = () => {
    toast({
      title: "Filtros",
      description: "Abrindo opções de filtro...",
    });
  };

  const filteredConversations = (columnId: string): Conversation[] => {
    const columnConversations = groupedConversations[columnId] || [];
    
    return columnConversations.filter(conversation => {
      if (filters.agent && conversation.assignedAgent?.name !== filters.agent) return false;
      if (filters.priority && conversation.priority !== filters.priority) return false;
      if (filters.tag && !conversation.tags.some(tag => tag.name === filters.tag)) return false;
      return true;
    });
  };

  return (
    <div className="h-full">
      {/* Board Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-4">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            Conversas WhatsApp
          </h1>
          <div className="text-sm text-gray-500 dark:text-gray-400">
            {conversations.length} conversas ativas
          </div>
        </div>

        <div className="flex items-center space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={handleFilters}
            aria-label="Abrir filtros"
          >
            <span className="sr-only">Filtros</span>
            <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2a1 1 0 01-.293.707L15 13.414V18a1 1 0 01-.883.992L14 19a1 1 0 01-1-1v-5.586l-4.707-4.707A1 1 0 018 6.586V6a1 1 0 01-1-1z" /></svg>
            Filtros
          </Button>
          
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm" aria-label="Abrir menu de opções">
                <span className="sr-only">Mais opções</span>
                <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><circle cx="12" cy="5" r="1.5"/><circle cx="12" cy="12" r="1.5"/><circle cx="12" cy="19" r="1.5"/></svg>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem>Exportar dados</DropdownMenuItem>
              <DropdownMenuItem>Configurar colunas</DropdownMenuItem>
              <DropdownMenuItem>Atualizar automático</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          <Button
            size="sm"
            className="bg-whatsapp-primary hover:bg-whatsapp-secondary"
            onClick={handleNewConversation}
            aria-label="Nova conversa"
          >
            <span className="sr-only">Nova conversa</span>
            <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4"/></svg>
            Nova Conversa
          </Button>
        </div>
      </div>

      {/* Kanban Board */}
      <DragDropContext onDragEnd={handleDragEnd}>
        <div className="flex space-x-6 overflow-x-auto pb-6">
          {columnsWithCounts.map((column) => (
            <div key={column.id} className="flex-shrink-0 w-80">
              <KanbanColumn 
                column={column}
                conversations={filteredConversations(column.id)}
                onConversationClick={onConversationClick}
                onNewConversation={handleNewConversation}
                onColumnRename={onColumnRename}
                onConvertToCustomer={handleConvertToCustomer}
                onAssignAgent={handleAssignAgent}
              />
            </div>
          ))}
        </div>
      </DragDropContext>

      <NewConversationDialog
        open={isNewConversationDialogOpen}
        onOpenChange={(open) => setIsNewConversationDialogOpen(open)}
        onConversationCreated={handleConversationCreated}
      />

      <ConvertToCustomerDialog
        open={isConvertToCustomerDialogOpen}
        onOpenChange={setIsConvertToCustomerDialogOpen}
        conversation={selectedConversation}
        onCustomerCreated={handleCustomerCreated}
      />

      <AssignAgentDialog
        open={isAssignAgentDialogOpen}
        onOpenChange={setIsAssignAgentDialogOpen}
        conversation={selectedConversation}
        onConversationAssigned={handleConversationAssigned}
      />
    </div>
  );
};
