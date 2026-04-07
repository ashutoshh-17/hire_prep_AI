import { useEffect, useState } from "react";

interface ScoreCardProps {
  score: number;
  label?: string;
}

export function ScoreCard({ score, label = "Resume Score" }: ScoreCardProps) {
  const [animated, setAnimated] = useState(0);

  useEffect(() => {
    const duration = 1200;
    const start = Date.now();
    const tick = () => {
      const progress = Math.min((Date.now() - start) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setAnimated(Math.round(eased * score));
      if (progress < 1) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  }, [score]);

  const color = animated >= 80 ? "text-success" : animated >= 60 ? "text-warning" : "text-destructive";
  const circumference = 2 * Math.PI * 45;
  const strokeDashoffset = circumference - (animated / 100) * circumference;

  return (
    <div className="p-6 rounded-2xl glass border border-border/50 theme-transition">
      <h3 className="text-lg font-semibold mb-4 text-center">{label}</h3>

      <div className="relative w-40 h-40 mx-auto">
        <svg className="w-full h-full -rotate-90" viewBox="0 0 100 100">
          <circle cx="50" cy="50" r="45" fill="none" stroke="currentColor" strokeWidth="8" className="text-muted/30" />
          <circle
            cx="50" cy="50" r="45" fill="none"
            stroke="url(#scoreGradient)"
            strokeWidth="8" strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            className="transition-none"
          />
          <defs>
            <linearGradient id="scoreGradient" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" style={{ stopColor: "hsl(var(--primary))" }} />
              <stop offset="100%" style={{ stopColor: "hsl(var(--accent))" }} />
            </linearGradient>
          </defs>
        </svg>

        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className={`text-4xl font-bold ${color}`}>{animated}</span>
          <span className="text-sm text-muted-foreground">out of 100</span>
        </div>
      </div>

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
