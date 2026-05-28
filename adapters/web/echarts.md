# ECharts 适配器

> 注意：ECharts 不是 Web 前端的默认选择。只有当用户项目中已安装/引用 ECharts，
> 或用户明确要求快速开箱即用效果时，才使用此适配器。Web 前端默认使用 D3.js。

## 适用场景
- 项目已引入 ECharts 依赖
- 快速开发，开箱即用的美观效果
- 中小规模数据（< 10万数据点）
- 需要内置交互（缩放、悬停、图例切换）的场景

## 核心映射：美学 → ECharts 配置

### 颜色
```javascript
// 直接使用 categorical 色板
const colorPalette = ['#4269d0', '#3ca951', '#ff725c', '#a463f2', '#efb118',
                       '#6cc5b0', '#9696a0', '#f5a623', '#ca5bb8', '#ff8ab7'];

// ECharts option
option = {
  color: colorPalette,
  // ...
};
```

### 排版
```javascript
const typography = {
  title: {
    textStyle: {
      fontSize: 16,        // h1
      fontWeight: 600,     // h1 weight
      color: '#1A1A1A',   // text.primary
      fontFamily: "'Helvetica Neue', Helvetica, Arial, 'PingFang SC', 'Microsoft YaHei', sans-serif"
    },
    subtextStyle: {
      fontSize: 13,        // h2
      fontWeight: 400,
      color: '#555555'     // text.secondary
    }
  },
  legend: {
    textStyle: {
      fontSize: 10,        // h5
      fontWeight: 400,
      color: '#555555'
    }
  },
  xAxis: {
    nameTextStyle: {
      fontSize: 11,        // h3
      color: '#333333'
    },
    axisLabel: {
      fontSize: 10,        // h4
      color: '#666666'
    }
  },
  yAxis: {
    nameTextStyle: { fontSize: 11, color: '#333333' },
    axisLabel: { fontSize: 10, color: '#666666' }
  }
};
```

### 间距
```javascript
const spacing = {
  grid: {
    top: 60,      // top margin + title space
    right: 30,
    bottom: 50,
    left: 60
  }
};
```

### 线条样式
```javascript
// 折线图系列
series: [{
  type: 'line',
  lineStyle: { width: 2, cap: 'round', join: 'round' },
  symbol: 'circle',
  symbolSize: 4,           // line_data_point radius * 2
  itemStyle: { borderWidth: 0 }
}]

// 网格线
xAxis: {
  splitLine: {
    show: true,
    lineStyle: {
      color: '#E0E0E0',
      width: 0.5,
      type: 'dashed'       // dash [2,2] → dashed
    }
  }
}
```

## ECharts 初始化模板

```javascript
// 使用前必须设置默认字体和色板
const chart = echarts.init(container, null, {
  renderer: 'canvas'
});

const baseOption = {
  color: colorPalette,
  textStyle: {
    fontFamily: "'Helvetica Neue', Helvetica, Arial, 'PingFang SC', 'Microsoft YaHei', sans-serif"
  },
  backgroundColor: '#FFFFFF',
  animation: true,
  animationDuration: 800,
  animationEasing: 'cubicOut',
  tooltip: {
    backgroundColor: '#FFFFFF',
    borderColor: '#D0D0D0',
    textStyle: { fontSize: 11, color: '#1A1A1A' },
    extraCssText: 'box-shadow: 0 2px 8px rgba(0,0,0,0.1); border-radius: 4px;'
  }
};
```

## 默认行为

- **动画**：开启（800ms cubicOut），增强数据展示的叙事性
- **Tooltip**：开启，背景白色、阴影效果
- **图例**：顶部水平排列
- **工具栏**：默认不显示（保持简洁），但保留 saveAsImage 可用
- **缩放**：数据点 > 50 时自动开启 dataZoom

## ECharts 不适用场景

- 数据点 > 10 万且需要流畅交互 → 考虑 WebGL 渲染或降采样后使用
- 需要像素级自定义渲染 → 使用 D3.js
- 3D 地球 → 使用 Three.js
