// app/layout.tsx
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import AuthProvider from "@/components/auth/AuthProvider";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "FisioFlow",
  description: "Sistema de gestão para sua clínica de fisioterapia.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR">
      <body className={inter.className}>
        <AuthProvider>
          {children}
        </AuthProvider>
      </body>
    </html>
  );
}
