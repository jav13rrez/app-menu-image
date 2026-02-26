(globalThis.TURBOPACK || (globalThis.TURBOPACK = [])).push([typeof document === "object" ? document.currentScript : undefined,
"[project]/src/store/wizard.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "useWizardStore",
    ()=>useWizardStore
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zustand$2f$esm$2f$react$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/zustand/esm/react.mjs [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zustand$2f$esm$2f$middleware$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/zustand/esm/middleware.mjs [app-client] (ecmascript)");
;
;
const initialState = {
    currentStep: 0,
    originalImageFile: null,
    originalImagePreview: null,
    selectedStyleId: "",
    selectedNarrative: "",
    selectedAspectRatio: "1:1",
    generatedImageUrl: null,
    generatedCopy: null,
    generatedHashtags: [],
    generatedHeadline: null,
    generatedTagline: null,
    isGenerating: false,
    jobId: null,
    error: null
};
const useWizardStore = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zustand$2f$esm$2f$react$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["create"])()((0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zustand$2f$esm$2f$middleware$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["persist"])((set)=>({
        ...initialState,
        setStep: (step)=>set({
                currentStep: step
            }),
        setImage: (file, preview)=>set({
                originalImageFile: file,
                originalImagePreview: preview,
                currentStep: 1
            }),
        setStyle: (styleId)=>set({
                selectedStyleId: styleId
            }),
        setNarrative: (narrative)=>set({
                selectedNarrative: narrative
            }),
        setAspectRatio: (ratio)=>set({
                selectedAspectRatio: ratio
            }),
        setGenerationResult: (imageUrl, copy, hashtags, headline, tagline)=>set({
                generatedImageUrl: imageUrl,
                generatedCopy: copy,
                generatedHashtags: hashtags,
                generatedHeadline: headline,
                generatedTagline: tagline,
                isGenerating: false,
                currentStep: 3
            }),
        setGenerating: (generating)=>set({
                isGenerating: generating
            }),
        setJobId: (jobId)=>set({
                jobId
            }),
        setError: (error)=>set({
                error,
                isGenerating: false
            }),
        reset: ()=>set(initialState)
    }), {
    name: "wizard-state",
    storage: (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zustand$2f$esm$2f$middleware$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["createJSONStorage"])(()=>sessionStorage),
    partialize: (state)=>({
            currentStep: state.currentStep,
            selectedStyleId: state.selectedStyleId,
            selectedNarrative: state.selectedNarrative,
            selectedAspectRatio: state.selectedAspectRatio,
            generatedImageUrl: state.generatedImageUrl,
            generatedCopy: state.generatedCopy,
            generatedHashtags: state.generatedHashtags,
            generatedHeadline: state.generatedHeadline,
            generatedTagline: state.generatedTagline
        })
}));
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/src/lib/i18n.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "t",
    ()=>t
]);
const t = {
    appName: "FoodSocial AI",
    steps: [
        "Subir",
        "Estilo",
        "Generar",
        "Diseño",
        "Exportar"
    ],
    upload: {
        title: "Sube Tu Foto",
        subtitle: "Toma una foto de tu plato -- incluso con mala luz. Lo transformaremos.",
        dropzone: "Arrastra y suelta tu foto aquí, o haz clic para buscar",
        formats: "JPG, PNG, WebP - Máx 20MB",
        change: "Cambiar",
        minRes: "La imagen debe tener al menos 400x400px"
    },
    style: {
        title: "Elige un Estilo",
        subtitle: "Selecciona el ambiente para tu foto",
        narrativeTitle: "Toque Narrativo",
        narrativeSubtitle: "Añade un elemento humano a la escena",
        formatTitle: "Formato de Imagen",
        formatSubtitle: "Elige la proporción de la imagen generada"
    },
    loading: {
        messages: [
            "Emplatando el plato...",
            "Ajustando las luces del estudio...",
            "Componiendo la toma perfecta...",
            "Añadiendo los toques finales..."
        ],
        estimate: "Esto suele tardar 10-15 segundos",
        tryAgain: "Reintentar"
    },
    canvas: {
        aspectRatio: "Proporción",
        textOverlay: "Texto Superpuesto",
        download: "Descargar Imagen",
        templates: [
            "Menú del Día",
            "Especial Fin de Semana",
            "Selección del Chef",
            "Tiempo Limitado"
        ]
    },
    export: {
        title: "Listo para Publicar",
        caption: "Texto y Hashtags",
        copyText: "Copiar Texto",
        copied: "¡Copiado!",
        downloadBtn: "Descargar",
        share: "Compartir",
        createAnother: "Crear Otro"
    },
    nav: {
        back: "Atrás",
        next: "Siguiente",
        continueExport: "Continuar a Exportar"
    }
};
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/src/components/StepUpload.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>StepUpload
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2d$dropzone$2f$dist$2f$es$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/node_modules/react-dropzone/dist/es/index.js [app-client] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$upload$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Upload$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/upload.js [app-client] (ecmascript) <export default as Upload>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$image$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__ImageIcon$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/image.js [app-client] (ecmascript) <export default as ImageIcon>");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$store$2f$wizard$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/store/wizard.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$i18n$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/i18n.ts [app-client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature();
"use client";
;
;
;
;
;
const MIN_WIDTH = 400;
const MIN_HEIGHT = 400;
function StepUpload() {
    _s();
    const setImage = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$store$2f$wizard$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useWizardStore"])({
        "StepUpload.useWizardStore[setImage]": (s)=>s.setImage
    }["StepUpload.useWizardStore[setImage]"]);
    const preview = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$store$2f$wizard$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useWizardStore"])({
        "StepUpload.useWizardStore[preview]": (s)=>s.originalImagePreview
    }["StepUpload.useWizardStore[preview]"]);
    const onDrop = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "StepUpload.useCallback[onDrop]": (accepted)=>{
            const file = accepted[0];
            if (!file) return;
            const img = new Image();
            const url = URL.createObjectURL(file);
            img.onload = ({
                "StepUpload.useCallback[onDrop]": ()=>{
                    if (img.width < MIN_WIDTH || img.height < MIN_HEIGHT) {
                        alert(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$i18n$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["t"].upload.minRes);
                        URL.revokeObjectURL(url);
                        return;
                    }
                    setImage(file, url);
                }
            })["StepUpload.useCallback[onDrop]"];
            img.src = url;
        }
    }["StepUpload.useCallback[onDrop]"], [
        setImage
    ]);
    const { getRootProps, getInputProps, isDragActive } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2d$dropzone$2f$dist$2f$es$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__["useDropzone"])({
        onDrop,
        accept: {
            "image/*": [
                ".jpg",
                ".jpeg",
                ".png",
                ".webp"
            ]
        },
        maxFiles: 1,
        maxSize: 20 * 1024 * 1024
    });
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "flex flex-col items-center gap-6",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h2", {
                className: "text-2xl font-bold",
                children: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$i18n$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["t"].upload.title
            }, void 0, false, {
                fileName: "[project]/src/components/StepUpload.tsx",
                lineNumber: 45,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                className: "text-gray-400 text-center max-w-md",
                children: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$i18n$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["t"].upload.subtitle
            }, void 0, false, {
                fileName: "[project]/src/components/StepUpload.tsx",
                lineNumber: 46,
                columnNumber: 7
            }, this),
            preview ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "relative w-full max-w-md aspect-square rounded-2xl overflow-hidden border border-gray-700",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("img", {
                        src: preview,
                        alt: "Plato subido",
                        className: "w-full h-full object-cover"
                    }, void 0, false, {
                        fileName: "[project]/src/components/StepUpload.tsx",
                        lineNumber: 50,
                        columnNumber: 11
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                        onClick: ()=>__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$store$2f$wizard$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useWizardStore"].getState().reset(),
                        className: "absolute top-3 right-3 bg-black/60 text-white px-3 py-1.5 rounded-lg text-sm cursor-pointer hover:bg-black/80 transition-colors duration-200",
                        "aria-label": __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$i18n$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["t"].upload.change,
                        children: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$i18n$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["t"].upload.change
                    }, void 0, false, {
                        fileName: "[project]/src/components/StepUpload.tsx",
                        lineNumber: 51,
                        columnNumber: 11
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/src/components/StepUpload.tsx",
                lineNumber: 49,
                columnNumber: 9
            }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                ...getRootProps(),
                className: `w-full max-w-md aspect-square rounded-2xl border-2 border-dashed flex flex-col items-center justify-center gap-4 cursor-pointer transition-colors duration-200 ${isDragActive ? "border-amber-500 bg-amber-500/10" : "border-gray-600 hover:border-gray-400"}`,
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                        ...getInputProps(),
                        "aria-label": __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$i18n$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["t"].upload.title
                    }, void 0, false, {
                        fileName: "[project]/src/components/StepUpload.tsx",
                        lineNumber: 68,
                        columnNumber: 11
                    }, this),
                    isDragActive ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$image$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__ImageIcon$3e$__["ImageIcon"], {
                        className: "w-16 h-16 text-amber-500"
                    }, void 0, false, {
                        fileName: "[project]/src/components/StepUpload.tsx",
                        lineNumber: 70,
                        columnNumber: 13
                    }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$upload$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Upload$3e$__["Upload"], {
                        className: "w-16 h-16 text-gray-500"
                    }, void 0, false, {
                        fileName: "[project]/src/components/StepUpload.tsx",
                        lineNumber: 72,
                        columnNumber: 13
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                        className: "text-gray-400 text-center px-8",
                        children: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$i18n$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["t"].upload.dropzone
                    }, void 0, false, {
                        fileName: "[project]/src/components/StepUpload.tsx",
                        lineNumber: 74,
                        columnNumber: 11
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                        className: "text-gray-600 text-sm",
                        children: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$i18n$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["t"].upload.formats
                    }, void 0, false, {
                        fileName: "[project]/src/components/StepUpload.tsx",
                        lineNumber: 75,
                        columnNumber: 11
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/src/components/StepUpload.tsx",
                lineNumber: 60,
                columnNumber: 9
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/src/components/StepUpload.tsx",
        lineNumber: 44,
        columnNumber: 5
    }, this);
}
_s(StepUpload, "7vsS+O3g6DBQ20CTFkwxq8Tz65I=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$store$2f$wizard$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useWizardStore"],
        __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$store$2f$wizard$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useWizardStore"],
        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2d$dropzone$2f$dist$2f$es$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__["useDropzone"]
    ];
});
_c = StepUpload;
var _c;
__turbopack_context__.k.register(_c, "StepUpload");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/src/lib/styles.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "NARRATIVE_OPTIONS",
    ()=>NARRATIVE_OPTIONS,
    "STYLE_OPTIONS",
    ()=>STYLE_OPTIONS
]);
const STYLE_OPTIONS = [
    {
        id: "dark_moody",
        name: "Dark Moody",
        description: "Dramatic shadows with warm highlights",
        gradient: "from-gray-900 via-amber-950 to-gray-900"
    },
    {
        id: "rustic_wood",
        name: "Rustic Wood",
        description: "Warm wooden table with natural light",
        gradient: "from-amber-800 via-yellow-700 to-amber-900"
    },
    {
        id: "marble_luxury",
        name: "Marble Luxury",
        description: "Clean white marble with elegant shadows",
        gradient: "from-gray-200 via-white to-gray-300"
    },
    {
        id: "golden_hour",
        name: "Golden Hour",
        description: "Warm sunset lighting with soft bokeh",
        gradient: "from-orange-400 via-amber-300 to-yellow-500"
    },
    {
        id: "bright_studio",
        name: "Bright Studio",
        description: "Professional studio with even lighting",
        gradient: "from-blue-100 via-white to-blue-50"
    },
    {
        id: "moody_candlelight",
        name: "Candlelight",
        description: "Intimate candlelit ambiance",
        gradient: "from-orange-900 via-red-950 to-gray-900"
    }
];
const NARRATIVE_OPTIONS = [
    {
        id: "none",
        name: "None",
        description: "Just the dish",
        icon: "Circle"
    },
    {
        id: "action_pour",
        name: "Action Pour",
        description: "Sauce mid-pour",
        icon: "Droplets"
    },
    {
        id: "chef_hand",
        name: "Chef's Hand",
        description: "Hand placing garnish",
        icon: "Hand"
    },
    {
        id: "waiter_pov",
        name: "Waiter POV",
        description: "Plate being served",
        icon: "UtensilsCrossed"
    }
];
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/src/components/StepStylePicker.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>StepStylePicker
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$store$2f$wizard$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/store/wizard.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$i18n$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/i18n.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$styles$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/styles.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$circle$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Circle$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/circle.js [app-client] (ecmascript) <export default as Circle>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$droplets$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Droplets$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/droplets.js [app-client] (ecmascript) <export default as Droplets>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$hand$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Hand$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/hand.js [app-client] (ecmascript) <export default as Hand>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$utensils$2d$crossed$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__UtensilsCrossed$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/utensils-crossed.js [app-client] (ecmascript) <export default as UtensilsCrossed>");
;
var _s = __turbopack_context__.k.signature();
"use client";
;
;
;
;
const iconMap = {
    Circle: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$circle$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Circle$3e$__["Circle"],
    Droplets: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$droplets$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Droplets$3e$__["Droplets"],
    Hand: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$hand$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Hand$3e$__["Hand"],
    UtensilsCrossed: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$utensils$2d$crossed$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__UtensilsCrossed$3e$__["UtensilsCrossed"]
};
const ASPECT_RATIOS = [
    "1:1",
    "3:4",
    "4:3",
    "4:5",
    "5:4",
    "9:16",
    "16:9"
];
function StepStylePicker() {
    _s();
    const selectedStyleId = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$store$2f$wizard$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useWizardStore"])({
        "StepStylePicker.useWizardStore[selectedStyleId]": (s)=>s.selectedStyleId
    }["StepStylePicker.useWizardStore[selectedStyleId]"]);
    const selectedNarrative = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$store$2f$wizard$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useWizardStore"])({
        "StepStylePicker.useWizardStore[selectedNarrative]": (s)=>s.selectedNarrative
    }["StepStylePicker.useWizardStore[selectedNarrative]"]);
    const selectedAspectRatio = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$store$2f$wizard$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useWizardStore"])({
        "StepStylePicker.useWizardStore[selectedAspectRatio]": (s)=>s.selectedAspectRatio
    }["StepStylePicker.useWizardStore[selectedAspectRatio]"]);
    const setStyle = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$store$2f$wizard$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useWizardStore"])({
        "StepStylePicker.useWizardStore[setStyle]": (s)=>s.setStyle
    }["StepStylePicker.useWizardStore[setStyle]"]);
    const setNarrative = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$store$2f$wizard$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useWizardStore"])({
        "StepStylePicker.useWizardStore[setNarrative]": (s)=>s.setNarrative
    }["StepStylePicker.useWizardStore[setNarrative]"]);
    const setAspectRatio = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$store$2f$wizard$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useWizardStore"])({
        "StepStylePicker.useWizardStore[setAspectRatio]": (s)=>s.setAspectRatio
    }["StepStylePicker.useWizardStore[setAspectRatio]"]);
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "flex flex-col gap-8",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h2", {
                        className: "text-2xl font-bold mb-2",
                        children: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$i18n$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["t"].style.title
                    }, void 0, false, {
                        fileName: "[project]/src/components/StepStylePicker.tsx",
                        lineNumber: 28,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                        className: "text-gray-400 mb-4",
                        children: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$i18n$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["t"].style.subtitle
                    }, void 0, false, {
                        fileName: "[project]/src/components/StepStylePicker.tsx",
                        lineNumber: 29,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "grid grid-cols-2 md:grid-cols-3 gap-4",
                        children: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$styles$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["STYLE_OPTIONS"].map((style)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                onClick: ()=>setStyle(style.id),
                                "aria-label": `Seleccionar estilo ${style.name}`,
                                className: `relative rounded-xl p-4 h-32 flex flex-col justify-end cursor-pointer transition-all duration-200 bg-gradient-to-br ${style.gradient} ${selectedStyleId === style.id ? "ring-2 ring-amber-500 ring-offset-2 ring-offset-gray-900" : "hover:ring-1 hover:ring-gray-500"}`,
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                        className: "font-semibold text-white drop-shadow-lg",
                                        children: style.name
                                    }, void 0, false, {
                                        fileName: "[project]/src/components/StepStylePicker.tsx",
                                        lineNumber: 42,
                                        columnNumber: 15
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                        className: "text-xs text-white/70 drop-shadow",
                                        children: style.description
                                    }, void 0, false, {
                                        fileName: "[project]/src/components/StepStylePicker.tsx",
                                        lineNumber: 43,
                                        columnNumber: 15
                                    }, this)
                                ]
                            }, style.id, true, {
                                fileName: "[project]/src/components/StepStylePicker.tsx",
                                lineNumber: 32,
                                columnNumber: 13
                            }, this))
                    }, void 0, false, {
                        fileName: "[project]/src/components/StepStylePicker.tsx",
                        lineNumber: 30,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/src/components/StepStylePicker.tsx",
                lineNumber: 27,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h2", {
                        className: "text-2xl font-bold mb-2",
                        children: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$i18n$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["t"].style.narrativeTitle
                    }, void 0, false, {
                        fileName: "[project]/src/components/StepStylePicker.tsx",
                        lineNumber: 50,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                        className: "text-gray-400 mb-4",
                        children: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$i18n$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["t"].style.narrativeSubtitle
                    }, void 0, false, {
                        fileName: "[project]/src/components/StepStylePicker.tsx",
                        lineNumber: 51,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "grid grid-cols-2 md:grid-cols-4 gap-4",
                        children: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$styles$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["NARRATIVE_OPTIONS"].map((n)=>{
                            const Icon = iconMap[n.icon] || __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$circle$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Circle$3e$__["Circle"];
                            return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                onClick: ()=>setNarrative(n.id),
                                "aria-label": `Seleccionar ${n.name}`,
                                className: `rounded-xl p-4 flex flex-col items-center gap-2 cursor-pointer transition-all duration-200 ${selectedNarrative === n.id ? "bg-amber-500/20 ring-2 ring-amber-500" : "bg-gray-800 hover:bg-gray-700"}`,
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(Icon, {
                                        className: "w-8 h-8"
                                    }, void 0, false, {
                                        fileName: "[project]/src/components/StepStylePicker.tsx",
                                        lineNumber: 66,
                                        columnNumber: 17
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                        className: "font-medium text-sm",
                                        children: n.name
                                    }, void 0, false, {
                                        fileName: "[project]/src/components/StepStylePicker.tsx",
                                        lineNumber: 67,
                                        columnNumber: 17
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                        className: "text-xs text-gray-400",
                                        children: n.description
                                    }, void 0, false, {
                                        fileName: "[project]/src/components/StepStylePicker.tsx",
                                        lineNumber: 68,
                                        columnNumber: 17
                                    }, this)
                                ]
                            }, n.id, true, {
                                fileName: "[project]/src/components/StepStylePicker.tsx",
                                lineNumber: 56,
                                columnNumber: 15
                            }, this);
                        })
                    }, void 0, false, {
                        fileName: "[project]/src/components/StepStylePicker.tsx",
                        lineNumber: 52,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/src/components/StepStylePicker.tsx",
                lineNumber: 49,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h2", {
                        className: "text-2xl font-bold mb-2",
                        children: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$i18n$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["t"].style.formatTitle
                    }, void 0, false, {
                        fileName: "[project]/src/components/StepStylePicker.tsx",
                        lineNumber: 76,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                        className: "text-gray-400 mb-4",
                        children: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$i18n$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["t"].style.formatSubtitle
                    }, void 0, false, {
                        fileName: "[project]/src/components/StepStylePicker.tsx",
                        lineNumber: 77,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "flex flex-wrap gap-2",
                        children: ASPECT_RATIOS.map((ratio)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                onClick: ()=>setAspectRatio(ratio),
                                "aria-label": `Proporción ${ratio}`,
                                className: `px-4 py-2.5 rounded-lg text-sm font-medium cursor-pointer transition-all duration-200 ${selectedAspectRatio === ratio ? "bg-amber-600 text-white" : "bg-gray-800 text-gray-400 hover:bg-gray-700"}`,
                                children: ratio
                            }, ratio, false, {
                                fileName: "[project]/src/components/StepStylePicker.tsx",
                                lineNumber: 80,
                                columnNumber: 13
                            }, this))
                    }, void 0, false, {
                        fileName: "[project]/src/components/StepStylePicker.tsx",
                        lineNumber: 78,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/src/components/StepStylePicker.tsx",
                lineNumber: 75,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/src/components/StepStylePicker.tsx",
        lineNumber: 26,
        columnNumber: 5
    }, this);
}
_s(StepStylePicker, "C7W+8hjvhT/nzJ5N+bvZePFgVYA=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$store$2f$wizard$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useWizardStore"],
        __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$store$2f$wizard$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useWizardStore"],
        __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$store$2f$wizard$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useWizardStore"],
        __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$store$2f$wizard$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useWizardStore"],
        __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$store$2f$wizard$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useWizardStore"],
        __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$store$2f$wizard$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useWizardStore"]
    ];
});
_c = StepStylePicker;
var _c;
__turbopack_context__.k.register(_c, "StepStylePicker");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/src/lib/api.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "generateImage",
    ()=>generateImage,
    "pollJob",
    ()=>pollJob,
    "setAuthToken",
    ()=>setAuthToken,
    "setUseMock",
    ()=>setUseMock
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$build$2f$polyfills$2f$process$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = /*#__PURE__*/ __turbopack_context__.i("[project]/node_modules/next/dist/build/polyfills/process.js [app-client] (ecmascript)");
const API_BASE = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$build$2f$polyfills$2f$process$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].env.NEXT_PUBLIC_API_URL || "http://localhost:8000";
let authToken = null;
function setAuthToken(token) {
    authToken = token;
}
let useMock = false;
function setUseMock(mock) {
    useMock = mock;
}
const mockPollCounters = new Map();
async function mockGenerate() {
    await new Promise((r)=>setTimeout(r, 500));
    const jobId = `job_${Date.now()}`;
    mockPollCounters.set(jobId, 0);
    return {
        job_id: jobId,
        status: "processing",
        estimated_time_sec: 12,
        poll_url: `/api/v1/jobs/${jobId}`
    };
}
async function mockPollJob(jobId) {
    await new Promise((r)=>setTimeout(r, 1000));
    const count = (mockPollCounters.get(jobId) ?? 0) + 1;
    mockPollCounters.set(jobId, count);
    if (count < 3) {
        return {
            status: "processing"
        };
    }
    mockPollCounters.delete(jobId);
    return {
        status: "completed",
        result: {
            generated_image_url: "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=800&q=80",
            generated_copy: "Saborea la noche... Nuestro chef acaba de terminar esta obra maestra. ¡Etiqueta a alguien con quien la compartirías!",
            hashtags: [
                "#AltaCocina",
                "#Foodie",
                "#CenaPerfecta",
                "#VidaDeChef",
                "#FotografíaGastronómica"
            ]
        }
    };
}
function authHeaders() {
    const headers = {
        "Content-Type": "application/json"
    };
    if (authToken) {
        headers["Authorization"] = `Bearer ${authToken}`;
    }
    return headers;
}
async function generateImage(req) {
    if (useMock) return mockGenerate();
    const res = await fetch(`${API_BASE}/api/v1/generate`, {
        method: "POST",
        headers: authHeaders(),
        body: JSON.stringify(req)
    });
    if (!res.ok) throw new Error(`Error en generación: ${res.status}`);
    return res.json();
}
async function pollJob(jobId) {
    if (useMock) return mockPollJob(jobId);
    const res = await fetch(`${API_BASE}/api/v1/jobs/${jobId}`, {
        headers: authHeaders()
    });
    if (!res.ok) throw new Error(`Error en consulta: ${res.status}`);
    return res.json();
}
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/src/components/StepLoading.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>StepLoading
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$store$2f$wizard$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/store/wizard.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$i18n$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/i18n.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$api$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/api.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$loader$2d$circle$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Loader2$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/loader-circle.js [app-client] (ecmascript) <export default as Loader2>");
;
var _s = __turbopack_context__.k.signature();
"use client";
;
;
;
;
;
function fileToDataUri(file) {
    return new Promise((resolve, reject)=>{
        const reader = new FileReader();
        reader.onload = ()=>resolve(reader.result);
        reader.onerror = reject;
        reader.readAsDataURL(file);
    });
}
function StepLoading() {
    _s();
    const store = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$store$2f$wizard$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useWizardStore"])();
    const cancelledRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRef"])(false);
    const messageIndex = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRef"])(0);
    const messageRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRef"])(null);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "StepLoading.useEffect": ()=>{
            cancelledRef.current = false;
            const messages = __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$i18n$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["t"].loading.messages;
            const msgInterval = setInterval({
                "StepLoading.useEffect.msgInterval": ()=>{
                    messageIndex.current = (messageIndex.current + 1) % messages.length;
                    if (messageRef.current) {
                        messageRef.current.textContent = messages[messageIndex.current];
                    }
                }
            }["StepLoading.useEffect.msgInterval"], 3000);
            const state = __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$store$2f$wizard$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useWizardStore"].getState();
            state.setGenerating(true);
            state.setError(null);
            let pollTimeout;
            ({
                "StepLoading.useEffect": async ()=>{
                    try {
                        let imageUrl = state.originalImagePreview || "";
                        if (state.originalImageFile) {
                            imageUrl = await fileToDataUri(state.originalImageFile);
                        }
                        const genRes = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$api$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["generateImage"])({
                            image_url: imageUrl,
                            style_id: state.selectedStyleId,
                            narrative: state.selectedNarrative,
                            aspect_ratio: state.selectedAspectRatio
                        });
                        if (cancelledRef.current) return;
                        __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$store$2f$wizard$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useWizardStore"].getState().setJobId(genRes.job_id);
                        const poll = {
                            "StepLoading.useEffect.poll": async ()=>{
                                if (cancelledRef.current) return;
                                const result = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$api$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["pollJob"])(genRes.job_id);
                                if (cancelledRef.current) return;
                                if (result.status === "completed" && result.result) {
                                    __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$store$2f$wizard$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useWizardStore"].getState().setGenerationResult(result.result.generated_image_url, result.result.generated_copy, result.result.hashtags);
                                } else if (result.status === "failed") {
                                    __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$store$2f$wizard$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useWizardStore"].getState().setError(result.error || "Error en la generación");
                                } else {
                                    pollTimeout = setTimeout(poll, 2000);
                                }
                            }
                        }["StepLoading.useEffect.poll"];
                        await poll();
                    } catch (e) {
                        if (!cancelledRef.current) {
                            __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$store$2f$wizard$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useWizardStore"].getState().setError(e instanceof Error ? e.message : "Error desconocido");
                        }
                    }
                }
            })["StepLoading.useEffect"]();
            return ({
                "StepLoading.useEffect": ()=>{
                    cancelledRef.current = true;
                    clearInterval(msgInterval);
                    clearTimeout(pollTimeout);
                }
            })["StepLoading.useEffect"];
        }
    }["StepLoading.useEffect"], []);
    if (store.error) {
        return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: "flex flex-col items-center gap-6 py-16",
            children: [
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "text-red-400 text-lg",
                    children: store.error
                }, void 0, false, {
                    fileName: "[project]/src/components/StepLoading.tsx",
                    lineNumber: 93,
                    columnNumber: 9
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                    onClick: ()=>{
                        store.setError(null);
                        store.setStep(1);
                    },
                    className: "px-6 py-3 bg-amber-600 text-white rounded-xl cursor-pointer hover:bg-amber-500 transition-colors duration-200",
                    children: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$i18n$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["t"].loading.tryAgain
                }, void 0, false, {
                    fileName: "[project]/src/components/StepLoading.tsx",
                    lineNumber: 94,
                    columnNumber: 9
                }, this)
            ]
        }, void 0, true, {
            fileName: "[project]/src/components/StepLoading.tsx",
            lineNumber: 92,
            columnNumber: 7
        }, this);
    }
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "flex flex-col items-center gap-8 py-16",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$loader$2d$circle$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Loader2$3e$__["Loader2"], {
                className: "w-16 h-16 text-amber-500 animate-spin"
            }, void 0, false, {
                fileName: "[project]/src/components/StepLoading.tsx",
                lineNumber: 109,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                ref: messageRef,
                className: "text-xl text-gray-300",
                children: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$i18n$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["t"].loading.messages[0]
            }, void 0, false, {
                fileName: "[project]/src/components/StepLoading.tsx",
                lineNumber: 110,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "w-64 h-1.5 bg-gray-800 rounded-full overflow-hidden",
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "h-full bg-amber-500 rounded-full",
                    style: {
                        animation: "pulse-slow 2s ease-in-out infinite",
                        width: "60%"
                    }
                }, void 0, false, {
                    fileName: "[project]/src/components/StepLoading.tsx",
                    lineNumber: 114,
                    columnNumber: 9
                }, this)
            }, void 0, false, {
                fileName: "[project]/src/components/StepLoading.tsx",
                lineNumber: 113,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                className: "text-gray-500 text-sm",
                children: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$i18n$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["t"].loading.estimate
            }, void 0, false, {
                fileName: "[project]/src/components/StepLoading.tsx",
                lineNumber: 119,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/src/components/StepLoading.tsx",
        lineNumber: 108,
        columnNumber: 5
    }, this);
}
_s(StepLoading, "+PH2jquGN466RIKWWI6qhyBJHEg=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$store$2f$wizard$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useWizardStore"]
    ];
});
_c = StepLoading;
var _c;
__turbopack_context__.k.register(_c, "StepLoading");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/src/components/StepCanvas.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>StepCanvas
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$store$2f$wizard$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/store/wizard.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$i18n$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/i18n.ts [app-client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature();
"use client";
;
;
;
const ASPECT_SIZES = {
    "1:1": {
        w: 800,
        h: 800
    },
    "3:4": {
        w: 800,
        h: 1067
    },
    "4:3": {
        w: 800,
        h: 600
    },
    "4:5": {
        w: 800,
        h: 1000
    },
    "5:4": {
        w: 800,
        h: 640
    },
    "9:16": {
        w: 720,
        h: 1280
    },
    "16:9": {
        w: 1280,
        h: 720
    }
};
const TEXT_TEMPLATES = [
    {
        label: "Menú del Día",
        text: "MENÚ DEL DÍA",
        fontSize: 42,
        color: "#ffffff"
    },
    {
        label: "Especial Fin de Semana",
        text: "ESPECIAL FIN DE SEMANA",
        fontSize: 38,
        color: "#f59e0b"
    },
    {
        label: "Selección del Chef",
        text: "SELECCIÓN DEL CHEF",
        fontSize: 44,
        color: "#ef4444"
    },
    {
        label: "Tiempo Limitado",
        text: "TIEMPO LIMITADO",
        fontSize: 36,
        color: "#10b981"
    }
];
function StepCanvas() {
    _s();
    const store = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$store$2f$wizard$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useWizardStore"])();
    const canvasRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRef"])(null);
    const [activeTemplate, setActiveTemplate] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(null);
    const [overlayText, setOverlayText] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(null);
    const [textColor, setTextColor] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])("#ffffff");
    const aspectRatio = store.selectedAspectRatio;
    const size = ASPECT_SIZES[aspectRatio];
    const maxDisplayHeight = 500;
    const scale = Math.min(1, maxDisplayHeight / size.h, 400 / size.w);
    const displayW = size.w * scale;
    const displayH = size.h * scale;
    const selectTemplate = (idx)=>{
        const tpl = TEXT_TEMPLATES[idx];
        setOverlayText(tpl.text);
        setTextColor(tpl.color);
        setActiveTemplate(idx);
    };
    const clearOverlay = ()=>{
        setOverlayText(null);
        setActiveTemplate(null);
    };
    const exportCanvas = async ()=>{
        if (!store.generatedImageUrl) return;
        const canvas = document.createElement("canvas");
        canvas.width = size.w;
        canvas.height = size.h;
        const ctx = canvas.getContext("2d");
        if (!ctx) return;
        const img = new Image();
        img.crossOrigin = "anonymous";
        await new Promise((resolve, reject)=>{
            img.onload = ()=>resolve();
            img.onerror = reject;
            img.src = store.generatedImageUrl;
        });
        const imgScale = Math.max(size.w / img.naturalWidth, size.h / img.naturalHeight);
        const imgW = img.naturalWidth * imgScale;
        const imgH = img.naturalHeight * imgScale;
        const imgX = (size.w - imgW) / 2;
        const imgY = (size.h - imgH) / 2;
        ctx.drawImage(img, imgX, imgY, imgW, imgH);
        if (overlayText && activeTemplate !== null) {
            const tpl = TEXT_TEMPLATES[activeTemplate];
            ctx.font = `bold ${tpl.fontSize}px Arial`;
            ctx.fillStyle = tpl.color;
            ctx.textAlign = "center";
            ctx.textBaseline = "middle";
            ctx.shadowColor = "rgba(0,0,0,0.7)";
            ctx.shadowBlur = 8;
            ctx.shadowOffsetX = 2;
            ctx.shadowOffsetY = 2;
            ctx.fillText(overlayText, size.w / 2, size.h * 0.85);
        }
        const dataUrl = canvas.toDataURL("image/png", 1);
        const a = document.createElement("a");
        a.href = dataUrl;
        a.download = `foodsocial_${Date.now()}.png`;
        a.click();
    };
    const changeAspect = (ratio)=>{
        store.setAspectRatio(ratio);
    };
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "flex flex-col lg:flex-row gap-6",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "flex-1 flex justify-center items-start",
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "relative border border-gray-700 rounded-xl overflow-hidden bg-gray-900",
                    style: {
                        width: displayW,
                        height: displayH
                    },
                    children: [
                        store.generatedImageUrl && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("img", {
                            src: store.generatedImageUrl,
                            alt: "Imagen generada",
                            className: "absolute inset-0 w-full h-full object-cover"
                        }, void 0, false, {
                            fileName: "[project]/src/components/StepCanvas.tsx",
                            lineNumber: 111,
                            columnNumber: 13
                        }, this),
                        overlayText && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "absolute left-0 right-0 text-center font-bold",
                            style: {
                                bottom: "15%",
                                fontSize: `${(activeTemplate !== null ? TEXT_TEMPLATES[activeTemplate].fontSize : 42) * scale}px`,
                                color: textColor,
                                textShadow: "2px 2px 8px rgba(0,0,0,0.7)"
                            },
                            children: overlayText
                        }, void 0, false, {
                            fileName: "[project]/src/components/StepCanvas.tsx",
                            lineNumber: 118,
                            columnNumber: 13
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/src/components/StepCanvas.tsx",
                    lineNumber: 106,
                    columnNumber: 9
                }, this)
            }, void 0, false, {
                fileName: "[project]/src/components/StepCanvas.tsx",
                lineNumber: 105,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "w-full lg:w-72 flex flex-col gap-6",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                                className: "text-sm font-semibold text-gray-400 mb-2 uppercase tracking-wider",
                                children: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$i18n$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["t"].canvas.aspectRatio
                            }, void 0, false, {
                                fileName: "[project]/src/components/StepCanvas.tsx",
                                lineNumber: 135,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "flex flex-wrap gap-2",
                                children: Object.keys(ASPECT_SIZES).map((ratio)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                        onClick: ()=>changeAspect(ratio),
                                        "aria-label": `Proporción ${ratio}`,
                                        className: `px-3 py-2 rounded-lg text-sm cursor-pointer transition-colors duration-200 ${aspectRatio === ratio ? "bg-amber-600 text-white" : "bg-gray-800 text-gray-400 hover:bg-gray-700"}`,
                                        children: ratio
                                    }, ratio, false, {
                                        fileName: "[project]/src/components/StepCanvas.tsx",
                                        lineNumber: 140,
                                        columnNumber: 15
                                    }, this))
                            }, void 0, false, {
                                fileName: "[project]/src/components/StepCanvas.tsx",
                                lineNumber: 138,
                                columnNumber: 11
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/components/StepCanvas.tsx",
                        lineNumber: 134,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                                className: "text-sm font-semibold text-gray-400 mb-2 uppercase tracking-wider",
                                children: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$i18n$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["t"].canvas.textOverlay
                            }, void 0, false, {
                                fileName: "[project]/src/components/StepCanvas.tsx",
                                lineNumber: 157,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "flex flex-col gap-2",
                                children: TEXT_TEMPLATES.map((tpl, i)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                        onClick: ()=>activeTemplate === i ? clearOverlay() : selectTemplate(i),
                                        "aria-label": tpl.label,
                                        className: `px-3 py-2 rounded-lg text-sm text-left cursor-pointer transition-colors duration-200 ${activeTemplate === i ? "bg-amber-600/20 ring-1 ring-amber-500 text-amber-400" : "bg-gray-800 text-gray-300 hover:bg-gray-700"}`,
                                        children: tpl.label
                                    }, tpl.label, false, {
                                        fileName: "[project]/src/components/StepCanvas.tsx",
                                        lineNumber: 162,
                                        columnNumber: 15
                                    }, this))
                            }, void 0, false, {
                                fileName: "[project]/src/components/StepCanvas.tsx",
                                lineNumber: 160,
                                columnNumber: 11
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/components/StepCanvas.tsx",
                        lineNumber: 156,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                        onClick: exportCanvas,
                        className: "mt-auto px-4 py-3 bg-amber-600 text-white rounded-xl font-semibold cursor-pointer hover:bg-amber-500 transition-colors duration-200",
                        children: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$i18n$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["t"].canvas.download
                    }, void 0, false, {
                        fileName: "[project]/src/components/StepCanvas.tsx",
                        lineNumber: 178,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/src/components/StepCanvas.tsx",
                lineNumber: 133,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/src/components/StepCanvas.tsx",
        lineNumber: 104,
        columnNumber: 5
    }, this);
}
_s(StepCanvas, "qME/AinAMC7pGTHMxsXf7OO941U=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$store$2f$wizard$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useWizardStore"]
    ];
});
_c = StepCanvas;
var _c;
__turbopack_context__.k.register(_c, "StepCanvas");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/src/components/StepExport.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>StepExport
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$store$2f$wizard$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/store/wizard.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$i18n$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/i18n.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$copy$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Copy$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/copy.js [app-client] (ecmascript) <export default as Copy>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$check$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Check$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/check.js [app-client] (ecmascript) <export default as Check>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$share$2d$2$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Share2$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/share-2.js [app-client] (ecmascript) <export default as Share2>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$download$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Download$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/download.js [app-client] (ecmascript) <export default as Download>");
;
var _s = __turbopack_context__.k.signature();
"use client";
;
;
;
;
function StepExport() {
    _s();
    const store = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$store$2f$wizard$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useWizardStore"])();
    const [copied, setCopied] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const [sharing, setSharing] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const fullText = [
        store.generatedCopy || "",
        store.generatedHashtags.join(" ")
    ].join("\n\n");
    const copyToClipboard = async ()=>{
        await navigator.clipboard.writeText(fullText);
        setCopied(true);
        setTimeout(()=>setCopied(false), 2000);
    };
    const share = async ()=>{
        if (!navigator.share) return;
        setSharing(true);
        try {
            if (store.generatedImageUrl && navigator.canShare) {
                const response = await fetch(store.generatedImageUrl);
                const blob = await response.blob();
                const file = new File([
                    blob
                ], "foodsocial.png", {
                    type: "image/png"
                });
                const shareData = {
                    title: "FoodSocial AI",
                    text: fullText,
                    files: [
                        file
                    ]
                };
                if (navigator.canShare(shareData)) {
                    await navigator.share(shareData);
                    setSharing(false);
                    return;
                }
            }
            await navigator.share({
                title: "FoodSocial AI",
                text: fullText
            });
        } catch (err) {
            if (err.name !== "AbortError") {
                await navigator.clipboard.writeText(fullText);
                setCopied(true);
                setTimeout(()=>setCopied(false), 2000);
            }
        }
        setSharing(false);
    };
    const downloadImage = ()=>{
        if (!store.generatedImageUrl) return;
        const a = document.createElement("a");
        a.href = store.generatedImageUrl;
        a.download = `foodsocial_${Date.now()}.png`;
        a.click();
    };
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "flex flex-col items-center gap-8 max-w-lg mx-auto",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h2", {
                className: "text-2xl font-bold",
                children: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$i18n$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["t"].export.title
            }, void 0, false, {
                fileName: "[project]/src/components/StepExport.tsx",
                lineNumber: 68,
                columnNumber: 7
            }, this),
            store.generatedImageUrl && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "w-full aspect-square rounded-2xl overflow-hidden border border-gray-700",
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("img", {
                    src: store.generatedImageUrl,
                    alt: "Imagen generada",
                    className: "w-full h-full object-cover"
                }, void 0, false, {
                    fileName: "[project]/src/components/StepExport.tsx",
                    lineNumber: 72,
                    columnNumber: 11
                }, this)
            }, void 0, false, {
                fileName: "[project]/src/components/StepExport.tsx",
                lineNumber: 71,
                columnNumber: 9
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "w-full",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                        className: "text-sm font-semibold text-gray-400 uppercase tracking-wider",
                        children: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$i18n$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["t"].export.caption
                    }, void 0, false, {
                        fileName: "[project]/src/components/StepExport.tsx",
                        lineNumber: 81,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("textarea", {
                        value: fullText,
                        readOnly: true,
                        rows: 5,
                        className: "w-full mt-2 p-4 bg-gray-800 border border-gray-700 rounded-xl text-gray-200 resize-none focus:outline-none focus:ring-1 focus:ring-amber-500"
                    }, void 0, false, {
                        fileName: "[project]/src/components/StepExport.tsx",
                        lineNumber: 84,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/src/components/StepExport.tsx",
                lineNumber: 80,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "flex gap-3 w-full",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                        onClick: copyToClipboard,
                        className: "flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-gray-800 text-white rounded-xl cursor-pointer hover:bg-gray-700 transition-colors duration-200",
                        "aria-label": __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$i18n$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["t"].export.copyText,
                        children: [
                            copied ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$check$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Check$3e$__["Check"], {
                                className: "w-5 h-5 text-green-400"
                            }, void 0, false, {
                                fileName: "[project]/src/components/StepExport.tsx",
                                lineNumber: 98,
                                columnNumber: 21
                            }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$copy$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Copy$3e$__["Copy"], {
                                className: "w-5 h-5"
                            }, void 0, false, {
                                fileName: "[project]/src/components/StepExport.tsx",
                                lineNumber: 98,
                                columnNumber: 68
                            }, this),
                            copied ? __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$i18n$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["t"].export.copied : __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$i18n$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["t"].export.copyText
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/components/StepExport.tsx",
                        lineNumber: 93,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                        onClick: downloadImage,
                        className: "flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-gray-800 text-white rounded-xl cursor-pointer hover:bg-gray-700 transition-colors duration-200",
                        "aria-label": __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$i18n$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["t"].export.downloadBtn,
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$download$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Download$3e$__["Download"], {
                                className: "w-5 h-5"
                            }, void 0, false, {
                                fileName: "[project]/src/components/StepExport.tsx",
                                lineNumber: 106,
                                columnNumber: 11
                            }, this),
                            __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$i18n$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["t"].export.downloadBtn
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/components/StepExport.tsx",
                        lineNumber: 101,
                        columnNumber: 9
                    }, this),
                    "share" in navigator && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                        onClick: share,
                        disabled: sharing,
                        className: "flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-amber-600 text-white rounded-xl cursor-pointer hover:bg-amber-500 transition-colors duration-200 disabled:opacity-50",
                        "aria-label": __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$i18n$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["t"].export.share,
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$share$2d$2$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Share2$3e$__["Share2"], {
                                className: "w-5 h-5"
                            }, void 0, false, {
                                fileName: "[project]/src/components/StepExport.tsx",
                                lineNumber: 116,
                                columnNumber: 13
                            }, this),
                            sharing ? "..." : __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$i18n$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["t"].export.share
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/components/StepExport.tsx",
                        lineNumber: 110,
                        columnNumber: 11
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/src/components/StepExport.tsx",
                lineNumber: 92,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                onClick: ()=>store.reset(),
                className: "text-gray-500 hover:text-gray-300 text-sm cursor-pointer transition-colors duration-200",
                children: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$i18n$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["t"].export.createAnother
            }, void 0, false, {
                fileName: "[project]/src/components/StepExport.tsx",
                lineNumber: 122,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/src/components/StepExport.tsx",
        lineNumber: 67,
        columnNumber: 5
    }, this);
}
_s(StepExport, "1M7ypmP0kZOYxcixI0qAF244Dx4=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$store$2f$wizard$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useWizardStore"]
    ];
});
_c = StepExport;
var _c;
__turbopack_context__.k.register(_c, "StepExport");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/src/app/page.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>WizardPage
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$store$2f$wizard$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/store/wizard.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$i18n$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/i18n.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$StepUpload$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/components/StepUpload.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$StepStylePicker$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/components/StepStylePicker.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$StepLoading$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/components/StepLoading.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$StepCanvas$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/components/StepCanvas.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$StepExport$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/components/StepExport.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$chef$2d$hat$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__ChefHat$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/chef-hat.js [app-client] (ecmascript) <export default as ChefHat>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$arrow$2d$left$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__ArrowLeft$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/arrow-left.js [app-client] (ecmascript) <export default as ArrowLeft>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$arrow$2d$right$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__ArrowRight$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/arrow-right.js [app-client] (ecmascript) <export default as ArrowRight>");
;
var _s = __turbopack_context__.k.signature();
"use client";
;
;
;
;
;
;
;
;
function WizardPage() {
    _s();
    const store = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$store$2f$wizard$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useWizardStore"])();
    const step = store.currentStep;
    const canGoNext = ()=>{
        if (step === 0) return !!store.originalImagePreview;
        if (step === 1) return !!store.selectedStyleId;
        return false;
    };
    const goNext = ()=>{
        if (step === 0 && store.originalImagePreview) store.setStep(1);
        else if (step === 1 && store.selectedStyleId) store.setStep(2);
        else if (step === 3) store.setStep(4);
    };
    const goBack = ()=>{
        if (step === 1) store.setStep(0);
        else if (step === 3) store.setStep(1);
        else if (step === 4) store.setStep(3);
    };
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "min-h-screen flex flex-col",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("header", {
                className: "flex items-center gap-3 px-6 py-4 border-b border-gray-800",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$chef$2d$hat$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__ChefHat$3e$__["ChefHat"], {
                        className: "w-8 h-8 text-amber-500"
                    }, void 0, false, {
                        fileName: "[project]/src/app/page.tsx",
                        lineNumber: 37,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h1", {
                        className: "text-xl font-bold",
                        children: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$i18n$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["t"].appName
                    }, void 0, false, {
                        fileName: "[project]/src/app/page.tsx",
                        lineNumber: 38,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/src/app/page.tsx",
                lineNumber: 36,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "flex items-center gap-2 px-6 py-3 border-b border-gray-800/50 overflow-x-auto",
                children: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$i18n$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["t"].steps.map((label, i)=>{
                    const canNavigate = i < step && step !== 2 && i !== 2;
                    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        onClick: ()=>canNavigate && store.setStep(i),
                        className: `flex items-center gap-2 text-sm whitespace-nowrap ${canNavigate ? "cursor-pointer hover:text-amber-400" : ""} ${i === step ? "text-amber-500 font-semibold" : i < step ? "text-gray-400" : "text-gray-600"}`,
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                className: `w-6 h-6 rounded-full flex items-center justify-center text-xs transition-colors duration-200 ${i === step ? "bg-amber-500 text-black" : i < step ? canNavigate ? "bg-gray-600 text-white hover:bg-amber-600" : "bg-gray-600 text-white" : "bg-gray-800 text-gray-500"}`,
                                children: i + 1
                            }, void 0, false, {
                                fileName: "[project]/src/app/page.tsx",
                                lineNumber: 58,
                                columnNumber: 15
                            }, this),
                            label,
                            i < __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$i18n$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["t"].steps.length - 1 && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                className: "text-gray-700 mx-1",
                                children: "-"
                            }, void 0, false, {
                                fileName: "[project]/src/app/page.tsx",
                                lineNumber: 72,
                                columnNumber: 42
                            }, this)
                        ]
                    }, i, true, {
                        fileName: "[project]/src/app/page.tsx",
                        lineNumber: 45,
                        columnNumber: 13
                    }, this);
                })
            }, void 0, false, {
                fileName: "[project]/src/app/page.tsx",
                lineNumber: 41,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("main", {
                className: "flex-1 px-6 py-8 max-w-4xl mx-auto w-full",
                children: [
                    step === 0 && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$StepUpload$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {}, void 0, false, {
                        fileName: "[project]/src/app/page.tsx",
                        lineNumber: 79,
                        columnNumber: 24
                    }, this),
                    step === 1 && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$StepStylePicker$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {}, void 0, false, {
                        fileName: "[project]/src/app/page.tsx",
                        lineNumber: 80,
                        columnNumber: 24
                    }, this),
                    step === 2 && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$StepLoading$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {}, void 0, false, {
                        fileName: "[project]/src/app/page.tsx",
                        lineNumber: 81,
                        columnNumber: 24
                    }, this),
                    step === 3 && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$StepCanvas$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {}, void 0, false, {
                        fileName: "[project]/src/app/page.tsx",
                        lineNumber: 82,
                        columnNumber: 24
                    }, this),
                    step === 4 && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$StepExport$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {}, void 0, false, {
                        fileName: "[project]/src/app/page.tsx",
                        lineNumber: 83,
                        columnNumber: 24
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/src/app/page.tsx",
                lineNumber: 78,
                columnNumber: 7
            }, this),
            step !== 2 && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("footer", {
                className: "px-6 py-4 border-t border-gray-800 flex justify-between",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                        onClick: goBack,
                        disabled: step === 0,
                        className: "flex items-center gap-2 px-4 py-2 rounded-lg text-gray-400 hover:text-white disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer transition-colors duration-200",
                        "aria-label": __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$i18n$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["t"].nav.back,
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$arrow$2d$left$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__ArrowLeft$3e$__["ArrowLeft"], {
                                className: "w-4 h-4"
                            }, void 0, false, {
                                fileName: "[project]/src/app/page.tsx",
                                lineNumber: 94,
                                columnNumber: 13
                            }, this),
                            __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$i18n$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["t"].nav.back
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/app/page.tsx",
                        lineNumber: 88,
                        columnNumber: 11
                    }, this),
                    step < 2 && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                        onClick: goNext,
                        disabled: !canGoNext(),
                        className: "flex items-center gap-2 px-6 py-2 bg-amber-600 text-white rounded-lg hover:bg-amber-500 disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer transition-colors duration-200",
                        "aria-label": __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$i18n$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["t"].nav.next,
                        children: [
                            __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$i18n$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["t"].nav.next,
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$arrow$2d$right$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__ArrowRight$3e$__["ArrowRight"], {
                                className: "w-4 h-4"
                            }, void 0, false, {
                                fileName: "[project]/src/app/page.tsx",
                                lineNumber: 105,
                                columnNumber: 15
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/app/page.tsx",
                        lineNumber: 98,
                        columnNumber: 13
                    }, this),
                    step === 3 && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                        onClick: goNext,
                        className: "flex items-center gap-2 px-6 py-2 bg-amber-600 text-white rounded-lg hover:bg-amber-500 cursor-pointer transition-colors duration-200",
                        "aria-label": __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$i18n$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["t"].nav.continueExport,
                        children: [
                            __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$i18n$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["t"].nav.continueExport,
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$arrow$2d$right$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__ArrowRight$3e$__["ArrowRight"], {
                                className: "w-4 h-4"
                            }, void 0, false, {
                                fileName: "[project]/src/app/page.tsx",
                                lineNumber: 115,
                                columnNumber: 15
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/app/page.tsx",
                        lineNumber: 109,
                        columnNumber: 13
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/src/app/page.tsx",
                lineNumber: 87,
                columnNumber: 9
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/src/app/page.tsx",
        lineNumber: 35,
        columnNumber: 5
    }, this);
}
_s(WizardPage, "3mrFzgEqHpG4+LT1j4zxXF3xDFg=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$store$2f$wizard$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useWizardStore"]
    ];
});
_c = WizardPage;
var _c;
__turbopack_context__.k.register(_c, "WizardPage");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
]);

//# sourceMappingURL=src_205e9562._.js.map