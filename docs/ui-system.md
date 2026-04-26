# UI 与主题系统

## 技术栈

- **渲染引擎**: LayaAir WebGL
- **设计分辨率**: 1125 × 2436（iPhone X 比例）
- **适配模式**: `showall`，按比例缩放适配
- **场景定义**: `public/view/` 下的 Laya 场景文件

## 主题切换

支持两种主题，存储在 `localStorage` 的 `theme` 中：

| 主题 | 目录 | 说明 |
|------|------|------|
| `romance` (default) | `src/ui/themes/default/` | 经典浪漫风格 |
| `cyber` | `src/ui/themes/cyber/` | 赛博朋克风格 |

## 视图管理

`UIManager` 管理页面切换：

| 页面 | 说明 |
|------|------|
| `LOADING` | 加载页 |
| `MAIN` | 主页（开始/继续） |
| `TALENT` | 天赋抽卡 |
| `PROPERTY` | 属性分配 |
| `TRAJECTORY` | 时间线（核心游戏页） |
| `SUMMARY` | 结局总结 |
| `CELEBRITY` | 名人模式选择 |

弹窗：
- `ACHIEVEMENT`: 成就达成通知
- `MESSAGE`: 通用消息

## Trajectory 页面（时间线 UI）

### 核心组件

- `panelTrajectory`: 可滚动面板
- `vboxTrajectory`: 垂直布局容器，存放轨迹项
- `boxTrajectoryItem`: 单个轨迹项模板（学期标签 + 内容文本）

### 渲染流程

```
onNext() → core.next() → renderTrajectory(age, content) → 更新属性条
```

### 选择肢渲染（内联模式）

选择肢直接在时间线中渲染为可交互的轨迹项：

1. 创建带问题文本的轨迹项
2. 在其下方追加按钮形式的选项列表
3. 点击后追加选择结果轨迹项
4. 选择期间暂停自动推进

### 自动推进

通过速度滑块控制：
- `scbSpeed`: 速度滑块
- 速度值映射到 `setInterval` 间隔：`3000 * (1 - progress) + 300` ms
- 速度为 0 时停止自动推进

### 属性显示

顶部实时显示五项属性值：

```javascript
this.labCharm.text = propertys[types.APR];      // 颜值
this.labIntelligence.text = propertys[types.KNW]; // 学识
this.labStrength.text = propertys[types.SOC];     // 社交
this.labMoney.text = propertys[types.CHM];        // 魅力
this.labSpirit.text = propertys[types.LOV];       // 心动值
```

## Summary 页面（总结 UI）

展示：
- 各属性历史最高值及评语
- 总评分及等级
- 恋爱故事文本
- 天赋继承选择
- 统计数据（成就/事件收集率）

## 全局样式配置

`$ui.common` 中定义了与主题无关的公共样式：
- `trajectoryItem`: 轨迹项样式
- `gradeBlk`: 按等级的颜色方案

## 事件总线

UI 通过全局事件总线接收通知：

```javascript
$$on('achievement', data => { ... });  // 成就达成弹窗
$$on('message', data => { ... });      // 通用消息弹窗
```
