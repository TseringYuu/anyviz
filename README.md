<p align="center">
  <picture>
    <source media="(prefers-color-scheme: dark)" srcset="assets/wordmark-dark.svg">
    <source media="(prefers-color-scheme: light)" srcset="assets/wordmark-light.svg">
    <img src="assets/wordmark.svg" alt="anyviz" width="280" height="102">
  </picture>
</p>

<h1 align="center">Tell AI the goal. Let it work out the chart.</h1>

<p align="center">An open-source skill that helps AI agents choose and create visualizations for the task at hand.<br>From a single chart to a report or dashboard, without making you direct every design decision.</p>

<p align="center"><b>English</b> · <a href="README.zh-CN.md">简体中文</a> · <a href="https://anyviz.aiware.store">Website</a> · <a href="examples/">Examples</a></p>
<p align="center"><a href="LICENSE"><img src="https://img.shields.io/badge/license-MIT-4269d0?style=flat-square" alt="MIT license"></a> <a href="https://www.npmjs.com/package/anyviz"><img src="https://img.shields.io/npm/v/anyviz?style=flat-square&color=4269d0" alt="Published npm version"></a> <a href="SKILL.md"><img src="https://img.shields.io/badge/Agent_Skill-SKILL.md-3ca951?style=flat-square" alt="Agent Skill"></a></p>

## Your intent, not a chart specification

**Describe what you need to understand or communicate. You should not have to become a visualization designer first.** AnyViz guides your AI agent to interpret the data and usage context, choose suitable charts and a rendering approach, then create and check the output with its available tools.

A report, an interactive dashboard, a research figure, or a quick analysis calls for different decisions. The aim is to let the agent handle chart selection, styling, layout, and consistency, so you can focus on the question and the result. Share constraints you already know; you do not need to prescribe every color, label, or chart type.

## See it across different scenarios

Explore **[Report Studio](examples/report-studio/)** for document figures, or choose an industry dashboard below. These examples show different applications of the same workflow, not a product limited to reports or dashboards.

[![Report Studio: complete report page with coordinated figures](examples/report-studio/preview.png)](examples/report-studio/report.pdf)

[Read the actual PDF](examples/report-studio/report.pdf) · [Download Word edition](examples/report-studio/report.docx) · [Explore the source and reproduction steps](examples/report-studio/)

| Make something useful | Explore |
| --- | --- |
| Figures for a report or research document | [Report Studio](examples/report-studio/) · [Publication guide](guides/academic-publication.md) |
| Retail performance overview | [Retail dashboard](examples/ecommerce-retail/) |
| Financial monitoring layout | [Trading dashboard](examples/finance-trading/) |
| Energy and device monitoring | [Energy dashboard](examples/iot-energy/) |
| Geographic and urban analysis | [City dashboard](examples/city-geo/) |

Dashboard previews below use simulated data, not live services or customer deployments.

![Four coordinated dashboard layouts built around AnyViz guidance](assets/showcase.gif)

## What changes with AnyViz?

Your agent already knows how to write chart code. AnyViz gives it a reusable decision process, rather than asking you to supply all the design choices:

- **Understand the task.** Use the data, audience, question, and destination to decide what the visualization needs to communicate.
- **Choose and draw.** Select an appropriate chart and use the project's available stack to generate it, instead of starting from an arbitrary template.
- **Adapt to the context.** Fit the typography, colors, interaction, and layout to the output, whether it is a document figure, an analysis, or a dashboard.
- **Handle the details.** Keep units, entity colors, and formatting coherent; check labels, legends, contrast, and the finished output. Surface missing data or consequential uncertainty instead of inventing an answer.

AnyViz is a skill made of specifications, templates, and workflow instructions. **Your AI agent and its tools do the reasoning and rendering**; AnyViz is not a standalone renderer or an autonomous PDF/Word converter. Capabilities depend on the model and tools available. Review the result and important data before publishing. Examples are demonstrations, not a controlled benchmark or a guarantee of correctness.

## Get started

### 1. Add the skill to your agent

On macOS or Linux, download the installer, review it, then run it:

```sh
curl -fsSL https://raw.githubusercontent.com/TseringYuu/anyviz/main/install.sh -o /tmp/anyviz-install.sh
less /tmp/anyviz-install.sh
sh /tmp/anyviz-install.sh
```

On Windows PowerShell:

```powershell
Invoke-WebRequest https://raw.githubusercontent.com/TseringYuu/anyviz/main/install.ps1 -OutFile anyviz-install.ps1
Get-Content ./anyviz-install.ps1
./anyviz-install.ps1
```

The installer detects supported agent skill directories and installs a shared copy. An unmanaged existing skill is backed up before replacement. See [install.sh](install.sh) and [install.ps1](install.ps1) for the exact behavior. Downloads are pinned to a reviewed commit and checked with SHA-256 before extraction. A saved installer always installs the same snapshot; review a new installer to update. See the [integrity and update policy](docs/installer-security.md).

Prefer manual setup? Clone the repository and ask your assistant to read [`SKILL.md`](SKILL.md), following your agent's instructions for loading custom skills.

### 2. Say what you want to achieve

Once the skill is loaded, start with the data and the outcome. For example:

```text
Use AnyViz to help me understand what changed in this sales data.
Choose and draw the charts that best explain it.
```

```text
Use AnyViz to visualize these results for my research report.
Choose a clear presentation that fits an A4 page.
```

```text
Use AnyViz to build an operations dashboard from this data in our current app.
Help the team see performance and spot what needs attention.
```

You do not need to name a chart type or specify the design details. Add any real constraints you have, such as the audience, output format, or brand colors. The agent can use AnyViz's guides to work out the rest. If key information is missing, it may need to clarify rather than guess.

### 3. Review the result, not every design setting

Check that the result answers your question and that important figures match your source. Refine it in ordinary language, such as “make the regional difference clearer” or “this needs to fit in my report.” The [customization guide](guides/customization-guide.md) helps the agent translate that feedback into design changes; you should not need to micromanage the chart configuration.

## Inside the skill

**Analyze → Aesthetics → Adapt → Consistency → Accessibility**

| Resource | What it provides |
| --- | --- |
| [34 templates](templates/) | 20 statistical charts, 3 maps, 8 relational/hierarchical charts, and 3 three-dimensional charts |
| [4 themes](aesthetics/themes/) | Modern, analytics, dashboard, and academic |
| [7 stack adapters](adapters/) | D3, ECharts, Mapbox, Three.js, Plotly, Matplotlib, and ggplot2 |
| [Chart selection](guides/chart-selection.md) | Data shape and analytical intent → chart choice |
| [Publication rules](guides/academic-publication.md) | Figure size, captions, source notes, grayscale, and export guidance |
| [Legend layout](guides/legend-layout.md) | Safe spacing, collision checks, and visual centering |
| [Consistency](guides/consistency-rules.md) | Shared colors, formats, typography, and spacing |
| [Accessibility](guides/accessibility.md) | Contrast, redundant encoding, and text alternatives |

Adapters are guidance for the named libraries; install the rendering libraries your project needs separately. Map services may require their own credentials. See each adapter for requirements.

## Use the specifications without an agent

The npm package exposes JSON themes and paths to the guides. It does not render charts itself.

```sh
npm install anyviz
```

```js
const anyviz = require('anyviz');
const theme = anyviz.themes.academic();
console.log(theme.publication.export.dpi_min);
console.log(anyviz.guides.academicPublication);
```

Or read [`aesthetics/default.json`](aesthetics/default.json) directly from your preferred language.

## Run and verify locally

```sh
git clone https://github.com/TseringYuu/anyviz.git
cd anyviz
python3 -m http.server 8000
# Open http://localhost:8000/examples/report-studio/
```

The legacy dashboard examples load ECharts from a CDN; internet access is required for that dependency. Their numbers are simulated. See each example's README for its scope and run instructions.

```sh
npm run validate
```

Validation checks theme configuration, package exports, and installer behavior. It is not a visual correctness test: inspect rendered figures and documents too.

## Help shape the next example

Using AnyViz in a report, paper, or dashboard? [Share an issue](https://github.com/TseringYuu/anyviz/issues) with a sanitized screenshot, your agent/model, the prompt, and what worked or failed. Please do not upload private data. Reproducible examples and honest feedback are especially useful.

**If this belongs in your toolkit, star the repository to keep it close.** No account or star is required to use the examples.

Contributions: [guide](CONTRIBUTING.md) · [code of conduct](CODE_OF_CONDUCT.md) · [security](SECURITY.md).

## License and foundations

[MIT](LICENSE). The design guidance draws on Edward Tufte's data-ink principles, Nathan Yau's data storytelling, ColorBrewer palettes, and Viridis. These influences are not endorsements or certifications.
