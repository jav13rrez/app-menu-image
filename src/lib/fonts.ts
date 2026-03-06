export type FontCategory = "condensed" | "elegant" | "casual" | "display" | "body";

export interface FontConfig {
  family: string;
  type: "google";
  weights?: number[];
  category: FontCategory;
}

/** Category labels for the font picker UI. */
export const FONT_CATEGORY_LABELS: Record<FontCategory, string> = {
  condensed: "Títulos Condensados",
  elegant: "Elegante / Gourmet",
  casual: "Casual / Street Food",
  display: "Display / Creativo",
  body: "Cuerpo / Legible",
};

/**
 * Curated font library — merged from project selection + user docs/fonts.
 * Each font has a category for grouped display in the FontPicker.
 */
export const FONTS: FontConfig[] = [
  // --- TÍTULOS CONDENSADOS ---
  { family: "Bebas Neue", type: "google", weights: [400], category: "condensed" },
  { family: "Oswald", type: "google", weights: [300, 400, 500, 600, 700], category: "condensed" },
  { family: "Fjalla One", type: "google", weights: [400], category: "condensed" },
  { family: "Anton", type: "google", weights: [400], category: "condensed" },
  { family: "Archivo Black", type: "google", weights: [400], category: "condensed" },
  { family: "Big Shoulders", type: "google", weights: [100, 400, 700, 900], category: "condensed" },
  { family: "Alumni Sans Collegiate One", type: "google", weights: [400], category: "condensed" },
  { family: "Vina Sans", type: "google", weights: [400], category: "condensed" },

  // --- ELEGANTE / GOURMET (Serif) ---
  { family: "Playfair Display", type: "google", weights: [400, 600, 800, 900], category: "elegant" },
  { family: "Cormorant Garamond", type: "google", weights: [400, 600, 700], category: "elegant" },
  { family: "IM Fell DW Pica", type: "google", weights: [400], category: "elegant" },

  // --- CASUAL / STREET FOOD ---
  { family: "Permanent Marker", type: "google", weights: [400], category: "casual" },
  { family: "Caveat", type: "google", weights: [400, 700], category: "casual" },
  { family: "Love Ya Like A Sister", type: "google", weights: [400], category: "casual" },
  { family: "Coiny", type: "google", weights: [400], category: "casual" },

  // --- DISPLAY / CREATIVO ---
  { family: "Bungee", type: "google", weights: [400], category: "display" },
  { family: "Poetsen One", type: "google", weights: [400], category: "display" },
  { family: "Rubik Dirt", type: "google", weights: [400], category: "display" },
  { family: "Bahianita", type: "google", weights: [400], category: "display" },
  { family: "Codystar", type: "google", weights: [300, 400], category: "display" },
  { family: "Doto", type: "google", weights: [100, 400, 700, 900], category: "display" },

  // --- CUERPO / LEGIBLE ---
  { family: "Montserrat", type: "google", weights: [300, 400, 500, 600, 700, 800], category: "body" },
  { family: "Open Sans", type: "google", weights: [300, 400, 600, 700, 800], category: "body" },
];

export const GOOGLE_FONTS = FONTS;

export const GOOGLE_FONTS_URL = `https://fonts.googleapis.com/css2?${GOOGLE_FONTS.map(
  (f) => {
    const family = f.family.replace(/ /g, "+");
    if (f.weights && f.weights.length > 0) {
      if (f.weights.length === 1 && f.weights[0] === 400) {
        return `family=${family}`;
      }
      return `family=${family}:wght@${f.weights.join(";")}`;
    }
    return `family=${family}`;
  }
).join("&")}&display=swap`;
