
import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface Tag {
  id: string;
  name: string;
  color: string | null;
  created_at: string;
}

interface EditTagDialogProps {
  tag: Tag | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess: () => void;
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

export const EditTagDialog: React.FC<EditTagDialogProps> = ({
  tag,
  open,
  onOpenChange,
  onSuccess,
}) => {
  const [name, setName] = useState('');
  const [selectedColor, setSelectedColor] = useState(colorOptions[0]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    if (tag) {
      setName(tag.name);
      setSelectedColor(tag.color || colorOptions[0]);
    }
  }, [tag]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !tag) return;

    setIsSubmitting(true);

    try {
      const { error } = await supabase
        .from('tags')
        .update({
          name: name.trim(),
          color: selectedColor,
        })
        .eq('id', tag.id);

      if (error) {
        console.error('Error updating tag:', error);
        toast({
          title: "Erro",
          description: "Erro ao atualizar tag. Tente novamente.",
          variant: "destructive",
        });
        return;
      }

      toast({
        title: "Sucesso",
        description: "Tag atualizada com sucesso!",
      });

      onSuccess();
    } catch (error) {
      console.error('Error updating tag:', error);
      toast({
        title: "Erro",
        description: "Erro ao atualizar tag. Tente novamente.",
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
          <DialogTitle>Editar Tag</DialogTitle>
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
              {isSubmitting ? 'Salvando...' : 'Salvar'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};
