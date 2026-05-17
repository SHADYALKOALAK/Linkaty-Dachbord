"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ChevronRight, Home } from "lucide-react";
import { cn } from "@/lib/utils";

const routeLabels: Record<string, string> = {
  dashboard: "Dashboard",
  users: "Users",
  projects: "Projects",
  links: "Links",
};

export function Breadcrumbs() {
  const pathname = usePathname();
  const segments = pathname.split("/").filter(Boolean);

  if (segments.length === 0) return null;

  return (
    <nav className="flex items-center gap-1.5 text-sm text-muted-foreground mb-4">
      <Link
        href="/dashboard"
        className="hover:text-foreground transition-colors"
      >
        <Home className="h-4 w-4" />
      </Link>
      {segments.map((segment, index) => {
        const href = "/" + segments.slice(0, index + 1).join("/");
        const label = routeLabels[segment] || segment;
        const isLast = index === segments.length - 1;

        return (
          <div key={segment} className="flex items-center gap-1.5">
            <ChevronRight className="h-4 w-4" />
            {isLast ? (
              <span className="text-foreground font-medium">{label}</span>
            ) : (
              <Link
                href={href}
                className="hover:text-foreground transition-colors"
              >
                {label}
              </Link>
            )}
          </div>
        );
      })}
    </nav>
  );
}
