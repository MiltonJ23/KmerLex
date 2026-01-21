import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { GlassCard } from '../../components/ui/GlassCard';
import { NeonButton } from '../../components/ui/NeonButton';
import { SyntaxTreeViz } from '../../components/viz/SyntaxTreeViz';
import type { ASTNode } from '../../types';

// --- DONNÉES DE DÉMO (Arbre Syntaxique Abstrait) ---
// Phrase : "Muna di cry" (L'enfant est en train de pleurer - Pidgin)
const DEMO_AST: ASTNode = {
  name: "S", // Sentence
  children: [
    { 
      name: "NP", // Noun Phrase (Sujet)
      children: [
        { name: "N", value: "Muna" } // Nom propre
      ]
    },
    { 
      name: "VP", // Verb Phrase (Action)
      children: [
        { name: "AUX", value: "di" }, // Auxiliaire aspectuel (Progressif)
        { name: "V", value: "cry" }   // Verbe lexical
      ]
    }
  ]
};

const LOG_MESSAGES = [
  "> Initializing Recursive Descent...",
  "> Parsing NP (Noun Phrase)...",
  "> Token found: 'Muna' (NOUN)",
  "> Parsing VP (Verb Phrase)...",
  "> Pivot detected: 'di' (AUX)",
  "> Building AST nodes...",
  "> Syntax Validated."
];

// --- COMPOSANT ---
export const SyntacticDemoSection = () => {
  const [status, setStatus] = useState<'IDLE' | 'PARSING' | 'BUILT'>('IDLE');
  const [logIndex, setLogIndex] = useState(0);

  // Gestion de l'animation des logs console
  useEffect(() => {
    if (status === 'PARSING') {
      const interval = setInterval(() => {
        setLogIndex(prev => {
          if (prev >= LOG_MESSAGES.length - 1) {
            clearInterval(interval);
            setTimeout(() => setStatus('BUILT'), 500); // Fin du parsing
            return prev;
          }
          return prev + 1;
        });
      }, 300); // Vitesse de défilement des logs
      return () => clearInterval(interval);
    } else if (status === 'IDLE') {
      setLogIndex(0);
    }
  }, [status]);

  return (
    <section className="py-24 relative overflow-hidden bg-[#04120f]">
      {/* Background Decoratif (Grille technique) */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(0,230,118,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(0,230,118,0.02)_1px,transparent_1px)] bg-[size:40px_40px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-2 gap-16 items-center relative z-10">
        
        {/* --- COLONNE DROITE (Intervertie pour le rythme visuel sur Desktop) --- */}
        {/* Sur mobile, on le remet en bas via l'ordre flex ou grid, mais ici ordre naturel */}
        <motion.div
           initial={{ opacity: 0, x: 50 }}
           whileInView={{ opacity: 1, x: 0 }}
           viewport={{ once: true }}
           transition={{ duration: 0.6 }}
           className="order-2 lg:order-1"
        >
          <GlassCard className="p-1 border-kmer-white/10 bg-[#051A14]/80 overflow-hidden min-h-[450px] flex flex-col">
            
            {/* Barre de titre façon fenêtre OS */}
            <div className="flex items-center justify-between px-4 py-3 bg-kmer-white/5 border-b border-kmer-white/10">
              <span className="text-[10px] font-mono text-kmer-white/40 uppercase tracking-widest">
                AST_Visualizer.exe
              </span>
              <div className="flex gap-1.5">
                <div className="w-2 h-2 rounded-full bg-kmer-white/20" />
                <div className="w-2 h-2 rounded-full bg-kmer-white/20" />
              </div>
            </div>

            {/* ZONE D'AFFICHAGE DYNAMIQUE */}
            <div className="flex-grow relative flex items-center justify-center bg-[#020806]">
              <AnimatePresence mode="wait">
                
                {/* 1. IDLE STATE */}
                {status === 'IDLE' && (
                  <motion.div
                    key="idle"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="text-center space-y-4 px-6"
                  >
                    <div className="inline-block p-4 rounded-full bg-kmer-neon/5 border border-kmer-neon/20 mb-2">
                      <svg className="w-8 h-8 text-kmer-neon opacity-50" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.384-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
                      </svg>
                    </div>
                    <h3 className="text-xl font-bold text-white">Ready to Parse</h3>
                    <p className="text-sm text-kmer-white/50 font-mono">
                      Input: <span className="text-kmer-light">"Muna di cry"</span>
                    </p>
                  </motion.div>
                )}

                {/* 2. PARSING STATE (Console Logs) */}
                {status === 'PARSING' && (
                  <motion.div
                    key="parsing"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="w-full h-full p-6 font-mono text-xs overflow-hidden flex flex-col justify-end items-start"
                  >
                    {LOG_MESSAGES.slice(0, logIndex + 1).map((msg, i) => (
                      <motion.div 
                        key={i}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        className={`${i === logIndex ? 'text-kmer-neon' : 'text-kmer-white/40'} mb-1`}
                      >
                        {msg}
                      </motion.div>
                    ))}
                    {/* Curseur clignotant */}
                    <motion.div 
                      className="w-2 h-4 bg-kmer-neon mt-1"
                      animate={{ opacity: [0, 1, 0] }}
                      transition={{ duration: 0.5, repeat: Infinity }}
                    />
                  </motion.div>
                )}

                {/* 3. BUILT STATE (The Tree) */}
                {status === 'BUILT' && (
                  <motion.div
                    key="built"
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="w-full h-full"
                  >
                    {/* On utilise le composant SyntaxTreeViz existant mais en mode "Demo" (pas d'interactivité lourde nécessaire ici, mais il est interactif par défaut) */}
                    <div className="w-full h-full transform scale-90 origin-center">
                       <SyntaxTreeViz data={DEMO_AST} />
                    </div>
                  </motion.div>
                )}

              </AnimatePresence>
            </div>

            {/* Footer Actions */}
            <div className="p-4 border-t border-kmer-white/10 flex justify-center bg-kmer-white/5">
               {status === 'IDLE' ? (
                  <NeonButton onClick={() => setStatus('PARSING')} className="w-full">
                    BUILD SYNTAX TREE
                  </NeonButton>
               ) : (
                  <button 
                    onClick={() => setStatus('IDLE')}
                    disabled={status === 'PARSING'}
                    className={`text-xs font-mono tracking-widest ${status === 'PARSING' ? 'text-gray-600' : 'text-kmer-white/50 hover:text-white transition-colors'}`}
                  >
                    [ RESET ]
                  </button>
               )}
            </div>

          </GlassCard>
        </motion.div>


        {/* --- COLONNE GAUCHE (Texte) --- */}
        <motion.div
          initial={{ opacity: 0, x: -50 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="space-y-6 order-1 lg:order-2"
        >
          <div className="flex items-center gap-3 mb-4">
             <span className="px-3 py-1 text-[10px] font-mono font-bold text-kmer-dark bg-kmer-neon rounded-sm">
              STEP 02
            </span>
            <span className="h-px flex-grow bg-kmer-neon/30" />
          </div>

          <h2 className="text-3xl md:text-4xl font-bold text-white tracking-tight">
            Syntactic <span className="text-kmer-neon">Parsing</span>
          </h2>
          
          <p className="text-lg text-kmer-white/70 leading-relaxed">
            Once tokens are identified, the engine uses a <strong className="text-white">Recursive Descent Parser</strong> to build a hierarchical tree, validating the grammatical structure of Pidgin and Camfranglais.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4">
             {/* Feature 1 */}
             <div className="p-4 rounded-lg border border-kmer-white/10 bg-kmer-white/5 hover:border-kmer-neon/30 transition-colors">
                <div className="text-kmer-neon font-bold text-xl mb-1">S → NP VP</div>
                <div className="text-xs text-kmer-white/60 font-mono">
                  Standard sentence structure validation.
                </div>
             </div>
             
             {/* Feature 2 */}
             <div className="p-4 rounded-lg border border-kmer-white/10 bg-kmer-white/5 hover:border-kmer-neon/30 transition-colors">
                <div className="text-blue-300 font-bold text-xl mb-1">Pivot Check</div>
                <div className="text-xs text-kmer-white/60 font-mono">
                  Identifies verbal pivots ("di", "don", "go").
                </div>
             </div>
          </div>
        </motion.div>

      </div>
    </section>
  );
};