export interface FontConfig {
  family: string;
  type: "google";
  weights?: number[];
}

export const FONTS: FontConfig[] = [
  // --- TÍTULOS CONDENSADOS / ELEGANTES ---
  { family: "Bebas Neue", type: "google", weights: [400] },
  { family: "Oswald", type: "google", weights: [300, 400, 500, 600, 700] },
  { family: "Fjalla One", type: "google", weights: [400] },

  // --- TÍTULOS ELEGANTES / GOURMET (Serif) ---
  { family: "Playfair Display", type: "google", weights: [400, 600, 800, 900] },
  { family: "Cormorant Garamond", type: "google", weights: [400, 600, 700] },

  // --- CASUAL / STREET FOOD (Burguer, Kebab) ---
  { family: "Anton", type: "google", weights: [400] },
  { family: "Permanent Marker", type: "google", weights: [400] },
  { family: "Caveat", type: "google", weights: [400, 700] },

  // --- DESCRIPCIONES ALTAMENTE LEGIBLES ---
  { family: "Montserrat", type: "google", weights: [300, 400, 500, 600, 700, 800] },
  { family: "Open Sans", type: "google", weights: [300, 400, 600, 700, 800] },
];

export const GOOGLE_FONTS = FONTS;

export const GOOGLE_FONTS_URL = `https://fonts.googleapis.com/css2?${GOOGLE_FONTS.map(
  (f) => {
    const family = f.family.replace(/ /g, "+");
    if (f.weights && f.weights.length > 0) {
      if (f.weights.length === 1 && f.weights[0] === 400) {
        // Google Fonts a veces asume 400 por defecto de forma más limpia en fonts de weight único
        return `family=${family}`;
      }
      return `family=${family}:wght@${f.weights.join(";")}`;
    }
    return `family=${family}`;
  }
).join("&")}&display=swap`;
