// ⏪ PAST SIMPLE — explicación del pasado + 5 juegos para practicarlo
const PAST_GAMES = [
  { id: "ed", ico: "🎧", title: "Oído -ed", sub: "Escucha y elige cómo suena: /t/, /d/ o /ɪd/" },
  { id: "irr", ico: "⚡", title: "Irregulares a toda velocidad", sub: "60 segundos: go → went, eat → ate..." },
  { id: "story", ico: "📖", title: "Arma la historia", sub: "Completa una historia en pasado y escúchala" },
  { id: "did", ico: "🕵️", title: "Detective Did / Didn't", sub: "Pasa frases a negativo y a pregunta" },
  { id: "talk", ico: "🗣️", title: "Cuéntame tu día", sub: "Responde hablando en pasado y te corrijo" },
];
const pastTop = (title, right = "") => gameTop(title, right, "past");
const pastEnd = (view, opts) => gameEnd(view, { ...opts, id: "past-" + opts.id, back: "past", backLabel: "⏪ Pasado" });
const cap = (s) => s[0].toUpperCase() + s.slice(1);

App.sections.past = {
  render(view, sub) {
    if (sub === "learn") return this.learn(view);
    if (sub && this["g_" + sub]) return this["g_" + sub](view);
    view.innerHTML = `
      <h1 class="page">⏪ Past Simple</h1>
      <p class="lead">El pasado para contar lo que hiciste: <i>I went, I worked, I saw...</i></p>
      <button class="list-item" onclick="go('past/learn')" style="border:2px solid var(--accent)">
        <span class="ico">📖</span><span class="txt"><b>Cómo funciona el pasado</b><span>Explicación paso a paso con audio · empieza aquí</span></span><span>›</span>
      </button>
      <div class="level-group">🎮 Juegos</div>
      ${PAST_GAMES.map((g) => listItem("past/" + g.id, g.ico, g.title, `${g.sub}${gameBest("past-" + g.id) ? ` · 🏆 ${gameBest("past-" + g.id)}` : ""}`)).join("")}`;
  },

  // ---------------------------------------------------------------
  // 📖 EXPLICACIÓN
  // ---------------------------------------------------------------
  learn(view) {
    const ex = (en, es, c = "var(--accent)") => `
      <div class="ex" style="--c:${c}"><div class="text"><div class="en">${en}</div><div class="es">${escapeHtml(es)}</div></div>
      <div class="btns">${sayBtn(en.replace(/<[^>]+>/g, ""))}</div></div>`;
    const irr = TOP_IRREGULARS.map((b) => VERB_BY_BASE[b]).filter(Boolean);
    view.innerHTML = `
      <button class="btn ghost" onclick="go('past')" style="margin:6px 0 12px">⬅️ Pasado</button>
      <h1 class="page">📖 Cómo funciona el pasado</h1>
      <p class="lead">Lee cada parte y toca 🔊 para escuchar. Al final hay juegos para practicar.</p>

      <div class="card-box">
        <div class="section-title" style="margin-top:0">1️⃣ ¿Cuándo se usa?</div>
        <p>El <b>Past Simple</b> sirve para hablar de acciones que <b>empezaron y terminaron en el pasado</b>: ayer, la semana pasada, hace un año...</p>
        <div class="timeline">
          <div class="tl-part on">⏪ <b>Pasado</b><small>I worked</small></div>
          <div class="tl-part">📍 <b>Ahora</b><small>I work</small></div>
          <div class="tl-part">⏩ <b>Futuro</b><small>I will work</small></div>
        </div>
        <p class="small muted">💡 Buena noticia: en pasado el verbo es <b>igual para todas las personas</b>: I worked, you worked, she worked, they worked. ¡No hay -s!</p>
      </div>

      <div class="card-box">
        <div class="section-title" style="margin-top:0">2️⃣ Palabras que indican pasado</div>
        <div class="chips" style="flex-wrap:wrap">${PAST_TIME_WORDS.map(([en, es]) => `<button class="chip" data-say="${en}" title="${escapeHtml(es)}">🔊 ${en} <span class="muted">· ${es}</span></button>`).join("")}</div>
        ${ex("<b>Yesterday</b> I <b>worked</b> until six.", "Ayer trabajé hasta las seis.")}
        ${ex("I <b>visited</b> my family <b>two years ago</b>.", "Visité a mi familia hace dos años.")}
      </div>

      <div class="card-box">
        <div class="section-title" style="margin-top:0">3️⃣ Verbos regulares: + ed</div>
        <p>La mayoría de los verbos forman el pasado agregando <b>-ed</b>:</p>
        <div class="formula"><span>work</span><i>→</i><span>work<b>ed</b></span><span>play</span><i>→</i><span>play<b>ed</b></span></div>
        <ul class="explain small">
          <li>Termina en <b>-e</b> → solo <b>-d</b>: live → live<b>d</b>, dance → dance<b>d</b></li>
          <li>Consonante + <b>y</b> → <b>-ied</b>: study → stud<b>ied</b>, cry → cr<b>ied</b> (pero play → play<b>ed</b>)</li>
          <li>Verbo corto consonante-vocal-consonante → se <b>duplica</b>: stop → sto<b>pp</b>ed, plan → pla<b>nn</b>ed</li>
        </ul>
        ${ex("I <b>cleaned</b> the kitchen and <b>cooked</b> dinner.", "Limpié la cocina y cociné la cena.", "var(--pres)")}
      </div>

      <div class="card-box">
        <div class="section-title" style="margin-top:0">4️⃣ 🔊 Cómo se pronuncia la -ed</div>
        <p>⚠️ El error más común: pronunciar todas las <i>-ed</i> como una sílaba extra (<i>«work-ed»</i>). En realidad tienen <b>3 sonidos</b>:</p>
        ${Object.entries(ED_SOUNDS).map(([k, s]) => {
          const words = ED_VERBS.filter((v) => v.sound === k).slice(0, 4);
          return `<div class="ex" style="--c:${s.color}">
            <div class="text"><div class="en" style="color:var(--c);font-size:1.2rem"><b>${s.label}</b></div>
            <div class="es">${s.es}</div><div class="small" style="margin-top:4px">${s.tip}</div>
            <div class="chips" style="margin-top:8px;flex-wrap:wrap">${words.map((w) => `<button class="chip" data-say="${w.past}">🔊 ${w.past}</button>`).join("")}</div></div>
          </div>`;
        }).join("")}
        <button class="btn soft block" onclick="go('past/ed')">🎧 Practicar la pronunciación de -ed</button>
      </div>

      <div class="card-box">
        <div class="section-title" style="margin-top:0">5️⃣ Verbos irregulares</div>
        <p>Algunos verbos <b>no usan -ed</b>: cambian por completo. Hay que memorizarlos. Estos son los más usados:</p>
        <div class="irr-grid">${irr.map((v) => `<button class="irr" data-say="${v.base}. ${v.past.replace(" / ", ", ")}."><span class="muted">${v.base}</span><b>${v.past}</b><small>${escapeHtml(esMain(v))}</small></button>`).join("")}</div>
        <p class="small muted">👆 Toca cada uno para escucharlo. Todos los verbos están en la sección 📚 Verbos.</p>
        ${ex("I <b>went</b> to the beach and <b>saw</b> dolphins.", "Fui a la playa y vi delfines.", "var(--past)")}
      </div>

      <div class="card-box">
        <div class="section-title" style="margin-top:0">6️⃣ Negativo: didn't + verbo normal</div>
        <div class="formula"><span>sujeto</span><i>+</i><span>didn't</span><i>+</i><span>verbo normal</span></div>
        <p class="small">💡 El «pasado» ya lo lleva <b>didn't</b>, así que el verbo vuelve a su forma normal.</p>
        ${ex("I <b>didn't go</b> to work yesterday.", "Ayer no fui al trabajo.", "var(--past)")}
        ${ex("She <b>didn't like</b> the movie.", "A ella no le gustó la película.", "var(--past)")}
        <div class="issue"><span class="wrong">❌ I didn't went</span> → <span class="right">✅ I didn't go</span></div>
      </div>

      <div class="card-box">
        <div class="section-title" style="margin-top:0">7️⃣ Preguntas: Did + sujeto + verbo normal</div>
        <div class="formula"><span>Did</span><i>+</i><span>sujeto</span><i>+</i><span>verbo normal</span><i>?</i></div>
        ${ex("<b>Did</b> you <b>eat</b> breakfast?", "¿Tomaste desayuno?", "var(--fut)")}
        ${ex("<b>Where did</b> you <b>go</b> last weekend?", "¿A dónde fuiste el fin de semana pasado?", "var(--fut)")}
        <p class="small"><b>Respuestas cortas:</b> Yes, I did. / No, I didn't.</p>
        <div class="issue"><span class="wrong">❌ Did you saw...?</span> → <span class="right">✅ Did you see...?</span></div>
      </div>

      <div class="card-box">
        <div class="section-title" style="margin-top:0">8️⃣ El verbo BE: was / were</div>
        <div class="formula"><span>I / he / she / it</span><i>→</i><span>was</span></div>
        <div class="formula"><span>you / we / they</span><i>→</i><span>were</span></div>
        ${ex("I <b>was</b> tired, but we <b>were</b> happy.", "Estaba cansado/a, pero estábamos felices.", "var(--pp)")}
        ${ex("It <b>wasn't</b> easy. <b>Were</b> you at home?", "No fue fácil. ¿Estabas en casa?", "var(--pp)")}
      </div>

      <div class="card-box" style="background:var(--warn-soft)">
        <b>⚠️ Los 4 errores más comunes</b>
        <div class="issue" style="margin-top:8px"><span class="wrong">❌ Yesterday I go to the beach.</span><br><span class="right">✅ Yesterday I went to the beach.</span></div>
        <div class="issue"><span class="wrong">❌ I didn't went.</span> → <span class="right">✅ I didn't go.</span></div>
        <div class="issue"><span class="wrong">❌ Did you went?</span> → <span class="right">✅ Did you go?</span></div>
        <div class="issue"><span class="wrong">❌ I was go.</span> → <span class="right">✅ I went.</span></div>
      </div>

      <div class="section-title">🎮 ¡Ahora practica!</div>
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
          title: `${score} de ${items.length} sonidos correctos`, lines: ["💡 Recuerda: solo después de t o d se agrega la sílaba «id»."], again: round,
        });
        const it = items[i];
        view.innerHTML = `${pastTop("🎧 Oído -ed", `<b>⭐ ${score}</b>`)}
          <div class="bar" style="margin-bottom:14px"><div style="width:${(i / items.length) * 100}%"></div></div>
          <div class="quiz-card" style="text-align:center">
            <div class="small muted">Escucha: ¿cómo suena la -ed?</div>
            <div class="big" style="font-size:2.2rem;margin:8px 0">${it.past}</div>
            <div class="muted">${it.base} · ${it.es}</div>
            <div class="audio-prompt"><button class="icon-btn" data-play>🔊</button><button class="icon-btn" data-slow>🐢</button></div>
            <div class="dgp-btns">${Object.entries(ED_SOUNDS).map(([k, s]) => `<button class="btn dgp" data-s="${k}" style="background:${s.color}">${s.label}</button>`).join("")}</div>
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
            <div class="feedback ${ok ? "ok" : "no"}" style="text-align:left">
              <div class="fb-title">${ok ? pick(["✅ Correct!", "🎯 ¡Buen oído!", "🔥 Nice!"]) : `❌ Suena <b>${s.label}</b>`}</div>
              <div class="small">💡 ${s.es}</div>
              <div class="row" style="margin-top:8px"><span style="flex:1"><b>${it.base} → ${it.past}</b> <span class="muted">${s.label}</span></span>${sayBtn(`${cap(it.base)}. ${cap(it.past)}.`)}<button class="icon-btn" data-say-it title="Dilo tú">🎤</button></div>
            </div>
            <button class="btn block" data-next>${i + 1 < items.length ? "Siguiente ➡️" : "Ver resultado 🏁"}</button>`;
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
    view.innerHTML = `${pastTop("⚡ Irregulares")}
      <div class="card-box"><b>📌 Cómo se juega</b>
        <p class="small">Te muestro un verbo y escribes su <b>pasado</b> lo más rápido que puedas. Tienes <b>60 segundos</b>. Ejemplo: <i>go → <b>went</b></i>.</p>
        <p class="small muted">💡 ¿No te sabes alguno? Revísalo en 📖 Cómo funciona el pasado.</p></div>
      <button class="btn block" id="start">⚡ Empezar</button>
      ${gameBest("past-irr") ? `<p class="small muted" style="text-align:center">🏆 Tu récord: ${gameBest("past-irr")}</p>` : ""}`;
    $("#start").onclick = () => race();

    const race = () => {
      let score = 0, left = 60, done = false, locked = false, last = null;
      const mistakes = [];
      view.innerHTML = `${pastTop("⚡ Irregulares", `<b id="score">⭐ 0</b>`)}
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
          <div class="small muted" style="text-align:center">Pasado de...</div>
          <div class="big" style="text-align:center;font-size:2.2rem;margin:6px 0">${v.base}</div>
          <div class="muted" style="text-align:center;margin-bottom:12px">${escapeHtml(esMain(v))}</div>
          <form><input class="answer-input" autocomplete="off" autocapitalize="off" spellcheck="false" placeholder="Escribe el pasado..."><button class="btn block">Comprobar ↵</button></form>
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
          else mistakes.push(`${v.base} → <b>${v.past}</b>`);
          $(".q-feedback", view).innerHTML = `<div class="feedback ${ok ? "ok" : "no"}"><b>${ok ? "✅" : "❌"} ${v.base} → ${v.past}</b>${ok ? "" : ` <span class="small">(${escapeHtml(esMain(v))})</span>`}</div>`;
          setTimeout(next, ok ? 450 : 1800);
        };
      };
      const finish = () => {
        if (done) return;
        done = true; clearInterval(timer);
        pastEnd(view, {
          emoji: score >= 20 ? "🏆" : score >= 12 ? "😎" : "💪", id: "irr", score,
          title: `⚡ ${score} irregulares en 60 segundos`,
          lines: mistakes.length ? [`Repasa: ${[...new Set(mistakes)].slice(0, 5).join(" · ")}`] : ["¡Sin errores!"], again: race,
        });
      };
      next();
    };
  },

  // ---------------------------------------------------------------
  // 📖 ARMA LA HISTORIA
  // ---------------------------------------------------------------
  g_story(view) {
    view.innerHTML = `${pastTop("📖 Arma la historia")}
      <p class="lead">Elige una historia. Completa cada frase en pasado y al final escúchala completa.</p>
      ${PAST_STORIES.map((s) => `<button class="list-item" data-story="${s.id}"><span class="ico">${s.emoji}</span><span class="txt"><b>${s.title}</b><span>${s.es} · ${s.lines.length} frases</span></span><span>›</span></button>`).join("")}`;
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
        view.innerHTML = `${pastTop(`${story.emoji} ${story.title}`, `<b>⭐ ${score}</b>`)}
          <div class="bar" style="margin-bottom:14px"><div style="width:${(i / story.lines.length) * 100}%"></div></div>
          <div class="story">${done.map((l) => `<p>${escapeHtml(fill(l)).replace(escapeHtml(l.past), `<b>${escapeHtml(l.past)}</b>`)} ${sayBtn(fill(l))}</p>`).join("")}</div>
          ${line ? `
          <div class="quiz-card">
            <div class="q-prompt">${escapeHtml(line.text).replace("___", `<span class="blank">___</span>`)}</div>
            <div class="q-sub">(${line.base}) · 🇪🇸 ${escapeHtml(line.es)}</div>
            <div class="options" style="grid-template-columns:repeat(3,1fr)">${options(line).map((o) => `<button class="option" style="text-align:center">${o}</button>`).join("")}</div>
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
            <div class="feedback ${ok ? "ok" : "no"}"><b>${ok ? "✅" : "❌"} ${escapeHtml(fill(line))}</b>
            <div class="small">💡 ${line.base} → <b>${line.past}</b> ${v && v.irregular ? "(irregular)" : line.base === "be" ? "(I/he/she/it → was)" : "(regular: + ed)"}</div></div>
            <button class="btn block" data-next>${i + 1 < story.lines.length ? "Siguiente frase ➡️" : "Ver la historia completa 🎉"}</button>`;
          $("[data-next]", view).onclick = () => { done.push(line); i++; show(); };
        }));
      };
      const end = () => {
        saveBest("past-story", score);
        const full = story.lines.map(fill).join(" ");
        view.insertAdjacentHTML("beforeend", `
          <div class="card-box" style="text-align:center">
            <div class="result-big">🎉</div>
            <b>¡Historia completa! ${score} de ${story.lines.length} correctas</b>
            <div class="btn-row" style="margin-top:12px">
              <button class="btn" data-listen>🔊 Escuchar la historia</button>
              <button class="btn soft" data-es>🇪🇸 Traducción</button>
            </div>
            <div class="small muted" data-trans hidden style="text-align:left;margin-top:10px">${story.lines.map((l) => escapeHtml(l.es)).join("<br>")}</div>
            <div class="btn-row" style="margin-top:10px"><button class="btn ghost" data-again>📖 Otra historia</button></div>
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
          title: `${score} de ${items.length} correctas`, lines: ["💡 Con didn't y Did, el verbo vuelve a su forma normal."], again: round,
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
            <span class="q-tag" style="--c:${neg ? "var(--past)" : "var(--fut)"}">${neg ? "❌ Pásala a NEGATIVO" : "❓ Pásala a PREGUNTA"}</span>
            <div class="q-prompt">${escapeHtml(`${it.s} ${it.past} ${it.rest}`)} ${sayBtn(`${it.s} ${it.past} ${it.rest}`)}</div>
            <div class="q-sub">🇪🇸 ${escapeHtml(it.es)}</div>
            <div class="options">${shuffle(opts).map((o) => `<button class="option">${escapeHtml(o)}</button>`).join("")}</div>
            <div class="q-feedback"></div>
          </div>`;
        $$(".option", view).forEach((b) => (b.onclick = () => {
          const ok = b.textContent === right;
          if (ok) score++;
          recordAnswer(ok);
          $$(".option", view).forEach((o) => { o.disabled = true; if (o.textContent === right) o.classList.add("correct"); });
          if (!ok) b.classList.add("wrong");
          speak(right);
          $(".q-feedback", view).innerHTML = `
            <div class="feedback ${ok ? "ok" : "no"}"><div class="fb-title">${ok ? "✅ Correct!" : "❌ Casi"}</div>
            <div class="small">💡 ${neg ? `Negativo = <b>didn't</b> + verbo normal: ${it.past} → <b>${it.base}</b>.` : `Pregunta = <b>Did</b> + sujeto + verbo normal: ${it.past} → <b>${it.base}</b>.`}
            ${neg ? "" : ` Respuesta corta: <i>Yes, ${subjQ === "you" ? "I" : subjQ} did. / No, ${subjQ === "you" ? "I" : subjQ} didn't.</i>`}</div></div>
            <button class="btn block" data-next>${i + 1 < items.length ? "Siguiente ➡️" : "Ver resultado 🏁"}</button>`;
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
        view.innerHTML = `<div class="quiz-card" style="text-align:center"><div class="result-big">🎉</div><h2>¡Contaste tu día en pasado!</h2>
          <p class="muted">Respondiste ${qs.length} preguntas. Repite para hablar con más fluidez.</p>
          <div class="btn-row"><button class="btn" onclick="render()">🔁 Otras preguntas</button><button class="btn ghost" onclick="go('past')">⏪ Pasado</button></div></div>`;
        return;
      }
      view.innerHTML = `${pastTop(`🗣️ Cuéntame tu día ${k + 1}/${qs.length}`)}<div class="slot"></div>`;
      talkCard($(".slot", view), qs[k++], next);
    };
    next();
  },
};
