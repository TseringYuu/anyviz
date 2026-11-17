<p align="center">
  <picture>
    <source media="(prefers-color-scheme: dark)" srcset="assets/wordmark-dark.svg">
    <source media="(prefers-color-scheme: light)" srcset="assets/wordmark-light.svg">
    <img src="assets/wordmark.svg" alt="AnyViz" width="296" height="88">
  </picture>
</p>

<h1 align="center">你说需求，AI 来选图、绘图。</h1>

<p align="center">让 AI 根据数据与使用场景，自行判断并绘制合适的可视化图表。<br>从一张图到报告、看板，不必再由你逐项指挥设计细节。</p>

<p align="center"><a href="README.md">English</a> · <b>简体中文</b> · <a href="https://anyviz.aiware.store">官网</a> · <a href="examples/">示例</a></p>
<p align="center"><a href="LICENSE"><img src="https://img.shields.io/badge/license-MIT-4269d0?style=flat-square" alt="MIT 许可"></a> <a href="https://www.npmjs.com/package/anyviz"><img src="https://img.shields.io/npm/v/anyviz?style=flat-square&color=4269d0" alt="npm 已发布版本"></a> <a href="SKILL.md"><img src="https://img.shields.io/badge/Agent_Skill-SKILL.md-3ca951?style=flat-square" alt="Agent Skill"></a></p>

## 说清目标，不必先成为图表专家

**告诉 AI 你想看懂什么、表达什么，而不是先替它选好图表。** AnyViz 引导 AI 助手理解数据和使用场景，判断合适的图表与绘制方式，再通过可用工具生成并检查结果。

报告、交互看板、论文配图与日常分析，需要不同的判断。AnyViz 的核心期望，是让 AI 承担选图、样式、布局和一致性等决策，让你把注意力放在问题和结果上。你只需补充已知的约束，不必逐项指定颜色、标签或图表类型。

## 看看不同场景中的成果

可以从面向文档的 **[Report Studio](examples/report-studio/)** 开始，也可以探索下面的行业看板。这些是同一套工作流在不同场景中的应用，并不意味着 AnyViz 只适用于报告或看板。

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

你的 AI 助手已经会写绘图代码。AnyViz 提供的是可复用的判断过程，而不是让你承担全部设计决策：

- **理解任务。** 结合数据、受众、问题和使用场景，判断图表需要传达什么。
- **自行选图与绘制。** 选择合适的图表，结合项目可用的技术栈生成结果，而不是随意套用模板。
- **适应不同场景。** 根据文档配图、分析或看板的需要，调整排版、配色、交互和布局。
- **处理细节。** 保持单位、实体颜色与格式一致，检查标签、图例、对比度和最终效果；发现缺失数据或影响结论的不确定性时明确指出，而不是编造答案。

AnyViz 由规范、模板与工作流指令组成，**实际判断和绘制由 AI 助手及其工具完成**；它不是独立渲染器，也不是自动 PDF/Word 转换器。效果取决于模型与可用工具，发布前仍需确认结果和重要数据。示例用于演示，不是受控性能测试，也不保证结果始终正确。

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

安装器检测受支持的 Agent skill 目录并安装共享副本。如果目标位置已有非安装器管理的同名 skill，会先备份再替换。具体行为见 [install.sh](install.sh) 和 [install.ps1](install.ps1)。下载内容固定到已审查的提交，解压前校验 SHA-256；保存的安装器始终安装同一快照，更新时请重新阅读新版安装器。详见[完整性与更新策略](docs/installer-security.md)。

也可以手动克隆仓库，按照所用工具加载自定义 skill 的方式，让助手读取 [`SKILL.md`](SKILL.md)。

### 2. 告诉 AI 你想完成什么

加载 skill 后，提供数据和目标即可开始。例如：

```text
用 AnyViz 帮我看懂这份销售数据发生了哪些变化，
自行选择并绘制能清楚说明问题的图表。
```

```text
用 AnyViz 把这些研究结果画成适合放进论文的图，
选择清晰的表达方式，适配 A4 页面。
```

```text
用 AnyViz 根据这些数据，在现有项目里做一个运营看板，
让团队看清业务表现和需要关注的问题。
```

不必先指定图表类型或设计参数。你可以补充真正存在的约束，例如受众、输出格式或品牌色，其余交给 AI 根据 AnyViz 的指导判断。缺少关键信息时，助手可能需要询问，而不应盲目猜测。

### 3. 看结果，而不是盯住每个参数

确认图表是否回答了你的问题，重要数值是否与来源一致。需要调整时，直接说“让地区差异更明显”或“这张图要放进报告里”。[定制指南](guides/customization-guide.md) 帮助 AI 将反馈转换为设计调整，不必由你逐项修改图表配置。

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
