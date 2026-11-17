# Retail operations

An AnyViz reference dashboard demonstrating a coordinated multi-chart canvas.

[Open the demo](index.html) · [All examples](../README.md) · [AnyViz](../../README.md)

## What it shows

Sales and order trends, category mix, regional sales, conversion stages, channels, and product rankings.

The implementation combines native HTML, CSS, and JavaScript with ECharts. It is a runnable example rather than a backend application. Inspect `index.html` and the shared assets in `../common/` for the exact rendering and interaction behavior.

## Run locally

From the repository root:

```sh
python3 -m http.server 8000
```

Open `http://localhost:8000/examples/ecommerce-retail/`. There is no compilation step. The ECharts dependency is loaded from a CDN, so it requires internet access. Geographic examples share the local map registration in `../common/china.js`.

## Data and limits

**All dashboard data is simulated.** Updating numbers and clocks are presentation behavior, not a live service. Currency, order counts, and conversion rates are illustrative. Do not use these values as business evidence.

A production adaptation needs a validated data source, explicit units and update times, accessible alternatives, and appropriate loading, failure, and empty states. Replacing a sample array alone does not make this a production monitoring system.

## Design review

- Preserve entity colors and unit conventions across panels.
- Keep chart titles, labels, legends, and values readable at the actual viewing size.
- Check the layout on narrow screens rather than shrinking a desktop screenshot.
- Use redundant labels or symbols; do not rely on color alone.
- Verify keyboard focus, hover information, reduced motion, and resize behavior.
- Validate every displayed number against the source when replacing the sample data.

For document-oriented figures instead of dashboards, start with [Report Studio](../report-studio/) and the [academic publication guide](../../guides/academic-publication.md).
