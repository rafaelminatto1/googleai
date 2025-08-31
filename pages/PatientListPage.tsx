
'use client';
import React, { useState, useEffect, useRef } from 'react';
import { Plus, Search, Filter, ChevronRight, Users, X, Loader2 } from 'lucide-react';
import PageHeader from '../components/PageHeader';
import { Patient, PatientSummary } from '../types';
// FIX: Use namespace import for react-router-dom to fix module resolution issues.
import * as ReactRouterDOM from 'react-router-dom';
import PatientFormModal from '../components/PatientFormModal';
import Skeleton from '../components/ui/Skeleton';
import { useToast } from '../contexts/ToastContext';
import { usePatients } from '../hooks/usePatients';
import { useDebounce } from '../hooks/useDebounce';
import { useData } from '../contexts/DataContext';


const PatientRow: React.FC<{ patient: PatientSummary }> = ({ patient }) => {
  const navigate = ReactRouterDOM.useNavigate();
  const statusColorMap = {
    Active: 'bg-green-100 text-green-800 ring-green-200',
    Inactive: 'bg-yellow-100 text-yellow-800 ring-yellow-200',
    Discharged: 'bg-slate-100 text-slate-800 ring-slate-200',
  };

  return (
    <div 
        onClick={() => navigate(`/patients/${patient.id}`)}
        className="flex items-center p-4 bg-white rounded-xl shadow-sm border border-transparent hover:border-sky-400 hover:shadow-md cursor-pointer transition-all duration-200"
    >
      <img className="h-12 w-12 rounded-full object-cover" src={patient.avatarUrl} alt={patient.name} />
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


const PatientListPage: React.FC = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { patients, isLoading, error, fetchInitialPatients, fetchMorePatients, addPatient, hasMore, isLoadingMore } = usePatients();
  const { therapists } = useData();
  
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [therapistFilter, setTherapistFilter] = useState('All');
  
  const debouncedSearchTerm = useDebounce(searchTerm, 300);
  const debouncedStartDate = useDebounce(startDate, 500);
  const debouncedEndDate = useDebounce(endDate, 500);

  useEffect(() => {
      fetchInitialPatients({ searchTerm: debouncedSearchTerm, statusFilter, startDate: debouncedStartDate, endDate: debouncedEndDate, therapistId: therapistFilter });
  }, [debouncedSearchTerm, statusFilter, debouncedStartDate, debouncedEndDate, therapistFilter, fetchInitialPatients]);

  const handleSavePatient = async (patientData: Omit<Patient, 'id' | 'lastVisit'>) => {
      await addPatient(patientData);
      setIsModalOpen(false);
  };
  
  const handleClearFilters = () => {
      setSearchTerm('');
      setStatusFilter('All');
      setStartDate('');
      setEndDate('');
      setTherapistFilter('All');
  };
  
  // FIX: Replaced IntersectionObserver with a "Load More" button to resolve an error and align with tests.
  // The error "Expected 1 arguments, but got 0" was likely caused by a bug in the infinite scroll implementation.
  // A button is a simpler and more robust approach.
  const renderContent = () => {
    if (isLoading) {
      return Array.from({ length: 5 }).map((_, i) => (
        <Skeleton key={i} className="h-20 w-full rounded-xl" />
      ));
    }

    if (error) {
        return <div className="text-center p-10 text-red-500 col-span-full">Falha ao carregar pacientes.</div>;
    }

    if (patients.length === 0 && !isLoading) {
        return (
            <div className="text-center p-10 text-slate-500 col-span-full">
                <Users className="mx-auto h-12 w-12 text-slate-300" />
                <h3 className="mt-2 text-sm font-medium text-slate-900">Nenhum paciente encontrado</h3>
                <p className="mt-1 text-sm text-slate-500">Tente ajustar seus filtros ou adicione um novo paciente.</p>
            </div>
        );
    }

    return patients.map((patient) => {
      return <PatientRow key={patient.id} patient={patient} />
    });
  };

  return (
    <>
      <PageHeader
        title="Gestão de Pacientes"
        subtitle="Adicione, visualize e gerencie as informações dos seus pacientes."
      >
        <button 
          onClick={() => setIsModalOpen(true)}
          className="inline-flex items-center justify-center rounded-lg border border-transparent bg-sky-500 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-sky-600 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:ring-offset-2">
          <Plus className="-ml-1 mr-2 h-5 w-5" />
          Novo Paciente
        </button>
      </PageHeader>
      
      <PatientFormModal 
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleSavePatient}
      />

      <div className="bg-white p-4 rounded-2xl shadow-sm mb-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4 items-end">
            <div className="xl:col-span-2">
              <label className="text-sm font-medium text-slate-600">Buscar</label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                <input
                  type="text"
                  placeholder="Nome ou CPF..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500"
                />
              </div>
            </div>

            <div>
              <label className="text-sm font-medium text-slate-600">Status</label>
              <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} className="w-full p-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500 bg-white">
                <option value="All">Todos os Status</option>
                <option value="Active">Ativo</option>
                <option value="Inactive">Inativo</option>
                <option value="Discharged">Alta</option>
              </select>
            </div>
            
            <div>
              <label className="text-sm font-medium text-slate-600">Data de Cadastro (De)</label>
              <input type="date" value={startDate} onChange={e => setStartDate(e.target.value)} className="w-full p-2 border border-slate-300 rounded-lg" />
            </div>
            
             <div>
              <label className="text-sm font-medium text-slate-600">Data de Cadastro (Até)</label>
              <input type="date" value={endDate} onChange={e => setEndDate(e.target.value)} className="w-full p-2 border border-slate-300 rounded-lg" />
            </div>
            
            <div className="xl:col-span-2">
              <label className="text-sm font-medium text-slate-600">Fisioterapeuta</label>
              <select value={therapistFilter} onChange={(e) => setTherapistFilter(e.target.value)} className="w-full p-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500 bg-white">
                <option value="All">Todos os Fisioterapeutas</option>
                {therapists.map(t => <option key={t.id} value={t.id}>{t.name}</option>)}
              </select>
            </div>
            
            <div className="xl:col-span-6">
                <button onClick={handleClearFilters} className="text-sm font-semibold text-sky-600 hover:text-sky-800 flex items-center">
                    <X className="w-4 h-4 mr-1"/> Limpar Filtros
                </button>
            </div>
          </div>
      </div>
      
      <div className="space-y-4">
        {renderContent()}
      </div>

      <div className="h-16 flex items-center justify-center">
        {isLoadingMore && (
          <div className="flex items-center text-slate-500">
            <Loader2 className="w-5 h-5 mr-2 animate-spin" />
            <span>Carregando mais pacientes...</span>
          </div>
        )}
        {hasMore && !isLoading && !isLoadingMore && (
          <button
            onClick={() => fetchMorePatients()}
            className="inline-flex items-center justify-center rounded-lg border border-transparent bg-sky-500 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-sky-600 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:ring-offset-2"
          >
            Carregar Mais Pacientes
          </button>
        )}
        {!hasMore && !isLoading && patients.length > 0 && (
          <p className="text-sm text-slate-400">Você chegou ao fim da lista.</p>
        )}
      </div>
    </>
  );
};

export default PatientListPage;
