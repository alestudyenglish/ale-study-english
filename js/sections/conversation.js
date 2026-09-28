// 💬 CONVERSACIÓN — diálogos completos que cambian según lo que respondes
App.sections.conversation = {
  render(view, id) {
    if (id) return this.chat(view, id);
    view.innerHTML = `
      <h1 class="page">💬 Conversación</h1>
      <p class="lead">Conversaciones reales. Responde hablando 🎤 o escribiendo ⌨️ y la conversación sigue según tu respuesta.</p>
      ${levelGroups(CONVERSATIONS, (c) => {
        const done = Store.data.convs[c.id]?.done;
        return listItem(allowed(c) ? "conversation/" + c.id : "", c.emoji, c.title + (done ? " ✅" : ""), c.desc, !allowed(c));
      })}`;
    lockedClicks(view);
  },

  chat(view, id) {
    const conv = CONVERSATIONS.find((c) => c.id === id);
    if (!conv) return go("conversation");
    const memory = { name: "friend" };
    let stepId = conv.start, turns = 0, tips = 0;
    let autoVoice = true;

    view.innerHTML = `
      <div class="row" style="margin:6px 0">
        <button class="icon-btn" onclick="go('conversation')">✕</button>
        <b style="flex:1">${conv.emoji} ${conv.title}</b>
        <button class="icon-btn" id="voiceToggle" title="Leer en voz alta">🔊</button>
        <button class="icon-btn" id="esToggle" title="Mostrar traducción">🇪🇸</button>
      </div>
      <div class="chat" id="chat"></div>
      <div class="composer" id="composer">
        <div class="suggestions" id="hints"></div>
        <form class="row" id="form">
          <button class="mic" type="button" id="mic">🎤</button>
          <input id="input" placeholder="Responde en inglés..." autocomplete="off">
          <button class="btn" type="submit">➤</button>
        </form>
        <div class="mic-status small" id="micStatus"></div>
      </div>`;

    const chat = $("#chat");
    let showEs = false;
    const fill = (s) => s.replace(/\{name\}/g, memory.name);
    const scroll = () => window.scrollTo({ top: document.body.scrollHeight, behavior: "smooth" });

    function botSay(text, es) {
      const t = fill(text);
      const spoken = t.replace(/\(.*?\)/g, "").trim(); // no leer las indicaciones entre paréntesis
      chat.appendChild(html(`<div class="bubble bot">${escapeHtml(t)} ${sayBtn(spoken)}<div class="es" ${showEs ? "" : "hidden"}>🇪🇸 ${escapeHtml(es || "")}</div></div>`));
      if (autoVoice) speak(spoken);
      scroll();
    }
    function showStep() {
      const step = conv.steps[stepId];
      botSay(step.bot, step.es);
      if (step.end) return finish();
      $("#hints").innerHTML = `<span class="small muted">💡 Ideas:</span>` + (step.hints || []).map((h) => `<button class="chip" type="button">${escapeHtml(h)}</button>`).join("");
      $$("#hints .chip").forEach((c) => (c.onclick = () => { $("#input").value = c.textContent; $("#input").focus(); }));
    }
    function userSay(text) {
      const step = conv.steps[stepId];
      turns++;
      chat.appendChild(html(`<div class="bubble me">${escapeHtml(text)}</div>`));
      // Corrección suave, sin cortar la conversación
      const r = Checker.check(text);
      if (r.issues.length) {
        tips++;
        chat.appendChild(html(`<div class="bubble tip">✏️ <b>${escapeHtml(r.corrected)}</b> ${sayBtn(r.corrected)}<div class="small">${r.issues.map((i) => i.why).join("<br>")}</div></div>`));
      }
      Store.data.stats.speakTotal++; if (!r.issues.length) Store.data.stats.speakPerfect++;
      markDay(); Store.save();

      // Guardar datos (por ejemplo, tu nombre)
      Object.entries(step.save || {}).forEach(([key, re]) => {
        const m = text.match(re);
        if (m) memory[key] = m[1][0].toUpperCase() + m[1].slice(1);
      });
      // Elegir el siguiente paso según la respuesta
      const route = (step.routes || []).find(([re]) => re.test(text));
      stepId = route ? route[1] : step.next;
      $("#hints").innerHTML = "";
      setTimeout(() => {
        if (route && route[2]) botSay(route[2], "");
        setTimeout(showStep, route && route[2] ? 900 : 0);
      }, 600);
    }
    function finish() {
      $("#composer").hidden = true;
      const prev = Store.data.convs[conv.id] || { times: 0 };
      Store.data.convs[conv.id] = { done: true, times: prev.times + 1 };
      Store.save();
      chat.appendChild(html(`
        <div class="card-box" style="text-align:center;margin-top:10px">
          <div class="result-big">🎉</div>
          <b>¡Conversación completada!</b>
          <p class="muted">${turns} respuestas · ${tips ? `✏️ ${tips} consejo${tips > 1 ? "s" : ""} de corrección` : "✅ ¡sin errores detectados!"}</p>
          <div class="btn-row"><button class="btn" onclick="render()">🔁 Repetir</button><button class="btn ghost" onclick="go('conversation')">💬 Otra</button></div>
        </div>`));
      scroll();
    }

    $("#form").onsubmit = (e) => {
      e.preventDefault();
      const v = $("#input").value.trim();
      if (!v) return;
      $("#input").value = "";
      userSay(v);
    };
    $("#voiceToggle").onclick = () => { autoVoice = !autoVoice; $("#voiceToggle").style.opacity = autoVoice ? 1 : 0.4; toast(autoVoice ? "🔊 Voz activada" : "🔇 Voz desactivada"); };
    $("#esToggle").onclick = () => { showEs = !showEs; $$(".bubble .es").forEach((e) => (e.hidden = !showEs)); };

    // Micrófono
    const mic = $("#mic"), status = $("#micStatus");
    if (!SpeechRec) { mic.disabled = true; mic.style.opacity = 0.4; }
    mic.onclick = () => {
      if (activeRec) { activeRec.stop(); return; }
      const rec = new SpeechRec();
      rec.lang = "en-US"; rec.interimResults = true;
      let finalText = "";
      rec.onresult = (e) => {
        let t = ""; for (let k = 0; k < e.results.length; k++) t += e.results[k][0].transcript;
        $("#input").value = t;
        if (e.results[e.results.length - 1].isFinal) finalText = t;
      };
      rec.onerror = (e) => { status.innerHTML = MIC_ERRORS[e.error] || e.error; };
      rec.onend = () => {
        mic.classList.remove("on"); activeRec = null;
        if (finalText.trim()) { status.textContent = ""; $("#input").value = ""; userSay(finalText.trim()); }
      };
      stopListening(); activeRec = rec;
      speechSynthesis.cancel();
      mic.classList.add("on"); status.textContent = "🔴 Escuchando...";
      try { rec.start(); } catch (err) { status.textContent = "No pude iniciar el micrófono 😅"; }
    };

    showStep();
  },
};
