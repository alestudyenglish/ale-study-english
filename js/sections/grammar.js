// 📖 GRAMÁTICA — explicación sencilla → ejemplos → ejercicios
App.sections.grammar = {
  render(view, id, mode) {
    if (id && mode === "practice") return this.practice(view, id);
    if (id) return this.lesson(view, id);
    view.innerHTML = `
      <h1 class="page">📖 ${tx("Gramática", "القواعد")}</h1>
      <p class="lead">${tx("Explicada fácil: primero en español, después ejemplos y al final ejercicios.", "شرح سهل: أولًا بالعربية، ثم أمثلة، وفي النهاية تمارين.")}</p>
      ${levelGroups(GRAMMAR, (g) => {
        const st = Store.data.grammar[g.id];
        const sub = st ? `${g.es} · ${tx("mejor", "الأفضل")}: ${st.best}%${st.done ? " ✅" : ""}` : g.es;
        return listItem(allowed(g) ? "grammar/" + g.id : "", g.emoji, g.title, sub, !allowed(g));
      })}`;
    lockedClicks(view);
  },

  lesson(view, id) {
    const g = GRAMMAR.find((x) => x.id === id);
    if (!g) return go("grammar");
    // La estructura siempre va de izquierda a derecha, como en inglés
    const formula = (row) => `<div class="formula" dir="ltr">${row.map((x) => (["+", ","].includes(x) ? `<i>${x}</i>` : `<span>${escapeHtml(x)}</span>`)).join("")}</div>`;
    view.innerHTML = `
      <button class="btn ghost" onclick="go('grammar')" style="margin:6px 0 12px">${tx("⬅️ Lecciones", "➡️ الدروس")}</button>
      <h1 class="page">${g.emoji} <span dir="ltr">${g.title}</span></h1>
      <p class="lead">${g.es} · <span class="tag level">${g.level}</span></p>

      <div class="card-box">
        <div class="section-title" style="margin-top:0">📌 ${tx("¿Para qué se usa?", "متى نستخدمه؟")}</div>
        <ul class="explain">${g.use.map((u) => `<li>${u}</li>`).join("")}</ul>
      </div>

      <div class="card-box">
        <div class="section-title" style="margin-top:0">🧩 ${tx("Estructura", "البنية")}</div>
        ${g.formula.map(formula).join("")}
      </div>

      <div class="section-title">💬 ${tx("Ejemplos", "أمثلة")}</div>
      ${g.examples.map(([en, es]) => `
        <div class="ex" style="--c:var(--accent)">
          <div class="text"><div class="en" dir="ltr">${escapeHtml(en)}</div><div class="es">${escapeHtml(es)}</div></div>
          <div class="btns">${sayBtn(en.replace("→", ","))}</div>
        </div>`).join("")}

      ${g.tips ? `<div class="card-box" style="background:var(--warn-soft)"><b>⚠️ ${tx("Ojo", "انتبه")}</b><ul class="explain">${g.tips.map((t) => `<li>${t}</li>`).join("")}</ul></div>` : ""}

      <button class="btn block" onclick="go('grammar/${g.id}/practice')">✍️ ${tx(`Hacer ejercicios (${g.exercises.length})`, `حلّ التمارين (${g.exercises.length})`)}</button>`;
  },

  practice(view, id) {
    const g = GRAMMAR.find((x) => x.id === id);
    if (!g) return go("grammar");
    const qs = g.exercises.map((ex) => ({
      tag: `${g.emoji} ${g.title}`,
      prompt: escapeHtml(ex.q).replace("___", `<span class="blank">___</span>`),
      ...(ex.o ? { options: shuffle(ex.o), answer: ex.a } : { answers: ex.a }),
      say: ex.o ? (ex.a.match(/^[A-Z]/) ? ex.a : null) : ex.q.replace(/\s*\(.*?\)/g, "").replace(/^.*→\s*/, "").replace("___", ex.a[0]),
    }));
    runQuiz(view, qs, {
      title: g.title, back: "grammar/" + g.id,
      onFinish: ({ pct }) => {
        const prev = Store.data.grammar[g.id] || { best: 0, done: false };
        Store.data.grammar[g.id] = { best: Math.max(prev.best, pct), done: prev.done || pct >= 60 };
        Store.save();
        checkUnlocks();
      },
    });
  },
};
