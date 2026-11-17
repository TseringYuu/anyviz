# Reusable authoring brief

This is a reusable task brief, **not** a transcript of the reference implementation's creation. Model and agent choices can change output. The checked-in example is generated deterministically by `build.py`.

> Use the AnyViz skill and its Analytics theme to make a three-page A4 commerce performance report from the CSV files in `data/`. Every business value is synthetic and must be labeled as such. Use six charts: monthly revenue, average order value, revenue by channel, regional H1/H2 comparison, gross margin, and return rate. Compute totals and AOV from the CSV rather than inventing numbers. Reconcile the channel and regional totals against monthly revenue. Give charts consistent type, units, source notes and captions. Explain any truncated axis; use zero-based bars; keep margin and returns on separate axes. Retain clear legends, vector graphics, readable print sizing and no clipped labels. Deliver HTML, PDF, standalone SVGs and a reproducible generator. Do not claim causality, customer results, time savings or model superiority. Check the final PDF pages at actual size.

## Optional fair comparison protocol

If you run a real with/without-AnyViz comparison, record the model ID, agent/version, date, exact same input files, initial prompt, tool access, attempt count and manual edits for both runs. Keep all attempts. Assess arithmetic, readability at final page size, caption consistency, label overlap and edit effort. Publish actual outputs and limitations. Do not use this reference implementation as if it were an unedited model output.
