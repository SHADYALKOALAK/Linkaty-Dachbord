"use client";

import { LinksTable } from "@/components/tables/links-table";
import { Link as LinkIcon } from "lucide-react";

export default function LinksPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-primary/10">
          <LinkIcon className="h-5 w-5 text-primary" />
        </div>
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Links</h1>
          <p className="text-sm text-muted-foreground">
            View and manage all links
          </p>
        </div>
      </div>
      <LinksTable />
    </div>
  );
}
