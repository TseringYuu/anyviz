<p align="center"><img src="assets/wordmark.svg" alt="AnyViz" width="240"></p>

<h1 align="center">让图表真正适合交付。</h1>

<p align="center">面向 AI 编程助手的开源可视化 skill。<br>选对图表，统一每张图的设计，让最终页面清晰易读。</p>

<p align="center"><a href="README.md">English</a> · <b>简体中文</b> · <a href="https://anyviz.aiware.store">官网</a> · <a href="examples/">示例</a></p>
<p align="center"><a href="LICENSE"><img src="https://img.shields.io/badge/license-MIT-4269d0?style=flat-square" alt="MIT 许可"></a> <a href="https://www.npmjs.com/package/anyviz"><img src="https://img.shields.io/npm/v/anyviz?style=flat-square&color=4269d0" alt="npm 已发布版本"></a> <a href="SKILL.md"><img src="https://img.shields.io/badge/Agent_Skill-SKILL.md-3ca951?style=flat-square" alt="Agent Skill"></a></p>

## 先看成品

**单独看起来漂亮的图，放进文档后不一定好读。** AnyViz 为 AI 助手提供图表选择、排版、配色、图例、题注和多图布局的指导。目标不是增加装饰，而是让读者真正读懂图表。

从面向文档的 **[Report Studio](examples/report-studio/)** 开始，再探索四个行业看板。你可以直接检查数据和实现，而不必只相信介绍文字。

[![Report Studio：包含统一设计图表的完整报告页面](examples/report-studio/preview.png)](examples/report-studio/report.pdf)

[查看实际 PDF](examples/report-studio/report.pdf) · [下载 Word 版本](examples/report-studio/report.docx) · [查看源码与复现步骤](examples/report-studio/)

Report Studio 使用合成数据，包含六张图和三页报告。Word 的正文、题注与页面布局可编辑，图表是高清图片，**不是原生可编辑的 Word 图表**；修改数据后需重新生成图表。

| 你想制作什么 | 从这里开始 |
| --- | --- |
| 报告或研究文档中的图表 | [Report Studio](examples/report-studio/) · [学术出版指南](guides/academic-publication.md) |
| 零售业绩概览 | [电商运营看板](examples/ecommerce-retail/) |
| 金融监控布局 | [交易看板](examples/finance-trading/) |
| 能源与设备监控 | [能源看板](examples/iot-energy/) |
| 地理与城市分析 | [城市看板](examples/city-geo/) |

以下看板预览使用模拟数据，不是实时服务或客户部署案例。

![遵循 AnyViz 指导设计的四个行业看板](assets/showcase.gif)

## AnyViz 带来了什么？

你的 AI 助手已经会写绘图代码。AnyViz 补充的是可复用的设计决策：

- **根据问题选图。** 比较、趋势、分布、关系、组成、地理、层次或流程，从读者要回答的问题出发，而不是先选图表类型。
- **为交付场景设计。** 报告需要在最终物理尺寸下保持文字可读；看板需要清晰层级与响应式布局。四套主题适用于不同场景。
- **保持多图一致。** 在同一份文档或画布中复用实体颜色、单位、数字格式、字号层级和间距。
- **检查最终页面。** 避免重复题注和来源、拥挤图例、偏移布局，以及仅靠颜色区分系列。检查实际导出结果，而不只检查源码。

这些是规范、模板与工作流指令，**不是新的渲染引擎，也不是自动 PDF/Word 转换器**。结果由 AI 助手及其工具生成，效果因模型而异；发布前仍需检查数据、代码和最终输出。示例用于演示，不是受控性能测试，也不保证论文或出版物获接受。

## 开始使用

### 1. 将 skill 加入你的 AI 助手

macOS 或 Linux：先下载安装脚本，阅读后再执行。

```sh
curl -fsSL https://raw.githubusercontent.com/TseringYuu/anyviz/main/install.sh -o /tmp/anyviz-install.sh
less /tmp/anyviz-install.sh
sh /tmp/anyviz-install.sh
```

Windows PowerShell：

```powershell
Invoke-WebRequest https://raw.githubusercontent.com/TseringYuu/anyviz/main/install.ps1 -OutFile anyviz-install.ps1
Get-Content ./anyviz-install.ps1
./anyviz-install.ps1
```

安装器检测受支持的 Agent skill 目录并安装共享副本。如果目标位置已有非安装器管理的同名 skill，会先备份再替换。具体行为见 [install.sh](install.sh) 和 [install.ps1](install.ps1)，再次运行即可更新。

也可以手动克隆仓库，按照所用工具加载自定义 skill 的方式，让助手读取 [`SKILL.md`](SKILL.md)。

### 2. 给出具体任务

```text
阅读 AnyViz 的 SKILL.md 和学术出版指南。
使用这份 CSV，为一份 A4 研究报告制作图表。
各图保持一致的颜色和单位，把题注与来源放在绘图区外，
避免图例重叠，并检查最终文档尺寸下的可读性。
在工具支持的情况下导出 SVG，并提供 PDF 预览。
解释选图理由，指出缺失或不确定的数据，不要编造数据。
```

如果制作看板，则说明受众、核心问题、技术栈和屏幕尺寸。[定制指南](guides/customization-guide.md) 将“学术风格”“标签大一些”“移动图例”等要求映射为设计参数。

### 3. 检查并迭代

对照来源核对数值、单位和坐标轴，检查标签碰撞、对比度及导出布局，再让助手修正发现的问题。需要可复现的起点时，使用仓库中的[示例](examples/)。

## skill 内部有什么？

**分析 → 美学 → 适配 → 一致性 → 无障碍**

| 资源 | 内容 |
| --- | --- |
| [34 种模板](templates/) | 20 种统计图、3 种地图、8 种关系与层次图、3 种三维图 |
| [4 套主题](aesthetics/themes/) | Modern、analytics、dashboard 和 academic |
| [7 个技术栈适配指南](adapters/) | D3、ECharts、Mapbox、Three.js、Plotly、Matplotlib 和 ggplot2 |
| [图表选择](guides/chart-selection.md) | 根据数据形态与分析意图选图 |
| [学术出版规则](guides/academic-publication.md) | 图幅尺寸、题注、来源、灰度辨识与导出指导 |
| [图例布局](guides/legend-layout.md) | 安全间距、碰撞检查与视觉居中 |
| [一致性规则](guides/consistency-rules.md) | 统一颜色、格式、排版与间距 |
| [无障碍指南](guides/accessibility.md) | 对比度、冗余编码和替代文本 |

适配器是针对这些库的使用指南；项目所需的渲染库须另行安装。地图服务可能需要自己的凭据，具体要求见各适配指南。

仓库首页 [`README.md`](README.md) 为英文主文档；本文件 `README.zh-CN.md` 是中文介绍，`README.en.md` 保留为英文兼容入口。

## 不使用 AI 助手，也能使用规范

npm 包提供 JSON 主题和指南文件路径，本身不渲染图表。

```sh
npm install anyviz
```

```js
const anyviz = require('anyviz');
const theme = anyviz.themes.academic();
console.log(theme.publication.export.dpi_min);
console.log(anyviz.guides.academicPublication);
```

也可用你熟悉的语言直接读取 [`aesthetics/default.json`](aesthetics/default.json)。

## 本地运行与校验

```sh
git clone https://github.com/TseringYuu/anyviz.git
cd anyviz
python3 -m http.server 8000
# 打开 http://localhost:8000/examples/report-studio/
```

四个行业看板通过 CDN 加载 ECharts，需要联网获取该依赖，数字均为模拟数据。Report Studio 的 HTML/SVG 展示不依赖 CDN；重建及可选 PDF、Word 导出要求见[案例说明](examples/report-studio/README.md)。

```sh
npm run validate
```

校验链检查主题配置、包导出、安装器行为和示例的静态约定。它**不是视觉正确性测试，也不会自动强制所有输出遵循设计规范**：仍需检查实际渲染的图表、文档和导出效果。

## 帮助打磨下一个案例

你在报告、论文或看板中使用了 AnyViz？欢迎[提交 issue](https://github.com/TseringYuu/anyviz/issues)，附上脱敏截图、使用的 Agent/模型、提示词，以及有效或失败的部分。请勿上传私人数据。可复现案例与真实反馈尤其有帮助。

**如果这个项目值得放进你的工具箱，欢迎点一个 star 收藏。** 使用示例不需要账号，也不需要先点 star。

参与贡献：[贡献指南](CONTRIBUTING.md) · [社区规范](CODE_OF_CONDUCT.md) · [安全说明](SECURITY.md)。

## 许可与设计基础

[MIT](LICENSE)。设计指导参考 Edward Tufte 的数据墨水比原则、Nathan Yau 的数据叙事、ColorBrewer 色板和 Viridis。这些参考不代表相关作者或项目的背书或认证。
