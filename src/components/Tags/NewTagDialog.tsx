
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface NewTagDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const colorOptions = [
  '#ef4444', // red
  '#f97316', // orange
  '#f59e0b', // yellow
  '#10b981', // green
  '#3b82f6', // blue
  '#8b5cf6', // purple
  '#ec4899', // pink
  '#6b7280', // gray
];

export const NewTagDialog: React.FC<NewTagDialogProps> = ({
  open,
  onOpenChange,
}) => {
  const [name, setName] = useState('');
  const [selectedColor, setSelectedColor] = useState(colorOptions[0]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    setIsSubmitting(true);

    try {
      const { error } = await supabase
        .from('tags')
        .insert([
          {
            name: name.trim(),
            color: selectedColor,
          },
        ]);

      if (error) {
        console.error('Error creating tag:', error);
        toast({
          title: "Erro",
          description: "Erro ao criar tag. Tente novamente.",
          variant: "destructive",
        });
        return;
      }

      toast({
        title: "Sucesso",
        description: "Tag criada com sucesso!",
      });

      setName('');
      setSelectedColor(colorOptions[0]);
      onOpenChange(false);
      window.location.reload(); // Refresh the page to show new tag
    } catch (error) {
      console.error('Error creating tag:', error);
      toast({
        title: "Erro",
        description: "Erro ao criar tag. Tente novamente.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Nova Tag</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="name">Nome da Tag</Label>
            <Input
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Digite o nome da tag"
              required
            />
          </div>
          
          <div>
            <Label>Cor da Tag</Label>
            <div className="flex gap-2 mt-2">
              {colorOptions.map((color) => (
                <button
                  key={color}
                  type="button"
                  className={`w-8 h-8 rounded-full border-2 ${
                    selectedColor === color
                      ? 'border-gray-900 dark:border-white'
                      : 'border-gray-300'
                  }`}
                  style={{ backgroundColor: color }}
                  onClick={() => setSelectedColor(color)}
                />
              ))}
            </div>
          </div>

          <div className="flex justify-end gap-3">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
            >
              Cancelar
            </Button>
            <Button
              type="submit"
              disabled={isSubmitting || !name.trim()}
              className="bg-whatsapp-primary hover:bg-whatsapp-primary/90"
            >
              {isSubmitting ? 'Criando...' : 'Criar Tag'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};
