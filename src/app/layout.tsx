// src/app/layout.tsx
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import AuthProvider from "@/components/auth/AuthProvider";
import "./globals.css";
import { Toaster } from "@/components/ui/Toaster";

const inter = Inter({ subsets: ["latin"], variable: '--font-sans' });

export const metadata: Metadata = {
  title: {
    template: '%s | FisioFlow',
    default: 'FisioFlow - Gestão Inteligente para Clínicas',
  },
  description: "Otimize a gestão da sua clínica de fisioterapia com agendamentos, prontuários eletrônicos e IA. Aumente a eficiência e o engajamento dos pacientes.",
  keywords: ["fisioterapia", "gestão de clínica", "prontuário eletrônico", "agenda online", "saúde", "software para fisioterapeutas"],
  manifest: "/manifest.json",
  themeColor: "#0ea5e9",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="pt-BR" suppressHydrationWarning>
      <body className={`font-sans ${inter.variable} bg-slate-50 antialiased`}>
        <AuthProvider>
          {children}
        </AuthProvider>
        <Toaster />
      </body>
    </html>
  );
}