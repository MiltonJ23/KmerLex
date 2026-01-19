import { useState, useEffect, useRef } from 'react';

// --- TYPES ---

interface ScrollState {
  scrollY: number;        // Position absolue en pixels
  scrollX: number;
  direction: 'up' | 'down' | null; // Direction du mouvement
  isScrolled: boolean;    // Vrai si on a dépassé le seuil (ex: pour le background de la navbar)
  progress: number;       // Progression dans la page (0.0 à 1.0)
}

interface UseScrollOptions {
  threshold?: number;     // Seuil en pixels pour activer 'isScrolled' (défaut: 50px)
}

// --- HOOK ---

export const useScroll = (options: UseScrollOptions = {}) => {
  const { threshold = 50 } = options;
  
  const [state, setState] = useState<ScrollState>({
    scrollY: 0,
    scrollX: 0,
    direction: null,
    isScrolled: false,
    progress: 0,
  });

  // Utilisation de useRef pour garder la trace de la dernière position sans re-rendu
  const lastScrollY = useRef(0);
  const ticking = useRef(false);

  useEffect(() => {
    const handleScroll = () => {
      // Optimisation : requestAnimationFrame pour éviter le "Scroll Jank"
      if (!ticking.current) {
        window.requestAnimationFrame(() => {
          const currentScrollY = window.scrollY;
          const currentScrollX = window.scrollX;
          
          // Calcul de la direction
          const direction = currentScrollY > lastScrollY.current ? 'down' : 'up';
          
          // Calcul de la progression (0 à 1)
          const totalHeight = document.documentElement.scrollHeight - window.innerHeight;
          const progress = totalHeight > 0 ? currentScrollY / totalHeight : 0;

          setState({
            scrollY: currentScrollY,
            scrollX: currentScrollX,
            direction,
            isScrolled: currentScrollY > threshold,
            progress: Math.min(Math.max(progress, 0), 1), // Clamp entre 0 et 1
          });

          lastScrollY.current = currentScrollY;
          ticking.current = false;
        });

        ticking.current = true;
      }
    };

    // Appel initial pour caler l'état au chargement
    handleScroll();

    window.addEventListener('scroll', handleScroll, { passive: true }); // Passive listener = meilleures perfs
    
    return () => window.removeEventListener('scroll', handleScroll);
  }, [threshold]);

  return state;
};