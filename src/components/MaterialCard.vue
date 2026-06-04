<template>
  <div class="card">
    <div class="card-top-bar"></div>
    <div class="card-header">
      <span class="card-type-badge">{{ typeBadge }}</span>
      <span class="card-year" v-if="item.year">{{ item.year }}</span>
    </div>
    <img
      v-if="item.type === 'image' && item.cover"
      class="card-thumbnail"
      :src="item.cover"
      :alt="item.title"
      @click="lightboxOpen = true"
    />
    <h3 class="card-title">{{ item.title }}</h3>
    <p class="card-author" v-if="item.author">{{ item.author }}</p>
    <p class="card-desc" v-if="item.description">{{ item.description }}</p>
    <button
      v-if="item.type === 'image'"
      class="card-link"
      @click="lightboxOpen = true"
    >查看图片 <span class="card-link-arrow">→</span></button>
    <a
      v-else
      class="card-link"
      :href="viewUrl"
      target="_blank"
      rel="noopener noreferrer"
    >查看文件 <span class="card-link-arrow">→</span></a>
  </div>

  <Teleport to="body">
    <div v-if="lightboxOpen" class="lightbox" @click="lightboxOpen = false">
      <img :src="item.url" :alt="item.title" class="lightbox-img" @click.stop />
      <button class="lightbox-close" @click="lightboxOpen = false">✕</button>
    </div>
  </Teleport>
</template>

<script setup>
import { ref, computed } from 'vue'

const props = defineProps({
  item: { type: Object, required: true },
})

const lightboxOpen = ref(false)

const typeMap = { pdf: 'PDF', word: 'Word', image: '图片', link: '链接' }
const typeBadge = computed(() => typeMap[props.item.type] ?? 'FILE')

const viewUrl = computed(() => {
  const { type, url } = props.item
  if (type === 'pdf' || type === 'word') {
    return 'https://docs.google.com/viewer?url=' + encodeURIComponent(url)
  }
  return url
})
</script>
