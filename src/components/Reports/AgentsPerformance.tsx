
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { useAgentsPerformance } from '@/hooks/useReportsData';

export const AgentsPerformance = () => {
  const { data: agentsData, isLoading } = useAgentsPerformance();

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Performance dos Agentes</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center h-32">
            <p className="text-gray-500">Carregando dados dos agentes...</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Performance dos Agentes</CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Agente</TableHead>
              <TableHead>Conversas</TableHead>
              <TableHead>Resolvidas</TableHead>
              <TableHead>Taxa de Resolução</TableHead>
              <TableHead>Tempo Médio</TableHead>
              <TableHead>Satisfação</TableHead>
              <TableHead>Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {agentsData?.map((agent, index) => (
              <TableRow key={index}>
                <TableCell className="font-medium">{agent.nome}</TableCell>
                <TableCell>{agent.conversas}</TableCell>
                <TableCell>{agent.resolvidas}</TableCell>
                <TableCell>
                  {agent.conversas > 0 
                    ? Math.round((agent.resolvidas / agent.conversas) * 100)
                    : 0}%
                </TableCell>
                <TableCell>{agent.tempoMedio}</TableCell>
                <TableCell>
                  <div className="flex items-center">
                    <span className="mr-1">⭐</span>
                    {agent.satisfacao}
                  </div>
                </TableCell>
                <TableCell>
                  <Badge 
                    variant={agent.status === 'online' ? 'default' : 'secondary'}
                    className={agent.status === 'online' ? 'bg-green-500' : 'bg-gray-500'}
                  >
                    {agent.status === 'online' ? 'Online' : 'Ausente'}
                  </Badge>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
};
