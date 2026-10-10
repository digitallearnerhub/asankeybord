/**
 * Roman Urdu to Urdu Script Transliteration Engine
 * Rule-based phonetics + High-frequency dictionary + Context suggestions
 */

// Common high-frequency phrases and words mapping
export const PHRASE_DICTIONARY: Record<string, string> = {
  'assalam o alaikum': 'السلام علیکم',
  'assalamu alaikum': 'السلام علیکم',
  'salam': 'سلام',
  'walaikum assalam': 'وعلیکم السلام',
  'walaikumassalam': 'وعلیکم السلام',
  'jazak allah': 'جزاک اللہ',
  'jazakallah': 'جزاک اللہ',
  'masha allah': 'ماشاء اللہ',
  'mashaallah': 'ماشاء اللہ',
  'insha allah': 'انشاء اللہ',
  'inshaallah': 'انشاء اللہ',
  'subhan allah': 'سبحان اللہ',
  'subhanallah': 'سبحان اللہ',
  'alhamdulillah': 'الحمد للہ',
  'alhamd lillah': 'الحمد للہ',
  'pakistan zindabad': 'پاکستان زندہ باد',
  'shukriya': 'شکریہ',
  'bohot shukriya': 'بہت شکریہ',
  'mubarak ho': 'مبارک ہو',
  'eid mubarak': 'عید مبارک',
  'jummah mubarak': 'جمعہ مبارک',
  'ramazan mubarak': 'رمضان مبارک',
  'khuda hafiz': 'خدا حافظ',
  'allah hafiz': 'اللہ حافظ',
  'kaise hain aap': 'کیسے ہیں آپ',
  'kya haal hai': 'کیا حال ہے',
  'theek thaak': 'ٹھیک ٹھاک',
  'bohot acha': 'بہت اچھا',
  'ap ka shukriya': 'آپ کا شکریہ',
  'allah ap ko khush rakhay': 'اللہ آپ کو خوش رکھے',
  'allah aap ko khush rakhay': 'اللہ آپ کو خوش رکھے',
  'mujhe urdu likhni hai': 'مجھے اردو لکھنی ہے',
  'pakistan hamara pyara mulk hai': 'پاکستان ہمارا پیارا ملک ہے',
  'aap kaise hain': 'آپ کیسے ہیں',
  'app kaise hain': 'آپ کیسے ہیں',
  'kya kar rahe ho': 'کیا کر رہے ہو',
  'kahan ho': 'کہاں ہو',
  'kab aoge': 'کب آؤ گے',
  'kab aa rahe ho': 'کب آ رہے ہو',
};

// Word dictionary with candidates
export const WORD_DICTIONARY: Record<string, string[]> = {
  // Greetings & Religious
  allah: ['اللہ'],
  khuda: ['خدا'],
  rasool: ['رسول'],
  nabi: ['نبی'],
  quran: ['قرآن'],
  namaz: ['نماز'],
  dua: ['دعا'],
  iman: ['ایمان'],
  islam: ['اسلام'],
  deen: ['دین'],
  shukriya: ['شکریہ', 'شکریہ!'],
  salam: ['سلام'],

  // Pronouns
  aap: ['آپ', 'آپکا', 'آپکو'],
  ap: ['آپ'],
  tum: ['تم', 'تمہیں', 'تمہارا'],
  mai: ['میں'],
  main: ['میں'],
  me: ['میں', 'مجھے'],
  hum: ['ہم', 'ہمارا', 'ہمیں'],
  hamara: ['ہمارا'],
  hamari: ['ہماری'],
  wo: ['وہ'],
  woh: ['وہ'],
  ye: ['یہ'],
  yeh: ['یہ'],
  mujhe: ['مجھے'],
  tujhe: ['تجھے'],
  us: ['اس'],
  un: ['ان'],
  unka: ['ان کا', 'انکا'],
  inka: ['ان کا', 'انکا'],
  iska: ['اس کا', 'اسکا'],
  mera: ['میرا'],
  meri: ['میری'],
  mere: ['میرے'],
  tera: ['تیرا'],
  teri: ['تیری'],
  tere: ['تیرے'],
  apna: ['اپنا'],
  apni: ['اپنی'],
  apne: ['اپنے'],

  // Question words
  kya: ['کیا'],
  kia: ['کیا'],
  kyun: ['کیوں'],
  kyu: ['کیوں'],
  kaisa: ['کیسا'],
  kaisi: ['کیسی'],
  kaise: ['کیسے'],
  kahan: ['کہاں'],
  kidhar: ['کدھر'],
  kab: ['کب'],
  kaun: ['کون'],
  kon: ['کون'],
  kis: ['کس'],
  kisko: ['کس کو', 'کسکو'],
  kitna: ['کتنا'],
  kitni: ['کتنی'],
  kitne: ['کتنے'],

  // Auxiliary verbs & common verbs
  hai: ['ہے', 'ہیں', 'ہو', 'ہی'],
  hy: ['ہے', 'ہیں'],
  hain: ['ہیں', 'ہین'],
  hein: ['ہیں'],
  ho: ['ہو', 'ہوں'],
  hon: ['ہوں'],
  hoon: ['ہوں'],
  hun: ['ہوں'],
  tha: ['تھا'],
  thi: ['تھی'],
  thay: ['تھے'],
  the: ['تھے'],
  hoga: ['ہوگا'],
  hogi: ['ہوگی'],
  honge: ['ہوں گے'],
  karna: ['کرنا'],
  karta: ['کرتا'],
  karti: ['کرتی'],
  karte: ['کرتے'],
  karo: ['کرو'],
  karein: ['کریں'],
  karen: ['کریں'],
  kia_verb: ['کیا'],
  kiya: ['کیا'],
  diya: ['دیا'],
  liya: ['لیا'],
  aana: ['آنا'],
  jana: ['جانا'],
  aaya: ['آیا'],
  gaya: ['گیا'],
  gayi: ['گئی'],
  gaye: ['گئے'],
  raha: ['رہا'],
  rahi: ['رہی'],
  rahe: ['رہے'],
  aao: ['آؤ'],
  jao: ['جاؤ'],
  dekho: ['دیکھو'],
  bolo: ['بولو'],
  likho: ['لکھو'],
  likhni: ['لکھنی'],
  parho: ['پڑھو'],
  sunoo: ['سنو'],
  suno: ['سنو'],

  // Adverbs, Prepositions & Conjunctions
  ka: ['کا'],
  ki: ['کی'],
  ke: ['کے'],
  ko: ['کو'],
  se: ['سے'],
  par: ['پر'],
  pe: ['پہ', 'پر'],
  tak: ['تک'],
  mein: ['میں'],
  men: ['میں'],
  aur: ['اور'],
  or: ['اور'],
  ya: ['یا'],
  lekin: ['لیکن'],
  magar: ['مگر'],
  agar: ['اگر'],
  to: ['تو'],
  toh: ['تو'],
  bhi: ['بھی'],
  hi: ['ہی'],
  na: ['نہ', 'نا'],
  nahi: ['نہیں'],
  nahin: ['نہیں'],
  ni: ['نہیں', 'نی'],
  mat: ['مت'],
  bohot: ['بہت'],
  bahut: ['بہت'],
  bht: ['بہت'],
  zyada: ['زیادہ'],
  ziada: ['زیادہ'],
  kam: ['کم'],
  acha: ['اچھا'],
  achi: ['اچھی'],
  ache: ['اچھے'],
  achha: ['اچھا'],
  bura: ['برا'],
  theek: ['ٹھیک'],
  thik: ['ٹھیک'],
  sahi: ['صحیح'],
  galat: ['غلط'],
  jaldi: ['جلدی'],
  aaj: ['آج'],
  kal: ['کل'],
  parson: ['پرسوں'],
  subah: ['صبح'],
  shaam: ['شام'],
  raat: ['رات'],
  din: ['دن'],
  waqt: ['وقت'],
  time: ['ٹائم', 'وقت'],

  // Common Nouns
  pakistan: ['پاکستان'],
  urdu: ['اردو'],
  angrezi: ['انگریزی'],
  mulk: ['ملک'],
  watan: ['وطن'],
  pyara: ['پیارا'],
  pyari: ['پیاری'],
  pyare: ['پیارے'],
  khushi: ['خوشی'],
  gham: ['غم'],
  dost: ['دوست'],
  yaar: ['یار'],
  bhai: ['بھائی'],
  behan: ['بہن'],
  baap: ['باپ'],
  maa: ['ماں'],
  ammi: ['امی'],
  abbu: ['ابو'],
  beta: ['بیٹا'],
  beti: ['بیٹی'],
  ghar: ['گھر'],
  shehar: ['شہر'],
  gaaon: ['گاؤں'],
  pata: ['پتہ', 'معلوم'],
  paani: ['پانی'],
  pani: ['پانی'],
  roti: ['روٹی'],
  khana: ['کھانا'],
  chaye: ['چائے'],
  chai: ['چائے'],
  kaam: ['کام'],
  baat: ['بات'],
  baatein: ['باتیں'],
  zindagi: ['زندگی'],
  duniya: ['دنیا'],
  dil: ['دل'],
  jaan: ['جان'],
  muhabbat: ['محبت'],
  ishq: ['عشق'],
  mohabbat: ['محبت'],
  kitab: ['کتاب'],
  qalam: ['قلم'],
  shayeri: ['شاعری'],
  sher: ['شعر'],
  ghazal: ['غزل'],
  saman: ['سامان'],
  message: ['پیغام', 'میسج'],
};

// Digraph mappings (checked first)
const DIGRAPHS: Record<string, string> = {
  kh: 'خ',
  gh: 'غ',
  ch: 'چ',
  jh: 'جھ',
  th: 'تھ',
  ph: 'پھ',
  bh: 'بھ',
  dh: 'دھ',
  rh: 'ڑھ',
  sh: 'ش',
  zh: 'ژ',
  aa: 'آ',
  ee: 'ی',
  oo: 'و',
  ai: 'ئے',
  ei: 'ی',
  ou: 'و',
};

// Single letter phonetic mapping
const SINGLE_LETTERS: Record<string, string> = {
  a: 'ا',
  b: 'ب',
  p: 'پ',
  t: 'ت',
  T: 'ٹ',
  j: 'ج',
  c: 'چ',
  h: 'ہ',
  H: 'ح',
  d: 'د',
  D: 'ڈ',
  r: 'ر',
  R: 'ڑ',
  z: 'ز',
  Z: 'ذ',
  s: 'س',
  S: 'ص',
  q: 'ق',
  f: 'ف',
  k: 'ک',
  g: 'گ',
  l: 'ل',
  m: 'م',
  n: 'ن',
  N: 'ں',
  v: 'و',
  w: 'و',
  u: 'و',
  o: 'و',
  i: 'ی',
  e: 'ے',
  y: 'ی',
  x: 'کس',
};

/**
 * Phonetic transliteration of a single token using rule-based algorithm
 */
export function phoneticTransliterate(word: string): string {
  if (!word) return '';
  const lower = word.toLowerCase();

  // Special cases for single-vowel starts
  let result = '';
  let i = 0;

  // Initial letter handling
  if (lower.startsWith('aa')) {
    result += 'آ';
    i = 2;
  } else if (lower.startsWith('a')) {
    result += 'ا';
    i = 1;
  } else if (lower.startsWith('u') || lower.startsWith('o')) {
    result += 'او';
    i = 1;
  } else if (lower.startsWith('i') || lower.startsWith('e')) {
    result += 'ای';
    i = 1;
  }

  while (i < word.length) {
    const twoChars = word.substring(i, i + 2).toLowerCase();
    if (DIGRAPHS[twoChars]) {
      result += DIGRAPHS[twoChars];
      i += 2;
      continue;
    }

    const char = word[i];
    const lowerChar = char.toLowerCase();

    // Check uppercase for retroflex T/D/R
    if (char === 'T') {
      result += 'ٹ';
    } else if (char === 'D') {
      result += 'ڈ';
    } else if (char === 'R') {
      result += 'ڑ';
    } else if (SINGLE_LETTERS[char] || SINGLE_LETTERS[lowerChar]) {
      result += SINGLE_LETTERS[char] || SINGLE_LETTERS[lowerChar];
    } else {
      result += char;
    }
    i++;
  }

  return result;
}

/**
 * Get suggestions for a word
 */
export function getWordSuggestions(word: string): string[] {
  const cleanWord = word.trim().toLowerCase().replace(/[.,!?;:()]/g, '');
  if (!cleanWord) return [];

  // Check dictionary
  if (WORD_DICTIONARY[cleanWord]) {
    const dictCandidates = [...WORD_DICTIONARY[cleanWord]];
    const phonetic = phoneticTransliterate(word);
    if (!dictCandidates.includes(phonetic)) {
      dictCandidates.push(phonetic);
    }
    return dictCandidates;
  }

  // Fallback to phonetic
  const phonetic = phoneticTransliterate(cleanWord);
  return [phonetic, word];
}

/**
 * Transliterate a complete sentence or paragraph
 */
export function transliterateRomanUrdu(text: string): string {
  if (!text) return '';

  // Check phrase dictionary first for matching phrases
  let working = text;
  const lowerText = text.toLowerCase().trim();

  // Direct phrase match
  if (PHRASE_DICTIONARY[lowerText]) {
    return PHRASE_DICTIONARY[lowerText];
  }

  // Tokenize preserving spaces, punctuation, newlines
  const regex = /([a-zA-Z]+|[^a-zA-Z\s]+|\s+)/g;
  const tokens = text.match(regex) || [text];

  const translatedTokens = tokens.map((token) => {
    // Check if whitespace or newline
    if (/^\s+$/.test(token)) return token;

    // Check if punctuation
    if (/^[^a-zA-Z\s]+$/.test(token)) {
      // Convert standard punctuation to Urdu style where appropriate
      if (token === '?') return '؟';
      if (token === ',') return '،';
      if (token === ';') return '؛';
      return token;
    }

    const lower = token.toLowerCase();

    // Check dictionary
    if (WORD_DICTIONARY[lower] && WORD_DICTIONARY[lower].length > 0) {
      return WORD_DICTIONARY[lower][0];
    }

    // Phonetic fallback
    return phoneticTransliterate(token);
  });

  return translatedTokens.join('');
}
