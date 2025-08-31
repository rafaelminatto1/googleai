
// services/ai-economica/settingsService.ts
import { AI_PROVIDERS_CONFIG, ProviderSettings, DEFAULT_AI_PROVIDER } from './aiProviders';
import { PremiumProvider, QueryType, AiSettings } from './types/ai-economica.types';

const SETTINGS_KEY = 'fisioflow_ai_settings';


export const settingsService = {
    getSettings(): AiSettings {
        try {
            const storedSettings = localStorage.getItem(SETTINGS_KEY);
            if (storedSettings) {
                const parsed = JSON.parse(storedSettings);
                // Ensure defaults for new properties
                return {
                    routing: {}, // Default empty routing
                    ...parsed,
                };
            }
        } catch (error) {
            console.error("Failed to parse AI settings from localStorage", error);
        }
        
        // Default settings from config file
        const providerSettings: Record<string, { enabled: boolean }> = {};
        for (const key in AI_PROVIDERS_CONFIG) {
            providerSettings[key] = { enabled: AI_PROVIDERS_CONFIG[key].enabled };
        }
        return {
            providers: providerSettings,
            defaultProvider: DEFAULT_AI_PROVIDER,
            routing: {},
        };
    },

    saveSettings(settings: AiSettings): void {
        try {
            localStorage.setItem(SETTINGS_KEY, JSON.stringify(settings));
        } catch (error) {
            console.error("Failed to save AI settings to localStorage", error);
        }
    },
    
    getMergedProviderConfigs(): Record<string, ProviderSettings> {
        const settings = this.getSettings();
        const mergedConfigs: Record<string, ProviderSettings> = {};

        for (const key in AI_PROVIDERS_CONFIG) {
            mergedConfigs[key] = {
                ...AI_PROVIDERS_CONFIG[key],
                enabled: settings.providers[key]?.enabled ?? AI_PROVIDERS_CONFIG[key].enabled,
            };
        }
        return mergedConfigs;
    }
};
