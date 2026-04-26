# 校园恋爱重开模拟器 - 技术文档

基于 [lifeRestart](https://github.com/VickScarlet/lifeRestart) 改编的校园恋爱文字模拟游戏的开发者文档。

## 文档索引

| 文档 | 说明 |
|------|------|
| [架构概览](./architecture.md) | 项目结构、技术栈、模块依赖关系 |
| [时间线系统](./timeline-system.md) | 101 学期时间轴、阶段划分、SEM_LABELS |
| [事件系统](./event-system.md) | 事件定义、随机抽取、分支、保底机制 |
| [选择肢系统](./choice-system.md) | 选择事件的触发、冷却、UI 渲染流程 |
| [属性系统](./property-system.md) | 六大属性、数值变更、边际递减、SUM 总评 |
| [天赋系统](./talent-system.md) | 天赋抽卡、触发条件、替换机制 |
| [成就系统](./achievement-system.md) | 成就定义、检测时机、持久化 |
| [角色系统](./character-system.md) | 名人模式、角色抽取、独一无二角色 |
| [结局系统](./ending-system.md) | 总评分层、结局故事 key 生成、坏结局 |
| [数据管线](./data-pipeline.md) | xlsx 源数据 → JSON 的生成流程 |
| [UI 与主题](./ui-system.md) | LayaAir 渲染、双主题、视图管理 |

## 快速导航

- **想修改事件内容？** → [事件系统](./event-system.md) + [数据管线](./data-pipeline.md)
- **想调整数值平衡？** → [属性系统](./property-system.md)
- **想添加新天赋？** → [天赋系统](./talent-system.md) + [数据管线](./data-pipeline.md)
- **想改 UI 样式？** → [UI 与主题](./ui-system.md)
- **想理解游戏循环？** → [架构概览](./architecture.md) → [时间线系统](./timeline-system.md)
