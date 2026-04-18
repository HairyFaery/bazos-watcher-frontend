import type { Metadata } from "next";
import { Inter, Geist_Mono } from "next/font/google";
import "./globals.css";
import ClientLayout from "./ClientLayout";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "BazosWatcher Dashboard",
  description: "Správa produktov z Bazos.inzercia",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="sk" className="dark">
      <body className={`${inter.variable} ${geistMono.variable} antialiased bg-slate-900 text-slate-50`}>
        <ClientLayout>
          {children}
        </ClientLayout>
      </body>
    </html>
  );
}