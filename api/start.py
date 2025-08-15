#!/usr/bin/env python3
"""
Development server runner for the AI Resume Analyzer API
"""
import subprocess
import sys
import os
from pathlib import Path

def main():
    """Start the development server"""
    try:
        # Change to api directory
        api_dir = Path(__file__).parent
        os.chdir(api_dir)
        
        print("🚀 Starting AI Resume Analyzer API...")
        print("📁 Working directory:", api_dir)
        print("🌐 Server will be available at: http://localhost:8000")
        print("📖 API docs will be available at: http://localhost:8000/docs")
        print("\n" + "="*50)
        
        # Run uvicorn with reload
        subprocess.run([
            sys.executable, "-m", "uvicorn", 
            "analyze:app", 
            "--reload", 
            "--host", "0.0.0.0", 
            "--port", "8000",
            "--log-level", "info"
        ])
        
    except KeyboardInterrupt:
        print("\n🛑 Shutting down development server...")
    except FileNotFoundError:
        print("❌ Error: uvicorn not found. Please install dependencies:")
        print("   pip install -r requirements.txt")
    except Exception as e:
        print(f"❌ Error starting server: {e}")

if __name__ == "__main__":
    main()
