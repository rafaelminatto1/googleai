// src/components/pacientes/PatientListClient.tsx
'use client';

import React, { useState, useEffect, useTransition } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Plus, Search, Filter, ChevronRight, Users, Loader2 } from 'lucide-react';
import { PatientSummary } from '@/types';
import PatientFormModal from './PatientFormModal'; // Assuming migration
import { useDebounce } from '@/hooks/useDebounce'; // Assuming migration

interface PatientListClientProps {
  initialData: {
    items: PatientSummary[];
    nextCursor: string | null;
  };
}

const PatientRow: React.FC<{ patient: PatientSummary }> = ({ patient }) => {
  const router = useRouter();
  const statusColorMap: { [key: string]: string } = {
    Active: 'bg-green-100 text-green-800 ring-green-200',
    Inactive: 'bg-yellow-100 text-yellow-800 ring-yellow-200',
    Discharged: 'bg-slate-100 text-slate-800 ring-slate-200',
  };

  return (
    <div 
        onClick={() => router.push(`/dashboard/pacientes/${patient.id}`)}
        className="flex items-center p-4 bg-white rounded-xl shadow-sm border border-transparent hover:border-sky-400 hover:shadow-md cursor-pointer transition-all duration-200"
    >
      <img className="h-12 w-12 rounded-full object-cover" src={patient.avatarUrl || `https://i.pravatar.cc/150?u=${patient.id}`} alt={patient.name} />
      <div className="ml-4 flex-1">
        <div className="text-md font-bold text-slate-800">{patient.name}</div>
        <div className="text-sm text-slate-500">{patient.email || patient.phone}</div>
      </div>
      <div className="hidden md:block">
        <span className={`px-3 py-1 text-xs leading-5 font-semibold rounded-full ring-1 ring-inset ${statusColorMap[patient.status]}`}>
          {patient.status}
        </span>
      </div>
      <ChevronRight className="w-6 h-6 text-slate-400 ml-4" />
    </div>
  );
};

export default function PatientListClient({ initialData }: PatientListClientProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();
  
  const [patients, setPatients] = useState(initialData.items);
  const [searchTerm, setSearchTerm] = useState(searchParams.get('q') || '');
  const [statusFilter, setStatusFilter] = useState(searchParams.get('status') || 'All');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const debouncedSearchTerm = useDebounce(searchTerm, 300);

  useEffect(() => {
    setPatients(initialData.items);
  }, [initialData]);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    if (debouncedSearchTerm) {
      params.set('q', debouncedSearchTerm);
    } else {
      params.delete('q');
    }
    if (statusFilter !== 'All') {
        params.set('status', statusFilter);
    } else {
        params.delete('status');
    }
    
    startTransition(() => {
        router.replace(`/dashboard/pacientes?${params.toString()}`);
    });
  }, [debouncedSearchTerm, statusFilter, router]);
  
  return (
    <>
      <PatientFormModal 
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSuccess={() => {
            setIsModalOpen(false);
            // Refresh the page to show the new patient
            startTransition(() => {
                router.refresh();
            });
        }}
      />
      <div className="bg-white p-4 rounded-2xl shadow-sm mb-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="relative w-full sm:w-auto sm:flex-1">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
            <input
              type="text"
              placeholder="Buscar por nome ou CPF..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-slate-300 rounded-full focus:outline-none focus:ring-2 focus:ring-sky-500"
            />
          </div>
          <div className="relative w-full sm:w-auto">
             <Filter className="absolute left-3.5 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="appearance-none w-full sm:w-48 pl-10 pr-4 py-2 border border-slate-300 rounded-full focus:outline-none focus:ring-2 focus:ring-sky-500 bg-white"
            >
              <option value="All">Todos os Status</option>
              <option value="Active">Ativo</option>
              <option value="Inactive">Inativo</option>
              <option value="Discharged">Alta</option>
            </select>
          </div>
           <button 
                onClick={() => setIsModalOpen(true)}
                className="inline-flex items-center justify-center rounded-lg border border-transparent bg-sky-500 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-sky-600">
                <Plus className="-ml-1 mr-2 h-5 w-5" />
                Novo Paciente
            </button>
      </div>
      
      <div className="space-y-4">
        {isPending ? (
            <div className="flex items-center justify-center p-10"><Loader2 className="w-8 h-8 animate-spin text-sky-500"/></div>
        ) : patients.length > 0 ? (
            patients.map(patient => <PatientRow key={patient.id} patient={patient} />)
        ) : (
             <div className="text-center p-10 text-slate-500 col-span-full">
                <Users className="mx-auto h-12 w-12 text-slate-300" />
                <h3 className="mt-2 text-sm font-medium text-slate-900">Nenhum paciente encontrado</h3>
                <p className="mt-1 text-sm text-slate-500">Tente ajustar seus filtros ou adicione um novo paciente.</p>
            </div>
        )}
      </div>
    </>
  );
}
