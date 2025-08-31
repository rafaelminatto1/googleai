// src/components/layout/Sidebar.tsx
'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useSession, signOut } from 'next-auth/react';
import { 
    LayoutGrid, Users, Calendar, BarChart3, ShieldCheck, Cog, LogOut, Stethoscope, 
    ChevronLeft, ChevronRight, PieChart, Handshake, Dumbbell, BookMarked
} from 'lucide-react';
import { Role } from '@/types'; // Assuming Role enum is in types

const NavLink = ({ href, icon: Icon, label, isCollapsed }: { href: string, icon: React.ElementType, label: string, isCollapsed: boolean }) => {
    const pathname = usePathname();
    const isActive = pathname === href;

    return (
        <Link
          href={href}
          className={`flex items-center p-2.5 rounded-lg transition-colors duration-200 ${
              isActive
                ? 'bg-sky-500/10 text-sky-400 font-semibold'
                : 'text-slate-400 hover:bg-slate-800 hover:text-white'
            } ${isCollapsed ? 'justify-center' : ''}`}
          title={isCollapsed ? label : undefined}
        >
            <Icon className={`w-5 h-5 shrink-0 ${isCollapsed ? '' : 'mr-3'}`} />
            {!isCollapsed && <span className="truncate text-sm">{label}</span>}
        </Link>
    );
};

const NavGroup: React.FC<{ title: string; isCollapsed: boolean; children: React.ReactNode }> = ({ title, isCollapsed, children }) => (
    <div>
        {!isCollapsed && (
            <h3 className="px-3 pt-4 pb-2 text-xs font-semibold uppercase text-slate-500 tracking-wider">
                {title}
            </h3>
        )}
        <div className="space-y-1">
            {children}
        </div>
    </div>
);

export default function Sidebar() {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const { data: session } = useSession();
  const user = session?.user as any; 

  const navItems = [
    { href: '/dashboard', icon: LayoutGrid, label: 'Dashboard' },
    { href: '/dashboard/clinical-analytics', icon: PieChart, label: 'Dashboard Clínico' },
    { href: '/dashboard/pacientes', icon: Users, label: 'Pacientes' },
    { href: '/dashboard/agenda', icon: Calendar, label: 'Agenda' },
    { href: '/dashboard/exercises', icon: Dumbbell, label: 'Exercícios' },
    { href: '/dashboard/partnerships', icon: Handshake, label: 'Parcerias' },
    { href: '/dashboard/reports', icon: BarChart3, label: 'Relatórios' },
    { href: '/dashboard/audit-log', icon: ShieldCheck, label: 'Auditoria' },
    { href: '/dashboard/settings', icon: Cog, label: 'Configurações' },
  ];

  return (
    <div className={`transition-all duration-300 ease-in-out bg-slate-900 border-r border-slate-800 flex-col hidden lg:flex ${isCollapsed ? 'w-20' : 'w-64'}`}>
      <div className="flex items-center p-4 border-b border-slate-800 h-16 shrink-0">
        {!isCollapsed && <Stethoscope className="w-8 h-8 text-sky-400" />}
        {!isCollapsed && <span className="text-xl font-bold text-slate-50 ml-2">Fisio<span className="text-sky-400">Flow</span></span>}
        <button onClick={() => setIsCollapsed(!isCollapsed)} className={`p-1.5 rounded-full text-slate-400 hover:bg-slate-800 ${isCollapsed ? 'ml-auto' : 'ml-auto'}`}>
          {isCollapsed ? <ChevronRight className="w-5 h-5" /> : <ChevronLeft className="w-5 h-5" />}
        </button>
      </div>
      
      <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
        <NavGroup title="Principal" isCollapsed={isCollapsed}>
            {navItems.map((item) => <NavLink key={item.href} {...item} isCollapsed={isCollapsed} />)}
        </NavGroup>
      </nav>

      {user && (
         <div className="p-3 border-t border-slate-800 shrink-0">
            <div className="flex items-center w-full p-2 rounded-lg text-slate-400 hover:bg-slate-800 hover:text-white transition-colors duration-200">
                <img src={user.avatarUrl || `https://i.pravatar.cc/150?u=${user.id}`} alt={user.name || 'Avatar'} className="w-9 h-9 rounded-full shrink-0" />
                {!isCollapsed && (
                    <div className="ml-3 text-left flex-1 overflow-hidden">
                        <p className="text-sm font-semibold text-slate-100 truncate">{user.name}</p>
                        <p className="text-xs text-slate-400 capitalize">{String(user.role).toLowerCase()}</p>
                    </div>
                )}
                {!isCollapsed && (
                    <button onClick={() => signOut()} title="Sair" className="ml-2 p-2 rounded-md text-slate-500 hover:text-white">
                        <LogOut className="w-5 h-5" />
                    </button>
                )}
            </div>
        </div>
      )}
    </div>
  );
}
