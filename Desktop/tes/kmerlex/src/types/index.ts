/**
 * ============================================================================
 * KMERLEX TYPE DEFINITIONS
 * Central Hub for all interfaces, types, and DTOs used across the application.
 * ============================================================================
 */

// ============================================================================
// 1. ANALYSE LEXICALE (TOKENIZATION)
// ============================================================================

/**
 * Catégories de tokens reconnues par le Lexer.
 * - `SLANG`: Argot Camfranglais (Ex: "wanda", "ndem")
 * - `PIDGIN_KW`: Mots-clés structurels du Pidgin (Ex: "na", "di", "don")
 * - `VERB`: Verbes identifiés (FR/EN/Mixed)
 * - `NUMBER`: Valeurs numériques (Ex: "2k", "100")
 * - `WORD`: Mots génériques non classifiés
 * - `PUNCTUATION`: Séparateurs logiques
 * - `UNKNOWN`: Caractères non reconnus (Fallback)
 */
export type TokenType = 
  | 'WORD' 
  | 'NUMBER' 
  | 'PUNCTUATION' 
  | 'SLANG' 
  | 'PIDGIN_KW' 
  | 'VERB' 
  | 'UNKNOWN';

export interface Token {
  /** Type lexical du token */
  readonly type: TokenType;
  /** Valeur textuelle brute extraite du code source */
  readonly value: string;
  /** Position de départ (index) dans la chaîne originale (Optionnel pour le moment, utile pour le highlighting) */
  readonly start?: number;
  /** Position de fin (index) */
  readonly end?: number;
}

// ============================================================================
// 2. ANALYSE SYNTAXIQUE (PARSING & AST)
// ============================================================================

/**
 * Noeud de l'Arbre Syntaxique Abstrait (AST).
 * Utilisé par le Parser et le Visualiseur (SyntaxTreeViz).
 */
export interface ASTNode {
  /** Identifiant unique (UUID ou Hash) pour les clés React (Performance rendering) */
  readonly id?: string; 
  /** Étiquette grammaticale (Ex: "S", "NP", "VP", "V", "N") */
  readonly name: string;
  /** Valeur textuelle (Uniquement pour les nœuds feuilles) */
  readonly value?: string;
  /** Sous-arbres / Enfants récursifs */
  readonly children?: ASTNode[];
  /** Métadonnées additionnelles (Ex: Score de confiance, règles appliquées) */
  readonly metadata?: Record<string, any>;
}

// ============================================================================
// 3. RÉSULTATS DU MOTEUR (ENGINE OUTPUT)
// ============================================================================

/**
 * Résultat d'une analyse réussie.
 */
interface ParseSuccess {
  readonly isValid: true;
  readonly message: string;
  readonly tree: ASTNode;   // L'arbre est GARANTI si valide
  readonly tokens: Token[]; // Les tokens sont GARANTIS
}

/**
 * Résultat d'une analyse échouée.
 */
interface ParseError {
  readonly isValid: false;
  readonly message: string;
  readonly tree?: ASTNode;  // Un arbre partiel peut exister (pour debug)
  readonly errorIndex?: number; // Position de l'erreur dans le texte
}

/**
 * Union discriminée pour le résultat du Parser.
 * Permet à TS de rétrécir le type (Type Narrowing) en vérifiant `isValid`.
 */
export type ParseResult = ParseSuccess | ParseError;

// ============================================================================
// 4. ÉTAT DE L'INTERFACE (UI STATE)
// ============================================================================

export type AnalysisMode = 'LEXICAL' | 'SYNTACTIC';

/**
 * Représente une entrée dans l'historique de l'utilisateur.
 */
export interface HistoryEntry {
  readonly id: string;
  readonly timestamp: number;
  readonly text: string;
  readonly mode: AnalysisMode;
  readonly result: ParseResult;
}

// ============================================================================
// 5. API DATA TRANSFER OBJECTS (DTOs)
// ============================================================================

/**
 * Payload envoyé au backend pour analyse (Si mode serveur activé).
 */
export interface AnalyzeRequestDTO {
  text: string;
  options?: {
    includeTree?: boolean;
    deepScan?: boolean;
  };
}

/**
 * Contribution de l'utilisateur au corpus (Crowdsourcing).
 */
export interface CorpusContributionDTO {
  originalText: string;
  userCorrection?: string;
  dialect: 'CAMFRANGLAIS' | 'PIDGIN' | 'MIXED';
  tags: string[];
}

/**
 * Statistiques globales du système.
 */
export interface SystemStatsDTO {
  totalAnalyzed: number;
  topSlangWords: Array<{ word: string; count: number }>;
  uptime: number;
}