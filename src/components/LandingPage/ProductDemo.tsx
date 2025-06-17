
import { Play, MessageCircle, Users2, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

export const ProductDemo = () => {
  return (
    <section className="py-20 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-4">
            Veja o <span className="text-purple-600">Fullweb-Chat</span> em ação
          </h2>
          <p className="text-xl text-muted-foreground">
            Descubra como nossa plataforma transforma o atendimento ao cliente
          </p>
        </div>
        
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Video Demo Placeholder */}
          <div className="relative">
            <div className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-2xl p-1 shadow-2xl">
              <div className="bg-black rounded-xl overflow-hidden">
                <div className="aspect-video flex items-center justify-center relative">
                  <div className="absolute inset-0 bg-gradient-to-br from-blue-600/20 to-purple-600/20"></div>
                  <Button size="lg" className="relative z-10 bg-white/20 backdrop-blur-sm hover:bg-white/30 border-white/30">
                    <Play className="w-8 h-8" />
                  </Button>
                  
                  {/* Simulated chat interface */}
                  <div className="absolute bottom-4 left-4 right-4">
                    <div className="bg-white/10 backdrop-blur-sm rounded-lg p-3 text-white text-sm">
                      <div className="flex items-center gap-2 mb-2">
                        <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                        <span className="text-green-300">3 agentes online</span>
                      </div>
                      <div className="text-xs opacity-75">Demonstração do painel em tempo real</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          {/* Features List */}
          <div className="space-y-6">
            <Card className="p-6 border-0 shadow-md hover:shadow-lg transition-shadow">
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900/30 rounded-lg flex items-center justify-center">
                  <MessageCircle className="w-5 h-5 text-blue-600" />
                </div>
                <div>
                  <h3 className="font-semibold mb-2">Painel Unificado</h3>
                  <p className="text-muted-foreground text-sm">
                    Todos os canais em uma única interface: WhatsApp, chat web, e-mail e mais
                  </p>
                </div>
              </div>
            </Card>
            
            <Card className="p-6 border-0 shadow-md hover:shadow-lg transition-shadow">
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 bg-green-100 dark:bg-green-900/30 rounded-lg flex items-center justify-center">
                  <Users2 className="w-5 h-5 text-green-600" />
                </div>
                <div>
                  <h3 className="font-semibold mb-2">Trabalho em Equipe</h3>
                  <p className="text-muted-foreground text-sm">
                    Múltiplos agentes colaborando no mesmo atendimento com transferências automáticas
                  </p>
                </div>
              </div>
            </Card>
            
            <Card className="p-6 border-0 shadow-md hover:shadow-lg transition-shadow">
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 bg-purple-100 dark:bg-purple-900/30 rounded-lg flex items-center justify-center">
                  <Zap className="w-5 h-5 text-purple-600" />
                </div>
                <div>
                  <h3 className="font-semibold mb-2">Automação Inteligente</h3>
                  <p className="text-muted-foreground text-sm">
                    IA que aprende com seus atendimentos e melhora continuamente
                  </p>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </section>
  );
};
