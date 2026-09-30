// 🧠 PRACTICAR — centro de práctica, quiz de verbos y repaso rápido
App.sections.practice = {
  render(view, mode, arg) {
    if (mode === "verbs") return this.verbsQuiz(view);
    if (mode === "verb") return this.oneVerb(view, arg);
    if (mode === "review") return this.review(view);

    const mastered = VERBS.filter((v) => verbState(v.base).mastered).length;
    view.innerHTML = `
      <h1 class="page">🎯 Practicar</h1>
      <p class="lead">Elige cómo quieres practicar hoy.</p>
      ${listItem("tutor", "🗣️", "Hablar con Alexis", "Conversación libre con IA, en inglés y español")}
      ${listItem("past", "⏪", "Past Simple", "Cómo funciona el pasado + 5 juegos")}
      ${listItem("games", "🎲", "Juegos de clase", "Do/Go/Play, preguntas sí/no, ruleta y he/she/it")}
      ${listItem("practice/review", "🔁", "Repaso rápido", "Mezcla de verbos y frases que te cuestan")}
      ${listItem("practice/verbs", "🧠", "Verbos", `Escribe la forma correcta · ${mastered} dominados`)}
      ${listItem("listening", "👂", "Listening", "Escucha y elige o escribe lo que oíste")}
      ${listItem("speaking", "🎤", "Speaking", "Responde hablando y te corrijo")}
      ${listItem("conversation", "💬", "Conversación", "Diálogos que cambian según tu respuesta")}
      ${listItem("grammar", "📖", "Gramática", "Lecciones cortas con ejercicios")}`;
  },

  // 10 preguntas: prioriza irregulares y los verbos que fallas
  verbsQuiz(view) {
    const verbs = pickVerbsForPractice(10);
    runQuiz(view, verbs.map((v) => verbQuestion(v, randomTense(v))), { title: "Verbos", back: "practice" });
  },

  // Practicar un verbo: una pregunta por cada tiempo
  oneVerb(view, base) {
    const v = VERB_BY_BASE[base];
    if (!v) return go("verbs");
    const tenses = shuffle(["pres", "past", "pp", "fut", "ger"]);
    runQuiz(view, tenses.map((t) => verbQuestion(v, t)), { title: v.base.toUpperCase(), back: "verbs/" + encodeURIComponent(base) });
  },

  // Repaso: verbos débiles + frases que aún no dominas
  review(view) {
    const verbQs = pickVerbsForPractice(5).map((v) => verbQuestion(v, randomTense(v)));
    const pool = PHRASES.filter(allowed);
    const weak = pool.filter((p) => statusOf(p) === "learning");
    const fresh = pool.filter((p) => statusOf(p) === "new");
    const chosen = shuffle(weak).concat(shuffle(fresh)).slice(0, 5);
    const phraseQs = chosen.map((p) => {
      const others = shuffle(pool.filter((o) => o !== p)).slice(0, 3).map((o) => o.english);
      return {
        tag: "🃏 Frase", color: "var(--accent)",
        prompt: `¿Cómo se dice <i>«${escapeHtml(p.spanish)}»</i>?`,
        sub: p.category,
        options: shuffle([p.english, ...others]),
        answer: p.english,
        say: p.english,
        onResult: (ok) => { if (!ok || statusOf(p) === "new") setPhraseStatus(p, "learning"); },
      };
    });
    runQuiz(view, shuffle([...verbQs, ...phraseQs]), { title: "Repaso", back: "home" });
  },
};

const listItem = (route, ico, title, sub, locked = false) => `
  <button class="list-item ${locked ? "locked" : ""}" onclick="go('${route}')">
    <span class="ico">${ico}</span><span class="txt"><b>${title}</b><span>${sub}</span></span><span>${locked ? "🔒" : "›"}</span>
  </button>`;
