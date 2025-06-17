
import { Button } from "@/components/ui/button";
import { MessageSquareHeart, Menu, X } from "lucide-react";
import { Link } from "react-router-dom";
import { useState } from "react";

export const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="max-w-6xl mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          <Link to="/" className="flex items-center gap-2">
            <MessageSquareHeart className="w-8 h-8 text-blue-600" />
            <h1 className="text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Fullweb-Chat
            </h1>
          </Link>
          
          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-6">
            <a href="#pricing" className="text-sm font-medium hover:text-blue-600 transition-colors">
              Preços
            </a>
            <a href="#demo" className="text-sm font-medium hover:text-blue-600 transition-colors">
              Demo
            </a>
            <a href="#contato" className="text-sm font-medium hover:text-blue-600 transition-colors">
              Contato
            </a>
          </nav>
          
          {/* Desktop Buttons */}
          <div className="hidden md:flex gap-2 items-center">
            <Link to="/auth">
              <Button variant="ghost" className="hover:text-blue-600">
                Entrar
              </Button>
            </Link>
            <Link to="/auth">
              <Button className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white border-0">
                Teste Grátis
              </Button>
            </Link>
          </div>
          
          {/* Mobile Menu Button */}
          <button
            className="md:hidden"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
        
        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden border-t border-border/40 py-4">
            <nav className="flex flex-col gap-4">
              <a href="#pricing" className="text-sm font-medium hover:text-blue-600 transition-colors">
                Preços
              </a>
              <a href="#demo" className="text-sm font-medium hover:text-blue-600 transition-colors">
                Demo
              </a>
              <a href="#contato" className="text-sm font-medium hover:text-blue-600 transition-colors">
                Contato
              </a>
              <div className="flex flex-col gap-2 pt-4 border-t border-border/40">
                <Link to="/auth">
                  <Button variant="ghost" className="w-full justify-start hover:text-blue-600">
                    Entrar
                  </Button>
                </Link>
                <Link to="/auth">
                  <Button className="w-full bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white border-0">
                    Teste Grátis
                  </Button>
                </Link>
              </div>
            </nav>
          </div>
        )}
      </div>
    </header>
  );
};
