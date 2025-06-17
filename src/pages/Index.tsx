
import { Header } from "@/components/LandingPage/Header";
import { Hero } from "@/components/LandingPage/Hero";
import { Benefits } from "@/components/LandingPage/Benefits";
import { ProductDemo } from "@/components/LandingPage/ProductDemo";
import { Testimonials } from "@/components/LandingPage/Testimonials";
import { Comparison } from "@/components/LandingPage/Comparison";
import { Pricing } from "@/components/LandingPage/Pricing";
import { ConversionForm } from "@/components/LandingPage/ConversionForm";
import { Footer } from "@/components/LandingPage/Footer";

const Index = () => {
  return (
    <div className="bg-background text-foreground min-h-screen">
      <Header />
      <main>
        <Hero />
        <Benefits />
        <ProductDemo />
        <Testimonials />
        <Comparison />
        <Pricing />
        <ConversionForm />
      </main>
      <Footer />
    </div>
  );
};

export default Index;
