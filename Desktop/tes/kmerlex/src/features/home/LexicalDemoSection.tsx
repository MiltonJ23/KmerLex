import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { GlassCard } from '../../components/ui/GlassCard';
import { Badge } from '../../components/ui/Badge';
import { NeonButton } from '../../components/ui/NeonButton';
import { type Token } from '../../types';

// --- DONNÉES DE DÉMO (Statiques pour la performance) ---
const RAW_SENTENCE = "Le pater a ndem";

const DEMO_TOKENS: Token[] = [
  { type: 'WORD', value: 'Le' },
  { type: 'SLANG', value: 'pater' },
  { type: 'VERB', value: 'a' },
  { type: 'SLANG', value: 'ndem' },
];

// --- COMPOSANT ---
export const LexicalDemoSection = () => {
  const [status, setStatus] = useState<'IDLE' | 'SCANNING' | 'COMPLETE'>('IDLE');

  const runDemo = () => {
    setStatus('SCANNING');
    // Simulation du temps de traitement du processeur
    setTimeout(() => {
      setStatus('COMPLETE');
    }, 1500);
  };

  const resetDemo = () => {
    setStatus('IDLE');
  };

  return (
    <section className="py-24 relative overflow-hidden">
      {/* Éléments d'arrière-plan discrets */}
      <div className="absolute right-0 top-1/2 -translate-y-1/2 w-1/2 h-full bg-gradient-to-l from-kmer-light/5 to-transparent pointer-events-none" />

      <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
        
        {/* --- COLONNE GAUCHE : THÉORIE --- */}
        <motion.div
          initial={{ opacity: 0, x: -50 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="space-y-6"
        >
          <div className="flex items-center gap-3 mb-4">
            <span className="px-3 py-1 text-[10px] font-mono font-bold text-kmer-dark bg-kmer-light rounded-sm">
              STEP 01
            </span>
            <span className="h-px flex-grow bg-kmer-light/20" />
          </div>

          <h2 className="text-3xl md:text-4xl font-bold text-white tracking-tight">
            Lexical <span className="text-kmer-light">Tokenization</span>
          </h2>
          
          <p className="text-lg text-kmer-white/70 leading-relaxed">
            Before understanding meaning, the engine must break down the stream of characters into atomic units called <strong className="text-kmer-neon">Tokens</strong>.
          </p>

          <ul className="space-y-4 font-mono text-sm text-kmer-white/60">
            <li className="flex items-start gap-3">
              <span className="text-kmer-neon mt-1">▹</span>
              <span>Detects Camfranglais slang (e.g., "ndem", "wanda").</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="text-kmer-neon mt-1">▹</span>
              <span>Identifies Pidgin keywords & verbal pivots.</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="text-kmer-neon mt-1">▹</span>
              <span>Filters noise (spaces, irrelevant punctuation).</span>
            </li>
          </ul>
        </motion.div>

        {/* --- COLONNE DROITE : DÉMO INTERACTIVE --- */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <GlassCard className="p-8 border-kmer-white/10 bg-[#051A14]/60">
            
            {/* Header de la carte */}
            <div className="flex justify-between items-center mb-8 pb-4 border-b border-white/5">
              <div className="flex items-center gap-2 text-xs font-mono text-kmer-white/50">
                <div className={`w-2 h-2 rounded-full ${status === 'SCANNING' ? 'bg-yellow-400 animate-pulse' : status === 'COMPLETE' ? 'bg-kmer-neon' : 'bg-gray-500'}`} />
                STATUS: {status}
              </div>
              <div className="text-xs font-mono text-kmer-white/30">MODULE: LEXER</div>
            </div>

            {/* Zone de Contenu Dynamique */}
            <div className="min-h-[180px] flex flex-col justify-center">
              <AnimatePresence mode="wait">
                
                {/* ÉTAT 1 : TEXTE BRUT */}
                {status === 'IDLE' && (
                  <motion.div
                    key="raw"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0, filter: "blur(10px)" }}
                    className="text-center space-y-4"
                  >
                    <div className="text-sm text-kmer-white/40 font-mono uppercase tracking-widest mb-2">
                      Input Stream
                    </div>
                    <div className="text-3xl md:text-4xl font-bold text-white relative inline-block">
                      "{RAW_SENTENCE}"
                      {/* Petit curseur clignotant */}
                      <span className="ml-1 w-2 h-8 bg-kmer-neon/50 inline-block align-middle animate-pulse" />
                    </div>
                  </motion.div>
                )}

                {/* ÉTAT 2 : SCANNING (Barre de progression) */}
                {status === 'SCANNING' && (
                  <motion.div
                    key="scanning"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="w-full space-y-4"
                  >
                    <div className="flex justify-between text-xs font-mono text-kmer-neon">
                      <span>ANALYZING PATTERNS...</span>
                      <span>Processing...</span>
                    </div>
                    {/* Barre de progression animée */}
                    <div className="h-2 w-full bg-kmer-white/10 rounded-full overflow-hidden">
                      <motion.div
                        className="h-full bg-kmer-neon shadow-[0_0_10px_#00E676]"
                        initial={{ width: "0%" }}
                        animate={{ width: "100%" }}
                        transition={{ duration: 1.5, ease: "easeInOut" }}
                      />
                    </div>
                    <div className="font-mono text-xs text-center text-kmer-white/30 pt-2">
                      Comparing against 2,000+ slang definitions
                    </div>
                  </motion.div>
                )}

                {/* ÉTAT 3 : RÉSULTAT (TOKENS) */}
                {status === 'COMPLETE' && (
                  <motion.div
                    key="result"
                    className="flex flex-wrap justify-center gap-4"
                  >
                    {DEMO_TOKENS.map((token, i) => (
                      <motion.div
                        key={i}
                        initial={{ opacity: 0, y: 20, scale: 0.8 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        transition={{ delay: i * 0.1, type: "spring" }}
                        className="text-center"
                      >
                        {/* Le Badge Token */}
                        <div className="mb-2">
                          <Badge type={token.type} delay={i * 0.1}>
                            {token.type}
                          </Badge>
                        </div>
                        {/* La Valeur */}
                        <div className="text-xl font-bold text-white">
                          {token.value}
                        </div>
                        {/* Ligne connectrice décorative */}
                        <div className="h-4 w-px bg-white/10 mx-auto mt-1" />
                        <div className="w-1 h-1 bg-white/20 rounded-full mx-auto" />
                      </motion.div>
                    ))}
                  </motion.div>
                )}

              </AnimatePresence>
            </div>

            {/* Actions */}
            <div className="mt-10 flex justify-center border-t border-white/5 pt-6">
              {status === 'IDLE' ? (
                <NeonButton onClick={runDemo} className="w-full sm:w-auto">
                  INITIATE SCAN
                </NeonButton>
              ) : (
                <button
                  onClick={resetDemo}
                  disabled={status === 'SCANNING'}
                  className={`
                    text-xs font-mono tracking-widest border-b border-transparent 
                    ${status === 'SCANNING' ? 'text-gray-600 cursor-not-allowed' : 'text-kmer-light hover:border-kmer-light hover:text-white transition-all'}
                  `}
                >
                  [ RESET SIMULATION ]
                </button>
              )}
            </div>

          </GlassCard>
        </motion.div>

      </div>
    </section>
  );
};