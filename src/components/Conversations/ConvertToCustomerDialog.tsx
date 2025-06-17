
import React, { useState } from 'react';
import {
  Dialog,
  DialogContent,
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
import { useToast } from '@/hooks/use-toast';
import { Conversation } from '@/types/conversation';
import { supabase } from '@/integrations/supabase/client';

interface ConvertToCustomerDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  conversation: Conversation | null;
  onCustomerCreated: () => void;
}

export const ConvertToCustomerDialog: React.FC<ConvertToCustomerDialogProps> = ({
  open,
  onOpenChange,
  conversation,
  onCustomerCreated
}) => {
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    status: 'active' as 'active' | 'inactive' | 'blocked'
  });
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  // Preenche os dados do formulário quando a conversa muda
  React.useEffect(() => {
    if (conversation) {
      setFormData({
        name: conversation.customerName,
        phone: conversation.customerPhone,
        email: '',
        status: 'active'
      });
    }
  }, [conversation]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name.trim() || !formData.phone.trim()) {
      toast({
        title: "Campos obrigatórios",
        description: "Nome e telefone são obrigatórios.",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    
    try {
      // Verifica se o cliente já existe
      const { data: existingCustomer } = await supabase
        .from('customers')
        .select('id')
        .eq('phone', formData.phone)
        .single();

      if (existingCustomer) {
        toast({
          title: "Cliente já existe",
          description: "Já existe um cliente cadastrado com este telefone.",
          variant: "destructive",
        });
        setIsLoading(false);
        return;
      }

      // Cria o cliente no banco de dados
      const { data, error } = await supabase
        .from('customers')
        .insert([
          {
            name: formData.name.trim(),
            phone: formData.phone.trim(),
            email: formData.email.trim() || null,
            status: formData.status
          }
        ])
        .select()
        .single();

      if (error) {
        console.error('Error creating customer:', error);
        toast({
          title: "Erro ao criar cliente",
          description: error.message,
          variant: "destructive",
        });
        return;
      }

      console.log('Customer created successfully:', data);
      
      setFormData({
        name: '',
        phone: '',
        email: '',
        status: 'active'
      });
      
      onCustomerCreated();
      
      toast({
        title: "Cliente criado",
        description: `Cliente ${formData.name} foi criado com sucesso!`,
      });
    } catch (error) {
      console.error('Unexpected error:', error);
      toast({
        title: "Erro ao criar cliente",
        description: "Tente novamente em alguns instantes.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = (field: keyof typeof formData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  if (!conversation) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Transformar em Cliente</DialogTitle>
        </DialogHeader>
        
        <div className="mb-4 p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
          <div className="text-sm text-gray-600 dark:text-gray-400">
            Conversa selecionada:
          </div>
          <div className="font-medium">{conversation.customerName}</div>
          <div className="text-sm text-gray-500">{conversation.customerPhone}</div>
        </div>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Nome *</Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) => handleChange('name', e.target.value)}
              placeholder="Nome completo do cliente"
              required
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="phone">Telefone *</Label>
            <Input
              id="phone"
              value={formData.phone}
              onChange={(e) => handleChange('phone', e.target.value)}
              placeholder="+55 11 99999-9999"
              required
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              value={formData.email}
              onChange={(e) => handleChange('email', e.target.value)}
              placeholder="email@exemplo.com"
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="status">Status</Label>
            <Select value={formData.status} onValueChange={(value) => handleChange('status', value)}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="active">Ativo</SelectItem>
                <SelectItem value="inactive">Inativo</SelectItem>
                <SelectItem value="blocked">Bloqueado</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div className="flex justify-end space-x-2 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={isLoading}
            >
              Cancelar
            </Button>
            <Button
              type="submit"
              disabled={isLoading}
              className="bg-whatsapp-primary hover:bg-whatsapp-primary/90"
            >
              {isLoading ? 'Criando...' : 'Criar Cliente'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};
