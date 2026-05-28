# 报告场景示例：季度销售分析

## 场景
为 PDF 报告生成两个图表，使用 Python Matplotlib 技术栈。

## 数据与意图

| 图表    | 数据类型                   | 意图    | 选择图表类型    |
|---------|----------------------------|---------|-----------------|
| 图 1    | 时间序列 (季度销售+利润)     | 趋势    | 双轴折线图       |
| 图 2    | 类别 × 数值 (区域贡献)      | 组成    | 堆叠柱状图       |

## 美学决策
- 主题：默认 anyvis，学术/报告风格（保留边框）
- 颜色：传统商务配色
- 输出：PDF 矢量格式，适合印刷

## 实现代码

```python
import matplotlib.pyplot as plt
import matplotlib as mpl
import numpy as np

# ===== anyvis 默认美学参数 =====
CATEGORICAL = ['#4269d0', '#3ca951', '#ff725c', '#a463f2', '#efb118']
FONT_FAMILY = ['Helvetica Neue', 'Helvetica', 'Arial',
               'PingFang SC', 'Microsoft YaHei', 'sans-serif']

# 全局 rcParams
mpl.rcParams.update({
    'font.family': 'sans-serif',
    'font.sans-serif': FONT_FAMILY,
    'font.size': 10,
    'figure.facecolor': '#FFFFFF',
    'axes.facecolor': '#FFFFFF',
    'axes.edgecolor': '#333333',
    'axes.linewidth': 1.0,
    'axes.grid': True,
    'grid.color': '#E0E0E0',
    'grid.linewidth': 0.5,
    'grid.linestyle': (0, (2, 2)),
    'xtick.labelsize': 10,
    'ytick.labelsize': 10,
    'xtick.color': '#666666',
    'ytick.color': '#666666',
    'legend.fontsize': 10,
    'legend.frameon': True,
    'legend.edgecolor': '#D0D0D0',
    'legend.framealpha': 0.9,
    'lines.linewidth': 2.0,
    'lines.markersize': 4,
    'lines.solid_capstyle': 'round',
    'savefig.dpi': 300,
    'savefig.bbox': 'tight',
})

# ===== 图 1: 双轴折线图（季度销售 + 利润率）=====
fig, ax1 = plt.subplots(figsize=(10, 5.5))

quarters = ['Q1', 'Q2', 'Q3', 'Q4']
revenue = [1200, 1450, 1680, 1950]
profit_margin = [18.5, 21.2, 19.8, 22.5]

# 销售额（左轴）
line1 = ax1.plot(quarters, revenue,
                 color=CATEGORICAL[0],
                 linewidth=2.0,
                 marker='o',
                 markersize=5,
                 markerfacecolor=CATEGORICAL[0],
                 markeredgewidth=0,
                 zorder=3)

ax1.set_ylabel('销售额（万元）', fontsize=11, color='#333333',
               fontfamily=FONT_FAMILY[0])
ax1.tick_params(axis='y', colors='#666666')
ax1.set_ylim(0, 2500)

# 利润率（右轴）
ax2 = ax1.twinx()
line2 = ax2.plot(quarters, profit_margin,
                 color=CATEGORICAL[2],
                 linewidth=2.0,
                 marker='s',
                 markersize=5,
                 markerfacecolor=CATEGORICAL[2],
                 markeredgewidth=0,
                 linestyle='--',
                 zorder=3)

ax2.set_ylabel('利润率（%）', fontsize=11, color='#333333',
               fontfamily=FONT_FAMILY[0])
ax2.tick_params(axis='y', colors='#666666')
ax2.set_ylim(0, 30)

# 网格（仅左轴）
ax1.grid(True, color='#E0E0E0', linewidth=0.5, linestyle=(0, (2, 2)), zorder=0)
ax1.set_axisbelow(True)

# 标题
ax1.set_title('季度销售与利润率趋势', fontsize=16, fontweight=600,
              color='#1A1A1A', fontfamily=FONT_FAMILY[0], pad=12)

# 图例
lines = line1 + line2
labels = ['销售额（万元）', '利润率（%）']
ax1.legend(lines, labels, loc='upper left', fontsize=10,
           edgecolor='#D0D0D0', framealpha=0.9)

# 去除顶部和右侧边框
ax1.spines['top'].set_visible(False)
ax2.spines['top'].set_visible(False)

plt.tight_layout()
fig.savefig('quarterly_trend.pdf', format='pdf')
plt.show()


# ===== 图 2: 区域贡献堆叠柱状图 =====
fig, ax = plt.subplots(figsize=(10, 5.5))

regions = ['华东', '华南', '华北', '西南', '西北']
products = {
    '产品A': [320, 280, 250, 180, 120],
    '产品B': [200, 180, 160, 120, 90],
    '产品C': [150, 130, 110, 80, 60],
}

x = np.arange(len(regions))
width = 0.6
bottom = np.zeros(len(regions))

for i, (name, values) in enumerate(products.items()):
    bars = ax.bar(x, values, width, bottom=bottom,
                  label=name,
                  color=CATEGORICAL[i],
                  edgecolor='white',
                  linewidth=0.5,
                  zorder=3)
    bottom += np.array(values)

# 标签
ax.set_xticks(x)
ax.set_xticklabels(regions, fontsize=10, color='#666666',
                   fontfamily=FONT_FAMILY[0])

ax.set_ylabel('销售额（万元）', fontsize=11, color='#333333',
              fontfamily=FONT_FAMILY[0], labelpad=6)
ax.tick_params(axis='y', colors='#666666')

# 标题
ax.set_title('各区域产品销售构成', fontsize=16, fontweight=600,
             color='#1A1A1A', fontfamily=FONT_FAMILY[0], pad=12)

# 网格
ax.grid(True, axis='y', color='#E0E0E0', linewidth=0.5,
        linestyle=(0, (2, 2)), zorder=0)
ax.set_axisbelow(True)

# 图例
ax.legend(fontsize=10, loc='upper right', edgecolor='#D0D0D0',
          framealpha=0.9, ncol=3)

# 边框
ax.spines['top'].set_visible(False)
ax.spines['right'].set_visible(False)

# 总计标签
for j, total in enumerate(sum(p[j] for p in products.values())):
    ax.text(j, total + 15, f'{total}',
            ha='center', va='bottom',
            fontsize=9, color='#888888',
            fontfamily=FONT_FAMILY[0])

plt.tight_layout()
fig.savefig('regional_composition.pdf', format='pdf')
plt.show()
```

## 一致性检查清单

- [x] 两个图表标题字号 16px 600 #1A1A1A
- [x] 两个图表 Y 轴标签字号 11px #333333
- [x] 两个图表刻度标签字号 10px #666666
- [x] 两个图表图例字号 10px
- [x] 网格线样式统一（#E0E0E0, 0.5px, dash (0,(2,2))）
- [x] 相同颜色语义（产品A=蓝, 产品B=绿, 产品C=红）
- [x] 图例边框样式统一
