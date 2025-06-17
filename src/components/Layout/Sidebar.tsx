import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  Home, 
  MessageSquare, 
  Users, 
  Settings, 
  BarChart3, 
  Shield, 
  Zap,
  Phone,
  Mail,
  Tag
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface SidebarProps {
  userRole: 'super_admin' | 'admin' | 'agent';
  collapsed: boolean;
  onToggle: () => void;
}

interface MenuItem {
  icon: React.ComponentType<any>;
  label: string;
  path: string;
  roles: string[];
  badge?: number;
}

const menuItems: MenuItem[] = [
  { icon: Home, label: 'Dashboard', path: '/', roles: ['super_admin', 'admin', 'agent'] },
  { icon: MessageSquare, label: 'Conversas', path: '/conversations', roles: ['admin', 'agent'], badge: 12 },
  { icon: Users, label: 'Clientes', path: '/customers', roles: ['admin', 'agent'] },
  { icon: Users, label: 'Agentes', path: '/agents', roles: ['super_admin', 'admin'] },
  { icon: BarChart3, label: 'Relatórios', path: '/reports', roles: ['super_admin', 'admin'] },
  { icon: Shield, label: 'Super Admin', path: '/super-admin', roles: ['super_admin'] },
  { icon: Zap, label: 'Automações', path: '/automations', roles: ['admin'] },
  { icon: Phone, label: 'WhatsApp', path: '/whatsapp', roles: ['admin'] },
  { icon: Mail, label: 'Emails', path: '/emails', roles: ['admin'] },
  { icon: Tag, label: 'Tags', path: '/tags', roles: ['admin', 'agent'] },
  { icon: Settings, label: 'Configurações', path: '/settings', roles: ['super_admin', 'admin'] },
];

export const Sidebar: React.FC<SidebarProps> = ({ userRole, collapsed, onToggle }) => {
  const location = useLocation();
  const filteredItems = menuItems.filter(item => item.roles.includes(userRole));

  return (
    <div className={cn(
      "fixed left-0 top-0 h-full bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 transition-all duration-300 z-50",
      collapsed ? "w-16" : "w-64"
    )}>
      {/* Logo */}
      <div className="flex items-center justify-center h-16 border-b border-gray-200 dark:border-gray-700">
        {collapsed ? (
          <MessageSquare className="w-8 h-8 text-whatsapp-primary" />
        ) : (
          <div className="flex items-center space-x-2">
            <MessageSquare className="w-8 h-8 text-whatsapp-primary" />
            <span className="text-xl font-bold text-gray-900 dark:text-white">
              WhatsApp CRM
            </span>
          </div>
        )}
      </div>

      {/* Navigation */}
      <nav className="mt-6 px-3">
        {filteredItems.map((item) => {
          const isActive = location.pathname === item.path;
          
          return (
            <Link
              key={item.path}
              to={item.path}
              className={cn(
                "flex items-center px-3 py-3 mb-2 rounded-lg transition-colors",
                "hover:bg-gray-100 dark:hover:bg-gray-700",
                isActive 
                  ? "bg-whatsapp-primary/10 text-whatsapp-primary border-r-2 border-whatsapp-primary" 
                  : "text-gray-700 dark:text-gray-300"
              )}
            >
              <item.icon className="w-5 h-5 flex-shrink-0" />
              
              {!collapsed && (
                <>
                  <span className="ml-3 text-sm font-medium">
                    {item.label}
                  </span>
                  {item.badge && (
                    <span className="ml-auto bg-whatsapp-primary text-white text-xs px-2 py-1 rounded-full">
                      {item.badge}
                    </span>
                  )}
                </>
              )}
            </Link>
          );
        })}
      </nav>

      {/* User Role Badge */}
      {!collapsed && (
        <div className="absolute bottom-4 left-4 right-4">
          <div className="bg-whatsapp-primary/10 text-whatsapp-primary text-xs px-3 py-2 rounded-lg text-center">
            {userRole === 'super_admin' && 'Super Admin'}
            {userRole === 'admin' && 'Admin da Empresa'}
            {userRole === 'agent' && 'Agente'}
          </div>
        </div>
      )}
    </div>
  );
};
