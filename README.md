<p align="center">
  <picture>
    <source media="(prefers-color-scheme: dark)" srcset="assets/wordmark-dark.svg">
    <source media="(prefers-color-scheme: light)" srcset="assets/wordmark-light.svg">
    <img src="assets/wordmark.svg" alt="anyviz" width="280" height="102">
  </picture>
</p>

<h1 align="center">Data visualization for coding agents</h1>

<p align="center"><a href="#install-the-skill">Install</a> · <a href="https://anyviz.aiware.store/">Website</a> · <a href="https://anyviz.aiware.store/llms.txt">llms.txt</a> · <a href="README.zh-CN.md" lang="zh-CN">简体中文</a></p>

Give your agent the data, the question and the audience. Leave it to the agent to decide whether a chart would help. When it would, **AnyViz** guides the agent through choosing the chart, drawing it with the tools in your project, and explaining the choice. You don’t have to pick a chart type or write a configuration.

[![Animated AnyViz preview: five data visualization studies](assets/anyviz-showreel-montage.gif)](https://anyviz.aiware.store/showreel/)

[▶ Play the full showreel (22 seconds)](https://anyviz.aiware.store/showreel/) · A visual showcase, not a recording of an autonomous agent run.

## Install the skill

Paste this into your AI assistant:

```text
Use anyviz (https://anyviz.aiware.store/llms.txt) to create data visualizations.
```

**Want your agent to keep using the skill?** Get the repository with Git:

```sh
git clone --depth 1 https://github.com/TseringYuu/anyviz.git
```

Review the downloaded `anyviz/install.sh`, then run on macOS / Linux:

```sh
sh anyviz/install.sh
```

No Node.js or Python required. Restart your agent after installation. [Windows PowerShell](https://github.com/TseringYuu/anyviz/blob/093eebcfb7d8a4537d1a090f7423e93eee8529e8/install.ps1) · [Installation and integrity notes](docs/installer-security.md)

---

[Website](https://anyviz.aiware.store/) · [Contributing](CONTRIBUTING.md) · [Security](SECURITY.md) · [MIT license](LICENSE)
