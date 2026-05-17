"use client";

import { useSidebar } from "@/store";
import { Sidebar } from "./sidebar";
import { TopNav } from "./topnav";
import { cn } from "@/lib/utils";

export function AppShell({ children }: { children: React.ReactNode }) {
  const { isOpen } = useSidebar();

  return (
    <div className="min-h-screen bg-background">
      <Sidebar />
      <div
        className={cn(
          "transition-all duration-200",
          isOpen ? "lg:ml-60" : "lg:ml-18"
        )}
      >
        <TopNav />
        <main className="p-4 md:p-6">{children}</main>
      </div>
    </div>
  );
}
