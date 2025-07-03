"use client";

import { usePathname } from "next/navigation";
import { SidebarProvider } from "@/components/animate-ui/radix/sidebar";
import { AppSidebar } from "./Sidebar";

export default function SidebarWrapper() {
  const path = usePathname();

  // Wenn wir auf der Root "/" sind, keine Sidebar rendern
  if (path === "/") {
    return null;
  }

  return (
    <SidebarProvider>
      <AppSidebar />
    </SidebarProvider>
  );
}
