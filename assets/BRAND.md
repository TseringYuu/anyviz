# AnyViz identity

The README wordmark contains only the lowercase letters `anyviz`, with no
accompanying symbol or decorative graphics. Its outlined geometry renders
consistently without installed fonts. The earlier icon files are retained for
compatibility with other surfaces, but are not used in the README.

- `wordmark.svg` / `icon.svg`: transparent, automatically adapt to the viewer's
  `prefers-color-scheme` where supported.
- `*-light.svg`: dark ink, cobalt and teal, for light backgrounds.
- `*-dark.svg`: pale ink and lighter data colors, for dark backgrounds.
- GitHub READMEs use `<picture>` sources so the chosen asset also follows
  GitHub's theme. Keep the automatic SVG as the fallback.

Regenerate all six files with `python3 scripts/build_brand.py` (standard library
only). `python3 scripts/make_wordmark.py` also forwards to the current generator.
Keep the README wordmark monochrome and transparent; do not append a symbol
or add a background rectangle. The older animated banner/GIF artwork is retained as
legacy demonstration material and is not the primary logo.
