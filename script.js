"use strict";

/* ================= Маалыматтар ================= */

const DHIKR = [
  { ar: "سُبْحَانَ ٱللَّهِ", ru: "Субханаллаh — «Аллаh бардык кемчиликтен пак»", short: "Субханаллаh" },
  { ar: "ٱلْحَمْدُ لِلَّهِ", ru: "Альхамдулиллаh — «Аллаhка мактоолор болсун»", short: "Альхамдулиллаh" },
  { ar: "ٱللَّهُ أَكْبَرُ", ru: "Аллаhу акбар — «Аллаh эң улуу»", short: "Аллаhу акбар" },
  { ar: "لَا إِلَٰهَ إِلَّا ٱللَّهُ", ru: "Ла иляhа илля-Ллаh — «Аллаhтан башка кудай жок»", short: "Ла иляhа илля-Ллаh" },
  { ar: "أَسْتَغْفِرُ ٱللَّهَ", ru: "Астагфируллаh — «Аллаhтан кечирим сурайм»", short: "Астагфируллаh" },
];

const DUAS = [
  { ar: "رَبَّنَآ ءَاتِنَا فِى ٱلدُّنْيَا حَسَنَةً وَفِى ٱلْـَٔاخِرَةِ حَسَنَةً وَقِنَا عَذَابَ ٱلنَّارِ", ru: "Раббибиз! Бизге бул дүйнөдө да жакшылык бер, акыретте да жакшылык бер жана бизди тозоктун азабынан сакта.", ref: "Бакара, 201" },
  { ar: "رَّبِّ زِدْنِى عِلْمًا", ru: "Раббим, билимимди арттыр.", ref: "Таха, 114" },
  { ar: "رَبِّ ٱشْرَحْ لِى صَدْرِى ۝ وَيَسِّرْ لِىٓ أَمْرِى", ru: "Раббим, көкүрөгүмдү ачып бер жана ишимди жеңилдет.", ref: "Таха, 25–26" },
  { ar: "رَبَّنَا لَا تُؤَاخِذْنَآ إِن نَّسِينَآ أَوْ أَخْطَأْنَا", ru: "Раббибиз! Эгер унутуп калсак же жаңылышсак, бизди жазалаба.", ref: "Бакара, 286" },
];

const API = "https://api.alquran.cloud/v1";
const AUDIO = (n) => `https://cdn.islamic.network/quran/audio-surah/128/ar.alafasy/${n}.mp3`;

/* ================= Утилиты ================= */

const $ = (id) => document.getElementById(id);
const esc = (s) => String(s).replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));

function store(key, value) {
  try {
    if (value === undefined) return localStorage.getItem(key);
    localStorage.setItem(key, value);
  } catch (e) { return null; }
}
function storeJSON(key, fallback) {
  try { return JSON.parse(store(key)) ?? fallback; } catch (e) { return fallback; }
}

/* ================= Дуа ================= */

$("dua-list").innerHTML = DUAS.map((d) => `
  <article class="card">
    <p class="ar" lang="ar" dir="rtl">${d.ar}</p>
    <p>${d.ru}</p>
    <span class="ref">${d.ref}</span>
  </article>`).join("");

/* ================= Тасбих ================= */

let dhikrIdx = Number(store("dhikr")) || 0;
if (dhikrIdx >= DHIKR.length) dhikrIdx = 0;
let count = Number(store("count_" + dhikrIdx)) || 0;
let target = Number(store("target")) || 33;
$("target").value = String(target);

function renderDhikr() {
  $("dhikr-pick").innerHTML = DHIKR.map((d, i) =>
    `<button type="button" data-i="${i}" class="${i === dhikrIdx ? "on" : ""}">${d.short}</button>`).join("");
  $("dhikr-ar").textContent = DHIKR[dhikrIdx].ar;
  $("dhikr-ru").textContent = DHIKR[dhikrIdx].ru;
  renderCount();
}
function renderCount() {
  $("count").textContent = count;
  $("target-info").textContent = target ? `Максат: ${target}` : "Максатсыз";
}
$("dhikr-pick").addEventListener("click", (e) => {
  const b = e.target.closest("button");
  if (!b) return;
  dhikrIdx = Number(b.dataset.i);
  store("dhikr", String(dhikrIdx));
  count = Number(store("count_" + dhikrIdx)) || 0;
  renderDhikr();
});
$("counter").addEventListener("click", () => {
  count++;
  store("count_" + dhikrIdx, String(count));
  renderCount();
  if (navigator.vibrate) navigator.vibrate(target && count % target === 0 ? [80, 50, 80] : 15);
});
$("reset").addEventListener("click", () => {
  count = 0;
  store("count_" + dhikrIdx, "0");
  renderCount();
});
$("target").addEventListener("change", (e) => {
  target = Number(e.target.value);
  store("target", String(target));
  renderCount();
});
renderDhikr();

/* ================= Аллаhтын 99 ысымы ================= */

/* Кыргызча транскрипция жана мааниси. Тартиби = Aladhan API номерлери (1–99). */
const ASMA_RU = [
  ["Ар-Рахман", "Ырайымдуу"],
  ["Ар-Рахим", "Мээримдүү"],
  ["Аль-Малик", "Падыша, Ээси"],
  ["Аль-Куддус", "Ыйык, Таза"],
  ["Ас-Салям", "Тынчтык жана аман-эсендик берүүчү"],
  ["Аль-Му’мин", "Ишеним жана коопсуздук берүүчү"],
  ["Аль-Муhаймин", "Сактоочу, Көзөмөлдөөчү"],
  ["Аль-‘Азиз", "Кудуреттүү"],
  ["Аль-Джаббар", "Күчтүү, Оңдоочу"],
  ["Аль-Мутакаббир", "Улуу, Бийик"],
  ["Аль-Халик", "Жаратуучу"],
  ["Аль-Бари’", "Түзүүчү, Пайда кылуучу"],
  ["Аль-Мусаввир", "Келбет берүүчү"],
  ["Аль-Гаффар", "Көп кечирүүчү"],
  ["Аль-Каhhар", "Баарын жеңүүчү"],
  ["Аль-Ваhhаб", "Жомарт Тартуулоочу"],
  ["Ар-Раззак", "Рызык берүүчү"],
  ["Аль-Фаттах", "Ачуучу, Өкүм чыгаруучу"],
  ["Аль-‘Алим", "Бардыгын билүүчү"],
  ["Аль-Кабид", "Кысуучу, Кармоочу"],
  ["Аль-Басит", "Кеңейтүүчү, Мол берүүчү"],
  ["Аль-Хафид", "Төмөндөтүүчү"],
  ["Ар-Рафи‘", "Бийик кылуучу"],
  ["Аль-Му‘изз", "Кадыр-барк берүүчү"],
  ["Аль-Музилль", "Кадыр-баркынан ажыратуучу"],
  ["Ас-Сами‘", "Баарын угуучу"],
  ["Аль-Басир", "Баарын көрүүчү"],
  ["Аль-Хакам", "Өкүм чыгаруучу"],
  ["Аль-‘Адль", "Адилеттүү"],
  ["Аль-Латиф", "Назик, Кылдат"],
  ["Аль-Хабир", "Кабардар"],
  ["Аль-Халим", "Чыдамкай, Жумшак"],
  ["Аль-‘Азым", "Улуу"],
  ["Аль-Гафур", "Кечиримдүү"],
  ["Аш-Шакур", "Жакшылыкка мукапат берүүчү"],
  ["Аль-‘Алий", "Эң жогорку"],
  ["Аль-Кабир", "Эң улуу"],
  ["Аль-Хафиз", "Сактоочу"],
  ["Аль-Мукит", "Азык берүүчү"],
  ["Аль-Хасиб", "Жетиштүү, Эсеп алуучу"],
  ["Аль-Джалиль", "Улуу даражалуу"],
  ["Аль-Карим", "Жомарт, Асыл"],
  ["Ар-Ракиб", "Байкоочу"],
  ["Аль-Муджиб", "Дуага жооп берүүчү"],
  ["Аль-Васи‘", "Баарын камтыган"],
  ["Аль-Хаким", "Акылман"],
  ["Аль-Вадуд", "Сүйүүчү"],
  ["Аль-Маджид", "Даңктуу, Атактуу"],
  ["Аль-Ба‘ис", "Тирилтүүчү"],
  ["Аш-Шаhид", "Күбө"],
  ["Аль-Хакк", "Чындык"],
  ["Аль-Вакиль", "Таянычтуу Коргоочу"],
  ["Аль-Кавий", "Күчтүү"],
  ["Аль-Матин", "Бекем, Мыкты"],
  ["Аль-Валий", "Колдоочу"],
  ["Аль-Хамид", "Мактоого татыктуу"],
  ["Аль-Мухси", "Баарын эсептеп билүүчү"],
  ["Аль-Мубди’", "Жаратууну баштоочу"],
  ["Аль-Му‘ид", "Кайра тирилтүүчү"],
  ["Аль-Мухйи", "Өмүр берүүчү"],
  ["Аль-Мумит", "Өлтүрүүчү"],
  ["Аль-Хайй", "Тирүү"],
  ["Аль-Кайюм", "Өзү өзүнчө тургучу"],
  ["Аль-Ваджид", "Баарын таап тургучу"],
  ["Аль-Маджид", "Асыл, Улуу жүрөктүү"],
  ["Аль-Вахид", "Жалгыз"],
  ["Аль-Ахад", "Бирден-бир"],
  ["Ас-Самад", "Эч кимге муктаж эмес, баары Ага муктаж"],
  ["Аль-Кадир", "Кудурети жеткен"],
  ["Аль-Муктадир", "Бардыгына кудурети жеткен"],
  ["Аль-Мукаддим", "Алга өткөрүүчү"],
  ["Аль-Му’аххир", "Артка калтыруучу"],
  ["Аль-Аввал", "Биринчи"],
  ["Аль-Ахир", "Акыркы"],
  ["Аз-Заhир", "Ачык"],
  ["Аль-Батын", "Жашыруун"],
  ["Аль-Вали", "Башкаруучу"],
  ["Аль-Мута‘али", "Эң бийик"],
  ["Аль-Барр", "Жакшылык кылуучу"],
  ["Ат-Тавваб", "Тообону кабыл алуучу"],
  ["Аль-Мунтакым", "Жазасын берүүчү"],
  ["Аль-‘Афувв", "Күнөөнү өчүрүүчү"],
  ["Ар-Ра’уф", "Боорукер"],
  ["Малик аль-Мульк", "Бийликтин Ээси"],
  ["Зуль-Джаляли валь-Икрам", "Улуулук жана жомарттыктын Ээси"],
  ["Аль-Муксит", "Адилеттүү"],
  ["Аль-Джами‘", "Жыйноочу"],
  ["Аль-Гани", "Бай, Өзүнө жетиштүү"],
  ["Аль-Мугни", "Байытуучу"],
  ["Аль-Мани‘", "Тосуп калуучу, Сактоочу"],
  ["Ад-Дарр", "Даанышмандык менен кыйынчылык жиберүүчү"],
  ["Ан-Нафи‘", "Пайда берүүчү"],
  ["Ан-Нур", "Нур"],
  ["Аль-hади", "Туура жолго баштоочу"],
  ["Аль-Бади‘", "Теңдешсиз Жаратуучу"],
  ["Аль-Баки", "Түбөлүк, Жок болбоочу"],
  ["Аль-Варис", "Бардыгына мураскер"],
  ["Ар-Рашид", "Туура жолго салуучу"],
  ["Ас-Сабур", "Чыдамдуу"],
];

(async function loadAsma() {
  // Араб жазуусу API'ден алынат; жеткиликсиз болсо да кыргызча тизме көрсөтүлөт.
  let arabic = [];
  try {
    const res = await fetch("https://api.aladhan.com/v1/asmaAlHusna");
    const json = await res.json();
    if (json.code === 200 && Array.isArray(json.data) && json.data.length === ASMA_RU.length) {
      arabic = json.data.map((n) => n.name);
    }
  } catch (e) { /* араб жазуусусуз */ }
  $("asma-list").innerHTML = ASMA_RU.map(([tr, mn], i) => `
    <div class="nm">
      <span class="no">${i + 1}</span>
      ${arabic[i] ? `<span class="ar" lang="ar" dir="rtl">${esc(arabic[i])}</span>` : ""}
      <span class="tr">${esc(tr)}</span>
      <span class="mn">${esc(mn)}</span>
    </div>`).join("");
})();

/* ================= Куран ================= */

const SURAH_RU = [
  "Фатиха", "Бакара", "Али Имран", "Ниса", "Маида", "Анъам", "Аъраф", "Анфал", "Тоба", "Жунус", "Худ", "Жусуп", "Раъд", "Ибрахим", "Хижр", "Нахл", "Исра", "Кахф", "Мариям", "Таха", "Анбия", "Хаж", "Муъминун", "Нур", "Фуркан", "Шуара", "Намл", "Касас", "Анкабут", "Рум", "Лукман", "Сажда", "Ахзаб", "Сабаъ", "Фатыр", "Ясин", "Саффат", "Сад", "Зумар", "Гафир", "Фуссилат", "Шура", "Зухруф", "Духан", "Жасия", "Ахкаф", "Мухаммад", "Фатх", "Хужурат", "Каф", "Зарият", "Тур", "Нажм", "Камар", "Рахман", "Вакиа", "Хадид", "Мужадала", "Хашр", "Мумтахана", "Саф", "Жума", "Мунафикун", "Тагабун", "Талак", "Тахрим", "Мульк", "Калам", "Хакка", "Маариж", "Нух", "Жин", "Музаммил", "Муддассир", "Кыяма", "Инсан", "Мурсалат", "Наба", "Назиат", "Абаса", "Таквир", "Инфитар", "Мутаффифин", "Иншикак", "Буруж", "Тарык", "Аъла", "Гашия", "Фажр", "Балад", "Шамс", "Лайл", "Духа", "Шарх", "Тин", "Алак", "Кадр", "Баййина", "Залзала", "Адият", "Кариа", "Такасур", "Аср", "Хумаза", "Фил", "Курайш", "Маун", "Каусар", "Кафирун", "Наср", "Масад", "Ихлас", "Фалак", "Нас",
];
const ruName = (n) => SURAH_RU[n - 1] || "Сүрө " + n;
let SURAHS = [];
const surahCache = new Map();
let current = null; // { n, ayahCount }

const norm = (s) => s
  .replace(/[ً-ٰٟۖ-ۭـ﻿]/g, "")
  .replace(/ٱ/g, "ا");

function stripBismillah(text) {
  const words = text.trim().split(/\s+/);
  if (words.length > 4 && norm(words.slice(0, 4).join(" ")) === "بسم الله الرحمن الرحيم") {
    return words.slice(4).join(" ");
  }
  return text;
}

function surahMeta(n) {
  return SURAHS[n - 1] || { number: n, englishName: "Сүрө " + n, englishNameTranslation: "", numberOfAyahs: 0, revelationType: "", name: "" };
}
const arName = (s) => (s.name || "").replace(/^\S+\s+/, "");

const sNorm = (t) => String(t).toLowerCase().replace(/[^\p{L}\p{N}]/gu, "");
const noArt = (q) => q.replace(/^(аль|ал|ан|ат|ар|ас|аш|аз|ад)(?=.{3})/u, "");

function renderSurahList(filter) {
  const q = sNorm(filter || "");
  const items = SURAHS.filter((s) => {
    if (!q) return true;
    if (String(s.number) === q) return true;
    const hay = sNorm(ruName(s.number) + s.englishName + s.englishNameTranslation);
    return hay.includes(q) || hay.includes(noArt(q));
  });
  $("q-list").innerHTML = items.length ? items.map((s) => `
    <button class="q-item ${current && current.n === s.number ? "on" : ""} ${learned().includes(s.number) ? "done" : ""}" data-n="${s.number}">
      <span class="num">${learned().includes(s.number) ? "✓" : s.number}</span>
      <span class="nm">${esc(ruName(s.number))}<small>${esc(s.englishName)} · ${s.numberOfAyahs} аят</small></span>
      <span class="ar" lang="ar">${esc(arName(s))}</span>
    </button>`).join("") : "Эч нерсе табылган жок.";
}

async function loadSurahList() {
  try {
    const res = await fetch(`${API}/surah`);
    const json = await res.json();
    if (json.code !== 200) throw new Error();
    SURAHS = json.data;
    renderSurahList("");
    renderBookmarks();
    renderContinue();
    renderLearned();
  } catch (e) {
    $("q-list").textContent = "Сүрөлөрдүн тизмеси жүктөлгөн жок. Интернетти текшерип, баракты жаңыртыңыз.";
  }
}

// Кыргызча котормо: Шамсуддин Хакимов, булагы QuranEnc.com. Текст өзгөртүлбөйт, шилтемелер менен көрсөтүлөт.
const KY_KEY = "kyrgyz_hakimov";
const KY_LOCAL = "data/ky/";  // милдеттүү эмес жергиликтүү көчүрмө (tools/fetch_kyrgyz.py)
const KY_API = "https://quranenc.com/api/v1/translation/sura/" + KY_KEY + "/";
const kyCache = new Map();

// HTML-ди «өлүк» документте окуйбуз: скрипттер аткарылбайт, текст гана калат
function plainText(html) {
  const doc = new DOMParser().parseFromString(String(html || "").replace(/<br\s*\/?>|<\/p>|<\/div>/gi, "\n"), "text/html");
  doc.querySelectorAll("script,style").forEach((x) => x.remove());
  return doc.body.textContent.replace(/\n{3,}/g, "\n\n").trim();
}
function kyRows(json) {
  const arr = Array.isArray(json) ? json : json && (json.result || json.data || json.suras);
  if (!Array.isArray(arr)) throw new Error("bad ky response");
  return arr.map((x) => ({ a: Number(x.aya), t: String(x.translation || ""), f: String(x.footnotes || "") })).filter((x) => x.a > 0);
}
async function fetchKy(n) {
  if (kyCache.has(n)) return kyCache.get(n);
  let rows = null;
  for (const url of [KY_LOCAL + n + ".json", KY_API + n]) {
    try {
      const res = await fetch(url);
      if (!res.ok) continue;
      rows = kyRows(await res.json());
      if (rows.length) break;
      rows = null;
    } catch (e) { rows = null; }
  }
  if (!rows) throw new Error("ky translation unavailable");
  const map = new Map(rows.map((r) => [r.a, r]));
  kyCache.set(n, map);
  return map;
}

async function fetchSurah(n) {
  if (surahCache.has(n)) return surahCache.get(n);
  const [arRes, kyRes] = await Promise.allSettled([
    fetch(`${API}/surah/${n}/editions/quran-uthmani`).then((r) => r.json()),
    fetchKy(n),
  ]);
  if (arRes.status !== "fulfilled") throw new Error("arabic failed");
  const json = arRes.value;
  if (json.code !== 200 || !Array.isArray(json.data)) throw new Error("bad response");
  const ar = json.data.find((d) => d.edition && d.edition.identifier === "quran-uthmani") || json.data[0];
  const ky = kyRes.status === "fulfilled" ? kyRes.value : null;
  const ayahs = ar.ayahs.map((a) => {
    const r = ky && ky.get(a.numberInSurah);
    return { n: a.numberInSurah, g: a.number, ar: a.text, ru: r ? r.t : "", fn: r ? plainText(r.f) : "" };
  });
  ayahs.noTr = !ky;
  if (ky) surahCache.set(n, ayahs);
  return ayahs;
}

function getBookmarks() { return storeJSON("q_bm", []); }
function isBookmarked(s, a) { return getBookmarks().some((b) => b.s === s && b.a === a); }
function toggleBookmark(s, a) {
  let list = getBookmarks();
  if (list.some((b) => b.s === s && b.a === a)) list = list.filter((b) => !(b.s === s && b.a === a));
  else list.push({ s, a });
  store("q_bm", JSON.stringify(list));
  renderBookmarks();
}
function renderBookmarks() {
  const list = getBookmarks();
  const box = $("q-bookmarks");
  box.hidden = !list.length;
  box.innerHTML = list.map((b) =>
    `<button data-s="${b.s}" data-a="${b.a}">★ ${esc(ruName(b.s))} ${b.s}:${b.a}</button>`).join("");
}
function renderContinue() {
  const last = storeJSON("q_last", null);
  const btn = $("q-continue");
  if (!last || !last.s) { btn.hidden = true; return; }
  btn.hidden = false;
  btn.textContent = `Улантуу: ${ruName(last.s)} ${last.s}:${last.a || 1}`;
}

async function openSurah(n, ayah) {
  n = Math.min(114, Math.max(1, Number(n) || 1));
  const meta = surahMeta(n);
  current = { n, count: meta.numberOfAyahs };
  const reader = $("q-reader");
  reader.hidden = false;
  $("q-title").textContent = `${n}. ${ruName(n)} сүрөсү` + (meta.name ? ` — ${arName(meta)}` : "");
  const type = meta.revelationType === "Meccan" ? "Мекке мезгилинде түшкөн" : meta.revelationType === "Medinan" ? "Медине мезгилинде түшкөн" : "";
  $("q-meta").textContent = [type, meta.numberOfAyahs ? meta.numberOfAyahs + " аят" : ""].filter(Boolean).join(" · ");
  $("q-ayahs").innerHTML = "";
  $("q-bismillah").hidden = true;
  applyHifz();
  renderLearned();
  $("q-status").textContent = "Жүктөлүүдө…";
  $("q-prev").disabled = n === 1;
  $("q-next").disabled = n === 114;

  const audio = $("q-audio");
  audio.pause();
  audio.src = AUDIO(n);
  stopAyah();

  renderSurahList($("q-search").value);
  reader.scrollIntoView({ behavior: "smooth", block: "start" });

  try {
    const ayahs = await fetchSurah(n);
    if (!current || current.n !== n) return; // пользователь уже открыл другую суру
    const showBism = n !== 1 && n !== 9;
    $("q-bismillah").hidden = !showBism;
    const last = storeJSON("q_last", null);
    $("q-ayahs").innerHTML = ayahs.map((a, i) => {
      const text = i === 0 && showBism ? stripBismillah(a.ar) : a.ar;
      const read = last && last.s === n && last.a === a.n;
      const sp = text.trim().split(/\s+/);
      const arHtml = `<span class="w1">${esc(sp[0])}</span>` + (sp.length > 1 ? ` <span class="rest">${esc(sp.slice(1).join(" "))}</span>` : "");
      return `
        <div class="q-ayah ${read ? "read" : ""}" id="a-${a.n}" data-a="${a.n}">
          <div class="row">
            <p class="ar" lang="ar" dir="rtl">${arHtml}</p>
            <div class="side">
              <span class="no">${a.n}</span>
              <button class="bm ${isBookmarked(n, a.n) ? "on" : ""}" data-bm="${a.n}" aria-label="Белгилөө">${isBookmarked(n, a.n) ? "★" : "☆"}</button>
              <button class="pl" data-g="${a.g}" aria-label="Аятты угуу">▶</button>
              <button class="tf" aria-label="Тафсир">📖</button>
              <button class="sh" aria-label="Аятты бөлүшүү">⤴</button>
            </div>
          </div>
          <p class="tr">${esc(a.ru)}</p>
          ${a.fn ? `<p class="fn">${esc(a.fn)}</p>` : ""}
          <div class="tafsir" hidden></div>
        </div>`;
    }).join("");
    $("q-status").textContent = ayahs.noTr ? "Котормо жүктөлгөн жок (QuranEnc.com жеткиликсиз). Араб тексти гана көрсөтүлдү." : "";
    store("q_last", JSON.stringify({ s: n, a: (last && last.s === n && last.a) || 1 }));
    renderContinue();
    if (ayah) {
      const el = $("a-" + ayah);
      if (el) {
        el.scrollIntoView({ behavior: "smooth", block: "center" });
        el.classList.add("flash");
        setTimeout(() => el.classList.remove("flash"), 2500);
      }
    }
  } catch (e) {
    $("q-status").textContent = "Сүрө жүктөлгөн жок. Интернетти текшерип, кайра аракет кылыңыз.";
  }
}

/* Куран иштеткичтери */
$("q-list").addEventListener("click", (e) => {
  const b = e.target.closest(".q-item");
  if (b) openSurah(Number(b.dataset.n));
});
$("q-search").addEventListener("input", (e) => renderSurahList(e.target.value));
$("q-bookmarks").addEventListener("click", (e) => {
  const b = e.target.closest("button");
  if (b) openSurah(Number(b.dataset.s), Number(b.dataset.a));
});
$("q-continue").addEventListener("click", () => {
  const last = storeJSON("q_last", null);
  if (last) openSurah(last.s, last.a);
});
$("q-prev").addEventListener("click", () => current && openSurah(current.n - 1));
$("q-next").addEventListener("click", () => current && openSurah(current.n + 1));
$("q-close").addEventListener("click", () => {
  $("q-audio").pause();
  stopAyah();
  $("q-reader").hidden = true;
  current = null;
  renderSurahList($("q-search").value);
  $("quran").scrollIntoView({ behavior: "smooth" });
});
$("q-tr").addEventListener("change", (e) => {
  $("q-reader").classList.toggle("no-tr", !e.target.checked);
  store("q_tr", e.target.checked ? "1" : "0");
});
$("q-size").addEventListener("input", (e) => {
  document.documentElement.style.setProperty("--ar-size", e.target.value + "px");
  store("q_size", e.target.value);
});
$("q-ayahs").addEventListener("click", (e) => {
  const row = e.target.closest(".q-ayah");
  if (!row || !current) return;
  const a = Number(row.dataset.a);
  if (e.target.closest(".tf")) { toggleTafsir(row, e.target.closest(".tf")); return; }
  if (e.target.closest(".pl")) { playAyah(e.target.closest(".pl")); return; }
  if (e.target.closest(".sh")) { shareAyah(row, e.target.closest(".sh")); return; }
  if (e.target.closest(".bm")) {
    toggleBookmark(current.n, a);
    const on = isBookmarked(current.n, a);
    const btn = e.target.closest(".bm");
    btn.classList.toggle("on", on);
    btn.textContent = on ? "★" : "☆";
    return;
  }
  if (hifz !== "off") row.classList.toggle("shown");
  document.querySelectorAll(".q-ayah.read").forEach((x) => x.classList.remove("read"));
  row.classList.add("read");
  logRead(current.n, a);
  store("q_last", JSON.stringify({ s: current.n, a }));
  renderContinue();
});
document.querySelectorAll("[data-open]").forEach((b) => {
  b.addEventListener("click", () => openSurah(Number(b.dataset.open), Number(b.dataset.ayah) || undefined));
});


/* аятты кайталап угуу, «жатталды», «бөлүшүү» */
const AYAH_AUDIO = (g) => `https://cdn.islamic.network/quran/audio/128/ar.alafasy/${g}.mp3`;
let ayahPlay = null; // { btn, left }
function stopAyah() {
  const a = $("q-ayah-audio");
  a.pause();
  a.removeAttribute("src");
  if (ayahPlay) ayahPlay.btn.textContent = "▶";
  ayahPlay = null;
}
function playAyah(btn) {
  if (ayahPlay && ayahPlay.btn === btn) { stopAyah(); return; }
  stopAyah();
  $("q-audio").pause();
  const a = $("q-ayah-audio");
  const reps = Math.max(1, Math.min(10, Number($("q-rep").value) || 1));
  ayahPlay = { btn, left: reps };
  btn.textContent = "■";
  a.src = AYAH_AUDIO(btn.dataset.g);
  a.play().catch(() => stopAyah());
}
$("q-ayah-audio").addEventListener("ended", () => {
  if (!ayahPlay) return;
  ayahPlay.left--;
  if (ayahPlay.left > 0) { const a = $("q-ayah-audio"); a.currentTime = 0; a.play().catch(() => stopAyah()); }
  else stopAyah();
});
$("q-ayah-audio").addEventListener("error", () => { if (ayahPlay) stopAyah(); });
$("q-audio").addEventListener("play", stopAyah);
$("q-rep").addEventListener("change", (e) => store("q_rep", e.target.value));

function learned() { const l = storeJSON("q_learned", []); return Array.isArray(l) ? l.filter((x) => Number.isInteger(x)) : []; }
function renderLearned() {
  const l = learned();
  const c = $("q-learned-count");
  c.hidden = !l.length;
  c.textContent = `Жатталган сүрөлөр: ${l.length} / 114`;
  if (current) $("q-learned").textContent = l.includes(current.n) ? "Жатталды ✓ (алып салуу)" : "Жатталды деп белгилөө";
}
$("q-learned").addEventListener("click", () => {
  if (!current) return;
  let l = learned();
  l = l.includes(current.n) ? l.filter((x) => x !== current.n) : [...l, current.n];
  store("q_learned", JSON.stringify(l));
  renderLearned();
  renderSurahList($("q-search").value);
});

async function shareAyah(row, btn) {
  if (!current) return;
  const ar = row.querySelector(".ar").textContent.replace(/\s+/g, " ").trim();
  const tr = row.querySelector(".tr").textContent.trim();
  const text = `${ar}\n\n${tr}\n\n— ${ruName(current.n)} сүрөсү, ${current.n}:${row.dataset.a}`;
  const done = (msg) => { const old = "⤴"; btn.textContent = msg; setTimeout(() => (btn.textContent = old), 1500); };
  try {
    if (navigator.share) { await navigator.share({ text }); return; }
  } catch (e) { if (e && e.name === "AbortError") return; }
  try { await navigator.clipboard.writeText(text); done("✓"); return; } catch (e) {}
  const t = document.createElement("textarea");
  t.value = text; t.style.position = "fixed"; t.style.opacity = "0";
  document.body.appendChild(t); t.select();
  try { document.execCommand("copy"); done("✓"); } catch (e) { done("!"); }
  t.remove();
}


/* котормонун текстинен издөө: бүт котормо биринчи жолу жүктөлөт */
let fullList = null;
async function loadFull() {
  if (fullList) return fullList;
  const list = [];
  let idx = 0, failed = 0;
  async function worker() {
    while (idx < 114) {
      const n = ++idx;
      try { (await fetchKy(n)).forEach((r, a) => list.push({ s: n, a, t: r.t })); } catch (e) { failed++; }
    }
  }
  await Promise.all(Array.from({ length: 6 }, worker));
  if (failed || list.length < 6000) throw new Error("incomplete");
  list.sort((x, y) => x.s - y.s || x.a - y.a);
  fullList = list;
  return list;
}
const tNorm = (t) => t.toLowerCase();
function highlight(text, q) {
  const i = tNorm(text).indexOf(q);
  if (i < 0 || tNorm(text).length !== text.length) return esc(text);
  return esc(text.slice(0, i)) + "<mark>" + esc(text.slice(i, i + q.length)) + "</mark>" + esc(text.slice(i + q.length));
}
let tGen = 0;
async function textSearch() {
  const box = $("t-results");
  const q = tNorm($("t-search").value.trim());
  const gen = ++tGen;
  box.hidden = false;
  if (q.length < 3) { box.textContent = "Эң аз 3 тамга киргизиңиз."; return; }
  box.textContent = "Издөө… биринчи жолу бүт котормо жүктөлөт.";
  try {
    const list = await loadFull();
    if (gen !== tGen) return;
    const found = list.filter((x) => tNorm(x.t).includes(q));
    if (!found.length) { box.textContent = "Эч нерсе табылган жок."; return; }
    const shown = found.slice(0, 40);
    box.innerHTML = `<p class="muted">Табылды: ${found.length}${found.length > shown.length ? " (алгачкы " + shown.length + " көрсөтүлдү)" : ""}</p>` +
      shown.map((x) => `<button class="t-hit" data-s="${x.s}" data-a="${x.a}"><b>${esc(ruName(x.s))}, ${x.s}:${x.a}</b><span>${highlight(x.t, q)}</span></button>`).join("");
  } catch (e) {
    if (gen === tGen) box.textContent = "Издөө аткарылган жок. Интернетти текшерип, кайра аракет кылыңыз.";
  }
}
$("t-go").addEventListener("click", textSearch);
$("t-search").addEventListener("keydown", (e) => { if (e.key === "Enter") textSearch(); });
$("t-results").addEventListener("click", (e) => {
  const b = e.target.closest(".t-hit");
  if (b) openSurah(Number(b.dataset.s), Number(b.dataset.a));
});

/* окуу максаты жана катары менен күндөр */
const dateKey = (d) => d.getFullYear() + "-" + String(d.getMonth() + 1).padStart(2, "0") + "-" + String(d.getDate()).padStart(2, "0");
function readLog() { const l = storeJSON("q_log", {}); return l && typeof l === "object" && !Array.isArray(l) ? l : {}; }
function dayCount(k) { const v = readLog()[k]; return Array.isArray(v) ? v.length : 0; }
function logRead(sura, ayah) {
  const log = readLog(), k = dateKey(new Date());
  const arr = Array.isArray(log[k]) ? log[k] : [];
  const id = sura + ":" + ayah;
  if (!arr.includes(id)) arr.push(id);
  log[k] = arr;
  Object.keys(log).sort().reverse().slice(60).forEach((old) => delete log[old]);
  store("q_log", JSON.stringify(log));
  renderGoal();
}
function renderGoal() {
  const goal = Number(store("q_goal")) || 0;
  const info = $("goal-info");
  if (!goal) { info.hidden = true; return; }
  const today = dayCount(dateKey(new Date()));
  const d = new Date();
  if (today < goal) d.setDate(d.getDate() - 1);
  let streak = 0;
  while (streak < 61 && dayCount(dateKey(d)) >= goal) { streak++; d.setDate(d.getDate() - 1); }
  info.hidden = false;
  info.textContent = `Бүгүн: ${today} / ${goal}` + (today >= goal ? " — максат аткарылды ✓" : "") + (streak ? ` · Катары менен: ${streak} күн` : "");
}
$("q-goal").addEventListener("change", (e) => { store("q_goal", e.target.value); renderGoal(); });


/* тафсир бир аяттан, ачык spa5k/tafsir_api базасынан (jsDelivr аркылуу) */
const TAFSIR_ROOT = "https://cdn.jsdelivr.net/gh/spa5k/tafsir_api@main/tafsir/";
const TAFSIRS = {
  tabari: { slug: "ar-tafsir-al-tabari", title: "Ат-Табарийдин тафсири (арабча)", ar: true },
};
let tafsirId = "tabari";
const tafsirCache = new Map();
function tafsirText(json) {
  const t = json && (json.text || (json.tafsir && json.tafsir.text) || (Array.isArray(json.ayahs) && json.ayahs[0] && json.ayahs[0].text));
  if (typeof t !== "string" || !t.trim()) throw new Error("no text");
  return plainText(t);
}
async function loadTafsir(id, s, a) {
  const key = id + "|" + s + ":" + a;
  if (tafsirCache.has(key)) return tafsirCache.get(key);
  const res = await fetch(`${TAFSIR_ROOT}${TAFSIRS[id].slug}/${s}/${a}.json`);
  if (!res.ok) throw new Error("http " + res.status);
  const text = tafsirText(await res.json());
  if (!text) throw new Error("empty");
  tafsirCache.set(key, text);
  return text;
}
async function toggleTafsir(row, btn) {
  const box = row.querySelector(".tafsir");
  if (!current) return;
  if (!box.hidden) { box.hidden = true; btn.classList.remove("on"); return; }
  const id = tafsirId, s = current.n, a = Number(row.dataset.a);
  box.hidden = false; btn.classList.add("on");
  box.textContent = "Тафсир жүктөлүүдө…";
  try {
    const text = await loadTafsir(id, s, a);
    if (!current || current.n !== s || box.hidden || tafsirId !== id) return;
    box.textContent = "";
    const head = document.createElement("p"); head.className = "tf-h"; head.textContent = TAFSIRS[id].title;
    const body = document.createElement("p"); body.className = "tf-t" + (TAFSIRS[id].ar ? " ar" : "");
    if (TAFSIRS[id].ar) { body.lang = "ar"; body.dir = "rtl"; }
    body.textContent = text;
    box.append(head, body);
  } catch (e) {
    box.textContent = "Бул аят үчүн тафсир жүктөлгөн жок. Интернетти текшерип, кайра аракет кылыңыз.";
  }
}

/* жаттоо */
let hifz = "off";
function applyHifz() {
  const r = $("q-reader");
  r.classList.remove("hifz-rest", "hifz-all");
  if (hifz !== "off") r.classList.add("hifz-" + hifz);
  $("hifz-hint").hidden = hifz === "off";
  document.querySelectorAll(".q-ayah.shown").forEach((x) => x.classList.remove("shown"));
}
$("q-hifz").addEventListener("change", (e) => {
  hifz = e.target.value;
  applyHifz();
  store("q_hifz", hifz);
});

/* сакталган окуу жөндөөлөрү */
(function restoreQuranPrefs() {
  const size = store("q_size");
  if (size) {
    $("q-size").value = size;
    document.documentElement.style.setProperty("--ar-size", size + "px");
  }
  const goal = store("q_goal");
  if (["5", "10", "20", "50"].includes(goal)) $("q-goal").value = goal;
  renderGoal();
  const rep = store("q_rep");
  if (["1", "3", "5", "10"].includes(rep)) $("q-rep").value = rep;
  const hf = store("q_hifz");
  if (hf === "rest" || hf === "all") { hifz = hf; $("q-hifz").value = hf; $("q-reader").classList.add("hifz-" + hf); }
  if (store("q_tr") === "0") {
    $("q-tr").checked = false;
    $("q-reader").classList.add("no-tr");
  }
})();

loadSurahList();

/* ================= Араб алфавити ================= */

const LETTERS = [
  ["ا", "Алиф", "а (үндүү тамганын ташуучусу)", 0],
  ["ب", "Ба", "б", 1],
  ["ت", "Та", "т", 1],
  ["ث", "Са", "тиштин ортосундагы «с»", 1],
  ["ج", "Жим", "ж", 1],
  ["ح", "Ха", "ичтен чыккан катуу «х»", 1],
  ["خ", "Ха", "кекиртектен чыккан «х»", 1],
  ["د", "Даль", "д", 0],
  ["ذ", "Заль", "тиштин ортосундагы «з»", 0],
  ["ر", "Ра", "р", 0],
  ["ز", "Зай", "з", 0],
  ["س", "Син", "с", 1],
  ["ش", "Шин", "ш", 1],
  ["ص", "Сад", "катуу (эмфатикалык) «с»", 1],
  ["ض", "Дад", "катуу «д»", 1],
  ["ط", "Та", "катуу «т»", 1],
  ["ظ", "За", "катуу «з»", 1],
  ["ع", "Айн", "кекиртек үнү «‘»", 1],
  ["غ", "Гайн", "кекиртектен чыккан «г»", 1],
  ["ف", "Фа", "ф", 1],
  ["ق", "Каф", "терең «к»", 1],
  ["ك", "Кяф", "к", 1],
  ["ل", "Лям", "л", 1],
  ["م", "Мим", "м", 1],
  ["ن", "Нун", "н", 1],
  ["ه", "Ха", "жумшак «h» (дем чыгаруу), «Аллаh» сыяктуу", 1],
  ["و", "Вав", "в / узун «у»", 0],
  ["ي", "Йа", "й / узун «и»", 1],
];
const ZWJ = "\u200d";
(function renderLetters() {
  $("letters").innerHTML = LETTERS.map(([ch, name, snd, joins], i) => {
    const iso = ch, fin = ZWJ + ch;
    const ini = joins ? ch + ZWJ : ch, med = joins ? ZWJ + ch + ZWJ : ZWJ + ch;
    return `<div class="letter">
      <span class="ln">${i + 1}</span>
      <span class="big ar" lang="ar">${iso}</span>
      <b>${esc(name)}</b><small>${esc(snd)}</small>
      <div class="forms ar" lang="ar" dir="rtl" title="аягы · ортосу · башы · өзүнчө">
        <span>${fin}</span><span>${med}</span><span>${ini}</span><span>${iso}</span>
      </div>
      ${joins ? "" : "<em>кийинки тамга менен кошулбайт</em>"}
    </div>`;
  }).join("");
  const B = "ب";
  const H = [
    ["َ", "Фатха", "кыска «а»: ба"], ["ِ", "Касра", "кыска «и»: би"], ["ُ", "Дамма", "кыска «у»: бу"],
    ["ْ", "Сукун", "үндүү жок: б"], ["ّ", "Шадда", "үнсүздү эки эсе кылат: бб"], ["ً", "Танвин фатх", "«-ан» аяктоосу"],
  ];
  $("harakat").innerHTML = H.map(([m, n, d]) => `<div class="hk"><span class="big ar" lang="ar">${B}${m}</span><b>${esc(n)}</b><small>${esc(d)}</small></div>`).join("");
})();

/* ================= Викторина ================= */

const QUIZ = [
  { t: "Шарттар", q: "Исламдын канча шарты бар?", a: ["5", "4", "6", "7"] },
  { t: "Шарттар", q: "Милдеттүү садаканын аталышы кандай?", a: ["Зекет", "Орозо", "Хаж", "Шахада"] },
  { t: "Шарттар", q: "Милдеттүү орозо кайсы айда кармалат?", a: ["Рамазан", "Мухаррам", "Ражап", "Шаабан"] },
  { t: "Шарттар", q: "Хаж кайсы шаарда аткарылат?", a: ["Мекке", "Медине", "Иерусалим", "Каир"] },
  { t: "Шарттар", q: "Бир суткада канча намаз милдеттүү?", a: ["5", "3", "4", "6"] },
  { t: "Пайгамбарлар", q: "Биринчи адам жана пайгамбар ким?", a: ["Адам", "Нух", "Ибрахим", "Идрис"] },
  { t: "Пайгамбарлар", q: "Кабаны уулу Исмаил менен бирге кайсы пайгамбар тургузган?", a: ["Ибрахим", "Муса", "Иса", "Жусуп"] },
  { t: "Пайгамбарлар", q: "Тавраат кайсы пайгамбарга түшүрүлгөн?", a: ["Муса", "Дауд", "Иса", "Сулайман"] },
  { t: "Пайгамбарлар", q: "Инжил кайсы пайгамбарга түшүрүлгөн?", a: ["Иса", "Муса", "Яхья", "Закария"] },
  { t: "Пайгамбарлар", q: "Забур кайсы пайгамбарга түшүрүлгөн?", a: ["Дауд", "Исхак", "Жакып", "Худ"] },
  { t: "Пайгамбарлар", q: "Акыркы пайгамбар ким?", a: ["Мухаммад ﷺ", "Иса", "Нух", "Ибрахим"] },
  { t: "Куран", q: "Куранда канча сүрө бар?", a: ["114", "99", "120", "30"] },
  { t: "Куран", q: "Куранды ачуучу биринчи сүрөнүн аты кандай?", a: ["Фатиха", "Бакара", "Ихлас", "Нас"] },
  { t: "Куран", q: "Эң узун сүрө кайсы?", a: ["Бакара", "Али Имран", "Ниса", "Кахф"] },
  { t: "Куран", q: "«Ихлас» сүрөсүндө канча аят бар?", a: ["4", "3", "5", "7"] },
  { t: "Куран", q: "Куран кайсы айда түшө баштаган?", a: ["Рамазан", "Зулхижа", "Мухаррам", "Рабиул-аввал"] },
  { t: "Куран", q: "Кайсы сүрө «Бисмиллях» менен башталбайт?", a: ["Тоба", "Анфал", "Кафирун", "Каусар"] },
  { t: "Аллаhтын ысымдары", q: "«Ар-Рахман» ысымынын мааниси кандай?", a: ["Ырайымдуу", "Бардыгын билүүчү", "Кудуреттүү", "Көп кечирүүчү"] },
  { t: "Аллаhтын ысымдары", q: "«Аль-‘Алим» ысымынын мааниси кандай?", a: ["Бардыгын билүүчү", "Баарын угуучу", "Баарын көрүүчү", "Акылман"] },
  { t: "Аллаhтын ысымдары", q: "«Ас-Сами‘» ысымынын мааниси кандай?", a: ["Баарын угуучу", "Баарын көрүүчү", "Мээримдүү", "Улуу"] },
  { t: "Аллаhтын ысымдары", q: "«Аль-Гаффар» ысымынын мааниси кандай?", a: ["Көп кечирүүчү", "Берүүчү", "Кудуреттүү", "Сактоочу"] },
  { t: "Аллаhтын ысымдары", q: "«Ар-Раззак» ысымынын мааниси кандай?", a: ["Рызык берүүчү", "Жаратуучу", "Өкүм чыгаруучу", "Биринчи"] },
];
// ар бир суроодо биринчи вариант — туура жооп; көрсөтүүдө тартиби аралаштырылат

let quizTopic = "Баары", quizState = null;
const shuffle = (arr) => { const a = arr.slice(); for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; } return a; };

function renderQuizTopics() {
  const topics = ["Баары", ...new Set(QUIZ.map((x) => x.t))];
  $("quiz-topics").innerHTML = topics.map((t) => `<button class="${t === quizTopic ? "on" : ""}" data-t="${esc(t)}">${esc(t)}</button>`).join("");
}
function quizBest() { const b = storeJSON("quiz_best", {}); return b && typeof b === "object" && !Array.isArray(b) ? b : {}; }
function startQuiz(source) {
  const review = Array.isArray(source);
  const pool = review ? source : QUIZ.filter((x) => quizTopic === "Баары" || x.t === quizTopic);
  const qs = shuffle(pool).slice(0, 10).map((x) => ({ src: x, q: x.q, right: x.a[0], opts: shuffle(x.a) }));
  quizState = { qs, i: 0, score: 0, picked: null, wrong: [], review };
  renderQuiz();
}
function renderQuiz() {
  const box = $("quiz-box"), st = quizState;
  if (!st) {
    const b = quizBest()[quizTopic];
    box.innerHTML = (b ? `<p class="muted">Тема боюнча эң мыкты жыйынтык: ${b.score} / ${b.total}</p>` : "") + `<button class="btn" id="quiz-start">Баштоо</button>`;
    return;
  }
  if (st.i >= st.qs.length) {
    let best = "";
    if (!st.review) {
      const all = quizBest(), old = all[quizTopic];
      if (!old || st.score / st.qs.length > old.score / old.total) {
        all[quizTopic] = { score: st.score, total: st.qs.length };
        store("quiz_best", JSON.stringify(all));
        best = old ? " Жаңы рекорд!" : "";
      }
    }
    box.innerHTML = `<p class="quiz-score">${st.review ? "Каталар боюнча иш" : "Жыйынтык"}: <b>${st.score}</b> / ${st.qs.length}</p>` +
      (best ? `<p class="muted">${best.trim()}</p>` : "") +
      (st.wrong.length ? `<button class="btn" id="quiz-retry">Каталарды кайталоо (${st.wrong.length})</button> ` : "") +
      `<button class="btn ghost" id="quiz-start">Жаңы айлампа</button>`;
    return;
  }
  const q = st.qs[st.i];
  box.innerHTML = `<p class="muted">Суроо ${st.i + 1} / ${st.qs.length}</p>
    <h3 class="quiz-q">${esc(q.q)}</h3>
    <div class="quiz-opts">${q.opts.map((o) => {
      let cls = "";
      if (st.picked !== null) cls = o === q.right ? "ok" : o === st.picked ? "bad" : "";
      return `<button class="${cls}" data-o="${esc(o)}" ${st.picked !== null ? "disabled" : ""}>${esc(o)}</button>`;
    }).join("")}</div>
    ${st.picked !== null ? `<button class="btn" id="quiz-next">${st.i + 1 === st.qs.length ? "Жыйынтык" : "Кийинки"}</button>` : ""}`;
}
$("quiz-topics").addEventListener("click", (e) => {
  const b = e.target.closest("button");
  if (!b) return;
  quizTopic = b.dataset.t; quizState = null;
  renderQuizTopics(); renderQuiz();
});
$("quiz-box").addEventListener("click", (e) => {
  const b = e.target.closest("button");
  if (!b) return;
  if (b.id === "quiz-start") return startQuiz();
  if (b.id === "quiz-retry" && quizState) return startQuiz(quizState.wrong.slice());
  if (b.id === "quiz-next") { quizState.i++; quizState.picked = null; return renderQuiz(); }
  if (b.dataset.o !== undefined && quizState && quizState.picked === null) {
    quizState.picked = b.dataset.o;
    if (b.dataset.o === quizState.qs[quizState.i].right) quizState.score++;
    else quizState.wrong.push(quizState.qs[quizState.i].src);
    renderQuiz();
  }
});
renderQuizTopics(); renderQuiz();

/* офлайн режим жана тиркеме катары орнотуу */
if ("serviceWorker" in navigator) {
  window.addEventListener("load", () => navigator.serviceWorker.register("sw.js").catch(() => {}));
}

/* котормонун версиясы (эгер data/ky/_meta.json бар болсо) */
fetch(KY_LOCAL + "_meta.json").then((r) => (r.ok ? r.json() : null)).then((m) => {
  if (m && m.fetched) $("ky-ver").textContent = " · жүктөлгөн күнү: " + m.fetched;
}).catch(() => {});
