// =====================================================================
// 🧠 MOTOR DE EJERCICIOS — lo usan Verbos, Gramática, Listening y Repaso
// ---------------------------------------------------------------------
// Cada pregunta es un objeto:
//   tag:     etiqueta de color arriba ("🔴 Pasado")
//   color:   color de la etiqueta (var(--past))
//   prompt:  la pregunta (HTML)
//   sub:     ayuda debajo (HTML)
//   audio:   texto que se reproduce (para listening)
//   answers: respuestas válidas   → el usuario escribe
//   options + answer              → el usuario elige
//   check(input): función propia  → devuelve { ok, html }
//   explain: explicación que se muestra después (HTML)
//   say:     frase correcta para escuchar después
//   onResult(ok): se llama al responder (para guardar progreso)
// Las preguntas falladas vuelven al final una vez para reintentarlas.
// =====================================================================
function runQuiz(container, questions, { title = "Práctica", onFinish, back = "home" } = {}) {
  const queue = [...questions];
  const retried = new Set();
  let index = 0, score = 0, firstTry = 0;
  const total = questions.length;

  function isCorrect(q, input) {
    const n = normalize(input).replace(/\s*'\s*/g, "'");
    return q.answers.some((a) => normalize(a).replace(/\s*'\s*/g, "'") === n);
  }
  // Una letra de diferencia → "casi"
  function almost(q, input) {
    const n = normalize(input);
    return q.answers.some((a) => { const b = normalize(a); return b.length > 3 && levenshtein(n, b) === 1; });
  }

  function show() {
    const q = queue[index];
    if (!q) return finish();
    const progress = Math.round((Math.min(index, total) / total) * 100);
    container.innerHTML = `
      <div class="quiz-top">
        <button class="icon-btn" data-quit title="Salir">✕</button>
        <div class="bar"><div style="width:${progress}%"></div></div>
        <b class="q-score">⭐ ${score}</b>
      </div>
      <div class="quiz-card">
        ${q.tag ? `<span class="q-tag" style="--c:${q.color || "var(--accent)"}">${q.tag}</span>` : ""}
        ${q.audio ? `<div class="audio-prompt">${sayBtn(q.audio, "🔊", `data-lang="${q.lang || "en-US"}"`)}${sayBtn(q.audio, "🐢", `data-lang="${q.lang || "en-US"}" data-slow="1"`)}</div>` : ""}
        <div class="q-prompt">${q.prompt}</div>
        ${q.sub ? `<div class="q-sub">${q.sub}</div>` : ""}
        <div class="q-body"></div>
        <div class="q-feedback"></div>
      </div>`;
    $("[data-quit]", container).onclick = () => go(back);
    const body = $(".q-body", container);

    if (q.options) {
      body.innerHTML = `<div class="options">${q.options.map((o) => `<button class="option">${escapeHtml(o)}</button>`).join("")}</div>`;
      $$(".option", body).forEach((btn, i) => {
        btn.onclick = () => {
          const ok = q.options[i] === q.answer;
          $$(".option", body).forEach((b, j) => {
            b.disabled = true;
            if (q.options[j] === q.answer) b.classList.add("correct");
          });
          if (!ok) btn.classList.add("wrong");
          answered(q, ok, q.answer);
        };
      });
    } else {
      body.innerHTML = `
        <form>
          <input class="answer-input" type="text" placeholder="Escribe tu respuesta..." autocomplete="off" autocapitalize="off" spellcheck="false">
          <button class="btn block" type="submit">Comprobar</button>
        </form>`;
      const input = $("input", body);
      setTimeout(() => input.focus(), 50);
      $("form", body).onsubmit = (e) => {
        e.preventDefault();
        const value = input.value.trim();
        if (!value) return;
        input.disabled = true;
        $("button", body).hidden = true;
        if (q.check) {
          const r = q.check(value);
          answered(q, r.ok, null, r.html);
        } else {
          const ok = isCorrect(q, value);
          answered(q, ok, q.answers[0], !ok && almost(q, value) ? "😅 ¡Casi! Revisa la ortografía." : "");
        }
      };
    }
    if (q.audio) setTimeout(() => speak(q.audio, { lang: q.lang }), 300);
  }

  function answered(q, ok, correct, extraHtml = "") {
    const isRetry = retried.has(q);
    if (ok) { score++; if (!isRetry) firstTry++; }
    $(".q-score", container).textContent = `⭐ ${score}`;
    recordAnswer(ok);
    if (q.onResult) q.onResult(ok);
    if (!ok && !isRetry) { retried.add(q); queue.push(q); }

    $(".q-feedback", container).innerHTML = `
      <div class="feedback ${ok ? "ok" : "no"}">
        <div class="fb-title">${ok ? pick(["✅ Correct!", "🔥 Nice!", "🎯 ¡Exacto!", "💪 ¡Bien hecho!"]) : "❌ Incorrect"}</div>
        ${!ok && correct ? `<div>La respuesta correcta es: <b>${escapeHtml(correct)}</b></div>` : ""}
        ${extraHtml ? `<div style="margin-top:6px">${extraHtml}</div>` : ""}
        ${q.explain ? `<div class="small" style="margin-top:6px">💡 ${q.explain}</div>` : ""}
        ${q.say ? `<div class="row" style="margin-top:8px">${sayBtn(q.say, "🔊 Escuchar")} <span class="small">${escapeHtml(q.say)}</span></div>` : ""}
      </div>
      <button class="btn block" data-next>${index + 1 < queue.length ? "Siguiente ➡️" : "Ver resultado 🏁"}</button>`;
    if (q.say && ok) speak(q.say);
    const next = $("[data-next]", container);
    next.focus();
    next.onclick = () => { index++; show(); };
  }

  function finish() {
    const pct = Math.round((firstTry / total) * 100);
    const [emoji, msg] = pct === 100 ? ["🏆", "¡Perfecto! Legend!"] : pct >= 80 ? ["😎", "¡Casi nativo!"] : pct >= 60 ? ["💪", "¡Vas muy bien!"] : ["🔥", "Buen calentamiento, ¡otra vez!"];
    container.innerHTML = `
      <div class="quiz-card" style="text-align:center">
        <div class="result-big">${emoji}</div>
        <h2 style="margin:0">${msg}</h2>
        <p class="muted">${title}: <b>${firstTry} de ${total}</b> correctas al primer intento (${pct}%)</p>
        <div class="btn-row">
          <button class="btn" data-again>🔁 Otra vez</button>
          <button class="btn ghost" data-back>⬅️ Volver</button>
        </div>
      </div>`;
    $("[data-back]", container).onclick = () => go(back);
    $("[data-again]", container).onclick = () => render();
    if (onFinish) onFinish({ correct: firstTry, total, pct });
  }

  show();
}

function levenshtein(a, b) {
  const dp = Array.from({ length: a.length + 1 }, (_, i) => [i, ...Array(b.length).fill(0)]);
  for (let j = 1; j <= b.length; j++) dp[0][j] = j;
  for (let i = 1; i <= a.length; i++)
    for (let j = 1; j <= b.length; j++)
      dp[i][j] = Math.min(dp[i - 1][j] + 1, dp[i][j - 1] + 1, dp[i - 1][j - 1] + (a[i - 1] === b[j - 1] ? 0 : 1));
  return dp[a.length][b.length];
}

// ---------- Preguntas de verbos (se usan en Verbos y en Repaso) ----------
const TENSES = {
  pres: { label: "🟢 Presente", color: "var(--pres)" },
  past: { label: "🔴 Pasado", color: "var(--past)" },
  pp: { label: "🟣 Participio", color: "var(--pp)" },
  fut: { label: "🔵 Futuro", color: "var(--fut)" },
  ger: { label: "🟠 Gerundio", color: "var(--ger)" },
};
const esMain = (v) => v.es.split(" / ")[0];

function verbQuestion(v, tense) {
  const hint = `(${escapeHtml(esMain(v))} · <b>${v.base}</b>)`;
  const blank = `<span class="blank">___</span>`;
  const T = TENSES[tense];
  const base = { tag: T.label, color: T.color, onResult: (ok) => recordVerb(v.base, ok) };

  // Si el verbo tiene ejemplo propio, usamos esa frase
  const exIndex = { pres: 0, past: 1, pp: 2 }[tense];
  const ex = v.examples[exIndex];
  if (ex) {
    const answer = ex.en.match(/\*(.+?)\*/)[1];
    return {
      ...base,
      prompt: escapeHtml(ex.en).replace(/\*.+?\*/, blank),
      sub: `🇪🇸 ${escapeHtml(ex.es)}<br>${hint}`,
      answers: [answer],
      say: ex.en.replace(/\*/g, ""),
      explain: explainForm(v, tense),
    };
  }
  // Si no, usamos una frase modelo
  const models = {
    pres: [`Every day she ${blank}.`, [v.third], `Every day she ${v.third}.`],
    past: [`Yesterday I ${blank}.`, v.past.split(" / "), `Yesterday I ${v.past.split(" / ")[0]}.`],
    pp: [`I have already ${blank}.`, [v.participle], `I have already ${v.participle}.`],
    fut: [`Tomorrow I ${blank}.`, [`will ${v.base}`, `'ll ${v.base}`, `am going to ${v.base}`, `'m going to ${v.base}`], `Tomorrow I will ${v.base}.`],
    ger: [`Right now I am ${blank}.`, [v.ing], `Right now I am ${v.ing}.`],
  };
  const [prompt, answers, say] = models[tense];
  return { ...base, prompt, sub: hint, answers, say, explain: explainForm(v, tense) };
}

function explainForm(v, tense) {
  switch (tense) {
    case "pres": return v.base === "be" ? "I am · you are · he/she/it is" : `Con he / she / it se agrega -s: ${v.base} → <b>${v.third}</b>.`;
    case "past": return v.irregular ? `Pasado irregular: ${v.base} → <b>${v.past}</b>. ¡Hay que memorizarlo! 🔥` : `Regular: ${v.base} + ed → <b>${v.past}</b>.`;
    case "pp": return v.irregular ? `Participio irregular: ${v.base} → <b>${v.participle}</b> (se usa con have).` : `Regular: el participio es igual al pasado → <b>${v.participle}</b>.`;
    case "fut": return `Futuro = <b>will</b> + verbo normal → will ${v.base}.`;
    case "ger": return `Gerundio = verbo + ing → <b>${v.ing}</b>.`;
  }
}

// Elige verbos para practicar: prioriza irregulares y los que fallas
function pickVerbsForPractice(n, pool = VERBS.filter(allowed)) {
  const weighted = pool.map((v) => {
    const s = verbState(v.base);
    let w = v.irregular ? 3 : 1;
    if (s.bad > s.ok) w += 3;
    if (s.mastered) w *= 0.3;
    if (v.important) w += 1;
    return { v, r: Math.random() * w };
  });
  return weighted.sort((a, b) => b.r - a.r).slice(0, n).map((x) => x.v);
}
function randomTense(v) {
  return v.irregular ? pick(["past", "past", "pp", "pp", "pres", "fut", "ger"]) : pick(["past", "pp", "pres", "fut", "ger"]);
}
