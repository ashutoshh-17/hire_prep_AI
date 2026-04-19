import { useEffect, useMemo } from "react";
import { FileText, Maximize2, Minimize2 } from "lucide-react";
import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

interface PdfPreviewProps {
  file: File;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function PdfPreview({ file, open, onOpenChange }: PdfPreviewProps) {
  const [isFullScreen, setIsFullScreen] = useState(false);

  const blobUrl = useMemo(() => URL.createObjectURL(file), [file]);

  useEffect(() => {
    return () => URL.revokeObjectURL(blobUrl);
  }, [blobUrl]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        className={`p-0 gap-0 overflow-hidden flex flex-col transition-all duration-300 ${
          isFullScreen
            ? "max-w-[95vw] w-[95vw] h-[95vh] max-h-[95vh]"
            : "max-w-3xl w-[90vw] h-[80vh] max-h-[80vh]"
        }`}
        id="pdf-preview-dialog"
      >
        {/* Header */}
        <DialogHeader className="px-5 py-3.5 border-b border-border/50 glass shrink-0">
          <div className="flex items-center justify-between pr-8">
            <div className="flex items-center gap-3 min-w-0">
              <div className="w-9 h-9 rounded-lg gradient-primary flex items-center justify-center shrink-0">
                <FileText className="w-4.5 h-4.5 text-white" />
              </div>
              <div className="min-w-0">
                <DialogTitle className="text-base truncate">
                  {file.name}
                </DialogTitle>
                <DialogDescription className="text-xs">
                  {(file.size / 1024 / 1024).toFixed(2)} MB • PDF Preview
                </DialogDescription>
              </div>
            </div>
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 text-muted-foreground hover:text-foreground shrink-0"
              onClick={() => setIsFullScreen((prev) => !prev)}
              title={isFullScreen ? "Exit full screen" : "Full screen"}
              id="pdf-preview-fullscreen-toggle"
            >
              {isFullScreen ? (
                <Minimize2 className="w-4 h-4" />
              ) : (
                <Maximize2 className="w-4 h-4" />
              )}
            </Button>
          </div>
        </DialogHeader>

        {/* PDF iframe */}
        <div className="flex-1 min-h-0 overflow-hidden">
          <iframe
            src={`${blobUrl}#toolbar=1&navpanes=0`}
            title="Resume PDF Preview"
            className="w-full h-full border-none"
            id="pdf-preview-frame"
          />
        </div>
      </DialogContent>
    </Dialog>
  );
}
