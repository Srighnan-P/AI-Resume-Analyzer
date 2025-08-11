# utils/text_cleaner.py
import re
import json
from typing import Optional

def extract_json(text: str) -> Optional[dict]:
    """
    Try to find the first JSON object in text and parse it.
    Returns dict or None.
    """
    # naive strategy: find first { ... } block that looks like JSON
    match = re.search(r"\{(?:[^{}]|(?R))*\}", text, re.S)
    if not match:
        # fallback: try to find a JSON-like substring (less strict)
        match = re.search(r"\{.*\}", text, re.S)
    if not match:
        return None

    json_str = match.group(0)
    try:
        return json.loads(json_str)
    except Exception:
        # try cleaning common code block fences or markdown
        cleaned = re.sub(r"```(?:json|text)?", "", json_str)
        cleaned = re.sub(r"```\s*$", "", cleaned)
        try:
            return json.loads(cleaned)
        except Exception:
            return None
