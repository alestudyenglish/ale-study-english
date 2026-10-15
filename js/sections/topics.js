// 🎯 TEMAS — motor común para "Temas de clase" y "Paul the Mechanic"
// Cada tema (js/data/topics.js, js/data/paul.js) tiene: explicación, laboratorio de
// pronunciación y los mismos juegos. Así todos los temas funcionan igual.
const T = (p) => (Array.isArray(p) ? tx(p[0], p[1]) : p || "");
// ⚡ velocidad nativa: como habla la gente en la calle (un poco más rápido que tu velocidad)
const nativeRate = () => Math.max(voiceRate(), 1.05);
// Negrita = palabras que llevan la fuerza · gris = palabras débiles (se dicen rápido)
const stressHtml = (en) => en.split(" ").map((w) => {
  const bare = w.toLowerCase().replace(/[.,?!:]/g, "").replace(/’/g, "'");
  return WEAK_WORDS.has(bare) ? `<span class="weak">${escapeHtml(w)}</span>` : `<b>${escapeHtml(w)}</b>`;
}).join(" ");
// 🎤 abre la ventana "Dilo tú" (data-pron="frase" data-lang="en-AU")
document.addEventListener("click", (e) => {
  const b = e.target.closest("[data-pron]");
  if (b) pronounceSheet(b.dataset.pron, b.dataset.lang || "en-US");
});

function makeTopicSection(name, pack) {
  const lang = pack.lang || "en-US";
  const L = `data-lang="${lang}"`;
  const say = (text, opts = {}) => speak(text, { lang, ...opts });
  // 🐢 lento · 🔊 tu velocidad · ⚡ nativo · 🎤 dilo tú
  const listenBtns = (en) => `${sayBtn(en, "🐢", `${L} data-slow="1"`)}${sayBtn(en, "🔊", L)}${sayBtn(en, "⚡", `${L} data-rate="${nativeRate()}"`)}<button class="icon-btn" type="button" data-pron="${escapeHtml(en)}" ${L} title="${tx("Dilo tú", "قلها أنت")}">🎤</button>`;
  const color = (t, g) => (t.groups && t.groups[g] ? t.groups[g].color : "var(--accent)");
  const ex = (t, s) => `
    <div class="ex" style="--c:${color(t, s.g)}"><div class="text"><div class="en stress" dir="ltr">${stressHtml(s.en)}</div><div class="es">${escapeHtml(tx(s.es, s.ar))}</div></div>
    <div class="btns">${listenBtns(s.en)}</div></div>`;
  const wrongRight = (w, r) => `<div class="issue" dir="ltr"><span class="wrong">❌ ${escapeHtml(w)}</span> → <span class="right">✅ ${escapeHtml(r)}</span></div>`;
  const vocabOf = (t) => t.blocks.flatMap((b) => b.vocab || []);
  const hasType = (t) => t.typeGame !== false && Object.keys(t.groups || {}).length > 1;

  const GAMES = [
    { id: "ear", ico: "🎧", title: ["Oído fino", "أذن دقيقة"], sub: ["Escucha a velocidad nativa y elige lo que oíste", "استمع بسرعة أهل اللغة واختر ما سمعته"], ok: (t) => t.ear && t.ear.length },
    { id: "words", ico: "🔤", title: ["Palabras clave", "الكلمات المهمة"], sub: ["Escucha la palabra y elige qué significa", "استمع إلى الكلمة واختر معناها"], ok: (t) => vocabOf(t).length >= 4 },
    { id: "type", ico: "🔀", title: ["¿Cuál es?", "أيّها؟"], sub: (t) => t.typeQ, ok: hasType },
    { id: "gap", ico: "🧩", title: ["Completa la frase", "أكمل الجملة"], sub: ["Elige la palabra correcta y escucha la frase", "اختر الكلمة الصحيحة واستمع إلى الجملة"], ok: (t) => t.sentences.some((s) => s.gap) },
    { id: "shadow", ico: "🗣️", title: ["Escucha y repite", "استمع وكرّر"], sub: ["Imita la frase al micrófono y mira tu puntaje", "قلّد الجملة في الميكروفون وشاهد نتيجتك"], ok: (t) => t.sentences.length },
    { id: "talk", ico: "💬", title: ["Tu turno", "دورك"], sub: ["Responde hablando, como en la vida real", "أجب بالكلام كما في الحياة الحقيقية"], ok: (t) => t.talk && t.talk.length },
  ];
  const gamesOf = (t) => GAMES.filter((g) => g.ok(t));
  const key = (t, g) => `${name}-${t.id}-${g}`;
  const top = (t, title, right = "") => gameTop(title, right, `${name}/${t.id}`);
  const end = (view, t, opts) => gameEnd(view, { ...opts, id: key(t, opts.id), back: `${name}/${t.id}`, backLabel: `${t.ico} ${tx("Volver al tema", "العودة إلى الموضوع")}` });
  const bar = (i, n) => `<div class="bar" style="margin-bottom:14px"><div style="width:${(i / n) * 100}%"></div></div>`;
  const resultEmoji = (score, n) => (score >= n * 0.9 ? "🏆" : score >= n * 0.7 ? "😎" : "💪");
  const nextLabel = (i, n) => (i + 1 < n ? NEXT_LABEL() : RESULT_LABEL());
  const howTo = () => `
    <div class="card-box how-to">
      <b>🔊 ${tx("Cómo escuchar y practicar", "كيف تستمع وتتدرّب")}</b>
      <p class="small" style="margin:6px 0 0">${tx("🐢 lento, para oír cada sonido · 🔊 tu velocidad · ⚡ velocidad nativa, como en la calle · 🎤 dilo tú y te doy un puntaje.", "🐢 ببطء لسماع كل صوت · 🔊 سرعتك · ⚡ سرعة أهل اللغة كما في الشارع · 🎤 قلها أنت وسأعطيك نتيجة.")}</p>
      <p class="small" style="margin:6px 0 0">${tx("En las frases, las palabras en <b>negrita</b> se dicen <b>más fuerte</b> y las <span class=\"weak\">grises</span> rápido y suave. Imitar ese ritmo es el secreto para que te entiendan.", "في الجمل، الكلمات <b>العريضة</b> تُقال <b>بقوة أكبر</b> و<span class=\"weak\">الرمادية</span> بسرعة وخفّة. تقليد هذا الإيقاع هو سرّ أن يفهمك الآخرون.")}</p>
    </div>`;
  const soundLab = (t) => `
    ${t.sounds.map(([full, short, ipa, es, ar, sample]) => `
      <div class="ex" style="--c:var(--accent)"><div class="text">
        <div class="row" dir="ltr" style="gap:6px;flex-wrap:wrap">
          ${full !== short ? `<button class="chip" data-say="${escapeHtml(full)}" ${L} data-slow="1">🔊 ${escapeHtml(full)}</button><span>→</span>` : ""}
          <button class="chip" data-say="${escapeHtml(short.replace(/[↗↘]/g, ""))}" ${L} data-slow="1" style="font-weight:700">🔊 ${escapeHtml(short)}</button>
          ${ipa ? `<span class="muted">${ipa}</span>` : ""}</div>
        <div class="small" style="margin-top:6px">${tx(es, ar)}</div>
        <div class="row" style="margin-top:6px;flex-wrap:wrap"><span class="en stress" dir="ltr" style="flex:1;min-width:150px">${stressHtml(sample)}</span><span class="btns">${listenBtns(sample)}</span></div>
      </div></div>`).join("")}`;

  return {
    render(view, id, sub) {
      const t = pack.topics.find((x) => x.id === id);
      if (!t) return this.index(view);
      if (!sub) return this.topic(view, t);
      if (sub === "learn") return this.learn(view, t);
      if (sub === "sounds") return this.sounds(view, t);
      const g = gamesOf(t).find((x) => x.id === sub);
      if (g) return this["g_" + g.id](view, t);
      go(`${name}/${t.id}`);
    },

    index(view) {
      view.innerHTML = `
        <h1 class="page">${pack.ico} ${pack.title}</h1>
        <p class="lead">${T(pack.lead)}</p>
        ${pack.intro ? `<div class="card-box paul-intro"><div class="row"><span class="paul-face">👨‍🔧</span><div style="flex:1"><div class="en" dir="ltr"><b>${escapeHtml(pack.intro.en)}</b></div><div class="small muted">${escapeHtml(tx(pack.intro.es, pack.intro.ar))}</div></div>${sayBtn(pack.intro.en, "🔊", L)}</div></div>` : ""}
        ${pack.topics.map((t) => {
          const done = gamesOf(t).filter((g) => gameBest(key(t, g.id))).length;
          return listItem(`${name}/${t.id}`, t.ico, `<span dir="ltr">${t.title}</span>`, `${T(t.sub)}${done ? ` · 🏆 ${done}/${gamesOf(t).length}` : ""}`);
        }).join("")}`;
    },

    topic(view, t) {
      view.innerHTML = `
        <button class="btn ghost" onclick="go('${name}')" style="margin:6px 0 12px">${isAr ? "➡️" : "⬅️"} ${pack.title}</button>
        <h1 class="page">${t.ico} <span dir="ltr">${t.title}</span></h1>
        <div class="card-box why-box"><b>🎯 ${tx("¿Para qué te sirve?", "ما فائدته لك؟")}</b><p style="margin:6px 0 0">${T(t.why)}</p></div>
        <div class="level-group">📚 ${tx("Aprender", "تعلّم")}</div>
        ${listItem(`${name}/${t.id}/learn`, "📖", tx("Explicación con ejemplos", "شرح مع أمثلة"), tx("Gramática paso a paso, con audio · empieza aquí", "القواعد خطوة بخطوة مع الصوت · ابدأ من هنا"))}
        ${t.sounds && t.sounds.length ? listItem(`${name}/${t.id}/sounds`, "🔊", tx("Laboratorio de pronunciación", "مختبر النطق"), tx("Cómo suena de verdad: compara, escucha y repite", "كيف تُنطق فعلًا: قارن واستمع وكرّر")) : ""}
        <div class="level-group">🎮 ${tx("Practicar", "تدرّب")}</div>
        ${gamesOf(t).map((g) => listItem(`${name}/${t.id}/${g.id}`, g.ico, T(g.title), `${T(typeof g.sub === "function" ? g.sub(t) : g.sub)}${gameBest(key(t, g.id)) ? ` · 🏆 ${gameBest(key(t, g.id))}` : ""}`)).join("")}`;
    },

    // ---------------------------------------------------------------
    // 📖 EXPLICACIÓN
    // ---------------------------------------------------------------
    learn(view, t) {
      const block = (b, n) => {
        const exs = [...(b.ex || []), ...(b.exG ? t.sentences.filter((s) => s.g === b.exG[0]).slice(0, b.exG[1]) : [])];
        const border = b.g !== undefined ? `style="border-inline-start:5px solid ${color(t, b.g)}"` : "";
        return `<div class="card-box" ${border}>
          <div class="section-title" style="margin-top:0">${T(b.title)}</div>
          ${b.text ? `<p>${T(b.text)}</p>` : ""}
          ${b.formula ? `<div class="formula" dir="ltr"><span>${escapeHtml(b.formula)}</span></div>` : ""}
          ${b.vocab ? `<div class="vocab-grid">${b.vocab.map(([en, es, ar]) => `<button class="irr" data-say="${escapeHtml(en)}" ${L} data-slow="1"><b dir="ltr">🔊 ${escapeHtml(en)}</b><small>${escapeHtml(tx(es, ar))}</small></button>`).join("")}</div>` : ""}
          ${b.list ? `<ul class="explain small">${b.list.map((li) => `<li>${T(li)}</li>`).join("")}</ul>` : ""}
          ${exs.map((s) => ex(t, s)).join("")}
          ${(b.wrong || []).map(([w, r]) => wrongRight(w, r)).join("")}
        </div>`;
      };
      view.innerHTML = `
        <button class="btn ghost" onclick="go('${name}/${t.id}')" style="margin:6px 0 12px">${isAr ? "➡️" : "⬅️"} <span dir="ltr">${t.title}</span></button>
        <h1 class="page">📖 <span dir="ltr">${t.title}</span></h1>
        <div class="card-box why-box"><b>🎯 ${tx("¿Para qué te sirve?", "ما فائدته لك؟")}</b><p style="margin:6px 0 0">${T(t.why)}</p></div>
        ${howTo()}
        ${t.blocks.map(block).join("")}
        ${t.sounds && t.sounds.length ? `<div class="card-box"><div class="section-title" style="margin-top:0">🔊 ${tx("Laboratorio de pronunciación", "مختبر النطق")}</div>${soundLab(t)}</div>` : ""}
        <div class="section-title">🎮 ${tx("¡Ahora practica!", "تدرّب الآن!")}</div>
        ${gamesOf(t).map((g) => listItem(`${name}/${t.id}/${g.id}`, g.ico, T(g.title), T(typeof g.sub === "function" ? g.sub(t) : g.sub))).join("")}`;
    },

    // ---------------------------------------------------------------
    // 🔊 LABORATORIO DE PRONUNCIACIÓN
    // ---------------------------------------------------------------
    sounds(view, t) {
      view.innerHTML = `
        <button class="btn ghost" onclick="go('${name}/${t.id}')" style="margin:6px 0 12px">${isAr ? "➡️" : "⬅️"} <span dir="ltr">${t.title}</span></button>
        <h1 class="page">🔊 ${tx("Pronunciación", "النطق")}</h1>
        <p class="lead">${tx("1) Escucha la palabra lenta 🐢  2) Lee cómo suena  3) Escucha la frase a velocidad nativa ⚡  4) Repítela con 🎤.", "1) استمع إلى الكلمة ببطء 🐢  2) اقرأ كيف تُنطق  3) استمع إلى الجملة بسرعة أهل اللغة ⚡  4) كرّرها مع 🎤.")}</p>
        ${howTo()}
        ${soundLab(t)}
        ${gamesOf(t).filter((g) => ["ear", "shadow"].includes(g.id)).map((g) => listItem(`${name}/${t.id}/${g.id}`, g.ico, T(g.title), T(g.sub))).join("")}`;
    },

    // ---------------------------------------------------------------
    // 🎧 OÍDO FINO: frases que suenan parecido
    // ---------------------------------------------------------------
    g_ear(view, t) {
      const round = () => {
        const items = shuffle(t.ear.flatMap((set) => set.map((s, k) => ({ set, k })))).slice(0, 10);
        let i = 0, score = 0;
        const show = () => {
          if (i >= items.length) return end(view, t, {
            emoji: resultEmoji(score, items.length), id: "ear", score,
            title: tx(`${score} de ${items.length} correctas`, `${score} من ${items.length} صحيحة`), lines: [`💡 ${T(t.earTip)}`], again: round,
          });
          const it = items[i], text = it.set[it.k];
          view.innerHTML = `${top(t, `🎧 ${tx("Oído fino", "أذن دقيقة")}`, `<b>⭐ ${score}</b>`)}${bar(i, items.length)}
            <div class="quiz-card" style="text-align:center">
              <div class="small muted">${T(t.earQ) || tx("¿Qué escuchaste?", "ماذا سمعت؟")}</div>
              <div class="audio-prompt"><button class="icon-btn big-play" data-play title="⚡">🔊</button><button class="icon-btn" data-slow title="🐢">🐢</button></div>
              <div class="options" dir="ltr">${it.set.map((s, k) => `<button class="option" data-k="${k}">${escapeHtml(s)}</button>`).join("")}</div>
              <div class="q-feedback"></div>
            </div>`;
          const play = (slow) => say(text, slow ? { slow: true } : { rate: nativeRate() });
          $("[data-play]", view).onclick = () => play();
          $("[data-slow]", view).onclick = () => play(true);
          setTimeout(() => play(), 300);
          $$(".option", view).forEach((b) => (b.onclick = () => {
            const ok = Number(b.dataset.k) === it.k;
            if (ok) score++;
            recordAnswer(ok);
            $$(".option", view).forEach((o) => { o.disabled = true; if (Number(o.dataset.k) === it.k) o.classList.add("correct"); });
            if (!ok) b.classList.add("wrong");
            $(".q-feedback", view).innerHTML = `
              <div class="feedback ${ok ? "ok" : "no"}" style="text-align:start">
                <div class="fb-title">${ok ? pick(["✅ Correct!", tx("🎯 ¡Qué oído!", "🎯 أذن ممتازة!"), "🔥 Nice!"]) : tx("❌ Era otra. Escucha las dos y compara:", "❌ كانت أخرى. استمع إليهما وقارن:")}</div>
                ${it.set.map((s, k) => `<div class="row"><span dir="ltr" style="flex:1">${k === it.k ? "👉 " : ""}${stressHtml(s)}</span>${sayBtn(s, "🐢", `${L} data-slow="1"`)}${sayBtn(s, "⚡", `${L} data-rate="${nativeRate()}"`)}</div>`).join("")}
                <div class="small" style="margin-top:6px">💡 ${T(t.earTip)}</div>
              </div>
              <button class="btn block" data-next>${nextLabel(i, items.length)}</button>`;
            $("[data-next]", view).onclick = () => { i++; show(); };
          }));
        };
        show();
      };
      round();
    },

    // ---------------------------------------------------------------
    // 🔤 PALABRAS CLAVE: escucha y elige el significado
    // ---------------------------------------------------------------
    g_words(view, t) {
      const pool = vocabOf(t);
      const round = () => {
        const items = shuffle(pool).slice(0, Math.min(10, pool.length));
        let i = 0, score = 0;
        const show = () => {
          if (i >= items.length) return end(view, t, {
            emoji: resultEmoji(score, items.length), id: "words", score,
            title: tx(`${score} de ${items.length} palabras`, `${score} من ${items.length} كلمات`), lines: [tx("💡 Repite en voz alta cada palabra que fallaste.", "💡 كرّر بصوت عالٍ كل كلمة أخطأت فيها.")], again: round,
          });
          const [en, es, ar] = items[i];
          const right = tx(es, ar);
          const opts = shuffle([right, ...shuffle(pool.filter((v) => v[0] !== en)).slice(0, 3).map((v) => tx(v[1], v[2]))]);
          view.innerHTML = `${top(t, `🔤 ${tx("Palabras clave", "الكلمات المهمة")}`, `<b>⭐ ${score}</b>`)}${bar(i, items.length)}
            <div class="quiz-card" style="text-align:center">
              <div class="small muted">${tx("Escucha: ¿qué significa?", "استمع: ماذا تعني؟")}</div>
              <div class="audio-prompt"><button class="icon-btn big-play" data-play>🔊</button><button class="icon-btn" data-slow>🐢</button></div>
              <div class="big" dir="ltr" data-word hidden style="font-size:1.8rem;margin-bottom:8px">${escapeHtml(en)}</div>
              <button class="btn ghost" data-show style="margin-bottom:10px">👀 ${tx("Ver la palabra", "اعرض الكلمة")}</button>
              <div class="options">${opts.map((o) => `<button class="option">${escapeHtml(o)}</button>`).join("")}</div>
              <div class="q-feedback"></div>
            </div>`;
          $("[data-play]", view).onclick = () => say(en);
          $("[data-slow]", view).onclick = () => say(en, { slow: true });
          $("[data-show]", view).onclick = (e) => { $("[data-word]", view).hidden = false; e.target.hidden = true; };
          setTimeout(() => say(en), 300);
          $$(".option", view).forEach((b) => (b.onclick = () => {
            const ok = b.textContent === right;
            if (ok) score++;
            recordAnswer(ok);
            $$(".option", view).forEach((o) => { o.disabled = true; if (o.textContent === right) o.classList.add("correct"); });
            if (!ok) b.classList.add("wrong");
            $("[data-word]", view).hidden = false; $("[data-show]", view).hidden = true;
            $(".q-feedback", view).innerHTML = `
              <div class="feedback ${ok ? "ok" : "no"}" style="text-align:start">
                <div class="row"><span style="flex:1"><b dir="ltr">${escapeHtml(en)}</b> = ${escapeHtml(right)}</span>${listenBtns(en)}</div>
              </div>
              <button class="btn block" data-next>${nextLabel(i, items.length)}</button>`;
            $("[data-next]", view).onclick = () => { i++; show(); };
          }));
        };
        show();
      };
      round();
    },

    // ---------------------------------------------------------------
    // 🔀 ¿CUÁL ES? (clasificar la frase que escuchas)
    // ---------------------------------------------------------------
    g_type(view, t) {
      const round = () => {
        const items = shuffle(t.sentences.filter((s) => t.groups[s.g])).slice(0, 10);
        let i = 0, score = 0;
        const show = () => {
          if (i >= items.length) return end(view, t, {
            emoji: resultEmoji(score, items.length), id: "type", score,
            title: tx(`${score} de ${items.length} correctas`, `${score} من ${items.length} صحيحة`),
            lines: Object.values(t.groups).map((g) => `${g.ico} <b dir="ltr">${g.short}</b>: ${T(g.use)}`), again: round,
          });
          const s = items[i];
          view.innerHTML = `${top(t, `🔀 ${tx("¿Cuál es?", "أيّها؟")}`, `<b>⭐ ${score}</b>`)}${bar(i, items.length)}
            <div class="quiz-card" style="text-align:center">
              <div class="small muted">${T(t.typeQ)}</div>
              <div class="audio-prompt"><button class="icon-btn big-play" data-play>🔊</button><button class="icon-btn" data-slow>🐢</button></div>
              <div class="q-prompt" dir="ltr" data-text hidden>${escapeHtml(s.en)}</div>
              <button class="btn ghost" data-show style="margin-bottom:10px">👀 ${tx("Ver la frase", "اعرض الجملة")}</button>
              <div class="dgp-btns">${Object.entries(t.groups).map(([k, g]) => `<button class="btn dgp" data-t="${k}" style="background:${g.color}">${g.ico} <span dir="ltr">${g.short}</span></button>`).join("")}</div>
              <div class="q-feedback"></div>
            </div>`;
          $("[data-play]", view).onclick = () => say(s.en);
          $("[data-slow]", view).onclick = () => say(s.en, { slow: true });
          $("[data-show]", view).onclick = (e) => { $("[data-text]", view).hidden = false; e.target.hidden = true; };
          setTimeout(() => say(s.en), 300);
          $$("[data-t]", view).forEach((b) => (b.onclick = () => {
            const ok = b.dataset.t === String(s.g);
            if (ok) score++;
            recordAnswer(ok);
            $$("[data-t]", view).forEach((x) => { x.disabled = true; x.style.opacity = x.dataset.t === String(s.g) ? 1 : 0.35; });
            $("[data-text]", view).hidden = false; $("[data-show]", view).hidden = true;
            const g = t.groups[s.g];
            $(".q-feedback", view).innerHTML = `
              <div class="feedback ${ok ? "ok" : "no"}" style="text-align:start">
                <div class="fb-title">${ok ? "✅ Correct!" : `❌ ${g.ico} <span dir="ltr">${g.name}</span>`}</div>
                <div class="en stress" dir="ltr">${stressHtml(s.en)}</div>
                <div class="small">${escapeHtml(tx(s.es, s.ar))}</div>
                <div class="small" style="margin-top:4px">💡 <b dir="ltr">${g.name}</b>: ${T(g.use)}${g.form ? ` · <span dir="ltr">${escapeHtml(g.form)}</span>` : ""}</div>
                <div class="row" style="margin-top:6px">${listenBtns(s.en)}</div>
              </div>
              <button class="btn block" data-next>${nextLabel(i, items.length)}</button>`;
            $("[data-next]", view).onclick = () => { i++; show(); };
          }));
        };
        show();
      };
      round();
    },

    // ---------------------------------------------------------------
    // 🧩 COMPLETA LA FRASE
    // ---------------------------------------------------------------
    g_gap(view, t) {
      const round = () => {
        const items = shuffle(t.sentences.filter((s) => s.gap)).slice(0, 10);
        let i = 0, score = 0;
        const show = () => {
          if (i >= items.length) return end(view, t, {
            emoji: resultEmoji(score, items.length), id: "gap", score,
            title: tx(`${score} de ${items.length} correctas`, `${score} من ${items.length} صحيحة`),
            lines: [tx("💡 Repite en voz alta las frases que fallaste: así se fijan.", "💡 كرّر بصوت عالٍ الجمل التي أخطأت فيها: هكذا تترسّخ.")], again: round,
          });
          const s = items[i], [text, right, ...wrong] = s.gap, g = t.groups && t.groups[s.g];
          view.innerHTML = `${top(t, `🧩 ${tx("Completa la frase", "أكمل الجملة")}`, `<b>⭐ ${score}</b>`)}${bar(i, items.length)}
            <div class="quiz-card">
              ${g ? `<span class="q-tag" style="--c:${g.color}">${g.ico} <span dir="ltr">${g.name}</span></span>` : ""}
              <div class="q-prompt" dir="ltr">${escapeHtml(text).replace("___", `<span class="blank">___</span>`)}</div>
              <div class="q-sub">${NATIVE.flag} ${escapeHtml(tx(s.es, s.ar))}</div>
              <div class="options" dir="ltr">${shuffle([right, ...wrong]).map((o) => `<button class="option">${escapeHtml(o)}</button>`).join("")}</div>
              <div class="q-feedback"></div>
            </div>`;
          $$(".option", view).forEach((b) => (b.onclick = () => {
            const ok = b.textContent === right;
            if (ok) score++;
            recordAnswer(ok);
            $$(".option", view).forEach((o) => { o.disabled = true; if (o.textContent === right) o.classList.add("correct"); });
            if (!ok) b.classList.add("wrong");
            say(s.en);
            $(".q-feedback", view).innerHTML = `
              <div class="feedback ${ok ? "ok" : "no"}">
                <div class="fb-title">${ok ? "✅ Correct!" : tx("❌ Casi. Escucha la frase correcta:", "❌ قريب. استمع إلى الجملة الصحيحة:")}</div>
                <div class="en stress" dir="ltr">${stressHtml(s.en)}</div>
                ${g && g.form ? `<div class="small" style="margin-top:4px">💡 <span dir="ltr">${escapeHtml(g.form)}</span></div>` : ""}
                <div class="row" style="margin-top:6px">${listenBtns(s.en)}</div>
              </div>
              <button class="btn block" data-next>${nextLabel(i, items.length)}</button>`;
            $("[data-next]", view).onclick = () => { i++; show(); };
          }));
        };
        show();
      };
      round();
    },

    // ---------------------------------------------------------------
    // 🗣️ ESCUCHA Y REPITE (shadowing con puntaje)
    // ---------------------------------------------------------------
    g_shadow(view, t) {
      const round = () => {
        const items = shuffle(t.sentences).slice(0, 6);
        let i = 0, total = 0;
        const show = () => {
          if (i >= items.length) {
            const avg = Math.round(total / items.length);
            return end(view, t, {
              emoji: avg >= 85 ? "🏆" : avg >= 65 ? "😎" : "💪", id: "shadow", score: avg,
              title: tx(`Pronunciación promedio: ${avg}%`, `متوسط النطق: ${avg}%`),
              lines: [tx("💡 Truco: escucha 🐢, después ⚡, y repite justo detrás de la voz imitando el ritmo (las palabras en negrita, más fuertes).", "💡 حيلة: استمع 🐢 ثم ⚡، وكرّر مباشرة بعد الصوت مقلّدًا الإيقاع (الكلمات العريضة أقوى).")], again: round,
            });
          }
          const s = items[i], g = t.groups && t.groups[s.g];
          let best = 0;
          view.innerHTML = `${top(t, `🗣️ ${tx("Escucha y repite", "استمع وكرّر")} ${i + 1}/${items.length}`)}
            <div class="quiz-card">
              ${g ? `<span class="q-tag" style="--c:${g.color}">${g.ico} <span dir="ltr">${g.name}</span></span>` : ""}
              <div class="q-prompt en stress" dir="ltr" style="font-size:1.3rem">${stressHtml(s.en)}</div>
              <div class="q-sub">${NATIVE.flag} ${escapeHtml(tx(s.es, s.ar))}</div>
              <div class="small muted">${tx("1) Escucha lento 🐢  2) Escucha nativo ⚡  3) Toca 🎤 y repítela", "1) استمع ببطء 🐢  2) استمع بسرعة أهل اللغة ⚡  3) اضغط 🎤 وكرّرها")}</div>
              <div class="btn-row" style="margin:10px 0">${sayBtn(s.en, tx("🐢 Lento", "🐢 ببطء"), `${L} data-slow="1"`)}${sayBtn(s.en, "🔊 Normal", L)}${sayBtn(s.en, tx("⚡ Nativo", "⚡ سريع"), `${L} data-rate="${nativeRate()}"`)}</div>
              <div class="mic-slot"></div>
              <div class="result"></div>
              <button class="btn ghost block" data-next style="margin-top:10px">${tx("Saltar ➡️", "تخطَّ ⬅️")}</button>
            </div>`;
          setTimeout(() => say(s.en, { slow: true }), 300);
          $("[data-next]", view).onclick = () => { total += best; i++; show(); };
          $(".mic-slot", view).appendChild(micWidget((said) => {
            const d = wordDiff(s.en, said);
            const pct = Math.round(d.score * 100);
            best = Math.max(best, pct);
            Store.data.stats.speakTotal++; if (pct >= 80) Store.data.stats.speakPerfect++;
            recordAnswer(pct >= 80);
            $(".result", view).innerHTML = `
              <div class="feedback ${pct >= 80 ? "ok" : "no"}">
                <div class="fb-title">${pct >= 95 ? tx("🔥 ¡Perfecto!", "🔥 ممتاز!") : pct >= 80 ? tx("✅ ¡Muy bien!", "✅ جيد جدًا!") : tx("💪 ¡Casi! Escucha 🐢 y prueba otra vez", "💪 قريب! استمع 🐢 وحاول مرة أخرى")} (${pct}%)</div>
                <div dir="ltr">${d.html}</div>
                <div class="small muted" style="margin-top:6px">${tx("🟢 bien dichas · 🔴 faltaron o sonaron distinto", "🟢 نُطقت جيدًا · 🔴 ناقصة أو نُطقت بشكل مختلف")}</div>
              </div>`;
            const nb = $("[data-next]", view);
            nb.textContent = nextLabel(i, items.length); nb.classList.remove("ghost");
            if (pct < 80) say(s.en, { slow: true });
          }, { placeholder: tx("O escríbela para practicar...", "أو اكتبها للتدرّب...") }));
        };
        show();
      };
      round();
    },

    // ---------------------------------------------------------------
    // 💬 TU TURNO (responder hablando)
    // ---------------------------------------------------------------
    g_talk(view, t) {
      const qs = shuffle(t.talk).slice(0, 4);
      let k = 0;
      const next = () => {
        if (k >= qs.length) {
          saveBest(key(t, "talk"), qs.length);
          view.innerHTML = `<div class="quiz-card" style="text-align:center"><div class="result-big">🎉</div><h2>${tx("¡Muy bien, hablaste!", "أحسنت، لقد تكلّمت!")}</h2>
            <p class="muted">${tx(`Respondiste ${qs.length} preguntas. Repite para hablar con más fluidez.`, `أجبت عن ${qs.length} أسئلة. كرّر لتتكلّم بطلاقة أكبر.`)}</p>
            <div class="btn-row"><button class="btn" onclick="render()">🔁 ${tx("Otras preguntas", "أسئلة أخرى")}</button><button class="btn ghost" onclick="go('${name}/${t.id}')">${t.ico} ${tx("Volver al tema", "العودة إلى الموضوع")}</button></div></div>`;
          return;
        }
        const p = qs[k++], g = t.groups && t.groups[p.g];
        view.innerHTML = `${top(t, `💬 ${tx("Tu turno", "دورك")} ${k}/${qs.length}`)}
          ${g ? `<div class="small" style="margin-bottom:8px"><span class="q-tag" style="--c:${g.color}">${g.ico} <span dir="ltr">${g.name}</span></span>${g.form ? ` <span dir="ltr" class="muted">${escapeHtml(g.form)}</span>` : ""}</div>` : ""}
          <div class="slot"></div>`;
        talkCard($(".slot", view), { q: p.q, es: tx(p.es, p.ar), models: p.models }, next);
      };
      next();
    },
  };
}

App.sections.topics = makeTopicSection("topics", {
  ico: "🎯", title: tx("Temas de clase", "مواضيع الصف"), topics: CLASS_TOPICS,
  lead: ["Gramática para la conversación del día a día, con foco en <b>cómo suena</b>. Cada tema: para qué sirve, explicación, pronunciación y juegos.", "قواعد للمحادثة اليومية مع التركيز على <b>كيف تُنطق</b>. كل موضوع: فائدته، الشرح، النطق والألعاب."],
});
App.sections.paul = makeTopicSection("paul", {
  ico: "🔧", title: "Paul the Mechanic", topics: PAUL_TOPICS, lang: "en-AU", intro: PAUL_INTRO,
  lead: ["Inglés para trabajar en un taller mecánico en Australia: partes del auto, herramientas, electricidad y electrónica, clientes y seguridad. 🇦🇺 Con voz australiana si tu dispositivo la tiene.", "الإنجليزية للعمل في ورشة ميكانيك في أستراليا: أجزاء السيارة، الأدوات، الكهرباء والإلكترونيات، الزبائن والسلامة. 🇦🇺 بصوت أسترالي إذا كان جهازك يدعمه."],
});
