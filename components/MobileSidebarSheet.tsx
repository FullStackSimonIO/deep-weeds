// components/MobileSidebarSheet.tsx
"use client";

import {
  Sheet,
  SheetTrigger,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { MenuIcon } from "lucide-react";
import Link from "next/link";

export function MobileSidebarSheet() {
  return (
    <Sheet>
      {/* 1) Trigger: fixed top-left on small screens */}
      <SheetTrigger asChild>
        <button
          className="
            md:hidden 
            fixed top-4 left-4 z-50 
            p-2 rounded-md bg-background/80 backdrop-blur
            hover:bg-background"
          aria-label="Open menu"
        >
          <MenuIcon className="h-6 w-6 text-white" />
        </button>
      </SheetTrigger>

      {/* 2) Drawer content slides in from right */}
      <SheetContent
        side="right"
        className="
          fixed inset-y-0 right-0 
          w-screen max-w-none 
          md:hidden 
          bg-background  
          flex flex-col
        "
      >
        {/* a11y title */}
        <SheetHeader>
          <SheetTitle className="sr-only">Main menu</SheetTitle>
        </SheetHeader>

        {/* your nav links, each wrapped in a SheetTrigger to auto-close */}
        <nav className="flex-1 flex flex-col justify-center items-center space-y-6 px-6">
          <SheetTrigger asChild>
            <Link href="/" className="text-lg">
              Home
            </Link>
          </SheetTrigger>
          <SheetTrigger asChild>
            <Link href="/dashboard/image-upload" className="text-lg">
              Upload Image
            </Link>
          </SheetTrigger>
          <SheetTrigger asChild>
            <Link href="/dashboard/webcam" className="text-lg">
              Webcam
            </Link>
          </SheetTrigger>
        </nav>
      </SheetContent>
    </Sheet>
  );
}
