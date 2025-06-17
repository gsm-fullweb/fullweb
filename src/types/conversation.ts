export interface Conversation {
  id: string;
  customerName: string;
  customerPhone: string;
  lastMessage?: string; // Temporarily optional
  lastMessageTime: string;
  unreadCount: number; // Will be set to 0 for now
  messageCount: number; // Will be set to 0 for now
  status: 'waiting' | 'in_progress' | 'waiting_client' | 'resolved' | 'spam';
  priority: 'high' | 'medium' | 'low';
  assignedAgent?: { name: string } | null;
  tags: { id: string; name: string; color: string | null }[];
  slaStatus?: 'on-time' | 'warning' | 'overdue';
  createdAt: string;
  updatedAt: string;
  customerOnline: boolean; // Will be false for now
}

export interface KanbanColumnType {
  id: string;
  title: string;
  color: string;
  count: number;
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: 'super_admin' | 'admin' | 'agent';
  avatar?: string;
  status: 'online' | 'offline' | 'away';
  lastActive: string;
}

export interface Organization {
  id: string;
  name: string;
  plan: string;
  agentCount: number;
  conversationCount: number;
  createdAt: string;
}
