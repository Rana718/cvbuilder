import pytesseract
from PyPDF2 import PdfReader
from PIL import ImageFilter, ImageOps
from pdf2image import convert_from_path

def preprocess_image(img):
    """Preprocess image for better OCR"""
    return ImageOps.autocontrast(ImageOps.grayscale(img).filter(ImageFilter.SHARPEN))

def extract_text_from_pdf(path):
    """Extract text from PDF using PyPDF2 with OCR fallback"""
    text = ""
    try:
        reader = PdfReader(path)
        images = convert_from_path(path)
        
        for i, page in enumerate(reader.pages):
            page_text = page.extract_text() or ""
            
            if not page_text.strip() and i < len(images):
                page_text = pytesseract.image_to_string(preprocess_image(images[i]))
            
            text += page_text + "\n"
    except Exception as e:
        print(f"❌ PDF extraction failed for {path}: {e}")
    
    return text.strip()
