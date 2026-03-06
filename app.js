// ============================================================
// KleenPark Dashboard — Overview Page Logic
// ============================================================

document.addEventListener('DOMContentLoaded', () => {
  updateDateDisplay();
  loadDashboard();
  startCountdown();
});

// ──────────────────────────────────────────────
// MAIN LOAD
// ──────────────────────────────────────────────
async function loadDashboard() {
  showError(false);
  try {
    // Fetch all four sheets in parallel
    const [txRows, capacityRows, quoteRows, callRows] = await Promise.all([
      fetchSheet(CONFIG.SHEETS.TRANSACTION_LOG),
      fetchSheet(CONFIG.SHEETS.DAILY_CAPACITY),
      fetchSheet(CONFIG.SHEETS.QUOTE_REQUESTS),
      fetchSheet(CONFIG.SHEETS.CALL_LOG),
    ]);

    // Filter transactions by selected date range
    const filtered = filterByRange(txRows);

    // Compute & render KPIs
    const kpis = computeKPIs(filtered, txRows, quoteRows);
    renderKPIs(kpis);

    // Call Performance KPIs
    const filteredCalls = filterByRange(callRows);
    const callKpis = computeCallKPIs(filteredCalls);
    renderCallKPIs(callKpis);

    // Capacity (always today's — from Daily Capacity sheet)
    renderCapacity(capacityRows[0] || null);

    // Activity table (most recent in filtered set)
    renderActivity(filtered);

    // Timestamps
    const now = new Date();
    const ts  = now.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit', second: '2-digit' });
    setText('last-updated',   `Updated ${ts}`);
    setText('footer-updated', `Last updated: ${fmtDateFull(now)}, ${ts}`);

  } catch (err) {
    console.error('[KleenPark Dashboard] Load failed:', err);
    showError(true, err.message);
  }
}

// ──────────────────────────────────────────────
// KPI COMPUTATION
// ──────────────────────────────────────────────
function computeKPIs(filtered, allTx, quoteRows) {
  const bookings      = filtered.filter(r => r['Action'] === 'Book');
  const cancellations = filtered.filter(r => r['Action'] === 'Cancel');
  const reschedules   = filtered.filter(r => r['Action'] === 'Reschedule');

  const quickBooks   = bookings.filter(r => (r['Category'] || '').toLowerCase() === 'quick');
  const premiumBooks = bookings.filter(r => (r['Category'] || '').toLowerCase() === 'premium');

  // Unique customers within the filtered period
  const uniqueInRange = new Set(filtered.map(r => r['Customer Name']).filter(Boolean)).size;
  // Total unique customers all-time (for context)
  const totalCustomers = new Set(allTx.map(r => r['Customer Name']).filter(Boolean)).size;

  // Net active = confirmed bookings minus cancellations
  const netActive = bookings.length - cancellations.length;

  // Pending quote requests (filtered by range)
  const filteredQuotes  = filterByRange(quoteRows);
  const pendingQuotes   = filteredQuotes.filter(r => r['Status'] === 'Pending').length;
  const totalQuotes     = quoteRows.filter(r => r['Timestamp']).length;

  return {
    totalBookings: bookings.length,
    cancellations: cancellations.length,
    reschedules:   reschedules.length,
    uniqueCustomers: uniqueInRange,
    totalCustomers,
    quickBooks:    quickBooks.length,
    premiumBooks:  premiumBooks.length,
    pendingQuotes,
    totalQuotes,
    netActive,
  };
}

// ──────────────────────────────────────────────
// RENDER KPI CARDS
// ──────────────────────────────────────────────
function renderKPIs(k) {
  animateCount('kpi-bookings',      k.totalBookings);
  animateCount('kpi-cancellations', k.cancellations);
  animateCount('kpi-reschedules',   k.reschedules);
  animateCount('kpi-customers',     k.uniqueCustomers);
  animateCount('kpi-quick',         k.quickBooks);
  animateCount('kpi-premium',       k.premiumBooks);
  animateCount('kpi-quotes',        k.pendingQuotes);
  animateCount('kpi-net',           k.netActive);

  setText('det-bookings',      `${k.quickBooks} quick · ${k.premiumBooks} premium`);
  setText('det-cancellations', cancelRate(k));
  setText('det-reschedules',   k.reschedules === 0 ? 'No reschedules' : `${k.reschedules} appointment${k.reschedules > 1 ? 's' : ''} moved`);
  setText('det-customers',     `${k.totalCustomers} total in CRM`);
  setText('det-quick',         `${pct(k.quickBooks,   k.totalBookings)}% of all bookings`);
  setText('det-premium',       `${pct(k.premiumBooks, k.totalBookings)}% of all bookings`);
  setText('det-quotes',        `${k.totalQuotes} total received`);
  setText('det-net',           `${k.totalBookings} booked − ${k.cancellations} cancelled`);
}

function cancelRate(k) {
  if (!k.totalBookings) return 'No bookings yet';
  const r = ((k.cancellations / k.totalBookings) * 100).toFixed(1);
  return `${r}% cancellation rate`;
}

// ──────────────────────────────────────────────
// RENDER CAPACITY
// ──────────────────────────────────────────────
function renderCapacity(row) {
  const qB  = parseInt(row?.['Quick Bookings'])   || 0;
  const qC  = parseInt(row?.['Quick Cap'])         || CONFIG.CAPACITY.QUICK;
  const pB  = parseInt(row?.['Premium Bookings']) || 0;
  const pC  = parseInt(row?.['Premium Cap'])       || CONFIG.CAPACITY.PREMIUM;
  const tB  = qB + pB;
  const tC  = qC + pC;

  const qPct = cap100(qB / qC);
  const pPct = cap100(pB / pC);
  const tPct = cap100(tB / tC);

  setText('q-booked',    qB);
  setText('q-cap',       qC);
  setText('q-remaining', `${qC - qB} slots remaining`);
  setText('q-pct',       `${qPct}%`);

  setText('p-booked',    pB);
  setText('p-cap',       pC);
  setText('p-remaining', `${pC - pB} slots remaining`);
  setText('p-pct',       `${pPct}%`);

  setText('t-booked',    tB);
  setText('t-remaining', `${tC - tB} slots remaining`);
  setText('t-pct',       `${tPct}%`);

  // Animate bars (slight delay lets CSS transitions fire after paint)
  requestAnimationFrame(() => {
    setTimeout(() => {
      setWidth('q-bar', qPct);
      setWidth('p-bar', pPct);
      setWidth('t-bar', tPct);
    }, 80);
  });

  // Today's label
  const today = new Date().toLocaleDateString('en-GB', {
    weekday: 'long', day: 'numeric', month: 'long', year: 'numeric',
  });
  setText('capacity-date', today);
}

function cap100(ratio) { return Math.min(100, Math.round((ratio || 0) * 100)); }
function setWidth(id, w) {
  const el = document.getElementById(id);
  if (el) el.style.width = w + '%';
}

// ──────────────────────────────────────────────
// RENDER ACTIVITY TABLE
// ──────────────────────────────────────────────
function renderActivity(rows) {
  const tbody = document.getElementById('activity-tbody');
  if (!tbody) return;

  // Sort newest first, take top 15
  const sorted = [...rows]
    .filter(r => r['Timestamp'])
    .sort((a, b) => {
      const ta = parseTimestamp(a['Timestamp']);
      const tb = parseTimestamp(b['Timestamp']);
      return (tb?.getTime() || 0) - (ta?.getTime() || 0);
    })
    .slice(0, 15);

  setText('activity-count', `${rows.length} transaction${rows.length !== 1 ? 's' : ''}`);

  if (sorted.length === 0) {
    tbody.innerHTML = `<tr><td colspan="7" class="no-data">No transactions in the selected period.</td></tr>`;
    return;
  }

  tbody.innerHTML = sorted.map(r => {
    const ts    = parseTimestamp(r['Timestamp']);
    const time  = ts ? fmtTime(ts)    : '—';
    const day   = ts ? fmtDate(ts)    : '—';

    const action  = r['Action'] || '';
    const aBadge  = actionBadge(action);

    const cat     = (r['Category'] || '').toLowerCase();
    const cBadge  = cat ? `<span class="badge b-${cat}">${cat}</span>` : '—';

    // Appointment date (column Date)
    const apptDate = r['Date'] ? formatAppt(r['Date']) : '—';

    return `
      <tr>
        <td class="td-time">${time}<br><span style="font-size:0.7rem;color:var(--text-3)">${day}</span></td>
        <td>${aBadge}</td>
        <td class="td-name">${esc(r['Customer Name']) || '—'}</td>
        <td class="td-svc">${esc(r['Service']) || '—'}</td>
        <td>${cBadge}</td>
        <td>${esc(r['Location']) || '—'}</td>
        <td style="color:var(--text-2)">${apptDate}</td>
      </tr>`;
  }).join('');
}

function actionBadge(action) {
  const map = {
    'Book':        'b-book',
    'Cancel':      'b-cancel',
    'Reschedule':  'b-reschedule',
  };
  const cls = map[action] || '';
  return action ? `<span class="badge ${cls}">${action}</span>` : '—';
}

function formatAppt(s) {
  const d = parseDate(s);
  return d ? d.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }) : s;
}

// ──────────────────────────────────────────────
// CALL PERFORMANCE KPIs
// ──────────────────────────────────────────────
function computeCallKPIs(callRows) {
  const total     = callRows.length;
  const success   = callRows.filter(r => (r['Outcome'] || '').toLowerCase() === 'success');
  const abandoned = callRows.filter(r => (r['Outcome'] || '').toLowerCase() === 'abandoned');
  const noAction  = callRows.filter(r => (r['Outcome'] || '').toLowerCase() === 'no action');

  const successRate = total ? Math.round((success.length / total) * 100) : 0;
  const abandRate   = total ? Math.round((abandoned.length / total) * 100) : 0;

  // Average duration in seconds
  const durations = callRows.map(r => parseInt(r['Duration']) || 0).filter(d => d > 0);
  const avgDur    = durations.length ? Math.round(durations.reduce((a, b) => a + b, 0) / durations.length) : 0;

  return {
    total,
    successCount: success.length,
    abandonedCount: abandoned.length,
    noActionCount: noAction.length,
    successRate,
    abandRate,
    avgDur,
  };
}

function renderCallKPIs(k) {
  animateCount('kpi-calls',        k.total);
  animateCount('kpi-abandoned',    k.abandonedCount);

  // Success rate — show as "XX%" text (not animated number)
  setText('kpi-success-rate', k.total ? k.successRate + '%' : '—');

  // Avg duration — format as Xm Ys
  const mins = Math.floor(k.avgDur / 60);
  const secs = k.avgDur % 60;
  setText('kpi-avg-dur', k.avgDur ? (mins > 0 ? `${mins}m ${secs}s` : `${secs}s`) : '—');

  setText('det-calls',        `${k.successCount} successful`);
  setText('det-success-rate', `${k.successCount} of ${k.total} calls`);
  setText('det-avg-dur',      `across ${k.total} calls`);
  setText('det-abandoned',    `${k.abandRate}% abandonment rate`);

  // Period label
  setText('call-period', currentRange === 'all' ? 'All Time' : currentRange.charAt(0).toUpperCase() + currentRange.slice(1));
}

// Simple HTML escape
function esc(s) {
  if (!s) return '';
  return s.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;');
}
