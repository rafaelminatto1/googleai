// services/evaluationService.ts
import { ExerciseEvaluation } from '../types';
import { db } from './mockDb';
import { eventService } from './eventService';

export const getEvaluationsByPatientId = async (patientId: string): Promise<ExerciseEvaluation[]> => {
    await new Promise(res => setTimeout(res, 200));
    const allEvals = db.getExerciseEvaluations();
    return allEvals.filter(e => e.patientId === patientId);
};

export const addEvaluation = async (data: Omit<ExerciseEvaluation, 'id' | 'date'>): Promise<ExerciseEvaluation> => {
    await new Promise(res => setTimeout(res, 300));
    
    // Check for existing evaluation for the same exercise on the same day
    const todayStr = new Date().toDateString();
    const existingEval = db.getExerciseEvaluations().find(e =>
        e.patientId === data.patientId &&
        e.exerciseId === data.exerciseId &&
        new Date(e.date).toDateString() === todayStr
    );

    const evaluation: ExerciseEvaluation = {
        id: existingEval ? existingEval.id : `eval_${Date.now()}`, // Reuse ID if updating
        date: new Date(),
        ...data,
    };
    
    db.saveEvaluation(evaluation);
    eventService.emit('evaluations:changed'); // Notify other parts of the app
    return evaluation;
};
