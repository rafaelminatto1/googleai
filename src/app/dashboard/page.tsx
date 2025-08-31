
// app/dashboard/page.tsx
import React from 'react';
import prisma from '@/lib/prisma';
// FIX: Import date-fns functions from their specific subpaths to resolve module resolution errors.
import { startOfMonth } from 'date-fns/startOfMonth';
import { subMonths } from 'date-fns/subMonths';
import { AppointmentStatus, Patient, Therapist } from '@/types';
import DashboardClient from '@/components/dashboard/DashboardClient';
import PageHeader from '@/components/layout/PageHeader';

// Helper to calculate percentage change on the server
const calculateChange = (current: number, previous: number) => {
    if (previous === 0) return current > 0 ? { change: '+∞%', changeType: 'increase' as const } : {};
    const percentageChange = ((current - previous) / previous) * 100;
    if (Math.abs(percentageChange) < 0.1) return {};
    return {
        change: `${percentageChange > 0 ? '+' : ''}${percentageChange.toFixed(1)}%`,
        changeType: percentageChange >= 0 ? 'increase' as const : 'decrease' as const,
    };
};

export default async function DashboardPage() {
    const now = new Date();
    const startOfThisMonth = startOfMonth(now);
    const startOfLastMonth = startOfMonth(subMonths(now, 1));
    const thirtyDaysAgo = new Date(new Date().setDate(now.getDate() - 30));

    // Fetch all data in parallel on the server
    const [therapists, patients, appointments] = await Promise.all([
        prisma.therapist.findMany(),
        prisma.patient.findMany({ where: { deletedAt: null } }),
        prisma.appointment.findMany({ 
            where: { startTime: { gte: thirtyDaysAgo }, deletedAt: null },
            select: { value: true, status: true, startTime: true, therapistId: true }
        }),
    ]);

    // Calculate stats on the server
    const revenueThisMonth = appointments
        .filter(a => a.status === AppointmentStatus.Completed && new Date(a.startTime) >= startOfThisMonth)
        .reduce((sum, a) => sum + a.value, 0);
    
    const revenueLastMonth = appointments
        .filter(a => {
            const appDate = new Date(a.startTime);
            return a.status === AppointmentStatus.Completed && appDate >= startOfLastMonth && appDate < startOfThisMonth;
        })
        .reduce((sum, a) => sum + a.value, 0);

    const newPatientsThisMonthCount = patients.filter(p => new Date(p.registrationDate) >= startOfThisMonth).length;
    
    const stats = {
        monthlyRevenue: {
            value: `R$ ${revenueThisMonth.toLocaleString('pt-BR')}`,
            ...calculateChange(revenueThisMonth, revenueLastMonth),
        },
        activePatients: {
            value: patients.filter(p => p.status === 'Active').length.toString(),
            subtitle: 'Total em tratamento',
        },
        newPatientsThisMonth: {
            value: newPatientsThisMonthCount.toString(),
            // Not calculating change for new patients to keep it simple
        },
        avgSatisfaction: {
            value: '9.2/10', // Mocked data
            subtitle: 'Baseado em 48 avaliações',
        },
    };

    return (
        <>
            <PageHeader
                title="Dashboard Administrativo"
                subtitle="Visão 360° do negócio com métricas financeiras, operacionais e clínicas."
            />
            <DashboardClient
                stats={stats}
                therapists={therapists as Therapist[]}
                patients={patients as Patient[]}
                appointments={JSON.parse(JSON.stringify(appointments))}
            />
        </>
    );
}
