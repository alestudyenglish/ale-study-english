// =====================================================================
// 🚦 NAVEGACIÓN — decide qué sección mostrar según la dirección (#/verbs, #/grammar/to-be...)
// =====================================================================
const NAV = [
  ["home", "🏠", tx("Inicio", "الرئيسية")],
  ["phrases", "🃏", tx("Frases", "عبارات")],
  ["verbs", "📚", tx("Verbos", "الأفعال")],
  ["practice", "🎯", tx("Practicar", "تدرّب")],
  ["grammar", "📖", tx("Gramática", "القواعد")],
  ["progress", "📊", tx("Progreso", "تقدّمي")],
];
// Secciones que "pertenecen" a la pestaña Practicar
const PRACTICE_CHILDREN = ["listening", "speaking", "conversation", "tutor", "games", "past"];

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
  // Los campos de texto se adaptan solos al idioma que escribas (inglés o árabe)
  $$("input[type=text], input[type=search], input:not([type])", view).forEach((i) => { if (!i.hasAttribute("dir")) i.setAttribute("dir", "auto"); });

  const active = PRACTICE_CHILDREN.includes(name) ? "practice" : name;
  $$(".navbtn").forEach((b) => b.classList.toggle("active", b.dataset.route === active));
  window.scrollTo(0, 0);
}

function updateHeader() {
  const l = Store.data.level;
  $("#levelBtn").innerHTML = `${LEVEL_INFO[l].emoji} ${l}`;
  const s = streakDays();
  $("#streakBtn").innerHTML = `🔥 ${s}`;
  $("#speedBtn").innerHTML = `${voiceRate() < 0.85 ? "🐢" : "🔊"} ${rateText()}`;
  $("#langBtn").innerHTML = NATIVE.flag;
}
const rateText = () => `${Number(voiceRate().toFixed(2))}x`;

// Botón rápido de velocidad: cada toque pasa a la siguiente (0.6 → 0.75 → 0.9 → 1 → 1.1)
function cycleSpeed() {
  const now = voiceRate();
  const next = RATE_STEPS.find((r) => r > now + 0.01) || RATE_STEPS[0];
  setVoiceRate(next);
  toast(`${next < 0.85 ? "🐢" : "🔊"} ${tx("Velocidad", "السرعة")} ${rateText()} · ${rateName(next)}`);
  speak("This is my speed now. Is it clear?");
}

// 🌐 Elegir idioma de ayuda (los textos en inglés no cambian)
function langOptionsHtml() {
  return Object.values(NATIVE_LANGS).map((l) => `
    <button class="list-item" data-lang-pick="${l.code}" dir="${l.dir}">
      <span class="ico">${l.flag}</span>
      <span class="txt"><b>${l.name} → English</b><span>${l.code === "es" ? "Ayuda y traducciones en español" : "المساعدة والترجمة بالعربية"}</span></span>
      <span>${l.code === LANG ? "✅" : ""}</span>
    </button>`).join("");
}
function bindLangOptions(root) {
  $$("[data-lang-pick]", root).forEach((b) => (b.onclick = () => {
    if (b.dataset.langPick === LANG) return closeSheet();
    toast(b.dataset.langPick === "ar" ? "ع العربية..." : "🇪🇸 Español...");
    setTimeout(() => setLanguage(b.dataset.langPick), 300);
  }));
}
function openLangSheet() {
  const sheet = openSheet(`<h2>🌐 Idioma · اللغة</h2>
    <p class="muted small">${tx("Elige en qué idioma quieres las explicaciones y traducciones. El inglés no cambia.", "اختر لغة الشرح والترجمة. الإنجليزية لا تتغيّر.")}</p>
    ${langOptionsHtml()}`);
  bindLangOptions(sheet);
}

// Ventana para elegir nivel
function openLevelSheet() {
  const sheet = openSheet(`
    <h2>🎯 ${tx("Elige tu nivel", "اختر مستواك")}</h2>
    <p class="muted small">${tx(`Solo verás contenido hasta tu nivel. Al completar ${UNLOCK_AT * 100}% de un nivel se abre el siguiente.`, `سترى المحتوى حتى مستواك فقط. عند إكمال ${UNLOCK_AT * 100}% من المستوى يُفتح المستوى التالي.`)}</p>
    ${LEVELS.map((l) => {
      const open = Store.data.unlocked.includes(l);
      const p = Math.round(levelProgress(l) * 100);
      return `<button class="list-item ${open ? "" : "locked"}" data-level="${l}">
        <span class="ico">${LEVEL_INFO[l].emoji}</span>
        <span class="txt"><b>${l} — ${LEVEL_INFO[l].name}</b><span>${open ? tx(`${p}% completado`, `${p}% مكتمل`) : tx("🔒 Bloqueado", "🔒 مقفل")}</span></span>
        <span>${Store.data.level === l ? "✅" : ""}</span>
      </button>`;
    }).join("")}
    <div class="card-box small" style="margin-top:8px">
      <label for="voiceRate" class="row"><b style="flex:1">🎚️ ${tx("Velocidad de la voz", "سرعة الصوت")}</b><b id="rateLabel">${rateText()} · ${rateName(voiceRate())}</b></label>
      <input type="range" id="voiceRate" min="0.5" max="1.2" step="0.05" value="${voiceRate()}" style="width:100%;margin-top:8px;accent-color:var(--accent)" dir="ltr">
      <div class="row muted" style="font-size:0.75rem" dir="ltr"><span>🐢 ${tx("Muy lenta", "بطيئة جدًا")}</span><span class="spacer"></span><span>${tx("Normal", "عادية")}</span><span class="spacer"></span><span>${tx("Rápida", "سريعة")} 🐇</span></div>
      <div style="margin-top:10px">${voiceInfoHtml()}</div>
    </div>
    <div class="section-title">🌐 ${tx("Idioma de ayuda", "لغة المساعدة")}</div>
    ${langOptionsHtml()}`);
  bindLangOptions(sheet);
  const sample = "Hi! I go walking on the beach after work. How about you?";
  $("#testVoice", sheet).onclick = () => speak(sample);
  const picker = $("#voicePick", sheet);
  if (picker) picker.onchange = () => {
    Store.data.voiceName = picker.value || null; // vacío = elegir automáticamente
    Store.save();
    speak(sample);
    toast(picker.value ? tx("🔊 Voz guardada", "🔊 تم حفظ الصوت") : tx("🔊 Voz automática", "🔊 صوت تلقائي"));
  };
  $$("[data-level]", sheet).forEach((b) => (b.onclick = () => {
    const l = b.dataset.level;
    if (!Store.data.unlocked.includes(l) && !confirm(tx(`El nivel ${l} aún está bloqueado. ¿Quieres abrirlo igual?`, `المستوى ${l} ما زال مقفلًا. هل تريد فتحه رغم ذلك؟`))) return;
    closeSheet();
    setLevel(l);
    toast(`${LEVEL_INFO[l].emoji} ${tx("Nivel", "المستوى")} ${l} · ${LEVEL_INFO[l].name}`);
  }));
  const rate = $("#voiceRate", sheet);
  rate.oninput = () => { setVoiceRate(Number(rate.value)); $("#rateLabel", sheet).textContent = `${rateText()} · ${rateName(voiceRate())}`; };
  rate.onchange = () => speak(sample); // al soltar la barra, escuchas cómo suena
}

// Muestra qué voz se está usando y, si no hay voz en inglés, cómo instalarla
function voiceInfoHtml() {
  Voice.refresh();
  const v = Voice.best();
  if (v) {
    const voices = Voice.ranked();
    const natural = voices.some((x) => /natural|google/i.test(x.name));
    return `<b>🔊 ${tx("Voz en inglés", "الصوت الإنجليزي")}</b>
      <div class="row" style="margin-top:6px">
        <select id="voicePick" class="search" style="padding:10px;font-size:0.9rem" dir="ltr">
          <option value="">✨ ${tx("Automática (la más natural)", "تلقائي (الأكثر طبيعية)")}: ${escapeHtml(voices[0].name)}</option>
          ${voices.map((x) => `<option value="${escapeHtml(x.name)}" ${Store.data.voiceName === x.name ? "selected" : ""}>${/natural|google/i.test(x.name) ? "⭐ " : ""}${escapeHtml(x.name)}</option>`).join("")}
        </select>
        <button class="icon-btn" id="testVoice">▶️</button>
      </div>
      <div class="muted" style="margin-top:6px">${tx("Las voces con ⭐ suenan más humanas.", "الأصوات التي عليها ⭐ تبدو أكثر طبيعية.")}${natural ? "" : tx(" 💡 Para voces más naturales, abre la app en <b>Microsoft Edge</b>.", " 💡 للحصول على أصوات أكثر طبيعية، افتح التطبيق في <b>Microsoft Edge</b>.")}</div>`;
  }
  return `<button class="icon-btn" id="testVoice" hidden></button>
    ${tx(`⚠️ <b>Tu navegador no tiene una voz en inglés</b>, por eso el audio puede sonar con acento español o no sonar.<br>
    Soluciones:<br>
    1️⃣ Abre la app con <b>Microsoft Edge</b> (trae voces naturales en inglés) o <b>Chrome</b>.<br>
    2️⃣ O instala una voz en Windows: <i>Configuración → Hora e idioma → Voz → Agregar voces → English (United States)</i>, y reinicia el navegador.`,
    `⚠️ <b>متصفحك لا يحتوي على صوت إنجليزي</b>، لذلك قد يُنطق الصوت بلكنة أخرى أو لا يعمل.<br>
    الحلول:<br>
    1️⃣ افتح التطبيق في <b>Microsoft Edge</b> (فيه أصوات إنجليزية طبيعية) أو <b>Chrome</b>.<br>
    2️⃣ أو ثبّت صوتًا في ويندوز: <i>الإعدادات ← الوقت واللغة ← الكلام ← إضافة أصوات ← English (United States)</i>، ثم أعد تشغيل المتصفح.`)}`;
}

// ---------- Inicio de la app ----------
$("#bottomnav").innerHTML = `<div class="bottomnav-inner">${NAV.map(([r, ico, label]) =>
  `<button class="navbtn" data-route="${r}"><span class="ico">${ico}</span>${label}</button>`).join("")}</div>`;
$$(".navbtn").forEach((b) => (b.onclick = () => go(b.dataset.route)));
$("#levelBtn").onclick = openLevelSheet;
$("#streakBtn").onclick = () => go("progress");
$("#speedBtn").onclick = cycleSpeed;
$("#langBtn").onclick = openLangSheet;
$("#levelBtn").title = tx("Cambiar nivel", "تغيير المستوى");
$("#streakBtn").title = tx("Mi progreso", "تقدّمي");
$("#speedBtn").title = tx("Velocidad de la voz (toca para cambiar)", "سرعة الصوت (اضغط للتغيير)");
$(".logo").onclick = () => go("home");
window.addEventListener("hashchange", () => { render(); updateHeader(); });

updateHeader();
render();

// 📱 Preparado para instalar como app en el celular (solo funciona desde un servidor, no con doble clic)
// En el computador (localhost) no se usa, para que siempre veas los cambios al instante.
const isLocal = ["localhost", "127.0.0.1"].includes(location.hostname);
if ("serviceWorker" in navigator && location.protocol === "https:" && !isLocal) {
  // updateViaCache "none": el teléfono siempre revisa si hay un sw.js nuevo
  navigator.serviceWorker.register("sw.js", { updateViaCache: "none" })
    .then((reg) => {
      reg.update();
      // Al volver a abrir la app (desde segundo plano), revisar si hay actualización
      document.addEventListener("visibilitychange", () => { if (!document.hidden) reg.update(); });
    })
    .catch(() => {});
  // Cuando llega una versión nueva, recargar una vez para mostrarla
  // (la primera vez que se instala no hace falta recargar)
  let reloaded = false;
  const hadVersion = !!navigator.serviceWorker.controller;
  navigator.serviceWorker.addEventListener("controllerchange", () => {
    if (reloaded || !hadVersion) return;
    reloaded = true;
    toast(tx("✨ App actualizada", "✨ تم تحديث التطبيق"));
    setTimeout(() => location.reload(), 600);
  });
} else if ("serviceWorker" in navigator && isLocal) {
  navigator.serviceWorker.getRegistrations().then((rs) => rs.forEach((r) => r.unregister())).catch(() => {});
}
