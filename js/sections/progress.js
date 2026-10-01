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
    const gDone = GRAMMAR.filter((g) => d.grammar[g.id]?.done).length;
    const cDone = CONVERSATIONS.filter((c) => d.convs[c.id]?.done).length;
    const ring = (value, total, color) => {
      const p = total ? Math.round((value / total) * 100) : 0;
      return `<div class="ring" style="--p:${p};--c:${color}" data-label="${p}%"></div>`;
    };

    // Últimas 4 semanas (siempre de izquierda a derecha, del más antiguo a hoy)
    const days = new Set(d.days);
    const cells = [];
    for (let i = 27; i >= 0; i--) {
      const dt = new Date(); dt.setDate(dt.getDate() - i);
      const key = todayStr(dt);
      cells.push(`<div class="day ${days.has(key) ? "on" : ""} ${i === 0 ? "today" : ""}" title="${key}"></div>`);
    }

    view.innerHTML = `
      <h1 class="page">📊 ${tx("Mi progreso", "تقدّمي")}</h1>
      <p class="lead">${tx("Todo se guarda en este navegador.", "كل شيء محفوظ في هذا المتصفح.")}</p>

      <div class="card-box">
        <div class="row"><b style="flex:1">📅 ${tx("Días de práctica", "أيام التدريب")}</b><span>${tx(`🔥 ${streakDays()} de racha · ${d.days.length} en total`, `🔥 سلسلة ${streakDays()} · ${d.days.length} إجمالًا`)}</span></div>
        <div class="days" dir="ltr">${cells.join("")}</div>
        <div class="small muted" style="margin-top:6px">${tx("Últimas 4 semanas · 🟩 = practicaste", "آخر 4 أسابيع · 🟩 = تدرّبت")}</div>
      </div>

      <div class="stat-grid">
        <div class="stat-card">${ring(known, PHRASES.length, "var(--good)")}<div class="num">${known}</div><div class="lbl">${tx(`🃏 frases aprendidas<br>(${learning} aprendiendo)`, `🃏 عبارات متقنة<br>(${learning} قيد التعلّم)`)}</div></div>
        <div class="stat-card">${ring(mastered, VERBS.length, "var(--accent)")}<div class="num">${mastered}</div><div class="lbl">${tx(`📚 verbos dominados<br>(${practiced} practicados)`, `📚 أفعال متقنة<br>(${practiced} تمّ التدرّب عليها)`)}</div></div>
        <div class="stat-card">${ring(irrMastered, irregulars.length, "var(--warn)")}<div class="num" dir="ltr">${irrMastered}/${irregulars.length}</div><div class="lbl">${tx("🔥 irregulares dominados", "🔥 أفعال شاذة متقنة")}</div></div>
        <div class="stat-card">${ring(s.listenOk, s.listenTotal, "var(--fut)")}<div class="num" dir="ltr">${s.listenOk}/${s.listenTotal}</div><div class="lbl">${tx("👂 listening correctos", "👂 استماع صحيح")}</div></div>
        <div class="stat-card">${ring(s.speakPerfect, s.speakTotal, "var(--pp)")}<div class="num">${s.speakTotal}</div><div class="lbl">${tx(`🎤 respuestas habladas<br>(${s.speakPerfect} sin errores)`, `🎤 إجابات منطوقة<br>(${s.speakPerfect} بدون أخطاء)`)}</div></div>
        <div class="stat-card">${ring(gDone + cDone, GRAMMAR.length + CONVERSATIONS.length, "var(--pres)")}<div class="num">${gDone} · ${cDone}</div><div class="lbl">${tx("📖 lecciones · 💬 conversaciones", "📖 دروس · 💬 محادثات")}</div></div>
      </div>

      <div class="card-box" style="margin-top:14px">
        <b>✍️ ${tx("Ejercicios", "التمارين")}</b>
        <div class="split-bar"><div class="g" style="width:${answered ? (s.correct / answered) * 100 : 0}%"></div><div class="r" style="width:${answered ? (s.wrong / answered) * 100 : 0}%"></div></div>
        <div class="row small"><span>✅ ${s.correct} ${tx("correctos", "صحيحة")}</span><span class="spacer"></span><span>❌ ${s.wrong} ${tx("incorrectos", "خاطئة")}</span></div>
      </div>

      <div class="card-box">
        <b>🎯 ${tx("Niveles", "المستويات")}</b>
        ${LEVELS.map((l) => {
          const p = Math.round(levelProgress(l) * 100);
          const open = d.unlocked.includes(l);
          return `<div style="margin-top:12px"><div class="row small"><span>${LEVEL_INFO[l].emoji} <b>${l}</b> ${LEVEL_INFO[l].name}</span><span class="spacer"></span><span>${open ? p + "%" : "🔒"}</span></div>
            <div class="bar ${p >= 100 ? "good" : ""}" style="margin-top:4px"><div style="width:${p}%"></div></div></div>`;
        }).join("")}
        <div class="small muted" style="margin-top:10px">${tx(`El siguiente nivel se abre al llegar a ${UNLOCK_AT * 100}% (frases ✅ + verbos dominados + lecciones).`, `يُفتح المستوى التالي عند الوصول إلى ${UNLOCK_AT * 100}% (عبارات ✅ + أفعال متقنة + دروس).`)}</div>
      </div>

      <button class="btn ghost block" id="resetBtn" style="margin-top:6px">🗑️ ${tx("Borrar mi progreso", "مسح تقدّمي")}</button>`;

    $("#resetBtn").onclick = () => {
      if (!confirm(tx("¿Seguro? Se borrará TODO tu progreso en este navegador.", "هل أنت متأكد؟ سيُمسح كل تقدّمك في هذا المتصفح."))) return;
      try { localStorage.removeItem(Store.key); localStorage.removeItem(PHRASE_KEY); } catch (e) {}
      phraseStatus = {};
      Store.load();
      Store.data.lang = LANG; // se mantiene el idioma elegido
      Store.save();
      updateHeader();
      render();
      toast(tx("Progreso borrado", "تم مسح التقدّم"));
    };
  },
};
