import React, { createContext, useState, useContext, useEffect, ReactNode, useCallback } from 'react';
import { Therapist, Patient, Appointment } from '../types';
import * as therapistService from '../services/therapistService';
import * as patientService from '../services/patientService';
import * as appointmentService from '../services/appointmentService';
import PageLoader from '../components/ui/PageLoader';
import { eventService } from '../services/eventService';

interface DataContextType {
  therapists: Therapist[];
  patients: Patient[];
  appointments: Appointment[];
  isLoading: boolean;
  error: Error | null;
  refetch: () => void;
}

const DataContext = createContext<DataContextType | undefined>(undefined);

export const DataProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [therapists, setTherapists] = useState<Therapist[]>([]);
  const [patients, setPatients] = useState<Patient[]>([]);
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchData = useCallback(async () => {
    // Only set loading to true on the very first fetch.
    // Subsequent fetches triggered by events are background updates.
    // setIsLoading(true); // This line is commented out to prevent screen flicker on updates.
    try {
      const [therapistsData, patientsData, appointmentsData] = await Promise.all([
        therapistService.getTherapists(),
        patientService.getAllPatients(),
        appointmentService.getAppointments(),
      ]);
      setTherapists(therapistsData);
      setPatients(patientsData);
      setAppointments(appointmentsData);
      setError(null);
    } catch (err) {
      setError(err as Error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();

    // FIX: Add event listeners to keep the context data fresh across the app.
    eventService.on('patients:changed', fetchData);
    eventService.on('appointments:changed', fetchData);

    return () => {
        eventService.off('patients:changed', fetchData);
        eventService.off('appointments:changed', fetchData);
    };
  }, [fetchData]);

  if (isLoading) {
    return <PageLoader />;
  }
  
  if (error) {
    return <div className="flex items-center justify-center h-screen text-red-500">Falha ao carregar dados essenciais: {error.message}</div>;
  }

  return (
    <DataContext.Provider value={{
      therapists,
      patients,
      appointments,
      isLoading,
      error,
      refetch: fetchData,
    }}>
      {children}
    </DataContext.Provider>
  );
};

export const useData = (): DataContextType => {
  const context = useContext(DataContext);
  if (context === undefined) {
    throw new Error('useData must be used within a DataProvider');
  }
  return context;
};