// src/app/(auth)/login/page.tsx
'use client';

import LoginHeader from '@/components/auth/LoginHeader';
import LoginForm from '@/components/auth/LoginForm';

export default function LoginPage() {
  return (
    <div className="flex items-center justify-center min-h-screen bg-slate-100 p-4">
      <div className="w-full max-w-sm mx-auto">
        <LoginHeader />
        <LoginForm />
         <div className="text-center text-xs text-slate-500 mt-4 space-y-1">
            <p>Use <code className="bg-slate-200 p-1 rounded-sm">admin@fisioflow.com</code> / <code className="bg-slate-200 p-1 rounded-sm">password123</code></p>
         </div>
      </div>
    </div>
  );
}