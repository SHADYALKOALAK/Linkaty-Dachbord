"use client";

import { Menu } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useSidebar } from "@/store";
import { SearchCommand } from "@/components/shared/search-command";
import { NotificationsDropdown } from "@/components/shared/notifications-dropdown";
import { ThemeSwitcher } from "@/components/shared/theme-switcher";
import { UserNav } from "./user-nav";

export function TopNav() {
  const { toggle } = useSidebar();

  return (
    <header className="sticky top-0 z-30 h-14 border-b border-border/50 bg-background/80 backdrop-blur-xl">
      <div className="flex items-center justify-between h-full px-4 gap-4">
        <div className="flex items-center gap-3">
          <Button
            variant="ghost"
            size="icon"
            onClick={toggle}
            className="lg:hidden"
          >
            <Menu className="h-5 w-5" />
          </Button>
          <SearchCommand />
        </div>
        <div className="flex items-center gap-2">
          <ThemeSwitcher />
          <NotificationsDropdown />
          <UserNav />
        </div>
      </div>
    </header>
  );
}
