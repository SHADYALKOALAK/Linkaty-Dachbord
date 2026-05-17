"use client";

import { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import {
  Search,
  Users,
  Link as LinkIcon,
  FolderKanban,
  LayoutDashboard,
} from "lucide-react";

export function SearchCommand() {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");

  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setOpen((open) => !open);
      }
    };
    document.addEventListener("keydown", down);
    return () => document.removeEventListener("keydown", down);
  }, []);

  const runSearch = useCallback(
    (query: string) => {
      if (!query.trim()) return;
      const q = query.toLowerCase();

      if (q.includes("user")) router.push("/dashboard/users");
      else if (q.includes("project")) router.push("/dashboard/projects");
      else if (q.includes("link")) router.push("/dashboard/links");
      else if (q.includes("home") || q.includes("dashboard"))
        router.push("/dashboard");

      setOpen(false);
      setSearch("");
    },
    [router]
  );

  if (!open) {
    return (
      <button
        onClick={() => setOpen(true)}
        className="inline-flex items-center gap-2 rounded-lg border border-input bg-background px-3 py-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors w-48"
      >
        <Search className="h-4 w-4" />
        <span>Search...</span>
        <kbd className="ml-auto pointer-events-none inline-flex h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium text-muted-foreground">
          <span className="text-xs">⌘</span>K
        </kbd>
      </button>
    );
  }

  return (
    <div className="fixed inset-0 z-50">
      <div
        className="fixed inset-0 bg-black/50 backdrop-blur-sm"
        onClick={() => {
          setOpen(false);
          setSearch("");
        }}
      />
      <div className="fixed left-1/2 top-[20%] -translate-x-1/2 w-full max-w-md rounded-xl border bg-background shadow-2xl overflow-hidden">
        <div className="flex items-center gap-2 px-4 border-b">
          <Search className="h-4 w-4 text-muted-foreground" />
          <input
            autoFocus
            placeholder="Search pages..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") runSearch(search);
              if (e.key === "Escape") {
                setOpen(false);
                setSearch("");
              }
            }}
            className="flex-1 h-11 bg-transparent text-sm outline-none placeholder:text-muted-foreground"
          />
        </div>
        <div className="p-2">
          <div className="px-2 py-1.5 text-xs text-muted-foreground font-medium">
            Pages
          </div>
          {[
            { icon: LayoutDashboard, label: "Dashboard", href: "/dashboard" },
            { icon: Users, label: "Users", href: "/dashboard/users" },
            {
              icon: FolderKanban,
              label: "Projects",
              href: "/dashboard/projects",
            },
            { icon: LinkIcon, label: "Links", href: "/dashboard/links" },
          ]
            .filter((item) =>
              item.label.toLowerCase().includes(search.toLowerCase())
            )
            .map((item) => (
              <button
                key={item.href}
                onClick={() => {
                  router.push(item.href);
                  setOpen(false);
                  setSearch("");
                }}
                className="flex items-center gap-3 w-full px-2 py-2 rounded-lg text-sm hover:bg-accent transition-colors"
              >
                <item.icon className="h-4 w-4 text-muted-foreground" />
                {item.label}
              </button>
            ))}
        </div>
      </div>
    </div>
  );
}
