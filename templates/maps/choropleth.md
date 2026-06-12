# 等值区域图（Choropleth Map）

## 适用场景
- 展示按地理区域聚合的数值（如各省 GDP、各国人口密度）
- 揭示空间分布模式
- 最佳数据规模：10-200 个区域

## 数据格式
```json
{
  "geo_type": "china_province",
  "regions": [
    { "id": "110000", "name": "北京", "value": 41000 },
    { "id": "310000", "name": "上海", "value": 43000 },
    { "id": "120000", "name": "天津", "value": 18000 }
  ]
}
```

## 美学参数

```json
{
  "color": {
    "sequential_palette": "Blues",
    "diverging_palette": "diverging"
  },
  "geo": {
    "region_border": { "color": "#FFFFFF", "width_px": 0.5 },
    "missing_data_color": "#EEEEEE",
    "projection": "Albers"
  },
  "legend": {
    "position": "bottom",
    "type": "continuous_bar",
    "label_count": 3
  }
}
```

## 设计要点

1. **色板选择**：
   - 正数数据：Blues 单色相顺序色板（浅 #F7FBFF → 深 #08306B），Viridis 多色相色板
   - 正负混合：diverging 色板（棕 #8C510A → 白 #F5F5F5 → 青 #01665E），中心值对齐 0
   - 色盲友好：Viridis 优于 Blues，自动适配
2. **投影与地理基准**：
   - 中国地图：Albers 等积投影（标准纬线 25°N / 47°N），或 Mercator 网络地图
   - 世界地图：Robinson 投影或 Natural Earth，避免极地区域过度放大
   - 需要等面积表示时用 Lambert Azimuthal Equal Area
3. **区域边界**：白色边界 #FFFFFF（0.5px）或浅灰边界 #D0D0D0（0.5px），与背景对比度 ≥ 4.5:1
4. **图例设计**：
   - 类型：连续渐变条（Color Bar）
   - 位置：底部或右侧
   - 标签：显示最小值、中位数、最大值，并附带单位和数据范围
   - 字号：9px，color #666666
5. **缺失值与特殊处理**：
   - 缺失数据：浅灰 #EEEEEE，需与最低数据色有≥ 20 的明度差
   - 禁用/争议区域：虚线边界 #CCCCCC（[3,3] 虚线），标注「无数据」
6. **交互反馈**：鼠标悬停时该区域边界加粗至 2.0px，显示工具提示（名称、值、排名）

## 变体

### 面量图（Cartogram）
根据数值非线性缩放区域面积，强调数据差异；适合显示差异巨大的数据（如人口分布）

### 双变量等值图（Bivariate Choropleth）
使用色彩的色调和饱和度分别编码两个变量，形成 3×3 或 4×4 色彩矩阵，需配备关键参考图例

### 六边形网格图（Hexbin Choropleth）
将地理区域聚合到等大小六边形网格，适合展示密度不均的数据或简化复杂海岸线
