
import { Star, Quote } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

const testimonials = [
  {
    name: "João Silva",
    company: "Agência XYZ",
    role: "CEO",
    content: "Hoje o Fullweb-Chat economiza mais de 30h por mês da minha equipe. A automação com IA é simplesmente fantástica!",
    rating: 5,
    avatar: "/placeholder.svg"
  },
  {
    name: "Maria Santos",
    company: "E-commerce ABC",
    role: "Gerente de Atendimento",
    content: "A integração com WhatsApp mudou completamente nossa operação. Atendemos 3x mais clientes com a mesma equipe.",
    rating: 5,
    avatar: "/placeholder.svg"
  },
  {
    name: "Carlos Oliveira",
    company: "Tech Solutions",
    role: "CTO",
    content: "A plataforma é muito intuitiva e as automações via n8n nos permitiram criar fluxos complexos sem complicação.",
    rating: 5,
    avatar: "/placeholder.svg"
  }
];

export const Testimonials = () => {
  return (
    <section className="py-20 px-4 bg-gradient-to-br from-blue-50 to-purple-50 dark:from-blue-950/30 dark:to-purple-950/30">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-4">
            O que nossos clientes dizem
          </h2>
          <div className="flex items-center justify-center gap-2 mb-4">
            {[...Array(5)].map((_, i) => (
              <Star key={i} className="w-6 h-6 fill-yellow-400 text-yellow-400" />
            ))}
            <span className="text-xl font-semibold ml-2">4.9/5</span>
          </div>
          <p className="text-lg text-muted-foreground">
            Baseado em mais de 500 avaliações de clientes satisfeitos
          </p>
        </div>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <Card key={index} className="relative bg-white/80 backdrop-blur-sm border-0 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105">
              <CardContent className="p-6">
                <Quote className="w-8 h-8 text-purple-400 mb-4" />
                <p className="text-gray-700 dark:text-gray-300 mb-6 italic">
                  "{testimonial.content}"
                </p>
                
                <div className="flex items-center gap-1 mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                  ))}
                </div>
                
                <div className="flex items-center gap-3">
                  <Avatar className="w-10 h-10">
                    <AvatarImage src={testimonial.avatar} />
                    <AvatarFallback>{testimonial.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                  </Avatar>
                  <div>
                    <div className="font-semibold text-sm">{testimonial.name}</div>
                    <div className="text-xs text-muted-foreground">{testimonial.role} • {testimonial.company}</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};
