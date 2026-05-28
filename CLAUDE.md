# AnyVis - 通用数据可视化 Skill 库

一个开源的数据可视化 Skill 库，提供：
- 智能图表类型选择
- 基于《数据之美》的默认美学规范
- 多技术栈适配（D3.js/ECharts/Mapbox/Three.js/Matplotlib/Plotly/ggplot2）
- 多图表设计一致性保障
- 自然语言美学定制接口

## 目录结构

```
anyvis/
├── SKILL.md                      # Claude Skill 主入口
├── CLAUDE.md                     # 项目文档（本文件）
├── aesthetics/                   # 美学规范
│   ├── default.json              # 默认主题配置（权威来源）
│   ├── typography.md             # 排版规则文档
│   ├── color.md                  # 色彩规则文档
│   └── layout.md                 # 布局规则文档
├── guides/                       # 决策指南
│   ├── chart-selection.md        # 图表选择决策树
│   ├── color-guide.md            # 用色原则
│   └── consistency-rules.md      # 设计一致性规则
├── templates/                    # 图表模板
│   ├── charts/                   # 统计图表
│   │   ├── line-chart.md
│   │   ├── bar-chart.md
│   │   ├── scatter-plot.md
│   │   ├── pie-donut-chart.md
│   │   ├── area-chart.md
│   │   ├── heatmap.md
│   │   ├── radar-chart.md
│   │   ├── box-plot.md
│   │   ├── histogram.md
│   │   └── waterfall-chart.md
│   ├── maps/                     # 地图可视化
│   │   ├── choropleth.md
│   │   ├── bubble-map.md
│   │   └── flow-map.md
│   ├── graphs/                   # 关系与网络图
│   │   ├── force-graph.md
│   │   ├── sankey.md
│   │   ├── treemap.md
│   │   └── chord-diagram.md
│   └── 3d/                       # 三维可视化
│       ├── surface-3d.md
│       ├── scatter-3d.md
│       └── globe-3d.md
├── adapters/                     # 技术栈适配器
│   ├── web/
│   │   ├── d3.md
│   │   ├── echarts.md
│   │   ├── mapbox.md
│   │   └── three.md
│   ├── python/
│   │   ├── matplotlib.md
│   │   └── plotly.md
│   └── r/
│       └── ggplot2.md
├── scripts/                      # 工具脚本
│   └── theme_validator.py        # 主题一致性验证器
└── examples/                     # 示例
    ├── dashboard/                # 仪表盘示例
    ├── report/                   # 报告场景示例
    └── interactive/              # 交互式场景示例
```

## 核心设计原则

### 1. 美学优先
基于 Edward Tufte、《数据之美》（Data Points）等经典著作的原则：
- 最大化数据墨水比（Data-Ink Ratio）
- 避免图表垃圾（Chartjunk）
- 优先使用直接标注而非依赖图例
- 小倍数（Small Multiples）优于动画

### 2. 一致性优于个性化
在没有明确指定的情况下，所有输出遵循统一的默认美学规范。
即使调用者仅定制了颜色，其他属性（字体、间距、线型）仍然从默认规范继承。

### 3. 环境感知
根据调用者的使用场景自动选择最合适的技术栈。
同一份美学规范在不同技术栈下产生视觉一致的输出。

### 4. 可解释性
每次输出都附带图表选择的理由和美学决策的说明。
调用者可以理解并修改任何设计决策。

## 使用方式

### 作为 Claude Skill
在对话中直接描述需求：
- "帮我可视化这份销售数据"
- "用地图展示各省的人口分布"
- "制作一个仪表盘，展示关键业务指标"
- "把这些图表改成深色主题"

### 作为独立库
美学规范文件（`aesthetics/default.json`）可直接被其他工具引用，
适配器中的代码生成指南也可作为各技术栈的最佳实践参考。
