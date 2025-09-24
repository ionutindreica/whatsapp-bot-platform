import Hero from "@/components/Hero";
import Navigation from "@/components/Navigation";
import Features from "@/components/Features";
import BotBuilder from "@/components/BotBuilder";
import Footer from "@/components/Footer";

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <Hero />
      <Features />
      <BotBuilder />
      <Footer />
    </div>
  );
};

export default Index;
