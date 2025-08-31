import { Appointment } from '../types';
import { db } from './mockDb';
import { eventService } from './eventService';

const delay = (ms: number) => new Promise(res => setTimeout(res, ms));

export const getAppointments = async (startDate?: Date, endDate?: Date): Promise<Appointment[]> => {
    await delay(500);
    const appointments = db.getAppointments();

    if (startDate && endDate) {
        const endOfDay = new Date(endDate);
        endOfDay.setHours(23, 59, 59, 999);
        
        return [...appointments].filter(app => {
            const appTime = app.startTime.getTime();
            return appTime >= startDate.getTime() && appTime <= endOfDay.getTime();
        });
    }

    return [...appointments];
};

export const getAppointmentsByPatientId = async (patientId: string): Promise<Appointment[]> => {
    await delay(300);
    return db.getAppointments().filter(a => a.patientId === patientId)
      .sort((a, b) => b.startTime.getTime() - a.startTime.getTime());
};

export const saveAppointment = async (appointmentData: Appointment): Promise<Appointment> => {
    await delay(400);
    // FIX: Find patient in the mutable DB, not the static mock data.
    const patient = db.getPatientById(appointmentData.patientId);
    const fullAppointmentData = {
        ...appointmentData,
        // Using a fallback to ensure the name is present, which fixes the user's issue.
        patientName: appointmentData.patientName || patient?.name || 'Paciente Desconhecido',
        patientAvatarUrl: patient?.avatarUrl || `https://i.pravatar.cc/150?u=${appointmentData.patientId}`
    };

    db.saveAppointment(fullAppointmentData);
    eventService.emit('appointments:changed');
    return fullAppointmentData;
};

export const deleteAppointment = async (id: string): Promise<void> => {
    await delay(400);
    db.deleteAppointment(id);
    eventService.emit('appointments:changed');
};

export const deleteAppointmentSeries = async (seriesId: string, fromDate: Date): Promise<void> => {
    await delay(400);
    db.deleteAppointmentSeries(seriesId, fromDate);
    eventService.emit('appointments:changed');
}