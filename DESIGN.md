# AnyViz showcase design

## Intent
English-first, document-first evidence for developers discovering the skill. Show a reproducible finished artifact before architectural claims. Preserve Chinese documentation as a linked alternative. No fake metrics, customer endorsements, performance benchmarks or live-feed claims.

## Visual system
- Report Studio: white printed pages on a cool blue-gray work surface; navy text, Analytics palette; physical A4 geometry; clear figure captions and unit labels.
- Dashboard demonstrations: navy exhibition shell and blue navigation/focus accents; shared shell tokens in `examples/common/demo-shell.css`; chart semantics remain distinct.
- All examples explicitly disclose synthetic data. Report Studio is deterministic reference code, not a recorded one-prompt model result.

## Interaction contract
Use native links and buttons, visible keyboard focus, responsive reading order, and reduced-motion handling. Pause/resume simulation has consistent labels across dashboards. Every example links to the repository and other work. Printed report hides navigation and controls.

## Verification
Check 1440px and 390px viewport widths; no document-level horizontal overflow. Check loaded chart count, JavaScript errors, data reconciliation, print page count and captions at output size. Do not equate a passing static check with visual review.
