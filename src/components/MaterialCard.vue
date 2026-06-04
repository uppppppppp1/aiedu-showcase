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
      :src="coverSrc"
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
      <img :src="fullUrl(item.url)" :alt="item.title" class="lightbox-img" @click.stop />
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

const BASE = import.meta.env.BASE_URL

// 相对路径（materials/...）自动拼接 base，绝对 URL 直接使用
function fullUrl(url) {
  if (!url) return ''
  if (url.startsWith('http')) return url
  return BASE + url
}

const typeMap = { pdf: 'PDF', word: 'Word', image: '图片', link: '链接' }
const typeBadge = computed(() => typeMap[props.item.type] ?? 'FILE')

const coverSrc = computed(() => fullUrl(props.item.cover))

const viewUrl = computed(() => fullUrl(props.item.url))
</script>
