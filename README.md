# 教学成果奖材料展示平台

基于 Vue 3 + Vite 构建的静态展示网站，托管于 GitHub Pages，用于集中展示教学成果奖申报材料。

**在线地址：** https://uppppppppp1.github.io/aiedu-showcase/

---

## 目录结构

```
aiedu-showcase/
├── public/
│   ├── materials/          # 所有展示材料（按分类存放）
│   │   ├── 1 学生培养/
│   │   │   ├── 1-1 学生优秀代表论文/
│   │   │   ├── 1-2 学生竞赛获奖/
│   │   │   └── 1-3 学生创新创业成果/
│   │   ├── 2 教师成果/
│   │   │   ├── 2-1 教师获奖/
│   │   │   ├── 2-2 人才培养、学科建设项目立项/
│   │   │   └── 2-3 教材、专著出版/
│   │   ├── 3 国内影响力/
│   │   │   ├── 3-1 媒体报道/
│   │   │   ├── 3-2 高等学校应用推广证明材料/
│   │   │   ├── 3-3 中小学应用推广证明材料/
│   │   │   ├── 3-4 小花狮系列产品应用/
│   │   │   └── 3-5 案例、备案证明/
│   │   └── 4 国际影响力/
│   └── data.json           # 自动生成，勿手动编辑
├── scripts/
│   └── gen-data.js         # 扫描 materials/ 生成 data.json 的脚本
├── src/                    # Vue 源码
└── .github/workflows/
    └── deploy.yml          # 自动部署到 GitHub Pages
```

---

## 支持的文件类型

| 类型 | 扩展名 | 展示方式 |
|------|--------|---------|
| PDF | `.pdf` | 新标签页内置阅读器直接预览 |
| Word | `.doc` `.docx` | 点击下载 |
| 图片 | `.jpg` `.jpeg` `.png` `.gif` `.webp` `.bmp` `.svg` | 灯箱弹窗大图查看 |
| 视频 | `.mp4` 等 | 新标签页播放 |
| 其他 | 任意 | 新标签页打开或下载 |

---

## 本地开发

```bash
# 安装依赖（首次或 package.json 变更后执行）
npm install

# 启动本地开发服务器
npm run dev
# 打开 http://localhost:5173/aiedu-showcase/

# 运行测试
npm test
```

---

## 添加 / 更新材料

### 第一步：将文件放入对应文件夹

按照分类结构，将文件直接放入 `public/materials/` 下对应的子文件夹。

```
public/materials/1 学生培养/1-1 学生优秀代表论文/新论文.pdf
```

**文件夹命名规则：**
- 一级分类：`N 分类名`（如 `1 学生培养`）
- 二级分类：`N-M 子分类名`（如 `1-1 学生优秀代表论文`）
- 数字前缀决定显示顺序，脚本会自动去掉数字前缀只保留中文名称

### 第二步：重新生成 data.json

```bash
npm run gen
```

脚本会扫描整个 `materials/` 文件夹，自动生成 `public/data.json`，终端会打印汇总：

```
✓ data.json 已生成

┌──────────────┬──────────┬────────┐
│ 分类         │ 子分类数 │ 文件数 │
├──────────────┼──────────┼────────┤
│ 学生培养     │ 3        │ 51     │
│ 教师成果     │ 3        │ 25     │
│ 国内影响力   │ 5        │ 10     │
│ 国际影响力   │ 0        │ 6      │
└──────────────┴──────────┴────────┘
  合计 92 个文件
```

### 第三步：提交并推送

```bash
git add -A
git commit -m "add: 新增XXX材料"
git push origin main
```

推送后 GitHub Actions 自动构建并部署，约 **1-2 分钟**后线上更新生效。

---

## 删除材料

直接从文件夹中删除文件，然后重新执行：

```bash
npm run gen
git add -A
git commit -m "remove: 删除XXX材料"
git push origin main
```

---

## 增加新分类

在 `public/materials/` 下新建文件夹，遵循 `N 分类名` 命名规则，再执行 `npm run gen` 即可自动识别。

示例——新增"5 专利成果"分类：

```
public/materials/5 专利成果/
    5-1 发明专利/
        专利证书.pdf
    5-2 软件著作权/
        著作权证书.jpg
```

---

## 手动补充材料元信息（可选）

`npm run gen` 生成的条目中，`description`（简介）、`author`（作者）、`year`（年份）默认为空。如需补充，可在 `public/data.json` 中对应条目手动填写：

```json
{
  "id": "sub-1-1-1",
  "title": "A Survey of Explainable Knowledge Tracing",
  "description": "发表于 IEEE Transactions on Learning Technologies",
  "author": "张三、李四",
  "year": 2023,
  "type": "pdf",
  "url": "materials/1%20%E5%AD%A6%E7%94%9F%E5%9F%B9%E5%85%BB/...",
  "cover": ""
}
```

> ⚠️ 注意：再次运行 `npm run gen` 会**覆盖** `data.json`，手动填写的内容会丢失。建议在所有文件添加完毕后统一补充元信息，或者保留一份备份。

---

## 文件大小限制

- 单文件不超过 **100 MB**（GitHub 硬限制）
- 建议单文件不超过 50 MB（避免 GitHub 警告）
- 超大文件（如长视频）建议上传至视频平台后以链接形式添加

---

## 技术栈

- **框架：** Vue 3 + Vite 5
- **部署：** GitHub Pages（`gh-pages` 分支）
- **CI/CD：** GitHub Actions（push to main → 自动构建部署）
- **测试：** Vitest + @vue/test-utils
