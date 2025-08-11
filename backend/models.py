# models.py
from pydantic import BaseModel
from typing import List, Optional

class AnalysisResponse(BaseModel):
    score: int
    matching_skills: List[str]
    missing_skills: List[str]
    missing_qualifications: List[str]
    suggestions: List[str]
    raw_ai: Optional[str] = None
    error: Optional[str] = None
