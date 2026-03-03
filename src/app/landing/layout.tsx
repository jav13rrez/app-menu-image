import type { Metadata } from "next";

export const metadata: Metadata = {
    title: "SocialFood — Publicaciones profesionales para tu restaurante en 2 minutos",
    description:
        "Convierte la foto de cualquier plato en una publicación lista para Instagram, Facebook o TikTok. Sin agencia, sin diseñador. Prueba ahora por 5€.",
    keywords: [
        "marketing restaurante",
        "redes sociales hostelería",
        "publicaciones Instagram restaurante",
        "IA fotografía gastronómica",
        "SocialFood",
        "content creator restaurante",
    ],
    openGraph: {
        title: "SocialFood — 40 publicaciones profesionales por 5€",
        description:
            "La IA que convierte tus fotos de platos en publicaciones de nivel agencia. Sin agencia. Sin tiempo perdido. Sin bloqueo mental.",
        type: "website",
        locale: "es_ES",
    },
    twitter: {
        card: "summary_large_image",
        title: "SocialFood — Publicaciones que venden tu restaurante",
        description: "De foto de móvil a portada de revista. En 2 minutos. Por 5€.",
    },
    robots: {
        index: true,
        follow: true,
    },
};

export default function LandingLayout({ children }: { children: React.ReactNode }) {
    return <>{children}</>;
}
