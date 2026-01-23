import { memo } from 'react';
import { motion } from 'framer-motion';

// --- CONSTANTES (Sorties du composant pour éviter la recréation) ---
const CURRENT_YEAR = new Date().getFullYear();

const LINKS = [
  {
    title: 'SYSTEM_MODULES',
    items: [
      { label: 'Lexical Analyzer', href: '#analyzer' },
      { label: 'Syntactic Tree', href: '#analyzer' },
      { label: 'Grammar Definition', href: 'https://github.com/MiltonJ23/KmerLex/' }, // Lien externe simulé
    ],
  },
  {
    title: 'RESEARCH_CONTEXT',
    items: [
      { label: 'Compiler Construction', href: 'https://ictuniversity.org/' },
      { label: 'Fall 2025 ', href: 'https://ictuniversity.org/' },
      { label: 'ICT UNIVERISTY', href: 'https://ictuniversity.org/' },
    ],
  },
  {
    title: 'CONNECTIVITY',
    items: [
      { label: 'GitHub Repository', href: 'https://github.com/MiltonJ23/KmerLex/' },
      { label: 'Project Documentation', href: 'https://github.com/MiltonJ23/KmerLex/' },
      { label: 'Report Issue', href: 'https://github.com/MiltonJ23/KmerLex/' },
    ],
  },
];

// --- COMPOSANT (Memoized pour éviter les re-renders inutiles) ---
export const Footer = memo(() => {
  return (
    <footer className="relative border-t border-kmer-light/20 bg-[#051A14] pt-16 pb-8 overflow-hidden z-10">
      
      {/* 1. DECORATION D'ARRIÈRE-PLAN (Lueur verte & Grille) */}
      <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-kmer-neon/50 to-transparent" />
      <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-5 pointer-events-none" />
      
      <div className="max-w-7xl mx-auto px-6 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
          
          {/* 2. IDENTITÉ DU PROJET */}
          <div className="space-y-4">
            <h3 className="text-2xl font-mono font-bold tracking-tighter text-kmer-white">
              KMER<span className="text-kmer-neon">LEX</span>
            </h3>
            <p className="text-kmer-white/60 text-sm leading-relaxed font-mono max-w-xs">
              Advanced linguistic intelligence engine analyzing Cameroonian urban vernaculars through recursive descent parsing algorithms.
            </p>
            
            {/* Indicateur de statut "Système" */}
            <div className="flex items-center gap-2 px-3 py-1.5 border border-kmer-light/20 bg-kmer-light/5 rounded-full w-fit mt-4">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-kmer-neon opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-kmer-neon"></span>
              </span>
              <span className="text-xs font-mono text-kmer-neon tracking-widest">
                SYSTEM_OPERATIONAL
              </span>
            </div>
          </div>

          {/* 3. COLONNES DE LIENS (Générées dynamiquement) */}
          {LINKS.map((section) => (
            <div key={section.title}>
              <h4 className="text-xs font-bold text-kmer-light mb-6 tracking-widest border-l-2 border-kmer-neon pl-3 uppercase">
                {section.title}
              </h4>
              <ul className="space-y-3">
                {section.items.map((link) => (
                  <li key={link.label}>
                    <motion.a
                      href={link.href}
                      whileHover={{ x: 5, color: '#00E676' }} // 00E676 = kmer-neon
                      className="text-sm text-kmer-white/50 hover:text-kmer-neon transition-colors font-mono flex items-center gap-2 group"
                    >
                      <span className="w-1 h-1 bg-kmer-light/30 rounded-full group-hover:bg-kmer-neon transition-colors" />
                      {link.label}
                    </motion.a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* 4. BAS DE PAGE (Copyright) */}
        <div className="pt-8 border-t border-kmer-light/10 flex flex-col md:flex-row justify-between items-center gap-4 text-xs font-mono text-kmer-white/40">
          <p>
            © {CURRENT_YEAR} KMERLEX PROJECT. MIT LICENSE.
          </p>
          <p className="flex items-center gap-2">
            ENGINEERED IN <span className="text-kmer-light">YAOUNDÉ, CM</span> 
            <span className="inline-block w-2 h-2 border border-kmer-light/40 transform rotate-45"></span>
          </p>
        </div>
      </div>
    </footer>
  );
});

// Nom d'affichage pour le débogage React DevTools
Footer.displayName = 'Footer';