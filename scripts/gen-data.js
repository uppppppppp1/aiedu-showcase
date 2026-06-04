/**
 * 扫描 public/materials/ 文件夹，自动生成 public/data.json
 * 用法: npm run gen
 */
import { readdirSync, statSync, writeFileSync } from 'fs'
import { join, extname, basename } from 'path'
import { fileURLToPath } from 'url'
import path from 'path'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const MATERIALS_DIR = join(__dirname, '../public/materials')
const OUTPUT_FILE   = join(__dirname, '../public/data.json')

const IMAGE_EXTS = new Set(['.jpg', '.jpeg', '.png', '.gif', '.webp', '.bmp', '.svg'])
const WORD_EXTS  = new Set(['.doc', '.docx'])
const PDF_EXTS   = new Set(['.pdf'])

function getType(filename) {
  const ext = extname(filename).toLowerCase()
  if (PDF_EXTS.has(ext))   return 'pdf'
  if (WORD_EXTS.has(ext))  return 'word'
  if (IMAGE_EXTS.has(ext)) return 'image'
  return 'link'
}

// "1 学生培养" → "学生培养"，"1-2 竞赛获奖" → "竞赛获奖"
function extractTitle(name) {
  return name.replace(/^\d+(-\d+)*\s+/, '').trim()
}

// 对路径各段做 encodeURIComponent，保留斜杠
function encodePath(relPath) {
  return relPath.split('/').map(s => encodeURIComponent(s)).join('/')
}

// 按开头数字升序排列，相同数字再按中文排
function sortedEntries(dir) {
  return readdirSync(dir)
    .filter(f => !f.startsWith('.'))
    .sort((a, b) => {
      const na = parseInt(a.match(/^\d+/)?.[0] ?? '99999')
      const nb = parseInt(b.match(/^\d+/)?.[0] ?? '99999')
      if (na !== nb) return na - nb
      return a.localeCompare(b, 'zh-CN')
    })
}

function buildItems(dir, ...pathSegments) {
  return sortedEntries(dir)
    .filter(f => !statSync(join(dir, f)).isDirectory())
    .map((file, fi) => {
      const type  = getType(file)
      const title = basename(file, extname(file))
      const url   = encodePath([...pathSegments, file].join('/'))
      return {
        id:          [...pathSegments.map((_, i) => i + 1), fi + 1].join('-'),
        title,
        description: '',
        author:      '',
        year:        null,
        type,
        url,
        cover:       type === 'image' ? url : '',
      }
    })
}

// ── 扫描顶级分类 ──────────────────────────────────────────
const catFolders = sortedEntries(MATERIALS_DIR)
  .filter(f => statSync(join(MATERIALS_DIR, f)).isDirectory())

const categories = catFolders.map((catFolder, ci) => {
  const catPath  = join(MATERIALS_DIR, catFolder)
  const catId    = `cat-${ci + 1}`
  const catTitle = extractTitle(catFolder)

  const entries  = sortedEntries(catPath)
  const subDirs  = entries.filter(e => statSync(join(catPath, e)).isDirectory())

  if (subDirs.length > 0) {
    // 有子分类
    const children = subDirs.map((subFolder, si) => {
      const subPath  = join(catPath, subFolder)
      const subId    = `sub-${ci + 1}-${si + 1}`
      const subTitle = extractTitle(subFolder)
      const items    = buildItems(subPath, 'materials', catFolder, subFolder)
        .map((item, fi) => ({ ...item, id: `${subId}-${fi + 1}` }))
      return { id: subId, title: subTitle, items }
    })
    return { id: catId, title: catTitle, description: '', children }
  } else {
    // 叶子分类（直接放文件）
    const items = buildItems(catPath, 'materials', catFolder)
      .map((item, fi) => ({ ...item, id: `${catId}-${fi + 1}` }))
    return { id: catId, title: catTitle, description: '', children: [], items }
  }
})

// ── 写入文件 ───────────────────────────────────────────────
writeFileSync(OUTPUT_FILE, JSON.stringify({ categories }, null, 2), 'utf-8')

// ── 打印摘要 ───────────────────────────────────────────────
console.log('\n✓ data.json 已生成\n')
const rows = categories.map(cat => {
  const count = cat.children?.length
    ? cat.children.reduce((n, c) => n + c.items.length, 0)
    : (cat.items?.length ?? 0)
  return { 分类: cat.title, 子分类数: cat.children?.length ?? 0, 文件数: count }
})
console.table(rows)
console.log(`  合计 ${rows.reduce((n, r) => n + r.文件数, 0)} 个文件\n`)
