# 力导向图（Force-Directed Graph）

## 适用场景
- 展示网络关系结构
- 社交网络、引用关系、知识图谱

## 数据格式
```json
{
  "nodes": [
    { "id": "1", "name": "节点A", "group": 1, "value": 25 },
    { "id": "2", "name": "节点B", "group": 2, "value": 15 }
  ],
  "links": [
    { "source": "1", "target": "2", "value": 5 }
  ]
}
```

## 设计要点

1. **节点大小**：默认映射 degree（连接数），范围 4-20px 直径
2. **节点颜色**：按 group 使用 categorical 色板
3. **连线**：灰色 #AAAAAA, 0.5px, opacity 0.5
4. **布局算法**：d3-force 或类似的力模拟，斥力与节点数成正比
5. **交互**：支持拖拽、缩放、悬停高亮
