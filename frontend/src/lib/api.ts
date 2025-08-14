import { AnalysisResponse } from '@/types/api';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

export const analyzeResume = async (resumeFile: File, jobDescription: string): Promise<AnalysisResponse> => {
  const formData = new FormData();
  formData.append('resume', resumeFile);
  formData.append('job_desc', jobDescription);

  const response = await fetch(`${API_BASE_URL}/api/analyze`, {
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
  
  // Optional: Add file size validation (max 10MB)
  const maxSize = 10 * 1024 * 1024; // 10MB in bytes
  if (file.size > maxSize) {
    throw new Error('File size must be less than 10MB');
  }
};
