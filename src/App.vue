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
