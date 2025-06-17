
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Search, Shield, UserX, Key } from 'lucide-react';
import { toast } from 'sonner';

export const UsersManagement = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState('all');
  const [selectedUser, setSelectedUser] = useState<any>(null);
  const [isResetPasswordOpen, setIsResetPasswordOpen] = useState(false);
  const [isChangeRoleOpen, setIsChangeRoleOpen] = useState(false);
  const [newRole, setNewRole] = useState('');
  const queryClient = useQueryClient();

  const { data: users, isLoading } = useQuery({
    queryKey: ['users-management'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('profiles')
        .select(`
          *,
          agents (
            account_id,
            accounts (name)
          )
        `)
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data;
    }
  });

  const resetPasswordMutation = useMutation({
    mutationFn: async (email: string) => {
      const { error } = await supabase.auth.admin.generateLink({
        type: 'recovery',
        email: email,
      });
      if (error) throw error;
    },
    onSuccess: () => {
      toast.success('Link de recuperação de senha enviado!');
      setIsResetPasswordOpen(false);
    },
    onError: (error: any) => {
      toast.error('Erro ao enviar link de recuperação: ' + error.message);
    }
  });

  const changeRoleMutation = useMutation({
    mutationFn: async ({ userId, role }: { userId: string; role: string }) => {
      const { error } = await supabase
        .from('profiles')
        .update({ role })
        .eq('id', userId);
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users-management'] });
      toast.success('Papel do usuário atualizado com sucesso!');
      setIsChangeRoleOpen(false);
    },
    onError: (error: any) => {
      toast.error('Erro ao atualizar papel: ' + error.message);
    }
  });

  const suspendUserMutation = useMutation({
    mutationFn: async (userId: string) => {
      // Aqui você implementaria a lógica para suspender o usuário
      // Por enquanto, vamos apenas simular
      console.log('Suspendendo usuário:', userId);
      await new Promise(resolve => setTimeout(resolve, 1000));
    },
    onSuccess: () => {
      toast.success('Usuário suspenso com sucesso!');
    },
    onError: (error: any) => {
      toast.error('Erro ao suspender usuário: ' + error.message);
    }
  });

  const filteredUsers = users?.filter(user => {
    const matchesSearch = user.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         user.id.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRole = roleFilter === 'all' || user.role === roleFilter;
    return matchesSearch && matchesRole;
  });

  const getRoleBadge = (role: string) => {
    switch (role) {
      case 'admin':
        return <Badge className="bg-purple-100 text-purple-800">Admin</Badge>;
      case 'agent':
        return <Badge className="bg-blue-100 text-blue-800">Agente</Badge>;
      default:
        return <Badge>{role}</Badge>;
    }
  };

  const getLastAccess = (updatedAt: string) => {
    const now = new Date();
    const lastAccess = new Date(updatedAt);
    const diffInHours = Math.floor((now.getTime() - lastAccess.getTime()) / (1000 * 60 * 60));
    
    if (diffInHours < 1) return 'há menos de 1 hora';
    if (diffInHours < 24) return `há ${diffInHours} horas`;
    
    const diffInDays = Math.floor(diffInHours / 24);
    return `há ${diffInDays} dias`;
  };

  const getUserCompany = (user: any) => {
    if (user.agents && Array.isArray(user.agents) && user.agents.length > 0) {
      const firstAgent = user.agents[0];
      if (firstAgent && typeof firstAgent === 'object' && firstAgent.accounts) {
        return firstAgent.accounts.name;
      }
    }
    return 'Sem empresa';
  };

  const handleResetPassword = (user: any) => {
    setSelectedUser(user);
    setIsResetPasswordOpen(true);
  };

  const handleChangeRole = (user: any) => {
    setSelectedUser(user);
    setNewRole(user.role);
    setIsChangeRoleOpen(true);
  };

  const handleSuspendUser = (user: any) => {
    if (confirm(`Tem certeza que deseja suspender o usuário ${user.name}?`)) {
      suspendUserMutation.mutate(user.id);
    }
  };

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle>Gestão de Usuários</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input
                placeholder="Buscar usuários..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={roleFilter} onValueChange={setRoleFilter}>
              <SelectTrigger className="w-full sm:w-48">
                <SelectValue placeholder="Filtrar por papel" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos os papéis</SelectItem>
                <SelectItem value="admin">Administradores</SelectItem>
                <SelectItem value="agent">Agentes</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Nome</TableHead>
                  <TableHead>ID do Usuário</TableHead>
                  <TableHead>Empresa</TableHead>
                  <TableHead>Papel</TableHead>
                  <TableHead>Último Acesso</TableHead>
                  <TableHead>Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {isLoading ? (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center py-8">
                      Carregando usuários...
                    </TableCell>
                  </TableRow>
                ) : filteredUsers?.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center py-8">
                      Nenhum usuário encontrado
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredUsers?.map((user) => (
                    <TableRow key={user.id}>
                      <TableCell className="font-medium">
                        {user.name || 'Nome não informado'}
                      </TableCell>
                      <TableCell className="font-mono text-sm">
                        {user.id.substring(0, 8)}...
                      </TableCell>
                      <TableCell>
                        {getUserCompany(user)}
                      </TableCell>
                      <TableCell>{getRoleBadge(user.role)}</TableCell>
                      <TableCell>{getLastAccess(user.updated_at)}</TableCell>
                      <TableCell>
                        <div className="flex gap-2">
                          <Button 
                            variant="outline" 
                            size="sm" 
                            title="Resetar senha"
                            onClick={() => handleResetPassword(user)}
                          >
                            <Key className="w-4 h-4" />
                          </Button>
                          <Button 
                            variant="outline" 
                            size="sm" 
                            title="Alterar papel"
                            onClick={() => handleChangeRole(user)}
                          >
                            <Shield className="w-4 h-4" />
                          </Button>
                          <Button 
                            variant="outline" 
                            size="sm" 
                            title="Suspender conta"
                            onClick={() => handleSuspendUser(user)}
                          >
                            <UserX className="w-4 h-4" />
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

      {/* Reset Password Dialog */}
      <Dialog open={isResetPasswordOpen} onOpenChange={setIsResetPasswordOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Resetar Senha</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <p>Tem certeza que deseja enviar um link de recuperação de senha para:</p>
            <p className="font-semibold">{selectedUser?.name} ({selectedUser?.id})</p>
            <div className="flex gap-2 justify-end">
              <Button variant="outline" onClick={() => setIsResetPasswordOpen(false)}>
                Cancelar
              </Button>
              <Button 
                onClick={() => resetPasswordMutation.mutate(selectedUser?.id)}
                disabled={resetPasswordMutation.isPending}
              >
                {resetPasswordMutation.isPending ? 'Enviando...' : 'Enviar Link'}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Change Role Dialog */}
      <Dialog open={isChangeRoleOpen} onOpenChange={setIsChangeRoleOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Alterar Papel do Usuário</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label>Usuário: {selectedUser?.name}</Label>
            </div>
            <div>
              <Label htmlFor="role">Novo Papel</Label>
              <Select value={newRole} onValueChange={setNewRole}>
                <SelectTrigger>
                  <SelectValue placeholder="Selecionar papel" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="admin">Administrador</SelectItem>
                  <SelectItem value="agent">Agente</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="flex gap-2 justify-end">
              <Button variant="outline" onClick={() => setIsChangeRoleOpen(false)}>
                Cancelar
              </Button>
              <Button 
                onClick={() => changeRoleMutation.mutate({ userId: selectedUser?.id, role: newRole })}
                disabled={changeRoleMutation.isPending}
              >
                {changeRoleMutation.isPending ? 'Atualizando...' : 'Atualizar'}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};
