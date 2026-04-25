# split_pdf.py
# Usage: python split_pdf.py 11_2025_GRP2A_PAPERII_GS.pdf
# Needs: pip install pypdf2

import sys
import math
from PyPDF2 import PdfReader, PdfWriter

file = sys.argv[1] if len(sys.argv) > 1 else "11_2025_GRP2A_PAPERII_GS.pdf"

reader = PdfReader(file)
total  = len(reader.pages)
parts  = 3
size   = math.ceil(total / parts)

print(f"📄 Total pages: {total}")
print(f"✂️  Splitting into {parts} parts of ~{size} pages each\n")

for i in range(parts):
    start  = i * size
    end    = min(start + size, total)
    writer = PdfWriter()

    for page_num in range(start, end):
        writer.add_page(reader.pages[page_num])

    out = f"part{i+1}.pdf"
    with open(out, "wb") as f:
        writer.write(f)

    print(f"✅ part{i+1}.pdf — pages {start+1} to {end} ({end-start} pages)")

print("\n🎉 Done! Now run:")
print("   node extract.mjs part1.pdf 2026 GRP2A-1")
print("   node extract.mjs part2.pdf 2026 GRP2A-2")
print("   node extract.mjs part3.pdf 2026 GRP2A-3")
