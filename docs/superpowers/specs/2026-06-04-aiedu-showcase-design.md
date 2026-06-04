# 教学成果奖材料展示平台 — 设计文档

**日期：** 2026-06-04  
**状态：** 已审定

---

## 1. 项目背景与目标

为教学成果奖评审提供一个材料集中展示平台，按既定分类结构组织内容，供评审专家只读浏览。网站托管于 GitHub Pages，材料文件存储于 GitHub Releases，维护人员通过编辑 `data.json` 更新内容。

---

## 2. 内容分类结构

```
1 学生培养
  1-1 学生优秀论文
  1-2 学生竞赛获奖
  1-3 学生创业成果
2 教师成果
  2-1 教师获奖
  2-2 人才培养项目立项
  2-3 教材、专著出版
3 国内影响力
  3-1 高等学校应用推广证明材料
  3-2 中小学应用推广证明材料
  3-3 小花狮系列产品应用
4 国际影响力
```

---

## 3. 技术栈

| 层次 | 选型 |
|------|------|
| 前端框架 | Vue 3 + Vite |
| 样式 | 原生 CSS（学术白底风，无 UI 框架依赖） |
| 内容驱动 | `public/data.json` 静态配置文件 |
| 文件存储 | GitHub Releases Assets（每文件最大 2GB） |
| 托管 | GitHub Pages（`gh-pages` 分支） |
| 部署 | GitHub Actions（push main → 自动构建 → 部署） |

---

## 4. 仓库结构

```
aiedu-showcase/
├── public/
│   └── data.json                  # 全站材料元数据
├── src/
│   ├── main.js                    # Vue 应用入口
│   ├── App.vue                    # 根组件：整体两栏布局
│   ├── components/
│   │   ├── NavTree.vue            # 左侧分类导航树
│   │   ├── MaterialList.vue       # 右侧材料卡片列表
│   │   └── MaterialCard.vue       # 单条材料卡片
│   └── data/
│       └── loader.js              # fetch data.json，返回响应式数据
├── .github/
│   └── workflows/
│       └── deploy.yml             # CI/CD：构建并部署到 gh-pages
├── docs/
│   └── superpowers/specs/
│       └── 2026-06-04-aiedu-showcase-design.md
├── index.html
├── vite.config.js
└── package.json
```

**分支策略：**

| 分支 | 用途 |
|------|------|
| `main` | 源码、data.json、文档 |
| `gh-pages` | Vite 构建产物，GitHub Pages 读取此分支 |

---

## 5. 数据结构：data.json

```json
{
  "categories": [
    {
      "id": "student",
      "title": "学生培养",
      "children": [
        {
          "id": "student-thesis",
          "title": "学生优秀论文",
          "items": [
            {
              "id": "thesis-001",
              "title": "基于深度学习的图像识别研究",
              "description": "2023年校级优秀毕业论文",
              "author": "张三",
              "year": 2023,
              "type": "pdf",
              "url": "https://github.com/OWNER/REPO/releases/download/v1.0/thesis-001.pdf",
              "cover": ""
            }
          ]
        },
        { "id": "student-award", "title": "学生竞赛获奖", "items": [] },
        { "id": "student-startup", "title": "学生创业成果", "items": [] }
      ]
    },
    {
      "id": "teacher",
      "title": "教师成果",
      "children": [
        { "id": "teacher-award", "title": "教师获奖", "items": [] },
        { "id": "teacher-project", "title": "人才培养项目立项", "items": [] },
        { "id": "teacher-book", "title": "教材、专著出版", "items": [] }
      ]
    },
    {
      "id": "domestic",
      "title": "国内影响力",
      "children": [
        { "id": "domestic-university", "title": "高等学校应用推广证明材料", "items": [] },
        { "id": "domestic-school", "title": "中小学应用推广证明材料", "items": [] },
        { "id": "domestic-product", "title": "小花狮系列产品应用", "items": [] }
      ]
    },
    {
      "id": "international",
      "title": "国际影响力",
      "children": [],
      "items": []
    }
  ]
}
```

> **叶子节点规则：** 当一个一级分类的 `children` 为空数组时，直接读取该分类的 `items` 字段渲染材料列表，导航中该分类作为叶子节点（不可展开），点击直接切换右侧内容。有 `children` 的分类忽略其自身 `items` 字段。
```

### item 字段说明

| 字段 | 必填 | 类型 | 说明 |
|------|------|------|------|
| `id` | ✓ | string | 全局唯一标识，建议 `分类-序号` 格式 |
| `title` | ✓ | string | 材料标题 |
| `type` | ✓ | string | `pdf` / `word` / `image` / `link` |
| `url` | ✓ | string | GitHub Releases 文件直链 |
| `description` | — | string | 简短说明（建议 50 字以内） |
| `author` | — | string | 作者或单位名称 |
| `year` | — | number | 年份，用于筛选和排序 |
| `cover` | — | string | 封面图 URL，`image` 类型必填，其他可留空 |

---

## 6. 页面布局

```
┌─────────────────────────────────────────────────────┐
│  [校徽/Logo]  教学成果奖材料展示平台          [年份筛选] │  ← Header
├──────────────┬──────────────────────────────────────┤
│              │  > 学生培养 > 学生优秀论文              │  ← 面包屑
│ 1 学生培养    │                                       │
│   1-1 优秀论文│  ┌──────────────┐ ┌──────────────┐   │
│ ▶ 1-2 竞赛获奖│  │ 📄 论文标题  │ │ 📄 论文标题  │   │
│   1-3 创业成果│  │ 作者 · 2023  │ │ 作者 · 2023  │   │
│              │  │ 简短描述...  │ │ 简短描述...  │   │
│ 2 教师成果    │  │ [查看文件]   │ │ [查看文件]   │   │
│   2-1 教师获奖│  └──────────────┘ └──────────────┘   │
│   2-2 项目立项│                                       │
│   2-3 教材出版│                                       │
│              │                                       │
│ 3 国内影响力  │                                       │
│ 4 国际影响力  │                                       │
└──────────────┴──────────────────────────────────────┘
```

**布局规格：**
- 左侧导航宽度：240px，固定定位，内容区滚动
- 右侧内容区：卡片网格布局，桌面端 2-3 列，移动端 1 列
- Header 高度：60px，白底，底部 1px 边框

**交互行为：**
- 左侧导航默认展开第一个一级分类，当前子类高亮
- 点击一级分类展开/收起子类列表
- 点击子类切换右侧内容，面包屑同步更新
- 右侧顶部年份下拉筛选当前子类材料
- `[查看文件]` 按钮在新标签页打开文件直链
- 移动端（< 768px）：左侧导航折叠为顶部下拉菜单

**文件类型展示规则：**

| type | 图标 | 卡片行为 |
|------|------|----------|
| `pdf` | 📄 | 按钮新标签页打开，浏览器内置 PDF 预览 |
| `word` | 📝 | 按钮触发下载 |
| `image` | 🖼️ | 卡片内显示缩略图，点击弹出原图 |
| `link` | 🔗 | 按钮新标签页跳转外部链接 |

---

## 7. 组件职责

| 组件 | 职责 |
|------|------|
| `App.vue` | 加载 data.json，维护当前选中子类 ID 的状态，管理两栏布局 |
| `NavTree.vue` | 接收 categories 数组，渲染可展开/收起的导航树，emit 选中事件 |
| `MaterialList.vue` | 接收当前子类的 items 数组和筛选年份，渲染卡片网格，含年份筛选 UI |
| `MaterialCard.vue` | 接收单条 item，根据 type 渲染对应图标、预览和操作按钮 |
| `loader.js` | `fetch('/data.json')` 并返回解析后的数据，错误时返回空结构 |

---

## 8. 部署流程

### GitHub Actions（deploy.yml）

```yaml
name: Deploy to GitHub Pages
on:
  push:
    branches: [main]
jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: 20
      - run: npm ci
      - run: npm run build
      - uses: peaceiris/actions-gh-pages@v4
        with:
          github_token: ${{ secrets.GITHUB_TOKEN }}
          publish_dir: ./dist
```

### 内容更新操作步骤

1. 在 GitHub 仓库页面进入 **Releases → Edit（或 Draft new release）**
2. 将文件拖入 Assets 区域上传，复制生成的文件直链
3. 编辑本地 `public/data.json`，在对应子类的 `items` 数组中追加新条目
4. `git add public/data.json && git commit -m "add: 新增XXX材料" && git push`
5. GitHub Actions 自动触发构建，约 1-2 分钟后网站更新

---

## 9. 非功能性要求

- **访问速度：** 首屏加载不依赖外部 CDN，data.json 与 HTML 同源加载
- **浏览器兼容：** 支持 Chrome、Firefox、Edge 最新两个大版本
- **安全：** 纯静态只读，无用户输入，无 XSS 风险面
- **可维护性：** 新增材料仅需编辑 data.json，无需修改任何代码

---

## 10. 不在范围内（Out of Scope）

- 用户登录 / 权限控制
- 在线上传文件功能
- 全文搜索
- 评论 / 标注功能
- 多语言切换
