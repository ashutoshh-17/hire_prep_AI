import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Header, Footer } from "@/components/layout";
import { Button } from "@/components/ui/button";
import { FileText, Trash2, ExternalLink } from "lucide-react";
import type { AnalysisResult } from "@/types/resume";

const HISTORY_KEY = "hireprep_history";

type HistoryEntry = {
  id: string;
  jobTitle: string;
  fileName: string;
  score: number;
  analyzedAt: string;
  result: AnalysisResult;
};

function readHistory(): HistoryEntry[] {
  try {
    return JSON.parse(localStorage.getItem(HISTORY_KEY) || "[]");
  } catch {
    return [];
  }
}

function scoreColor(score: number) {
  if (score >= 80) return "text-green-500";
  if (score >= 60) return "text-yellow-500";
  return "text-red-500";
}

const History = () => {
  const navigate = useNavigate();
  const [history, setHistory] = useState<HistoryEntry[]>(readHistory);

  const handleDelete = (id: string) => {
    const updated = history.filter((h) => h.id !== id);
    setHistory(updated);
    localStorage.setItem(HISTORY_KEY, JSON.stringify(updated));
  };

  const handleView = (entry: HistoryEntry) => {
    navigate("/results", { state: { result: entry.result } });
  };

  return (
    <div className="min-h-screen bg-background theme-transition">
      <Header />
      <main className="pt-24 pb-16">
        <div className="container mx-auto px-4 max-w-4xl">
          <div className="flex justify-between items-center mb-8">
            <div>
              <h1 className="text-3xl font-bold">Analysis History</h1>
              <p className="text-muted-foreground">View your past resume analyses</p>
            </div>
            <Link to="/analyze">
              <Button className="gradient-primary text-white">New Analysis</Button>
            </Link>
          </div>

          {history.length === 0 ? (
            <div className="text-center py-24 text-muted-foreground">
              <FileText className="w-12 h-12 mx-auto mb-4 opacity-30" />
              <p className="text-lg font-medium">No analyses yet</p>
              <p className="text-sm mt-1">Run your first analysis to see results here.</p>
              <Link to="/analyze">
                <Button className="mt-6 gradient-primary text-white">Analyze a Resume</Button>
              </Link>
            </div>
          ) : (
            <div className="space-y-4">
              {history.map((item) => (
                <div key={item.id} className="p-4 rounded-xl glass border border-border/50 flex items-center gap-4 hover:border-primary/30 transition-all theme-transition">
                  <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center">
                    <FileText className="w-6 h-6 text-primary" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-medium truncate">{item.jobTitle}</h3>
                    <p className="text-sm text-muted-foreground">
                      {item.fileName} · {new Date(item.analyzedAt).toLocaleDateString()}
                    </p>
                  </div>
                  <div className={`text-2xl font-bold ${scoreColor(item.score)}`}>{item.score}%</div>
                  <div className="flex gap-2">
                    <Button variant="ghost" size="icon" onClick={() => handleView(item)}>
                      <ExternalLink className="w-4 h-4" />
                    </Button>
                    <Button variant="ghost" size="icon" className="text-destructive" onClick={() => handleDelete(item.id)}>
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default History;
