// 🏠 INICIO — resumen del día y acceso a todas las secciones
App.sections.home = {
  render(view) {
    const lvl = Store.data.level;
    const idx = levelIdx(lvl);
    const next = LEVELS[idx + 1];
    const pct = Math.round(levelProgress(lvl) * 100);
    const streak = streakDays();
    const practicedToday = Store.data.days.includes(todayStr());

    // Frase del día: cambia cada día
    const pool = PHRASES.filter(allowed);
    const dayNum = Math.floor(Date.now() / 86400000);
    const phrase = pool[dayNum % pool.length];

    view.innerHTML = `
      <div class="hero">
        <h2>${practicedToday ? "Nice work today! 🔥" : "Hey there! 👋"}</h2>
        <div>${streak ? `🔥 Racha de <b>${streak} día${streak > 1 ? "s" : ""}</b>` : "¡Practica hoy para empezar tu racha!"}</div>
        <div style="margin-top:10px">${LEVEL_INFO[lvl].emoji} Nivel <b>${lvl}</b> · ${LEVEL_INFO[lvl].name} — ${pct}% completado</div>
        <div class="bar"><div style="width:${pct}%"></div></div>
        ${next && !Store.data.unlocked.includes(next) ? `<div class="small" style="margin-top:6px;opacity:.9">Llega a ${UNLOCK_AT * 100}% para desbloquear ${next}</div>` : ""}
      </div>

      <div class="card-box">
        <div class="label" style="text-align:left">🌟 Frase del día</div>
        <div class="row">
          <div style="flex:1">
            <div class="big" style="font-size:1.3rem">${escapeHtml(phrase.english)}</div>
            <div class="muted">🇪🇸 ${escapeHtml(phrase.spanish)}</div>
          </div>
          ${sayBtn(phrase.english, "🔊", `data-lang="${langFor(phrase)}"`)}
        </div>
      </div>

      <div class="btn-row" style="margin-bottom:14px">
        <button class="btn" onclick="go('tutor')">🗣️ Hablar con Alexis</button>
        <button class="btn soft" onclick="go('practice/review')">🔁 Repaso rápido</button>
      </div>

      <div class="section-title">🧭 Tu ruta de aprendizaje</div>
      <div class="path">
        <a href="#/verbs">🔎 Buscar</a><a href="#/grammar">📖 Entender</a><a href="#/listening">👂 Escuchar</a>
        <a href="#/practice/verbs">🧠 Practicar</a><a href="#/speaking">🎤 Hablar</a><a href="#/conversation">💬 Corrección</a><a href="#/practice/review">🔁 Repasar</a>
      </div>

      <div class="section-title">📚 Secciones</div>
      <div class="tiles">
        ${tile("phrases", "🃏", "Frases", "Situaciones reales")}
        ${tile("verbs", "📚", "Verbos", "Buscar y entender")}
        ${tile("practice/verbs", "🧠", "Practicar verbos", "Ejercicios con corrección")}
        ${tile("grammar", "📖", "Gramática", "Explicada fácil")}
        ${tile("listening", "👂", "Listening", "Escucha y responde")}
        ${tile("speaking", "🎤", "Speaking", "Habla y te corrijo")}
        ${tile("conversation", "💬", "Conversación", "Diálogos completos")}
        ${tile("progress", "📊", "Mi progreso", "Tus logros")}
      </div>`;
  },
};
const tile = (route, ico, title, sub) =>
  `<button class="tile" onclick="go('${route}')"><span class="ico">${ico}</span><b>${title}</b><span>${sub}</span></button>`;
