// 👂 LISTENING — escucha una frase y elige o escribe lo que oíste
App.sections.listening = {
  render(view, mode) {
    if (mode === "choose" || mode === "write") return this.quiz(view, mode);
    const s = Store.data.stats;
    const pct = s.listenTotal ? Math.round((s.listenOk / s.listenTotal) * 100) : 0;
    view.innerHTML = `
      <h1 class="page">👂 Listening</h1>
      <p class="lead">Escucha con atención. Puedes repetir el audio o ponerlo lento 🐢.</p>
      <div class="card-box row">
        <div style="flex:1"><b>Tu listening</b><div class="small muted">${s.listenOk} de ${s.listenTotal} correctas</div></div>
        <div class="ring" style="--p:${pct};width:64px;height:64px" data-label="${pct}%"></div>
      </div>
      ${listItem("listening/choose", "🔘", "Elegir la respuesta", "Escucha y elige qué frase oíste (más fácil)")}
      ${listItem("listening/write", "✍️", "Escribir lo que escuché", "Dictado: escribe la frase completa (más difícil)")}`;
  },

  quiz(view, mode) {
    const pool = PHRASES.filter(allowed);
    const chosen = shuffle(pool).slice(0, 8);
    const record = (ok) => { Store.data.stats.listenTotal++; if (ok) Store.data.stats.listenOk++; Store.save(); };

    const questions = chosen.map((p) => {
      const after = `<div class="small">🇬🇧 <b>${escapeHtml(p.english)}</b><br>🇪🇸 ${escapeHtml(p.spanish)}</div>
        <div class="btn-row" style="margin-top:8px">${sayBtn(p.english, "🔊 Otra vez", `data-lang="${langFor(p)}"`)}${sayBtn(p.english, "🐢 Lento", `data-lang="${langFor(p)}" data-slow="1"`)}</div>`;
      if (mode === "choose") {
        // Opciones parecidas en largo para que no sea tan obvio
        const others = shuffle(pool.filter((o) => o !== p))
          .sort((a, b) => Math.abs(a.english.length - p.english.length) - Math.abs(b.english.length - p.english.length))
          .slice(0, 3).map((o) => o.english);
        return {
          tag: "👂 Listening", audio: p.english, lang: langFor(p),
          prompt: "¿Qué frase escuchaste?",
          options: shuffle([p.english, ...others]), answer: p.english,
          explain: after, onResult: record,
        };
      }
      return {
        tag: "✍️ Dictado", audio: p.english, lang: langFor(p),
        prompt: "Escribe lo que escuchaste",
        sub: "No importan las mayúsculas ni los signos.",
        check: (input) => {
          const d = wordDiff(p.english, input);
          const ok = d.score >= 0.85;
          return { ok, html: `<div>${d.html}</div><div class="small muted">Acertaste ${Math.round(d.score * 100)}% de las palabras</div>${after}` };
        },
        onResult: record,
      };
    });
    runQuiz(view, questions, { title: "Listening", back: "listening" });
  },
};
