/**
 * REGISTRE DES POINTS DE TERMINAISON (ENDPOINTS)
 * Centralise toutes les routes API pour éviter les chaînes magiques dans les composants.
 */

const API_ROOT = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';
const API_VERSION = '/v1';
const BASE_URL = `${API_ROOT}${API_VERSION}`;

export const ENDPOINTS = {
  // --- 1. MOTEUR D'INTELLIGENCE (Si traitement serveur requis) ---
  ENGINE: {
    /** Analyse complète (Lexical + Syntaxique + Sémantique) */
    ANALYZE: `${BASE_URL}/engine/process`,
    /** Récupérer uniquement les tokens (pour le debug) */
    TOKENIZE: `${BASE_URL}/engine/tokenize`,
    /** Valider une phrase sans générer l'arbre complet */
    VALIDATE: `${BASE_URL}/engine/validate`,
  },

  // --- 2. GESTION DU CORPUS (Crowdsourcing) ---
  CORPUS: {
    /** Sauvegarder une phrase analysée pour l'entraînement futur */
    SAVE_ENTRY: `${BASE_URL}/corpus/entry`,
    /** Suggérer une nouvelle définition d'argot (Contribution user) */
    SUGGEST_TERM: `${BASE_URL}/corpus/suggest`,
    /** Récupérer les statistiques globales (ex: Mots les plus utilisés) */
    GET_STATS: `${BASE_URL}/corpus/stats`,
  },

  // --- 3. SYSTÈME & MONITORING ---
  SYSTEM: {
    /** Healthcheck : Vérifier si le backend est en ligne */
    HEALTH: `${BASE_URL}/health`,
    /** Rapporter une erreur critique du frontend */
    LOG_ERROR: `${BASE_URL}/logs/error`,
  },
} as const;

// Type helper pour extraire les valeurs (utile pour le typage des appels génériques)
export type ApiEndpoint = typeof ENDPOINTS[keyof typeof ENDPOINTS][keyof typeof ENDPOINTS[keyof typeof ENDPOINTS]];