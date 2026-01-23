import type { Token, ASTNode, ParseResult, TokenType } from "../../types";
import { KNOWN_VERBS, PIDGIN_KEYWORDS } from "../constants/grammar";

/**
 * MOTEUR D'ANALYSE SYNTAXIQUE (PARSER)
 * Type: Recursive Descent Parser
 * Objectif: Transformer une liste plate de tokens en un Arbre Syntaxique Abstrait (AST).
 * Grammaire simplifiée : S (Sentence) -> NP (Noun Phrase) + VP (Verb Phrase)
 */
export class Parser {
  private tokens: Token[];
  private current: number = 0;

  constructor(tokens: Token[]) {
    // On filtre les tokens inutiles (Espaces, Inconnus, Ponctuation) pour l'analyse structurelle
    // Cela simplifie grandement la logique de descente.
    this.tokens = tokens.filter(t => 
      t.type !== 'PUNCTUATION' && 
      t.type !== 'UNKNOWN'
    );
  }

  /**
   * Point d'entrée principal de l'analyse.
   */
  public parse(): ParseResult {
    this.current = 0;
    
    // Si aucun token valide n'est trouvé après filtrage
    if (this.tokens.length === 0) {
      return { 
        isValid: false, 
        message: "En attente de saisie..." 
      };
    }

    // Racine de l'arbre : S (Sentence)
    const root: ASTNode = { name: "S", children: [] };

    // ÉTAPE 1 : Analyse du Groupe Nominal (Sujet)
    const npNode = this.parseNP();
    
    // ÉTAPE 2 : Analyse du Groupe Verbal (Action)
    const vpNode = this.parseVP();

    // Construction de l'arbre final
    if (npNode) root.children?.push(npNode);
    if (vpNode) root.children?.push(vpNode);

    // VALIDATION DE LA STRUCTURE
    // Une phrase valide complète doit avoir au moins un Verbe (VP)
    // Sauf si c'est une interjection pure (ex: "Wanda !")
    
    if (!vpNode) {
      // Cas particulier : Phrase nominale pure (ex: "Le grand quartier")
      if (npNode && this.isAtEnd()) {
        return { 
          isValid: false, 
          message: "Phrase nominale détectée. Il manque une action (Verbe).",
          tree: root 
        };
      }
      return { isValid: false, message: "Structure incomplète : Verbe introuvable." };
    }

    // Si on a consommé tous les tokens et qu'on a un VP, c'est valide.
    return { 
      isValid: true, 
      message: "Structure Valide : S -> NP + VP", 
      tree: root 
    };
  }

  // ==========================================================================
  // MÉTHODES DE DESCENTE RÉCURSIVE (GRAMMAIRE)
  // ==========================================================================

  /**
   * Parse le Noun Phrase (Sujet).
   * Stratégie : Consomme tout jusqu'à rencontrer un Verbe.
   */
  private parseNP(): ASTNode | null {
    const node: ASTNode = { name: "NP", children: [] };
    let hasContent = false;

    while (!this.isAtEnd()) {
      const token = this.peek();

      // Si on tombe sur un verbe ou un mot-clé Pidgin verbal, le NP est fini.
      if (this.isVerb(token)) {
        break;
      }

      // Ajout du token au NP en tant que feuille
      // On essaie de deviner le rôle grammatical (Détérminant vs Nom)
      const grammaticalType = this.guessGrammarType(token);
      
      node.children?.push({ 
        name: grammaticalType, 
        value: token.value 
      });

      this.advance();
      hasContent = true;
    }

    return hasContent ? node : null;
  }

  /**
   * Parse le Verb Phrase (Prédicat).
   * Stratégie : Commence obligatoirement par un Verbe, puis prend le reste comme Objet.
   */
  private parseVP(): ASTNode | null {
    if (this.isAtEnd()) return null;

    const node: ASTNode = { name: "VP", children: [] };
    const verbToken = this.peek();

    // Vérification stricte : Le VP doit commencer par un verbe
    if (!this.isVerb(verbToken)) {
      return null;
    }

    // 1. Ajouter le Verbe (V)
    node.children?.push({ 
      name: "V", 
      value: verbToken.value 
    });
    this.advance();

    // 2. Le reste est considéré comme l'Objet (OBJ) ou Complément
    // Pour simplifier, on met tout le reste dans le VP
    while (!this.isAtEnd()) {
      const token = this.peek();
      node.children?.push({ 
        name: this.guessGrammarType(token), // N, ADJ, SLANG...
        value: token.value 
      });
      this.advance();
    }

    return node;
  }

  // ==========================================================================
  // UTILITAIRES (HELPERS)
  // ==========================================================================

  /**
   * Détermine si un token agit comme un verbe.
   * Utilise le type du Lexer OU les listes de constantes pour être sûr.
   */
  private isVerb(token: Token): boolean {
    if (token.type === 'VERB') return true;
    
    const cleanValue = token.value.toLowerCase().replace(/['’]/g, "");
    
    // Vérification Pidgin (ex: "di", "go", "don") qui sont des marqueurs verbaux
    if (token.type === 'PIDGIN_KW' && (cleanValue === 'di' || cleanValue === 'go' || cleanValue === 'don' || cleanValue === 'fit')) {
      return true;
    }

    return KNOWN_VERBS.has(cleanValue);
  }

  /**
   * Devine le type grammatical pour l'affichage dans l'arbre (Feuilles).
   * Transforme les types techniques (WORD, SLANG) en types linguistiques (N, DET, ETC).
   */
  private guessGrammarType(token: Token): string {
    if (token.type === 'SLANG') return 'SLANG';
    if (token.type === 'NUMBER') return 'NUM';
    if (token.type === 'PIDGIN_KW') return 'KW';
    
    // Heuristique simple pour les déterminants français courants
    const dets = new Set(['le', 'la', 'les', 'un', 'une', 'des', 'mon', 'ton', 'son', 'sa', 'ce', 'cette']);
    if (dets.has(token.value.toLowerCase())) return 'DET';

    return 'N'; // Par défaut, on suppose que c'est un Nom
  }

  private peek(): Token {
    return this.tokens[this.current];
  }

  private advance(): Token {
    if (!this.isAtEnd()) this.current++;
    return this.tokens[this.current - 1];
  }

  private isAtEnd(): boolean {
    return this.current >= this.tokens.length;
  }
}