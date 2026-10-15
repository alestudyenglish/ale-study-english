// 🧠 PRACTICAR — centro de práctica, quiz de verbos y repaso rápido
App.sections.practice = {
  render(view, mode, arg) {
    if (mode === "verbs") return this.verbsQuiz(view);
    if (mode === "verb") return this.oneVerb(view, arg);
    if (mode === "review") return this.review(view);

    const mastered = VERBS.filter((v) => verbState(v.base).mastered).length;
    view.innerHTML = `
      <h1 class="page">🎯 ${tx("Practicar", "تدرّب")}</h1>
      <p class="lead">${tx("Elige cómo quieres practicar hoy.", "اختر كيف تريد أن تتدرّب اليوم.")}</p>
      ${listItem("tutor", "🗣️", tx("Hablar con Alexis", "تحدّث مع Alexis"), tx("Conversación libre con IA, en inglés y español", "محادثة حرّة مع الذكاء الاصطناعي بالإنجليزية والعربية"))}
      ${listItem("topics", "🎯", tx("Temas de clase", "مواضيع الصف"), tx("Conditionals, Can/Could, noticias, ago/last/in, a/an/the · con pronunciación", "Conditionals وCan/Could والأخبار وago/last/in وa/an/the · مع النطق"))}
      ${listItem("paul", "🔧", "Paul the Mechanic", tx("Inglés de taller: partes, herramientas, electricidad, clientes", "إنجليزية الورشة: الأجزاء، الأدوات، الكهرباء، الزبائن"))}
      ${listItem("past", "⏪", "Past Simple", tx("Cómo funciona el pasado + 5 juegos", "كيف يعمل الماضي + 5 ألعاب"))}
      ${listItem("games", "🎲", tx("Juegos de clase", "ألعاب الصف"), tx("Do/Go/Play, preguntas sí/no, ruleta y he/she/it", "Do/Go/Play، أسئلة نعم/لا، العجلة وhe/she/it"))}
      ${listItem("practice/review", "🔁", tx("Repaso rápido", "مراجعة سريعة"), tx("Mezcla de verbos y frases que te cuestan", "مزيج من الأفعال والعبارات الصعبة عليك"))}
      ${listItem("practice/verbs", "🧠", tx("Verbos", "الأفعال"), tx(`Escribe la forma correcta · ${mastered} dominados`, `اكتب الصيغة الصحيحة · ${mastered} متقَن`))}
      ${listItem("listening", "👂", "Listening", tx("Escucha y elige o escribe lo que oíste", "استمع واختر أو اكتب ما سمعته"))}
      ${listItem("speaking", "🎤", "Speaking", tx("Responde hablando y te corrijo", "أجب بالكلام وسأصحّح لك"))}
      ${listItem("conversation", "💬", tx("Conversación", "محادثة"), tx("Diálogos que cambian según tu respuesta", "حوارات تتغيّر حسب إجابتك"))}
      ${listItem("grammar", "📖", tx("Gramática", "القواعد"), tx("Lecciones cortas con ejercicios", "دروس قصيرة مع تمارين"))}`;
  },

  // 10 preguntas: prioriza irregulares y los verbos que fallas
  verbsQuiz(view) {
    const verbs = pickVerbsForPractice(10);
    runQuiz(view, verbs.map((v) => verbQuestion(v, randomTense(v))), { title: tx("Verbos", "الأفعال"), back: "practice" });
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
        tag: tx("🃏 Frase", "🃏 عبارة"), color: "var(--accent)",
        prompt: tx(`¿Cómo se dice <i>«${escapeHtml(p.spanish)}»</i>?`, `كيف تقول <i>«${escapeHtml(p.spanish)}»</i>؟`),
        sub: p.category,
        options: shuffle([p.english, ...others]),
        answer: p.english,
        say: p.english,
        onResult: (ok) => { if (!ok || statusOf(p) === "new") setPhraseStatus(p, "learning"); },
      };
    });
    runQuiz(view, shuffle([...verbQs, ...phraseQs]), { title: tx("Repaso", "المراجعة"), back: "home" });
  },
};

const listItem = (route, ico, title, sub, locked = false) => `
  <button class="list-item ${locked ? "locked" : ""}" onclick="go('${route}')">
    <span class="ico">${ico}</span><span class="txt"><b>${title}</b><span>${sub}</span></span><span>${locked ? "🔒" : isAr ? "‹" : "›"}</span>
  </button>`;
