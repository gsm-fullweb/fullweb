
-- Create conversations table
CREATE TABLE public.conversations (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  customer_name TEXT NOT NULL,
  customer_phone TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'waiting' CHECK (status IN ('waiting', 'in_progress', 'waiting_client', 'resolved', 'spam')),
  priority TEXT NOT NULL DEFAULT 'medium' CHECK (priority IN ('high', 'medium', 'low')),
  sla_status TEXT CHECK (sla_status IN ('on-time', 'warning', 'overdue')),
  last_message_at TIMESTAMP WITH TIME ZONE,
  assigned_agent_id UUID REFERENCES public.profiles(id),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create tags table
CREATE TABLE public.tags (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL UNIQUE,
  color TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create conversation_tags junction table
CREATE TABLE public.conversation_tags (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  conversation_id UUID NOT NULL REFERENCES public.conversations(id) ON DELETE CASCADE,
  tag_id UUID NOT NULL REFERENCES public.tags(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(conversation_id, tag_id)
);

-- Enable RLS on all tables
ALTER TABLE public.conversations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.tags ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.conversation_tags ENABLE ROW LEVEL SECURITY;

-- RLS policies for conversations
CREATE POLICY "Users can view all conversations" ON public.conversations FOR SELECT USING (true);
CREATE POLICY "Users can create conversations" ON public.conversations FOR INSERT WITH CHECK (true);
CREATE POLICY "Users can update conversations" ON public.conversations FOR UPDATE USING (true);
CREATE POLICY "Users can delete conversations" ON public.conversations FOR DELETE USING (true);

-- RLS policies for tags
CREATE POLICY "Users can view all tags" ON public.tags FOR SELECT USING (true);
CREATE POLICY "Users can create tags" ON public.tags FOR INSERT WITH CHECK (true);
CREATE POLICY "Users can update tags" ON public.tags FOR UPDATE USING (true);
CREATE POLICY "Users can delete tags" ON public.tags FOR DELETE USING (true);

-- RLS policies for conversation_tags
CREATE POLICY "Users can view all conversation_tags" ON public.conversation_tags FOR SELECT USING (true);
CREATE POLICY "Users can create conversation_tags" ON public.conversation_tags FOR INSERT WITH CHECK (true);
CREATE POLICY "Users can update conversation_tags" ON public.conversation_tags FOR UPDATE USING (true);
CREATE POLICY "Users can delete conversation_tags" ON public.conversation_tags FOR DELETE USING (true);

-- Insert some sample data
INSERT INTO public.tags (name, color) VALUES 
  ('Urgente', '#ef4444'),
  ('VIP', '#8b5cf6'),
  ('Suporte', '#3b82f6'),
  ('Vendas', '#10b981'),
  ('Reclamação', '#f59e0b');

INSERT INTO public.conversations (customer_name, customer_phone, status, priority, sla_status, last_message_at, assigned_agent_id) VALUES 
  ('João Silva', '+55 11 99999-1234', 'waiting', 'high', 'warning', now() - interval '30 minutes', (SELECT id FROM public.profiles LIMIT 1)),
  ('Maria Santos', '+55 11 88888-5678', 'in_progress', 'medium', 'on-time', now() - interval '15 minutes', (SELECT id FROM public.profiles LIMIT 1)),
  ('Pedro Costa', '+55 11 77777-9012', 'waiting_client', 'low', 'on-time', now() - interval '2 hours', NULL),
  ('Ana Oliveira', '+55 11 66666-3456', 'resolved', 'medium', 'on-time', now() - interval '1 day', (SELECT id FROM public.profiles LIMIT 1));

-- Add some tags to conversations
INSERT INTO public.conversation_tags (conversation_id, tag_id) 
SELECT c.id, t.id 
FROM public.conversations c, public.tags t 
WHERE c.customer_name = 'João Silva' AND t.name = 'Urgente';

INSERT INTO public.conversation_tags (conversation_id, tag_id) 
SELECT c.id, t.id 
FROM public.conversations c, public.tags t 
WHERE c.customer_name = 'Maria Santos' AND t.name = 'Suporte';
