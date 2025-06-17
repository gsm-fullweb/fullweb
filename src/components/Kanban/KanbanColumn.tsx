
import React from 'react';
import { Droppable } from 'react-beautiful-dnd';
import { ConversationCard } from './ConversationCard';
import { Conversation, KanbanColumnType } from '@/types/conversation';
import { Button } from '@/components/ui/button';
import { Plus, MoreHorizontal, Edit2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

interface KanbanColumnProps {
  column: KanbanColumnType;
  conversations: Conversation[];
  onConversationClick: (conversation: Conversation) => void;
  onNewConversation?: () => void;
  onColumnRename?: (columnId: string, newTitle: string) => void;
  onConvertToCustomer?: (conversation: Conversation) => void;
  onAssignAgent?: (conversation: Conversation) => void;
}

export const KanbanColumn: React.FC<KanbanColumnProps> = ({
  column,
  conversations,
  onConversationClick,
  onNewConversation,
  onColumnRename,
  onConvertToCustomer,
  onAssignAgent,
}) => {
  const handleRename = () => {
    const newTitle = prompt('Novo nome da coluna:', column.title);
    if (newTitle && newTitle.trim() && newTitle !== column.title) {
      onColumnRename?.(column.id, newTitle.trim());
    }
  };

  return (
    <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4 h-fit max-h-[calc(100vh-200px)] flex flex-col">
      {/* Column Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-2">
          <div 
            className="w-3 h-3 rounded-full" 
            style={{ backgroundColor: column.color }}
          />
          <h3 className="font-semibold text-gray-900 dark:text-white">
            {column.title}
          </h3>
          <span className="bg-gray-200 dark:bg-gray-700 text-gray-600 dark:text-gray-300 text-xs px-2 py-1 rounded-full">
            {column.count}
          </span>
        </div>

        <div className="flex items-center space-x-1">
          {column.id === 'waiting' && onNewConversation && (
            <Button
              variant="ghost"
              size="sm"
              onClick={onNewConversation}
              className="h-8 w-8 p-0"
              aria-label="Nova conversa"
            >
              <Plus className="w-4 h-4" />
            </Button>
          )}
          
          {onColumnRename && (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                  <MoreHorizontal className="w-4 h-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={handleRename}>
                  <Edit2 className="w-4 h-4 mr-2" />
                  Renomear coluna
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          )}
        </div>
      </div>

      {/* Droppable Area */}
      <Droppable droppableId={column.id}>
        {(provided, snapshot) => (
          <div
            ref={provided.innerRef}
            {...provided.droppableProps}
            className={cn(
              "flex-1 overflow-y-auto space-y-3 min-h-[200px] rounded-lg transition-colors",
              snapshot.isDraggingOver && "bg-blue-50 dark:bg-blue-900/20"
            )}
          >
            {conversations.map((conversation, index) => (
              <ConversationCard
                key={conversation.id}
                conversation={conversation}
                index={index}
                onClick={() => onConversationClick(conversation)}
                onConvertToCustomer={onConvertToCustomer}
                onAssignAgent={onAssignAgent}
              />
            ))}
            {provided.placeholder}
            
            {conversations.length === 0 && !snapshot.isDraggingOver && (
              <div className="text-center py-8 text-gray-500 dark:text-gray-400">
                <p className="text-sm">Nenhuma conversa</p>
              </div>
            )}
          </div>
        )}
      </Droppable>
    </div>
  );
};
