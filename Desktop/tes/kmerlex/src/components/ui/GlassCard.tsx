import { motion } from 'framer-motion';
import type { ReactNode } from 'react';

interface GlassCardProps {
  children: ReactNode;
  className?: string;
  /** Active les animations de survol (scale, glow) */
  interactive?: boolean;
  /** Délai d'apparition (pour les listes en cascade) */
  delay?: number;
}

export const GlassCard = ({ 
  children, 
  className = "", 
  interactive = false,
  delay = 0 
}: GlassCardProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ 
        duration: 0.5, 
        delay: delay, 
        ease: [0.23, 1, 0.32, 1] // Courbe de Bézier "Cubic-Out" pour un feeling premium
      }}
      whileHover={interactive ? { 
        y: -5, 
        boxShadow: "0 20px 40px -10px rgba(124, 255, 178, 0.1)" 
      } : undefined}
      className={`
        relative overflow-hidden rounded-2xl
        bg-kmer-white/5             /* Fond ultra-léger */
        backdrop-blur-xl            /* Flou puissant (Glassmorphism) */
        border border-kmer-white/10 /* Bordure subtile */
        shadow-[0_8px_32px_0_rgba(0,0,0,0.36)] /* Ombre portée douce */
        group                       /* Pour cibler les enfants au hover */
        ${interactive ? 'cursor-pointer hover:border-kmer-light/30 transition-colors duration-300' : ''}
        ${className}
      `}
    >
      {/* 1. COUCHE DE BRUIT (NOISE TEXTURE) */}
      {/* Ajoute du réalisme et évite l'effet "plastique" lisse */}
      <div 
        className="absolute inset-0 opacity-[0.03] pointer-events-none mix-blend-overlay z-0"
        style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")` }}
      />

      {/* 2. GRADIENT DE LUMIÈRE (TOP SHINE) */}
      {/* Simule une source de lumière venant du haut */}
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-kmer-white/20 to-transparent z-10" />
      
      {/* 3. EFFET DE REFLET SCANLINE (Uniquement au survol si interactif) */}
      {interactive && (
        <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-kmer-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none z-10" />
      )}

      {/* 4. CONTENU PRINCIPAL */}
      <div className="relative z-20">
        {children}
      </div>

      {/* 5. DÉCORATION "TECH" (Coins subtils) */}
      {/* Ajoute une touche "Laboratoire/HUD" */}
      <div className="absolute bottom-0 right-0 w-8 h-8 bg-gradient-to-tl from-kmer-light/5 to-transparent rounded-tl-2xl pointer-events-none" />
    </motion.div>
  );
};