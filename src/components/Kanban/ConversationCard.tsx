
import React from 'react';
import { Draggable } from 'react-beautiful-dnd';
import { Conversation } from '@/types/conversation';
import { 
  Clock, 
  User, 
  MessageCircle, 
  AlertCircle,
  CheckCircle,
  Circle,
  Phone,
  MoreHorizontal,
  UserPlus,
  UserCheck
} from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

interface ConversationCardProps {
  conversation: Conversation;
  index: number;
  onClick: () => void;
  onConvertToCustomer?: (conversation: Conversation) => void;
  onAssignAgent?: (conversation: Conversation) => void;
}

export const ConversationCard: React.FC<ConversationCardProps> = ({
  conversation,
  index,
  onClick,
  onConvertToCustomer,
  onAssignAgent,
}) => {
  const getPriorityIcon = (priority: string) => {
    switch (priority) {
      case 'high':
        return <AlertCircle className="w-4 h-4 text-red-500" />;
      case 'medium':
        return <Circle className="w-4 h-4 text-yellow-500" />;
      case 'low':
        return <CheckCircle className="w-4 h-4 text-green-500" />;
      default:
        return <Circle className="w-4 h-4 text-gray-400" />;
    }
  };

  const getStatusIndicator = (status: string) => {
    const statusMap = {
      'waiting': 'bg-yellow-500',
      'in_progress': 'bg-blue-500',
      'waiting_client': 'bg-orange-500',
      'resolved': 'bg-green-500',
      'spam': 'bg-gray-500'
    };
    return statusMap[status as keyof typeof statusMap] || 'bg-gray-500';
  };

  const handleConvertToCustomer = (e: React.MouseEvent) => {
    e.stopPropagation();
    onConvertToCustomer?.(conversation);
  };

  const handleAssignAgent = (e: React.MouseEvent) => {
    e.stopPropagation();
    onAssignAgent?.(conversation);
  };

  return (
    <Draggable draggableId={conversation.id} index={index}>
      {(provided, snapshot) => (
        <div
          ref={provided.innerRef}
          {...provided.draggableProps}
          {...provided.dragHandleProps}
          className={cn(
            "conversation-card relative",
            snapshot.isDragging && "shadow-lg scale-105",
            `priority-${conversation.priority}`
          )}
        >
          {/* Card Header */}
          <div className="flex items-start justify-between mb-3">
            <div className="flex items-center space-x-3" onClick={onClick}>
              {/* Avatar */}
              <div className="relative">
                <div className="w-10 h-10 bg-whatsapp-primary rounded-full flex items-center justify-center">
                  <User className="w-5 h-5 text-white" />
                </div>
              </div>
              
              <div className="flex-1 min-w-0">
                <div className="flex items-center space-x-2">
                  <h4 className="font-semibold text-gray-900 dark:text-white truncate">
                    {conversation.customerName}
                  </h4>
                  {getPriorityIcon(conversation.priority)}
                </div>
                <p className="text-sm text-gray-500 dark:text-gray-400 truncate">
                  {conversation.customerPhone}
                </p>
              </div>
            </div>

            <div className="flex items-center space-x-2">
              {/* Unread Badge - hidden if count is 0 */}
              {conversation.unreadCount > 0 && (
                <span className="bg-whatsapp-primary text-white text-xs px-2 py-1 rounded-full font-medium">
                  {conversation.unreadCount}
                </span>
              )}

              {/* Actions Menu */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    className="h-8 w-8 p-0"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <MoreHorizontal className="w-4 h-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem onClick={handleAssignAgent}>
                    <UserCheck className="w-4 h-4 mr-2" />
                    {conversation.assignedAgent ? 'Reatribuir Agente' : 'Atribuir Agente'}
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={handleConvertToCustomer}>
                    <UserPlus className="w-4 h-4 mr-2" />
                    Transformar em Cliente
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>

          {/* Last Message - hidden if not available */}
          {conversation.lastMessage && (
            <div className="mb-3" onClick={onClick}>
              <p className="text-sm text-gray-700 dark:text-gray-300 line-clamp-2">
                {conversation.lastMessage}
              </p>
            </div>
          )}

          {/* Tags */}
          {conversation.tags.length > 0 && (
            <div className="flex flex-wrap gap-1 mb-3" onClick={onClick}>
              {conversation.tags.slice(0, 3).map((tag) => (
                <span
                  key={tag.id}
                  className="bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 text-xs px-2 py-1 rounded-full"
                >
                  {tag.name}
                </span>
              ))}
              {conversation.tags.length > 3 && (
                <span className="text-gray-400 text-xs">
                  +{conversation.tags.length - 3}
                </span>
              )}
            </div>
          )}

          {/* Card Footer */}
          <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400" onClick={onClick}>
            <div className="flex items-center space-x-2">
              <Clock className="w-3 h-3" />
              <span>
                {formatDistanceToNow(new Date(conversation.lastMessageTime), {
                  addSuffix: true,
                  locale: ptBR,
                })}
              </span>
            </div>

            <div className="flex items-center space-x-2">
              {conversation.assignedAgent && conversation.assignedAgent.name && (
                <div className="flex items-center space-x-1">
                  <User className="w-3 h-3" />
                  <span className="truncate max-w-20">
                    {conversation.assignedAgent.name}
                  </span>
                </div>
              )}
              
              {/* Message count - hidden if 0 */}
              {conversation.messageCount > 0 && (
                <div className="flex items-center space-x-1">
                  <MessageCircle className="w-3 h-3" />
                  <span>{conversation.messageCount}</span>
                </div>
              )}
            </div>
          </div>

          {/* SLA Indicator */}
          {conversation.slaStatus && (
            <div className={cn(
              "mt-2 h-1 rounded-full",
              conversation.slaStatus === 'on-time' && "bg-green-500",
              conversation.slaStatus === 'warning' && "bg-yellow-500",
              conversation.slaStatus === 'overdue' && "bg-red-500"
            )} />
          )}
        </div>
      )}
    </Draggable>
  );
};
