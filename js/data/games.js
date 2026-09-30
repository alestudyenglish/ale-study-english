// =====================================================================
// 🎲 JUEGOS DE CLASE — contenido propio basado en los temas de clase:
//   1) Do / Go / Play   2) Preguntas sí/no (Do you...?)
//   3) Tiempo libre (preguntas cotidianas)   4) Presente simple he/she/it
// =====================================================================

// ---------- 1) DO · GO · PLAY ----------
const DGP_RULES = {
  play: { color: "var(--fut)", es: "Deportes con pelota, juegos y competencias, e instrumentos (play the guitar).", ex: "I play football on Saturdays." },
  go: { color: "var(--pres)", es: "Actividades que terminan en -ing, casi siempre moverse o ir a un lugar.", ex: "I go walking on the beach after work." },
  do: { color: "var(--pp)", es: "Ejercicios y actividades sin pelota (yoga, karate) y tareas (homework, the dishes).", ex: "She does yoga every morning." },
};
// actividad | verbo | español | frase natural de ejemplo | traducción de la frase
const DGP_ITEMS = `
football|play|fútbol|I play football with my friends every Saturday.|Juego fútbol con mis amigos todos los sábados.
tennis|play|tenis|We play tennis after work on Thursdays.|Jugamos tenis después del trabajo los jueves.
basketball|play|básquetbol|My brother plays basketball at the park.|Mi hermano juega básquetbol en el parque.
badminton|play|bádminton|Do you want to play badminton this afternoon?|¿Quieres jugar bádminton esta tarde?
volleyball|play|vóleibol|I play volleyball on the beach on Sundays.|Juego vóleibol en la playa los domingos.
cricket|play|críquet|Australians love to play cricket in summer.|A los australianos les encanta jugar críquet en verano.
rugby|play|rugby|He plays rugby for a local team.|Él juega rugby en un equipo local.
chess|play|ajedrez|My grandpa and I play chess on rainy days.|Mi abuelo y yo jugamos ajedrez los días de lluvia.
cards|play|cartas|We play cards at home on Friday nights.|Jugamos cartas en casa los viernes por la noche.
video games|play|videojuegos|I play video games to relax after class.|Juego videojuegos para relajarme después de clase.
the guitar|play|la guitarra|She plays the guitar and sings really well.|Ella toca la guitarra y canta muy bien.
table tennis|play|ping-pong|We play table tennis at lunchtime.|Jugamos ping-pong a la hora de almuerzo.
swimming|go|nadar|I go swimming at the beach every morning.|Voy a nadar a la playa todas las mañanas.
walking|go|caminar / salir a caminar|I go walking on the beach after work.|Salgo a caminar por la playa después del trabajo.
jogging|go|trotar|She goes jogging in the park before breakfast.|Ella sale a trotar al parque antes del desayuno.
hiking|go|hacer senderismo|We go hiking in the Blue Mountains once a month.|Vamos de excursión a las Blue Mountains una vez al mes.
surfing|go|surfear|My friends go surfing at Bondi on weekends.|Mis amigos van a surfear a Bondi los fines de semana.
shopping|go|ir de compras|I usually go shopping on Saturday mornings.|Normalmente voy de compras los sábados en la mañana.
fishing|go|pescar|My dad loves to go fishing at the lake.|A mi papá le encanta ir a pescar al lago.
camping|go|acampar|We're going to go camping next weekend.|Vamos a ir a acampar el próximo fin de semana.
cycling|go|andar en bici|I go cycling along the river on Sundays.|Salgo a andar en bici por el río los domingos.
dancing|go|ir a bailar|Let's go dancing on Friday night!|¡Vamos a bailar el viernes en la noche!
skiing|go|esquiar|They go skiing in the mountains every winter.|Ellos van a esquiar a la montaña cada invierno.
running|go|salir a correr|I go running three times a week.|Salgo a correr tres veces a la semana.
snorkelling|go|hacer snorkel|You can go snorkelling on the Great Barrier Reef.|Puedes hacer snorkel en la Gran Barrera de Coral.
yoga|do|yoga|I do yoga at home before work.|Hago yoga en casa antes del trabajo.
exercise|do|ejercicio|You should do some exercise every day.|Deberías hacer algo de ejercicio todos los días.
karate|do|karate|My son does karate after school.|Mi hijo hace karate después del colegio.
homework|do|la tarea|I do my English homework in the evening.|Hago mi tarea de inglés en la tarde.
sit-ups|do|abdominales|I do twenty sit-ups every morning.|Hago veinte abdominales todas las mañanas.
push-ups|do|flexiones|How many push-ups can you do?|¿Cuántas flexiones puedes hacer?
pilates|do|pilates|She does pilates twice a week.|Ella hace pilates dos veces a la semana.
gymnastics|do|gimnasia|My daughter does gymnastics on Saturdays.|Mi hija hace gimnasia los sábados.
the dishes|do|lavar los platos|I cook and my partner does the dishes.|Yo cocino y mi pareja lava los platos.
a workout|do|un entrenamiento|I do a quick workout at the gym after work.|Hago un entrenamiento rápido en el gimnasio después del trabajo.
judo|do|judo|He does judo at a club near his house.|Él practica judo en un club cerca de su casa.
the laundry|do|lavar la ropa|I do the laundry on Sunday afternoons.|Lavo la ropa los domingos en la tarde.
`.trim().split("\n").map((line) => {
  const [w, v, es, sentence, sentenceEs] = line.split("|");
  return { w, v, es, sentence, sentenceEs };
});

const DGP_TALK = [
  { q: "What sports do you play?", es: "¿Qué deportes practicas?", tense: "present", models: ["I play football with my friends.", "I don't play any sports, but I go running."] },
  { q: "Do you ever go hiking? Where?", es: "¿Vas alguna vez de excursión? ¿Dónde?", tense: "present", models: ["Yes, I go hiking in the Blue Mountains.", "No, I don't, but I'd like to."] },
  { q: "How often do you do exercise?", es: "¿Con qué frecuencia haces ejercicio?", tense: "present", models: ["I do exercise three times a week.", "I do yoga every morning."] },
  { q: "Would you like to go surfing in Australia? Why?", es: "¿Te gustaría surfear en Australia? ¿Por qué?", tense: "present", models: ["Yes, I would, because it looks fun.", "No, I wouldn't. I'm afraid of sharks!"] },
  { q: "What games did you play when you were a child?", es: "¿Qué juegos jugabas cuando eras niño/a?", tense: "past", models: ["I played football in the street.", "I played cards with my grandma."] },
  { q: "What do you do to relax after work?", es: "¿Qué haces para relajarte después del trabajo?", tense: "present", models: ["I go for a walk and listen to music.", "I play video games."] },
];

// ---------- 2) DO YOU KNOW ME? (preguntas sí/no) ----------
// [pregunta, traducción, respuesta corta afirmativa, negativa]
const YESNO_ITEMS = [
  ["Do you like Australian coffee?", "¿Te gusta el café australiano?", "Yes, I do.", "No, I don't."],
  ["Do you read books in English?", "¿Lees libros en inglés?", "Yes, I do.", "No, I don't."],
  ["Do you play a musical instrument?", "¿Tocas algún instrumento?", "Yes, I do.", "No, I don't."],
  ["Do you listen to podcasts?", "¿Escuchas podcasts?", "Yes, I do.", "No, I don't."],
  ["Do you watch the news every day?", "¿Ves las noticias todos los días?", "Yes, I do.", "No, I don't."],
  ["Do you speak three languages?", "¿Hablas tres idiomas?", "Yes, I do.", "No, I don't."],
  ["Do you have a pet?", "¿Tienes una mascota?", "Yes, I do.", "No, I don't."],
  ["Do you feel tired in the morning?", "¿Te sientes cansado/a en la mañana?", "Yes, I do.", "No, I don't."],
  ["Do you go to the beach on weekends?", "¿Vas a la playa los fines de semana?", "Yes, I do.", "No, I don't."],
  ["Do you eat breakfast every day?", "¿Desayunas todos los días?", "Yes, I do.", "No, I don't."],
  ["Does she work in a café?", "¿Ella trabaja en un café?", "Yes, she does.", "No, she doesn't."],
  ["Does he play basketball?", "¿Él juega básquetbol?", "Yes, he does.", "No, he doesn't."],
  ["Does it rain a lot in Melbourne?", "¿Llueve mucho en Melbourne?", "Yes, it does.", "No, it doesn't."],
  ["Do they live in Sydney?", "¿Ellos viven en Sídney?", "Yes, they do.", "No, they don't."],
  ["Does your brother speak Spanish?", "¿Tu hermano habla español?", "Yes, he does.", "No, he doesn't."],
  ["Do we have class tomorrow?", "¿Tenemos clase mañana?", "Yes, we do.", "No, we don't."],
].map(([q, es, yes, no]) => ({ q, es, yes, no }));

// ---------- 3) RULETA DEL TIEMPO LIBRE ----------
const WHEEL = [
  { ico: "⏰", name: "Free time", color: "#6c4cf5", qs: [
    { q: "How much free time do you have this week?", es: "¿Cuánto tiempo libre tienes esta semana?", tense: "present", models: ["I don't have much free time. I work a lot.", "I have two free afternoons."] },
    { q: "What do you usually do after class?", es: "¿Qué haces normalmente después de clase?", tense: "present", models: ["I usually go home and cook.", "I go to work after class."] },
  ] },
  { ico: "📺", name: "TV & series", color: "#2f7ae5", qs: [
    { q: "What series are you watching at the moment?", es: "¿Qué serie estás viendo ahora?", tense: "present", models: ["I'm watching a Spanish series on Netflix.", "I'm not watching anything right now."] },
    { q: "Do you watch TV in English? Is it difficult?", es: "¿Ves tele en inglés? ¿Es difícil?", tense: "present", models: ["Yes, I do, with subtitles.", "Sometimes. It's difficult when they speak fast."] },
  ] },
  { ico: "📚", name: "Reading", color: "#1f9d63", qs: [
    { q: "What do you like to read?", es: "¿Qué te gusta leer?", tense: "present", models: ["I like to read news on my phone.", "I love novels."] },
    { q: "What was the last book you read?", es: "¿Cuál fue el último libro que leíste?", tense: "past", models: ["The last book I read was a love story.", "I can't remember. I don't read much."] },
  ] },
  { ico: "🏃", name: "Exercise", color: "#e08a00", qs: [
    { q: "What exercise do you do in your free time?", es: "¿Qué ejercicio haces en tu tiempo libre?", tense: "present", models: ["I go running by the beach.", "I do yoga at home."] },
    { q: "Is there a good gym near your house?", es: "¿Hay un buen gimnasio cerca de tu casa?", tense: "present", models: ["Yes, there is one next to the station.", "No, there isn't."] },
  ] },
  { ico: "🎉", name: "Last weekend", color: "#e5484d", qs: [
    { q: "What did you do for fun last weekend?", es: "¿Qué hiciste para divertirte el fin de semana pasado?", tense: "past", models: ["I went to the beach with my friends.", "I stayed home and watched movies."] },
    { q: "Where did you eat last Saturday?", es: "¿Dónde comiste el sábado pasado?", tense: "past", models: ["I ate at a Thai restaurant.", "I cooked at home."] },
  ] },
  { ico: "📅", name: "Next weekend", color: "#8e4ec6", qs: [
    { q: "What are you going to do next weekend?", es: "¿Qué vas a hacer el próximo fin de semana?", tense: "future", models: ["I'm going to visit a friend.", "I'm going to rest and study English."] },
    { q: "Where would you like to go on your next holiday?", es: "¿A dónde te gustaría ir en tus próximas vacaciones?", tense: "future", models: ["I'd like to go to Cairns.", "I want to visit my family in Chile."] },
  ] },
  { ico: "🎬", name: "Movies", color: "#0f8b8d", qs: [
    { q: "When did you last go to the cinema?", es: "¿Cuándo fuiste al cine por última vez?", tense: "past", models: ["I went last month.", "I don't remember. It was a long time ago."] },
    { q: "What kind of movies do you like?", es: "¿Qué tipo de películas te gustan?", tense: "present", models: ["I like comedies.", "I love action movies."] },
  ] },
  { ico: "💻", name: "Online", color: "#c2410c", qs: [
    { q: "How many hours are you online every day?", es: "¿Cuántas horas estás conectado/a cada día?", tense: "present", models: ["I'm online about four hours a day.", "Too many! Maybe six hours."] },
    { q: "Do you study English in your free time? How?", es: "¿Estudias inglés en tu tiempo libre? ¿Cómo?", tense: "present", models: ["Yes, I use this app every day.", "I watch videos in English."] },
  ] },
];

// ---------- 4) HE / SHE / IT (presente simple) ----------
// [sujeto, verbo, resto de la frase, traducción]
const HSI_ITEMS = [
  ["He", "play", "video games after work.", "Él juega videojuegos después del trabajo."],
  ["She", "watch", "TV every night.", "Ella ve tele todas las noches."],
  ["The class", "start", "at nine o'clock.", "La clase empieza a las nueve."],
  ["My mum", "study", "English online.", "Mi mamá estudia inglés en línea."],
  ["Tom", "go", "to the gym on Mondays.", "Tom va al gimnasio los lunes."],
  ["She", "have", "two cats.", "Ella tiene dos gatos."],
  ["He", "fix", "cars in a garage.", "Él arregla autos en un taller."],
  ["The bus", "leave", "at 8:15.", "El bus sale a las 8:15."],
  ["My dad", "wash", "the car on Sundays.", "Mi papá lava el auto los domingos."],
  ["She", "fly", "to Perth every month.", "Ella vuela a Perth cada mes."],
  ["He", "do", "yoga in the park.", "Él hace yoga en el parque."],
  ["Ana", "teach", "Spanish at a school.", "Ana enseña español en un colegio."],
  ["My brother", "try", "new food every week.", "Mi hermano prueba comida nueva cada semana."],
  ["She", "finish", "work at five.", "Ella termina de trabajar a las cinco."],
  ["He", "miss", "his family a lot.", "Él extraña mucho a su familia."],
  ["It", "rain", "a lot in winter.", "Llueve mucho en invierno."],
  ["My friend", "live", "near the beach.", "Mi amigo/a vive cerca de la playa."],
  ["He", "buy", "a coffee every morning.", "Él compra un café cada mañana."],
  ["She", "email", "her boss every day.", "Ella le escribe un correo a su jefe todos los días."],
  ["My sister", "carry", "a big bag.", "Mi hermana lleva un bolso grande."],
  ["He", "relax", "on the weekend.", "Él se relaja el fin de semana."],
  ["The shop", "close", "at six.", "La tienda cierra a las seis."],
].map(([s, v, rest, es]) => ({ s, v, rest, es }));

// Explicación de la regla según cómo termina el verbo
function hsiRule(v) {
  if (v === "have") return "Irregular: have → <b>has</b> (nunca «haves»).";
  if (v === "go" || v === "do") return `Termina en -o → se agrega <b>-es</b>: ${v} → ${v}es.`;
  if (/(s|sh|ch|x|z)$/.test(v)) return `Termina en s, sh, ch o x → se agrega <b>-es</b>: ${v} → ${v}es.`;
  if (/[^aeiou]y$/.test(v)) return `Consonante + y → cambia a <b>-ies</b>: ${v} → ${v.slice(0, -1)}ies.`;
  return `Regla general: se agrega <b>-s</b>: ${v} → ${v}s.`;
}
