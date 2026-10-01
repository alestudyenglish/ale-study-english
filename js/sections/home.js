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
        <h2 dir="ltr">${practicedToday ? "Nice work today! 🔥" : "Hey there! 👋"}</h2>
        <div>${streak ? tx(`🔥 Racha de <b>${streak} día${streak > 1 ? "s" : ""}</b>`, `🔥 سلسلة <b>${streak} ${streak > 1 ? "أيام" : "يوم"}</b>`) : tx("¡Practica hoy para empezar tu racha!", "تدرّب اليوم لتبدأ سلسلتك!")}</div>
        <div style="margin-top:10px">${LEVEL_INFO[lvl].emoji} ${tx("Nivel", "المستوى")} <b>${lvl}</b> · ${LEVEL_INFO[lvl].name} — ${tx(`${pct}% completado`, `${pct}% مكتمل`)}</div>
        <div class="bar"><div style="width:${pct}%"></div></div>
        ${next && !Store.data.unlocked.includes(next) ? `<div class="small" style="margin-top:6px;opacity:.9">${tx(`Llega a ${UNLOCK_AT * 100}% para desbloquear ${next}`, `اوصل إلى ${UNLOCK_AT * 100}% لفتح ${next}`)}</div>` : ""}
      </div>

      <div class="card-box">
        <div class="label">🌟 ${tx("Frase del día", "عبارة اليوم")}</div>
        <div class="row">
          <div style="flex:1">
            <div class="big" dir="ltr" style="font-size:1.3rem">${escapeHtml(phrase.english)}</div>
            <div class="muted">${NATIVE.flag} ${escapeHtml(phrase.spanish)}</div>
          </div>
          ${sayBtn(phrase.english, "🔊", `data-lang="${langFor(phrase)}"`)}
        </div>
      </div>

      <div class="btn-row" style="margin-bottom:14px">
        <button class="btn" onclick="go('tutor')">🗣️ ${tx("Hablar con Alexis", "تحدّث مع Alexis")}</button>
        <button class="btn soft" onclick="go('practice/review')">🔁 ${tx("Repaso rápido", "مراجعة سريعة")}</button>
      </div>

      <div class="section-title">🧭 ${tx("Tu ruta de aprendizaje", "طريقك في التعلّم")}</div>
      <div class="path">
        <a href="#/verbs">🔎 ${tx("Buscar", "ابحث")}</a><a href="#/grammar">📖 ${tx("Entender", "افهم")}</a><a href="#/listening">👂 ${tx("Escuchar", "استمع")}</a>
        <a href="#/practice/verbs">🧠 ${tx("Practicar", "تدرّب")}</a><a href="#/speaking">🎤 ${tx("Hablar", "تكلّم")}</a><a href="#/conversation">💬 ${tx("Corrección", "التصحيح")}</a><a href="#/practice/review">🔁 ${tx("Repasar", "راجع")}</a>
      </div>

      <div class="section-title">📚 ${tx("Secciones", "الأقسام")}</div>
      <div class="tiles">
        ${tile("phrases", "🃏", tx("Frases", "عبارات"), tx("Situaciones reales", "مواقف حقيقية"))}
        ${tile("verbs", "📚", tx("Verbos", "الأفعال"), tx("Buscar y entender", "ابحث وافهم"))}
        ${tile("practice/verbs", "🧠", tx("Practicar verbos", "تدرّب على الأفعال"), tx("Ejercicios con corrección", "تمارين مع تصحيح"))}
        ${tile("grammar", "📖", tx("Gramática", "القواعد"), tx("Explicada fácil", "شرح سهل"))}
        ${tile("listening", "👂", "Listening", tx("Escucha y responde", "استمع وأجب"))}
        ${tile("speaking", "🎤", "Speaking", tx("Habla y te corrijo", "تكلّم وسأصحّح لك"))}
        ${tile("conversation", "💬", tx("Conversación", "محادثة"), tx("Diálogos completos", "حوارات كاملة"))}
        ${tile("past", "⏪", "Past Simple", tx("Aprende y juega con el pasado", "تعلّم الماضي والعب به"))}
        ${tile("games", "🎲", tx("Juegos de clase", "ألعاب الصف"), tx("Do/Go/Play, preguntas y más", "Do/Go/Play وأسئلة والمزيد"))}
        ${tile("progress", "📊", tx("Mi progreso", "تقدّمي"), tx("Tus logros", "إنجازاتك"))}
      </div>`;
  },
};
const tile = (route, ico, title, sub) =>
  `<button class="tile" onclick="go('${route}')"><span class="ico">${ico}</span><b>${title}</b><span>${sub}</span></button>`;
