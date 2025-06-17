
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Building, Users, MessageSquare, CheckCircle, Zap } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

export const SuperAdminOverview = () => {
  const { data: stats, isLoading } = useQuery({
    queryKey: ['super-admin-stats'],
    queryFn: async () => {
      const [
        { count: totalAccounts },
        { count: activeUsers },
        { count: activeConversations },
        { count: resolvedToday },
        { count: activeChannels }
      ] = await Promise.all([
        supabase.from('accounts').select('*', { count: 'exact', head: true }),
        supabase.from('profiles').select('*', { count: 'exact', head: true }),
        supabase.from('conversations').select('*', { count: 'exact', head: true }).eq('status', 'open'),
        supabase.from('conversations').select('*', { count: 'exact', head: true })
          .eq('status', 'closed')
          .gte('updated_at', new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString()),
        supabase.from('channels').select('*', { count: 'exact', head: true }).eq('status', 'active')
      ]);

      return {
        totalAccounts: totalAccounts || 0,
        activeUsers: activeUsers || 0,
        activeConversations: activeConversations || 0,
        resolvedToday: resolvedToday || 0,
        activeChannels: activeChannels || 0
      };
    }
  });

  const cards = [
    {
      title: 'Total de Empresas',
      value: stats?.totalAccounts || 0,
      icon: Building,
      color: 'text-blue-600'
    },
    {
      title: 'Usuários Ativos',
      value: stats?.activeUsers || 0,
      icon: Users,
      color: 'text-green-600'
    },
    {
      title: 'Conversas Abertas',
      value: stats?.activeConversations || 0,
      icon: MessageSquare,
      color: 'text-orange-600'
    },
    {
      title: 'Resolvidas Hoje',
      value: stats?.resolvedToday || 0,
      icon: CheckCircle,
      color: 'text-purple-600'
    },
    {
      title: 'Canais Ativos',
      value: stats?.activeChannels || 0,
      icon: Zap,
      color: 'text-indigo-600'
    }
  ];

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
        {[...Array(5)].map((_, i) => (
          <Card key={i} className="animate-pulse">
            <CardContent className="p-6">
              <div className="h-16 bg-gray-200 rounded"></div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
        {cards.map((card, index) => (
          <Card key={index} className="hover:shadow-lg transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">
                {card.title}
              </CardTitle>
              <card.icon className={`h-5 w-5 ${card.color}`} />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{card.value}</div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Crescimento de Empresas</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-64 flex items-center justify-center text-gray-500">
              Gráfico de crescimento (implementar com Recharts)
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Volume de Mensagens</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-64 flex items-center justify-center text-gray-500">
              Gráfico de mensagens por dia (implementar com Recharts)
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
