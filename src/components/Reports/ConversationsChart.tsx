
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart';
import { LineChart, Line, XAxis, YAxis, ResponsiveContainer } from 'recharts';
import { useConversationsChart } from '@/hooks/useReportsData';

const chartConfig = {
  conversas: {
    label: "Conversas",
    color: "hsl(var(--chart-1))",
  },
  resolvidas: {
    label: "Resolvidas",
    color: "hsl(var(--chart-2))",
  },
};

export const ConversationsChart = () => {
  const { data: chartData, isLoading } = useConversationsChart();

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Conversas por Dia</CardTitle>
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
        <CardTitle>Conversas por Dia</CardTitle>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig} className="h-[300px]">
          <LineChart data={chartData}>
            <XAxis 
              dataKey="date" 
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
            <Line
              type="monotone"
              dataKey="conversas"
              stroke="var(--color-conversas)"
              strokeWidth={2}
              dot={{ fill: "var(--color-conversas)" }}
            />
            <Line
              type="monotone"
              dataKey="resolvidas"
              stroke="var(--color-resolvidas)"
              strokeWidth={2}
              dot={{ fill: "var(--color-resolvidas)" }}
            />
          </LineChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
};
