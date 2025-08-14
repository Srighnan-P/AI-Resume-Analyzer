export interface AnalysisResponse {
  score: number;
  matching_skills: string[];
  missing_skills: string[];
  missing_qualifications: string[];
  suggestions: string[];
  raw_ai?: string;
  error?: string;
}

export interface AnalysisRequest {
  resume: File;
  job_desc: string;
}
