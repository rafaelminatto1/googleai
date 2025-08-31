// src/components/dashboard/KPICards.tsx
'use client';
import React from 'react';
import { DollarSign, Users, BarChart3, Star } from 'lucide-react';
import StatCard from './StatCard';

interface KPICardsProps {
    stats: {
        monthlyRevenue: { value: string; change?: string; changeType?: 'increase' | 'decrease' };
        activePatients: { value: string; subtitle: string; };
        newPatientsThisMonth: { value: string; change?: string; changeType?: 'increase' | 'decrease' };
        avgSatisfaction: { value: string; subtitle: string; };
    }
}

const KPICards: React.FC<KPICardsProps> = ({ stats }) => {
    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <StatCard
                title="Faturamento do Mês"
                value={stats.monthlyRevenue.value}
                icon={<DollarSign />}
                change={stats.monthlyRevenue.change}
                changeType={stats.monthlyRevenue.changeType}
            />
            <StatCard
                title="Pacientes Ativos"
                value={stats.activePatients.value}
                icon={<Users />}
                subtitle={stats.activePatients.subtitle}
            />
            <StatCard
                title="Novos Pacientes (Mês)"
                value={stats.newPatientsThisMonth.value}
                icon={<BarChart3 />}
                change={stats.newPatientsThisMonth.change}
                changeType={stats.newPatientsThisMonth.changeType}
            />
            <StatCard
                title="Satisfação (NPS)"
                value={stats.avgSatisfaction.value}
                icon={<Star />}
                subtitle={stats.avgSatisfaction.subtitle}
            />
        </div>
    );
};

export default KPICards;
