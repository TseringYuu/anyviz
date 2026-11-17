#!/usr/bin/env python3
"""Optional PDF export: Chrome + pypdf. Render pages separately for stable pagination."""
import os,pathlib,subprocess,tempfile,shutil
from pypdf import PdfReader,PdfWriter
P=pathlib.Path(__file__).resolve().parent
chrome=os.environ.get('CHROME_BIN') or shutil.which('google-chrome') or '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome'
if not pathlib.Path(chrome).exists():raise SystemExit('Set CHROME_BIN to your Chrome executable.')
source=(P/'index.html').read_text(); writer=PdfWriter()
with tempfile.TemporaryDirectory() as tmp:
    for i in range(1,4):
        fd,name=tempfile.mkstemp(prefix='.report-export-',suffix='.html',dir=P)
        os.close(fd); f=pathlib.Path(name)
        try:
            f.write_text(source.replace('</head>',f'<style>@media print{{.page:not(:nth-child({i})){{display:none!important}}.page{{break-after:auto!important}}}}</style></head>'))
            dest=pathlib.Path(tmp)/f'page-{i}.pdf'
            subprocess.run([chrome,'--headless','--disable-gpu','--no-pdf-header-footer',f'--print-to-pdf={dest}',f.as_uri()],check=True,stdout=subprocess.DEVNULL,stderr=subprocess.DEVNULL)
            doc=PdfReader(dest)
            if len(doc.pages)!=1:raise RuntimeError(f'Page {i} overflowed: {len(doc.pages)} pages')
            writer.add_page(doc.pages[0])
        finally:f.unlink()
    writer.add_metadata({'/Title':'Report Studio — AnyViz','/Author':'AnyViz','/Subject':'Synthetic data visualization reference report'})
    with (P/'report.pdf').open('wb') as out:writer.write(out)
print('Exported report.pdf: 3 A4 pages.')
