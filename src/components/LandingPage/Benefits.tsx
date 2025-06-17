
import { Bot, MessageSquare, Users, BarChart3, Puzzle, Shield } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

const benefits = [
  {
    icon: Bot,
    title: "Automatização com IA",
    description: "Bots treinados para responder, classificar e agendar automaticamente"
  },
  {
    icon: MessageSquare,
    title: "WhatsApp Integrado",
    description: "Atenda com múltiplos agentes no mesmo número comercial"
  },
  {
    icon: Users,
    title: "Multiempresa e Multiusuário",
    description: "Ideal para agências, franquias e empresas com múltiplas filiais"
  },
  {
    icon: BarChart3,
    title: "Painel de Controle Completo",
    description: "Visão total dos atendimentos, métricas e performance em tempo real"
  },
  {
    icon: Puzzle,
    title: "Integração com n8n",
    description: "Conecte com qualquer sistema: CRM, ERP, e-commerce e mais"
  },
  {
    icon: Shield,
    title: "Segurança e Controle",
    description: "Supabase com RLS e gestão avançada de permissões"
  }
];

export const Benefits = () => {
  return (
    <section className="py-20 px-4 bg-gray-50 dark:bg-gray-900/50">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-4">
            Por que escolher o <span className="text-blue-600">Fullweb-Chat</span>?
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Uma plataforma completa que vai além do atendimento tradicional
          </p>
        </div>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {benefits.map((benefit, index) => (
            <Card key={index} className="group hover:shadow-lg transition-all duration-300 border-0 shadow-md hover:scale-105">
              <CardContent className="p-6">
                <div className="mb-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                    <benefit.icon className="w-6 h-6 text-white" />
                  </div>
                </div>
                <h3 className="text-xl font-semibold mb-2">{benefit.title}</h3>
                <p className="text-muted-foreground">{benefit.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};
