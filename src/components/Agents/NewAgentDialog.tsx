
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
import { supabase } from '@/integrations/supabase/client';

interface NewAgentDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onAgentCreated: () => void;
}

export const NewAgentDialog: React.FC<NewAgentDialogProps> = ({
  open,
  onOpenChange,
  onAgentCreated
}) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    role: 'agent' as 'super_admin' | 'admin' | 'agent',
    status: 'active' as 'active' | 'inactive' | 'suspended',
    department: '',
    max_conversations: 10
  });
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name.trim() || !formData.email.trim()) {
      toast({
        title: "Campos obrigatórios",
        description: "Nome e email são obrigatórios.",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    
    try {
      // Verifica se o agente já existe
      const { data: existingAgent } = await supabase
        .from('agents')
        .select('id')
        .eq('email', formData.email)
        .maybeSingle();

      if (existingAgent) {
        toast({
          title: "Agente já existe",
          description: "Já existe um agente cadastrado com este email.",
          variant: "destructive",
        });
        setIsLoading(false);
        return;
      }

      // Cria o agente no banco de dados
      const { data, error } = await supabase
        .from('agents')
        .insert([
          {
            name: formData.name.trim(),
            email: formData.email.trim(),
            phone: formData.phone.trim() || null,
            role: formData.role,
            status: formData.status,
            department: formData.department.trim() || null,
            max_conversations: formData.max_conversations
          }
        ])
        .select()
        .single();

      if (error) {
        console.error('Error creating agent:', error);
        toast({
          title: "Erro ao criar agente",
          description: error.message,
          variant: "destructive",
        });
        return;
      }

      console.log('Agent created successfully:', data);
      
      setFormData({
        name: '',
        email: '',
        phone: '',
        role: 'agent',
        status: 'active',
        department: '',
        max_conversations: 10
      });
      
      onAgentCreated();
      
      toast({
        title: "Agente criado",
        description: `Agente ${formData.name} foi criado com sucesso!`,
      });
    } catch (error) {
      console.error('Unexpected error:', error);
      toast({
        title: "Erro ao criar agente",
        description: "Tente novamente em alguns instantes.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = (field: keyof typeof formData, value: string | number) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Novo Agente</DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Nome *</Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) => handleChange('name', e.target.value)}
              placeholder="Nome completo do agente"
              required
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="email">Email *</Label>
            <Input
              id="email"
              type="email"
              value={formData.email}
              onChange={(e) => handleChange('email', e.target.value)}
              placeholder="email@exemplo.com"
              required
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="phone">Telefone</Label>
            <Input
              id="phone"
              value={formData.phone}
              onChange={(e) => handleChange('phone', e.target.value)}
              placeholder="+55 11 99999-9999"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="role">Role</Label>
              <Select value={formData.role} onValueChange={(value) => handleChange('role', value)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="agent">Agente</SelectItem>
                  <SelectItem value="admin">Admin</SelectItem>
                  <SelectItem value="super_admin">Super Admin</SelectItem>
                </SelectContent>
              </Select>
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
                  <SelectItem value="suspended">Suspenso</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="department">Departamento</Label>
            <Input
              id="department"
              value={formData.department}
              onChange={(e) => handleChange('department', e.target.value)}
              placeholder="Ex: Suporte, Vendas"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="max_conversations">Máximo de Conversas</Label>
            <Input
              id="max_conversations"
              type="number"
              min="1"
              max="50"
              value={formData.max_conversations}
              onChange={(e) => handleChange('max_conversations', parseInt(e.target.value) || 10)}
            />
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
              {isLoading ? 'Criando...' : 'Criar Agente'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};
