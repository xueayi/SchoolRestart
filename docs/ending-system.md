# 结局系统

## 概述

游戏结束后，根据总评分 `SUM` 和最高属性生成专属恋爱结局故事。

## 总评计算

```javascript
SUM = floor(HAPR + HKNW + HSOC + HCHM + HLOV * 3 + HSEM)
```

心动值 `LOV` 三倍权重，体现恋爱主题核心。

## 结局分层

### 正常结局

`Life.storyKey` 根据 SUM 确定 tier：

| SUM 范围 | Tier | 含义 |
|----------|------|------|
| < 60 | `LONELY` | 孤独终老 |
| 60-119 | `CRUSH` | 暗恋未果 |
| 120-199 | `FIRST` | 青涩初恋 |
| 200-299 | `SWEET` | 甜蜜恋爱 |
| >= 300 | `WINNER` | 人生赢家 |

再结合最高属性（HAPR/HKNW/HSOC/HCHM/HLOV 中最大者）生成故事 key：

```
STORY_{tier}_{attr}
```

例：`STORY_SWEET_LOV` = 甜蜜恋爱 × 心动值最高

共 5 × 5 = **25 种正常结局**。

### 坏结局（已实装）

在正常结局判定之前，优先检查坏结局条件：

| 条件 | 结局 Key | 说明 |
|------|----------|------|
| `HLOV <= 0` | `STORY_BAD_NOLOVE` | 心如止水：从未心动 |
| `VIT <= 0` | `STORY_BAD_EXHAUST` | 心力交瘁：元气耗尽 |
| 某核心属性 `H* <= 2` | `STORY_BAD_WEAK_{attr}` | 短板崩盘 |

坏结局优先级高于正常结局，增强"选择有代价"的游戏感。

## 故事文本

存储在 `src/i18n/zh-cn.js` 中，key 为 `STORY_*` 前缀的长文本字符串。

`Summary` UI 通过 `core.storyKey` 获取 key，再从 `$lang` 中查找对应文本渲染。

## 总评评语

在 `src/index.js` 的 `judge.SUM` 中分级：

```javascript
SUM: [
    [0, 0, 'UI_SUM_Judge_Level_0'],     // 孤独终老
    [40, 0, 'UI_SUM_Judge_Level_1'],    // 平淡青春
    [80, 0, 'UI_SUM_Judge_Level_2'],    // 青春无悔
    [120, 1, 'UI_SUM_Judge_Level_3'],   // 恋爱赢家
    [180, 2, 'UI_SUM_Judge_Level_4'],   // 校园传说
    [250, 2, 'UI_SUM_Judge_Level_5'],   // 完美恋爱
    [350, 3, 'UI_SUM_Judge_Level_6'],   // 人生巅峰
]
```
