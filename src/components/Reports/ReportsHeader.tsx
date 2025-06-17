
import React from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Calendar, Download, Filter, FileText } from 'lucide-react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useConversationsMetrics, useAgentsPerformance } from '@/hooks/useReportsData';
import { toast } from '@/hooks/use-toast';

export const ReportsHeader = () => {
  const { data: metrics } = useConversationsMetrics();
  const { data: agentsData } = useAgentsPerformance();

  const handleExport = () => {
    try {
      // Create CSV content
      const csvContent = generateCSVReport(metrics, agentsData);
      
      // Create and download file
      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
      const link = document.createElement('a');
      const url = URL.createObjectURL(blob);
      link.setAttribute('href', url);
      link.setAttribute('download', `relatorio-${new Date().toISOString().split('T')[0]}.csv`);
      link.style.visibility = 'hidden';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      toast({
        title: "Relatório exportado",
        description: "O arquivo CSV foi baixado com sucesso.",
      });
    } catch (error) {
      toast({
        title: "Erro na exportação",
        description: "Não foi possível exportar o relatório.",
        variant: "destructive",
      });
    }
  };

  const generateCSVReport = (metrics: any, agents: any[]) => {
    const headers = [
      'Métrica',
      'Valor',
      '',
      'Agente',
      'Conversas',
      'Resolvidas',
      'Taxa de Resolução',
      'Tempo Médio',
      'Satisfação',
      'Status'
    ];

    const metricsRows = [
      ['Total de Conversas', metrics?.totalConversations || '0'],
      ['Agentes Ativos', metrics?.activeAgents || '0'],
      ['Taxa de Resolução', `${metrics?.resolutionRate || '0'}%`],
      ['Conversas Recentes', metrics?.recentTotal || '0']
    ];

    const agentsRows = agents?.map(agent => [
      '',
      '',
      '',
      agent.nome,
      agent.conversas.toString(),
      agent.resolvidas.toString(),
      agent.conversas > 0 ? `${Math.round((agent.resolvidas / agent.conversas) * 100)}%` : '0%',
      agent.tempoMedio,
      agent.satisfacao,
      agent.status === 'online' ? 'Online' : 'Ausente'
    ]) || [];

    const allRows = [
      headers,
      ...metricsRows.map(row => [...row, '', '', '', '', '', '', '']),
      ['', '', '', '', '', '', '', '', '', ''],
      ...agentsRows
    ];

    return allRows.map(row => row.map(cell => `"${cell}"`).join(',')).join('\n');
  };

  return (
    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
      <div>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
          Relatórios
        </h1>
        <p className="text-gray-600 dark:text-gray-300 mt-1">
          Análise de desempenho e métricas do sistema
        </p>
      </div>
      
      <div className="flex items-center gap-3">
        <Select defaultValue="30days">
          <SelectTrigger className="w-40">
            <Calendar className="w-4 h-4 mr-2" />
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="7days">Últimos 7 dias</SelectItem>
            <SelectItem value="30days">Últimos 30 dias</SelectItem>
            <SelectItem value="90days">Últimos 90 dias</SelectItem>
            <SelectItem value="custom">Período customizado</SelectItem>
          </SelectContent>
        </Select>
        
        <Button variant="outline" size="sm">
          <Filter className="w-4 h-4 mr-2" />
          Filtros
        </Button>
        
        <Button size="sm" onClick={handleExport}>
          <Download className="w-4 h-4 mr-2" />
          Exportar
        </Button>
      </div>
    </div>
  );
};
