# AnyViz identity

The README wordmark contains only the lowercase letters `anyviz`, with no
accompanying symbol or decorative graphics. Its outlined geometry renders
consistently without installed fonts. This is the selected option 01, geometric
modern, with the exact glyph outlines and spacing from the comparison sheet. The earlier icon files are retained for
compatibility with other surfaces, but are not used in the README.

- `wordmark.svg` / `icon.svg`: transparent, automatically adapt to the viewer's
  `prefers-color-scheme` where supported.
- `wordmark-light.svg`: monochrome dark ink for light backgrounds.
- `wordmark-dark.svg`: monochrome pale ink for dark backgrounds.
- GitHub READMEs use `<picture>` sources so the chosen asset also follows
  GitHub's theme. Keep the automatic SVG as the fallback.

Regenerate all six files with `python3 scripts/build_brand.py` (standard library
only). `python3 scripts/make_wordmark.py` also forwards to the current generator.
Keep the README wordmark monochrome and transparent; do not append a symbol
or add a background rectangle. The older animated banner/GIF artwork is retained as
legacy demonstration material and is not the primary logo.

## Wordmark provenance

Option 01 was typeset using **URW Gothic Demi** (`URWGothic-Demi.otf`) from
[Artifex urw-base35-fonts](https://github.com/ArtifexSoftware/urw-base35-fonts),
with tracking of -3 units at a 100-unit type size, then converted into the fixed
six-letter SVG artwork. No font binary, webfont or live font dependency is shipped.

The source font software is distributed under AGPL-3 with a font exception;
see the upstream [LICENSE](https://github.com/ArtifexSoftware/urw-base35-fonts/blob/master/LICENSE)
and [COPYING](https://github.com/ArtifexSoftware/urw-base35-fonts/blob/master/COPYING).
Do not treat the repository's MIT license as permission to redistribute the
source font under MIT or silently add it as a webfont. The supplied artifact
is the fixed wordmark artwork, not a general-purpose font.
