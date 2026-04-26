# 数据管线

## 概述

游戏数据的完整流程：**模板池** → `generate-data.mjs` → **xlsx** → `xlsx2json` → **JSON** → 运行时加载。

## 生成脚本

`scripts/generate-data.mjs` 是数据的唯一来源，负责生成所有 xlsx 文件。

### 执行命令

```bash
# 生成 xlsx 文件
node scripts/generate-data.mjs

# 转换为 JSON
npm run xlsx2json
```

### 生成的文件

| xlsx 文件 | JSON 输出 | 说明 |
|-----------|-----------|------|
| `data/zh-cn/age.xlsx` | `public/data/zh-cn/age.json` | 时间线配置 |
| `data/zh-cn/events.xlsx` | `public/data/zh-cn/events.json` | 事件定义 |
| `data/zh-cn/talents.xlsx` | `public/data/zh-cn/talents.json` | 天赋定义 |
| `data/zh-cn/achievement.xlsx` | `public/data/zh-cn/achievement.json` | 成就定义 |
| `data/zh-cn/character.xlsx` | `public/data/zh-cn/character.json` | 角色定义 |
| `data/specialthanks.xlsx` | `public/data/specialthanks.json` | 致谢信息 |

## 事件生成架构

### 阶段划分

```javascript
const STAGE_ROUNDS = [3, 6, 18, 18, 24, 32]; // 各阶段学期数
const STAGE_EVT = [8, 10, 20, 25, 25, 30];   // 各阶段每学期事件数
```

### ID 分配器

每个阶段使用独立的 ID 分配器，避免冲突：

| 阶段 | Allocator | ID 范围 |
|------|-----------|---------|
| 婴幼+幼儿园 | `allocBabyKg` | 10001-10999 |
| 小学 | `allocElem` | 11000-14999 |
| 初中 | `allocMid` | 15000-19999 |
| 高中 | `allocHigh` | 20000-24999 |
| 大学 | `allocUni` | 25000-29999 |

### 模板池

每个阶段有对应的模板池（`POOL_BABY`, `POOL_ELEM` 等），包含事件文本和效果：

```javascript
{ t: '数学课你举手解出一道难题，全班鼓掌。', g: 1, e: fx(0, 2, 1, 0, 0, 0) }
```

`expandPool()` 用于扩充池子，将纯文本变体添加到基础池。

### 事件行格式

- `rowReg()`: 普通事件行
- `rowChoice()`: 选择肢事件行
- `rowFollow()`: 选择后续事件行

### 保底事件映射

`GUARANTEED_BY_ROUND` 对象定义哪些学期有保底事件：

```javascript
{ 1: [30001], 4: [30101], 10: [30006], 27: [30008], ... }
```

## 校验

脚本包含多层校验：

1. `validateAgeRefs()`: 检查 age.json 引用的事件 ID 是否都存在
2. `validate()`: 检查分支引用和选择肢后续事件 ID 的存在性

## 修改指南

### 添加新事件

1. 在对应阶段的 `POOL_*` 中添加模板
2. 运行 `node scripts/generate-data.mjs`
3. 运行 `npm run xlsx2json`

### 添加新选择肢

1. 在 `generateEvents()` 中使用 `choice()` 函数创建
2. 确保 `choiceNext` 引用的后续事件 ID 存在
3. 重新生成数据

### 添加新天赋

1. 在 `generateTalents()` 的 `talents` 数组中添加
2. 重新生成数据

### 添加新成就

1. 在 `generateAchievements()` 的 `achievements` 数组中添加
2. 注意设置正确的 `opportunity` 和 `condition`
3. 重新生成数据
