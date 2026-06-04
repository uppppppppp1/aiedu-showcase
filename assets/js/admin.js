const GITHUB_API_BASE = 'https://api.github.com';
const REPO_OWNER = 'uppppppppp1';
const REPO_NAME = 'aiedu-showcase';
const MATERIALS_PATH = 'assets/data/materials.json';

async function uploadFileToGithub(file, targetPath, authToken) {
  const safePath = targetPath.split('/').map(encodeURIComponent).join('/');
  const endpoint = `${GITHUB_API_BASE}/repos/${REPO_OWNER}/${REPO_NAME}/contents/${safePath}`;
  const content = await file.arrayBuffer();
  const base64 = btoa(String.fromCharCode(...new Uint8Array(content)));
  const response = await fetch(endpoint, {
    method: 'PUT',
    headers: {
      Authorization: `token ${authToken}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      message: `Upload ${targetPath}`,
      content: base64
    })
  });
  const payload = await response.json();
  if (!response.ok) {
    throw new Error(payload.message || '上传文件失败');
  }
  return payload.content.download_url;
}

async function fetchMaterialsJson(authToken) {
  const safePath = MATERIALS_PATH.split('/').map(encodeURIComponent).join('/');
  const endpoint = `${GITHUB_API_BASE}/repos/${REPO_OWNER}/${REPO_NAME}/contents/${safePath}`;
  const response = await fetch(endpoint, {
    headers: { Authorization: `token ${authToken}` }
  });
  const payload = await response.json();
  if (!response.ok) throw new Error(payload.message || '获取 materials.json 失败');
  const contentText = atob(payload.content.replace(/\n/g, ''));
  return { data: JSON.parse(contentText), sha: payload.sha };
}

async function updateMaterialsJson(materials, sha, authToken) {
  const safePath = MATERIALS_PATH.split('/').map(encodeURIComponent).join('/');
  const endpoint = `${GITHUB_API_BASE}/repos/${REPO_OWNER}/${REPO_NAME}/contents/${safePath}`;
  const content = btoa(unescape(encodeURIComponent(JSON.stringify(materials, null, 2))));
  const response = await fetch(endpoint, {
    method: 'PUT',
    headers: {
      Authorization: `token ${authToken}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      message: 'Update materials data',
      content,
      sha
    })
  });
  const payload = await response.json();
  if (!response.ok) {
    throw new Error(payload.message || '更新 materials.json 失败');
  }
  return payload;
}

function getFormValue(id) {
  return document.getElementById(id).value.trim();
}

function showStatus(message, isError = false) {
  const status = document.getElementById('admin-status');
  status.textContent = message;
  status.style.color = isError ? '#c53030' : '#065f46';
}

function buildMaterialEntry(fields, coverUrl, attachments) {
  return {
    id: fields.id || `material-${Date.now()}`,
    category: fields.category,
    subcategory: fields.subcategory,
    title: fields.title,
    description: fields.description,
    date: fields.date,
    type: fields.type,
    tags: fields.tags.split(',').map(tag => tag.trim()).filter(Boolean),
    cover: coverUrl,
    attachments
  };
}

async function handleUpload(event) {
  event.preventDefault();
  showStatus('正在准备上传...', false);

  const token = getFormValue('github-token');
  if (!token) {
    showStatus('请输入 GitHub Personal Access Token。', true);
    return;
  }

  const fields = {
    id: getFormValue('material-id'),
    category: getFormValue('category'),
    subcategory: getFormValue('subcategory'),
    title: getFormValue('title'),
    description: getFormValue('description'),
    date: getFormValue('date'),
    type: getFormValue('type'),
    tags: getFormValue('tags')
  };

  if (!fields.category || !fields.title || !fields.date) {
    showStatus('请填写分类、标题和时间。', true);
    return;
  }

  const coverFile = document.getElementById('cover-file').files[0];
  const attachmentFiles = Array.from(document.getElementById('attachment-files').files);
  const storageEndpoint = getFormValue('storage-endpoint');

  try {
    let coverUrl = '';
    if (coverFile) {
      showStatus('上传封面图片...');
      if (storageEndpoint) {
        coverUrl = await uploadToStorage(coverFile, storageEndpoint);
      } else {
        const targetPath = `assets/materials/${fields.id || Date.now()}/cover-${Date.now()}.${coverFile.name.split('.').pop()}`;
        coverUrl = await uploadFileToGithub(coverFile, targetPath, token);
      }
    }

    const attachments = [];
    for (const file of attachmentFiles) {
      showStatus(`上传附件：${file.name}...`);
      const targetPath = `assets/materials/${fields.id || Date.now()}/${file.name}`;
      const url = storageEndpoint
        ? await uploadToStorage(file, storageEndpoint)
        : await uploadFileToGithub(file, targetPath, token);
      attachments.push({ label: file.name, url, mime: file.type || 'application/octet-stream' });
    }

    showStatus('更新 materials.json 数据...');
    const { data, sha } = await fetchMaterialsJson(token);
    const newMaterial = buildMaterialEntry(fields, coverUrl, attachments);
    const existingIndex = data.findIndex(item => item.id === newMaterial.id);
    if (existingIndex >= 0) {
      data[existingIndex] = newMaterial;
    } else {
      data.unshift(newMaterial);
    }

    await updateMaterialsJson(data, sha, token);
    showStatus('材料上传并更新成功。请稍候刷新页面查看。');
  } catch (error) {
    showStatus(error.message || '上传失败，请检查凭证与配置。', true);
    console.error(error);
  }
}

async function uploadToStorage(file, endpoint) {
  const formData = new FormData();
  formData.append('file', file);
  const response = await fetch(endpoint, {
    method: 'POST',
    body: formData
  });
  const result = await response.json();
  if (!response.ok) {
    throw new Error(result.message || '外部存储上传失败');
  }
  return result.url;
}

function initAdminPage() {
  const form = document.getElementById('upload-form');
  if (!form) return;
  form.addEventListener('submit', handleUpload);
}

if (document.readyState !== 'loading') {
  initAdminPage();
} else {
  document.addEventListener('DOMContentLoaded', initAdminPage);
}
