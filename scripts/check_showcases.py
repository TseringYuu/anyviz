#!/usr/bin/env python3
"""Static showcase contracts; run browser QA separately."""
from pathlib import Path
import re, subprocess, sys
r = Path(__file__).resolve().parents[1]
for name in ['city-geo','ecommerce-retail','finance-trading','iot-energy']:
    h = (r/'examples'/name/'index.html').read_text()
    assert 'demo-shell.css' in h and 'demo-shell.js' in h, name
    assert re.search(r'<html[^>]*lang="en"', h), name
for asset in ['demo-shell.css','demo-shell.js']:
    assert (r/'examples/common'/asset).is_file()
p = r/'examples/report-studio'
assert len(list((p/'charts').glob('*.svg'))) == 6
assert (p/'report.pdf').read_bytes().startswith(b'%PDF')
assert (p/'preview.png').is_file()
subprocess.run([sys.executable, str(p/'build.py')],check=True)
assert (r/'README.md').read_text() == (r/'README.en.md').read_text()
print('Showcase contracts passed: 4 dashboards + 6 report figures; PDF present; English README parity.')
