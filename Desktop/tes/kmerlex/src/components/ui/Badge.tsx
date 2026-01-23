import { memo } from 'react';
import { motion } from 'framer-motion';
import type { TokenType } from '../../types';

// --- DEFINITION DES TYPES ---
interface BadgeProps {
  type: TokenType | 'VERB' | 'NOUN' | 'ADJ' | 'AUX'; // Extension pour couvrir les types grammaticaux
  children?: React.ReactNode;
  delay?: number; // Pour l'animation en cascade (stagger)
}

// --- CONFIGURATION DU STYLE (Lookup Table pour performance max) ---
// Associe chaque type de token à une classe Tailwind spécifique
const STYLE_VARIANTS: Record<string, string> = {
  // Types Lexicaux (Moteur)
  SLANG:      'border-kmer-neon text-kmer-neon bg-kmer-neon/10 shadow-[0_0_12px_rgba(0,230,118,0.15)]',
  PIDGIN_KW:  'border-kmer-light text-kmer-light bg-kmer-light/10',
  NUMBER:     'border-blue-400/50 text-blue-300 bg-blue-500/10',
  PUNCTUATION:'border-kmer-white/20 text-kmer-white/40 bg-transparent',
  WORD:       'border-kmer-white/40 text-kmer-white/80 bg-kmer-white/5',
  UNKNOWN:    'border-red-500/50 text-red-400 bg-red-500/10',
  
  // Types Grammaticaux (Analyse Syntaxique)
  VERB:       'border-orange-400/60 text-orange-300 bg-orange-500/10',
  NOUN:       'border-cyan-400/60 text-cyan-300 bg-cyan-500/10',
  ADJ:        'border-purple-400/60 text-purple-300 bg-purple-500/10',
  AUX:        'border-pink-400/60 text-pink-300 bg-pink-500/10',
};

// Fallback style si le type n'est pas reconnu
const DEFAULT_STYLE = 'border-kmer-white/30 text-kmer-white/60 bg-transparent';

// --- COMPOSANT ---
export const Badge = memo(({ type, children, delay = 0 }: BadgeProps) => {
  // Sélection du style (O(1))
  const styleClass = STYLE_VARIANTS[type] || DEFAULT_STYLE;
  
  // Contenu affiché : soit le children personnalisé, soit le type lui-même
  const label = children || type;

  return (
    <motion.span
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ 
        type: "spring", 
        stiffness: 300, 
        damping: 20, 
        delay: delay * 0.05 // Animation progressive si utilisé dans une liste
      }}
      whileHover={{ scale: 1.05 }}
      className={`
        relative inline-flex items-center gap-1.5 
        px-2.5 py-0.5 rounded text-[10px] font-mono font-medium tracking-wider uppercase
        border backdrop-blur-sm transition-colors duration-300 select-none
        ${styleClass}
      `}
    >
      {/* Petit indicateur lumineux (Status Dot) */}
      <span className={`w-1 h-1 rounded-full ${type === 'SLANG' ? 'animate-pulse bg-current' : 'bg-current opacity-50'}`} />
      
      {/* Texte du badge */}
      {label}
    </motion.span>
  );
});

// Nom d'affichage pour React DevTools
Badge.displayName = 'Badge';