// 📊 PROGRESO — todo lo que has logrado, de forma visual
App.sections.progress = {
  render(view) {
    const d = Store.data, s = d.stats;
    const known = PHRASES.filter((p) => statusOf(p) === "known").length;
    const learning = PHRASES.filter((p) => statusOf(p) === "learning").length;
    const mastered = VERBS.filter((v) => verbState(v.base).mastered).length;
    const practiced = VERBS.filter((v) => { const st = verbState(v.base); return st.ok + st.bad > 0; }).length;
    const irregulars = VERBS.filter((v) => v.irregular);
    const irrMastered = irregulars.filter((v) => verbState(v.base).mastered).length;
    const answered = s.correct + s.wrong;
    const listenPct = s.listenTotal ? Math.round((s.listenOk / s.listenTotal) * 100) : 0;
    const gDone = GRAMMAR.filter((g) => d.grammar[g.id]?.done).length;
    const cDone = CONVERSATIONS.filter((c) => d.convs[c.id]?.done).length;
    const ring = (value, total, color) => {
      const p = total ? Math.round((value / total) * 100) : 0;
      return `<div class="ring" style="--p:${p};--c:${color}" data-label="${p}%"></div>`;
    };

    // Últimos 28 días
    const days = new Set(d.days);
    const cells = [];
    for (let i = 27; i >= 0; i--) {
      const dt = new Date(); dt.setDate(dt.getDate() - i);
      const key = todayStr(dt);
      cells.push(`<div class="day ${days.has(key) ? "on" : ""} ${i === 0 ? "today" : ""}" title="${key}"></div>`);
    }

    view.innerHTML = `
      <h1 class="page">📊 Mi progreso</h1>
      <p class="lead">Todo se guarda en este navegador.</p>

      <div class="card-box">
        <div class="row"><b style="flex:1">📅 Días de práctica</b><span>🔥 ${streakDays()} de racha · ${d.days.length} en total</span></div>
        <div class="days">${cells.join("")}</div>
        <div class="small muted" style="margin-top:6px">Últimas 4 semanas · 🟩 = practicaste</div>
      </div>

      <div class="stat-grid">
        <div class="stat-card">${ring(known, PHRASES.length, "var(--good)")}<div class="num">${known}</div><div class="lbl">🃏 frases aprendidas<br>(${learning} aprendiendo)</div></div>
        <div class="stat-card">${ring(mastered, VERBS.length, "var(--accent)")}<div class="num">${mastered}</div><div class="lbl">📚 verbos dominados<br>(${practiced} practicados)</div></div>
        <div class="stat-card">${ring(irrMastered, irregulars.length, "var(--warn)")}<div class="num">${irrMastered}/${irregulars.length}</div><div class="lbl">🔥 irregulares dominados</div></div>
        <div class="stat-card">${ring(s.listenOk, s.listenTotal, "var(--fut)")}<div class="num">${s.listenOk}/${s.listenTotal}</div><div class="lbl">👂 listening correctos</div></div>
        <div class="stat-card">${ring(s.speakPerfect, s.speakTotal, "var(--pp)")}<div class="num">${s.speakTotal}</div><div class="lbl">🎤 respuestas habladas<br>(${s.speakPerfect} sin errores)</div></div>
        <div class="stat-card">${ring(gDone + cDone, GRAMMAR.length + CONVERSATIONS.length, "var(--pres)")}<div class="num">${gDone} · ${cDone}</div><div class="lbl">📖 lecciones · 💬 conversaciones</div></div>
      </div>

      <div class="card-box" style="margin-top:14px">
        <b>✍️ Ejercicios</b>
        <div class="split-bar"><div class="g" style="width:${answered ? (s.correct / answered) * 100 : 0}%"></div><div class="r" style="width:${answered ? (s.wrong / answered) * 100 : 0}%"></div></div>
        <div class="row small"><span>✅ ${s.correct} correctos</span><span class="spacer"></span><span>❌ ${s.wrong} incorrectos</span></div>
      </div>

      <div class="card-box">
        <b>🎯 Niveles</b>
        ${LEVELS.map((l) => {
          const p = Math.round(levelProgress(l) * 100);
          const open = d.unlocked.includes(l);
          return `<div style="margin-top:12px"><div class="row small"><span>${LEVEL_INFO[l].emoji} <b>${l}</b> ${LEVEL_INFO[l].name}</span><span class="spacer"></span><span>${open ? p + "%" : "🔒"}</span></div>
            <div class="bar ${p >= 100 ? "good" : ""}" style="margin-top:4px"><div style="width:${p}%"></div></div></div>`;
        }).join("")}
        <div class="small muted" style="margin-top:10px">El siguiente nivel se abre al llegar a ${UNLOCK_AT * 100}% (frases ✅ + verbos dominados + lecciones).</div>
      </div>

      <button class="btn ghost block" id="resetBtn" style="margin-top:6px">🗑️ Borrar mi progreso</button>`;

    $("#resetBtn").onclick = () => {
      if (!confirm("¿Seguro? Se borrará TODO tu progreso en este navegador.")) return;
      try { localStorage.removeItem(Store.key); localStorage.removeItem(PHRASE_KEY); } catch (e) {}
      phraseStatus = {};
      Store.load();
      updateHeader();
      render();
      toast("Progreso borrado");
    };
  },
};
