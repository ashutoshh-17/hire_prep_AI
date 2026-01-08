import { Header, Footer } from "@/components/layout";
import { Hero, Features, HowItWorks, Testimonials, CTA } from "@/components/home";

const Index = () => {
  return (
    <div className="min-h-screen bg-background theme-transition">
      <Header />
      <main>
        <Hero />
        <Features />
        <HowItWorks />
        <Testimonials />
        <CTA />
      </main>
      <Footer />
    </div>
  );
};

export default Index;
