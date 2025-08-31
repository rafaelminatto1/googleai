// src/components/dashboard/DashboardClient.tsx
'use client';

import React, { useMemo } from 'react';
import { Patient, Appointment, Therapist } from '@/types';
import KPICards from './KPICards';
import RevenueChart from './RevenueChart';
import PatientFlowChart from './PatientFlowChart';
import TeamProductivityChart from './TeamProductivityChart';
import AppointmentHeatmap from './AppointmentHeatmap';
import { Activity, Users } from 'lucide-react';
import TodaysAppointments from './glance/TodaysAppointments';
import PendingTasks from './glance/PendingTasks';
import RecentActivity from './glance/RecentActivity';

interface DashboardClientProps {
    stats: any; // Simplified for this migration
    therapists: Therapist[];
    patients: Patient[];
    appointments: Appointment[];
}

const isToday = (someDate: Date) => {
    const today = new Date();
    return someDate.getDate() === today.getDate() &&
        someDate.getMonth() === today.getMonth() &&
        someDate.getFullYear() === today.getFullYear();
};

const DashboardClient: React.FC<DashboardClientProps> = ({ stats, therapists, patients, appointments: rawAppointments }) => {
    
    // Parse date strings back into Date objects
    const appointments = useMemo(() => rawAppointments.map(a => ({...a, startTime: new Date(a.startTime), endTime: new Date(a.endTime)})), [rawAppointments]);

    const enrichedTodaysAppointments = useMemo(() => {
        return appointments.filter(app => isToday(new Date(app.startTime)));
    }, [appointments]);

    return (
        <div className="space-y-8">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <TodaysAppointments appointments={enrichedTodaysAppointments as any} />
                <PendingTasks />
                <RecentActivity />
            </div>

            <KPICards stats={stats} />
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <RevenueChart appointments={appointments} />
                <PatientFlowChart patients={patients} />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2 bg-white p-6 rounded-2xl shadow-sm">
                    <h3 className="text-lg font-semibold text-slate-800 mb-4 flex items-center">
                        <Activity className="w-5 h-5 mr-2 text-teal-500" /> Mapa de Calor de Agendamentos
                    </h3>
                    <AppointmentHeatmap appointments={appointments} />
                </div>
                <div className="bg-white p-6 rounded-2xl shadow-sm">
                    <h3 className="text-lg font-semibold text-slate-800 mb-4 flex items-center">
                        <Users className="w-5 h-5 mr-2 text-teal-500" /> Produtividade da Equipe
                    </h3>
                    <TeamProductivityChart appointments={appointments} therapists={therapists} />
                </div>
            </div>
        </div>
    );
};

export default DashboardClient;
