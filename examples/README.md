# AnyViz examples

**Start with the destination, not the chart type.** Explore document figures first, or choose a coordinated dashboard below.

| Example | Purpose | Source |
| --- | --- | --- |
| [Report Studio](report-studio/) | Figures designed to remain readable in a document | See the example for its data and reproduction notes |
| [Retail operations](ecommerce-retail/) | Sales trends, category mix, geography, and conversion | Simulated demonstration data |
| [Financial monitoring](finance-trading/) | Candlesticks, market trends, capital flow, and sector comparisons | Simulated demonstration data, not investment information |
| [Energy operations](iot-energy/) | Power curves, energy mix, devices, and alerts | Simulated demonstration data |
| [City overview](city-geo/) | Geography, rankings, footfall, and time patterns | Simulated demonstration data |

## Run locally

From the repository root:

```sh
python3 -m http.server 8000
```

Open `http://localhost:8000/examples/report-studio/`, or replace `report-studio` with a dashboard directory. The dashboard examples load ECharts from a CDN and therefore need internet access. Geographic examples share `common/china.js`.

## What to inspect

- Does each chart answer a clear question?
- Are entity colors, units, labels, and typography consistent?
- Are captions and sources readable without duplication?
- Does the result still work at its intended document size or screen width?
- Can a reader distinguish the series without relying only on color?

These are reference implementations, not live applications, client work, or evidence of measured performance gains. Do not present demonstration values as real-world results. When adapting an example, validate against your own source data and inspect the final export.

[Back to AnyViz](../README.md) · [中文介绍](../README.zh-CN.md)
