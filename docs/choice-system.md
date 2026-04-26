# 选择肢系统

## 概述

选择肢是游戏中的关键互动事件，玩家从多个选项中选择一个，影响属性走向。

## 选择肢数据结构

在 `events.json` 中，选择肢事件设置 `isChoice: 1`，初始化时由 `Event.initial()` 将 `choiceText[]`、`choiceEffect[]`、`choiceNext[]` 解析为 `choices` 数组：

```javascript
choices: [
    {
        text: "挥手说再见，自己去玩滑梯",
        effect: { SOC: 1, VIT: 1 },
        next: 30301  // 后续事件 ID
    },
    ...
]
```

## 触发机制

### 全局选择池

`Life.start()` 初始化时，调用 `Event.getChoiceIds()` 收集所有 `isChoice` 事件的 ID 组成 `#choicePool`。

### 保底触发

当 `age.json` 的 `guaranteed` 字段引用了一个选择肢事件时：

1. 检查冷却 `#choiceCooldown > 0` → 跳过
2. 检查是否本学期已触发过选择 `choiceTriggered` → 跳过
3. 从 `#choicePool` 中过滤掉已触发事件
4. 随机选取一个替代事件
5. 设置冷却 `#choiceCooldown = 4`（4 学期后才可再次触发）

### 阶段过滤（已实装）

选择肢按阶段分组，每个选择肢事件通过 `include` 条件限定触发的学期范围。`Life.next()` 中根据当前 SEM 过滤 `#choicePool`，避免跨阶段出现不合理的选择。

阶段边界：
- 婴幼儿: SEM 1-9
- 小学: SEM 10-27
- 初中: SEM 28-45
- 高中: SEM 46-69
- 大学: SEM 70-101

## 选择解析

`Life.resolveChoice(eventId, choiceIndex)`:

1. 获取对应 choice 的 `effect` 和 `next`
2. 记录事件到已触发列表
3. 应用 effect 到属性
4. 如有 `next`，递归执行后续事件
5. 返回后续内容数组

## UI 渲染（已改为内联）

选择肢在时间线内联显示，不再弹出全屏覆盖层：

1. 问题文本作为轨迹项追加到 `vboxTrajectory`
2. 选项按钮直接渲染在时间线列表中
3. 选择期间禁用 `onNext()`（`#waitingChoice = true`）
4. 玩家点击后，选择结果作为新的轨迹项追加
5. 自动滚动到最新内容

## 冷却机制

```
触发选择 → #choiceCooldown = 4
每学期结束 → #choiceCooldown--
#choiceCooldown > 0 时跳过新的选择触发
```

保证选择肢不会连续堆叠。
