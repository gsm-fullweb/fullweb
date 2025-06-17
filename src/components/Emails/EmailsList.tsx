
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { MoreVertical, Edit, Trash2, Send, Eye } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

// Mock data for email templates
const mockEmailTemplates = [
  {
    id: '1',
    name: 'Boas-vindas',
    subject: 'Bem-vindo ao nosso sistema!',
    type: 'welcome',
    status: 'active',
    lastSent: '2024-01-15',
    sentCount: 145,
    openRate: '68%'
  },
  {
    id: '2',
    name: 'Newsletter Mensal',
    subject: 'Novidades do mês - Janeiro 2024',
    type: 'newsletter',
    status: 'draft',
    lastSent: null,
    sentCount: 0,
    openRate: '-'
  },
  {
    id: '3',
    name: 'Recuperação de Carrinho',
    subject: 'Você esqueceu algo no seu carrinho',
    type: 'cart_recovery',
    status: 'active',
    lastSent: '2024-01-10',
    sentCount: 89,
    openRate: '45%'
  }
];

const getStatusBadge = (status: string) => {
  switch (status) {
    case 'active':
      return <Badge className="bg-green-100 text-green-800">Ativo</Badge>;
    case 'draft':
      return <Badge className="bg-gray-100 text-gray-800">Rascunho</Badge>;
    case 'paused':
      return <Badge className="bg-yellow-100 text-yellow-800">Pausado</Badge>;
    default:
      return <Badge>{status}</Badge>;
  }
};

const getTypeBadge = (type: string) => {
  const typeLabels = {
    welcome: 'Boas-vindas',
    newsletter: 'Newsletter',
    cart_recovery: 'Recuperação',
    promotional: 'Promocional'
  };
  
  return (
    <Badge variant="outline">
      {typeLabels[type as keyof typeof typeLabels] || type}
    </Badge>
  );
};

export const EmailsList = () => {
  return (
    <div className="grid gap-4">
      {mockEmailTemplates.map((template) => (
        <Card key={template.id} className="hover:shadow-md transition-shadow">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <CardTitle className="text-lg">{template.name}</CardTitle>
                {getTypeBadge(template.type)}
                {getStatusBadge(template.status)}
              </div>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="sm">
                    <MoreVertical className="w-4 h-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem>
                    <Eye className="w-4 h-4 mr-2" />
                    Visualizar
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <Edit className="w-4 h-4 mr-2" />
                    Editar
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <Send className="w-4 h-4 mr-2" />
                    Enviar Teste
                  </DropdownMenuItem>
                  <DropdownMenuItem className="text-red-600">
                    <Trash2 className="w-4 h-4 mr-2" />
                    Excluir
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Assunto:</p>
                <p className="font-medium">{template.subject}</p>
              </div>
              
              <div className="grid grid-cols-3 gap-4 text-sm">
                <div>
                  <p className="text-gray-600 dark:text-gray-400">Último Envio</p>
                  <p className="font-medium">
                    {template.lastSent ? new Date(template.lastSent).toLocaleDateString('pt-BR') : 'Nunca'}
                  </p>
                </div>
                <div>
                  <p className="text-gray-600 dark:text-gray-400">Total Enviados</p>
                  <p className="font-medium">{template.sentCount}</p>
                </div>
                <div>
                  <p className="text-gray-600 dark:text-gray-400">Taxa de Abertura</p>
                  <p className="font-medium">{template.openRate}</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};
