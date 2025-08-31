
import React from 'react';
import { AvailabilityBlock } from '../types';
import { Lock } from 'lucide-react';

interface AvailabilityBlockCardProps {
    block: AvailabilityBlock;
    startHour: number;
    pixelsPerMinute: number;
}

const AvailabilityBlockCard: React.FC<AvailabilityBlockCardProps> = ({ block, startHour, pixelsPerMinute }) => {
    const top = ((new Date(block.startTime).getHours() - startHour) * 60 + new Date(block.startTime).getMinutes()) * pixelsPerMinute;
    const durationInMinutes = (new Date(block.endTime).getTime() - new Date(block.startTime).getTime()) / (60 * 1000);
    const height = durationInMinutes * pixelsPerMinute;

    return (
        <div
            className="absolute left-0 right-0 p-2 rounded-md text-slate-600 text-xs z-5 flex flex-col items-center justify-center bg-slate-200/70 border-l-4 border-slate-400 overflow-hidden"
            style={{
                top: `${top}px`,
                height: `${height}px`,
                minHeight: '20px'
            }}
            title={block.title}
        >
             <div 
                className="absolute inset-0 opacity-20" 
                style={{
                    backgroundImage: 'linear-gradient(45deg, #b0b0b0 25%, transparent 25%, transparent 75%, #b0b0b0 75%, #b0b0b0), linear-gradient(-45deg, #b0b0b0 25%, transparent 25%, transparent 75%, #b0b0b0 75%, #b0b0b0)',
                    backgroundSize: '8px 8px'
                }}
            />
            <div className="relative flex items-center gap-1 font-semibold">
                <Lock size={12} />
                <span className="truncate">{block.title}</span>
            </div>
        </div>
    );
};

export default AvailabilityBlockCard;
