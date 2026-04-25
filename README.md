# 校园恋爱重开模拟器

基于 [人生重开模拟器 (lifeRestart)](https://github.com/VickScarlet/lifeRestart) 改编的校园恋爱主题文字模拟游戏。

> **GitHub**: [xueayi/schoolrestart](https://github.com/xueayi/schoolrestart)

从小学入学到大学毕业，跨越约 100 个学月，体验一段独特的校园恋爱人生。

## 游戏特色

- **完整校园时间线** — 小学 → 初中 → 高中 → 大学，以学月为单位推进，共约 101 个回合
- **恋爱向属性系统** — 颜值、学识、社交、魅力、心动值、元气 六大属性
- **随机选择事件** — 游戏过程中随机触发强制选择事件，每个阶段均有保底触发
- **25 篇恋爱结局** — 根据总分等级 × 最高属性组合，生成专属恋爱小故事
- **名人模式** — 选择预设角色直接开始游戏
- **双主题** — 经典 / 赛博两种 UI 风格
- **性别可选** — 开局选择性别，影响故事文本

## 快速开始

### 环境要求

- Node.js >= 18
- npm

### 本地开发

```bash
# 安装依赖
npm install

# 启动开发服务器 (监听 0.0.0.0:4173)
npm run dev

# 构建生产版本
npm run build

# 预览生产构建
npm run start
```

### 数据生成

游戏数据存储在 `data/` 目录下的 `.xlsx` 文件中，需转换为 JSON 才能被运行时加载：

```bash
# 从 xlsx 模板重新生成数据文件
node scripts/generate-data.mjs

# 将 xlsx 转换为 json
npm run xlsx2json
```

## Docker 部署

```bash
# 构建镜像
docker build -t school-restart .

# 运行容器 (映射到主机 4173 端口)
docker run -d -p 4173:4173 --name school-restart school-restart
```

部署后通过 `http://<服务器IP>:4173` 访问。

## 项目结构

```
SchoolRestart/
├── data/                    # xlsx 源数据 (age, events, talents, ...)
├── public/data/zh-cn/       # 运行时 JSON 数据 (由 xlsx2json 生成)
├── src/
│   ├── modules/             # 核心逻辑 (property, life, event, talent, character)
│   ├── ui/themes/           # UI 主题 (default, cyber)
│   ├── i18n/                # 国际化文本
│   └── index.js             # 入口与配置
├── scripts/
│   └── generate-data.mjs    # 数据生成脚本
├── Dockerfile
├── vite.config.js
└── package.json
```

## 技术栈

- **引擎**: LayaAir (WebGL)
- **构建**: Vite
- **数据管线**: xlsx → v-transform → JSON
- **部署**: Docker / 静态文件服务

## 致谢

- 原版 [人生重开模拟器](https://github.com/VickScarlet/lifeRestart) by VickScarlet
- 项目地址：[xueayi/schoolrestart](https://github.com/xueayi/schoolrestart)
