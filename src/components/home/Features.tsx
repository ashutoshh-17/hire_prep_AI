import { Brain, FileSearch, Lightbulb, Target } from "lucide-react";

const features = [
  {
    icon: FileSearch,
    title: "Smart Resume Parsing",
    description: "Our AI extracts and analyzes every detail from your resume, understanding context and experience levels.",
  },
  {
    icon: Brain,
    title: "AI Skill Gap Analysis",
    description: "Using advanced BERT models, we identify missing skills critical for your target role.",
  },
  {
    icon: Target,
    title: "Job-Specific Insights",
    description: "Get tailored recommendations based on the exact position you're applying for.",
  },
  {
    icon: Lightbulb,
    title: "Actionable Improvements",
    description: "Receive clear, prioritized suggestions to enhance your resume's impact.",
  },
];

export function Features() {
  return (
    <section className="py-24 relative">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Why Choose <span className="gradient-text">HirePrepAI</span>?
          </h2>
          <p className="text-muted-foreground text-lg">
            Our AI-powered platform provides comprehensive resume analysis that helps you stand out in today's competitive job market.
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feature, index) => (
            <div
              key={feature.title}
              className="group relative p-6 rounded-2xl glass border border-border/50 hover:border-primary/50 transition-all duration-300 hover:-translate-y-1 theme-transition"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              {/* Icon */}
              <div className="w-14 h-14 rounded-xl gradient-primary flex items-center justify-center mb-4 group-hover:scale-110 transition-transform shadow-lg">
                <feature.icon className="w-7 h-7 text-white" />
              </div>

              {/* Content */}
              <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
              <p className="text-muted-foreground">{feature.description}</p>

              {/* Hover Glow */}
              <div className="absolute inset-0 rounded-2xl gradient-primary opacity-0 group-hover:opacity-5 transition-opacity pointer-events-none" />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
