// =====================================================================
// ✏️ CORRECTOR — revisa los errores más comunes de hispanohablantes
// ---------------------------------------------------------------------
// Funciona con reglas (sin internet y gratis). No entiende TODO como una
// persona o una IA, pero detecta los errores típicos:
//   • presente en vez de pasado  → Yesterday I go  → went
//   • did + pasado               → I didn't went   → go
//   • falta la -s                → She like        → likes
//   • will / can + to            → I will to go    → will go
//   • I have 25 years            → I'm 25 years old
//   • I am agree                 → I agree
//   • I going                    → I am going
//   • a / an                     → a apple         → an apple
//   • more better                → better
// Para agregar una regla nueva, copia una línea de PHRASE_RULES.
// =====================================================================
const Checker = (() => {
  // Diccionario de formas verbales: "went" → { v: go, form: "past" }
  const FORMS = {};
  VERBS.filter((v) => !v.base.includes(" ")).forEach((v) => {
    const add = (w, form) => { if (!FORMS[w]) FORMS[w] = { v, form }; };
    add(v.base, "base");
    add(v.third, "third");
    v.past.split(" / ").forEach((p) => add(p, "past"));
    add(v.participle, "pp");
    add(v.ing, "ing");
  });

  const SUBJECTS = ["i", "you", "he", "she", "it", "we", "they"];
  const THIRD = ["he", "she", "it"];
  const beFor = (s) => (s.toLowerCase() === "i" ? "am" : THIRD.includes(s.toLowerCase()) ? "is" : "are");
  // Palabras después de las cuales NO revisamos el verbo (can go, to go, a drink...)
  const SKIP_AFTER = ["will", "won't", "can", "can't", "could", "should", "would", "must", "might", "may", "to",
    "don't", "doesn't", "didn't", "did", "do", "does", "let's", "a", "an", "the", "my", "your", "his", "her", "our", "their", "some", "this", "that", "any"];
  const PAST_WORDS = /\b(yesterday|last (night|week|month|year|weekend|summer|winter|time|monday|tuesday|wednesday|thursday|friday|saturday|sunday)|ago|when i was|in (19|20)\d\d)\b/i;

  // ---- Reglas de frase completa: [patrón, corrección, explicación] ----
  const PHRASE_RULES = [
    [/\b(i|you|he|she|we|they)\s+(?:have|has)\s+(\d+)\s+years(?:\s+old)?\b/gi,
      (m, s, n) => `${s} ${beFor(s)} ${n} years old`, "La edad se dice con <b>be</b> (am/is/are), no con have."],
    [/\b(i|you|he|she|we|they)(?:\s+am|'m|\s+is|'s|\s+are|'re)\s+agree\b/gi,
      (m, s) => `${s} ${THIRD.includes(s.toLowerCase()) ? "agrees" : "agree"}`, "<b>Agree</b> ya es un verbo: se dice <i>I agree</i>, sin am/is/are."],
    [/\b(will|can|could|should|must|would)\s+to\s+(?=[a-z])/gi,
      (m, mod) => `${mod} `, "Después de <b>will, can, should...</b> no va <i>to</i>."],
    [/\bmore\s+(better|worse|bigger|smaller|cheaper|faster|taller|older|younger|easier|harder)\b/gi,
      (m, w) => w, "Esa palabra ya significa «más...». No uses <b>more</b>."],
    [/\b(he|she|it)\s+don't\b/gi,
      (m, s) => `${s} doesn't`, "Con he / she / it se usa <b>doesn't</b>."],
    [/\ba\s+(?!uni|use|usu|eu|one|once)([aeiou][a-z]*)/gi,
      (m, w) => `an ${w}`, "Antes de sonido de vocal se usa <b>an</b>."],
  ];

  function check(text, { tense } = {}) {
    const issues = [];
    const add = (wrong, right, why) => issues.push({ wrong: wrong.trim(), right: right.trim(), why });

    // 1) Reglas de frase completa
    let t = text;
    PHRASE_RULES.forEach(([re, fix, why]) => {
      t = t.replace(re, (...args) => {
        const right = fix(...args);
        const wrong = args[0];
        add(wrong + (re.source.includes("(?=[a-z])") ? "..." : ""), right + (re.source.includes("(?=[a-z])") ? "..." : ""), why);
        return right;
      });
    });

    // 2) Reglas de verbos, palabra por palabra
    const parts = t.match(/[A-Za-zÀ-ÿ']+|[^A-Za-zÀ-ÿ']+/g) || [];
    const words = [];
    parts.forEach((p, i) => { if (/[A-Za-z]/.test(p)) words.push({ i, w: p, lw: p.toLowerCase() }); });
    const setWord = (k, value) => { parts[words[k].i] = matchCase(words[k].w, value); };

    const past = tense === "past" || PAST_WORDS.test(t);
    const pastWord = (t.match(PAST_WORDS) || [])[0];
    const presentMarkers = /\b(every day|usually|always|now|today|right now|tomorrow)\b/i.test(t);

    words.forEach((wd, k) => {
      if (wd.w === "i") setWord(k, "I");
      const f = FORMS[wd.lw];
      if (!f) return;
      const v = f.v;
      const p = k > 0 ? words[k - 1].lw : "";
      const pp = k > 1 ? words[k - 2].lw : "";
      const prevW = k > 0 ? words[k - 1].w : "";

      // Preguntas: "Are you doing...?", "Does she like...?" → no se revisa
      const question = SUBJECTS.includes(p) && ["am", "is", "are", "was", "were", "do", "does", "did", "can", "will", "would", "should", "could", "have", "has"].includes(pp);
      if (question && f.form !== "past") return;

      // did / didn't + pasado → forma normal
      if ((p === "did" || p === "didn't" || (p === "not" && pp === "did") || (question && pp === "did")) && f.form === "past" && v.past !== v.base) {
        add(`${prevW} ${wd.w}`, `${prevW} ${v.base}`, `Después de <b>did / didn't</b> el verbo va en forma normal: ${wd.lw} → <b>${v.base}</b>.`);
        return setWord(k, v.base);
      }
      // will / can / should + forma incorrecta → forma normal
      if (["will", "won't", "can", "can't", "should"].includes(p) && ["past", "third", "ing"].includes(f.form) && wd.lw !== v.base) {
        add(`${prevW} ${wd.w}`, `${prevW} ${v.base}`, `Después de <b>${p}</b> el verbo va en forma normal: <b>${v.base}</b>.`);
        return setWord(k, v.base);
      }
      // doesn't likes → doesn't like
      if ((p === "doesn't" || p === "does") && f.form === "third" && v.third !== v.base) {
        add(`${prevW} ${wd.w}`, `${prevW} ${v.base}`, "Después de <b>doesn't / does</b> el verbo va sin -s.");
        return setWord(k, v.base);
      }
      // I going → I am going
      if (f.form === "ing" && SUBJECTS.includes(p)) {
        const be = beFor(p);
        add(`${prevW} ${wd.w}`, `${prevW} ${be} ${wd.w}`, "Con -ing necesitas <b>am / is / are</b> antes.");
        parts[words[k - 1].i] = prevW + " " + be;
        return;
      }

      if (SKIP_AFTER.includes(p)) return;
      const afterSubject = SUBJECTS.includes(p) || ((p === "and" || p === "then") && k > 1);
      if (!afterSubject) return;

      // Pasado: Yesterday I go → went
      if (past && !presentMarkers && (f.form === "base" || f.form === "third")) {
        if (v.base === "be") {
          const right = ["you", "we", "they"].includes(p) ? "were" : "was";
          if (["am", "is", "are"].includes(wd.lw)) {
            add(`${prevW} ${wd.w}`, `${prevW} ${right}`, `Hablamos del pasado${pastWord ? ` (<i>${pastWord}</i>)` : ""}: am/is → <b>was</b>, are → <b>were</b>.`);
            setWord(k, right);
          }
          return;
        }
        if (v.past === v.base) return; // put, cut, read... se escriben igual
        const right = v.past.split(" / ")[0];
        add(`${prevW} ${wd.w}`, `${prevW} ${right}`, `<b>${v.base} → ${right}</b> porque hablamos del pasado${pastWord ? ` (<i>${pastWord}</i>)` : ""}. ${v.irregular ? "Es irregular: ¡hay que memorizarlo! 🔥" : "Es regular: se agrega -ed."}`);
        return setWord(k, right);
      }

      // Presente con he / she / it: She like → likes
      if (!past && THIRD.includes(p) && f.form === "base" && v.third !== v.base && v.base !== "be") {
        add(`${prevW} ${wd.w}`, `${prevW} ${v.third}`, `Con <b>he / she / it</b> en presente el verbo lleva <b>-s</b>: ${v.base} → ${v.third}.`);
        return setWord(k, v.third);
      }
    });

    const corrected = parts.join("").replace(/\s{2,}/g, " ").trim();
    return { issues, corrected: corrected ? corrected[0].toUpperCase() + corrected.slice(1) : corrected };
  }

  function matchCase(orig, value) {
    const first = orig[0];
    return first !== first.toLowerCase() && value !== "I" ? value[0].toUpperCase() + value.slice(1) : value;
  }

  return { check };
})();

// Muestra el resultado del corrector de forma visual
function correctionHtml(said, result) {
  if (!result.issues.length) {
    return `<div class="feedback ok"><div class="fb-title">✅ ¡No encontré errores!</div><div>“${escapeHtml(said)}”</div></div>`;
  }
  return `
    <div class="feedback no">
      <div class="fb-title">✏️ Vamos a mejorarlo</div>
      <div>❌ <s>${escapeHtml(said)}</s></div>
      <div style="margin-top:6px">✅ <b>${escapeHtml(result.corrected)}</b> ${sayBtn(result.corrected)}</div>
    </div>
    ${result.issues.map((i) => `
      <div class="issue">
        <span class="wrong">❌ ${escapeHtml(i.wrong)}</span> → <span class="right">✅ ${escapeHtml(i.right)}</span>
        <div class="why">💡 ${i.why}</div>
      </div>`).join("")}`;
}
