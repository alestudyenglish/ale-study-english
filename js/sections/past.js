// ⏪ PAST SIMPLE — explicación del pasado + 5 juegos para practicarlo
const PAST_GAMES = [
  { id: "ed", ico: "🎧", title: tx("Oído -ed", "أذن -ed"), sub: tx("Escucha y elige cómo suena: /t/, /d/ o /ɪd/", "استمع واختر كيف تُنطق: /t/ أو /d/ أو /ɪd/") },
  { id: "irr", ico: "⚡", title: tx("Irregulares a toda velocidad", "الأفعال الشاذة بسرعة"), sub: tx("60 segundos: go → went, eat → ate...", "60 ثانية: go → went، eat → ate...") },
  { id: "story", ico: "📖", title: tx("Arma la historia", "كوّن القصة"), sub: tx("Completa una historia en pasado y escúchala", "أكمل قصة بالماضي واستمع إليها") },
  { id: "did", ico: "🕵️", title: "Detective Did / Didn't", sub: tx("Pasa frases a negativo y a pregunta", "حوّل الجمل إلى نفي وسؤال") },
  { id: "talk", ico: "🗣️", title: tx("Cuéntame tu día", "احكِ لي عن يومك"), sub: tx("Responde hablando en pasado y te corrijo", "أجب بالكلام بصيغة الماضي وسأصحّح لك") },
];
const pastTop = (title, right = "") => gameTop(title, right, "past");
const pastEnd = (view, opts) => gameEnd(view, { ...opts, id: "past-" + opts.id, back: "past", backLabel: tx("⏪ Pasado", "⏪ الماضي") });
const cap = (s) => s[0].toUpperCase() + s.slice(1);

App.sections.past = {
  render(view, sub) {
    if (sub === "learn") return this.learn(view);
    if (sub && this["g_" + sub]) return this["g_" + sub](view);
    view.innerHTML = `
      <h1 class="page">⏪ Past Simple</h1>
      <p class="lead">${tx("El pasado para contar lo que hiciste:", "الماضي لتحكي ما فعلته:")} <i dir="ltr">I went, I worked, I saw...</i></p>
      <button class="list-item" onclick="go('past/learn')" style="border:2px solid var(--accent)">
        <span class="ico">📖</span><span class="txt"><b>${tx("Cómo funciona el pasado", "كيف يعمل الماضي")}</b><span>${tx("Explicación paso a paso con audio · empieza aquí", "شرح خطوة بخطوة مع الصوت · ابدأ من هنا")}</span></span><span>${isAr ? "‹" : "›"}</span>
      </button>
      <div class="level-group">🎮 ${tx("Juegos", "الألعاب")}</div>
      ${PAST_GAMES.map((g) => listItem("past/" + g.id, g.ico, g.title, `${g.sub}${gameBest("past-" + g.id) ? ` · 🏆 ${gameBest("past-" + g.id)}` : ""}`)).join("")}`;
  },

  // ---------------------------------------------------------------
  // 📖 EXPLICACIÓN
  // ---------------------------------------------------------------
  learn(view) {
    const ex = (en, es, c = "var(--accent)") => `
      <div class="ex" style="--c:${c}"><div class="text"><div class="en" dir="ltr">${en}</div><div class="es">${escapeHtml(es)}</div></div>
      <div class="btns">${sayBtn(en.replace(/<[^>]+>/g, ""))}</div></div>`;
    const wrongRight = (w, r) => `<div class="issue" dir="ltr"><span class="wrong">❌ ${w}</span> → <span class="right">✅ ${r}</span></div>`;
    const irr = TOP_IRREGULARS.map((b) => VERB_BY_BASE[b]).filter(Boolean);
    view.innerHTML = `
      <button class="btn ghost" onclick="go('past')" style="margin:6px 0 12px">${tx("⬅️ Pasado", "➡️ الماضي")}</button>
      <h1 class="page">📖 ${tx("Cómo funciona el pasado", "كيف يعمل الماضي")}</h1>
      <p class="lead">${tx("Lee cada parte y toca 🔊 para escuchar. Al final hay juegos para practicar.", "اقرأ كل جزء واضغط 🔊 للاستماع. في النهاية ألعاب للتدرّب.")}</p>

      <div class="card-box">
        <div class="section-title" style="margin-top:0">1️⃣ ${tx("¿Cuándo se usa?", "متى نستخدمه؟")}</div>
        <p>${tx("El <b>Past Simple</b> sirve para hablar de acciones que <b>empezaron y terminaron en el pasado</b>: ayer, la semana pasada, hace un año...", "يُستخدم <b>Past Simple</b> للحديث عن أفعال <b>بدأت وانتهت في الماضي</b>: أمس، الأسبوع الماضي، قبل سنة...")}</p>
        <div class="timeline" dir="ltr">
          <div class="tl-part on">⏪ <b>${tx("Pasado", "الماضي")}</b><small>I worked</small></div>
          <div class="tl-part">📍 <b>${tx("Ahora", "الآن")}</b><small>I work</small></div>
          <div class="tl-part">⏩ <b>${tx("Futuro", "المستقبل")}</b><small>I will work</small></div>
        </div>
        <p class="small muted">${tx("💡 Buena noticia: en pasado el verbo es <b>igual para todas las personas</b>: I worked, you worked, she worked, they worked. ¡No hay -s!", "💡 خبر جيد: في الماضي يكون الفعل <b>نفسه مع جميع الأشخاص</b>: I worked, you worked, she worked, they worked. لا توجد -s!")}</p>
      </div>

      <div class="card-box">
        <div class="section-title" style="margin-top:0">2️⃣ ${tx("Palabras que indican pasado", "كلمات تدلّ على الماضي")}</div>
        <div class="chips" style="flex-wrap:wrap">${PAST_TIME_WORDS.map(([en, es]) => `<button class="chip" data-say="${en}" title="${escapeHtml(es)}">🔊 <span dir="ltr">${en}</span> <span class="muted">· ${es}</span></button>`).join("")}</div>
        ${ex("<b>Yesterday</b> I <b>worked</b> until six.", tx("Ayer trabajé hasta las seis.", "أمس عملت حتى السادسة."))}
        ${ex("I <b>visited</b> my family <b>two years ago</b>.", tx("Visité a mi familia hace dos años.", "زرت عائلتي قبل سنتين."))}
      </div>

      <div class="card-box">
        <div class="section-title" style="margin-top:0">3️⃣ ${tx("Verbos regulares: + ed", "الأفعال المنتظمة: + ed")}</div>
        <p>${tx("La mayoría de los verbos forman el pasado agregando <b>-ed</b>:", "معظم الأفعال تُكوّن الماضي بإضافة <b>-ed</b>:")}</p>
        <div class="formula" dir="ltr"><span>work</span><i>→</i><span>work<b>ed</b></span><span>play</span><i>→</i><span>play<b>ed</b></span></div>
        <ul class="explain small">
          <li>${tx("Termina en <b>-e</b> → solo <b>-d</b>:", "ينتهي بـ <b>-e</b> → نضيف <b>-d</b> فقط:")} <span dir="ltr">live → live<b>d</b>, dance → dance<b>d</b></span></li>
          <li>${tx("Consonante + <b>y</b> → <b>-ied</b>:", "حرف ساكن + <b>y</b> → <b>-ied</b>:")} <span dir="ltr">study → stud<b>ied</b>, cry → cr<b>ied</b></span> (${tx("pero", "لكن")} <span dir="ltr">play → play<b>ed</b></span>)</li>
          <li>${tx("Verbo corto consonante-vocal-consonante → se <b>duplica</b>:", "فعل قصير (ساكن-علّة-ساكن) → <b>يتضاعف</b> الحرف الأخير:")} <span dir="ltr">stop → sto<b>pp</b>ed, plan → pla<b>nn</b>ed</span></li>
        </ul>
        ${ex("I <b>cleaned</b> the kitchen and <b>cooked</b> dinner.", tx("Limpié la cocina y cociné la cena.", "نظّفت المطبخ وطبخت العشاء."), "var(--pres)")}
      </div>

      <div class="card-box">
        <div class="section-title" style="margin-top:0">4️⃣ 🔊 ${tx("Cómo se pronuncia la -ed", "كيف تُنطق -ed")}</div>
        <p>${tx("⚠️ El error más común: pronunciar todas las <i>-ed</i> como una sílaba extra (<i>«work-ed»</i>). En realidad tienen <b>3 sonidos</b>:", "⚠️ الخطأ الأكثر شيوعًا: نطق كل <i>-ed</i> كمقطع إضافي (<i>«work-ed»</i>). في الحقيقة لها <b>3 أصوات</b>:")}</p>
        ${Object.entries(ED_SOUNDS).map(([k, s]) => {
          const words = ED_VERBS.filter((v) => v.sound === k).slice(0, 4);
          return `<div class="ex" style="--c:${s.color}">
            <div class="text"><div class="en" style="color:var(--c);font-size:1.2rem" dir="ltr"><b>${s.label}</b></div>
            <div class="es">${s.es}</div><div class="small" style="margin-top:4px">${s.tip}</div>
            <div class="chips" style="margin-top:8px;flex-wrap:wrap" dir="ltr">${words.map((w) => `<button class="chip" data-say="${w.past}">🔊 ${w.past}</button>`).join("")}</div></div>
          </div>`;
        }).join("")}
        <button class="btn soft block" onclick="go('past/ed')">🎧 ${tx("Practicar la pronunciación de -ed", "تدرّب على نطق -ed")}</button>
      </div>

      <div class="card-box">
        <div class="section-title" style="margin-top:0">5️⃣ ${tx("Verbos irregulares", "الأفعال الشاذة")}</div>
        <p>${tx("Algunos verbos <b>no usan -ed</b>: cambian por completo. Hay que memorizarlos. Estos son los más usados:", "بعض الأفعال <b>لا تستخدم -ed</b>: تتغيّر بالكامل. يجب حفظها. هذه هي الأكثر استخدامًا:")}</p>
        <div class="irr-grid">${irr.map((v) => `<button class="irr" data-say="${v.base}. ${v.past.replace(" / ", ", ")}."><span class="muted" dir="ltr">${v.base}</span><b dir="ltr">${v.past}</b><small>${escapeHtml(esMain(v))}</small></button>`).join("")}</div>
        <p class="small muted">${tx("👆 Toca cada uno para escucharlo. Todos los verbos están en la sección 📚 Verbos.", "👆 اضغط على كل فعل لتسمعه. كل الأفعال موجودة في قسم 📚 الأفعال.")}</p>
        ${ex("I <b>went</b> to the beach and <b>saw</b> dolphins.", tx("Fui a la playa y vi delfines.", "ذهبت إلى الشاطئ ورأيت دلافين."), "var(--past)")}
      </div>

      <div class="card-box">
        <div class="section-title" style="margin-top:0">6️⃣ ${tx("Negativo: didn't + verbo normal", "النفي: didn't + الفعل العادي")}</div>
        <div class="formula" dir="ltr"><span>${tx("sujeto", "الفاعل")}</span><i>+</i><span>didn't</span><i>+</i><span>${tx("verbo normal", "الفعل العادي")}</span></div>
        <p class="small">${tx("💡 El «pasado» ya lo lleva <b>didn't</b>, así que el verbo vuelve a su forma normal.", "💡 كلمة <b>didn't</b> تحمل معنى الماضي، لذلك يعود الفعل إلى شكله العادي.")}</p>
        ${ex("I <b>didn't go</b> to work yesterday.", tx("Ayer no fui al trabajo.", "أمس لم أذهب إلى العمل."), "var(--past)")}
        ${ex("She <b>didn't like</b> the movie.", tx("A ella no le gustó la película.", "لم يعجبها الفيلم."), "var(--past)")}
        ${wrongRight("I didn't went", "I didn't go")}
      </div>

      <div class="card-box">
        <div class="section-title" style="margin-top:0">7️⃣ ${tx("Preguntas: Did + sujeto + verbo normal", "السؤال: Did + الفاعل + الفعل العادي")}</div>
        <div class="formula" dir="ltr"><span>Did</span><i>+</i><span>${tx("sujeto", "الفاعل")}</span><i>+</i><span>${tx("verbo normal", "الفعل العادي")}</span><i>?</i></div>
        ${ex("<b>Did</b> you <b>eat</b> breakfast?", tx("¿Tomaste desayuno?", "هل تناولت الفطور؟"), "var(--fut)")}
        ${ex("<b>Where did</b> you <b>go</b> last weekend?", tx("¿A dónde fuiste el fin de semana pasado?", "إلى أين ذهبت في عطلة نهاية الأسبوع الماضية؟"), "var(--fut)")}
        <p class="small"><b>${tx("Respuestas cortas:", "إجابات قصيرة:")}</b> <span dir="ltr">Yes, I did. / No, I didn't.</span></p>
        ${wrongRight("Did you saw...?", "Did you see...?")}
      </div>

      <div class="card-box">
        <div class="section-title" style="margin-top:0">8️⃣ ${tx("El verbo BE: was / were", "الفعل BE: was / were")}</div>
        <div class="formula" dir="ltr"><span>I / he / she / it</span><i>→</i><span>was</span></div>
        <div class="formula" dir="ltr"><span>you / we / they</span><i>→</i><span>were</span></div>
        ${ex("I <b>was</b> tired, but we <b>were</b> happy.", tx("Estaba cansado/a, pero estábamos felices.", "كنت متعبًا، لكننا كنّا سعداء."), "var(--pp)")}
        ${ex("It <b>wasn't</b> easy. <b>Were</b> you at home?", tx("No fue fácil. ¿Estabas en casa?", "لم يكن سهلًا. هل كنت في البيت؟"), "var(--pp)")}
      </div>

      <div class="card-box" style="background:var(--warn-soft)">
        <b>⚠️ ${tx("Los 4 errores más comunes", "الأخطاء الأربعة الأكثر شيوعًا")}</b>
        <div style="margin-top:8px"></div>
        ${wrongRight("Yesterday I go to the beach.", "Yesterday I went to the beach.")}
        ${wrongRight("I didn't went.", "I didn't go.")}
        ${wrongRight("Did you went?", "Did you go?")}
        ${wrongRight("I was go.", "I went.")}
      </div>

      <div class="section-title">🎮 ${tx("¡Ahora practica!", "تدرّب الآن!")}</div>
      ${PAST_GAMES.map((g) => listItem("past/" + g.id, g.ico, g.title, g.sub)).join("")}`;
  },

  // ---------------------------------------------------------------
  // 🎧 OÍDO -ED
  // ---------------------------------------------------------------
  g_ed(view) {
    const round = () => {
      const items = shuffle(ED_VERBS).slice(0, 10);
      let i = 0, score = 0;
      // La palabra sola, dos veces y con pausa: así se escucha bien el sonido final
      const say = (it, slow) => speak(`${cap(it.past)}. ${cap(it.past)}.`, { slow });
      const show = () => {
        if (i >= items.length) return pastEnd(view, {
          emoji: score >= 9 ? "🏆" : score >= 7 ? "😎" : "💪", id: "ed", score,
          title: tx(`${score} de ${items.length} sonidos correctos`, `${score} من ${items.length} أصوات صحيحة`),
          lines: [tx("💡 Recuerda: solo después de t o d se agrega la sílaba «id».", "💡 تذكّر: فقط بعد t أو d نضيف المقطع «id».")], again: round,
        });
        const it = items[i];
        view.innerHTML = `${pastTop(`🎧 ${tx("Oído -ed", "أذن -ed")}`, `<b>⭐ ${score}</b>`)}
          <div class="bar" style="margin-bottom:14px"><div style="width:${(i / items.length) * 100}%"></div></div>
          <div class="quiz-card" style="text-align:center">
            <div class="small muted">${tx("Escucha: ¿cómo suena la -ed?", "استمع: كيف تُنطق -ed؟")}</div>
            <div class="big" dir="ltr" style="font-size:2.2rem;margin:8px 0">${it.past}</div>
            <div class="muted"><span dir="ltr">${it.base}</span> · ${it.es}</div>
            <div class="audio-prompt"><button class="icon-btn" data-play>🔊</button><button class="icon-btn" data-slow>🐢</button></div>
            <div class="dgp-btns" dir="ltr">${Object.entries(ED_SOUNDS).map(([k, s]) => `<button class="btn dgp" data-s="${k}" style="background:${s.color}">${s.label}</button>`).join("")}</div>
            <div class="q-feedback"></div>
          </div>`;
        $("[data-play]", view).onclick = () => say(it);
        $("[data-slow]", view).onclick = () => say(it, true);
        setTimeout(() => say(it), 300);
        $$("[data-s]", view).forEach((b) => (b.onclick = () => {
          const ok = b.dataset.s === it.sound;
          if (ok) score++;
          recordAnswer(ok);
          $$("[data-s]", view).forEach((x) => { x.disabled = true; x.style.opacity = x.dataset.s === it.sound ? 1 : 0.35; });
          const s = ED_SOUNDS[it.sound];
          $(".q-feedback", view).innerHTML = `
            <div class="feedback ${ok ? "ok" : "no"}" style="text-align:start">
              <div class="fb-title">${ok ? pick(["✅ Correct!", tx("🎯 ¡Buen oído!", "🎯 أذن ممتازة!"), "🔥 Nice!"]) : `${tx("❌ Suena", "❌ يُنطق")} <b>${s.label}</b>`}</div>
              <div class="small">💡 ${s.es}</div>
              <div class="row" style="margin-top:8px"><span style="flex:1"><b dir="ltr">${it.base} → ${it.past}</b> <span class="muted">${s.label}</span></span>${sayBtn(`${cap(it.base)}. ${cap(it.past)}.`)}<button class="icon-btn" data-say-it title="${tx("Dilo tú", "قلها أنت")}">🎤</button></div>
            </div>
            <button class="btn block" data-next>${i + 1 < items.length ? NEXT_LABEL() : RESULT_LABEL()}</button>`;
          $("[data-say-it]", view).onclick = () => pronounceSheet(it.past);
          $("[data-next]", view).onclick = () => { i++; show(); };
        }));
      };
      show();
    };
    round();
  },

  // ---------------------------------------------------------------
  // ⚡ IRREGULARES A TODA VELOCIDAD (60 s)
  // ---------------------------------------------------------------
  g_irr(view) {
    const pool = VERBS.filter((v) => v.irregular && !v.base.includes(" ") && v.level !== "B1" && v.past !== v.base);
    view.innerHTML = `${pastTop(`⚡ ${tx("Irregulares", "الأفعال الشاذة")}`)}
      <div class="card-box"><b>📌 ${tx("Cómo se juega", "طريقة اللعب")}</b>
        <p class="small">${tx("Te muestro un verbo y escribes su <b>pasado</b> lo más rápido que puedas. Tienes <b>60 segundos</b>. Ejemplo:", "أعرض عليك فعلًا وتكتب <b>ماضيه</b> بأسرع ما يمكن. لديك <b>60 ثانية</b>. مثال:")} <i dir="ltr">go → <b>went</b></i>.</p>
        <p class="small muted">${tx("💡 ¿No te sabes alguno? Revísalo en 📖 Cómo funciona el pasado.", "💡 لا تعرف بعضها؟ راجعها في 📖 كيف يعمل الماضي.")}</p></div>
      <button class="btn block" id="start">⚡ ${tx("Empezar", "ابدأ")}</button>
      ${gameBest("past-irr") ? `<p class="small muted" style="text-align:center">🏆 ${tx("Tu récord", "رقمك القياسي")}: ${gameBest("past-irr")}</p>` : ""}`;
    $("#start").onclick = () => race();

    const race = () => {
      let score = 0, left = 60, done = false, locked = false, last = null;
      const mistakes = [];
      view.innerHTML = `${pastTop(`⚡ ${tx("Irregulares", "الأفعال الشاذة")}`, `<b id="score">⭐ 0</b>`)}
        <div class="row" style="margin-bottom:12px"><div class="bar" style="flex:1"><div id="timebar" style="width:100%"></div></div><b id="time">60s</b></div>
        <div class="quiz-card" id="qcard"></div>`;
      const timer = setInterval(() => {
        left--;
        if ($("#time")) $("#time").textContent = `${left}s`;
        if ($("#timebar")) $("#timebar").style.width = `${(left / 60) * 100}%`;
        if (left <= 0) finish();
      }, 1000);
      App.cleanup = () => { done = true; clearInterval(timer); };
      const next = () => {
        if (done || !$("#qcard")) return;
        locked = false;
        let v; do { v = pick(pool); } while (v === last && pool.length > 1);
        last = v;
        $("#qcard").innerHTML = `
          <div class="small muted" style="text-align:center">${tx("Pasado de...", "ماضي الفعل...")}</div>
          <div class="big" dir="ltr" style="text-align:center;font-size:2.2rem;margin:6px 0">${v.base}</div>
          <div class="muted" style="text-align:center;margin-bottom:12px">${escapeHtml(esMain(v))}</div>
          <form><input class="answer-input" dir="ltr" autocomplete="off" autocapitalize="off" spellcheck="false" placeholder="${tx("Escribe el pasado...", "اكتب الماضي...")}"><button class="btn block">${tx("Comprobar ↵", "تحقّق ↵")}</button></form>
          <div class="q-feedback"></div>`;
        const input = $("#qcard input");
        input.focus();
        $("#qcard form").onsubmit = (e) => {
          e.preventDefault();
          if (locked || done || !input.value.trim()) return;
          locked = true;
          const ok = v.past.split(" / ").some((p) => normalize(p) === normalize(input.value));
          recordAnswer(ok); recordVerb(v.base, ok);
          if (ok) { score++; $("#score").textContent = `⭐ ${score}`; speak(v.past); }
          else mistakes.push(`<span dir="ltr">${v.base} → <b>${v.past}</b></span>`);
          $(".q-feedback", view).innerHTML = `<div class="feedback ${ok ? "ok" : "no"}"><b dir="ltr">${ok ? "✅" : "❌"} ${v.base} → ${v.past}</b>${ok ? "" : ` <span class="small">(${escapeHtml(esMain(v))})</span>`}</div>`;
          setTimeout(next, ok ? 450 : 1800);
        };
      };
      const finish = () => {
        if (done) return;
        done = true; clearInterval(timer);
        pastEnd(view, {
          emoji: score >= 20 ? "🏆" : score >= 12 ? "😎" : "💪", id: "irr", score,
          title: tx(`⚡ ${score} irregulares en 60 segundos`, `⚡ ${score} فعلًا شاذًا في 60 ثانية`),
          lines: mistakes.length ? [`${tx("Repasa", "راجع")}: ${[...new Set(mistakes)].slice(0, 5).join(" · ")}`] : [tx("¡Sin errores!", "بدون أخطاء!")], again: race,
        });
      };
      next();
    };
  },

  // ---------------------------------------------------------------
  // 📖 ARMA LA HISTORIA
  // ---------------------------------------------------------------
  g_story(view) {
    view.innerHTML = `${pastTop(`📖 ${tx("Arma la historia", "كوّن القصة")}`)}
      <p class="lead">${tx("Elige una historia. Completa cada frase en pasado y al final escúchala completa.", "اختر قصة. أكمل كل جملة بصيغة الماضي وفي النهاية استمع إليها كاملة.")}</p>
      ${PAST_STORIES.map((s) => `<button class="list-item" data-story="${s.id}"><span class="ico">${s.emoji}</span><span class="txt"><b dir="ltr">${s.title}</b><span>${s.es} · ${tx(`${s.lines.length} frases`, `${s.lines.length} جمل`)}</span></span><span>${isAr ? "‹" : "›"}</span></button>`).join("")}`;
    $$("[data-story]", view).forEach((b) => (b.onclick = () => play(PAST_STORIES.find((s) => s.id === b.dataset.story))));

    const play = (story) => {
      let i = 0, score = 0;
      const done = [];
      const fill = (line) => line.text.replace("___", line.past);
      const options = (line) => {
        if (line.base === "be") return shuffle(["was", "were", "is"]);
        const v = VERB_BY_BASE[line.base];
        let wrong = v && v.irregular ? regularPast(line.base, false) : thirdPerson(line.base);
        if (wrong === line.past) wrong = thirdPerson(line.base); // show → showed es correcto, así que usamos "shows"
        return shuffle([...new Set([line.past, line.base, wrong])]);
      };
      const show = () => {
        const line = story.lines[i];
        view.innerHTML = `${pastTop(`${story.emoji} <span dir="ltr">${story.title}</span>`, `<b>⭐ ${score}</b>`)}
          <div class="bar" style="margin-bottom:14px"><div style="width:${(i / story.lines.length) * 100}%"></div></div>
          <div class="story" dir="ltr">${done.map((l) => `<p>${escapeHtml(fill(l)).replace(escapeHtml(l.past), `<b>${escapeHtml(l.past)}</b>`)} ${sayBtn(fill(l))}</p>`).join("")}</div>
          ${line ? `
          <div class="quiz-card">
            <div class="q-prompt" dir="ltr">${escapeHtml(line.text).replace("___", `<span class="blank">___</span>`)}</div>
            <div class="q-sub"><span dir="ltr">(${line.base})</span> · ${NATIVE.flag} ${escapeHtml(line.es)}</div>
            <div class="options" dir="ltr" style="grid-template-columns:repeat(3,1fr)">${options(line).map((o) => `<button class="option" style="text-align:center">${o}</button>`).join("")}</div>
            <div class="q-feedback"></div>
          </div>` : ""}`;
        if (!line) return end();
        $$(".option", view).forEach((b) => (b.onclick = () => {
          const ok = b.textContent === line.past;
          if (ok) score++;
          recordAnswer(ok);
          $$(".option", view).forEach((o) => { o.disabled = true; if (o.textContent === line.past) o.classList.add("correct"); });
          if (!ok) b.classList.add("wrong");
          const v = VERB_BY_BASE[line.base];
          speak(fill(line));
          $(".q-feedback", view).innerHTML = `
            <div class="feedback ${ok ? "ok" : "no"}"><b dir="ltr">${ok ? "✅" : "❌"} ${escapeHtml(fill(line))}</b>
            <div class="small">💡 <span dir="ltr">${line.base} → <b>${line.past}</b></span> ${v && v.irregular ? tx("(irregular)", "(شاذ)") : line.base === "be" ? "(I/he/she/it → was)" : tx("(regular: + ed)", "(منتظم: + ed)")}</div></div>
            <button class="btn block" data-next>${i + 1 < story.lines.length ? tx("Siguiente frase ➡️", "الجملة التالية ⬅️") : tx("Ver la historia completa 🎉", "اعرض القصة كاملة 🎉")}</button>`;
          $("[data-next]", view).onclick = () => { done.push(line); i++; show(); };
        }));
      };
      const end = () => {
        saveBest("past-story", score);
        const full = story.lines.map(fill).join(" ");
        view.insertAdjacentHTML("beforeend", `
          <div class="card-box" style="text-align:center">
            <div class="result-big">🎉</div>
            <b>${tx(`¡Historia completa! ${score} de ${story.lines.length} correctas`, `اكتملت القصة! ${score} من ${story.lines.length} صحيحة`)}</b>
            <div class="btn-row" style="margin-top:12px">
              <button class="btn" data-listen>🔊 ${tx("Escuchar la historia", "استمع إلى القصة")}</button>
              <button class="btn soft" data-es>${NATIVE.flag} ${tx("Traducción", "الترجمة")}</button>
            </div>
            <div class="small muted" data-trans hidden style="text-align:start;margin-top:10px">${story.lines.map((l) => escapeHtml(l.es)).join("<br>")}</div>
            <div class="btn-row" style="margin-top:10px"><button class="btn ghost" data-again>📖 ${tx("Otra historia", "قصة أخرى")}</button></div>
          </div>`);
        $("[data-listen]", view).onclick = () => speak(full);
        $("[data-es]", view).onclick = () => { const t = $("[data-trans]", view); t.hidden = !t.hidden; };
        $("[data-again]", view).onclick = () => render();
        speak(full);
      };
      show();
    };
  },

  // ---------------------------------------------------------------
  // 🕵️ DETECTIVE DID / DIDN'T
  // ---------------------------------------------------------------
  g_did(view) {
    const round = () => {
      const items = shuffle(DID_ITEMS).slice(0, 10);
      let i = 0, score = 0;
      const show = () => {
        if (i >= items.length) return pastEnd(view, {
          emoji: score >= 9 ? "🏆" : score >= 7 ? "😎" : "💪", id: "did", score,
          title: tx(`${score} de ${items.length} correctas`, `${score} من ${items.length} صحيحة`),
          lines: [tx("💡 Con didn't y Did, el verbo vuelve a su forma normal.", "💡 مع didn't وDid يعود الفعل إلى شكله العادي.")], again: round,
        });
        const it = items[i];
        const neg = i % 2 === 0; // alterna negativo y pregunta
        const subjQ = it.s === "I" ? "I" : it.s.toLowerCase();
        const restQ = it.rest.replace(/\.$/, "?");
        const present = ["He", "She"].includes(it.s) ? "doesn't" : "don't";
        const right = neg ? `${it.s} didn't ${it.base} ${it.rest}` : `Did ${subjQ} ${it.base} ${restQ}`;
        const opts = neg
          ? [right, `${it.s} didn't ${it.past} ${it.rest}`, `${it.s} ${present} ${it.past} ${it.rest}`]
          : [right, `Did ${subjQ} ${it.past} ${restQ}`, `${cap(["He", "She"].includes(it.s) ? "does" : "do")} ${subjQ} ${it.past} ${restQ}`];
        view.innerHTML = `${pastTop("🕵️ Detective Did / Didn't", `<b>⭐ ${score}</b>`)}
          <div class="bar" style="margin-bottom:14px"><div style="width:${(i / items.length) * 100}%"></div></div>
          <div class="quiz-card">
            <span class="q-tag" style="--c:${neg ? "var(--past)" : "var(--fut)"}">${neg ? tx("❌ Pásala a NEGATIVO", "❌ حوّلها إلى النفي") : tx("❓ Pásala a PREGUNTA", "❓ حوّلها إلى سؤال")}</span>
            <div class="q-prompt"><span dir="ltr">${escapeHtml(`${it.s} ${it.past} ${it.rest}`)}</span> ${sayBtn(`${it.s} ${it.past} ${it.rest}`)}</div>
            <div class="q-sub">${NATIVE.flag} ${escapeHtml(it.es)}</div>
            <div class="options" dir="ltr">${shuffle(opts).map((o) => `<button class="option">${escapeHtml(o)}</button>`).join("")}</div>
            <div class="q-feedback"></div>
          </div>`;
        $$(".option", view).forEach((b) => (b.onclick = () => {
          const ok = b.textContent === right;
          if (ok) score++;
          recordAnswer(ok);
          $$(".option", view).forEach((o) => { o.disabled = true; if (o.textContent === right) o.classList.add("correct"); });
          if (!ok) b.classList.add("wrong");
          speak(right);
          const short = `<i dir="ltr">Yes, ${subjQ === "you" ? "I" : subjQ} did. / No, ${subjQ === "you" ? "I" : subjQ} didn't.</i>`;
          $(".q-feedback", view).innerHTML = `
            <div class="feedback ${ok ? "ok" : "no"}"><div class="fb-title">${ok ? "✅ Correct!" : tx("❌ Casi", "❌ قريب")}</div>
            <div class="small">💡 ${neg
              ? tx(`Negativo = <b>didn't</b> + verbo normal: ${it.past} → <b>${it.base}</b>.`, `النفي = <b>didn't</b> + الفعل العادي: ${it.past} → <b>${it.base}</b>.`)
              : tx(`Pregunta = <b>Did</b> + sujeto + verbo normal: ${it.past} → <b>${it.base}</b>.`, `السؤال = <b>Did</b> + الفاعل + الفعل العادي: ${it.past} → <b>${it.base}</b>.`)}
            ${neg ? "" : ` ${tx("Respuesta corta:", "إجابة قصيرة:")} ${short}`}</div></div>
            <button class="btn block" data-next>${i + 1 < items.length ? NEXT_LABEL() : RESULT_LABEL()}</button>`;
          $("[data-next]", view).onclick = () => { i++; show(); };
        }));
      };
      show();
    };
    round();
  },

  // ---------------------------------------------------------------
  // 🗣️ CUÉNTAME TU DÍA
  // ---------------------------------------------------------------
  g_talk(view) {
    const qs = shuffle(PAST_TALK).slice(0, 4);
    let k = 0;
    const next = () => {
      if (k >= qs.length) {
        saveBest("past-talk", qs.length);
        view.innerHTML = `<div class="quiz-card" style="text-align:center"><div class="result-big">🎉</div><h2>${tx("¡Contaste tu día en pasado!", "حكيت عن يومك بصيغة الماضي!")}</h2>
          <p class="muted">${tx(`Respondiste ${qs.length} preguntas. Repite para hablar con más fluidez.`, `أجبت عن ${qs.length} أسئلة. كرّر لتتكلّم بطلاقة أكبر.`)}</p>
          <div class="btn-row"><button class="btn" onclick="render()">🔁 ${tx("Otras preguntas", "أسئلة أخرى")}</button><button class="btn ghost" onclick="go('past')">${tx("⏪ Pasado", "⏪ الماضي")}</button></div></div>`;
        return;
      }
      view.innerHTML = `${pastTop(`🗣️ ${tx("Cuéntame tu día", "احكِ لي عن يومك")} ${k + 1}/${qs.length}`)}<div class="slot"></div>`;
      talkCard($(".slot", view), qs[k++], next);
    };
    next();
  },
};
