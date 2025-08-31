
// services/ai-economica/premiumAccountManager.ts
import { GoogleGenAI } from "@google/genai";
import { AIQuery, AIResponse, PremiumProvider, QueryType, ResponseSource, ProviderConfig, UsageStatus } from './types/ai-economica.types';
import { logger } from './logger';
import { settingsService } from './settingsService';

// Mocked Usage Tracker as per implementation plan
class UsageTracker {
    async getCurrentUsage(provider: PremiumProvider): Promise<UsageStatus> {
        // Always available in this mock
        return { status: 'available', percentage: Math.random() * 0.5 };
    }
    async recordUsage(provider: PremiumProvider, tokensUsed: number): Promise<void> {
        logger.info(`Usage recorded for ${provider}: ${tokensUsed} tokens.`);
    }
}

const usageTracker = new UsageTracker();


class PremiumAccountManager {
  private ai: GoogleGenAI;

  constructor() {
    if (!process.env.API_KEY) {
      throw new Error("API_KEY is not set for PremiumAccountManager.");
    }
    this.ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  }

  async selectBestProvider(queryType: QueryType): Promise<PremiumProvider | null> {
    const settings = settingsService.getSettings();
    const availableProviders = await this.getAvailableProviders();

    // 1. Check for a specific route in settings
    const specificRoute = settings.routing?.[queryType];
    if (specificRoute && availableProviders.includes(specificRoute)) {
        logger.info(`Using specific route for ${queryType}: ${specificRoute}`);
        return specificRoute;
    }

    // 2. Fallback to the default provider if it's available
    const defaultProvider = settings.defaultProvider;
    if (availableProviders.includes(defaultProvider)) {
        logger.info(`Using default provider: ${defaultProvider}`);
        return defaultProvider;
    }

    // 3. If default is not available, return the first available provider
    if (availableProviders.length > 0) {
        logger.warn(`Default provider not available. Falling back to ${availableProviders[0]}`);
        return availableProviders[0];
    }
    
    return null;
  }

  async getAvailableProviders(): Promise<PremiumProvider[]> {
    const available: PremiumProvider[] = [];
    const providerConfigs = settingsService.getMergedProviderConfigs();

    for (const providerKey in providerConfigs) {
      const config = providerConfigs[providerKey];
      if (!config.enabled || !config.hasCredentialsConfigured) continue;

      const provider = providerKey as PremiumProvider;
      const usage = await usageTracker.getCurrentUsage(provider);
      if (usage.status === 'available' || usage.status === 'warning') {
        available.push(provider);
      }
    }
    return available;
  }

  async query(provider: PremiumProvider, query: AIQuery): Promise<AIResponse> {
    const startTime = Date.now();
    let response: AIResponse;

    try {
        switch (provider) {
        case PremiumProvider.GEMINI_PRO:
            response = await this.queryGemini(query);
            break;
        // Mocked responses for other providers
        case PremiumProvider.CHATGPT_PLUS:
        case PremiumProvider.CLAUDE_PRO:
        case PremiumProvider.PERPLEXITY_PRO:
        case PremiumProvider.MARS_AI_PRO:
        default:
            response = {
                id: `resp_${Date.now()}`,
                queryId: query.id,
                content: `Resposta simulada do ${provider} para a pergunta: "${query.text}".`,
                confidence: 0.8,
                source: ResponseSource.PREMIUM,
                provider: provider,
                references: [],
                suggestions: [],
                followUpQuestions: [],
                tokensUsed: 100,
                responseTime: 500,
                createdAt: new Date().toISOString(),
                metadata: { reliability: 0.8, relevance: 0.8 }
            };
        }
        
        await this.trackUsage(provider, response.tokensUsed || 0);
        response.responseTime = Date.now() - startTime;
        return response;

    } catch (error) {
      logger.error(`Error querying ${provider}:`, error);
      throw error;
    }
  }

  private async queryGemini(query: AIQuery): Promise<AIResponse> {
    const result = await this.ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: query.text,
    });
    
    const tokensUsed = (query.text.length + result.text.length) / 4;
    
    return {
        id: `resp_${Date.now()}`,
        queryId: query.id,
        content: result.text,
        confidence: 0.85,
        source: ResponseSource.PREMIUM,
        provider: PremiumProvider.GEMINI_PRO,
        references: [],
        suggestions: ["Sugestão 1 vinda do Gemini.", "Sugestão 2 vinda do Gemini."],
        followUpQuestions: ["Qual o próximo passo?", "Tem mais detalhes?"],
        tokensUsed: Math.round(tokensUsed),
        responseTime: 0, // will be set in the caller
        createdAt: new Date().toISOString(),
        metadata: { reliability: 0.9, relevance: 0.9 }
    };
  }
  
  async trackUsage(provider: PremiumProvider, tokensUsed: number): Promise<void> {
    await usageTracker.recordUsage(provider, tokensUsed);
  }
}

export const premiumAccountManager = new PremiumAccountManager();
