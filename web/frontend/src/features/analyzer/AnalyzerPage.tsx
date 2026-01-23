import { useState, useCallback } from 'react';
import { motion } from 'framer-motion';

// --- CORE ENGINE ---
import { tokenize } from '../../core/engine/lexer';
import { Parser } from '../../core/engine/parser';

// --- COMPONENTS ---
import { AnalyzerConsole } from './AnalyzerConsole';
import { ResultDisplay } from './ResultDisplay';
import { ModeSelector } from './ModeSelector';

// --- TYPES ---
// --- TYPES ---
import type { AnalysisMode, ParseResult } from '../../types';

// --- VARIANTES D'ANIMATION ---
const pageVariants = {
  initial: { opacity: 0 },
  animate: { 
    opacity: 1,
    transition: { staggerChildren: 0.1, delayChildren: 0.2 }
  },
  exit: { opacity: 0 }
};

const panelVariants = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0, transition: { type: 'spring', stiffness: 100, damping: 20 } }
};

// --- COMPOSANT ---
export const AnalyzerPage = () => {
  // État de l'application
  const [mode, setMode] = useState<AnalysisMode>('LEXICAL');
  const [result, setResult] = useState<ParseResult | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  
  // LOGIQUE MÉTIER : LE CŒUR DU SYSTÈME
  const handleAnalyze = useCallback(async (text: string) => {
    setIsAnalyzing(true);
    setResult(null); // Reset visuel

    // 1. Simulation d'un traitement asynchrone (UX "Weight")
    // Permet à l'utilisateur de ressentir le "travail" du moteur
    await new Promise(resolve => setTimeout(resolve, 600));

    try {
      // 2. ÉTAPE 1 : TOKENIZATION (Lexer)
      // On transforme le texte brut en perles de sens
      const tokens = tokenize(text);

      // 3. ÉTAPE 2 : PARSING (Syntaxe)
      // On tente de construire l'arbre AST
      const parser = new Parser(tokens);
      const parseResult = parser.parse();

      // 4. AGRÉGATION DES RÉSULTATS
      // On injecte les tokens dans le résultat final pour que le mode LEXICAL puisse les afficher
      // TypeScript merge: ParseResult (du parser) + tokens (du lexer)
      const finalResult = {
        ...parseResult,
        tokens: tokens 
      };

      setResult(finalResult as ParseResult);

    } catch (error) {
      // Filet de sécurité en cas de crash critique du moteur
      console.error("Critical Engine Failure:", error);
      setResult({
        isValid: false,
        message: "SYSTEM_CRITICAL_FAILURE: Engine crashed unexpectedly.",
      });
    } finally {
      setIsAnalyzing(false);
    }
  }, []);

  return (
    <motion.div
      id="analyzer"
      variants={pageVariants}
      initial="initial"
      animate="animate"
      exit="exit"
      className="relative min-h-screen pt-8 pb-20 px-4 md:px-8 max-w-[1600px] mx-auto"
    >
      
      {/* 1. HEADER DU DASHBOARD */}
      <motion.div variants={panelVariants} className="flex flex-col md:flex-row justify-between items-end mb-8 gap-6 border-b border-kmer-white/10 pb-6">
        <div>
          <h1 className="text-3xl font-bold text-white tracking-tight mb-2">
            Neural <span className="text-kmer-neon">Engine</span>
          </h1>
          <p className="text-kmer-white/60 font-mono text-sm max-w-xl">
            Advanced linguistic processing unit. Input raw text to extract lexical tokens and validate syntactic structures via recursive descent algorithms.
          </p>
        </div>

        {/* Sélecteur de Mode (Visible en haut pour un accès rapide) */}
        <div className="flex flex-col items-end gap-2">
          <span className="text-[10px] font-mono text-kmer-white/40 uppercase tracking-widest">
            Analysis Mode
          </span>
          <ModeSelector 
            currentMode={mode} 
            onChange={setMode} 
            disabled={isAnalyzing}
          />
        </div>
      </motion.div>

      {/* 2. GRILLE DE TRAVAIL (Workspace) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 h-full min-h-[600px]">
        
        {/* COLONNE GAUCHE : CONSOLE D'ENTRÉE (40% width on desktop) */}
        <motion.div variants={panelVariants} className="lg:col-span-5 flex flex-col gap-6">
          <div className="flex-grow">
            <AnalyzerConsole 
              onAnalyze={handleAnalyze} 
              isAnalyzing={isAnalyzing} 
            />
          </div>

          {/* Widget d'info rapide (Tip Contextuel) */}
          <div className="hidden lg:block p-4 rounded-lg border border-kmer-white/10 bg-kmer-white/5 backdrop-blur-sm">
            <div className="flex items-start gap-3">
              <svg className="w-5 h-5 text-kmer-neon mt-0.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
              <div className="space-y-1">
                <h4 className="text-sm font-bold text-white">Engine Tips</h4>
                <p className="text-xs text-kmer-white/60 leading-relaxed font-mono">
                  {mode === 'LEXICAL' 
                    ? "Lexical mode breaks down sentences into atomic units. Use slang words like 'ndem', 'wanda' to see the tokenizer in action."
                    : "Syntactic mode validates grammar structure (S -> NP + VP). Ensure your sentence contains at least one Subject and one Verb."
                  }
                </p>
              </div>
            </div>
          </div>
        </motion.div>

        {/* COLONNE DROITE : RÉSULTATS (60% width on desktop) */}
        <motion.div variants={panelVariants} className="lg:col-span-7 h-full">
           <ResultDisplay 
             result={result} 
             mode={mode} 
           />
        </motion.div>

      </div>

    </motion.div>
  );
};