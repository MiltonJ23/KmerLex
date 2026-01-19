import { useState, useEffect, useLayoutEffect, Suspense, lazy } from 'react';
import { AnimatePresence, motion } from 'framer-motion';

// --- IMPORTS STATIQUES (Layout Global) ---
import { Navbar } from './components/layout/Navbar';
import { Footer } from './components/layout/Footer';
import { SpaceBackground } from './components/viz/SpaceBackground';

// --- IMPORTS PARESSEUX (Code Splitting) ---
// Optimisation critique : Charge le code de l'analyseur uniquement au besoin
const HomePage = lazy(() => import('./features/home/HomePage').then(m => ({ default: m.HomePage })));
const AnalyzerPage = lazy(() => import('./features/analyzer/AnalyzerPage').then(m => ({ default: m.AnalyzerPage })));

// --- TYPES & CONSTANTES ---
type View = 'home' | 'analyzer';

const PAGE_VARIANTS = {
  initial: { opacity: 0, y: 20, filter: 'blur(10px)' },
  animate: { opacity: 1, y: 0, filter: 'blur(0px)' },
  exit: { opacity: 0, y: -20, filter: 'blur(10px)' }
};

const PAGE_TRANSITION = {
  duration: 0.4,
  ease: [0.25, 1, 0.5, 1] // Courbe "Quart-Out" fluide
};

// --- COMPOSANT DE CHARGEMENT (Fallback) ---
const LoadingScreen = () => (
  <div className="min-h-screen flex flex-col items-center justify-center text-kmer-neon">
    <div className="w-12 h-12 border-4 border-current border-t-transparent rounded-full animate-spin mb-4" />
    <span className="font-mono text-xs tracking-widest animate-pulse">LOADING MODULE...</span>
  </div>
);

// --- APP PRINCIPALE ---
function App() {
  const [currentView, setCurrentView] = useState<View>('home');

  // 1. GESTION DU ROUTING (Hash Listener)
  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash.replace('#', '');
      
      // Logique de routing simple
      if (hash === 'analyzer') {
        setCurrentView('analyzer');
      } else {
        // Par défaut ou si #home
        setCurrentView('home');
      }
    };

    // Vérification initiale
    handleHashChange();

    // Abonnement aux changements
    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  // 2. SCROLL RESTORATION (UX)
  useLayoutEffect(() => {
    window.scrollTo(0, 0);
  }, [currentView]);

  return (
    <div className="relative min-h-screen text-kmer-white font-mono selection:bg-kmer-neon selection:text-kmer-dark">
      
      {/* A. ARRIÈRE-PLAN PERSISTANT (Ne re-render pas) */}
      <SpaceBackground />
      
      {/* B. NAVIGATION GLOBALE */}
      <Navbar />

      {/* C. CONTENU DYNAMIQUE (Pages) */}
      <main className="relative pt-20 flex-grow min-h-screen flex flex-col">
        <Suspense fallback={<LoadingScreen />}>
          <AnimatePresence mode="wait">
            
            {currentView === 'home' && (
              <motion.div
                key="home"
                variants={PAGE_VARIANTS}
                initial="initial"
                animate="animate"
                exit="exit"
                transition={PAGE_TRANSITION}
                className="flex-grow"
              >
                <HomePage />
              </motion.div>
            )}

            {currentView === 'analyzer' && (
              <motion.div
                key="analyzer"
                variants={PAGE_VARIANTS}
                initial="initial"
                animate="animate"
                exit="exit"
                transition={PAGE_TRANSITION}
                className="flex-grow"
              >
                <AnalyzerPage />
              </motion.div>
            )}

          </AnimatePresence>
        </Suspense>
      </main>

      {/* D. PIED DE PAGE GLOBAL */}
      <Footer />
    </div>
  );
}

export default App;