import { memo, useMemo } from 'react';
import { motion } from 'framer-motion';
import type { Variants } from 'framer-motion';

// --- TYPES ---

// Segment permet de styliser des parties du texte différemment (ex: couleurs)
export interface TextSegment {
  text: string;
  className?: string; // Classe Tailwind spécifique pour ce morceau
}

interface TypewriterTextProps {
  /** Texte simple OU tableau de segments pour le multi-color */
  content: string | TextSegment[];
  /** Classe globale du conteneur */
  className?: string;
  /** Vitesse d'écriture (délai entre chaque lettre) */
  speed?: number;
  /** Délai avant le début de l'animation */
  delay?: number;
  /** Afficher le curseur clignotant ? */
  cursor?: boolean;
  /** Couleur du curseur (Tailwind class, ex: text-kmer-neon) */
  cursorClassName?: string;
  /** Fonction appelée à la fin de l'écriture */
  onComplete?: () => void;
}

// --- VARIANTES D'ANIMATION (Optimisées pour l'orchestration) ---

const containerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: (i: { delay: number, stagger: number }) => ({
    opacity: 1,
    transition: {
      delayChildren: i.delay,
      staggerChildren: i.stagger, // C'est ici que la magie opère
    },
  }),
};

const charVariants: Variants = {
  hidden: { opacity: 0, y: 5 }, // Légère translation pour effet fluide
  visible: { opacity: 1, y: 0, transition: { duration: 0.1 } },
};

const cursorVariants: Variants = {
  blinking: {
    opacity: [0, 1, 0],
    transition: {
      duration: 0.8,
      repeat: Infinity,
      ease: "linear"
    }
  }
};

// --- COMPOSANT ---

export const TypewriterText = memo(({
  content,
  className = "",
  speed = 0.05,
  delay = 0,
  cursor = true,
  cursorClassName = "text-kmer-neon",
  onComplete
}: TypewriterTextProps) => {

  // 1. Normalisation du contenu (String -> Segments[])
  const segments: TextSegment[] = useMemo(() => {
    if (typeof content === 'string') {
      return [{ text: content }];
    }
    return content;
  }, [content]);

  // 2. Génération du texte brut pour l'accessibilité (Screen Readers)
  const fullText = useMemo(() => segments.map(s => s.text).join(''), [segments]);

  return (
    <span className={`inline-block font-mono ${className}`}>
      
      {/* --- ACCESSIBILITÉ SEULEMENT --- */}
      <span className="sr-only">{fullText}</span>

      {/* --- ANIMATION VISUELLE --- */}
      <motion.span
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }} // Ne joue qu'une seule fois
        aria-hidden
        variants={containerVariants}
        custom={{ delay, stagger: speed }}
        onAnimationComplete={() => onComplete && onComplete()}
      >
        {segments.map((segment, segIndex) => (
          <span key={segIndex} className={segment.className}>
            {segment.text.split("").map((char, charIndex) => (
              <motion.span
                key={`${segIndex}-${charIndex}`}
                variants={charVariants}
                className="inline-block whitespace-pre" // Gère les espaces correctement
              >
                {char}
              </motion.span>
            ))}
          </span>
        ))}
      </motion.span>

      {/* --- CURSEUR CLIGNOTANT --- */}
      {cursor && (
        <motion.span
          variants={cursorVariants}
          animate="blinking"
          className={`inline-block ml-1 font-bold ${cursorClassName}`}
        >
          _
        </motion.span>
      )}
    </span>
  );
});

// Nom d'affichage pour React DevTools
TypewriterText.displayName = 'TypewriterText';