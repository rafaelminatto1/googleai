// src/components/auth/LoginHeader.tsx
import React from 'react';
import { Stethoscope } from 'lucide-react';

const LoginHeader = () => (
    <div className="text-center mb-8">
        <Stethoscope className="w-12 h-12 text-sky-500 mx-auto" />
        <h1 className="mt-4 text-3xl font-bold text-slate-800">Fisio<span className="text-sky-500">Flow</span></h1>
        <p className="mt-2 text-sm text-slate-500">Acesse sua conta para continuar.</p>
    </div>
);

export default LoginHeader;
