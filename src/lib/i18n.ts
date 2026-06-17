export type Language = "en" | "es" | "fr" | "hi" | "pt";

export const LANGUAGES: { code: Language; name: string; flag: string; nativeName: string }[] = [
  { code: "en", name: "English",    flag: "🇺🇸", nativeName: "English"    },
  { code: "es", name: "Spanish",    flag: "🇪🇸", nativeName: "Español"    },
  { code: "fr", name: "French",     flag: "🇫🇷", nativeName: "Français"   },
  { code: "hi", name: "Hindi",      flag: "🇮🇳", nativeName: "हिन्दी"      },
  { code: "pt", name: "Portuguese", flag: "🇵🇹", nativeName: "Português"  },
];

const LANG_KEY = "tt_language_v1";

export function getLang(): Language {
  return (localStorage.getItem(LANG_KEY) as Language) || "en";
}

export function setLang(lang: Language) {
  localStorage.setItem(LANG_KEY, lang);
}

// UI Translations
export const UI: Record<Language, Record<string, string>> = {
  en: {
    appName: "Tiny Tots",
    tagline: "Tap, listen, learn — together.",
    abc: "ABCs", "123": "123s", colors: "Colors", shapes: "Shapes",
    animals: "Animals", story: "Stories", spell: "Spell It", count: "Counting",
    math: "Math", rhyme: "Rhyme Time", sight: "Sight Words", phonics: "Phonics",
    memory: "Memory", body: "Body Parts", emotions: "Emotions", weather: "Weather",
    trace: "Trace", match: "Match", quiz: "Quiz", color: "Color!", rewards: "Rewards",
    numTrace: "Number Trace", daily: "Daily Challenge", achievements: "Achievements",
    signOut: "Sign out", hi: "Hi", streak: "day streak",
    nowLearning: "Now learning", focus: "Focus",
    correct: "Correct! You're amazing!",
    tryAgain: "Great try! Keep going!",
    tapToHear: "Tap to hear it!",
  },
  es: {
    appName: "Pequeños Genios",
    tagline: "Toca, escucha, aprende — juntos.",
    abc: "ABCs", "123": "123s", colors: "Colores", shapes: "Formas",
    animals: "Animales", story: "Cuentos", spell: "Deletrea", count: "Contar",
    math: "Matemáticas", rhyme: "Rimas", sight: "Palabras", phonics: "Fonética",
    memory: "Memoria", body: "Cuerpo", emotions: "Emociones", weather: "Clima",
    trace: "Trazar", match: "Emparejar", quiz: "Quiz", color: "¡Colorear!", rewards: "Premios",
    numTrace: "Trazar Números", daily: "Reto del Día", achievements: "Logros",
    signOut: "Salir", hi: "¡Hola", streak: "días seguidos",
    nowLearning: "Aprendiendo", focus: "Enfoque",
    correct: "¡Correcto! ¡Eres increíble!",
    tryAgain: "¡Buen intento! ¡Sigue adelante!",
    tapToHear: "¡Toca para escuchar!",
  },
  fr: {
    appName: "Petits Génies",
    tagline: "Touche, écoute, apprends — ensemble.",
    abc: "ABCs", "123": "123s", colors: "Couleurs", shapes: "Formes",
    animals: "Animaux", story: "Histoires", spell: "Épeler", count: "Compter",
    math: "Maths", rhyme: "Rimes", sight: "Mots", phonics: "Phonétique",
    memory: "Mémoire", body: "Corps", emotions: "Émotions", weather: "Météo",
    trace: "Tracer", match: "Associer", quiz: "Quiz", color: "Colorier!", rewards: "Récompenses",
    numTrace: "Tracer Chiffres", daily: "Défi du Jour", achievements: "Succès",
    signOut: "Déconnexion", hi: "Salut", streak: "jours consécutifs",
    nowLearning: "Maintenant", focus: "Focus",
    correct: "Correct! Tu es incroyable!",
    tryAgain: "Bonne tentative! Continue!",
    tapToHear: "Touche pour entendre!",
  },
  hi: {
    appName: "छोटे बच्चे",
    tagline: "सुनो, सीखो, बढ़ो — साथ में।",
    abc: "अ आ इ", "123": "१२३", colors: "रंग", shapes: "आकार",
    animals: "जानवर", story: "कहानियाँ", spell: "स्पेलिंग", count: "गिनती",
    math: "गणित", rhyme: "तुकबंदी", sight: "शब्द", phonics: "ध्वनि",
    memory: "याददाश्त", body: "शरीर", emotions: "भावनाएं", weather: "मौसम",
    trace: "लिखना", match: "मिलाएं", quiz: "प्रश्नोत्तरी", color: "रंग भरो!", rewards: "पुरस्कार",
    numTrace: "संख्या लिखें", daily: "आज का काम", achievements: "उपलब्धियां",
    signOut: "बाहर जाएं", hi: "नमस्ते", streak: "दिन",
    nowLearning: "अभी सीख रहे हैं", focus: "फोकस",
    correct: "सही! तुम बहुत अच्छे हो!",
    tryAgain: "अच्छी कोशिश! जारी रखो!",
    tapToHear: "सुनने के लिए टैप करें!",
  },
  pt: {
    appName: "Pequenos Gênios",
    tagline: "Toque, ouça, aprenda — juntos.",
    abc: "ABCs", "123": "123s", colors: "Cores", shapes: "Formas",
    animals: "Animais", story: "Histórias", spell: "Soletrar", count: "Contar",
    math: "Matemática", rhyme: "Rimas", sight: "Palavras", phonics: "Fonética",
    memory: "Memória", body: "Corpo", emotions: "Emoções", weather: "Clima",
    trace: "Traçar", match: "Combinar", quiz: "Quiz", color: "Colorir!", rewards: "Recompensas",
    numTrace: "Traçar Números", daily: "Desafio do Dia", achievements: "Conquistas",
    signOut: "Sair", hi: "Olá", streak: "dias seguidos",
    nowLearning: "Aprendendo agora", focus: "Foco",
    correct: "Correto! Você é incrível!",
    tryAgain: "Boa tentativa! Continue!",
    tapToHear: "Toque para ouvir!",
  },
};

export function t(key: string, lang?: Language): string {
  const l = lang || getLang();
  return UI[l]?.[key] || UI["en"][key] || key;
}

// Speech language codes for Web Speech API
export const SPEECH_LANG: Record<Language, string> = {
  en: "en-US", es: "es-ES", fr: "fr-FR", hi: "hi-IN", pt: "pt-BR",
};

// Alphabet data per language
export const ALPHABET_DATA: Record<Language, { letter: string; word: string; emoji: string }[]> = {
  en: [
    {letter:"A",word:"Apple",emoji:"🍎"},{letter:"B",word:"Bear",emoji:"🐻"},{letter:"C",word:"Cat",emoji:"🐱"},
    {letter:"D",word:"Duck",emoji:"🦆"},{letter:"E",word:"Elephant",emoji:"🐘"},{letter:"F",word:"Fish",emoji:"🐟"},
    {letter:"G",word:"Giraffe",emoji:"🦒"},{letter:"H",word:"Hat",emoji:"🎩"},{letter:"I",word:"Ice cream",emoji:"🍦"},
    {letter:"J",word:"Jellyfish",emoji:"🪼"},{letter:"K",word:"Kite",emoji:"🪁"},{letter:"L",word:"Lion",emoji:"🦁"},
    {letter:"M",word:"Moon",emoji:"🌙"},{letter:"N",word:"Nest",emoji:"🪺"},{letter:"O",word:"Octopus",emoji:"🐙"},
    {letter:"P",word:"Penguin",emoji:"🐧"},{letter:"Q",word:"Queen",emoji:"👑"},{letter:"R",word:"Rainbow",emoji:"🌈"},
    {letter:"S",word:"Sun",emoji:"☀️"},{letter:"T",word:"Tree",emoji:"🌳"},{letter:"U",word:"Umbrella",emoji:"☂️"},
    {letter:"V",word:"Violin",emoji:"🎻"},{letter:"W",word:"Whale",emoji:"🐳"},{letter:"X",word:"Xylophone",emoji:"🎹"},
    {letter:"Y",word:"Yo-yo",emoji:"🪀"},{letter:"Z",word:"Zebra",emoji:"🦓"},
  ],
  es: [
    {letter:"A",word:"Avión",emoji:"✈️"},{letter:"B",word:"Burro",emoji:"🫏"},{letter:"C",word:"Casa",emoji:"🏠"},
    {letter:"D",word:"Delfín",emoji:"🐬"},{letter:"E",word:"Elefante",emoji:"🐘"},{letter:"F",word:"Fresa",emoji:"🍓"},
    {letter:"G",word:"Gato",emoji:"🐱"},{letter:"H",word:"Helado",emoji:"🍦"},{letter:"I",word:"Iglesia",emoji:"⛪"},
    {letter:"J",word:"Jirafa",emoji:"🦒"},{letter:"K",word:"Koala",emoji:"🐨"},{letter:"L",word:"León",emoji:"🦁"},
    {letter:"M",word:"Mariposa",emoji:"🦋"},{letter:"N",word:"Naranja",emoji:"🍊"},{letter:"Ñ",word:"Ñoño",emoji:"😄"},
    {letter:"O",word:"Oso",emoji:"🐻"},{letter:"P",word:"Perro",emoji:"🐶"},{letter:"Q",word:"Queso",emoji:"🧀"},
    {letter:"R",word:"Rana",emoji:"🐸"},{letter:"S",word:"Sol",emoji:"☀️"},{letter:"T",word:"Tigre",emoji:"🐯"},
    {letter:"U",word:"Uva",emoji:"🍇"},{letter:"V",word:"Vaca",emoji:"🐄"},{letter:"W",word:"Wifi",emoji:"📶"},
    {letter:"X",word:"Xilófono",emoji:"🎹"},{letter:"Y",word:"Yogur",emoji:"🥛"},{letter:"Z",word:"Zorro",emoji:"🦊"},
  ],
  fr: [
    {letter:"A",word:"Avion",emoji:"✈️"},{letter:"B",word:"Ballon",emoji:"🎈"},{letter:"C",word:"Chat",emoji:"🐱"},
    {letter:"D",word:"Dauphin",emoji:"🐬"},{letter:"E",word:"Éléphant",emoji:"🐘"},{letter:"F",word:"Fraise",emoji:"🍓"},
    {letter:"G",word:"Grenouille",emoji:"🐸"},{letter:"H",word:"Hibou",emoji:"🦉"},{letter:"I",word:"Île",emoji:"🏝️"},
    {letter:"J",word:"Jardin",emoji:"🌻"},{letter:"K",word:"Koala",emoji:"🐨"},{letter:"L",word:"Lion",emoji:"🦁"},
    {letter:"M",word:"Maison",emoji:"🏠"},{letter:"N",word:"Nuage",emoji:"☁️"},{letter:"O",word:"Oiseau",emoji:"🐦"},
    {letter:"P",word:"Papillon",emoji:"🦋"},{letter:"Q",word:"Queue",emoji:"🦊"},{letter:"R",word:"Renard",emoji:"🦊"},
    {letter:"S",word:"Soleil",emoji:"☀️"},{letter:"T",word:"Tigre",emoji:"🐯"},{letter:"U",word:"Ours",emoji:"🐻"},
    {letter:"V",word:"Vache",emoji:"🐄"},{letter:"W",word:"Wagon",emoji:"🚃"},{letter:"X",word:"Xylophone",emoji:"🎹"},
    {letter:"Y",word:"Yaourt",emoji:"🥛"},{letter:"Z",word:"Zèbre",emoji:"🦓"},
  ],
  hi: [
    {letter:"अ",word:"अनार",emoji:"🍎"},{letter:"आ",word:"आम",emoji:"🥭"},{letter:"इ",word:"इमली",emoji:"🌿"},
    {letter:"ई",word:"ईख",emoji:"🌾"},{letter:"उ",word:"उल्लू",emoji:"🦉"},{letter:"ऊ",word:"ऊन",emoji:"🧶"},
    {letter:"क",word:"कमल",emoji:"🌸"},{letter:"ख",word:"खरगोश",emoji:"🐰"},{letter:"ग",word:"गाय",emoji:"🐄"},
    {letter:"घ",word:"घर",emoji:"🏠"},{letter:"च",word:"चाँद",emoji:"🌙"},{letter:"छ",word:"छाता",emoji:"☂️"},
    {letter:"ज",word:"जहाज",emoji:"✈️"},{letter:"झ",word:"झील",emoji:"🌊"},{letter:"त",word:"तितली",emoji:"🦋"},
    {letter:"द",word:"दीपक",emoji:"🪔"},{letter:"न",word:"नाव",emoji:"⛵"},{letter:"प",word:"पक्षी",emoji:"🐦"},
    {letter:"फ",word:"फूल",emoji:"🌸"},{letter:"ब",word:"बादल",emoji:"☁️"},{letter:"भ",word:"भालू",emoji:"🐻"},
    {letter:"म",word:"मछली",emoji:"🐟"},{letter:"र",word:"रेलगाड़ी",emoji:"🚂"},{letter:"स",word:"सूरज",emoji:"☀️"},
    {letter:"ह",word:"हाथी",emoji:"🐘"},{letter:"ल",word:"लालटेन",emoji:"🏮"},
  ],
  pt: [
    {letter:"A",word:"Avião",emoji:"✈️"},{letter:"B",word:"Borboleta",emoji:"🦋"},{letter:"C",word:"Cavalo",emoji:"🐴"},
    {letter:"D",word:"Elefante",emoji:"🐘"},{letter:"E",word:"Estrela",emoji:"⭐"},{letter:"F",word:"Flor",emoji:"🌸"},
    {letter:"G",word:"Gato",emoji:"🐱"},{letter:"H",word:"Hipopótamo",emoji:"🦛"},{letter:"I",word:"Ilha",emoji:"🏝️"},
    {letter:"J",word:"Jacaré",emoji:"🐊"},{letter:"K",word:"Koala",emoji:"🐨"},{letter:"L",word:"Leão",emoji:"🦁"},
    {letter:"M",word:"Macaco",emoji:"🐒"},{letter:"N",word:"Nuvem",emoji:"☁️"},{letter:"O",word:"Ovo",emoji:"🥚"},
    {letter:"P",word:"Peixe",emoji:"🐟"},{letter:"Q",word:"Queijo",emoji:"🧀"},{letter:"R",word:"Rato",emoji:"🐭"},
    {letter:"S",word:"Sol",emoji:"☀️"},{letter:"T",word:"Tigre",emoji:"🐯"},{letter:"U",word:"Urso",emoji:"🐻"},
    {letter:"V",word:"Vaca",emoji:"🐄"},{letter:"W",word:"Wifi",emoji:"📶"},{letter:"X",word:"Xilofone",emoji:"🎹"},
    {letter:"Y",word:"Iogurte",emoji:"🥛"},{letter:"Z",word:"Zebra",emoji:"🦓"},
  ],
};
