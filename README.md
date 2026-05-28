<p align="center">
  <img src="assets/logo.svg" alt="AnyVis" width="180">
</p>

# AnyVis

通用数据可视化 Skill 库 — 为 Claude 和其他 AI 助手提供智能图表选择、默认美学规范、多技术栈适配和设计一致性保障。

## 特性

- **智能图表选择**：根据数据特征和用户意图自动推荐最佳图表类型，覆盖 40+ 种可视化场景
- **数据美学规范**：基于 Edward Tufte、《数据之美》（Data Points）等经典著作，提供感知均匀、色盲友好的默认主题
- **多技术栈适配**：前端 D3.js（默认）/ ECharts / Mapbox / Three.js，Python Matplotlib / Plotly，R ggplot2
- **多图表一致性**：同组件的字体/颜色/样式跨图表统一，附带自动校验工具
- **自然语言定制**：支持"深色主题""极简风格""字体大一点"等自然语言调整美学参数

## 快速开始

### 作为 Claude Skill

将此仓库克隆到本地，在 Claude 对话中直接使用自然语言描述需求：

```
帮我可视化这份销售数据
用地图展示各省的人口分布
制作一个仪表盘，展示关键业务指标
把这些图表改成深色主题
```

Claude 会自动加载 `SKILL.md`，按 4 阶段工作流处理：分析数据与意图 → 应用美学规范 → 选择技术栈适配 → 一致性校验。

### 作为独立美学库

美学规范文件可直接被其他工具引用：

```python
import json
with open('aesthetics/default.json') as f:
    theme = json.load(f)
    print(theme['color']['categorical']['palette'])
    print(theme['typography']['scale']['h1'])
```

## 目录结构

```
anyvis/
├── README.md                     # 项目文档（本文件）
├── LICENSE                       # MIT 开源协议
├── SKILL.md                      # Claude Skill 主入口
├── CLAUDE.md                     # Claude 运行时上下文
├── aesthetics/                   # 美学规范
│   ├── default.json              # 默认主题配置（权威来源）
│   ├── typography.md             # 排版规则
│   ├── color.md                  # 色彩规则
│   └── layout.md                 # 布局规则
├── guides/                       # 决策指南
│   ├── chart-selection.md        # 图表选择决策树
│   ├── color-guide.md            # 用色原则
│   ├── consistency-rules.md      # 设计一致性规则
│   └── customization-guide.md    # 自然语言定制指南
├── templates/                    # 图表模板
│   ├── charts/                   # 统计图表（10 种）
│   ├── maps/                     # 地图可视化（3 种）
│   ├── graphs/                   # 关系与网络图（4 种）
│   └── 3d/                       # 三维可视化（3 种）
├── adapters/                     # 技术栈适配器
│   ├── web/                      # D3.js / ECharts / Mapbox / Three.js
│   ├── python/                   # Matplotlib / Plotly
│   └── r/                        # ggplot2
├── scripts/                      # 工具脚本
│   └── theme_validator.py        # 主题一致性验证器
└── examples/                     # 示例
    ├── dashboard/                # 仪表盘示例
    ├── report/                   # 报告场景示例
    └── interactive/              # 交互式场景示例
```

## 核心设计原则

### 1. 美学优先
最大化数据墨水比（Data-Ink Ratio）、避免图表垃圾（Chartjunk）、优先使用直接标注而非依赖图例、小倍数（Small Multiples）优于动画。

### 2. 一致性优于个性化
未指定的属性从默认规范继承。调用者仅定制颜色时，字体、间距、线型等仍然统一。

### 3. 环境感知
根据调用者的使用场景自动选择最合适的技术栈。同一份美学规范在不同技术栈下产生视觉一致的输出。

### 4. 可解释性
每次输出附带图表选择理由和美学决策说明，调用者可以理解并修改任何设计决策。

## 技术栈选择策略

| 场景 | 技术栈 |
|------|--------|
| Web 前端（默认） | D3.js |
| Web 前端（项目已有 ECharts） | ECharts |
| 地理可视化 | Mapbox / D3.js |
| 3D 场景 | Three.js |
| Python 数据分析 | Plotly |
| Python 学术出版 | Matplotlib |
| R 统计可视化 | ggplot2 |

## 自然语言定制示例

| 描述 | 效果 |
|------|------|
| "深色主题" | 背景 #1A1A1A，文字 #E8E8E8，色板亮度 +15% |
| "极简风格" | 去除网格线和多余边框 |
| "字体大一点" | 所有层级字号 ×1.15 |
| "主色用品牌色 #FF6600" | categorical[0] = #FF6600 |
| "适合手机看" | 宽高比 1:1，字号和边距适配小屏 |

更多定制选项见 `guides/customization-guide.md`。

## 许可

MIT License - 详见 [LICENSE](LICENSE)

## 参考

- Edward Tufte, *The Visual Display of Quantitative Information*
- Nathan Yau, *Data Points: Visualization That Means Something*
- ColorBrewer 2.0 — Color Advice for Cartography
- Viridis — Perceptually Uniform Colormaps
