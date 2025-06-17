
import React from 'react';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useForm } from 'react-hook-form';

interface NewEmailDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

interface EmailFormData {
  name: string;
  subject: string;
  type: string;
  content: string;
  recipients: string;
}

export const NewEmailDialog = ({ open, onOpenChange }: NewEmailDialogProps) => {
  const [isLoading, setIsLoading] = useState(false);
  
  const { register, handleSubmit, reset, setValue, formState: { errors } } = useForm<EmailFormData>();

  const onSubmit = async (data: EmailFormData) => {
    setIsLoading(true);
    try {
      console.log('Creating email template:', data);
      // TODO: Integrate with backend when ready
      await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate API call
      reset();
      onOpenChange(false);
    } catch (error) {
      console.error('Error creating email template:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Novo Template de Email</DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="name">Nome do Template</Label>
              <Input
                id="name"
                {...register('name', { required: 'Nome é obrigatório' })}
                placeholder="Ex: Boas-vindas"
              />
              {errors.name && (
                <p className="text-sm text-red-600">{errors.name.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="type">Tipo</Label>
              <Select onValueChange={(value) => setValue('type', value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Selecione o tipo" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="welcome">Boas-vindas</SelectItem>
                  <SelectItem value="newsletter">Newsletter</SelectItem>
                  <SelectItem value="promotional">Promocional</SelectItem>
                  <SelectItem value="cart_recovery">Recuperação de Carrinho</SelectItem>
                  <SelectItem value="transactional">Transacional</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="subject">Assunto</Label>
            <Input
              id="subject"
              {...register('subject', { required: 'Assunto é obrigatório' })}
              placeholder="Digite o assunto do email"
            />
            {errors.subject && (
              <p className="text-sm text-red-600">{errors.subject.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="recipients">Destinatários</Label>
            <Input
              id="recipients"
              {...register('recipients')}
              placeholder="Ex: todos, clientes-ativos, newsletter"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="content">Conteúdo do Email</Label>
            <Textarea
              id="content"
              {...register('content', { required: 'Conteúdo é obrigatório' })}
              placeholder="Digite o conteúdo do email (HTML permitido)"
              rows={8}
            />
            {errors.content && (
              <p className="text-sm text-red-600">{errors.content.message}</p>
            )}
          </div>

          <div className="flex justify-end space-x-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
            >
              Cancelar
            </Button>
            <Button 
              type="submit" 
              disabled={isLoading}
              className="bg-whatsapp-primary hover:bg-whatsapp-primary/90"
            >
              {isLoading ? 'Criando...' : 'Criar Template'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};
