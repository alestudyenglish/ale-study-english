// =====================================================================
// 🗣️ HABLAR CON ALEXIS — conversación libre con IA, en inglés y español
// ---------------------------------------------------------------------
//  🧠 Cerebro: Claude Opus 5 (API de Anthropic, de pago por uso)
//  🔊 Voz:     tu voz clonada en ElevenLabs (de pago). Si no está
//              configurada, usa las voces gratis del navegador.
//  🎤 Oído:    reconocimiento de voz del navegador (gratis), con un
//              botón para inglés y otro para español.
// Las claves se guardan SOLO en este navegador (nunca en el código).
// =====================================================================
const TUTOR_NAME = "Alexis";
const CLAUDE_MODEL = "claude-opus-5";
const SDK_URL = "https://cdn.jsdelivr.net/npm/@anthropic-ai/sdk@0.128.0/+esm";
const ELEVEN_MODEL = "eleven_multilingual_v2"; // habla español e inglés con la misma voz
// Precios de Claude Opus 5 (USD por millón de tokens) para mostrar el gasto aproximado
const PRICE = { input: 5, output: 25, cacheWrite: 6.25, cacheRead: 0.5 };

// ---------- Claves (solo en este navegador) ----------
const TutorKeys = {
  key: "ale-tutor-settings",
  get() { try { return JSON.parse(localStorage.getItem(this.key)) || {}; } catch (e) { return {}; } },
  set(v) { try { localStorage.setItem(this.key, JSON.stringify(v)); } catch (e) {} },
  clear() { try { localStorage.removeItem(this.key); } catch (e) {} },
};

// ---------- Cómo debe comportarse Alexis ----------
function tutorSystemPrompt(level) {
  return `You are ${TUTOR_NAME}, a man: a warm, upbeat and patient English conversation partner. When you refer to yourself in Spanish, use masculine forms (for example "estoy contento", "soy tu compañero"). You are an English conversation partner for a Spanish-speaking learner from Latin America who lives in Australia. The learner's English level is ${level} (CEFR). The goal is everyday spoken English: work, cafés, shopping, transport, friends, plans, daily life in Australia.

How to talk:
- Keep the conversation going in English. Short turns: 1 to 3 short sentences, then ask the learner a question.
- Match the learner's level. For A1/A2 use very simple words and short sentences.
- Sound like a friendly real person, not a textbook. Occasionally use common Australian expressions (arvo, heaps, no worries, reckon) and explain them briefly in Spanish.

When the learner speaks Spanish, says they don't know, or asks how to say something:
1. Explain briefly in Spanish what it means or how the sentence is built.
2. Give the natural English sentence.
3. Break it into small chunks with their Spanish meaning in "chunks" (for example "I work" = "yo trabajo", "at a café" = "en un café").
4. Put the full English sentence in "repeat" so the learner practises saying it.
Then continue the conversation.

When the learner makes a mistake in English:
- Keep the conversation natural. Add at most 2 items to "corrections" with a very short explanation in Spanish.
- Sometimes put the corrected sentence in "repeat" so they say it correctly.

Messages that start with "[Repetición]" report how the learner repeated a sentence and an accuracy percentage from speech recognition. React briefly: celebrate if 85% or more; otherwise encourage them, mention the words that were missed, and you may ask them to try once more. Then continue.

Output rules:
- "say" is what you say out loud, as an ordered list of segments. Each segment must be entirely in English ("en") or entirely in Spanish ("es"); never mix languages inside one segment, because each segment is read aloud by a voice in that language.
- Keep Spanish short and simple. Never use emojis, markdown or symbols in "say" (it is read aloud).
- Use empty lists and an empty "repeat" when they do not apply.

The app has already greeted the learner for you with: "Hi! I'm ${TUTOR_NAME}. How are you today?" and, in Spanish, told them they can ask you in Spanish whenever they don't know how to say something.`;
}

const TUTOR_SCHEMA = {
  type: "object",
  properties: {
    say: {
      type: "array",
      items: {
        type: "object",
        properties: { lang: { type: "string", enum: ["en", "es"] }, text: { type: "string" } },
        required: ["lang", "text"],
        additionalProperties: false,
      },
    },
    chunks: {
      type: "array",
      items: {
        type: "object",
        properties: { en: { type: "string" }, es: { type: "string" } },
        required: ["en", "es"],
        additionalProperties: false,
      },
    },
    corrections: {
      type: "array",
      items: {
        type: "object",
        properties: { wrong: { type: "string" }, right: { type: "string" }, why_es: { type: "string" } },
        required: ["wrong", "right", "why_es"],
        additionalProperties: false,
      },
    },
    repeat: { type: "string" },
  },
  required: ["say", "chunks", "corrections", "repeat"],
  additionalProperties: false,
};

// ---------- 🧠 Claude (SDK oficial, cargado desde internet) ----------
let AnthropicSDK = null;
async function loadSDK() {
  if (!AnthropicSDK) AnthropicSDK = (await import(SDK_URL)).default;
  return AnthropicSDK;
}

async function askClaude(history, level) {
  const Anthropic = await loadSDK();
  const client = new Anthropic({ apiKey: TutorKeys.get().anthropicKey, dangerouslyAllowBrowser: true });
  const response = await client.beta.messages.create({
    model: CLAUDE_MODEL,
    max_tokens: 16000,
    betas: ["server-side-fallback-2026-07-01"],
    fallbacks: "default", // si Opus 5 rechaza algo, otro modelo responde en su lugar
    output_config: { effort: "low", format: { type: "json_schema", schema: TUTOR_SCHEMA } }, // "low" = respuestas rápidas para conversar
    cache_control: { type: "ephemeral" }, // abarata los mensajes siguientes de la misma conversación
    system: tutorSystemPrompt(level),
    messages: history,
  });
  return response;
}

function friendlyError(err) {
  const A = AnthropicSDK;
  if (!A) return "📶 No pude cargar la conexión con Claude. ¿Tienes internet?";
  if (err instanceof A.AuthenticationError) return "🔑 La clave de Claude no es válida. Revísala en ⚙️ Configuración.";
  if (err instanceof A.PermissionDeniedError) return "🔒 Tu clave no tiene permiso para usar este modelo.";
  if (err instanceof A.RateLimitError) return "⏳ Demasiadas solicitudes o sin saldo. Espera un momento o revisa tu saldo en console.anthropic.com.";
  if (err instanceof A.BadRequestError) return "⚠️ Claude no aceptó la solicitud: " + err.message;
  if (err instanceof A.APIConnectionError) return "📶 Sin conexión con Claude. Revisa tu internet.";
  if (err instanceof A.APIError) return `⚠️ Error de Claude (${err.status}): ${err.message}`;
  return "⚠️ " + (err && err.message ? err.message : "Algo salió mal");
}

function costOf(usage) {
  if (!usage) return 0;
  return ((usage.input_tokens || 0) * PRICE.input + (usage.output_tokens || 0) * PRICE.output +
    (usage.cache_creation_input_tokens || 0) * PRICE.cacheWrite + (usage.cache_read_input_tokens || 0) * PRICE.cacheRead) / 1e6;
}

// ---------- 🔊 Voz: ElevenLabs (tu voz) o voces del navegador ----------
const TutorVoice = {
  audio: null,
  cache: new Map(),
  stopped: false,
  hasClone() { const k = TutorKeys.get(); return !!(k.elevenKey && k.voiceId); },
  // ElevenLabs acepta velocidades entre 0.7 y 1.2; si pides más lento, el resto se hace al reproducir
  elevenSpeed: (rate) => Math.min(1.2, Math.max(0.7, rate)),
  async elevenAudio(text, rate = 1) {
    const speed = this.elevenSpeed(rate);
    const key = `${speed}|${text}`;
    if (this.cache.has(key)) return this.cache.get(key);
    const { elevenKey, voiceId } = TutorKeys.get();
    const res = await fetch(`https://api.elevenlabs.io/v1/text-to-speech/${encodeURIComponent(voiceId)}`, {
      method: "POST",
      headers: { "Content-Type": "application/json", "xi-api-key": elevenKey, Accept: "audio/mpeg" },
      body: JSON.stringify({
        text, model_id: ELEVEN_MODEL,
        // stability alta = pronunciación más clara y pareja
        voice_settings: { stability: 0.6, similarity_boost: 0.8, style: 0, use_speaker_boost: true, speed },
      }),
    });
    if (!res.ok) {
      const msg = res.status === 401 ? "clave de ElevenLabs inválida" : res.status === 404 ? "Voice ID no encontrado" : `error ${res.status}`;
      throw new Error(msg);
    }
    const url = URL.createObjectURL(await res.blob());
    this.cache.set(key, url);
    return url;
  },
  playUrl(url, playbackRate = 1) {
    return new Promise((resolve) => {
      this.audio = new Audio(url);
      this.audio.playbackRate = playbackRate; // el navegador mantiene el tono de la voz
      this.audio.preservesPitch = true;
      this.audio.onended = this.audio.onerror = () => resolve();
      this.audio.play().catch(() => resolve());
    });
  },
  browserSay(text, lang, slow) {
    return new Promise((resolve) => {
      if (!("speechSynthesis" in window)) return resolve();
      Voice.refresh();
      const v = lang === "es" ? Voice.bestSpanish({ male: true }) : Voice.best("en-US", { male: true }); // Alexis es hombre
      // Frase por frase, con una pequeña pausa entre oraciones
      const parts = splitSentences(text);
      parts.forEach((part, n) => {
        const u = new SpeechSynthesisUtterance(part);
        u.lang = v ? v.lang : lang === "es" ? "es-MX" : "en-US";
        if (v) u.voice = v;
        // El inglés va a la velocidad que elegiste; el español, a velocidad normal
        u.rate = lang === "es" ? (slow ? 0.85 : 1) : voiceRate(slow);
        if (n === parts.length - 1) u.onend = u.onerror = () => resolve();
        speechSynthesis.speak(u);
      });
      if (!parts.length) resolve();
    });
  },
  // Lee los segmentos en orden (inglés con voz en inglés, español con voz en español)
  async speakSegments(segments, { slow = false } = {}) {
    this.stop();
    this.stopped = false;
    const useClone = this.hasClone();
    const rateFor = (s) => (s.lang === "es" ? (slow ? 0.85 : 1) : voiceRate(slow));
    // Pedimos todos los audios a la vez para que no haya pausas entre segmentos
    const urls = useClone ? segments.map((s) => this.elevenAudio(s.text, rateFor(s)).catch((e) => e)) : [];
    for (let i = 0; i < segments.length; i++) {
      if (this.stopped) return;
      const s = segments[i];
      if (useClone) {
        const url = await urls[i];
        if (url instanceof Error) {
          toast(`🔊 Tu voz no funcionó (${url.message}). Uso la voz del navegador.`);
          await this.browserSay(s.text, s.lang, slow);
        } else await this.playUrl(url, rateFor(s) / this.elevenSpeed(rateFor(s)));
      } else await this.browserSay(s.text, s.lang, slow);
    }
  },
  stop() {
    this.stopped = true;
    if (this.audio) { this.audio.pause(); this.audio = null; }
    if ("speechSynthesis" in window) speechSynthesis.cancel();
  },
};

// ---------- 🎤 Escuchar una vez en un idioma ----------
function listenOnce(lang, onInterim) {
  return new Promise((resolve, reject) => {
    if (!SpeechRec) return reject(new Error("Tu navegador no reconoce voz. Usa Chrome o Edge, o escribe."));
    stopListening();
    const rec = new SpeechRec();
    rec.lang = lang; rec.interimResults = true;
    let finalText = "";
    rec.onresult = (e) => {
      let t = "";
      for (let i = 0; i < e.results.length; i++) t += e.results[i][0].transcript;
      onInterim && onInterim(t);
      if (e.results[e.results.length - 1].isFinal) finalText = t;
    };
    rec.onerror = (e) => { activeRec = null; reject(new Error(MIC_ERRORS[e.error] || e.error)); };
    rec.onend = () => { activeRec = null; resolve(finalText.trim()); };
    activeRec = rec;
    TutorVoice.stop();
    try { rec.start(); } catch (e) { reject(e); }
  });
}

// =====================================================================
// Pantallas
// =====================================================================
App.sections.tutor = {
  render(view, sub) {
    if (sub === "settings") return this.settings(view);
    if (!TutorKeys.get().anthropicKey) return this.welcome(view);
    this.chat(view);
  },

  welcome(view) {
    view.innerHTML = `
      <h1 class="page">🗣️ Hablar con ${TUTOR_NAME}</h1>
      <p class="lead">Conversa libremente en inglés. Si no sabes algo, pregúntale en español: te lo explica, te lo dice en inglés y te ayuda a repetirlo.</p>
      <div class="card-box">
        <b>Para empezar necesitas configurar:</b>
        <ol class="explain" style="margin-top:8px">
          <li>🧠 <b>Clave de Claude</b> (obligatoria) — para que ${TUTOR_NAME} entienda y responda.</li>
          <li>🔊 <b>Tu voz clonada</b> (opcional) — para que ${TUTOR_NAME} hable con tu voz. Sin esto usa una voz masculina del navegador.</li>
        </ol>
        <button class="btn block" onclick="go('tutor/settings')">⚙️ Configurar ahora</button>
      </div>`;
  },

  settings(view) {
    const k = TutorKeys.get();
    view.innerHTML = `
      <button class="btn ghost" onclick="go('tutor')" style="margin:6px 0 12px">⬅️ Volver</button>
      <h1 class="page">⚙️ Configurar a ${TUTOR_NAME}</h1>
      <p class="lead">Las claves se guardan <b>solo en este navegador</b>. No se envían a nadie más que a Anthropic y ElevenLabs.</p>

      <div class="card-box">
        <b>🧠 1. Clave de Claude (Anthropic)</b>
        <ol class="explain small" style="margin:8px 0">
          <li>Entra a <b>console.anthropic.com</b> y crea tu cuenta.</li>
          <li>En <i>Billing</i> agrega saldo (por ejemplo USD 5) y pon un <b>límite de gasto mensual</b>.</li>
          <li>En <i>API Keys</i> crea una clave y pégala aquí.</li>
        </ol>
        <input class="search" id="anthropicKey" type="password" placeholder="sk-ant-..." autocomplete="off" value="${escapeHtml(k.anthropicKey || "")}">
        <div class="btn-row" style="margin-top:10px"><button class="btn soft" id="testClaude">🧪 Probar Claude</button></div>
        <div class="small" id="claudeResult" style="margin-top:8px"></div>
      </div>

      <div class="card-box">
        <b>🔊 2. Tu voz clonada (ElevenLabs) — opcional</b>
        <ol class="explain small" style="margin:8px 0">
          <li>Entra a <b>elevenlabs.io</b>, crea tu cuenta y elige un plan que incluya <i>Instant Voice Cloning</i>.</li>
          <li>Ve a <i>Voices → Add a new voice → Instant Voice Clone</i>. Graba o sube 1 a 2 minutos de tu voz hablando claro y sin ruido (puede ser en español).</li>
          <li>Copia el <b>Voice ID</b> de tu nueva voz y pégalo aquí.</li>
          <li>En tu perfil, en <i>API Keys</i>, crea una clave con permiso de <i>Text to Speech</i> y pégala aquí.</li>
        </ol>
        <input class="search" id="elevenKey" type="password" placeholder="Clave de ElevenLabs" autocomplete="off" value="${escapeHtml(k.elevenKey || "")}" style="margin-bottom:8px">
        <input class="search" id="voiceId" type="text" placeholder="Voice ID (ej: 21m00Tcm4TlvDq8ikWAM)" autocomplete="off" value="${escapeHtml(k.voiceId || "")}">
        <div class="btn-row" style="margin-top:10px"><button class="btn soft" id="testVoice2">🧪 Probar mi voz</button></div>
        <div class="small" id="voiceResult" style="margin-top:8px"></div>
      </div>

      <button class="btn block" id="saveKeys">💾 Guardar</button>
      <button class="btn ghost block" id="clearKeys" style="margin-top:10px">🗑️ Borrar mis claves de este navegador</button>
      <p class="small muted">💡 Costo aproximado con Claude Opus 5: USD 0,25 a 0,80 por conversación de 20 minutos. La app te muestra el gasto de cada conversación.</p>`;

    const read = () => ({
      anthropicKey: $("#anthropicKey").value.trim(),
      elevenKey: $("#elevenKey").value.trim(),
      voiceId: $("#voiceId").value.trim(),
    });
    $("#saveKeys").onclick = () => { TutorKeys.set(read()); toast("💾 Guardado"); go("tutor"); };
    $("#clearKeys").onclick = () => {
      if (!confirm("¿Borrar tus claves de este navegador?")) return;
      TutorKeys.clear(); TutorVoice.cache.clear(); toast("Claves borradas"); render();
    };
    $("#testClaude").onclick = async () => {
      TutorKeys.set(read());
      const out = $("#claudeResult");
      out.textContent = "⏳ Probando...";
      try {
        const r = await askClaude([{ role: "user", content: "Say hello in one short sentence." }], Store.data.level);
        out.innerHTML = r.stop_reason === "refusal" ? "⚠️ Claude respondió, pero rechazó el mensaje de prueba." : `✅ ¡Funciona! (gasto de la prueba ≈ USD ${costOf(r.usage).toFixed(4)})`;
      } catch (e) { out.innerHTML = friendlyError(e); }
    };
    $("#testVoice2").onclick = async () => {
      TutorKeys.set(read());
      const out = $("#voiceResult");
      if (!TutorVoice.hasClone()) { out.textContent = "Escribe tu clave de ElevenLabs y tu Voice ID."; return; }
      out.textContent = "⏳ Generando audio...";
      try {
        TutorVoice.cache.clear();
        const url = await TutorVoice.elevenAudio("Hi! This is my voice speaking English. Y así sueno en español.", voiceRate());
        out.textContent = "✅ ¡Funciona! Escucha 🔊";
        TutorVoice.playUrl(url, voiceRate() / TutorVoice.elevenSpeed(voiceRate()));
      } catch (e) { out.textContent = "⚠️ " + e.message + " (si dice 'Failed to fetch', revisa tu internet)"; }
    };
  },

  chat(view) {
    const level = Store.data.level; // se fija al empezar para que el caché funcione
    const history = [];
    let spent = 0, busy = false;

    view.innerHTML = `
      <div class="row" style="margin:6px 0">
        <b style="flex:1;font-size:1.1rem">🗣️ ${TUTOR_NAME} <span class="tag level">${level}</span></b>
        <span class="small muted" id="cost" title="Gasto aproximado de esta conversación">≈ USD 0.00</span>
        <button class="icon-btn" id="newChat" title="Nueva conversación">🔄</button>
        <button class="icon-btn" onclick="go('tutor/settings')" title="Configurar">⚙️</button>
      </div>
      <div class="small muted" style="margin-bottom:8px">${TutorVoice.hasClone() ? "🔊 Hablando con tu voz clonada" : "🔊 Voz masculina del navegador (configura tu voz en ⚙️)"}</div>
      <div class="chat" id="tchat"></div>
      <div class="suggestions" id="starters"></div>
      <div class="composer">
        <div class="row" style="gap:8px;margin-bottom:8px">
          <button class="btn mic-lang" id="micEn" title="Hablar en inglés">🎤 🇬🇧 Inglés</button>
          <button class="btn warn mic-lang" id="micEs" title="Hablar en español">🎤 🇪🇸 Español</button>
        </div>
        <form class="row" id="tform">
          <input id="tinput" placeholder="O escribe (inglés o español)..." autocomplete="off">
          <button class="btn" type="submit">➤</button>
        </form>
        <div class="mic-status small" id="tstatus"></div>
      </div>`;

    const chat = $("#tchat"), status = $("#tstatus");
    const scroll = () => window.scrollTo({ top: document.body.scrollHeight, behavior: "smooth" });

    const starters = [
      ["👋 Presentarme", "Hi! I want to practise introducing myself."],
      ["💼 Mi trabajo", "Let's talk about my job."],
      ["☕ Pedir un café", "Can we practise ordering a coffee in a café?"],
      ["🛒 Supermercado", "Let's practise shopping at the supermarket."],
      ["☀️ Mi día", "Ask me about my day."],
      ["🇪🇸 Empezar en español", "Hola, quiero practicar inglés pero me da un poco de vergüenza. ¿Me ayudas?"],
    ];
    $("#starters").innerHTML = starters.map(([l]) => `<button class="chip">${l}</button>`).join("");
    $$("#starters .chip").forEach((c, i) => (c.onclick = () => send(starters[i][1])));

    function addMe(text) {
      chat.appendChild(html(`<div class="bubble me">${escapeHtml(text)}</div>`));
      scroll();
    }
    function addTutor(data) {
      const segs = data.say || [];
      const b = html(`
        <div class="bubble bot" style="max-width:92%">
          ${segs.map((s) => s.lang === "es"
            ? `<div class="es" style="font-style:italic">🇪🇸 ${escapeHtml(s.text)}</div>`
            : `<div>${escapeHtml(s.text)}</div>`).join("")}
          <div class="row" style="gap:6px;margin-top:8px">
            <button class="icon-btn" data-replay>🔊</button><button class="icon-btn" data-slow>🐢</button>
          </div>
          ${data.chunks && data.chunks.length ? `
            <div class="small" style="margin-top:10px"><b>🧩 Palabra por palabra</b></div>
            ${data.chunks.map((c) => `<div class="issue row" style="margin:6px 0 0"><span style="flex:1"><b>${escapeHtml(c.en)}</b> = ${escapeHtml(c.es)}</span>${sayBtn(c.en)}</div>`).join("")}` : ""}
          ${data.corrections && data.corrections.length ? data.corrections.map((c) => `
            <div class="issue" style="margin-top:8px"><span class="wrong">❌ ${escapeHtml(c.wrong)}</span> → <span class="right">✅ ${escapeHtml(c.right)}</span> ${sayBtn(c.right)}
            <div class="why">💡 ${escapeHtml(c.why_es)}</div></div>`).join("") : ""}
        </div>`);
      $("[data-replay]", b).onclick = () => TutorVoice.speakSegments(segs);
      $("[data-slow]", b).onclick = () => TutorVoice.speakSegments(segs, { slow: true });
      chat.appendChild(b);
      if (data.repeat) chat.appendChild(repeatCard(data.repeat));
      scroll();
      TutorVoice.speakSegments(segs);
    }

    // Tarjeta "🔁 Repite": escuchas, lo dices, y la app compara palabra por palabra
    function repeatCard(phrase) {
      const card = html(`
        <div class="card-box" style="border:2px solid var(--accent);margin:0">
          <div class="small muted">🔁 Ahora repite tú:</div>
          <div class="big" style="font-size:1.2rem;margin:6px 0">${escapeHtml(phrase)}</div>
          <div class="btn-row">${sayBtn(phrase, "🔊")}${sayBtn(phrase, "🐢", 'data-slow="1"')}<button class="btn" data-rep style="flex:2">🎤 Repetir</button></div>
          <div class="rep-result small" style="margin-top:8px"></div>
        </div>`);
      // Con tu voz clonada, el 🔊 de esta tarjeta también usa tu voz
      if (TutorVoice.hasClone()) $$("[data-say]", card).forEach((b) => {
        const slow = b.dataset.slow === "1";
        b.removeAttribute("data-say");
        b.onclick = () => TutorVoice.speakSegments([{ lang: "en", text: phrase }], { slow });
      });
      $("[data-rep]", card).onclick = async () => {
        const out = $(".rep-result", card);
        out.textContent = "🔴 Escuchando... di la frase";
        try {
          const said = await listenOnce("en-US", (t) => (out.textContent = `“${t}”`));
          if (!said) { out.textContent = "🤔 No te escuché. Intenta de nuevo."; return; }
          const d = wordDiff(phrase, said);
          const pct = Math.round(d.score * 100);
          Store.data.stats.speakTotal++; if (pct >= 85) Store.data.stats.speakPerfect++;
          markDay(); Store.save();
          out.innerHTML = `<div>${d.html}</div><div>${pct >= 85 ? "🔥" : "💪"} ${pct}% — dijiste: “${escapeHtml(said)}”</div>`;
          send(`[Repetición] Frase: "${phrase}" · Lo que dije: "${said}" · Precisión: ${pct}%`, { hidden: true });
        } catch (e) { out.innerHTML = e.message; }
      };
      return card;
    }

    async function send(text, { hidden = false } = {}) {
      if (busy || !text.trim()) return;
      busy = true;
      $("#starters").innerHTML = "";
      if (!hidden) addMe(text);
      history.push({ role: "user", content: text });
      const thinking = html(`<div class="bubble bot muted">💭 ${TUTOR_NAME} está pensando...</div>`);
      chat.appendChild(thinking); scroll();
      markDay();
      try {
        const r = await askClaude(history, level);
        thinking.remove();
        spent += costOf(r.usage);
        $("#cost").textContent = `≈ USD ${spent.toFixed(2)}`;
        if (r.stop_reason === "refusal") {
          history.pop();
          chat.appendChild(html(`<div class="bubble tip">⚠️ ${TUTOR_NAME} no puede responder eso. Probemos con otro tema.</div>`));
          return;
        }
        history.push({ role: "assistant", content: r.content }); // se guarda completo (incluye el razonamiento)
        const textBlock = r.content.find((b) => b.type === "text");
        let data;
        try { data = JSON.parse(textBlock.text); }
        catch (e) { data = { say: [{ lang: "en", text: textBlock ? textBlock.text : "Sorry, can you say that again?" }], chunks: [], corrections: [], repeat: "" }; }
        addTutor(data);
      } catch (e) {
        thinking.remove();
        history.pop();
        chat.appendChild(html(`<div class="bubble tip">${friendlyError(e)}</div>`));
        scroll();
      } finally { busy = false; }
    }

    async function mic(lang, btn) {
      if (activeRec) { activeRec.stop(); return; }
      btn.classList.add("on");
      status.textContent = lang === "es-MX" ? "🔴 Escuchando en español..." : "🔴 Listening in English...";
      try {
        const said = await listenOnce(lang, (t) => ($("#tinput").value = t));
        $("#tinput").value = "";
        status.textContent = "";
        if (said) send(said); else status.textContent = "🤔 No te escuché. Toca el micrófono y habla.";
      } catch (e) { status.innerHTML = e.message; }
      finally { btn.classList.remove("on"); }
    }
    $("#micEn").onclick = () => mic("en-US", $("#micEn"));
    $("#micEs").onclick = () => mic("es-MX", $("#micEs"));
    $("#tform").onsubmit = (e) => { e.preventDefault(); const v = $("#tinput").value; $("#tinput").value = ""; send(v); };
    $("#newChat").onclick = () => { if (history.length && !confirm("¿Empezar una conversación nueva?")) return; render(); };

    // Saludo inicial (gratis, sin llamar a la IA)
    addTutor({
      say: [
        { lang: "en", text: `Hi! I'm ${TUTOR_NAME}. How are you today?` },
        { lang: "es", text: "Si no sabes cómo decir algo, dímelo en español y te ayudo." },
      ],
      chunks: [], corrections: [], repeat: "",
    });

    App.cleanup = () => { TutorVoice.stop(); };
  },
};
