
import React, { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { useMutation, useQueryClient } from '@tanstack/react-query';

interface NewConversationDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onConversationCreated: () => void;
}

export const NewConversationDialog: React.FC<NewConversationDialogProps> = ({
  open,
  onOpenChange,
  onConversationCreated,
}) => {
  const [formData, setFormData] = useState({
    customerName: '',
    customerPhone: '',
    priority: 'medium' as 'high' | 'medium' | 'low',
    initialMessage: '',
  });
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const createConversationMutation = useMutation({
    mutationFn: async (data: typeof formData) => {
      console.log('Creating conversation with data:', data);
      
      const { data: conversation, error } = await supabase
        .from('conversations')
        .insert({
          customer_name: data.customerName.trim(),
          customer_phone: data.customerPhone.trim(),
          priority: data.priority,
          status: 'waiting',
          last_message_at: new Date().toISOString(),
        })
        .select()
        .single();

      if (error) {
        console.error('Error creating conversation:', error);
        throw new Error(error.message);
      }

      console.log('Conversation created successfully:', conversation);
      return conversation;
    },
    onSuccess: (conversation) => {
      toast({
        title: "Conversa criada!",
        description: `Nova conversa iniciada com ${formData.customerName}`,
      });
      
      // Reset form
      setFormData({
        customerName: '',
        customerPhone: '',
        priority: 'medium',
        initialMessage: '',
      });
      
      // Refresh conversations list
      queryClient.invalidateQueries({ queryKey: ['conversations'] });
      
      onOpenChange(false);
      onConversationCreated();
    },
    onError: (error: any) => {
      console.error('Error in mutation:', error);
      toast({
        title: "Erro ao criar conversa",
        description: error.message || "Ocorreu um erro ao criar a conversa. Tente novamente.",
        variant: "destructive",
      });
    }
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.customerName.trim() || !formData.customerPhone.trim()) {
      toast({
        title: "Campos obrigatórios",
        description: "Nome do cliente e telefone são obrigatórios.",
        variant: "destructive",
      });
      return;
    }

    createConversationMutation.mutate(formData);
  };

  const formatPhoneNumber = (value: string) => {
    // Remove todos os caracteres não numéricos
    const numbers = value.replace(/\D/g, '');
    
    // Limita a 11 dígitos (celular brasileiro)
    const limited = numbers.slice(0, 11);
    
    // Aplica máscara
    if (limited.length <= 2) {
      return `(${limited}`;
    } else if (limited.length <= 6) {
      return `(${limited.slice(0, 2)}) ${limited.slice(2)}`;
    } else if (limited.length <= 10) {
      return `(${limited.slice(0, 2)}) ${limited.slice(2, 6)}-${limited.slice(6)}`;
    } else {
      return `(${limited.slice(0, 2)}) ${limited.slice(2, 7)}-${limited.slice(7)}`;
    }
  };

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatPhoneNumber(e.target.value);
    setFormData(prev => ({ ...prev, customerPhone: formatted }));
  };

  const isCreating = createConversationMutation.isPending;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Nova Conversa</DialogTitle>
          <DialogDescription>
            Inicie uma nova conversa no WhatsApp. Preencha as informações do cliente.
          </DialogDescription>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="customerName">Nome do Cliente *</Label>
            <Input
              id="customerName"
              value={formData.customerName}
              onChange={(e) => setFormData(prev => ({ ...prev, customerName: e.target.value }))}
              placeholder="Digite o nome do cliente"
              disabled={isCreating}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="customerPhone">Telefone *</Label>
            <Input
              id="customerPhone"
              value={formData.customerPhone}
              onChange={handlePhoneChange}
              placeholder="(11) 99999-9999"
              disabled={isCreating}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="priority">Prioridade</Label>
            <Select 
              value={formData.priority} 
              onValueChange={(value: 'high' | 'medium' | 'low') => 
                setFormData(prev => ({ ...prev, priority: value }))
              }
              disabled={isCreating}
            >
              <SelectTrigger>
                <SelectValue placeholder="Selecione a prioridade" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="high">Alta</SelectItem>
                <SelectItem value="medium">Média</SelectItem>
                <SelectItem value="low">Baixa</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="initialMessage">Mensagem Inicial (Opcional)</Label>
            <Textarea
              id="initialMessage"
              value={formData.initialMessage}
              onChange={(e) => setFormData(prev => ({ ...prev, initialMessage: e.target.value }))}
              placeholder="Digite uma mensagem inicial..."
              rows={3}
              disabled={isCreating}
            />
          </div>

          <DialogFooter>
            <Button 
              type="button" 
              variant="outline" 
              onClick={() => onOpenChange(false)}
              disabled={isCreating}
            >
              Cancelar
            </Button>
            <Button 
              type="submit" 
              disabled={isCreating}
              className="bg-whatsapp-primary hover:bg-whatsapp-secondary"
            >
              {isCreating ? 'Criando...' : 'Criar Conversa'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};
