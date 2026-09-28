// =====================================================================
// 🎤 SPEAKING — preguntas para responder hablando
// tense: "present" | "past" | "future"  (ayuda al corrector a revisar el tiempo verbal)
// models: ejemplos de respuestas correctas que el usuario puede escuchar
// =====================================================================
const SPEAKING_TOPICS = [
  {
    id: "intro", level: "A1", emoji: "🙋", title: "Presentarme", prompts: [
      { q: "What's your name?", es: "¿Cómo te llamas?", tense: "present", models: ["My name is Ana.", "I'm Carlos."] },
      { q: "Where are you from?", es: "¿De dónde eres?", tense: "present", models: ["I'm from Chile.", "I come from Colombia."] },
      { q: "How old are you?", es: "¿Cuántos años tienes?", tense: "present", models: ["I'm 28 years old.", "I'm 35."] },
      { q: "What do you do?", es: "¿A qué te dedicas?", tense: "present", models: ["I'm a waiter.", "I work in a hotel."] },
      { q: "What do you like to do in your free time?", es: "¿Qué te gusta hacer en tu tiempo libre?", tense: "present", models: ["I like to play soccer and watch movies.", "I love going to the beach."] },
    ],
  },
  {
    id: "restaurant", level: "A1", emoji: "🍽️", title: "Restaurante", prompts: [
      { q: "Hi! How many people?", es: "¡Hola! ¿Cuántas personas?", tense: "present", models: ["A table for two, please.", "Just one, thanks."] },
      { q: "What would you like to drink?", es: "¿Qué quiere tomar?", tense: "present", models: ["Can I get a water, please?", "I'd like a coffee, please."] },
      { q: "Are you ready to order?", es: "¿Está listo/a para ordenar?", tense: "present", models: ["Yes, I'd like the chicken, please.", "Can I get a burger with fries?"] },
      { q: "How was everything?", es: "¿Qué tal estuvo todo?", tense: "past", models: ["It was delicious, thank you!", "Everything was great."] },
    ],
  },
  {
    id: "supermarket", level: "A1", emoji: "🛒", title: "Supermercado", prompts: [
      { q: "Can I help you find something?", es: "¿Le ayudo a encontrar algo?", tense: "present", models: ["Yes, where can I find the milk?", "I'm looking for bread."] },
      { q: "Do you need a bag?", es: "¿Necesita bolsa?", tense: "present", models: ["No, thanks. I have one.", "Yes, please."] },
      { q: "How would you like to pay?", es: "¿Cómo quiere pagar?", tense: "present", models: ["By card, please.", "I'll pay cash."] },
    ],
  },
  {
    id: "my-day", level: "A1", emoji: "☀️", title: "Hablar de mi día", prompts: [
      { q: "What time do you usually wake up?", es: "¿A qué hora te despiertas normalmente?", tense: "present", models: ["I usually wake up at 7.", "I wake up at 6:30."] },
      { q: "What do you usually eat for breakfast?", es: "¿Qué desayunas normalmente?", tense: "present", models: ["I usually eat toast and coffee.", "I have eggs and juice."] },
      { q: "What did you do yesterday?", es: "¿Qué hiciste ayer?", tense: "past", models: ["Yesterday I went to work and then I cooked dinner.", "I stayed home and watched a movie."] },
      { q: "What did you eat last night?", es: "¿Qué comiste anoche?", tense: "past", models: ["I ate pasta.", "I had chicken and rice."] },
      { q: "How was your day?", es: "¿Cómo estuvo tu día?", tense: "past", models: ["It was great! I finished work early.", "It was busy, but good."] },
    ],
  },
  {
    id: "directions", level: "A2", emoji: "🧭", title: "Pedir direcciones", prompts: [
      { q: "You're lost. Ask someone for the train station.", es: "Estás perdido/a. Pregunta por la estación de tren.", tense: "present", models: ["Excuse me, where is the train station?", "Sorry, how do I get to the train station?"] },
      { q: "Ask if it's far.", es: "Pregunta si está lejos.", tense: "present", models: ["Is it far from here?", "Can I walk there?"] },
      { q: "The person says: 'Go straight and turn left.' Repeat to confirm.", es: "Te dicen: sigue derecho y dobla a la izquierda. Repite para confirmar.", tense: "present", models: ["So I go straight and turn left?", "Straight and then left, right?"] },
      { q: "Thank the person.", es: "Dale las gracias.", tense: "present", models: ["Thank you so much!", "Thanks heaps, mate!"] },
    ],
  },
  {
    id: "airport", level: "A2", emoji: "✈️", title: "Aeropuerto", prompts: [
      { q: "Can I see your passport, please?", es: "¿Me muestra su pasaporte?", tense: "present", models: ["Sure, here you go.", "Here is my passport."] },
      { q: "What's the purpose of your visit?", es: "¿Cuál es el motivo de su visita?", tense: "present", models: ["I'm here on holiday.", "I'm here to study English."] },
      { q: "How long are you going to stay?", es: "¿Cuánto tiempo se va a quedar?", tense: "future", models: ["I'm going to stay for two weeks.", "I'll stay for a month."] },
      { q: "Did you pack your bag yourself?", es: "¿Hizo su maleta usted mismo/a?", tense: "past", models: ["Yes, I packed it myself.", "Yes, I did."] },
    ],
  },
  {
    id: "plans", level: "A2", emoji: "📅", title: "Hablar de mis planes", prompts: [
      { q: "What are you going to do this weekend?", es: "¿Qué vas a hacer este fin de semana?", tense: "future", models: ["I'm going to visit my friends.", "I'm going to go to the beach."] },
      { q: "Where will you go on your next holiday?", es: "¿A dónde irás en tus próximas vacaciones?", tense: "future", models: ["I'll go to Bali.", "I'm going to travel to Peru."] },
      { q: "What are your plans for tonight?", es: "¿Qué planes tienes para esta noche?", tense: "future", models: ["I'm going to cook dinner and relax.", "I'm meeting a friend for dinner."] },
    ],
  },
  {
    id: "work", level: "A2", emoji: "💼", title: "Trabajo", prompts: [
      { q: "Where do you work?", es: "¿Dónde trabajas?", tense: "present", models: ["I work in a restaurant.", "I work at a hotel in the city."] },
      { q: "What did you do at work yesterday?", es: "¿Qué hiciste ayer en el trabajo?", tense: "past", models: ["I served customers and cleaned the kitchen.", "I had a meeting and answered emails."] },
      { q: "Why do you want this job?", es: "¿Por qué quieres este trabajo?", tense: "present", models: ["I want this job because I love working with people.", "I'd like to learn and grow here."] },
      { q: "Tell me about your last job.", es: "Háblame de tu último trabajo.", tense: "past", models: ["I worked as a barista for two years.", "I was a receptionist in a hotel."] },
    ],
  },
  {
    id: "chat", level: "B1", emoji: "🗣️", title: "Conversar con alguien", prompts: [
      { q: "Have you ever been to another country?", es: "¿Has estado en otro país?", tense: "present", models: ["Yes, I have been to Argentina.", "No, I haven't, but I'd love to go to Japan."] },
      { q: "What's the best trip you've ever had?", es: "¿Cuál es el mejor viaje que has tenido?", tense: "past", models: ["The best trip was to Cusco. I loved it.", "I went to the Great Barrier Reef and it was amazing."] },
      { q: "If you could live anywhere, where would you live?", es: "Si pudieras vivir en cualquier lugar, ¿dónde vivirías?", tense: "present", models: ["If I could live anywhere, I would live in Sydney.", "I'd live near the beach."] },
      { q: "What did you use to do when you were a child?", es: "¿Qué hacías cuando eras niño/a?", tense: "past", models: ["I used to play soccer with my friends.", "When I was a child, I played outside every day."] },
    ],
  },
];

// =====================================================================
// 💬 CONVERSACIONES — la respuesta del usuario decide cómo sigue
// Cada paso: bot (lo que dice la app), es (traducción), hints (ideas para responder),
// routes: [ [/palabras clave/, "siguiente paso", "reacción opcional"] ], next: paso por defecto
// =====================================================================
const CONVERSATIONS = [
  {
    id: "cafe", level: "A1", emoji: "☕", title: "En la cafetería", desc: "Pide un café a tu gusto",
    start: "hello", steps: {
      hello: { bot: "Hi there! What can I get for you?", es: "¡Hola! ¿Qué te sirvo?", hints: ["Can I get a flat white, please?", "A cappuccino, please."],
        routes: [[/tea/i, "tea", "Sure, one tea!"], [/water|juice/i, "size", "Sure thing!"]], next: "size" },
      tea: { bot: "Would you like milk with that?", es: "¿Lo quieres con leche?", hints: ["Yes, please.", "No, thanks."], next: "here" },
      size: { bot: "What size? Small, medium or large?", es: "¿De qué tamaño? ¿Chico, mediano o grande?", hints: ["Medium, please.", "A large one, please."],
        routes: [[/small/i, "milk", "Small, got it."], [/large|big/i, "milk", "Large, nice!"]], next: "milk" },
      milk: { bot: "Any special milk? We have oat, soy and almond.", es: "¿Alguna leche especial? Tenemos de avena, soya y almendra.", hints: ["Oat milk, please.", "Regular milk is fine."], next: "here" },
      here: { bot: "For here or to go?", es: "¿Para aquí o para llevar?", hints: ["For here, please.", "To go, please."],
        routes: [[/here|stay/i, "pay", "Great, grab a seat!"], [/go|take away|takeaway/i, "pay", "No worries."]], next: "pay" },
      pay: { bot: "That's $5.50. Cash or card?", es: "Son $5,50. ¿Efectivo o tarjeta?", hints: ["Card, please.", "Cash."],
        routes: [[/card|tap/i, "end", "Just tap here. Thanks!"], [/cash/i, "end", "Here's your change!"]], next: "end" },
      end: { bot: "Your order will be ready in a minute. Have a good one! ☕", es: "Tu pedido estará listo en un minuto. ¡Que te vaya bien!", end: true },
    },
  },
  {
    id: "meet", level: "A1", emoji: "🤝", title: "Conocer a alguien", desc: "Preséntate en una fiesta",
    start: "hi", steps: {
      hi: { bot: "Hey! I'm Jack. What's your name?", es: "¡Hola! Soy Jack. ¿Cómo te llamas?", hints: ["I'm Ana. Nice to meet you!", "My name is Carlos."],
        save: { name: /(?:i'm|i am|my name is|name's|it's|call me)\s+([a-záéíóúñ]+)/i }, next: "from" },
      from: { bot: "Nice to meet you, {name}! Where are you from?", es: "¡Mucho gusto! ¿De dónde eres?", hints: ["I'm from Chile.", "I'm from Mexico, and you?"], next: "time" },
      time: { bot: "Cool! How long have you been here?", es: "¡Genial! ¿Cuánto tiempo llevas aquí?", hints: ["Just two weeks.", "About a year."], next: "do" },
      do: { bot: "And what do you do?", es: "¿Y a qué te dedicas?", hints: ["I'm a student.", "I work in a café."],
        routes: [[/student|study/i, "study", "Oh nice, a student!"]], next: "like" },
      study: { bot: "What are you studying?", es: "¿Qué estudias?", hints: ["I'm studying English.", "I study marketing."], next: "like" },
      like: { bot: "Do you like it here?", es: "¿Te gusta estar aquí?", hints: ["Yes, I love it!", "It's great, but it's expensive."],
        routes: [[/\b(no|not really|don't)\b/i, "why", "Oh, really?"]], next: "number" },
      why: { bot: "Why not? What's the hardest part?", es: "¿Por qué no? ¿Qué es lo más difícil?", hints: ["The language is difficult.", "I miss my family."], next: "number" },
      number: { bot: "Hey, we're going to the beach on Saturday. Do you want to come?", es: "Oye, vamos a la playa el sábado. ¿Quieres venir?", hints: ["Sure, I'm down!", "Sorry, I can't. I have to work."],
        routes: [[/\b(no|can't|cannot|sorry|busy|work)\b/i, "endNo"], [/yes|sure|down|love|ok|okay|yeah/i, "endYes"]], next: "endYes" },
      endYes: { bot: "Awesome! I'll text you the details. See you Saturday, {name}! 🏖️", es: "¡Genial! Te mando los detalles. ¡Nos vemos el sábado!", end: true },
      endNo: { bot: "No worries! Maybe next time. It was nice meeting you, {name}! 👋", es: "¡No pasa nada! Quizás la próxima. ¡Un gusto conocerte!", end: true },
    },
  },
  {
    id: "shop", level: "A1", emoji: "🛒", title: "En el supermercado", desc: "Busca un producto y paga",
    start: "help", steps: {
      help: { bot: "Hi! Can I help you find anything?", es: "¡Hola! ¿Le ayudo a encontrar algo?", hints: ["Yes, where is the bread?", "I'm looking for eggs."],
        routes: [[/\b(no|just looking)\b/i, "ok", "No worries!"]], next: "aisle" },
      ok: { bot: "Let me know if you need anything. Are you ready to pay?", es: "Avíseme si necesita algo. ¿Listo/a para pagar?", hints: ["Yes, I'm ready.", "Yes, please."], next: "bag" },
      aisle: { bot: "It's in aisle 5, next to the milk. Anything else?", es: "Está en el pasillo 5, al lado de la leche. ¿Algo más?", hints: ["No, that's all. Thanks!", "Yes, where are the bananas?"],
        routes: [[/where|looking|need/i, "fruit"]], next: "bag" },
      fruit: { bot: "Fruit and vegetables are at the front of the store. Ready to pay?", es: "Frutas y verduras están a la entrada. ¿Listo/a para pagar?", hints: ["Yes, thanks!"], next: "bag" },
      bag: { bot: "Do you need a bag? They're 15 cents.", es: "¿Necesita bolsa? Cuestan 15 centavos.", hints: ["No, thanks. I have one.", "Yes, one bag, please."], next: "card" },
      card: { bot: "That's $23.40. Would you like your receipt?", es: "Son $23,40. ¿Quiere su boleta?", hints: ["Yes, please.", "No, thanks."], next: "end" },
      end: { bot: "Thank you! Have a great day! 😊", es: "¡Gracias! ¡Que tenga un buen día!", end: true },
    },
  },
  {
    id: "restaurant", level: "A2", emoji: "🍝", title: "En el restaurante", desc: "Pide, pregunta y paga",
    start: "welcome", steps: {
      welcome: { bot: "Hi, welcome! Do you have a booking?", es: "¡Hola, bienvenido/a! ¿Tiene reserva?", hints: ["No, a table for two, please.", "Yes, under the name Ana."],
        routes: [[/\byes\b|under|booking|reservation/i, "booked", "Perfect, I found it!"]], next: "table" },
      booked: { bot: "Follow me, please. Here's the menu. Can I get you something to drink?", es: "Sígame, por favor. Aquí está la carta. ¿Algo para tomar?", hints: ["Just water, please.", "A glass of red wine, please."], next: "order" },
      table: { bot: "No problem. Inside or outside?", es: "No hay problema. ¿Adentro o afuera?", hints: ["Outside, please.", "Inside is fine."], next: "drinks" },
      drinks: { bot: "Here's the menu. What would you like to drink?", es: "Aquí está la carta. ¿Qué quiere tomar?", hints: ["Can I get a lemonade?", "Just water, thanks."], next: "order" },
      order: { bot: "Are you ready to order, or do you need a few minutes?", es: "¿Está listo/a para ordenar o necesita unos minutos?", hints: ["What do you recommend?", "I'd like the fish, please."],
        routes: [[/recommend|suggest|best|popular/i, "recommend"], [/minute|not yet|few|more time/i, "wait"]], next: "allergy" },
      recommend: { bot: "The barramundi is our most popular dish. It comes with salad and chips.", es: "El barramundi es nuestro plato más popular. Viene con ensalada y papas fritas.", hints: ["Sounds great, I'll have that.", "I'd prefer the steak, please."], next: "allergy" },
      wait: { bot: "Sure, take your time. ... Okay, what can I get for you?", es: "Claro, tómese su tiempo... Bueno, ¿qué le traigo?", hints: ["I'll have the pasta, please."], next: "allergy" },
      allergy: { bot: "Great choice. Any allergies I should know about?", es: "Buena elección. ¿Tiene alguna alergia?", hints: ["No, none.", "I'm allergic to nuts."],
        routes: [[/allergic|allergy|gluten|nuts|lactose|dairy|vegan|vegetarian/i, "allergyOk", "Thanks for letting me know."]], next: "later" },
      allergyOk: { bot: "No problem, I'll tell the chef. It will be ready in 15 minutes.", es: "No hay problema, le aviso al chef. Estará listo en 15 minutos.", hints: ["Thank you!"], next: "later" },
      later: { bot: "... How was everything?", es: "... ¿Qué tal estuvo todo?", hints: ["It was delicious!", "It was great, thanks. Could we get the bill?"],
        routes: [[/bad|cold|not good|terrible/i, "sorry"]], next: "bill" },
      sorry: { bot: "Oh, I'm so sorry about that! I'll take it off the bill.", es: "¡Uy, lo siento mucho! Se lo descuento de la cuenta.", hints: ["Thank you, I appreciate it."], next: "bill" },
      bill: { bot: "Would you like anything else, or just the bill?", es: "¿Desea algo más o solo la cuenta?", hints: ["Just the bill, please.", "Can we split the bill?"],
        routes: [[/split/i, "split"]], next: "end" },
      split: { bot: "Sure, I can split it. Card or cash?", es: "Claro, se puede dividir. ¿Tarjeta o efectivo?", hints: ["Card, please."], next: "end" },
      end: { bot: "Here you go. Thanks for coming, have a lovely evening! 🌙", es: "Aquí tiene. ¡Gracias por venir, que tenga una linda noche!", end: true },
    },
  },
  {
    id: "directions", level: "A2", emoji: "🗺️", title: "Pedir direcciones", desc: "Encuentra el lugar que buscas",
    start: "start", steps: {
      start: { bot: "(You're lost in the city. You see someone.) Hi, can I help you?", es: "(Estás perdido/a en la ciudad.) Hola, ¿te puedo ayudar?", hints: ["Yes, where is the train station?", "How do I get to the beach?"],
        routes: [[/beach/i, "beach"], [/station|train/i, "station"], [/bank|atm/i, "bank"]], next: "which" },
      which: { bot: "Sure! Where do you want to go? The station, the beach or the bank?", es: "¡Claro! ¿A dónde quieres ir? ¿La estación, la playa o el banco?", hints: ["The train station, please.", "The beach."],
        routes: [[/beach/i, "beach"], [/bank|atm/i, "bank"]], next: "station" },
      station: { bot: "Go straight for two blocks, then turn left. It's next to the park.", es: "Sigue derecho dos cuadras y dobla a la izquierda. Está al lado del parque.", hints: ["Is it far?", "So, straight and then left?"], next: "far" },
      beach: { bot: "You need to take bus 380. The bus stop is across the street.", es: "Tienes que tomar el bus 380. El paradero está al frente.", hints: ["How long does it take?", "Thank you! Is it far?"], next: "far" },
      bank: { bot: "There's an ATM in the shopping centre, just around the corner.", es: "Hay un cajero en el centro comercial, a la vuelta de la esquina.", hints: ["Great, thank you!", "Is it far?"], next: "far" },
      far: { bot: "No, it's about 10 minutes. You can't miss it!", es: "No, son como 10 minutos. ¡No te puedes perder!", hints: ["Thanks so much!", "Thanks heaps, mate!"], next: "end" },
      end: { bot: "No worries! Enjoy your day! ☀️", es: "¡De nada! ¡Disfruta tu día!", end: true },
    },
  },
  {
    id: "airport", level: "A2", emoji: "🛫", title: "Check-in en el aeropuerto", desc: "Documentos, maletas y asiento",
    start: "hi", steps: {
      hi: { bot: "Good morning! Where are you flying to today?", es: "¡Buenos días! ¿A dónde vuela hoy?", hints: ["I'm flying to Melbourne.", "To Santiago, please."], next: "passport" },
      passport: { bot: "Can I see your passport, please?", es: "¿Me muestra su pasaporte, por favor?", hints: ["Sure, here you go.", "Here is my passport."], next: "bags" },
      bags: { bot: "Thank you. Are you checking any bags today?", es: "Gracias. ¿Va a despachar maletas hoy?", hints: ["Yes, one bag.", "No, just carry-on."],
        routes: [[/\bno\b|just carry|only carry|hand luggage/i, "seat", "Okay, no checked bags."]], next: "scale" },
      scale: { bot: "Please put your bag on the scale. ... It's 25 kilos, that's 2 kilos over the limit.", es: "Ponga su maleta en la balanza... Son 25 kilos, 2 kilos sobre el límite.", hints: ["Oh no! How much is the extra fee?", "Can I take something out?"],
        routes: [[/fee|pay|how much|cost/i, "fee"], [/take|remove|out/i, "remove"]], next: "fee" },
      fee: { bot: "It's $40 for the extra weight. Or you can move some items to your carry-on.", es: "Son $40 por el sobrepeso. O puede pasar cosas a su equipaje de mano.", hints: ["I'll move some things.", "Okay, I'll pay."], next: "seat" },
      remove: { bot: "Sure, go ahead. ... Perfect, now it's 23 kilos.", es: "Claro, adelante... Perfecto, ahora son 23 kilos.", hints: ["Great, thanks!"], next: "seat" },
      seat: { bot: "Would you prefer a window or an aisle seat?", es: "¿Prefiere asiento en la ventana o en el pasillo?", hints: ["Window, please.", "Aisle, please."], next: "end" },
      end: { bot: "Here's your boarding pass. Boarding starts at 10:30 at gate 12. Have a nice flight! ✈️", es: "Aquí está su pase de abordar. El embarque empieza a las 10:30 en la puerta 12. ¡Buen vuelo!", end: true },
    },
  },
  {
    id: "interview", level: "B1", emoji: "💼", title: "Entrevista de trabajo", desc: "Una entrevista corta para un café",
    start: "hi", steps: {
      hi: { bot: "Hi, thanks for coming in. Can you tell me a little about yourself?", es: "Hola, gracias por venir. ¿Me cuentas un poco sobre ti?", hints: ["Sure! I'm from Chile and I've been in Sydney for a year.", "I'm a friendly person and I love working with people."], next: "exp" },
      exp: { bot: "Great. Have you worked in hospitality before?", es: "Genial. ¿Has trabajado antes en gastronomía/hotelería?", hints: ["Yes, I worked as a waiter for two years.", "No, but I learn quickly."],
        routes: [[/\b(no|never|haven't)\b/i, "noexp"]], next: "yesexp" },
      yesexp: { bot: "Nice! What did you do in that job?", es: "¡Bien! ¿Qué hacías en ese trabajo?", hints: ["I served customers and made coffee.", "I took orders and cleaned tables."], next: "why" },
      noexp: { bot: "That's okay. Why do you think you'd be good at this job?", es: "No importa. ¿Por qué crees que serías bueno/a en este trabajo?", hints: ["I'm hardworking and I learn fast.", "I love talking to people."], next: "why" },
      why: { bot: "Why do you want to work here?", es: "¿Por qué quieres trabajar aquí?", hints: ["I love this café and I want to improve my English.", "Because I enjoy working in a team."], next: "hours" },
      hours: { bot: "Are you available to work on weekends?", es: "¿Tienes disponibilidad para trabajar los fines de semana?", hints: ["Yes, I'm available on weekends.", "I can work on Saturdays, but not Sundays."], next: "question" },
      question: { bot: "Do you have any questions for me?", es: "¿Tienes alguna pregunta para mí?", hints: ["What would a normal day look like?", "When can I start?"], next: "end" },
      end: { bot: "Thanks so much, you did great! We'll get back to you by Friday. 🤞", es: "¡Muchas gracias, te fue muy bien! Te respondemos antes del viernes.", end: true },
    },
  },
];
