<p align="center">
  <picture>
    <source media="(prefers-color-scheme: dark)" srcset="assets/wordmark-dark.svg">
    <source media="(prefers-color-scheme: light)" srcset="assets/wordmark-light.svg">
    <img src="assets/wordmark.svg" alt="anyviz" width="280" height="102">
  </picture>
</p>

<h1 align="center">给编程智能体用的数据可视化技能</h1>

<p align="center"><a href="#安装技能">安装</a> · <a href="https://anyviz.aiware.store/">官网</a> · <a href="https://anyviz.aiware.store/llms.txt">llms.txt</a> · <a href="README.md" lang="en">English</a></p>

把数据、你想弄清的问题，以及答案是给谁看的，告诉智能体就行。要不要画图，让它根据场景判断。需要画时，**AnyViz** 指导它选择图表，用项目里合适的工具画出来，并说明选择的理由。你不必先选图表类型，也不必写配置。

## 一份 CSV，两种回答

以示例里 [2025 财年十二个月的销售数据](examples/report-studio/data/monthly.csv) 为例。数据均为模拟。

> 去年全年的营收是多少？

**3,003,000 美元。** 如果只是核对数字，回答到这里就够了。

> 我在写年度回顾。下半年表现更好，是某个月突然跳升，还是全年一直在增长？

**营收逐月上升**，从一月的 18.4 万美元增至十二月的 33.6 万美元。下半年营收比上半年高 36.6%。只看两个半年度合计，看不出增长发生在什么时候；画出月度走势才能回答这个问题。

<a href="https://anyviz.aiware.store/examples/report-studio/"><img src="examples/report-studio/charts/revenue.svg" width="660" alt="月营收从一月的 18.4 万美元逐月升至十二月的 33.6 万美元。纵轴单位为千美元，从 150 而非零开始。"></a>

换个问题：“哪个渠道的营收最高？”月度总额回答不了。改看[渠道明细](examples/report-studio/data/channels.csv)，用[从零起算的排名条形图](examples/report-studio/charts/channels.svg)就能看出，直营渠道以 42.0% 位居第一。

[阅读完整三页报告](https://anyviz.aiware.store/examples/report-studio/) · [PDF](examples/report-studio/report.pdf) · [Word](examples/report-studio/report.docx) · [数据、任务说明与源码](examples/report-studio/)

这是可复现的人工参考实现，不是一次 AI 运行的实录。换成给运营团队看的[零售看板](https://anyviz.aiware.store/examples/ecommerce-retail/)，重点就不同了：销售趋势、转化和商品排行放在同一张交互屏上，便于对照。看板使用另一份模拟数据，[源码也在仓库里](examples/ecommerce-retail/)。

## 安装技能

先获取 `main` 分支：

```sh
git clone --depth 1 --branch main https://github.com/TseringYuu/anyviz.git
cd anyviz
```

运行前先查看对应的安装脚本：[macOS / Linux](install.sh) · [Windows](install.ps1)。在仓库根目录，只运行适用于你平台的那一条：

| macOS / Linux | Windows PowerShell |
| --- | --- |
| `sh ./install.sh` | `.\install.ps1` |

安装器会把技能放入共享目录 `~/.agents/skills/anyviz`，并检查受支持的智能体专用目录。如果智能体已经在运行，请重启。若只是想先试试，可以不做全局安装，直接用智能体打开仓库，让它阅读 [`SKILL.md`](SKILL.md)。

**可以在仓库里直接问：**

```text
请用 AnyViz 分析 examples/report-studio/data/monthly.csv。我准备给销售团队做简报：
营收和平均每笔订单金额的走势一致吗？把值得关注的变化讲清楚，
也告诉我们，这些月度汇总数据解释不了什么。
```

### 应该用哪个下载渠道？

- **给智能体安装技能，请用 `main` 上的脚本。** 安装器会在解压前校验固定版本归档的 SHA-256。[GitHub v1.0.3 发布版](https://github.com/TseringYuu/anyviz/releases/tag/v1.0.3)里的旧脚本取的是随分支变化的内容，没有这一步校验。[安装校验机制](docs/installer-security.md)。
- **如果只想在 JavaScript 里使用规范，** 可以运行 `npm install anyviz` 获取主题和指南。[npm 1.0.2](https://registry.npmjs.org/anyviz/1.0.2) 不含 Shell 或 PowerShell 安装脚本；安装 npm 包不会替智能体注册技能。

## 复现报告

在同一个仓库里运行以下命令，就会从 CSV 重新生成 HTML 和六幅 SVG 图，并在本机提供预览。只需 Python 3 标准库：

```sh
python3 examples/report-studio/build.py
python3 -m http.server 8000 --bind 127.0.0.1
```

打开[本机报告](http://127.0.0.1:8000/examples/report-studio/)。生成脚本会核对渠道、地区与整体营收是否一致。[导出说明](examples/report-studio/README.md)包含 PDF 和 Word 的生成方法；Word 正文可编辑，图表为嵌入图片。独立的[行业看板示例](examples/)通过 CDN 加载 ECharts。

## 技能里有什么

| 智能体要做的事 | 对应资源 |
| --- | --- |
| 选择合适的比较图、趋势图、地图或流向图 | [选图指南](guides/chart-selection.md)、[34 个模板](templates/) |
| 让图适合论文、报告、监控看板或网页 | [四套主题](aesthetics/themes/)、[出版指南](guides/academic-publication.md) |
| 为项目已有技术栈生成可运行的代码 | [七个适配器](adapters/)：D3、ECharts、Mapbox、Three.js、Plotly、Matplotlib、ggplot2 |
| 在最终尺寸下检查图表是否好读 | [一致性](guides/consistency-rules.md)、[图例](guides/legend-layout.md)、[无障碍](guides/accessibility.md) |

AnyViz 提供的是规则，**真正绘图的是你的智能体和它能调用的工具**。发布前，请用原始数据核对结果。

[参与贡献](CONTRIBUTING.md) · [安全说明](SECURITY.md) · [MIT 许可证](LICENSE)
