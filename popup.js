// Wylie Neuro Extension — Popup Logic
// Search, navigate, and open scores

const searchEl = document.getElementById('search');
const resultsEl = document.getElementById('results');
const clearBtn = document.getElementById('clear-btn');
const openAllBtn = document.getElementById('open-all');

let activeIdx = -1;
let filtered = [];

// Division colors
const DIV_COLORS = {
  "Neurovaskular":  "#ef4444",
  "Neuroinfeksi":   "#f59e0b",
  "Neuroimunologi": "#10b981",
  "Neuropain":      "#8b5cf6",
  "Neurobehavior":  "#00d4ff",
  "Epilepsi":       "#ec4899",
  "Neuromuskuler":  "#f97316",
  "Neuro-ICU":      "#64748b",
  "Neurorehabilitasi": "#a3e635",
  "Sleep Neurology":"#818cf8",
  "Neurokhusus":    "#e879f9",
  "Neuro-Onkologi": "#fb7185",
  "Preoperatif":    "#06b6d4",
};

function highlight(text, query) {
  if (!query) return text;
  const escaped = query.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  const re = new RegExp(`(${escaped})`, 'gi');
  return text.replace(re, '<mark>$1</mark>');
}

function renderInitial() {
  activeIdx = -1;
  filtered = [];

  // Show popular/recent scores grouped
  const groups = {};
  SCORE_INDEX.forEach(s => {
    if (!groups[s.division]) groups[s.division] = [];
    groups[s.division].push(s);
  });

  let html = `<div style="padding:10px 14px 4px">
    <div class="recent-header">Semua Divisi · ${SCORE_INDEX.length} Score</div>
  </div>`;

  Object.entries(groups).forEach(([div, scores]) => {
    const color = DIV_COLORS[div] || '#94a3b8';
    html += `<div class="section-label" style="color:${color}">${div}</div>`;
    scores.forEach((s, i) => {
      html += renderItem(s, '', div, color);
    });
  });

  resultsEl.innerHTML = html;
  attachItemListeners();
}

function renderItem(s, query, div, color) {
  const divColor = color || DIV_COLORS[s.division] || '#94a3b8';
  const nameHL = highlight(s.name, query);
  const fullHL = highlight(s.full, query);
  const calcBadge = s.hasCalc
    ? `<div class="calc-badge">CALC</div>`
    : '';
  return `<div class="score-item" data-name="${encodeURIComponent(s.name)}" role="option">
    <div style="width:3px;height:36px;border-radius:2px;background:${divColor};flex-shrink:0"></div>
    <div class="item-left">
      <div class="item-name">${nameHL}</div>
      <div class="item-full">${fullHL}</div>
    </div>
    <div class="item-right">
      <div class="div-badge" style="color:${divColor};border-color:${divColor}40;background:${divColor}10">${s.division}</div>
      ${calcBadge}
    </div>
  </div>`;
}

function renderResults(query) {
  if (!query.trim()) {
    renderInitial();
    return;
  }

  const q = query.toLowerCase().trim();
  filtered = SCORE_INDEX.filter(s =>
    s.name.toLowerCase().includes(q) ||
    s.full.toLowerCase().includes(q) ||
    s.division.toLowerCase().includes(q) ||
    s.tags.some(t => t.includes(q))
  );

  activeIdx = filtered.length > 0 ? 0 : -1;

  if (filtered.length === 0) {
    resultsEl.innerHTML = `<div class="empty">
      <span class="empty-icon">🔍</span>
      Tidak ada score ditemukan untuk<br>
      <strong style="color:#94a3b8">"${query}"</strong>
    </div>`;
    return;
  }

  let html = `<div class="result-count">${filtered.length} score ditemukan</div>`;
  filtered.forEach((s, i) => {
    const color = DIV_COLORS[s.division] || '#94a3b8';
    html += `<div class="score-item${i === 0 ? ' active' : ''}" data-name="${encodeURIComponent(s.name)}" data-idx="${i}" role="option">
      <div style="width:3px;height:36px;border-radius:2px;background:${color};flex-shrink:0"></div>
      <div class="item-left">
        <div class="item-name">${highlight(s.name, query)}</div>
        <div class="item-full">${highlight(s.full, query)}</div>
      </div>
      <div class="item-right">
        <div class="div-badge" style="color:${color};border-color:${color}40;background:${color}10">${s.division}</div>
        ${s.hasCalc ? '<div class="calc-badge">CALC</div>' : ''}
      </div>
    </div>`;
  });

  resultsEl.innerHTML = html;
  attachItemListeners();
}

function attachItemListeners() {
  resultsEl.querySelectorAll('.score-item').forEach(el => {
    el.addEventListener('click', () => {
      const name = decodeURIComponent(el.dataset.name);
      openScore(name);
    });

    el.addEventListener('mouseenter', () => {
      setActive(el);
    });
  });
}

function setActive(el) {
  resultsEl.querySelectorAll('.score-item').forEach(e => e.classList.remove('active'));
  el.classList.add('active');
  const idx = parseInt(el.dataset.idx);
  if (!isNaN(idx)) activeIdx = idx;
  el.scrollIntoView({ block: 'nearest' });
}

function openScore(name) {
  const url = chrome.runtime.getURL('index.html') + '?score=' + encodeURIComponent(name);
  chrome.windows.create({
    url: url,
    type: 'popup',
    width: 980,
    height: 780,
    focused: true
  });
  window.close();
}

function openAll() {
  const url = chrome.runtime.getURL('index.html');
  chrome.windows.create({
    url: url,
    type: 'popup',
    width: 1200,
    height: 820,
    focused: true
  });
  window.close();
}

// Keyboard navigation
searchEl.addEventListener('keydown', e => {
  const items = resultsEl.querySelectorAll('.score-item');

  if (e.key === 'ArrowDown') {
    e.preventDefault();
    if (filtered.length > 0) {
      activeIdx = Math.min(activeIdx + 1, filtered.length - 1);
      items[activeIdx]?.classList.add('active');
      items.forEach((el, i) => el.classList.toggle('active', i === activeIdx));
      items[activeIdx]?.scrollIntoView({ block: 'nearest' });
    } else {
      // In initial view — navigate items
      const allItems = Array.from(items);
      const curActive = resultsEl.querySelector('.score-item.active');
      const curIdx = allItems.indexOf(curActive);
      const nextIdx = Math.min(curIdx + 1, allItems.length - 1);
      allItems.forEach((el, i) => el.classList.toggle('active', i === nextIdx));
      allItems[nextIdx]?.scrollIntoView({ block: 'nearest' });
    }
  }

  if (e.key === 'ArrowUp') {
    e.preventDefault();
    if (filtered.length > 0) {
      activeIdx = Math.max(activeIdx - 1, 0);
      items.forEach((el, i) => el.classList.toggle('active', i === activeIdx));
      items[activeIdx]?.scrollIntoView({ block: 'nearest' });
    } else {
      const allItems = Array.from(items);
      const curActive = resultsEl.querySelector('.score-item.active');
      const curIdx = allItems.indexOf(curActive);
      const prevIdx = Math.max(curIdx - 1, 0);
      allItems.forEach((el, i) => el.classList.toggle('active', i === prevIdx));
      allItems[prevIdx]?.scrollIntoView({ block: 'nearest' });
    }
  }

  if (e.key === 'Enter') {
    e.preventDefault();
    const activeEl = resultsEl.querySelector('.score-item.active');
    if (activeEl) {
      const name = decodeURIComponent(activeEl.dataset.name);
      openScore(name);
    } else if (filtered.length > 0) {
      openScore(filtered[0].name);
    }
  }

  if (e.key === 'Escape') {
    if (searchEl.value) {
      searchEl.value = '';
      clearBtn.classList.remove('show');
      renderInitial();
    } else {
      window.close();
    }
  }
});

// Search input
searchEl.addEventListener('input', e => {
  const q = e.target.value;
  clearBtn.classList.toggle('show', q.length > 0);
  renderResults(q);
});

// Clear button
clearBtn.addEventListener('click', () => {
  searchEl.value = '';
  clearBtn.classList.remove('show');
  renderInitial();
  searchEl.focus();
});

// Open all button
openAllBtn.addEventListener('click', openAll);

// Init
renderInitial();
searchEl.focus();
