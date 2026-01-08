import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowRight, Sparkles } from "lucide-react";

export function Hero() {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden pt-16">
      {/* Animated Background */}
      <div className="absolute inset-0 animated-gradient opacity-10" />
      
      {/* Floating Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-primary/20 rounded-full blur-3xl animate-float" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-accent/20 rounded-full blur-3xl animate-float" style={{ animationDelay: "-3s" }} />
        <div className="absolute top-1/2 right-1/3 w-48 h-48 bg-primary/10 rounded-full blur-2xl animate-float" style={{ animationDelay: "-1.5s" }} />
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-4xl mx-auto text-center">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass border border-primary/20 mb-8 animate-fade-in">
            <Sparkles className="w-4 h-4 text-primary" />
            <span className="text-sm font-medium">AI-Powered Resume Analysis</span>
          </div>

          {/* Main Heading */}
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold mb-6 animate-fade-in-up" style={{ animationDelay: "0.1s" }}>
            Let AI{" "}
            <span className="gradient-text">Supercharge</span>
            <br />
            Your Resume
          </h1>

          {/* Subheading */}
          <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto mb-8 animate-fade-in-up" style={{ animationDelay: "0.2s" }}>
            Upload your resume, specify your target job, and get instant AI-powered insights 
            on missing skills, improvements, and how to stand out from the competition.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center animate-fade-in-up" style={{ animationDelay: "0.3s" }}>
            <Link to="/analyze">
              <Button size="lg" className="gradient-primary text-white hover:opacity-90 transition-all group px-8 h-14 text-lg shadow-lg glow">
                Analyze My Resume
                <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Button>
            </Link>
            <Button size="lg" variant="outline" className="h-14 px-8 text-lg theme-transition">
              See How It Works
            </Button>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-8 mt-16 animate-fade-in-up" style={{ animationDelay: "0.4s" }}>
            <div className="text-center">
              <div className="text-3xl md:text-4xl font-bold gradient-text">10K+</div>
              <div className="text-sm text-muted-foreground mt-1">Resumes Analyzed</div>
            </div>
            <div className="text-center">
              <div className="text-3xl md:text-4xl font-bold gradient-text">95%</div>
              <div className="text-sm text-muted-foreground mt-1">Success Rate</div>
            </div>
            <div className="text-center">
              <div className="text-3xl md:text-4xl font-bold gradient-text">50+</div>
              <div className="text-sm text-muted-foreground mt-1">Industries Covered</div>
            </div>
          </div>
        </div>

        {/* Resume Mockup */}
        <div className="mt-16 max-w-3xl mx-auto animate-fade-in-up" style={{ animationDelay: "0.5s" }}>
          <div className="relative">
            <div className="absolute inset-0 gradient-primary blur-2xl opacity-20 rounded-3xl" />
            <div className="relative glass rounded-2xl p-6 border border-primary/20 shadow-2xl">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-3 h-3 rounded-full bg-destructive" />
                <div className="w-3 h-3 rounded-full bg-warning" />
                <div className="w-3 h-3 rounded-full bg-success" />
              </div>
              <div className="space-y-4">
                <div className="h-4 bg-muted rounded w-1/3" />
                <div className="h-3 bg-muted/60 rounded w-full" />
                <div className="h-3 bg-muted/60 rounded w-5/6" />
                <div className="h-3 bg-muted/60 rounded w-4/5" />
                <div className="flex gap-2 mt-6">
                  <div className="h-6 bg-primary/20 rounded-full px-3 w-20" />
                  <div className="h-6 bg-accent/20 rounded-full px-3 w-24" />
                  <div className="h-6 bg-primary/20 rounded-full px-3 w-16" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
