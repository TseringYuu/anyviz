# Brand & Showcase Assets

All visual assets are generated from scripts so they can be reproduced and
tweaked deterministically. Regenerate everything with:

```bash
pip install cairosvg pillow freetype-py matplotlib
python3 scripts/make_wordmark.py     # -> assets/wordmark.svg
python3 scripts/make_banner.py       # -> assets/banner.svg
python3 scripts/make_demo_gif.py     # -> assets/demo.gif
python3 scripts/make_showcase_gif.py # -> assets/showcase.gif
```

| Asset | What it is | Generator |
| :--- | :--- | :--- |
| `wordmark.svg` | Static anyviz wordmark. The "i" dot is a data point; the "z" leads into a rising trend line. Letters are **outlined to vector paths**, so it renders identically everywhere regardless of installed fonts. | `scripts/make_wordmark.py` |
| `banner.svg` | Animated README hero (1280×420). SMIL animations play in GitHub READMEs — bars grow, the trend line draws in, the wordmark rises into place. Shares wordmark geometry with `make_wordmark.py`. | `scripts/make_banner.py` |
| `demo.gif` | Rasterized version of the banner animation, for contexts where SVG/SMIL is not supported. | `scripts/make_demo_gif.py` |
| `showcase.gif` | A montage of full-screen dashboard scenes and small-multiple walls, assembled from the cases in `examples/`, with silky scene-to-scene transitions and no axes or explanatory copy. | `scripts/make_showcase_gif.py` |

## Why outlined paths for the wordmark

The custom "i" and "z" glyphs are positioned relative to where the text "anyv"
ends. If the wordmark used live `<text>`, a viewer without the named font would
fall back to a different font with different glyph widths, shifting the custom
glyphs out of alignment (an "anyv iz" gap). Outlining the letters with FreeType
removes the font dependency entirely.

## High-fidelity video (`hyperframes/`)

The `hyperframes/` project is a separate, richer 1920×1080 animated showcase
built for the [hyperframes](https://www.npmjs.com/package/hyperframes) renderer.
It produces broadcast-quality MP4/WebM but requires a headless Chromium, so it
must be rendered on a machine that has one:

```bash
cd hyperframes
npm run dev      # live preview in the studio
npm run render   # -> hyperframes/renders/*.mp4  (gitignored)
```

Render output lives in `hyperframes/renders/` and is gitignored (the files are
large binaries; regenerate locally rather than committing them).
