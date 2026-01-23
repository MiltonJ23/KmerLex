import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { GlassCard } from '../../components/ui/GlassCard';
import { Badge } from '../../components/ui/Badge';
import { SyntaxTreeViz } from '../../components/viz/SyntaxTreeViz';
import type { ParseResult, AnalysisMode } from '../../types';

// --- PROPS ---
interface ResultDisplayProps {
  result: ParseResult | null;
  mode: AnalysisMode;
}

// --- UTILITAIRE : FORMATTER JSON ---
const SyntaxHighlight = ({ json }: { json: object }) => {
  const jsonString = JSON.stringify(json, null, 2);
  // Coloration syntaxique basique pour le JSON brut
  return (
    <pre className="font-mono text-xs md:text-sm leading-relaxed text-kmer-white/70 overflow-x-auto whitespace-pre-wrap">
      {jsonString.replace(/(".*?")(?=:)/g, '<span class="text-blue-300">$1</span>') // Clés
                 .replace(/: ("(.*?)")/g, ': <span class="text-green-300">"$2"</span>') // Valeurs String
                 .replace(/: (\d+)/g, ': <span class="text-orange-300">$1</span>') // Valeurs Nombre
                 .replace(/null/g, '<span class="text-red-300">null</span>') // Null
                 .split('\n').map((line, i) => (
                    <div key={i} dangerouslySetInnerHTML={{ __html: line }} />
                 ))
      }
    </pre>
  );
};

// --- COMPOSANT ---
export const ResultDisplay = ({ result, mode }: ResultDisplayProps) => {
  const [showRawJson, setShowRawJson] = useState(false);
  const [copied, setCopied] = useState(false);

  // Fonction de copie dans le presse-papier
  const handleCopy = () => {
    if (!result) return;
    const content = showRawJson 
      ? JSON.stringify(result, null, 2) 
      : (mode === 'LEXICAL' 
          ? (result as any).tokens?.map((t: any) => t.value).join(' ') 
          : JSON.stringify((result as any).tree, null, 2));
          
    navigator.clipboard.writeText(content || "");
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <GlassCard className="h-full min-h-[500px] flex flex-col border-kmer-white/10 bg-[#051A14]/60 overflow-hidden relative">
      
      {/* 1. HEADER (Barre d'outils) */}
      <div className="flex items-center justify-between px-5 py-3 border-b border-kmer-white/10 bg-kmer-white/5 z-20">
        
        {/* Titre */}
        <div className="flex items-center gap-2">
          <div className={`w-2 h-2 rounded-full ${result ? (result.isValid ? 'bg-kmer-neon' : 'bg-red-500') : 'bg-gray-500'}`} />
          <span className="text-xs font-mono font-bold text-kmer-white/60 tracking-widest uppercase">
            {mode === 'LEXICAL' ? 'LEXICAL_OUTPUT' : 'SYNTACTIC_OUTPUT'}
          </span>
        </div>

        {/* Actions (disponibles seulement si résultat) */}
        {result && (
          <div className="flex items-center gap-3">
            
            {/* Toggle JSON / VIZ */}
            <button
              onClick={() => setShowRawJson(!showRawJson)}
              className="text-[10px] font-mono font-bold text-kmer-white/40 hover:text-kmer-neon transition-colors uppercase"
            >
              [{showRawJson ? 'VIEW_VISUAL' : 'VIEW_RAW_JSON'}]
            </button>

            {/* Séparateur */}
            <div className="w-px h-3 bg-kmer-white/10" />

            {/* Bouton Copier */}
            <button
              onClick={handleCopy}
              className="flex items-center gap-1.5 text-[10px] font-mono font-bold text-kmer-white/40 hover:text-white transition-colors uppercase group"
              title="Copy to Clipboard"
            >
              {copied ? (
                <>
                  <svg className="w-3 h-3 text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                  <span className="text-green-400">COPIED</span>
                </>
              ) : (
                <>
                  <svg className="w-3 h-3 group-hover:scale-110 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 012-2h2a2 2 0 012 2m-6 0h6" /></svg>
                  <span>COPY</span>
                </>
              )}
            </button>
          </div>
        )}
      </div>

      {/* 2. CONTENU PRINCIPAL */}
      <div className="flex-grow relative bg-[#030c0a] scrollbar-thin scrollbar-thumb-kmer-white/10 scrollbar-track-transparent overflow-auto">
        <AnimatePresence mode="wait">
          
          {/* CAS A: AUCUN RÉSULTAT (Idle) */}
          {!result && (
            <motion.div
              key="idle"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 flex flex-col items-center justify-center text-kmer-white/20 select-none"
            >
              <div className="w-24 h-24 border border-dashed border-current rounded-full flex items-center justify-center mb-4 animate-[spin_20s_linear_infinite]">
                <div className="w-16 h-16 border border-current rounded-full opacity-50" />
              </div>
              <p className="font-mono text-sm tracking-widest">SYSTEM STANDBY</p>
              <p className="font-mono text-xs opacity-50 mt-2">Waiting for input stream...</p>
            </motion.div>
          )}

          {/* CAS B: ERREUR (Invalid) */}
          {result && !result.isValid && (
             <motion.div
              key="error"
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0 }}
              className="p-8 w-full h-full flex flex-col items-center justify-center text-center"
             >
               <div className="p-4 bg-red-500/10 border border-red-500/30 rounded-lg max-w-md backdrop-blur-sm">
                  <div className="flex items-center justify-center gap-2 text-red-400 mb-2">
                    <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                    <h3 className="font-bold font-mono tracking-wide">PARSING_ERROR</h3>
                  </div>
                  <p className="text-red-200/80 font-mono text-sm">{result.message}</p>
                  
                  {/* Affichage partiel si dispo (ex: tokens valides mais syntaxe invalide) */}
                  {(result as any).tree && (
                    <div className="mt-4 pt-4 border-t border-red-500/20 text-xs text-red-400/50 font-mono">
                      Partial structure generated. Switch to raw JSON to inspect.
                    </div>
                  )}
               </div>
             </motion.div>
          )}

          {/* CAS C: SUCCÈS - VUE JSON BRUTE */}
          {result && result.isValid && showRawJson && (
            <motion.div
              key="json"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="p-6 h-full w-full"
            >
              <SyntaxHighlight json={result} />
            </motion.div>
          )}

          {/* CAS D: SUCCÈS - VUE LEXICALE (Tokens) */}
          {result && result.isValid && !showRawJson && mode === 'LEXICAL' && (
            <motion.div
              key="lexical"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="p-8 h-full w-full flex flex-wrap content-start gap-3"
            >
              {(result as any).tokens?.map((token: any, index: number) => (
                <div key={index} className="flex flex-col items-center">
                  <Badge type={token.type} delay={index}>
                    {token.type}
                  </Badge>
                  <motion.div
                    initial={{ opacity: 0, y: -5 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 + 0.2 }}
                    className="mt-2 px-2 py-1 bg-kmer-white/5 rounded text-sm font-mono text-kmer-white border border-kmer-white/10"
                  >
                    {token.value}
                  </motion.div>
                  {/* Petit index pour le debug visuel */}
                  <span className="text-[9px] text-kmer-white/20 font-mono mt-1">{index}</span>
                </div>
              ))}
            </motion.div>
          )}

          {/* CAS E: SUCCÈS - VUE SYNTAXIQUE (Arbre) */}
          {result && result.isValid && !showRawJson && mode === 'SYNTACTIC' && (
            <motion.div
              key="syntactic"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="h-full w-full"
            >
              {/* Le SyntaxTreeViz gère son propre Zoom/Pan */}
              <SyntaxTreeViz data={(result as any).tree} />
            </motion.div>
          )}

        </AnimatePresence>
      </div>

      {/* 3. FOOTER (Status Bar) */}
      <div className="px-5 py-2 border-t border-kmer-white/10 bg-kmer-white/5 flex justify-between items-center text-[10px] font-mono text-kmer-white/30">
        
        {/* Info Gauche */}
        <div className="flex gap-4">
          {result?.isValid && mode === 'LEXICAL' && (
            <span>TOKENS: <span className="text-kmer-neon">{(result as any).tokens?.length || 0}</span></span>
          )}
          {result?.isValid && mode === 'SYNTACTIC' && (
            <span>ROOT: <span className="text-kmer-neon">S (Sentence)</span></span>
          )}
        </div>

        {/* Info Droite */}
        <div className="flex items-center gap-2">
           <div className={`w-1.5 h-1.5 rounded-full ${result ? 'animate-pulse bg-kmer-neon' : 'bg-transparent'}`} />
           <span>{result ? 'EXECUTION_COMPLETE' : 'WAITING'}</span>
        </div>
      </div>

    </GlassCard>
  );
};