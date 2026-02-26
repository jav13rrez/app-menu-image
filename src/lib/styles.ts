export interface StyleOption {
  id: string;
  name: string;
  description: string;
  gradient: string;
}

export interface NarrativeOption {
  id: string;
  name: string;
  description: string;
  icon: string;
}

export const STYLE_OPTIONS: StyleOption[] = [
  {
    id: "dark_moody",
    name: "Oscuro Dramático",
    description: "Sombras intensas con brillos cálidos",
    gradient: "from-gray-900 via-amber-950 to-gray-900",
  },
  {
    id: "rustic_wood",
    name: "Madera Rústica",
    description: "Mesa de madera cálida con luz natural",
    gradient: "from-amber-800 via-yellow-700 to-amber-900",
  },
  {
    id: "marble_luxury",
    name: "Mármol Elegante",
    description: "Mármol blanco limpio con sombras elegantes",
    gradient: "from-slate-700 via-gray-600 to-slate-800",
  },
  {
    id: "golden_hour",
    name: "Hora Dorada",
    description: "Luz cálida de atardecer con bokeh suave",
    gradient: "from-orange-400 via-amber-300 to-yellow-500",
  },
  {
    id: "bright_studio",
    name: "Estudio Luminoso",
    description: "Estudio profesional con iluminación uniforme",
    gradient: "from-sky-700 via-blue-600 to-cyan-700",
  },
  {
    id: "moody_candlelight",
    name: "Luz de Velas",
    description: "Ambiente íntimo iluminado con velas",
    gradient: "from-orange-900 via-red-950 to-gray-900",
  },
];

export const NARRATIVE_OPTIONS: NarrativeOption[] = [
  { id: "none", name: "Sin narrativa", description: "Solo el plato", icon: "Circle" },
  { id: "action_pour", name: "Vertido en acción", description: "Salsa cayendo en el momento", icon: "Droplets" },
  { id: "chef_hand", name: "Mano del chef", description: "Mano colocando el toque final", icon: "Hand" },
  { id: "waiter_pov", name: "Perspectiva camarero", description: "Plato siendo servido", icon: "UtensilsCrossed" },
];
