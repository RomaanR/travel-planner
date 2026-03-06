// ============================================================
// KleenPark Dashboard — Analytics / Charts Page
// ============================================================

// Chart.js global theme defaults
Chart.defaults.color          = '#94a3b8';
Chart.defaults.borderColor    = 'rgba(26,58,107,0.45)';
Chart.defaults.font.family    = "'Inter', 'Segoe UI', system-ui";
Chart.defaults.font.size      = 12;

// Palette
const C = {
  yellow:  '#f5c400',
  blue:    '#1d6fe4',
  cyan:    '#06b6d4',
  green:   '#10b981',
  red:     '#ef4444',
  orange:  '#f59e0b',
  purple:  '#8b5cf6',
  teal:    '#14b8a6',
  pink:    '#ec4899',
  indigo:  '#6366f1',
};

// Store chart instances so we can destroy & rebuild on refresh
const charts = {};

// ──────────────────────────────────────────────
// ENTRY POINT
// ──────────────────────────────────────────────
document.addEventListener('DOMContentLoaded', () => {
  updateDateDisplay();
  loadAnalytics();
  startCountdown();
});

async function loadAnalytics() {
  showError(false);
  try {
    const [txRows, callRows] = await Promise.all([
      fetchSheet(CONFIG.SHEETS.TRANSACTION_LOG),
      fetchSheet(CONFIG.SHEETS.CALL_LOG),
    ]);
    const filtered     = filterByRange(txRows);
    const filteredCalls = filterByRange(callRows);

    buildTrendChart(filtered);
    buildCategoryChart(filtered);
    buildServicesChart(filtered);
    buildActionsChart(filtered);
    buildDowChart(filtered);
    buildSuccessTrendChart(filteredCalls);
    buildOutcomeChart(filteredCalls);
    buildCallDurationChart(filteredCalls);

    // Timestamps
    const now = new Date();
    const ts  = now.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit', second: '2-digit' });
    setText('last-updated',   `Updated ${ts}`);
    setText('footer-updated', `Last updated: ${fmtDateFull(now)}, ${ts}`);

  } catch (err) {
    console.error('[KleenPark Analytics] Load failed:', err);
    showError(true, err.message);
  }
}

// ──────────────────────────────────────────────
// HELPERS
// ──────────────────────────────────────────────
function destroyChart(key) {
  if (charts[key]) { charts[key].destroy(); delete charts[key]; }
}

function makeAlpha(hex, a) {
  const r = parseInt(hex.slice(1,3),16);
  const g = parseInt(hex.slice(3,5),16);
  const b = parseInt(hex.slice(5,7),16);
  return `rgba(${r},${g},${b},${a})`;
}

// Group rows by a key extractor, return sorted { labels, counts }
function groupCount(rows, keyFn) {
  const map = {};
  rows.forEach(r => {
    const k = keyFn(r);
    if (k) map[k] = (map[k] || 0) + 1;
  });
  const entries = Object.entries(map).sort((a,b) => b[1]-a[1]);
  return { labels: entries.map(e=>e[0]), counts: entries.map(e=>e[1]) };
}

// ──────────────────────────────────────────────
// 1. BOOKING TREND — Line chart (books per day)
// ──────────────────────────────────────────────
function buildTrendChart(rows) {
  destroyChart('trend');

  const bookings = rows.filter(r => r['Action'] === 'Book');

  // Build a map of date → count
  const dayMap = {};
  bookings.forEach(r => {
    const ts = parseTimestamp(r['Timestamp']);
    if (!ts) return;
    const key = ts.toLocaleDateString('en-GB', { day:'2-digit', month:'short', year:'2-digit' });
    dayMap[key] = (dayMap[key] || 0) + 1;
  });

  // Sort entries chronologically
  const sorted = Object.entries(dayMap).sort((a,b) => {
    return new Date(a[0]) - new Date(b[0]);
  });
  const labels = sorted.map(e => e[0]);
  const data   = sorted.map(e => e[1]);

  const ctx = document.getElementById('chart-trend');
  if (!ctx) return;

  const gradient = ctx.getContext('2d').createLinearGradient(0,0,0,220);
  gradient.addColorStop(0,   makeAlpha(C.yellow, 0.3));
  gradient.addColorStop(1,   makeAlpha(C.yellow, 0));

  charts.trend = new Chart(ctx, {
    type: 'line',
    data: {
      labels,
      datasets: [{
        label: 'Bookings',
        data,
        borderColor:     C.yellow,
        backgroundColor: gradient,
        borderWidth:     2.5,
        pointRadius:     4,
        pointBackgroundColor: C.yellow,
        pointBorderColor:     '#030b18',
        pointBorderWidth:     2,
        pointHoverRadius:     6,
        fill:            true,
        tension:         0.35,
      }],
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      interaction: { mode: 'index', intersect: false },
      plugins: {
        legend: { display: false },
        tooltip: {
          backgroundColor: '#061222',
          borderColor:     C.yellow,
          borderWidth:     1,
          titleColor:      '#f1f5f9',
          bodyColor:       '#94a3b8',
          padding:         12,
        },
      },
      scales: {
        x: {
          grid: { color: 'rgba(26,58,107,0.3)' },
          ticks: { maxRotation: 45, maxTicksLimit: 12 },
        },
        y: {
          beginAtZero: true,
          grid: { color: 'rgba(26,58,107,0.3)' },
          ticks: { stepSize: 1 },
        },
      },
    },
  });
}

// ──────────────────────────────────────────────
// 2. CATEGORY SPLIT — Doughnut (Quick vs Premium)
// ──────────────────────────────────────────────
function buildCategoryChart(rows) {
  destroyChart('category');

  const books   = rows.filter(r => r['Action'] === 'Book');
  const quick   = books.filter(r => (r['Category']||'').toLowerCase() === 'quick').length;
  const premium = books.filter(r => (r['Category']||'').toLowerCase() === 'premium').length;
  const other   = books.length - quick - premium;

  const labels = ['Quick', 'Premium'];
  const data   = [quick, premium];
  if (other > 0) { labels.push('Other'); data.push(other); }

  const ctx = document.getElementById('chart-category');
  if (!ctx) return;

  charts.category = new Chart(ctx, {
    type: 'doughnut',
    data: {
      labels,
      datasets: [{
        data,
        backgroundColor: [C.cyan, C.yellow, C.purple],
        borderColor:     '#061222',
        borderWidth:     3,
        hoverBorderWidth: 0,
        hoverOffset: 6,
      }],
    },
    options: {
      responsive: true,
      maintainAspectRatio: true,
      cutout: '65%',
      plugins: {
        legend: {
          position: 'bottom',
          labels: { padding: 16, usePointStyle: true, pointStyleWidth: 10 },
        },
        tooltip: {
          backgroundColor: '#061222',
          borderColor:     'rgba(26,58,107,0.7)',
          borderWidth:     1,
          callbacks: {
            label: ctx => {
              const total = ctx.dataset.data.reduce((a,b)=>a+b,0);
              const p     = total ? Math.round((ctx.raw/total)*100) : 0;
              return ` ${ctx.label}: ${ctx.raw} (${p}%)`;
            },
          },
        },
      },
    },
  });
}

// ──────────────────────────────────────────────
// 3. TOP SERVICES — Horizontal bar
// ──────────────────────────────────────────────
function buildServicesChart(rows) {
  destroyChart('services');

  const books = rows.filter(r => r['Action'] === 'Book');
  const { labels, counts } = groupCount(books, r => r['Service']);

  const top8L = labels.slice(0, 8);
  const top8C = counts.slice(0, 8);

  const ctx = document.getElementById('chart-services');
  if (!ctx) return;

  // Gradient colours per bar
  const colours = [C.yellow, C.blue, C.cyan, C.green, C.purple, C.orange, C.teal, C.pink];

  charts.services = new Chart(ctx, {
    type: 'bar',
    data: {
      labels: top8L,
      datasets: [{
        label: 'Bookings',
        data:  top8C,
        backgroundColor: top8L.map((_, i) => makeAlpha(colours[i % colours.length], 0.75)),
        borderColor:     top8L.map((_, i) => colours[i % colours.length]),
        borderWidth:     1.5,
        borderRadius:    4,
        barThickness:    18,
      }],
    },
    options: {
      indexAxis: 'y',
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: { display: false },
        tooltip: {
          backgroundColor: '#061222',
          borderColor:     'rgba(26,58,107,0.7)',
          borderWidth:     1,
        },
      },
      scales: {
        x: {
          beginAtZero: true,
          grid: { color: 'rgba(26,58,107,0.3)' },
          ticks: { stepSize: 1 },
        },
        y: {
          grid: { display: false },
          ticks: { font: { size: 11 } },
        },
      },
    },
  });
}

// ──────────────────────────────────────────────
// 4. ACTION BREAKDOWN — Pie (Book / Cancel / Reschedule)
// ──────────────────────────────────────────────
function buildActionsChart(rows) {
  destroyChart('actions');

  const books    = rows.filter(r => r['Action'] === 'Book').length;
  const cancels  = rows.filter(r => r['Action'] === 'Cancel').length;
  const resched  = rows.filter(r => r['Action'] === 'Reschedule').length;

  const ctx = document.getElementById('chart-actions');
  if (!ctx) return;

  charts.actions = new Chart(ctx, {
    type: 'pie',
    data: {
      labels: ['Bookings', 'Cancellations', 'Reschedules'],
      datasets: [{
        data: [books, cancels, resched],
        backgroundColor: [
          makeAlpha(C.blue,   0.8),
          makeAlpha(C.red,    0.8),
          makeAlpha(C.orange, 0.8),
        ],
        borderColor: '#061222',
        borderWidth: 3,
        hoverOffset: 6,
      }],
    },
    options: {
      responsive: true,
      maintainAspectRatio: true,
      plugins: {
        legend: {
          position: 'bottom',
          labels: { padding: 16, usePointStyle: true, pointStyleWidth: 10 },
        },
        tooltip: {
          backgroundColor: '#061222',
          borderColor:     'rgba(26,58,107,0.7)',
          borderWidth:     1,
          callbacks: {
            label: ctx => {
              const total = ctx.dataset.data.reduce((a,b)=>a+b,0);
              const p     = total ? Math.round((ctx.raw/total)*100) : 0;
              return ` ${ctx.label}: ${ctx.raw} (${p}%)`;
            },
          },
        },
      },
    },
  });
}

// ──────────────────────────────────────────────
// 5. DAY OF WEEK — Bar (Mon–Sun)
// ──────────────────────────────────────────────
function buildDowChart(rows) {
  destroyChart('dow');

  const days = ['Mon','Tue','Wed','Thu','Fri','Sat','Sun'];
  const counts = new Array(7).fill(0);

  const books = rows.filter(r => r['Action'] === 'Book');
  books.forEach(r => {
    const ts = parseTimestamp(r['Timestamp']);
    if (!ts) return;
    const dow = (ts.getDay() + 6) % 7; // 0=Mon … 6=Sun
    counts[dow]++;
  });

  const ctx = document.getElementById('chart-dow');
  if (!ctx) return;

  const gradient = ctx.getContext('2d').createLinearGradient(0, 0, 0, 240);
  gradient.addColorStop(0, makeAlpha(C.blue, 0.85));
  gradient.addColorStop(1, makeAlpha(C.blue, 0.25));

  charts.dow = new Chart(ctx, {
    type: 'bar',
    data: {
      labels: days,
      datasets: [{
        label: 'Bookings',
        data:  counts,
        backgroundColor: gradient,
        borderColor:     C.blue,
        borderWidth:     1.5,
        borderRadius:    5,
        barThickness:    28,
      }],
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: { display: false },
        tooltip: {
          backgroundColor: '#061222',
          borderColor:     'rgba(26,58,107,0.7)',
          borderWidth:     1,
        },
      },
      scales: {
        x: {
          grid: { display: false },
        },
        y: {
          beginAtZero: true,
          grid: { color: 'rgba(26,58,107,0.3)' },
          ticks: { stepSize: 1 },
        },
      },
    },
  });
}

// ──────────────────────────────────────────────
// 6. CALL SUCCESS RATE OVER TIME — Line chart
// ──────────────────────────────────────────────
function buildSuccessTrendChart(rows) {
  destroyChart('successTrend');

  // Group by date → { total, success }
  const dayMap = {};
  rows.forEach(r => {
    const ts = parseTimestamp(r['Timestamp']);
    if (!ts) return;
    const key = ts.toLocaleDateString('en-GB', { day:'2-digit', month:'short', year:'2-digit' });
    if (!dayMap[key]) dayMap[key] = { total: 0, success: 0 };
    dayMap[key].total++;
    if ((r['Outcome'] || '').toLowerCase() === 'success') dayMap[key].success++;
  });

  const sorted = Object.entries(dayMap).sort((a, b) => new Date(a[0]) - new Date(b[0]));
  const labels = sorted.map(e => e[0]);
  const data   = sorted.map(e => e[1].total ? Math.round((e[1].success / e[1].total) * 100) : 0);

  const ctx = document.getElementById('chart-success-trend');
  if (!ctx) return;

  const gradient = ctx.getContext('2d').createLinearGradient(0, 0, 0, 220);
  gradient.addColorStop(0, makeAlpha(C.green, 0.3));
  gradient.addColorStop(1, makeAlpha(C.green, 0));

  charts.successTrend = new Chart(ctx, {
    type: 'line',
    data: {
      labels,
      datasets: [{
        label: 'Success Rate %',
        data,
        borderColor:     C.green,
        backgroundColor: gradient,
        borderWidth:     2.5,
        pointRadius:     4,
        pointBackgroundColor: C.green,
        pointBorderColor:     '#030b18',
        pointBorderWidth:     2,
        pointHoverRadius:     6,
        fill:            true,
        tension:         0.35,
      }],
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      interaction: { mode: 'index', intersect: false },
      plugins: {
        legend: { display: false },
        tooltip: {
          backgroundColor: '#061222',
          borderColor:     C.green,
          borderWidth:     1,
          titleColor:      '#f1f5f9',
          bodyColor:       '#94a3b8',
          padding:         12,
          callbacks: {
            label: ctx => ` Success Rate: ${ctx.raw}%`,
          },
        },
      },
      scales: {
        x: {
          grid: { color: 'rgba(26,58,107,0.3)' },
          ticks: { maxRotation: 45, maxTicksLimit: 12 },
        },
        y: {
          beginAtZero: true,
          max: 100,
          grid: { color: 'rgba(26,58,107,0.3)' },
          ticks: { callback: v => v + '%' },
        },
      },
    },
  });
}

// ──────────────────────────────────────────────
// 7. CALL OUTCOMES — Doughnut
// ──────────────────────────────────────────────
function buildOutcomeChart(rows) {
  destroyChart('outcomes');

  const success   = rows.filter(r => (r['Outcome'] || '').toLowerCase() === 'success').length;
  const abandoned = rows.filter(r => (r['Outcome'] || '').toLowerCase() === 'abandoned').length;
  const noAction  = rows.filter(r => (r['Outcome'] || '').toLowerCase() === 'no action').length;

  const labels = ['Success', 'Abandoned', 'No Action'];
  const data   = [success, abandoned, noAction];

  const ctx = document.getElementById('chart-outcomes');
  if (!ctx) return;

  charts.outcomes = new Chart(ctx, {
    type: 'doughnut',
    data: {
      labels,
      datasets: [{
        data,
        backgroundColor: [
          makeAlpha(C.green, 0.85),
          makeAlpha(C.red,   0.85),
          makeAlpha('#64748b', 0.6),
        ],
        borderColor: '#061222',
        borderWidth: 3,
        hoverBorderWidth: 0,
        hoverOffset: 6,
      }],
    },
    options: {
      responsive: true,
      maintainAspectRatio: true,
      cutout: '65%',
      plugins: {
        legend: {
          position: 'bottom',
          labels: { padding: 16, usePointStyle: true, pointStyleWidth: 10 },
        },
        tooltip: {
          backgroundColor: '#061222',
          borderColor: 'rgba(26,58,107,0.7)',
          borderWidth: 1,
          callbacks: {
            label: ctx => {
              const total = ctx.dataset.data.reduce((a, b) => a + b, 0);
              const p = total ? Math.round((ctx.raw / total) * 100) : 0;
              return ` ${ctx.label}: ${ctx.raw} (${p}%)`;
            },
          },
        },
      },
    },
  });
}

// ──────────────────────────────────────────────
// 8. AVG CALL DURATION BY DAY — Bar chart
// ──────────────────────────────────────────────
function buildCallDurationChart(rows) {
  destroyChart('callDur');

  const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
  const totals = new Array(7).fill(0);
  const counts = new Array(7).fill(0);

  rows.forEach(r => {
    const ts  = parseTimestamp(r['Timestamp']);
    const dur = parseInt(r['Duration']) || 0;
    if (!ts || dur <= 0) return;
    const dow = (ts.getDay() + 6) % 7;
    totals[dow] += dur;
    counts[dow]++;
  });

  const avgData = days.map((_, i) => counts[i] ? Math.round(totals[i] / counts[i]) : 0);

  const ctx = document.getElementById('chart-call-dur');
  if (!ctx) return;

  const gradient = ctx.getContext('2d').createLinearGradient(0, 0, 0, 240);
  gradient.addColorStop(0, makeAlpha(C.cyan, 0.85));
  gradient.addColorStop(1, makeAlpha(C.cyan, 0.25));

  charts.callDur = new Chart(ctx, {
    type: 'bar',
    data: {
      labels: days,
      datasets: [{
        label: 'Avg Duration (s)',
        data:  avgData,
        backgroundColor: gradient,
        borderColor:     C.cyan,
        borderWidth:     1.5,
        borderRadius:    5,
        barThickness:    28,
      }],
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: { display: false },
        tooltip: {
          backgroundColor: '#061222',
          borderColor: 'rgba(26,58,107,0.7)',
          borderWidth: 1,
          callbacks: {
            label: ctx => {
              const mins = Math.floor(ctx.raw / 60);
              const secs = ctx.raw % 60;
              return mins > 0 ? ` ${mins}m ${secs}s` : ` ${secs}s`;
            },
          },
        },
      },
      scales: {
        x: { grid: { display: false } },
        y: {
          beginAtZero: true,
          grid: { color: 'rgba(26,58,107,0.3)' },
          ticks: {
            callback: v => {
              const m = Math.floor(v / 60);
              const s = v % 60;
              return m > 0 ? `${m}m ${s}s` : `${s}s`;
            },
          },
        },
      },
    },
  });
}
