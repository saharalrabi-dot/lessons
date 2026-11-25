/* رحلتي نحو الالتزام 🌷 — كل البيانات تُحفظ على هذا الجهاز فقط (localStorage) */
'use strict';
(() => {

/* ================= ثوابت ================= */
const KEY = 'rehlati.v1';
const PREV_KEY = 'rehlati.v1.beforeImport';

const PRAYERS = [
  { id: 'fajr', name: 'الفجر' },
  { id: 'dhuhr', name: 'الظهر' },
  { id: 'asr', name: 'العصر' },
  { id: 'maghrib', name: 'المغرب' },
  { id: 'isha', name: 'العشاء' },
];

// السنن الرواتب الثابتة: 2 قبل الفجر، 4 قبل الظهر و2 بعده، 2 بعد المغرب، 2 بعد العشاء (لا راتبة للعصر)
const SUNNAH = [
  { id: 'fajr_q',    prayer: 'fajr',    kind: 'قبلية', rakat: 'ركعتان' },
  { id: 'dhuhr_q',   prayer: 'dhuhr',   kind: 'قبلية', rakat: 'أربع ركعات' },
  { id: 'dhuhr_b',   prayer: 'dhuhr',   kind: 'بعدية', rakat: 'ركعتان' },
  { id: 'maghrib_b', prayer: 'maghrib', kind: 'بعدية', rakat: 'ركعتان' },
  { id: 'isha_b',    prayer: 'isha',    kind: 'بعدية', rakat: 'ركعتان' },
];
const SUNNAH_NAME = {
  fajr_q: 'سنة الفجر', dhuhr_q: 'سنة الظهر القبلية', dhuhr_b: 'سنة الظهر البعدية',
  maghrib_b: 'سنة المغرب', isha_b: 'سنة العشاء',
};

const ICONS = {
  sunnah: '<svg viewBox="0 0 24 24"><path d="M19.5 14.6A8 8 0 1 1 9.4 4.5a6.4 6.4 0 0 0 10.1 10.1z"/><path d="M17 4.5l.6 1.4 1.4.6-1.4.6-.6 1.4-.6-1.4-1.4-.6 1.4-.6z"/></svg>',
  dishes: '<svg viewBox="0 0 24 24"><circle cx="11" cy="13" r="7.5"/><circle cx="11" cy="13" r="4"/><path d="M19 3.5l.5 1.3 1.3.5-1.3.5-.5 1.3-.5-1.3-1.3-.5 1.3-.5z"/></svg>',
  quran: '<svg viewBox="0 0 24 24"><path d="M12 6.5C10 5 7 4.5 3.5 5v13.5c3.5-.5 6.5 0 8.5 1.5 2-1.5 5-2 8.5-1.5V5C17 4.5 14 5 12 6.5z"/><path d="M12 6.5V20"/></svg>',
  tidy: '<svg viewBox="0 0 24 24"><path d="M3.5 9.5h17l-1.6 9.6a1.8 1.8 0 0 1-1.8 1.4H6.9a1.8 1.8 0 0 1-1.8-1.4z"/><path d="M8 9.5 10.2 4M16 9.5 13.8 4M9 13.5v3.5M15 13.5v3.5M12 13.5v3.5"/></svg>',
  check: '<svg viewBox="0 0 24 24"><path d="M5 12.5l4.5 4.5L19 7.5"/></svg>',
  gear: '<svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.7 1.7 0 0 0 .3 1.8l.1.1a2 2 0 1 1-2.8 2.8l-.1-.1a1.7 1.7 0 0 0-1.8-.3 1.7 1.7 0 0 0-1 1.5V21a2 2 0 1 1-4 0v-.1a1.7 1.7 0 0 0-1.1-1.5 1.7 1.7 0 0 0-1.8.3l-.1.1a2 2 0 1 1-2.8-2.8l.1-.1a1.7 1.7 0 0 0 .3-1.8 1.7 1.7 0 0 0-1.5-1H3a2 2 0 1 1 0-4h.1a1.7 1.7 0 0 0 1.5-1.1 1.7 1.7 0 0 0-.3-1.8l-.1-.1a2 2 0 1 1 2.8-2.8l.1.1a1.7 1.7 0 0 0 1.8.3H9a1.7 1.7 0 0 0 1-1.5V3a2 2 0 1 1 4 0v.1a1.7 1.7 0 0 0 1 1.5 1.7 1.7 0 0 0 1.8-.3l.1-.1a2 2 0 1 1 2.8 2.8l-.1.1a1.7 1.7 0 0 0-.3 1.8V9a1.7 1.7 0 0 0 1.5 1H21a2 2 0 1 1 0 4h-.1a1.7 1.7 0 0 0-1.5 1z"/></svg>',
  right: '<svg viewBox="0 0 24 24"><path d="M9 6l6 6-6 6"/></svg>',
  left: '<svg viewBox="0 0 24 24"><path d="M15 6l-6 6 6 6"/></svg>',
  bell: '<svg viewBox="0 0 24 24"><path d="M6 16V11a6 6 0 1 1 12 0v5l1.5 2h-15z"/><path d="M10 20.5a2 2 0 0 0 4 0"/></svg>',
  mosque: '<svg viewBox="0 0 24 24"><path d="M12 3.5c-3 2-5 3.8-5 6.5h10c0-2.7-2-4.5-5-6.5zM5 10h14v10H5zM10 20v-4a2 2 0 0 1 4 0v4M3 20h18"/></svg>',
  download: '<svg viewBox="0 0 24 24"><path d="M12 4v11M7 10.5l5 5 5-5M5 20h14"/></svg>',
  upload: '<svg viewBox="0 0 24 24"><path d="M12 20V9M7 13.5l5-5 5 5M5 4h14"/></svg>',
  pin: '<svg viewBox="0 0 24 24"><path d="M12 21s-6.5-6-6.5-11a6.5 6.5 0 0 1 13 0c0 5-6.5 11-6.5 11z"/><circle cx="12" cy="10" r="2.3"/></svg>',
  cal: '<svg viewBox="0 0 24 24"><rect x="4" y="5.5" width="16" height="15" rx="3"/><path d="M4 10h16M8.5 3.5v4M15.5 3.5v4"/></svg>',
};

const HABITS = [
  { id: 'sunnah', name: 'السنن الرواتب', hint: '12 ركعة في اليوم والليلة', units: 5 },
  { id: 'dishes', name: 'تنظيف المواعين', hint: 'بعد وجبة الغداء', units: 1 },
  { id: 'quran',  name: 'قراءة صفحة من القرآن', hint: 'الهدف: صفحة واحدة يوميًا', units: 1 },
  { id: 'tidy',   name: 'إعادة الأشياء إلى مكانها', hint: 'لمسة ترتيب مسائية', units: 1 },
];
const HABIT = Object.fromEntries(HABITS.map(h => [h.id, h]));
const TOTAL_ITEMS = 8; // 5 سنن + 3 عادات

const REM = {
  p_fajr:    { prayer: 'fajr',    unit: 'fajr_q',    name: 'سنة الفجر (قبلية)', title: 'سنة الفجر 🌙', body: 'ركعتا الفجر خيرٌ من الدنيا وما فيها', offset: 0 },
  p_dhuhr_q: { prayer: 'dhuhr',   unit: 'dhuhr_q',   name: 'سنة الظهر القبلية', title: 'سنة الظهر القبلية ☀️', body: 'أربع ركعات قبل صلاة الظهر', offset: 0 },
  p_dhuhr_b: { prayer: 'dhuhr',   unit: 'dhuhr_b',   name: 'سنة الظهر البعدية', title: 'سنة الظهر البعدية ☀️', body: 'ركعتان بعد صلاة الظهر', offset: 25 },
  p_maghrib: { prayer: 'maghrib', unit: 'maghrib_b', name: 'سنة المغرب (بعدية)', title: 'سنة المغرب 🌅', body: 'ركعتان بعد صلاة المغرب', offset: 15 },
  p_isha:    { prayer: 'isha',    unit: 'isha_b',    name: 'سنة العشاء (بعدية)', title: 'سنة العشاء ✨', body: 'ركعتان بعد صلاة العشاء', offset: 25 },
  dishes:    { habit: 'dishes', name: 'تنظيف المواعين', title: 'وقت المواعين 🫧', body: 'بعد الغداء… دقائق قليلة ومطبخ مرتب', time: '14:30' },
  quran:     { habit: 'quran',  name: 'صفحة من القرآن', title: 'صفحتك من القرآن 📖', body: 'صفحة واحدة تكفي لتنير يومك', time: '21:00' },
  tidy:      { habit: 'tidy',   name: 'الترتيب المسائي', title: 'لمسة ترتيب مسائية 🧺', body: 'إعادة الأشياء إلى أماكنها… وبيت هادئ للغد', time: '20:30' },
};
const REM_WINDOW_MIN = 45; // لا نرسل تذكيرًا متأخرًا أكثر من 45 دقيقة عن موعده

const CITIES = [
  ['الرياض', 24.7136, 46.6753], ['مكة المكرمة', 21.3891, 39.8579], ['المدينة المنورة', 24.5247, 39.5692],
  ['جدة', 21.4858, 39.1925], ['الدمام', 26.4207, 50.0888], ['الخبر', 26.2172, 50.1971],
  ['الأحساء', 25.3830, 49.5866], ['الجبيل', 27.0174, 49.6225], ['الطائف', 21.2703, 40.4158],
  ['أبها', 18.2164, 42.5053], ['خميس مشيط', 18.3000, 42.7333], ['تبوك', 28.3838, 36.5550],
  ['بريدة', 26.3260, 43.9750], ['عنيزة', 26.0840, 43.9940], ['حائل', 27.5114, 41.7208],
  ['جازان', 16.8892, 42.5511], ['نجران', 17.4924, 44.1277], ['ينبع', 24.0895, 38.0618],
  ['الباحة', 20.0129, 41.4677], ['سكاكا', 29.9697, 40.2064], ['عرعر', 30.9753, 41.0381],
  ['الكويت', 29.3759, 47.9774], ['المنامة', 26.2285, 50.5860], ['الدوحة', 25.2854, 51.5310],
  ['أبوظبي', 24.4539, 54.3773], ['دبي', 25.2048, 55.2708], ['مسقط', 23.5880, 58.3829],
  ['عمّان', 31.9454, 35.9284], ['القاهرة', 30.0444, 31.2357],
];

const METHODS = {
  umm_alqura: { name: 'أم القرى (السعودية)', fajr: 18.5, isha: { min: 90 }, ramadan: true },
  mwl:        { name: 'رابطة العالم الإسلامي', fajr: 18, isha: 17 },
  egypt:      { name: 'الهيئة المصرية العامة للمساحة', fajr: 19.5, isha: 17.5 },
  kuwait:     { name: 'الكويت', fajr: 18, isha: 17.5 },
  qatar:      { name: 'قطر', fajr: 18, isha: { min: 90 } },
  gulf:       { name: 'الخليج (الإمارات)', fajr: 19.5, isha: { min: 90 } },
  isna:       { name: 'أمريكا الشمالية (ISNA)', fajr: 15, isha: 15 },
};

/* ================= أدوات التاريخ ================= */
const pad = n => String(n).padStart(2, '0');
const keyOf = d => `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
const parseKey = k => { const [y, m, d] = k.split('-').map(Number); return new Date(y, m - 1, d); };
const addDays = (k, n) => { const d = parseKey(k); d.setDate(d.getDate() + n); return keyOf(d); };
const todayKey = () => keyOf(new Date());
const daysBetween = (a, b) => Math.round((parseKey(b) - parseKey(a)) / 864e5);
const isKey = k => typeof k === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(k);

const L = 'ar-u-nu-latn';
const F = {
  full: new Intl.DateTimeFormat(L, { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' }),
  dm: new Intl.DateTimeFormat(L, { weekday: 'long', day: 'numeric', month: 'long' }),
  short: new Intl.DateTimeFormat(L, { day: 'numeric', month: 'short' }),
  month: new Intl.DateTimeFormat(L, { month: 'long', year: 'numeric' }),
  monthOnly: new Intl.DateTimeFormat(L, { month: 'short' }),
  time: new Intl.DateTimeFormat(L, { hour: 'numeric', minute: '2-digit' }),
};
let HIJRI = null, HIJRI_MONTH = null;
try {
  HIJRI = new Intl.DateTimeFormat('ar-SA-u-ca-islamic-umalqura-nu-latn', { day: 'numeric', month: 'long', year: 'numeric' });
  HIJRI_MONTH = new Intl.DateTimeFormat('en-u-ca-islamic-umalqura-nu-latn', { month: 'numeric' });
} catch (e) { /* المتصفح لا يدعم التقويم الهجري */ }
const hijri = d => { try { return HIJRI ? HIJRI.format(d) : ''; } catch (e) { return ''; } };
const fmtHM = hm => { const [h, m] = hm.split(':').map(Number); return F.time.format(new Date(2000, 0, 1, h, m)); };
const esc = s => String(s).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));

/* ================= حساب أوقات الصلاة (خوارزمية PrayTimes) ================= */
const PT = (() => {
  const dtr = d => d * Math.PI / 180, rtd = r => r * 180 / Math.PI;
  const sin = d => Math.sin(dtr(d)), cos = d => Math.cos(dtr(d)), tan = d => Math.tan(dtr(d));
  const arcsin = x => rtd(Math.asin(x)), arccos = x => rtd(Math.acos(Math.max(-1, Math.min(1, x))));
  const arctan2 = (y, x) => rtd(Math.atan2(y, x)), arccot = x => rtd(Math.atan(1 / x));
  const fix = (a, b) => { a = a - b * Math.floor(a / b); return a < 0 ? a + b : a; };
  const fixAngle = a => fix(a, 360), fixHour = a => fix(a, 24);
  function julian(y, m, d) {
    if (m <= 2) { y -= 1; m += 12; }
    const A = Math.floor(y / 100), B = 2 - A + Math.floor(A / 4);
    return Math.floor(365.25 * (y + 4716)) + Math.floor(30.6001 * (m + 1)) + d + B - 1524.5;
  }
  function sunPos(jd) {
    const D = jd - 2451545.0;
    const g = fixAngle(357.529 + 0.98560028 * D);
    const q = fixAngle(280.459 + 0.98564736 * D);
    const Lm = fixAngle(q + 1.915 * sin(g) + 0.020 * sin(2 * g));
    const e = 23.439 - 0.00000036 * D;
    const RA = arctan2(cos(e) * sin(Lm), cos(Lm)) / 15;
    return { decl: arcsin(sin(e) * sin(Lm)), eqt: q / 15 - fixHour(RA) };
  }
  function isRamadan(date) {
    try { return HIJRI_MONTH && Number(HIJRI_MONTH.format(date)) === 9; } catch (e) { return false; }
  }
  function compute(date, lat, lng, methodId) {
    const M = METHODS[methodId] || METHODS.umm_alqura;
    const y = date.getFullYear(), mo = date.getMonth() + 1, d = date.getDate();
    const tz = -new Date(y, mo - 1, d, 12).getTimezoneOffset() / 60;
    const jDate = julian(y, mo, d) - lng / (15 * 24);
    const sp = t => sunPos(jDate + t);
    const midDay = t => fixHour(12 - sp(t).eqt);
    const angleTime = (angle, t, ccw) => {
      const decl = sp(t).decl, noon = midDay(t);
      const T = arccos((-sin(angle) - sin(decl) * sin(lat)) / (cos(decl) * cos(lat))) / 15;
      return noon + (ccw ? -T : T);
    };
    const asrTime = (f, t) => { const decl = sp(t).decl; return angleTime(-arccot(f + tan(Math.abs(lat - decl))), t); };
    let g = { fajr: 5, sunrise: 6, dhuhr: 12, asr: 13, sunset: 18, isha: 18 };
    for (let i = 0; i < 2; i++) {
      const p = h => h / 24;
      g = {
        fajr: angleTime(M.fajr, p(g.fajr), true),
        sunrise: angleTime(0.833, p(g.sunrise), true),
        dhuhr: midDay(p(g.dhuhr)),
        asr: asrTime(1, p(g.asr)),
        sunset: angleTime(0.833, p(g.sunset)),
        isha: typeof M.isha === 'number' ? angleTime(M.isha, p(g.isha)) : g.isha,
      };
    }
    const adj = tz - lng / 15;
    const h = {};
    for (const k in g) h[k] = g[k] + adj;
    h.maghrib = h.sunset;
    if (typeof M.isha !== 'number') {
      const min = (M.ramadan && isRamadan(date)) ? 120 : M.isha.min;
      h.isha = h.maghrib + min / 60;
    }
    const toDate = hh => new Date(y, mo - 1, d, 0, Math.round(hh * 60));
    const out = {};
    for (const k of ['fajr', 'sunrise', 'dhuhr', 'asr', 'maghrib', 'isha']) out[k] = isFinite(h[k]) ? toDate(h[k]) : null;
    return out;
  }
  return { compute };
})();

/* ================= الحالة والحفظ ================= */
function defaultReminders() {
  const r = {};
  for (const id in REM) r[id] = REM[id].prayer ? { on: true, offset: REM[id].offset } : { on: true, time: REM[id].time };
  return r;
}
function defaultState() {
  const t = todayKey();
  return {
    app: 'rehlati', version: 1, createdAt: new Date().toISOString(),
    startDate: t, activeDate: t, days: {}, fired: {}, lastBackup: null, onboarded: false,
    settings: { location: null, method: 'umm_alqura', reminders: defaultReminders() },
  };
}
function normalize(s) {
  const d = defaultState();
  if (!s || typeof s !== 'object') return d;
  const out = Object.assign({}, d, s);
  out.settings = Object.assign({}, d.settings, s.settings || {});
  const rem = {};
  for (const id in REM) rem[id] = Object.assign({}, d.settings.reminders[id], (s.settings && s.settings.reminders && s.settings.reminders[id]) || {});
  out.settings.reminders = rem;
  if (!METHODS[out.settings.method]) out.settings.method = 'umm_alqura';
  out.days = (s.days && typeof s.days === 'object') ? s.days : {};
  out.fired = (s.fired && typeof s.fired === 'object') ? s.fired : {};
  if (!isKey(out.startDate)) out.startDate = d.startDate;
  if (!isKey(out.activeDate) || out.activeDate > todayKey()) out.activeDate = todayKey();
  return out;
}

let storageOK = true;
function load() {
  try {
    const raw = localStorage.getItem(KEY);
    if (raw) return normalize(JSON.parse(raw));
  } catch (e) { storageOK = false; }
  return defaultState();
}
function save() {
  try { localStorage.setItem(KEY, JSON.stringify(state)); storageOK = true; }
  catch (e) { storageOK = false; toast('تعذّر الحفظ على هذا الجهاز — يُنصح بتصدير نسخة احتياطية الآن'); }
}

let state = load();
save();

// طلب حفظ دائم من المتصفح (يقلل احتمال حذف البيانات تلقائيًا)
let persisted = null;
async function askPersist() {
  try {
    if (navigator.storage && navigator.storage.persist) {
      persisted = await navigator.storage.persisted();
      if (!persisted) persisted = await navigator.storage.persist();
    }
  } catch (e) { /* تجاهل */ }
}

// مزامنة بين نوافذ مفتوحة متعددة
window.addEventListener('storage', e => {
  if (e.key === KEY && e.newValue) { try { state = normalize(JSON.parse(e.newValue)); render(); } catch (err) {} }
});

/* ================= منطق العادات ================= */
const dayRec = k => state.days[k] || {};
function isDone(k, habit, unit) {
  const d = dayRec(k);
  if (habit === 'sunnah') return !!(d.s && d.s[unit]);
  return !!d[habit];
}
function habitScore(k, hid) {
  const d = state.days[k];
  if (!d) return 0;
  if (hid === 'sunnah') return d.s ? SUNNAH.filter(u => d.s[u.id]).length / 5 : 0;
  return d[hid] ? 1 : 0;
}
function dayCount(k) {
  const d = state.days[k];
  if (!d) return 0;
  return (d.s ? SUNNAH.filter(u => d.s[u.id]).length : 0) + ['dishes', 'quran', 'tidy'].filter(h => d[h]).length;
}
function toggle(k, habit, unit) {
  const day = state.days[k] || (state.days[k] = {});
  const stamp = new Date().toISOString();
  let now;
  if (habit === 'sunnah') {
    day.s = day.s || {};
    if (day.s[unit]) delete day.s[unit]; else day.s[unit] = stamp;
    now = !!day.s[unit];
    if (!Object.keys(day.s).length) delete day.s;
  } else {
    if (day[habit]) delete day[habit]; else day[habit] = stamp;
    now = !!day[habit];
  }
  if (!Object.keys(day).length) delete state.days[k];
  save();
  askPersist();
  return now;
}
function effectiveStart() {
  let s = state.startDate;
  for (const k in state.days) if (isKey(k) && k < s) s = k;
  return s;
}

function habitStats(hid) {
  const start = effectiveStart(), t = todayKey();
  const list = [];
  for (let k = start; k <= t; k = addDays(k, 1)) list.push({ k, s: habitScore(k, hid) });
  let total = 0, committed = 0, longest = 0, run = 0;
  for (const x of list) {
    total += hid === 'sunnah' ? Math.round(x.s * 5) : x.s;
    if (x.s === 1) { committed++; run++; longest = Math.max(longest, run); } else run = 0;
  }
  // السلسلة الحالية: اليوم لا يكسرها إن لم يُنجز بعد
  let current = 0;
  let k = habitScore(t, hid) === 1 ? t : addDays(t, -1);
  while (k >= start && habitScore(k, hid) === 1) { current++; k = addDays(k, -1); }
  const windowPct = n => rangePct(hid, addDays(t, -(n - 1)), t);
  return { total, committed, longest, current, week: windowPct(7), month: windowPct(30), tracked: list.length, start };
}
// نسبة الالتزام في فترة: اليوم الجاري يُحتسب فقط إن بدأ فيه إنجاز (لأنه لم ينتهِ بعد)
function rangePct(hid, from, to) {
  const start = effectiveStart(), t = todayKey();
  let sum = 0, n = 0;
  for (let k = from < start ? start : from; k <= to && k <= t; k = addDays(k, 1)) {
    const s = habitScore(k, hid);
    if (k === t && s === 0) continue;
    sum += s; n++;
  }
  return n ? { pct: sum / n, n } : { pct: null, n: 0 };
}

/* ================= الرسائل التشجيعية ================= */
const MSG = {
  zero: ['كل رحلة جميلة تبدأ بخطوة صغيرة 🌱', 'يوم جديد وصفحة بيضاء… خطوة واحدة تكفي للبداية 🤍', 'على مهل… أول مهمة هي أجمل بداية 🌷'],
  back: ['أهلًا بالعودة 🤍 كل يوم فرصة جديدة، ولا شيء ضاع من رحلتك', 'العودة بحد ذاتها إنجاز 🌿 لنبدأ بخطوة لطيفة اليوم'],
  low: ['بداية جميلة! الخطوة التالية أسهل بإذن الله 🌷', 'ما شاء الله، انطلقت الرحلة اليوم ✨', 'خطوة صغيرة اليوم… عادة ثابتة غدًا 🌱'],
  mid: ['في منتصف الطريق، ما شاء الله 🌿', 'تقدّم هادئ وثابت… هكذا تُبنى العادات 💛', 'نصف اليوم مُنجز، والباقي أخف بإذن الله 🌸'],
  high: ['تقدّم رائع! القليل ويكتمل اليوم ✨', 'ما شاء الله، يومك يزهر 🌷', 'خطوات قليلة وتكتمل اللوحة 💫'],
  full: ['اكتمل اليوم! الحمد لله على التوفيق 🌸', 'يوم مكتمل… بارك الله في وقتك وجهدك 🤍', 'كل المهام مُنجزة، ما شاء الله تبارك الله ✨'],
};
function pick(arr, seed) { let h = 0; for (const c of seed) h = (h * 31 + c.charCodeAt(0)) >>> 0; return arr[h % arr.length]; }
function messageFor(k) {
  const c = dayCount(k), p = c / TOTAL_ITEMS;
  if (c === 0) {
    const prev = addDays(k, -1);
    if (prev >= effectiveStart() && dayCount(prev) <= 2 && k === todayKey() && Object.keys(state.days).length) return pick(MSG.back, k);
    return pick(MSG.zero, k);
  }
  if (p === 1) return pick(MSG.full, k);
  if (p >= 0.75) return pick(MSG.high, k);
  if (p >= 0.4) return pick(MSG.mid, k);
  return pick(MSG.low, k);
}

/* ================= أوقات الصلاة للحالة ================= */
const ptCache = {};
function prayerTimes(k) {
  const loc = state.settings.location;
  if (!loc) return null;
  const ck = `${k}|${loc.lat}|${loc.lng}|${state.settings.method}`;
  if (!ptCache[ck]) ptCache[ck] = PT.compute(parseKey(k), loc.lat, loc.lng, state.settings.method);
  return ptCache[ck];
}
function nextPrayer() {
  const now = new Date();
  const t = prayerTimes(todayKey());
  if (!t) return null;
  for (const p of PRAYERS) if (t[p.id] && t[p.id] > now) return { p, at: t[p.id] };
  const tm = prayerTimes(addDays(todayKey(), 1));
  return tm && tm.fajr ? { p: PRAYERS[0], at: tm.fajr, tomorrow: true } : null;
}

/* ================= واجهة: أدوات عامة ================= */
const $ = (s, r = document) => r.querySelector(s);
const view = $('#view');
let toastTimer;
function toast(msg, celebrate) {
  const t = $('#toast');
  t.textContent = msg;
  t.classList.toggle('celebrate', !!celebrate);
  t.classList.add('show');
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => t.classList.remove('show'), 3200);
}
const reduceMotion = () => window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
function petals(x, y, n = 14, spread = 90) {
  if (reduceMotion()) return;
  const box = $('#petals');
  const colors = ['#E7BDBA', '#B97978', '#9DB38A', '#C9A66B', '#F3D6D2'];
  for (let i = 0; i < n; i++) {
    const s = document.createElement('i');
    s.className = 'petal';
    const a = Math.random() * Math.PI * 2, r = spread * (0.5 + Math.random() * 0.7);
    s.style.left = x + 'px'; s.style.top = y + 'px';
    s.style.background = colors[i % colors.length];
    s.style.setProperty('--dx', Math.cos(a) * r + 'px');
    s.style.setProperty('--dy', Math.sin(a) * r - 30 + 'px');
    s.style.setProperty('--rot', (Math.random() * 540 - 270) + 'deg');
    s.style.animationDelay = Math.random() * 80 + 'ms';
    box.appendChild(s);
    setTimeout(() => s.remove(), 1200);
  }
}
function openSheet(html) {
  $('#sheet-body').innerHTML = html;
  $('#sheet').hidden = false;
  document.body.style.overflow = 'hidden';
}
function closeSheet() {
  $('#sheet').hidden = true;
  document.body.style.overflow = '';
  sheetDay = null;
}
function download(name, content, type) {
  const blob = new Blob([content], { type });
  const a = document.createElement('a');
  a.href = URL.createObjectURL(blob);
  a.download = name;
  document.body.appendChild(a);
  a.click();
  setTimeout(() => { URL.revokeObjectURL(a.href); a.remove(); }, 1500);
}

function topbar(sub) {
  return `<header class="topbar">
    <h1 class="brand">رحلتي نحو الالتزام 🌷${sub ? `<small>${sub}</small>` : ''}</h1>
    <a class="icon-btn" href="#settings" aria-label="الإعدادات والتذكيرات">${ICONS.gear}</a>
  </header>`;
}

/* ================= عناصر المهام ================= */
function chkItem(k, habit, unit, title, sub) {
  const done = isDone(k, habit, unit);
  return `<button class="chk ${done ? 'done' : ''}" role="checkbox" aria-checked="${done}"
      data-toggle data-date="${k}" data-habit="${habit}" ${unit ? `data-unit="${unit}"` : ''}>
    <span class="box">${ICONS.check}</span>
    <span class="txt"><span class="ttl">${title}</span>${sub ? `<span class="sub">${sub}</span>` : ''}</span>
  </button>`;
}
function sunnahCount(k) { const d = dayRec(k); return d.s ? SUNNAH.filter(u => d.s[u.id]).length : 0; }
function habitCards(k) {
  const pt = prayerTimes(k);
  const sc = sunnahCount(k);
  let html = `<section class="card" data-card="sunnah">
    <div class="habit-head">
      <span class="hicon sunnah">${ICONS.sunnah}</span>
      <div class="t"><h3>السنن الرواتب</h3><div class="hint">12 ركعة في اليوم والليلة</div></div>
      <span class="count ${sc === 5 ? 'full' : ''}" data-count="sunnah">${sc}/5</span>
    </div>`;
  for (const p of PRAYERS) {
    const units = SUNNAH.filter(u => u.prayer === p.id);
    html += `<div class="prow"><div class="pname"><b>${p.name}</b>${pt && pt[p.id] ? `<small>${F.time.format(pt[p.id])}</small>` : ''}</div><div class="punits">`;
    if (!units.length) html += `<div class="none-note">لا سنة راتبة للعصر — لا شيء مطلوب هنا 🤍</div>`;
    for (const u of units) html += chkItem(k, 'sunnah', u.id, `${u.kind} · ${u.rakat}`);
    html += `</div></div>`;
  }
  html += `</section>`;
  for (const h of HABITS.slice(1)) {
    const r = state.settings.reminders[h.id];
    const done = isDone(k, h.id);
    const sub = `${h.hint}${r && r.on ? ` · 🔔 ${fmtHM(r.time)}` : ''}`;
    html += `<section class="card habit-row ${done ? 'done-card' : ''}" data-card="${h.id}">
      <span class="hicon ${h.id}">${ICONS[h.id]}</span>
      ${chkItem(k, h.id, null, h.name, sub)}
    </section>`;
  }
  return html;
}
function ring(k) {
  const c = dayCount(k), p = c / TOTAL_ITEMS, C = 2 * Math.PI * 50;
  return `<div class="ring" role="img" aria-label="نسبة إنجاز اليوم ${Math.round(p * 100)}٪">
    <svg viewBox="0 0 120 120"><defs><linearGradient id="ringGrad" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#E7BDBA"/><stop offset=".6" stop-color="#9DB38A"/><stop offset="1" stop-color="#C9A66B"/></linearGradient></defs>
      <circle class="track" cx="60" cy="60" r="50"/>
      <circle class="bar" cx="60" cy="60" r="50" stroke-dasharray="${C.toFixed(1)}" stroke-dashoffset="${(C * (1 - p)).toFixed(1)}"/>
    </svg>
    <div class="center"><div><div class="pct">${Math.round(p * 100)}<small>٪</small></div><span class="of">${c} من ${TOTAL_ITEMS}</span></div></div>
  </div>`;
}
function progressCard(k) {
  const full = dayCount(k) === TOTAL_ITEMS;
  return `<section class="card progress-card ${full ? 'full' : ''}" id="progress">
    ${ring(k)}
    <div class="progress-text"><h2>${k === todayKey() ? 'إنجاز اليوم' : 'إنجاز ذلك اليوم'}</h2><p>${messageFor(k)}</p></div>
  </section>`;
}

/* ================= الصفحة الرئيسية ================= */
function renderHome() {
  const t = todayKey();
  if (state.activeDate > t) state.activeDate = t;
  const k = state.activeDate, d = parseKey(k);
  let html = topbar();
  html += `<div class="datebar">
    <button class="nav-btn" data-act="day-prev" aria-label="اليوم السابق">${ICONS.right}</button>
    <div class="d"><b>${k === t ? 'اليوم · ' : ''}${F.dm.format(d)}</b><span>${hijri(d)}</span></div>
    <button class="nav-btn" data-act="day-next" aria-label="اليوم التالي" ${k >= t ? 'disabled' : ''}>${ICONS.left}</button>
  </div>`;
  if (k < t) {
    const isYesterday = k === addDays(t, -1);
    html += `<div class="banner">
      <p>${isYesterday ? '🌅 بدأ يوم جديد! ' : ''}هذه صفحة <b>${F.dm.format(d)}</b> — سجلّها محفوظ كما هو، ويمكن إكمال ما فات منها أو الانتقال إلى اليوم.</p>
      <button class="btn gold" data-act="new-day">الانتقال إلى يوم جديد ←</button>
    </div>`;
  }
  html += progressCard(k);
  if (k === t) {
    const np = nextPrayer();
    if (np) html += `<a class="chip" href="#settings">${ICONS.mosque} الصلاة القادمة: ${np.p.name}${np.tomorrow ? ' (غدًا)' : ''} ${F.time.format(np.at)}</a>`;
    else html += `<a class="chip gold" href="#settings">${ICONS.pin} ضبط الموقع لحساب أوقات الصلاة ←</a>`;
  }
  html += habitCards(k);
  const lb = state.lastBackup ? daysBetween(state.lastBackup.slice(0, 10), t) : null;
  if (Object.keys(state.days).length >= 5 && (lb === null || lb >= 14)) {
    html += `<a class="card small" href="#settings" style="display:block;text-decoration:none">💾 ${lb === null ? 'لم تُحفظ نسخة احتياطية بعد' : `آخر نسخة احتياطية قبل ${lb} يومًا`} — نسخة صغيرة تحفظ رحلتك من الضياع ←</a>`;
  }
  view.innerHTML = html;
}
function refreshHome(k) {
  const prog = $('#progress');
  if (!prog) return;
  const C = 2 * Math.PI * 50, c = dayCount(k), p = c / TOTAL_ITEMS;
  prog.querySelector('.bar').setAttribute('stroke-dashoffset', (C * (1 - p)).toFixed(1));
  prog.querySelector('.pct').innerHTML = `${Math.round(p * 100)}<small>٪</small>`;
  prog.querySelector('.of').textContent = `${c} من ${TOTAL_ITEMS}`;
  prog.querySelector('.ring').setAttribute('aria-label', `نسبة إنجاز اليوم ${Math.round(p * 100)}٪`);
  prog.querySelector('p').textContent = messageFor(k);
  prog.classList.toggle('full', c === TOTAL_ITEMS);
}
function refreshCards(root, k) {
  const sc = sunnahCount(k);
  root.querySelectorAll('[data-count="sunnah"]').forEach(el => { el.textContent = `${sc}/5`; el.classList.toggle('full', sc === 5); });
  for (const h of ['dishes', 'quran', 'tidy']) {
    root.querySelectorAll(`[data-card="${h}"]`).forEach(el => el.classList.toggle('done-card', isDone(k, h)));
  }
}

/* ================= الإحصائيات ================= */
const pctTxt = p => p === null ? '—' : Math.round(p * 100) + '٪';
function weekDots(hid) {
  const t = todayKey(), start = effectiveStart();
  let s = '';
  for (let i = 6; i >= 0; i--) {
    const k = addDays(t, -i), v = habitScore(k, hid);
    const cls = k < start ? 'off' : v === 1 ? 'full' : v > 0 ? 'part' : '';
    s += `<i class="${cls}" title="${F.short.format(parseKey(k))}"></i>`;
  }
  return `<div class="week-dots" aria-hidden="true">${s}</div>`;
}
function renderStats() {
  let html = topbar('إحصائيات العادات');
  const t = todayKey();
  const tracked = daysBetween(effectiveStart(), t) + 1;
  html += `<p class="muted small" style="margin:0 4px 12px">رحلتك بدأت في ${F.full.format(parseKey(effectiveStart()))} — منذ ${tracked} ${tracked === 1 ? 'يوم' : 'يومًا'}.</p>`;
  for (const h of HABITS) {
    const st = habitStats(h.id);
    html += `<a class="card hab-link" href="#stats/${h.id}">
      <span class="hicon ${h.id}">${ICONS[h.id]}</span>
      <div class="t"><h3>${h.name}</h3>
        <div class="meta">${st.committed} ${st.committed === 1 ? 'يوم' : 'يومًا'} التزام · آخر 30 يومًا ${pctTxt(st.month.pct)}</div>
        ${weekDots(h.id)}
      </div>
      <svg class="chev" viewBox="0 0 24 24"><path d="M15 6l-6 6 6 6"/></svg>
    </a>`;
  }
  html += `<p class="note" style="margin:6px 4px">🟩 يوم مكتمل · 🟥 فاتح: جزء منه · ⬜ لم يُنجز. النسب صادقة: تُحسب فقط الأيام منذ بداية رحلتك، واليوم الجاري يُحتسب عندما يبدأ فيه إنجاز.</p>`;
  view.innerHTML = html;
}

let chartMode = 'week';
let statMonth = null;
function chartData(hid) {
  const t = todayKey(), pts = [];
  if (chartMode === 'week') {
    for (let i = 7; i >= 0; i--) {
      const to = addDays(t, -7 * i), from = addDays(to, -6);
      pts.push({ label: F.short.format(parseKey(from)), v: rangePct(hid, from, to).pct });
    }
  } else {
    const now = parseKey(t);
    for (let i = 5; i >= 0; i--) {
      const first = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const last = new Date(now.getFullYear(), now.getMonth() - i + 1, 0);
      pts.push({ label: F.monthOnly.format(first), v: rangePct(hid, keyOf(first), keyOf(last)).pct });
    }
  }
  return pts;
}
function lineChart(pts) {
  const W = 320, H = 170, px = 18, top = 22, bottom = 30;
  const iw = W - px * 2, ih = H - top - bottom;
  // الأقدم يمينًا والأحدث يسارًا (اتجاه القراءة العربية)
  const x = i => W - px - (pts.length === 1 ? iw / 2 : (i * iw) / (pts.length - 1));
  const y = v => top + ih * (1 - v);
  let s = `<svg viewBox="0 0 ${W} ${H}" role="img" aria-label="رسم بياني لتطور نسبة الالتزام">
    <defs><linearGradient id="area" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#9DB38A" stop-opacity=".35"/><stop offset="1" stop-color="#9DB38A" stop-opacity="0"/></linearGradient></defs>`;
  for (const g of [0, 0.5, 1]) s += `<line class="grid" x1="${px}" x2="${W - px}" y1="${y(g)}" y2="${y(g)}"/><text class="lbl" x="${W - 2}" y="${y(g) - 3}" text-anchor="end">${g * 100}٪</text>`;
  const valid = pts.map((p, i) => ({ ...p, i })).filter(p => p.v !== null);
  if (!valid.length) {
    s += `<text class="nodata" x="${W / 2}" y="${top + ih / 2}" text-anchor="middle">لا توجد بيانات كافية بعد — ستظهر هنا مع الأيام 🌱</text>`;
  } else {
    // نرسم الخط على الأجزاء المتصلة فقط (لا نختلق قيمًا للفترات قبل البداية)
    let seg = [];
    const segs = [];
    pts.forEach((p, i) => { if (p.v === null) { if (seg.length) segs.push(seg); seg = []; } else seg.push({ x: x(i), y: y(p.v) }); });
    if (seg.length) segs.push(seg);
    for (const sg of segs) {
      const d = sg.map((q, j) => `${j ? 'L' : 'M'}${q.x.toFixed(1)},${q.y.toFixed(1)}`).join(' ');
      if (sg.length > 1) s += `<path d="${d} L${sg[sg.length - 1].x.toFixed(1)},${y(0)} L${sg[0].x.toFixed(1)},${y(0)} Z" fill="url(#area)"/>`;
      s += `<path class="line" d="${d}"/>`;
    }
    for (const p of valid) s += `<circle class="dot" cx="${x(p.i)}" cy="${y(p.v)}" r="4"/><text class="val" x="${x(p.i)}" y="${y(p.v) - 9}" text-anchor="middle">${Math.round(p.v * 100)}</text>`;
  }
  pts.forEach((p, i) => { if (pts.length <= 8) s += `<text class="lbl" x="${x(i)}" y="${H - 8}" text-anchor="middle">${p.label}</text>`; });
  return s + '</svg>';
}
function monthCalendar(ym, cellFn, navPrefix) {
  const [y, m] = ym.split('-').map(Number);
  const first = new Date(y, m - 1, 1), daysIn = new Date(y, m, 0).getDate();
  const t = todayKey();
  const canNext = keyOf(new Date(y, m, 1)) <= t;
  let s = `<div class="cal-head">
    <button class="nav-btn" data-act="${navPrefix}-prev" aria-label="الشهر السابق">${ICONS.right}</button>
    <h3>${F.month.format(first)}</h3>
    <button class="nav-btn" data-act="${navPrefix}-next" aria-label="الشهر التالي" ${canNext ? '' : 'disabled'}>${ICONS.left}</button>
  </div>
  <div class="wk"><span>أحد</span><span>إثنين</span><span>ثلاثاء</span><span>أربعاء</span><span>خميس</span><span>جمعة</span><span>سبت</span></div><div class="cal">`;
  for (let i = 0; i < first.getDay(); i++) s += `<span class="cday blank"></span>`;
  for (let d = 1; d <= daysIn; d++) s += cellFn(`${y}-${pad(m)}-${pad(d)}`, d);
  return s + '</div>';
}
const ymOf = k => k.slice(0, 7);
const shiftMonth = (ym, n) => { const [y, m] = ym.split('-').map(Number); const d = new Date(y, m - 1 + n, 1); return `${d.getFullYear()}-${pad(d.getMonth() + 1)}`; };

function renderHabitDetail(hid) {
  const h = HABIT[hid];
  if (!h) { location.hash = '#stats'; return; }
  const st = habitStats(hid), t = todayKey();
  statMonth = statMonth || ymOf(t);
  let html = `<header class="topbar">
    <a class="icon-btn" href="#stats" aria-label="رجوع">${ICONS.right}</a>
    <h1 class="brand" style="flex:1;font-size:22px">${h.name}</h1>
    <span class="hicon ${hid}">${ICONS[hid]}</span>
  </header>`;

  let note;
  if (st.current >= 2) note = `🔥 ${st.current} أيام متتالية — ما شاء الله، استمرار جميل`;
  else if (st.current === 1) note = '🌱 سلسلة جديدة بدأت — اليوم الثاني ينتظر';
  else if (st.longest > 0) note = `🌷 أطول سلسلة تحققت ${st.longest} ${st.longest === 1 ? 'يوم' : 'أيام'} — كل إنجاز اليوم بداية سلسلة جديدة، ولا يضيع شيء مما مضى`;
  else note = '🌱 أول يوم التزام سيظهر هنا… خطوة واحدة تكفي';

  html += `<section class="card hero">
    <div class="num">${st.committed}</div>
    <p>${hid === 'sunnah' ? 'يومًا مكتملًا بالسنن الخمس' : 'يومًا من الالتزام'} منذ بداية الرحلة</p>
    <div class="note">${note}</div>
  </section>
  <div class="grid2">
    <div class="stat rose"><b>${st.total}</b><span>${hid === 'sunnah' ? 'سنة راتبة مؤدّاة (مرات الإنجاز)' : 'مرة إنجاز'}</span></div>
    <div class="stat sage"><b>${st.committed}</b><span>${hid === 'sunnah' ? 'يوم مكتمل' : 'يوم التزام'} من ${st.tracked}</span></div>
    <div class="stat sage"><b>${pctTxt(st.week.pct)}</b><span>الالتزام الأسبوعي (آخر 7 أيام)</span></div>
    <div class="stat sage"><b>${pctTxt(st.month.pct)}</b><span>الالتزام الشهري (آخر 30 يومًا)</span></div>
    <div class="stat gold"><b>${st.current}</b><span>السلسلة الحالية</span></div>
    <div class="stat gold"><b>${st.longest}</b><span>أطول سلسلة متتالية</span></div>
  </div>`;

  html += `<section class="card chart">
    <div class="card-head"><h3>تطوّر الالتزام</h3>
      <div class="seg" role="tablist"><button class="${chartMode === 'week' ? 'on' : ''}" data-act="chart-week">أسبوعي</button><button class="${chartMode === 'month' ? 'on' : ''}" data-act="chart-month">شهري</button></div>
    </div>
    ${lineChart(chartData(hid))}
    <p class="note">${chartMode === 'week' ? 'نسبة الالتزام لكل أسبوع خلال آخر 8 أسابيع' : 'نسبة الالتزام لكل شهر خلال آخر 6 أشهر'}${hid === 'sunnah' ? ' (محسوبة من عدد السنن المؤدّاة من 5 يوميًا)' : ''}.</p>
  </section>`;

  if (hid === 'sunnah') {
    html += `<section class="card"><div class="card-head"><h3>كل سنة على حدة · آخر 30 يومًا</h3></div><div class="bars">`;
    const from = addDays(t, -29), start = effectiveStart();
    for (const u of SUNNAH) {
      let n = 0, done = 0;
      for (let k = from < start ? start : from; k <= t; k = addDays(k, 1)) {
        const did = isDone(k, 'sunnah', u.id);
        if (k === t && !did) continue;
        n++; if (did) done++;
      }
      const p = n ? done / n : 0;
      html += `<div class="bar-row"><span class="lab">${SUNNAH_NAME[u.id]}</span><span class="trk"><i style="width:${Math.round(p * 100)}%"></i></span><span class="v">${done}/${n}</span></div>`;
    }
    html += `</div></section>`;
  }

  const start = effectiveStart();
  html += `<section class="card">${monthCalendar(statMonth, (k, d) => {
    let cls = '';
    if (k < start || k > t) cls = 'off';
    else {
      const v = habitScore(k, hid);
      cls = v === 1 ? 'full' : v > 0 ? 'part' : (k < t ? 'miss' : '');
    }
    if (k === t) cls += ' today';
    return `<span class="cday ${cls}" title="${F.short.format(parseKey(k))}">${d}</span>`;
  }, 'sm')}
    <div class="legend"><span><i style="background:var(--sage)"></i>مُنجز</span>${hid === 'sunnah' ? '<span><i style="background:var(--rose-soft)"></i>جزئي</span>' : ''}<span><i style="border:1.5px dashed #E8D6D0"></i>لم يُنجز</span><span><i style="border:2px solid var(--gold)"></i>اليوم</span></div>`;

  // الأيام التي لم تُنجز في الشهر المعروض
  const [yy, mm] = statMonth.split('-').map(Number);
  const missed = [], partial = [];
  for (let d = 1; d <= new Date(yy, mm, 0).getDate(); d++) {
    const k = `${yy}-${pad(mm)}-${pad(d)}`;
    if (k < start || k >= t) continue;
    const v = habitScore(k, hid);
    if (v === 0) missed.push(k); else if (v < 1) partial.push(k);
  }
  html += `<details style="margin-top:14px"><summary>أيام لم تُنجز فيها هذه العادة (${missed.length}${partial.length ? ` + ${partial.length} جزئي` : ''})</summary>
    ${missed.length || partial.length ? `<div class="missed-list">${missed.map(k => `<span>${F.short.format(parseKey(k))}</span>`).join('')}${partial.map(k => `<span style="background:var(--rose-soft)">${F.short.format(parseKey(k))} · ${Math.round(habitScore(k, hid) * 5)}/5</span>`).join('')}</div>
    <p class="note" style="margin-top:8px">نعرضها بصدق لتساعد على ملاحظة النمط، لا للّوم 🤍 يمكن تعديل سجل أي يوم من صفحة التقويم.</p>` : `<p class="note" style="margin-top:8px">لا أيام فائتة في هذا الشهر حتى الآن 🌸</p>`}
  </details></section>`;
  view.innerHTML = html;
}

/* ================= التقويم العام ================= */
let calMonth = null;
let sheetDay = null;
function renderCalendar() {
  const t = todayKey(), start = effectiveStart();
  calMonth = calMonth || ymOf(t);
  let html = topbar('سجل الأيام');
  html += `<section class="card">${monthCalendar(calMonth, (k, d) => {
    let cls = '';
    if (k < start || k > t) cls = 'off';
    else {
      const p = dayCount(k) / TOTAL_ITEMS;
      cls = p === 1 ? 'l4' : p >= 0.6 ? 'l3' : p >= 0.3 ? 'l2' : p > 0 ? 'l1' : (k < t ? 'miss' : '');
    }
    if (k === t) cls += ' today';
    const dots = HABITS.map(h => `<i class="${habitScore(k, h.id) === 1 ? 'on' : ''}"></i>`).join('');
    const clickable = k <= t;
    return `<button class="cday ${cls}" ${clickable ? `data-day="${k}"` : 'disabled'} aria-label="${F.full.format(parseKey(k))}">${d}${k >= start && k <= t ? `<span class="dots">${dots}</span>` : ''}</button>`;
  }, 'cal')}
  <div class="legend">
    <span><i style="background:var(--sage)"></i>يوم مكتمل</span>
    <span><i style="background:#DCE7D2"></i>أكثر من النصف</span>
    <span><i style="background:#F1D9D4"></i>بداية</span>
    <span><i style="border:1.5px dashed #E8D6D0"></i>بلا إنجاز</span>
  </div>
  <p class="note" style="margin-top:8px">النقاط الأربع: السنن · المواعين · القرآن · الترتيب. اضغط على أي يوم لعرض سجله أو تعديله.</p></section>`;

  // ملخص الشهر
  const [y, m] = calMonth.split('-').map(Number);
  let full = 0, n = 0, sum = 0;
  for (let d = 1; d <= new Date(y, m, 0).getDate(); d++) {
    const k = `${y}-${pad(m)}-${pad(d)}`;
    if (k < start || k > t) continue;
    if (k === t && dayCount(k) === 0) continue;
    n++; sum += dayCount(k) / TOTAL_ITEMS; if (dayCount(k) === TOTAL_ITEMS) full++;
  }
  html += `<div class="grid2">
    <div class="stat sage"><b>${n ? Math.round(sum / n * 100) + '٪' : '—'}</b><span>متوسط الإنجاز هذا الشهر</span></div>
    <div class="stat rose"><b>${full}</b><span>${full === 1 ? 'يوم مكتمل' : 'أيام مكتملة'} هذا الشهر</span></div>
  </div>`;
  view.innerHTML = html;
}
function openDaySheet(k) {
  sheetDay = k;
  const d = parseKey(k);
  openSheet(`<h2>${F.full.format(d)}</h2><p class="muted small" style="margin-bottom:12px">${hijri(d)} · <span data-sheet-count>${dayCount(k)} من ${TOTAL_ITEMS}</span></p>
    ${habitCards(k)}
    <div class="btn-row"><button class="btn ghost" data-close-sheet>إغلاق</button><button class="btn" data-act="open-day" data-date="${k}">فتح في الرئيسية</button></div>`);
}

/* ================= الإعدادات والتذكيرات ================= */
const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent) || (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1);
const isStandalone = () => (window.matchMedia && window.matchMedia('(display-mode: standalone)').matches) || navigator.standalone === true;
const notifSupported = () => 'Notification' in window;
const notifGranted = () => notifSupported() && Notification.permission === 'granted';

function notifStatusHTML() {
  if (!notifSupported()) {
    if (isIOS && !isStandalone()) {
      return `<div class="status warn">📱 <div>إشعارات المتصفح غير متاحة في سفاري مباشرة. على الآيفون والآيباد (iOS 16.4 أو أحدث) تعمل الإشعارات بعد <b>إضافة التطبيق إلى الشاشة الرئيسية</b>: زر المشاركة ⬆️ ← «إضافة إلى الشاشة الرئيسية»، ثم فتح التطبيق من أيقونته والعودة لهذه الصفحة.</div></div>`;
    }
    return `<div class="status no">🔕 <div>هذا المتصفح لا يدعم الإشعارات، لذلك لن تظهر تذكيرات منبثقة. البديل الموثوق: إضافة التذكيرات إلى تقويم الجوال (بالأسفل).</div></div>`;
  }
  const p = Notification.permission;
  if (p === 'granted') return `<div class="status ok">🔔 <div>الإشعارات مفعّلة. ستصل التذكيرات في أوقاتها <b>ما دام التطبيق مفتوحًا أو في الخلفية</b>.</div></div>`;
  if (p === 'denied') return `<div class="status no">🔕 <div>الإشعارات محظورة لهذا الموقع. لتفعيلها: من إعدادات المتصفح ← إعدادات الموقع ← الإشعارات ← السماح، ثم إعادة فتح التطبيق.</div></div>`;
  return `<div class="status warn">🔔 <div>الإشعارات مدعومة لكنها غير مفعّلة بعد.</div></div>
    <button class="btn block" data-act="ask-notif">${ICONS.bell} تفعيل الإشعارات</button>`;
}

function renderSettings() {
  const S = state.settings, loc = S.location, t = todayKey();
  let html = `<header class="topbar">
    <a class="icon-btn" href="#home" aria-label="رجوع">${ICONS.right}</a>
    <h1 class="brand" style="flex:1;font-size:22px">التذكيرات والإعدادات</h1>
  </header>`;

  html += `<h2 class="section-title">🔔 الإشعارات</h2><section class="card">${notifStatusHTML()}
    ${notifGranted() ? `<button class="btn ghost block" data-act="test-notif">إرسال إشعار تجريبي الآن</button>` : ''}
    <p class="note" style="margin-top:10px">للأمانة: تطبيقات الويب لا تستطيع إرسال إشعار مجدول وهي مغلقة تمامًا. لذلك يعمل التذكير داخل التطبيق ما دام مفتوحًا أو في الخلفية، وللتذكير الأكيد حتى مع إغلاقه يمكن <b>إضافة التذكيرات إلى تقويم الجوال</b> (القسم الأخير بالأسفل).</p>
  </section>`;

  // الموقع وأوقات الصلاة
  const pt = prayerTimes(t);
  html += `<h2 class="section-title">🕌 الموقع وأوقات الصلاة</h2><section class="card">
    <div class="status ${loc ? 'ok' : 'warn'}">${ICONS.pin.replace('<svg', '<svg width="20" height="20" style="flex:none;fill:none;stroke:currentColor;stroke-width:1.8"')}<div>${loc ? `الموقع الحالي: <b>${esc(loc.name)}</b>` : 'لم يُحدَّد الموقع بعد — تذكيرات السنن الرواتب تحتاجه لحساب أوقات الصلاة.'}</div></div>
    <button class="btn sage block" data-act="geo">${ICONS.pin} استخدام موقعي الحالي</button>
    <div class="field"><label for="city">أو اختيار مدينة</label>
      <select class="inp" id="city"><option value="">— اختيار مدينة —</option>${CITIES.map((c, i) => `<option value="${i}" ${loc && loc.name === c[0] ? 'selected' : ''}>${c[0]}</option>`).join('')}</select></div>
    <details style="margin-top:12px"><summary>إدخال الإحداثيات يدويًا</summary>
      <div class="two" style="margin-top:10px"><input class="inp" id="lat" inputmode="decimal" placeholder="خط العرض" value="${loc ? loc.lat : ''}"><input class="inp" id="lng" inputmode="decimal" placeholder="خط الطول" value="${loc ? loc.lng : ''}"></div>
      <button class="btn ghost block" style="margin-top:8px" data-act="manual-loc">حفظ الإحداثيات</button>
    </details>
    <div class="field"><label for="method">طريقة الحساب</label>
      <select class="inp" id="method">${Object.entries(METHODS).map(([id, m]) => `<option value="${id}" ${S.method === id ? 'selected' : ''}>${m.name}</option>`).join('')}</select></div>
    ${pt ? `<div class="times">${[['fajr', 'الفجر'], ['sunrise', 'الشروق'], ['dhuhr', 'الظهر'], ['asr', 'العصر'], ['maghrib', 'المغرب'], ['isha', 'العشاء']].map(([id, n]) => `<div><span>${n}</span><b>${pt[id] ? F.time.format(pt[id]) : '—'}</b></div>`).join('')}</div>
    <p class="note" style="margin-top:8px">أوقات اليوم محسوبة فلكيًا على هذا الجهاز بتوقيت الجهاز، وقد تختلف دقيقة أو دقيقتين عن التقويم الرسمي.</p>` : ''}
  </section>`;

  // أوقات التذكير
  html += `<h2 class="section-title">⏰ تذكير كل عادة</h2><section class="card">`;
  html += `<p class="note" style="margin-bottom:6px">السنن الرواتب: يحدَّد التذكير بالدقائق بعد الأذان. لا تذكير للعصر لأنه لا راتبة له.</p>`;
  for (const id in REM) {
    const R = REM[id], r = S.reminders[id];
    let sub, ctrl;
    if (R.prayer) {
      const due = pt ? new Date(pt[R.prayer].getTime() + (r.offset || 0) * 60000) : null;
      sub = due ? `اليوم: ${F.time.format(due)}` : 'يحتاج تحديد الموقع';
      ctrl = `<span class="offset-wrap"><input class="inp" type="number" min="-30" max="120" step="5" value="${r.offset}" data-offset="${id}" aria-label="دقائق بعد الأذان"> د</span>`;
    } else {
      sub = id === 'dishes' ? 'بعد الغداء' : id === 'quran' ? 'في الوقت المختار' : 'في المساء';
      ctrl = `<input class="inp" type="time" value="${r.time}" data-time="${id}" aria-label="وقت التذكير">`;
    }
    html += `<div class="set-row">
      <label class="switch"><input type="checkbox" data-rem="${id}" ${r.on ? 'checked' : ''} aria-label="تشغيل تذكير ${R.name}"><i></i></label>
      <div class="t"><b>${R.name}</b><span>${sub}</span></div>${ctrl}</div>`;
  }
  html += `</section>`;

  // التقويم
  html += `<h2 class="section-title">📅 تذكير مضمون حتى مع إغلاق التطبيق</h2><section class="card">
    <p class="note">ملف تقويم (ics) يضيف التذكيرات المفعّلة إلى تقويم الجوال بتنبيه في موعدها: المواعين والقرآن والترتيب يوميًا، والسنن الرواتب حسب أوقات الصلاة لـ 30 يومًا قادمة (يمكن تحديثه شهريًا).</p>
    <button class="btn gold block" style="margin-top:10px" data-act="ics">${ICONS.cal} إضافة التذكيرات إلى التقويم</button>
  </section>`;

  // النسخ الاحتياطي
  const lb = state.lastBackup;
  html += `<h2 class="section-title">💾 البيانات والنسخ الاحتياطي</h2><section class="card">
    <div class="status ${storageOK ? 'ok' : 'no'}">💾 <div>${storageOK ? 'كل الإنجازات وتواريخها محفوظة تلقائيًا على هذا الجهاز وتبقى بعد الإغلاق والتحديث.' : 'تعذّر الحفظ على هذا الجهاز (قد يكون وضع التصفح الخاص مفعّلًا). يُرجى تصدير نسخة احتياطية.'}
      <span data-persist></span></div></div>
    <p class="note">عدد الأيام المسجلة: <b>${Object.keys(state.days).length}</b> · بداية الرحلة: <b>${F.short.format(parseKey(effectiveStart()))}</b> · آخر نسخة احتياطية: <b>${lb ? F.full.format(new Date(lb)) : 'لا يوجد'}</b></p>
    <div class="btn-row" style="margin-top:12px">
      <button class="btn sage" data-act="export">${ICONS.download} تصدير نسخة</button>
      <button class="btn ghost" data-act="import">${ICONS.upload} استيراد نسخة</button>
    </div>
    ${isIOS && !isStandalone() ? `<p class="note" style="margin-top:10px">نصيحة للآيفون: إضافة التطبيق إلى الشاشة الرئيسية تحمي البيانات من الحذف التلقائي الذي قد يطبّقه سفاري على المواقع غير المستخدمة لفترة.</p>` : ''}
    <p class="note" style="margin-top:10px">البيانات لا تُرسل لأي خادم؛ تبقى على هذا الجهاز فقط. للنقل إلى جهاز آخر: تصدير النسخة ثم استيرادها هناك.</p>
  </section>`;

  html += `<section class="card"><details><summary>مسح كل البيانات</summary>
    <p class="note" style="margin:8px 0">سيُحذف السجل كاملًا من هذا الجهاز. يُنصح بتصدير نسخة احتياطية قبل ذلك.</p>
    <button class="btn danger block" data-act="reset">مسح كل البيانات نهائيًا</button></details></section>
  <p class="note" style="text-align:center;margin-top:10px">رحلتي نحو الالتزام 🌷 · يعمل دون اتصال بعد أول فتح</p>`;
  view.innerHTML = html;

  if (navigator.storage && navigator.storage.persisted) {
    navigator.storage.persisted().then(p => {
      const el = $('[data-persist]');
      if (el) el.textContent = p ? ' (الحفظ الدائم مفعّل في المتصفح ✓)' : '';
    }).catch(() => {});
  }
}

function setLocation(name, lat, lng) {
  lat = Number(lat); lng = Number(lng);
  if (!isFinite(lat) || !isFinite(lng) || Math.abs(lat) > 66 || Math.abs(lng) > 180) { toast('الإحداثيات غير صحيحة'); return; }
  state.settings.location = { name, lat: +lat.toFixed(4), lng: +lng.toFixed(4) };
  save(); render(); toast('تم ضبط الموقع ✓ أوقات الصلاة جاهزة');
}

/* ================= التذكيرات ================= */
let swReg = null;
function reminderDue(id, k) {
  const R = REM[id], r = state.settings.reminders[id];
  if (R.prayer) {
    const pt = prayerTimes(k);
    if (!pt || !pt[R.prayer]) return null;
    return new Date(pt[R.prayer].getTime() + (Number(r.offset) || 0) * 60000);
  }
  const [h, m] = (r.time || R.time).split(':').map(Number);
  const d = parseKey(k); d.setHours(h, m, 0, 0);
  return d;
}
const reminderDone = (id, k) => REM[id].prayer ? isDone(k, 'sunnah', REM[id].unit) : isDone(k, REM[id].habit);

async function showNotification(title, body, tag) {
  const opts = { body, tag, dir: 'rtl', lang: 'ar', icon: 'icons/icon-192.png', badge: 'icons/icon-192.png', data: { url: './#home' } };
  try {
    const reg = swReg || (navigator.serviceWorker && await navigator.serviceWorker.getRegistration());
    if (reg && reg.showNotification) { await reg.showNotification(title, opts); return true; }
  } catch (e) { /* نجرب الطريقة الأخرى */ }
  try { new Notification(title, opts); return true; } catch (e) { return false; }
}

function checkReminders() {
  const now = new Date(), k = todayKey();
  const fired = state.fired[k] || [];
  let changed = false;
  for (const id in REM) {
    const r = state.settings.reminders[id];
    if (!r.on || fired.includes(id)) continue;
    const due = reminderDue(id, k);
    if (!due || now < due) continue;
    if (now - due > REM_WINDOW_MIN * 60000) continue; // فات وقته بكثير — لا نرسل تذكيرًا قديمًا
    fired.push(id); changed = true;
    if (reminderDone(id, k)) continue; // أُنجزت مسبقًا، لا داعي للتذكير
    const R = REM[id];
    if (notifGranted()) showNotification(R.title, R.body, 'rehlati-' + id);
    if (document.visibilityState === 'visible') toast(`🔔 ${R.title} — ${R.body}`);
  }
  if (changed) {
    state.fired[k] = fired;
    for (const fk in state.fired) if (fk < addDays(k, -3)) delete state.fired[fk];
    save();
  }
}

/* ================= ملف التقويم ICS ================= */
function icsFold(line) {
  const enc = new TextEncoder();
  let out = '', cur = '', bytes = 0;
  for (const ch of line) {
    const b = enc.encode(ch).length;
    if (bytes + b > 73) { out += cur + '\r\n '; cur = ''; bytes = 1; }
    cur += ch; bytes += b;
  }
  return out + cur;
}
const icsText = s => String(s).replace(/\\/g, '\\\\').replace(/;/g, '\\;').replace(/,/g, '\\,').replace(/\n/g, '\\n');
const icsDT = d => `${d.getFullYear()}${pad(d.getMonth() + 1)}${pad(d.getDate())}T${pad(d.getHours())}${pad(d.getMinutes())}00`;
function buildICS() {
  const now = new Date();
  const stamp = now.toISOString().replace(/[-:]/g, '').replace(/\.\d+/, '');
  const L = ['BEGIN:VCALENDAR', 'VERSION:2.0', 'PRODID:-//Rehlati//Habits//AR', 'CALSCALE:GREGORIAN', 'METHOD:PUBLISH', 'X-WR-CALNAME:رحلتي نحو الالتزام'];
  const ev = (uid, start, title, body, rrule) => {
    L.push('BEGIN:VEVENT', `UID:${uid}@rehlati`, `DTSTAMP:${stamp}`, `DTSTART:${icsDT(start)}`, 'DURATION:PT10M',
      `SUMMARY:${icsText(title)}`, `DESCRIPTION:${icsText(body)}`);
    if (rrule) L.push(rrule);
    L.push('BEGIN:VALARM', 'ACTION:DISPLAY', `DESCRIPTION:${icsText(title)}`, 'TRIGGER:PT0M', 'END:VALARM', 'END:VEVENT');
  };
  let count = 0, skippedPrayer = false;
  const t = todayKey();
  for (const id in REM) {
    const R = REM[id], r = state.settings.reminders[id];
    if (!r.on) continue;
    if (R.prayer) {
      if (!state.settings.location) { skippedPrayer = true; continue; }
      for (let i = 0; i < 30; i++) {
        const k = addDays(t, i), due = reminderDue(id, k);
        if (due && due > now) { ev(`${id}-${k}`, due, R.title, R.body); count++; }
      }
    } else {
      let start = reminderDue(id, t);
      ev(`${id}-daily-${Date.now()}`, start, R.title, R.body, 'RRULE:FREQ=DAILY'); count++;
    }
  }
  L.push('END:VCALENDAR');
  return { text: L.map(icsFold).join('\r\n') + '\r\n', count, skippedPrayer };
}

/* ================= النسخ الاحتياطي ================= */
function exportBackup() {
  state.lastBackup = new Date().toISOString();
  save();
  const payload = { app: 'rehlati', kind: 'backup', exportedAt: state.lastBackup, version: 1, data: state };
  download(`rehlati-backup-${todayKey()}.json`, JSON.stringify(payload, null, 2), 'application/json');
  toast('تم تصدير النسخة الاحتياطية ✓');
  if (location.hash === '#settings') renderSettings();
}
function importBackup(file) {
  const reader = new FileReader();
  reader.onload = () => {
    let obj;
    try { obj = JSON.parse(reader.result); } catch (e) { toast('الملف غير صالح — ليس ملف نسخة احتياطية'); return; }
    const data = obj && obj.app === 'rehlati' ? (obj.data || obj) : null;
    if (!data || typeof data.days !== 'object') { toast('هذا الملف ليس نسخة احتياطية من «رحلتي»'); return; }
    const n = Object.keys(data.days).length;
    if (!confirm(`سيتم استبدال البيانات الحالية بالنسخة المستوردة (${n} يومًا مسجلًا). متابعة الاستيراد؟`)) return;
    try { localStorage.setItem(PREV_KEY, JSON.stringify(state)); } catch (e) {}
    state = normalize(data);
    state.activeDate = todayKey();
    save();
    render();
    toast(`تم الاستيراد ✓ (${n} يومًا)`);
  };
  reader.readAsText(file);
}

/* ================= الترحيب ================= */
function showOnboarding() {
  openSheet(`<h2>أهلًا بك في رحلتك 🌷</h2>
    <p class="muted" style="margin-bottom:12px">مساحة هادئة لبناء العادات خطوة بخطوة — بلا لوم، وكل إنجاز صغير يُحتسب.</p>
    <ol class="onb note" style="padding-inline-start:20px;margin:0 0 14px;color:var(--ink)">
      <li>الضغط على أي مهمة يضع علامة الإنجاز، والضغط مرة أخرى يلغيها.</li>
      <li>من ⚙️ الإعدادات: ضبط الموقع لأوقات الصلاة، وتفعيل التذكيرات.</li>
      <li>للاستخدام اليومي: إضافة التطبيق إلى الشاشة الرئيسية للجوال.</li>
      <li>كل البيانات محفوظة على هذا الجهاز، ويمكن تصدير نسخة احتياطية في أي وقت.</li>
    </ol>
    <div class="btn-row"><button class="btn ghost" data-act="onb-done">البدء الآن</button><button class="btn" data-act="onb-settings">ضبط التذكيرات</button></div>`);
}

/* ================= التوجيه ================= */
function route() { return (location.hash || '#home').slice(1).split('/'); }
function render() {
  const [page, arg] = route();
  document.querySelectorAll('.tabbar a').forEach(a => a.classList.toggle('on', a.dataset.tab === (page === 'settings' ? '' : page) || (page === '' && a.dataset.tab === 'home')));
  if (page === 'stats' && arg) renderHabitDetail(arg);
  else if (page === 'stats') renderStats();
  else if (page === 'calendar') renderCalendar();
  else if (page === 'settings') renderSettings();
  else renderHome();
}
let lastPage = '';
window.addEventListener('hashchange', () => {
  const p = location.hash;
  if (!p.startsWith('#stats/')) statMonth = null;
  render();
  if (p !== lastPage) { view.classList.remove('enter'); void view.offsetWidth; view.classList.add('enter'); window.scrollTo(0, 0); }
  lastPage = p;
});

/* ================= الأحداث ================= */
document.addEventListener('click', e => {
  const tg = e.target.closest('[data-toggle]');
  if (tg) {
    const k = tg.dataset.date, habit = tg.dataset.habit, unit = tg.dataset.unit;
    const before = dayCount(k);
    const done = toggle(k, habit, unit);
    tg.classList.toggle('done', done);
    tg.setAttribute('aria-checked', String(done));
    const root = tg.closest('#sheet-body') || view;
    refreshCards(root, k);
    if (done) {
      tg.classList.remove('pop'); void tg.offsetWidth; tg.classList.add('pop');
      const r = tg.querySelector('.box').getBoundingClientRect();
      petals(r.left + r.width / 2, r.top + r.height / 2);
      if (habit === 'sunnah' && sunnahCount(k) === 5) toast('اكتملت السنن الرواتب اليوم 🌙 ما شاء الله', true);
      if (dayCount(k) === TOTAL_ITEMS && before < TOTAL_ITEMS) {
        setTimeout(() => { petals(innerWidth / 2, innerHeight / 3, 40, 180); toast(pick(MSG.full, k + 'x'), true); }, 250);
      }
    }
    if (route()[0] === 'home' || route()[0] === '') refreshHome(k);
    if (sheetDay) {
      const c = $('[data-sheet-count]'); if (c) c.textContent = `${dayCount(k)} من ${TOTAL_ITEMS}`;
      if (route()[0] === 'calendar') { const y = scrollY; renderCalendar(); scrollTo(0, y); }
    }
    return;
  }
  if (e.target.closest('[data-close-sheet]')) { closeSheet(); return; }
  const day = e.target.closest('[data-day]');
  if (day) { openDaySheet(day.dataset.day); return; }

  const a = e.target.closest('[data-act]');
  if (!a) return;
  const act = a.dataset.act, t = todayKey();
  switch (act) {
    case 'day-prev': state.activeDate = addDays(state.activeDate, -1); save(); renderHome(); break;
    case 'day-next': if (state.activeDate < t) { state.activeDate = addDays(state.activeDate, 1); save(); renderHome(); } break;
    case 'new-day':
      state.activeDate = t; save(); renderHome();
      toast('🌅 صباح جديد وصفحة جديدة — سجل الأيام السابقة محفوظ');
      break;
    case 'open-day': state.activeDate = a.dataset.date; save(); closeSheet(); location.hash = '#home'; renderHome(); break;
    case 'cal-prev': calMonth = shiftMonth(calMonth, -1); renderCalendar(); break;
    case 'cal-next': calMonth = shiftMonth(calMonth, 1); renderCalendar(); break;
    case 'sm-prev': statMonth = shiftMonth(statMonth, -1); renderHabitDetail(route()[1]); break;
    case 'sm-next': statMonth = shiftMonth(statMonth, 1); renderHabitDetail(route()[1]); break;
    case 'chart-week': chartMode = 'week'; renderHabitDetail(route()[1]); break;
    case 'chart-month': chartMode = 'month'; renderHabitDetail(route()[1]); break;
    case 'ask-notif':
      Notification.requestPermission().then(p => {
        renderSettings();
        if (p === 'granted') { toast('تم تفعيل الإشعارات 🔔'); showNotification('رحلتي نحو الالتزام 🌷', 'الإشعارات تعمل! ستصلك التذكيرات في أوقاتها.', 'rehlati-welcome'); }
        else toast('لم يُمنح الإذن — يمكن تغييره لاحقًا من إعدادات المتصفح');
      });
      break;
    case 'test-notif':
      showNotification('تجربة تذكير 🌷', 'هكذا ستظهر تذكيراتك اليومية', 'rehlati-test').then(ok => toast(ok ? 'أُرسل إشعار تجريبي ✓' : 'تعذّر إظهار الإشعار على هذا المتصفح'));
      break;
    case 'geo':
      if (!navigator.geolocation) { toast('تحديد الموقع غير مدعوم — يمكن اختيار المدينة من القائمة'); break; }
      a.disabled = true; a.textContent = 'جارٍ تحديد الموقع…';
      navigator.geolocation.getCurrentPosition(
        p => setLocation('موقعي الحالي', p.coords.latitude, p.coords.longitude),
        () => { toast('تعذّر تحديد الموقع — يمكن اختيار المدينة من القائمة'); renderSettings(); },
        { enableHighAccuracy: false, timeout: 15000, maximumAge: 3600e3 });
      break;
    case 'manual-loc': setLocation('إحداثيات مخصصة', $('#lat').value, $('#lng').value); break;
    case 'ics': {
      const r = buildICS();
      if (!r.count) { toast(r.skippedPrayer ? 'يحتاج تحديد الموقع أولًا لتذكيرات السنن' : 'لا توجد تذكيرات مفعّلة'); break; }
      download('rehlati-reminders.ics', r.text, 'text/calendar;charset=utf-8');
      toast(`تم تجهيز ${r.count} تذكيرًا ✓ بفتح الملف تُضاف إلى التقويم`);
      break;
    }
    case 'export': exportBackup(); break;
    case 'import': $('#import-file').click(); break;
    case 'reset':
      if (confirm('تأكيد مسح كل السجل من هذا الجهاز؟ لا يمكن التراجع عن ذلك.')) {
        state = defaultState(); state.onboarded = true; save(); location.hash = '#home'; render(); toast('تم مسح البيانات');
      }
      break;
    case 'onb-done': state.onboarded = true; save(); closeSheet(); break;
    case 'onb-settings': state.onboarded = true; save(); closeSheet(); location.hash = '#settings'; break;
  }
});

document.addEventListener('change', e => {
  const el = e.target;
  if (el.id === 'import-file' && el.files[0]) { importBackup(el.files[0]); el.value = ''; return; }
  if (el.id === 'city' && el.value !== '') { const c = CITIES[+el.value]; setLocation(c[0], c[1], c[2]); return; }
  if (el.id === 'method') { state.settings.method = el.value; save(); renderSettings(); toast('تم تحديث طريقة الحساب ✓'); return; }
  const R = state.settings.reminders;
  if (el.dataset.rem) {
    R[el.dataset.rem].on = el.checked; save();
    toast(el.checked ? 'تم تشغيل التذكير 🔔' : 'تم إيقاف التذكير');
    if (el.checked && notifSupported() && Notification.permission === 'default') setTimeout(() => toast('لتصل التذكيرات كإشعارات: «تفعيل الإشعارات» أعلى الصفحة'), 1800);
    return;
  }
  if (el.dataset.time) { if (/^\d{2}:\d{2}$/.test(el.value)) { R[el.dataset.time].time = el.value; save(); toast('تم حفظ وقت التذكير ✓'); } return; }
  if (el.dataset.offset) {
    const v = Math.max(-30, Math.min(120, Math.round(Number(el.value) || 0)));
    R[el.dataset.offset].offset = v; save(); renderSettings(); toast('تم حفظ وقت التذكير ✓');
  }
});

document.addEventListener('keydown', e => { if (e.key === 'Escape' && !$('#sheet').hidden) closeSheet(); });

/* ================= التشغيل ================= */
let knownToday = todayKey();
function tick() {
  const t = todayKey();
  if (t !== knownToday) { knownToday = t; render(); } // انتقل التاريخ (منتصف الليل)
  checkReminders();
}
document.addEventListener('visibilitychange', () => { if (document.visibilityState === 'visible') tick(); });
setInterval(tick, 20000);

if ('serviceWorker' in navigator && location.protocol !== 'file:') {
  navigator.serviceWorker.register('sw.js').then(r => { swReg = r; }).catch(() => {});
}

render();
lastPage = location.hash;
tick();
if (!state.onboarded) setTimeout(showOnboarding, 400);

// واجهة صغيرة للاختبار الآلي فقط
window.__rehlati = { get state() { return state; }, PT, buildICS, habitStats, checkReminders };
})();
