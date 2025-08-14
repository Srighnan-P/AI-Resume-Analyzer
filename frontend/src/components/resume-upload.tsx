"use client";

import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Upload, FileText, Loader2, AlertCircle } from "lucide-react";
import FileDropzone from "./file-dropzone";
import AnalysisResults from "./analysis-results";
import { analyzeResume, validateFile } from "@/lib/api";
import { AnalysisResponse } from "@/types/api";
import { formatFileSize } from "@/lib/utils";

export default function ResumeUpload() {
  const [file, setFile] = useState<File | null>(null);
  const [jobDescription, setJobDescription] = useState<string>("");
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisResult, setAnalysisResult] = useState<AnalysisResponse | null>(null);
  const [error, setError] = useState<string | null>(null);
  const resultsRef = useRef<HTMLDivElement>(null);

  const handleFileSelect = (selectedFile: File) => {
    try {
      validateFile(selectedFile);
      setFile(selectedFile);
      setError(null);
      setAnalysisResult(null); // Clear previous results
    } catch (validationError) {
      setError(validationError instanceof Error ? validationError.message : 'File validation failed');
      setFile(null);
    }
  };

  const handleAnalyze = async () => {
    if (!file || !jobDescription.trim()) {
      setError('Please upload a resume and enter a job description');
      return;
    }

    setIsAnalyzing(true);
    setError(null);

    try {
      const result = await analyzeResume(file, jobDescription);
      setAnalysisResult(result);
      
      // Check if the response contains an error
      if (result.error) {
        setError(result.error);
      } else {
        // Scroll to results section after successful analysis
        setTimeout(() => {
          resultsRef.current?.scrollIntoView({
            behavior: 'smooth',
            block: 'start'
          });
          // Add additional offset to account for header
          window.scrollBy(0, -80);
        }, 100);
      }
    } catch (analysisError) {
      console.error('Analysis error:', analysisError);
      setError(analysisError instanceof Error ? analysisError.message : 'An error occurred during analysis');
    } finally {
      setIsAnalyzing(false);
    }
  };

  const resetForm = () => {
    setFile(null);
    setJobDescription("");
    setAnalysisResult(null);
    setError(null);
  };

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-6">
      <div className="text-center space-y-2">
        <h1 className="text-3xl font-bold">AI Resume Analyzer</h1>
        <p className="text-muted-foreground">
          Upload your resume and job description to get AI-powered insights and suggestions
        </p>
      </div>

      {/* Error Display */}
      {error && (
        <Card className="border-red-200 bg-red-50">
          <CardContent className="pt-6">
            <div className="flex items-center gap-2 text-red-700">
              <AlertCircle className="h-5 w-5" />
              <span className="font-medium">Error:</span>
              <span>{error}</span>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Upload Form */}
      <div className="grid lg:grid-cols-2 gap-6">
        {/* File Upload */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Upload className="h-5 w-5" />
              Upload Resume
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label>Select your resume</Label>
              <FileDropzone
                onFileSelect={handleFileSelect}
                disabled={isAnalyzing}
              />
            </div>

            {file && (
              <div className="flex items-center gap-2 p-3 bg-muted rounded-lg">
                <FileText className="h-4 w-4" />
                <span className="text-sm">{file.name}</span>
                <span className="text-xs text-muted-foreground">
                  ({formatFileSize(file.size)})
                </span>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Job Description */}
        <Card>
          <CardHeader>
            <CardTitle>Job Description</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="job-description">
                Paste the job description you want to match against
              </Label>
              <Textarea
                id="job-description"
                value={jobDescription}
                onChange={(e) => setJobDescription(e.target.value)}
                placeholder="Enter the job description here..."
                className="min-h-[200px] resize-none"
                disabled={isAnalyzing}
              />
            </div>
            <p className="text-xs text-muted-foreground">
              Include required skills, qualifications, and job responsibilities for the best analysis.
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Action Buttons */}
      <div className="flex gap-4 justify-center">
        <Button
          onClick={handleAnalyze}
          disabled={!file || !jobDescription.trim() || isAnalyzing}
          size="lg"
          className="min-w-[200px]"
        >
          {isAnalyzing ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Analyzing Resume...
            </>
          ) : (
            <>
              <Upload className="mr-2 h-4 w-4" />
              Analyze Resume
            </>
          )}
        </Button>

        {(analysisResult || error) && (
          <Button
            onClick={resetForm}
            variant="outline"
            size="lg"
            disabled={isAnalyzing}
          >
            Start Over
          </Button>
        )}
      </div>

      {/* Analysis Loading State */}
      {isAnalyzing && (
        <Card className="mt-8">
          <CardContent className="pt-6">
            <div className="flex flex-col items-center justify-center py-8 space-y-4">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
              <div className="text-center space-y-2">
                <h3 className="text-lg font-semibold">Analyzing Your Resume</h3>
                <p className="text-muted-foreground">
                  Our AI is comparing your resume against the job description...
                </p>
                <p className="text-sm text-muted-foreground">
                  This may take a few moments
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Analysis Results */}
      {analysisResult && !error && (
        <div 
          ref={resultsRef} 
          className="mt-12 pt-8 border-t border-border animate-in fade-in slide-in-from-bottom-4 duration-500"
        >
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-primary mb-2">Analysis Results</h2>
            <p className="text-muted-foreground">
              Here&apos;s what our AI found when comparing your resume to the job description
            </p>
          </div>
          <AnalysisResults result={analysisResult} />
        </div>
      )}
    </div>
  );
}
