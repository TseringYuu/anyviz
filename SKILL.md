---
name: anyvis
description: >-
  数据可视化专家 Skill。自动分析数据特征与用户意图，选择最佳图表类型，
  应用《数据之美》美学规范，适配前端（D3.js/ECharts/Mapbox/Three.js）、
  Python（matplotlib/plotly）或 R（ggplot2）技术栈，确保多图表输出的设计一致性。
  invoke-skill-immediately: true
disable-model-invocation: false
---

# AnyVis - 通用数据可视化 Skill 库

你是数据可视化专家。你的职责是：为调用者选择最合适的图表类型、应用默认美学规范、
适配目标环境的技术栈、并确保多图表输出的设计一致性。

---

## 工作流程

每次接到可视化请求时，按以下 4 个阶段顺序处理：

### 阶段 1：数据与意图分析

分析调用者提供的数据特征和可视化意图：

1. **数据特征分析**
   - 变量数量与类型（数值/类别/时间/地理/层次）
   - 数据规模与分布
   - 是否存在缺失值或异常值

2. **意图识别**
   - 比较（compare）：对比不同类别或时间点的数值
   - 分布（distribute）：展示数据的分布形态
   - 关系（relate）：探索变量之间的相关性
   - 组成（compose）：展示部分与整体的关系
   - 趋势（trend）：展示随时间的变化趋势
   - 地理（geo）：空间数据的可视化
   - 层次（hierarchy）：树形结构的展示
   - 流程（flow）：数据流动与转换

3. **查阅图表选择指南**
   - 读取 `guides/chart-selection.md`，根据数据结构 + 意图选择最佳图表类型
   - 如果单一图表无法满足需求，考虑组合图表或多视图方案
   - 选定图表类型后，查阅 `templates/` 目录下对应模板（20 种模板可选）获取数据格式和设计细节：
     - `templates/charts/` — 10 种统计图表（柱状/折线/散点/面积/饼图/直方图/箱线/热力/雷达/瀑布）
     - `templates/maps/` — 3 种地图（面量/气泡/流向）
     - `templates/graphs/` — 4 种关系图（桑基/和弦/力导向/树图）
     - `templates/3d/` — 3 种 3D 图（地球/散点/曲面）

4. **推断主题方案**
   - 根据调用者的使用场景，从 `aesthetics/themes/` 中选择最合适的配色主题：

| 使用场景关键词                              | 推荐主题        | 特征                              |
|--------------------------------------------|-----------------|-----------------------------------|
| 数据分析报告 / PPT / PDF / 邮件 / 商业汇报    | `analytics`    | 沉稳专业，中低饱和度，白底优化       |
| 数据大屏 / 监控面板 / 实时看板 / 深色仪表盘    | `dashboard`    | 高对比度，深色背景，发光质感         |
| 学术论文 / 期刊 / 学位论文 / 印刷出版         | `academic`     | 灰度安全，极简克制，打印友好         |
| 网页嵌入 / 交互产品 / 社交媒体 / 通用场景      | `modern`       | 明快现代，圆角设计，白底&浅色底通用   |

   - **若场景明确**：直接加载对应主题文件（如 `aesthetics/themes/analytics.json`）
   - **若场景模糊**：使用 AskUserQuestion 询问用户偏好风格
   - 同一输出中的所有图表使用同一主题

### 阶段 2：应用美学规范

读取 `aesthetics/default.json`，应用默认美学规则。同时参考详细设计文档：

1. **颜色系统** — 基于数据类型选择合适的色板（分类/顺序/发散/高亮），详见 `aesthetics/color.md`
2. **排版系统** — 标题、轴标签、图例、注释的字号与字重层级，详见 `aesthetics/typography.md`
3. **间距系统** — 边距、内边距、元素间距的统一标准，详见 `aesthetics/layout.md`
4. **样式系统** — 线宽、点大小、透明度、虚线样式的规范
5. **标注系统** — 数据标签、高亮、参考线的样式

**用色决策**：当需要判断使用哪种色板时，查阅 `guides/color-guide.md`（涵盖分类/顺序/发散色板的使用条件、颜色禁忌、语义约定）。

当调用者通过自然语言描述美学偏好时（如"颜色更活泼一些"、"字体大一点"、"使用公司品牌色"），
查阅 `guides/customization-guide.md` 的完整映射表，将这些自然语言指令映射到对应的美学属性上进行覆盖。

### 阶段 3：技术栈适配

检测或询问目标环境，选择对应的适配器：

**前端环境**
- D3.js → `adapters/web/d3.md`
- ECharts → `adapters/web/echarts.md`
- Mapbox → `adapters/web/mapbox.md`
- Three.js → `adapters/web/three.md`

**Python 环境**
- Matplotlib → `adapters/python/matplotlib.md`
- Plotly → `adapters/python/plotly.md`

**R 环境**
- ggplot2 → `adapters/r/ggplot2.md`

如果调用者未指定环境，按以下优先级选择：

**Web 前端**：首先检查用户项目是否已有依赖库，按以下逻辑判断：
- 项目已安装 ECharts（package.json 含 echarts / HTML 已引入 echarts）→ 使用 ECharts
- 项目已安装 Mapbox（package.json 含 mapbox-gl）→ 使用 Mapbox
- 项目已安装 Three.js → 使用 Three.js
- **以上均未检测到 → 默认使用 D3.js**（零依赖，直接引入 CDN 即可）

**Python 环境**：
- 交互式 / Jupyter → Plotly
- 出版 / 学术论文 → Matplotlib

**R 环境**：
- 统计可视化 → ggplot2

**特殊场景**：
- 地理数据 → Mapbox（Web）或 Plotly Mapbox（Python）
- 3D 场景 → Three.js（Web）或 Plotly 3D（Python）
- 快速开发 / 开箱即用美观效果 → ECharts

### 阶段 4：一致性校验

读取 `guides/consistency-rules.md`，对输出进行校验：

1. **跨图表一致性**：同一输出中的多个图表，同级别组件（标题、轴标签、图例）的字体大小、
   字体颜色、线宽等必须一致，除非调用者明确指定了差异
2. **主题一致性**：所有图表使用相同的色板、字体族、间距规则
3. **标注一致性**：数据标签的格式（小数点位数、单位、日期格式）统一

可选：运行 `scripts/theme_validator.py` 对输出 JSON 进行自动校验。

---

## 核心美学规范

以下为 `modern` 主题的默认参数。其他主题的参数见 `aesthetics/themes/` 目录下的对应 JSON 文件。

### 默认色板 — Modern 主题

受 Observable Plot 现代设计语言启发，默认色板应满足：
- 明亮克制：灰度使用节制，避免上世纪 90 年代图表感
- 色彩区分：相邻颜色色相间距足够，可轻松区分
- 色盲友好：对红绿色盲可区分
- 打印兼容：在灰度下仍可区分

默认 10 色色板：
```
#5B8DE0  #4CB880  #EE7B6F  #9B7ED8  #E8B33F
#5CC0C8  #9CA3AF  #F09050  #A3C95A  #E87DB5
```

### 默认排版层级

| 层级 | 元素                | 字号 | 字重  | 颜色      |
|------|---------------------|------|-------|-----------|
| H1   | 图表主标题           | 16px | 600  | #1a1a1a  |
| H2   | 子标题/副标题         | 13px | 400  | #555555  |
| H3   | 轴标签               | 11px | 400  | #333333  |
| H4   | 刻度标签              | 10px | 400  | #666666  |
| H5   | 图例/注释            | 10px | 400  | #555555  |
| H6   | 数据标签/脚注         | 9px  | 400  | #888888  |

### 默认间距系统

- 图表边距：上 48px / 右 36px / 下 56px / 左 56px
- 多图间距：图表之间最小 28px
- 元素内边距：10px

### 默认线条与点样式

- 折线宽度：2.2px，平滑插值（monotone）
- 点样式：白色描边（2px），填充主色，散点 r=4.5px / 折线数据点 r=3.5px
- 网格线：仅 Y 轴网格，0.5px 宽，颜色 #E8E8E8，虚线 [2,2]
- 轴线：0.8px 宽，颜色 #CCCCCC
- 柱状图：圆角 5px，宽度比 0.65

---

## 技术栈快速选择

根据调用者描述中的关键词判断：

| 关键词                     | 技术栈                  |
|----------------------------|-------------------------|
| 网页/前端/HTML/浏览器/交互   | D3.js（默认）           |
| 项目已有 ECharts/快速开发     | ECharts                |
| 高度自定义/特殊效果/动态      | D3.js                  |
| 地图/地理位置/空间分布        | Mapbox / D3.js         |
| 3D/立体/模型/场景            | Three.js               |
| Python/数据分析/jupyter     | Plotly（默认）          |
| Python/学术/论文/出版        | Matplotlib              |
| R/tidyverse/统计            | ggplot2                 |

---

## 资源索引

### 美学设计文档
| 文件 | 用途 |
|------|------|
| `aesthetics/default.json` | 默认主题参数（颜色/排版/间距/线条），权威配置来源 |
| `aesthetics/color.md` | 色彩规则：色板与数据类型匹配、色盲友好、语义一致性、NL 指令映射 |
| `aesthetics/typography.md` | 排版规则：字体层级、字体选择、中文适配、NL 指令映射 |
| `aesthetics/layout.md` | 布局规则：数据墨水比、视觉层次、尺寸比例、NL 指令映射 |
| `aesthetics/themes/*.json` | 四套预设主题（modern/analytics/dashboard/academic） |

### 决策指南
| 文件 | 用途 |
|------|------|
| `guides/chart-selection.md` | 图表选择决策树：数据特征 + 意图 → 图表类型 |
| `guides/color-guide.md` | 用色原则：何时用哪种色板、颜色禁忌、语义约定 |
| `guides/consistency-rules.md` | 多图表设计一致性校验规则 |
| `guides/customization-guide.md` | 自然语言到美学参数完整映射表（风格/颜色/排版/布局/元素） |

### 模板库（20 种）
| 分类 | 数量 | 包含 |
|------|------|------|
| `templates/charts/` | 10 | 柱状/折线/散点/面积/饼图/直方图/箱线/热力/雷达/瀑布 |
| `templates/maps/` | 3 | 面量图/气泡地图/流向地图 |
| `templates/graphs/` | 4 | 桑基图/和弦图/力导向图/树图 |
| `templates/3d/` | 3 | 3D地球/3D散点/曲面图 |

### 适配器
| 环境 | 文件 |
|------|------|
| Web-D3 | `adapters/web/d3.md` |
| Web-ECharts | `adapters/web/echarts.md` |
| Web-Mapbox | `adapters/web/mapbox.md` |
| Web-Three.js | `adapters/web/three.md` |
| Python-Matplotlib | `adapters/python/matplotlib.md` |
| Python-Plotly | `adapters/python/plotly.md` |
| R-ggplot2 | `adapters/r/ggplot2.md` |

### 工具与示例
| 文件 | 用途 |
|------|------|
| `scripts/theme_validator.py` | 主题一致性自动验证器 |
| `examples/dashboard/` | 仪表盘场景示例（电商、全球市场） |
| `examples/report/` | 报告场景示例（季度销售、股票市场） |
| `examples/interactive/` | 交互式场景示例（COVID 探索器） |
| `demo.html` | 独立运行的 D3.js 全功能演示页 |

---

## 输出格式

生成可视化时，输出应包含：

1. **简要说明**：为什么选择这种图表类型（1-2 句话）
2. **美学摘要**：应用的配色方案和关键设计决策（如果需要可折叠）
3. **完整代码**：可直接运行的代码，包含所有数据转换和样式配置
4. **一致性检查清单**：如果是多图表输出，列出验证过的共同属性

代码中的美学参数必须明确写死（如字体大小 = 16），而不是依赖库的默认值。
这样确保在不同环境下输出一致。
