# Three.js 适配器

## 适用场景
- 3D 数据可视化（曲面、散点、地球）
- VR/AR 数据展示
- 数据艺术装置

## 核心映射：美学 → Three.js

### 场景初始化
```javascript
const scene = new THREE.Scene();
scene.background = new THREE.Color('#FFFFFF');

const camera = new THREE.PerspectiveCamera(
  45,                       // FOV
  container.clientWidth / container.clientHeight,
  0.1,
  1000
);
camera.position.set(5, 3, 8);  // 默认等距视角
camera.lookAt(0, 0, 0);

const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
renderer.shadowMap.enabled = true;

// 光照
const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);  // 环境光
const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
directionalLight.position.set(5, 10, 5);  // 左上角 45°
```

### 色板：使用 Viridis 映射
```javascript
// 将 Viridis 色板转为 Three.js Color 数组
const viridisColors = [
  '#440154', '#482878', '#3E4A89', '#31688E', '#26828E',
  '#1F9E89', '#35B779', '#6DCD59', '#B4DE2C', '#FDE725'
].map(c => new THREE.Color(c));
```

### 3D 曲面材质
```javascript
const material = new THREE.MeshPhongMaterial({
  vertexColors: true,       // 逐顶点颜色
  side: THREE.DoubleSide,
  shininess: 30,            // 降低高光
  transparent: true,
  opacity: 0.95
});
```

### 3D 散点
```javascript
const geometry = new THREE.SphereGeometry(0.05, 8, 8);
const material = new THREE.MeshPhongMaterial({
  color: new THREE.Color('#4C72B0'),
  opacity: 0.7,
  transparent: true
});
```

### 坐标轴
```javascript
// 使用 CSS2DRenderer 渲染文字标签
const labelDiv = document.createElement('div');
labelDiv.textContent = 'X Axis';
labelDiv.style.fontSize = '10px';  // h4
labelDiv.style.color = '#666666';
labelDiv.style.fontFamily = "'Helvetica Neue', Arial, sans-serif";
```

## Three.js 默认配置

- **渲染器**：WebGLRenderer，抗锯齿开启
- **像素比**：限制在 ≤ 2（性能考虑）
- **轨道控制器**：OrbitControls，启用阻尼（damping 0.1）
- **相机**：透视相机 FOV 45°，近裁面 0.1，远裁面 1000
- **输出**：截图时导出为 PNG，2x 分辨率
