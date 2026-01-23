import type { TokenType } from "../../types";

// ============================================================================
// 1. DICTIONNAIRES DE VOCABULAIRE (LOOKUP TABLES O(1))
// ============================================================================

/**
 * Vocabulaire spécifique au Camfranglais (Argot de Yaoundé).
 * Utilisé pour la classification 'SLANG' et le styling vert néon.
 */
export const YAOUNDE_SLANG = new Set([
  "massa", "ndem", "eneo", "coup", "mami", "bendskin", "tchop", 
  "wanda", "weeeh", "maaa", "broke", "quartier", "feu", "lap", 
  "dja", "tcha", "nack", "go", "batons", "nga", "yamo", "seum", 
  "tchoko", "paddy", "wahala", "dash", "chop", "fapcent", "sat",
  "do", "cass", "look", "calée", "gif", "foiré", "grap", "wise", 
  "falla", "cache", "cut", "high", "win", "bled", "marta", "way",
  "oga", "abeg", "na", "dey", "don", "fit", "wey", "sharp", "wire",
  "mboutman", "fey", "topo", "gombiste", "bana", "zolo", "waka"
]);

/**
 * Mots-clés structurants du Pidgin Camerounais.
 * Utilisé pour la classification 'PIDGIN_KW'.
 */
export const PIDGIN_KEYWORDS = new Set([
  "no", "for", "make", "dem", "am", "go", "dey", "don", "di", 
  "na", "fit", "wey", "say", "sabi", "pikin", "wetin", "why", 
  "how", "plenty"
]);

/**
 * Liste exhaustive des verbes connus (Français, Anglais, Mixte).
 * CRITIQUE pour le Parser : permet d'identifier le début du Groupe Verbal (VP).
 */
export const KNOWN_VERBS = new Set([
  // --- Verbes d'état et Auxiliaires (FR/ENG) ---
  "est", "suis", "es", "sont", "c'est", "c’est", "cest", "be", 
  "a", "ont", "ai", "as", "have", "has", "had", 

  // --- Auxiliaires Pidgin ---
  "dey", "don", "go", "fit", "di", "no", "make", "wan", "neba", "never",

  // --- Verbes d'Action (Standard) ---
  "va", "aller", "vont", "veut", "peut", "faire", "fait", "faut", "fallu", 
  "coule", "perdu", "aimes", "gâté", "dérange", "come", "need", "browse", 
  "spoil", "succeed", "gather", "catch", "owe", "meet", "send", "borrow", 
  "finish", "give", "buy", "find", "get", "reduce", "cost", "hold", "take", 
  "sit", "shift", "drop", "tire", "hustle", "love", "like",

  // --- Verbes Camfranglais / Argot ---
  "laisse", "wanda", "dja", "tchop", "do", "look", "gère", "gif", 
  "dépanne", "grap", "call", "yamo", "wise", "falla", "cache", "cut", 
  "win", "marta", "tchoko", "wire", "chop", "dash", "waka", "lap", "nack",
  "science", "manage", "beg"
]);

// ============================================================================
// 2. PATTERNS REGEX (TOKENIZATION)
// ============================================================================

interface TokenPattern {
  type: TokenType;
  regex: RegExp;
}

/**
 * Ordre de priorité pour la tokenization.
 * Le Lexer testera ces regex séquentiellement.
 */
export const TOKEN_PATTERNS: TokenPattern[] = [
  // 1. Nombres (Supporte "2k", "100", "5.5")
  { type: 'NUMBER', regex: /^\d+(\.\d+)?(k|K|m|M)?/ },

  // 2. Ponctuation (Séparateurs de phrase)
  { type: 'PUNCTUATION', regex: /^[.,!?;:]/ },

  // 3. Mots (Alpha-numérique + Apostrophes pour "c'est", "l'eau")
  // Capture tout ce qui ressemble à un mot, incluant les accents français
  { type: 'WORD', regex: /^[A-Za-zÀ-ÿ0-9_]+(?:['’][A-Za-zÀ-ÿ0-9_]+)?/ },
];