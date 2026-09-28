// 📚 VERBOS — buscar (español o inglés) → entender → escuchar → practicar
// Terminaciones de verbos en español (comí, trabajé, hablando, estudiamos...)
const SPANISH_ENDING = /^(o|as|a|amos|an|e|es|en|emos|imos|i|aste|aron|io|iste|ieron|aba|abas|abamos|aban|ia|ias|iamos|ian|ando|iendo|ado|ido|ada|ida|are|aras|ara|aremos|aran|ere|eras|era|eremos|eran|ire|iras|ira|iremos|iran|aria|eria|iria)(me|te|se|nos|lo|la)?$/;
const FORM_LABELS = { third: "🟢 presente (he/she)", past: "🔴 pasado", pp: "🟣 participio", ing: "🟠 gerundio" };

// Busca en español o inglés, aunque escribas una forma conjugada (comí, fui, went, eaten...)
function searchVerbs(query) {
  const q = normalize(query).replace(/^to /, "");
  const results = [];
  VERBS.forEach((v) => {
    const esWords = v.es.split(" / ").map((s) => normalize(s.replace(/\(.*?\)/g, "")));
    let score = null, note = "";
    const englishForms = [["third", v.third], ["pp", v.participle], ["ing", v.ing], ...v.past.split(" / ").map((p) => ["past", p])];
    const formHit = englishForms.find(([, f]) => f === q && f !== v.base);
    const spanishHit = SPANISH_FORMS[q] && (" " + SPANISH_FORMS[q] + " ").includes(" " + v.base + " ");
    const stemHit = q.length >= 3 && esWords.find((w) => {
      const inf = w.split(" ")[0];
      const stem = inf.replace(/(ar|er|ir)(se)?$/, "");
      return stem.length >= 2 && stem !== inf && q.startsWith(stem) && q !== inf && SPANISH_ENDING.test(q.slice(stem.length));
    });

    if (esWords[0] === q || v.base === q) score = 0;
    else if (esWords.includes(q)) score = 0.5;
    else if (formHit) { score = 1; note = `“${escapeHtml(query.trim())}” es el ${FORM_LABELS[formHit[0]]} de <b>${v.base}</b>`; }
    else if (spanishHit) { score = 1; note = `“${escapeHtml(query.trim())}” es una forma de <b>${escapeHtml(esMain(v))}</b>`; }
    else if (esWords.some((w) => w.startsWith(q)) || v.base.startsWith(q)) score = 2;
    else if (stemHit) { score = 3; note = `“${escapeHtml(query.trim())}” parece una forma de <b>${escapeHtml(stemHit.split(" ")[0])}</b>`; }
    else if (q.length >= 3 && (normalize(v.es).includes(q) || v.base.includes(q))) score = 4;

    if (score !== null) results.push({ v, score, note });
  });
  return results.sort((a, b) => a.score - b.score || a.v.es.localeCompare(b.v.es, "es"));
}

function formRow(cls, name, value, sayText, memo = false) {
  return `
    <div class="form-row ${cls} ${memo ? "memo" : ""}">
      <span class="fname">${name}</span>
      <span class="fval">${value}</span>
      ${memo ? `<span class="memo-tag">⭐ MEMORIZA</span>` : ""}
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
      ${formRow("c-pres", "🟢 Presente", present, presentSay)}
      ${formRow("c-past", "🔴 Pasado", escapeHtml(v.past), v.past.replace(" / ", ", "), v.irregular)}
      ${formRow("c-pp", "🟣 Participio", `${escapeHtml(v.participle)} <small>(have ${escapeHtml(v.participle)})</small>`, v.participle, v.irregular)}
      ${formRow("c-fut", "🔵 Futuro", `will ${v.base}`, `will ${v.base}`)}
      ${formRow("c-ger", "🟠 Gerundio", v.ing, v.ing)}
    </div>`;
}

function verbTagsHtml(v) {
  const s = verbState(v.base);
  return `
    <div class="verb-tags">
      <span class="tag level">${v.level}</span>
      ${v.important ? `<span class="tag level">⭐</span>` : ""}
      <span class="tag ${v.irregular ? "irregular" : "regular"}">${v.irregular ? "IRREGULAR" : "REGULAR"}</span>
      ${s.mastered ? `<span class="tag regular">✅</span>` : ""}
    </div>`;
}

function verbCard(v, note = "") {
  return `
    <div class="verb">
      <div class="verb-head" data-open="${escapeHtml(v.base)}">
        <div class="verb-title">${v.base.toUpperCase()} <span class="es">— ${escapeHtml(v.es)}</span></div>
        ${verbTagsHtml(v)}
      </div>
      ${note ? `<div class="match-note">🔎 ${note}</div>` : ""}
      ${verbFormsHtml(v)}
      ${!v.irregular ? `<div class="small muted" style="margin-top:8px">💡 Regular: el pasado y el participio se forman con <b>-ed</b>.</div>` : ""}
      <div class="verb-actions">
        <button class="btn soft" data-open="${escapeHtml(v.base)}">📖 Ejemplos</button>
        <button class="btn" data-practice="${escapeHtml(v.base)}">🧠 Practicar</button>
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
      <h1 class="page">📚 Verbos</h1>
      <p class="lead">Busca en español o en inglés: <i>comer, comí, eat, ate...</i></p>
      <input class="search" id="verbSearch" type="search" placeholder="🔎 comer · eat · fui · went..." autocomplete="off" value="${escapeHtml(this.query)}">
      <div class="filters">
        <button class="chip" data-filter="all">Todos</button>
        <button class="chip" data-filter="important">⭐ Más importantes</button>
        <button class="chip" data-filter="irregular">🟠 Irregulares</button>
        <button class="chip" data-filter="regular">🟢 Regulares</button>
      </div>
      <div class="row small muted" style="margin-bottom:10px"><span id="verbInfo"></span><span class="spacer"></span><span id="verbCount"></span></div>
      <div id="verbList"></div>
      <button class="btn ghost block" id="moreBtn" hidden>Mostrar más ⬇️</button>`;

    function passFilter(v) {
      return self.filter === "all" || (self.filter === "important" && v.important) ||
        (self.filter === "irregular" && v.irregular) || (self.filter === "regular" && !v.irregular);
    }
    function list() {
      $$("[data-filter]").forEach((c) => c.classList.toggle("active", c.dataset.filter === self.filter));
      const q = self.query.trim();
      let results = q ? searchVerbs(q) : VERBS.filter(allowed).map((v) => ({ v, note: "" }));
      results = results.filter((r) => passFilter(r.v));
      $("#verbCount").textContent = `${results.length} verbo${results.length === 1 ? "" : "s"}`;
      $("#verbInfo").textContent = q ? "" : `Hasta nivel ${Store.data.level} · busca para ver todos`;
      if (!results.length) {
        $("#verbList").innerHTML = `<div class="empty">😅 No encontré “<b>${escapeHtml(q)}</b>”.<br>Prueba con otra palabra o dime qué verbo falta para agregarlo.</div>`;
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
    if (!v) { view.innerHTML = `<div class="empty">No encontré ese verbo.</div>`; return; }
    const s = verbState(v.base);
    const colors = ["c-pres", "c-past", "c-pp"];
    const tenseNames = ["🟢 Presente", "🔴 Pasado", "🟣 Participio"];

    // Si el verbo no tiene ejemplos escritos, mostramos frases modelo
    const examples = v.examples.length
      ? v.examples.map((ex, i) => {
          const plain = ex.en.replace(/\*/g, "");
          return `
          <div class="ex ${colors[i]}">
            <div class="text">
              <div class="small" style="color:var(--c);font-weight:800">${tenseNames[i]}</div>
              <div class="en">${escapeHtml(ex.en).replace(/\*(.+?)\*/, "<b>$1</b>")}</div>
              <div class="es">${escapeHtml(ex.es)}</div>
            </div>
            <div class="btns">${sayBtn(plain)}<button class="icon-btn" data-pronounce="${escapeHtml(plain)}">🎤</button></div>
          </div>`;
        }).join("")
      : [
          ["c-pres", "🟢 Presente", `I ${v.base} ... / She ${v.third} ...`, `I ${v.base}. She ${v.third}.`],
          ["c-past", "🔴 Pasado", `Yesterday I ${v.past.split(" / ")[0]} ...`, `Yesterday I ${v.past.split(" / ")[0]}.`],
          ["c-pp", "🟣 Participio", `I have ${v.participle} ...`, `I have ${v.participle}.`],
          ["c-fut", "🔵 Futuro", `Tomorrow I will ${v.base} ...`, `Tomorrow I will ${v.base}.`],
          ["c-ger", "🟠 Gerundio", `Right now I am ${v.ing} ...`, `Right now I am ${v.ing}.`],
        ].map(([c, n, txt, say]) => `
          <div class="ex ${c}">
            <div class="text"><div class="small" style="color:var(--c);font-weight:800">${n}</div><div class="en">${escapeHtml(txt)}</div></div>
            <div class="btns">${sayBtn(say)}<button class="icon-btn" data-pronounce="${escapeHtml(say)}">🎤</button></div>
          </div>`).join("");

    view.innerHTML = `
      <button class="btn ghost" onclick="history.back()" style="margin:6px 0 12px">⬅️ Volver</button>
      <div class="verb">
        <div class="verb-head">
          <div>
            <div class="verb-title" style="font-size:2rem">${v.base.toUpperCase()}</div>
            <div class="muted" style="font-size:1.1rem">${escapeHtml(v.es)}</div>
          </div>
          ${verbTagsHtml(v)}
        </div>
        ${verbFormsHtml(v)}
        ${v.irregular ? `<div class="small muted" style="margin-top:8px">🔥 Es <b>irregular</b>: el pasado y el participio no usan -ed. ¡Memorízalos!</div>` : `<div class="small muted" style="margin-top:8px">💡 Es <b>regular</b>: pasado y participio = ${v.base} + ed → <b>${v.past}</b>.</div>`}
      </div>

      <div class="section-title">💬 Ejemplos ${v.examples.length ? "" : "<span class='small muted'>(estructura)</span>"}</div>
      ${examples}

      <div class="card-box" style="margin-top:14px">
        <div class="row">
          <div style="flex:1">
            <b>Tu dominio de este verbo</b>
            <div class="mastery" style="margin-top:6px">${[0, 1, 2].map((i) => `<span class="dot ${i < Math.min(s.streak, 3) ? "on" : ""}"></span>`).join("")}
              <span>${s.mastered ? "✅ ¡Dominado!" : "3 aciertos seguidos = dominado"}</span></div>
          </div>
        </div>
        <button class="btn block" style="margin-top:12px" onclick="go('practice/verb/${encodeURIComponent(v.base)}')">🧠 Practicar ${v.base.toUpperCase()}</button>
      </div>`;

    $$("[data-pronounce]", view).forEach((b) => (b.onclick = () => pronounceSheet(b.dataset.pronounce)));
  },
};
