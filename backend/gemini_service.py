# gemini_service.py
import json
import re
import os
import google.generativeai as genai
from dotenv import load_dotenv

load_dotenv()

# Configure Gemini API key from .env
GEMINI_API_KEY = os.getenv("GEMINI_API_KEY")
if not GEMINI_API_KEY:
    raise ValueError("Missing GEMINI_API_KEY in .env file.")

genai.configure(api_key=GEMINI_API_KEY)


def clean_json_string(ai_output: str) -> str:
    """
    Removes markdown code fences and trims whitespace.
    """
    # Remove ```json or ``` markers
    ai_output = re.sub(r"```[a-zA-Z]*\n?", "", ai_output)
    ai_output = ai_output.replace("```", "")
    ai_output = ai_output.strip()
    return ai_output


def parse_gemini_output(ai_output: str) -> dict:
    """
    Cleans and parses Gemini output into Python dict.
    Handles double-parsed JSON and trailing commas.
    """
    cleaned = clean_json_string(ai_output)

    try:
        # First parse
        data = json.loads(cleaned)
        # If the parsed data is a string, it means JSON was double-encoded
        if isinstance(data, str):
            data = json.loads(data)

        # Ensure keys exist
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
    """
    Sends resume text and job description to Gemini API and returns analysis.
    """
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

        # Gemini's raw text output
        ai_output = response.text

        # Parse and clean
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
