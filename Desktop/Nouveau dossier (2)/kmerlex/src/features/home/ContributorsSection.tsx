import { motion } from 'framer-motion';
import { GlassCard } from '../../components/ui/GlassCard';
import { Badge } from '../../components/ui/Badge';

// --- TYPES & DATA ---

interface Contributor {
  id: string;
  name: string;
  role: string;
  avatarUrl: string; // Utilisation de DiceBear pour des avatars générés "Tech"
  github?: string;
  linkedin?: string;
  stack: string[]; // Technologies maîtrisées
}

// ⚠️ REMPLACE CES DONNÉES PAR LES VRAIS MEMBRES DU GROUPE
const CONTRIBUTORS: Contributor[] = [
  {
    id: "KMER-001",
    name: "Lead Architect",
    role: "Compiler Engine Lead",
    avatarUrl: "https://api.dicebear.com/7.x/avataaars/svg?seed=Felix&backgroundColor=b6e3f4",
    github: "https://github.com",
    stack: ["TypeScript", "Regex", "AST"]
  },
  {
    id: "KMER-002",
    name: "UI Specialist",
    role: "Frontend Engineer",
    avatarUrl: "https://api.dicebear.com/7.x/avataaars/svg?seed=Aneka&backgroundColor=c0aede",
    github: "https://github.com",
    stack: ["React", "Framer", "Tailwind"]
  },
  {
    id: "KMER-003",
    name: "Linguist Dev",
    role: "Grammar Logic Expert",
    avatarUrl: "https://api.dicebear.com/7.x/avataaars/svg?seed=Jaden&backgroundColor=ffdfbf",
    github: "https://github.com",
    stack: ["Pidgin", "NLP", "Logic"]
  },
  {
    id: "KMER-004",
    name: "Backend Ops",
    role: "API & Data Systems",
    avatarUrl: "https://api.dicebear.com/7.x/avataaars/svg?seed=Brooklynn&backgroundColor=ffdfbf",
    github: "https://github.com",
    stack: ["Node.js", "Crowdsourcing"]
  }
];

// --- VARIANTES D'ANIMATION ---
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.15
    }
  }
};

const cardVariants = {
  hidden: { y: 30, opacity: 0 },
  visible: { 
    y: 0, 
    opacity: 1,
    transition: { type: "spring", stiffness: 50, damping: 15 }
  }
};

// --- COMPOSANT ---
export const ContributorsSection = () => {
  return (
    <section id="contributors" className="relative py-24 overflow-hidden">
      
      {/* Background Decoratif */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-px bg-gradient-to-r from-transparent via-kmer-neon/20 to-transparent" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_bottom,#051A14_0%,transparent_70%)] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        
        {/* EN-TÊTE DE SECTION */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16 space-y-4"
        >
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-kmer-white/10 bg-kmer-white/5">
            <span className="w-1.5 h-1.5 rounded-full bg-kmer-neon animate-pulse" />
            <span className="text-[10px] font-mono tracking-[0.2em] text-kmer-white/60 uppercase">
              System Architects
            </span>
          </div>
          
          <h2 className="text-3xl md:text-5xl font-bold text-white tracking-tight">
            The <span className="text-kmer-neon">Minds</span> Behind KmerLex
          </h2>
          <p className="max-w-xl mx-auto text-kmer-white/60 text-sm md:text-base leading-relaxed">
            A collective of engineers and linguists dedicated to bridging the gap between urban vernaculars and digital intelligence.
          </p>
        </motion.div>

        {/* GRILLE DES CONTRIBUTEURS */}
        <motion.div 
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
        >
          {CONTRIBUTORS.map((dev) => (
            <motion.div key={dev.id} variants={cardVariants}>
              <GlassCard 
                interactive 
                className="h-full flex flex-col p-0 border-kmer-white/5 bg-[#051A14]/40 hover:bg-[#051A14]/60 group"
              >
                
                {/* 1. HEADER CARTE (ID & Avatar) */}
                <div className="p-6 pb-0 flex flex-col items-center">
                  <div className="relative mb-4">
                    {/* Cercle rotatif décoratif */}
                    <div className="absolute -inset-2 rounded-full border border-dashed border-kmer-white/20 animate-[spin_10s_linear_infinite]" />
                    
                    {/* Avatar */}
                    <div className="relative w-24 h-24 rounded-full overflow-hidden border-2 border-kmer-white/10 group-hover:border-kmer-neon transition-colors duration-300 bg-kmer-white/5">
                      <img 
                        src={dev.avatarUrl} 
                        alt={dev.name} 
                        className="w-full h-full object-cover filter grayscale group-hover:grayscale-0 transition-all duration-500"
                        loading="lazy"
                      />
                    </div>

                    {/* Badge "Online" */}
                    <div className="absolute bottom-1 right-1 w-4 h-4 bg-[#051A14] rounded-full flex items-center justify-center">
                      <div className="w-2.5 h-2.5 bg-green-500 rounded-full border border-[#051A14]" />
                    </div>
                  </div>

                  <h3 className="text-lg font-bold text-white group-hover:text-kmer-neon transition-colors font-mono">
                    {dev.name}
                  </h3>
                  <p className="text-xs text-kmer-neon/80 tracking-widest uppercase mb-1">
                    {dev.role}
                  </p>
                  <span className="text-[10px] text-kmer-white/30 font-mono">
                    ID: {dev.id}
                  </span>
                </div>

                {/* 2. SÉPARATEUR */}
                <div className="my-6 mx-6 h-px bg-gradient-to-r from-transparent via-kmer-white/10 to-transparent" />

                {/* 3. TECH STACK (Badges) */}
                <div className="px-6 flex-grow">
                  <div className="flex flex-wrap justify-center gap-2">
                    {dev.stack.map((tech) => (
                      // On utilise le style "PUNCTUATION" ou "WORD" pour un look neutre mais tech
                      <Badge key={tech} type="WORD">
                        {tech}
                      </Badge>
                    ))}
                  </div>
                </div>

                {/* 4. FOOTER (Liens Sociaux) */}
                <div className="mt-6 p-4 bg-kmer-white/5 border-t border-kmer-white/5 flex justify-center gap-4">
                  {dev.github && (
                    <a 
                      href={dev.github} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-kmer-white/50 hover:text-white hover:scale-110 transition-all"
                      aria-label="GitHub Profile"
                    >
                      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/></svg>
                    </a>
                  )}
                  {/* Ajouter d'autres liens si nécessaire (LinkedIn, Twitter...) */}
                </div>

              </GlassCard>
            </motion.div>
          ))}
        </motion.div>

      </div>
    </section>
  );
};