// src/components/pacientes/PatientFormModal.tsx
'use client';

import React, { useState, useTransition } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { X, Save, Loader2 } from 'lucide-react';
import { Patient } from '@/types';
import { useToast } from "@/components/ui/use-toast";
// import { createPatient, updatePatient } from '@/lib/actions/patient.actions';

// Simplified schema for the client-side form
const formSchema = z.object({
  name: z.string().min(2, "Nome é obrigatório"),
  cpf: z.string().min(11, "CPF é obrigatório"),
  email: z.string().email("Email inválido").optional().or(z.literal('')),
});
type FormData = z.infer<typeof formSchema>;

interface PatientFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  patientToEdit?: Patient;
}

export default function PatientFormModal({ isOpen, onClose, onSuccess, patientToEdit }: PatientFormModalProps) {
  const { toast } = useToast();
  const [isPending, startTransition] = useTransition();

  const { register, handleSubmit, formState: { errors } } = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: patientToEdit || { name: '', cpf: '', email: '' }
  });

  const onSubmit = (data: FormData) => {
    startTransition(async () => {
      // In a real app, this would call a server action
      console.log("Saving patient data (simulated):", data);
      await new Promise(res => setTimeout(res, 1000));
      
      toast({
        title: patientToEdit ? "Paciente atualizado!" : "Paciente criado!",
        description: `${data.name} foi salvo com sucesso.`,
      });
      onSuccess();

      /* Example with Server Actions:
      const result = patientToEdit 
        ? await updatePatient(patientToEdit.id, data) 
        : await createPatient(data);
      if (result.success) {
        toast({ title: "Sucesso!", description: result.message });
        onSuccess();
      } else {
        toast({ title: "Erro", description: result.message, variant: "destructive" });
      }
      */
    });
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg max-h-[90vh] flex flex-col">
        <header className="flex items-center justify-between p-5 border-b border-slate-200">
          <h2 className="text-lg font-bold text-slate-800">{patientToEdit ? 'Editar Paciente' : 'Novo Paciente'}</h2>
          <button onClick={onClose} className="p-2 rounded-full hover:bg-slate-100"><X /></button>
        </header>
        <form onSubmit={handleSubmit(onSubmit)} className="flex-1 overflow-y-auto p-6 space-y-4">
          <div>
            <label>Nome Completo*</label>
            <input {...register('name')} className="mt-1 w-full p-2 border rounded-lg" />
            {errors.name && <p className="text-xs text-red-500 mt-1">{errors.name.message}</p>}
          </div>
          <div>
            <label>CPF*</label>
            <input {...register('cpf')} className="mt-1 w-full p-2 border rounded-lg" />
            {errors.cpf && <p className="text-xs text-red-500 mt-1">{errors.cpf.message}</p>}
          </div>
          <div>
            <label>Email</label>
            <input {...register('email')} className="mt-1 w-full p-2 border rounded-lg" />
            {errors.email && <p className="text-xs text-red-500 mt-1">{errors.email.message}</p>}
          </div>
        </form>
         <footer className="flex justify-end items-center p-4 border-t border-slate-200 bg-slate-50">
            <button onClick={onClose} className="px-4 py-2 text-sm mr-2 border rounded-lg">Cancelar</button>
            <button onClick={handleSubmit(onSubmit)} disabled={isPending} className="px-4 py-2 text-sm text-white bg-sky-500 rounded-lg flex items-center disabled:bg-sky-300">
              {isPending ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Save className="w-4 h-4 mr-2" />}
              {isPending ? 'Salvando...' : 'Salvar'}
            </button>
        </footer>
      </div>
    </div>
  );
}
