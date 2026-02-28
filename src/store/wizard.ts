import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

export type AspectRatio = "1:1" | "3:4" | "4:3" | "4:5" | "5:4" | "9:16" | "16:9";

export interface WizardState {
  currentStep: number;
  originalImageFile: File | null;
  originalImagePreview: string | null;
  selectedStyleId: string;
  selectedNarrative: string;
  selectedAspectRatio: AspectRatio;
  businessName: string;
  location: string;
  postContext: string;
  generatedImageUrl: string | null;
  generatedCopy: string | null;
  generatedHashtags: string[];
  generatedHeadline: string | null;
  generatedTagline: string | null;
  isGenerating: boolean;
  jobId: string | null;
  error: string | null;

  setStep: (step: number) => void;
  setImage: (file: File, preview: string) => void;
  setStyle: (styleId: string) => void;
  setNarrative: (narrative: string) => void;
  setAspectRatio: (ratio: AspectRatio) => void;
  setBusinessName: (name: string) => void;
  setLocation: (loc: string) => void;
  setPostContext: (context: string) => void;
  setGenerationResult: (imageUrl: string, copy: string, hashtags: string[], headline: string, tagline: string) => void;
  setGenerating: (generating: boolean) => void;
  setJobId: (jobId: string) => void;
  setError: (error: string | null) => void;
  reset: () => void;
}

const initialState = {
  currentStep: 0,
  originalImageFile: null,
  originalImagePreview: null,
  selectedStyleId: "",
  selectedNarrative: "",
  selectedAspectRatio: "1:1" as AspectRatio,
  businessName: "",
  location: "",
  postContext: "",
  generatedImageUrl: null,
  generatedCopy: null,
  generatedHashtags: [],
  generatedHeadline: null,
  generatedTagline: null,
  isGenerating: false,
  jobId: null,
  error: null,
};

export const useWizardStore = create<WizardState>()(
  persist(
    (set) => ({
      ...initialState,
      setStep: (step) => set({ currentStep: step }),
      setImage: (file, preview) =>
        set({ originalImageFile: file, originalImagePreview: preview, currentStep: 1 }),
      setStyle: (styleId) => set({ selectedStyleId: styleId }),
      setNarrative: (narrative) => set({ selectedNarrative: narrative }),
      setAspectRatio: (ratio) => set({ selectedAspectRatio: ratio }),
      setBusinessName: (name) => set({ businessName: name }),
      setLocation: (loc) => set({ location: loc }),
      setPostContext: (ctx) => set({ postContext: ctx }),
      setGenerationResult: (imageUrl, copy, hashtags, headline, tagline) =>
        set({
          generatedImageUrl: imageUrl,
          generatedCopy: copy,
          generatedHashtags: hashtags,
          generatedHeadline: headline,
          generatedTagline: tagline,
          isGenerating: false,
          currentStep: 4, // Ahora sube un paso, el Canvas será el step 4
        }),
      setGenerating: (generating) => set({ isGenerating: generating }),
      setJobId: (jobId) => set({ jobId }),
      setError: (error) => set({ error, isGenerating: false }),
      reset: () => set(initialState),
    }),
    {
      name: "wizard-state",
      storage: createJSONStorage(() => sessionStorage),
      partialize: (state) => ({
        currentStep: state.currentStep,
        selectedStyleId: state.selectedStyleId,
        selectedNarrative: state.selectedNarrative,
        selectedAspectRatio: state.selectedAspectRatio,
        businessName: state.businessName,
        location: state.location,
        postContext: state.postContext,
        generatedImageUrl: state.generatedImageUrl,
        generatedCopy: state.generatedCopy,
        generatedHashtags: state.generatedHashtags,
        generatedHeadline: state.generatedHeadline,
        generatedTagline: state.generatedTagline,
      }),
    }
  )
);
