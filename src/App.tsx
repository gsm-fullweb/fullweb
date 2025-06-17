import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import AuthPage from "./pages/Auth";
import Customers from "./pages/Customers";
import Conversations from "./pages/Conversations";
import Agents from "./pages/Agents";
import Reports from "./pages/Reports";
import Automations from "./pages/Automations";
import Emails from "./pages/Emails";
import Tags from "./pages/Tags";
import WhatsApp from "./pages/WhatsApp";
import SuperAdmin from "./pages/SuperAdmin";
import { AuthProvider } from "./hooks/useAuth";

const queryClient = new QueryClient();

const AppRoutes = () => (
  <AuthProvider>
    <Routes>
      <Route path="/" element={<Index />} />
      <Route path="/conversations" element={<Conversations />} />
      <Route path="/customers" element={<Customers />} />
      <Route path="/agents" element={<Agents />} />
      <Route path="/reports" element={<Reports />} />
      <Route path="/automations" element={<Automations />} />
      <Route path="/emails" element={<Emails />} />
      <Route path="/tags" element={<Tags />} />
      <Route path="/whatsapp" element={<WhatsApp />} />
      <Route path="/super-admin" element={<SuperAdmin />} />
      <Route path="/auth" element={<AuthPage />} />
      {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
      <Route path="*" element={<NotFound />} />
    </Routes>
  </AuthProvider>
);

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <AppRoutes />
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
