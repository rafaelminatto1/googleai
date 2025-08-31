
import React, { useState, useRef, useEffect } from 'react';
import { Therapist } from '../types';
import { ChevronDown, Users } from 'lucide-react';

interface TherapistSelectorProps {
    therapists: Therapist[];
    selectedIds: string[];
    onChange: (selectedIds: string[]) => void;
}

const TherapistSelector: React.FC<TherapistSelectorProps> = ({ therapists, selectedIds, onChange }) => {
    const [isOpen, setIsOpen] = useState(false);
    const wrapperRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (wrapperRef.current && !wrapperRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const handleToggle = (therapistId: string) => {
        const newSelectedIds = selectedIds.includes(therapistId)
            ? selectedIds.filter(id => id !== therapistId)
            : [...selectedIds, therapistId];
        onChange(newSelectedIds);
    };
    
    const handleSelectAll = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.checked) {
            onChange(therapists.map(t => t.id));
        } else {
            onChange([]);
        }
    };

    const isAllSelected = selectedIds.length === therapists.length;

    return (
        <div className="relative" ref={wrapperRef}>
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="flex items-center gap-2 px-4 py-2 text-sm font-semibold bg-white border border-slate-300 rounded-lg hover:bg-slate-50 w-full text-left"
            >
                <Users className="w-4 h-4 text-slate-500" />
                <span className="flex-1">Fisioterapeutas ({selectedIds.length} / {therapists.length})</span>
                <ChevronDown className={`w-4 h-4 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
            </button>
            {isOpen && (
                <div className="absolute z-30 w-full mt-1 bg-white border border-slate-200 rounded-lg shadow-lg">
                    <div className="p-2 border-b">
                        <label className="flex items-center px-2 py-1 text-sm hover:bg-slate-50 rounded">
                             <input type="checkbox" checked={isAllSelected} onChange={handleSelectAll} className="h-4 w-4 rounded border-gray-300 text-sky-600 focus:ring-sky-500"/>
                            <span className="ml-2 font-semibold">Selecionar Todos</span>
                        </label>
                    </div>
                    <div className="p-2 max-h-60 overflow-y-auto">
                        {therapists.map(therapist => (
                            <label key={therapist.id} className="flex items-center px-2 py-1 text-sm hover:bg-slate-50 rounded">
                                <input
                                    type="checkbox"
                                    checked={selectedIds.includes(therapist.id)}
                                    onChange={() => handleToggle(therapist.id)}
                                    className="h-4 w-4 rounded border-gray-300 text-sky-600 focus:ring-sky-500"
                                />
                                <span className="ml-2">{therapist.name}</span>
                            </label>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
};

export default TherapistSelector;
