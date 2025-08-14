# config.py
from dotenv import load_dotenv
import os

load_dotenv()

GEMINI_API_KEY = os.getenv("GEMINI_API_KEY")
FRONTEND_ORIGIN = os.getenv("FRONTEND_ORIGIN", "http://localhost:3000")

if not GEMINI_API_KEY:
    # just warn here — fail later when trying to call Gemini
    print("Warning: GEMINI_API_KEY not set. Put it in .env (use .env.example as template).")
