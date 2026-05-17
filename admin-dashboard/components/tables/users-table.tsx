"use client";

import { useState } from "react";
import Link from "next/link";
import { useUsers, useUpdateUserStatus, useDeleteUser } from "@/hooks/use-users";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { EmptyState } from "@/components/shared/empty-state";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Switch } from "@/components/ui/switch";
import { ArrowUpDown, Eye, MoreHorizontal, Search, Trash2, Users, ChevronLeft, ChevronRight } from "lucide-react";
import { formatDate, getInitials } from "@/lib/utils";
import { toast } from "sonner";
import type { User } from "@/types";

export function UsersTable() {
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [sortField, setSortField] = useState("created_at");
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("desc");
  const [deleteDialog, setDeleteDialog] = useState<string | null>(null);

  const { data, isLoading, error } = useUsers({ search, page, pageSize: 10, sortField, sortDirection });
  const updateStatus = useUpdateUserStatus();
  const deleteUserMutation = useDeleteUser();
  const totalPages = data?.count ? Math.ceil(data.count / 10) : 1;

  const handleSort = (field: string) => {
    if (sortField === field) setSortDirection((prev) => (prev === "asc" ? "desc" : "asc"));
    else { setSortField(field); setSortDirection("desc"); }
  };

  const handleDelete = async (id: string) => {
    try {
      await deleteUserMutation.mutateAsync(id);
      toast.success("User deleted");
      setDeleteDialog(null);
    } catch { toast.error("Failed to delete user"); }
  };

  const handleToggleActive = async (user: User) => {
    try {
      await updateStatus.mutateAsync({
        userId: user.id,
        isActive: !user.is_profile_active,
        isVerified: user.isVerified,
      });
      toast.success(`${user.fullName}: ${!user.is_profile_active ? "Activated" : "Deactivated"}`);
    } catch (err: unknown) {
      const msg = extractErrorMessage(err);
      toast.error(msg);
    }
  };

  const handleToggleVerified = async (user: User) => {
    try {
      await updateStatus.mutateAsync({
        userId: user.id,
        isActive: user.is_profile_active,
        isVerified: !user.isVerified,
      });
      toast.success(`${user.fullName}: ${!user.isVerified ? "Verified" : "Unverified"}`);
    } catch (err: unknown) {
      const msg = extractErrorMessage(err);
      toast.error(msg);
    }
  };

  if (error) {
    return (
      <EmptyState title="Failed to load users" description="Error loading users."
        icon={<Users className="h-8 w-8 text-muted-foreground/50" />}
        action={{ label: "Retry", onClick: () => window.location.reload() }} />
    );
  }

  return (
    <div className="space-y-4">
      <div className="relative flex-1 max-w-sm">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input placeholder="Search users..." value={search} onChange={(e) => { setSearch(e.target.value); setPage(1); }} className="pl-9" />
      </div>

      <div className="rounded-xl border bg-card/50 backdrop-blur-sm">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[220px]"><button onClick={() => handleSort("fullName")} className="flex items-center gap-1 hover:text-foreground">User <ArrowUpDown className="h-3 w-3" /></button></TableHead>
              <TableHead className="w-[100px]">Active</TableHead>
              <TableHead className="w-[100px]">Verified</TableHead>
              <TableHead><button onClick={() => handleSort("created_at")} className="flex items-center gap-1 hover:text-foreground">Joined <ArrowUpDown className="h-3 w-3" /></button></TableHead>
              <TableHead className="text-right w-[80px]">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              Array.from({ length: 5 }).map((_, i) => (
                <TableRow key={i}>
                  <TableCell><div className="flex items-center gap-3"><Skeleton className="h-9 w-9 rounded-full" /><div className="space-y-1.5"><Skeleton className="h-4 w-32" /><Skeleton className="h-3 w-24" /></div></div></TableCell>
                  <TableCell><Skeleton className="h-6 w-12" /></TableCell>
                  <TableCell><Skeleton className="h-6 w-12" /></TableCell>
                  <TableCell><Skeleton className="h-4 w-20" /></TableCell>
                  <TableCell><Skeleton className="h-8 w-8 ml-auto" /></TableCell>
                </TableRow>
              ))
            ) : data?.data.length === 0 ? (
              <TableRow><TableCell colSpan={5}>
                <EmptyState title="No users found" description="No users match your search." icon={<Users className="h-8 w-8 text-muted-foreground/50" />} />
              </TableCell></TableRow>
            ) : (
              data?.data.map((user: User) => (
                <TableRow key={user.id}>
                  <TableCell>
                    <Link href={`/dashboard/users/${user.id}`} className="flex items-center gap-3 group">
                      <Avatar className="h-9 w-9 border"><AvatarImage src={user.image || ""} /><AvatarFallback className="text-xs">{getInitials(user.fullName)}</AvatarFallback></Avatar>
                      <div>
                        <p className="text-sm font-medium group-hover:text-primary transition-colors">{user.fullName}</p>
                        <p className="text-xs text-muted-foreground">{user.email}</p>
                      </div>
                    </Link>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Switch
                        checked={user.is_profile_active}
                        onCheckedChange={() => handleToggleActive(user)}
                        disabled={updateStatus.isPending}
                      />
                      <span className="text-xs text-muted-foreground">{user.is_profile_active ? "On" : "Off"}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Switch
                        checked={user.isVerified}
                        onCheckedChange={() => handleToggleVerified(user)}
                        disabled={updateStatus.isPending}
                      />
                      <span className="text-xs text-muted-foreground">{user.isVerified ? "Yes" : "No"}</span>
                    </div>
                  </TableCell>
                  <TableCell className="text-sm text-muted-foreground">{formatDate(user.created_at)}</TableCell>
                  <TableCell className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild><Button variant="ghost" size="icon"><MoreHorizontal className="h-4 w-4" /></Button></DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem asChild><Link href={`/dashboard/users/${user.id}`} className="flex items-center"><Eye className="mr-2 h-4 w-4" />View</Link></DropdownMenuItem>
                        <DropdownMenuItem className="text-destructive focus:text-destructive" onClick={() => setDeleteDialog(user.id)}>
                          <Trash2 className="mr-2 h-4 w-4" />Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
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
          <Button variant="outline" size="sm" onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1}><ChevronLeft className="h-4 w-4" /></Button>
          <Button variant="outline" size="sm" onClick={() => setPage(p => Math.min(totalPages, p + 1))} disabled={page === totalPages}><ChevronRight className="h-4 w-4" /></Button>
        </div>
      </div>

      <Dialog open={!!deleteDialog} onOpenChange={() => setDeleteDialog(null)}>
        <DialogContent>
          <DialogHeader><DialogTitle>Delete User</DialogTitle><DialogDescription>This action cannot be undone.</DialogDescription></DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeleteDialog(null)}>Cancel</Button>
            <Button variant="destructive" onClick={() => deleteDialog && handleDelete(deleteDialog)} disabled={deleteUserMutation.isPending}>
              {deleteUserMutation.isPending ? "Deleting..." : "Delete"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

function extractErrorMessage(err: unknown): string {
  if (!err) return "An unknown error occurred (empty error)";

  const e = err as Record<string, unknown>;

  if (e.code === "RLS_ERROR") {
    return "RLS blocks the update. Go to Supabase Dashboard → SQL Editor → run sql/rls_policies.sql";
  }

  if (typeof e.message === "string" && e.message.length > 0) {
    return e.message;
  }

  console.error("[UsersTable] Unrecognized error shape:", err);
  return `An error occurred: ${JSON.stringify(err)}`;
}
