#!/usr/bin/env python3
"""Build AnyViz's theme-aware, font-independent SVG identity (standard library)."""
from pathlib import Path
ROOT = Path(__file__).resolve().parents[1]
# Frozen outlined wordmark geometry: no runtime font, external image or script.
WORD_PATH = 'M61.5 -55.4H49.3V-48C44.7 -54.1 39.2 -56.7 31.2 -56.7C14.8 -56.7 3 -44.4 3 -27.5C3 -10.8 14.7 1.3 30.9 1.3C38.7 1.3 44 -1.1 49.3 -7.2V0H61.5ZM32.6 -44.5C42.1 -44.5 48.9 -37.4 48.9 -27.3C48.9 -23.3 47.3 -18.7 44.9 -15.9C42.2 -12.6 37.9 -10.9 32.8 -10.9C23.1 -10.9 16.4 -17.5 16.4 -27.2C16.4 -37.3 23.1 -44.5 32.6 -44.5Z M68.4 0H81.7V-26.1C81.7 -33.5 82.2 -36.7 83.9 -39.4C86 -42.7 89.4 -44.5 93.7 -44.5C97.2 -44.5 99.9 -43.3 101.7 -41C103.5 -38.6 104.3 -34.5 104.3 -27.1V0H117.6V-29.7C117.6 -39.6 116.6 -44.4 113.6 -48.7C110 -53.9 104 -56.7 96.3 -56.7C89.9 -56.7 85.6 -54.9 80.7 -50.1V-55.4H68.4Z M130.5 18.5H144.8L176.8 -55.4H161.4L148.1 -19.5L135.8 -55.4H120.6L140.9 -5.2Z M197.4 0H208L230.3 -55.4H215.3L202.7 -18.7L189.9 -55.4H175.1Z M233.4 0H246.7V-55.4H233.4ZM233.4 -61.4H246.7V-73.9H233.4Z M251 0H293.2V-11.9H266.9L291.3 -43.5V-55.4H253.8V-43.5H275.4L251 -11.9Z'
WORD_TRANSFORM = 'translate(47.513 23.000) scale(0.84416) translate(-3.000 73.900)'
MARK = '''<g mask="url(#node-space)" fill="none" stroke-width="8" stroke-linejoin="round">
<path d="M25 48H53" class="teal"/>
<path d="M10 68L37 18L67 68" class="blue"/>
<path d="M67 68L94 18" class="teal"/>
</g>
<g class="blue-fill"><circle cx="10" cy="68" r="5"/><circle cx="37" cy="18" r="5"/></g>
<circle class="teal-fill" cx="67" cy="68" r="5"/>'''

def svg(mode='auto', icon=False):
    # README identity is only the lowercase letters, with no accompanying mark.
    if not icon:
        ink = '#F1F4FA' if mode == 'dark' else '#18202D'
        style = f'.ink{{fill:{ink}}}'
        if mode == 'auto':
            style += '@media(prefers-color-scheme:dark){.ink{fill:#F1F4FA}}'
        return f'''<svg xmlns="http://www.w3.org/2000/svg" width="340" height="124" viewBox="0 0 340 124" role="img" aria-labelledby="word-title word-desc">
<title id="word-title">anyviz</title>
<desc id="word-desc">anyviz in lowercase outlined letters.</desc>
<style>{style}</style>
<g transform="{WORD_TRANSFORM}"><path class="ink" d="{WORD_PATH}"/></g>
</svg>
'''
    light = '.ink{fill:#182235}.blue{stroke:#365FD1}.teal{stroke:#19897E}.blue-fill{fill:#365FD1}.teal-fill{fill:#19897E}'
    dark = '.ink{fill:#F0F4FC}.blue{stroke:#88A5FF}.teal{stroke:#64D6C4}.blue-fill{fill:#88A5FF}.teal-fill{fill:#64D6C4}'
    style = dark if mode == 'dark' else light
    if mode == 'auto':
        style += '@media(prefers-color-scheme:dark){' + dark + '}'
    width = 104 if icon else 296
    body = MARK if icon else MARK + f'<path class="ink" d="{WORD_PATH}"/>'
    return f'''<svg xmlns="http://www.w3.org/2000/svg" width="{width}" height="88" viewBox="0 0 {width} 88" role="img" aria-labelledby="brand-title brand-desc">
<title id="brand-title">AnyViz</title>
<desc id="brand-desc">An A/V monogram drawn as connected data points, paired with the AnyViz wordmark.</desc>
<style>{style}</style>
<defs><mask id="node-space"><rect width="104" height="88" fill="white"/><g fill="black"><circle cx="10" cy="68" r="8"/><circle cx="37" cy="18" r="8"/><circle cx="67" cy="68" r="8"/></g></mask></defs>
{body}
</svg>
'''

def write_assets():
    for mode, suffix in [('auto',''),('light','-light'),('dark','-dark')]:
        for name, icon in [('wordmark',False),('icon',True)]:
            (ROOT/'assets'/f'{name}{suffix}.svg').write_text(svg(mode,icon))
    print('Built six theme-aware AnyViz SVG assets.')

if __name__ == '__main__':
    write_assets()
