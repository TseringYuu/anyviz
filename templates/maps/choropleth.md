# 等值区域图（Choropleth Map）

## 适用场景
- 展示按地理区域聚合的数值（如各省 GDP、各国人口密度）
- 揭示空间分布模式

## 数据格式
```json
{
  "geo_type": "china_province",
  "regions": [
    { "id": "110000", "name": "北京", "value": 41000 },
    { "id": "310000", "name": "上海", "value": 43000 }
  ]
}
```

## 设计要点

1. **色板**：默认 Blues 单色相顺序色板；有负值时用 diverging 色板
2. **投影**：中国地图用 Albers 等积投影或 Mercator；世界地图用 Robinson 或 Natural Earth
3. **边界线**：白色 0.5px，或浅灰 0.5px
4. **图例**：连续渐变条（Color Bar），标签显示最小、中位、最大值
5. **缺失值**：灰色填充（#EEEEEE），与最低数据色有所区分
6. **禁用区域**：如涉及争议地区，使用虚线边界和无数据标注

## 变体

### 面量图（Cartogram）
根据数值扭曲区域面积，强调数据差异
