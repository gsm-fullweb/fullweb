
-- Create a table to store kanban column configurations
CREATE TABLE public.kanban_columns (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  column_key TEXT NOT NULL UNIQUE, -- 'waiting', 'in_progress', etc.
  title TEXT NOT NULL,
  color TEXT NOT NULL,
  display_order INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Insert default columns
INSERT INTO public.kanban_columns (column_key, title, color, display_order) VALUES
('waiting', 'Aguardando', '#FEF3C7', 1),
('in_progress', 'Em Andamento', '#DBEAFE', 2),
('waiting_client', 'Aguardando Cliente', '#FEE2E2', 3),
('resolved', 'Resolvido', '#D1FAE5', 4),
('spam', 'Spam/Bloqueado', '#F3F4F6', 5);

-- Add Row Level Security (RLS) - making it public for now since it's configuration data
ALTER TABLE public.kanban_columns ENABLE ROW LEVEL SECURITY;

-- Create policy that allows everyone to view columns (since it's configuration data)
CREATE POLICY "Anyone can view kanban columns" 
  ON public.kanban_columns 
  FOR SELECT 
  TO public
  USING (true);

-- Create policy that allows authenticated users to update columns
CREATE POLICY "Authenticated users can update kanban columns" 
  ON public.kanban_columns 
  FOR UPDATE 
  TO authenticated
  USING (true);
