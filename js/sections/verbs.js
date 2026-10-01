// 📚 VERBOS — buscar (español/árabe o inglés) → entender → escuchar → practicar
// Terminaciones de verbos en español (comí, trabajé, hablando, estudiamos...)
const SPANISH_ENDING = /^(o|as|a|amos|an|e|es|en|emos|imos|i|aste|aron|io|iste|ieron|aba|abas|abamos|aban|ia|ias|iamos|ian|ando|iendo|ado|ido|ada|ida|are|aras|ara|aremos|aran|ere|eras|era|eremos|eran|ire|iras|ira|iremos|iran|aria|eria|iria)(me|te|se|nos|lo|la)?$/;
const FORM_LABELS = {
  third: tx("🟢 presente (he/she)", "🟢 المضارع (he/she)"), past: tx("🔴 pasado", "🔴 الماضي"),
  pp: tx("🟣 participio", "🟣 التصريف الثالث"), ing: tx("🟠 gerundio", "🟠 صيغة -ing"),
};

// Busca en el idioma de ayuda o en inglés, aunque escribas una forma conjugada (comí, fui, went, eaten...)
function searchVerbs(query) {
  const q = normalize(query).replace(/^to /, "");
  const results = [];
  VERBS.forEach((v) => {
    const esWords = v.es.split(" / ").map((s) => normalize(s.replace(/\(.*?\)/g, "")));
    let score = null, note = "";
    const englishForms = [["third", v.third], ["pp", v.participle], ["ing", v.ing], ...v.past.split(" / ").map((p) => ["past", p])];
    const formHit = englishForms.find(([, f]) => f === q && f !== v.base);
    const spanishHit = !isAr && SPANISH_FORMS[q] && (" " + SPANISH_FORMS[q] + " ").includes(" " + v.base + " ");
    const stemHit = !isAr && q.length >= 3 && esWords.find((w) => {
      const inf = w.split(" ")[0];
      const stem = inf.replace(/(ar|er|ir)(se)?$/, "");
      return stem.length >= 2 && stem !== inf && q.startsWith(stem) && q !== inf && SPANISH_ENDING.test(q.slice(stem.length));
    });
    const q2 = escapeHtml(query.trim());
    // Árabe: «أذهب» (yo voy), «تذهب», «نذهب» → misma raíz que «يذهب»
    const arStem = (w) => w.replace(/^(ي|ت|ن|ا)/, "");
    const arHit = isAr && q.length >= 3 && esWords.some((w) => w.split(" ").some((x) => x.length >= 3 && arStem(x) === arStem(q)));

    if (esWords[0] === q || v.base === q) score = 0;
    else if (esWords.includes(q)) score = 0.5;
    else if (formHit) { score = 1; note = tx(`“${q2}” es el ${FORM_LABELS[formHit[0]]} de <b>${v.base}</b>`, `“${q2}” هو ${FORM_LABELS[formHit[0]]} من <b>${v.base}</b>`); }
    else if (arHit) { score = 1; note = `“${q2}” ← <b>${escapeHtml(esMain(v))}</b>`; }
    else if (spanishHit) { score = 1; note = `“${q2}” es una forma de <b>${escapeHtml(esMain(v))}</b>`; }
    else if (esWords.some((w) => w.startsWith(q) || w.split(" ").some((x) => x.startsWith(q))) || v.base.startsWith(q)) score = 2;
    else if (stemHit) { score = 3; note = `“${q2}” parece una forma de <b>${escapeHtml(stemHit.split(" ")[0])}</b>`; }
    else if (q.length >= (isAr ? 2 : 3) && (normalize(v.es).includes(q) || v.base.includes(q))) score = 4;

    if (score !== null) results.push({ v, score, note });
  });
  return results.sort((a, b) => a.score - b.score || a.v.es.localeCompare(b.v.es, NATIVE.code));
}

function formRow(cls, name, value, sayText, memo = false) {
  return `
    <div class="form-row ${cls} ${memo ? "memo" : ""}">
      <span class="fname">${name}</span>
      <span class="fval" dir="ltr">${value}</span>
      ${memo ? `<span class="memo-tag">⭐ ${tx("MEMORIZA", "احفظه")}</span>` : ""}
      ${sayBtn(sayText)}
    </div>`;
}

function verbFormsHtml(v) {
  const present = v.base === "be"
    ? "I am <small>/</small> You are <small>/</small> He is"
    : `I ${v.base} <small>/</small> You ${v.base} <small>/</small> He <b>${v.third}</b>`;
  const presentSay = v.base === "be" ? "I am. You are. He is." : `I ${v.base}. You ${v.base}. He ${v.third}.`;
  return `
    <div class="forms">
      ${formRow("c-pres", TENSES.pres.label, present, presentSay)}
      ${formRow("c-past", TENSES.past.label, escapeHtml(v.past), v.past.replace(" / ", ", "), v.irregular)}
      ${formRow("c-pp", TENSES.pp.label, `${escapeHtml(v.participle)} <small>(have ${escapeHtml(v.participle)})</small>`, v.participle, v.irregular)}
      ${formRow("c-fut", TENSES.fut.label, `will ${v.base}`, `will ${v.base}`)}
      ${formRow("c-ger", TENSES.ger.label, v.ing, v.ing)}
    </div>`;
}

function verbTagsHtml(v) {
  const s = verbState(v.base);
  return `
    <div class="verb-tags">
      <span class="tag level">${v.level}</span>
      ${v.important ? `<span class="tag level">⭐</span>` : ""}
      <span class="tag ${v.irregular ? "irregular" : "regular"}">${v.irregular ? tx("IRREGULAR", "شاذ") : tx("REGULAR", "منتظم")}</span>
      ${s.mastered ? `<span class="tag regular">✅</span>` : ""}
    </div>`;
}

function verbCard(v, note = "") {
  return `
    <div class="verb">
      <div class="verb-head" data-open="${escapeHtml(v.base)}">
        <div class="verb-title"><span dir="ltr">${v.base.toUpperCase()}</span> <span class="es">— ${escapeHtml(v.es)}</span></div>
        ${verbTagsHtml(v)}
      </div>
      ${note ? `<div class="match-note">🔎 ${note}</div>` : ""}
      ${verbFormsHtml(v)}
      ${!v.irregular ? `<div class="small muted" style="margin-top:8px">${tx("💡 Regular: el pasado y el participio se forman con <b>-ed</b>.", "💡 منتظم: الماضي والتصريف الثالث يُكوَّنان بإضافة <b>-ed</b>.")}</div>` : ""}
      <div class="verb-actions">
        <button class="btn soft" data-open="${escapeHtml(v.base)}">📖 ${tx("Ejemplos", "أمثلة")}</button>
        <button class="btn" data-practice="${escapeHtml(v.base)}">🧠 ${tx("Practicar", "تدرّب")}</button>
      </div>
    </div>`;
}

App.sections.verbs = {
  filter: "all",
  query: "",
  render(view, base) {
    if (base) return this.renderDetail(view, base);
    const self = this;
    let limit = 25;

    view.innerHTML = `
      <h1 class="page">📚 ${tx("Verbos", "الأفعال")}</h1>
      <p class="lead">${tx("Busca en español o en inglés: <i>comer, comí, eat, ate...</i>", "ابحث بالعربية أو بالإنجليزية: <i>يأكل، eat، ate...</i>")}</p>
      <input class="search" id="verbSearch" type="search" dir="auto" placeholder="${tx("🔎 comer · eat · fui · went...", "🔎 يأكل · eat · يذهب · went...")}" autocomplete="off" value="${escapeHtml(this.query)}">
      <div class="filters">
        <button class="chip" data-filter="all">${tx("Todos", "الكل")}</button>
        <button class="chip" data-filter="important">⭐ ${tx("Más importantes", "الأهم")}</button>
        <button class="chip" data-filter="irregular">🟠 ${tx("Irregulares", "الشاذة")}</button>
        <button class="chip" data-filter="regular">🟢 ${tx("Regulares", "المنتظمة")}</button>
      </div>
      <div class="row small muted" style="margin-bottom:10px"><span id="verbInfo"></span><span class="spacer"></span><span id="verbCount"></span></div>
      <div id="verbList"></div>
      <button class="btn ghost block" id="moreBtn" hidden>${tx("Mostrar más ⬇️", "عرض المزيد ⬇️")}</button>`;

    function passFilter(v) {
      return self.filter === "all" || (self.filter === "important" && v.important) ||
        (self.filter === "irregular" && v.irregular) || (self.filter === "regular" && !v.irregular);
    }
    function list() {
      $$("[data-filter]").forEach((c) => c.classList.toggle("active", c.dataset.filter === self.filter));
      const q = self.query.trim();
      let results = q ? searchVerbs(q) : VERBS.filter(allowed).map((v) => ({ v, note: "" }));
      results = results.filter((r) => passFilter(r.v));
      $("#verbCount").textContent = tx(`${results.length} verbo${results.length === 1 ? "" : "s"}`, `${results.length} فعل`);
      $("#verbInfo").textContent = q ? "" : tx(`Hasta nivel ${Store.data.level} · busca para ver todos`, `حتى المستوى ${Store.data.level} · ابحث لرؤية الكل`);
      if (!results.length) {
        $("#verbList").innerHTML = `<div class="empty">${tx(`😅 No encontré “<b>${escapeHtml(q)}</b>”.<br>Prueba con otra palabra o dime qué verbo falta para agregarlo.`, `😅 لم أجد “<b>${escapeHtml(q)}</b>”.<br>جرّب كلمة أخرى أو أخبرني بالفعل الناقص لإضافته.`)}</div>`;
        $("#moreBtn").hidden = true;
        return;
      }
      $("#verbList").innerHTML = results.slice(0, limit).map((r) => verbCard(r.v, r.note)).join("");
      $("#moreBtn").hidden = results.length <= limit;
    }

    $("#verbSearch").addEventListener("input", (e) => { self.query = e.target.value; limit = 25; list(); });
    $$("[data-filter]").forEach((chip) => (chip.onclick = () => { self.filter = chip.dataset.filter; limit = 25; list(); }));
    $("#moreBtn").onclick = () => { limit += 25; list(); };
    $("#verbList").addEventListener("click", (e) => {
      const open = e.target.closest("[data-open]");
      const practice = e.target.closest("[data-practice]");
      if (practice) go("practice/verb/" + encodeURIComponent(practice.dataset.practice));
      else if (open && !e.target.closest("[data-say]")) go("verbs/" + encodeURIComponent(open.dataset.open));
    });
    list();
    if (!this.query && window.innerWidth > 700) $("#verbSearch").focus();
  },

  renderDetail(view, base) {
    const v = VERB_BY_BASE[base];
    if (!v) { view.innerHTML = `<div class="empty">${tx("No encontré ese verbo.", "لم أجد هذا الفعل.")}</div>`; return; }
    const s = verbState(v.base);
    const colors = ["c-pres", "c-past", "c-pp"];
    const tenseNames = [TENSES.pres.label, TENSES.past.label, TENSES.pp.label];

    // Si el verbo no tiene ejemplos escritos, mostramos frases modelo
    const examples = v.examples.length
      ? v.examples.map((ex, i) => {
          const plain = ex.en.replace(/\*/g, "");
          return `
          <div class="ex ${colors[i]}">
            <div class="text">
              <div class="small" style="color:var(--c);font-weight:800">${tenseNames[i]}</div>
              <div class="en" dir="ltr">${escapeHtml(ex.en).replace(/\*(.+?)\*/, "<b>$1</b>")}</div>
              <div class="es">${escapeHtml(ex.es)}</div>
            </div>
            <div class="btns">${sayBtn(plain)}<button class="icon-btn" data-pronounce="${escapeHtml(plain)}">🎤</button></div>
          </div>`;
        }).join("")
      : [
          ["c-pres", TENSES.pres.label, `I ${v.base} ... / She ${v.third} ...`, `I ${v.base}. She ${v.third}.`],
          ["c-past", TENSES.past.label, `Yesterday I ${v.past.split(" / ")[0]} ...`, `Yesterday I ${v.past.split(" / ")[0]}.`],
          ["c-pp", TENSES.pp.label, `I have ${v.participle} ...`, `I have ${v.participle}.`],
          ["c-fut", TENSES.fut.label, `Tomorrow I will ${v.base} ...`, `Tomorrow I will ${v.base}.`],
          ["c-ger", TENSES.ger.label, `Right now I am ${v.ing} ...`, `Right now I am ${v.ing}.`],
        ].map(([c, n, txt, say]) => `
          <div class="ex ${c}">
            <div class="text"><div class="small" style="color:var(--c);font-weight:800">${n}</div><div class="en" dir="ltr">${escapeHtml(txt)}</div></div>
            <div class="btns">${sayBtn(say)}<button class="icon-btn" data-pronounce="${escapeHtml(say)}">🎤</button></div>
          </div>`).join("");

    view.innerHTML = `
      <button class="btn ghost" onclick="history.back()" style="margin:6px 0 12px">${tx("⬅️ Volver", "➡️ رجوع")}</button>
      <div class="verb">
        <div class="verb-head">
          <div>
            <div class="verb-title" dir="ltr" style="font-size:2rem">${v.base.toUpperCase()}</div>
            <div class="muted" style="font-size:1.1rem">${escapeHtml(v.es)}</div>
          </div>
          ${verbTagsHtml(v)}
        </div>
        ${verbFormsHtml(v)}
        ${v.irregular
          ? `<div class="small muted" style="margin-top:8px">${tx("🔥 Es <b>irregular</b>: el pasado y el participio no usan -ed. ¡Memorízalos!", "🔥 فعل <b>شاذ</b>: الماضي والتصريف الثالث لا يستخدمان -ed. احفظهما!")}</div>`
          : `<div class="small muted" style="margin-top:8px">${tx(`💡 Es <b>regular</b>: pasado y participio = ${v.base} + ed → <b>${v.past}</b>.`, `💡 فعل <b>منتظم</b>: الماضي والتصريف الثالث = ${v.base} + ed → <b>${v.past}</b>.`)}</div>`}
      </div>

      <div class="section-title">💬 ${tx("Ejemplos", "أمثلة")} ${v.examples.length ? "" : `<span class='small muted'>${tx("(estructura)", "(البنية)")}</span>`}</div>
      ${examples}

      <div class="card-box" style="margin-top:14px">
        <div class="row">
          <div style="flex:1">
            <b>${tx("Tu dominio de este verbo", "مدى إتقانك لهذا الفعل")}</b>
            <div class="mastery" style="margin-top:6px">${[0, 1, 2].map((i) => `<span class="dot ${i < Math.min(s.streak, 3) ? "on" : ""}"></span>`).join("")}
              <span>${s.mastered ? tx("✅ ¡Dominado!", "✅ متقَن!") : tx("3 aciertos seguidos = dominado", "3 إجابات صحيحة متتالية = إتقان")}</span></div>
          </div>
        </div>
        <button class="btn block" style="margin-top:12px" onclick="go('practice/verb/${encodeURIComponent(v.base)}')">🧠 ${tx("Practicar", "تدرّب على")} ${v.base.toUpperCase()}</button>
      </div>`;

    $$("[data-pronounce]", view).forEach((b) => (b.onclick = () => pronounceSheet(b.dataset.pronounce)));
  },
};
