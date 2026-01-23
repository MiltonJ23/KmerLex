import { forwardRef, memo } from 'react';
import { motion } from 'framer-motion';
import type { HTMLMotionProps } from 'framer-motion';

// --- DEFINITION DES TYPES ---
// Hérite des props HTML natives + props Framer Motion
interface NeonButtonProps extends HTMLMotionProps<'button'> {
  variant?: 'primary' | 'outline'; // Support futur pour d'autres styles
  loading?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

// --- COMPOSANT ---
export const NeonButton = memo(forwardRef<HTMLButtonElement, NeonButtonProps>(({ 
  children, 
  className = "", 
  loading = false, 
  variant = 'primary',
  leftIcon,
  rightIcon,
  disabled,
  ...props 
}, ref) => {

  const isDisabled = disabled || loading;

  return (
    <motion.button
      ref={ref}
      // Interactions physiques (Scale)
      whileHover={!isDisabled ? { scale: 1.02 } : undefined}
      whileTap={!isDisabled ? { scale: 0.96 } : undefined}
      
      // Accessibilité
      disabled={isDisabled}
      aria-busy={loading}
      
      // Styles de base
      className={`
        group relative isolate inline-flex items-center justify-center gap-2
        px-8 py-3.5 
        overflow-hidden rounded-xl 
        font-mono text-sm font-bold tracking-wider uppercase
        transition-colors duration-300
        focus:outline-none focus-visible:ring-2 focus-visible:ring-kmer-white/50 focus-visible:ring-offset-2 focus-visible:ring-offset-[#051A14]
        
        ${/* VARIANT: PRIMARY (Plein) */ ''}
        ${variant === 'primary' 
          ? 'bg-kmer-neon text-kmer-dark border border-transparent shadow-[0_0_20px_rgba(0,230,118,0.3)] hover:shadow-[0_0_35px_rgba(0,230,118,0.6)]' 
          : ''}

        ${/* VARIANT: OUTLINE (Bordure seule - pour usage secondaire) */ ''}
        ${variant === 'outline'
          ? 'bg-transparent text-kmer-neon border border-kmer-neon/50 hover:bg-kmer-neon/10 shadow-[0_0_10px_rgba(0,230,118,0.1)]'
          : ''}

        ${/* ETAT DÉSACTIVÉ */ ''}
        ${isDisabled ? 'opacity-50 cursor-not-allowed grayscale' : 'cursor-pointer'}

        ${className}
      `}
      {...props}
    >
      {/* 1. SCANLINE EFFECT (Lumière traversante au survol) */}
      {!isDisabled && variant === 'primary' && (
        <div className="absolute inset-0 -translate-x-[150%] skew-x-12 bg-gradient-to-r from-transparent via-white/40 to-transparent group-hover:animate-[shimmer_1s_infinite] z-0 pointer-events-none" />
      )}

      {/* 2. BRUIT DE FOND (Texture subtile) */}
      <div className="absolute inset-0 opacity-10 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] mix-blend-overlay z-0 pointer-events-none" />

      {/* 3. CONTENU (Avec gestion du Loading) */}
      <span className="relative z-10 flex items-center gap-2">
        
        {loading ? (
          <>
            {/* Spinner "Tech" : Carré rotatif */}
            <motion.span 
              animate={{ rotate: 360 }}
              transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
              className="w-4 h-4 border-2 border-current border-t-transparent rounded-full"
            />
            <span>PROCESSING...</span>
          </>
        ) : (
          <>
            {/* Icône gauche (si fournie) */}
            {leftIcon && <span className="text-current opacity-80">{leftIcon}</span>}
            
            {/* Texte */}
            {children}

            {/* Icône droite (si fournie) */}
            {rightIcon && <span className="text-current opacity-80">{rightIcon}</span>}
          </>
        )}
      </span>

      {/* 4. GLOW INTERNE (Reflet sur les bords) */}
      <div className="absolute inset-0 rounded-xl ring-1 ring-inset ring-white/20 pointer-events-none" />
      
    </motion.button>
  );
}));

// Nom d'affichage pour React DevTools
NeonButton.displayName = 'NeonButton';

// Note: Pour que l'animation "shimmer" fonctionne parfaitement, 
// assure-toi d'avoir ajouté les keyframes dans tailwind.config.js ou index.css :
/*
  @keyframes shimmer {
    100% { transform: translateX(150%) skewX(12deg); }
  }
*/