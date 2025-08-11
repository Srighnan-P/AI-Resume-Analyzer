# main.py
import traceback
from fastapi import FastAPI, UploadFile, File, Form, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from pathlib import Path
import os
from models import AnalysisResponse
from parsers import extract_text_from_bytes
from gemini_service import analyze_resume_with_gemini
from config import FRONTEND_ORIGIN

app = FastAPI(title="Resume Analyzer API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=[FRONTEND_ORIGIN] if FRONTEND_ORIGIN else ["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.post("/api/analyze", response_model=AnalysisResponse)
async def analyze_endpoint(resume: UploadFile = File(...), job_desc: str = Form(...)):
    """
    Accepts multipart form with:
      - resume: UploadFile (pdf/docx)
      - job_desc: string (form field)
    Returns machine-friendly JSON analysis.
    """
    # Basic validation
    filename = resume.filename or ""
    suffix = Path(filename).suffix.lower()
    if suffix not in (".pdf", ".docx", ".doc"):
        raise HTTPException(status_code=400, detail="Unsupported file type. Use PDF or DOCX.")

    try:
        # Read bytes
        content = await resume.read()
        # Extract text
        resume_text = extract_text_from_bytes(content, filename)
        # Sanity check
        if not resume_text.strip():
            return JSONResponse(status_code=200, content={
                "score": 0,
                "matching_skills": [],
                "missing_skills": [],
                "missing_qualifications": [],
                "suggestions": [],
                "raw_ai": None,
                "error": "Could not extract text from resume."
            })

        # Call Gemini analysis
        ai_result = analyze_resume_with_gemini(resume_text, job_desc)
        # Ensure shape matches AnalysisResponse
        return ai_result

    except HTTPException:
        raise
    except Exception as exc:
        traceback.print_exc()
        return JSONResponse(status_code=500, content={
            "score": 0,
            "matching_skills": [],
            "missing_skills": [],
            "missing_qualifications": [],
            "suggestions": [],
            "raw_ai": None,
            "error": f"Server error: {exc}"
        })
