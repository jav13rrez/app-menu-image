"use client";

import { useState, useEffect, useRef } from "react";
import {
    ChefHat,
    Clock,
    TrendingUp,
    Zap,
    CheckCircle,
    ArrowRight,
    Star,
    Camera,
    Palette,
    Download,
    X,
    Menu,
} from "lucide-react";
import Link from "next/link";

/* ──────────────────────────────────────────
   TYPES
────────────────────────────────────────── */
interface Step {
    icon: React.ReactNode;
    title: string;
    description: string;
}

interface ComparisonRow {
    option: string;
    cost: string;
    posts: string;
    time: string;
    highlight?: boolean;
}

/* ──────────────────────────────────────────
   DATA
────────────────────────────────────────── */
const PAIN_POINTS = [
    "Tienes el móvil lleno de fotos de platos que nunca llegaste a publicar.",
    "Cuando publicas algo, parece casero. No transmite lo que realmente es tu negocio.",
    "Cada vez que intentas publicar pierdes 30-40 minutos pensando qué escribir.",
    "No sabes qué hashtags usar ni cómo describir un plato sin sonar genérico.",
    "Contratar una agencia te cuesta entre 300€ y 800€ al mes — y encima tienes que explicarles tu negocio desde cero.",
];

const STEPS: Step[] = [
    {
        icon: <Camera className="w-6 h-6" />,
        title: "Sube la foto de tu plato",
        description: "Desde el móvil, en segundos. La IA analiza la imagen automáticamente.",
    },
    {
        icon: <Palette className="w-6 h-6" />,
        title: "Elige estilo y contexto",
        description: "6 estilos gastronómicos profesionales. Añade nombre de tu negocio y ciudad.",
    },
    {
        icon: <Zap className="w-6 h-6" />,
        title: "La IA genera tu publicación",
        description: "Imagen de calidad revista + titular + texto persuasivo + hashtags. Todo junto.",
    },
    {
        icon: <Download className="w-6 h-6" />,
        title: "Descarga y publica",
        description: "Listo para Instagram, Facebook o TikTok. En menos de 2 minutos.",
    },
];

const COMPARISON: ComparisonRow[] = [
    { option: "Agencia de marketing", cost: "500€ – 1.200€/mes", posts: "8-12 posts", time: "Alto (briefings y revisiones)" },
    { option: "Community Manager", cost: "300€ – 600€/mes", posts: "8-16 posts", time: "Medio (coordinación)" },
    { option: "Canva + ChatGPT tú solo", cost: "15€/mes", posts: "8-10 posts", time: "Muy alto (2h+ semanales)" },
    { option: "SocialFood", cost: "desde 5€", posts: "Ilimitado", time: "2 min por publicación", highlight: true },
];

const WHAT_INCLUDES = [
    "20 publicaciones profesionales (40 créditos)",
    "Titular + subtítulo + caption + hashtags automáticos",
    "6 estilos de fotografía gastronómica profesional",
    "Editor de texto flotante sobre la imagen",
    "Descarga en el formato exacto para cada red social",
    "Sin suscripción. Sin compromiso. Acceso inmediato.",
];

/* ──────────────────────────────────────────
   HOOKS
────────────────────────────────────────── */
function useInView(threshold = 0.15) {
    const ref = useRef<HTMLDivElement>(null);
    const [inView, setInView] = useState(false);

    useEffect(() => {
        const el = ref.current;
        if (!el) return;
        const observer = new IntersectionObserver(
            ([entry]) => { if (entry.isIntersecting) setInView(true); },
            { threshold }
        );
        observer.observe(el);
        return () => observer.disconnect();
    }, [threshold]);

    return { ref, inView };
}

/* ──────────────────────────────────────────
   SUB-COMPONENTS
────────────────────────────────────────── */
function CTAButton({ label, sub }: { label: string; sub?: string }) {
    return (
        <Link
            href="/auth/signup"
            className="group inline-flex flex-col items-center gap-1 w-full sm:w-auto"
        >
            <span className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-[#ea580c] hover:bg-[#c2410c] active:scale-[0.98] text-white font-bold text-base sm:text-lg px-8 py-4 rounded-xl transition-all duration-200 shadow-lg shadow-orange-900/40 cursor-pointer">
                {label}
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform duration-200" />
            </span>
            {sub && (
                <span className="text-xs text-stone-400">{sub}</span>
            )}
        </Link>
    );
}

function FadeIn({ children, delay = 0 }: { children: React.ReactNode; delay?: number }) {
    const { ref, inView } = useInView();
    return (
        <div
            ref={ref}
            style={{ transitionDelay: `${delay}ms` }}
            className={`transition-all duration-700 ${inView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"}`}
        >
            {children}
        </div>
    );
}

/* ──────────────────────────────────────────
   MAIN PAGE
────────────────────────────────────────── */
export default function LandingPage() {
    const [menuOpen, setMenuOpen] = useState(false);
    const [scrolled, setScrolled] = useState(false);

    useEffect(() => {
        const handleScroll = () => setScrolled(window.scrollY > 20);
        window.addEventListener("scroll", handleScroll, { passive: true });
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    return (
        <div className="min-h-screen bg-[#0a0a0a] text-[#f5f5f5] font-body overflow-x-hidden">

            {/* ── TOP URGENCY BAR ── */}
            <div className="bg-[#ea580c] text-white text-center text-sm font-medium py-2 px-4">
                <span className="font-bold">Oferta de lanzamiento</span>
                {" · "}20 publicaciones profesionales por solo
                {" "}
                <span className="font-bold underline">5€</span>
                {" · "}
                <span className="opacity-80">Precio limitado al lanzamiento</span>
            </div>

            {/* ── NAV (minimal, no distraction) ── */}
            <nav className={`sticky top-0 z-50 transition-all duration-300 ${scrolled ? "bg-[#0a0a0a]/95 backdrop-blur-md border-b border-[#1f1f1f]" : "bg-transparent"}`}>
                <div className="max-w-5xl mx-auto px-4 sm:px-6 flex items-center justify-between h-16">
                    <div className="flex items-center gap-2">
                        <ChefHat className="w-7 h-7 text-[#ea580c]" />
                        <span className="font-heading font-bold text-lg">SocialFood</span>
                    </div>
                    {/* Desktop CTA */}
                    <Link
                        href="/auth/signup"
                        className="hidden sm:inline-flex items-center gap-1.5 bg-[#ea580c] hover:bg-[#c2410c] text-white text-sm font-semibold px-4 py-2 rounded-lg transition-colors cursor-pointer"
                    >
                        Empezar por 5€
                        <ArrowRight className="w-4 h-4" />
                    </Link>
                    {/* Mobile hamburger */}
                    <button
                        className="sm:hidden p-2 cursor-pointer"
                        onClick={() => setMenuOpen(!menuOpen)}
                        aria-label={menuOpen ? "Cerrar menú" : "Abrir menú"}
                    >
                        {menuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
                    </button>
                </div>
                {/* Mobile menu */}
                {menuOpen && (
                    <div className="sm:hidden border-t border-[#1f1f1f] bg-[#0a0a0a] px-4 py-4">
                        <Link
                            href="/auth/signup"
                            className="block w-full text-center bg-[#ea580c] hover:bg-[#c2410c] text-white font-semibold px-4 py-3 rounded-lg transition-colors cursor-pointer"
                            onClick={() => setMenuOpen(false)}
                        >
                            Empezar por 5€ →
                        </Link>
                    </div>
                )}
            </nav>

            {/* ════════════════════════════════════
                SECCIÓN 1 — HERO
            ════════════════════════════════════ */}
            <section className="max-w-4xl mx-auto px-4 sm:px-6 pt-14 pb-16 text-center">
                {/* Badge */}
                <div className="inline-flex items-center gap-2 border border-[#ea580c]/40 bg-[#ea580c]/10 text-[#fb923c] text-xs font-semibold uppercase tracking-widest px-4 py-1.5 rounded-full mb-8">
                    <Star className="w-3.5 h-3.5 fill-current" />
                    Diseñado exclusivamente para hostelería
                </div>

                {/* Headline */}
                <h1 className="font-heading text-4xl sm:text-5xl md:text-6xl font-bold leading-tight mb-6">
                    Sabes que tienes que publicar{" "}
                    <span className="relative inline-block">
                        <span className="text-[#ea580c]">en redes.</span>
                    </span>
                    <br />
                    <span className="text-[#a3a3a3]">
                        El problema es que no tienes tiempo, no sabes qué escribir y tus fotos no llaman la atención.
                    </span>
                </h1>

                {/* Subheadline */}
                <p className="text-lg sm:text-xl text-[#d4d4d4] max-w-2xl mx-auto mb-10 leading-relaxed">
                    <strong className="text-white">SocialFood</strong> convierte la foto de cualquier plato en una publicación profesional lista para Instagram, Facebook o TikTok{" "}
                    <strong className="text-[#fb923c]">en menos de 2 minutos.</strong>
                    {" "}Sin agencia. Sin diseñador. Sin bloqueo mental.
                </p>

                {/* CTA */}
                <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-10">
                    <CTAButton
                        label="Quiero mis 20 publicaciones por 5€"
                        sub="Pago único · Sin suscripción · Acceso inmediato"
                    />
                </div>

                {/* VSL placeholder */}
                <div className="relative w-full max-w-2xl mx-auto aspect-video rounded-2xl overflow-hidden border border-[#2a2a2a] bg-[#111] flex flex-col items-center justify-center gap-4 cursor-pointer group">
                    <div className="absolute inset-0 bg-gradient-to-br from-[#ea580c]/10 to-transparent" />
                    <div className="relative w-16 h-16 rounded-full bg-[#ea580c] flex items-center justify-center shadow-xl shadow-orange-900/50 group-hover:scale-105 transition-transform duration-200">
                        <svg viewBox="0 0 24 24" fill="white" className="w-7 h-7 ml-1">
                            <path d="M8 5v14l11-7z" />
                        </svg>
                    </div>
                    <p className="relative text-sm text-[#666] font-medium">Mira cómo funciona en 90 segundos</p>
                    <p className="relative text-xs text-[#444]">Demo real antes/después</p>
                </div>
            </section>

            {/* ════════════════════════════════════
                SECCIÓN 2 — AGITACIÓN DEL DOLOR
            ════════════════════════════════════ */}
            <section className="bg-[#0f0f0f] border-y border-[#1a1a1a] py-16 px-4 sm:px-6">
                <div className="max-w-3xl mx-auto">
                    <FadeIn>
                        <p className="text-center text-[#a3a3a3] text-sm font-semibold uppercase tracking-widest mb-8">
                            ¿Te suena alguno de estos?
                        </p>
                    </FadeIn>
                    <div className="space-y-4">
                        {PAIN_POINTS.map((point, i) => (
                            <FadeIn key={i} delay={i * 80}>
                                <div className="flex items-start gap-4 bg-[#141414] border border-[#1f1f1f] rounded-xl p-4 sm:p-5">
                                    <div className="w-6 h-6 rounded-full bg-red-500/10 border border-red-500/20 flex items-center justify-center shrink-0 mt-0.5">
                                        <X className="w-3.5 h-3.5 text-red-400" />
                                    </div>
                                    <p className="text-[#d4d4d4] leading-relaxed">{point}</p>
                                </div>
                            </FadeIn>
                        ))}
                    </div>
                    <FadeIn delay={400}>
                        <p className="text-center mt-8 text-[#a3a3a3] text-base">
                            No es que no quieras publicar.{" "}
                            <strong className="text-white">Es que publicar bien requiere tiempo, ideas y habilidades que no tienes por qué tener.</strong>
                        </p>
                    </FadeIn>
                </div>
            </section>

            {/* ════════════════════════════════════
                SECCIÓN 3 — EL GIRO
            ════════════════════════════════════ */}
            <section className="py-16 px-4 sm:px-6">
                <FadeIn>
                    <div className="max-w-2xl mx-auto text-center">
                        <p className="text-[#a3a3a3] text-base mb-4">
                            Hay restaurantes que publican como si tuvieran un equipo de marketing detrás.
                        </p>
                        <h2 className="font-heading text-3xl sm:text-4xl font-bold mb-4">
                            No lo tienen.
                        </h2>
                        <p className="text-2xl font-heading font-bold text-[#ea580c] mb-6">
                            Usan SocialFood.
                        </p>
                        <p className="text-[#a3a3a3] text-base leading-relaxed">
                            La misma IA que usan las agencias de marketing gastronómica más caras.
                            Ahora en una app que maneja cualquier persona en menos de 2 minutos.
                        </p>
                    </div>
                </FadeIn>
            </section>

            {/* ════════════════════════════════════
                SECCIÓN 4 — CÓMO FUNCIONA
            ════════════════════════════════════ */}
            <section className="bg-[#0f0f0f] border-y border-[#1a1a1a] py-16 px-4 sm:px-6">
                <div className="max-w-4xl mx-auto">
                    <FadeIn>
                        <div className="text-center mb-12">
                            <p className="text-[#ea580c] text-sm font-semibold uppercase tracking-widest mb-3">El proceso</p>
                            <h2 className="font-heading text-3xl sm:text-4xl font-bold">
                                En 2 minutos, esto es lo que pasa:
                            </h2>
                        </div>
                    </FadeIn>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                        {STEPS.map((step, i) => (
                            <FadeIn key={i} delay={i * 100}>
                                <div className="relative bg-[#141414] border border-[#222] rounded-2xl p-6 h-full">
                                    {/* Step number */}
                                    <div className="absolute -top-3 -left-2 w-7 h-7 rounded-full bg-[#ea580c] flex items-center justify-center text-white text-xs font-bold">
                                        {i + 1}
                                    </div>
                                    <div className="w-10 h-10 rounded-xl bg-[#ea580c]/10 border border-[#ea580c]/20 flex items-center justify-center text-[#ea580c] mb-4">
                                        {step.icon}
                                    </div>
                                    <h3 className="font-semibold text-white mb-2 leading-snug">{step.title}</h3>
                                    <p className="text-[#737373] text-sm leading-relaxed">{step.description}</p>
                                </div>
                            </FadeIn>
                        ))}
                    </div>
                    <FadeIn delay={400}>
                        <p className="text-center mt-8 text-sm text-[#737373]">
                            Además puedes añadir el titular flotante sobre la imagen, elegir tipografía, color y posición.
                            Control total. En segundos.
                        </p>
                    </FadeIn>
                </div>
            </section>

            {/* ════════════════════════════════════
                SECCIÓN 5 — ANTES / DESPUÉS
            ════════════════════════════════════ */}
            <section className="py-16 px-4 sm:px-6">
                <div className="max-w-4xl mx-auto">
                    <FadeIn>
                        <div className="text-center mb-10">
                            <p className="text-[#ea580c] text-sm font-semibold uppercase tracking-widest mb-3">La diferencia</p>
                            <h2 className="font-heading text-3xl sm:text-4xl font-bold mb-3">
                                La misma foto. La misma cámara del móvil.
                            </h2>
                            <p className="text-[#a3a3a3] text-lg">Dos resultados completamente distintos.</p>
                        </div>
                    </FadeIn>
                    <FadeIn delay={150}>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                            {/* Before */}
                            <div className="relative rounded-2xl overflow-hidden border border-[#2a2a2a] bg-[#111] aspect-square flex flex-col items-center justify-center gap-3">
                                <div className="absolute inset-0 bg-gradient-to-br from-gray-900 to-gray-800 opacity-80" />
                                <div className="relative text-center p-6">
                                    <div className="w-16 h-16 rounded-xl bg-[#222] mx-auto mb-4 flex items-center justify-center">
                                        <Camera className="w-8 h-8 text-[#555]" />
                                    </div>
                                    <p className="text-[#555] text-xs mb-2 font-mono">foto_plato_23.jpg</p>
                                    <p className="text-white font-bold text-xl mb-1">Menú del día 12€</p>
                                    <p className="text-[#555] text-xs">Arial, sin diseño, fondo sucio</p>
                                </div>
                                <div className="absolute bottom-3 left-3">
                                    <span className="bg-red-500/20 border border-red-500/30 text-red-400 text-xs font-semibold px-2.5 py-1 rounded-full">
                                        Lo que publica la mayoría
                                    </span>
                                </div>
                            </div>
                            {/* After */}
                            <div className="relative rounded-2xl overflow-hidden border border-[#ea580c]/40 bg-[#111] aspect-square flex flex-col items-center justify-center gap-3 shadow-lg shadow-orange-900/20">
                                <div className="absolute inset-0 bg-gradient-to-br from-amber-900/30 via-orange-900/20 to-[#0a0a0a] opacity-90" />
                                <div className="relative text-center p-6">
                                    <div className="w-16 h-16 rounded-xl bg-[#ea580c]/10 border border-[#ea580c]/30 mx-auto mb-4 flex items-center justify-center">
                                        <Star className="w-8 h-8 text-[#ea580c] fill-[#ea580c]" />
                                    </div>
                                    <p className="font-heading text-[#fb923c] text-xs uppercase tracking-widest mb-2">Menú del día</p>
                                    <p className="font-heading font-bold text-white text-2xl mb-1">Sabor que enamora</p>
                                    <p className="text-[#737373] text-xs leading-relaxed max-w-[180px] mx-auto">
                                        Cocina mediterránea · Ingredientes de temporada
                                    </p>
                                    <p className="mt-3 text-[#ea580c] font-bold text-lg">12€</p>
                                    <p className="text-[#555] text-xs mt-1">#MenuDelDía #CocMediterránea</p>
                                </div>
                                <div className="absolute bottom-3 left-3">
                                    <span className="bg-[#ea580c]/20 border border-[#ea580c]/40 text-[#fb923c] text-xs font-semibold px-2.5 py-1 rounded-full">
                                        Portada de revista. En 2 minutos.
                                    </span>
                                </div>
                            </div>
                        </div>
                    </FadeIn>
                    <FadeIn delay={300}>
                        <p className="text-center mt-6 text-[#a3a3a3] font-medium">
                            Tus clientes juzgan tu restaurante por lo que ven en redes{" "}
                            <strong className="text-white">antes de entrar por la puerta.</strong>
                        </p>
                    </FadeIn>
                </div>
            </section>

            {/* ════════════════════════════════════
                SECCIÓN 6 — DESTRUCCIÓN OBJECIÓN PRECIO
            ════════════════════════════════════ */}
            <section className="bg-[#0f0f0f] border-y border-[#1a1a1a] py-16 px-4 sm:px-6">
                <div className="max-w-4xl mx-auto">
                    <FadeIn>
                        <div className="text-center mb-10">
                            <p className="text-[#ea580c] text-sm font-semibold uppercase tracking-widest mb-3">La matemática</p>
                            <h2 className="font-heading text-3xl sm:text-4xl font-bold mb-3">&ldquo;¿Merece la pena?&rdquo;</h2>
                            <p className="text-[#a3a3a3]">Hagamos los números.</p>
                        </div>
                    </FadeIn>
                    <FadeIn delay={150}>
                        {/* Mobile: cards, Desktop: table */}
                        <div className="hidden sm:block">
                            <div className="rounded-2xl overflow-hidden border border-[#1f1f1f]">
                                <table className="w-full text-sm">
                                    <thead>
                                        <tr className="bg-[#141414] border-b border-[#1f1f1f]">
                                            <th className="text-left px-5 py-3 text-[#737373] font-semibold">Opción</th>
                                            <th className="text-left px-5 py-3 text-[#737373] font-semibold">Coste</th>
                                            <th className="text-left px-5 py-3 text-[#737373] font-semibold">Posts/mes</th>
                                            <th className="text-left px-5 py-3 text-[#737373] font-semibold">Tiempo tuyo</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {COMPARISON.map((row, i) => (
                                            <tr
                                                key={i}
                                                className={`border-b border-[#1a1a1a] transition-colors ${row.highlight
                                                    ? "bg-[#1a0e00] border-[#ea580c]/30"
                                                    : "bg-[#0f0f0f] hover:bg-[#141414]"
                                                    }`}
                                            >
                                                <td className={`px-5 py-4 font-semibold ${row.highlight ? "text-[#fb923c]" : "text-white"}`}>
                                                    {row.option}
                                                    {row.highlight && <span className="ml-2 text-xs bg-[#ea580c]/20 border border-[#ea580c]/30 text-[#fb923c] px-2 py-0.5 rounded-full">Tú</span>}
                                                </td>
                                                <td className={`px-5 py-4 ${row.highlight ? "text-[#fb923c] font-bold" : "text-[#d4d4d4]"}`}>{row.cost}</td>
                                                <td className={`px-5 py-4 ${row.highlight ? "text-white font-medium" : "text-[#d4d4d4]"}`}>{row.posts}</td>
                                                <td className={`px-5 py-4 ${row.highlight ? "text-white font-medium" : "text-[#d4d4d4]"}`}>{row.time}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                        {/* Mobile cards */}
                        <div className="sm:hidden space-y-3">
                            {COMPARISON.map((row, i) => (
                                <div
                                    key={i}
                                    className={`rounded-xl border p-4 ${row.highlight
                                        ? "bg-[#1a0e00] border-[#ea580c]/40"
                                        : "bg-[#141414] border-[#1f1f1f]"}`}
                                >
                                    <p className={`font-bold mb-2 ${row.highlight ? "text-[#fb923c]" : "text-white"}`}>
                                        {row.option}
                                        {row.highlight && <span className="ml-2 text-xs bg-[#ea580c]/20 text-[#fb923c] px-2 py-0.5 rounded-full">Tu opción</span>}
                                    </p>
                                    <div className="grid grid-cols-2 gap-2 text-sm">
                                        <div>
                                            <p className="text-[#555] text-xs">Coste</p>
                                            <p className={row.highlight ? "text-[#fb923c] font-bold" : "text-[#d4d4d4]"}>{row.cost}</p>
                                        </div>
                                        <div>
                                            <p className="text-[#555] text-xs">Posts/mes</p>
                                            <p className="text-[#d4d4d4]">{row.posts}</p>
                                        </div>
                                        <div className="col-span-2">
                                            <p className="text-[#555] text-xs">Tiempo tuyo</p>
                                            <p className="text-[#d4d4d4]">{row.time}</p>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </FadeIn>
                    <FadeIn delay={300}>
                        <div className="mt-8 text-center space-y-2">
                            <p className="text-[#a3a3a3]">
                                Una sola publicación con una agencia cuesta{" "}
                                <strong className="text-white">entre 40€ y 100€.</strong>
                            </p>
                            <p className="text-base font-medium text-white">
                                Con SocialFood, esa misma publicación te cuesta{" "}
                                <strong className="text-[#ea580c] text-xl">menos de 0,13€.</strong>
                            </p>
                            <p className="text-[#737373] text-sm">
                                Y no necesitas explicarle nada a nadie. Lo haces tú. En 2 minutos.
                            </p>
                        </div>
                    </FadeIn>
                </div>
            </section>

            {/* ════════════════════════════════════
                SECCIÓN 7 — OFERTA DE LANZAMIENTO
            ════════════════════════════════════ */}
            <section className="py-16 px-4 sm:px-6">
                <div className="max-w-2xl mx-auto">
                    <FadeIn>
                        <div className="relative rounded-2xl border border-[#ea580c]/40 bg-gradient-to-b from-[#1a0e00] to-[#0f0f0f] p-8 sm:p-10 overflow-hidden">
                            {/* Glow */}
                            <div className="absolute -top-20 left-1/2 -translate-x-1/2 w-64 h-64 bg-[#ea580c]/15 rounded-full blur-3xl pointer-events-none" />

                            <div className="relative text-center">
                                <div className="inline-flex items-center gap-2 bg-[#ea580c]/10 border border-[#ea580c]/30 text-[#fb923c] text-xs font-bold uppercase tracking-widest px-4 py-1.5 rounded-full mb-6">
                                    <TrendingUp className="w-3.5 h-3.5" />
                                    Oferta Exclusiva de Lanzamiento
                                </div>

                                <h2 className="font-heading text-3xl sm:text-4xl font-bold mb-2">
                                    20 publicaciones completas
                                </h2>
                                <p className="text-[#555] text-xs mb-3 -mt-1">(40 créditos · 2 créditos por publicación)</p>
                                <div className="flex items-baseline justify-center gap-3 mb-2">
                                    <span className="font-heading text-6xl sm:text-7xl font-bold text-[#ea580c]">5€</span>
                                    <div className="text-left">
                                        <p className="text-[#737373] text-sm line-through">50€ valor de agencia</p>
                                        <p className="text-[#a3a3a3] text-sm">pago único</p>
                                    </div>
                                </div>
                                <p className="text-[#737373] text-sm mb-8">
                                    Eso es <strong className="text-white">menos de 0,13€ por publicación profesional.</strong>
                                </p>

                                {/* Includes list */}
                                <ul className="text-left space-y-3 mb-8">
                                    {WHAT_INCLUDES.map((item, i) => (
                                        <li key={i} className="flex items-start gap-3">
                                            <CheckCircle className="w-5 h-5 text-[#ea580c] shrink-0 mt-0.5" />
                                            <span className="text-[#d4d4d4] text-sm">{item}</span>
                                        </li>
                                    ))}
                                </ul>

                                <CTAButton
                                    label="Empezar ahora por 5€"
                                    sub="Pago único · Sin renovación automática · Resultado en menos de 2 minutos"
                                />
                            </div>
                        </div>
                    </FadeIn>
                </div>
            </section>

            {/* ════════════════════════════════════
                SECCIÓN 8 — CIERRE DE OBJECIÓN
            ════════════════════════════════════ */}
            <section className="bg-[#0f0f0f] border-y border-[#1a1a1a] py-12 px-4 sm:px-6">
                <div className="max-w-2xl mx-auto">
                    <FadeIn>
                        <div className="flex items-start gap-4 p-6 rounded-2xl bg-[#141414] border border-[#222]">
                            <div className="w-10 h-10 rounded-xl bg-[#ea580c]/10 border border-[#ea580c]/20 flex items-center justify-center shrink-0">
                                <ChefHat className="w-5 h-5 text-[#ea580c]" />
                            </div>
                            <div>
                                <h3 className="font-semibold text-white mb-2">
                                    Diseñado exclusivamente para hostelería
                                </h3>
                                <p className="text-[#737373] text-sm leading-relaxed">
                                    No es Canva. No es &ldquo;otra app de IA genérica&rdquo;. Es la única plataforma construida específicamente para que un restaurante, bar, cafetería o gastrobar pueda publicar contenido de nivel profesional sin conocimientos de diseño, sin copywriting y sin perder tiempo.
                                </p>
                                <p className="mt-3 text-white text-sm font-medium">
                                    Si tienes un negocio de hostelería y un móvil,{" "}
                                    <strong className="text-[#fb923c]">tienes todo lo que necesitas.</strong>
                                </p>
                            </div>
                        </div>
                    </FadeIn>
                </div>
            </section>

            {/* ════════════════════════════════════
                SECCIÓN 9 — CTA FINAL
            ════════════════════════════════════ */}
            <section className="py-20 px-4 sm:px-6 text-center">
                <div className="max-w-2xl mx-auto">
                    <FadeIn>
                        <div className="flex items-center justify-center gap-2 mb-6">
                            <Clock className="w-5 h-5 text-[#ea580c]" />
                            <span className="text-[#a3a3a3] text-sm font-medium">
                                Tu competencia ya está publicando mejor que tú.
                            </span>
                        </div>
                        <h2 className="font-heading text-3xl sm:text-4xl lg:text-5xl font-bold mb-6">
                            ¿Cuándo vas a{" "}
                            <span className="text-[#ea580c]">solucionarlo?</span>
                        </h2>
                        <div className="flex justify-center mb-6">
                            <CTAButton
                                label="Quiero mis 20 publicaciones por 5€"
                                sub="Acceso inmediato · Sin suscripción"
                            />
                        </div>
                        <p className="text-[#555] text-sm max-w-md mx-auto">
                            5€. Una sola vez. Si no te convence el resultado, no habrás perdido más que el precio de dos cafés.
                        </p>
                    </FadeIn>
                </div>
            </section>

            {/* ── FOOTER ── */}
            <footer className="border-t border-[#1a1a1a] py-8 px-4 sm:px-6">
                <div className="max-w-5xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-[#555]">
                    <div className="flex items-center gap-2">
                        <ChefHat className="w-4 h-4 text-[#ea580c]" />
                        <span className="font-heading font-semibold text-[#a3a3a3]">SocialFood</span>
                        <span>· La app de contenido gastronómico para hostelería</span>
                    </div>
                    <div className="flex items-center gap-4">
                        <Link href="/legal/privacy" className="hover:text-[#a3a3a3] transition-colors cursor-pointer">Privacidad</Link>
                        <Link href="/legal/terms" className="hover:text-[#a3a3a3] transition-colors cursor-pointer">Términos</Link>
                        <Link href="mailto:hola@socialfood.ai" className="hover:text-[#a3a3a3] transition-colors cursor-pointer">Contacto</Link>
                    </div>
                </div>
            </footer>
        </div>
    );
}
