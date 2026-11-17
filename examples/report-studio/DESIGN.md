# Report Studio design contract

Audience: developers evaluating document visualization and analysts reproducing the example. Single job: show an entire readable report with inspectable sources.

Palette: Analytics blue #5B7FBD, green #6AA66A, coral #D4756B are read from `aesthetics/themes/analytics.json`; ink #19354A, muted #536574, grid #DFE5EA are editorial adaptations. White paper on #E9EEF2 surroundings. Typography: Arial/Helvetica for portable, stable print metrics; size and weight carry hierarchy rather than decorative fonts. Signature: an uninterrupted three-page report, not dashboard cards.

`build.py` owns SVG, content and inline styles. `index.html` and `charts/*.svg` are generated. All figures use 660×240 viewBoxes. Captions live outside plots. Mobile uses natural document scrolling; print uses fixed A4 pages and reserved footer space. Buttons are native, keyboard focus is visible, images have alternatives. No animation, telemetry or external rendering dependency.

Maintain CSV reconciliation and honest synthetic-data disclosure. Do not add fake benchmarks, unexplained KPIs, dual axes or clipped annotations.
