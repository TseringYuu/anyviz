# Mapbox GL JS 适配器

## 适用场景
- 交互式 Web 地图
- 需要自定义底图样式的地图可视化
- 大规模地理数据（使用矢量瓦片）

## 核心映射：美学 → Mapbox

### 底图样式
```javascript
// 浅色主题（适合数据叠加）
map.setStyle('mapbox://styles/mapbox/light-v11');

// 或自定义浅色底图
const customStyle = {
  version: 8,
  sources: { /* ... */ },
  layers: [
    // 陆地：浅灰 #F5F5F5
    // 水域：浅蓝 #E8F4FD
    // 道路：不显示或极浅
  ]
};
```

### 色板适配
```javascript
// Choropleth: 使用 sequential Blues
const stops = [
  [minValue, '#F7FBFF'],
  [medianValue, '#6BAED6'],
  [maxValue, '#08306B']
];

map.addLayer({
  id: 'choropleth-fill',
  type: 'fill',
  paint: {
    'fill-color': [
      'interpolate', ['linear'],
      ['get', 'value'],
      ...stops.flat()
    ],
    'fill-opacity': 0.8,
    'fill-outline-color': '#FFFFFF'  // 边界白色分隔
  }
});
```

### 气泡地图
```javascript
map.addLayer({
  id: 'bubbles',
  type: 'circle',
  paint: {
    'circle-radius': [
      'interpolate', ['linear'],
      ['get', 'value'],
      minValue, 4,           // min radius
      maxValue, 40           // max radius
    ],
    'circle-color': '#4269d0',
    'circle-opacity': 0.7,
    'circle-stroke-color': '#FFFFFF',
    'circle-stroke-width': 1
  }
});
```

### 排版
```javascript
// 地图注记保持轻量，重点在数据
// 只显示必要的地理名称（大比例尺时）
map.setLayoutProperty('place-label', 'text-size', [
  'interpolate', ['linear'], ['zoom'],
  0, 10,
  10, 12
]);
```

## Mapbox 默认配置

- **中心点**：根据数据范围自动计算
- **缩放**：fitBounds 适应数据范围，padding 50px
- **投影**：Mercator（默认），中国范围用 Albers
- **控件**：仅保留缩放控件（+/-），去除默认的导航控件
- **交互**：支持滚轮缩放和拖拽平移
