import { Label } from "@/components/ui/label";
import { FileText, AlertTriangle } from "lucide-react";

interface JobDescriptionInputProps {
  value: string;
  onChange: (value: string) => void;
  error?: string | null;
}

export function JobDescriptionInput({ value, onChange, error }: JobDescriptionInputProps) {
  const charCount = value.length;
  const isTooShort = charCount > 0 && charCount < 200;

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <Label htmlFor="jobDescription" className="text-base font-medium flex items-center">
            Target Job Description
            <span className="text-xs text-muted-foreground ml-2">(Paste the full description)</span>
          </Label>
          {charCount > 0 && (
            <span className={`text-xs ${isTooShort ? "text-warning" : "text-muted-foreground"}`}>
              {charCount.toLocaleString()} chars
            </span>
          )}
        </div>

        <div className="relative">
          <FileText className="absolute left-4 top-4 w-5 h-5 text-muted-foreground" />
          <textarea
            id="jobDescription"
            placeholder="e.g., We are looking for a Software Engineer experienced with React, Python, and AWS..."
            value={value}
            onChange={(e) => onChange(e.target.value)}
            className={`w-full min-h-[200px] pl-12 pt-4 pr-4 pb-4 text-base rounded-xl border bg-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 theme-transition resize-y ${
              error ? "border-destructive focus-visible:ring-destructive" : ""
            }`}
          />
        </div>

        {isTooShort && (
          <div className="flex items-center gap-2 text-warning text-sm">
            <AlertTriangle className="w-4 h-4 shrink-0" />
            <span>JD is very short — paste more text for accurate skill extraction.</span>
          </div>
        )}
        {error && <p className="text-sm text-destructive">{error}</p>}
      </div>
    </div>
  );
}
