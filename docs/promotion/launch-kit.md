# AnyViz: document-first launch kit

Drafts, not published posts. Use only after the linked demo is live. Do not claim benchmark wins, customer deployments, or usage counts that have not been measured.

## Positioning

**Charts that belong in the document.**

AnyViz is an open-source visualization skill for coding agents. It helps the agent choose charts, apply coherent typography and color, and check figures at their final size in a report, paper, or dashboard. It is not a renderer or an autonomous document converter.

## English short post

I built AnyViz because an AI-generated chart can look fine by itself and still fail inside a report: tiny labels, crowded legends, inconsistent colors, and duplicated captions.

The new Report Studio example puts the finished page first: three printable pages, six SVG figures, downloadable data, and a deterministic build script. All data is explicitly synthetic. No fabricated before/after benchmark.

Try the example, inspect the implementation, and tell me what breaks in your own workflow. If it is useful, a GitHub star helps other developers discover the project.

https://github.com/TseringYuu/anyviz

## 中文案例帖

我给 AnyViz 做了一份可复现的文档可视化案例：不是只展示一张漂亮图，而是把六张图放进一份完整报告，检查字号、单位、图例、题注和跨图配色。

示例包含三页可打印报告、SVG 图表、合成数据 CSV 和生成脚本。数据是明确标注的演示数据，不是客户项目，也不是模型能力对比测试。

AnyViz 本身是一套给 AI 编程助手使用的可视化规范和 skill，不是新的绘图库。欢迎拿自己的脱敏数据试试，告诉我哪里仍然需要人工调整。如果对你有帮助，也欢迎在 GitHub 点个 star。

https://github.com/TseringYuu/anyviz

## Trial feedback questions

1. What document and audience were you creating for?
2. Could you reproduce the example? Where did you get stuck?
3. What changes did you still have to make before using the figures?
4. Would you use the skill again? Why or why not?
5. May we quote your feedback or show a redacted output? No is completely fine.

## Honest comparison protocol

Use the same input data, model/version, task, tool access, and generation budget. Run a baseline without AnyViz and a condition with AnyViz. Preserve all attempts. Record time, retries, and manual changes. Judge factual correctness, readability at final physical size, consistency, accessibility and reproducibility. Publish limitations. Do not label the deterministic Report Studio implementation as a model comparison.

## Release checklist

- [ ] Verify demo, PDF, data and reproduction links on the public site.
- [ ] Capture a genuine walkthrough from the released implementation.
- [ ] Review each community's current self-promotion rules.
- [ ] Obtain approval for the exact external channels and final post text.
- [ ] Record star count before publication and after 7 days; do not infer attribution without evidence.
- [ ] Ask permission before publishing user feedback or user documents.
