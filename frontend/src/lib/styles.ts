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
    name: "Dark Moody",
    description: "Dramatic shadows with warm highlights",
    gradient: "from-gray-900 via-amber-950 to-gray-900",
  },
  {
    id: "rustic_wood",
    name: "Rustic Wood",
    description: "Warm wooden table with natural light",
    gradient: "from-amber-800 via-yellow-700 to-amber-900",
  },
  {
    id: "marble_luxury",
    name: "Marble Luxury",
    description: "Clean white marble with elegant shadows",
    gradient: "from-gray-200 via-white to-gray-300",
  },
  {
    id: "golden_hour",
    name: "Golden Hour",
    description: "Warm sunset lighting with soft bokeh",
    gradient: "from-orange-400 via-amber-300 to-yellow-500",
  },
  {
    id: "bright_studio",
    name: "Bright Studio",
    description: "Professional studio with even lighting",
    gradient: "from-blue-100 via-white to-blue-50",
  },
  {
    id: "moody_candlelight",
    name: "Candlelight",
    description: "Intimate candlelit ambiance",
    gradient: "from-orange-900 via-red-950 to-gray-900",
  },
];

export const NARRATIVE_OPTIONS: NarrativeOption[] = [
  { id: "none", name: "None", description: "Just the dish", icon: "Circle" },
  { id: "action_pour", name: "Action Pour", description: "Sauce mid-pour", icon: "Droplets" },
  { id: "chef_hand", name: "Chef's Hand", description: "Hand placing garnish", icon: "Hand" },
  { id: "waiter_pov", name: "Waiter POV", description: "Plate being served", icon: "UtensilsCrossed" },
];
