
export interface Agent {
  id: string;
  user_id?: string;
  name: string;
  email: string;
  phone?: string;
  role: 'super_admin' | 'admin' | 'agent';
  status: 'active' | 'inactive' | 'suspended';
  avatar_url?: string;
  department?: string;
  max_conversations: number;
  current_conversations: number;
  last_active_at?: string;
  created_at: string;
  updated_at: string;
}
