import Link from "next/link";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuItem,
} from "./animate-ui/radix/sidebar";

import { Home } from "lucide-react";
import { UploadCloud } from "lucide-react";
import { Video } from "lucide-react";

export function AppSidebar() {
  //const isMobile = useIsMobile();

  return (
    <Sidebar collapsible="icon">
      <SidebarHeader>
        <h1 className="text-2xl font-bold">Deep Weeds Dashboard</h1>
        <p className="text-sm text-muted-foreground">
          Verwende die Sidebar, um auf verschiedene Funktionen zuzugreifen.
        </p>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Navigation</SidebarGroupLabel>
          <SidebarMenu>
            <SidebarMenuItem className="flex">
              <Home className="mr-2 w-4 " />
              <Link href="/">Home</Link>
            </SidebarMenuItem>
            <SidebarMenuItem className="flex">
              <UploadCloud className="mr-2 w-4 " />
              <Link href="/dashboard/image-upload">Image Upload</Link>
            </SidebarMenuItem>
            <SidebarMenuItem className="flex">
              <Video className="mr-2  w-4" />
              <Link href="/webcam">Webcam</Link>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter />
    </Sidebar>
  );
}
