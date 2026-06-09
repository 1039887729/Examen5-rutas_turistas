from PyPDF2 import PdfReader
p = r"C:\Users\crica\Downloads\Examen 5 - Programacion Web 2.pdf"
reader = PdfReader(p)
for i, page in enumerate(reader.pages, start=1):
    text = page.extract_text() or ''
    print(f"\n---PAGE {i}---\n")
    print(text)
