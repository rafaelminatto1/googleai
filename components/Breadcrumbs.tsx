
'use client';

import React, { useEffect, useState } from 'react';
import * as ReactRouterDOM from 'react-router-dom';
import { ChevronRight, Home } from 'lucide-react';
import * as patientService from '../services/patientService';

interface Breadcrumb {
  href: string;
  label: string;
}

const breadcrumbNameMap: Record<string, string> = {
  'dashboard': 'Início',
  'patients': 'Pacientes',
  'agenda': 'Agenda',
  'clinical-analytics': 'Dashboard Clínico',
  'financials': 'Financeiro',
  'reports': 'Relatórios',
  'settings': 'Configurações',
  'audit-log': 'Auditoria',
  'gerar-laudo': 'Gerar Laudo',
  'gerar-evolucao': 'Gerar Evolução',
  'gerar-hep': 'Gerar Plano (HEP)',
  'analise-risco': 'Análise de Risco',
  'acompanhamento': 'Acompanhamento',
  'notifications': 'Notificações',
  'tasks': 'Quadro de Tarefas',
  'groups': 'Grupos',
  'exercises': 'Exercícios',
  'materials': 'Materiais Clínicos',
  'inventory': 'Insumos',
  'partnerships': 'Parcerias',
  'events': 'Eventos',
  'whatsapp': 'WhatsApp',
  'email-inativos': 'Email para Inativos',
  'mentoria': 'Mentoria',
  'knowledge-base': 'Base de Conhecimento',
  'ia-economica': 'IA Econômica',
  'agenda-settings': 'Config. Agenda',
  'ai-settings': 'Config. IA',
  'medical-report': 'Laudo Médico',
};

const Breadcrumbs: React.FC = () => {
    const location = ReactRouterDOM.useLocation();
    const params = ReactRouterDOM.useParams();
    const [breadcrumbs, setBreadcrumbs] = useState<Breadcrumb[]>([]);

    useEffect(() => {
        const generateBreadcrumbs = async () => {
            const pathnames = location.pathname.split('/').filter(x => x);
            
            const newCrumbs: Breadcrumb[] = [{ href: '/dashboard', label: 'Início' }];
            
            let currentPath = '';

            for (const segment of pathnames) {
                currentPath += `/${segment}`;
                let label = breadcrumbNameMap[segment] || segment.charAt(0).toUpperCase() + segment.slice(1);

                // Handle dynamic segments
                if (params.id && segment === params.id) {
                    if (location.pathname.startsWith('/patients/')) {
                        try {
                            const patient = await patientService.getPatientById(params.id);
                            label = patient?.name || 'Paciente';
                        } catch (e) {
                            label = 'Paciente';
                        }
                    }
                } else if (params.reportId && segment === params.reportId) {
                     label = 'Editar Laudo';
                } else if (params.patientId && segment === params.patientId) {
                     label = 'Novo Laudo';
                }
                
                newCrumbs.push({ href: currentPath, label });
            }

            setBreadcrumbs(newCrumbs);
        };
        
        generateBreadcrumbs();
    }, [location.pathname, params]);

    if (breadcrumbs.length <= 1 || location.pathname === '/dashboard') {
        return null;
    }

    return (
        <nav className="mb-6 -mt-2" aria-label="Breadcrumb">
            <ol className="flex items-center space-x-2 text-sm">
                {breadcrumbs.map((crumb, index) => {
                    const isLast = index === breadcrumbs.length - 1;
                    return (
                        <React.Fragment key={crumb.href}>
                            <li>
                                {isLast ? (
                                    <span className="font-semibold text-slate-700 truncate max-w-xs">{crumb.label}</span>
                                ) : (
                                    <ReactRouterDOM.Link to={crumb.href} className="text-slate-500 hover:text-sky-600 transition-colors flex items-center gap-1.5">
                                        {crumb.label === 'Início' ? <Home className="w-4 h-4" /> : null}
                                        <span>{crumb.label}</span>
                                    </ReactRouterDOM.Link>
                                )}
                            </li>
                            {!isLast && (
                                <li>
                                    <ChevronRight className="w-4 h-4 text-slate-400" />
                                </li>
                            )}
                        </React.Fragment>
                    );
                })}
            </ol>
        </nav>
    );
};

export default Breadcrumbs;
