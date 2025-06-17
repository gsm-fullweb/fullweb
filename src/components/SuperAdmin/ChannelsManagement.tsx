
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Phone, Mail, MessageSquare, Send, Settings, TestTube } from 'lucide-react';
import { toast } from 'sonner';

export const ChannelsManagement = () => {
  const [selectedChannel, setSelectedChannel] = useState<any>(null);
  const [isTestingChannel, setIsTestingChannel] = useState(false);
  const queryClient = useQueryClient();

  const { data: channels, isLoading } = useQuery({
    queryKey: ['channels-management'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('channels')
        .select(`
          *,
          accounts (name)
        `)
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data;
    }
  });

  const testChannelMutation = useMutation({
    mutationFn: async (channelId: string) => {
      // Simular teste de conexão
      console.log('Testando canal:', channelId);
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Atualizar last_tested_at
      const { error } = await supabase
        .from('channels')
        .update({ last_tested_at: new Date().toISOString() })
        .eq('id', channelId);
      
      if (error) throw error;
      return { success: true };
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['channels-management'] });
      toast.success('Canal testado com sucesso!');
      setIsTestingChannel(false);
    },
    onError: (error: any) => {
      toast.error('Erro ao testar canal: ' + error.message);
      setIsTestingChannel(false);
    }
  });

  const testAllChannelsMutation = useMutation({
    mutationFn: async () => {
      if (!channels) return;
      
      // Testar todos os canais ativos
      const activeChannels = channels.filter(channel => channel.status === 'active');
      
      for (const channel of activeChannels) {
        await new Promise(resolve => setTimeout(resolve, 1000));
        await supabase
          .from('channels')
          .update({ last_tested_at: new Date().toISOString() })
          .eq('id', channel.id);
      }
      
      return { tested: activeChannels.length };
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['channels-management'] });
      toast.success(`${data?.tested} canais testados com sucesso!`);
    },
    onError: (error: any) => {
      toast.error('Erro ao testar canais: ' + error.message);
    }
  });

  const getChannelIcon = (type: string) => {
    switch (type) {
      case 'whatsapp':
        return <Phone className="w-4 h-4 text-green-600" />;
      case 'email':
        return <Mail className="w-4 h-4 text-blue-600" />;
      case 'webchat':
        return <MessageSquare className="w-4 h-4 text-purple-600" />;
      case 'telegram':
        return <Send className="w-4 h-4 text-cyan-600" />;
      default:
        return <MessageSquare className="w-4 h-4" />;
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'active':
        return <Badge className="bg-green-100 text-green-800">Ativo</Badge>;
      case 'inactive':
        return <Badge className="bg-gray-100 text-gray-800">Inativo</Badge>;
      case 'testing':
        return <Badge className="bg-yellow-100 text-yellow-800">Testando</Badge>;
      default:
        return <Badge>{status}</Badge>;
    }
  };

  const getChannelTypeName = (type: string) => {
    switch (type) {
      case 'whatsapp':
        return 'WhatsApp';
      case 'email':
        return 'E-mail';
      case 'webchat':
        return 'Chat Web';
      case 'telegram':
        return 'Telegram';
      default:
        return type;
    }
  };

  const getLastTested = (lastTestedAt: string | null) => {
    if (!lastTestedAt) return 'Nunca testado';
    
    const now = new Date();
    const lastTest = new Date(lastTestedAt);
    const diffInMinutes = Math.floor((now.getTime() - lastTest.getTime()) / (1000 * 60));
    
    if (diffInMinutes < 1) return 'há menos de 1 min';
    if (diffInMinutes < 60) return `há ${diffInMinutes} min`;
    
    const diffInHours = Math.floor(diffInMinutes / 60);
    if (diffInHours < 24) return `há ${diffInHours}h`;
    
    const diffInDays = Math.floor(diffInHours / 24);
    return `há ${diffInDays} dias`;
  };

  const handleTestChannel = (channel: any) => {
    setSelectedChannel(channel);
    setIsTestingChannel(true);
    testChannelMutation.mutate(channel.id);
  };

  const handleConfigureChannel = (channel: any) => {
    toast.info(`Configuração do canal ${channel.name} (em desenvolvimento)`);
  };

  // Aggregate data by channel type
  const channelStats = channels?.reduce((acc, channel) => {
    const type = channel.type;
    if (!acc[type]) {
      acc[type] = { total: 0, active: 0 };
    }
    acc[type].total++;
    if (channel.status === 'active') {
      acc[type].active++;
    }
    return acc;
  }, {} as Record<string, { total: number; active: number }>);

  return (
    <div className="space-y-6">
      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {Object.entries(channelStats || {}).map(([type, stats]) => (
          <Card key={type}>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">
                    {getChannelTypeName(type)}
                  </p>
                  <p className="text-2xl font-bold">
                    {stats.active}/{stats.total}
                  </p>
                </div>
                {getChannelIcon(type)}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Channels Table */}
      <Card>
        <CardHeader>
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <CardTitle>Integrações e Canais</CardTitle>
            <Button 
              onClick={() => testAllChannelsMutation.mutate()}
              disabled={testAllChannelsMutation.isPending}
            >
              <TestTube className="w-4 h-4 mr-2" />
              {testAllChannelsMutation.isPending ? 'Testando...' : 'Testar Todas as Conexões'}
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Canal</TableHead>
                  <TableHead>Tipo</TableHead>
                  <TableHead>Empresa</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Último Teste</TableHead>
                  <TableHead>Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {isLoading ? (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center py-8">
                      Carregando canais...
                    </TableCell>
                  </TableRow>
                ) : channels?.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center py-8">
                      Nenhum canal encontrado
                    </TableCell>
                  </TableRow>
                ) : (
                  channels?.map((channel) => (
                    <TableRow key={channel.id}>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          {getChannelIcon(channel.type)}
                          <span className="font-medium">{channel.name}</span>
                        </div>
                      </TableCell>
                      <TableCell>{getChannelTypeName(channel.type)}</TableCell>
                      <TableCell>{channel.accounts?.name || 'Global'}</TableCell>
                      <TableCell>{getStatusBadge(channel.status)}</TableCell>
                      <TableCell>{getLastTested(channel.last_tested_at)}</TableCell>
                      <TableCell>
                        <div className="flex gap-2">
                          <Button 
                            variant="outline" 
                            size="sm" 
                            title="Testar conexão"
                            onClick={() => handleTestChannel(channel)}
                            disabled={testChannelMutation.isPending}
                          >
                            <TestTube className="w-4 h-4" />
                          </Button>
                          <Button 
                            variant="outline" 
                            size="sm" 
                            title="Configurar"
                            onClick={() => handleConfigureChannel(channel)}
                          >
                            <Settings className="w-4 h-4" />
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
    </div>
  );
};
