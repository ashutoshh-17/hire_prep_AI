import { Badge } from "@/components/ui/badge";
import { AlertTriangle, AlertCircle, Info } from "lucide-react";
import type { SkillGap } from "@/types/resume";

interface SkillGapCardProps {
  skillGaps: SkillGap[];
}

const priorityConfig = {
  high: {
    icon: AlertTriangle,
    color: "bg-destructive/10 text-destructive border-destructive/20",
    label: "High Priority",
  },
  medium: {
    icon: AlertCircle,
    color: "bg-warning/10 text-warning border-warning/20",
    label: "Medium Priority",
  },
  low: {
    icon: Info,
    color: "bg-primary/10 text-primary border-primary/20",
    label: "Low Priority",
  },
};

const categoryLabels = {
  technical: "Technical Skill",
  soft: "Soft Skill",
  certification: "Certification",
  tool: "Tool/Technology",
};

export function SkillGapCard({ skillGaps }: SkillGapCardProps) {
  const groupedByPriority = {
    high: skillGaps.filter((s) => s.priority === "high"),
    medium: skillGaps.filter((s) => s.priority === "medium"),
    low: skillGaps.filter((s) => s.priority === "low"),
  };

  return (
    <div className="p-6 rounded-2xl glass border border-border/50 theme-transition">
      <h3 className="text-lg font-semibold mb-4">Skill Gaps Identified</h3>
      <p className="text-sm text-muted-foreground mb-6">
        We found {skillGaps.length} skills that could strengthen your resume for this role.
      </p>

      <div className="space-y-6">
        {(["high", "medium", "low"] as const).map((priority) => {
          const skills = groupedByPriority[priority];
          if (skills.length === 0) return null;

          const config = priorityConfig[priority];
          const Icon = config.icon;

          return (
            <div key={priority}>
              <div className="flex items-center gap-2 mb-3">
                <Icon className="w-4 h-4" />
                <span className="font-medium text-sm">{config.label}</span>
                <Badge variant="secondary" className="ml-auto">
                  {skills.length}
                </Badge>
              </div>

              <div className="space-y-3">
                {skills.map((skill) => (
                  <div
                    key={skill.skill}
                    className={`p-4 rounded-xl border ${config.color} transition-all hover:scale-[1.01]`}
                  >
                    <div className="flex items-start justify-between gap-2 mb-2">
                      <h4 className="font-medium">{skill.skill}</h4>
                      <Badge variant="outline" className="text-xs shrink-0">
                        {categoryLabels[skill.category]}
                      </Badge>
                    </div>
                    <p className="text-sm opacity-80">{skill.description}</p>
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
