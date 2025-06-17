
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Plus, Edit, Users } from 'lucide-react';
import { toast } from 'sonner';

export const PlansManagement = () => {
  const [isNewPlanOpen, setIsNewPlanOpen] = useState(false);
  const [newPlanData, setNewPlanData] = useState({
    name: '',
    price: '',
    maxAgents: '',
    maxChannels: '',
    maxConversations: '',
    features: ''
  });
  const queryClient = useQueryClient();

  const { data: plans, isLoading } = useQuery({
    queryKey: ['plans-management'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('plans')
        .select(`
          *,
          accounts (count)
        `)
        .order('price', { ascending: true });
      
      if (error) throw error;
      return data;
    }
  });

  const createPlanMutation = useMutation({
    mutationFn: async (planData: typeof newPlanData) => {
      const { data, error } = await supabase
        .from('plans')
        .insert([{
          name: planData.name,
          price: parseFloat(planData.price),
          max_agents: parseInt(planData.maxAgents),
          max_channels: parseInt(planData.maxChannels),
          max_conversations: parseInt(planData.maxConversations),
          features: planData.features.split(',').map(f => f.trim())
        }])
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['plans-management'] });
      setIsNewPlanOpen(false);
      setNewPlanData({
        name: '',
        price: '',
        maxAgents: '',
        maxChannels: '',
        maxConversations: '',
        features: ''
      });
      toast.success('Plano criado com sucesso!');
    },
    onError: (error: any) => {
      toast.error('Erro ao criar plano: ' + error.message);
    }
  });

  const handleCreatePlan = () => {
    if (!newPlanData.name || !newPlanData.price) {
      toast.error('Nome e preço são obrigatórios');
      return;
    }
    createPlanMutation.mutate(newPlanData);
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'active':
        return <Badge className="bg-green-100 text-green-800">Ativo</Badge>;
      case 'inactive':
        return <Badge className="bg-gray-100 text-gray-800">Inativo</Badge>;
      default:
        return <Badge>{status}</Badge>;
    }
  };

  const formatPrice = (price: number) => {
    if (price === 0) return 'Gratuito';
    return `R$ ${price.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`;
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <CardTitle>Gerenciamento de Planos</CardTitle>
          <Dialog open={isNewPlanOpen} onOpenChange={setIsNewPlanOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="w-4 h-4 mr-2" />
                Novo Plano
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-md">
              <DialogHeader>
                <DialogTitle>Criar Novo Plano</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="name">Nome do Plano</Label>
                  <Input 
                    id="name" 
                    value={newPlanData.name}
                    onChange={(e) => setNewPlanData(prev => ({ ...prev, name: e.target.value }))}
                    required 
                  />
                </div>
                <div>
                  <Label htmlFor="price">Preço (R$)</Label>
                  <Input 
                    id="price" 
                    type="number" 
                    step="0.01" 
                    value={newPlanData.price}
                    onChange={(e) => setNewPlanData(prev => ({ ...prev, price: e.target.value }))}
                    required 
                  />
                </div>
                <div>
                  <Label htmlFor="maxAgents">Máximo de Agentes</Label>
                  <Input 
                    id="maxAgents" 
                    type="number" 
                    value={newPlanData.maxAgents}
                    onChange={(e) => setNewPlanData(prev => ({ ...prev, maxAgents: e.target.value }))}
                    required 
                  />
                </div>
                <div>
                  <Label htmlFor="maxChannels">Máximo de Canais</Label>
                  <Input 
                    id="maxChannels" 
                    type="number" 
                    value={newPlanData.maxChannels}
                    onChange={(e) => setNewPlanData(prev => ({ ...prev, maxChannels: e.target.value }))}
                    required 
                  />
                </div>
                <div>
                  <Label htmlFor="maxConversations">Máximo de Conversas</Label>
                  <Input 
                    id="maxConversations" 
                    type="number" 
                    value={newPlanData.maxConversations}
                    onChange={(e) => setNewPlanData(prev => ({ ...prev, maxConversations: e.target.value }))}
                    required 
                  />
                </div>
                <div>
                  <Label htmlFor="features">Recursos (separados por vírgula)</Label>
                  <Input 
                    id="features" 
                    placeholder="WhatsApp, IA, Relatórios" 
                    value={newPlanData.features}
                    onChange={(e) => setNewPlanData(prev => ({ ...prev, features: e.target.value }))}
                  />
                </div>
                <Button 
                  onClick={handleCreatePlan} 
                  className="w-full" 
                  disabled={createPlanMutation.isPending}
                >
                  {createPlanMutation.isPending ? 'Criando...' : 'Criar Plano'}
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </CardHeader>
      <CardContent>
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Plano</TableHead>
                <TableHead>Valor</TableHead>
                <TableHead>Agentes</TableHead>
                <TableHead>Canais</TableHead>
                <TableHead>Conversas</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Empresas</TableHead>
                <TableHead>Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                <TableRow>
                  <TableCell colSpan={8} className="text-center py-8">
                    Carregando planos...
                  </TableCell>
                </TableRow>
              ) : plans?.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={8} className="text-center py-8">
                    Nenhum plano encontrado
                  </TableCell>
                </TableRow>
              ) : (
                plans?.map((plan) => (
                  <TableRow key={plan.id}>
                    <TableCell className="font-medium">{plan.name}</TableCell>
                    <TableCell>{formatPrice(plan.price || 0)}</TableCell>
                    <TableCell>
                      {plan.max_agents === 999 ? 'Ilimitado' : plan.max_agents}
                    </TableCell>
                    <TableCell>
                      {plan.max_channels === 999 ? 'Ilimitado' : plan.max_channels}
                    </TableCell>
                    <TableCell>
                      {plan.max_conversations === 9999 ? 'Ilimitado' : plan.max_conversations}
                    </TableCell>
                    <TableCell>{getStatusBadge(plan.status)}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1">
                        <Users className="w-4 h-4" />
                        {Array.isArray(plan.accounts) ? plan.accounts.length : 0}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex gap-2">
                        <Button variant="outline" size="sm">
                          <Edit className="w-4 h-4" />
                        </Button>
                        <Button variant="outline" size="sm">
                          <Users className="w-4 h-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
};
