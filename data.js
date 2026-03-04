// ============================================================
// KleenPark Dashboard — Shared Data Layer
// Handles: fetching, CSV parsing, filtering, countdown, nav
// ============================================================

let currentRange = 'week';
let _countdownTimer = null;
let _countdownVal  = 0;

// ──────────────────────────────────────────────
// GOOGLE SHEETS FETCH
// ──────────────────────────────────────────────
async function fetchSheet(gid) {
  const url =
    `https://docs.google.com/spreadsheets/d/${CONFIG.SHEET_ID}` +
    `/gviz/tq?tqx=out:csv&gid=${gid}`;
  const res = await fetch(url);
  if (!res.ok) throw new Error(`HTTP ${res.status} fetching GID ${gid}`);
  const text = await res.text();
  // gviz returns a JS wrapper if sheet is not accessible
  if (text.startsWith('google.visualization')) {
    throw new Error('Sheet not accessible. Make sure it is shared publicly (Anyone with the link).');
  }
  return parseCSV(text);
}

// ──────────────────────────────────────────────
// CSV PARSER  (handles quoted fields with commas)
// ──────────────────────────────────────────────
function parseCSV(raw) {
  const lines = raw.trim().split('\n');
  if (lines.length < 2) return [];

  const headers = splitCSVRow(lines[0]).map(h => h.trim());

  return lines.slice(1)
    .filter(l => l.trim())
    .map(line => {
      const vals = splitCSVRow(line);
      const obj  = {};
      headers.forEach((h, i) => { obj[h] = (vals[i] ?? '').trim(); });
      return obj;
    });
}

function splitCSVRow(line) {
  const result = [];
  let cur = '', inQ = false;
  for (let i = 0; i < line.length; i++) {
    const c = line[i];
    if (c === '"') {
      // Handle escaped quotes ""
      if (inQ && line[i + 1] === '"') { cur += '"'; i++; }
      else inQ = !inQ;
    } else if (c === ',' && !inQ) {
      result.push(cur); cur = '';
    } else {
      cur += c;
    }
  }
  result.push(cur);
  return result;
}

// ──────────────────────────────────────────────
// TIMESTAMP PARSING
// Handles: "2/19/2026, 12:03:23 PM"  and ISO strings
// ──────────────────────────────────────────────
function parseTimestamp(ts) {
  if (!ts || ts === 'Timestamp') return null;
  try {
    const d = new Date(ts);
    return isNaN(d) ? null : d;
  } catch { return null; }
}

// Parse a Date-only field (column L in Transaction Log)
// Could be "2/19/2026", "2026-02-19", etc.
function parseDate(s) {
  if (!s) return null;
  const d = new Date(s);
  return isNaN(d) ? null : d;
}

// ──────────────────────────────────────────────
// DATE RANGE FILTER
// ──────────────────────────────────────────────
function getDateBounds() {
  const now   = new Date();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());

  switch (currentRange) {
    case 'today':
      return [today, new Date(today.getTime() + 86_400_000 - 1)];
    case 'week': {
      const s = new Date(today); s.setDate(s.getDate() - 7);
      return [s, new Date()];
    }
    case 'month':
      return [new Date(now.getFullYear(), now.getMonth(), 1), new Date()];
    default: // 'all'
      return [new Date(0), new Date()];
  }
}

function filterByRange(rows) {
  if (currentRange === 'all') return rows;
  const [start, end] = getDateBounds();
  return rows.filter(row => {
    const ts = parseTimestamp(row['Timestamp']);
    if (!ts) return false;
    return ts >= start && ts <= end;
  });
}

// ──────────────────────────────────────────────
// DATE RANGE UI
// ──────────────────────────────────────────────
function setRange(range) {
  currentRange = range;
  document.querySelectorAll('.filter-btn').forEach(btn => {
    btn.classList.toggle('active', btn.dataset.range === range);
  });
  updateDateDisplay();
  if (typeof loadDashboard === 'function') loadDashboard();
  if (typeof loadAnalytics  === 'function') loadAnalytics();
}

function updateDateDisplay() {
  const now  = new Date();
  const fmt  = d => d.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });
  let label  = '';

  switch (currentRange) {
    case 'today':
      label = fmt(now); break;
    case 'week': {
      const s = new Date(now); s.setDate(s.getDate() - 7);
      label = `${fmt(s)} – ${fmt(now)}`; break;
    }
    case 'month': {
      const s = new Date(now.getFullYear(), now.getMonth(), 1);
      label = `${fmt(s)} – ${fmt(now)}`; break;
    }
    default:
      label = 'All Time';
  }

  const el = document.getElementById('filter-date-display');
  if (el) el.textContent = label;
}

// ──────────────────────────────────────────────
// COUNTDOWN + AUTO-REFRESH
// ──────────────────────────────────────────────
function startCountdown() {
  if (_countdownTimer) clearInterval(_countdownTimer);
  _countdownVal = CONFIG.REFRESH_INTERVAL;

  _countdownTimer = setInterval(() => {
    _countdownVal--;
    const el = document.getElementById('countdown');
    if (el) el.textContent = _countdownVal;

    if (_countdownVal <= 0) {
      _countdownVal = CONFIG.REFRESH_INTERVAL;
      if (typeof loadDashboard === 'function') loadDashboard();
      if (typeof loadAnalytics  === 'function') loadAnalytics();
    }
  }, 1000);
}

// ──────────────────────────────────────────────
// UTILITY HELPERS
// ──────────────────────────────────────────────
function setText(id, val) {
  const el = document.getElementById(id);
  if (el) el.textContent = val;
}

function animateCount(id, target) {
  const el = document.getElementById(id);
  if (!el) return;
  const start = parseInt(el.textContent) || 0;
  const diff  = target - start;
  const t0    = performance.now();
  const dur   = 700;

  (function tick(now) {
    const p  = Math.min((now - t0) / dur, 1);
    const ep = 1 - Math.pow(1 - p, 3); // ease-out cubic
    el.textContent = Math.round(start + diff * ep);
    if (p < 1) requestAnimationFrame(tick);
  })(t0);
}

function pct(n, total) {
  return total ? Math.round((n / total) * 100) : 0;
}

function fmtTime(d) {
  if (!d) return '—';
  return d.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' });
}

function fmtDate(d) {
  if (!d) return '—';
  return d.toLocaleDateString('en-GB', { day: '2-digit', month: 'short' });
}

function fmtDateFull(d) {
  if (!d) return '—';
  return d.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });
}

function nowString() {
  const d = new Date();
  return `${fmtDateFull(d)}, ${d.toLocaleTimeString('en-GB')}`;
}

// ──────────────────────────────────────────────
// SHOW / HIDE ERROR OVERLAY
// ──────────────────────────────────────────────
function showError(visible, msg = '') {
  const el = document.getElementById('error-overlay');
  if (!el) return;
  el.classList.toggle('hidden', !visible);
  if (msg) setText('error-message', msg);
}

function retryLoad() {
  showError(false);
  if (typeof loadDashboard === 'function') loadDashboard();
  if (typeof loadAnalytics  === 'function') loadAnalytics();
}
