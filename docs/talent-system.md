# 天赋系统

## 概述

天赋在游戏开始前抽取，每局选择 3 个，为角色提供初始属性加成和持续效果。

## 数据结构 (talents.json)

```json
{
  "1001": {
    "id": 1001,
    "name": "校草/校花",
    "description": "天生丽质，入学即巅峰",
    "grade": 2,
    "condition": "",
    "effect": { "APR": 5, "KNW": 0, "SOC": 0, "CHM": 0, "LOV": 0, "RDM": 0 },
    "exclusive": 0,
    "status": "",
    "exclude": [],
    "max_triggers": 1
  }
}
```

| 字段 | 说明 |
|------|------|
| `grade` | 稀有度（0=普通, 1=蓝, 2=紫, 3=橙） |
| `condition` | 触发条件表达式 |
| `effect` | 属性效果 |
| `exclusive` | 是否为独占天赋（不进入普通抽卡池） |
| `status` | 额外分配点数加成 |
| `exclude` | 互斥天赋 ID 列表 |
| `max_triggers` | 最大触发次数（从 condition 中解析） |

## 抽卡机制

### 普通抽卡

`Talent.talentRandom()`:

1. 计算稀有度概率：`{ 3: 1/1000, 2: 10/1000, 1: 100/1000, 0: 剩余 }`
2. 重开次数和成就数量提供概率加成
3. 每次抽 10 个天赋供玩家选择
4. 如有继承天赋（上局选择的），固定在第一个位置

### 稀有度加成

在 `src/index.js` 的 `talentConfig.additions` 中配置：

```javascript
TMS: [   // 重开次数加成
    [10, { 2: 1 }],   // 10次后紫色概率翻倍
    [30, { 2: 2 }],
    ...
]
```

## 触发机制

每学期 `Life.doTalent()` 遍历已持有天赋：

1. 检查触发次数是否达上限
2. 检查 `condition` 是否满足
3. 满足则应用 `effect`，增加触发计数

## 替换机制

`Talent.replace()` 处理天赋替换：

- 某些天赋定义了 `replacement` 字段
- 可按 `grade` 或指定 `talent` ID 替换
- 使用加权随机从替换列表中选取
- 递归替换直到无更多替换

## 互斥检查

`Talent.exclude()` 双向检查互斥关系：
- A 的 exclude 列表包含 B → 冲突
- B 的 exclude 列表包含 A → 也冲突

## 属性点加成

`Talent.allocationAddition()` 读取天赋的 `status` 字段，为玩家提供额外的属性分配点数。

## 继承天赋

游戏结束后，玩家可选择一个天赋"继承"到下一局（存储在 `localStorage` 的 `extendTalent` 中），下局抽卡时固定出现在第一个位置。
