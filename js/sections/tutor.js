// =====================================================================
// 🗣️ HABLAR CON ALEXIS — conversación libre con IA, en inglés y en tu idioma (español o árabe)
// ---------------------------------------------------------------------
//  🧠 Cerebro: Claude Opus 5 (API de Anthropic, de pago por uso)
//  🔊 Voz:     tu voz clonada en ElevenLabs (de pago). Si no está
//              configurada, usa las voces gratis del navegador.
//  🎤 Oído:    reconocimiento de voz del navegador (gratis), con un
//              botón para inglés y otro para tu idioma.
// Las claves se guardan SOLO en este navegador (nunca en el código).
// =====================================================================
const TUTOR_NAME = "Alexis";
const CLAUDE_MODEL = "claude-opus-5";
const SDK_URL = "https://cdn.jsdelivr.net/npm/@anthropic-ai/sdk@0.128.0/+esm";
const ELEVEN_MODEL = "eleven_multilingual_v2"; // habla español, árabe e inglés con la misma voz
// Precios de Claude Opus 5 (USD por millón de tokens) para mostrar el gasto aproximado
const PRICE = { input: 5, output: 25, cacheWrite: 6.25, cacheRead: 0.5 };
const N = NATIVE.code; // "es" o "ar": idioma de las explicaciones

// ---------- Claves (solo en este navegador) ----------
const TutorKeys = {
  key: "ale-tutor-settings",
  get() { try { return JSON.parse(localStorage.getItem(this.key)) || {}; } catch (e) { return {}; } },
  set(v) { try { localStorage.setItem(this.key, JSON.stringify(v)); } catch (e) {} },
  clear() { try { localStorage.removeItem(this.key); } catch (e) {} },
};

// ---------- Cómo debe comportarse Alexis ----------
function tutorSystemPrompt(level) {
  const L = NATIVE.ai; // "Latin American Spanish" o "Modern Standard Arabic"
  const learner = isAr ? "an Arabic-speaking learner" : "a Spanish-speaking learner from Latin America";
  const masc = isAr
    ? `When you refer to yourself in Arabic, use masculine forms (for example "أنا سعيد", "أنا صديقك").`
    : `When you refer to yourself in Spanish, use masculine forms (for example "estoy contento", "soy tu compañero").`;
  const chunkEx = isAr ? `"I work" = "أنا أعمل", "at a café" = "في مقهى"` : `"I work" = "yo trabajo", "at a café" = "en un café"`;
  return `You are ${TUTOR_NAME}, a man: a warm, upbeat and patient English conversation partner. ${masc} You are an English conversation partner for ${learner} who lives in Australia. The learner's native language is ${L}. The learner's English level is ${level} (CEFR). The goal is everyday spoken English: work, cafés, shopping, transport, friends, plans, daily life in Australia.

How to talk:
- Keep the conversation going in English. Short turns: 1 to 3 short sentences, then ask the learner a question.
- Match the learner's level. For A1/A2 use very simple words and short sentences.
- Sound like a friendly real person, not a textbook. Occasionally use common Australian expressions (arvo, heaps, no worries, reckon) and explain them briefly in ${L}.

When the learner speaks ${L}, says they don't know, or asks how to say something:
1. Explain briefly in ${L} what it means or how the sentence is built.
2. Give the natural English sentence.
3. Break it into small chunks with their meaning in ${L} in "chunks" (for example ${chunkEx}).
4. Put the full English sentence in "repeat" so the learner practises saying it.
Then continue the conversation.

When the learner makes a mistake in English:
- Keep the conversation natural. Add at most 2 items to "corrections" with a very short explanation in ${L} (field "why_es").
- Sometimes put the corrected sentence in "repeat" so they say it correctly.

Messages that start with "[REPEAT]" report how the learner repeated a sentence and an accuracy percentage from speech recognition. React briefly: celebrate if 85% or more; otherwise encourage them, mention the words that were missed, and you may ask them to try once more. Then continue.

Output rules:
- "say" is what you say out loud, as an ordered list of segments. Each segment must be entirely in English ("en") or entirely in ${L} ("${N}"); never mix languages inside one segment, because each segment is read aloud by a voice in that language.
- Keep the ${L} parts short and simple. Never use emojis, markdown or symbols in "say" (it is read aloud).
- Use empty lists and an empty "repeat" when they do not apply.

The app has already greeted the learner for you with: "Hi! I'm ${TUTOR_NAME}. How are you today?" and, in ${L}, told them they can ask you in ${L} whenever they don't know how to say something.`;
}

const TUTOR_SCHEMA = {
  type: "object",
  properties: {
    say: {
      type: "array",
      items: {
        type: "object",
        properties: { lang: { type: "string", enum: ["en", N] }, text: { type: "string" } },
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
  if (!A) return tx("📶 No pude cargar la conexión con Claude. ¿Tienes internet?", "📶 لم أستطع الاتصال بـ Claude. هل لديك إنترنت؟");
  if (err instanceof A.AuthenticationError) return tx("🔑 La clave de Claude no es válida. Revísala en ⚙️ Configuración.", "🔑 مفتاح Claude غير صالح. راجعه في ⚙️ الإعدادات.");
  if (err instanceof A.PermissionDeniedError) return tx("🔒 Tu clave no tiene permiso para usar este modelo.", "🔒 مفتاحك لا يملك صلاحية استخدام هذا النموذج.");
  if (err instanceof A.RateLimitError) return tx("⏳ Demasiadas solicitudes o sin saldo. Espera un momento o revisa tu saldo en console.anthropic.com.", "⏳ طلبات كثيرة أو لا يوجد رصيد. انتظر قليلًا أو راجع رصيدك في console.anthropic.com.");
  if (err instanceof A.BadRequestError) return tx("⚠️ Claude no aceptó la solicitud: ", "⚠️ لم يقبل Claude الطلب: ") + err.message;
  if (err instanceof A.APIConnectionError) return tx("📶 Sin conexión con Claude. Revisa tu internet.", "📶 لا يوجد اتصال بـ Claude. تحقّق من الإنترنت.");
  if (err instanceof A.APIError) return tx(`⚠️ Error de Claude (${err.status}): `, `⚠️ خطأ من Claude (${err.status}): `) + err.message;
  return "⚠️ " + (err && err.message ? err.message : tx("Algo salió mal", "حدث خطأ ما"));
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
      const msg = res.status === 401 ? tx("clave de ElevenLabs inválida", "مفتاح ElevenLabs غير صالح") : res.status === 404 ? tx("Voice ID no encontrado", "لم يُعثر على Voice ID") : `error ${res.status}`;
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
      const native = lang !== "en";
      const v = native ? Voice.bestNative({ male: true }) : Voice.best("en-US", { male: true }); // Alexis es hombre
      // Frase por frase, con una pequeña pausa entre oraciones
      const parts = splitSentences(text);
      parts.forEach((part, n) => {
        const u = new SpeechSynthesisUtterance(part);
        u.lang = v ? v.lang : native ? NATIVE.speech : "en-US";
        if (v) u.voice = v;
        // El inglés va a la velocidad que elegiste; tu idioma, a velocidad normal
        u.rate = native ? (slow ? 0.85 : 1) : voiceRate(slow);
        if (n === parts.length - 1) u.onend = u.onerror = () => resolve();
        speechSynthesis.speak(u);
      });
      if (!parts.length) resolve();
    });
  },
  // Lee los segmentos en orden (inglés con voz en inglés, tu idioma con voz en tu idioma)
  async speakSegments(segments, { slow = false } = {}) {
    this.stop();
    this.stopped = false;
    const useClone = this.hasClone();
    const rateFor = (s) => (s.lang !== "en" ? (slow ? 0.85 : 1) : voiceRate(slow));
    // Pedimos todos los audios a la vez para que no haya pausas entre segmentos
    const urls = useClone ? segments.map((s) => this.elevenAudio(s.text, rateFor(s)).catch((e) => e)) : [];
    for (let i = 0; i < segments.length; i++) {
      if (this.stopped) return;
      const s = segments[i];
      if (useClone) {
        const url = await urls[i];
        if (url instanceof Error) {
          toast(tx(`🔊 Tu voz no funcionó (${url.message}). Uso la voz del navegador.`, `🔊 صوتك لم يعمل (${url.message}). سأستخدم صوت المتصفح.`));
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
    if (!SpeechRec) return reject(new Error(tx("Tu navegador no reconoce voz. Usa Chrome o Edge, o escribe.", "متصفحك لا يتعرّف على الصوت. استخدم Chrome أو Edge، أو اكتب.")));
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
      <h1 class="page">🗣️ ${tx(`Hablar con ${TUTOR_NAME}`, `تحدّث مع ${TUTOR_NAME}`)}</h1>
      <p class="lead">${tx("Conversa libremente en inglés. Si no sabes algo, pregúntale en español: te lo explica, te lo dice en inglés y te ayuda a repetirlo.", "تحدّث بحرّية بالإنجليزية. إذا لم تعرف شيئًا، اسأله بالعربية: سيشرحه لك، ويقوله بالإنجليزية، ويساعدك على تكراره.")}</p>
      <div class="card-box">
        <b>${tx("Para empezar necesitas configurar:", "لتبدأ تحتاج إلى إعداد:")}</b>
        <ol class="explain" style="margin-top:8px">
          <li>${tx(`🧠 <b>Clave de Claude</b> (obligatoria) — para que ${TUTOR_NAME} entienda y responda.`, `🧠 <b>مفتاح Claude</b> (إلزامي) — ليفهم ${TUTOR_NAME} ويردّ.`)}</li>
          <li>${tx(`🔊 <b>Tu voz clonada</b> (opcional) — para que ${TUTOR_NAME} hable con tu voz. Sin esto usa una voz masculina del navegador.`, `🔊 <b>صوتك المستنسخ</b> (اختياري) — ليتكلّم ${TUTOR_NAME} بصوتك. بدونه يستخدم صوتًا رجاليًا من المتصفح.`)}</li>
        </ol>
        <button class="btn block" onclick="go('tutor/settings')">⚙️ ${tx("Configurar ahora", "الإعداد الآن")}</button>
      </div>`;
  },

  settings(view) {
    const k = TutorKeys.get();
    view.innerHTML = `
      <button class="btn ghost" onclick="go('tutor')" style="margin:6px 0 12px">${tx("⬅️ Volver", "➡️ رجوع")}</button>
      <h1 class="page">⚙️ ${tx(`Configurar a ${TUTOR_NAME}`, `إعداد ${TUTOR_NAME}`)}</h1>
      <p class="lead">${tx("Las claves se guardan <b>solo en este navegador</b>. No se envían a nadie más que a Anthropic y ElevenLabs.", "تُحفظ المفاتيح <b>في هذا المتصفح فقط</b>. لا تُرسل لأحد سوى Anthropic وElevenLabs.")}</p>

      <div class="card-box">
        <b>🧠 ${tx("1. Clave de Claude (Anthropic)", "1. مفتاح Claude (Anthropic)")}</b>
        <ol class="explain small" style="margin:8px 0">
          <li>${tx("Entra a <b>console.anthropic.com</b> y crea tu cuenta.", "ادخل إلى <b>console.anthropic.com</b> وأنشئ حسابك.")}</li>
          <li>${tx("En <i>Billing</i> agrega saldo (por ejemplo USD 5) y pon un <b>límite de gasto mensual</b>.", "في <i>Billing</i> أضف رصيدًا (مثلًا 5 دولارات) وضع <b>حدًّا شهريًا للإنفاق</b>.")}</li>
          <li>${tx("En <i>API Keys</i> crea una clave y pégala aquí.", "في <i>API Keys</i> أنشئ مفتاحًا والصقه هنا.")}</li>
        </ol>
        <input class="search" id="anthropicKey" type="password" dir="ltr" placeholder="sk-ant-..." autocomplete="off" value="${escapeHtml(k.anthropicKey || "")}">
        <div class="btn-row" style="margin-top:10px"><button class="btn soft" id="testClaude">🧪 ${tx("Probar Claude", "اختبر Claude")}</button></div>
        <div class="small" id="claudeResult" style="margin-top:8px"></div>
      </div>

      <div class="card-box">
        <b>🔊 ${tx("2. Tu voz clonada (ElevenLabs) — opcional", "2. صوتك المستنسخ (ElevenLabs) — اختياري")}</b>
        <ol class="explain small" style="margin:8px 0">
          <li>${tx("Entra a <b>elevenlabs.io</b>, crea tu cuenta y elige un plan que incluya <i>Instant Voice Cloning</i>.", "ادخل إلى <b>elevenlabs.io</b>، أنشئ حسابك واختر خطة تتضمّن <i>Instant Voice Cloning</i>.")}</li>
          <li>${tx("Ve a <i>Voices → Add a new voice → Instant Voice Clone</i>. Graba o sube 1 a 2 minutos de tu voz hablando claro y sin ruido (puede ser en español).", "اذهب إلى <i>Voices → Add a new voice → Instant Voice Clone</i>. سجّل أو ارفع دقيقة إلى دقيقتين من صوتك بوضوح وبدون ضجيج (يمكن أن يكون بالعربية).")}</li>
          <li>${tx("Copia el <b>Voice ID</b> de tu nueva voz y pégalo aquí.", "انسخ <b>Voice ID</b> لصوتك الجديد والصقه هنا.")}</li>
          <li>${tx("En tu perfil, en <i>API Keys</i>, crea una clave con permiso de <i>Text to Speech</i> y pégala aquí.", "في ملفك الشخصي، في <i>API Keys</i>، أنشئ مفتاحًا بصلاحية <i>Text to Speech</i> والصقه هنا.")}</li>
        </ol>
        <input class="search" id="elevenKey" type="password" dir="ltr" placeholder="${tx("Clave de ElevenLabs", "مفتاح ElevenLabs")}" autocomplete="off" value="${escapeHtml(k.elevenKey || "")}" style="margin-bottom:8px">
        <input class="search" id="voiceId" type="text" dir="ltr" placeholder="Voice ID (21m00Tcm4TlvDq8ikWAM)" autocomplete="off" value="${escapeHtml(k.voiceId || "")}">
        <div class="btn-row" style="margin-top:10px"><button class="btn soft" id="testVoice2">🧪 ${tx("Probar mi voz", "اختبر صوتي")}</button></div>
        <div class="small" id="voiceResult" style="margin-top:8px"></div>
      </div>

      <button class="btn block" id="saveKeys">💾 ${tx("Guardar", "حفظ")}</button>
      <button class="btn ghost block" id="clearKeys" style="margin-top:10px">🗑️ ${tx("Borrar mis claves de este navegador", "امسح مفاتيحي من هذا المتصفح")}</button>
      <p class="small muted">${tx("💡 Costo aproximado con Claude Opus 5: USD 0,25 a 0,80 por conversación de 20 minutos. La app te muestra el gasto de cada conversación.", "💡 التكلفة التقريبية مع Claude Opus 5: من 0.25 إلى 0.80 دولار لكل محادثة مدتها 20 دقيقة. يعرض التطبيق تكلفة كل محادثة.")}</p>`;

    const read = () => ({
      anthropicKey: $("#anthropicKey").value.trim(),
      elevenKey: $("#elevenKey").value.trim(),
      voiceId: $("#voiceId").value.trim(),
    });
    $("#saveKeys").onclick = () => { TutorKeys.set(read()); toast(tx("💾 Guardado", "💾 تم الحفظ")); go("tutor"); };
    $("#clearKeys").onclick = () => {
      if (!confirm(tx("¿Borrar tus claves de este navegador?", "هل تريد مسح مفاتيحك من هذا المتصفح؟"))) return;
      TutorKeys.clear(); TutorVoice.cache.clear(); toast(tx("Claves borradas", "تم مسح المفاتيح")); render();
    };
    $("#testClaude").onclick = async () => {
      TutorKeys.set(read());
      const out = $("#claudeResult");
      out.textContent = tx("⏳ Probando...", "⏳ جارٍ الاختبار...");
      try {
        const r = await askClaude([{ role: "user", content: "Say hello in one short sentence." }], Store.data.level);
        out.innerHTML = r.stop_reason === "refusal" ? tx("⚠️ Claude respondió, pero rechazó el mensaje de prueba.", "⚠️ ردّ Claude لكنه رفض رسالة الاختبار.") : tx(`✅ ¡Funciona! (gasto de la prueba ≈ USD ${costOf(r.usage).toFixed(4)})`, `✅ يعمل! (تكلفة الاختبار ≈ ${costOf(r.usage).toFixed(4)} دولار)`);
      } catch (e) { out.innerHTML = friendlyError(e); }
    };
    $("#testVoice2").onclick = async () => {
      TutorKeys.set(read());
      const out = $("#voiceResult");
      if (!TutorVoice.hasClone()) { out.textContent = tx("Escribe tu clave de ElevenLabs y tu Voice ID.", "اكتب مفتاح ElevenLabs وVoice ID."); return; }
      out.textContent = tx("⏳ Generando audio...", "⏳ جارٍ إنشاء الصوت...");
      try {
        TutorVoice.cache.clear();
        const sample = tx("Hi! This is my voice speaking English. Y así sueno en español.", "Hi! This is my voice speaking English. وهكذا يبدو صوتي بالعربية.");
        const url = await TutorVoice.elevenAudio(sample, voiceRate());
        out.textContent = tx("✅ ¡Funciona! Escucha 🔊", "✅ يعمل! استمع 🔊");
        TutorVoice.playUrl(url, voiceRate() / TutorVoice.elevenSpeed(voiceRate()));
      } catch (e) { out.textContent = "⚠️ " + e.message + tx(" (si dice 'Failed to fetch', revisa tu internet)", " (إذا ظهر 'Failed to fetch' تحقّق من الإنترنت)"); }
    };
  },

  chat(view) {
    const level = Store.data.level; // se fija al empezar para que el caché funcione
    const history = [];
    let spent = 0, busy = false;

    view.innerHTML = `
      <div class="row" style="margin:6px 0">
        <b style="flex:1;font-size:1.1rem">🗣️ ${TUTOR_NAME} <span class="tag level">${level}</span></b>
        <span class="small muted" id="cost" dir="ltr" title="${tx("Gasto aproximado de esta conversación", "التكلفة التقريبية لهذه المحادثة")}">≈ USD 0.00</span>
        <button class="icon-btn" id="newChat" title="${tx("Nueva conversación", "محادثة جديدة")}">🔄</button>
        <button class="icon-btn" onclick="go('tutor/settings')" title="${tx("Configurar", "الإعدادات")}">⚙️</button>
      </div>
      <div class="small muted" style="margin-bottom:8px">${TutorVoice.hasClone() ? tx("🔊 Hablando con tu voz clonada", "🔊 يتكلّم بصوتك المستنسخ") : tx("🔊 Voz masculina del navegador (configura tu voz en ⚙️)", "🔊 صوت رجالي من المتصفح (اضبط صوتك في ⚙️)")}</div>
      <div class="chat" id="tchat"></div>
      <div class="suggestions" id="starters"></div>
      <div class="composer">
        <div class="row" style="gap:8px;margin-bottom:8px">
          <button class="btn mic-lang" id="micEn" title="${tx("Hablar en inglés", "تكلّم بالإنجليزية")}">🎤 🇬🇧 ${tx("Inglés", "إنجليزي")}</button>
          <button class="btn warn mic-lang" id="micEs" title="${tx("Hablar en español", "تكلّم بالعربية")}">🎤 ${NATIVE.flag} ${tx("Español", "عربي")}</button>
        </div>
        <form class="row" id="tform">
          <input id="tinput" dir="auto" placeholder="${tx("O escribe (inglés o español)...", "أو اكتب (بالإنجليزية أو بالعربية)...")}" autocomplete="off">
          <button class="btn" type="submit">➤</button>
        </form>
        <div class="mic-status small" id="tstatus"></div>
      </div>`;

    const chat = $("#tchat"), status = $("#tstatus");
    const scroll = () => window.scrollTo({ top: document.body.scrollHeight, behavior: "smooth" });

    const starters = [
      [tx("👋 Presentarme", "👋 أقدّم نفسي"), "Hi! I want to practise introducing myself."],
      [tx("💼 Mi trabajo", "💼 عملي"), "Let's talk about my job."],
      [tx("☕ Pedir un café", "☕ طلب قهوة"), "Can we practise ordering a coffee in a café?"],
      [tx("🛒 Supermercado", "🛒 السوبرماركت"), "Let's practise shopping at the supermarket."],
      [tx("☀️ Mi día", "☀️ يومي"), "Ask me about my day."],
      [tx("🇪🇸 Empezar en español", "ع ابدأ بالعربية"), tx("Hola, quiero practicar inglés pero me da un poco de vergüenza. ¿Me ayudas?", "مرحبًا، أريد أن أتدرّب على الإنجليزية لكنني أشعر ببعض الخجل. هل تساعدني؟")],
    ];
    $("#starters").innerHTML = starters.map(([l]) => `<button class="chip">${l}</button>`).join("");
    $$("#starters .chip").forEach((c, i) => (c.onclick = () => send(starters[i][1])));

    function addMe(text) {
      chat.appendChild(html(`<div class="bubble me" dir="auto">${escapeHtml(text)}</div>`));
      scroll();
    }
    function addTutor(data) {
      const segs = data.say || [];
      const b = html(`
        <div class="bubble bot" style="max-width:92%">
          ${segs.map((s) => s.lang !== "en"
            ? `<div class="es" style="font-style:italic">${NATIVE.flag} ${escapeHtml(s.text)}</div>`
            : `<div dir="ltr">${escapeHtml(s.text)}</div>`).join("")}
          <div class="row" style="gap:6px;margin-top:8px">
            <button class="icon-btn" data-replay>🔊</button><button class="icon-btn" data-slow>🐢</button>
          </div>
          ${data.chunks && data.chunks.length ? `
            <div class="small" style="margin-top:10px"><b>🧩 ${tx("Palabra por palabra", "كلمة بكلمة")}</b></div>
            ${data.chunks.map((c) => `<div class="issue row" style="margin:6px 0 0"><span style="flex:1"><b dir="ltr">${escapeHtml(c.en)}</b> = ${escapeHtml(c.es)}</span>${sayBtn(c.en)}</div>`).join("")}` : ""}
          ${data.corrections && data.corrections.length ? data.corrections.map((c) => `
            <div class="issue" style="margin-top:8px"><span dir="ltr"><span class="wrong">❌ ${escapeHtml(c.wrong)}</span> → <span class="right">✅ ${escapeHtml(c.right)}</span></span> ${sayBtn(c.right)}
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
          <div class="small muted">🔁 ${tx("Ahora repite tú:", "الآن كرّر أنت:")}</div>
          <div class="big" dir="ltr" style="font-size:1.2rem;margin:6px 0">${escapeHtml(phrase)}</div>
          <div class="btn-row">${sayBtn(phrase, "🔊")}${sayBtn(phrase, "🐢", 'data-slow="1"')}<button class="btn" data-rep style="flex:2">🎤 ${tx("Repetir", "كرّر")}</button></div>
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
        out.textContent = tx("🔴 Escuchando... di la frase", "🔴 أستمع... قل العبارة");
        try {
          const said = await listenOnce("en-US", (t) => (out.textContent = `“${t}”`));
          if (!said) { out.textContent = tx("🤔 No te escuché. Intenta de nuevo.", "🤔 لم أسمعك. حاول مرة أخرى."); return; }
          const d = wordDiff(phrase, said);
          const pct = Math.round(d.score * 100);
          Store.data.stats.speakTotal++; if (pct >= 85) Store.data.stats.speakPerfect++;
          markDay(); Store.save();
          out.innerHTML = `<div dir="ltr">${d.html}</div><div>${pct >= 85 ? "🔥" : "💪"} ${pct}% — ${tx("dijiste", "قلت")}: <span dir="ltr">“${escapeHtml(said)}”</span></div>`;
          send(`[REPEAT] Sentence: "${phrase}" · What I said: "${said}" · Accuracy: ${pct}%`, { hidden: true });
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
      const thinking = html(`<div class="bubble bot muted">💭 ${tx(`${TUTOR_NAME} está pensando...`, `${TUTOR_NAME} يفكّر...`)}</div>`);
      chat.appendChild(thinking); scroll();
      markDay();
      try {
        const r = await askClaude(history, level);
        thinking.remove();
        spent += costOf(r.usage);
        $("#cost").textContent = `≈ USD ${spent.toFixed(2)}`;
        if (r.stop_reason === "refusal") {
          history.pop();
          chat.appendChild(html(`<div class="bubble tip">${tx(`⚠️ ${TUTOR_NAME} no puede responder eso. Probemos con otro tema.`, `⚠️ لا يستطيع ${TUTOR_NAME} الردّ على ذلك. لنجرّب موضوعًا آخر.`)}</div>`));
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
      status.textContent = lang === "en-US" ? "🔴 Listening in English..." : tx("🔴 Escuchando en español...", "🔴 أستمع بالعربية...");
      try {
        const said = await listenOnce(lang, (t) => ($("#tinput").value = t));
        $("#tinput").value = "";
        status.textContent = "";
        if (said) send(said); else status.textContent = tx("🤔 No te escuché. Toca el micrófono y habla.", "🤔 لم أسمعك. اضغط على الميكروفون وتكلّم.");
      } catch (e) { status.innerHTML = e.message; }
      finally { btn.classList.remove("on"); }
    }
    $("#micEn").onclick = () => mic("en-US", $("#micEn"));
    $("#micEs").onclick = () => mic(NATIVE.speech, $("#micEs"));
    $("#tform").onsubmit = (e) => { e.preventDefault(); const v = $("#tinput").value; $("#tinput").value = ""; send(v); };
    $("#newChat").onclick = () => { if (history.length && !confirm(tx("¿Empezar una conversación nueva?", "هل تريد بدء محادثة جديدة؟"))) return; render(); };

    // Saludo inicial (gratis, sin llamar a la IA)
    addTutor({
      say: [
        { lang: "en", text: `Hi! I'm ${TUTOR_NAME}. How are you today?` },
        { lang: N, text: tx("Si no sabes cómo decir algo, dímelo en español y te ayudo.", "إذا لم تعرف كيف تقول شيئًا، قله لي بالعربية وسأساعدك.") },
      ],
      chunks: [], corrections: [], repeat: "",
    });

    App.cleanup = () => { TutorVoice.stop(); };
  },
};
