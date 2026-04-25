# ocr_extract.py
# Converts scanned TNPSC PDF to text using OCR (Tamil + English)
# Usage: python ocr_extract.py 11_2025_GRP2A_PAPERII_GS.pdf
#
# Install requirements:
#   pip install pytesseract pdf2image Pillow
#   Download Tesseract: https://github.com/UB-Mannheim/tesseract/wiki
#   Download Tamil language pack: https://github.com/tesseract-ocr/tessdata
#   Place tam.traineddata in: C:\Program Files\Tesseract-OCR\tessdata\

import sys
import os
import pytesseract
from pdf2image import convert_from_path
from PIL import Image

sys.stdout.reconfigure(encoding='utf-8')

# ─── CONFIG ───────────────────────────────────────────────────────────────────
pytesseract.pytesseract.tesseract_cmd = r"C:\Program Files\Tesseract-OCR\tesseract.exe"
POPPLER_PATH = r"C:\poppler\Library\bin"   # download from https://github.com/oschwartz10612/poppler-windows/releases
DPI          = 200                          # higher = better accuracy, slower
LANG         = "eng+tam"                    # English + Tamil OCR
# ──────────────────────────────────────────────────────────────────────────────

def ocr_pdf(pdf_path):
    name    = os.path.splitext(os.path.basename(pdf_path))[0]
    base_dir = name
    os.makedirs(base_dir, exist_ok=True)
    
    out_txt = os.path.join(base_dir, f"{name}_ocr.txt")
    out_dir = os.path.join(base_dir, "ocr_pages")
    os.makedirs(out_dir, exist_ok=True)

    print(f"\n📄 File   : {pdf_path}")
    print(f"🔤 Lang   : {LANG}")
    print(f"🖨️  DPI    : {DPI}")
    print(f"💾 Output : {out_txt}\n")

    print("📷 Converting PDF pages to images...")
    pages = convert_from_path(
        pdf_path,
        dpi=DPI,
        poppler_path=POPPLER_PATH
    )
    print(f"✅ {len(pages)} pages loaded\n")

    all_text = []

    for i, page in enumerate(pages, 1):
        print(f"🔍 OCR page {i}/{len(pages)}...", end="\r")

        # Preprocess: convert to grayscale for better OCR
        gray = page.convert("L")

        # Run OCR
        text = pytesseract.image_to_string(gray, lang=LANG)

        all_text.append(f"\n\n{'='*60}\nPAGE {i}\n{'='*60}\n{text}")

        # Save individual page text (useful for debugging)
        page_file = os.path.join(out_dir, f"page_{i:03d}.txt")
        with open(page_file, "w", encoding="utf-8") as f:
            f.write(text)

    print(f"\n✅ OCR complete — {len(pages)} pages processed")

    # Save full combined text
    full_text = "\n".join(all_text)
    with open(out_txt, "w", encoding="utf-8") as f:
        f.write(full_text)

    print(f"💾 Saved  : {out_txt}")
    print(f"📁 Pages  : {out_dir}/page_001.txt ... page_{len(pages):03d}.txt")
    print(f"\n📊 Stats:")
    print(f"   Total characters : {len(full_text):,}")
    print(f"   Total lines      : {full_text.count(chr(10)):,}")

    return out_txt


if __name__ == "__main__":
    pdf = sys.argv[1] if len(sys.argv) > 1 else "11_2025_GRP2A_PAPERII_GS.pdf"

    if not os.path.exists(pdf):
        print(f"❌ File not found: {pdf}")
        sys.exit(1)

    ocr_pdf(pdf)
