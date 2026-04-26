# 属性系统

## 核心属性

| 属性 | 键名 | 初始值 | 说明 |
|------|------|--------|------|
| 颜值 | `APR` | 玩家分配 | 外貌吸引力 |
| 学识 | `KNW` | 玩家分配 | 学习能力 |
| 社交 | `SOC` | 玩家分配 | 社交能力 |
| 魅力 | `CHM` | 玩家分配 | 个人魅力 |
| 心动值 | `LOV` | 3 + 玩家分配 | 恋爱心动程度（权重最高） |
| 元气 | `VIT` | 10 | 精力/生命力（不可玩家分配） |

## 属性分配

- 总分配点数：`defaultPropertyPoints`（默认 20）+ 天赋额外加成
- 每项限制：`propertyAllocateLimit`（默认 [0, 10]）
- 默认值：`LOV: 3, VIT: 10`

## 派生属性

| 键名 | 说明 |
|------|------|
| `HAPR` / `HKNW` / `HSOC` / `HCHM` / `HLOV` / `HSEM` | 历史最高值 |
| `LAPR` / `LKNW` / `LSOC` / `LCHM` / `LLOV` / `LSEM` | 历史最低值 |
| `SUM` | 总评分 = `floor(HAPR + HKNW + HSOC + HCHM + HLOV*3 + HSEM)` |

心动值 `LOV` 在 SUM 中有 **3倍权重**，体现恋爱主题。

## 属性变更

`Property.change(prop, value)`:
- 数值型属性（APR/KNW/SOC/CHM/LOV/VIT）：累加
- 数组型属性（TLT/EVT）：push 新值

`Property.effect(effects)`:
- 批量应用效果 `{APR: 1, KNW: 2, ...}`
- 特殊键 `RDM` 随机选取 APR/KNW/SOC/CHM/LOV 中一个应用

## 边际递减（已实装）

为防止后期数值膨胀，`Property.effect()` 对正向增益实施衰减：

| 当前属性值 | 增益系数 |
|-----------|---------|
| <= 10 | 100%（无衰减） |
| 11-20 | 50% |
| > 20 | 25% |

负值（扣减）不受衰减影响，保证惩罚力度。

## 高低值追踪

每次属性变更后，`Property.hl()` 自动更新：
- `L*` 系列：取 `min(当前存储值, 新值)`
- `H*` 系列：取 `max(当前存储值, 新值)`

## 属性评语 (Judge)

在 `src/index.js` 中的 `propertyConfig.judge` 配置属性分级文本：

```javascript
HAPR: [
    [0, 0, 'UI_APR_Judge_Level_0'],   // 路人脸
    [3, 0, 'UI_APR_Judge_Level_1'],   // 清秀
    [6, 0, 'UI_APR_Judge_Level_2'],   // 好看
    [10, 0, 'UI_APR_Judge_Level_3'],  // 帅气/可爱
    [15, 1, 'UI_APR_Judge_Level_4'],  // 校草/校花
    [25, 2, 'UI_APR_Judge_Level_5'],  // 倾国倾城
    [40, 3, 'UI_APR_Judge_Level_6'],  // 绝世容颜
]
```

## 持久化

通过 `localStorage` 存储跨局数据：
- `times`: 重开次数
- `extendTalent`: 继承天赋
- `ATLT` / `AEVT` / `ACHV`: 历史天赋/事件/成就收集
