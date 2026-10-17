# 个人展示网站 · 技术设计文档（Tech Design）

## 1. 文档信息

| 项目 | 内容 |
| --- | --- |
| 文档名称 | 技术设计文档（Tech Design） |
| 关联文档 | `PRD.md`（产品需求文档） |
| 文档版本 | v1.0 |
| 编写日期 | 2026-10-17 |
| 文档用途 | 明确技术选型、项目结构、数据模型与关键技术点，作为开发与 AI 协作的实现依据 |

---

## 2. 技术选型总览

| 层 | 选择 | 说明 |
| --- | --- | --- |
| 前端框架 | **Astro 5.x** | 内容优先、静态生成（SSG）、默认零 JS，适合展示 + 博客类站点 |
| UI 交互框架 | **React 18**（Astro Islands） | 仅用于需要交互的组件（星空背景、导航等） |
| 样式方案 | **Tailwind CSS** | 原子化 CSS，快速实现深色主题与响应式 |
| 星空背景 | **自研 Canvas 组件**（React） | 轻量可控，支持降级与性能优化 |
| 内容管理 | **Markdown + front-matter**（Astro Content Collections） | 内容与代码分离，便于维护 |
| 后端 | **无传统后端（纯静态站）** | 展示站无需服务端逻辑 |
| 数据库 | **无数据库（文件系统即数据源）** | 内容以 Markdown / JSON / TS 文件存储 |
| 代码高亮 | **Shiki** | Astro 内置，博客代码块高亮 |
| 部署 | **静态托管**（Vercel / GitHub Pages / 自有服务器） | 生成纯静态产物 |

**核心思路**：这是一个「以内容为主、少量交互」的展示站，采用 **静态生成（SSG）** 可同时获得最佳性能、SEO 与最低维护成本；仅把星空背景等真正需要客户端运行的部分做成 **React 岛屿（Islands）** 按需加载，避免整站落入重型 SPA。

---

## 3. 技术栈详细选择与理由

### 3.1 前端框架：Astro

**选择理由：**

- **内容优先、默认零 JS**：展示站以阅读为主，Astro 生成的 HTML 不含多余的运行时 JS，契合 PRD「首屏 LCP ≤ 2.5s」的性能目标。
- **岛屿架构（Islands Architecture）**：星空背景、导航交互等少数组件用 React 实现，其余内容保持纯静态，兼顾交互与性能。
- **原生支持 Content Collections**：为博客 / 项目提供带类型约束的 Markdown 内容体系。
- **内置 Shiki 代码高亮、RSS、sitemap**：省去大量配置。

**备选方案对比：**

| 方案 | 优点 | 缺点 | 结论 |
| --- | --- | --- | --- |
| Astro | 静态优先、零 JS、博客体验好、性能最佳 | 交互场景需配合框架岛屿 | ✅ 采用 |
| Next.js | 生态大、全栈能力、React 统一 | 默认 JS 体积较大，对纯展示站偏重 | 备选 |
| 纯 HTML/CSS/JS | 零依赖、最简单 | 内容多时难维护、无组件化 | 不采用 |

### 3.2 交互框架：React（Islands）

仅用于以下交互组件，其余页面不挂载 React：

- `StarField`（星空背景动画）
- 移动端导航菜单（展开 / 收起）
- 技能熟练度滚动入场动画（可用 Intersection Observer 实现）

### 3.3 样式：Tailwind CSS

- 用 CSS 变量定义深色主题色板（见 PRD 配色），通过 Tailwind 配置映射为工具类。
- 内置响应式断点（`sm` / `md` / `lg` / `xl`）直接支撑多端适配。
- 配合 `darkMode: 'class'`，默认即深色。

### 3.4 星空背景：自研 Canvas 组件

- 用 `<canvas>` + `requestAnimationFrame` 绘制星点与星云渐变。
- 星点数量、动画帧率按设备与视口动态调节。
- 支持降级：低端设备 / `prefers-reduced-motion` / 移动端默认关闭或简化。

> 不引入重量级粒子库（如 Three.js），避免不必要依赖；如后续需要更丰富粒子效果，可评估轻量库 tsParticles。

### 3.5 后端与数据库：无

- 站点为纯静态展示，无需后端与数据库。
- 所有数据以文件形式存储（见「数据模型」），构建期读取并生成静态页面。
- 后续「联系表单」等功能若上线，可接入 Serverless Function + 第三方表单服务（本期不做）。

### 3.6 部署：静态托管

- 构建产物为纯静态文件，可部署至 Vercel / GitHub Pages / 自有 Nginx。
- CI 建议：Git push 触发自动构建 + 部署。

---

## 4. 项目结构

```
portfolio/
├── public/                        # 静态资源（原样拷贝到构建产物）
│   ├── favicon.svg
│   └── images/
│       ├── avatar.png             # 头像
│       └── projects/              # 项目封面图
│
├── src/
│   ├── assets/                    # 经打包处理的资源（图标、字体等）
│   ├── components/
│   │   ├── ui/                    # 通用 UI 组件
│   │   │   ├── Button.astro
│   │   │   ├── Card.astro
│   │   │   └── Tag.astro
│   │   ├── sections/              # 首页各区块组件
│   │   │   ├── Hero.astro
│   │   │   ├── About.astro
│   │   │   ├── Skills.astro
│   │   │   ├── Projects.astro
│   │   │   └── BlogSection.astro
│   │   └── StarField.tsx          # 星空背景（React 岛屿）
│   ├── layouts/
│   │   └── BaseLayout.astro       # 全局布局（导航 + 页脚 + 星空）
│   ├── content/
│   │   ├── config.ts              # Content Collection 类型定义（schema）
│   │   ├── profile.ts             # 个人资料数据（介绍 / 教育 / 获奖 / 经历）
│   │   ├── skills.ts              # 技能数据
│   │   ├── projects/              # 项目（Markdown + front-matter）
│   │   │   └── huaxia-diancang.md
│   │   └── blog/                  # 博客（Markdown + front-matter）
│   │       └── learning-path.md
│   ├── pages/
│   │   ├── index.astro            # 首页（单页锚点滚动）
│   │   ├── about.astro            # 关于我
│   │   ├── skills.astro           # 技能
│   │   ├── projects/
│   │   │   ├── index.astro        # 项目列表
│   │   │   └── [slug].astro       # 项目详情
│   │   └── blog/
│   │       ├── index.astro        # 博客列表
│   │       └── [slug].astro       # 博客详情
│   └── styles/
│       └── global.css             # 全局样式 + CSS 变量（主题色板）
│
├── astro.config.mjs               # Astro 配置（集成 Tailwind、React、sitemap）
├── tailwind.config.mjs            # Tailwind 主题与断点配置
├── tsconfig.json
└── package.json
```

**组织原则：**

- 内容（`content/`）与代码（`components/`、`pages/`）严格分离。
- 首页由 `sections/` 区块组件拼装，各区块可独立维护。
- 仅 `StarField.tsx` 等交互组件使用 `.tsx`，其余组件优先用 `.astro`（零 JS）。

---

## 5. 数据模型

所有数据以 TypeScript 类型 / Content Collection schema 约束，构建期读取。以下为各实体的数据结构定义（含默认示例数据）。

### 5.1 Profile（个人资料）

> 存储位置：`src/content/profile.ts`

```ts
interface Profile {
  name: string;          // 姓名
  title: string;         // 求职意向
  slogan: string;        // 一句话简介
  avatar: string;        // 头像路径
  email: string;         // 联系方式
  location: string;
  tags: string[];        // 核心能力标签
  socialLinks: { label: string; url: string }[];
  education: Education[];
  courses: string[];     // 主修课程
  awards: Award[];       // 竞赛获奖
  experiences: Experience[]; // 实践与校园经历
}

interface Education {
  school: string;   // 学校
  major: string;    // 专业
  degree: string;   // 学历
  note?: string;    // 备注（如 211）
  period: string;
}

interface Award {
  title: string;    // 奖项名称
  level: string;    // 级别（国家级 / 市级）
  date: string;
}

interface Experience {
  organization: string; // 组织 / 团队
  role: string;         // 担任角色
  period: string;
  description?: string;
}
```

**默认示例数据：**

```ts
const profile: Profile = {
  name: "梁宏宇",
  title: "人工智能算法工程师",
  slogan: "主攻人工智能算法方向，具备扎实的编程与数理基础。",
  email: "your-email@example.com",
  location: "中国 · 大连",
  tags: ["人工智能", "机器学习", "深度学习", "算法", "Java", "Python", "数据结构", "MATLAB"],
  education: [{
    school: "大连海事大学",
    major: "计算机科学与技术",
    degree: "本科",
    note: "211 院校",
    period: "2023 – 2027",
  }],
  courses: [
    "Java 语言程序设计", "数据结构", "模拟电子技术", "计算方法及 MATLAB 应用",
    "C 语言程序设计", "微机原理与汇编原理", "编译原理", "操作系统",
  ],
  awards: [
    { title: "全球校园人工智能算法精英大赛", level: "国家级三等奖", date: "" },
    { title: "第三十一届大连市数学竞赛", level: "三等奖", date: "" },
  ],
  experiences: [
    { organization: "双翼行大学生公益团队", role: "主席团成员", period: "" },
    { organization: "信息学院团委", role: "学生副书记", period: "" },
    { organization: "图书馆管理会讲解团", role: "主席", period: "" },
    { organization: "计科 2023-1 班", role: "班长", period: "" },
    { organization: "暑期支教", role: "副队长", period: "" },
    { organization: "「华夏典藏」项目", role: "负责人", period: "" },
  ],
};
```

### 5.2 Skill（技能）

> 存储位置：`src/content/skills.ts`

```ts
type SkillLevel = "熟练" | "掌握" | "了解";

interface SkillItem {
  name: string;
  level: SkillLevel;
  description?: string;
}

interface SkillGroup {
  category: string;      // 技能类别
  items: SkillItem[];
}
```

**默认示例数据：**

```ts
const skills: SkillGroup[] = [
  { category: "编程语言", items: [
      { name: "Java", level: "掌握" },
      { name: "C", level: "掌握" },
      { name: "Python", level: "掌握" },
  ]},
  { category: "数据与算法", items: [
      { name: "数据结构", level: "掌握" },
      { name: "机器学习", level: "掌握" },
      { name: "深度学习", level: "了解" },
  ]},
  { category: "工具与平台", items: [
      { name: "MATLAB", level: "掌握" },
      { name: "Git", level: "掌握" },
      { name: "Linux", level: "了解" },
  ]},
  { category: "计算机基础", items: [
      { name: "操作系统", level: "掌握" },
      { name: "编译原理", level: "了解" },
      { name: "微机原理与汇编", level: "了解" },
  ]},
  { category: "综合能力", items: [
      { name: "团队管理", level: "熟练" },
      { name: "组织协调", level: "熟练" },
      { name: "公开表达", level: "熟练" },
  ]},
];
```

### 5.3 Project（项目）

> 存储位置：`src/content/projects/*.md`，front-matter 定义如下 schema。

```ts
interface Project {
  slug: string;          // 唯一标识（文件名）
  name: string;          // 项目名称
  summary: string;       // 一句话简介
  description: string;   // 详细描述（正文 Markdown）
  techStack: string[];   // 技术栈
  role: string;          // 个人职责
  highlights: string[];  // 成果亮点
  demoUrl?: string;      // 演示链接
  sourceUrl?: string;    // 源码链接
  featured: boolean;     // 是否精选置顶
  cover?: string;        // 封面图路径
  date: string;          // 时间
}
```

**默认示例（`huaxia-diancang.md` front-matter）：**

```yaml
---
name: 「华夏典藏」
summary: 围绕华夏文化典藏相关内容打造的项目，负责整体规划与推进。
role: 项目负责人
techStack: [待补充]
highlights:
  - 作为负责人统筹项目全流程（示例数据，待补充量化成果）
featured: true
date: 2026-01-01
---
```

### 5.4 Post（博客文章）

> 存储位置：`src/content/blog/*.md`，front-matter 定义如下 schema。

```ts
interface Post {
  slug: string;          // 唯一标识（文件名）
  title: string;         // 标题
  summary: string;       // 摘要
  date: string;          // 发布日期
  tags: string[];        // 标签
  readingTime: number;   // 阅读时长（分钟，构建期计算）
  draft: boolean;        // 是否草稿（草稿不发布）
}
```

**默认示例（`learning-path.md` front-matter）：**

```yaml
---
title: 从数学竞赛到算法工程：我的学习路径
summary: 结合数学与算法竞赛经历，分享从数理基础到人工智能算法工程师的成长思考。
tags: [算法, 机器学习, 成长]
date: 2026-10-01
draft: false
---
```

---

## 6. 关键技术点 / 难点

### 6.1 星空背景的性能与降级（最高优先级）

- **难点**：Canvas 动画持续占用 CPU / GPU，在移动端或低端设备上易导致掉帧与耗电，拖累首屏性能（PRD 要求 LCP ≤ 2.5s）。
- **方案**：
  - 星点数量随视口与 `devicePixelRatio` 动态缩放。
  - 使用 `requestAnimationFrame`，在页面不可见（`document.hidden`）时暂停渲染。
  - 移动端默认降低星点密度或关闭动画，仅保留静态星空。
  - 响应 `prefers-reduced-motion`，用户偏好减少动效时降级为静态。
  - 星空作为 `position: fixed` 背景层，与内容层分离，避免重排。
  - 延迟初始化：首屏关键内容渲染完成后再启动动画。

### 6.2 静态生成与交互的平衡（Islands）

- **难点**：既要静态生成的性能与 SEO，又要星空等客户端交互。
- **方案**：利用 Astro Islands，仅对 `StarField`、导航等组件 `client:load` / `client:visible`，其余内容保持纯静态 HTML，JS 体积最小化。

### 6.3 深色主题的对比度与可读性

- **难点**：深色背景上文字、链接、卡片需保证可读性与层级，避免星空干扰正文。
- **方案**：
  - 通过 CSS 变量统一色板，正文对比度 ≥ 4.5:1。
  - 内容卡片使用半透明深色背景 + 柔和边框，既透出星空又不影响阅读。

### 6.4 多端响应式适配

- **难点**：320px 手机到 1920px 大屏的一致体验。
- **方案**：流式栅格 + Tailwind 断点；卡片多列 → 单列；导航 → 汉堡菜单；触控区域 ≥ 44px。

### 6.5 博客代码高亮与内容渲染

- **难点**：技术博客常含代码块，需要高亮与良好排版。
- **方案**：使用 Astro 内置 Shiki 高亮，Markdown 经 Content Collections 渲染；正文生成目录（TOC）锚点。

### 6.6 内容可维护性

- **难点**：站点所有者（非前端背景）需能低成本更新内容。
- **方案**：所有展示内容集中在 `content/` 下的 Markdown / TS 文件，新增项目或文章仅需新增文件 + 填写 front-matter，无需改动页面代码。

### 6.7 SEO 与元信息

- **难点**：静态站需保证搜索引擎可索引。
- **方案**：语义化标签、每页独立 `title` / `meta description`、集成 sitemap 与 RSS，`public/` 放置 robots 与 favicon。

---

## 7. 技术决策记录（备选方案）

| 决策点 | 采用 | 备选 | 说明 |
| --- | --- | --- | --- |
| 框架 | Astro | Next.js | 内容优先、零 JS，性能与维护成本更优 |
| 星空实现 | 自研 Canvas | Three.js / tsParticles | 轻量可控，避免重量级依赖 |
| 数据存储 | 文件系统 | 数据库 + CMS | 展示站无需动态数据，文件最简 |
| 样式 | Tailwind | CSS Modules / styled | 快速搭建 + 响应式 + 深色主题 |

---

## 8. 依赖清单（计划）

| 类别 | 包 | 用途 |
| --- | --- | --- |
| 框架 | `astro` | 站点核心 |
| 交互 | `react`、`react-dom`、`@astrojs/react` | React 岛屿 |
| 样式 | `tailwindcss`、`@astrojs/tailwind` | 原子化样式 |
| 内容 | `@astrojs/markdown`（内置） | Markdown 渲染 |
| 高亮 | `shiki`（内置） | 代码高亮 |
| 工具 | `@astrojs/sitemap`、`@astrojs/rss` | SEO / 订阅 |

---

## 9. 落地顺序建议

1. 搭建 Astro + Tailwind + React 基础工程，跑通首页骨架。
2. 实现全局布局（导航、页脚）与深色主题色板。
3. 实现 `StarField` 星空组件（含降级）。
4. 实现 Hero、About、Skills、Projects、Blog 五个区块组件。
5. 接入 Content Collections，录入个人资料、技能、项目、博客示例数据。
6. 实现项目 / 博客列表与详情页、代码高亮、TOC。
7. 响应式适配与三端自测，性能优化（LCP）。
8. 配置 sitemap / RSS / SEO，部署上线。
