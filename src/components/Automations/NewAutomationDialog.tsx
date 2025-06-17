
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
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useAutomations } from '@/hooks/useAutomations';

interface NewAutomationDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const NewAutomationDialog: React.FC<NewAutomationDialogProps> = ({
  open,
  onOpenChange,
}) => {
  const { createAutomation, isCreating } = useAutomations();
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    type: '',
    trigger_condition: '',
    response_message: '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name || !formData.type || !formData.trigger_condition || !formData.response_message) {
      return;
    }

    console.log('Submitting new automation:', formData);
    
    createAutomation({
      name: formData.name,
      description: formData.description || null,
      type: formData.type as 'welcome' | 'away' | 'keyword' | 'schedule',
      trigger_condition: formData.trigger_condition,
      response_message: formData.response_message,
    });
    
    setFormData({
      name: '',
      description: '',
      type: '',
      trigger_condition: '',
      response_message: '',
    });
    
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Nova Automação</DialogTitle>
          <DialogDescription>
            Crie uma nova automação para o WhatsApp
          </DialogDescription>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="name">Nome *</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="Nome da automação"
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="type">Tipo *</Label>
              <Select value={formData.type} onValueChange={(value) => setFormData({ ...formData, type: value })}>
                <SelectTrigger>
                  <SelectValue placeholder="Selecione o tipo" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="welcome">Boas-vindas</SelectItem>
                  <SelectItem value="away">Mensagem de ausência</SelectItem>
                  <SelectItem value="keyword">Palavra-chave</SelectItem>
                  <SelectItem value="schedule">Agendada</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="description">Descrição</Label>
            <Input
              id="description"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="Descrição da automação"
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="trigger_condition">Gatilho *</Label>
            <Input
              id="trigger_condition"
              value={formData.trigger_condition}
              onChange={(e) => setFormData({ ...formData, trigger_condition: e.target.value })}
              placeholder={formData.type === 'keyword' ? 'palavras, separadas, por vírgula' : 'Condição que ativa a automação'}
              required
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="response_message">Mensagem de Resposta *</Label>
            <Textarea
              id="response_message"
              value={formData.response_message}
              onChange={(e) => setFormData({ ...formData, response_message: e.target.value })}
              placeholder="Digite a mensagem que será enviada automaticamente..."
              rows={4}
              required
            />
          </div>
          
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancelar
            </Button>
            <Button type="submit" disabled={isCreating}>
              {isCreating ? 'Criando...' : 'Criar Automação'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};
