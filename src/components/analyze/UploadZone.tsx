import { useCallback, useState } from "react";
import { Upload, FileText, X, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";

interface UploadZoneProps {
  onFileSelect: (file: File) => void;
  selectedFile: File | null;
  onClearFile: () => void;
  error?: string | null;
}

export function UploadZone({ onFileSelect, selectedFile, onClearFile, error }: UploadZoneProps) {
  const [isDragging, setIsDragging] = useState(false);

  const handleDrag = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
  }, []);

  const handleDragIn = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.dataTransfer.items && e.dataTransfer.items.length > 0) {
      setIsDragging(true);
    }
  }, []);

  const handleDragOut = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  }, []);

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      e.stopPropagation();
      setIsDragging(false);

      if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
        const file = e.dataTransfer.files[0];
        if (file.type === "application/pdf") {
          onFileSelect(file);
        }
      }
    },
    [onFileSelect]
  );

  const handleFileInput = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      if (e.target.files && e.target.files.length > 0) {
        onFileSelect(e.target.files[0]);
      }
    },
    [onFileSelect]
  );

  if (selectedFile) {
    return (
      <div className="relative p-6 rounded-2xl glass border border-success/50 theme-transition">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-xl bg-success/10 flex items-center justify-center">
            <FileText className="w-7 h-7 text-success" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="font-medium truncate">{selectedFile.name}</p>
            <p className="text-sm text-muted-foreground">
              {(selectedFile.size / 1024 / 1024).toFixed(2)} MB • PDF
            </p>
          </div>
          <Button
            variant="ghost"
            size="icon"
            onClick={onClearFile}
            className="text-muted-foreground hover:text-destructive"
          >
            <X className="w-5 h-5" />
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-2">
      <div
        onDragEnter={handleDragIn}
        onDragLeave={handleDragOut}
        onDragOver={handleDrag}
        onDrop={handleDrop}
        className={`relative p-8 md:p-12 rounded-2xl border-2 border-dashed transition-all duration-300 cursor-pointer theme-transition ${
          isDragging
            ? "border-primary bg-primary/5 scale-[1.02]"
            : error
            ? "border-destructive/50 bg-destructive/5"
            : "border-border hover:border-primary/50 hover:bg-muted/50"
        }`}
      >
        <input
          type="file"
          accept=".pdf"
          onChange={handleFileInput}
          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
        />

        <div className="flex flex-col items-center text-center">
          <div
            className={`w-16 h-16 rounded-2xl flex items-center justify-center mb-4 transition-all ${
              isDragging ? "gradient-primary scale-110" : "bg-muted"
            }`}
          >
            <Upload className={`w-8 h-8 ${isDragging ? "text-white" : "text-muted-foreground"}`} />
          </div>

          <h3 className="text-lg font-semibold mb-2">
            {isDragging ? "Drop your resume here" : "Upload your resume"}
          </h3>
          <p className="text-muted-foreground mb-4">
            Drag and drop your PDF file, or click to browse
          </p>
          <Button variant="outline" className="theme-transition">
            Choose File
          </Button>
          <p className="text-xs text-muted-foreground mt-4">
            Supported format: PDF (Max 10MB)
          </p>
        </div>
      </div>

      {error && (
        <div className="flex items-center gap-2 text-destructive text-sm">
          <AlertCircle className="w-4 h-4" />
          <span>{error}</span>
        </div>
      )}
    </div>
  );
}
