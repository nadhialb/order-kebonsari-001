// ─── CONFIG SUPABASE ─────────────────────────────────────────
const SB_URL = 'https://iwwugdsvetcxouuuubiz.supabase.co';
const SB_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Iml3d3VnZHN2ZXRjeG91dXV1Yml6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODAyMzQxMzQsImV4cCI6MjA5NTgxMDEzNH0.XQcRDZiKy-lMLYjGP5JMcSPDoDzmbXvIww7g2wO8IfY';

const sbH = () => ({
  'apikey': SB_KEY,
  'Authorization': `Bearer ${SB_KEY}`,
  'Content-Type': 'application/json',
  'Prefer': 'return=representation'
});

async function sbGet(table, params='') {
  const r = await fetch(`${SB_URL}/rest/v1/${table}?${params}`, { headers: sbH() });
  if (!r.ok) throw new Error(`GET ${table}: ${r.status}`);
  return r.json();
}
async function sbPost(table, body) {
  const r = await fetch(`${SB_URL}/rest/v1/${table}`, {
    method:'POST', headers: sbH(), body: JSON.stringify(body)
  });
  if (!r.ok) throw new Error(`POST ${table}: ${r.status} ${await r.text()}`);
  return r.json();
}
async function sbPatch(table, params, body) {
  const r = await fetch(`${SB_URL}/rest/v1/${table}?${params}`, {
    method:'PATCH', headers: sbH(), body: JSON.stringify(body)
  });
  if (!r.ok) throw new Error(`PATCH ${table}: ${r.status}`);
  return r.json();
}
async function sbDelete(table, params) {
  const r = await fetch(`${SB_URL}/rest/v1/${table}?${params}`, {
    method:'DELETE', headers: sbH()
  });
  if (!r.ok) throw new Error(`DELETE ${table}: ${r.status}`);
}

// ─── KATEGORI ────────────────────────────────────────────────
const CC = {
  beras:   {l:'Beras',          e:'🌾',c:'#f59e0b',b:'rgba(245,158,11,.18)'},
  protein: {l:'Protein Hewani', e:'🍗',c:'#f87171',b:'rgba(248,113,113,.18)'},
  ayam:    {l:'Ayam Fresh',     e:'🐔',c:'#fb923c',b:'rgba(251,146,60,.18)'},
  frozen:  {l:'Frozen Food',    e:'🧊',c:'#94a3b8',b:'rgba(148,163,184,.18)'},
  tempe:   {l:'Tempe',          e:'🫘',c:'#4ade80',b:'rgba(74,222,128,.18)'},
  tahu:    {l:'Tahu',           e:'⬜',c:'#f472b6',b:'rgba(244,114,182,.18)'},
  susu:    {l:'Susu UHT',       e:'🥛',c:'#60a5fa',b:'rgba(96,165,250,.18)'},
  buah:    {l:'Buah',           e:'🍊',c:'#c084fc',b:'rgba(192,132,252,.18)'},
  sayur:   {l:'Sayuran',        e:'🥬',c:'#34d399',b:'rgba(52,211,153,.18)'},
  bumbu:   {l:'Bumbu',          e:'🧄',c:'#fbbf24',b:'rgba(251,191,36,.18)'},
  lain:    {l:'Lainnya',        e:'📦',c:'#8a9ab8',b:'rgba(138,154,184,.18)'},
};
const CO=['beras','protein','ayam','frozen','tempe','tahu','susu','buah','sayur','bumbu','lain'];
const FK=['ayam dada fillet','ayam giling','french fries'];
const AK=['ayam paha','ayam potong','ayam kampung'];

function gc(b){
  if(!b) return 'lain';
  const n=b.toLowerCase().trim();
  if(n.includes('beras'))  return 'beras';
  if(n.includes('susu'))   return 'susu';
  if(n.includes('tempe'))  return 'tempe';
  if(n.includes('tahu'))   return 'tahu';
  if(FK.some(k=>n.includes(k))) return 'frozen';
  if(AK.some(k=>n.includes(k))) return 'ayam';
  if(['ayam','telur','daging','ikan','udang','sapi','kambing'].some(k=>n.includes(k))) return 'protein';
  if(['bawang','saos','saus','kecap','minyak','gula','garam','knorr','ajinomoto',
      'tepung','mayonaise','margarin','keju','kunyit','ketumbar','cabe','cabai','bombay'].some(k=>n.includes(k))) return 'bumbu';
  if(['sawi','wortel','kubis','selada','jagung','timun','bayam','kangkung','buncis','terong'].some(k=>n.includes(k))) return 'sayur';
  if(['jeruk','pisang','apel','mangga','pepaya','nanas'].some(k=>n.includes(k))) return 'buah';
  return 'lain';
}

// ─── TEMA ────────────────────────────────────────────────────
const THEMES={
  navy:  {name:'Navy',   bg:'#0f1623',bg2:'#1a2744',bg3:'#1e2d50',surface:'#1e2d50',surface2:'#243258',accent:'#4f8ef7'},
  forest:{name:'Forest', bg:'#0d1a12',bg2:'#152a1c',bg3:'#1a3322',surface:'#1a3322',surface2:'#1f3d28',accent:'#4ade80'},
  slate: {name:'Slate',  bg:'#0f1117',bg2:'#1a1d26',bg3:'#1e2230',surface:'#1e2230',surface2:'#252938',accent:'#818cf8'},
  rose:  {name:'Rose',   bg:'#180f14',bg2:'#2a1520',bg3:'#321828',surface:'#321828',surface2:'#3d1e30',accent:'#f472b6'},
  amber: {name:'Amber',  bg:'#18130a',bg2:'#271e0e',bg3:'#302514',surface:'#302514',surface2:'#3a2d18',accent:'#fbbf24'},
};
function applyTheme(key){
  const t=THEMES[key]||THEMES.navy;
  const r=document.documentElement.style;
  r.setProperty('--bg',t.bg); r.setProperty('--bg2',t.bg2); r.setProperty('--bg3',t.bg3);
  r.setProperty('--surface',t.surface); r.setProperty('--surface2',t.surface2); r.setProperty('--accent',t.accent);
  curTheme=key; saveLocal();
  document.querySelectorAll('.theme-pill').forEach(el=>el.classList.toggle('active',el.dataset.theme===key));
}

// ─── HELPERS ─────────────────────────────────────────────────
function fNum(n){ if(n===null||n===undefined||n==='') return ''; return Number(n).toLocaleString('id-ID'); }
function toTitle(s){ if(!s) return ''; return s.trim().replace(/\w\S*/g,w=>w.charAt(0).toUpperCase()+w.slice(1).toLowerCase()); }
function escH(s){ return (s||'').replace(/&/g,'&amp;').replace(/"/g,'&quot;').replace(/</g,'&lt;'); }
function toast(msg,dur=2500){
  const el=document.getElementById('toast'); el.textContent=msg; el.classList.add('show');
  clearTimeout(el._t); el._t=setTimeout(()=>el.classList.remove('show'),dur);
}
function setLoading(on){ document.getElementById('loading-bar').style.width=on?'60%':'0'; }

// ─── STATE ───────────────────────────────────────────────────
let CK={}, curTab='input', curTheme='navy', curWeekId=null;
let STOK=[], SUMBER=['Beli Sendiri','Stok Sendiri','Dapur Sempolan','Kejayan'];
let hist=[];

// Cache lokal sementara (fallback kalau offline)
function saveLocal(){
  try { localStorage.setItem('kok_local',JSON.stringify({WD,CK,STOK,SUMBER,curTheme,curWeekId,hist})); } catch(e){}
}
function loadLocal(){
  try {
    const s=JSON.parse(localStorage.getItem('kok_local')||'{}');
    if(s.WD)         WD=s.WD;
    if(s.CK)         CK=s.CK;
    if(s.STOK)       STOK=s.STOK;
    if(s.SUMBER)     SUMBER=s.SUMBER;
    if(s.curTheme)   { curTheme=s.curTheme; applyTheme(s.curTheme); }
    if(s.curWeekId)  curWeekId=s.curWeekId;
    if(s.hist)       hist=s.hist;
  } catch(e){}
}

// ─── DATA DEFAULT ────────────────────────────────────────────
let WD={days:[
  {n:"Selasa, 02 Juni 2026",od:"Senin, 01 Juni 2026",os:"Senin 01/06",items:[
    {b:"Beras",q:150,s:"kg",h:16000,hb:null,ket:""},
    {b:"Ayam Dada Fillet",q:170,s:"kg",h:51500,hb:null,ket:""},
    {b:"Tepung Cakra",q:25,s:"kg",h:12000,hb:null,ket:""},
    {b:"Knorr",q:2,s:"kg",h:101000,hb:null,ket:""},
    {b:"Ajinomoto",q:1,s:"kg",h:48000,hb:null,ket:""},
    {b:"Tepung Panir",q:15,s:"kg",h:18000,hb:null,ket:""},
    {b:"Susu UHT",q:5,s:"L",h:23000,hb:null,ket:""},
    {b:"Keju Melted",q:3,s:"kg",h:160000,hb:null,ket:""},
    {b:"Margarin Simas",q:3,s:"kg",h:25000,hb:null,ket:""},
    {b:"Gula Pasir",q:5,s:"kg",h:17500,hb:null,ket:""},
    {b:"Tempe",q:75,s:"kg",h:15000,hb:null,ket:""},
    {b:"Garam",q:3,s:"kg",h:9000,hb:null,ket:""},
    {b:"Sawi Putih",q:70,s:"kg",h:11000,hb:null,ket:""},
    {b:"Wortel",q:20,s:"kg",h:10000,hb:null,ket:""},
    {b:"Bawang Putih",q:2,s:"kg",h:30000,hb:null,ket:""},
    {b:"Bawang Merah",q:2,s:"kg",h:42000,hb:null,ket:""},
    {b:"Bawang Bombay",q:1,s:"kg",h:34000,hb:null,ket:""},
    {b:"Jeruk Jawara",q:240,s:"kg",h:22000,hb:null,ket:""},
    {b:"Minyak Wijen",q:2,s:"btl",h:41000,hb:null,ket:""},
    {b:"Saos Tiram",q:2,s:"btl",h:53000,hb:null,ket:""},
    {b:"Kecap Manis Dara",q:1,s:"drigen",h:130000,hb:null,ket:""},
    {b:"Saos Sambal",q:1,s:"drigen",h:95000,hb:null,ket:""},
    {b:"Saos Tomat",q:1,s:"drigen",h:92000,hb:null,ket:""},
  ]},
  {n:"Rabu, 03 Juni 2026",od:"Selasa, 02 Juni 2026",os:"Selasa 02/06",items:[
    {b:"Beras",q:150,s:"kg",h:16000,hb:null,ket:""},{b:"Telur",q:165,s:"kg",h:25000,hb:null,ket:""},
    {b:"Tahu",q:3000,s:"pcs",h:500,hb:null,ket:""},{b:"Tepung Panir",q:25,s:"kg",h:18000,hb:null,ket:""},
    {b:"Tepung Terigu Segitiga (L)",q:25,s:"kg",h:12000,hb:null,ket:""},{b:"Tepung Maizena",q:5,s:"kg",h:18000,hb:null,ket:""},
    {b:"Kubis",q:45,s:"kg",h:8500,hb:null,ket:""},{b:"Wortel",q:40,s:"kg",h:10000,hb:null,ket:""},
    {b:"Selada",q:13,s:"kg",h:45000,hb:null,ket:""},{b:"Knorr",q:3,s:"kg",h:101000,hb:null,ket:""},
    {b:"Ajinomoto",q:2,s:"kg",h:48000,hb:null,ket:""},{b:"Garam",q:5,s:"kg",h:9000,hb:null,ket:""},
    {b:"Gula Pasir",q:2,s:"kg",h:17500,hb:null,ket:""},{b:"Jagung Pipil",q:15,s:"kg",h:21000,hb:null,ket:""},
    {b:"Pisang Berlin",q:4800,s:"pcs",h:850,hb:null,ket:""},{b:"Minyak Goreng",q:180,s:"L",h:22500,hb:null,ket:""},
    {b:"Tepung Cakra",q:50,s:"kg",h:12500,hb:null,ket:""},{b:"Saos Inggris",q:2,s:"btl",h:50000,hb:null,ket:""},
    {b:"Saos Teriyaki",q:3,s:"btl",h:53000,hb:null,ket:""},{b:"Bawang Bombay",q:2,s:"kg",h:34000,hb:null,ket:""},
    {b:"Kunyit Bubuk",q:24,s:"pcs",h:1000,hb:null,ket:""},
  ]},
  {n:"Kamis, 04 Juni 2026",od:"Rabu, 03 Juni 2026",os:"Rabu 03/06",items:[
    {b:"Beras",q:150,s:"kg",h:16000,hb:null,ket:""},{b:"Timun",q:35,s:"kg",h:6500,hb:null,ket:""},
    {b:"Selada",q:10,s:"kg",h:45000,hb:null,ket:""},{b:"Saos Inggris",q:1,s:"btl",h:50000,hb:null,ket:""},
    {b:"Ayam Paha (Potong 10)",q:240,s:"kg",h:36000,hb:null,ket:""},{b:"Saos Tomat",q:2,s:"drigen",h:92000,hb:null,ket:""},
    {b:"Kecap Manis Dara",q:1,s:"drigen",h:130000,hb:null,ket:""},{b:"Gula Pasir",q:5,s:"kg",h:17500,hb:null,ket:""},
    {b:"Tempe",q:90,s:"kg",h:15000,hb:null,ket:""},{b:"Ajinomoto",q:2,s:"kg",h:48000,hb:null,ket:""},
    {b:"Garam",q:3,s:"kg",h:9000,hb:null,ket:""},{b:"Knorr",q:2,s:"kg",h:101000,hb:null,ket:""},
    {b:"Cabe Rawit",q:3,s:"kg",h:85000,hb:null,ket:""},{b:"Bawang Merah",q:2,s:"kg",h:42000,hb:null,ket:""},
    {b:"Bawang Putih",q:2,s:"kg",h:30000,hb:null,ket:""},{b:"Minyak Wijen",q:1,s:"btl",h:41000,hb:null,ket:""},
    {b:"Ketumbar",q:1,s:"renteng",h:10000,hb:null,ket:""},{b:"Apel Manalagi",q:175,s:"kg",h:32000,hb:null,ket:""},
    {b:"Cabe Merah",q:8,s:"kg",h:45000,hb:null,ket:""},
  ]},
  {n:"Jum'at, 05 Juni 2026",od:"Kamis, 04 Juni 2026",os:"Kamis 04/06",items:[
    {b:"French Fries",q:150,s:"kg",h:30000,hb:null,ket:""},{b:"Ayam Giling",q:80,s:"kg",h:55000,hb:null,ket:""},
    {b:"Tepung Terigu Segitiga (L)",q:10,s:"kg",h:12000,hb:null,ket:""},{b:"Saos Tomat",q:3,s:"drigen",h:92000,hb:null,ket:""},
    {b:"Mayonaise",q:15,s:"kg",h:32000,hb:null,ket:""},{b:"Saos Sambal",q:1,s:"drigen",h:92000,hb:null,ket:""},
    {b:"Jagung Kupas",q:100,s:"kg",h:21000,hb:null,ket:""},{b:"Gula Putih",q:2,s:"kg",h:17500,hb:null,ket:""},
    {b:"Wortel",q:10,s:"kg",h:10000,hb:null,ket:""},{b:"Bawang Putih",q:2,s:"kg",h:30000,hb:null,ket:""},
    {b:"Bawang Merah",q:2,s:"kg",h:42000,hb:null,ket:""},{b:"Bawang Bombay",q:1,s:"kg",h:34000,hb:null,ket:""},
    {b:"Tahu",q:2400,s:"pcs",h:500,hb:null,ket:""},{b:"Kulit Pangsit (Isi 40)",q:35,s:"kg",h:12000,hb:null,ket:""},
    {b:"Tepung Maizena",q:5,s:"kg",h:18000,hb:null,ket:""},{b:"Jeruk Santang",q:180,s:"kg",h:50000,hb:null,ket:""},
    {b:"Susu UHT",q:null,s:null,h:null,hb:null,ket:""},
  ]},
]};

// ─── DATABASE OPS ────────────────────────────────────────────
async function dbSaveWeek(label){
  try {
    setLoading(true);
    if(curWeekId){
      // Update existing
      await sbPatch('weeks',`id=eq.${curWeekId}`,{data:WD,label,updated_at:new Date().toISOString()});
      await sbPatch('checklist',`week_id=eq.${curWeekId}`,{ck_data:CK});
      await sbPatch('stok',`week_id=eq.${curWeekId}`,{items:STOK});
    } else {
      // Insert new
      const rows=await sbPost('weeks',{label,data:WD});
      curWeekId=rows[0].id;
      await sbPost('checklist',{week_id:curWeekId,ck_data:CK});
      await sbPost('stok',{week_id:curWeekId,items:STOK});
    }
    saveLocal();
    setLoading(false);
    toast('✓ Tersimpan ke database!');
  } catch(e){
    setLoading(false);
    toast('⚠️ Gagal simpan: '+e.message,4000);
    console.error(e);
  }
}

async function dbLoadWeeks(){
  try {
    setLoading(true);
    const rows=await sbGet('weeks','order=updated_at.desc&limit=20');
    setLoading(false);
    return rows;
  } catch(e){
    setLoading(false);
    toast('⚠️ Gagal load histori: '+e.message,4000);
    return [];
  }
}

async function dbLoadWeek(id){
  try {
    setLoading(true);
    const [wrows,ckrows,stokrows]=await Promise.all([
      sbGet('weeks',`id=eq.${id}`),
      sbGet('checklist',`week_id=eq.${id}`),
      sbGet('stok',`week_id=eq.${id}`),
    ]);
    setLoading(false);
    return {
      week:  wrows[0]||null,
      ck:    ckrows[0]||null,
      stok:  stokrows[0]||null,
    };
  } catch(e){
    setLoading(false);
    toast('⚠️ Gagal load minggu: '+e.message,4000);
    return null;
  }
}

async function dbDeleteWeek(id){
  try {
    setLoading(true);
    await sbDelete('weeks',`id=eq.${id}`); // cascade deletes checklist & stok
    setLoading(false);
  } catch(e){
    setLoading(false);
    throw e;
  }
}

async function dbSaveSettings(){
  try {
    await sbPatch('settings','key=eq.sumber',{value:SUMBER,updated_at:new Date().toISOString()});
    saveLocal();
  } catch(e){
    // Kalau belum ada, insert
    try { await sbPost('settings',{key:'sumber',value:SUMBER}); } catch(e2){}
  }
}

async function dbLoadSettings(){
  try {
    const rows=await sbGet('settings','key=eq.sumber');
    if(rows[0]) SUMBER=rows[0].value;
  } catch(e){}
}

// ─── PROGRESS & NAV ──────────────────────────────────────────
const iid=(di,ii)=>`${di}_${ii}`;

function toggle(di,ii){ CK[iid(di,ii)]=!CK[iid(di,ii)]; saveLocal(); refreshAll(); updateNavDots(); }
function toggleGroup(ids){
  const allCk=ids.every(id=>CK[id]);
  ids.forEach(id=>{CK[id]=!allCk;});
  saveLocal(); refreshAll(); updateNavDots();
}
function refreshAll(){
  if(curTab==='input')     renderInput(false);
  if(curTab==='rekap')     renderRekap();
  if(curTab==='order-h')   renderOrderH();
  if(curTab==='checklist') renderCL();
  updateProgress();
}
function updateProgress(){
  let tot=0,dn=0;
  WD.days.forEach((d,di)=>d.items.forEach((_,ii)=>{tot++;if(CK[iid(di,ii)])dn++;}));
  const pct=tot>0?Math.round(dn/tot*100):0;
  const pf=document.getElementById('cl-prog');   if(pf)pf.style.width=pct+'%';
  const ll=document.getElementById('cl-lbl');    if(ll)ll.textContent=`${dn} / ${tot}`;
  const ring=document.getElementById('ring-fill');if(ring)ring.style.strokeDashoffset=87.96*(1-pct/100);
  const rl=document.getElementById('ring-pct');  if(rl)rl.textContent=pct+'%';
}
function updateNavDots(){
  let dn=0;
  WD.days.forEach((d,di)=>d.items.forEach((_,ii)=>{if(CK[iid(di,ii)])dn++;}));
  const el=document.getElementById('badge-cl');if(el)el.className='ntab-badge'+(dn>0?' show':'');
}
function getWeekLabel(){
  if(WD.days&&WD.days.length) return `${WD.days[0].n} – ${WD.days[WD.days.length-1].n}`;
  return 'Minggu baru';
}

// ─── IMPORT EXCEL ────────────────────────────────────────────
function triggerImport(){document.getElementById('xl-input').click();}

async function handleImport(evt){
  const file=evt.target.files[0]; if(!file) return;
  toast('⏳ Membaca file Excel...');
  try {
    const data=await file.arrayBuffer();
    const wb=XLSX.read(data,{type:'array'});
    const sheetName=wb.SheetNames.includes('Menu Harian')?'Menu Harian'
                   :wb.SheetNames.includes('Sheet1')?'Sheet1':wb.SheetNames[0];
    const ws=wb.Sheets[sheetName];
    const rows=XLSX.utils.sheet_to_json(ws,{header:1,defval:''});
    const DAY_PAT=/(senin|selasa|rabu|kamis|jum.?at|sabtu|ahad|minggu)/i;
    const SKIP_PAT=/^(menu|bahan|kebutuhan|satuan|harga|total|pagu|sisa|keterangan)/i;
    const newDays=[]; let curDay=null;
    rows.forEach(row=>{
      const a=String(row[0]||'').trim(),b=String(row[1]||'').trim();
      const c=row[2],d=String(row[3]||'').trim(),e=row[4];
      if(DAY_PAT.test(a)&&!b){
        const tglMatch=a.match(/(\d{1,2})\s+(\w+)\s+(\d{4})/);
        let od='',os='';
        if(tglMatch){
          const months={januari:0,februari:1,maret:2,april:3,mei:4,juni:5,
                        juli:6,agustus:7,september:8,oktober:9,november:10,desember:11};
          const dd=parseInt(tglMatch[1]),mm=months[tglMatch[2].toLowerCase()]??5,yy=parseInt(tglMatch[3]);
          const dt=new Date(yy,mm,dd); dt.setDate(dt.getDate()-1);
          const hn=['Ahad','Senin','Selasa','Rabu','Kamis',"Jum'at",'Sabtu'];
          const d2=String(dt.getDate()).padStart(2,'0'),m2=String(dt.getMonth()+1).padStart(2,'0');
          od=`${hn[dt.getDay()]}, ${d2} ${tglMatch[2]} ${yy}`;
          os=`${hn[dt.getDay()]} ${d2}/${m2}`;
        }
        curDay={n:a,od,os,items:[]}; newDays.push(curDay); return;
      }
      if(SKIP_PAT.test(a)||!curDay||!b) return;
      if(typeof c==='string'&&c.startsWith('=')) return;
      const qty=c!==''&&c!==null?parseFloat(String(c).replace(/[^0-9.]/g,''))||null:null;
      const harga=e!==''&&e!==null?parseFloat(String(e).replace(/[^0-9.]/g,''))||null:null;
      curDay.items.push({b:toTitle(b.trim()),q:qty,s:d||'kg',h:harga,hb:null,ket:''});
    });
    const validDays=newDays.filter(d=>d.items.length>0);
    if(!validDays.length){toast('⚠️ Tidak ada data terbaca.',4000);evt.target.value='';return;}
    WD={days:validDays}; CK={}; curWeekId=null;
    saveLocal(); renderInput(); updateNavDots();
    toast(`✓ ${validDays.length} hari diimport (${validDays.reduce((s,d)=>s+d.items.length,0)} bahan) — klik Simpan untuk ke database`,3500);
  } catch(err){
    console.error(err); toast('⚠️ Gagal membaca file.',3500);
  }
  evt.target.value='';
}

// ─── INPUT ───────────────────────────────────────────────────
function renderInput(full=true){
  if(full) document.getElementById('week-label').textContent=getWeekLabel();
  const c=document.getElementById('days-c'); c.innerHTML='';
  WD.days.forEach((day,di)=>{
    const doneN=day.items.filter((_,ii)=>CK[iid(di,ii)]).length;
    const allDone=doneN===day.items.length&&day.items.length>0;
    const el=document.createElement('div'); el.className='day-block';
    el.innerHTML=`
      <div class="day-hdr" onclick="togDay(${di})">
        <div class="day-hdr-l">${escH(day.n)}
          <span class="chip ${allDone?'green':''}" id="bdg-${di}">${doneN}/${day.items.length}</span>
        </div>
        <div class="day-hdr-r">
          <span class="order-tag">order: ${escH(day.os)}</span>
          <span class="chev" id="chv-${di}">▾</span>
        </div>
      </div>
      <div class="day-body" id="db-${di}">
        <div class="row-lbl">
          <span></span><span>Bahan</span><span>Jml</span><span>Sat</span>
          <span>Harga</span><span>H.Baru</span><span>Keterangan</span><span></span>
        </div>
        <div id="it-${di}"></div>
        <button class="btn-add" onclick="addIt(${di})">+ Tambah bahan</button>
      </div>`;
    c.appendChild(el); rItems(di);
  });
  updateProgress();
}

function togDay(di){
  const b=document.getElementById(`db-${di}`),ch=document.getElementById(`chv-${di}`);
  const open=b.style.display!=='none';
  b.style.display=open?'none':'block';
  if(ch)ch.className='chev'+(open?'':' open');
}

function sumberOptions(selected){
  return SUMBER.map(s=>`<option value="${escH(s)}" ${selected===s?'selected':''}>${escH(s)}</option>`).join('')
    + `<option value="__lain__" ${selected&&!SUMBER.includes(selected)?'selected':''}>Lainnya...</option>`;
}

function rItems(di){
  const c=document.getElementById(`it-${di}`); if(!c) return; c.innerHTML='';
  WD.days[di].items.forEach((item,ii)=>{
    const id=iid(di,ii),ck=CK[id],cfg=CC[gc(item.b)];
    const hargaAktif=item.hb||item.h;
    const total=(item.q&&hargaAktif)?item.q*hargaAktif:null;
    const row=document.createElement('div');
    row.className='item-row'+(ck?' is-ck':'');
    // Tentukan apakah ket adalah sumber standar atau lainnya
    const isCustom=item.ket&&!SUMBER.includes(item.ket);
    row.innerHTML=`
      <div class="chk ${ck?'on':''}" onclick="toggle(${di},${ii})">${ck?'✓':''}</div>
      <input type="text" class="inp-bahan" value="${escH(item.b)}" placeholder="Nama bahan"
        onblur="upItBlur(${di},${ii},'b',this.value)" oninput="upIt(${di},${ii},'b',this.value)">
      <input type="text" class="inp-num" value="${item.q?fNum(item.q):''}" placeholder="0"
        onblur="upItNum(${di},${ii},'q',this.value)" onfocus="this.value=this.value.replace(/\\./g,'')">
      <input type="text" class="inp-sat" value="${escH(item.s||'')}" placeholder="kg"
        oninput="upIt(${di},${ii},'s',this.value)">
      <input type="text" class="inp-num inp-harga" value="${item.h?fNum(item.h):''}" placeholder="0"
        onblur="upItNum(${di},${ii},'h',this.value)" onfocus="this.value=this.value.replace(/\\./g,'')">
      <input type="text" class="inp-num inp-hbaru ${item.hb?'changed':''}" value="${item.hb?fNum(item.hb):''}" placeholder="—"
        onblur="upItNum(${di},${ii},'hb',this.value)" onfocus="this.value=this.value.replace(/\\./g,'')">
      <div class="ket-wrap" id="ketwrap-${di}-${ii}">
        <select class="inp-ket-sel" onchange="ketChange(${di},${ii},this.value)">
          <option value="">— pilih —</option>
          ${sumberOptions(isCustom?'__lain__':item.ket)}
        </select>
        ${isCustom?`<input type="text" class="inp-ket-custom" value="${escH(item.ket)}" placeholder="nama dapur..."
          oninput="upIt(${di},${ii},'ket',this.value)" onblur="saveLocal()">`:
          `<input type="text" class="inp-ket-custom" style="display:none" placeholder="nama dapur..."
          oninput="upIt(${di},${ii},'ket',this.value)">`}
      </div>
      <button class="btn-x" onclick="rmIt(${di},${ii})">✕</button>`;
    c.appendChild(row);

    // Subtotal row
    const sub=document.createElement('div');
    sub.className='item-subtotal'+(ck?' is-ck':'');
    sub.innerHTML=`<span class="cat-tag"><span>${cfg.e}</span><span>${cfg.l}</span></span>
      ${total?`<span class="subtotal-val">= Rp ${fNum(total)}</span>`:''}
      ${item.hb?'<span class="hbaru-badge">harga diubah</span>':''}
      ${item.ket&&item.ket!=='Beli Sendiri'?`<span class="ket-badge">${escH(item.ket)}</span>`:''}`;
    c.appendChild(sub);
  });
}

function ketChange(di,ii,val){
  if(val==='__lain__'){
    WD.days[di].items[ii].ket='';
    saveLocal(); rItems(di);
    // Focus ke input custom
    setTimeout(()=>{
      const w=document.getElementById(`ketwrap-${di}-${ii}`);
      if(w){const inp=w.querySelector('.inp-ket-custom');if(inp){inp.style.display='';inp.focus();}}
    },50);
  } else {
    WD.days[di].items[ii].ket=val; saveLocal(); rItems(di);
  }
}

function upIt(di,ii,f,v){ WD.days[di].items[ii][f]=v; saveLocal(); }
function upItBlur(di,ii,f,v){
  WD.days[di].items[ii][f]=toTitle(v); saveLocal(); rItems(di);
}
function upItNum(di,ii,f,v){
  const clean=String(v).replace(/\./g,'').replace(/[^0-9]/g,'');
  WD.days[di].items[ii][f]=clean?parseInt(clean):null;
  saveLocal(); rItems(di);
}
function addIt(di){ WD.days[di].items.push({b:'',q:null,s:'kg',h:null,hb:null,ket:''}); saveLocal(); renderInput(false); }
function rmIt(di,ii){ WD.days[di].items.splice(ii,1); delete CK[iid(di,ii)]; saveLocal(); renderInput(false); }

async function saveW(){
  const label=getWeekLabel();
  await dbSaveWeek(label);
  rHist();
  const btn=document.getElementById('btn-sv'),orig=btn.innerHTML;
  btn.innerHTML='✓ Tersimpan!';
  setTimeout(()=>{btn.innerHTML=orig;},2000);
}

// ─── REKAP ───────────────────────────────────────────────────
function renderRekap(){
  WD.days.forEach((d,i)=>{const el=document.getElementById(`rh${i}`);if(el)el.textContent=d.n.split(',')[0];});
  const map={};
  WD.days.forEach((day,di)=>day.items.forEach((item,ii)=>{
    if(!item.b) return;
    const k=item.b.toLowerCase().trim();
    if(!map[k]) map[k]={d:item.b,s:item.s,cat:gc(item.b),pd:{},ids:[]};
    map[k].ids.push(iid(di,ii));
    if(item.q) map[k].pd[day.n]=(map[k].pd[day.n]||0)+item.q;
  }));
  const multi=Object.values(map).filter(v=>Object.keys(v.pd).length>=2);
  document.getElementById('rekap-c').textContent=`${multi.length} bahan`;
  const tb=document.getElementById('rekap-tb'); tb.innerHTML='';
  if(!multi.length){tb.innerHTML=`<tr><td colspan="8" style="text-align:center;padding:2rem;color:var(--text3)">Tidak ada bahan yang dipakai lebih dari 1 hari.</td></tr>`;return;}
  multi.sort((a,b)=>CO.indexOf(a.cat)-CO.indexOf(b.cat)||a.d.localeCompare(b.d));
  let curC=null;
  multi.forEach(item=>{
    if(item.cat!==curC){
      curC=item.cat;const cfg=CC[curC];
      const tr=document.createElement('tr');tr.className='cat-row';
      tr.innerHTML=`<td colspan="8">${cfg.e} ${cfg.l}</td>`;tb.appendChild(tr);
    }
    const allCk=item.ids.every(id=>CK[id]);
    const tr=document.createElement('tr');if(allCk)tr.className='ck-row';
    let tot=0;
    const cells=WD.days.map(d=>{const v=item.pd[d.n];if(v){tot+=v;return`<td class="nv">${fNum(v)}</td>`;}return`<td class="nd">—</td>`;}).join('');
    const idsStr=JSON.stringify(item.ids).replace(/"/g,"'");
    tr.innerHTML=`<td style="text-align:center"><div class="chk-sm ${allCk?'on':''}" onclick="toggleGroup(${idsStr})">${allCk?'✓':''}</div></td>
      <td style="font-weight:500">${escH(item.d)}</td>
      <td style="text-align:center;color:var(--text3);font-size:10px">${escH(item.s||'')}</td>
      ${cells}<td class="nv" style="font-weight:600">${fNum(tot)}</td>`;
    tb.appendChild(tr);
  });
}

// ─── ORDER GROUPS ────────────────────────────────────────────
function buildOG(){
  const G={},seq=[];
  WD.days.forEach((day,di)=>{
    const k=day.os;
    if(!G[k]){G[k]={label:day.od,short:k,menu:day.n,cats:{}};seq.push(k);}
    day.items.forEach((item,ii)=>{
      if(!item.b) return;
      const cat=gc(item.b);
      if(!G[k].cats[cat]) G[k].cats[cat]=[];
      const ex=G[k].cats[cat].find(i=>i.b.toLowerCase()===item.b.toLowerCase());
      if(ex){if(item.q)ex.q=(ex.q||0)+item.q;ex.ids.push(iid(di,ii));}
      else G[k].cats[cat].push({...item,ids:[iid(di,ii)]});
    });
  });
  return{G,seq};
}

// ─── PESAN ORDER ─────────────────────────────────────────────
function renderOrderH(){
  const{G,seq}=buildOG();
  const cont=document.getElementById('order-h-c');cont.innerHTML='';
  seq.forEach(key=>{
    const grp=G[key];const block=document.createElement('div');block.className='msg-block';
    const sortedCats=Object.keys(grp.cats).sort((a,b)=>CO.indexOf(a)-CO.indexOf(b));
    let lines=[grp.short,''],bHtml='';
    sortedCats.forEach(cat=>{
      const cfg=CC[cat],items=grp.cats[cat];
      lines.push(`${cfg.e} ${cfg.l}`);
      bHtml+=`<div class="msg-cat"><div class="msg-cat-lbl">${cfg.e} ${cfg.l}</div>`;
      items.forEach(item=>{
        const ck=item.ids.every(id=>CK[id]);
        const line=item.q?`- ${item.b} ${fNum(item.q)} ${item.s||''}`:`- ${item.b}`;
        lines.push(line);
        const idsStr=JSON.stringify(item.ids).replace(/"/g,"'");
        bHtml+=`<div class="msg-row ${ck?'ck':''}" onclick="toggleGroup(${idsStr})">
          <div class="chk-sm ${ck?'on':''}">${ck?'✓':''}</div>
          <span class="pill" style="background:${cfg.b};color:${cfg.c}">${cfg.e} ${cfg.l}</span>
          <span>${escH(item.b)}</span>
          <span class="q">${item.q?fNum(item.q)+' '+(item.s||''):''}</span>
        </div>`;
      });
      bHtml+='</div>';
    });
    const txt=lines.join('\n'),enc=encodeURIComponent(txt);
    block.innerHTML=`<div class="msg-hdr"><div class="msg-hdr-l">◎ Order ${escH(grp.label)}</div>
      <span class="msg-for">untuk ${escH(grp.menu)}</span></div>
      <div class="msg-body">${bHtml}
        <div class="msg-pre" onclick="copyT(this,'${enc}')">${txt}</div>
        <div class="copy-hint">↑ klik untuk copy pesan</div>
      </div>`;
    cont.appendChild(block);
  });
}
function copyT(el,enc){
  navigator.clipboard.writeText(decodeURIComponent(enc)).then(()=>{
    el.style.borderColor='rgba(74,222,128,.5)';el.style.color='#4ade80';
    toast('✓ Pesan dicopy!');setTimeout(()=>{el.style.borderColor='';el.style.color='';},1500);
  }).catch(()=>toast('Gagal copy.'));
}

// ─── CHECKLIST ───────────────────────────────────────────────
function renderCL(){
  const{G,seq}=buildOG();const cont=document.getElementById('cl-c');cont.innerHTML='';
  seq.forEach(key=>{
    const grp=G[key];const block=document.createElement('div');block.className='order-day';
    const sc=Object.keys(grp.cats).sort((a,b)=>CO.indexOf(a)-CO.indexOf(b));
    let items=[];sc.forEach(cat=>grp.cats[cat].forEach(item=>items.push({...item,cat})));
    const dN=items.filter(item=>item.ids.every(id=>CK[id])).length;
    const isAll=dN===items.length&&items.length>0;
    block.innerHTML=`<div class="od-title">◎ Order ${escH(grp.label)} — untuk ${escH(grp.menu)}
      <span class="chip ${isAll?'green':''}" style="margin-left:auto">${dN}/${items.length}</span></div>`;
    items.forEach(item=>{
      const ck=item.ids.every(id=>CK[id]),cfg=CC[item.cat];
      const row=document.createElement('div');row.className='oi'+(ck?' ck':'');
      row.onclick=()=>{toggleGroup(item.ids);};
      row.innerHTML=`<div class="chk-sm ${ck?'on':''}">${ck?'✓':''}</div>
        <span class="pill" style="background:${cfg.b};color:${cfg.c}">${cfg.e} ${cfg.l}</span>
        <span>${escH(item.b)}</span>
        <span class="q">${item.q?fNum(item.q)+' '+(item.s||''):''}</span>
        ${item.ket?`<span class="ket-badge" style="margin-left:4px">${escH(item.ket)}</span>`:''}`;
      block.appendChild(row);
    });
    cont.appendChild(block);
  });
  updateProgress();
}

// ─── STOK SISA ───────────────────────────────────────────────
// item: { b, qdapur, qkoperasi, s }
function renderStok(){
  const cont=document.getElementById('stok-c');cont.innerHTML='';
  cont.innerHTML=`
    <div class="stok-header-row">
      <span>Bahan</span><span>Sat</span>
      <span style="text-align:center">🏠 Dapur</span>
      <span style="text-align:center">🏪 Koperasi</span>
      <span></span>
    </div>
    <div id="stok-items"></div>
    <button class="btn-add" onclick="addStok()">+ Tambah stok</button>`;
  const si=document.getElementById('stok-items');
  if(!STOK.length){
    si.innerHTML='<div class="empty-state" style="padding:1rem 0;font-size:12px">Belum ada stok sisa. Klik + untuk tambah.</div>';
  }
  STOK.forEach((item,i)=>{
    const row=document.createElement('div');row.className='stok-row';
    row.innerHTML=`
      <input type="text" value="${escH(item.b)}" placeholder="Nama bahan" class="inp-bahan"
        onblur="upStokBlur(${i},'b',this.value)" oninput="upStok(${i},'b',this.value)">
      <input type="text" value="${escH(item.s||'')}" placeholder="kg" class="inp-sat"
        oninput="upStok(${i},'s',this.value)">
      <input type="text" class="inp-num" value="${item.qdapur!=null?fNum(item.qdapur):''}" placeholder="0"
        onblur="upStokNum(${i},'qdapur',this.value)" onfocus="this.value=this.value.replace(/\\./g,'')"
        style="text-align:center">
      <input type="text" class="inp-num" value="${item.qkoperasi!=null?fNum(item.qkoperasi):''}" placeholder="0"
        onblur="upStokNum(${i},'qkoperasi',this.value)" onfocus="this.value=this.value.replace(/\\./g,'')"
        style="text-align:center">
      <button class="btn-x" onclick="rmStok(${i})">✕</button>`;
    si.appendChild(row);
  });
}
function addStok(){STOK.push({b:'',s:'kg',qdapur:null,qkoperasi:null});saveLocal();renderStok();}
function rmStok(i){STOK.splice(i,1);saveLocal();renderStok();}
function upStok(i,f,v){STOK[i][f]=v;saveLocal();}
function upStokBlur(i,f,v){STOK[i][f]=toTitle(v);saveLocal();renderStok();}
function upStokNum(i,f,v){
  const clean=String(v).replace(/\./g,'').replace(/[^0-9]/g,'');
  STOK[i][f]=clean?parseInt(clean):null;saveLocal();renderStok();
}

// ─── HISTORI (dari Supabase) ──────────────────────────────────
async function rHist(){
  const c=document.getElementById('hist-c');
  c.innerHTML='<div class="empty-state">Memuat histori...</div>';
  const rows=await dbLoadWeeks();
  if(!rows.length){c.innerHTML='<div class="empty-state">Belum ada histori tersimpan.</div>';return;}
  c.innerHTML='';
  rows.forEach(row=>{
    const el=document.createElement('div');el.className='hist-row';
    const saved=new Date(row.updated_at).toLocaleDateString('id-ID',{day:'2-digit',month:'short',year:'numeric'});
    el.innerHTML=`
      <div>
        <div class="hist-title">${escH(row.label)}</div>
        <div class="hist-sub">Disimpan ${saved}</div>
      </div>
      <div class="hist-actions">
        <button class="hist-btn" onclick="loadH('${row.id}')">↖ Lihat</button>
        <button class="hist-btn" onclick="dupH('${row.id}')">⊕ Duplikat</button>
        <button class="hist-btn del" onclick="delH('${row.id}','${escH(row.label)}')">✕ Hapus</button>
      </div>`;
    c.appendChild(el);
  });
}

async function loadH(id){
  const res=await dbLoadWeek(id);if(!res||!res.week) return;
  WD=res.week.data; CK=res.ck?.ck_data||{}; STOK=res.stok?.items||[];
  curWeekId=id; saveLocal(); go('input'); renderInput();
  toast('✓ Minggu dimuat dari database');
}
async function dupH(id){
  const res=await dbLoadWeek(id);if(!res||!res.week) return;
  WD=JSON.parse(JSON.stringify(res.week.data));
  CK={}; STOK=[]; curWeekId=null;
  saveLocal(); go('input'); renderInput();
  toast('Duplikat berhasil — edit & simpan sebagai minggu baru');
}
async function dupFirst(){
  const rows=await dbLoadWeeks();
  if(!rows.length){toast('Belum ada histori.');return;}
  await dupH(rows[0].id);
}
async function delH(id,label){
  if(!confirm(`Hapus histori "${label}"?`)) return;
  try {
    await dbDeleteWeek(id);
    if(curWeekId===id){curWeekId=null;saveLocal();}
    rHist(); toast('🗑️ Histori dihapus.');
  } catch(e){ toast('⚠️ Gagal hapus: '+e.message,4000); }
}

// ─── SETTINGS ────────────────────────────────────────────────
function renderSettings(){
  const c=document.getElementById('settings-c');if(!c)return;
  c.innerHTML=`
    <div class="sec-head"><h2 class="sec-title">Tema Warna</h2></div>
    <div class="theme-grid">
      ${Object.entries(THEMES).map(([k,t])=>`
        <button class="theme-pill ${curTheme===k?'active':''}" data-theme="${k}" onclick="applyTheme('${k}')">
          <span class="theme-swatch" style="background:${t.accent}"></span>${t.name}
        </button>`).join('')}
    </div>
    <div class="sec-head" style="margin-top:1.5rem"><h2 class="sec-title">Kelola Sumber Keterangan</h2></div>
    <div class="hint-text" style="margin-bottom:.75rem">Daftar pilihan di dropdown keterangan input bahan</div>
    <div id="sumber-list"></div>
    <button class="btn-add" onclick="addSumber()">+ Tambah sumber</button>`;
  renderSumberList();
}

function renderSumberList(){
  const c=document.getElementById('sumber-list');if(!c)return;
  c.innerHTML='';
  SUMBER.forEach((s,i)=>{
    const row=document.createElement('div');row.className='sumber-row';
    row.innerHTML=`
      <input type="text" value="${escH(s)}" placeholder="Nama sumber"
        onblur="upSumber(${i},this.value)" class="inp-bahan">
      <button class="btn-x" onclick="delSumber(${i})">✕</button>`;
    c.appendChild(row);
  });
}
function upSumber(i,v){SUMBER[i]=v;dbSaveSettings();}
function delSumber(i){if(SUMBER.length<=1){toast('Minimal 1 sumber.');return;}SUMBER.splice(i,1);dbSaveSettings();renderSettings();}
function addSumber(){SUMBER.push('');dbSaveSettings();renderSettings();
  setTimeout(()=>{const inputs=document.querySelectorAll('#sumber-list .inp-bahan');if(inputs.length)inputs[inputs.length-1].focus();},50);}

// ─── TABS ────────────────────────────────────────────────────
const TABS=['input','rekap','order-h','checklist','stok','histori','settings'];
function go(name){
  curTab=name;
  TABS.forEach(t=>{const el=document.getElementById(`s-${t}`);if(el)el.classList.remove('active');});
  document.querySelectorAll('.ntab').forEach(b=>{b.classList.remove('active');b.setAttribute('aria-selected','false');});
  const sel=document.getElementById(`s-${name}`);if(sel)sel.classList.add('active');
  const idx=TABS.indexOf(name);
  const tabs=document.querySelectorAll('.ntab');
  if(tabs[idx]){tabs[idx].classList.add('active');tabs[idx].setAttribute('aria-selected','true');}
  if(name==='input')     renderInput(false);
  if(name==='rekap')     renderRekap();
  if(name==='order-h')   renderOrderH();
  if(name==='checklist') renderCL();
  if(name==='stok')      renderStok();
  if(name==='histori')   rHist();
  if(name==='settings')  renderSettings();
}

// ─── INIT ────────────────────────────────────────────────────
loadLocal();
dbLoadSettings().then(()=>{ renderSettings && curTab==='settings' && renderSettings(); });
document.getElementById('week-label').textContent=getWeekLabel();
renderInput();
updateNavDots();
