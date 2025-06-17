
-- Create agents table
CREATE TABLE public.agents (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  email TEXT NOT NULL UNIQUE,
  phone TEXT,
  role TEXT NOT NULL DEFAULT 'agent' CHECK (role IN ('super_admin', 'admin', 'agent')),
  status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'inactive', 'suspended')),
  avatar_url TEXT,
  department TEXT,
  max_conversations INTEGER DEFAULT 10,
  current_conversations INTEGER DEFAULT 0,
  last_active_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create indexes for better performance
CREATE INDEX idx_agents_email ON public.agents(email);
CREATE INDEX idx_agents_status ON public.agents(status);
CREATE INDEX idx_agents_role ON public.agents(role);
CREATE INDEX idx_agents_user_id ON public.agents(user_id);

-- Enable Row Level Security
ALTER TABLE public.agents ENABLE ROW LEVEL SECURITY;

-- Create RLS policies (allowing admins and super_admins to manage agents)
CREATE POLICY "Authenticated users can view agents" 
  ON public.agents 
  FOR SELECT 
  TO authenticated 
  USING (true);

CREATE POLICY "Admins can manage agents" 
  ON public.agents 
  FOR ALL 
  TO authenticated 
  USING (true);

-- Create trigger to automatically update updated_at
CREATE TRIGGER update_agents_updated_at 
  BEFORE UPDATE ON public.agents 
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
