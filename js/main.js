// =====================================================================
// 🚦 NAVEGACIÓN — decide qué sección mostrar según la dirección (#/verbs, #/grammar/to-be...)
// =====================================================================
const NAV = [
  ["home", "🏠", "Inicio"],
  ["phrases", "🃏", "Frases"],
  ["verbs", "📚", "Verbos"],
  ["practice", "🎯", "Practicar"],
  ["grammar", "📖", "Gramática"],
  ["progress", "📊", "Progreso"],
];
// Secciones que "pertenecen" a la pestaña Practicar
const PRACTICE_CHILDREN = ["listening", "speaking", "conversation", "tutor", "games"];

function render() {
  if (App.cleanup) { App.cleanup(); App.cleanup = null; }
  stopListening();
  if ("speechSynthesis" in window) speechSynthesis.cancel();
  closeSheet();

  const [name = "home", ...args] = location.hash.replace(/^#\/?/, "").split("/").filter(Boolean);
  const section = App.sections[name] || App.sections.home;
  const view = $("#view");
  view.innerHTML = "";
  section.render(view, ...args.map(decodeURIComponent));

  const active = PRACTICE_CHILDREN.includes(name) ? "practice" : name;
  $$(".navbtn").forEach((b) => b.classList.toggle("active", b.dataset.route === active));
  window.scrollTo(0, 0);
}

function updateHeader() {
  const l = Store.data.level;
  $("#levelBtn").innerHTML = `${LEVEL_INFO[l].emoji} ${l}`;
  const s = streakDays();
  $("#streakBtn").innerHTML = `🔥 ${s}`;
}

// Ventana para elegir nivel
function openLevelSheet() {
  const sheet = openSheet(`
    <h2>🎯 Elige tu nivel</h2>
    <p class="muted small">Solo verás contenido hasta tu nivel. Al completar ${UNLOCK_AT * 100}% de un nivel se abre el siguiente.</p>
    ${LEVELS.map((l) => {
      const open = Store.data.unlocked.includes(l);
      const p = Math.round(levelProgress(l) * 100);
      return `<button class="list-item ${open ? "" : "locked"}" data-level="${l}">
        <span class="ico">${LEVEL_INFO[l].emoji}</span>
        <span class="txt"><b>${l} — ${LEVEL_INFO[l].name}</b><span>${open ? `${p}% completado` : "🔒 Bloqueado"}</span></span>
        <span>${Store.data.level === l ? "✅" : ""}</span>
      </button>`;
    }).join("")}
    <div class="card-box small" style="margin-top:8px">
      <label class="row"><input type="checkbox" id="slowVoice" ${Store.data.slowVoice ? "checked" : ""}> 🐢 Voz más lenta en toda la app</label>
      <div style="margin-top:10px">${voiceInfoHtml()}</div>
    </div>`);
  const sample = "Hi! I go walking on the beach after work. How about you?";
  $("#testVoice", sheet).onclick = () => speak(sample);
  const picker = $("#voicePick", sheet);
  if (picker) picker.onchange = () => {
    Store.data.voiceName = picker.value || null; // vacío = elegir automáticamente
    Store.save();
    speak(sample);
    toast(picker.value ? "🔊 Voz guardada" : "🔊 Voz automática");
  };
  $$("[data-level]", sheet).forEach((b) => (b.onclick = () => {
    const l = b.dataset.level;
    if (!Store.data.unlocked.includes(l) && !confirm(`El nivel ${l} aún está bloqueado. ¿Quieres abrirlo igual?`)) return;
    closeSheet();
    setLevel(l);
    toast(`${LEVEL_INFO[l].emoji} Nivel ${l} · ${LEVEL_INFO[l].name}`);
  }));
  $("#slowVoice", sheet).onchange = (e) => { Store.data.slowVoice = e.target.checked; Store.save(); };
}

// Muestra qué voz se está usando y, si no hay voz en inglés, cómo instalarla
function voiceInfoHtml() {
  Voice.refresh();
  const v = Voice.best();
  if (v) {
    const voices = Voice.ranked();
    const natural = voices.some((x) => /natural|google/i.test(x.name));
    return `<b>🔊 Voz en inglés</b>
      <div class="row" style="margin-top:6px">
        <select id="voicePick" class="search" style="padding:10px;font-size:0.9rem">
          <option value="">✨ Automática (la más natural): ${escapeHtml(voices[0].name)}</option>
          ${voices.map((x) => `<option value="${escapeHtml(x.name)}" ${Store.data.voiceName === x.name ? "selected" : ""}>${/natural|google/i.test(x.name) ? "⭐ " : ""}${escapeHtml(x.name)}</option>`).join("")}
        </select>
        <button class="icon-btn" id="testVoice">▶️</button>
      </div>
      <div class="muted" style="margin-top:6px">Las voces con ⭐ suenan más humanas.${natural ? "" : " 💡 Para voces más naturales, abre la app en <b>Microsoft Edge</b>."}</div>`;
  }
  return `<button class="icon-btn" id="testVoice" hidden></button>
    ⚠️ <b>Tu navegador no tiene una voz en inglés</b>, por eso el audio puede sonar con acento español o no sonar.<br>
    Soluciones:<br>
    1️⃣ Abre la app con <b>Microsoft Edge</b> (trae voces naturales en inglés) o <b>Chrome</b>.<br>
    2️⃣ O instala una voz en Windows: <i>Configuración → Hora e idioma → Voz → Agregar voces → English (United States)</i>, y reinicia el navegador.`;
}

// ---------- Inicio de la app ----------
$("#bottomnav").innerHTML = `<div class="bottomnav-inner">${NAV.map(([r, ico, label]) =>
  `<button class="navbtn" data-route="${r}"><span class="ico">${ico}</span>${label}</button>`).join("")}</div>`;
$$(".navbtn").forEach((b) => (b.onclick = () => go(b.dataset.route)));
$("#levelBtn").onclick = openLevelSheet;
$("#streakBtn").onclick = () => go("progress");
$(".logo").onclick = () => go("home");
window.addEventListener("hashchange", () => { render(); updateHeader(); });

updateHeader();
render();

// 📱 Preparado para instalar como app en el celular (solo funciona desde un servidor, no con doble clic)
// En el computador (localhost) no se usa, para que siempre veas los cambios al instante.
const isLocal = ["localhost", "127.0.0.1"].includes(location.hostname);
if ("serviceWorker" in navigator && location.protocol === "https:" && !isLocal) {
  navigator.serviceWorker.register("sw.js").catch(() => {});
} else if ("serviceWorker" in navigator && isLocal) {
  navigator.serviceWorker.getRegistrations().then((rs) => rs.forEach((r) => r.unregister())).catch(() => {});
}
