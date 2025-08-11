# utils/file_utils.py
from fastapi import UploadFile
from pathlib import Path
import tempfile

def get_suffix(filename: str) -> str:
    return Path(filename).suffix.lower()

async def save_upload_to_tempfile(upload_file: UploadFile) -> str:
    """
    Save an UploadFile to a NamedTemporaryFile and return the path.
    Caller is responsible for removing the file if desired.
    """
    suffix = get_suffix(upload_file.filename)
    with tempfile.NamedTemporaryFile(delete=False, suffix=suffix) as tmp:
        content = await upload_file.read()
        tmp.write(content)
        tmp_path = tmp.name
    return tmp_path
