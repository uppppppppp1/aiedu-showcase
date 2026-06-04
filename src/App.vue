<template>
  <!-- Navbar -->
  <nav class="navbar">
    <div class="navbar-inner">
      <span class="navbar-brand" @click="goHome">教学成果奖材料展示</span>
      <div class="navbar-links">
        <a
          v-for="cat in categories"
          :key="cat.id"
          class="navbar-link"
          :class="{ active: activeCatId === cat.id }"
          @click="selectCat(cat.id)"
        >{{ cat.title }}</a>
      </div>
    </div>
  </nav>

  <!-- Home view -->
  <main v-if="view === 'home'" class="page-home">
    <div class="hero">
      <h1 class="hero-title">教学成果奖材料展示</h1>
      <p class="hero-sub">教学成果奖申报材料公开展示平台</p>
      <div class="hero-divider"></div>
    </div>
    <div class="cat-grid">
      <div
        v-for="(cat, idx) in categories"
        :key="cat.id"
        class="cat-card"
        @click="selectCat(cat.id)"
      >
        <div class="cat-num">{{ String(idx + 1).padStart(2, '0') }}</div>
        <h2 class="cat-card-title">{{ cat.title }}</h2>
        <p class="cat-card-desc">{{ cat.description }}</p>
        <div class="cat-card-count">
          <span class="count-badge">{{ countItems(cat) }}</span>
          <span class="count-label">项成果</span>
        </div>
      </div>
    </div>
  </main>

  <!-- Category / sub-category view -->
  <main v-else class="page-detail">
    <div class="detail-header">
      <div class="detail-breadcrumb">
        <span class="bc-home" @click="goHome">首页</span>
        <span class="bc-sep">›</span>
        <span class="bc-cat">{{ activeCategory.title }}</span>
        <span v-if="activeSubId" class="bc-sep">›</span>
        <span v-if="activeSubId" class="bc-sub">{{ activeSub?.title }}</span>
      </div>
      <!-- Sub-category tabs -->
      <div v-if="activeCategory.children && activeCategory.children.length" class="sub-tabs">
        <button
          v-for="child in activeCategory.children"
          :key="child.id"
          class="sub-tab"
          :class="{ active: activeSubId === child.id }"
          @click="activeSubId = child.id"
        >{{ child.title }}</button>
      </div>
    </div>
    <div class="detail-body">
      <MaterialList
        v-if="activeNode"
        :items="activeNode.items"
        :title="activeNode.title"
        :breadcrumb="''"
      />
    </div>
  </main>

  <footer class="site-footer">
    <span>© 2026 教学成果奖材料展示</span>
  </footer>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import MaterialList from './components/MaterialList.vue'
import { loadData } from './data/loader.js'

const data = ref(null)
const view = ref('home')
const activeCatId = ref('')
const activeSubId = ref('')

const categories = computed(() => data.value?.categories ?? [])

const activeCategory = computed(() =>
  categories.value.find(c => c.id === activeCatId.value) ?? null
)

const activeSub = computed(() =>
  activeCategory.value?.children?.find(c => c.id === activeSubId.value) ?? null
)

const activeNode = computed(() => {
  if (!activeCategory.value) return null
  if (activeSubId.value) return activeSub.value
  if (!activeCategory.value.children?.length) return activeCategory.value
  return null
})

function countItems(cat) {
  if (!cat.children?.length) return cat.items?.length ?? 0
  return cat.children.reduce((n, c) => n + (c.items?.length ?? 0), 0)
}

function selectCat(id) {
  activeCatId.value = id
  view.value = 'detail'
  const cat = categories.value.find(c => c.id === id)
  activeSubId.value = cat?.children?.[0]?.id ?? ''
}

function goHome() {
  view.value = 'home'
  activeCatId.value = ''
  activeSubId.value = ''
}

onMounted(async () => {
  data.value = await loadData()
})
</script>
