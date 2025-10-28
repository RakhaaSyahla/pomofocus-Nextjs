// app/layout.tsx

import type { Metadata } from "next";
// HAPUS import "./globals.css";
// import "./globals.css"; <-- JANGAN DIPAKAI DI SINI!

import Header from "@/app/components/Header"; 

// Dapatkan BASE_PATH dari environment variable yang kita set di package.json
// Ini akan bernilai '/pomofocus-Nextjs' saat build.
const BASE_PATH = process.env.NEXT_PUBLIC_BASE_PATH || '';

export const metadata: Metadata = {
  title: "Pomofocus Clone",
  description: "Timer Pomodoro buatan Next.js",
  icons: {
    // Pastikan path favicon menggunakan BASE_PATH
    icon: `${BASE_PATH}/icon.png`, 
  }
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        {    /* Link ke stylesheet global dengan BASE_PATH */}
        <link rel="stylesheet" href={`${BASE_PATH}/globals.css`} />
      </head>
      <body>
        <Header /> 
        <main className="main-content">
          {children}
        </main>
      </body>
    </html>
  );
}
