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
