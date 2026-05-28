# Plotly (Python) 适配器

## 适用场景
- Python 环境下的交互式图表
- Jupyter Notebook / JupyterLab
- Dash 应用
- 需要内置交互（缩放、悬停、选择）的场景

## 核心映射：美学 → Plotly

### 全局模板
```python
import plotly.graph_objects as go
import plotly.io as pio

# 创建默认模板
anyvis_template = go.layout.Template()

# 颜色
anyvis_template.layout.colorway = [
    '#4269d0', '#3ca951', '#ff725c', '#a463f2', '#efb118',
    '#6cc5b0', '#9696a0', '#f5a623', '#ca5bb8', '#ff8ab7'
]

# 排版
anyvis_template.layout.font = dict(
    family="'Helvetica Neue', Helvetica, Arial, 'PingFang SC', 'Microsoft YaHei', sans-serif",
    size=11,                          # h3
    color='#333333'
)

anyvis_template.layout.title = dict(
    font=dict(size=16, color='#1A1A1A'),
    x=0,                              # 左对齐
    xanchor='left'
)

# 画布
anyvis_template.layout.plot_bgcolor = '#FFFFFF'
anyvis_template.layout.paper_bgcolor = '#FFFFFF'

# 间距
anyvis_template.layout.margin = dict(t=40, r=30, b=50, l=60)

# 图例
anyvis_template.layout.legend = dict(
    font=dict(size=10, color='#555555'),
    orientation='h',
    yanchor='bottom',
    y=1.02,
    xanchor='right',
    x=1
)

# 注册模板
pio.templates['anyvis'] = anyvis_template
pio.templates.default = 'anyvis'
```

### 折线图
```python
fig = go.Figure()

for i, series in enumerate(data):
    fig.add_trace(go.Scatter(
        x=x_values,
        y=series['values'],
        name=series['name'],
        mode='lines+markers',
        line=dict(width=2, shape='spline'),
        marker=dict(size=4),
        hovertemplate='%{x}<br>%{y:.1f}<extra>%{fullData.name}</extra>'
    ))

fig.update_xaxes(
    title_text='X Axis',
    title_font=dict(size=11, color='#333333'),
    tickfont=dict(size=10, color='#666666'),
    gridcolor='#E0E0E0',
    gridwidth=0.5,
    zeroline=False,
    showline=True,
    linecolor='#333333',
    linewidth=1
)

fig.update_yaxes(
    title_text='Y Axis',
    title_font=dict(size=11, color='#333333'),
    tickfont=dict(size=10, color='#666666'),
    gridcolor='#E0E0E0',
    gridwidth=0.5,
    zeroline=False,
    showline=True,
    linecolor='#333333',
    linewidth=1
)
```

### 柱状图
```python
fig.add_trace(go.Bar(
    x=categories,
    y=values,
    marker=dict(
        color='#4269d0',
        line=dict(color='white', width=0.5)
    ),
    text=[f'{v:.1f}' for v in values],
    textposition='outside',
    textfont=dict(size=9, color='#888888'),
    hovertemplate='%{x}<br>%{y:.1f}<extra></extra>'
))
```

### 热力图
```python
fig.add_trace(go.Heatmap(
    z=values,
    x=x_labels,
    y=y_labels,
    colorscale=[
        [0.0, '#F7FBFF'],
        [0.5, '#6BAED6'],
        [1.0, '#08306B']
    ],
    xgap=1,
    ygap=1,
    hovertemplate='%{x}, %{y}<br>%{z:.1f}<extra></extra>'
))
```

## Plotly 默认配置

- **渲染器**：Jupyter 中用 'notebook'，脚本中用 'browser'
- **Hover 模板**：统一格式 `%{x}<br>%{y:.1f}`
- **动画**：transition 默认 duration 500ms
- **响应式**：`config={'responsive': True}`
