
import React from 'react';
import { DashboardLayout } from '@/components/Layout/DashboardLayout';
import { useAuth } from '@/hooks/useAuth';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Zap } from 'lucide-react';

const WhatsApp = () => {
  const { user } = useAuth();

  return (
    <DashboardLayout userRole="admin">
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
              Integração com WhatsApp
            </h1>
            <p className="text-gray-600 dark:text-gray-400 mt-2">
              Conecte sua conta do WhatsApp para gerenciar conversas.
            </p>
          </div>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Conectar com a API do WhatsApp</CardTitle>
            <CardDescription>
              Para começar, você precisa conectar sua conta do WhatsApp Business API.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col items-start space-y-4">
              <p>
                A integração permite que você envie e receba mensagens diretamente
                através da nossa plataforma, automatize respostas e organize
                seus contatos de forma eficiente.
              </p>
              <Button className="bg-whatsapp-primary hover:bg-whatsapp-primary/90">
                <Zap className="w-4 h-4 mr-2" />
                Conectar agora
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default WhatsApp;
