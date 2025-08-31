
import React, { useState, useEffect, useRef, useMemo } from 'react';
import { X, Save, Calendar, Clock, AlertTriangle } from 'lucide-react';
import { Appointment, Patient, AppointmentStatus, AppointmentType, Therapist, PatientSummary, RecurrenceRule, AvailabilityBlock } from '../types';
import { useToast } from '../contexts/ToastContext';
import { PatientSearchInput } from './agenda/PatientSearchInput';
// FIX: Import date-fns functions from their specific subpaths to resolve module resolution errors.
import { format } from 'date-fns/format';
import { differenceInMinutes } from 'date-fns/differenceInMinutes';
import { addMinutes } from 'date-fns/addMinutes';
import { setHours } from 'date-fns/setHours';
import { setMinutes } from 'date-fns/setMinutes';
import { ptBR } from 'date-fns/locale/pt-BR';
import RecurrenceSelector from './RecurrenceSelector';
import { findConflict } from '../services/scheduling/conflictDetection';
import { generateRecurrences } from '../services/scheduling/recurrenceService';
import { schedulingSettingsService } from '../services/schedulingSettingsService';

interface AppointmentFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (appointment: Appointment) => Promise<boolean>;
  onDelete: (id: string, seriesId?: string) => Promise<boolean>;
  appointmentToEdit?: Appointment | null;
  initialData?: { date: Date, therapistId?: string };
  patients: Patient[];
  therapists: Therapist[];
  allAppointments: Appointment[];
  availabilityBlocks: AvailabilityBlock[];
}

const AppointmentFormModal: React.FC<AppointmentFormModalProps> = ({ isOpen, onClose, onSave, onDelete, appointmentToEdit, initialData, patients, therapists, allAppointments, availabilityBlocks }) => {
  const [selectedPatient, setSelectedPatient] = useState<Patient | PatientSummary | null>(null);
  const [appointmentType, setAppointmentType] = useState(AppointmentType.Session);
  const [duration, setDuration] = useState(60);
  const [notes, setNotes] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const [recurrenceRule, setRecurrenceRule] = useState<RecurrenceRule | undefined>(undefined);
  const [isTeleconsultaEnabled, setIsTeleconsultaEnabled] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  
  const { showToast } = useToast();
  const modalRef = useRef<HTMLDivElement>(null);
  
  const slotDate = useMemo(() => appointmentToEdit?.startTime || initialData?.date || new Date(), [appointmentToEdit, initialData]);
  const [slotTime, setSlotTime] = useState(useMemo(() => format(slotDate, 'HH:mm'), [slotDate]));
  const [therapistId, setTherapistId] = useState(appointmentToEdit?.therapistId || initialData?.therapistId || therapists[0]?.id || '');
  const [endTime, setEndTime] = useState(() => format(addMinutes(new Date(), 60), 'HH:mm'));

  
  useEffect(() => {
    if (isOpen) {
        setIsTeleconsultaEnabled(schedulingSettingsService.getSettings().teleconsultaEnabled);
        if (appointmentToEdit) {
            const patient = patients.find(p => p.id === appointmentToEdit.patientId);
            setSelectedPatient(patient || null);
            setAppointmentType(appointmentToEdit.type);
            const dur = differenceInMinutes(new Date(appointmentToEdit.endTime), new Date(appointmentToEdit.startTime));
            setDuration(dur);
            setNotes(appointmentToEdit.observations || '');
            setTherapistId(appointmentToEdit.therapistId);
            setSlotTime(format(new Date(appointmentToEdit.startTime), 'HH:mm'));
            setEndTime(format(new Date(appointmentToEdit.endTime), 'HH:mm'));
            setRecurrenceRule(appointmentToEdit.recurrenceRule);
        } else {
            setSelectedPatient(null);
            setAppointmentType(AppointmentType.Session);
            const initialDuration = 60;
            setDuration(initialDuration);
            setNotes('');
            setTherapistId(initialData?.therapistId || therapists[0]?.id || '');
            const initialStartTime = initialData?.date || new Date();
            setSlotTime(format(initialStartTime, 'HH:mm'));
            setEndTime(format(addMinutes(initialStartTime, initialDuration), 'HH:mm'));
            setRecurrenceRule(undefined);
        }
        setErrorMessage(null);
    }
  }, [appointmentToEdit, initialData, isOpen, patients, therapists]);

  // Update end time when start time or duration changes
  useEffect(() => {
    const [hour, minute] = slotTime.split(':').map(Number);
    if (isNaN(hour) || isNaN(minute)) return;

    const startDate = setMinutes(setHours(new Date(slotDate), hour), minute);
    
    if (duration > 0) {
        const newEndTime = addMinutes(startDate, duration);
        setEndTime(format(newEndTime, 'HH:mm'));
    }
  }, [slotTime, duration, slotDate]);

  const handleEndTimeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newEndTimeStr = e.target.value;
    setEndTime(newEndTimeStr);

    const [startHour, startMinute] = slotTime.split(':').map(Number);
    const [endHour, endMinute] = newEndTimeStr.split(':').map(Number);
    
    if (isNaN(startHour) || isNaN(startMinute) || isNaN(endHour) || isNaN(endMinute)) return;

    const startDate = setMinutes(setHours(new Date(slotDate), startHour), startMinute);
    const endDate = setMinutes(setHours(new Date(slotDate), endHour), endMinute);

    if (endDate > startDate) {
        const newDuration = differenceInMinutes(endDate, startDate);
        setDuration(newDuration);
        setErrorMessage(null);
    } else {
        setDuration(0); // Invalid duration
        setErrorMessage("Hora final deve ser maior que a inicial.");
    }
  };

  const handleDurationClick = (newDuration: number) => {
    setDuration(newDuration);
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (modalRef.current && !modalRef.current.contains(event.target as Node)) {
        onClose();
      }
    };
    if(isOpen) {
        document.addEventListener('mousedown', handleClickOutside);
    }
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [onClose, isOpen]);

  const handleSaveClick = async () => {
    setErrorMessage(null);
    if (!selectedPatient) {
      showToast('Selecione um paciente para agendar.', 'error');
      return;
    }
    
    setIsSaving(true);
    
    const [startHour, startMinute] = slotTime.split(':').map(Number);
    const startTime = setMinutes(setHours(new Date(slotDate), startHour), startMinute);

    const [endHour, endMinute] = endTime.split(':').map(Number);
    const endTimeDate = setMinutes(setHours(new Date(slotDate), endHour), endMinute);

    if (endTimeDate <= startTime) {
      setErrorMessage('A hora de fim deve ser posterior à hora de início.');
      setIsSaving(false);
      return;
    }
    
    const baseAppointment: Appointment = {
      id: appointmentToEdit?.id || `app_${Date.now()}`,
      patientId: selectedPatient.id,
      patientName: selectedPatient.name,
      patientAvatarUrl: (selectedPatient as any).avatarUrl || `https://i.pravatar.cc/150?u=${selectedPatient.id}`,
      therapistId: therapistId,
      title: appointmentToEdit?.title || `${appointmentType}`,
      startTime: startTime,
      endTime: endTimeDate,
      status: appointmentToEdit?.status || AppointmentStatus.Scheduled,
      type: appointmentType,
      observations: notes,
      value: appointmentToEdit?.value || 120,
      paymentStatus: appointmentToEdit?.paymentStatus || 'pending',
      recurrenceRule: recurrenceRule,
      seriesId: appointmentToEdit?.seriesId,
    };
    
    const appointmentsToSave = generateRecurrences(baseAppointment);
    
    const conflict = findConflict(appointmentsToSave, allAppointments, availabilityBlocks, appointmentToEdit?.id);
    if (conflict) {
        let conflictMessage = 'Conflito de agendamento detectado.';
        if ('patientName' in conflict) { // It's an Appointment
            conflictMessage = `Conflito com o agendamento de ${conflict.patientName} em ${format(new Date(conflict.startTime), 'dd/MM HH:mm')}.`;
        } else { // It's an AvailabilityBlock
             conflictMessage = `Conflito com um bloqueio de horário (${conflict.title}) das ${format(new Date(conflict.startTime), 'HH:mm')} às ${format(new Date(conflict.endTime), 'HH:mm')}.`;
        }
        
        setErrorMessage(conflictMessage);
        setIsSaving(false);
        return;
    }

    let success = true;
    // For series, we save one by one. In a real app, this would be a single batch API call.
    for (const app of appointmentsToSave) {
        const result = await onSave(app);
        if(!result) {
            success = false;
            break;
        }
    }

    if (success) {
      onClose();
    }
    setIsSaving(false);
  };

  if (!isOpen) return null;
  const title = appointmentToEdit ? 'Editar Agendamento' : 'Novo Agendamento';

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div ref={modalRef} className="bg-white rounded-lg shadow-xl w-full max-w-lg mx-4 max-h-[90vh] flex flex-col">
        <div className="flex items-center justify-between p-4 border-b">
          <h2 className="text-xl font-semibold">{title}</h2>
          <button onClick={onClose} className="p-1 hover:bg-slate-100 rounded-full transition"><X className="w-5 h-5" /></button>
        </div>
        
        <div className="bg-sky-50 px-4 py-3 flex items-center justify-between text-sm">
          <div className="flex items-center gap-2"><Calendar className="w-4 h-4 text-sky-600" /><span className="font-medium">{format(slotDate, "EEEE, d 'de' MMMM", { locale: ptBR })}</span></div>
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1">
              <Clock className="w-4 h-4 text-sky-600" />
              <input type="time" value={slotTime} onChange={e => setSlotTime(e.target.value)} step="900" className="font-medium bg-transparent border-none p-0 focus:ring-0 w-16" />
            </div>
            <span>-</span>
            <div className="flex items-center gap-1">
               <input type="time" value={endTime} onChange={handleEndTimeChange} step="900" className="font-medium bg-transparent border-none p-0 focus:ring-0 w-16" />
            </div>
          </div>
        </div>
        
        <div className="p-4 space-y-4 overflow-y-auto">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">Paciente *</label>
            <PatientSearchInput
              onSelectPatient={setSelectedPatient}
              selectedPatient={selectedPatient}
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">Fisioterapeuta</label>
            <select
              value={therapistId}
              onChange={(e) => setTherapistId(e.target.value)}
              className="w-full px-3 py-2 border border-slate-300 rounded-md focus:ring-sky-500 focus:border-sky-500 text-sm"
            >
              {therapists.map(t => <option key={t.id} value={t.id}>{t.name}</option>)}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">Tipo de Atendimento</label>
            <select
              value={appointmentType}
              onChange={(e) => setAppointmentType(e.target.value as AppointmentType)}
              className="w-full px-3 py-2 border border-slate-300 rounded-md focus:ring-sky-500 focus:border-sky-500 text-sm"
            >
              {Object.values(AppointmentType)
                  .filter(type => isTeleconsultaEnabled || type !== AppointmentType.Teleconsulta)
                  .map(type => <option key={type} value={type}>{type}</option>)}
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">Duração ({duration > 0 ? `${duration} min` : 'Inválida'})</label>
            <div className="flex gap-2">
              {[30, 45, 60, 90].map(min => (
                <button
                  key={min}
                  type="button"
                  onClick={() => handleDurationClick(min)}
                  className={`px-4 py-2 rounded-md border transition text-sm ${
                    duration === min
                      ? 'bg-sky-500 text-white border-sky-500'
                      : 'bg-white text-slate-700 border-slate-300 hover:bg-slate-50'
                  }`}
                >
                  {min} min
                </button>
              ))}
            </div>
          </div>
          
          {!appointmentToEdit?.seriesId && <RecurrenceSelector recurrenceRule={recurrenceRule} onChange={setRecurrenceRule} />}

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">Observações</label>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              rows={3}
              className="w-full px-3 py-2 border border-slate-300 rounded-md focus:ring-sky-500 focus:border-sky-500 text-sm"
              placeholder="Observações sobre o atendimento..."
            />
          </div>
           {errorMessage && (
                <div className="bg-red-50 text-red-700 border border-red-200 rounded-lg text-sm p-3 flex items-start">
                    <AlertTriangle className="w-4 h-4 mr-2 mt-0.5" />
                    {errorMessage}
                </div>
            )}
        </div>
        
        <div className="flex items-center justify-end gap-3 px-4 py-3 bg-slate-50 rounded-b-lg border-t">
          <button onClick={onClose} className="px-4 py-2 text-slate-700 bg-white border border-slate-300 rounded-md hover:bg-slate-50 transition text-sm">Cancelar</button>
          <button
            onClick={handleSaveClick}
            disabled={!selectedPatient || isSaving || duration <= 0}
            className="px-4 py-2 bg-sky-500 text-white rounded-md hover:bg-sky-600 disabled:opacity-50 disabled:cursor-not-allowed transition flex items-center text-sm"
          >
            <Save className="w-4 h-4 mr-2"/>
            {isSaving ? 'Salvando...' : 'Confirmar Agendamento'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default AppointmentFormModal;
