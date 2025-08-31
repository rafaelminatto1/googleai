// src/app/dashboard/layout.tsx
import React from 'react';
import Sidebar from '@/components/layout/Sidebar';
import AiAssistant from '@/components/AiAssistant';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="flex h-screen bg-slate-100">
      <Sidebar />
      <main className="flex-1 flex flex-col overflow-hidden">
        <div className="flex-1 overflow-x-hidden overflow-y-auto p-4 sm:p-6 lg:p-8">
            {children}
        </div>
        <AiAssistant />
      </main>
    </div>
  );
}
