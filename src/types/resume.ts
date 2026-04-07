export interface SkillGap {
  skill: string;
  category: "technical" | "soft" | "certification" | "tool";
  priority: "high" | "medium" | "low";
  description: string;
  learningResources?: string[];
}

export interface MatchedSkill {
  skill: string;
  category: "technical" | "soft" | "certification" | "tool";
  matchStrength: "strong" | "partial";
}

export interface Suggestion {
  id: string;
  title: string;
  description: string;
  priority: "high" | "medium" | "low";
  category: "content" | "format" | "skills" | "experience";
}

export interface AnalysisResult {
  id: string;
  jobTitle: string;
  fileName: string;
  overallScore: number;
  analyzedAt: string;
  skillGaps: SkillGap[];
  matchedSkills: MatchedSkill[];
  suggestions: Suggestion[];
  summary: string;
  extractedResumeSkills: string[];
}

export interface UploadState {
  file: File | null;
  jobTitle: string;
  isUploading: boolean;
  isAnalyzing: boolean;
  error: string | null;
}

export interface User {
  id: string;
  email: string;
  name: string;
  avatarUrl?: string;
}

export interface HistoryItem {
  id: string;
  jobTitle: string;
  fileName: string;
  score: number;
  analyzedAt: string;
}
