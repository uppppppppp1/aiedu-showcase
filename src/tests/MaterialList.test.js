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
    wrapper.vm.selectedYear = '2020'
    await wrapper.vm.$nextTick()
    expect(wrapper.find('.empty-state').exists()).toBe(true)
  })

  it('shows empty state when items array is empty', () => {
    const wrapper = mount(MaterialList, {
      props: { items: [], title: '学生优秀论文', breadcrumb: '' },
    })
    expect(wrapper.find('.empty-state').exists()).toBe(true)
  })
})
