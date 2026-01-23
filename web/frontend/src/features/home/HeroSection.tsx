import { motion } from 'framer-motion';
import { NeonButton } from '../../components/ui/NeonButton';
import { GlassCard } from '../../components/ui/GlassCard';
import { TypewriterText } from '../../components/ui/TypewriterText';
import { Badge } from '../../components/ui/Badge';

// --- VARIANTES D'ANIMATION ---
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.15,
      delayChildren: 0.2
    }
  }
};

const itemVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: { 
    y: 0, 
    opacity: 1,
    transition: { type: "spring", stiffness: 100 }
  }
};

const floatingVariant = {
  animate: {
    y: [0, -15, 0],
    rotate: [0, 1, 0],
    transition: {
      duration: 6,
      repeat: Infinity,
      ease: "easeInOut"
    }
  }
};

// --- COMPOSANT HERO ---
export const HeroSection = () => {
  
  const scrollToAnalyzer = () => {
    window.location.hash = 'analyzer';
  };

  return (
    <section className="relative min-h-[90vh] flex items-center justify-center overflow-hidden py-20">
      
      {/* 1. EFFETS DE LUMIÈRE D'ARRIÈRE-PLAN (Spotlights) */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-kmer-neon/10 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-64 h-64 bg-kmer-light/10 rounded-full blur-[100px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-6 w-full relative z-10">
        <motion.div 
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center"
        >
          
          {/* --- GAUCHE : TEXTE & ACTIONS --- */}
          <div className="space-y-8 text-center lg:text-left">
            
            {/* Status Badge */}
            <motion.div variants={itemVariants} className="flex justify-center lg:justify-start">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-kmer-neon/30 bg-kmer-neon/5 backdrop-blur-md">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-kmer-neon opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-kmer-neon"></span>
                </span>
                <span className="text-xs font-mono font-bold text-kmer-neon tracking-widest">
                  ENGINE V1.0 ONLINE
                </span>
              </div>
            </motion.div>

            {/* Titre Principal (Typewriter) */}
            <motion.div variants={itemVariants} className="relative">
              <h1 className="text-5xl md:text-7xl font-bold tracking-tighter leading-tight text-white mb-2">
                <span className="block text-transparent bg-clip-text bg-gradient-to-r from-white via-white to-gray-400">
                  DECODING
                </span>
                <TypewriterText 
                  content={[
                    { text: "CAM", className: "text-kmer-light" },
                    { text: "FRANGLAIS", className: "text-kmer-neon drop-shadow-[0_0_15px_rgba(0,230,118,0.5)]" }
                  ]}
                  speed={0.1}
                  delay={0.5}
                  className="block mt-2"
                />
              </h1>
            </motion.div>

            {/* Description */}
            <motion.p variants={itemVariants} className="text-lg md:text-xl text-kmer-white/70 max-w-xl mx-auto lg:mx-0 leading-relaxed">
              The first <span className="text-kmer-light">Recursive Descent Compiler</span> designed for Cameroonian urban vernaculars. Parse, tokenize, and visualize the syntax of the street.
            </motion.p>

            {/* Boutons d'action */}
            <motion.div variants={itemVariants} className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start pt-4">
              <NeonButton 
                onClick={scrollToAnalyzer}
                rightIcon={
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                  </svg>
                }
              >
                ACCESS TERMINAL
              </NeonButton>
              
              <NeonButton 
                variant="outline"
                onClick={() => window.open('https://github.com/MiltonJ23/KmerLex/', '_blank')}
                leftIcon={
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
                  </svg>
                }
              >
                DOCUMENTATION
              </NeonButton>
            </motion.div>
          </div>

          {/* --- DROITE : VISUALISATION CODE/TERMINAL --- */}
          <motion.div 
            variants={itemVariants} 
            className="relative hidden lg:block"
          >
            {/* Animation de flottement */}
            <motion.div variants={floatingVariant} animate="animate">
              <GlassCard className="p-0 border-kmer-light/20 bg-[#030c0a]/80 backdrop-blur-xl">
                
                {/* Header du Terminal */}
                <div className="flex items-center justify-between px-4 py-3 border-b border-kmer-white/10 bg-kmer-white/5">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-red-500/50" />
                    <div className="w-3 h-3 rounded-full bg-yellow-500/50" />
                    <div className="w-3 h-3 rounded-full bg-green-500/50" />
                  </div>
                  <div className="text-[10px] font-mono text-kmer-white/40 tracking-widest uppercase">
                    lexer_output.json
                  </div>
                </div>

                {/* Contenu du Terminal */}
                <div className="p-6 font-mono text-sm overflow-hidden">
                  <div className="flex flex-col gap-2">
                    <div className="text-gray-500">// Input: "Le pater a ndem"</div>
                    <div className="text-purple-400">const <span className="text-blue-300">tokens</span> = [</div>
                    
                    <motion.div 
                      className="pl-4 flex items-center gap-2"
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 1.5 }}
                    >
                      <span className="text-gray-400">{`{`}</span>
                      <span className="text-blue-300">type:</span>
                      <Badge type="WORD">DET</Badge>
                      <span className="text-blue-300">val:</span>
                      <span className="text-green-300">"Le"</span>
                      <span className="text-gray-400">{`},`}</span>
                    </motion.div>

                    <motion.div 
                      className="pl-4 flex items-center gap-2"
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 1.7 }}
                    >
                      <span className="text-gray-400">{`{`}</span>
                      <span className="text-blue-300">type:</span>
                      <Badge type="SLANG">SLANG</Badge>
                      <span className="text-blue-300">val:</span>
                      <span className="text-green-300">"pater"</span>
                      <span className="text-gray-400">{`},`}</span>
                    </motion.div>

                    <motion.div 
                      className="pl-4 flex items-center gap-2"
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 1.9 }}
                    >
                      <span className="text-gray-400">{`{`}</span>
                      <span className="text-blue-300">type:</span>
                      <Badge type="VERB">VERB</Badge>
                      <span className="text-blue-300">val:</span>
                      <span className="text-green-300">"a"</span>
                      <span className="text-gray-400">{`},`}</span>
                    </motion.div>
                    
                    <motion.div 
                       className="pl-4 flex items-center gap-2"
                       initial={{ opacity: 0, x: -10 }}
                       animate={{ opacity: 1, x: 0 }}
                       transition={{ delay: 2.1 }}
                    >
                       <span className="text-gray-400">{`{`}</span>
                       <span className="text-blue-300">type:</span>
                       <Badge type="SLANG">ADJ</Badge>
                       <span className="text-blue-300">val:</span>
                       <span className="text-green-300">"ndem"</span>
                       <span className="text-gray-400">{`}`}</span>
                    </motion.div>

                    <div className="text-purple-400">];</div>
                    <motion.div 
                      className="h-4 w-2 bg-kmer-neon mt-2"
                      animate={{ opacity: [0, 1, 0] }}
                      transition={{ duration: 0.8, repeat: Infinity }}
                    />
                  </div>
                </div>
              </GlassCard>
            </motion.div>

            {/* Éléments décoratifs derrière le terminal */}
            <div className="absolute -z-10 -right-10 -bottom-10 w-40 h-40 border border-kmer-neon/20 rounded-full animate-[spin_10s_linear_infinite]" />
            <div className="absolute -z-10 -right-10 -bottom-10 w-36 h-36 border border-dashed border-kmer-light/20 rounded-full animate-[spin_15s_linear_infinite_reverse]" />
          </motion.div>

        </motion.div>
      </div>
    </section>
  );
};