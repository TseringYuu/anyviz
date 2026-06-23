# Changelog

All notable changes to anyviz are documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

本变更日志遵循 [Keep a Changelog](https://keepachangelog.com/zh-CN/1.1.0/) 格式与
[语义化版本](https://semver.org/lang/zh-CN/) 规范。

## [1.0.1] - 2026-06-17

### Added 新增

- `guides/legend-layout.md` — legend positioning rules covering viewBox bounds checking,
  label collision avoidance, 2×N grid layout for ≥4 items, horizontal centering, and
  academic theme line-style differentiation. Based on real-world layout bugs encountered
  in multi-chart document generation.
  图例布局规则：viewBox 边界检查、标签避让、4 项以上 2×N 网格、水平居中、学术主题线型冗余。
  基于多图表文档生成中遇到的实际布局 bug 总结。
- `aesthetics/themes/academic.json` — added `line_style_differentiation` section defining
  stroke-dasharray mapping for series 0-4+ (solid / long-dash / short-dash / dotted / cycle).
  Academic 主题新增线型差异化配置，定义系列 0-4+ 的 stroke-dasharray 映射。
- `templates/charts/bar-chart.md` — added design points 6-7 (negative bar label clearance,
  horizontal diverging bar label separation) and expanded Diverging Bar variant with
  concrete layout diagrams and common-error callouts.
  柱状图模板新增负值标签避让规则和横向双向条形图标签分侧规则。
- `templates/charts/radar-chart.md` — added design points 7-8 (legend vs dimension label
  avoidance, academic theme multi-entity line-style differentiation).
  雷达图模板新增图例与维度标签避让规则和学术主题多实体线型区分规则。
- `templates/charts/line-chart.md` — added design points 6-7 (legend bounds checking,
  dual-axis legend annotation).
  折线图模板新增图例边界检查和双轴图例标注规则。

## [1.0.0] - 2026-05-28

### Added 新增

- Initial public release. 初始公开发布。
- **Chart template library: 34 templates** / 图表模板库 34 种:
  - `charts/` (20): bar, line, scatter, area, pie/donut, histogram, box plot, heatmap,
    radar, waterfall, density, waffle, dot, slope, small multiples, calendar heatmap,
    candlestick, hexbin, parallel coordinates, scatter matrix
    （柱状、折线、散点、面积、饼/环、直方图、箱线、热力、雷达、瀑布、密度、华夫、点图、
    坡度、小倍数、日历热力、烛台、六边形分箱、平行坐标、矩阵散点）
  - `maps/` (3): choropleth, bubble map, flow map（面量图、气泡地图、流向地图）
  - `graphs/` (8): sankey, chord, force-directed, treemap, sunburst, dendrogram,
    arc diagram, alluvial（桑基、和弦、力导向、树图、旭日、树形、弧形、冲积）
  - `3d/` (3): globe, scatter 3D, surface（3D 地球、3D 散点、曲面）
- `templates/TEMPLATE-SPEC.md` — unified five-section template specification.
  统一五段式模板规范。
- Four built-in themes: `modern`, `analytics`, `dashboard`, `academic`.
  四套内置主题。
- Five-stage visualization pipeline: analysis → aesthetics → adaptation → consistency → accessibility.
  五阶段可视化流水线。
- Multi-stack adapters: D3.js, ECharts, Mapbox, Three.js (web); Plotly, Matplotlib (Python);
  ggplot2 (R). 多技术栈适配器。
- Authoritative aesthetic spec in `aesthetics/default.json` plus `color.md`, `typography.md`,
  `layout.md`. 权威美学规范。
- Decision guides: `chart-selection.md`, `color-guide.md`, `consistency-rules.md`,
  `customization-guide.md`, `accessibility.md`. 决策、定制与无障碍指南。
- `scripts/theme_validator.py` for automated theme-consistency validation.
  主题一致性校验脚本。
- Open-source community files: `CONTRIBUTING.md`, `CODE_OF_CONDUCT.md`, `SECURITY.md`,
  GitHub issue/PR templates, and CI workflow. 开源社区配套与 CI。
- SVG brand assets: `assets/banner.svg`, `assets/wordmark.svg`.
  纯 SVG 品牌视觉资产。
- npm package entry (`package.json`, `index.js`). npm 程序化入口。

### Changed 变更

- All templates completed to the five-section structure.
  所有模板补齐五段式结构。
- Aesthetic guides expanded: palette generation, dark themes, number typography, label de-overlap,
  multi-chart grid layout, responsive design, interaction consistency.
  审美指南扩充：色板生成、深色主题、数字排版、标签防重叠、多图布局、响应式、交互一致性。
- `examples/` restructured into runnable `.html` files with per-scenario READMEs.
  示例重构为可运行 HTML + 场景 README。
- `README.md` / `README.en.md` rewritten with SVG banner and corrected figures.
  README 重写，更新横幅与事实数据。

### Fixed 修复

- `scripts/theme_validator.py`: per-chart validation for top-level `charts` arrays;
  default-palette prefixes no longer flagged as customizations.
  修复多图表校验漏检；默认色板前缀不再误报为定制。

### Removed 移除

- Legacy raster logo and pre-rendered promo media, replaced by SVG assets.
  移除旧位图 logo 与预渲染宣传素材。

[1.0.1]: https://github.com/TseringYuu/anyviz/compare/v1.0.0...v1.0.1
[1.0.0]: https://github.com/TseringYuu/anyviz/releases/tag/v1.0.0
