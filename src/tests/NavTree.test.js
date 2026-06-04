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
