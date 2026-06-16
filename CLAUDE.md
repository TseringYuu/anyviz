# CLAUDE.md — anyviz 工作上下文

> 项目介绍和使用方式见 [README.md](README.md)。本文件仅提供 Claude 在此代码库中工作时的运行指引。

## 模块作用与引用关系

当 Claude 接到可视化请求时，按以下顺序读取并使用各模块：

| 阶段 | 模块 | 作用 |
|------|------|------|
| 1. 分析 | `guides/chart-selection.md` | 根据数据特征和意图选择图表类型 |
| 2. 美学 | `aesthetics/default.json` | 加载默认主题参数（颜色/排版/间距/线条） |
| 3. 适配 | `adapters/` | 根据目标环境选择技术栈适配器生成代码 |
| 4. 校验 | `guides/consistency-rules.md` | 检查多图表输出的设计一致性 |
| 5. 无障碍 | `guides/accessibility.md` | 校验对比度、色盲友好、冗余编码、alt text |

当调用者通过自然语言定制美学时，参考 `guides/customization-guide.md` 中的映射表。
新建或修改图表模板时，遵循 `templates/TEMPLATE-SPEC.md` 的统一结构规范。

## 默认技术栈优先级

- **Web 前端**：先检测项目是否有 ECharts/Mapbox/Three.js 依赖 → 有则用对应库 → **都没有则默认 D3.js**
- **Python**：Jupyter/交互 → Plotly；出版/论文 → Matplotlib
- **R**：ggplot2

## 输出要求

生成可视化代码时必须：
1. 美学参数明确写死（如 `font-size: 16px`），不依赖库默认值
2. 附带图表选择理由（1-2 句话）
3. 多图表时附带一致性检查清单

## 文件树

```
anyviz/
├── README.md, README.zh-CN.md, LICENSE, SKILL.md, CLAUDE.md, AGENTS.md
├── CONTRIBUTING.md, CODE_OF_CONDUCT.md, SECURITY.md, CHANGELOG.md
├── .github/      → issue/PR 模板与 CI 工作流
├── aesthetics/   → default.json + 规则文档（color/typography/layout）+ themes/
├── guides/       → 选择/用色/一致性/定制/无障碍 五种指南
├── templates/    → 34 种模板，按 charts/maps/graphs/3d 分类 + TEMPLATE-SPEC.md 规范
├── adapters/     → 按 web/python/r 环境分类的适配器
├── scripts/      → theme_validator.py + make_wordmark/banner/demo_gif/showcase_gif.py
├── assets/       → banner.svg, wordmark.svg, demo.gif, showcase.mp4, showcase.gif（脚本生成）
├── hyperframes/  → 高保真动画展示工程（历史实验目录）
├── showcase-remotion/ → README showcase 的 Remotion 源工程
└── examples/     → 行业大屏示例 + README
```
