import { Link } from "react-router-dom";
import { Header, Footer } from "@/components/layout";
import { Button } from "@/components/ui/button";
import { FileText, Trash2, ExternalLink } from "lucide-react";

const mockHistory = [
  { id: "1", jobTitle: "Senior Software Engineer", fileName: "resume_v3.pdf", score: 72, analyzedAt: "2024-01-15T10:30:00Z" },
  { id: "2", jobTitle: "Product Manager", fileName: "resume_pm.pdf", score: 65, analyzedAt: "2024-01-10T14:20:00Z" },
  { id: "3", jobTitle: "Data Scientist", fileName: "resume_ds.pdf", score: 81, analyzedAt: "2024-01-05T09:15:00Z" },
];

const History = () => {
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

          <div className="space-y-4">
            {mockHistory.map((item) => (
              <div key={item.id} className="p-4 rounded-xl glass border border-border/50 flex items-center gap-4 hover:border-primary/30 transition-all theme-transition">
                <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center">
                  <FileText className="w-6 h-6 text-primary" />
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-medium truncate">{item.jobTitle}</h3>
                  <p className="text-sm text-muted-foreground">{item.fileName} • {new Date(item.analyzedAt).toLocaleDateString()}</p>
                </div>
                <div className="text-2xl font-bold text-primary">{item.score}</div>
                <div className="flex gap-2">
                  <Link to="/results">
                    <Button variant="ghost" size="icon"><ExternalLink className="w-4 h-4" /></Button>
                  </Link>
                  <Button variant="ghost" size="icon" className="text-destructive"><Trash2 className="w-4 h-4" /></Button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default History;
