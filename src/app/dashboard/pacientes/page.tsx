// src/app/dashboard/pacientes/page.tsx
import prisma from '@/lib/prisma';
import PatientListClient from '@/components/pacientes/PatientListClient';
import PageHeader from '@/components/layout/PageHeader';
import { PatientStatus } from '@/types';

type PacientesPageProps = {
  searchParams: {
    q?: string;
    status?: string;
  };
};

export default async function PacientesPage({ searchParams }: PacientesPageProps) {
  const take = 15;
  const { q: searchTerm = '', status = 'All' } = searchParams;
  
  const where: any = {};

  if (searchTerm) {
      where.OR = [
        { name: { contains: searchTerm, mode: 'insensitive' } },
        { cpf: { contains: searchTerm, mode: 'insensitive' } },
      ];
  }

  if (status && status !== 'All') {
    where.status = status as PatientStatus;
  }
  
  const initialPatients = await prisma.patient.findMany({
    take,
    where,
    select: {
      id: true,
      name: true,
      cpf: true,
      phone: true,
      email: true,
      status: true,
      avatarUrl: true,
      lastVisit: true,
    },
    orderBy: { createdAt: 'desc' },
  });
  
  const nextCursor = initialPatients.length === take ? initialPatients[initialPatients.length - 1].id : null;
  
  const initialData = {
      items: initialPatients,
      nextCursor,
  }

  return (
    <>
      <PageHeader
        title="Gestão de Pacientes"
        subtitle="Adicione, visualize e gerencie as informações dos seus pacientes."
      />
      <PatientListClient initialData={JSON.parse(JSON.stringify(initialData))} />
    </>
  );
}