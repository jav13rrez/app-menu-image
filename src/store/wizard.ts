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
  dishName: string;
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
  selectedContextPhotoId: string | null;

  setStep: (step: number) => void;
  setImage: (file: File, preview: string) => void;
  setStyle: (styleId: string) => void;
  setNarrative: (narrative: string) => void;
  setAspectRatio: (ratio: AspectRatio) => void;
  setDishName: (name: string) => void;
  setBusinessName: (name: string) => void;
  setLocation: (loc: string) => void;
  setPostContext: (context: string) => void;
  setGenerationResult: (imageUrl: string, copy: string, hashtags: string[], headline: string, tagline: string) => void;
  setGenerating: (generating: boolean) => void;
  setJobId: (jobId: string) => void;
  setError: (error: string | null) => void;
  setSelectedContextPhotoId: (id: string | null) => void;
  reset: () => void;
}

const initialState = {
  currentStep: 0,
  originalImageFile: null,
  originalImagePreview: null,
  selectedStyleId: "",
  selectedNarrative: "",
  selectedAspectRatio: "1:1" as AspectRatio,
  dishName: "",
  businessName: "",
  location: "",
  postContext: "",
  generatedImageUrl: null,
  generatedCopy: null,
  generatedHashtags: [] as string[],
  generatedHeadline: null,
  generatedTagline: null,
  isGenerating: false,
  jobId: null,
  error: null,
  selectedContextPhotoId: null,
};

export const useWizardStore = create<WizardState>()(
  persist(
    (set, get) => ({
      ...initialState,
      setStep: (step) => set({ currentStep: step }),
      setImage: (file, preview) =>
        set({ originalImageFile: file, originalImagePreview: preview }),
      setStyle: (styleId) => set({ selectedStyleId: styleId }),
      setNarrative: (narrative) => set({ selectedNarrative: narrative }),
      setAspectRatio: (ratio) => set({ selectedAspectRatio: ratio }),
      setDishName: (name) => set({ dishName: name }),
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
          currentStep: 3, // Canvas is now step 3 (was 4)
        }),
      setGenerating: (generating) => set({ isGenerating: generating }),
      setJobId: (jobId) => set({ jobId }),
      setError: (error) => set({ error, isGenerating: false }),
      setSelectedContextPhotoId: (id) => set({ selectedContextPhotoId: id }),
      reset: () => {
        // Persist businessName and location across resets; clear everything else
        const { businessName, location } = get();
        set({
          ...initialState,
          businessName,
          location,
        });
      },
    }),
    {
      name: "wizard-state",
      storage: createJSONStorage(() => sessionStorage),
      partialize: (state) => ({
        currentStep: state.currentStep,
        selectedStyleId: state.selectedStyleId,
        selectedNarrative: state.selectedNarrative,
        selectedAspectRatio: state.selectedAspectRatio,
        dishName: state.dishName,
        businessName: state.businessName,
        location: state.location,
        postContext: state.postContext,
        generatedImageUrl: state.generatedImageUrl,
        generatedCopy: state.generatedCopy,
        generatedHashtags: state.generatedHashtags,
        generatedHeadline: state.generatedHeadline,
        generatedTagline: state.generatedTagline,
        selectedContextPhotoId: state.selectedContextPhotoId,
      }),
    }
  )
);
