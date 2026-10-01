// 🎲 JUEGOS DE CLASE — 4 juegos basados en los temas vistos en clase
const GAMES = [
  { id: "dgp", ico: "🏃", title: "Do · Go · Play", sub: tx("Clasifica actividades y luego habla de ellas", "صنّف الأنشطة ثم تحدّث عنها") },
  { id: "yesno", ico: "🕵️", title: "Do you know me?", sub: tx("Arma preguntas de sí/no y responde corto", "كوّن أسئلة نعم/لا وأجب باختصار") },
  { id: "wheel", ico: "🎡", title: tx("Ruleta del tiempo libre", "عجلة وقت الفراغ"), sub: tx("Gira, responde hablando y te corrijo", "أدِر العجلة، أجب بالكلام وسأصحّح لك") },
  { id: "hsi", ico: "⚡", title: "He · She · It", sub: tx("Carrera de 60 segundos con la -s del presente", "سباق 60 ثانية مع -s في المضارع") },
];
const gameBest = (id) => (Store.data.games || {})[id] || 0;
function saveBest(id, score) {
  Store.data.games = Store.data.games || {};
  const isNew = score > (Store.data.games[id] || 0);
  if (isNew) Store.data.games[id] = score;
  markDay(); Store.save();
  return isNew;
}
const NEXT_LABEL = () => tx("Siguiente ➡️", "التالي ⬅️");
const RESULT_LABEL = () => tx("Ver resultado 🏁", "عرض النتيجة 🏁");

// Bloque reutilizable: una pregunta para responder hablando o escribiendo, con corrección
function talkCard(container, p, onNext, { nextLabel = NEXT_LABEL() } = {}) {
  container.innerHTML = `
    <div class="quiz-card">
      <div class="row"><div class="q-prompt" dir="ltr" style="flex:1">${escapeHtml(p.q)}</div>${sayBtn(p.q)}</div>
      <details class="small muted"><summary>💡 ${tx("Ayuda en español", "مساعدة بالعربية")}</summary>${escapeHtml(p.es)}</details>
      <div class="mic-slot"></div>
      <div class="result"></div>
    </div>`;
  setTimeout(() => speak(p.q), 250);
  $(".mic-slot", container).appendChild(micWidget((said) => {
    const r = Checker.check(said, { tense: p.tense });
    Store.data.stats.speakTotal++; if (!r.issues.length) Store.data.stats.speakPerfect++;
    markDay(); Store.save();
    $(".result", container).innerHTML = `
      ${correctionHtml(said, r)}
      <div class="section-title">🗣️ ${tx("Ejemplos de respuesta", "أمثلة على الإجابة")}</div>
      ${p.models.map((m) => `<div class="issue row"><span style="flex:1" dir="ltr">${escapeHtml(m)}</span>${sayBtn(m)}</div>`).join("")}
      <button class="btn block" style="margin-top:10px" data-next>${nextLabel}</button>`;
    $("[data-next]", container).onclick = onNext;
    if (r.issues.length) speak(r.corrected);
  }));
}

function gameTop(title, right = "", back = "games") {
  return `<div class="row" style="margin:6px 0 12px"><button class="icon-btn" onclick="go('${back}')" title="${tx("Salir", "خروج")}">✕</button><b style="flex:1">${title}</b>${right}</div>`;
}
function gameEnd(view, { emoji, title, lines, id, score, again, extra = "", back = "games", backLabel = tx("🎲 Juegos", "🎲 الألعاب") }) {
  const isNew = saveBest(id, score);
  view.innerHTML = `
    <div class="quiz-card" style="text-align:center">
      <div class="result-big">${emoji}</div>
      <h2 style="margin:0">${title}</h2>
      ${lines.map((l) => `<p class="muted" style="margin:6px 0">${l}</p>`).join("")}
      <p><b>${isNew ? tx("🏆 ¡Nuevo récord!", "🏆 رقم قياسي جديد!") : `${tx("Tu récord", "رقمك القياسي")}: ${gameBest(id)}`}</b></p>
      ${extra}
      <div class="btn-row"><button class="btn" data-again>${tx("🔁 Otra vez", "🔁 مرة أخرى")}</button><button class="btn ghost" onclick="go('${back}')">${backLabel}</button></div>
    </div>`;
  $("[data-again]", view).onclick = again;
}

App.sections.games = {
  render(view, id) {
    if (id && this[id]) return this[id](view);
    view.innerHTML = `
      <h1 class="page">🎲 ${tx("Juegos de clase", "ألعاب الصف")}</h1>
      <p class="lead">${tx("Practica lo que viste en clase jugando. ¡Supera tu récord!", "تدرّب على ما تعلّمته في الصف باللعب. حطّم رقمك القياسي!")}</p>
      ${GAMES.map((g) => listItem("games/" + g.id, g.ico, g.title, `${g.sub}${gameBest(g.id) ? ` · 🏆 ${gameBest(g.id)}` : ""}`)).join("")}`;
  },

  // ---------------------------------------------------------------
  // 1) DO · GO · PLAY
  // ---------------------------------------------------------------
  dgp(view) {
    const rule = (v) => `
      <div class="ex" style="--c:${DGP_RULES[v].color}">
        <div class="text"><div class="en" style="color:var(--c);font-size:1.2rem"><b>${v.toUpperCase()}</b></div>
        <div class="es">${DGP_RULES[v].es}</div><div class="en small" dir="ltr">${DGP_RULES[v].ex}</div></div>
        <div class="btns">${sayBtn(DGP_RULES[v].ex)}</div>
      </div>`;
    view.innerHTML = `${gameTop("🏃 Do · Go · Play")}
      <div class="card-box"><b>📌 ${tx("La regla", "القاعدة")}</b><p class="small muted" style="margin:4px 0 10px">${tx("En inglés los deportes y actividades van con <b>do</b>, <b>go</b> o <b>play</b>. No se puede usar cualquiera.", "في الإنجليزية تأتي الرياضات والأنشطة مع <b>do</b> أو <b>go</b> أو <b>play</b>. ولا يصلح أيّ منها مع كل نشاط.")}</p>
      ${rule("play")}${rule("go")}${rule("do")}</div>
      <button class="btn block" id="start">▶️ ${tx("Empezar (12 actividades)", "ابدأ (12 نشاطًا)")}</button>`;
    $("#start").onclick = () => round();

    const round = () => {
      const items = shuffle(DGP_ITEMS).slice(0, 12);
      let i = 0, score = 0, streak = 0, best = 0;
      const mistakes = [];
      const show = () => {
        if (i >= items.length) return finish();
        const it = items[i];
        view.innerHTML = `${gameTop("🏃 Do · Go · Play", `<b>⭐ ${score} · 🔥 ${streak}</b>`)}
          <div class="bar" style="margin-bottom:14px"><div style="width:${(i / items.length) * 100}%"></div></div>
          <div class="quiz-card" style="text-align:center">
            <div class="small muted">${tx("¿Qué verbo va con...?", "أي فعل يأتي مع...؟")}</div>
            <div class="big" dir="ltr" style="font-size:2.2rem;margin:10px 0"><span class="blank">___</span> ${escapeHtml(it.w)}</div>
            <div class="muted">${NATIVE.flag} ${escapeHtml(it.es)}</div>
            <div class="dgp-btns" dir="ltr">
              ${["play", "go", "do"].map((v) => `<button class="btn dgp" data-v="${v}" style="background:${DGP_RULES[v].color}">${v.toUpperCase()}</button>`).join("")}
            </div>
            <div class="q-feedback"></div>
          </div>`;
        $$("[data-v]", view).forEach((b) => (b.onclick = () => answer(b.dataset.v)));
      };
      const answer = (v) => {
        const it = items[i];
        const ok = v === it.v;
        recordAnswer(ok);
        $$("[data-v]", view).forEach((b) => { b.disabled = true; b.style.opacity = b.dataset.v === it.v ? 1 : 0.35; });
        const combo = `${it.v} ${it.w}`;
        if (ok) { score++; streak++; best = Math.max(best, streak); }
        else { streak = 0; mistakes.push(`<span dir="ltr">${v} ${it.w} → <b>${combo}</b></span>`); }
        $(".q-feedback", view).innerHTML = `
          <div class="feedback ${ok ? "ok" : "no"}" style="text-align:start">
            <div class="fb-title">${ok ? pick(["✅ Correct!", "🔥 Nice!", tx("🎯 ¡Exacto!", "🎯 بالضبط!")]) : tx(`❌ Es <b>${it.v.toUpperCase()}</b>`, `❌ الصحيح <b>${it.v.toUpperCase()}</b>`)} — <b dir="ltr">${escapeHtml(combo)}</b></div>
            <div class="row" style="margin-top:6px"><span style="flex:1;font-weight:600" dir="ltr">💬 ${escapeHtml(it.sentence)}</span>${sayBtn(it.sentence)}<button class="icon-btn" data-say-it title="${tx("Dilo tú", "قلها أنت")}">🎤</button></div>
            <div class="small muted">${NATIVE.flag} ${escapeHtml(it.sentenceEs)}</div>
            ${ok ? "" : `<div class="small" style="margin-top:6px">💡 ${DGP_RULES[it.v].es}</div>`}
          </div>
          <button class="btn block" data-next>${i + 1 < items.length ? NEXT_LABEL() : RESULT_LABEL()}</button>`;
        speak(it.sentence);
        $("[data-say-it]", view).onclick = () => pronounceSheet(it.sentence);
        $("[data-next]", view).onclick = () => { i++; show(); };
        $("[data-next]", view).focus();
      };
      const finish = () => {
        gameEnd(view, {
          emoji: score >= 11 ? "🏆" : score >= 8 ? "😎" : "💪", id: "dgp", score,
          title: tx(`${score} de ${items.length} correctas`, `${score} من ${items.length} صحيحة`),
          lines: [tx(`🔥 Mejor racha: ${best}`, `🔥 أفضل سلسلة: ${best}`), mistakes.length ? `${tx("Repasa", "راجع")}: ${mistakes.join(" · ")}` : tx("¡Sin errores!", "بدون أخطاء!")],
          again: round,
          extra: `<button class="btn soft block" data-talk style="margin-bottom:10px">🗣️ ${tx("Ahora habla: 3 preguntas con do, go y play", "تكلّم الآن: 3 أسئلة مع do وgo وplay")}</button>`,
        });
        $("[data-talk]", view).onclick = talk;
      };
      show();
    };

    const talk = () => {
      const qs = shuffle(DGP_TALK).slice(0, 3);
      let k = 0;
      const next = () => {
        if (k >= qs.length) { toast(tx("🎉 ¡Muy bien! Terminaste la práctica oral", "🎉 أحسنت! أنهيت التدريب الشفهي")); return go("games"); }
        view.innerHTML = `${gameTop(`🗣️ ${tx("Habla", "تكلّم")} ${k + 1}/3`)}<div class="slot"></div>`;
        talkCard($(".slot", view), qs[k++], next);
      };
      next();
    };
  },

  // ---------------------------------------------------------------
  // 2) DO YOU KNOW ME? — armar la pregunta y elegir la respuesta corta
  // ---------------------------------------------------------------
  yesno(view) {
    const round = () => {
      const items = shuffle(YESNO_ITEMS).slice(0, 8);
      let i = 0, score = 0;
      const show = () => {
        if (i >= items.length) return gameEnd(view, {
          emoji: score >= 14 ? "🏆" : score >= 10 ? "😎" : "💪", id: "yesno", score,
          title: tx(`${score} de ${items.length * 2} puntos`, `${score} من ${items.length * 2} نقطة`),
          lines: [tx("1 punto por armar bien la pregunta y 1 por la respuesta corta.", "نقطة لتكوين السؤال بشكل صحيح ونقطة للإجابة القصيرة.")], again: round,
        });
        const it = items[i];
        const words = it.q.split(" ");
        const distractor = words[0] === "Do" ? "Does" : "Do";
        let tiles = shuffle([...words, distractor]).map((w, n) => ({ w, n, used: false }));
        let answer = [];
        view.innerHTML = `${gameTop("🕵️ Do you know me?", `<b>⭐ ${score}</b>`)}
          <div class="bar" style="margin-bottom:14px"><div style="width:${(i / items.length) * 100}%"></div></div>
          <div class="quiz-card">
            <span class="q-tag">${tx("1️⃣ Arma la pregunta en inglés", "1️⃣ كوّن السؤال بالإنجليزية")}</span>
            <div class="q-prompt">${NATIVE.flag} ${escapeHtml(it.es)}</div>
            <div class="small muted">${tx("Toca las palabras en orden. ¡Ojo: sobra una!", "اضغط على الكلمات بالترتيب. انتبه: هناك كلمة زائدة!")}</div>
            <div class="answer-line" dir="ltr"></div>
            <div class="word-tiles" dir="ltr"></div>
            <button class="btn block" data-check disabled>${tx("Comprobar", "تحقّق")}</button>
            <div class="q-feedback"></div>
          </div>`;
        const draw = () => {
          $(".answer-line", view).innerHTML = answer.length ? answer.map((t) => `<button class="word-tile on" data-n="${t.n}">${escapeHtml(t.w)}</button>`).join("") : `<span class="muted small">${tx("Tu pregunta aparecerá aquí", "سيظهر سؤالك هنا")}</span>`;
          $(".word-tiles", view).innerHTML = tiles.map((t) => `<button class="word-tile" data-n="${t.n}" ${t.used ? "hidden" : ""}>${escapeHtml(t.w)}</button>`).join("");
          $("[data-check]", view).disabled = answer.length < words.length;
          $$(".word-tiles .word-tile", view).forEach((b) => (b.onclick = () => { const t = tiles.find((x) => x.n == b.dataset.n); t.used = true; answer.push(t); draw(); }));
          $$(".answer-line .word-tile", view).forEach((b) => (b.onclick = () => { const t = tiles.find((x) => x.n == b.dataset.n); t.used = false; answer = answer.filter((x) => x !== t); draw(); }));
        };
        draw();
        $("[data-check]", view).onclick = () => {
          const built = answer.map((t) => t.w).join(" ");
          const ok = built === it.q;
          if (ok) score++;
          recordAnswer(ok);
          $$(".word-tile", view).forEach((b) => (b.disabled = true));
          $("[data-check]", view).hidden = true;
          speak(it.q);
          $(".q-feedback", view).innerHTML = `
            <div class="feedback ${ok ? "ok" : "no"}">
              <div class="fb-title">${ok ? "✅ Correct!" : tx("❌ Casi", "❌ قريب")}</div>
              <div>${ok ? "" : tx("Correcto: ", "الصحيح: ")}<b dir="ltr">${escapeHtml(it.q)}</b> ${sayBtn(it.q)}</div>
              <div class="small" style="margin-top:4px">💡 ${tx(`Pregunta = <b>${it.q.split(" ")[0]}</b> + sujeto + verbo normal.`, `السؤال = <b>${it.q.split(" ")[0]}</b> + الفاعل + الفعل العادي.`)} ${it.q.startsWith("Does") ? tx("Con he / she / it se usa <b>Does</b>.", "مع he / she / it نستخدم <b>Does</b>.") : tx("Con I / you / we / they se usa <b>Do</b>.", "مع I / you / we / they نستخدم <b>Do</b>.")}</div>
            </div>
            <button class="btn block" data-step2>${tx("2️⃣ Responder ➡️", "2️⃣ أجب ⬅️")}</button>`;
          $("[data-step2]", view).onclick = () => shortAnswer(it);
        };
      };
      // Paso 2: tu compañero/a responde sí o no → elige la respuesta corta correcta
      const shortAnswer = (it) => {
        const yes = Math.random() < 0.5;
        const right = yes ? it.yes : it.no;
        const subj = right.split(" ")[1].replace(",", "");
        const aux = it.q.startsWith("Does") ? "does" : "do";
        const wrongAux = aux === "do" ? "does" : "do";
        const options = shuffle([right, yes ? `Yes, ${subj} ${wrongAux}.` : `No, ${subj} ${wrongAux}n't.`, yes ? `Yes, ${subj} ${aux}n't.` : `No, ${subj} ${aux}.`,
          yes ? `Yes, ${subj} ${aux === "do" ? (subj === "I" ? "am" : "are") : "is"}.` : `No, I not.`]);
        $(".quiz-card", view).innerHTML = `
          <span class="q-tag">${tx("2️⃣ Respuesta corta", "2️⃣ إجابة قصيرة")}</span>
          <div class="q-prompt"><span dir="ltr">${escapeHtml(it.q)}</span> ${sayBtn(it.q)}</div>
          <div class="q-sub">${tx(`La respuesta es <b>${yes ? "SÍ ✅" : "NO ❌"}</b>. ¿Cómo se dice corto?`, `الإجابة <b>${yes ? "نعم ✅" : "لا ❌"}</b>. كيف تقولها باختصار؟`)}</div>
          <div class="options" dir="ltr">${options.map((o) => `<button class="option">${escapeHtml(o)}</button>`).join("")}</div>
          <div class="q-feedback"></div>`;
        $$(".option", view).forEach((b) => (b.onclick = () => {
          const ok = b.textContent === right;
          if (ok) score++;
          recordAnswer(ok);
          $$(".option", view).forEach((o) => { o.disabled = true; if (o.textContent === right) o.classList.add("correct"); });
          if (!ok) b.classList.add("wrong");
          speak(right);
          $(".q-feedback", view).innerHTML = `
            <div class="feedback ${ok ? "ok" : "no"}"><div class="fb-title">${ok ? "✅ Correct!" : `${tx("❌ Es", "❌ الصحيح")}: <span dir="ltr">${escapeHtml(right)}</span>`}</div>
            <div class="small">💡 ${tx(`Se responde con el mismo auxiliar de la pregunta (<b>${aux}</b>), sin repetir el verbo.`, `نجيب بنفس الفعل المساعد الموجود في السؤال (<b>${aux}</b>) دون تكرار الفعل.`)}</div></div>
            <button class="btn block" data-next>${i + 1 < 8 ? NEXT_LABEL() : RESULT_LABEL()}</button>`;
          $("[data-next]", view).onclick = () => { i++; show(); };
        }));
      };
      show();
    };
    round();
  },

  // ---------------------------------------------------------------
  // 3) RULETA DEL TIEMPO LIBRE
  // ---------------------------------------------------------------
  wheel(view) {
    let rotation = 0, answered = 0, spinning = false;
    const seg = 360 / WHEEL.length;
    const gradient = WHEEL.map((w, k) => `${w.color} ${k * seg}deg ${(k + 1) * seg}deg`).join(", ");
    view.innerHTML = `${gameTop(`🎡 ${tx("Ruleta del tiempo libre", "عجلة وقت الفراغ")}`, `<b id="answered">🗣️ 0</b>`)}
      <div class="wheel-wrap" dir="ltr">
        <div class="wheel-pointer">▼</div>
        <div class="wheel" id="wheel" style="background:conic-gradient(${gradient})">
          ${WHEEL.map((w, k) => `<span class="wheel-label" style="--a:${k * seg + seg / 2}deg">${w.ico}</span>`).join("")}
        </div>
      </div>
      <button class="btn block" id="spin">🎡 ${tx("Girar la ruleta", "أدِر العجلة")}</button>
      <div id="qslot" style="margin-top:14px"></div>`;
    const wheel = $("#wheel");
    $("#spin").onclick = () => {
      if (spinning) return;
      spinning = true;
      $("#qslot").innerHTML = "";
      const k = Math.floor(Math.random() * WHEEL.length);
      const center = k * seg + seg / 2;
      const current = ((rotation % 360) + 360) % 360;
      rotation += 360 * 5 + ((360 - center - current + 360) % 360);
      const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      wheel.style.transition = reduced ? "none" : "transform 3s cubic-bezier(.17,.67,.2,1)";
      wheel.style.transform = `rotate(${rotation}deg)`;
      setTimeout(() => {
        spinning = false;
        const topic = WHEEL[k];
        const p = pick(topic.qs);
        $("#qslot").innerHTML = `<div class="q-tag" style="--c:${topic.color}">${topic.ico} ${topic.name}</div><div class="slot"></div>`;
        talkCard($(".slot", view), p, () => {
          answered++;
          $("#answered").textContent = `🗣️ ${answered}`;
          saveBest("wheel", answered);
          window.scrollTo({ top: 0, behavior: "smooth" });
          $("#qslot").innerHTML = `<div class="feedback ok small">${tx(`🎉 ¡Respondiste ${answered} pregunta${answered > 1 ? "s" : ""}! Gira otra vez.`, `🎉 أجبت عن ${answered} سؤال! أدِر العجلة مرة أخرى.`)}</div>`;
        }, { nextLabel: tx("🎡 Otra pregunta", "🎡 سؤال آخر") });
        $("#qslot").scrollIntoView({ behavior: "smooth", block: "start" });
      }, reduced ? 50 : 3100);
    };
  },

  // ---------------------------------------------------------------
  // 4) HE · SHE · IT — carrera de 60 segundos
  // ---------------------------------------------------------------
  hsi(view) {
    view.innerHTML = `${gameTop("⚡ He · She · It")}
      <div class="card-box">
        <b>📌 ${tx("Presente simple con he / she / it", "المضارع البسيط مع he / she / it")}</b>
        <ul class="explain small">
          <li>${tx("Frases positivas: se agrega <b>-s</b>:", "الجمل المثبتة: نضيف <b>-s</b>:")} <i dir="ltr">He play<b>s</b> video games.</i></li>
          <li>${tx("Termina en s, sh, ch, x u o → <b>-es</b>:", "ينتهي بـ s أو sh أو ch أو x أو o → <b>-es</b>:")} <i dir="ltr">watch<b>es</b>, go<b>es</b>, do<b>es</b></i></li>
          <li>${tx("Consonante + y → <b>-ies</b>:", "حرف ساكن + y → <b>-ies</b>:")} <i dir="ltr">stud<b>ies</b>, fl<b>ies</b></i> (${tx("pero", "لكن")} <i dir="ltr">plays</i>)</li>
          <li>${tx("Irregular:", "شاذ:")} <b dir="ltr">have → has</b></li>
          <li>${tx("Negativo: <b>doesn't</b> + verbo normal:", "النفي: <b>doesn't</b> + الفعل العادي:")} <i dir="ltr">She doesn't <b>like</b> fish.</i></li>
          <li>${tx("Pregunta: <b>Does</b> + sujeto + verbo normal:", "السؤال: <b>Does</b> + الفاعل + الفعل العادي:")} <i dir="ltr">Does he <b>work</b> here?</i></li>
        </ul>
      </div>
      <button class="btn block" id="start">⚡ ${tx("Empezar (60 segundos)", "ابدأ (60 ثانية)")}</button>
      ${gameBest("hsi") ? `<p class="small muted" style="text-align:center">🏆 ${tx("Tu récord", "رقمك القياسي")}: ${gameBest("hsi")}</p>` : ""}`;
    $("#start").onclick = () => race();

    const race = () => {
      let score = 0, left = 60, done = false, locked = false;
      const mistakes = [];
      view.innerHTML = `${gameTop("⚡ He · She · It", `<b id="score">⭐ 0</b>`)}
        <div class="row" style="margin-bottom:12px"><div class="bar" style="flex:1"><div id="timebar" style="width:100%"></div></div><b id="time">60s</b></div>
        <div class="quiz-card" id="qcard"></div>`;
      const timer = setInterval(() => {
        left--;
        $("#time") && ($("#time").textContent = `${left}s`);
        $("#timebar") && ($("#timebar").style.width = `${(left / 60) * 100}%`);
        if (left <= 0) finish();
      }, 1000);
      App.cleanup = () => { done = true; clearInterval(timer); }; // al salir del juego se detiene todo

      const makeQ = () => {
        const it = pick(HSI_ITEMS);
        const third = thirdPerson(it.v);
        const r = Math.random();
        if (r < 0.6) return { it, kind: "type", prompt: `${it.s} <span class="blank">___</span> (${it.v}) ${escapeHtml(it.rest)}`, answer: third, full: `${it.s} ${third} ${it.rest}` };
        if (r < 0.8) return { it, kind: "choice", prompt: `${it.s} doesn't <span class="blank">___</span> ${escapeHtml(it.rest)}`, options: shuffle([it.v, third]), answer: it.v, full: `${it.s} doesn't ${it.v} ${it.rest}`, rule: tx("Después de <b>doesn't</b> el verbo va sin -s.", "بعد <b>doesn't</b> يأتي الفعل بدون -s.") };
        const q = `${it.s === "It" ? "it" : it.s.replace(/^The /, "the ").replace(/^My /, "my ").replace(/^He$/, "he").replace(/^She$/, "she")} ${it.v} ${it.rest.replace(/\.$/, "?")}`;
        return { it, kind: "choice", prompt: `<span class="blank">___</span> ${escapeHtml(q)}`, options: ["Do", "Does"], answer: "Does", full: `Does ${q}`, rule: tx("Con he / she / it la pregunta empieza con <b>Does</b>.", "مع he / she / it يبدأ السؤال بـ <b>Does</b>.") };
      };

      const next = () => {
        if (done || !$("#qcard")) return;
        locked = false;
        const q = makeQ();
        $("#qcard").innerHTML = `
          <div class="q-prompt" dir="ltr">${q.prompt}</div>
          <div class="q-sub">${NATIVE.flag} ${escapeHtml(q.it.es)}</div>
          ${q.kind === "type"
            ? `<form><input class="answer-input" dir="ltr" autocomplete="off" autocapitalize="off" spellcheck="false" placeholder="${tx("Escribe el verbo...", "اكتب الفعل...")}"><button class="btn block">${tx("Comprobar ↵", "تحقّق ↵")}</button></form>`
            : `<div class="options" dir="ltr" style="grid-template-columns:1fr 1fr">${q.options.map((o) => `<button class="option" style="text-align:center">${o}</button>`).join("")}</div>`}
          <div class="q-feedback"></div>`;
        const judge = (value) => {
          if (locked || done) return;
          locked = true;
          const ok = normalize(value) === normalize(q.answer);
          recordAnswer(ok);
          if (ok) { score++; $("#score").textContent = `⭐ ${score}`; }
          else mistakes.push(`<span dir="ltr">${escapeHtml(q.full)}</span>`);
          $(".q-feedback", view).innerHTML = `<div class="feedback ${ok ? "ok" : "no"}"><b dir="ltr">${ok ? "✅" : "❌"} ${escapeHtml(q.full)}</b>
            ${ok ? "" : `<div class="small">💡 ${q.rule || hsiRule(q.it.v)}</div>`}</div>`;
          setTimeout(next, ok ? 450 : 1800);
        };
        if (q.kind === "type") {
          const input = $("input", view);
          input.focus();
          $("form", view).onsubmit = (e) => { e.preventDefault(); if (input.value.trim()) judge(input.value); };
        } else $$(".option", view).forEach((b) => (b.onclick = () => judge(b.textContent)));
      };

      const finish = () => {
        if (done) return;
        done = true;
        clearInterval(timer);
        gameEnd(view, {
          emoji: score >= 20 ? "🏆" : score >= 12 ? "😎" : "💪", id: "hsi", score,
          title: tx(`⚡ ${score} correctas en 60 segundos`, `⚡ ${score} صحيحة في 60 ثانية`),
          lines: mistakes.length ? [`${tx("Repasa", "راجع")}: ${[...new Set(mistakes)].slice(0, 4).join(" · ")}`] : [tx("¡Sin errores!", "بدون أخطاء!")],
          again: race,
        });
      };
      next();
    };
  },
};
