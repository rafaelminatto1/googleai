
import React from 'react';
import { EnrichedAppointment, AppointmentStatus } from '../types';
import { cn } from '../lib/utils';
import { Repeat, DollarSign } from 'lucide-react';

interface AppointmentCardProps {
  appointment: EnrichedAppointment;
  startHour: number;
  pixelsPerMinute: number;
  isBeingDragged: boolean;
  onClick: () => void;
  onDragStart: (e: React.DragEvent<HTMLDivElement>) => void;
  onDragEnd: (e: React.DragEvent<HTMLDivElement>) => void;
}

const getAppointmentStyle = (color: string) => {
    switch (color) {
        case 'purple': return 'bg-purple-500 border-purple-700';
        case 'emerald': return 'bg-emerald-500 border-emerald-700';
        case 'blue': return 'bg-blue-500 border-blue-700';
        case 'amber': return 'bg-amber-500 border-amber-700';
        case 'red': return 'bg-red-500 border-red-700';
        case 'indigo': return 'bg-indigo-500 border-indigo-700';
        case 'teal': return 'bg-teal-500 border-teal-700';
        case 'sky': return 'bg-sky-500 border-sky-700';
        default: return 'bg-slate-500 border-slate-700';
    }
};

const AppointmentCard: React.FC<AppointmentCardProps> = ({ appointment, startHour, pixelsPerMinute, isBeingDragged, onClick, onDragStart, onDragEnd }) => {
  const top = ((new Date(appointment.startTime).getHours() - startHour) * 60 + new Date(appointment.startTime).getMinutes()) * pixelsPerMinute;
  const durationInMinutes = (new Date(appointment.endTime).getTime() - new Date(appointment.startTime).getTime()) / (60 * 1000);
  const height = durationInMinutes * pixelsPerMinute;
  
  const isCompleted = appointment.status === AppointmentStatus.Completed;
  const isCancelled = appointment.status === AppointmentStatus.Canceled || appointment.status === AppointmentStatus.NoShow;

  const style = getAppointmentStyle(appointment.therapistColor);

  return (
    <div
      onClick={(e) => { e.stopPropagation(); onClick(); }}
      draggable="true"
      onDragStart={onDragStart}
      onDragEnd={onDragEnd}
      className={cn(
          "absolute left-1 right-1 p-2 rounded-lg text-white text-xs z-10 cursor-pointer transition-all overflow-hidden flex flex-col group border-l-4",
          style,
          (isCompleted || isCancelled) && 'opacity-60 hover:opacity-100',
          isBeingDragged && 'opacity-50 ring-2 ring-sky-400'
      )}
      style={{ top: `${top}px`, height: `${height}px`, minHeight: '20px' }}
    >
      <div
        title={appointment.paymentStatus === 'paid' ? 'Pagamento Realizado' : 'Pagamento Pendente'}
        className={cn(
            'absolute top-1.5 right-1.5 w-4 h-4 rounded-full flex items-center justify-center ring-2 ring-white opacity-90 group-hover:opacity-100',
            appointment.paymentStatus === 'paid' ? 'bg-green-500' : 'bg-amber-400'
        )}
      >
        <DollarSign className={cn('w-2.5 h-2.5', appointment.paymentStatus === 'paid' ? 'text-white' : 'text-amber-900')} />
      </div>
      <div className="flex-grow min-h-0">
        <p className={cn("font-bold truncate pr-4", isCancelled && "line-through")}>{appointment.patientName}</p>
        <p className="truncate text-xs opacity-90">{appointment.type}</p>
      </div>
      {appointment.seriesId && (
        <div className="flex-shrink-0 mt-auto text-right">
            <Repeat className="w-3 h-3 text-white/70" />
        </div>
      )}
    </div>
  );
};

export default AppointmentCard;
