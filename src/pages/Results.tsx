import { Link, useLocation } from "react-router-dom";
import { Header, Footer } from "@/components/layout";
import { ScoreCard, SkillGapCard, MatchedSkillsCard, SuggestionsCard, ResumeSkillsCard } from "@/components/results";
import { Button } from "@/components/ui/button";
import { Download, RefreshCw } from "lucide-react";
import type { AnalysisResult } from "@/types/resume";

const mockResultFallback: AnalysisResult = {
  id: "1",
  jobTitle: "Senior Software Engineer",
  fileName: "resume.pdf",
  overallScore: 72,
  analyzedAt: new Date().toISOString(),
  summary: "Your resume shows strong technical foundations but lacks some modern technologies.",
  skillGaps: [
    { skill: "Kubernetes", category: "technical", priority: "high", description: "Essential for senior roles." },
    { skill: "Terraform", category: "technical", priority: "medium", description: "Infrastructure as Code is increasingly required." },
  ],
  matchedSkills: [
    { skill: "React", category: "technical", matchStrength: "strong" },
    { skill: "Python", category: "technical", matchStrength: "strong" },
    { skill: "Docker", category: "technical", matchStrength: "partial" },
  ],
  suggestions: [
    { id: "1", title: "Add Kubernetes to your resume", description: "Consider a certification or personal project using K8s.", priority: "high", category: "skills" },
    { id: "2", title: "Quantify your achievements", description: "Include measurable outcomes like 'reduced load time by 40%'.", priority: "medium", category: "content" },
  ],
  extractedResumeSkills: ["Python", "React", "Docker", "JavaScript", "TypeScript", "PostgreSQL", "Git", "REST API", "AWS"],
};

function printReport(result: AnalysisResult) {
  const win = window.open("", "_blank");
  if (!win) return;
  win.document.write(`
    <html>
      <head>
        <title>HirePrepAI Report — ${result.fileName}</title>
        <style>
          body { font-family: Arial, sans-serif; padding: 32px; color: #111; max-width: 800px; margin: 0 auto; }
          h1 { color: #2563eb; margin-bottom: 4px; }
          h2 { color: #1e40af; margin-top: 28px; border-bottom: 1px solid #e5e7eb; padding-bottom: 6px; }
          .meta { color: #6b7280; font-size: 14px; margin-bottom: 24px; }
          .score { font-size: 56px; font-weight: bold; color: #2563eb; }
          .summary { background: #f0f9ff; border-left: 4px solid #2563eb; padding: 12px 16px; border-radius: 4px; color: #1e3a5f; }
          .tag { display: inline-block; background: #eff6ff; color: #1d4ed8; padding: 2px 10px; border-radius: 99px; margin: 3px; font-size: 13px; border: 1px solid #bfdbfe; }
          .gap { color: #dc2626; margin: 6px 0; }
          .match { color: #16a34a; margin: 6px 0; }
          .suggestion { background: #fafafa; border: 1px solid #e5e7eb; border-radius: 6px; padding: 12px; margin: 8px 0; }
          .priority-high { color: #dc2626; font-size: 12px; font-weight: bold; text-transform: uppercase; }
          .priority-medium { color: #d97706; font-size: 12px; font-weight: bold; text-transform: uppercase; }
          .priority-low { color: #6b7280; font-size: 12px; font-weight: bold; text-transform: uppercase; }
        </style>
      </head>
      <body>
        <h1>HirePrepAI Analysis Report</h1>
        <p class="meta">${result.fileName} &nbsp;·&nbsp; ${new Date(result.analyzedAt).toLocaleString()}</p>
        <div class="score">${result.overallScore}%</div>
        <div class="summary">${result.summary}</div>

        <h2>Skills Detected in Resume (${result.extractedResumeSkills?.length ?? 0})</h2>
        <div>${(result.extractedResumeSkills ?? []).map(s => `<span class="tag">${s}</span>`).join("")}</div>

        <h2>Matched Skills (${result.matchedSkills.length})</h2>
        ${result.matchedSkills.map(s => `<p class="match">✓ ${s.skill} <em>(${s.matchStrength})</em></p>`).join("")}

        <h2>Skill Gaps (${result.skillGaps.length})</h2>
        ${result.skillGaps.map(s => `<p class="gap">✗ <strong>${s.skill}</strong> — ${s.description}</p>`).join("")}

        <h2>Suggestions</h2>
        ${result.suggestions.map((s, i) => `
          <div class="suggestion">
            <div class="priority-${s.priority}">${s.priority}</div>
            <strong>${i + 1}. ${s.title}</strong>
            <p style="margin:4px 0 0;color:#374151;font-size:14px;">${s.description}</p>
          </div>`).join("")}
      </body>
    </html>
  `);
  win.document.close();
  win.print();
}

const Results = () => {
  const location = useLocation();
  const result: AnalysisResult = location.state?.result || mockResultFallback;

  return (
    <div className="min-h-screen bg-background theme-transition">
      <Header />
      <main className="pt-24 pb-16">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
            <div>
              <h1 className="text-3xl font-bold mb-2">Analysis Results</h1>
              <p className="text-muted-foreground">
                Target Role: <span className="font-medium text-foreground">{result.jobTitle}</span>
              </p>
              <p className="text-xs text-muted-foreground mt-1">Analyzing file: {result.fileName}</p>
            </div>
            <div className="flex gap-3">
              <Link to="/analyze">
                <Button variant="outline"><RefreshCw className="w-4 h-4 mr-2" />New Analysis</Button>
              </Link>
              <Button className="gradient-primary text-white" onClick={() => printReport(result)}>
                <Download className="w-4 h-4 mr-2" />Download Report
              </Button>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-1 space-y-6">
              <ScoreCard score={result.overallScore} />
              <ResumeSkillsCard skills={result.extractedResumeSkills ?? []} />
              <MatchedSkillsCard matchedSkills={result.matchedSkills} />
            </div>
            <div className="lg:col-span-2 space-y-6">
              <div className="bg-card p-6 rounded-xl border border-border mb-6">
                <h3 className="text-lg font-semibold mb-2">Summary</h3>
                <p className="text-muted-foreground">{result.summary}</p>
              </div>
              <SkillGapCard skillGaps={result.skillGaps} />
              <SuggestionsCard suggestions={result.suggestions} />
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Results;
