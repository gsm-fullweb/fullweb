
import React from 'react';
import { 
  BarChart, 
  Bar, 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell
} from 'recharts';
import { 
  MessageSquare, 
  Users, 
  Clock, 
  TrendingUp,
  Phone,
  CheckCircle,
  AlertTriangle,
  UserCheck
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface AnalyticsProps {
  userRole: 'super_admin' | 'admin' | 'agent';
}

const dailyConversations = [
  { day: 'Seg', conversations: 45, resolved: 38 },
  { day: 'Ter', conversations: 52, resolved: 44 },
  { day: 'Qua', conversations: 38, resolved: 35 },
  { day: 'Qui', conversations: 61, resolved: 52 },
  { day: 'Sex', conversations: 55, resolved: 48 },
  { day: 'Sáb', conversations: 28, resolved: 25 },
  { day: 'Dom', conversations: 22, resolved: 20 },
];

const responseTimeData = [
  { hour: '08:00', avgTime: 12 },
  { hour: '10:00', avgTime: 8 },
  { hour: '12:00', avgTime: 15 },
  { hour: '14:00', avgTime: 10 },
  { hour: '16:00', avgTime: 18 },
  { hour: '18:00', avgTime: 25 },
];

const statusDistribution = [
  { name: 'Resolvido', value: 65, color: '#10B981' },
  { name: 'Em Andamento', value: 20, color: '#3B82F6' },
  { name: 'Aguardando', value: 10, color: '#F59E0B' },
  { name: 'Spam', value: 5, color: '#6B7280' },
];

export const Analytics: React.FC<AnalyticsProps> = ({ userRole }) => {
  const getStatsForRole = () => {
    switch (userRole) {
      case 'super_admin':
        return [
          { 
            title: 'Total de Organizações', 
            value: '24', 
            change: '+12%', 
            icon: Users,
            color: 'text-blue-600'
          },
          { 
            title: 'Receita Mensal', 
            value: 'R$ 45.2K', 
            change: '+8.3%', 
            icon: TrendingUp,
            color: 'text-green-600'
          },
          { 
            title: 'Usuários Ativos', 
            value: '1.2K', 
            change: '+5.1%', 
            icon: UserCheck,
            color: 'text-purple-600'
          },
          { 
            title: 'Mensagens Processadas', 
            value: '89.5K', 
            change: '+15.2%', 
            icon: MessageSquare,
            color: 'text-whatsapp-primary'
          },
        ];
        
      case 'admin':
        return [
          { 
            title: 'Conversas Hoje', 
            value: '156', 
            change: '+23%', 
            icon: MessageSquare,
            color: 'text-whatsapp-primary'
          },
          { 
            title: 'Tempo Médio Resposta', 
            value: '2m 34s', 
            change: '-12%', 
            icon: Clock,
            color: 'text-blue-600'
          },
          { 
            title: 'Taxa de Resolução', 
            value: '94.2%', 
            change: '+3.1%', 
            icon: CheckCircle,
            color: 'text-green-600'
          },
          { 
            title: 'Agentes Online', 
            value: '12/15', 
            change: '80%', 
            icon: Users,
            color: 'text-purple-600'
          },
        ];
        
      case 'agent':
        return [
          { 
            title: 'Minhas Conversas', 
            value: '23', 
            change: '+5', 
            icon: MessageSquare,
            color: 'text-whatsapp-primary'
          },
          { 
            title: 'Tempo Médio', 
            value: '1m 45s', 
            change: '-8%', 
            icon: Clock,
            color: 'text-blue-600'
          },
          { 
            title: 'Resolvidas Hoje', 
            value: '18', 
            change: '+12%', 
            icon: CheckCircle,
            color: 'text-green-600'
          },
          { 
            title: 'Avaliação', 
            value: '4.8/5', 
            change: '+0.2', 
            icon: TrendingUp,
            color: 'text-yellow-600'
          },
        ];
    }
  };

  const stats = getStatsForRole() || [];

  return (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <Card key={index} className="relative overflow-hidden">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                    {stat.title}
                  </p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">
                    {stat.value}
                  </p>
                  <p className={`text-sm font-medium ${
                    stat.change.startsWith('+') ? 'text-green-600' : 
                    stat.change.startsWith('-') ? 'text-red-600' : 
                    'text-gray-600'
                  }`}>
                    {stat.change} vs. período anterior
                  </p>
                </div>
                <div className={`p-3 rounded-lg bg-gray-50 dark:bg-gray-800 ${stat.color}`}>
                  <stat.icon className="w-6 h-6" />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Conversas por Dia */}
        <Card>
          <CardHeader>
            <CardTitle>Conversas por Dia</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={dailyConversations}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="day" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="conversations" fill="#25D366" name="Total" />
                <Bar dataKey="resolved" fill="#128C7E" name="Resolvidas" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Tempo de Resposta */}
        <Card>
          <CardHeader>
            <CardTitle>Tempo Médio de Resposta</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={responseTimeData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="hour" />
                <YAxis />
                <Tooltip formatter={(value) => [`${value} min`, 'Tempo médio']} />
                <Line 
                  type="monotone" 
                  dataKey="avgTime" 
                  stroke="#3B82F6" 
                  strokeWidth={3}
                  dot={{ fill: '#3B82F6' }}
                />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Status Distribution */}
      <Card>
        <CardHeader>
          <CardTitle>Distribuição de Status</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center">
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={statusDistribution}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={120}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {statusDistribution.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip formatter={(value) => [`${value}%`, 'Porcentagem']} />
              </PieChart>
            </ResponsiveContainer>
          </div>
          
          <div className="flex flex-wrap justify-center gap-4 mt-4">
            {statusDistribution.map((entry, index) => (
              <div key={index} className="flex items-center space-x-2">
                <div 
                  className="w-3 h-3 rounded-full"
                  style={{ backgroundColor: entry.color }}
                />
                <span className="text-sm text-gray-600 dark:text-gray-400">
                  {entry.name}: {entry.value}%
                </span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
