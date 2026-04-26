# 事件系统

## 概述

事件是游戏的核心叙事单元。每个学期触发事件的流程：**保底事件** → **随机事件**。

## 事件数据结构 (events.json)

```json
{
  "15000": {
    "event": "月考排名进步二十名，班主任在班会点名表扬你。",
    "grade": 1,
    "postEvent": "",
    "effect": { "APR": 0, "KNW": 2, "SOC": 0, "CHM": 0, "LOV": 0, "VIT": 1 },
    "NoRandom": 0,
    "include": "",
    "exclude": "",
    "branch": null,
    "isChoice": 0,
    "choices": null
  }
}
```

| 字段 | 说明 |
|------|------|
| `event` | 事件描述文本（支持 `{gender_partner}` 等占位符） |
| `grade` | 事件等级（0-3，影响 UI 颜色） |
| `effect` | 属性效果 `{APR, KNW, SOC, CHM, LOV, VIT}` |
| `postEvent` | 事件后续文本 |
| `NoRandom` | 为 1 则不进入随机池，只能通过 guaranteed 触发 |
| `include` | 包含条件表达式（满足才可触发） |
| `exclude` | 排除条件表达式（满足则不触发） |
| `branch` | 分支数组 `["条件:事件ID", ...]` |
| `isChoice` | 是否为选择肢事件 |
| `choices` | 选择肢数组（初始化时从 choiceText/Effect/Next 解析） |

## 事件触发流程

### 1. 保底事件

`age.json` 中的 `guaranteed` 数组包含必定触发的事件 ID。处理逻辑在 `Life.next()`：

- 逐个执行保底事件
- 如果保底事件是选择肢（`isChoice`），从 `choicePool` 中随机选一个未触发的替代
- 选择肢有冷却机制（`#choiceCooldown`），触发后 4 个学期内不再触发

### 2. 随机事件

从当前学期的 `event` 池中：

1. 过滤已触发事件（`EVT` 数组）
2. 通过 `Event.check()` 检查 `include`/`exclude` 条件和 `NoRandom` 标记
3. `util.weightRandom()` 加权随机选取一个

### 3. 分支解析

`Event.do()` 处理分支逻辑：

```javascript
if (branch) {
    for (const [cond, next] of branch) {
        if (this.#system.check(cond))
            return { effect, next, description, grade };
    }
}
```

当满足分支条件时，返回 `next` 事件 ID 继续执行。

## 条件表达式语法

由 `condition.js` 解析，支持：

| 运算符 | 示例 | 说明 |
|--------|------|------|
| `>` `<` `>=` `<=` | `KNW>12` | 数值比较 |
| `=` `!=` | `GND=M` | 相等/不等 |
| `?` | `SEM?[10,20,30]` | 值在数组中 |
| `!` | `TLT![1001,1002]` | 值不在数组中 |
| `&` | `KNW>5&SOC>3` | 与 |
| `\|` | `KNW>10\|SOC>10` | 或 |
| `()` | `(KNW>5&SOC>3)\|LOV>8` | 括号分组 |

## 事件生成脚本

`scripts/generate-data.mjs` 从模板池生成事件行：

- `POOL_BABY` / `POOL_KG` / `POOL_ELEM` / `POOL_MID` / `POOL_HIGH` / `POOL_UNI` 为各阶段事件模板
- `pickCycle()` 函数从模板池循环取事件
- `allocForStage()` 为各阶段分配不同 ID 段
- `GUARANTEED_BY_ROUND` 定义每学期的保底事件映射

## 文本占位符

事件文本中支持以下占位符（`Life.format()` 处理）：

| 占位符 | 说明 |
|--------|------|
| `{gender}` | 当前角色性别代词（他/她） |
| `{gender_self}` | 自称代词 |
| `{gender_partner}` | 对方代词（与自身相反） |
| `{appearance}` | 当前颜值 |
| `{knowledge}` | 当前学识 |
| `{social}` | 当前社交 |
| `{charm}` | 当前魅力 |
| `{love}` | 当前心动值 |
| `{vitality}` | 当前元气 |
| `{currentyear}` | 当前年份 |
