import { Link } from "react-router-dom";
import { Header, Footer } from "@/components/layout";
import { ScoreCard, SkillGapCard, MatchedSkillsCard, SuggestionsCard } from "@/components/results";
import { Button } from "@/components/ui/button";
import { Download, RefreshCw } from "lucide-react";
import type { AnalysisResult } from "@/types/resume";

// Mock data - replace with actual API response
const mockResult: AnalysisResult = {
  id: "1",
  jobTitle: "Senior Software Engineer",
  fileName: "resume.pdf",
  overallScore: 72,
  analyzedAt: new Date().toISOString(),
  summary: "Your resume shows strong technical foundations but lacks some modern technologies and leadership experience expected for senior roles.",
  skillGaps: [
    { skill: "Kubernetes", category: "technical", priority: "high", description: "Container orchestration is essential for senior roles. Add projects using K8s." },
    { skill: "System Design", category: "technical", priority: "high", description: "Senior engineers need to demonstrate system design experience." },
    { skill: "Team Leadership", category: "soft", priority: "medium", description: "Highlight any mentoring or team lead experience you have." },
    { skill: "AWS Certifications", category: "certification", priority: "low", description: "Cloud certifications can strengthen your profile." },
  ],
  matchedSkills: [
    { skill: "React", category: "technical", matchStrength: "strong" },
    { skill: "TypeScript", category: "technical", matchStrength: "strong" },
    { skill: "Node.js", category: "technical", matchStrength: "strong" },
    { skill: "Git", category: "tool", matchStrength: "partial" },
    { skill: "Communication", category: "soft", matchStrength: "partial" },
  ],
  suggestions: [
    { id: "1", title: "Add quantifiable achievements", description: "Include metrics like 'improved performance by 40%' or 'reduced costs by $50K'.", priority: "high", category: "content" },
    { id: "2", title: "Include system design projects", description: "Add a section highlighting architecture decisions you've made.", priority: "high", category: "skills" },
    { id: "3", title: "Optimize for ATS", description: "Use standard section headers and avoid tables/graphics.", priority: "medium", category: "format" },
    { id: "4", title: "Add leadership examples", description: "Even informal mentoring counts. Highlight any team guidance.", priority: "medium", category: "experience" },
  ],
};

const Results = () => {
  return (
    <div className="min-h-screen bg-background theme-transition">
      <Header />
      <main className="pt-24 pb-16">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
            <div>
              <h1 className="text-3xl font-bold mb-2">Analysis Results</h1>
              <p className="text-muted-foreground">
                Target Role: <span className="font-medium text-foreground">{mockResult.jobTitle}</span>
              </p>
            </div>
            <div className="flex gap-3">
              <Link to="/analyze">
                <Button variant="outline"><RefreshCw className="w-4 h-4 mr-2" />New Analysis</Button>
              </Link>
              <Button className="gradient-primary text-white"><Download className="w-4 h-4 mr-2" />Download Report</Button>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-1 space-y-6">
              <ScoreCard score={mockResult.overallScore} />
              <MatchedSkillsCard matchedSkills={mockResult.matchedSkills} />
            </div>
            <div className="lg:col-span-2 space-y-6">
              <SkillGapCard skillGaps={mockResult.skillGaps} />
              <SuggestionsCard suggestions={mockResult.suggestions} />
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Results;
