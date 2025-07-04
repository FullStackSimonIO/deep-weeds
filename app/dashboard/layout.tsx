// app/dashboard/layout.tsx
"use client";

import { MobileSidebarSheet } from "@/components/MobileSidebarSheet";
import SidebarWrapper from "@/components/SidebarWrapper";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen flex flex-col md:flex-row">
      {/* sheet trigger (only visible <md) */}
      <MobileSidebarSheet />

      {/* real sidebar (only visible ≥md) */}
      <div className="hidden md:flex md:flex-col">
        <SidebarWrapper />
      </div>

      {/* main content always flex-1 */}
      <main className="flex-1 p-6 overflow-auto">{children}</main>
    </div>
  );
}
