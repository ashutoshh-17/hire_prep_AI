interface ScoreCardProps {
  score: number;
  label?: string;
}

export function ScoreCard({ score, label = "Resume Score" }: ScoreCardProps) {
  const getScoreColor = (score: number) => {
    if (score >= 80) return "text-success";
    if (score >= 60) return "text-warning";
    return "text-destructive";
  };

  const getScoreGradient = (score: number) => {
    if (score >= 80) return "from-success to-success/50";
    if (score >= 60) return "from-warning to-warning/50";
    return "from-destructive to-destructive/50";
  };

  const circumference = 2 * Math.PI * 45;
  const strokeDashoffset = circumference - (score / 100) * circumference;

  return (
    <div className="p-6 rounded-2xl glass border border-border/50 theme-transition">
      <h3 className="text-lg font-semibold mb-4 text-center">{label}</h3>
      
      <div className="relative w-40 h-40 mx-auto">
        {/* Background Circle */}
        <svg className="w-full h-full -rotate-90" viewBox="0 0 100 100">
          <circle
            cx="50"
            cy="50"
            r="45"
            fill="none"
            stroke="currentColor"
            strokeWidth="8"
            className="text-muted/30"
          />
          <circle
            cx="50"
            cy="50"
            r="45"
            fill="none"
            stroke="url(#scoreGradient)"
            strokeWidth="8"
            strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            className="transition-all duration-1000 ease-out"
          />
          <defs>
            <linearGradient id="scoreGradient" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" className={`${score >= 80 ? "stop-success" : score >= 60 ? "stop-warning" : "stop-destructive"}`} style={{ stopColor: "hsl(var(--primary))" }} />
              <stop offset="100%" className="stop-accent" style={{ stopColor: "hsl(var(--accent))" }} />
            </linearGradient>
          </defs>
        </svg>

        {/* Score Number */}
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className={`text-4xl font-bold ${getScoreColor(score)}`}>{score}</span>
          <span className="text-sm text-muted-foreground">out of 100</span>
        </div>
      </div>

      {/* Score Interpretation */}
      <div className="mt-4 text-center">
        <p className="text-sm text-muted-foreground">
          {score >= 80
            ? "Excellent! Your resume is highly competitive."
            : score >= 60
            ? "Good, but there's room for improvement."
            : "Needs significant improvements to stand out."}
        </p>
      </div>
    </div>
  );
}
