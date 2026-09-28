// =====================================================================
// 📚 VERBOS
// Formato de cada línea:
//   español|inglés                    → verbo regular (se conjuga solo: -ed)
//   español|inglés|*                  → regular que duplica la consonante (stop → stopped)
//   español|inglés|pasado|participio  → verbo irregular
//   ...|*  al final de un irregular   → duplica consonante en -ing (run → running)
// =====================================================================
const VERB_DATA = `
ser / estar|be|was / were|been
tener / haber|have|had|had
hacer (acción, tarea)|do|did|done
hacer / fabricar / preparar|make|made|made
decir|say|said|said
ir|go|went|gone
conseguir / obtener / llegar|get|got|gotten|*
saber / conocer|know|knew|known
pensar / creer|think|thought|thought
tomar / llevar (tiempo)|take|took|taken
ver|see|saw|seen
venir|come|came|come
dar|give|gave|given
encontrar|find|found|found
decir / contar (a alguien)|tell|told|told
convertirse / volverse|become|became|become
irse / salir / dejar|leave|left|left
sentir|feel|felt|felt
traer|bring|brought|brought
empezar / comenzar|begin|began|begun|*
guardar / mantener / seguir|keep|kept|kept
sostener / agarrar|hold|held|held
escribir|write|wrote|written
estar de pie / pararse|stand|stood|stood
oír|hear|heard|heard
dejar / permitir|let|let|let|*
significar / querer decir|mean|meant|meant
poner / fijar / establecer|set|set|set|*
conocer (a alguien) / reunirse|meet|met|met
correr|run|ran|run|*
pagar|pay|paid|paid
sentarse|sit|sat|sat|*
hablar (un idioma) / dar un discurso|speak|spoke|spoken
guiar / liderar|lead|led|led
leer|read|read|read
crecer / cultivar|grow|grew|grown
perder|lose|lost|lost
caer / caerse|fall|fell|fallen
enviar / mandar|send|sent|sent
construir|build|built|built
entender / comprender|understand|understood|understood
dibujar|draw|drew|drawn
romper|break|broke|broken
gastar / pasar (tiempo)|spend|spent|spent
cortar|cut|cut|cut|*
subir / elevarse / levantarse|rise|rose|risen
manejar / conducir|drive|drove|driven
comprar|buy|bought|bought
llevar puesto / usar (ropa)|wear|wore|worn
elegir / escoger|choose|chose|chosen
lanzar / tirar / arrojar|throw|threw|thrown
atrapar / agarrar / tomar (bus, tren)|catch|caught|caught
ganar (competencia)|win|won|won|*
olvidar|forget|forgot|forgotten|*
vender|sell|sold|sold
pelear / luchar|fight|fought|fought
enseñar|teach|taught|taught
comer|eat|ate|eaten
cantar|sing|sang|sung
dormir|sleep|slept|slept
beber / tomar (bebida)|drink|drank|drunk
nadar|swim|swam|swum|*
volar|fly|flew|flown
montar / andar en (bici, caballo)|ride|rode|ridden
esconder / ocultar|hide|hid|hidden
sacudir / agitar|shake|shook|shaken
robar (algo)|steal|stole|stolen
morder|bite|bit|bitten
soplar|blow|blew|blown
cavar|dig|dug|dug|*
alimentar / dar de comer|feed|fed|fed
perdonar|forgive|forgave|forgiven
congelar|freeze|froze|frozen
colgar|hang|hung|hung
golpear / pegar|hit|hit|hit|*
doler / lastimar|hurt|hurt|hurt
prestar|lend|lent|lent
encender (fuego) / iluminar|light|lit|lit
poner / colocar|put|put|put|*
renunciar / dejar (de hacer)|quit|quit|quit|*
sonar (timbre, teléfono) / llamar|ring|rang|rung
disparar / filmar|shoot|shot|shot
cerrar (de golpe)|shut|shut|shut|*
hundirse|sink|sank|sunk
deslizar|slide|slid|slid
extender / untar / difundir|spread|spread|spread
pegar (adherir)|stick|stuck|stuck
jurar / decir groserías|swear|swore|sworn
rasgar / romper (papel)|tear|tore|torn
despertar|wake|woke|woken
apostar|bet|bet|bet|*
doblar / inclinarse|bend|bent|bent
costar|cost|cost|cost
quedar bien (ropa)|fit|fit|fit|*
huir|flee|fled|fled
prohibir|forbid|forbade|forbidden|*
vencer / ganarle a / latir|beat|beat|beaten
tratar (con) / repartir|deal|dealt|dealt
barrer|sweep|swept|swept
brillar|shine|shone|shone
mostrar / enseñar|show|showed|shown
retirar (dinero)|withdraw|withdrew|withdrawn
quedarse dormido (despertarse tarde)|oversleep|overslept|overslept
levantarse|get up|got up|gotten up|*
despertarse|wake up|woke up|woken up
rendirse / dejar (un hábito)|give up|gave up|given up
averiguar / descubrir|find out|found out|found out
salir (de fiesta)|go out|went out|gone out
acostarse / irse a dormir|go to bed|went to bed|gone to bed
volver / regresar|come back|came back|come back
ponerse (ropa)|put on|put on|put on|*
quitarse (ropa) / despegar (avión)|take off|took off|taken off
cuidar (a alguien)|take care of|took care of|taken care of
llevarse bien|get along|got along|gotten along|*
aceptar|accept
agregar / añadir|add
admitir|admit|*
estar de acuerdo|agree
permitir|allow
contestar / responder|answer
aparecer|appear
discutir (pelear)|argue
preguntar / pedir|ask
llegar|arrive
evitar|avoid
hornear|bake
creer|believe
pertenecer|belong
pedir prestado|borrow
reservar|book
hervir|boil
respirar|breathe
cepillar|brush
llamar (por teléfono)|call
cancelar|cancel
cuidar / importar (a alguien)|care
llevar / cargar|carry
cambiar|change
charlar / chatear|chat|*
revisar / verificar|check
animar / alentar|cheer
limpiar|clean
subir / escalar|climb
cerrar|close
completar|complete
conectar|connect
considerar|consider
continuar|continue
controlar|control|*
cocinar|cook
copiar|copy
contar (números)|count
crear|create
cruzar|cross
llorar|cry
bailar|dance
decidir|decide
decorar|decorate
entregar|deliver
depender|depend
describir|describe
diseñar|design
desarrollar|develop
morir|die
desaparecer|disappear
descubrir|discover
hablar de / discutir (un tema)|discuss
descargar|download
arrastrar|drag|*
soñar|dream
dejar caer / tirar|drop|*
ganar (dinero)|earn
disfrutar|enjoy
entrar|enter
escapar|escape
explicar|explain
fallar / reprobar|fail
llenar|fill
terminar / acabar|finish
arreglar / reparar|fix
seguir|follow
adivinar|guess
pasar / suceder|happen
odiar|hate
ayudar|help
esperar (tener esperanza)|hope
abrazar|hug|*
apurarse / darse prisa|hurry
imaginar|imagine
mejorar|improve
incluir|include
invitar|invite
trotar|jog|*
unirse|join
bromear|joke
saltar|jump
matar|kill
besar|kiss
tocar (la puerta)|knock
aterrizar|land
reír / reírse|laugh
aprender|learn
mentir|lie
gustar|like
escuchar|listen
vivir|live
mirar / verse (parecer)|look
buscar|look for
amar / encantar|love
casarse|marry
importar (tener importancia)|matter
extrañar / perder (bus, clase)|miss
mover / mudarse|move
necesitar|need
asentir (con la cabeza)|nod|*
notar / darse cuenta|notice
ofrecer|offer
abrir|open
ordenar / pedir (comida)|order
pintar|paint
estacionar|park
pasar / aprobar (examen)|pass
recoger / levantar|pick up
planear / planificar|plan|*
jugar / tocar (instrumento)|play
rezar|pray
preferir|prefer|*
preparar|prepare
fingir|pretend
imprimir|print
prometer|promise
jalar / tirar de|pull
empujar|push
llover|rain
alcanzar / llegar a|reach
darse cuenta|realize
recibir|receive
recomendar|recommend
recordar|remember
rentar / alquilar / arrendar|rent
repetir|repeat
reemplazar|replace
descansar|rest
regresar / devolver|return
robar (a alguien)|rob|*
guardar / ahorrar / salvar|save
gritar|shout
compartir|share
ir de compras|shop|*
saltarse / omitir|skip|*
sonreír|smile
oler|smell
fumar|smoke
deletrear|spell
empezar / arrancar|start
quedarse|stay
parar / detener / dejar de|stop|*
estudiar|study
sugerir|suggest
apoyar|support
suponer|suppose
sorprender|surprise
hablar / platicar|talk
saborear / probar (comida)|taste
mandar mensaje|text
agradecer|thank
tocar|touch
viajar|travel
intentar / probar|try
girar / voltear|turn
apagar|turn off
encender (aparato)|turn on
subir (archivo)|upload
usar / utilizar|use
visitar|visit
esperar (a alguien)|wait
caminar|walk
querer|want
lavar|wash
ver / mirar (TV, películas)|watch
desear|wish
preocuparse|worry
trabajar / funcionar|work
bostezar|yawn
`;

// ---- Niveles ----
// ⭐ Los "más importantes" son A1. Los menos comunes son B1. El resto es A2.
const VERBS_A1 = "be have do make say go get know think take see come give find tell feel leave bring begin write hear meet run pay sit speak read lose buy eat drink sleep drive sell teach swim forget understand put wear like love want need work live play watch listen talk walk cook clean study start finish help call open close ask answer use visit wait travel stay try look arrive dance stop learn".split(" ");
const VERBS_B1 = "rise hang hide shake steal bite blow dig feed forgive freeze lend light ring shoot shut sink slide spread stick swear tear bet bend flee forbid beat deal sweep shine withdraw oversleep lead set hold fight throw quit admit belong breathe consider depend develop discuss earn escape imagine improve include notice pretend realize receive recommend replace suggest support suppose surprise yawn nod pray rob drag knock argue avoid deliver disappear discover fail matter".split(" ")
  .concat(["give up", "find out", "take care of", "get along"]);

// ---- Ejemplos (los *asteriscos* marcan el verbo) ----
// Orden: 🟢 presente, 🔴 pasado, 🟣 participio (have + participio)
const VERB_EXAMPLES = {
  be: ["I *am* happy today.|Hoy estoy feliz.", "I *was* tired yesterday.|Ayer estaba cansado/a.", "I have *been* to Sydney.|He estado en Sídney."],
  have: ["I *have* two brothers.|Tengo dos hermanos.", "I *had* a great day.|Tuve un gran día.", "I have *had* this phone for years.|Tengo este teléfono hace años."],
  do: ["I *do* my homework at night.|Hago mi tarea en la noche.", "I *did* the dishes.|Lavé los platos.", "I have *done* my work.|Ya hice mi trabajo."],
  make: ["She *makes* great coffee.|Ella hace un café buenísimo.", "I *made* dinner last night.|Anoche hice la cena.", "I have *made* a mistake.|Cometí un error."],
  say: ["He always *says* hello.|Él siempre saluda.", "She *said* yes!|¡Ella dijo que sí!", "I have *said* it many times.|Lo he dicho muchas veces."],
  go: ["I *go* to work by bus.|Voy al trabajo en bus.", "I *went* to the beach yesterday.|Ayer fui a la playa.", "She has *gone* home.|Ella se fue a casa."],
  get: ["I *get* home at six.|Llego a casa a las seis.", "I *got* a new job.|Conseguí un trabajo nuevo.", "It has *gotten* cold.|Se ha puesto frío."],
  know: ["I *know* the answer.|Sé la respuesta.", "I *knew* it!|¡Lo sabía!", "I have *known* her for years.|La conozco hace años."],
  think: ["I *think* it's a good idea.|Creo que es buena idea.", "I *thought* you were busy.|Pensé que estabas ocupado/a.", "I have *thought* about it.|Lo he pensado."],
  take: ["I *take* the train every day.|Tomo el tren todos los días.", "I *took* a photo.|Tomé una foto.", "Someone has *taken* my seat.|Alguien tomó mi asiento."],
  see: ["I *see* my friends on weekends.|Veo a mis amigos los fines de semana.", "I *saw* a great movie.|Vi una película genial.", "I have never *seen* snow.|Nunca he visto la nieve."],
  come: ["She *comes* from Chile.|Ella es de Chile.", "They *came* to my party.|Vinieron a mi fiesta.", "Summer has *come*.|Llegó el verano."],
  give: ["I *give* my dog a treat every morning.|Le doy un premio a mi perro cada mañana.", "He *gave* me a gift.|Me dio un regalo.", "I have *given* my answer.|Ya di mi respuesta."],
  find: ["I never *find* my keys.|Nunca encuentro mis llaves.", "I *found* my keys!|¡Encontré mis llaves!", "Have you *found* a job?|¿Encontraste trabajo?"],
  tell: ["She *tells* great stories.|Ella cuenta historias geniales.", "I *told* him the truth.|Le dije la verdad.", "I have *told* you before.|Ya te lo he dicho."],
  feel: ["I *feel* great today.|Hoy me siento genial.", "I *felt* sick yesterday.|Ayer me sentí mal.", "I have never *felt* so happy.|Nunca me he sentido tan feliz."],
  leave: ["I *leave* home at 8.|Salgo de casa a las 8.", "She *left* early.|Ella se fue temprano.", "The bus has *left*.|El bus ya se fue."],
  bring: ["I *bring* my lunch to work.|Llevo mi almuerzo al trabajo.", "I *brought* you a coffee.|Te traje un café.", "Have you *brought* your passport?|¿Trajiste tu pasaporte?"],
  begin: ["Classes *begin* at nine.|Las clases empiezan a las nueve.", "It *began* to rain.|Empezó a llover.", "The movie has *begun*.|La película ya empezó."],
  write: ["I *write* in my diary.|Escribo en mi diario.", "I *wrote* an email.|Escribí un correo.", "I have *written* the report.|Ya escribí el informe."],
  hear: ["I *hear* music.|Escucho música.", "I *heard* a noise.|Oí un ruido.", "Have you *heard* the news?|¿Supiste la noticia?"],
  meet: ["I *meet* my friends on Fridays.|Me junto con mis amigos los viernes.", "I *met* my partner in Australia.|Conocí a mi pareja en Australia.", "Have we *met* before?|¿Nos conocemos?"],
  run: ["I *run* every morning.|Corro todas las mañanas.", "I *ran* 5 kilometers.|Corrí 5 kilómetros.", "I have *run* a marathon.|He corrido una maratón."],
  pay: ["I *pay* the rent every month.|Pago el arriendo cada mes.", "I *paid* by card.|Pagué con tarjeta.", "Have you *paid* the bill?|¿Pagaste la cuenta?"],
  sit: ["I *sit* next to Ana.|Me siento al lado de Ana.", "We *sat* in the park.|Nos sentamos en el parque.", "I have *sat* here all day.|He estado sentado/a aquí todo el día."],
  speak: ["I *speak* Spanish.|Hablo español.", "I *spoke* to the manager.|Hablé con el gerente.", "I have *spoken* to her.|Ya hablé con ella."],
  read: ["I *read* before bed.|Leo antes de dormir.", "I *read* a book last week.|Leí un libro la semana pasada.", "I have *read* this book.|He leído este libro."],
  lose: ["I always *lose* my keys.|Siempre pierdo mis llaves.", "We *lost* the game.|Perdimos el partido.", "I have *lost* my phone.|Perdí mi teléfono."],
  buy: ["I *buy* bread every day.|Compro pan todos los días.", "I *bought* new shoes.|Compré zapatos nuevos.", "I have *bought* the tickets.|Ya compré los boletos."],
  eat: ["I *eat* breakfast every day.|Desayuno todos los días.", "I *ate* breakfast yesterday.|Ayer desayuné.", "I have *eaten* breakfast.|Ya desayuné."],
  drink: ["I *drink* coffee every morning.|Tomo café cada mañana.", "I *drank* too much coffee.|Tomé demasiado café.", "I have *drunk* two glasses of water.|He tomado dos vasos de agua."],
  sleep: ["I *sleep* eight hours.|Duermo ocho horas.", "I *slept* badly last night.|Anoche dormí mal.", "I haven't *slept* well.|No he dormido bien."],
  drive: ["I *drive* to work.|Voy al trabajo en auto.", "She *drove* to Melbourne.|Ella manejó hasta Melbourne.", "I have never *driven* on the left.|Nunca he manejado por la izquierda."],
  sell: ["They *sell* fresh fruit.|Venden fruta fresca.", "I *sold* my car.|Vendí mi auto.", "They have *sold* all the tickets.|Vendieron todas las entradas."],
  teach: ["She *teaches* English.|Ella enseña inglés.", "My dad *taught* me to swim.|Mi papá me enseñó a nadar.", "I have *taught* for five years.|He enseñado durante cinco años."],
  swim: ["I *swim* at the beach.|Nado en la playa.", "We *swam* in the ocean.|Nadamos en el mar.", "Have you ever *swum* with dolphins?|¿Has nadado con delfines?"],
  forget: ["I always *forget* his name.|Siempre olvido su nombre.", "I *forgot* my wallet.|Olvidé mi billetera.", "I have *forgotten* the password.|Olvidé la contraseña."],
  understand: ["I *understand* a little English.|Entiendo un poco de inglés.", "I *understood* everything!|¡Entendí todo!", "Have you *understood* the lesson?|¿Entendiste la lección?"],
  put: ["I *put* sugar in my coffee.|Le pongo azúcar al café.", "I *put* my keys on the table.|Puse mis llaves en la mesa.", "Where have you *put* my phone?|¿Dónde pusiste mi teléfono?"],
  wear: ["I *wear* jeans every day.|Uso jeans todos los días.", "She *wore* a red dress.|Ella llevaba un vestido rojo.", "I have never *worn* a suit.|Nunca he usado traje."],
  like: ["I *like* pizza.|Me gusta la pizza.", "I *liked* the movie.|Me gustó la película.", "I have always *liked* music.|Siempre me ha gustado la música."],
  love: ["I *love* the beach.|Me encanta la playa.", "I *loved* the concert.|Me encantó el concierto.", "I have always *loved* dogs.|Siempre me han encantado los perros."],
  want: ["I *want* a coffee.|Quiero un café.", "I *wanted* to call you.|Quería llamarte.", "I have always *wanted* to visit Australia.|Siempre he querido visitar Australia."],
  need: ["I *need* help.|Necesito ayuda.", "I *needed* a break.|Necesitaba un descanso.", "I have *needed* your help all week.|He necesitado tu ayuda toda la semana."],
  work: ["I *work* in a restaurant.|Trabajo en un restaurante.", "I *worked* late yesterday.|Ayer trabajé hasta tarde.", "I have *worked* here for two years.|Trabajo aquí hace dos años."],
  live: ["I *live* in Sydney.|Vivo en Sídney.", "I *lived* in Chile before.|Antes vivía en Chile.", "I have *lived* here for a year.|Vivo aquí hace un año."],
  play: ["I *play* soccer on Sundays.|Juego fútbol los domingos.", "We *played* cards last night.|Anoche jugamos cartas.", "Have you *played* this game?|¿Has jugado este juego?"],
  watch: ["I *watch* TV at night.|Veo tele en la noche.", "We *watched* a movie.|Vimos una película.", "I have *watched* all the episodes.|He visto todos los capítulos."],
  listen: ["I *listen* to podcasts.|Escucho podcasts.", "I *listened* to the radio.|Escuché la radio.", "Have you *listened* to her new song?|¿Escuchaste su nueva canción?"],
  talk: ["We *talk* every day.|Hablamos todos los días.", "I *talked* to my boss.|Hablé con mi jefe.", "I have *talked* to him already.|Ya hablé con él."],
  walk: ["I *walk* to work.|Camino al trabajo.", "We *walked* on the beach.|Caminamos por la playa.", "I have *walked* 10,000 steps today.|Hoy he caminado 10.000 pasos."],
  cook: ["I *cook* dinner every night.|Cocino la cena todas las noches.", "I *cooked* pasta.|Cociné pasta.", "Have you ever *cooked* paella?|¿Has cocinado paella alguna vez?"],
  clean: ["I *clean* my room on Saturdays.|Limpio mi pieza los sábados.", "I *cleaned* the kitchen.|Limpié la cocina.", "I have *cleaned* the whole house.|He limpiado toda la casa."],
  study: ["I *study* English every day.|Estudio inglés todos los días.", "I *studied* for the test.|Estudié para la prueba.", "I have *studied* a lot this week.|He estudiado mucho esta semana."],
  start: ["Work *starts* at nine.|El trabajo empieza a las nueve.", "I *started* a new course.|Empecé un curso nuevo.", "Has the movie *started*?|¿Ya empezó la película?"],
  finish: ["I *finish* work at five.|Termino de trabajar a las cinco.", "I *finished* the book.|Terminé el libro.", "Have you *finished*?|¿Terminaste?"],
  help: ["I *help* my mom on weekends.|Ayudo a mi mamá los fines de semana.", "She *helped* me a lot.|Ella me ayudó mucho.", "You have *helped* me so much.|Me has ayudado muchísimo."],
  call: ["I *call* my parents on Sundays.|Llamo a mis papás los domingos.", "I *called* you last night.|Te llamé anoche.", "Have you *called* the doctor?|¿Llamaste al doctor?"],
  open: ["The shop *opens* at 9.|La tienda abre a las 9.", "I *opened* the window.|Abrí la ventana.", "Have you *opened* the email?|¿Abriste el correo?"],
  close: ["The bank *closes* at 4.|El banco cierra a las 4.", "I *closed* the door.|Cerré la puerta.", "They have *closed* the road.|Cerraron el camino."],
  ask: ["I always *ask* questions.|Siempre hago preguntas.", "I *asked* for directions.|Pregunté cómo llegar.", "Have you *asked* the teacher?|¿Le preguntaste al profe?"],
  answer: ["She never *answers* my messages.|Ella nunca contesta mis mensajes.", "I *answered* all the questions.|Contesté todas las preguntas.", "Has he *answered* your email?|¿Te respondió el correo?"],
  use: ["I *use* my phone a lot.|Uso mucho mi teléfono.", "I *used* a map.|Usé un mapa.", "Have you *used* this app before?|¿Has usado esta app antes?"],
  visit: ["I *visit* my grandma every week.|Visito a mi abuela cada semana.", "We *visited* Melbourne.|Visitamos Melbourne.", "I have never *visited* Asia.|Nunca he visitado Asia."],
  wait: ["I *wait* for the bus here.|Espero el bus aquí.", "I *waited* for an hour.|Esperé una hora.", "I have *waited* all day.|He esperado todo el día."],
  travel: ["I *travel* a lot for work.|Viajo mucho por trabajo.", "We *traveled* to Peru.|Viajamos a Perú.", "Have you ever *traveled* alone?|¿Has viajado solo/a alguna vez?"],
  stay: ["I *stay* home on Sundays.|Me quedo en casa los domingos.", "We *stayed* at a hotel.|Nos quedamos en un hotel.", "I have *stayed* here before.|Ya me he quedado aquí."],
  try: ["I *try* to exercise every day.|Intento hacer ejercicio todos los días.", "I *tried* sushi for the first time.|Probé sushi por primera vez.", "Have you *tried* this?|¿Has probado esto?"],
  look: ["You *look* happy!|¡Te ves feliz!", "I *looked* everywhere.|Busqué por todas partes.", "Have you *looked* in your bag?|¿Buscaste en tu bolso?"],
  arrive: ["The train *arrives* at 10.|El tren llega a las 10.", "I *arrived* late.|Llegué tarde.", "Has the package *arrived*?|¿Llegó el paquete?"],
  dance: ["I *dance* salsa.|Bailo salsa.", "We *danced* all night.|Bailamos toda la noche.", "I have never *danced* tango.|Nunca he bailado tango."],
  stop: ["The bus *stops* here.|El bus para aquí.", "It *stopped* raining.|Dejó de llover.", "Has the rain *stopped*?|¿Ya paró la lluvia?"],
  learn: ["I *learn* new words every day.|Aprendo palabras nuevas cada día.", "I *learned* a lot today.|Hoy aprendí mucho.", "I have *learned* so much!|¡He aprendido tanto!"],
};

// ---- Formas en español para buscar sin saber el infinitivo ----
// (las formas regulares se encuentran solas por la raíz: comí → com-er)
const SPANISH_FORMS = {
  soy: "be", eres: "be", es: "be", somos: "be", son: "be", era: "be", fui: "go be", fue: "go be", fuimos: "go be", fueron: "go be",
  estoy: "be", esta: "be", estas: "be", estamos: "be", estan: "be", estuve: "be", estaba: "be",
  voy: "go", vas: "go", va: "go", vamos: "go", van: "go", iba: "go", yendo: "go",
  tengo: "have", tienes: "have", tiene: "have", tuve: "have", tuvo: "have", he: "have", has: "have", ha: "have", hay: "have",
  hago: "do make", hice: "do make", hizo: "do make", hecho: "do make",
  digo: "say tell", dices: "say tell", dice: "say tell", dije: "say tell", dijo: "say tell", dicho: "say tell", diciendo: "say tell",
  puse: "put", pongo: "put", puesto: "put", vengo: "come", vine: "come", vino: "come", viene: "come", viniendo: "come",
  se: "know", supe: "know", sabia: "know", conozco: "know meet", quiero: "want", quise: "want", quiere: "want",
  pienso: "think", piensa: "think", duermo: "sleep", duerme: "sleep", durmio: "sleep", durmiendo: "sleep",
  juego: "play", juega: "play", encuentro: "find", encuentra: "find", vuelvo: "come back", vuelve: "come back",
  traje: "bring", traigo: "bring", trajo: "bring", trayendo: "bring", lei: "read", leo: "read", leyo: "read", leyendo: "read",
  oi: "hear", oigo: "hear", oyo: "hear", vi: "see", veo: "see", vio: "see", visto: "see", doy: "give", di: "give", dio: "give",
  pido: "ask order", pidio: "ask order", siento: "feel", sintio: "feel", salgo: "leave go out", muero: "die", murio: "die", muerto: "die",
  escrito: "write", roto: "break", vuelo: "fly", cuesta: "cost", costo: "cost", empiezo: "begin start", empezo: "begin start",
  entiendo: "understand", entendi: "understand", pierdo: "lose", perdi: "lose", prefiero: "prefer", sigo: "follow", cierro: "close",
};

// ---- Reglas para conjugar verbos regulares ----
const VOWELS = "aeiou";
const endsConsonantY = (w) => w.endsWith("y") && !VOWELS.includes(w[w.length - 2]);

function regularPast(w, double) {
  if (double) return w + w[w.length - 1] + "ed";
  if (w.endsWith("e")) return w + "d";
  if (endsConsonantY(w)) return w.slice(0, -1) + "ied";
  return w + "ed";
}
function thirdPerson(w) {
  if (w === "have") return "has";
  if (w === "be") return "is";
  if (endsConsonantY(w)) return w.slice(0, -1) + "ies";
  if (/(s|x|z|ch|sh|o)$/.test(w)) return w + "es";
  return w + "s";
}
function gerund(w, double) {
  if (w === "be") return "being";
  if (double) return w + w[w.length - 1] + "ing";
  if (w.endsWith("ie")) return w.slice(0, -2) + "ying";
  if (w.endsWith("e") && !/(ee|ye|oe)$/.test(w)) return w.slice(0, -1) + "ing";
  return w + "ing";
}
// Para verbos de varias palabras (get up, look for) se conjuga solo la primera
function onFirstWord(base, fn) {
  const [first, ...rest] = base.split(" ");
  return [fn(first), ...rest].join(" ");
}

const VERBS = VERB_DATA.trim().split("\n").map((line) => {
  const [es, base, a, b, c] = line.split("|");
  const irregular = a !== undefined && a !== "*";
  const double = irregular ? c === "*" : a === "*";
  const past = irregular ? a : onFirstWord(base, (w) => regularPast(w, double));
  const level = VERBS_A1.includes(base) ? "A1" : VERBS_B1.includes(base) ? "B1" : "A2";
  const examples = (VERB_EXAMPLES[base] || []).map((s) => {
    const [en, esText] = s.split("|");
    return { en, es: esText };
  });
  return {
    es, base, irregular, past, level,
    important: level === "A1",
    participle: irregular ? b : past,
    third: onFirstWord(base, thirdPerson),
    ing: onFirstWord(base, (w) => gerund(w, double)),
    examples,
  };
}).sort((x, y) => x.es.localeCompare(y.es, "es"));

const VERB_BY_BASE = Object.fromEntries(VERBS.map((v) => [v.base, v]));
