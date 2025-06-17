
import { Button } from "@/components/ui/button";
import { MessageSquareHeart, Zap, Bot } from "lucide-react";
import { Link } from "react-router-dom";

export const Hero = () => {
  return (
    <section className="relative bg-gradient-to-br from-blue-600 via-purple-600 to-blue-800 text-white py-20 px-4 overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 bg-black/20"></div>
      <div className="absolute top-20 left-10 w-72 h-72 bg-purple-500/20 rounded-full blur-3xl"></div>
      <div className="absolute bottom-20 right-10 w-96 h-96 bg-blue-500/20 rounded-full blur-3xl"></div>
      
      <div className="relative max-w-6xl mx-auto text-center">
        <div className="flex justify-center mb-6">
          <div className="flex items-center gap-2 bg-white/10 backdrop-blur-sm rounded-full px-4 py-2">
            <Zap className="w-4 h-4 text-yellow-400" />
            <span className="text-sm">Plataforma de Atendimento Inteligente</span>
          </div>
        </div>
        
        <h1 className="text-5xl md:text-7xl font-bold mb-6 leading-tight">
          Atendimento mais
          <span className="bg-gradient-to-r from-yellow-400 to-orange-500 bg-clip-text text-transparent"> rápido</span>,
          <br />
          <span className="bg-gradient-to-r from-green-400 to-blue-500 bg-clip-text text-transparent">inteligente</span> e 
          <span className="bg-gradient-to-r from-purple-400 to-pink-500 bg-clip-text text-transparent"> escalável</span>
        </h1>
        
        <p className="text-xl md:text-2xl text-blue-100 mb-8 max-w-4xl mx-auto leading-relaxed">
          Centralize seus canais, automatize com IA e encante seus clientes com o 
          <strong> Fullweb-Chat</strong> - a plataforma moderna de atendimento multicanal.
        </p>
        
        <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
          <Link to="/auth">
            <Button size="lg" className="bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white border-0 shadow-lg hover:shadow-xl transition-all duration-300 text-lg px-8 py-4">
              <Bot className="w-5 h-5 mr-2" />
              Comece Grátis por 14 dias
            </Button>
          </Link>
          <Button size="lg" variant="outline" className="border-white/30 text-white hover:bg-white/10 backdrop-blur-sm text-lg px-8 py-4">
            <MessageSquareHeart className="w-5 h-5 mr-2" />
            Agendar Demonstração
          </Button>
        </div>
        
        {/* Hero Image/Animation Placeholder */}
        <div className="relative mx-auto max-w-4xl">
          <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 shadow-2xl">
            <div className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-xl p-6 shadow-inner">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                <div className="bg-green-500/20 rounded-lg p-3 flex items-center gap-2">
                  <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                  <span className="text-green-300 text-sm">WhatsApp Online</span>
                </div>
                <div className="bg-blue-500/20 rounded-lg p-3 flex items-center gap-2">
                  <div className="w-2 h-2 bg-blue-400 rounded-full animate-pulse"></div>
                  <span className="text-blue-300 text-sm">Chat Web Ativo</span>
                </div>
                <div className="bg-purple-500/20 rounded-lg p-3 flex items-center gap-2">
                  <div className="w-2 h-2 bg-purple-400 rounded-full animate-pulse"></div>
                  <span className="text-purple-300 text-sm">IA Processando</span>
                </div>
              </div>
              <div className="text-gray-300 text-sm text-left">
                <div className="mb-2">📱 Cliente: "Preciso de ajuda com meu pedido"</div>
                <div className="mb-2">🤖 IA: "Analisando pedido #12345..."</div>
                <div className="text-green-400">✅ Agente: "Encontrei seu pedido! Posso ajudar..."</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
