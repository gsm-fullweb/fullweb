
import { Check, X } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const features = [
  "WhatsApp multicliente",
  "Chat + Email + Widget",
  "Fluxo com IA via n8n",
  "Multiempresa com controle",
  "Painel com IA integrada",
  "Automações avançadas",
  "Relatórios em tempo real",
  "Suporte 24/7"
];

const competitors = [
  { name: "Fullweb-Chat", values: [true, true, true, true, true, true, true, true], highlight: true },
  { name: "Chatwoot", values: [true, true, false, true, false, false, true, false] },
  { name: "Zenvia", values: [true, true, false, "partial", false, "partial", true, true] },
  { name: "Outros", values: [false, "partial", false, false, false, false, "partial", false] }
];

const getIcon = (value: boolean | "partial") => {
  if (value === true) return <Check className="w-5 h-5 text-green-500" />;
  if (value === "partial") return <div className="w-5 h-5 bg-yellow-400 rounded-full flex items-center justify-center"><span className="text-xs text-white">~</span></div>;
  return <X className="w-5 h-5 text-red-400" />;
};

export const Comparison = () => {
  return (
    <section className="py-20 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-4">
            Compare e veja a <span className="text-blue-600">diferença</span>
          </h2>
          <p className="text-xl text-muted-foreground">
            Fullweb-Chat vs. principais concorrentes do mercado
          </p>
        </div>
        
        <div className="overflow-x-auto">
          <div className="min-w-full">
            <div className="grid grid-cols-1 lg:grid-cols-5 gap-4">
              {/* Features Column */}
              <div className="lg:col-span-1">
                <Card className="h-full border-0 shadow-md">
                  <CardHeader>
                    <CardTitle className="text-center">Recursos</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {features.map((feature, index) => (
                      <div key={index} className="py-3 border-b border-gray-100 dark:border-gray-800 last:border-0">
                        <span className="font-medium text-sm">{feature}</span>
                      </div>
                    ))}
                  </CardContent>
                </Card>
              </div>
              
              {/* Competitors Columns */}
              {competitors.map((competitor, compIndex) => (
                <div key={compIndex} className="lg:col-span-1">
                  <Card className={`h-full border-0 shadow-md ${competitor.highlight ? 'ring-2 ring-blue-500 shadow-xl' : ''}`}>
                    <CardHeader className={competitor.highlight ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white' : ''}>
                      <CardTitle className="text-center">
                        {competitor.name}
                        {competitor.highlight && (
                          <div className="text-xs mt-1 opacity-90">Recomendado</div>
                        )}
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      {competitor.values.map((value, index) => (
                        <div key={index} className="py-3 border-b border-gray-100 dark:border-gray-800 last:border-0 flex justify-center">
                          {getIcon(value)}
                        </div>
                      ))}
                    </CardContent>
                  </Card>
                </div>
              ))}
            </div>
          </div>
        </div>
        
        <div className="mt-8 text-center">
          <div className="flex items-center justify-center gap-6 text-sm text-muted-foreground">
            <div className="flex items-center gap-2">
              <Check className="w-4 h-4 text-green-500" />
              <span>Disponível</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-yellow-400 rounded-full flex items-center justify-center">
                <span className="text-xs text-white">~</span>
              </div>
              <span>Parcial</span>
            </div>
            <div className="flex items-center gap-2">
              <X className="w-4 h-4 text-red-400" />
              <span>Não disponível</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
