"use client";

import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  LayoutDashboard,
  Users,
  FolderKanban,
  Link as LinkIcon,
  ChevronLeft,
  LogOut,
  Settings,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { useSidebar } from "@/store";
import { signOut } from "@/services/auth";
import { toast } from "sonner";

const navItems = [
  { href: "/dashboard", label: "Overview", icon: LayoutDashboard },
  { href: "/dashboard/users", label: "Users", icon: Users },
  { href: "/dashboard/projects", label: "Projects", icon: FolderKanban },
  { href: "/dashboard/links", label: "Links", icon: LinkIcon },
];

export function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const { isOpen, toggle } = useSidebar();

  const handleSignOut = async () => {
    try {
      await signOut();
      toast.success("Signed out successfully");
      router.push("/login");
    } catch {
      toast.error("Failed to sign out");
    }
  };

  return (
    <AnimatePresence mode="wait">
      <motion.aside
        initial={false}
        animate={{ width: isOpen ? 240 : 72 }}
        transition={{ duration: 0.2, ease: "easeInOut" }}
        className="fixed left-0 top-0 z-40 h-screen border-r border-border/50 bg-background/80 backdrop-blur-xl flex flex-col"
      >
        <div className="flex items-center h-14 px-4 border-b border-border/50">
          <Link
            href="/dashboard"
            className={cn(
              "flex items-center gap-2 font-semibold",
              !isOpen && "justify-center w-full"
            )}
          >
            <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-primary/10">
              <span className="text-sm font-bold text-primary">A</span>
            </div>
            <AnimatePresence mode="wait">
              {isOpen && (
                <motion.span
                  initial={{ opacity: 0, width: 0 }}
                  animate={{ opacity: 1, width: "auto" }}
                  exit={{ opacity: 0, width: 0 }}
                  className="text-sm font-semibold"
                >
                  Admin
                </motion.span>
              )}
            </AnimatePresence>
          </Link>
        </div>

        <nav className="flex-1 p-2 space-y-1">
          {navItems.map((item) => {
            const isActive =
              item.href === "/dashboard"
                ? pathname === "/dashboard"
                : pathname.startsWith(item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200",
                  isActive
                    ? "bg-primary/10 text-primary"
                    : "text-muted-foreground hover:text-foreground hover:bg-accent/50",
                  !isOpen && "justify-center px-2"
                )}
              >
                <item.icon className="h-4 w-4 flex-shrink-0" />
                <AnimatePresence mode="wait">
                  {isOpen && (
                    <motion.span
                      initial={{ opacity: 0, width: 0 }}
                      animate={{ opacity: 1, width: "auto" }}
                      exit={{ opacity: 0, width: 0 }}
                    >
                      {item.label}
                    </motion.span>
                  )}
                </AnimatePresence>
              </Link>
            );
          })}
        </nav>

        <div className="p-2 border-t border-border/50 space-y-1">
          <button
            onClick={() => router.push("/dashboard/settings")}
            className={cn(
              "flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 w-full text-muted-foreground hover:text-foreground hover:bg-accent/50",
              !isOpen && "justify-center px-2"
            )}
          >
            <Settings className="h-4 w-4 flex-shrink-0" />
            <AnimatePresence mode="wait">
              {isOpen && (
                <motion.span
                  initial={{ opacity: 0, width: 0 }}
                  animate={{ opacity: 1, width: "auto" }}
                  exit={{ opacity: 0, width: 0 }}
                >
                  Settings
                </motion.span>
              )}
            </AnimatePresence>
          </button>

          <button
            onClick={handleSignOut}
            className={cn(
              "flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 w-full text-muted-foreground hover:text-destructive hover:bg-destructive/10",
              !isOpen && "justify-center px-2"
            )}
          >
            <LogOut className="h-4 w-4 flex-shrink-0" />
            <AnimatePresence mode="wait">
              {isOpen && (
                <motion.span
                  initial={{ opacity: 0, width: 0 }}
                  animate={{ opacity: 1, width: "auto" }}
                  exit={{ opacity: 0, width: 0 }}
                >
                  Sign Out
                </motion.span>
              )}
            </AnimatePresence>
          </button>

          <Button
            variant="ghost"
            size="icon"
            onClick={toggle}
            className={cn("w-full mt-1", !isOpen && "flex justify-center")}
          >
            <ChevronLeft
              className={cn(
                "h-4 w-4 transition-transform duration-200",
                !isOpen && "rotate-180"
              )}
            />
          </Button>
        </div>
      </motion.aside>
    </AnimatePresence>
  );
}
