// =====================================================================
// ⚙️ NÚCLEO — piezas que usan todas las secciones
// ---------------------------------------------------------------------
//  1. Utilidades ($, escapeHtml, normalize...)
//  2. Progreso guardado en el navegador (Store)
//  3. Niveles A1 → B2
//  4. Audio: escuchar (voz del navegador) y hablar (micrófono)
//  5. Piezas visuales: toast, ventana emergente, comparación de palabras
// =====================================================================
const App = { sections: {}, cleanup: null };

// ---------- 1. Utilidades ----------
const $ = (sel, root = document) => root.querySelector(sel);
const $$ = (sel, root = document) => [...root.querySelectorAll(sel)];

function escapeHtml(s) {
  return String(s).replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
}
// Quita tildes, mayúsculas y signos para comparar respuestas
function normalize(s) {
  return String(s).toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "")
    .replace(/[’‘`]/g, "'").replace(/[.,!?¿¡;:"“”()]/g, " ").replace(/\s+/g, " ").trim();
}
function shuffle(arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}
const pick = (arr) => arr[Math.floor(Math.random() * arr.length)];
function todayStr(d = new Date()) {
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
}
function go(path) { location.hash = "#/" + path; }
// Crea un elemento a partir de HTML
function html(str) {
  const t = document.createElement("template");
  t.innerHTML = str.trim();
  return t.content.firstElementChild;
}

// ---------- 2. Progreso (se guarda solo en este navegador) ----------
const Store = {
  key: "everyday-english-v2",
  data: null,
  defaults() {
    return {
      level: "A1",
      unlocked: ["A1"],
      verbs: {},       // { eat: { ok, bad, streak, mastered } }
      grammar: {},     // { "to-be": { best, done } }
      convs: {},       // { cafe: { done, times } }
      stats: { correct: 0, wrong: 0, listenOk: 0, listenTotal: 0, speakTotal: 0, speakPerfect: 0 },
      days: [],        // días en que practicaste
      slowVoice: false,
    };
  },
  load() {
    let saved = {};
    try { saved = JSON.parse(localStorage.getItem(this.key)) || {}; } catch (e) {}
    const d = this.defaults();
    this.data = { ...d, ...saved, stats: { ...d.stats, ...(saved.stats || {}) } };
  },
  save() {
    try { localStorage.setItem(this.key, JSON.stringify(this.data)); } catch (e) {}
  },
};
Store.load();

// Estado de las frases (se mantiene la clave original para no perder el progreso)
const PHRASE_KEY = "everyday-english-status";
let phraseStatus = {};
try { phraseStatus = JSON.parse(localStorage.getItem(PHRASE_KEY)) || {}; } catch (e) {}
const statusOf = (p) => phraseStatus[p.english] || "new";
function setPhraseStatus(p, status) {
  phraseStatus[p.english] = status;
  try { localStorage.setItem(PHRASE_KEY, JSON.stringify(phraseStatus)); } catch (e) {}
  markDay();
  checkUnlocks();
}

function markDay() {
  const t = todayStr();
  if (!Store.data.days.includes(t)) { Store.data.days.push(t); Store.save(); }
}
function recordAnswer(ok) {
  Store.data.stats[ok ? "correct" : "wrong"]++;
  markDay();
  Store.save();
}
// Un verbo queda "dominado" con 3 respuestas correctas seguidas
function recordVerb(base, ok) {
  const v = Store.data.verbs[base] || (Store.data.verbs[base] = { ok: 0, bad: 0, streak: 0, mastered: false });
  if (ok) { v.ok++; v.streak++; if (v.streak >= 3) v.mastered = true; }
  else { v.bad++; v.streak = 0; v.mastered = false; }
  Store.save();
  checkUnlocks();
}
const verbState = (base) => Store.data.verbs[base] || { ok: 0, bad: 0, streak: 0, mastered: false };

function streakDays() {
  const days = new Set(Store.data.days);
  const d = new Date();
  if (!days.has(todayStr(d))) d.setDate(d.getDate() - 1); // si hoy aún no practicas, cuenta desde ayer
  let n = 0;
  while (days.has(todayStr(d))) { n++; d.setDate(d.getDate() - 1); }
  return n;
}

// ---------- 3. Niveles ----------
const LEVELS = ["A1", "A2", "B1", "B2"];
const LEVEL_INFO = {
  A1: { name: "Básico", emoji: "🌱" },
  A2: { name: "Elemental", emoji: "🌿" },
  B1: { name: "Intermedio", emoji: "🌳" },
  B2: { name: "Intermedio alto", emoji: "🏔️" },
};
const UNLOCK_AT = 0.5; // con 50% del nivel completado se abre el siguiente
const levelIdx = (l) => LEVELS.indexOf(l);
// ¿Este contenido se muestra con el nivel elegido?
const allowed = (item) => levelIdx(item.level) <= levelIdx(Store.data.level);

function levelProgress(level) {
  const parts = [];
  const ph = PHRASES.filter((p) => p.level === level);
  if (ph.length) parts.push(ph.filter((p) => statusOf(p) === "known").length / ph.length);
  const vb = VERBS.filter((v) => v.level === level);
  if (vb.length) parts.push(vb.filter((v) => verbState(v.base).mastered).length / vb.length);
  const gr = GRAMMAR.filter((g) => g.level === level);
  if (gr.length) parts.push(gr.filter((g) => Store.data.grammar[g.id]?.done).length / gr.length);
  return parts.length ? parts.reduce((a, b) => a + b, 0) / parts.length : 0;
}
function checkUnlocks() {
  LEVELS.forEach((lvl, i) => {
    const next = LEVELS[i + 1];
    if (next && Store.data.unlocked.includes(lvl) && !Store.data.unlocked.includes(next) && levelProgress(lvl) >= UNLOCK_AT) {
      Store.data.unlocked.push(next);
      Store.save();
      toast(`🎉 ¡Desbloqueaste el nivel ${next}!`);
    }
  });
}
function setLevel(level) {
  Store.data.level = level;
  if (!Store.data.unlocked.includes(level)) Store.data.unlocked.push(level);
  Store.save();
  updateHeader();
  render();
}

// ---------- 4a. Escuchar: voz del navegador (gratis, sin internet) ----------
// Elige la voz en inglés más clara disponible:
// 1) voces "Natural" de Microsoft (Edge)  2) voces de Google (Chrome)
// 3) voces del sistema (Samantha, Zira...)  → nunca una voz en español
const Voice = {
  list: [],
  warned: false,
  refresh() { if ("speechSynthesis" in window) this.list = speechSynthesis.getVoices(); },
  english() { return this.list.filter((v) => /^en[-_]/i.test(v.lang)); },
  // Nombres de voces masculinas conocidas (Edge, Chrome, Windows, iPhone)
  MALE: /\b(guy|andrew|brian|christopher|eric|davis|roger|steffan|ryan|william|liam|thomas|connor|mitchell|david|mark|george|james|daniel|alex|aaron|fred|tom|jorge|raul|raúl|alvaro|álvaro|gonzalo|lorenzo|cristian|tomas|tomás|diego|emilio|pablo|juan|male)\b/i,
  best(lang = "en-US", { male = false } = {}) {
    const score = (v) => {
      const n = v.name.toLowerCase(), l = v.lang.replace("_", "-");
      let s = male && this.MALE.test(v.name) ? 60 : 0;
      if (l === lang) s += 50;
      else if (l === "en-US") s += 30;
      else if (l === "en-GB" || l === "en-AU") s += 20;
      if (n.includes("natural")) s += 40;
      if (n.includes("google")) s += 35;
      if (n.includes("online")) s += 5;
      if (!male && /samantha|aria|jenny|ava|allison|karen|catherine|natasha|zira/.test(n)) s += 8;
      if (/compact|eloquence|espeak|novelty|bad news|bells|whisper|zarvox|trinoids|albert/.test(n)) s -= 60;
      return s;
    };
    return this.english().sort((a, b) => score(b) - score(a))[0] || null;
  },
  // Mejor voz en español (prefiere Latinoamérica y voces "Natural")
  bestSpanish({ male = false } = {}) {
    const es = this.list.filter((v) => /^es[-_]/i.test(v.lang));
    const score = (v) => {
      const n = v.name.toLowerCase(), l = v.lang.replace("_", "-");
      return (male && this.MALE.test(v.name) ? 60 : 0) + (/natural/.test(n) ? 40 : 0) + (/google/.test(n) ? 30 : 0) + (["es-MX", "es-US", "es-CO", "es-CL", "es-419"].includes(l) ? 20 : 0);
    };
    return es.sort((a, b) => score(b) - score(a))[0] || null;
  },
};
if ("speechSynthesis" in window) {
  Voice.refresh();
  speechSynthesis.addEventListener?.("voiceschanged", () => Voice.refresh());
}

function speak(text, opts = {}) {
  if (!("speechSynthesis" in window)) { toast("Tu navegador no puede leer en voz alta 😢"); return; }
  if (!Voice.list.length) Voice.refresh();
  const clean = String(text)
    .replace(/[\p{Extended_Pictographic}\u{1F1E6}-\u{1F1FF}️‍]/gu, "") // sin emojis (la voz los leería)
    .replace(/\.\.\./g, " ").replace(/\s*\/\s*/g, ", ").trim();
  if (!clean) return;
  const u = new SpeechSynthesisUtterance(clean);
  u.lang = opts.lang || "en-US";
  u.rate = opts.slow || Store.data.slowVoice ? 0.7 : 0.92;
  u.pitch = 1;
  const voice = Voice.best(u.lang);
  if (voice) { u.voice = voice; u.lang = voice.lang; }
  else if (!Voice.warned && Voice.list.length) {
    Voice.warned = true;
    toast("⚠️ No hay voz en inglés instalada. Toca tu nivel (arriba) para ver cómo arreglarlo");
  }
  // Chrome a veces se "traba" si se habla justo después de cancelar: esperamos un instante
  const wasBusy = speechSynthesis.speaking || speechSynthesis.pending;
  speechSynthesis.cancel();
  if (wasBusy) setTimeout(() => speechSynthesis.speak(u), 80);
  else speechSynthesis.speak(u);
}
// Las frases de Australia se leen con acento australiano (si el sistema lo tiene)
const langFor = (p) => (p && p.category && p.category.includes("Australia") ? "en-AU" : "en-US");

// ---------- 4b. Hablar: reconocimiento de voz ----------
// Funciona en Chrome y Edge (computador y Android) y Safari. Necesita internet
// y permiso del micrófono. Es gratis: lo incluye el navegador.
const SpeechRec = window.SpeechRecognition || window.webkitSpeechRecognition;
let activeRec = null;

function stopListening() {
  if (activeRec) { try { activeRec.abort(); } catch (e) {} activeRec = null; }
}
const MIC_ERRORS = {
  "not-allowed": "🔒 El micrófono está bloqueado. Dale permiso en el navegador. Si abriste la app con doble clic, usa <b>iniciar.bat</b>.",
  "service-not-allowed": "🔒 El navegador no permite usar el micrófono aquí. Abre la app con <b>iniciar.bat</b>.",
  "no-speech": "🤔 No te escuché. Toca el micrófono y habla de nuevo.",
  "audio-capture": "🎙️ No encontré un micrófono conectado.",
  network: "📶 El reconocimiento de voz necesita internet.",
};

// Crea el bloque: botón grande de micrófono + texto escuchado + campo para escribir
function micWidget(onFinal, { placeholder = "O escribe tu respuesta aquí..." } = {}) {
  const el = html(`
    <div class="mic-wrap">
      <button class="mic" type="button" title="Hablar">🎤</button>
      <div class="mic-status"></div>
      <div class="transcript"></div>
      <form class="type-row">
        <input type="text" placeholder="${escapeHtml(placeholder)}" autocomplete="off" autocapitalize="off">
        <button class="btn" type="submit">➤</button>
      </form>
    </div>`);
  const btn = $(".mic", el), status = $(".mic-status", el), tr = $(".transcript", el);
  if (!SpeechRec) {
    btn.disabled = true; btn.style.opacity = 0.4;
    status.innerHTML = "Tu navegador no reconoce voz. Usa <b>Chrome</b> o <b>Edge</b>. Mientras, puedes escribir 👇";
  } else {
    status.textContent = "Toca el micrófono y habla en inglés";
  }
  btn.onclick = () => {
    if (activeRec) { activeRec.stop(); return; }
    const rec = new SpeechRec();
    rec.lang = "en-US"; rec.interimResults = true; rec.maxAlternatives = 1;
    let finalText = "";
    rec.onresult = (e) => {
      let text = "";
      for (let i = 0; i < e.results.length; i++) text += e.results[i][0].transcript;
      tr.textContent = `“${text}”`;
      if (e.results[e.results.length - 1].isFinal) finalText = text;
    };
    rec.onerror = (e) => { status.innerHTML = MIC_ERRORS[e.error] || "Algo falló con el micrófono 😅 (" + e.error + ")"; };
    rec.onend = () => {
      btn.classList.remove("on"); activeRec = null;
      if (finalText.trim()) { status.textContent = "Esto entendí 👆"; onFinal(finalText.trim()); }
      else if (!status.innerHTML.includes("🔒") && !status.innerHTML.includes("📶")) status.textContent = "Toca el micrófono y habla en inglés";
    };
    stopListening();
    activeRec = rec;
    btn.classList.add("on"); status.textContent = "🔴 Escuchando... habla ahora"; tr.textContent = "";
    try { rec.start(); } catch (e) { status.textContent = "No pude iniciar el micrófono 😅"; }
  };
  $("form", el).onsubmit = (e) => {
    e.preventDefault();
    const input = $("input", el);
    if (!input.value.trim()) return;
    tr.textContent = `“${input.value.trim()}”`;
    onFinal(input.value.trim());
    input.value = "";
  };
  return el;
}

// ---------- 5. Piezas visuales ----------
let toastTimer;
function toast(msg) {
  const t = $("#toast");
  t.innerHTML = msg;
  t.classList.add("show");
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => t.classList.remove("show"), 1800);
}

function openSheet(innerHtml) {
  const back = html(`<div class="sheet-backdrop"><div class="sheet">${innerHtml}</div></div>`);
  back.onclick = (e) => { if (e.target === back) closeSheet(); };
  document.body.appendChild(back);
  return $(".sheet", back);
}
function closeSheet() { $$(".sheet-backdrop").forEach((s) => s.remove()); stopListening(); }

// Botón 🔊 reutilizable: <button data-say="texto">
document.addEventListener("click", (e) => {
  const b = e.target.closest("[data-say]");
  if (!b) return;
  e.stopPropagation();
  speak(b.dataset.say, { lang: b.dataset.lang, slow: b.dataset.slow === "1" });
});
const sayBtn = (text, label = "🔊", extra = "") =>
  `<button class="icon-btn" type="button" data-say="${escapeHtml(text)}" ${extra} title="Escuchar">${label}</button>`;

// Compara palabra por palabra lo que dijiste/escribiste con la frase correcta
function wordDiff(target, said) {
  const clean = (w) => normalize(w).replace(/'/g, "");
  const t = target.split(/\s+/).filter(Boolean);
  const tn = t.map(clean);
  const sn = normalize(said).replace(/'/g, "").split(" ").filter(Boolean);
  // Subsecuencia común más larga (LCS)
  const dp = Array.from({ length: tn.length + 1 }, () => Array(sn.length + 1).fill(0));
  for (let i = tn.length - 1; i >= 0; i--)
    for (let j = sn.length - 1; j >= 0; j--)
      dp[i][j] = tn[i] === sn[j] ? dp[i + 1][j + 1] + 1 : Math.max(dp[i + 1][j], dp[i][j + 1]);
  const ok = Array(tn.length).fill(false);
  let i = 0, j = 0;
  while (i < tn.length && j < sn.length) {
    if (tn[i] === sn[j]) { ok[i] = true; i++; j++; }
    else if (dp[i + 1][j] >= dp[i][j + 1]) i++;
    else j++;
  }
  const hits = ok.filter(Boolean).length;
  return {
    score: tn.length ? hits / Math.max(tn.length, sn.length) : 0,
    html: t.map((w, k) => `<span class="${ok[k] ? "w-ok" : "w-bad"}">${escapeHtml(w)}</span>`).join(" "),
  };
}

// Ventana para practicar la pronunciación de una frase
function pronounceSheet(text, lang = "en-US") {
  const sheet = openSheet(`
    <h2>🎤 Dilo tú</h2>
    <div class="card-box"><div class="big" style="font-size:1.3rem">${escapeHtml(text)}</div>
      <div class="btn-row" style="margin-top:12px">${sayBtn(text, "🔊 Escuchar", `data-lang="${lang}"`)}${sayBtn(text, "🐢 Lento", `data-lang="${lang}" data-slow="1"`)}</div>
    </div>
    <div class="mic-slot"></div>
    <div class="result"></div>
    <button class="btn ghost block" style="margin-top:10px">Cerrar</button>`);
  $(".btn.ghost", sheet).onclick = closeSheet;
  $(".mic-slot", sheet).appendChild(micWidget((said) => {
    const d = wordDiff(text, said);
    const pct = Math.round(d.score * 100);
    const ok = pct >= 80;
    Store.data.stats.speakTotal++; if (ok) Store.data.stats.speakPerfect++;
    markDay(); Store.save();
    $(".result", sheet).innerHTML = `
      <div class="feedback ${ok ? "ok" : "no"}">
        <div class="fb-title">${pct >= 95 ? "🔥 ¡Perfecto!" : ok ? "✅ ¡Muy bien!" : "💪 ¡Casi! Inténtalo otra vez"} (${pct}%)</div>
        <div>${d.html}</div>
        <div class="small muted" style="margin-top:6px">🟢 palabras que entendí · 🔴 palabras que faltaron o sonaron distinto</div>
      </div>`;
  }, { placeholder: "O escríbela para practicar..." }));
}
