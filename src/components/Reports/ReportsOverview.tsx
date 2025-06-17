
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { MessageSquare, Users, Clock, TrendingUp } from 'lucide-react';
import { useConversationsMetrics } from '@/hooks/useReportsData';

export const ReportsOverview = () => {
  const { data: metrics, isLoading } = useConversationsMetrics();

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[1, 2, 3, 4].map((i) => (
          <Card key={i}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-600 dark:text-gray-300">
                Carregando...
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-gray-900 dark:text-white">
                --
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  const metricsData = [
    {
      title: 'Total de Conversas',
      value: metrics?.totalConversations?.toString() || '0',
      change: `+${metrics?.recentTotal || 0}`,
      changeType: 'positive' as const,
      icon: MessageSquare,
    },
    {
      title: 'Agentes Ativos',
      value: metrics?.activeAgents?.toString() || '0',
      change: '+2',
      changeType: 'positive' as const,
      icon: Users,
    },
    {
      title: 'Tempo Médio de Resposta',
      value: '2.5 min',
      change: '-15%',
      changeType: 'positive' as const,
      icon: Clock,
    },
    {
      title: 'Taxa de Resolução',
      value: `${metrics?.resolutionRate || '0'}%`,
      change: '+2.1%',
      changeType: 'positive' as const,
      icon: TrendingUp,
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {metricsData.map((metric, index) => (
        <Card key={index}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-600 dark:text-gray-300">
              {metric.title}
            </CardTitle>
            <metric.icon className="h-4 w-4 text-gray-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-900 dark:text-white">
              {metric.value}
            </div>
            <p className={`text-xs mt-1 ${
              metric.changeType === 'positive' 
                ? 'text-green-600' 
                : 'text-red-600'
            }`}>
              {metric.change} em relação ao período anterior
            </p>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};
