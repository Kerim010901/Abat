// Abat — abatlaýyş merkeziniň dolandyryş paneli (demo).

const $ = selector => document.querySelector(selector);

const esc = value => String(value ?? '').replace(/[&<>"']/g, c => ({
  '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;',
}[c]));

const PAGES = {
  workshop: {
    label: 'Ussahana',
    title: 'Gowy iş <span>şu ýerden başlanýar.</span>',
    subtitle: 'Her enjam, her ädim — doly gözegçilikde.',
  },
  orders: {
    label: 'Sargytlar',
    title: 'Her sargyt <span>öz ýerinde.</span>',
    subtitle: 'Her enjam, her ädim — doly gözegçilikde.',
  },
  tracking: {
    label: 'Sargydy yzarla',
    title: 'Enjamyňyz <span>haýsy tapgyrda?</span>',
    subtitle: 'Sargyt koduňyzy giriziň we abatlaýşyň ýagdaýyny görüň.',
  },
};

const PHONE_ICON = '<svg viewBox="0 0 20 28" aria-hidden="true"><rect x="3" y="1.5" width="14" height="25" rx="3"/><path d="M7 4h6M8 23h4"/></svg>';

const METRIC_ICONS = [
  '<rect x="3" y="2" width="12" height="16" rx="2"/><path d="M7 15h4"/>',
  '<circle cx="9" cy="9" r="7"/><path d="M9 5v4l3 2"/>',
  '<path d="M3 10l4 4L17 4"/>',
  '<path d="M3 4h14v12H3zM6 1v6M14 1v6M3 9h14"/>',
];

// UI ýagdaýy
let page = 'workshop';
let query = '';
let statusFilter = 'all';
let view = 'board';
let trackingCode = '';

// ---------- Kömekçi funksiýalar ----------

function initials(name) {
  return name.split(' ').filter(Boolean).map(w => w[0]).slice(0, 2).join('');
}

function price(order) {
  return order.cost === null ? 'Baha bellenmedi' : order.cost.toLocaleString('en-US') + ' TMT';
}

function pad(n) {
  return String(n).padStart(2, '0');
}

function toast(text) {
  const el = $('#toast');
  el.textContent = text;
  el.classList.add('show');
  clearTimeout(toast.timer);
  toast.timer = setTimeout(() => el.classList.remove('show'), 3200);
}

function statusPill(stage) {
  return `<span class="status-pill s${stage}">${STAGES[stage]}</span>`;
}

// ---------- Ussahana we sargytlar ----------

function overview() {
  const orders = Store.orders;
  const metrics = [
    ['Işjeň sargytlar', orders.filter(o => o.stage < 3).length, 'Merkezdäki enjamlar', 'iş dowam edýär'],
    ['Abatlanýan enjamlar', orders.filter(o => o.stage === 2).length, 'Ussanyň iş meýdany', 'abatlaýyşda'],
    ['Taýýar enjamlar', orders.filter(o => o.stage === 3).length, 'Müşderä gowşurmaga taýýar', 'taýýar'],
    ['Jemi sargytlar', orders.length, 'Hasaba alnan ähli enjamlar', 'hasapda'],
  ];
  return `<section class="overview">${metrics.map(([title, n, desc, note], i) => `
    <div class="metric">
      <div class="metric-top"><span>${title}</span><svg viewBox="0 0 20 20" aria-hidden="true">${METRIC_ICONS[i]}</svg></div>
      <div class="metric-number">${pad(n)}<small>${note}</small></div>
      <div class="metric-note">${desc}</div>
    </div>`).join('')}</section>`;
}

function toolbar() {
  return `<div class="toolbar">
    <div class="search-box">
      <span>⌕</span>
      <input id="search" aria-label="Sargyt gözle" placeholder="Enjam, müşderi ýa-da sargyt kody…" value="${esc(query)}">
    </div>
    <select id="status-filter" aria-label="Ýagdaý boýunça süz">
      <option value="all">Ähli ýagdaýlar</option>
      ${STAGES.map((s, i) => `<option value="${i}" ${statusFilter === String(i) ? 'selected' : ''}>${s}</option>`).join('')}
    </select>
  </div>`;
}

function card(o) {
  return `<article class="repair-card" tabindex="0" role="button" data-order="${o.code}" aria-label="${esc(o.device)} — ${o.code} maglumatlaryny aç">
    <div class="card-top"><span class="ticket-code">#${o.code}</span><span class="urgency ${o.master ? 'assigned' : ''}" title="${esc(o.master || 'Ussa bellenmedi')}"></span></div>
    <div class="device-icon">${PHONE_ICON}</div>
    <h3>${esc(o.device)}</h3>
    <p class="problem">${esc(o.problem)}</p>
    <div class="card-price ${o.cost === null ? 'pending' : ''}">${price(o)}</div>
    <div class="card-bottom">
      <span class="client-initial" title="${esc(o.name)}">${esc(initials(o.name))}</span>
      <span>${o.date.slice(0, 5)} · ${o.time}</span>
    </div>
  </article>`;
}

function filteredOrders() {
  const q = query.toLocaleLowerCase();
  return Store.orders.filter(o =>
    (statusFilter === 'all' || o.stage === Number(statusFilter)) &&
    [o.device, o.name, o.code, o.problem, o.phone, o.master].join(' ').toLocaleLowerCase().includes(q));
}

function boardHtml(list) {
  return `<div class="board">${STAGES.map((stage, i) => {
    const items = list.filter(o => o.stage === i);
    return `<section class="column" data-stage="${i}">
      <div class="column-head"><span class="status-dot"></span>${stage}<b>${pad(items.length)}</b></div>
      ${items.length ? items.map(card).join('') : '<p class="empty-column">Bu ýagdaýda<br>sargyt ýok</p>'}
    </section>`;
  }).join('')}</div>`;
}

function tableHtml(list) {
  const rows = list.map(o => `<tr>
    <td><span class="ticket-code">${o.code}</span><br><small>${o.date}</small></td>
    <td><strong>${esc(o.device)}</strong><small>${esc(o.problem)}</small></td>
    <td><strong>${esc(o.name)}</strong><small>${esc(o.phone)}</small></td>
    <td>${esc(o.master || '—')}</td>
    <td>${price(o)}</td>
    <td>${statusPill(o.stage)}</td>
    <td><button class="text-button" data-order="${o.code}" aria-label="${o.code} maglumatlaryny aç">Aç ↗</button></td>
  </tr>`).join('');
  return `<div class="table-box">
    <table>
      <thead><tr><th>SARGYT</th><th>ENJAM / NÄSAZLYK</th><th>MÜŞDERI</th><th>USSA</th><th>BAHA</th><th>ÝAGDAÝ</th><th></th></tr></thead>
      <tbody>${rows}</tbody>
    </table>
    ${list.length ? '' : '<div class="empty-results">Gözlege laýyk sargyt tapylmady.</div>'}
  </div>`;
}

function renderResults() {
  const list = filteredOrders();
  $('#result-count').textContent = '(' + list.length + ')';
  $('#results').innerHTML = page === 'orders' || view === 'list' ? tableHtml(list) : boardHtml(list);
}

function sidePanel() {
  const ready = Store.orders.filter(o => o.stage === 3).length;
  const revenue = Store.orders.filter(o => o.stage === 3).reduce((sum, o) => sum + (o.cost || 0), 0);
  return `<div class="right-column">
    <section class="side-summary">
      <div class="micro">GOWŞURMAGA TAÝÝAR <span>↗</span></div>
      <h3>Abatlandy.<br><span>Täze güne taýýar.</span></h3>
      <div class="big-ready">${pad(ready)}</div>
      <p>Abatlaýşy tamamlanan enjamlar<br>müşderilerine garaşýar.<br>Jemi: <b>${revenue.toLocaleString('en-US')} TMT</b></p>
      <button class="ready-link" id="show-ready">Taýýar enjamlary gör <span>→</span></button>
    </section>
    <section class="activity-panel">
      <h3>Soňky hereketler</h3>
      ${Store.events.slice(0, 4).map(e => `<div class="activity"><p>${esc(e.text)}</p><small>${esc(e.time)}</small></div>`).join('')}
    </section>
    <p class="demo-note">Bu interaktiw demo. Üýtgeşmeler şu brauzerde saklanýar. Nusga maglumatlary dikeltmek üçin ýokardaky «Demony täzeden başla» düwmesine basyň.</p>
  </div>`;
}

function renderWorkspace() {
  const isWorkshop = page === 'workshop';
  $('#content').innerHTML = overview() + `
    <div class="${isWorkshop ? 'work-grid' : ''}">
      <section class="work-panel">
        <div class="section-title">
          <h2>${isWorkshop ? 'Abatlaýyş iş akymy' : 'Ähli sargytlar'} <span id="result-count"></span></h2>
          ${isWorkshop ? `<div class="switcher">
            <button data-view="board" class="${view === 'board' ? 'active' : ''}" aria-label="Tapgyrlar görnüşi">▥</button>
            <button data-view="list" class="${view === 'list' ? 'active' : ''}" aria-label="Sanaw görnüşi">☰</button>
          </div>` : ''}
        </div>
        ${toolbar()}
        <div id="results"></div>
        <p class="board-help"><span>ⓘ</span> Bahany, ussany we ýagdaýy üýtgetmek üçin sargydyň üstüne basyň.</p>
      </section>
      ${isWorkshop ? sidePanel() : ''}
    </div>`;

  renderResults();

  $('#search').oninput = e => { query = e.target.value; renderResults(); };
  $('#status-filter').onchange = e => { statusFilter = e.target.value; renderResults(); };
  document.querySelectorAll('[data-view]').forEach(btn => {
    btn.onclick = () => { view = btn.dataset.view; render(); };
  });
  const readyBtn = $('#show-ready');
  if (readyBtn) readyBtn.onclick = () => { statusFilter = '3'; view = 'list'; render(); };
}

// ---------- Müşderi üçin yzarlamak ----------

function renderTracking() {
  $('#content').innerHTML = `<div class="tracking-grid">
    <section class="tracking-intro">
      <span class="tracking-icon">⌕</span>
      <h2>Garaşmak aňsat.<br><span>Ýagdaýy bilseňiz.</span></h2>
      <p>Enjam kabul edilende berlen sargyt koduny ulanyň. Bahasy we abatlaýyş tapgyry şu ýerde görkeziler.</p>
      <div class="sample-code">Synap görmek üçin nusga sargytlar:<br>
        ${['AB-2410', 'AB-2412', 'AB-2407'].map(c => `<button data-sample="${c}">${c} ↗</button>`).join(' ')}
      </div>
      <p class="form-note">Diňe demo: bu sahypa hakyky müşderi maglumatlary üçin niýetlenen däldir.</p>
    </section>
    <section class="tracking-panel">
      <h2>Sargydyňyzy barlaň</h2>
      <p>Sargyt kody kabul ediş maglumatlarynda görkezilýär.</p>
      <form id="track-form" class="track-form">
        <input name="code" id="track-code" aria-label="Sargyt kody" placeholder="Meselem: AB-2410" maxlength="20" required value="${esc(trackingCode)}">
        <button class="primary">Ýagdaýy gör →</button>
      </form>
      <div id="track-output">
        <div class="tracking-empty">Sargyt koduny giriziň.<br>Enjamyň ýagdaýy şu ýerde görkeziler.</div>
      </div>
    </section>
  </div>`;

  $('#track-form').onsubmit = e => {
    e.preventDefault();
    trackingCode = $('#track-code').value.trim().toUpperCase();
    showTracking(trackingCode);
  };
  document.querySelectorAll('[data-sample]').forEach(btn => {
    btn.onclick = () => {
      trackingCode = btn.dataset.sample;
      $('#track-code').value = trackingCode;
      showTracking(trackingCode);
    };
  });
  if (trackingCode) showTracking(trackingCode);
}

function showTracking(code) {
  const o = Store.find(code);
  if (!o) {
    $('#track-output').innerHTML = '<div class="tracking-empty" role="status">Bu kod boýunça sargyt tapylmady.<br>Koduň dogry ýazylandygyny barlaň.</div>';
    return;
  }
  const steps = STAGES.map((s, i) => `
    <div class="timeline-step ${i <= o.stage ? 'done' : ''} ${i === o.stage ? 'current' : ''}">
      <span class="step-number">${i < o.stage ? '✓' : i + 1}</span>
      <h4>${s}</h4>
      <p>${STAGE_DESCRIPTIONS[i]}</p>
    </div>`).join('');

  $('#track-output').innerHTML = `<div class="track-result" aria-live="polite">
    <div class="track-result-head">
      <div><span class="track-code">${o.code}</span><h3>${esc(o.device)}</h3></div>
      ${statusPill(o.stage)}
    </div>
    <p class="track-problem">${esc(o.problem)}</p>
    <div class="timeline">${steps}</div>
    ${o.stage === 3 ? '<div class="ready-message">✓ Enjamyňyz taýýar! Sargyt koduňyz bilen merkeze ýüz tutup, enjamyňyzy alyp bilersiňiz.</div>' : ''}
    <div class="cost-box"><span>Abatlaýyş bahasy</span><strong>${price(o)}</strong></div>
    ${o.note ? `<p class="track-problem track-note">Ussanyň belligi: ${esc(o.note)}</p>` : ''}
  </div>`;
}

// ---------- Modal penjireler ----------

function openModal(label, title, html) {
  $('#modal-label').textContent = label;
  $('#modal-title').textContent = title;
  $('#modal-content').innerHTML = html;
  $('#modal').showModal();
}

function openDetail(code) {
  const o = Store.find(code);
  if (!o) return;

  openModal(o.code + ' / SARGYT', o.device, `
    <div class="details-summary">
      <div><small>Müşderi</small><strong>${esc(o.name)}</strong></div>
      <div><small>Telefon belgisi</small><strong>${esc(o.phone)}</strong></div>
      <div><small>Kabul edilen wagty</small><strong>${o.date} · ${o.time}</strong></div>
      <div><small>Häzirki ýagdaýy</small>${statusPill(o.stage)}</div>
    </div>
    <p class="detail-problem">${esc(o.problem)}</p>
    <form id="update-form">
      <div class="form-grid">
        <div>
          <label for="repair-cost">Abatlaýyş bahasy (TMT)</label>
          <input type="number" id="repair-cost" name="cost" min="0" max="1000000" step="0.01" placeholder="Entek bellenmedi" value="${o.cost === null ? '' : o.cost}">
        </div>
        <div>
          <label for="repair-stage">Abatlaýyş ýagdaýy</label>
          <select id="repair-stage" name="stage">
            ${STAGES.map((s, i) => `<option value="${i}" ${o.stage === i ? 'selected' : ''}>${s}</option>`).join('')}
          </select>
        </div>
        <div class="full">
          <label for="repair-master">Jogapkär ussa</label>
          <select id="repair-master" name="master">
            <option value="">Bellenmedi</option>
            ${MASTERS.map(m => `<option ${o.master === m ? 'selected' : ''}>${esc(m)}</option>`).join('')}
          </select>
        </div>
        <div class="full">
          <label for="repair-note">Müşderä görünýän bellik</label>
          <textarea rows="2" id="repair-note" name="note" maxlength="500" placeholder="Ýerine ýetirilen iş barada…">${esc(o.note)}</textarea>
        </div>
      </div>
      <p class="form-note">«Taýýar» ýagdaýyny bellemek üçin abatlaýyş bahasyny giriziň. Mugt hyzmat üçin 0 ýazyň.</p>
      <div class="form-actions">
        <button type="button" class="secondary" id="preview-tracking">Müşderiniň görnüşi ↗</button>
        <button class="primary">Ýatda sakla</button>
      </div>
    </form>
    <h3 class="history-heading">Sargydyň taryhy</h3>
    ${o.history.slice().reverse().map(h => `<div class="history-item"><b>${esc(h.text)}</b> · ${esc(h.time)}</div>`).join('')}`);

  const costInput = $('#repair-cost');
  costInput.oninput = () => costInput.setCustomValidity('');
  $('#repair-stage').onchange = () => costInput.setCustomValidity('');

  $('#preview-tracking').onclick = () => {
    trackingCode = o.code;
    $('#modal').close();
    location.hash = 'tracking';
  };

  $('#update-form').onsubmit = e => {
    e.preventDefault();
    const form = new FormData(e.target);
    const stage = Number(form.get('stage'));
    const rawCost = form.get('cost').trim();
    const cost = rawCost === '' ? null : Number(rawCost);
    const note = form.get('note').trim();
    const master = form.get('master') || null;

    if (stage === 3 && cost === null) {
      costInput.setCustomValidity('Taýýar enjam üçin bahany giriziň.');
      costInput.reportValidity();
      return;
    }

    const changed = [];
    if (o.stage !== stage) changed.push(STAGES[stage]);
    if (o.cost !== cost) changed.push(cost === null ? 'Baha aýryldy' : 'Baha: ' + cost + ' TMT');
    if (o.master !== master) changed.push('Ussa: ' + (master || 'aýryldy'));
    if (o.note !== note) changed.push('Bellik täzelendi');

    Store.updateOrder(o.code, { stage, cost, note, master }, changed.join(' · '));
    $('#modal').close();
    render();
    toast(changed.length ? 'Sargyt täzelendi' : 'Üýtgeşme ýok');
  };
}

function openIntake() {
  openModal('TÄZE SARGYT', 'Enjamy kabul et', `
    <form id="intake-form">
      <div class="form-grid">
        <div>
          <label for="customer-name">Müşderiniň ady we familiýasy</label>
          <input id="customer-name" name="name" required maxlength="80" placeholder="Meselem: Maksat Orazow">
        </div>
        <div>
          <label for="customer-phone">Telefon belgisi</label>
          <input type="tel" id="customer-phone" name="phone" required minlength="7" maxlength="25" placeholder="+993 …">
        </div>
        <div class="full">
          <label for="device-name">Enjamyň markasy we modeli</label>
          <input id="device-name" name="device" required maxlength="80" placeholder="Meselem: Samsung Galaxy A22">
        </div>
        <div class="full">
          <label for="device-problem">Müşderiniň aýdýan näsazlygy</label>
          <textarea id="device-problem" name="problem" required maxlength="600" rows="3" placeholder="Enjamda nähili mesele ýüze çykdy?"></textarea>
        </div>
        <div class="full">
          <label for="initial-cost">Başlangyç baha (TMT, islege görä)</label>
          <input id="initial-cost" name="cost" type="number" min="0" max="1000000" step="0.01" placeholder="Barlagdan soň hem belläp bilersiňiz">
        </div>
      </div>
      <p class="form-note">Sargyt awtomatik «Kabul edildi» ýagdaýyna geçer. Müşderä yzarlamak üçin aýratyn kod berler.</p>
      <div class="form-actions">
        <button type="button" class="secondary" data-close>Ýatyr</button>
        <button class="primary">Enjamy kabul et →</button>
      </div>
    </form>`);

  $('#intake-form').onsubmit = e => {
    e.preventDefault();
    const form = new FormData(e.target);
    const field = name => form.get(name).trim();
    if (['name', 'phone', 'device', 'problem'].some(k => !field(k))) {
      toast('Maglumatlary doly giriziň');
      return;
    }

    const stamp = now();
    const [date, time] = stamp.split(' · ');
    const order = {
      code: Store.nextCode(),
      name: field('name'),
      phone: field('phone'),
      device: field('device'),
      problem: field('problem'),
      cost: field('cost') === '' ? null : Number(field('cost')),
      stage: 0,
      master: null,
      date,
      time,
      note: '',
      history: [{ text: 'Enjam kabul edildi', time: stamp }],
    };
    Store.addOrder(order);
    statusFilter = 'all';
    query = '';
    render();

    $('#modal-label').textContent = 'SARGYT DÖREDILDI';
    $('#modal-title').textContent = 'Enjam kabul edildi';
    $('#modal-content').innerHTML = `
      <p class="detail-problem"><strong>${esc(order.device)}</strong><br>${esc(order.name)} · ${esc(order.phone)}</p>
      <div class="success-code">
        <small>MÜŞDERINIŇ YZARLAÝYŞ KODY</small>
        <strong>${order.code}</strong>
        <small>Bu kody müşderä beriň.</small>
      </div>
      <p class="form-note">Enjam «Kabul edildi» ýagdaýynda. Bahany we ýagdaýy sargydy açyp üýtgedip bilersiňiz.</p>
      <div class="form-actions">
        <button class="secondary" data-close>Ýap</button>
        <button class="primary" id="track-new">Sargydy yzarla ↗</button>
      </div>`;
    $('#track-new').onclick = () => {
      trackingCode = order.code;
      $('#modal').close();
      location.hash = 'tracking';
    };
    toast('Täze sargyt döredildi');
  };
}

// ---------- Esasy render ----------

function render() {
  page = location.hash.slice(1);
  if (!PAGES[page]) page = 'workshop';
  const meta = PAGES[page];

  $('#breadcrumb').textContent = meta.label;
  $('#title').innerHTML = meta.title;
  $('#subtitle').textContent = meta.subtitle;
  $('#nav-count').textContent = Store.orders.filter(o => o.stage < 3).length;
  $('#new-order').hidden = page === 'tracking';
  document.querySelectorAll('[data-nav]').forEach(a => {
    const active = a.dataset.nav === page;
    a.classList.toggle('active', active);
    a.setAttribute('aria-current', active ? 'page' : 'false');
  });

  if (page === 'tracking') renderTracking();
  else renderWorkspace();
}

$('#new-order').onclick = openIntake;

$('#reset-demo').onclick = () => {
  if (!confirm('Ähli üýtgeşmeler pozular we nusga maglumatlar dikeldiler. Dowam etmelimi?')) return;
  Store.reset();
  query = '';
  statusFilter = 'all';
  trackingCode = '';
  render();
  toast('Nusga maglumatlar dikeldildi');
};

$('#modal').onclick = e => {
  // Ýap düwmesi ýa-da penjireden daşyna (backdrop) basylanda ýapmak
  const box = $('#modal').getBoundingClientRect();
  const outside = e.clientX < box.left || e.clientX > box.right || e.clientY < box.top || e.clientY > box.bottom;
  if (e.target.closest('[data-close]') || (e.target === $('#modal') && outside)) $('#modal').close();
};

$('#content').onclick = e => {
  const target = e.target.closest('[data-order]');
  if (target) openDetail(target.dataset.order);
};

$('#content').onkeydown = e => {
  if ((e.key === 'Enter' || e.key === ' ') && e.target.matches('.repair-card')) {
    e.preventDefault();
    openDetail(e.target.dataset.order);
  }
};

window.addEventListener('hashchange', () => {
  query = '';
  statusFilter = 'all';
  render();
});

render();
