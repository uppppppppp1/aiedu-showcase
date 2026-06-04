# 教学成果奖材料展示网站设计方案（方案三：外部存储 + 静态展示 + 动态上传）

## 一、总体目标

本设计方案基于 GitHub Pages 静态站点，结合外部对象存储和动态上传能力，构建“教学成果奖材料展示”平台。网站支持：

- “学生培养 / 教师成果 / 国内影响力 / 国际影响力”四大类展示
- 多级分类：一级分类 + 二级子分类
- 材料展示：图片、Word、PDF 等附件
- 动态上传：管理员可通过后台上传材料并实时更新展示
- 静态前端：部署在 GitHub Pages 上，浏览端无需后端服务器

---

## 二、架构概览

### 1. 静态前端展示层（GitHub Pages）

- 由 Jekyll 或 Eleventy 生成静态页面
- 页面负责：首页、分类页、材料列表、材料详情、搜索过滤
- 通过 JS 动态加载元数据（JSON）和附件列表
- 支持响应式布局，兼容 PC / 移动端

### 2. 外部对象存储层

- 图片与附件存放在第三方对象存储服务
- 推荐服务：GitHub Releases、OSS（阿里云）、七牛云、腾讯云 COS、AWS S3、OneDrive
- 每个材料只存储外部链接，不直接将大文件放在 GitHub 仓库

### 3. 动态上传与管理层

- 管理员通过“后台上传页面”上传文件
- 上传页面可与外部存储 API 直接交互
- 上传完成后生成或更新材料元数据 JSON
- 元数据存储方式：外部存储、GitHub 仓库 `data/materials.json`、或独立数据库

### 4. 数据源与元数据层

- 推荐主数据文件：`materials.json`
- 可放在仓库中，也可放在外部存储（通过 CDN 访问）
- 静态页面运行时加载该 JSON，生成全站材料列表

---

## 三、功能设计

### 1. 首页

- 网站标题、介绍、检索入口
- 四大一级分类入口卡片
- 最新上传材料 / 推荐材料
- 可视化统计：材料总数、分类分布

### 2. 分类总览页

- 一级分类说明
- 子分类入口列表
- 当前分类材料卡片列表
- 筛选功能：按时间、素材类型、关键词

### 3. 材料详情页

- 材料标题、分类路径、时间、类型、简介
- 封面图或图片预览
- 附件列表：PDF预览、图片展示、Word下载
- 相关材料推荐

### 4. 管理后台（动态上传）

- 登录权限控制
- 上传材料表单：
  - 一级分类、二级分类
  - 标题、简介、时间、标签
  - 封面图片
  - 附件文件列表
- 上传后自动生成材料项并同步到 JSON
- 可编辑已有材料元数据
- 可删除失效材料，保持展示一致

---

## 四、数据模型

### 1. JSON 数据结构示例

```json
[
  {
    "id": "student-paper-001",
    "category": "学生培养",
    "subcategory": "学生优秀论文",
    "title": "人工智能教育实践典型论文",
    "description": "国家级优秀论文，2025年发表，展示学生科研成果与实践案例。",
    "date": "2025-10-12",
    "type": "论文",
    "tags": ["AI", "教育", "论文"],
    "cover": "https://cdn.example.com/materials/student-paper-001/cover.jpg",
    "attachments": [
      {
        "label": "PDF文档",
        "url": "https://cdn.example.com/materials/student-paper-001/paper.pdf",
        "mime": "application/pdf"
      },
      {
        "label": "封面图片",
        "url": "https://cdn.example.com/materials/student-paper-001/cover.jpg",
        "mime": "image/jpeg"
      }
    ]
  }
]
```

### 2. 字段说明

- `id`: 唯一标识符
- `category`: 一级分类
- `subcategory`: 二级分类
- `title`: 材料标题
- `description`: 材料简介
- `date`: 时间，建议使用 `YYYY-MM-DD`
- `type`: 材料类型，例如“论文/获奖证书/项目证明”
- `tags`: 关键词数组
- `cover`: 封面图 URL
- `attachments`: 附件数组
  - `label`: 附件名称
  - `url`: 附件地址
  - `mime`: MIME 类型，用于前端判断展示方式

---

## 五、动态上传方案设计

### 1. 上传方式

有两种可选方案：

#### 方案 A：直接使用第三方存储 API

- 管理页面使用存储服务 SDK/API 上传文件
- 上传附件后直接获得外部 URL
- 将上传结果写入 `materials.json`
- 优点：无需后端服务器，前端可与存储服务交互
- 缺点：需配置 Token/密钥，需控制权限

#### 方案 B：使用 GitHub API 管理元数据

- 管理页面上传文件到外部存储
- 同时使用 GitHub REST API 更新仓库内的 `materials.json`
- 可通过 GitHub App / Personal Access Token 完成
- 优点：JSON 数据保持在 repo 中，易于版本管理
- 缺点：需要额外认证管理，需注意密钥安全

### 2. 推荐实现方式

综合考虑安全性和动态上传能力，推荐使用：

- 文件存储：外部对象存储（例如腾讯云 COS、阿里云 OSS、七牛、S3）
- 元数据存储：GitHub 仓库 `materials.json`
- 管理端：静态页面 + GitHub API
- 身份验证：GitHub OAuth 或静态密码（仅内部管理员使用）

### 3. 动态上传流程

1. 管理员登录后台
2. 选择/填写材料分类、标题、简介、标签等信息
3. 上传封面图片和附件文件
4. 后台调用对象存储 API 上传文件，获取文件 URL
5. 后台更新 `materials.json`：
   - 新材料写入
   - 或编辑/删除已有材料
6. 若 `materials.json` 存于仓库，则调用 GitHub API 提交更新
7. 前端静态站从最新 `materials.json` 获取内容，实现动态展示

### 4. 安全控制

- 后台上传页面应仅对管理员可见
- 推荐使用 GitHub OAuth 登录或静态链接控制
- 如果直接在前端使用 Token，必须保证该页面仅内部访问，避免公开泄露
- 更安全方式：通过服务器less 函数代理上传请求，仅暴露受控接口

---

## 六、页面与结构建议

### 1. 目录结构

```
/  
├── _config.yml
├── index.md
├── categories/
│   ├── student.md
│   ├── teacher.md
│   ├── domestic.md
│   └── international.md
├── _data/
│   └── materials.json
├── assets/
│   ├── css/
│   ├── js/
│   └── images/
├── _includes/
│   ├── header.html
│   ├── footer.html
│   └── material-card.html
├── _layouts/
│   ├── default.html
│   ├── home.html
│   ├── category.html
│   └── detail.html
└── admin/
    ├── index.html
    └── upload.js
```

### 2. 页面组件

- `header`: 站点导航、搜索、分类入口
- `category card`: 分类入口卡片
- `material card`: 材料摘要卡片
- `detail modal`: 材料详情弹窗
- `upload form`: 管理端上传表单

### 3. 搜索与筛选

- 支持关键词搜索
- 按一级分类、二级分类过滤
- 按材料类型过滤
- 按时间排序

### 4. 附件展示策略

- 图片：直接预览
- PDF：内嵌预览（可用 `pdf.js`）
- Word/Excel/PPT：显示图标 + 下载链接
- 其他：仅显示下载链接

---

## 七、部署与更新流程

### 1. GitHub Pages 部署

- 将静态站点文件推送到仓库
- GitHub Pages 设定为 `main` 或 `docs/` 根目录
- 站点由 GitHub Pages 自动构建并发布

### 2. 动态数据同步

- 将 `materials.json` 放在仓库或外部 CDN
- 管理端更新后，静态页面通过 JS 动态加载它
- 若使用 GitHub API 更新仓库，提交后页面可直接读取最新 JSON

### 3. 外部对象存储管理

- 上传后的文件地址作为材料附件 URL
- 可通过存储服务的 CDN 提升访问速度
- 应规划文件命名规范：`{category}/{id}/{filename}`

---

## 八、实施建议

### 1. 优先实现最小可行版本

- 先构建 GitHub Pages 静态展示站
- 先实现 `materials.json` 读取与分类展示
- 再开发简单管理后台，支持上传附件并生成 JSON

### 2. 进一步增强

- 增加管理员登录和权限控制
- 增加“材料审核”“发布状态”字段
- 增加“导出清单”“打印报告”“按年度统计”功能

### 3. 如果有后端需求

- 可后续增加 Serverless 函数，负责：
  - 安全上传到对象存储
  - GitHub API 写入 `materials.json`
  - 管理员认证

---

## 九、推荐技术选型

- 静态网站生成器：Jekyll（与 GitHub Pages 原生兼容）
- CSS：Bootstrap 5 或 Tailwind
- JS：Vanilla JS / Alpine.js
- PDF 预览：PDF.js
- 上传管理：GitHub REST API + 对象存储 SDK
- 存储服务：腾讯云 COS / 阿里云 OSS / GitHub Releases

---

## 十、结论

本方案兼顾 GitHub Pages 静态站的简洁部署和外部对象存储的动态上传能力。管理员可通过动态上传后台完成材料更新，前端可实时加载最新数据，适合“展示型+材料管理”需求。

如需，我可以进一步为你生成：

- 具体的 `Jekyll` 站点模板
- `materials.json` 模板与示例
- 管理后台上传页面代码
- GitHub API 上传与对象存储接入方案
