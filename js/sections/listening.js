// 👂 LISTENING — escucha una frase y elige o escribe lo que oíste
App.sections.listening = {
  render(view, mode) {
    if (mode === "choose" || mode === "write") return this.quiz(view, mode);
    const s = Store.data.stats;
    const pct = s.listenTotal ? Math.round((s.listenOk / s.listenTotal) * 100) : 0;
    view.innerHTML = `
      <h1 class="page">👂 Listening</h1>
      <p class="lead">${tx("Escucha con atención. Puedes repetir el audio o ponerlo lento 🐢.", "استمع بانتباه. يمكنك إعادة الصوت أو جعله بطيئًا 🐢.")}</p>
      <div class="card-box row">
        <div style="flex:1"><b>${tx("Tu listening", "مهارة الاستماع")}</b><div class="small muted">${tx(`${s.listenOk} de ${s.listenTotal} correctas`, `${s.listenOk} من ${s.listenTotal} صحيحة`)}</div></div>
        <div class="ring" style="--p:${pct};width:64px;height:64px" data-label="${pct}%"></div>
      </div>
      ${listItem("listening/choose", "🔘", tx("Elegir la respuesta", "اختر الإجابة"), tx("Escucha y elige qué frase oíste (más fácil)", "استمع واختر العبارة التي سمعتها (أسهل)"))}
      ${listItem("listening/write", "✍️", tx("Escribir lo que escuché", "اكتب ما سمعته"), tx("Dictado: escribe la frase completa (más difícil)", "إملاء: اكتب العبارة كاملة (أصعب)"))}`;
  },

  quiz(view, mode) {
    const pool = PHRASES.filter(allowed);
    const chosen = shuffle(pool).slice(0, 8);
    const record = (ok) => { Store.data.stats.listenTotal++; if (ok) Store.data.stats.listenOk++; Store.save(); };

    const questions = chosen.map((p) => {
      const after = `<div class="small"><span dir="ltr">🇬🇧 <b>${escapeHtml(p.english)}</b></span><br>${NATIVE.flag} ${escapeHtml(p.spanish)}</div>
        <div class="btn-row" style="margin-top:8px">${sayBtn(p.english, tx("🔊 Otra vez", "🔊 مرة أخرى"), `data-lang="${langFor(p)}"`)}${sayBtn(p.english, tx("🐢 Lento", "🐢 ببطء"), `data-lang="${langFor(p)}" data-slow="1"`)}</div>`;
      if (mode === "choose") {
        // Opciones parecidas en largo para que no sea tan obvio
        const others = shuffle(pool.filter((o) => o !== p))
          .sort((a, b) => Math.abs(a.english.length - p.english.length) - Math.abs(b.english.length - p.english.length))
          .slice(0, 3).map((o) => o.english);
        return {
          tag: "👂 Listening", audio: p.english, lang: langFor(p),
          prompt: tx("¿Qué frase escuchaste?", "أي عبارة سمعت؟"),
          options: shuffle([p.english, ...others]), answer: p.english,
          explain: after, onResult: record,
        };
      }
      return {
        tag: tx("✍️ Dictado", "✍️ إملاء"), audio: p.english, lang: langFor(p),
        prompt: tx("Escribe lo que escuchaste", "اكتب ما سمعته"),
        sub: tx("No importan las mayúsculas ni los signos.", "لا تهمّ الأحرف الكبيرة ولا علامات الترقيم."),
        check: (input) => {
          const d = wordDiff(p.english, input);
          const ok = d.score >= 0.85;
          return { ok, html: `<div dir="ltr">${d.html}</div><div class="small muted">${tx(`Acertaste ${Math.round(d.score * 100)}% de las palabras`, `أصبت ${Math.round(d.score * 100)}% من الكلمات`)}</div>${after}` };
        },
        onResult: record,
      };
    });
    runQuiz(view, questions, { title: "Listening", back: "listening" });
  },
};
