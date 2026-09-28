// 📖 GRAMÁTICA — explicación sencilla → ejemplos → ejercicios
App.sections.grammar = {
  render(view, id, mode) {
    if (id && mode === "practice") return this.practice(view, id);
    if (id) return this.lesson(view, id);
    view.innerHTML = `
      <h1 class="page">📖 Gramática</h1>
      <p class="lead">Explicada fácil: primero en español, después ejemplos y al final ejercicios.</p>
      ${levelGroups(GRAMMAR, (g) => {
        const st = Store.data.grammar[g.id];
        const sub = st ? `${g.es} · mejor: ${st.best}%${st.done ? " ✅" : ""}` : g.es;
        return listItem(allowed(g) ? "grammar/" + g.id : "", g.emoji, g.title, sub, !allowed(g));
      })}`;
    lockedClicks(view);
  },

  lesson(view, id) {
    const g = GRAMMAR.find((x) => x.id === id);
    if (!g) return go("grammar");
    const formula = (row) => `<div class="formula">${row.map((x) => (["+", ","].includes(x) ? `<i>${x}</i>` : `<span>${escapeHtml(x)}</span>`)).join("")}</div>`;
    view.innerHTML = `
      <button class="btn ghost" onclick="go('grammar')" style="margin:6px 0 12px">⬅️ Lecciones</button>
      <h1 class="page">${g.emoji} ${g.title}</h1>
      <p class="lead">${g.es} · <span class="tag level">${g.level}</span></p>

      <div class="card-box">
        <div class="section-title" style="margin-top:0">📌 ¿Para qué se usa?</div>
        <ul class="explain">${g.use.map((u) => `<li>${u}</li>`).join("")}</ul>
      </div>

      <div class="card-box">
        <div class="section-title" style="margin-top:0">🧩 Estructura</div>
        ${g.formula.map(formula).join("")}
      </div>

      <div class="section-title">💬 Ejemplos</div>
      ${g.examples.map(([en, es]) => `
        <div class="ex" style="--c:var(--accent)">
          <div class="text"><div class="en">${escapeHtml(en)}</div><div class="es">${escapeHtml(es)}</div></div>
          <div class="btns">${sayBtn(en.replace("→", ","))}</div>
        </div>`).join("")}

      ${g.tips ? `<div class="card-box" style="background:var(--warn-soft)"><b>⚠️ Ojo</b><ul class="explain">${g.tips.map((t) => `<li>${t}</li>`).join("")}</ul></div>` : ""}

      <button class="btn block" onclick="go('grammar/${g.id}/practice')">✍️ Hacer ejercicios (${g.exercises.length})</button>`;
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
