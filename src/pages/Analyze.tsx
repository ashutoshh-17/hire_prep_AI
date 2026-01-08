import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Header, Footer } from "@/components/layout";
import { UploadZone, JobTitleInput } from "@/components/analyze";
import { Button } from "@/components/ui/button";
import { Loader2, Sparkles } from "lucide-react";

const Analyze = () => {
  const navigate = useNavigate();
  const [file, setFile] = useState<File | null>(null);
  const [jobTitle, setJobTitle] = useState("");
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [errors, setErrors] = useState<{ file?: string; jobTitle?: string }>({});

  const handleAnalyze = async () => {
    const newErrors: typeof errors = {};
    if (!file) newErrors.file = "Please upload your resume";
    if (!jobTitle.trim()) newErrors.jobTitle = "Please enter a job title";

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setIsAnalyzing(true);
    // Simulate API call - replace with your Python backend
    await new Promise((resolve) => setTimeout(resolve, 2500));
    setIsAnalyzing(false);
    navigate("/results");
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
              Upload your resume and specify your target role to get AI-powered insights.
            </p>
          </div>

          <div className="space-y-8">
            <UploadZone
              onFileSelect={(f) => { setFile(f); setErrors((e) => ({ ...e, file: undefined })); }}
              selectedFile={file}
              onClearFile={() => setFile(null)}
              error={errors.file}
            />

            <JobTitleInput
              value={jobTitle}
              onChange={(v) => { setJobTitle(v); setErrors((e) => ({ ...e, jobTitle: undefined })); }}
              error={errors.jobTitle}
            />

            <Button
              onClick={handleAnalyze}
              disabled={isAnalyzing}
              className="w-full h-14 text-lg gradient-primary text-white hover:opacity-90 transition-all glow"
            >
              {isAnalyzing ? (
                <>
                  <Loader2 className="mr-2 w-5 h-5 animate-spin" />
                  Analyzing...
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
