import { motion } from 'framer-motion';
import type { AnalysisMode } from '../../types';

// --- TYPES ---
interface ModeSelectorProps {
  currentMode: AnalysisMode;
  onChange: (mode: AnalysisMode) => void;
  disabled?: boolean;
}

// --- CONFIGURATION ---
const MODES: { id: AnalysisMode; label: string; icon: JSX.Element }[] = [
  {
    id: 'LEXICAL',
    label: 'LEXICAL_SCAN',
    icon: (
      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 10h16M4 14h16M4 18h16" />
      </svg>
    ),
  },
  {
    id: 'SYNTACTIC',
    label: 'SYNTAX_SCAN',
    icon: (
      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 8l2-2m0 0l2-2m-2 2l-2-2m2 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2V7a2 2 0 012-2h6v6a2 2 0 012 2h2" />
      </svg>
    ),
  },
];

// --- COMPOSANT ---
export const ModeSelector = ({ currentMode, onChange, disabled = false }: ModeSelectorProps) => {
  return (
    <div className="relative inline-flex bg-[#030c0a] border border-kmer-white/10 rounded-lg p-1">
      
      {/* Fond décoratif (Scanlines subtiles) */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(0,230,118,0.02)_1px,transparent_1px)] bg-[size:4px_4px] rounded-lg pointer-events-none" />

      {MODES.map((mode) => {
        const isActive = currentMode === mode.id;

        return (
          <button
            key={mode.id}
            onClick={() => !disabled && onChange(mode.id)}
            disabled={disabled}
            className={`
              relative flex items-center gap-2 px-6 py-2 rounded-md z-10
              text-xs font-mono font-bold tracking-wider transition-colors duration-300
              focus:outline-none focus-visible:ring-2 focus-visible:ring-kmer-neon/50
              ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
              ${isActive ? 'text-[#051A14]' : 'text-kmer-white/40 hover:text-kmer-white/80'}
            `}
            aria-pressed={isActive}
            aria-label={`Switch to ${mode.label} mode`}
          >
            {/* 1. ARRIÈRE-PLAN ANIMÉ (La "Pilule" glissante) */}
            {isActive && (
              <motion.div
                layoutId="activeModePill"
                className="absolute inset-0 bg-kmer-neon shadow-[0_0_15px_rgba(0,230,118,0.4)] rounded-md -z-10"
                transition={{ type: 'spring', stiffness: 300, damping: 30 }}
              />
            )}

            {/* 2. CONTENU DU BOUTON */}
            <span className="relative z-10">{mode.icon}</span>
            <span className="relative z-10">{mode.label}</span>

            {/* Indicateur de statut (petit point) */}
            {isActive && (
              <motion.span 
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                className="w-1.5 h-1.5 rounded-full bg-[#051A14] ml-1 animate-pulse"
              />
            )}
          </button>
        );
      })}
    </div>
  );
};