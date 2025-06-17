
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { MessageSquare, Sparkles } from "lucide-react";

export const ConversionForm = () => {
  const [formData, setFormData] = useState({
    name: "",
    whatsapp: "",
    email: ""
  });
  
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Here you would normally send the data to your backend
    console.log("Form submitted:", formData);
    setIsSubmitted(true);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  if (isSubmitted) {
    return (
      <section className="py-20 px-4 bg-gradient-to-br from-green-50 to-blue-50 dark:from-green-950/30 dark:to-blue-950/30">
        <div className="max-w-2xl mx-auto text-center">
          <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-xl">
            <CardContent className="p-8">
              <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-4">
                <MessageSquare className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-green-700 mb-2">Obrigado!</h3>
              <p className="text-gray-600 mb-4">
                Recebemos suas informações. Nossa equipe entrará em contato em breve via WhatsApp.
              </p>
              <div className="text-sm text-muted-foreground">
                Enquanto isso, que tal ver uma demonstração rápida?
              </div>
            </CardContent>
          </Card>
        </div>
      </section>
    );
  }

  return (
    <section className="py-20 px-4 bg-gradient-to-br from-blue-600 via-purple-600 to-blue-800 text-white">
      <div className="max-w-2xl mx-auto">
        <Card className="bg-white/10 backdrop-blur-sm border-white/20">
          <CardHeader className="text-center">
            <div className="flex justify-center mb-4">
              <div className="w-12 h-12 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-lg flex items-center justify-center">
                <Sparkles className="w-6 h-6 text-white" />
              </div>
            </div>
            <CardTitle className="text-3xl text-white mb-2">
              Comece sua transformação digital hoje
            </CardTitle>
            <p className="text-blue-100 text-lg">
              Preencha os dados abaixo e receba acesso imediato ao seu teste gratuito
            </p>
          </CardHeader>
          
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <Label htmlFor="name" className="text-white mb-2 block">
                  Nome completo *
                </Label>
                <Input
                  id="name"
                  name="name"
                  type="text"
                  required
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="Seu nome completo"
                  className="bg-white/20 border-white/30 text-white placeholder:text-blue-200 focus:bg-white/30"
                />
              </div>
              
              <div>
                <Label htmlFor="whatsapp" className="text-white mb-2 block">
                  WhatsApp *
                </Label>
                <Input
                  id="whatsapp"
                  name="whatsapp"
                  type="tel"
                  required
                  value={formData.whatsapp}
                  onChange={handleChange}
                  placeholder="(11) 99999-9999"
                  className="bg-white/20 border-white/30 text-white placeholder:text-blue-200 focus:bg-white/30"
                />
              </div>
              
              <div>
                <Label htmlFor="email" className="text-white mb-2 block">
                  E-mail corporativo *
                </Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  required
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="seu@email.com"
                  className="bg-white/20 border-white/30 text-white placeholder:text-blue-200 focus:bg-white/30"
                />
              </div>
              
              <Button 
                type="submit" 
                size="lg" 
                className="w-full bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white border-0 shadow-lg hover:shadow-xl transition-all duration-300"
              >
                <MessageSquare className="w-5 h-5 mr-2" />
                Quero começar agora - É grátis!
              </Button>
              
              <p className="text-xs text-blue-200 text-center">
                Ao preencher este formulário, você concorda com nossos{" "}
                <a href="#" className="underline hover:text-white">Termos de Uso</a> e{" "}
                <a href="#" className="underline hover:text-white">Política de Privacidade</a>
              </p>
            </form>
          </CardContent>
        </Card>
      </div>
    </section>
  );
};
