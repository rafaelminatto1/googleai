
import React, { useMemo, useState, useEffect, useCallback } from 'react';
import PageHeader from '../components/PageHeader';
import KPICards from '../components/dashboard/KPICards';
import RevenueChart from '../components/dashboard/RevenueChart';
import PatientFlowChart from '../components/dashboard/PatientFlowChart';
import TeamProductivityChart from '../components/dashboard/TeamProductivityChart';
import AppointmentHeatmap from '../components/dashboard/AppointmentHeatmap';
import { Activity, Users } from 'lucide-react';
import { useData } from '../contexts/DataContext';
import TodaysAppointments from '../components/dashboard/glance/TodaysAppointments';
import PendingTasks from '../components/dashboard/glance/PendingTasks';
import RecentActivity from '../components/dashboard/glance/RecentActivity';
import useDashboardStats from '../hooks/useDashboardStats';
import { Patient, Appointment, AppointmentTypeColors } from '../types';
import * as patientService from '../services/patientService';
import * as appointmentService from '../services/appointmentService';
import { eventService } from '../services/eventService';

const isToday = (someDate: Date) => {
    const today = new Date();
    return someDate.getDate() === today.getDate() &&
        someDate.getMonth() === today.getMonth() &&
        someDate.getFullYear() === today.getFullYear();
};

const DashboardPage: React.FC = () => {
    const { therapists, isLoading: isTherapistsLoading } = useData();
    const [patients, setPatients] = useState<Patient[]>([]);
    const [appointments, setAppointments] = useState<Appointment[]>([]);
    const [isLoadingPageData, setIsLoadingPageData] = useState(true);

    const fetchPageData = useCallback(async () => {
        setIsLoadingPageData(true);
        try {
            // Fetch all data required for this page specifically
            const thirtyDaysAgo = new Date();
            thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
            
            const [patientsData, appointmentsData] = await Promise.all([
                patientService.getAllPatients(),
                appointmentService.getAppointments(thirtyDaysAgo, new Date())
            ]);

            setPatients(patientsData);
            setAppointments(appointmentsData);
        } catch (error) {
            console.error("Failed to fetch dashboard data", error);
        } finally {
            setIsLoadingPageData(false);
        }
    }, []);

    useEffect(() => {
        fetchPageData();
        
        const handleDataChange = () => fetchPageData();
        eventService.on('patients:changed', handleDataChange);
        eventService.on('appointments:changed', handleDataChange);
        
        return () => {
            eventService.off('patients:changed', handleDataChange);
            eventService.off('appointments:changed', handleDataChange);
        };
    }, [fetchPageData]);

    const isLoading = isTherapistsLoading || isLoadingPageData;
    
    const enrichedTodaysAppointments = useMemo(() => {
        const todays = appointments.filter(app => isToday(new Date(app.startTime)));

        const therapistMap = new Map(therapists.map(t => [t.id, t]));
        const patientMap = new Map(patients.map(p => [p.id, p]));

        return todays.map(app => {
            const patient = patientMap.get(app.patientId);
            return {
                ...app,
                therapistColor: therapistMap.get(app.therapistId)?.color || 'slate',
                typeColor: AppointmentTypeColors[app.type] || 'slate',
                patientPhone: patient?.phone || '',
                patientMedicalAlerts: patient?.medicalAlerts,
            };
        });
    }, [appointments, patients, therapists]);

    const { stats } = useDashboardStats({ patients, appointments });

    return (
        <div className="space-y-8">
            <PageHeader
                title="Dashboard Administrativo"
                subtitle="Visão 360° do negócio com métricas financeiras, operacionais e clínicas."
            />

            <div className="space-y-8">
                <KPICards stats={stats} isLoading={isLoading} />
                
                <div>
                    <h2 className="text-2xl font-bold text-slate-800 mb-4">Resumo do Dia</h2>
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                        <TodaysAppointments appointments={enrichedTodaysAppointments} />
                        <PendingTasks />
                        <RecentActivity />
                    </div>
                </div>

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
        </div>
    );
};

export default DashboardPage;