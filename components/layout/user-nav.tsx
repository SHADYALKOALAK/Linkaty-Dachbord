"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { getInitials } from "@/lib/utils";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { signOut } from "@/services/auth";
import { useRouter } from "next/navigation";
import { useAuth } from "@/hooks/use-auth";
import { toast } from "sonner";
import { LogOut, User } from "lucide-react";

export function UserNav() {
  const { user, loading } = useAuth();
  const router = useRouter();

  const handleSignOut = async () => {
    try {
      await signOut();
      toast.success("Signed out");
      router.push("/login");
    } catch {
      toast.error("Failed to sign out");
    }
  };

  if (loading) {
    return <div className="h-9 w-9 rounded-full bg-muted animate-pulse" />;
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button className="flex items-center gap-2 rounded-full outline-none">
          <Avatar className="h-9 w-9 border-2 border-border">
            <AvatarImage src={user?.user_metadata?.avatar_url} />
            <AvatarFallback className="text-xs">
              {user?.email ? getInitials(user.email) : "A"}
            </AvatarFallback>
          </Avatar>
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56">
        <DropdownMenuLabel>
          <div className="flex flex-col space-y-1">
            <p className="text-sm font-medium">
              {user?.user_metadata?.full_name || "Admin"}
            </p>
            <p className="text-xs text-muted-foreground">{user?.email}</p>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={() => router.push("/dashboard")}>
          <User className="mr-2 h-4 w-4" />
          Dashboard
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={handleSignOut}>
          <LogOut className="mr-2 h-4 w-4" />
          Sign out
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
