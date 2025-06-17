
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Check, Zap, Crown, Building } from "lucide-react";
import { Link } from "react-router-dom";

const plans = [
  {
    name: "Starter",
    price: "R$ 97",
    description: "Ideal para pequenas empresas começando.",
    icon: Zap,
    features: [
      "1 agente incluído",
      "1 canal de atendimento",
      "IA básica integrada",
      "1.000 conversas/mês",
      "Suporte via WhatsApp",
      "Painel básico de métricas"
    ],
    cta: "Começar Agora",
    popular: false
  },
  {
    name: "Profissional",
    price: "R$ 297",
    description: "Para equipes em crescimento.",
    icon: Crown,
    features: [
      "Até 5 agentes",
      "3 canais de atendimento",
      "IA + automações avançadas",
      "10.000 conversas/mês",
      "Integrações via n8n",
      "Relatórios detalhados",
      "Suporte prioritário",
      "Multiempresa"
    ],
    cta: "Escolher Profissional",
    popular: true
  },
  {
    name: "Corporativo",
    price: "Sob consulta",
    description: "Para grandes empresas.",
    icon: Building,
    features: [
      "Agentes ilimitados",
      "Canais ilimitados",
      "IA personalizada",
      "Conversas ilimitadas",
      "Servidor dedicado",
      "Integrações customizadas",
      "Gerente de conta dedicado",
      "SLA garantido"
    ],
    cta: "Fale Conosco",
    popular: false
  }
];

export const Pricing = () => {
  return (
    <section id="pricing" className="py-20 px-4 bg-gradient-to-br from-gray-50 to-blue-50 dark:from-gray-900 dark:to-blue-950/30">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-4">
            Planos que <span className="text-blue-600">crescem</span> com você
          </h2>
          <p className="text-xl text-muted-foreground mb-8">
            Escolha o plano ideal para sua empresa. Todos incluem suporte completo.
          </p>
          <div className="inline-flex bg-blue-100 dark:bg-blue-900/30 rounded-lg p-1">
            <div className="bg-white dark:bg-gray-800 rounded-md px-4 py-2 text-sm font-medium shadow-sm">
              💸 Teste grátis por 14 dias • Sem cartão de crédito
            </div>
          </div>
        </div>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {plans.map((plan, index) => (
            <Card key={plan.name} className={`relative flex flex-col border-0 shadow-lg hover:shadow-xl transition-all duration-300 ${plan.popular ? 'ring-2 ring-blue-500 scale-105 shadow-2xl' : 'hover:scale-105'}`}>
              {plan.popular && (
                <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                  <div className="bg-gradient-to-r from-blue-500 to-purple-600 text-white px-4 py-1 rounded-full text-sm font-medium">
                    Mais Popular
                  </div>
                </div>
              )}
              
              <CardHeader className={plan.popular ? 'bg-gradient-to-br from-blue-50 to-purple-50 dark:from-blue-950/50 dark:to-purple-950/50' : ''}>
                <div className="flex items-center gap-2 mb-2">
                  <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${plan.popular ? 'bg-blue-500' : 'bg-gray-500'}`}>
                    <plan.icon className="w-4 h-4 text-white" />
                  </div>
                  <CardTitle className="text-xl">{plan.name}</CardTitle>
                </div>
                <CardDescription className="text-base">{plan.description}</CardDescription>
              </CardHeader>
              
              <CardContent className="flex-grow">
                <div className="mb-6">
                  <div className="flex items-baseline gap-1">
                    <span className="text-4xl font-bold">{plan.price}</span>
                    {plan.price !== "Sob consulta" && (
                      <span className="text-muted-foreground">/mês</span>
                    )}
                  </div>
                  {plan.price !== "Sob consulta" && (
                    <div className="text-sm text-muted-foreground">
                      Cobrança mensal • Cancele quando quiser
                    </div>
                  )}
                </div>
                
                <ul className="space-y-3">
                  {plan.features.map((feature, featureIndex) => (
                    <li key={featureIndex} className="flex items-start gap-2">
                      <Check className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                      <span className="text-sm">{feature}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
              
              <CardFooter>
                <Link to="/auth" className="w-full">
                  <Button 
                    className={`w-full ${plan.popular 
                      ? 'bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white' 
                      : ''
                    }`} 
                    variant={plan.popular ? 'default' : 'outline'}
                    size="lg"
                  >
                    {plan.cta}
                  </Button>
                </Link>
              </CardFooter>
            </Card>
          ))}
        </div>
        
        <div className="mt-16 text-center">
          <div className="bg-white dark:bg-gray-800 rounded-2xl p-8 shadow-lg max-w-4xl mx-auto">
            <h3 className="text-2xl font-bold mb-4">✅ Todos os planos incluem:</h3>
            <div className="grid md:grid-cols-2 gap-4 text-left">
              <div className="flex items-center gap-2">
                <Check className="w-5 h-5 text-green-500" />
                <span>Suporte via WhatsApp</span>
              </div>
              <div className="flex items-center gap-2">
                <Check className="w-5 h-5 text-green-500" />
                <span>Atualizações automáticas</span>
              </div>
              <div className="flex items-center gap-2">
                <Check className="w-5 h-5 text-green-500" />
                <span>Painel em tempo real</span>
              </div>
              <div className="flex items-center gap-2">
                <Check className="w-5 h-5 text-green-500" />
                <span>Segurança empresarial</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
