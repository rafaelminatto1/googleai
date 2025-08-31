

// services/activityService.ts
import { RecentActivity } from '../types';
import { db } from './mockDb';

const delay = (ms: number) => new Promise(res => setTimeout(res, ms));

export const getRecentActivities = async (): Promise<RecentActivity[]> => {
    await delay(400);
    const patients = db.getPatients();
    const evaluations = db.getExerciseEvaluations();

    const patientMap = new Map(patients.map(p => [p.id, p]));

    // Create activities from patient pain points
    const painPointActivities: RecentActivity[] = patients.flatMap(p => 
        (p.painPoints || []).map(pp => ({
            id: `act_pp_${pp.id}`,
            type: 'pain_point',
            patientId: p.id,
            patientName: p.name,
            patientAvatarUrl: p.avatarUrl,
            summary: `Registrou dor em uma área (nível ${pp.intensity})`,
            timestamp: new Date(pp.date),
        }))
    );
    
    // Create activities from exercise evaluations
    const evalActivities: RecentActivity[] = evaluations.map(ev => {
        const patient = patientMap.get(ev.patientId);
        return {
            id: `act_ev_${ev.id}`,
            type: 'exercise_feedback',
            patientId: ev.patientId,
            patientName: patient?.name || 'Paciente',
            patientAvatarUrl: patient?.avatarUrl || '',
            summary: `Avaliou "${ev.exerciseName}" como ${ev.rating}.`,
            timestamp: new Date(ev.date),
        };
    });
    
    // Combine, sort by most recent, and take the top 5
    const combinedActivities = [...painPointActivities, ...evalActivities];
    return combinedActivities
        .sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime())
        .slice(0, 5);
};