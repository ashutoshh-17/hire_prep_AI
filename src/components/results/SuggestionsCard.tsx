import { Badge } from "@/components/ui/badge";
import { Lightbulb, FileText, Wrench, Briefcase } from "lucide-react";
import type { Suggestion } from "@/types/resume";

interface SuggestionsCardProps {
  suggestions: Suggestion[];
}

const categoryConfig = {
  content: {
    icon: FileText,
    label: "Content",
    color: "bg-primary/10 text-primary",
  },
  format: {
    icon: Lightbulb,
    label: "Format",
    color: "bg-accent/10 text-accent",
  },
  skills: {
    icon: Wrench,
    label: "Skills",
    color: "bg-success/10 text-success",
  },
  experience: {
    icon: Briefcase,
    label: "Experience",
    color: "bg-warning/10 text-warning",
  },
};

const priorityBadge = {
  high: "bg-destructive/10 text-destructive border-destructive/20",
  medium: "bg-warning/10 text-warning border-warning/20",
  low: "bg-muted text-muted-foreground",
};

export function SuggestionsCard({ suggestions }: SuggestionsCardProps) {
  return (
    <div className="p-6 rounded-2xl glass border border-border/50 theme-transition">
      <h3 className="text-lg font-semibold mb-4">Improvement Suggestions</h3>
      <p className="text-sm text-muted-foreground mb-6">
        Actionable recommendations to enhance your resume's impact.
      </p>

      <div className="space-y-4">
        {suggestions.map((suggestion, index) => {
          const config = categoryConfig[suggestion.category];
          const Icon = config.icon;

          return (
            <div
              key={suggestion.id}
              className="p-4 rounded-xl border border-border/50 hover:border-primary/30 transition-all hover:bg-muted/30 theme-transition"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <div className="flex items-start gap-3">
                <div className={`w-10 h-10 rounded-lg flex items-center justify-center shrink-0 ${config.color}`}>
                  <Icon className="w-5 h-5" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2 mb-1">
                    <h4 className="font-medium">{suggestion.title}</h4>
                    <Badge variant="outline" className={`text-xs shrink-0 ${priorityBadge[suggestion.priority]}`}>
                      {suggestion.priority}
                    </Badge>
                  </div>
                  <p className="text-sm text-muted-foreground">{suggestion.description}</p>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
