import os
import json
import re
from typing import List, Optional
from fastapi import FastAPI, UploadFile, File, Form, HTTPException
from fastapi.middleware.cors import CORSMiddleware
import google.generativeai as genai
import fitz  # PyMuPDF
from docx import Document
import io
from pydantic import BaseModel
from dotenv import load_dotenv

# Load environment variables from .env file
load_dotenv()

# Configure Gemini
GEMINI_API_KEY = os.getenv("GEMINI_API_KEY")
print(f"API Key loaded: {'Yes' if GEMINI_API_KEY else 'No'}")
if GEMINI_API_KEY:
    genai.configure(api_key=GEMINI_API_KEY)
    print("Gemini configured successfully")
else:
    print("WARNING: GEMINI_API_KEY not found in environment variables")

app = FastAPI()

# Enhanced CORS configuration
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "http://127.0.0.1:3000", "*"],  # Added localhost:3000
    allow_credentials=True,
    allow_methods=["GET", "POST", "OPTIONS"],
    allow_headers=["*"],
)

class AnalysisResponse(BaseModel):
    score: int
    matching_skills: List[str]
    missing_skills: List[str]
    missing_qualifications: List[str]
    suggestions: List[str]
    raw_ai: Optional[str] = None
    error: Optional[str] = None

# ... (keep all your existing functions like extract_text_from_pdf_bytes, etc.)

def extract_text_from_pdf_bytes(pdf_bytes: bytes) -> str:
    """Extract text from PDF bytes using PyMuPDF."""
    txt_parts = []
    with fitz.open(stream=pdf_bytes, filetype="pdf") as pdf:
        for page in pdf:
            page_text = page.get_text().strip()
            if page_text:
                txt_parts.append(page_text)
    return "\n\n".join(txt_parts).strip()

def extract_text_from_docx_bytes(docx_bytes: bytes) -> str:
    """Extract text from docx bytes using python-docx."""
    file_like = io.BytesIO(docx_bytes)
    doc = Document(file_like)
    paragraphs = [p.text for p in doc.paragraphs if p.text and p.text.strip()]
    return "\n\n".join(paragraphs).strip()

def extract_text_from_bytes(file_bytes: bytes, filename: str) -> str:
    """Auto-detect PDF or DOCX based on filename suffix and extract text."""
    suffix = filename.lower().strip().split('.')[-1]
    if suffix == "pdf":
        return extract_text_from_pdf_bytes(file_bytes)
    if suffix in ("docx", "doc"):
        return extract_text_from_docx_bytes(file_bytes)
    raise ValueError("Unsupported file type. Only PDF and DOCX are supported.")

def clean_json_string(ai_output: str) -> str:
    """Removes markdown code fences and trims whitespace."""
    ai_output = re.sub(r"```[a-zA-Z]*\n?", "", ai_output)
    ai_output = ai_output.replace("```", "")
    ai_output = ai_output.strip()
    return ai_output

def parse_gemini_output(ai_output: str) -> dict:
    """Cleans and parses Gemini output into Python dict."""
    cleaned = clean_json_string(ai_output)
    
    try:
        data = json.loads(cleaned)
        if isinstance(data, str):
            data = json.loads(data)
        
        return {
            "score": data.get("score", 0),
            "matching_skills": data.get("matching_skills", []),
            "missing_skills": data.get("missing_skills", []),
            "missing_qualifications": data.get("missing_qualifications", []),
            "suggestions": data.get("suggestions", [])
        }
    except json.JSONDecodeError as e:
        return {
            "score": 0,
            "matching_skills": [],
            "missing_skills": [],
            "missing_qualifications": [],
            "suggestions": [],
            "raw_ai": ai_output,
            "error": f"Failed to parse JSON from Gemini: {str(e)}"
        }

def analyze_resume_with_gemini(resume_text: str, job_description: str) -> dict:
    """Sends resume text and job description to Gemini API and returns analysis."""
    if not GEMINI_API_KEY:
        return {
            "score": 0,
            "matching_skills": [],
            "missing_skills": [],
            "missing_qualifications": [],
            "suggestions": [],
            "error": "Gemini API key not configured"
        }
    
    prompt = f"""
You are an AI resume analyzer. Compare the following resume to the job description and return ONLY valid JSON.
Do NOT include any explanations or formatting like ```json.
JSON format:
{{
  "score": int,
  "matching_skills": [string],
  "missing_skills": [string],
  "missing_qualifications": [string],
  "suggestions": [string]
}}

Resume:
{resume_text}

Job Description:
{job_description}
    """

    try:
        model = genai.GenerativeModel("gemini-2.5-flash")
        response = model.generate_content(prompt)
        ai_output = response.text
        return parse_gemini_output(ai_output)
    except Exception as e:
        return {
            "score": 0,
            "matching_skills": [],
            "missing_skills": [],
            "missing_qualifications": [],
            "suggestions": [],
            "error": f"Error calling Gemini API: {str(e)}"
        }

# Add explicit OPTIONS handler for CORS preflight
@app.options("/analyze")
async def analyze_options():
    return {"message": "OK"}

@app.options("/api/analyze")
async def api_analyze_options():
    return {"message": "OK"}

# Main endpoint for local development
@app.post("/analyze", response_model=AnalysisResponse)
async def analyze_endpoint(resume: UploadFile = File(...), job_desc: str = Form(...)):
    """Analyze resume against job description."""
    filename = resume.filename or ""
    suffix = filename.lower().split('.')[-1]
    
    if suffix not in ("pdf", "docx", "doc"):
        raise HTTPException(status_code=400, detail="Unsupported file type. Use PDF or DOCX.")
    
    try:
        content = await resume.read()
        resume_text = extract_text_from_bytes(content, filename)
        
        if not resume_text.strip():
            return AnalysisResponse(
                score=0,
                matching_skills=[],
                missing_skills=[],
                missing_qualifications=[],
                suggestions=[],
                error="Could not extract text from resume."
            )
        
        result = analyze_resume_with_gemini(resume_text, job_desc)
        return AnalysisResponse(**result)
        
    except Exception as e:
        return AnalysisResponse(
            score=0,
            matching_skills=[],
            missing_skills=[],
            missing_qualifications=[],
            suggestions=[],
            error=f"Server error: {str(e)}"
        )

# API endpoint for Vercel deployment
@app.post("/api/analyze", response_model=AnalysisResponse)
async def api_analyze_endpoint(resume: UploadFile = File(...), job_desc: str = Form(...)):
    """API route that mirrors the analyze endpoint for Vercel deployment."""
    return await analyze_endpoint(resume, job_desc)
    """Analyze resume against job description."""
    filename = resume.filename or ""
    suffix = filename.lower().split('.')[-1]
    
    if suffix not in ("pdf", "docx", "doc"):
        raise HTTPException(status_code=400, detail="Unsupported file type. Use PDF or DOCX.")
    
    try:
        content = await resume.read()
        resume_text = extract_text_from_bytes(content, filename)
        
        if not resume_text.strip():
            return AnalysisResponse(
                score=0,
                matching_skills=[],
                missing_skills=[],
                missing_qualifications=[],
                suggestions=[],
                error="Could not extract text from resume."
            )
        
        result = analyze_resume_with_gemini(resume_text, job_desc)
        return AnalysisResponse(**result)
        
    except Exception as e:
        return AnalysisResponse(
            score=0,
            matching_skills=[],
            missing_skills=[],
            missing_qualifications=[],
            suggestions=[],
            error=f"Server error: {str(e)}"
        )

@app.get("/")
async def root():
    return {"message": "AI Resume Analyzer API"}

# Export app for Vercel
app = app