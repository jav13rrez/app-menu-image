export interface FontConfig {
  family: string;
  file?: string;
  type: "local" | "google";
  weight?: number;
}

export const FONTS: FontConfig[] = [
  { family: "Anton", file: "/fonts/Anton-Regular.ttf", type: "local", weight: 400 },
  { family: "Gorgeous", file: "/fonts/Gorgeous-Bold.ttf", type: "local", weight: 700 },
  { family: "Lorida", file: "/fonts/Lorida.ttf", type: "local", weight: 400 },
  { family: "Morganite", file: "/fonts/Morganite-SemiBold.ttf", type: "local", weight: 600 },
  { family: "Montserrat", type: "google", weight: 700 },
  { family: "Playfair Display", type: "google", weight: 700 },
  { family: "Oswald", type: "google", weight: 500 },
  { family: "Bebas Neue", type: "google", weight: 400 },
  { family: "Roboto", type: "google", weight: 700 },
  { family: "Open Sans", type: "google", weight: 700 },
];

export const LOCAL_FONTS = FONTS.filter((f) => f.type === "local");
export const GOOGLE_FONTS = FONTS.filter((f) => f.type === "google");

export const GOOGLE_FONTS_URL = `https://fonts.googleapis.com/css2?family=${GOOGLE_FONTS.map(
  (f) => `${f.family.replace(/ /g, "+")}:wght@${f.weight || 400}`
).join("&family=")}&display=swap`;
