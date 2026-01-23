import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

// Définition des liens de navigation
const NAV_LINKS = [
  { name: ' LABORATORY', href: '#home' },
  { name: ' NEURAL_ENGINE', href: '#analyzer' },
  { name: ' TEAM', href: '#contributors' },
];

export const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Optimisation: Gestion du scroll pour l'effet "Glass"
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <>
      <motion.nav
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        className={`fixed top-0 left-0 w-full z-50 transition-all duration-500 border-b ${
          isScrolled
            ? 'bg-[#051A14]/80 backdrop-blur-xl border-kmer-light/20 py-3 shadow-[0_4px_30px_rgba(0,0,0,0.5)]'
            : 'bg-transparent border-transparent py-6'
        }`}
      >
        <div className="max-w-7xl mx-auto px-6 flex justify-between items-center">
          
          {/* --- LOGO KMERLEX --- */}
          <a href="#" className="group flex items-center gap-2 relative overflow-hidden">
            {/* Petit indicateur d'état (carré vert) */}
            <motion.div 
              className="w-2 h-2 bg-kmer-neon rounded-full"
              animate={{ opacity: [1, 0.5, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
            />
            <span className="text-xl font-mono font-bold tracking-tighter text-kmer-white group-hover:text-kmer-light transition-colors">
              KMER<span className="text-kmer-neon">LEX</span>
            </span>
          </a>

          {/* --- DESKTOP NAVIGATION --- */}
          <div className="hidden md:flex items-center gap-8">
            {NAV_LINKS.map((link) => (
              <a
                key={link.name}
                href={link.href}
                className="relative text-sm font-mono text-kmer-white/70 hover:text-kmer-neon transition-colors duration-300 tracking-wide group"
              >
                {link.name}
                {/* Ligne de soulignement animée futuriste */}
                <span className="absolute -bottom-1 left-0 w-0 h-[1px] bg-kmer-neon transition-all duration-300 group-hover:w-full box-shadow-[0_0_8px_#00E676]" />
              </a>
            ))}

            {/* Bouton d'action rapide (GitHub / Docs) */}
            <motion.a
              href="https://github.com/MiltonJ23/KmerLex/"
              target="_blank"
              rel="noopener noreferrer"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="ml-4 px-4 py-2 border border-kmer-light/30 rounded text-xs font-bold text-kmer-light hover:bg-kmer-light/10 transition-all"
            >
              [ GITHUB_REPO ]
            </motion.a>
          </div>

          {/* --- MOBILE HAMBURGER BUTTON --- */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="md:hidden text-kmer-light focus:outline-none"
            aria-label="Toggle Menu"
          >
            <div className="space-y-1.5 w-6">
              <motion.span 
                animate={{ rotate: isMobileMenuOpen ? 45 : 0, y: isMobileMenuOpen ? 6 : 0 }} 
                className="block h-0.5 w-full bg-kmer-neon"
              />
              <motion.span 
                animate={{ opacity: isMobileMenuOpen ? 0 : 1 }} 
                className="block h-0.5 w-full bg-kmer-neon"
              />
              <motion.span 
                animate={{ rotate: isMobileMenuOpen ? -45 : 0, y: isMobileMenuOpen ? -6 : 0 }} 
                className="block h-0.5 w-full bg-kmer-neon"
              />
            </div>
          </button>
        </div>
      </motion.nav>

      {/* --- MOBILE MENU OVERLAY --- */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: '100vh' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 z-40 bg-[#051A14]/95 backdrop-blur-2xl md:hidden pt-24 px-6"
          >
            <div className="flex flex-col gap-6 font-mono text-xl">
              {NAV_LINKS.map((link, i) => (
                <motion.a
                  key={link.name}
                  href={link.href}
                  initial={{ x: -20, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ delay: i * 0.1 }}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="text-kmer-white hover:text-kmer-neon border-b border-kmer-light/10 pb-4"
                >
                  {link.name}
                </motion.a>
              ))}
              <motion.a
                 href="https://github.com/MiltonJ23/KmerLex/"
                 initial={{ x: -20, opacity: 0 }}
                 animate={{ x: 0, opacity: 1 }}
                 transition={{ delay: 0.4 }}
                 className="text-kmer-light mt-4"
              >
                [ ACCESS SOURCE CODE ]
              </motion.a>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};