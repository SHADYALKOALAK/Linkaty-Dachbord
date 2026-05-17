"use client";

import { ProjectsTable } from "@/components/tables/projects-table";
import { FolderKanban } from "lucide-react";

export default function ProjectsPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-primary/10">
          <FolderKanban className="h-5 w-5 text-primary" />
        </div>
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Projects</h1>
          <p className="text-sm text-muted-foreground">
            View and manage all projects
          </p>
        </div>
      </div>
      <ProjectsTable />
    </div>
  );
}
