const MATERIALS_URL = '/assets/data/materials.json';

async function loadMaterials() {
  const response = await fetch(MATERIALS_URL, { cache: 'no-cache' });
  return response.ok ? response.json() : [];
}

function renderMaterialCard(material) {
  return `
    <article class="material-card">
      <div class="card-image"><img src="${material.cover}" alt="${material.title} 封面" loading="lazy"></div>
      <div class="card-body">
        <span class="tag">${material.category} / ${material.subcategory}</span>
        <h3>${material.title}</h3>
        <p>${material.description}</p>
        <div class="card-meta"><span>${material.date}</span><span>${material.type}</span></div>
        <div class="card-actions"><button class="button small" type="button" data-id="${material.id}">查看详情</button></div>
      </div>
    </article>
  `;
}

function renderMaterialsList(container, materials) {
  container.innerHTML = materials.map(renderMaterialCard).join('') || '<p>暂无材料。</p>';
}

function createSubcategoryChips(subcategories) {
  return subcategories.map(name => `<span class="subcategory-chip">${name}</span>`).join('');
}

function showDetailModal(material) {
  const attachmentsHtml = material.attachments.map(item => {
    if (item.mime === 'application/pdf') {
      return `<div class="attachment"><strong>${item.label}</strong>：<a href="${item.url}" target="_blank">查看 PDF</a></div>`;
    }
    if (item.mime.startsWith('image/')) {
      return `<div class="attachment"><strong>${item.label}</strong><img src="${item.url}" alt="${item.label}" style="max-width:100%;border-radius:12px;margin-top:8px"></div>`;
    }
    return `<div class="attachment"><strong>${item.label}</strong>：<a href="${item.url}" target="_blank">下载文件</a></div>`;
  }).join('');

  const dialog = document.createElement('div');
  dialog.className = 'detail-modal';
  dialog.innerHTML = `
    <div class="detail-box">
      <button class="close-modal" type="button">×</button>
      <h2>${material.title}</h2>
      <p>${material.category} / ${material.subcategory} · ${material.date}</p>
      <p>${material.description}</p>
      <div>${attachmentsHtml}</div>
    </div>
  `;
  document.body.appendChild(dialog);
  dialog.querySelector('.close-modal').addEventListener('click', () => dialog.remove());
  dialog.addEventListener('click', event => { if (event.target === dialog) dialog.remove(); });
}

function bindDetailButtons() {
  document.querySelectorAll('[data-id]').forEach(button => {
    button.addEventListener('click', async () => {
      const id = button.getAttribute('data-id');
      const materials = await loadMaterials();
      const material = materials.find(item => item.id === id);
      if (material) showDetailModal(material);
    });
  });
}

function populateLatest(materials) {
  const latest = materials.slice().sort((a, b) => new Date(b.date) - new Date(a.date)).slice(0, 6);
  const container = document.getElementById('latest-list');
  if (container) renderMaterialsList(container, latest);
}

function populateCategoryPage(materials, pageCategory) {
  const categorySection = document.getElementById('category-materials');
  if (!categorySection) return;
  const filtered = materials.filter(item => item.category === pageCategory);
  renderMaterialsList(categorySection, filtered);
  bindDetailButtons();
}

function populateSearch(materials) {
  const input = document.getElementById('search-input');
  const results = document.getElementById('search-results');
  if (!input || !results) return;

  const search = () => {
    const query = input.value.trim().toLowerCase();
    const filtered = query
      ? materials.filter(item => [item.title, item.description, item.category, item.subcategory, ...(item.tags || [])].some(field => field.toLowerCase().includes(query)))
      : [];
    renderMaterialsList(results, filtered);
    bindDetailButtons();
  };
  input.addEventListener('input', search);
}

function populateSubcategories(page) {
  const container = document.getElementById('subcategory-list');
  if (!container) return;
  const subcategories = page.subcategoryList || [];
  container.innerHTML = createSubcategoryChips(subcategories);
}

async function initPage() {
  const materials = await loadMaterials();
  const pageCategory = document.body.getAttribute('data-category');
  if (materialExists(materials) && pageCategory) {
    populateCategoryPage(materials, pageCategory);
    populateSubcategories({ subcategoryList: JSON.parse(document.body.getAttribute('data-subcategories') || '[]') });
  }
  const latestSection = document.getElementById('latest-list');
  if (latestSection) populateLatest(materials);
  populateSearch(materials);
  bindDetailButtons();
}

function materialExists(materials) {
  return Array.isArray(materials) && materials.length > 0;
}

if (document.readyState !== 'loading') {
  initPage();
} else {
  document.addEventListener('DOMContentLoaded', initPage);
}
