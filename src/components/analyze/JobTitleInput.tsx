import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Briefcase } from "lucide-react";

interface JobTitleInputProps {
  value: string;
  onChange: (value: string) => void;
  error?: string | null;
}

const suggestions = [
  "Software Engineer",
  "Product Manager",
  "Data Scientist",
  "UX Designer",
  "Marketing Manager",
  "Business Analyst",
];

export function JobTitleInput({ value, onChange, error }: JobTitleInputProps) {
  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="jobTitle" className="text-base font-medium">
          Target Job Title
        </Label>
        <div className="relative">
          <Briefcase className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
          <Input
            id="jobTitle"
            type="text"
            placeholder="e.g., Senior Software Engineer"
            value={value}
            onChange={(e) => onChange(e.target.value)}
            className={`pl-12 h-14 text-lg rounded-xl theme-transition ${
              error ? "border-destructive" : ""
            }`}
          />
        </div>
        {error && <p className="text-sm text-destructive">{error}</p>}
      </div>

      <div className="flex flex-wrap gap-2">
        <span className="text-sm text-muted-foreground">Quick picks:</span>
        {suggestions.map((suggestion) => (
          <button
            key={suggestion}
            onClick={() => onChange(suggestion)}
            className={`px-3 py-1 text-sm rounded-full transition-all ${
              value === suggestion
                ? "bg-primary text-primary-foreground"
                : "bg-muted hover:bg-muted/80 text-muted-foreground hover:text-foreground"
            }`}
          >
            {suggestion}
          </button>
        ))}
      </div>
    </div>
  );
}
