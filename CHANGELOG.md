# Changelog

All notable changes to anyviz are documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

本变更日志遵循 [Keep a Changelog](https://keepachangelog.com/zh-CN/1.1.0/) 格式与
[语义化版本](https://semver.org/lang/zh-CN/) 规范。

## [Unreleased]

### Added 新增

- **Chart template library expanded from 20 to 34 templates** / 图表模板库由 20 种扩充至 34 种:
  - `charts/`: density plot, waffle chart, dot plot, slope chart, small multiples,
    calendar heatmap, candlestick chart, hexbin plot, parallel coordinates, scatter matrix
    （密度图、华夫图、点图、坡度图、小倍数图、日历热力图、烛台图、六边形分箱图、平行坐标图、矩阵散点图）
  - `graphs/`: sunburst, dendrogram, arc diagram, alluvial diagram
    （旭日图、树形图、弧形图、冲积图）
- `templates/TEMPLATE-SPEC.md` — a unified five-section template specification
  (Use Cases / Data Format / Aesthetic Parameters / Design Points / Variants).
  统一模板规范，定义五段式结构。
- `guides/accessibility.md` — accessibility guide covering contrast ratios, colorblind-safe
  palettes, redundant encoding, alt text, and interactive accessibility.
  无障碍指南：对比度、色盲友好色板、冗余编码、替代文本、交互无障碍。
- Pipeline stage 5 (accessibility validation) added to the SKILL workflow.
  工作流新增第 5 阶段：无障碍校验。
- Open-source community files: `CONTRIBUTING.md`, `CODE_OF_CONDUCT.md`, `SECURITY.md`,
  `CHANGELOG.md`, GitHub issue/PR templates, and a CI workflow.
  开源社区配套文件与持续集成工作流。
- SVG brand assets: animated `assets/banner.svg` and static `assets/wordmark.svg`,
  hand-built with a data-visualization motif.
  纯 SVG 品牌视觉：动画横幅与静态字标，内嵌数据可视化意象。

### Changed 变更

- All previously thin templates completed to the five-section structure
  (box plot, histogram, waterfall, radar, all maps/graphs/3d, heatmap, area, pie).
  所有原本单薄的模板补齐至五段式结构。
- Aesthetic guides expanded: `color.md`, `typography.md`, `layout.md`, `consistency-rules.md`
  gained sections on palette generation, dark themes, number typography, label de-overlap,
  multi-chart grid layout, responsive design, and interaction consistency.
  审美指南扩充：色板生成、深色主题、数字排版、标签防重叠、多图网格布局、响应式、交互一致性。
- `examples/` restructured into runnable files: each example is now a real `.html` or `.py`
  plus an explanatory `README.md`, organized by scenario.
  示例重构为可运行文件：真实的 .html/.py + 讲解 README，按场景分目录。
- `README.md` rewritten in English (primary) with `README.zh-CN.md` (Chinese), new SVG banner,
  and corrected figures (34 templates, 5-stage pipeline).
  README 英文化重写并新增中文版，更新动画横幅与事实数据。

### Fixed 修复

- `scripts/theme_validator.py`: configs with a top-level `charts` array are now validated
  per-chart with consistency checks enabled automatically. Previously the wrapper object was
  treated as a single chart, causing multi-chart issues to go undetected. Default-palette
  prefixes are no longer flagged as customizations.
  修复多图表校验漏检：顶层含 charts 数组时自动逐图校验并启用一致性检查；默认色板前缀不再误报为定制。

### Removed 移除

- Legacy raster logo (`assets/Gemini_Generated_Image_*.png`) and pre-rendered promo media,
  replaced by self-contained SVG assets.
  移除旧的位图 logo 与预渲染宣传素材，改用自包含 SVG。

## [1.0.0] - 2026-05-28

### Added 新增

- Initial public release. 初始公开发布。
- 20 chart templates across `charts/`, `maps/`, `graphs/`, and `3d/`.
  20 种图表模板，分布于四大类目录。
- Four built-in themes: `modern`, `analytics`, `dashboard`, `academic`.
  四套内置主题。
- Four-stage visualization pipeline: data & intent analysis, golden aesthetic spec,
  multi-stack adaptation, multi-chart consistency validation.
  四阶段可视化流水线。
- Multi-stack adapters: D3.js, ECharts, Mapbox, Three.js (web); Plotly, Matplotlib (Python);
  ggplot2 (R). 多技术栈适配器。
- Authoritative aesthetic spec in `aesthetics/default.json` plus `color.md`, `typography.md`,
  `layout.md`. 权威美学规范。
- Decision guides: `chart-selection.md`, `color-guide.md`, `consistency-rules.md`,
  `customization-guide.md`. 决策与定制指南。
- `scripts/theme_validator.py` for automated theme-consistency validation.
  主题一致性校验脚本。

[Unreleased]: https://github.com/anyviz/anyviz/compare/v1.0.0...HEAD
[1.0.0]: https://github.com/anyviz/anyviz/releases/tag/v1.0.0
