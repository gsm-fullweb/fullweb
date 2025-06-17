
import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';
import type { Database } from '@/integrations/supabase/types';

type Automation = Database['public']['Tables']['automations']['Row'];
type NewAutomation = Database['public']['Tables']['automations']['Insert'];
type UpdateAutomation = Database['public']['Tables']['automations']['Update'];

export const useAutomations = () => {
  const queryClient = useQueryClient();

  // Fetch all automations
  const { data: automations = [], isLoading, error } = useQuery({
    queryKey: ['automations'],
    queryFn: async () => {
      console.log('Fetching automations...');
      const { data, error } = await supabase
        .from('automations')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching automations:', error);
        throw error;
      }

      console.log('Fetched automations:', data);
      return data as Automation[];
    },
  });

  // Create automation
  const createMutation = useMutation({
    mutationFn: async (newAutomation: NewAutomation) => {
      console.log('Creating automation:', newAutomation);
      const { data, error } = await supabase
        .from('automations')
        .insert([newAutomation])
        .select()
        .single();

      if (error) {
        console.error('Error creating automation:', error);
        throw error;
      }

      console.log('Created automation:', data);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['automations'] });
      toast({
        title: "Automação criada",
        description: "A nova automação foi criada com sucesso.",
      });
    },
    onError: (error) => {
      console.error('Create automation error:', error);
      toast({
        title: "Erro ao criar automação",
        description: "Ocorreu um erro ao criar a automação.",
        variant: "destructive",
      });
    },
  });

  // Update automation
  const updateMutation = useMutation({
    mutationFn: async ({ id, updates }: { id: string; updates: UpdateAutomation }) => {
      console.log('Updating automation:', id, updates);
      const { data, error } = await supabase
        .from('automations')
        .update(updates)
        .eq('id', id)
        .select()
        .single();

      if (error) {
        console.error('Error updating automation:', error);
        throw error;
      }

      console.log('Updated automation:', data);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['automations'] });
      toast({
        title: "Automação atualizada",
        description: "A automação foi atualizada com sucesso.",
      });
    },
    onError: (error) => {
      console.error('Update automation error:', error);
      toast({
        title: "Erro ao atualizar automação",
        description: "Ocorreu um erro ao atualizar a automação.",
        variant: "destructive",
      });
    },
  });

  // Delete automation
  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      console.log('Deleting automation:', id);
      const { error } = await supabase
        .from('automations')
        .delete()
        .eq('id', id);

      if (error) {
        console.error('Error deleting automation:', error);
        throw error;
      }

      console.log('Deleted automation:', id);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['automations'] });
      toast({
        title: "Automação excluída",
        description: "A automação foi removida com sucesso.",
      });
    },
    onError: (error) => {
      console.error('Delete automation error:', error);
      toast({
        title: "Erro ao excluir automação",
        description: "Ocorreu um erro ao excluir a automação.",
        variant: "destructive",
      });
    },
  });

  return {
    automations,
    isLoading,
    error,
    createAutomation: createMutation.mutate,
    updateAutomation: updateMutation.mutate,
    deleteAutomation: deleteMutation.mutate,
    isCreating: createMutation.isPending,
    isUpdating: updateMutation.isPending,
    isDeleting: deleteMutation.isPending,
  };
};
