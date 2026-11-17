#!/usr/bin/env python3
"""Keep the logo scalable, theme-safe and reproducible without third-party code."""
from pathlib import Path
import xml.etree.ElementTree as ET
from build_brand import svg
ROOT=Path(__file__).resolve().parents[1]
for mode,suffix in [('auto',''),('light','-light'),('dark','-dark')]:
    for name,icon in [('wordmark',False),('icon',True)]:
        path=ROOT/'assets'/f'{name}{suffix}.svg'
        content=path.read_text()
        assert content==svg(mode,icon), f'{path.name} is out of sync with generator'
        root=ET.fromstring(content)
        assert root.attrib.get('viewBox')
        assert not any(e.tag.rsplit('}',1)[-1] in ('script','image','text','foreignObject') for e in root.iter())
        assert 'http' not in content.replace('http://www.w3.org/2000/svg','')
        if mode=='auto': assert '@media(prefers-color-scheme:dark)' in content
for name in ['README.md','README.en.md','README.zh-CN.md']:
    text=(ROOT/name).read_text()
    for mode in ['dark','light']:
        assert f'media="(prefers-color-scheme: {mode})" srcset="assets/wordmark-{mode}.svg"' in text
    assert 'src="assets/wordmark.svg"' in text
print('Six font-independent brand assets and README theme sources verified.')
