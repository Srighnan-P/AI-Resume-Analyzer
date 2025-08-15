import { AnalysisResponse } from '@/types/api';
import { formatFileSize } from '@/lib/utils';

const API_BASE_URL = process.env.NODE_ENV === 'production' 
  ? '' // Use relative paths in production (Vercel)
  : process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

export const analyzeResume = async (resumeFile: File, jobDescription: string): Promise<AnalysisResponse> => {
  const formData = new FormData();
  formData.append('resume', resumeFile);
  formData.append('job_desc', jobDescription);

  // Use correct endpoint based on environment
  const endpoint = process.env.NODE_ENV === 'production' 
    ? '/api/analyze'  // For Vercel deployment
    : '/analyze';     // For local development

  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    method: 'POST',
    body: formData,
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({ detail: 'Unknown error occurred' }));
    throw new Error(errorData.detail || `HTTP ${response.status}: ${response.statusText}`);
  }

  return response.json();
};

export const validateFile = (file: File): void => {
  const allowedTypes = ['.pdf', '.docx', '.doc'];
  const fileExtension = file.name.toLowerCase().substring(file.name.lastIndexOf('.'));
  
  if (!allowedTypes.includes(fileExtension)) {
    throw new Error('Please upload a PDF, DOCX, or DOC file');
  }
  
  // Add file size validation (max 10MB)
  const maxSize = 10 * 1024 * 1024; // 10MB in bytes
  if (file.size > maxSize) {
    const currentSize = formatFileSize(file.size);
    const maxSizeFormatted = formatFileSize(maxSize);
    throw new Error(`File size (${currentSize}) exceeds the maximum allowed size of ${maxSizeFormatted}`);
  }
};
