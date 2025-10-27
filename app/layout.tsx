// app/layout.tsx

import type { Metadata } from "next";
import "./globals.css";
// 1. Impor komponen Header
import Header from "@/app/components/Header";

export const metadata: Metadata = {
  title: "Pomofocus Clone", // Judulnya juga bisa di-update
  description: "Timer Pomodoro buatan Next.js",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      {/* 2. Hapus className font Geist dari body */}
      <body>
        {/* 3. Tambahkan Header di sini */}
        <Header />

        {/* 4. Bungkus children dengan <main> */}
        <main className="main-content">{children}</main>
      </body>
    </html>
  );
}
