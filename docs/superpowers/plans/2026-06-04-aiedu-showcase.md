# 教学成果奖材料展示平台 Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a read-only academic showcase website with categorized material display, deployed to GitHub Pages via GitHub Actions.

**Architecture:** Vue 3 SPA driven by `public/data.json`, two-column layout (NavTree left, MaterialList right), files linked from GitHub Releases. Vite builds to `dist/`, GitHub Actions deploys to `gh-pages` branch on every push to `main`.

**Tech Stack:** Vue 3 + Vite 5, Vitest + @vue/test-utils (jsdom), GitHub Pages, GitHub Actions

---

## File Map

| File | Responsibility |
|------|----------------|
| `package.json` | Dependencies and npm scripts |
| `vite.config.js` | Vite + Vitest config, base URL for GH Pages |
| `index.html` | HTML entry point |
| `src/main.js` | Vue app mount |
| `src/style.css` | Global academic styles |
| `src/App.vue` | Root layout: header, two-column, reactive state |
| `src/components/NavTree.vue` | Left navigation tree (expand/collapse, active highlight) |
| `src/components/MaterialList.vue` | Right material grid with year filter and breadcrumb |
| `src/components/MaterialCard.vue` | Single material card (icon, thumbnail, title, link) |
| `src/data/loader.js` | Fetch and parse data.json, error-safe |
| `public/data.json` | All material metadata (source of truth for content) |
| `src/tests/loader.test.js` | Unit tests for loader |
| `src/tests/NavTree.test.js` | Unit tests for NavTree |
| `src/tests/MaterialCard.test.js` | Unit tests for MaterialCard |
| `src/tests/MaterialList.test.js` | Unit tests for MaterialList |
| `.github/workflows/deploy.yml` | CI/CD: test → build → deploy to gh-pages |

---

## Task 1: Project Scaffold

**Files:**
- Create: `package.json`
- Create: `vite.config.js`
- Create: `index.html`
- Create: `src/main.js`
- Create: `src/App.vue` (skeleton)
- Create: `src/style.css` (empty placeholder)

- [ ] **Step 1: Create package.json**

```json
{
  "name": "aiedu-showcase",
  "version": "1.0.0",
  "type": "module",
  "scripts": {
    "dev": "vite",
    "build": "vite build",
    "test": "vitest run",
    "test:watch": "vitest"
  },
  "dependencies": {
    "vue": "^3.4.0"
  },
  "devDependencies": {
    "@vitejs/plugin-vue": "^5.0.0",
    "@vue/test-utils": "^2.4.0",
    "jsdom": "^24.0.0",
    "vite": "^5.0.0",
    "vitest": "^1.0.0"
  }
}
```

- [ ] **Step 2: Create vite.config.js**

```js
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

export default defineConfig({
  plugins: [vue()],
  base: '/aiedu-showcase/',
  test: {
    environment: 'jsdom',
    globals: true,
  },
})
```

> ⚠️ `base` must match your GitHub repository name exactly (e.g. if repo is `my-repo`, use `/my-repo/`).

- [ ] **Step 3: Create index.html**

```html
<!DOCTYPE html>
<html lang="zh-CN">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>教学成果奖材料展示平台</title>
</head>
<body>
  <div id="app"></div>
  <script type="module" src="/src/main.js"></script>
</body>
</html>
```

- [ ] **Step 4: Create src/main.js**

```js
import { createApp } from 'vue'
import App from './App.vue'
import './style.css'

createApp(App).mount('#app')
```

- [ ] **Step 5: Create src/App.vue (skeleton)**

```vue
<template>
  <div>Loading...</div>
</template>

<script setup></script>
```

- [ ] **Step 6: Create src/style.css (empty)**

```css
/* styles added in Task 8 */
```

- [ ] **Step 7: Install dependencies**

```bash
npm install
```

Expected: `node_modules/` created, no errors.

- [ ] **Step 8: Verify dev server starts**

```bash
npm run dev
```

Open `http://localhost:5173/aiedu-showcase/`. Expected: page loads and shows "Loading...".

- [ ] **Step 9: Commit**

```bash
git add package.json vite.config.js index.html src/main.js src/App.vue src/style.css
git commit -m "chore: scaffold vue3 vite project"
```

---

## Task 2: Data Layer — data.json

**Files:**
- Create: `public/data.json`

- [ ] **Step 1: Create public/data.json with complete sample data**

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
              "description": "2023年校级优秀毕业论文，荣获一等奖",
              "author": "张三",
              "year": 2023,
              "type": "pdf",
              "url": "https://github.com/OWNER/REPO/releases/download/v1.0/thesis-001.pdf",
              "cover": ""
            },
            {
              "id": "thesis-002",
              "title": "人工智能在教育领域的应用综述",
              "description": "2022年省级优秀论文",
              "author": "李四",
              "year": 2022,
              "type": "pdf",
              "url": "https://github.com/OWNER/REPO/releases/download/v1.0/thesis-002.pdf",
              "cover": ""
            }
          ]
        },
        {
          "id": "student-award",
          "title": "学生竞赛获奖",
          "items": [
            {
              "id": "award-001",
              "title": "全国大学生创新创业大赛 一等奖",
              "description": "参赛项目：智慧课堂辅助系统",
              "author": "王五、赵六",
              "year": 2023,
              "type": "image",
              "url": "https://github.com/OWNER/REPO/releases/download/v1.0/award-001.jpg",
              "cover": "https://github.com/OWNER/REPO/releases/download/v1.0/award-001.jpg"
            }
          ]
        },
        {
          "id": "student-startup",
          "title": "学生创业成果",
          "items": []
        }
      ]
    },
    {
      "id": "teacher",
      "title": "教师成果",
      "children": [
        {
          "id": "teacher-award",
          "title": "教师获奖",
          "items": [
            {
              "id": "taward-001",
              "title": "省级教学成果奖 一等奖",
              "description": "2022年广东省教学成果奖一等奖",
              "author": "陈老师",
              "year": 2022,
              "type": "pdf",
              "url": "https://github.com/OWNER/REPO/releases/download/v1.0/taward-001.pdf",
              "cover": ""
            }
          ]
        },
        {
          "id": "teacher-project",
          "title": "人才培养项目立项",
          "items": [
            {
              "id": "project-001",
              "title": "新工科背景下人工智能课程体系建设",
              "description": "教育部新工科研究与实践项目，2021年立项",
              "author": "刘老师",
              "year": 2021,
              "type": "word",
              "url": "https://github.com/OWNER/REPO/releases/download/v1.0/project-001.docx",
              "cover": ""
            }
          ]
        },
        {
          "id": "teacher-book",
          "title": "教材、专著出版",
          "items": [
            {
              "id": "book-001",
              "title": "人工智能基础教程（第2版）",
              "description": "教育部规划教材，清华大学出版社，2023年出版",
              "author": "张老师 等",
              "year": 2023,
              "type": "image",
              "url": "https://github.com/OWNER/REPO/releases/download/v1.0/book-001.jpg",
              "cover": "https://github.com/OWNER/REPO/releases/download/v1.0/book-001.jpg"
            }
          ]
        }
      ]
    },
    {
      "id": "domestic",
      "title": "国内影响力",
      "children": [
        {
          "id": "domestic-university",
          "title": "高等学校应用推广证明材料",
          "items": [
            {
              "id": "duniv-001",
              "title": "北京大学课程应用证明",
              "description": "北京大学人工智能学院采用本课程体系证明",
              "author": "北京大学",
              "year": 2023,
              "type": "pdf",
              "url": "https://github.com/OWNER/REPO/releases/download/v1.0/duniv-001.pdf",
              "cover": ""
            }
          ]
        },
        {
          "id": "domestic-school",
          "title": "中小学应用推广证明材料",
          "items": []
        },
        {
          "id": "domestic-product",
          "title": "小花狮系列产品应用",
          "items": []
        }
      ]
    },
    {
      "id": "international",
      "title": "国际影响力",
      "children": [],
      "items": [
        {
          "id": "intl-001",
          "title": "IEEE教育技术国际会议最佳论文",
          "description": "IEEE EDUCON 2023 Best Paper Award",
          "author": "张老师",
          "year": 2023,
          "type": "pdf",
          "url": "https://github.com/OWNER/REPO/releases/download/v1.0/intl-001.pdf",
          "cover": ""
        }
      ]
    }
  ]
}
```

- [ ] **Step 2: Commit**

```bash
git add public/data.json
git commit -m "data: add sample data.json with all categories"
```

---

## Task 3: Data Loader

**Files:**
- Create: `src/data/loader.js`
- Create: `src/tests/loader.test.js`

- [ ] **Step 1: Write failing test**

Create `src/tests/loader.test.js`:

```js
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { loadData } from '../data/loader.js'

describe('loadData', () => {
  beforeEach(() => {
    vi.restoreAllMocks()
  })

  it('returns parsed categories on success', async () => {
    const mockData = { categories: [{ id: 'student', title: '学生培养', children: [] }] }
    global.fetch = vi.fn().mockResolvedValue({
      ok: true,
      json: () => Promise.resolve(mockData),
    })

    const result = await loadData()
    expect(result.categories).toHaveLength(1)
    expect(result.categories[0].id).toBe('student')
  })

  it('returns empty categories on fetch failure', async () => {
    global.fetch = vi.fn().mockResolvedValue({ ok: false })

    const result = await loadData()
    expect(result.categories).toEqual([])
  })

  it('returns empty categories on network error', async () => {
    global.fetch = vi.fn().mockRejectedValue(new Error('Network error'))

    const result = await loadData()
    expect(result.categories).toEqual([])
  })
})
```

- [ ] **Step 2: Run test to verify it fails**

```bash
npm test
```

Expected: FAIL — `Cannot find module '../data/loader.js'`

- [ ] **Step 3: Create src/data/loader.js**

```js
export async function loadData() {
  try {
    const res = await fetch(import.meta.env.BASE_URL + 'data.json')
    if (!res.ok) return { categories: [] }
    return await res.json()
  } catch {
    return { categories: [] }
  }
}
```

- [ ] **Step 4: Run tests to verify they pass**

```bash
npm test
```

Expected: PASS — 3 tests passing.

- [ ] **Step 5: Commit**

```bash
git add src/data/loader.js src/tests/loader.test.js
git commit -m "feat: add data loader with tests"
```

---

## Task 4: NavTree Component

**Files:**
- Create: `src/components/NavTree.vue`
- Create: `src/tests/NavTree.test.js`

- [ ] **Step 1: Write failing tests**

Create `src/tests/NavTree.test.js`:

```js
import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import NavTree from '../components/NavTree.vue'

const categories = [
  {
    id: 'student',
    title: '学生培养',
    children: [
      { id: 'student-thesis', title: '学生优秀论文', items: [] },
      { id: 'student-award', title: '学生竞赛获奖', items: [] },
    ],
  },
  {
    id: 'international',
    title: '国际影响力',
    children: [],
    items: [],
  },
]

describe('NavTree', () => {
  it('renders all top-level category titles', () => {
    const wrapper = mount(NavTree, { props: { categories, activeId: '' } })
    expect(wrapper.text()).toContain('学生培养')
    expect(wrapper.text()).toContain('国际影响力')
  })

  it('shows children when parent is expanded', async () => {
    const wrapper = mount(NavTree, { props: { categories, activeId: '' } })
    await wrapper.find('[data-id="student"]').trigger('click')
    expect(wrapper.text()).toContain('学生优秀论文')
    expect(wrapper.text()).toContain('学生竞赛获奖')
  })

  it('emits select event with child id on child click', async () => {
    const wrapper = mount(NavTree, { props: { categories, activeId: '' } })
    await wrapper.find('[data-id="student"]').trigger('click')
    await wrapper.find('[data-id="student-thesis"]').trigger('click')
    expect(wrapper.emitted('select')).toBeTruthy()
    expect(wrapper.emitted('select')[0]).toEqual(['student-thesis'])
  })

  it('emits select event with category id for leaf category (no children)', async () => {
    const wrapper = mount(NavTree, { props: { categories, activeId: '' } })
    await wrapper.find('[data-id="international"]').trigger('click')
    expect(wrapper.emitted('select')[0]).toEqual(['international'])
  })

  it('highlights active item', () => {
    const wrapper = mount(NavTree, { props: { categories, activeId: 'student-thesis' } })
    const active = wrapper.find('.nav-item--active')
    expect(active.exists()).toBe(true)
    expect(active.attributes('data-id')).toBe('student-thesis')
  })
})
```

- [ ] **Step 2: Run tests to verify they fail**

```bash
npm test
```

Expected: FAIL — `Cannot find module '../components/NavTree.vue'`

- [ ] **Step 3: Create src/components/NavTree.vue**

```vue
<template>
  <nav class="nav-tree">
    <ul>
      <li v-for="cat in categories" :key="cat.id">
        <div
          class="nav-item nav-item--parent"
          :class="{ 'nav-item--active': activeId === cat.id }"
          :data-id="cat.id"
          @click="onParentClick(cat)"
        >
          <span class="nav-arrow" v-if="cat.children && cat.children.length">
            {{ expanded[cat.id] ? '▾' : '▸' }}
          </span>
          <span class="nav-arrow nav-arrow--leaf" v-else>•</span>
          {{ cat.title }}
        </div>
        <ul v-if="cat.children && cat.children.length && expanded[cat.id]" class="nav-children">
          <li v-for="child in cat.children" :key="child.id">
            <div
              class="nav-item nav-item--child"
              :class="{ 'nav-item--active': activeId === child.id }"
              :data-id="child.id"
              @click="emit('select', child.id)"
            >
              {{ child.title }}
            </div>
          </li>
        </ul>
      </li>
    </ul>
  </nav>
</template>

<script setup>
import { ref } from 'vue'

const props = defineProps({
  categories: { type: Array, required: true },
  activeId: { type: String, default: '' },
})

const emit = defineEmits(['select'])

const expanded = ref({})

function onParentClick(cat) {
  if (cat.children && cat.children.length) {
    expanded.value[cat.id] = !expanded.value[cat.id]
  } else {
    emit('select', cat.id)
  }
}
</script>
```

- [ ] **Step 4: Run tests to verify they pass**

```bash
npm test
```

Expected: PASS — 5 tests passing.

- [ ] **Step 5: Commit**

```bash
git add src/components/NavTree.vue src/tests/NavTree.test.js
git commit -m "feat: add NavTree component with tests"
```

---

## Task 5: MaterialCard Component

**Files:**
- Create: `src/components/MaterialCard.vue`
- Create: `src/tests/MaterialCard.test.js`

- [ ] **Step 1: Write failing tests**

Create `src/tests/MaterialCard.test.js`:

```js
import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import MaterialCard from '../components/MaterialCard.vue'

const base = {
  id: 'thesis-001',
  title: '深度学习研究',
  description: '2023年优秀论文',
  author: '张三',
  year: 2023,
  type: 'pdf',
  url: 'https://example.com/thesis.pdf',
  cover: '',
}

describe('MaterialCard', () => {
  it('renders title, author and year', () => {
    const wrapper = mount(MaterialCard, { props: { item: base } })
    expect(wrapper.text()).toContain('深度学习研究')
    expect(wrapper.text()).toContain('张三')
    expect(wrapper.text()).toContain('2023')
  })

  it('renders PDF icon for pdf type', () => {
    const wrapper = mount(MaterialCard, { props: { item: base } })
    expect(wrapper.find('.card-icon').text()).toBe('📄')
  })

  it('renders Word icon for word type', () => {
    const wrapper = mount(MaterialCard, { props: { item: { ...base, type: 'word' } } })
    expect(wrapper.find('.card-icon').text()).toBe('📝')
  })

  it('renders image thumbnail for image type', () => {
    const wrapper = mount(MaterialCard, {
      props: { item: { ...base, type: 'image', cover: 'https://example.com/cover.jpg' } },
    })
    const img = wrapper.find('.card-thumbnail')
    expect(img.exists()).toBe(true)
    expect(img.attributes('src')).toBe('https://example.com/cover.jpg')
  })

  it('view button has correct href and opens in new tab', () => {
    const wrapper = mount(MaterialCard, { props: { item: base } })
    const link = wrapper.find('.card-link')
    expect(link.attributes('href')).toBe('https://example.com/thesis.pdf')
    expect(link.attributes('target')).toBe('_blank')
  })
})
```

- [ ] **Step 2: Run tests to verify they fail**

```bash
npm test
```

Expected: FAIL — `Cannot find module '../components/MaterialCard.vue'`

- [ ] **Step 3: Create src/components/MaterialCard.vue**

```vue
<template>
  <div class="card">
    <div class="card-header">
      <span class="card-icon">{{ icon }}</span>
      <span class="card-year" v-if="item.year">{{ item.year }}</span>
    </div>
    <img
      v-if="item.type === 'image' && item.cover"
      class="card-thumbnail"
      :src="item.cover"
      :alt="item.title"
    />
    <h3 class="card-title">{{ item.title }}</h3>
    <p class="card-author" v-if="item.author">{{ item.author }}</p>
    <p class="card-desc" v-if="item.description">{{ item.description }}</p>
    <a
      class="card-link"
      :href="item.url"
      target="_blank"
      rel="noopener noreferrer"
    >查看文件</a>
  </div>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  item: { type: Object, required: true },
})

const iconMap = { pdf: '📄', word: '📝', image: '🖼️', link: '🔗' }
const icon = computed(() => iconMap[props.item.type] ?? '📎')
</script>
```

- [ ] **Step 4: Run tests to verify they pass**

```bash
npm test
```

Expected: PASS — 5 tests passing.

- [ ] **Step 5: Commit**

```bash
git add src/components/MaterialCard.vue src/tests/MaterialCard.test.js
git commit -m "feat: add MaterialCard component with tests"
```

---

## Task 6: MaterialList Component

**Files:**
- Create: `src/components/MaterialList.vue`
- Create: `src/tests/MaterialList.test.js`

- [ ] **Step 1: Write failing tests**

Create `src/tests/MaterialList.test.js`:

```js
import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import MaterialList from '../components/MaterialList.vue'

const items = [
  { id: 'a', title: '论文A', author: '张三', year: 2023, type: 'pdf', url: '#', cover: '', description: '' },
  { id: 'b', title: '论文B', author: '李四', year: 2022, type: 'pdf', url: '#', cover: '', description: '' },
  { id: 'c', title: '论文C', author: '王五', year: 2023, type: 'pdf', url: '#', cover: '', description: '' },
]

describe('MaterialList', () => {
  it('renders all items when no year filter', () => {
    const wrapper = mount(MaterialList, {
      props: { items, title: '学生优秀论文', breadcrumb: '学生培养 / 学生优秀论文' },
    })
    expect(wrapper.findAll('.card')).toHaveLength(3)
  })

  it('filters items by selected year', async () => {
    const wrapper = mount(MaterialList, {
      props: { items, title: '学生优秀论文', breadcrumb: '学生培养 / 学生优秀论文' },
    })
    await wrapper.find('select').setValue('2022')
    expect(wrapper.findAll('.card')).toHaveLength(1)
    expect(wrapper.text()).toContain('论文B')
  })

  it('renders breadcrumb text', () => {
    const wrapper = mount(MaterialList, {
      props: { items, title: '学生优秀论文', breadcrumb: '学生培养 / 学生优秀论文' },
    })
    expect(wrapper.find('.breadcrumb').text()).toContain('学生培养 / 学生优秀论文')
  })

  it('shows empty state when no items match filter', async () => {
    const wrapper = mount(MaterialList, {
      props: { items, title: '学生优秀论文', breadcrumb: '' },
    })
    await wrapper.find('select').setValue('2020')
    expect(wrapper.find('.empty-state').exists()).toBe(true)
  })

  it('shows empty state when items array is empty', () => {
    const wrapper = mount(MaterialList, {
      props: { items: [], title: '学生优秀论文', breadcrumb: '' },
    })
    expect(wrapper.find('.empty-state').exists()).toBe(true)
  })
})
```

- [ ] **Step 2: Run tests to verify they fail**

```bash
npm test
```

Expected: FAIL — `Cannot find module '../components/MaterialList.vue'`

- [ ] **Step 3: Create src/components/MaterialList.vue**

```vue
<template>
  <div class="material-list">
    <div class="list-header">
      <div class="breadcrumb" v-if="breadcrumb">{{ breadcrumb }}</div>
      <div class="list-controls">
        <label for="year-filter">年份：</label>
        <select id="year-filter" v-model="selectedYear">
          <option value="">全部</option>
          <option v-for="y in years" :key="y" :value="String(y)">{{ y }}</option>
        </select>
      </div>
    </div>
    <div v-if="filtered.length" class="card-grid">
      <MaterialCard v-for="item in filtered" :key="item.id" :item="item" />
    </div>
    <div v-else class="empty-state">暂无材料</div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import MaterialCard from './MaterialCard.vue'

const props = defineProps({
  items: { type: Array, required: true },
  title: { type: String, default: '' },
  breadcrumb: { type: String, default: '' },
})

const selectedYear = ref('')

const years = computed(() => {
  const set = new Set(props.items.map(i => i.year).filter(Boolean))
  return [...set].sort((a, b) => b - a)
})

const filtered = computed(() => {
  if (!selectedYear.value) return props.items
  return props.items.filter(i => String(i.year) === selectedYear.value)
})
</script>
```

- [ ] **Step 4: Run tests to verify they pass**

```bash
npm test
```

Expected: PASS — all 18 tests passing (3 loader + 5 NavTree + 5 MaterialCard + 5 MaterialList).

- [ ] **Step 5: Commit**

```bash
git add src/components/MaterialList.vue src/tests/MaterialList.test.js
git commit -m "feat: add MaterialList component with year filter and tests"
```

---

## Task 7: App.vue Root Layout

**Files:**
- Modify: `src/App.vue`

- [ ] **Step 1: Replace src/App.vue skeleton with full implementation**

```vue
<template>
  <div class="app">
    <header class="app-header">
      <div class="header-inner">
        <span class="header-title">教学成果奖材料展示平台</span>
      </div>
    </header>
    <div class="app-body">
      <aside class="app-sidebar">
        <NavTree
          v-if="data"
          :categories="data.categories"
          :activeId="activeId"
          @select="onSelect"
        />
      </aside>
      <main class="app-main">
        <MaterialList
          v-if="activeNode"
          :items="activeNode.items"
          :title="activeNode.title"
          :breadcrumb="breadcrumb"
        />
        <div v-else class="welcome">
          <p>请从左侧导航选择分类查看材料</p>
        </div>
      </main>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import NavTree from './components/NavTree.vue'
import MaterialList from './components/MaterialList.vue'
import { loadData } from './data/loader.js'

const data = ref(null)
const activeId = ref('')

onMounted(async () => {
  data.value = await loadData()
  const first = data.value.categories[0]
  if (first?.children?.length) {
    activeId.value = first.children[0].id
  } else if (first) {
    activeId.value = first.id
  }
})

function onSelect(id) {
  activeId.value = id
}

const activeNode = computed(() => {
  if (!data.value || !activeId.value) return null
  for (const cat of data.value.categories) {
    if (cat.id === activeId.value) return cat
    if (cat.children) {
      const child = cat.children.find(c => c.id === activeId.value)
      if (child) return child
    }
  }
  return null
})

const breadcrumb = computed(() => {
  if (!data.value || !activeId.value) return ''
  for (const cat of data.value.categories) {
    if (cat.id === activeId.value) return cat.title
    if (cat.children) {
      const child = cat.children.find(c => c.id === activeId.value)
      if (child) return `${cat.title} / ${child.title}`
    }
  }
  return ''
})
</script>
```

- [ ] **Step 2: Run all tests to verify nothing broke**

```bash
npm test
```

Expected: All 13 tests PASS.

- [ ] **Step 3: Verify in browser**

```bash
npm run dev
```

Open `http://localhost:5173/aiedu-showcase/`. Verify:
- Left nav shows 4 top-level categories
- Clicking "学生培养" expands to show 3 children
- Clicking a child renders material cards on the right
- Cards show title, author, year tag, and "查看文件" button
- "国际影响力" (no children) navigates directly to its material list

- [ ] **Step 4: Commit**

```bash
git add src/App.vue
git commit -m "feat: wire up App.vue root layout with reactive nav and material list"
```

---

## Task 8: Academic CSS Styles

**Files:**
- Modify: `src/style.css`

- [ ] **Step 1: Replace src/style.css with full academic theme**

```css
*, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

body {
  font-family: "Source Han Serif SC", "Noto Serif SC", "SimSun", Georgia, serif;
  font-size: 15px;
  color: #1a1a1a;
  background: #fff;
  line-height: 1.6;
}

/* ── Layout ── */
.app { display: flex; flex-direction: column; min-height: 100vh; }

.app-header {
  height: 60px;
  background: #fff;
  border-bottom: 1px solid #d0d0d0;
  display: flex;
  align-items: center;
  padding: 0 24px;
  position: sticky;
  top: 0;
  z-index: 100;
}
.header-inner { display: flex; align-items: center; width: 100%; }
.header-title { font-size: 18px; font-weight: 600; letter-spacing: 0.05em; color: #1a1a1a; }

.app-body { display: flex; flex: 1; }

.app-sidebar {
  width: 240px;
  min-width: 240px;
  border-right: 1px solid #d0d0d0;
  padding: 16px 0;
  position: sticky;
  top: 60px;
  height: calc(100vh - 60px);
  overflow-y: auto;
}

.app-main { flex: 1; padding: 24px 32px; }

/* ── Navigation ── */
.nav-tree ul { list-style: none; }
.nav-tree > ul > li { margin-bottom: 2px; }
.nav-item {
  padding: 6px 16px;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 14px;
  color: #333;
  user-select: none;
  transition: background 0.15s;
}
.nav-item:hover { background: #f5f5f5; }
.nav-item--active { background: #eef2f8; color: #1a4a8a; font-weight: 600; }
.nav-item--parent { font-weight: 500; }
.nav-item--child { padding-left: 36px; font-size: 13px; }
.nav-arrow { font-size: 11px; width: 14px; text-align: center; color: #888; }
.nav-arrow--leaf { color: #ccc; }

/* ── List header ── */
.list-header { margin-bottom: 20px; }
.breadcrumb {
  font-size: 13px;
  color: #666;
  padding-bottom: 12px;
  margin-bottom: 12px;
  border-bottom: 1px solid #eee;
}
.list-controls { display: flex; align-items: center; gap: 8px; font-size: 13px; color: #555; }
.list-controls select {
  border: 1px solid #ccc;
  border-radius: 3px;
  padding: 3px 8px;
  font-size: 13px;
  background: #fff;
  cursor: pointer;
}

/* ── Card grid ── */
.card-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(260px, 1fr));
  gap: 20px;
}

/* ── Card ── */
.card {
  border: 1px solid #d8d8d8;
  border-radius: 4px;
  padding: 16px;
  display: flex;
  flex-direction: column;
  gap: 8px;
  background: #fff;
  transition: box-shadow 0.15s;
}
.card:hover { box-shadow: 0 2px 8px rgba(0,0,0,0.08); }
.card-header { display: flex; justify-content: space-between; align-items: center; }
.card-icon { font-size: 20px; }
.card-year {
  font-size: 11px;
  color: #888;
  background: #f5f5f5;
  padding: 2px 8px;
  border-radius: 10px;
}
.card-thumbnail {
  width: 100%;
  height: 160px;
  object-fit: cover;
  border-radius: 3px;
  border: 1px solid #eee;
}
.card-title { font-size: 14px; font-weight: 600; color: #1a1a1a; line-height: 1.4; }
.card-author { font-size: 12px; color: #666; }
.card-desc { font-size: 12px; color: #777; line-height: 1.5; }
.card-link {
  display: inline-block;
  margin-top: 4px;
  padding: 5px 14px;
  font-size: 12px;
  color: #1a4a8a;
  border: 1px solid #1a4a8a;
  border-radius: 3px;
  text-decoration: none;
  text-align: center;
  transition: background 0.15s, color 0.15s;
}
.card-link:hover { background: #1a4a8a; color: #fff; }

/* ── Empty / welcome ── */
.empty-state, .welcome {
  color: #999;
  font-size: 14px;
  text-align: center;
  padding: 80px 20px;
}

/* ── Responsive ── */
@media (max-width: 768px) {
  .app-body { flex-direction: column; }
  .app-sidebar {
    width: 100%;
    height: auto;
    position: static;
    border-right: none;
    border-bottom: 1px solid #d0d0d0;
  }
  .app-main { padding: 16px; }
  .card-grid { grid-template-columns: 1fr; }
}
```

- [ ] **Step 2: Verify visual result in browser**

```bash
npm run dev
```

Open `http://localhost:5173/aiedu-showcase/`. Verify:
- White background, serif font, subtle gray borders throughout
- Left nav has proper indentation, active item highlighted in light blue
- Cards have hover shadow, year badge, blue outlined button
- On narrow window (< 768px) sidebar stacks above content

- [ ] **Step 3: Commit**

```bash
git add src/style.css
git commit -m "style: add academic white theme"
```

---

## Task 9: GitHub Actions Deploy

**Files:**
- Create: `.github/workflows/deploy.yml`

- [ ] **Step 1: Create the workflows directory**

```bash
mkdir -p .github/workflows
```

- [ ] **Step 2: Create .github/workflows/deploy.yml**

```yaml
name: Deploy to GitHub Pages

on:
  push:
    branches: [main]

permissions:
  contents: write

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: 20
          cache: npm
      - run: npm ci
      - run: npm test
      - run: npm run build
      - uses: peaceiris/actions-gh-pages@v4
        with:
          github_token: ${{ secrets.GITHUB_TOKEN }}
          publish_dir: ./dist
```

- [ ] **Step 3: Verify local build succeeds**

```bash
npm run build
```

Expected: `dist/` directory created containing `index.html`, `assets/`, `data.json`. No errors.

- [ ] **Step 4: Commit and push**

```bash
git add .github/workflows/deploy.yml
git commit -m "ci: add github actions deploy to gh-pages"
git push origin main
```

Expected: GitHub Actions workflow triggers automatically on push.

- [ ] **Step 5: Enable GitHub Pages in repository settings**

1. Open repository on GitHub → **Settings** → **Pages**
2. Under **Source**, select **Deploy from a branch**
3. Branch: **gh-pages** / **/ (root)**
4. Click **Save**

Expected: Within ~2 minutes, site live at `https://<username>.github.io/aiedu-showcase/`

---

## Task 10: Smoke Test

- [ ] **Step 1: Run full test suite**

```bash
npm test
```

Expected: All 18 tests PASS (3 loader + 5 NavTree + 5 MaterialCard + 5 MaterialList).

- [ ] **Step 2: Run production build**

```bash
npm run build
```

Expected: No errors. `dist/data.json` exists alongside `dist/index.html`.

- [ ] **Step 3: Preview production build locally**

```bash
npx vite preview
```

Open `http://localhost:4173/aiedu-showcase/`. Verify:
- All 4 nav categories appear
- Year filter works correctly
- "查看文件" links open in a new tab
- "国际影响力" navigates directly to its items (no expand needed)
- Page is usable on a narrow window

- [ ] **Step 4: Verify repo is clean**

```bash
git status
```

Expected: `nothing to commit, working tree clean`
