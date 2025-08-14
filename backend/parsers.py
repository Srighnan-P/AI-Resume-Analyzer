# parsers.py
import fitz  # PyMuPDF
from docx import Document
import io
from typing import Optional

def extract_text_from_pdf_bytes(pdf_bytes: bytes) -> str:
    """
    Extract text from PDF bytes using PyMuPDF.
    """
    txt_parts = []
    with fitz.open(stream=pdf_bytes, filetype="pdf") as pdf:
        for page in pdf:
            page_text = page.get_text().strip()
            if page_text:
                txt_parts.append(page_text)
    return "\n\n".join(txt_parts).strip()

def extract_text_from_docx_bytes(docx_bytes: bytes) -> str:
    """
    Extract text from docx bytes using python-docx.
    """
    file_like = io.BytesIO(docx_bytes)
    doc = Document(file_like)
    paragraphs = [p.text for p in doc.paragraphs if p.text and p.text.strip()]
    return "\n\n".join(paragraphs).strip()

def extract_text_from_bytes(file_bytes: bytes, filename: str) -> str:
    """
    Auto-detect PDF or DOCX based on filename suffix and extract text.
    """
    suffix = filename.lower().strip().split('.')[-1]
    if suffix == "pdf":
        return extract_text_from_pdf_bytes(file_bytes)
    if suffix in ("docx", "doc"):
        # python-docx best handles .docx; .doc support is limited
        return extract_text_from_docx_bytes(file_bytes)
    raise ValueError("Unsupported file type. Only PDF and DOCX are supported.")
