import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Header, Footer } from "@/components/layout";
import { UploadZone, JobDescriptionInput } from "@/components/analyze";
import { Button } from "@/components/ui/button";
import { Loader2, Sparkles } from "lucide-react";
import type { AnalysisResult } from "@/types/resume";

const LOADING_STEPS = [
  "Extracting text from PDF...",
  "Running AI skill detection...",
  "Matching against job description...",
  "Computing compatibility score...",
  "Finalizing report...",
];

const HISTORY_KEY = "hireprep_history";

function saveToHistory(result: AnalysisResult) {
  const existing = JSON.parse(localStorage.getItem(HISTORY_KEY) || "[]");
  const entry = {
    id: result.id,
    jobTitle: result.jobTitle,
    fileName: result.fileName,
    score: result.overallScore,
    analyzedAt: result.analyzedAt,
    result,
  };
  localStorage.setItem(HISTORY_KEY, JSON.stringify([entry, ...existing].slice(0, 20)));
}

const Analyze = () => {
  const navigate = useNavigate();
  const [file, setFile] = useState<File | null>(null);
  const [jobDescription, setJobDescription] = useState("");
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [loadingStep, setLoadingStep] = useState(0);
  const [errors, setErrors] = useState<{ file?: string; jobDescription?: string }>({});

  useEffect(() => {
    if (!isAnalyzing) return;
    setLoadingStep(0);
    const interval = setInterval(() => {
      setLoadingStep((s) => Math.min(s + 1, LOADING_STEPS.length - 1));
    }, 1800);
    return () => clearInterval(interval);
  }, [isAnalyzing]);

  const handleAnalyze = async () => {
    const newErrors: typeof errors = {};
    if (!file) newErrors.file = "Please upload your resume";
    if (!jobDescription.trim()) newErrors.jobDescription = "Please enter the job description";
    if (Object.keys(newErrors).length > 0) { setErrors(newErrors); return; }

    setIsAnalyzing(true);
    try {
      const formData = new FormData();
      formData.append("file", file!);
      formData.append("job_description", jobDescription);

      const response = await fetch("http://localhost:8000/analyze", { method: "POST", body: formData });
      if (!response.ok) throw new Error("Failed to analyze resume");

      const result: AnalysisResult = await response.json();
      saveToHistory(result);
      setIsAnalyzing(false);
      navigate("/results", { state: { result } });
    } catch (error) {
      console.error("Analysis Error:", error);
      setErrors({ file: "Server error. Make sure the Python backend is running on port 8000." });
      setIsAnalyzing(false);
    }
  };

  return (
    <div className="min-h-screen bg-background theme-transition">
      <Header />
      <main className="pt-24 pb-16">
        <div className="container mx-auto px-4 max-w-2xl">
          <div className="text-center mb-10">
            <h1 className="text-3xl md:text-4xl font-bold mb-4">
              Analyze Your <span className="gradient-text">Resume</span>
            </h1>
            <p className="text-muted-foreground text-lg">
              Upload your resume and paste the target job description to get AI-powered insights.
            </p>
          </div>

          <div className="space-y-8">
            <UploadZone
              onFileSelect={(f) => { setFile(f); setErrors((e) => ({ ...e, file: undefined })); }}
              selectedFile={file}
              onClearFile={() => setFile(null)}
              error={errors.file}
            />

            <JobDescriptionInput
              value={jobDescription}
              onChange={(v) => { setJobDescription(v); setErrors((e) => ({ ...e, jobDescription: undefined })); }}
              error={errors.jobDescription}
            />

            <Button
              onClick={handleAnalyze}
              disabled={isAnalyzing}
              className="w-full h-14 text-lg gradient-primary text-white hover:opacity-90 transition-all glow"
            >
              {isAnalyzing ? (
                <>
                  <Loader2 className="mr-2 w-5 h-5 animate-spin" />
                  {LOADING_STEPS[loadingStep]}
                </>
              ) : (
                <>
                  <Sparkles className="mr-2 w-5 h-5" />
                  Analyze Resume
                </>
              )}
            </Button>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Analyze;
