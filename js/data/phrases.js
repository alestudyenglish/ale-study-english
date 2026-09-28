// =====================================================================
// 🃏 FRASES — organizadas por situación y nivel
// Formato de cada línea:  nivel | inglés | español | ejemplo (opcional)
// Para agregar una frase, copia una línea y cámbiala.
// =====================================================================
const PHRASE_DATA = {
  "💬 Conversaciones": `
A1|What's up?|¿Qué onda? / ¿Qué tal?|Hey, what's up? Long time no see!
A1|How's it going?|¿Cómo va todo?|How's it going with the new job?
A1|Nice to meet you|Mucho gusto|Hi, I'm Ana. Nice to meet you!
A1|Where are you from?|¿De dónde eres?|Where are you from? — I'm from Chile.
A1|Not much, you?|Nada especial, ¿y tú?|— What's up? — Not much, you?
A1|No worries|No te preocupes / No pasa nada|— Sorry I'm late! — No worries.
A1|No way!|¡No puede ser!|You won the lottery? No way!
A1|How was your weekend?|¿Qué tal tu fin de semana?|How was your weekend? Did you do anything fun?
A2|Long time no see|¡Cuánto tiempo sin verte!|Oh my God, long time no see!
A2|Can't complain|No me puedo quejar|Work's busy, but I can't complain.
A2|Catch you later|Nos vemos / Hablamos luego|Gotta go, catch you later!
A2|That's so cool|¡Qué genial!|You're going to Japan? That's so cool!
A2|That makes sense|Tiene sentido|Oh, OK, that makes sense.
A2|What do you do for fun?|¿Qué haces para divertirte?|What do you do for fun on weekends?
B1|I feel you|Te entiendo|Mondays are the worst. — I feel you.
B1|Fair enough|Me parece justo / Vale|You're tired? Fair enough, let's go home.
`,
  "🏠 Vida diaria": `
A1|I'm so tired|Estoy muy cansado/a|I'm so tired, I worked all day.
A1|I'm going to bed|Me voy a dormir|It's late, I'm going to bed.
A1|What's the weather like today?|¿Cómo está el clima hoy?|What's the weather like today? Is it sunny?
A1|I'm running late|Voy tarde|Sorry, I'm running late! Be there in 10.
A1|Are you free on...?|¿Estás libre el...?|Are you free on Saturday?
A2|I'm down|Me apunto|— Pizza tonight? — I'm down!
A2|Let's grab a coffee|Vamos por un café|Let's grab a coffee after work.
A2|I'm heading home|Me voy a casa|I'm heading home, see you tomorrow.
A2|I need to do the laundry|Tengo que lavar la ropa|I can't go out, I need to do the laundry.
A2|Something came up|Me surgió algo|I can't make it, something came up.
B1|Let's play it by ear|Vamos viendo sobre la marcha|Not sure about Sunday, let's play it by ear.
B1|Rain check?|¿Lo dejamos para otro día?|I'm exhausted today, rain check?
`,
  "💼 Trabajo": `
A1|I'm looking for a job|Estoy buscando trabajo|I'm looking for a job in a café.
A1|What time is the meeting?|¿A qué hora es la reunión?|What time is the meeting tomorrow?
A1|What do you do for a living?|¿A qué te dedicas?|What do you do for a living? — I'm a chef.
A2|I'm on it|Me encargo / Estoy en ello|— Can you send the report? — I'm on it!
A2|I'm working from home today|Hoy trabajo desde casa|I'm working from home today, call me if you need me.
A2|Could you send me the file?|¿Me puedes enviar el archivo?|Could you send me the file by email?
A2|I'm swamped|Estoy hasta arriba de trabajo|I'm swamped this week.
A2|Let's call it a day|Demos por terminado el día|It's 7pm, let's call it a day.
B1|Let me get back to you|Te confirmo luego|Let me check and get back to you.
B1|Just a heads-up|Solo un aviso|Just a heads-up, the meeting moved to 3.
B1|Can we reschedule?|¿Podemos cambiar la fecha/hora?|Something came up. Can we reschedule?
B1|I'd like to apply for this position|Me gustaría postular a este puesto|Hi, I'd like to apply for this position.
B2|I have a lot on my plate|Tengo muchas cosas encima|Sorry, I have a lot on my plate right now.
B2|Let's touch base next week|Hablemos la próxima semana|Let's touch base next week about the project.
`,
  "🍽️ Restaurante": `
A1|A table for two, please|Una mesa para dos, por favor|Hi! A table for two, please.
A1|Can I see the menu, please?|¿Me muestra la carta, por favor?|Excuse me, can I see the menu, please?
A1|Can I get...?|¿Me da...? / Quiero...|Can I get a large coffee, please?
A1|For here or to go?|¿Para comer aquí o para llevar?|— For here or to go? — To go, please.
A1|I'm starving|Me muero de hambre|Let's eat, I'm starving!
A1|It was delicious!|¡Estaba delicioso!|Thank you, it was delicious!
A2|What do you recommend?|¿Qué me recomienda?|Everything looks good. What do you recommend?
A2|I'm allergic to nuts|Soy alérgico/a a los frutos secos|Does this have nuts? I'm allergic to nuts.
A2|Could I get this without onions?|¿Me lo puede traer sin cebolla?|Could I get this without onions, please?
A2|I'm stuffed|Estoy lleno/a|No more pizza for me, I'm stuffed.
A2|Could we get the check?|¿Nos trae la cuenta?|Excuse me, could we get the check?
A2|Can we split the bill?|¿Podemos dividir la cuenta?|Can we split the bill, please?
B1|It's on me|Yo invito|Put your wallet away, it's on me.
`,
  "🛒 Supermercado": `
A1|Where can I find the milk?|¿Dónde encuentro la leche?|Excuse me, where can I find the milk?
A1|Do you need a bag?|¿Necesita bolsa?|— Do you need a bag? — No, thanks.
A1|I'll pay by card|Pago con tarjeta|I'll pay by card, thanks.
A1|Can I get a receipt?|¿Me da la boleta/el recibo?|Can I get a receipt, please?
A2|Which aisle is the bread in?|¿En qué pasillo está el pan?|Sorry, which aisle is the bread in?
A2|Is this on sale?|¿Esto está en oferta?|Is this on sale? The sign says 20% off.
A2|Is there a self-checkout?|¿Hay caja de autoservicio?|Is there a self-checkout? I only have two things.
B1|Do you have any gluten-free options?|¿Tienen opciones sin gluten?|Do you have any gluten-free options?
B1|This is past its use-by date|Esto está vencido|Excuse me, this is past its use-by date.
`,
  "🚌 Transporte": `
A1|Where is the train station?|¿Dónde está la estación de tren?|Excuse me, where is the train station?
A1|Does this bus go to the city?|¿Este bus va al centro?|Does this bus go to the city?
A1|One ticket to Sydney, please|Un boleto a Sídney, por favor|One ticket to Sydney, please. One way.
A1|Is this seat taken?|¿Está ocupado este asiento?|Excuse me, is this seat taken?
A1|Can you take me to this address?|¿Me puede llevar a esta dirección?|Hi, can you take me to this address, please?
A2|What time does the next train leave?|¿A qué hora sale el próximo tren?|What time does the next train leave for Melbourne?
A2|How much is the fare?|¿Cuánto cuesta el pasaje?|How much is the fare to the airport?
A2|I missed my bus|Perdí el bus|Sorry I'm late, I missed my bus.
B1|Can you let me know when we get there?|¿Me avisa cuando lleguemos?|Can you let me know when we get to Central Station?
B1|Where do I top up my card?|¿Dónde recargo mi tarjeta?|Where do I top up my Opal card?
`,
  "✈️ Aeropuerto": `
A1|Where is the check-in counter?|¿Dónde está el mostrador de check-in?|Excuse me, where is the check-in counter?
A1|Here is my passport|Aquí está mi pasaporte|Good morning. Here is my passport.
A1|Can I have a window seat?|¿Me da un asiento en la ventana?|Can I have a window seat, please?
A1|Where is gate 12?|¿Dónde está la puerta 12?|Excuse me, where is gate 12?
A2|I have one bag to check|Tengo una maleta para despachar|I have one bag to check and one carry-on.
A2|My flight is delayed|Mi vuelo está atrasado|My flight is delayed by two hours.
A2|I lost my luggage|Perdí mi equipaje|Excuse me, I lost my luggage. Where do I go?
A2|I'm here on holiday|Estoy aquí de vacaciones|— What's the purpose of your visit? — I'm here on holiday.
B1|I have nothing to declare|No tengo nada que declarar|No, I have nothing to declare.
B1|How long is the layover?|¿Cuánto dura la escala?|How long is the layover in Auckland?
B1|I missed my connecting flight|Perdí mi vuelo de conexión|I missed my connecting flight. What can I do?
`,
  "🛍️ Compras": `
A1|I'm just looking|Solo estoy mirando|— Can I help you? — I'm just looking, thanks.
A1|How much is it?|¿Cuánto cuesta?|This jacket is cute, how much is it?
A1|Can I try this on?|¿Me lo puedo probar?|Can I try this on, please?
A1|It's too expensive|Es muy caro|Hmm, it's too expensive for me.
A1|Can I pay by card?|¿Puedo pagar con tarjeta?|Can I pay by card or cash only?
A1|Just this, thanks|Solo esto, gracias|— Anything else? — Just this, thanks.
A2|Do you have this in...?|¿Lo tiene en...? (talla/color)|Do you have this in a medium?
A2|Where are the fitting rooms?|¿Dónde están los probadores?|Excuse me, where are the fitting rooms?
A2|I'd like to return this|Quiero devolver esto|Hi, I'd like to return this, it doesn't fit.
B1|Do you offer refunds?|¿Hacen devoluciones de dinero?|Do you offer refunds or only exchanges?
`,
  "🙋 Pedir ayuda": `
A1|Excuse me, can you help me?|Disculpe, ¿me puede ayudar?|Excuse me, can you help me? I'm lost.
A1|I don't understand|No entiendo|Sorry, I don't understand.
A1|Could you speak more slowly?|¿Puede hablar más despacio?|Sorry, could you speak more slowly?
A1|Could you repeat that, please?|¿Puede repetirlo, por favor?|Could you repeat that, please?
A1|How do you say... in English?|¿Cómo se dice... en inglés?|How do you say "cuchara" in English?
A1|I'm lost|Estoy perdido/a|Excuse me, I'm lost. Where is the station?
A1|Where is the toilet?|¿Dónde está el baño?|Excuse me, where is the toilet?
A1|What do you mean?|¿A qué te refieres?|What do you mean by "later"?
A2|Sorry, come again?|Perdón, ¿cómo?|Sorry, come again? It's loud in here.
A2|I didn't catch that|No te entendí / No lo capté|Sorry, I didn't catch your name.
A2|Could you give me a hand?|¿Me echas una mano?|Could you give me a hand with these boxes?
A2|Can you call an ambulance?|¿Puede llamar una ambulancia?|Help! Can you call an ambulance?
`,
  "🦘 Australia": `
A1|G'day, mate!|¡Hola, amigo!|G'day, mate! How's it going?
A1|How ya going?|¿Cómo estás?|How ya going, mate? — Good, thanks!
A1|No worries, mate|No pasa nada, amigo|— Thanks for your help! — No worries, mate.
A2|Thanks heaps!|¡Muchas gracias!|Thanks heaps for the lift!
A2|Ta|Gracias (muy informal)|Ta, mate!
A2|Let's grab brekkie|Vamos a desayunar|Let's grab brekkie at the café.
A2|See you this arvo|Nos vemos esta tarde|See you this arvo at the beach!
A2|Let's go to Maccas|Vamos al McDonald's|I'm hungry, let's go to Maccas.
A2|Don't forget your thongs|No olvides tus chalas/chanclas|Don't forget your thongs, we're going to the beach!
A2|Come to the barbie|Ven al asado|Come to the barbie on Saturday!
B1|I reckon...|Creo que... / Me parece que...|I reckon it's gonna rain today.
B1|She'll be right|Todo va a estar bien|Don't worry about it, she'll be right.
B1|Let's stop at the servo|Paremos en la bencinera/gasolinera|We need petrol, let's stop at the servo.
B1|I'm going to the bottle-o|Voy a la botillería/licorería|I'm going to the bottle-o, need anything?
B2|Fair dinkum?|¿En serio? / De verdad|You caught a shark? Fair dinkum?
B2|He chucked a sickie|Faltó al trabajo fingiendo estar enfermo|It's sunny and Tom's not here. I reckon he chucked a sickie.
`,
};

const PHRASES = Object.entries(PHRASE_DATA).flatMap(([category, block]) =>
  block.trim().split("\n").map((line) => {
    const [level, english, spanish, example] = line.split("|");
    return { category, level, english, spanish, example: example || "" };
  })
);
