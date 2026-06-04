import { describe, it, expect, vi, beforeEach } from 'vitest'
import { loadData } from '../data/loader.js'

describe('loadData', () => {
  beforeEach(() => {
    vi.restoreAllMocks()
  })

  it('returns parsed categories on success', async () => {
    const mockData = { categories: [{ id: 'student', title: '学生培养', children: [] }] }
    global.fetch = vi.fn().mockResolvedValue({
      ok: true,
      json: () => Promise.resolve(mockData),
    })

    const result = await loadData()
    expect(result.categories).toHaveLength(1)
    expect(result.categories[0].id).toBe('student')
  })

  it('returns empty categories on fetch failure', async () => {
    global.fetch = vi.fn().mockResolvedValue({ ok: false })

    const result = await loadData()
    expect(result.categories).toEqual([])
  })

  it('returns empty categories on network error', async () => {
    global.fetch = vi.fn().mockRejectedValue(new Error('Network error'))

    const result = await loadData()
    expect(result.categories).toEqual([])
  })
})
