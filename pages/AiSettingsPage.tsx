// pages/AiSettingsPage.tsx
import React, { useState, useEffect } from 'react';
import PageHeader from '../components/PageHeader';
import { ProviderSettings } from '../services/ai-economica/aiProviders';
// FIX: Import AiSettings from its original source file to resolve the module resolution error.
import { PremiumProvider, QueryType, AiSettings } from '../services/ai-economica/types/ai-economica.types';
import { settingsService } from '../services/ai-economica/settingsService';
import { SlidersHorizontal, Save, Power, KeyRound, AlertTriangle, Zap } from 'lucide-react';
import { useToast } from '../contexts/ToastContext';

interface ProviderCardProps {
    providerKey: string;
    config: ProviderSettings;
    onToggle: (key: string, enabled: boolean) => void;
}

const ProviderCard: React.FC<ProviderCardProps> = ({ providerKey, config, onToggle }) => {
    const usagePercent = Math.min(100, (config.currentUsage / config.monthlyLimit) * 100);
    const isOverLimit = usagePercent >= 100;
    
    return (
        <div className={`p-4 rounded-lg border ${config.enabled ? 'bg-white' : 'bg-slate-50'}`}>
            <div className="flex justify-between items-center">
                <h4 className="font-bold text-slate-800">{config.name}</h4>
                <label className="relative inline-flex items-center cursor-pointer">
                    <input type="checkbox" checked={config.enabled} onChange={(e) => onToggle(providerKey, e.target.checked)} className="sr-only peer" disabled={!config.hasCredentialsConfigured} />
                    <div className="w-11 h-6 bg-slate-200 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-teal-500"></div>
                </label>
            </div>
            <div className="mt-4">
                <div className="flex justify-between text-xs text-slate-500 mb-1">
                    <span>Uso Mensal (Simulado)</span>
                    <span>{config.currentUsage} / {config.monthlyLimit}</span>
                </div>
                <div className="w-full bg-slate-200 rounded-full h-2.5">
                    <div className={`${isOverLimit ? 'bg-red-500' : 'bg-teal-500'} h-2.5 rounded-full`} style={{ width: `${usagePercent}%` }}></div>
                </div>
            </div>
            <div className="mt-4">
                {!config.hasCredentialsConfigured ? (
                     <div className="flex items-center text-xs text-amber-600 p-2 bg-amber-50 rounded-md">
                        <AlertTriangle className="w-4 h-4 mr-2" />
                        <span>Credenciais não configuradas.</span>
                    </div>
                ) : (
                    <button className="w-full flex items-center justify-center text-sm text-slate-600 bg-slate-100 hover:bg-slate-200 py-2 rounded-md">
                        <KeyRound className="w-4 h-4 mr-2"/> Gerenciar Credenciais
                    </button>
                )}
            </div>
        </div>
    );
};

const queryTypeLabels: Record<QueryType, string> = {
    [QueryType.GENERAL_QUESTION]: 'Dúvida Geral',
    [QueryType.PROTOCOL_SUGGESTION]: 'Sugestão de Protocolo',
    [QueryType.DIAGNOSIS_HELP]: 'Auxílio Diagnóstico',
    [QueryType.EXERCISE_RECOMMENDATION]: 'Recomendação de Exercício',
    [QueryType.CASE_ANALYSIS]: 'Análise de Caso Clínico',
    [QueryType.RESEARCH_QUERY]: 'Pesquisa/Artigos',
    [QueryType.DOCUMENT_ANALYSIS]: 'Análise de Documento',
};


const AiSettingsPage: React.FC = () => {
    const [settings, setSettings] = useState<AiSettings>(() => settingsService.getSettings());
    const [providerConfigs, setProviderConfigs] = useState<Record<string, ProviderSettings>>({});
    const { showToast } = useToast();
    
    useEffect(() => {
        setProviderConfigs(settingsService.getMergedProviderConfigs());
    }, [settings.providers]);

    const handleToggleProvider = (key: string, enabled: boolean) => {
        setSettings(prev => ({
            ...prev,
            providers: {
                ...prev.providers,
                [key]: { enabled }
            }
        }));
    };
    
    const handleRoutingChange = (queryType: QueryType, provider: PremiumProvider) => {
        setSettings(prev => ({
            ...prev,
            routing: {
                ...prev.routing,
                [queryType]: provider,
            }
        }));
    };

    const handleSave = () => {
        settingsService.saveSettings(settings);
        showToast('Configurações de IA salvas com sucesso!', 'success');
    };
    
    const enabledProviders = Object.entries(providerConfigs).filter(([, config]) => config.enabled);

    return (
        <>
            <PageHeader
                title="Configurações de IA"
                subtitle="Gerencie os provedores de IA, defina o padrão e otimize o roteamento."
            >
                 <button onClick={handleSave} className="inline-flex items-center justify-center rounded-lg border border-transparent bg-teal-500 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-teal-600">
                    <Save className="w-5 h-5 mr-2" />
                    Salvar Alterações
                </button>
            </PageHeader>

            <div className="space-y-8">
                 <div className="bg-white p-6 rounded-2xl shadow-sm">
                    <h3 className="text-lg font-semibold text-slate-800 mb-4">Roteamento Inteligente</h3>
                    <p className="text-sm text-slate-500 mb-4">Direcione tipos específicos de consulta para o provedor mais adequado, otimizando custos e qualidade da resposta.</p>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4">
                        {Object.values(QueryType).map(type => (
                            <div key={type}>
                                <label className="block text-sm font-medium text-slate-700">{queryTypeLabels[type]}</label>
                                <select 
                                    value={settings.routing?.[type] || settings.defaultProvider}
                                    onChange={(e) => handleRoutingChange(type, e.target.value as PremiumProvider)}
                                    className="mt-1 w-full p-2 border border-slate-300 rounded-lg bg-white"
                                >
                                    <option value={settings.defaultProvider}>Padrão ({providerConfigs[settings.defaultProvider]?.name})</option>
                                    {enabledProviders.map(([key, config]) => (
                                         <option key={key} value={key}>{config.name}</option>
                                     ))}
                                </select>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="bg-white p-6 rounded-2xl shadow-sm">
                    <h3 className="text-lg font-semibold text-slate-800 mb-4">Provedor Padrão</h3>
                    <p className="text-sm text-slate-500 mb-2">Selecione o provedor a ser utilizado quando uma estratégia específica não for definida.</p>
                     <select 
                        value={settings.defaultProvider}
                        onChange={(e) => setSettings(s => ({ ...s, defaultProvider: e.target.value as PremiumProvider }))}
                        className="w-full max-w-sm p-2 border border-slate-300 rounded-lg bg-white"
                     >
                         {enabledProviders.map(([key, config]) => (
                             <option key={key} value={key}>{config.name}</option>
                         ))}
                     </select>
                </div>
                
                <div className="bg-white p-6 rounded-2xl shadow-sm">
                    <h3 className="text-lg font-semibold text-slate-800 mb-4">Status dos Provedores</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {Object.entries(providerConfigs).map(([key, config]) => (
                            <ProviderCard key={key} providerKey={key} config={config} onToggle={handleToggleProvider} />
                        ))}
                    </div>
                </div>
            </div>
        </>
    );
};

export default AiSettingsPage;