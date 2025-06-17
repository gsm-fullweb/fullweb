
import React, { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useForm } from 'react-hook-form';
import { KanbanColumnType } from '@/types/conversation';

interface RenameColumnDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  column: KanbanColumnType;
  onRename: (columnId: string, newTitle: string) => void;
}

interface FormData {
  title: string;
}

export const RenameColumnDialog: React.FC<RenameColumnDialogProps> = ({
  open,
  onOpenChange,
  column,
  onRename,
}) => {
  const form = useForm<FormData>({
    defaultValues: {
      title: column.title,
    },
  });

  const handleSubmit = (data: FormData) => {
    if (data.title.trim() && data.title !== column.title) {
      onRename(column.id, data.title.trim());
      onOpenChange(false);
    }
  };

  const handleCancel = () => {
    form.reset({ title: column.title });
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Renomear Coluna</DialogTitle>
          <DialogDescription>
            Digite o novo nome para a coluna "{column.title}".
          </DialogDescription>
        </DialogHeader>
        
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="title"
              rules={{
                required: 'Nome da coluna é obrigatório',
                minLength: {
                  value: 1,
                  message: 'Nome deve ter pelo menos 1 caractere'
                }
              }}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nome da Coluna</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Digite o nome da coluna"
                      {...field}
                      autoFocus
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={handleCancel}
              >
                Cancelar
              </Button>
              <Button
                type="submit"
                disabled={!form.formState.isValid || form.watch('title') === column.title}
              >
                Renomear
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};
