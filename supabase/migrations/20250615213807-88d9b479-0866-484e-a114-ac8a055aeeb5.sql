
-- Create automations table
CREATE TABLE public.automations (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT,
  type TEXT NOT NULL CHECK (type IN ('welcome', 'away', 'keyword', 'schedule')),
  status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'inactive', 'pending')),
  trigger_condition TEXT NOT NULL,
  response_message TEXT NOT NULL,
  responses_count INTEGER NOT NULL DEFAULT 0,
  last_triggered_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Add Row Level Security (RLS)
ALTER TABLE public.automations ENABLE ROW LEVEL SECURITY;

-- Create policies for automations (allowing all operations for now)
CREATE POLICY "Allow all operations on automations" 
  ON public.automations 
  FOR ALL 
  USING (true) 
  WITH CHECK (true);

-- Create trigger to update updated_at column
CREATE TRIGGER update_automations_updated_at
  BEFORE UPDATE ON public.automations
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();
