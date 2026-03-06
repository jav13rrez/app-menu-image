export interface StyleOption {
  id: string;
  name: string;
  description: string;
  gradient: string;
  /** Background reference image path (relative to /public). */
  image: string;
}

export interface NarrativeOption {
  id: string;
  name: string;
  description: string;
  icon: string;
  /** Background reference image path (relative to /public). */
  image: string;
}

export const STYLE_OPTIONS: StyleOption[] = [
  {
    id: "dark_moody",
    name: "Oscuro Dramático",
    description: "Sombras intensas con brillos cálidos",
    gradient: "from-gray-900 via-amber-950 to-gray-900",
    image: "/images/styles/oscuro-dramatico.jpg",
  },
  {
    id: "rustic_wood",
    name: "Madera Rústica",
    description: "Mesa de madera cálida con luz natural",
    gradient: "from-amber-800 via-yellow-700 to-amber-900",
    image: "/images/styles/madera-rustica.jpg",
  },
  {
    id: "marble_luxury",
    name: "Mármol Elegante",
    description: "Mármol blanco limpio con sombras elegantes",
    gradient: "from-slate-700 via-gray-600 to-slate-800",
    image: "/images/styles/marmol-elegante.jpg",
  },
  {
    id: "vibrant_pop",
    name: "Vibrante Pop",
    description: "Colores intensos, flash duro, energía Gen-Z",
    gradient: "from-pink-500 via-yellow-400 to-cyan-400",
    image: "/images/styles/vibrante-pop.jpg",
  },
  {
    id: "retro_analog",
    name: "Retro Analógico",
    description: "Grano 35mm, tonos cálidos, nostalgia anti-IA",
    gradient: "from-yellow-700 via-orange-600 to-rose-700",
    image: "/images/styles/retro-analogico.jpg",
  },
  {
    id: "nordic_minimalist",
    name: "Nórdico Minimal",
    description: "Elegancia nórdica, tonos claros, calma zen",
    gradient: "from-slate-300 via-stone-200 to-zinc-400",
    image: "/images/styles/nordico-minimal.jpg",
  },
];

export const NARRATIVE_OPTIONS: NarrativeOption[] = [
  { id: "none", name: "Sin narrativa", description: "Solo el plato, sin acción", icon: "Circle", image: "/images/narratives/sin-narrativa.jpg" },
  { id: "action_pour", name: "Acción dinámica", description: "La IA añade un vertido coherente con el plato", icon: "Droplets", image: "/images/narratives/accion-dinamica.jpg" },
  { id: "chef_hand", name: "Toque del chef", description: "La IA añade un gesto de chef coherente", icon: "Hand", image: "/images/narratives/toque-del-chef.jpg" },
  { id: "waiter_pov", name: "Servicio al comensal", description: "Plato siendo servido al espectador", icon: "UtensilsCrossed", image: "/images/narratives/servicio-al-comensal.jpg" },
];
