"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Upload } from "lucide-react";
import { cn } from "@/lib/utils";

interface FileDropzoneProps {
  onFileSelect: (file: File) => void;
  accept?: string;
  disabled?: boolean;
}

export default function FileDropzone({
  onFileSelect,
  accept = ".pdf,.docx,.doc",
  disabled = false,
}: FileDropzoneProps) {
  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      onFileSelect(file);
    }
  };

  return (
    <Card className={cn(
      "border-2 border-dashed transition-colors cursor-pointer hover:border-primary/50",
      disabled && "cursor-not-allowed opacity-50"
    )}>
      <CardContent className="flex flex-col items-center justify-center p-8 text-center">
        <Input
          type="file"
          accept={accept}
          onChange={handleFileChange}
          disabled={disabled}
          className="hidden"
          id="file-upload"
        />
        <label htmlFor="file-upload" className="cursor-pointer w-full flex flex-col items-center">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-lg bg-muted mb-4">
            <Upload className="h-6 w-6 text-muted-foreground" />
          </div>

          <div className="space-y-2">
            <p className="text-sm font-medium">
              Click to upload your resume
            </p>
            <p className="text-xs text-muted-foreground">
              PDF, DOCX, or DOC files only (max 10MB)
            </p>
          </div>
        </label>
      </CardContent>
    </Card>
  );
}
