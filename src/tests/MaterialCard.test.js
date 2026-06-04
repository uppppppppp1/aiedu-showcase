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

  it('renders PDF badge for pdf type', () => {
    const wrapper = mount(MaterialCard, { props: { item: base } })
    expect(wrapper.find('.card-type-badge').text()).toBe('PDF')
  })

  it('renders Word badge for word type', () => {
    const wrapper = mount(MaterialCard, { props: { item: { ...base, type: 'word' } } })
    expect(wrapper.find('.card-type-badge').text()).toBe('Word')
  })

  it('renders image thumbnail for image type', () => {
    const wrapper = mount(MaterialCard, {
      props: { item: { ...base, type: 'image', cover: 'https://example.com/cover.jpg' } },
    })
    const img = wrapper.find('.card-thumbnail')
    expect(img.exists()).toBe(true)
    expect(img.attributes('src')).toBe('https://example.com/cover.jpg')
  })

  it('view button links directly to the file url', () => {
    const wrapper = mount(MaterialCard, { props: { item: base } })
    const link = wrapper.find('.card-link')
    expect(link.attributes('href')).toBe('https://example.com/thesis.pdf')
    expect(link.attributes('target')).toBe('_blank')
  })

  it('view button uses direct url for image type', () => {
    const wrapper = mount(MaterialCard, {
      props: { item: { ...base, type: 'image', url: 'https://example.com/img.jpg', cover: 'https://example.com/img.jpg' } },
    })
    expect(wrapper.find('.card-link').text()).toContain('查看图片')
  })
})
