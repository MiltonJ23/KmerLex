import { motion, AnimatePresence } from 'framer-motion';
import { HeroSection } from './HeroSection';
import { LexicalDemoSection } from './LexicalDemoSection';
import { SyntacticDemoSection } from './SyntacticDemoSection';
import { ContributorsSection } from './ContributorsSection';
import { useScroll } from '../../hooks/useScroll';

// --- SOUS-COMPOSANT : SÉPARATEUR VISUEL ---
const SectionDivider = ({ label }: { label: string }) => (
  <div className="relative py-8 flex items-center justify-center overflow-hidden">
    {/* Ligne gauche */}
    <div className="h-px w-32 md:w-64 bg-gradient-to-l from-kmer-white/20 to-transparent" />
    
    {/* Indicateur central */}
    <div className="px-4 flex items-center gap-3">
      <span className="w-1 h-1 bg-kmer-white/30 rounded-full" />
      <span className="text-[10px] font-mono text-kmer-white/30 tracking-[0.3em] uppercase">
        {label}
      </span>
      <span className="w-1 h-1 bg-kmer-white/30 rounded-full" />
    </div>

    {/* Ligne droite */}
    <div className="h-px w-32 md:w-64 bg-gradient-to-r from-kmer-white/20 to-transparent" />
  </div>
);

// --- COMPOSANT PAGE PRINCIPALE ---
export const HomePage = () => {
  // Utilisation du hook optimisé pour gérer l'affichage du bouton "Retour en haut"
  const { isScrolled } = useScroll({ threshold: 400 });

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <motion.div
      id="home"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
      className="relative w-full flex flex-col gap-0"
    >
      {/* 1. HERO SECTION (L'accroche) */}
      <HeroSection />

      {/* 2. DÉMONSTRATION LEXICALE (Explication Step 1) */}
      <div className="relative z-10">
        <SectionDivider label="Phase I : Tokenization" />
        <LexicalDemoSection />
      </div>

      {/* 3. DÉMONSTRATION SYNTAXIQUE (Explication Step 2) */}
      <div className="relative z-10">
        <SectionDivider label="Phase II : Parsing" />
        <SyntacticDemoSection />
      </div>

      {/* 4. ÉQUIPE (Crédits) */}
      <div className="relative z-10">
        <SectionDivider label="Development Unit" />
        <ContributorsSection />
      </div>

      {/* 5. BOUTON "BACK TO TOP" FLOTTANT */}
      <AnimatePresence>
        {isScrolled && (
          <motion.button
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={scrollToTop}
            className="fixed bottom-8 right-8 z-50 p-3 rounded-full bg-kmer-neon text-kmer-dark shadow-[0_0_20px_rgba(0,230,118,0.4)] border border-white/20 hover:bg-white transition-colors"
            aria-label="Back to top"
          >
            <svg 
              className="w-5 h-5" 
              fill="none" 
              viewBox="0 0 24 24" 
              stroke="currentColor"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 10l7-7m0 0l7 7m-7-7v18" />
            </svg>
          </motion.button>
        )}
      </AnimatePresence>

      {/* DÉCORATION GLOBALE (Ligne de flux en arrière-plan) */}
      {/* Traverse toute la page pour lier les sections */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-px h-full bg-gradient-to-b from-transparent via-kmer-white/5 to-transparent pointer-events-none -z-10" />

    </motion.div>
  );
};