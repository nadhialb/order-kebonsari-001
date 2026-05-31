// ─── KATEGORI ───────────────────────────────────────────────
const CC = {
  beras:   { l: 'Beras',          c: '#f59e0b', b: 'rgba(245,158,11,.15)'  },
  protein: { l: 'Protein Hewani', c: '#f87171', b: 'rgba(248,113,113,.15)' },
  ayam:    { l: 'Ayam Fresh',     c: '#fb923c', b: 'rgba(251,146,60,.15)'  },
  frozen:  { l: 'Frozen Food',    c: '#94a3b8', b: 'rgba(148,163,184,.15)' },
  tempe:   { l: 'Tempe',          c: '#4ade80', b: 'rgba(74,222,128,.15)'  },
  tahu:    { l: 'Tahu',           c: '#f472b6', b: 'rgba(244,114,182,.15)' },
  susu:    { l: 'Susu UHT',       c: '#60a5fa', b: 'rgba(96,165,250,.15)'  },
  buah:    { l: 'Buah',           c: '#c084fc', b: 'rgba(192,132,252,.15)' },
  sayur:   { l: 'Sayuran',        c: '#34d399', b: 'rgba(52,211,153,.15)'  },
  bumbu:   { l: 'Bumbu',          c: '#fbbf24', b: 'rgba(251,191,36,.15)'  },
  lain:    { l: 'Lainnya',        c: '#8a9ab8', b: 'rgba(138,154,184,.15)' },
};
const CO = ['beras','protein','ayam','frozen','tempe','tahu','susu','buah','sayur','bumbu','lain'];
const FK = ['ayam dada fillet','ayam giling','french fries'];
const AK = ['ayam paha','ayam potong','ayam kampung'];

function gc(b) {
  if (!b) return 'lain';
  const n = b.toLowerCase();
  if (n.includes('beras'))  return 'beras';
  if (n.includes('susu'))   return 'susu';
  if (n.includes('tempe'))  return 'tempe';
  if (n.includes('tahu'))   return 'tahu';
  if (FK.some(k => n.includes(k))) return 'frozen';
  if (AK.some(k => n.includes(k))) return 'ayam';
  if (['ayam','telur','daging','ikan','udang','sapi','kambing'].some(k => n.includes(k))) return 'protein';
  if (['bawang','saos','saus','kecap','minyak','gula','garam','knorr','ajinomoto',
       'tepung','mayonaise','margarin','keju','kunyit','ketumbar','cabe','cabai',
       'bombay'].some(k => n.includes(k))) return 'bumbu';
  if (['sawi','wortel','kubis','selada','jagung','timun','bayam',
       'kangkung','buncis','terong'].some(k => n.includes(k))) return 'sayur';
  if (['jeruk','pisang','apel','mangga','pepaya','nanas'].some(k => n.includes(k))) return 'buah';
  return 'lain';
}

// ─── STATE ─────────────────────────────────────────────────
let wo = 0;
let CK = {};
let hist = [];
let curTab = 'input';

// Load dari localStorage kalau ada
function loadState() {
  try {
    const saved = localStorage.getItem('kok_state');
    if (saved) {
      const s = JSON.parse(saved);
      if (s.WD)   WD   = s.WD;
      if (s.CK)   CK   = s.CK;
      if (s.hist) hist = s.hist;
      if (s.wo !== undefined) wo = s.wo;
    }
  } catch(e) {}
}

function saveState() {
  try {
    localStorage.setItem('kok_state', JSON.stringify({ WD, CK, hist, wo }));
  } catch(e) {}
}

// ─── DATA DEFAULT ───────────────────────────────────────────
let WD = { days: [
  { n: "Selasa, 02 Juni", od: "Senin, 01 Juni", os: "Senin 01/06", items: [
    { b: "Beras", q: 150, s: "kg" }, { b: "Ayam Dada Fillet", q: 170, s: "kg" },
    { b: "Tempe", q: 75, s: "kg" }, { b: "Susu UHT", q: 5, s: "L" },
    { b: "Jeruk Jawara", q: 240, s: "kg" }, { b: "Sawi Putih", q: 70, s: "kg" },
    { b: "Wortel", q: 20, s: "kg" }, { b: "Bawang Putih", q: 2, s: "kg" }, { b: "Garam", q: 3, s: "kg" }
  ]},
  { n: "Rabu, 03 Juni", od: "Selasa, 02 Juni", os: "Selasa 02/06", items: [
    { b: "Beras", q: 150, s: "kg" }, { b: "Telur", q: 165, s: "kg" },
    { b: "Tahu", q: 3000, s: "pcs" }, { b: "Kubis", q: 45, s: "kg" },
    { b: "Wortel", q: 40, s: "kg" }, { b: "Pisang Berlin", q: 4800, s: "pcs" },
    { b: "Knorr", q: 3, s: "kg" }, { b: "Minyak Goreng", q: 180, s: "L" }
  ]},
  { n: "Kamis, 04 Juni", od: "Rabu, 03 Juni", os: "Rabu 03/06", items: [
    { b: "Beras", q: 150, s: "kg" }, { b: "Ayam Paha (Potong 10)", q: 240, s: "kg" },
    { b: "Tempe", q: 90, s: "kg" }, { b: "Apel Manalagi", q: 175, s: "kg" },
    { b: "Selada", q: 10, s: "kg" }, { b: "Timun", q: 35, s: "kg" },
    { b: "Garam", q: 3, s: "kg" }, { b: "Cabe Merah", q: 8, s: "kg" }
  ]},
  { n: "Jum'at, 05 Juni", od: "Kamis, 04 Juni", os: "Kamis 04/06", items: [
    { b: "French Fries", q: 150, s: "kg" }, { b: "Ayam Giling", q: 80, s: "kg" },
    { b: "Tahu", q: 2400, s: "pcs" }, { b: "Jagung Kupas", q: 100, s: "kg" },
    { b: "Jeruk Santang", q: 180, s: "kg" }, { b: "Wortel", q: 10, s: "kg" },
    { b: "Saos Tomat", q: 3, s: "drigen" }
  ]},
]};

// ─── HELPERS ───────────────────────────────────────────────
const iid = (di, ii) => `${di}_${ii}`;

function toast(msg) {
  const el = document.getElementById('toast');
  el.textContent = msg;
  el.classList.add('show');
  setTimeout(() => el.classList.remove('show'), 2000);
}

function toggle(di, ii) {
  const id = iid(di, ii);
  CK[id] = !CK[id];
  saveState();
  refreshAll();
  updateNavDots();
}

function toggleGroup(ids) {
  const allCk = ids.every(id => CK[id]);
  ids.forEach(id => { CK[id] = !allCk; });
  saveState();
  refreshAll();
  updateNavDots();
}

function refreshAll() {
  if (curTab === 'input')     renderInput(false);
  if (curTab === 'rekap')     renderRekap();
  if (curTab === 'order-h')   renderOrderH();
  if (curTab === 'checklist') renderCL();
  updateProgress();
}

function updateProgress() {
  let tot = 0, dn = 0;
  WD.days.forEach((day, di) => day.items.forEach((_, ii) => {
    tot++; if (CK[iid(di, ii)]) dn++;
  }));
  const pct = tot > 0 ? Math.round(dn / tot * 100) : 0;
  const pf = document.getElementById('cl-prog');
  const ll = document.getElementById('cl-lbl');
  const ring = document.getElementById('ring-fill');
  const rl = document.getElementById('ring-pct');
  if (pf) pf.style.width = pct + '%';
  if (ll) ll.textContent = `${dn} / ${tot}`;
  if (ring) ring.style.strokeDashoffset = 87.96 * (1 - pct / 100);
  if (rl) rl.textContent = pct + '%';
}

function updateNavDots() {
  let tot = 0, dn = 0;
  WD.days.forEach((day, di) => day.items.forEach((_, ii) => {
    tot++; if (CK[iid(di, ii)]) dn++;
  }));
  const el = document.getElementById('badge-cl');
  if (el) el.className = 'ntab-badge' + (dn > 0 ? ' show' : '');
}

function getWeekLabel() {
  return `${2 + wo * 7}–${6 + wo * 7} Juni 2026`;
}

// ─── INPUT ─────────────────────────────────────────────────
function renderInput(full = true) {
  if (full) {
    document.getElementById('week-label').textContent = getWeekLabel();
  }
  const c = document.getElementById('days-c');
  c.innerHTML = '';
  WD.days.forEach((day, di) => {
    const doneN = day.items.filter((_, ii) => CK[iid(di, ii)]).length;
    const isAllDone = doneN === day.items.length && day.items.length > 0;
    const el = document.createElement('div');
    el.className = 'day-block';
    el.innerHTML = `
      <div class="day-hdr" onclick="togDay(${di})">
        <div class="day-hdr-l">
          ${day.n}
          <span class="chip ${isAllDone ? 'green' : ''}" id="bdg-${di}">${doneN}/${day.items.length}</span>
        </div>
        <div class="day-hdr-r">
          <span class="order-tag">order: ${day.os}</span>
          <span class="chev" id="chv-${di}">▾</span>
        </div>
      </div>
      <div class="day-body" id="db-${di}">
        <div class="row-lbl">
          <span></span><span>Bahan</span><span>Jml</span><span>Sat</span><span>Kat</span><span></span>
        </div>
        <div id="it-${di}"></div>
        <button class="btn-add" onclick="addIt(${di})">+ Tambah bahan</button>
      </div>`;
    c.appendChild(el);
    rItems(di);
  });
  updateProgress();
}

function togDay(di) {
  const b = document.getElementById(`db-${di}`);
  const ch = document.getElementById(`chv-${di}`);
  const open = b.style.display !== 'none';
  b.style.display = open ? 'none' : 'block';
  if (ch) ch.className = 'chev' + (open ? '' : ' open');
}

function rItems(di) {
  const c = document.getElementById(`it-${di}`);
  if (!c) return;
  c.innerHTML = '';
  WD.days[di].items.forEach((item, ii) => {
    const id = iid(di, ii);
    const ck = CK[id];
    const cfg = CC[gc(item.b)];
    const row = document.createElement('div');
    row.className = 'item-row' + (ck ? ' is-ck' : '');
    row.innerHTML = `
      <div class="chk ${ck ? 'on' : ''}" onclick="toggle(${di},${ii})" title="Tandai diorder">
        ${ck ? '✓' : ''}
      </div>
      <input type="text" value="${escH(item.b)}" placeholder="Nama bahan"
        oninput="upIt(${di},${ii},'b',this.value)">
      <input type="number" value="${item.q || ''}" placeholder="Qty" min="0"
        oninput="upIt(${di},${ii},'q',+this.value)">
      <input type="text" value="${escH(item.s)}" placeholder="kg"
        oninput="upIt(${di},${ii},'s',this.value)">
      <div class="cat-tag" id="ct-${di}-${ii}">
        <div class="cat-dot" style="background:${cfg.c}"></div>
        <span>${cfg.l}</span>
      </div>
      <button class="btn-x" onclick="rmIt(${di},${ii})" aria-label="Hapus">✕</button>`;
    c.appendChild(row);
  });
}

function escH(s) { return (s || '').replace(/"/g, '&quot;'); }

function upIt(di, ii, f, v) {
  WD.days[di].items[ii][f] = v;
  if (f === 'b') {
    const cfg = CC[gc(v)];
    const el = document.getElementById(`ct-${di}-${ii}`);
    if (el) el.innerHTML = `<div class="cat-dot" style="background:${cfg.c}"></div><span>${cfg.l}</span>`;
  }
  saveState();
}

function addIt(di) {
  WD.days[di].items.push({ b: '', q: null, s: 'kg' });
  saveState();
  renderInput(false);
}

function rmIt(di, ii) {
  WD.days[di].items.splice(ii, 1);
  delete CK[iid(di, ii)];
  saveState();
  renderInput(false);
}

function prevW() { wo--; saveState(); renderInput(); }
function nextW() { wo++; saveState(); renderInput(); }

function genExcel() {
  toast('Fitur generate Excel tersedia setelah deploy penuh.');
}

function saveW() {
  hist.unshift({
    label: getWeekLabel(),
    saved: new Date().toLocaleDateString('id-ID', { day: '2-digit', month: 'short', year: 'numeric' }),
    data:  JSON.parse(JSON.stringify(WD))
  });
  saveState();
  rHist();
  toast('✓ Minggu ' + getWeekLabel() + ' tersimpan!');
  const btn = document.getElementById('btn-sv');
  const orig = btn.innerHTML;
  btn.innerHTML = '✓ Tersimpan!';
  setTimeout(() => { btn.innerHTML = orig; }, 1800);
}

// ─── REKAP ─────────────────────────────────────────────────
function renderRekap() {
  WD.days.forEach((d, i) => {
    const el = document.getElementById(`rh${i}`);
    if (el) el.textContent = d.n.split(',')[0];
  });

  const map = {};
  WD.days.forEach((day, di) => day.items.forEach((item, ii) => {
    if (!item.b) return;
    const k = item.b.toLowerCase().trim();
    if (!map[k]) map[k] = { d: item.b, s: item.s, cat: gc(item.b), pd: {}, ids: [] };
    map[k].ids.push(iid(di, ii));
    if (item.q) map[k].pd[day.n] = (map[k].pd[day.n] || 0) + item.q;
  }));

  const multi = Object.values(map).filter(v => Object.keys(v.pd).length >= 2);
  document.getElementById('rekap-c').textContent = `${multi.length} bahan`;

  const tb = document.getElementById('rekap-tb');
  tb.innerHTML = '';
  if (!multi.length) {
    tb.innerHTML = `<tr><td colspan="8" style="text-align:center;padding:2rem;color:var(--text3)">Tidak ada bahan yang dipakai lebih dari 1 hari.</td></tr>`;
    return;
  }

  multi.sort((a, b) => CO.indexOf(a.cat) - CO.indexOf(b.cat) || a.d.localeCompare(b.d));
  let curC = null;

  multi.forEach(item => {
    if (item.cat !== curC) {
      curC = item.cat;
      const cfg = CC[curC];
      const tr = document.createElement('tr');
      tr.className = 'cat-row';
      tr.innerHTML = `<td colspan="8"><span style="display:inline-flex;align-items:center;gap:5px">
        <span style="width:6px;height:6px;border-radius:50%;background:${cfg.c};display:inline-block"></span>
        ${cfg.l}</span></td>`;
      tb.appendChild(tr);
    }

    const allCk = item.ids.every(id => CK[id]);
    const tr = document.createElement('tr');
    if (allCk) tr.className = 'ck-row';

    let tot = 0;
    const cells = WD.days.map(d => {
      const v = item.pd[d.n];
      if (v) { tot += v; return `<td class="nv">${v.toLocaleString()}</td>`; }
      return `<td class="nd">—</td>`;
    }).join('');

    const idsJson = JSON.stringify(item.ids).replace(/"/g, "'");
    tr.innerHTML = `
      <td style="text-align:center">
        <div class="chk-sm ${allCk ? 'on' : ''}" onclick="toggleGroup(${idsJson})">${allCk ? '✓' : ''}</div>
      </td>
      <td style="font-weight:500">${item.d}</td>
      <td style="text-align:center;color:var(--text3);font-size:10px">${item.s || ''}</td>
      ${cells}
      <td class="nv" style="font-weight:600">${tot.toLocaleString()}</td>`;
    tb.appendChild(tr);
  });
}

// ─── ORDER GROUPS ───────────────────────────────────────────
function buildOG() {
  const G = {}, seq = [];
  WD.days.forEach((day, di) => {
    const k = day.os;
    if (!G[k]) { G[k] = { label: day.od, short: k, menu: day.n, cats: {} }; seq.push(k); }
    day.items.forEach((item, ii) => {
      if (!item.b) return;
      const cat = gc(item.b);
      if (!G[k].cats[cat]) G[k].cats[cat] = [];
      const ex = G[k].cats[cat].find(i => i.b.toLowerCase() === item.b.toLowerCase());
      if (ex) { if (item.q) ex.q = (ex.q || 0) + item.q; ex.ids.push(iid(di, ii)); }
      else G[k].cats[cat].push({ ...item, ids: [iid(di, ii)] });
    });
  });
  return { G, seq };
}

// ─── PESAN ORDER ───────────────────────────────────────────
function renderOrderH() {
  const { G, seq } = buildOG();
  const cont = document.getElementById('order-h-c');
  cont.innerHTML = '';

  seq.forEach(key => {
    const grp = G[key];
    const block = document.createElement('div');
    block.className = 'msg-block';
    const sortedCats = Object.keys(grp.cats).sort((a, b) => CO.indexOf(a) - CO.indexOf(b));
    let lines = [grp.short, ''];
    let bHtml = '';

    sortedCats.forEach(cat => {
      const cfg = CC[cat];
      const items = grp.cats[cat];
      lines.push(`— ${cfg.l} —`);
      bHtml += `<div class="msg-cat">
        <div class="msg-cat-lbl">
          <span style="width:6px;height:6px;border-radius:50%;background:${cfg.c};display:inline-block"></span>
          ${cfg.l}
        </div>`;
      items.forEach(item => {
        const ck = item.ids.every(id => CK[id]);
        const line = `- ${item.b}${item.q ? ` ${item.q.toLocaleString()} ${item.s || ''}` : ''}`;
        lines.push(line);
        const idsStr = JSON.stringify(item.ids).replace(/"/g, "'");
        bHtml += `<div class="msg-row ${ck ? 'ck' : ''}" onclick="toggleGroup(${idsStr})">
          <div class="chk-sm ${ck ? 'on' : ''}">${ck ? '✓' : ''}</div>
          <span class="pill" style="background:${cfg.b};color:${cfg.c}">${cfg.l}</span>
          <span>${item.b}</span>
          <span class="q">${item.q ? item.q.toLocaleString() + ' ' + (item.s || '') : ''}</span>
        </div>`;
      });
      bHtml += '</div>';
    });

    const txt = lines.join('\n');
    const enc = encodeURIComponent(txt);

    block.innerHTML = `
      <div class="msg-hdr">
        <div class="msg-hdr-l">◎ Order ${grp.label}</div>
        <span class="msg-for">untuk ${grp.menu}</span>
      </div>
      <div class="msg-body">
        ${bHtml}
        <div class="msg-pre" onclick="copyT(this,'${enc}')">${txt}</div>
        <div class="copy-hint">↑ klik untuk copy pesan</div>
      </div>`;
    cont.appendChild(block);
  });
}

function copyT(el, enc) {
  navigator.clipboard.writeText(decodeURIComponent(enc)).then(() => {
    el.style.borderColor = 'rgba(74,222,128,.5)';
    el.style.color = '#4ade80';
    toast('✓ Pesan berhasil dicopy!');
    setTimeout(() => { el.style.borderColor = ''; el.style.color = ''; }, 1500);
  }).catch(() => { toast('Gagal copy, coba manual.'); });
}

// ─── CHECKLIST ─────────────────────────────────────────────
function renderCL() {
  const { G, seq } = buildOG();
  const cont = document.getElementById('cl-c');
  cont.innerHTML = '';

  seq.forEach(key => {
    const grp = G[key];
    const block = document.createElement('div');
    block.className = 'order-day';
    const sc = Object.keys(grp.cats).sort((a, b) => CO.indexOf(a) - CO.indexOf(b));
    let items = [];
    sc.forEach(cat => grp.cats[cat].forEach(item => items.push({ ...item, cat })));
    const dN = items.filter(item => item.ids.every(id => CK[id])).length;
    const isAllDone = dN === items.length && items.length > 0;

    block.innerHTML = `<div class="od-title">
      ◎ Order ${grp.label} — untuk ${grp.menu}
      <span class="chip ${isAllDone ? 'green' : ''}" style="margin-left:auto">${dN}/${items.length}</span>
    </div>`;

    items.forEach(item => {
      const ck = item.ids.every(id => CK[id]);
      const cfg = CC[item.cat];
      const row = document.createElement('div');
      row.className = 'oi' + (ck ? ' ck' : '');
      row.onclick = () => { toggleGroup(item.ids); };
      row.innerHTML = `
        <div class="chk-sm ${ck ? 'on' : ''}">${ck ? '✓' : ''}</div>
        <span class="pill" style="background:${cfg.b};color:${cfg.c}">${cfg.l}</span>
        <span>${item.b}</span>
        <span class="q">${item.q ? item.q.toLocaleString() + ' ' + (item.s || '') : ''}</span>`;
      block.appendChild(row);
    });
    cont.appendChild(block);
  });
  updateProgress();
}

// ─── HISTORI ───────────────────────────────────────────────
function rHist() {
  const c = document.getElementById('hist-c');
  if (!hist.length) { c.innerHTML = '<div class="empty-state">Belum ada histori tersimpan.</div>'; return; }
  c.innerHTML = '';
  hist.forEach((h, i) => {
    const el = document.createElement('div');
    el.className = 'hist-row';
    el.innerHTML = `
      <div>
        <div class="hist-title">Minggu ${h.label}</div>
        <div class="hist-sub">Disimpan ${h.saved}</div>
      </div>
      <div class="hist-actions">
        <button class="hist-btn" onclick="loadH(${i})">↖ Lihat</button>
        <button class="hist-btn" onclick="dupH(${i})">⊕ Duplikat</button>
      </div>`;
    c.appendChild(el);
  });
}

function loadH(i) { WD = JSON.parse(JSON.stringify(hist[i].data)); CK = {}; saveState(); go('input'); renderInput(); }
function dupH(i)  { WD = JSON.parse(JSON.stringify(hist[i].data)); CK = {}; wo++; saveState(); go('input'); renderInput(); toast('Duplikat berhasil — edit sesuai kebutuhan.'); }
function dupFirst() { if (!hist.length) { toast('Belum ada histori.'); return; } dupH(0); }

// ─── TABS ──────────────────────────────────────────────────
const TABS = ['input','rekap','order-h','checklist','histori'];

function go(name) {
  curTab = name;
  TABS.forEach(t => {
    document.getElementById(`s-${t}`).classList.remove('active');
  });
  document.querySelectorAll('.ntab').forEach(b => {
    b.classList.remove('active');
    b.setAttribute('aria-selected', 'false');
  });
  document.getElementById(`s-${name}`).classList.add('active');
  const idx = TABS.indexOf(name);
  const tabs = document.querySelectorAll('.ntab');
  if (tabs[idx]) { tabs[idx].classList.add('active'); tabs[idx].setAttribute('aria-selected', 'true'); }

  if (name === 'input')     renderInput(false);
  if (name === 'rekap')     renderRekap();
  if (name === 'order-h')   renderOrderH();
  if (name === 'checklist') renderCL();
  if (name === 'histori')   rHist();
}

// ─── INIT ──────────────────────────────────────────────────
loadState();
document.getElementById('week-label').textContent = getWeekLabel();
renderInput();
updateNavDots();
