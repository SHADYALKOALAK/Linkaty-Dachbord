"use client";

import { useState } from "react";
import { useLinks, useDeleteLink } from "@/hooks/use-links";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { EmptyState } from "@/components/shared/empty-state";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  ArrowUpDown,
  Copy,
  ExternalLink,
  MoreHorizontal,
  Pencil,
  Search,
  Trash2,
  Link as LinkIcon,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { formatDate, truncate } from "@/lib/utils";
import { toast } from "sonner";
import type { LinkWithDetails } from "@/types";

export function LinksTable() {
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [sortField, setSortField] = useState("created_at");
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("desc");
  const [deleteDialog, setDeleteDialog] = useState<number | null>(null);

  const { data, isLoading, error } = useLinks({
    search,
    page,
    pageSize: 10,
    sortField,
    sortDirection,
  });

  const deleteLinkMutation = useDeleteLink();
  const totalPages = data?.count ? Math.ceil(data.count / 10) : 1;

  const handleSort = (field: string) => {
    if (sortField === field) {
      setSortDirection((prev) => (prev === "asc" ? "desc" : "asc"));
    } else {
      setSortField(field);
      setSortDirection("desc");
    }
  };

  const handleDelete = async (id: number) => {
    try {
      await deleteLinkMutation.mutateAsync(id);
      toast.success("Link deleted");
      setDeleteDialog(null);
    } catch {
      toast.error("Failed to delete link");
    }
  };

  const copyToClipboard = (url: string) => {
    navigator.clipboard.writeText(url);
    toast.success("Link copied to clipboard");
  };

  if (error) {
    return (
      <EmptyState
        title="Failed to load links"
        description="Error loading links."
        icon={<LinkIcon className="h-8 w-8 text-muted-foreground/50" />}
        action={{ label: "Retry", onClick: () => window.location.reload() }}
      />
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search links..."
            value={search}
            onChange={(e) => { setSearch(e.target.value); setPage(1); }}
            className="pl-9"
          />
        </div>
      </div>

      <div className="rounded-xl border bg-card/50 backdrop-blur-sm">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>
                <button onClick={() => handleSort("name")} className="flex items-center gap-1 hover:text-foreground">
                  Name <ArrowUpDown className="h-3 w-3" />
                </button>
              </TableHead>
              <TableHead>URL</TableHead>
              <TableHead>Owner</TableHead>
              <TableHead>
                <button onClick={() => handleSort("created_at")} className="flex items-center gap-1 hover:text-foreground">
                  Created <ArrowUpDown className="h-3 w-3" />
                </button>
              </TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              Array.from({ length: 5 }).map((_, i) => (
                <TableRow key={i}>
                  {Array.from({ length: 5 }).map((_, j) => (
                    <TableCell key={j}><Skeleton className="h-4 w-full" /></TableCell>
                  ))}
                </TableRow>
              ))
            ) : data?.data.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5}>
                  <EmptyState title="No links found" description="No links match your search." icon={<LinkIcon className="h-8 w-8 text-muted-foreground/50" />} />
                </TableCell>
              </TableRow>
            ) : (
              data?.data.map((link: LinkWithDetails) => (
                <TableRow key={link.id}>
                  <TableCell>
                    <p className="text-sm font-medium">{link.name}</p>
                  </TableCell>
                  <TableCell>
                    <span className="text-xs text-muted-foreground">{truncate(link.link, 40)}</span>
                  </TableCell>
                  <TableCell className="text-sm text-muted-foreground">{link.owner_name || truncate(link.user_id, 8)}</TableCell>
                  <TableCell className="text-sm text-muted-foreground">{formatDate(link.created_at)}</TableCell>
                  <TableCell className="text-right">
                    <div className="flex items-center justify-end gap-1">
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Button variant="ghost" size="icon" onClick={() => copyToClipboard(link.link)}>
                              <Copy className="h-4 w-4" />
                            </Button>
                          </TooltipTrigger>
                          <TooltipContent>Copy link</TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon"><MoreHorizontal className="h-4 w-4" /></Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem>
                            <ExternalLink className="mr-2 h-4 w-4" />Open
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            <Pencil className="mr-2 h-4 w-4" />Edit
                          </DropdownMenuItem>
                          <DropdownMenuItem className="text-destructive focus:text-destructive" onClick={() => setDeleteDialog(link.id)}>
                            <Trash2 className="mr-2 h-4 w-4" />Delete
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      <div className="flex items-center justify-between">
        <p className="text-sm text-muted-foreground">Page {page} of {totalPages} ({data?.count || 0} total)</p>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1}>
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <Button variant="outline" size="sm" onClick={() => setPage(p => Math.min(totalPages, p + 1))} disabled={page === totalPages}>
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <Dialog open={deleteDialog !== null} onOpenChange={() => setDeleteDialog(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Link</DialogTitle>
            <DialogDescription>Are you sure you want to delete this link?</DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeleteDialog(null)}>Cancel</Button>
            <Button variant="destructive" onClick={() => deleteDialog !== null && handleDelete(deleteDialog)} disabled={deleteLinkMutation.isPending}>
              {deleteLinkMutation.isPending ? "Deleting..." : "Delete"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
