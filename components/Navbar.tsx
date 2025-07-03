// components/Navbar.tsx
"use client";

import Link from "next/link";
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { List, X } from "lucide-react";
import Image from "next/image";

export default function Navbar() {
  const navItems = [
    { title: "Home", href: "/" },
    { title: "Upload", href: "/upload" },
    { title: "Camera", href: "/camera" },
  ];

  return (
    <header className="w-full bg-background border-b border-gray-700">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between h-16">
        {/* logo / brand */}
        <Link href="/" className="flex items-center space-x-2">
          <Image
            src="/logo.svg"
            alt="Plant.ID logo"
            width={32}
            height={32}
            className="block"
          />
          <span className="text-xl font-bold">Plant.ID</span>
        </Link>
        {/* desktop nav */}
        <nav className="hidden md:flex space-x-8">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="text-sm font-medium hover:text-primary transition"
            >
              {item.title}
            </Link>
          ))}
        </nav>

        {/* mobile popover */}
        <div className="md:hidden">
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="ghost" className="p-2" aria-label="Open menu">
                <List className="w-6 h-6" />
              </Button>
            </PopoverTrigger>
            <PopoverContent
              align="end"
              className="w-48 p-2 bg-background border border-gray-700 rounded-md"
            >
              <div className="flex flex-col space-y-2">
                {navItems.map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    className="px-4 py-2 rounded hover:bg-gray-800 transition"
                  >
                    {item.title}
                  </Link>
                ))}
                <Button
                  variant="ghost"
                  className="self-end p-1"
                  aria-label="Close menu"
                >
                  <X className="w-5 h-5" />
                </Button>
              </div>
            </PopoverContent>
          </Popover>
        </div>
      </div>
    </header>
  );
}
