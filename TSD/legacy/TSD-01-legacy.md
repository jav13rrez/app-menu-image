# TSD-01: Frontend & UI/UX Implementation
**Project:** FoodSocial AI
**Module:** Client Application (Web/PWA)
**Dependency:** None (Can be developed in parallel with TSD-02 via Mock APIs).

## 1. Tech Stack & Standards
Based on the `react-typescript-standards` and `ui-ux-pro-max` guidelines:
*   **Framework:** Next.js (App Router) or Vite + React (TypeScript Strict Mode).
*   **State Management:** Zustand (for Wizard complex state across steps) and TanStack React Query (for API polling, caching, and server state). *No Server State in `useEffect`*.
*   **Styling:** Tailwind CSS.
*   **Canvas Manipulation:** Fabric.js or Konva.js (for rendering the generated image + text templates + logos).
*   **Components:** Functional components only, strict hook discipline.

## 2. Core Modules & Scope

### 2.1 The Magic Wizard (Core Flow)
This is a heavily stateful set of components.
*   **Step 1 Provider (Upload):** Implement `react-dropzone` with standard `accept="image/*"`. Validate minimum resolution client-side before uploading.
*   **Step 2 Provider (Style Picker):** UI Grid containing cards for styles (Wooden table, Marble, Dark Moody). Each card passes an ID to the global `Zustand` store.
*   **Step 3 Loading Engine:** The `ui-ux-pro-max` rules dictate high-quality feedback. Implement Lottie animations (e.g., a chef cooking) while the generation API is polled via React Query. Disable all navigation during this state.
*   **Step 4 The Canvas (Design Layer):**
    *   Initialize Fabric.js canvas.
    *   Layer 0: The Vertex AI generated image.
    *   Layer 1: Typography templates overlay (selectable via a sidebar).
    *   Layer 2: User's watermark/logo (fetched from user settings context).
    *   Must handle Aspect Ratio dynamic resizing (1:1 $\leftrightarrow$ 9:16).
*   **Step 5 Export/Publish:**
    *   Use `canvas.toDataURL()` to generate the final graphic blob.
    *   Display the AI-generated copy in a `<textarea>` with a "Copy to Clipboard" button.
    *   Implement HTML5 Web Share API `navigator.share()` for mobile publishing.

### 2.2 UI/UX Implementations
*   **Accessibility (a11y):** All UI elements must have `aria-labels`. Use semantic `<button>` tags for stylistic selections. Maintain 4.5:1 text contrast.
*   **Interactions:** Add `cursor-pointer` to all interactive cards. Use `transition-colors duration-200` on hovers. Avoid layout shifts upon hover (e.g., do not use `transform: scale` if it pushes other elements; use borders/shadows instead).
*   **Modals & Drawers:** Use accessible headless UI components (e.g., Radix UI or Headless UI) for settings and asset library previews.

## 3. Mock Data Contract for Parallel Development
Until the Backend team (working on TSD-02) delivers the actual API, the Frontend team MUST use a Mock Service Worker (MSW) or a simple mock API utility returning the payload defined in [TSD-00 Section 5].

```typescript
// Example Zustand Store definition for parallel dev
interface WizardState {
  originalImageFile: File | null;
  selectedStyleId: string;
  selectedAspectRatio: '1:1' | '9:16' | '4:5';
  generatedImageUrl: string | null;
  generatedCopy: string | null;
  isGenerating: boolean;
  // Actions
  startGeneration: () => Promise<void>; 
}
```

## 4. Acceptance Criteria
*   [ ] 0 `any` types in the codebase (TypeScript Strict).
*   [ ] The Wizard flow maintains state even if the user accidentally hits the browser back button (persist state to `sessionStorage`).
*   [ ] The Canvas component correctly renders Google Fonts dynamically based on user selection.
*   [ ] `prefers-reduced-motion` CSS queries are respected for the Step 3 Loading animations.
