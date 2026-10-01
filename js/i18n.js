// =====================================================================
// 🌐 IDIOMA DE AYUDA — español o árabe (el inglés siempre es el mismo)
// ---------------------------------------------------------------------
// tx("texto en español", "النص بالعربية") devuelve el texto en el idioma
// elegido. Las traducciones del contenido (frases, verbos, gramática...)
// están en js/data/ar.js y se aplican al abrir la app en árabe.
// Al cambiar de idioma la app se recarga para aplicar todo de una vez.
// =====================================================================
const NATIVE_LANGS = {
  es: { code: "es", name: "Español", flag: "🇪🇸", dir: "ltr", speech: "es-MX", ai: "Latin American Spanish" },
  // "ع" es el símbolo habitual del árabe (Windows no muestra banderas de países)
  ar: { code: "ar", name: "العربية", flag: "ع", dir: "rtl", speech: "ar-SA", ai: "Modern Standard Arabic (فصحى)" },
};
let LANG = "es";
try { LANG = (JSON.parse(localStorage.getItem("everyday-english-v2")) || {}).lang === "ar" ? "ar" : "es"; } catch (e) {}
const NATIVE = NATIVE_LANGS[LANG];
const isAr = LANG === "ar";
const tx = (es, ar) => (isAr && ar !== undefined ? ar : es);

// Dirección del texto: el árabe se lee de derecha a izquierda
document.documentElement.lang = LANG;
document.documentElement.dir = NATIVE.dir;

// Aplicar las traducciones del contenido
if (isAr && typeof applyArabicData === "function") applyArabicData();

function setLanguage(code) {
  if (!NATIVE_LANGS[code] || code === LANG) return;
  Store.data.lang = code;
  Store.save();
  location.reload();
}
