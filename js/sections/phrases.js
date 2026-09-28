// 🃏 FRASES — flashcards por situación, con audio, pronunciación y progreso
const ICONS = { new: "🆕", learning: "🔄", known: "✅" };

App.sections.phrases = {
  category: "Todas",
  render(view) {
    const self = this;
    let deck = [], index = 0;

    view.innerHTML = `
      <h1 class="page">🃏 Frases</h1>
      <p class="lead">Frases de situaciones reales. Toca la tarjeta para ver el inglés.</p>
      <div class="stats">
        <span class="stat">🆕 <b data-count="new">0</b> nuevas</span>
        <span class="stat">🔄 <b data-count="learning">0</b> aprendiendo</span>
        <span class="stat">✅ <b data-count="known">0</b> dominadas</span>
      </div>
      <div class="chips" id="categories"></div>
      <div class="progress-mini"><div id="progressBar"></div></div>
      <div class="counter" id="counter"></div>
      <div class="card-wrap">
        <div class="flash" id="card">
          <div class="face front">
            <span class="badge-left" id="levelFront"></span>
            <span class="badge" id="badgeFront"></span>
            <div class="label">¿Cómo se dice en inglés?</div>
            <div class="big" id="spanish"></div>
            <div class="hint">👆 Toca para ver la respuesta</div>
          </div>
          <div class="face back">
            <span class="badge" id="badgeBack"></span>
            <div class="label">In English</div>
            <div class="big" id="english"></div>
            <div class="example" id="example"></div>
            <div class="btn-row">
              <button class="icon-btn" id="speakBtn">🔊 Escuchar</button>
              <button class="icon-btn" id="slowBtn">🐢</button>
              <button class="icon-btn" id="sayItBtn">🎤 Dilo tú</button>
            </div>
          </div>
        </div>
      </div>
      <div class="actions">
        <button class="btn learning" id="learningBtn">🔄 Aún no</button>
        <button class="btn known" id="knownBtn">✅ ¡Me la sé!</button>
      </div>
      <div class="nav">
        <button class="btn ghost" id="prevBtn">⬅️ Anterior</button>
        <button class="btn ghost" id="shuffleBtn">🔀 Mezclar</button>
        <button class="btn ghost" id="nextBtn">Siguiente ➡️</button>
      </div>
      <p class="keys">Teclado: <b>Espacio</b> girar · <b>←/→</b> navegar · <b>S</b> escuchar · <b>1</b> aún no · <b>2</b> me la sé</p>`;

    const pool = PHRASES.filter(allowed);

    function buildCategories() {
      const cats = ["Todas", ...new Set(pool.map((p) => p.category)), "🔄 Repasar"];
      if (!cats.includes(self.category)) self.category = "Todas";
      $("#categories").innerHTML = "";
      cats.forEach((cat) => {
        const chip = html(`<button class="chip ${cat === self.category ? "active" : ""}">${escapeHtml(cat)}</button>`);
        chip.onclick = () => { self.category = cat; buildCategories(); buildDeck(); };
        $("#categories").appendChild(chip);
      });
    }
    function buildDeck() {
      if (self.category === "Todas") deck = [...pool];
      else if (self.category === "🔄 Repasar") deck = pool.filter((p) => statusOf(p) !== "known");
      else deck = pool.filter((p) => p.category === self.category);
      index = 0;
      show();
    }
    function show() {
      $("#card").classList.remove("flipped");
      const counts = { new: 0, learning: 0, known: 0 };
      pool.forEach((p) => counts[statusOf(p)]++);
      $$("[data-count]").forEach((el) => (el.textContent = counts[el.dataset.count]));

      if (!deck.length) {
        $("#spanish").textContent = "🏆 ¡Ya dominas todas las frases de aquí!";
        ["#english", "#example", "#badgeFront", "#badgeBack", "#counter", "#levelFront"].forEach((s) => ($(s).textContent = ""));
        $("#progressBar").style.width = "100%";
        return;
      }
      const p = deck[index];
      $("#spanish").textContent = p.spanish;
      $("#english").textContent = p.english;
      $("#example").textContent = p.example ? "💬 " + p.example : "";
      $("#badgeFront").textContent = $("#badgeBack").textContent = ICONS[statusOf(p)];
      $("#levelFront").innerHTML = `<span class="tag level">${p.level}</span>`;
      $("#counter").textContent = `${index + 1} de ${deck.length} · ${p.category}`;
      $("#progressBar").style.width = `${((index + 1) / deck.length) * 100}%`;
    }
    const current = () => deck[index];
    const flip = () => deck.length && $("#card").classList.toggle("flipped");
    const next = () => { if (deck.length) { index = (index + 1) % deck.length; show(); } };
    const prev = () => { if (deck.length) { index = (index - 1 + deck.length) % deck.length; show(); } };
    const say = (slow) => deck.length && speak(current().english, { lang: langFor(current()), slow });
    function mark(status) {
      if (!deck.length) return;
      setPhraseStatus(current(), status);
      toast(status === "known" ? "🔥 Nice! Una menos" : "💪 La repasamos luego");
      if (self.category === "🔄 Repasar" && status === "known") {
        deck.splice(index, 1);
        if (index >= deck.length) index = 0;
        show();
      } else next();
    }

    $("#card").onclick = flip;
    $("#speakBtn").onclick = (e) => { e.stopPropagation(); say(false); };
    $("#slowBtn").onclick = (e) => { e.stopPropagation(); say(true); };
    $("#sayItBtn").onclick = (e) => { e.stopPropagation(); pronounceSheet(current().english, langFor(current())); };
    $("#nextBtn").onclick = next;
    $("#prevBtn").onclick = prev;
    $("#shuffleBtn").onclick = () => { deck = shuffle(deck); index = 0; show(); toast("🔀 ¡Mezcladas!"); };
    $("#knownBtn").onclick = () => mark("known");
    $("#learningBtn").onclick = () => mark("learning");

    // Atajos de teclado (no funcionan mientras escribes o con una ventana abierta)
    const onKey = (e) => {
      if (e.target.tagName === "INPUT" || $(".sheet-backdrop")) return;
      if (e.code === "Space") { e.preventDefault(); flip(); }
      else if (e.key === "ArrowRight") next();
      else if (e.key === "ArrowLeft") prev();
      else if (e.key.toLowerCase() === "s") say(false);
      else if (e.key === "1") mark("learning");
      else if (e.key === "2") mark("known");
    };
    document.addEventListener("keydown", onKey);
    App.cleanup = () => document.removeEventListener("keydown", onKey);

    buildCategories();
    buildDeck();
  },
};
