import { useState, useRef, useCallback } from 'react';
import { motion } from 'framer-motion';
import { GlassCard } from '../../components/ui/GlassCard';
import { NeonButton } from '../../components/ui/NeonButton';

// --- TYPES ---
interface AnalyzerConsoleProps {
  onAnalyze: (text: string) => void;
  isAnalyzing: boolean;
}

// --- CONSTANTES ---
const MAX_CHARS = 500; // Limite pour éviter les abus de l'API
const PLACEHOLDER_TEXT = "// Entrez votre phrase en Camfranglais ou Pidgin...\nEx: Le pater a ndem ce matin.";

// --- COMPOSANT ---
export const AnalyzerConsole = ({ onAnalyze, isAnalyzing }: AnalyzerConsoleProps) => {
  const [input, setInput] = useState('');
  const [isFocused, setIsFocused] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Gestion de la soumission
  const handleSubmit = useCallback(() => {
    if (!input.trim() || isAnalyzing) return;
    onAnalyze(input.trim());
  }, [input, isAnalyzing, onAnalyze]);

  // Raccourci clavier (Ctrl + Enter)
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
      handleSubmit();
    }
  };

  // Effacer le contenu
  const handleClear = () => {
    setInput('');
    textareaRef.current?.focus();
  };

  // Calcul du pourcentage d'utilisation (pour la barre visuelle)
  const usagePercent = (input.length / MAX_CHARS) * 100;

  return (
    <GlassCard className="flex flex-col h-full border-kmer-white/10 bg-[#051A14]/80 overflow-hidden">
      
      {/* 1. HEADER (Barre de titre style Terminal) */}
      <div className="flex items-center justify-between px-5 py-3 border-b border-kmer-white/10 bg-kmer-white/5">
        <div className="flex items-center gap-2">
          <svg className="w-4 h-4 text-kmer-neon" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 9l3 3-3 3m5 0h3M5 20h14a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
          <span className="text-xs font-mono font-bold text-kmer-white/60 tracking-widest uppercase">
            INPUT_STREAM
          </span>
        </div>
        
        {/* Indicateurs de statut */}
        <div className="flex items-center gap-4 text-[10px] font-mono text-kmer-white/30">
          <span>UTF-8</span>
          <span className={isFocused ? 'text-kmer-neon' : ''}>
            {isFocused ? 'EDITING' : 'READY'}
          </span>
        </div>
      </div>

      {/* 2. ZONE DE SAISIE (Editor) */}
      <div className="relative flex-grow group">
        
        {/* Effet de Glow sur le focus */}
        <div className={`absolute inset-0 pointer-events-none transition-opacity duration-500 ${isFocused ? 'opacity-100' : 'opacity-0'}`}>
          <div className="absolute bottom-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-kmer-neon/50 to-transparent" />
        </div>

        <textarea
          ref={textareaRef}
          value={input}
          onChange={(e) => setInput(e.target.value.slice(0, MAX_CHARS))}
          onKeyDown={handleKeyDown}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          placeholder={PLACEHOLDER_TEXT}
          disabled={isAnalyzing}
          spellCheck={false} // Important pour le Pidgin/Slang
          className="w-full h-full bg-[#030c0a] text-kmer-white p-6 font-mono text-sm md:text-base leading-relaxed resize-none focus:outline-none placeholder:text-kmer-white/20 selection:bg-kmer-neon/30 selection:text-white"
        />

        {/* Compteur de caractères "HUD Style" */}
        <div className="absolute bottom-4 right-4 pointer-events-none">
          <div className="flex items-center gap-2">
            <div className="w-24 h-1 bg-kmer-white/10 rounded-full overflow-hidden">
              <motion.div 
                className={`h-full ${usagePercent > 90 ? 'bg-red-500' : 'bg-kmer-neon'}`}
                animate={{ width: `${usagePercent}%` }}
              />
            </div>
            <span className="text-[10px] font-mono text-kmer-white/40">
              {input.length} / {MAX_CHARS}
            </span>
          </div>
        </div>
      </div>

      {/* 3. FOOTER (Actions) */}
      <div className="p-4 bg-kmer-white/5 border-t border-kmer-white/10 flex flex-col sm:flex-row justify-between items-center gap-4">
        
        {/* Helper Text */}
        <div className="hidden sm:flex text-[10px] font-mono text-kmer-white/30 gap-1">
          <span className="bg-kmer-white/10 px-1.5 py-0.5 rounded text-kmer-white/50">CTRL</span>
          <span>+</span>
          <span className="bg-kmer-white/10 px-1.5 py-0.5 rounded text-kmer-white/50">ENTER</span>
          <span className="ml-2">to execute</span>
        </div>

        {/* Boutons */}
        <div className="flex w-full sm:w-auto gap-3">
          <button
            onClick={handleClear}
            disabled={!input || isAnalyzing}
            className="px-4 py-2 text-xs font-mono font-bold text-kmer-white/40 hover:text-red-400 hover:bg-red-400/10 rounded transition-colors disabled:opacity-20 disabled:cursor-not-allowed"
          >
            CLEAR
          </button>

          <NeonButton
            onClick={handleSubmit}
            loading={isAnalyzing}
            disabled={!input.trim()}
            className="flex-grow sm:flex-grow-0"
            rightIcon={
              !isAnalyzing && (
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              )
            }
          >
            ANALYZE_SYNTAX
          </NeonButton>
        </div>
      </div>

    </GlassCard>
  );
};