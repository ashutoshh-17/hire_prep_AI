import { Badge } from "@/components/ui/badge";
import { CheckCircle, Circle } from "lucide-react";
import type { MatchedSkill } from "@/types/resume";

interface MatchedSkillsCardProps {
  matchedSkills: MatchedSkill[];
}

const categoryLabels = {
  technical: "Technical",
  soft: "Soft Skill",
  certification: "Certification",
  tool: "Tool",
};

export function MatchedSkillsCard({ matchedSkills }: MatchedSkillsCardProps) {
  const strongMatches = matchedSkills.filter((s) => s.matchStrength === "strong");
  const partialMatches = matchedSkills.filter((s) => s.matchStrength === "partial");

  return (
    <div className="p-6 rounded-2xl glass border border-border/50 theme-transition">
      <h3 className="text-lg font-semibold mb-4">Matched Skills</h3>
      <p className="text-sm text-muted-foreground mb-6">
        Skills from your resume that align with the job requirements.
      </p>

      <div className="space-y-6">
        {/* Strong Matches */}
        {strongMatches.length > 0 && (
          <div>
            <div className="flex items-center gap-2 mb-3">
              <CheckCircle className="w-4 h-4 text-success" />
              <span className="font-medium text-sm">Strong Match</span>
              <Badge variant="secondary" className="ml-auto bg-success/10 text-success">
                {strongMatches.length}
              </Badge>
            </div>
            <div className="flex flex-wrap gap-2">
              {strongMatches.map((skill) => (
                <Badge
                  key={skill.skill}
                  className="bg-success/10 text-success border-success/20 hover:bg-success/20"
                >
                  {skill.skill}
                </Badge>
              ))}
            </div>
          </div>
        )}

        {/* Partial Matches */}
        {partialMatches.length > 0 && (
          <div>
            <div className="flex items-center gap-2 mb-3">
              <Circle className="w-4 h-4 text-primary" />
              <span className="font-medium text-sm">Partial Match</span>
              <Badge variant="secondary" className="ml-auto">
                {partialMatches.length}
              </Badge>
            </div>
            <div className="flex flex-wrap gap-2">
              {partialMatches.map((skill) => (
                <Badge
                  key={skill.skill}
                  variant="outline"
                  className="hover:bg-muted"
                >
                  {skill.skill}
                </Badge>
              ))}
            </div>
          </div>
        )}

        {matchedSkills.length === 0 && (
          <p className="text-muted-foreground text-center py-4">
            No matching skills found. Consider adding relevant experience to your resume.
          </p>
        )}
      </div>
    </div>
  );
}
