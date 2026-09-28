// 🎤 SPEAKING — la app pregunta, tú respondes hablando y te corrige
App.sections.speaking = {
  render(view, topicId) {
    if (topicId) return this.topic(view, topicId);
    const s = Store.data.stats;
    view.innerHTML = `
      <h1 class="page">🎤 Speaking</h1>
      <p class="lead">La app te pregunta, tú respondes <b>hablando</b> y te muestro cómo mejorarlo.</p>
      ${SpeechRec ? "" : `<div class="feedback no small">⚠️ Tu navegador no reconoce voz. Usa <b>Chrome</b> o <b>Edge</b>. Igual puedes practicar escribiendo.</div>`}
      <div class="card-box small muted">🗣️ ${s.speakTotal} respuestas · ✅ ${s.speakPerfect} sin errores</div>
      ${levelGroups(SPEAKING_TOPICS, (t) => listItem(allowed(t) ? "speaking/" + t.id : "", t.emoji, t.title, `${t.prompts.length} preguntas`, !allowed(t)))}`;
    lockedClicks(view);
  },

  topic(view, id) {
    const topic = SPEAKING_TOPICS.find((t) => t.id === id);
    if (!topic) return go("speaking");
    let i = 0;

    const show = () => {
      const p = topic.prompts[i];
      if (!p) {
        view.innerHTML = `
          <div class="quiz-card" style="text-align:center">
            <div class="result-big">🎉</div><h2>¡Terminaste "${topic.title}"!</h2>
            <p class="muted">Repite el tema para hablar con más fluidez o prueba otro.</p>
            <div class="btn-row"><button class="btn" onclick="render()">🔁 Otra vez</button><button class="btn ghost" onclick="go('speaking')">⬅️ Temas</button></div>
          </div>`;
        return;
      }
      view.innerHTML = `
        <div class="quiz-top">
          <button class="icon-btn" onclick="go('speaking')">✕</button>
          <div class="bar"><div style="width:${(i / topic.prompts.length) * 100}%"></div></div>
          <b>${i + 1}/${topic.prompts.length}</b>
        </div>
        <div class="quiz-card">
          <span class="q-tag">${topic.emoji} ${topic.title}</span>
          <div class="row"><div class="q-prompt" style="flex:1">${escapeHtml(p.q)}</div>${sayBtn(p.q)}</div>
          <details class="small muted"><summary>💡 Ayuda en español</summary>${escapeHtml(p.es)}</details>
          <div class="mic-slot"></div>
          <div class="result"></div>
        </div>`;
      setTimeout(() => speak(p.q), 300);

      $(".mic-slot", view).appendChild(micWidget((said) => {
        const r = Checker.check(said, { tense: p.tense });
        Store.data.stats.speakTotal++;
        if (!r.issues.length) Store.data.stats.speakPerfect++;
        markDay(); Store.save();
        $(".result", view).innerHTML = `
          ${correctionHtml(said, r)}
          <div class="section-title">🗣️ Otras formas de responder</div>
          ${p.models.map((m) => `<div class="issue row"><span style="flex:1">${escapeHtml(m)}</span>${sayBtn(m)}<button class="icon-btn" data-pronounce="${escapeHtml(m)}">🎤</button></div>`).join("")}
          <button class="btn block" style="margin-top:10px" data-next>Siguiente ➡️</button>`;
        $$("[data-pronounce]", view).forEach((b) => (b.onclick = () => pronounceSheet(b.dataset.pronounce)));
        $("[data-next]", view).onclick = () => { i++; show(); };
        if (r.issues.length) speak(r.corrected);
      }));
    };
    show();
  },
};

// Agrupa una lista por nivel (A1, A2...)
function levelGroups(items, renderItem) {
  return LEVELS.map((lvl) => {
    const group = items.filter((x) => x.level === lvl);
    if (!group.length) return "";
    const locked = levelIdx(lvl) > levelIdx(Store.data.level);
    return `<div class="level-group">${LEVEL_INFO[lvl].emoji} ${lvl} · ${LEVEL_INFO[lvl].name} ${locked ? "🔒" : ""}</div>${group.map(renderItem).join("")}`;
  }).join("");
}
// Si tocas algo bloqueado, explica cómo desbloquearlo
function lockedClicks(view) {
  $$(".list-item.locked", view).forEach((b) => (b.onclick = () => toast(`🔒 Sube de nivel para abrir esto. Toca tu nivel arriba ☝️`)));
}
