// =====================================================================
// ⏪ PAST SIMPLE — contenido de la sección de pasado
// =====================================================================

// ---------- Palabras que indican pasado ----------
const PAST_TIME_WORDS = [
  ["yesterday", "ayer"], ["yesterday morning", "ayer en la mañana"], ["last night", "anoche"],
  ["last week", "la semana pasada"], ["last year", "el año pasado"], ["two days ago", "hace dos días"],
  ["a month ago", "hace un mes"], ["in 2019", "en 2019"], ["when I was a child", "cuando era niño/a"],
];

// ---------- Pronunciación de -ed ----------
// sound: t | d | id
const ED_SOUNDS = {
  t: { label: "/t/", color: "var(--fut)", es: "Suena como <b>t</b>. Cuando el verbo termina en sonido <b>p, k, s, sh, ch, f, x</b>.", tip: "No agregues sílaba: work-ed ❌ → «workt» ✅" },
  d: { label: "/d/", color: "var(--pres)", es: "Suena como <b>d</b>. Cuando termina en vocal o en sonido <b>b, g, l, m, n, r, v, z</b>.", tip: "No agregues sílaba: play-ed ❌ → «pleid» ✅" },
  id: { label: "/ɪd/", color: "var(--past)", es: "Se agrega una <b>sílaba extra</b> «id». Solo cuando el verbo termina en <b>t</b> o <b>d</b>.", tip: "want → wan-<b>tid</b>, need → nee-<b>did</b>" },
};
const ED_VERBS = `
work|worked|t|trabajar
watch|watched|t|ver
stop|stopped|t|parar
laugh|laughed|t|reír
wash|washed|t|lavar
kiss|kissed|t|besar
cook|cooked|t|cocinar
help|helped|t|ayudar
dance|danced|t|bailar
finish|finished|t|terminar
walk|walked|t|caminar
relax|relaxed|t|relajarse
talk|talked|t|hablar
play|played|d|jugar
clean|cleaned|d|limpiar
live|lived|d|vivir
call|called|d|llamar
open|opened|d|abrir
study|studied|d|estudiar
love|loved|d|amar
listen|listened|d|escuchar
arrive|arrived|d|llegar
cry|cried|d|llorar
stay|stayed|d|quedarse
travel|traveled|d|viajar
enjoy|enjoyed|d|disfrutar
want|wanted|id|querer
need|needed|id|necesitar
visit|visited|id|visitar
start|started|id|empezar
wait|waited|id|esperar
decide|decided|id|decidir
end|ended|id|terminar
paint|painted|id|pintar
invite|invited|id|invitar
land|landed|id|aterrizar
rent|rented|id|arrendar
`.trim().split("\n").map((l) => { const [base, past, sound, es] = l.split("|"); return { base, past, sound, es }; });

// ---------- Irregulares más usados (para la explicación) ----------
const TOP_IRREGULARS = ["be", "have", "do", "go", "get", "make", "say", "see", "come", "take", "give", "eat", "drink", "buy", "find", "feel", "think", "know", "leave", "meet", "sleep", "speak", "write", "swim"];

// ---------- Historias para completar ----------
// Cada línea: texto con ___ | verbo base | pasado correcto | traducción
const PAST_STORIES = [
  {
    id: "bondi", title: "A day at Bondi Beach", emoji: "🏖️", es: "Un día en la playa Bondi", lines: `
Last Saturday I ___ up early.|wake|woke|El sábado pasado me desperté temprano.
I ___ breakfast with my friend Sofia.|have|had|Tomé desayuno con mi amiga Sofía.
We ___ the bus to Bondi Beach.|take|took|Tomamos el bus a la playa Bondi.
The water ___ really cold!|be|was|¡El agua estaba muy fría!
But we ___ for an hour.|swim|swam|Pero nadamos por una hora.
Then we ___ fish and chips on the beach.|eat|ate|Después comimos pescado con papas fritas en la playa.
Sofia ___ a lot of photos.|take|took|Sofía sacó muchas fotos.
We ___ home at seven, very tired but happy.|get|got|Llegamos a casa a las siete, muy cansados pero felices.`,
  },
  {
    id: "firstday", title: "My first day at work", emoji: "💼", es: "Mi primer día de trabajo", lines: `
Yesterday I ___ my new job at a café.|start|started|Ayer empecé mi nuevo trabajo en un café.
I ___ very nervous in the morning.|feel|felt|Me sentí muy nervioso/a en la mañana.
My boss ___ me how to use the coffee machine.|show|showed|Mi jefe me mostró cómo usar la máquina de café.
I ___ more than fifty coffees!|make|made|¡Hice más de cincuenta cafés!
A customer ___ my English was very good.|say|said|Un cliente dijo que mi inglés era muy bueno.
At lunchtime I ___ to my coworker Jack.|talk|talked|A la hora de almuerzo hablé con mi compañero Jack.
We ___ about Australia and Chile.|chat|chatted|Conversamos sobre Australia y Chile.
I ___ home at five and called my mum.|go|went|Me fui a casa a las cinco y llamé a mi mamá.`,
  },
  {
    id: "trip", title: "A trip to Byron Bay", emoji: "🚐", es: "Un viaje a Byron Bay", lines: `
Two weeks ago we ___ to Byron Bay.|drive|drove|Hace dos semanas manejamos a Byron Bay.
The trip ___ about one hour from the Gold Coast.|take|took|El viaje tomó como una hora desde la Gold Coast.
We ___ the lighthouse in the morning.|visit|visited|Visitamos el faro en la mañana.
I ___ dolphins in the ocean!|see|saw|¡Vi delfines en el mar!
In the afternoon we ___ surfing.|try|tried|En la tarde probamos surfear.
I ___ a lot, but it was fun.|fall|fell|Me caí mucho, pero fue divertido.
We ___ some souvenirs for our families.|buy|bought|Compramos unos recuerdos para nuestras familias.
We ___ back really late that night.|come|came|Volvimos muy tarde esa noche.`,
  },
].map((s) => ({
  ...s,
  lines: s.lines.trim().split("\n").map((l) => { const [text, base, past, es] = l.split("|"); return { text, base, past, es }; }),
}));

// ---------- Detective: frases para pasar a negativo y pregunta ----------
// sujeto | pasado | base | resto | traducción
const DID_ITEMS = `
I|went|go|to work by bus.|Fui al trabajo en bus.
She|bought|buy|a new phone.|Ella compró un teléfono nuevo.
They|watched|watch|a movie last night.|Ellos vieron una película anoche.
He|ate|eat|breakfast at home.|Él tomó desayuno en casa.
We|visited|visit|our friends on Sunday.|Visitamos a nuestros amigos el domingo.
You|called|call|your mum yesterday.|Llamaste a tu mamá ayer.
She|made|make|a cake for the party.|Ella hizo una torta para la fiesta.
He|saw|see|a kangaroo in the park.|Él vio un canguro en el parque.
I|studied|study|English last night.|Estudié inglés anoche.
They|took|take|a lot of photos.|Ellos sacaron muchas fotos.
We|swam|swim|at the beach.|Nadamos en la playa.
He|played|play|football after school.|Él jugó fútbol después del colegio.
`.trim().split("\n").map((l) => { const [s, past, base, rest, es] = l.split("|"); return { s, past, base, rest, es }; });

// ---------- Cuéntame tu día (hablar en pasado) ----------
const PAST_TALK = [
  { q: "What did you do yesterday?", es: "¿Qué hiciste ayer?", tense: "past", models: ["Yesterday I went to work and then I cooked dinner.", "I studied English and watched a movie."] },
  { q: "What did you eat for dinner last night?", es: "¿Qué cenaste anoche?", tense: "past", models: ["I ate pasta with chicken.", "I had a pizza with my friends."] },
  { q: "Where did you go last weekend?", es: "¿A dónde fuiste el fin de semana pasado?", tense: "past", models: ["I went to the beach in Surfers Paradise.", "I stayed home and relaxed."] },
  { q: "When did you arrive in Australia?", es: "¿Cuándo llegaste a Australia?", tense: "past", models: ["I arrived in Australia two months ago.", "I came here last year."] },
  { q: "What did you do when you were a child?", es: "¿Qué hacías cuando eras niño/a?", tense: "past", models: ["I played football with my friends.", "I watched cartoons every afternoon."] },
  { q: "What was the best day of your last holiday?", es: "¿Cuál fue el mejor día de tus últimas vacaciones?", tense: "past", models: ["The best day was when we went to the mountains.", "It was the day I saw the ocean."] },
  { q: "Did you sleep well last night?", es: "¿Dormiste bien anoche?", tense: "past", models: ["Yes, I did. I slept eight hours.", "No, I didn't. I woke up at three."] },
  { q: "What did you learn in your last English class?", es: "¿Qué aprendiste en tu última clase de inglés?", tense: "past", models: ["I learned the present simple with he, she and it.", "We practised do, go and play."] },
];
