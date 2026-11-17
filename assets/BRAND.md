# AnyViz identity

The connected A/V mark turns plotted points into letterforms: the identity is
about finding a useful visual form for data, not only upward financial growth.
The wordmark is outlined for consistent rendering without installed fonts.

- `wordmark.svg` / `icon.svg`: transparent, automatically adapt to the viewer's
  `prefers-color-scheme` where supported.
- `*-light.svg`: dark ink, cobalt and teal, for light backgrounds.
- `*-dark.svg`: pale ink and lighter data colors, for dark backgrounds.
- GitHub READMEs use `<picture>` sources so the chosen asset also follows
  GitHub's theme. Keep the automatic SVG as the fallback.

Regenerate all six files with `python3 scripts/build_brand.py` (standard library
only). `python3 scripts/make_wordmark.py` also forwards to the current generator.
Keep the mark's open space around the three plotted points; do not add a white
background rectangle. The older animated banner/GIF artwork is retained as
legacy demonstration material and is not the primary logo.
