import type { Token, TokenType } from "../../types";
import { 
  TOKEN_PATTERNS, 
  YAOUNDE_SLANG, 
  PIDGIN_KEYWORDS, 
  KNOWN_VERBS 
} from "../constants/grammar";

/**
 * Analyseur Lexical (Lexer) pour le moteur KMERLEX.
 * Transforme une chaîne de caractères brute en une séquence de tokens typés.
 * * Complexité : O(n) où n est la longueur du texte.
 * Utilise des Lookup Tables (Sets) pour une classification O(1).
 */
export const tokenize = (input: string): Token[] => {
  const tokens: Token[] = [];
  let cursor = 0;
  const length = input.length;

  // Boucle principale de consommation du texte
  while (cursor < length) {
    
    // 1. OPTIMISATION : Sauter les espaces blancs
    // On avance tant qu'on rencontre des espaces, tabulations ou sauts de ligne
    if (/\s/.test(input[cursor])) {
      cursor++;
      continue;
    }

    let matchFound = false;
    // On extrait le reste de la chaîne pour tester les regex
    // (Note: Les moteurs JS modernes optimisent slice() très efficacement)
    const remainingText = input.slice(cursor);

    // 2. ITERATION DES PATTERNS (Priorité définie dans grammar.ts)
    for (const { type, regex } of TOKEN_PATTERNS) {
      const match = remainingText.match(regex);

      if (match) {
        const rawValue = match[0];
        let finalType: TokenType = type;

        // 3. RAFFINEMENT SÉMANTIQUE (Classification)
        // Si c'est un mot générique, on vérifie s'il appartient à un dictionnaire spécialisé
        if (type === 'WORD') {
          // Normalisation pour la recherche (insensible à la casse et aux accents)
          const normalized = rawValue.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");

          // ORDRE DE PRIORITÉ DE DÉTECTION :
          if (YAOUNDE_SLANG.has(normalized)) {
            finalType = 'SLANG';
          } else if (PIDGIN_KEYWORDS.has(normalized)) {
            finalType = 'PIDGIN_KW';
          } else if (KNOWN_VERBS.has(normalized)) {
            // Note: On marque les verbes connus comme 'VERB' pour l'UI, 
            // même si le Parser fera sa propre validation grammaticale.
            finalType = 'VERB' as TokenType; 
          } 
          // Sinon, cela reste un 'WORD' (Nom, Adjectif, etc.)
        }

        // 4. CRÉATION DU TOKEN
        tokens.push({
          type: finalType,
          value: rawValue
        });

        // Avancer le curseur de la longueur du match
        cursor += rawValue.length;
        matchFound = true;
        break; // On sort de la boucle patterns pour passer au token suivant
      }
    }

    // 5. GESTION DES ERREURS (Caractères inconnus)
    if (!matchFound) {
      // On capture le caractère fautif comme UNKNOWN pour ne pas bloquer le processus
      tokens.push({
        type: 'UNKNOWN',
        value: input[cursor]
      });
      cursor++;
    }
  }

  return tokens;
};