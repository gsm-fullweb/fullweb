
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart';
import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer } from 'recharts';
import { useResponseTimeChart } from '@/hooks/useReportsData';

const chartConfig = {
  tempoMedio: {
    label: "Tempo Médio (min)",
    color: "hsl(var(--chart-3))",
  },
};

export const ResponseTimeChart = () => {
  const { data: chartData, isLoading } = useResponseTimeChart();

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Tempo de Resposta por Agente</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-[300px] flex items-center justify-center">
            <p className="text-gray-500">Carregando dados...</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Tempo de Resposta por Agente</CardTitle>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig} className="h-[300px]">
          <BarChart data={chartData}>
            <XAxis 
              dataKey="agente" 
              tickLine={false}
              axisLine={false}
              className="text-xs"
            />
            <YAxis 
              tickLine={false}
              axisLine={false}
              className="text-xs"
            />
            <ChartTooltip content={<ChartTooltipContent />} />
            <Bar
              dataKey="tempoMedio"
              fill="var(--color-tempoMedio)"
              radius={[4, 4, 0, 0]}
            />
          </BarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
};
