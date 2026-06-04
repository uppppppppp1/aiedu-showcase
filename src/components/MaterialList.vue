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

defineExpose({ selectedYear })
</script>
