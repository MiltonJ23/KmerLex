import { useState, useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Points, PointMaterial, Float, Trail } from '@react-three/drei';
import * as THREE from 'three';
// @ts-ignore - Maath est optimisé mais ses types TS sont parfois capricieux
import * as random from 'maath/random/dist/maath-random.esm';

// --- CONFIGURATION ---
const STAR_COUNT = 6000;
const STAR_RADIUS = 1.2; // Rayon de la sphère d'étoiles
const STAR_COLOR = "#7CFFB2"; // Kmer Light Green
const BG_COLOR = "#051A14";   // Kmer Deep Dark

// --- COMPOSANT : CHAMP D'ÉTOILES (Optimisé) ---
const StarField = (props: any) => {
  const ref = useRef<THREE.Points>(null!);
  
  // Génération unique des positions (Float32Array est bcp plus rapide que les Array classiques)
  const [sphere] = useState(() => 
    random.inSphere(new Float32Array(STAR_COUNT * 3), { radius: STAR_RADIUS })
  );

  // Animation de rotation constante
  useFrame((_state, delta) => {
    if (ref.current) {
      ref.current.rotation.x -= delta / 15;
      ref.current.rotation.y -= delta / 20;
    }
  });

  return (
    <group rotation={[0, 0, Math.PI / 4]}>
      <Points ref={ref} positions={sphere} stride={3} frustumCulled={false} {...props}>
        <PointMaterial
          transparent
          color={STAR_COLOR}
          size={0.002}        // Taille très fine pour l'aspect "Lointain"
          sizeAttenuation={true} // Les étoiles loin sont plus petites
          depthWrite={false}  // Empêche les étoiles de se cacher les unes les autres (bug z-fighting)
          blending={THREE.AdditiveBlending} // Effet lumineux
        />
      </Points>
    </group>
  );
};

// --- COMPOSANT : MÉTÉORE (Shooting Star) ---
const ShootingStar = () => {
  const meshRef = useRef<THREE.Mesh>(null!);
  
  // État local pour gérer le reset du météore sans re-render React
  const [startPos] = useState(() => new THREE.Vector3(-2, 1, 0));
  
  useFrame((state) => {
    const t = state.clock.getElapsedTime();
    const cycle = t % 6; // Cycle de 6 secondes

    if (meshRef.current) {
      // Mouvement diagonal rapide
      // On utilise le temps pour calculer une trajectoire linéaire
      const progress = cycle * 2.5; 
      
      meshRef.current.position.x = startPos.x + progress;
      meshRef.current.position.y = startPos.y - progress * 0.8; // Descend légèrement
      meshRef.current.position.z = -Math.sin(cycle) * 0.5; // Légère profondeur

      // Gestion de l'opacité (Fade in -> Move -> Fade out)
      // On rend le météore visible seulement pendant une fraction du cycle
      const material = meshRef.current.material as THREE.MeshBasicMaterial;
      if (cycle < 2) {
        // Apparition/Disparition fluide basée sur une courbe sinusoïdale
        material.opacity = Math.max(0, Math.sin(cycle * Math.PI) * 0.8);
      } else {
        material.opacity = 0;
        // Reset position visuelle (astuce pour éviter le tp visible)
        meshRef.current.position.set(-5, 5, 0); 
      }
    }
  });

  return (
    <Trail
      width={0.02} // Largeur de la traînée
      length={8}   // Longueur de la traînée
      color={new THREE.Color("#00E676")} // Kmer Neon
      attenuation={(t) => t * t} // La queue s'affine
    >
      <mesh ref={meshRef} position={[-5, 5, 0]}>
        <sphereGeometry args={[0.005, 8, 8]} />
        <meshBasicMaterial color="#FFFFFF" transparent opacity={0} />
      </mesh>
    </Trail>
  );
};

// --- COMPOSANT PRINCIPAL ---
export const SpaceBackground = () => {
  return (
    <div className="fixed inset-0 z-[-1] bg-[#051A14] pointer-events-none">
      <Canvas
        camera={{ position: [0, 0, 1] }}
        dpr={[1, 2]} // Optimisation Retina (max 2x pixel ratio pour sauver la batterie)
        gl={{ antialias: false }} // Désactivé pour perf (pas nécessaire sur des étoiles)
      >
        {/* 1. ÉCLAIRAGE D'AMBIANCE */}
        {/* Même dans l'espace, une légère teinte unifie le tout */}
        <ambientLight intensity={0.1} />

        {/* 2. LE CHAMP D'ÉTOILES */}
        <StarField />
        
        {/* 3. MÉTÉORE DYNAMIQUE */}
        <ShootingStar />

        {/* 4. MOUVEMENT DE FLOTTEMENT (Parallax doux) */}
        {/* Fait bouger toute la scène doucement quand on bouge la souris */}
        <Float speed={1.5} rotationIntensity={0.2} floatIntensity={0.2} />
      </Canvas>

      {/* --- OVERLAY DE LISIBILITÉ --- */}
      {/* Indispensable : Un dégradé CSS par-dessus le Canvas pour que le texte blanc reste lisible */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#051A14]/0 via-[#051A14]/20 to-[#051A14]/90" />
      
      {/* --- VIGNETTE CINÉMATIQUE --- */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_0%,#051A14_100%)] opacity-60" />
    </div>
  );
};