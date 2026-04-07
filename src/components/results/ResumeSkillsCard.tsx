import { Badge } from "@/components/ui/badge";
import { Brain, ChevronDown, ChevronUp } from "lucide-react";
import { useState } from "react";

interface ResumeSkillsCardProps {
  skills: string[];
}

export function ResumeSkillsCard({ skills }: ResumeSkillsCardProps) {
  const [expanded, setExpanded] = useState(false);
  const displayLimit = 18;
  const visibleSkills = expanded ? skills : skills.slice(0, displayLimit);
  const hasMore = skills.length > displayLimit;

  return (
    <div className="p-6 rounded-2xl glass border border-border/50 theme-transition">
      <div className="flex items-center gap-2 mb-2">
        <Brain className="w-4 h-4 text-primary" />
        <h3 className="text-lg font-semibold">Detected in Resume</h3>
        <Badge variant="secondary" className="ml-auto">
          {skills.length}
        </Badge>
      </div>
      <p className="text-sm text-muted-foreground mb-4">
        Skills our AI extracted from your resume.
      </p>

      {skills.length === 0 ? (
        <p className="text-muted-foreground text-sm text-center py-4">
          No skills detected. Try a cleaner, text-based PDF.
        </p>
      ) : (
        <>
          <div className="flex flex-wrap gap-2">
            {visibleSkills.map((skill) => (
              <Badge
                key={skill}
                variant="outline"
                className="bg-primary/5 border-primary/20 text-primary/90 hover:bg-primary/10 transition-colors text-xs"
              >
                {skill}
              </Badge>
            ))}
          </div>

          {hasMore && (
            <button
              onClick={() => setExpanded((v) => !v)}
              className="mt-3 flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground transition-colors"
            >
              {expanded ? (
                <>
                  <ChevronUp className="w-3 h-3" /> Show less
                </>
              ) : (
                <>
                  <ChevronDown className="w-3 h-3" /> +{skills.length - displayLimit} more
                </>
              )}
            </button>
          )}
        </>
      )}
    </div>
  );
}
