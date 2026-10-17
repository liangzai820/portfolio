# AGENTS.md — AI 代理开发规范

> 本文档是 AI 代理（及人类开发者）在本项目工作时的统一规范与约束。
> 开始任何开发任务前，请先阅读本文档，并遵守其中的约定。

---

## 1. 项目概述

- **项目名称**：个人展示网站（Portfolio）
- **产品定位**：面向求职与个人品牌展示的静态站点
- **核心功能**：个人介绍、技能展示、项目展示、博客
- **视觉要求**：深色主题 + 星空背景、多端适配、简洁现代
- **关联文档**：
  - `PRD.md` — 产品需求文档（功能与设计要点）
  - `TECH_DESIGN.md` — 技术设计文档（技术选型、项目结构、数据模型、关键技术点）

> 开发前请先阅读 `PRD.md` 与 `TECH_DESIGN.md`，确保实现与需求、架构一致。两者与本文档冲突时，以 `PRD.md` / `TECH_DESIGN.md` 为准。

---

## 2. 技术栈（固定，勿随意变更）

| 层 | 技术 |
| --- | --- |
| 框架 | Astro 5.x（静态生成） |
| 交互 | React 18（Astro Islands，仅用于交互组件） |
| 样式 | Tailwind CSS |
| 内容 | Markdown + front-matter（Astro Content Collections） |
| 星空 | 自研 Canvas 组件（React） |
| 代码高亮 | Shiki（Astro 内置） |
| 后端 / 数据库 | 无（纯静态站） |

**强制约定：**
- 不使用后端、不使用数据库，所有数据存于文件系统。
- 不引入重量级依赖（如 Three.js）实现星空，除非用户明确要求。
- 不在 `.astro` 组件中引入不必要的客户端 JS；仅交互组件（星空、导航等）使用 React 岛屿。

---

## 3. 项目结构约定

```
src/
├── components/
│   ├── ui/          # 通用 UI 组件（Button、Card、Tag）
│   ├── sections/    # 首页各区块（Hero、About、Skills、Projects、BlogSection）
│   └── StarField.tsx  # 星空背景（React 岛屿）
├── layouts/BaseLayout.astro
├── content/         # 所有展示数据（profile.ts、skills.ts、projects/、blog/）
├── pages/           # 页面路由
└── styles/global.css
```

**组织原则：**
- 内容（`content/`）与代码（`components/`、`pages/`）严格分离。
- 新增内容只需在 `content/` 添加文件 + 填写 front-matter，不修改页面代码。
- 仅交互组件用 `.tsx`，其余优先 `.astro`（零 JS）。

---

## 4. 代码风格

### 4.1 通用
- 使用 TypeScript，开启严格模式（`strict: true`）。
- 文件命名：组件用 PascalCase（`Hero.astro`、`StarField.tsx`），数据文件用 camelCase（`profile.ts`）。
- 中文文案统一使用中文标点（全角），代码注释用中文。
- 不使用 `any`，如确需则加注释说明原因。

### 4.2 Astro 组件
- 优先静态，默认不添加 `client:*` 指令。
- 需要交互时才使用 `client:load`（首屏即需）或 `client:visible`（进入视口再加载）。
- 样式优先用 Tailwind 工具类；主题色等常量走 CSS 变量。

### 4.3 样式
- 深色主题通过 CSS 变量统一管理（见 PRD 配色），不硬编码颜色。
- 响应式使用 Tailwind 断点（`sm`/`md`/`lg`/`xl`），覆盖 320px–1920px。
- 触控交互区域 ≥ 44×44px。

### 4.4 内容与数据
- 所有 front-matter 字段需符合 `src/content/config.ts` 中定义的 schema。
- 示例数据（个人资料、技能、项目）以 PRD 中梁宏宇的信息为默认值。

---

## 5. 开发规范

### 5.1 数据模型
以 `TECH_DESIGN.md` 第 5 节定义的 4 个实体为准：
- `Profile`（个人资料）→ `src/content/profile.ts`
- `Skill`（技能）→ `src/content/skills.ts`
- `Project`（项目）→ `src/content/projects/*.md`
- `Post`（博客）→ `src/content/blog/*.md`

新增或修改字段时，需同步更新 `config.ts` 的 schema 与对应示例数据。

### 5.2 星空背景
- 遵循 TECH_DESIGN 6.1 的性能与降级要求：星点随视口缩放、页面不可见时暂停、移动端降级、响应 `prefers-reduced-motion`、延迟初始化。
- 星空为固定背景层，与内容层分离，不阻塞首屏渲染。

### 5.3 多端适配
- 导航在移动端收起为汉堡菜单。
- 卡片 / 列表在移动端降为单列。
- 三端（手机 / 平板 / 桌面）无横向滚动。

### 5.4 性能
- 首屏 LCP ≤ 2.5s。
- 图片使用 Astro 内置优化（`<Image>` / `astro:assets`）。
- 不引入不必要的第三方脚本。

### 5.5 SEO
- 每页独立 `title` / `meta description`。
- 语义化标签、图片 alt 文本。
- 集成 sitemap 与 RSS。

---

## 6. 测试要求

### 6.1 构建验证
- 每次改动后运行 `npm run build` 确认构建通过、无类型错误。
- 运行 `npm run check`（astro check）进行类型与 schema 校验。

### 6.2 手动验收清单（对应 PRD 第 10 节）
- 四大板块均可访问并展示示例数据。
- 深色主题 + 星空在首屏可见且可降级。
- 三端无横向滚动，布局正常，移动端导航可展开 / 收起。
- 示例数据完整包含姓名、求职意向、学校专业、主修课程、竞赛获奖、实践经历。
- 博客示例文章可进入详情页查看。

### 6.3 测试原则
- 本项目以静态展示为主，重点验证构建通过 + 三端渲染正确 + 性能达标。
- 新增交互（星空、导航）需验证降级路径（关闭 JS / reduced-motion）。

---

## 7. 注意事项

1. **内容与代码分离**：展示数据改动只碰 `content/`，不要写死在页面组件里。
2. **性能优先**：星空动效不得牺牲首屏性能，务必实现降级。
3. **深色可读性**：正文对比度 ≥ 4.5:1，卡片用半透明背景 + 边框，不遮挡正文。
4. **保持轻量**：非必要不新增依赖；新增依赖需说明理由。
5. **统一风格**：改动遵循现有组件与目录结构，不另起一套写法。
6. **中文优先**：站点文案、注释、文档均使用中文。
7. **示例数据**：以 PRD 中梁宏宇的简历信息为默认示例数据，后续可替换为真实数据。

---

## 8. 常用命令

| 命令 | 用途 |
| --- | --- |
| `npm install` | 安装依赖 |
| `npm run dev` | 本地开发服务器 |
| `npm run build` | 生产构建 |
| `npm run preview` | 预览构建产物 |
| `npm run check` | 类型与 schema 校验 |
