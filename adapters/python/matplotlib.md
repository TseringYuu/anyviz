# Matplotlib 适配器

## 适用场景
- Python 数据分析脚本
- Jupyter Notebook 嵌入图表
- 学术论文和出版级图表（高 DPI）
- 需要精确控制每个视觉元素的场景

## 核心映射：美学 → Matplotlib

### 全局样式设置
```python
import matplotlib.pyplot as plt
import matplotlib as mpl

# 色板
CATEGORICAL_10 = [
    '#4C72B0', '#55A868', '#C44E52', '#8172B2', '#CCB974',
    '#64B5CD', '#8C8C8C', '#E8A735', '#8BC34A', '#E377C2'
]

SEQUENTIAL_BLUES = [
    '#F7FBFF', '#DEEBF7', '#C6DBEF', '#9ECAE1', '#6BAED6',
    '#4292C6', '#2171B5', '#08519C', '#08306B'
]

# 全局 rcParams
mpl.rcParams.update({
    # 排版
    'font.family': 'sans-serif',
    'font.sans-serif': ['Helvetica Neue', 'Helvetica', 'Arial',
                        'PingFang SC', 'Microsoft YaHei', 'sans-serif'],
    'font.size': 10,                    # h4 默认

    # 画布
    'figure.facecolor': '#FFFFFF',
    'axes.facecolor': '#FFFFFF',
    'axes.edgecolor': '#333333',        # axis color
    'axes.linewidth': 1.0,              # axis width
    'axes.grid': True,
    'grid.color': '#E0E0E0',
    'grid.linewidth': 0.5,
    'grid.linestyle': (0, (2, 2)),      # dash [2,2]

    # 刻度
    'xtick.labelsize': 10,              # h4
    'ytick.labelsize': 10,
    'xtick.color': '#666666',
    'ytick.color': '#666666',
    'xtick.major.width': 1.0,
    'ytick.major.width': 1.0,

    # 图例
    'legend.fontsize': 10,             # h5
    'legend.frameon': True,
    'legend.edgecolor': '#D0D0D0',
    'legend.framealpha': 0.9,

    # 线条
    'lines.linewidth': 2.0,
    'lines.solid_capstyle': 'round',
    'lines.solid_joinstyle': 'round',
    'lines.markersize': 4,             # point radius (diameter = 8, Matplotlib uses points)

    # 保存
    'savefig.dpi': 150,
    'savefig.bbox': 'tight',
    'savefig.pad_inches': 0.1,

    # LaTeX（可选，学术场景）
    # 'text.usetex': True,
})
```

### 折线图
```python
fig, ax = plt.subplots(figsize=(12.8, 8))  # 800×500 @ 100dpi → 8×5 inch

# 但考虑边距：实际图表宽度 = 12.8 - margin_left - margin_right
# 保持宽高比 1.6:1 的有效绘图区域
fig, ax = plt.subplots(figsize=(10, 6.25))

# 间距
fig.subplots_adjust(
    top=0.92,      # 留标题空间
    right=0.96,
    bottom=0.12,   # 留轴标签空间
    left=0.10
)

for i, series in enumerate(data):
    ax.plot(x, y,
            color=CATEGORICAL_10[i],
            linewidth=2.0,
            marker='o',
            markersize=4,
            markerfacecolor=CATEGORICAL_10[i],
            markeredgewidth=0)

# 标题
ax.set_title('Chart Title', fontsize=16, fontweight=600,
             color='#1A1A1A', pad=8)

# 轴标签
ax.set_xlabel('X Axis', fontsize=11, color='#333333', labelpad=6)
ax.set_ylabel('Y Axis', fontsize=11, color='#333333', labelpad=6)

# 网格
ax.grid(True, color='#E0E0E0', linewidth=0.5, linestyle=(0, (2, 2)))
ax.set_axisbelow(True)  # 网格在数据下层

# 图例
ax.legend(fontsize=10, loc='best', frameon=True,
          edgecolor='#D0D0D0', framealpha=0.9)

# 去除顶部和右侧边框（Tufte 原则）
ax.spines['top'].set_visible(False)
ax.spines['right'].set_visible(False)
```

### 柱状图
```python
bars = ax.bar(categories, values,
              color=CATEGORICAL_10[0],
              width=0.7,
              edgecolor='white',
              linewidth=0.5)

# 数据标签
for bar in bars:
    height = bar.get_height()
    ax.text(bar.get_x() + bar.get_width() / 2., height + 4,
            f'{height:.1f}',
            ha='center', va='bottom',
            fontsize=9, color='#888888')  # h6
```

### 散点图
```python
ax.scatter(x, y,
           s=50,              # 面积 ≈ π * r² → (4px)² * π ≈ 50 pts²
           c=CATEGORICAL_10[0],
           alpha=0.8,
           edgecolors='white',
           linewidth=0.5)
```

## Matplotlib 默认配置

- **DPI**：屏幕显示 100，保存 150
- **图片格式**：保存为 PNG（光栅）或 PDF/SVG（矢量，出版用）
- **中文字体**：自动检测系统可用中文字体，或允许调用者指定
- **色板**：从 `default.json` 的 categorical 色板导入
