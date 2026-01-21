import { useRef, useState, useMemo, memo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import type { ASTNode } from '../../types';

// --- CONFIGURATION ---
// Couleurs spécifiques par type de noeud (Grammaire)
const NODE_COLORS: Record<string, string> = {
  S:  'border-kmer-neon bg-kmer-neon/10 text-kmer-neon shadow-[0_0_15px_rgba(0,230,118,0.4)]',
  NP: 'border-cyan-400 bg-cyan-500/10 text-cyan-300',
  VP: 'border-orange-400 bg-orange-500/10 text-orange-300',
  V:  'border-red-400 bg-red-500/10 text-red-300',
  D:  'border-blue-400 bg-blue-500/10 text-blue-300',
  N:  'border-purple-400 bg-purple-500/10 text-purple-300',
  DEFAULT: 'border-kmer-white/30 bg-kmer-white/5 text-kmer-white/80',
};

interface SyntaxTreeVizProps {
  data: ASTNode | undefined;
}

// --- SOUS-COMPOSANT : NOEUD RÉCURSIF ---
const RecursiveNode = memo(({ node, depth = 0 }: { node: ASTNode; depth?: number }) => {
  const isLeaf = !node.children || node.children.length === 0;
  
  // Détermine la couleur
  const styleClass = NODE_COLORS[node.name] || NODE_COLORS.DEFAULT;

  return (
    <div className="flex flex-col items-center">
      {/* 1. LE NOEUD LUI-MÊME */}
      <motion.div
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ 
          type: 'spring', 
          stiffness: 260, 
          damping: 20, 
          delay: depth * 0.1 
        }}
        className={`
          relative z-10 flex flex-col items-center justify-center
          px-4 py-2 rounded-lg border backdrop-blur-md
          transition-all duration-300 cursor-pointer
          hover:scale-110 hover:z-20
          group
          ${styleClass}
        `}
      >
        {/* Type Grammatical (ex: NP, VP) */}
        <span className="text-xs font-bold font-mono tracking-widest">{node.name}</span>
        
        {/* Valeur Lexicale (ex: "Le taxi") - Uniquement si présente */}
        {node.value && (
          <div className="mt-1 pt-1 border-t border-current/20 text-[10px] font-mono opacity-80 whitespace-nowrap">
            "{node.value}"
          </div>
        )}

        {/* Halo décoratif au survol */}
        <div className="absolute inset-0 rounded-lg bg-current opacity-0 group-hover:opacity-10 transition-opacity" />
      </motion.div>

      {/* 2. LES ENFANTS (ET LES BRANCHES) */}
      {!isLeaf && (
        <div className="relative flex flex-row justify-center pt-8 gap-6">
          {/* Ligne Verticale Principale (du parent vers le bas) */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-px h-8 bg-kmer-white/20" />

          {node.children!.map((child, index) => (
            <div key={`${child.name}-${index}`} className="relative flex flex-col items-center">
              
              {/* LIGNES CONNECTRICES (CSS HACKS) */}
              {/* Ligne horizontale haute pour relier les enfants */}
              <div className={`
                absolute top-0 w-1/2 h-px bg-kmer-white/20
                ${index === 0 ? 'left-1/2' : ''} /* Premier enfant : ligne vers la droite */
                ${index === node.children!.length - 1 ? 'right-1/2' : ''} /* Dernier enfant : ligne vers la gauche */
                ${index > 0 && index < node.children!.length - 1 ? 'w-full' : ''} /* Milieu : ligne complète */
                /* Si enfant unique, pas de ligne horizontale */
                ${node.children!.length === 1 ? 'hidden' : ''}
              `} />
              
              {/* Ligne verticale vers l'enfant */}
              <div className="absolute top-0 w-px h-8 bg-kmer-white/20" />

              {/* Appel Récursif */}
              <RecursiveNode node={child} depth={depth + 1} />
            </div>
          ))}
        </div>
      )}
    </div>
  );
});

// Nom d'affichage pour React DevTools
RecursiveNode.displayName = 'RecursiveNode';


// --- COMPOSANT PRINCIPAL (WRAPPER ZOOM/PAN) ---
export const SyntaxTreeViz = ({ data }: SyntaxTreeVizProps) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [zoom, setZoom] = useState(1);

  // Pas de données ? État vide
  if (!data) return (
    <div className="h-full w-full flex flex-col items-center justify-center text-kmer-white/30 font-mono text-sm border-2 border-dashed border-kmer-white/10 rounded-xl">
      <span>[ WAITING FOR SYNTACTIC ANALYSIS... ]</span>
    </div>
  );

  return (
    <div className="relative w-full h-[500px] overflow-hidden rounded-2xl bg-[#030c0a] border border-kmer-light/20 shadow-inner group">
      
      {/* 1. GRILLE DE FOND (Effet technique) */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(124,255,178,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(124,255,178,0.03)_1px,transparent_1px)] bg-[size:20px_20px]" />

      {/* 2. ZONE DE DESSIN INTERACTIVE */}
      <motion.div
        ref={containerRef}
        className="w-full h-full flex items-center justify-center cursor-grab active:cursor-grabbing"
        drag
        dragConstraints={containerRef} // Limite le mouvement au conteneur
        dragElastic={0.1}
      >
        <motion.div
          animate={{ scale: zoom }}
          transition={{ type: 'spring', stiffness: 300, damping: 30 }}
          className="p-10"
        >
          <RecursiveNode node={data} />
        </motion.div>
      </motion.div>

      {/* 3. CONTROLES DE ZOOM (HUD) */}
      <div className="absolute bottom-4 right-4 flex gap-2">
        <button
          onClick={() => setZoom(z => Math.max(0.5, z - 0.2))}
          className="p-2 rounded bg-kmer-dark/80 text-kmer-white border border-kmer-white/10 hover:border-kmer-neon hover:text-kmer-neon transition-all"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" /></svg>
        </button>
        <div className="px-3 py-2 bg-kmer-dark/80 text-xs font-mono text-kmer-neon border border-kmer-white/10 rounded min-w-[3rem] text-center">
          {Math.round(zoom * 100)}%
        </div>
        <button
          onClick={() => setZoom(z => Math.min(2, z + 0.2))}
          className="p-2 rounded bg-kmer-dark/80 text-kmer-white border border-kmer-white/10 hover:border-kmer-neon hover:text-kmer-neon transition-all"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" /></svg>
        </button>
        <button
          onClick={() => setZoom(1)} // Reset
          className="p-2 rounded bg-kmer-dark/80 text-kmer-white border border-kmer-white/10 hover:border-kmer-neon hover:text-kmer-neon transition-all ml-2"
          title="Reset View"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4" /></svg>
        </button>
      </div>

      {/* Badge "Live Viz" */}
      <div className="absolute top-4 left-4 flex items-center gap-2 px-3 py-1 rounded-full bg-kmer-neon/10 border border-kmer-neon/20">
        <span className="w-2 h-2 rounded-full bg-kmer-neon animate-pulse" />
        <span className="text-[10px] font-mono text-kmer-neon font-bold tracking-widest">LIVE_TREE_VIEW</span>
      </div>
    </div>
  );
};