export async function loadData() {
  try {
    const res = await fetch(import.meta.env.BASE_URL + 'data.json')
    if (!res.ok) return { categories: [] }
    return await res.json()
  } catch {
    return { categories: [] }
  }
}
