import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import BottomNavigation from "@/components/BottomNavigation";
import Sidebar from "@/components/Sidebar";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Finbo - Aquarium Management",
  description: "Personal aquarium management application",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${geistSans.variable} ${geistMono.variable}`}>
      <body>
        <div className="app-layout">
          {/* Top peach/sky-blue background gradient (visible on mobile only) */}
          <div className="phone-gradient-header mobile-only" />
          
          <Sidebar />
          
          <main className="main-content">
            {children}
          </main>
          
          <BottomNavigation />
        </div>
      </body>
    </html>
  );
}
