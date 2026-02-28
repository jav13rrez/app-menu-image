"use client";

import { useWizardStore } from "@/store/wizard";
import { t } from "@/lib/i18n";
import { useState } from "react";

export default function StepContext() {
    const businessName = useWizardStore((s) => s.businessName);
    const location = useWizardStore((s) => s.location);
    const postContext = useWizardStore((s) => s.postContext);

    const setBusinessName = useWizardStore((s) => s.setBusinessName);
    const setLocation = useWizardStore((s) => s.setLocation);
    const setPostContext = useWizardStore((s) => s.setPostContext);

    const [preset, setPreset] = useState<string>("");

    const handlePresetChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const val = e.target.value;
        setPreset(val);
        if (val !== "custom" && val !== "") {
            const contextText = t.context.presets[val as keyof typeof t.context.presets];
            setPostContext(contextText);
        } else if (val === "") {
            setPostContext("");
        }
    };

    return (
        <div className="flex flex-col gap-8">
            <div>
                <h2 className="text-2xl font-bold mb-2">{t.context.title}</h2>
                <p className="text-gray-400 mb-6">{t.context.subtitle}</p>

                <div className="space-y-6">
                    {/* Business Name */}
                    <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">
                            {t.context.businessName}
                        </label>
                        <input
                            type="text"
                            value={businessName}
                            onChange={(e) => setBusinessName(e.target.value)}
                            placeholder={t.context.businessNamePlace}
                            className="w-full bg-gray-900 border border-gray-700 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-amber-500 placeholder-gray-600 transition-all"
                        />
                    </div>

                    {/* Location */}
                    <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">
                            {t.context.location}
                        </label>
                        <input
                            type="text"
                            value={location}
                            onChange={(e) => setLocation(e.target.value)}
                            placeholder={t.context.locationPlace}
                            className="w-full bg-gray-900 border border-gray-700 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-amber-500 placeholder-gray-600 transition-all"
                        />
                    </div>

                    {/* Post Context */}
                    <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">
                            {t.context.postContext}
                        </label>

                        <select
                            value={preset}
                            onChange={handlePresetChange}
                            className="w-full bg-gray-900 border border-gray-700 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-amber-500 mb-3 cursor-pointer appearance-none"
                        >
                            <option value="">{t.context.presets.none}</option>
                            <option value="weekend">{t.context.presets.weekend}</option>
                            <option value="today">{t.context.presets.today}</option>
                            <option value="chef">{t.context.presets.chef}</option>
                            <option value="party">{t.context.presets.party}</option>
                            <option value="valentine">{t.context.presets.valentine}</option>
                            <option value="custom">{t.context.customContext}</option>
                        </select>

                        {(preset === "custom" || (preset !== "" && preset !== "weekend" && preset !== "today" && preset !== "chef" && preset !== "party" && preset !== "valentine")) && (
                            <textarea
                                value={postContext}
                                onChange={(e) => setPostContext(e.target.value)}
                                placeholder={t.context.postContextPlace}
                                rows={3}
                                className="w-full bg-gray-900 border border-gray-700 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-amber-500 placeholder-gray-600 transition-all resize-none mt-2"
                            />
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
