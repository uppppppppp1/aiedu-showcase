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
import { ref, watch } from 'vue'

const props = defineProps({
  categories: { type: Array, required: true },
  activeId: { type: String, default: '' },
})

const emit = defineEmits(['select'])

const expanded = ref({})

function expandParentOf(id) {
  for (const cat of props.categories) {
    if (cat.children && cat.children.some(c => c.id === id)) {
      expanded.value[cat.id] = true
      break
    }
  }
}

watch(() => props.activeId, (id) => { if (id) expandParentOf(id) }, { immediate: true })

function onParentClick(cat) {
  if (cat.children && cat.children.length) {
    expanded.value[cat.id] = !expanded.value[cat.id]
  } else {
    emit('select', cat.id)
  }
}
</script>
