# 学术论文与研究报告图表规则

本文档用于学术论文、期刊投稿、高校研究项目、研究报告、Word/PDF 装订文档等出版型场景。该场景的目标不是展示炫技，而是让图表在正文中稳定、克制、可引用、可打印。

---

## 1. 图内标题与文档题注

学术文档允许图表内部保留简短标题，但最终文档必须同时使用图下题注。

规则：
- 图内标题必须以整张图像画布为参照水平居中。
- 图下题注由文档系统统一生成，格式为 `图 N-M 标题`。
- 图内标题用于图像独立查看，图下题注用于论文引用和交叉引用。
- 若版面空间紧张，优先保留图下题注，可省略图内标题。

Matplotlib 推荐：

```python
ax.set_title("")
fig.text(0.5, 0.965, title, ha="center", va="top",
         fontsize=15, fontweight="bold", color="#000000")
```

ECharts 推荐：

```javascript
title: {
  text,
  left: "center",
  top: 12,
  textAlign: "center"
}
```

ggplot2 推荐：

```r
theme(
  plot.title = element_text(hjust = 0.5),
  plot.title.position = "plot"
)
```

---

## 2. 资料来源说明

资料来源在论文文档中应由文档层统一排版，不建议写入图像本体。

规则：
- Word/PDF 正文中已有“资料来源”段落时，图像内部不得再绘制来源说明。
- 同一篇文档中的来源说明字号、颜色、对齐方式必须一致。
- 资料来源默认居中，字号使用 h6，颜色使用 muted。
- 若图像需要脱离正文单独传播，可生成独立传播版；该版本允许把来源说明写入图像底部。

推荐策略：

```json
{
  "publication": {
    "source_note": {
      "inside_chart": false,
      "outside_chart": true,
      "alignment": "center",
      "font_role": "h6",
      "deduplicate": true
    }
  }
}
```

---

## 3. 图例与图表主体距离

论文图表常以灰度和较小字号呈现，图例与主体过近会明显降低可读性。

规则：
- 顶部图例必须位于独立 legend band。
- 图例底部到绘图区顶部建议至少 24px。
- 图例项 4 个及以上时优先采用两行布局。
- Academic 主题下，多系列折线必须同时使用线型差异，不仅依赖灰度。

Matplotlib 推荐：

```python
fig.subplots_adjust(top=0.80)
ax.legend(
    frameon=False,
    loc="upper center",
    bbox_to_anchor=(0.5, 1.12),
    ncol=3,
    borderaxespad=0.0,
    columnspacing=2.2
)
```

---

## 4. 导出后的视觉居中

论文图表经常插入 Word 或 PDF。若图片文件本身左右留白不对称，即使文档段落设置为居中，读者仍会感觉图表偏移。

规则：
- 导出后检查可见内容边界，而不是只检查图片元素的段落对齐。
- 若使用 `bbox_inches="tight"` 等紧裁切方式，应在导出后补齐不对称留白。
- 图表标题、图例、轴标签、外侧数据标签都属于可见内容边界。

Matplotlib 处理思路：

```python
fig.savefig(path, dpi=220, bbox_inches="tight", pad_inches=0.18)
# 保存后读取像素边界，补齐左右/上下留白，使可见内容中心与画布中心一致。
```

---

## 5. 时间轴与节点图

时间轴、路线图、流程节点图在宽扁画布中容易出现圆点被拉伸的问题。

规则：
- 不使用 `Circle(..., transform=ax.transAxes)` 绘制节点。
- Matplotlib 优先使用 `ax.scatter(..., transform=ax.transAxes)` 或等比坐标。
- SVG/Canvas 中使用圆形 symbol 时，必须使用相同的 x/y 半径。
- 导出前检查圆点仍为圆形，不应呈椭圆。

Matplotlib 推荐：

```python
ax.scatter([x], [0.5], s=220, color="#333333",
           transform=ax.transAxes, zorder=3)
```

---

## 6. 交付检查清单

交付论文或研究报告图表前至少检查：

- 图内标题是否以画布中轴居中。
- 图例是否与标题、绘图区、数据标签保持足够距离。
- 图下题注和资料来源是否由文档层统一排版。
- 图像内部是否残留重复的资料来源。
- 时间轴节点是否未被拉伸。
- 图片插入 Word/PDF 后，视觉中心是否仍在页面中轴附近。
- 同一文档所有图表的标题、图题、来源说明字号是否一致。
