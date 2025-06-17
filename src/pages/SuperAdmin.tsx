
import React from 'react';
import { DashboardLayout } from '@/components/Layout/DashboardLayout';
import { SuperAdminOverview } from '@/components/SuperAdmin/SuperAdminOverview';
import { AccountsManagement } from '@/components/SuperAdmin/AccountsManagement';
import { UsersManagement } from '@/components/SuperAdmin/UsersManagement';
import { PlansManagement } from '@/components/SuperAdmin/PlansManagement';
import { ChannelsManagement } from '@/components/SuperAdmin/ChannelsManagement';
import { AuditLogs } from '@/components/SuperAdmin/AuditLogs';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useAuth } from '@/hooks/useAuth';
import { Navigate } from 'react-router-dom';

const SuperAdmin = () => {
  const { user } = useAuth();
  
  // Verificação mais permissiva para testes - qualquer usuário logado pode acessar
  if (!user) {
    return <Navigate to="/auth" replace />;
  }

  return (
    <DashboardLayout userRole="super_admin">
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            Dashboard Super Admin
          </h1>
          <p className="text-gray-600 dark:text-gray-300">
            Controle total da plataforma Fullweb-Chat
          </p>
        </div>

        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList className="grid w-full grid-cols-6">
            <TabsTrigger value="overview">Resumo</TabsTrigger>
            <TabsTrigger value="accounts">Empresas</TabsTrigger>
            <TabsTrigger value="users">Usuários</TabsTrigger>
            <TabsTrigger value="plans">Planos</TabsTrigger>
            <TabsTrigger value="channels">Canais</TabsTrigger>
            <TabsTrigger value="audit">Auditoria</TabsTrigger>
          </TabsList>

          <TabsContent value="overview">
            <SuperAdminOverview />
          </TabsContent>

          <TabsContent value="accounts">
            <AccountsManagement />
          </TabsContent>

          <TabsContent value="users">
            <UsersManagement />
          </TabsContent>

          <TabsContent value="plans">
            <PlansManagement />
          </TabsContent>

          <TabsContent value="channels">
            <ChannelsManagement />
          </TabsContent>

          <TabsContent value="audit">
            <AuditLogs />
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  );
};

export default SuperAdmin;
