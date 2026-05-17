"use client";

import { useParams } from "next/navigation";
import Link from "next/link";
import { useUser } from "@/hooks/use-users";
import { useUserProjects } from "@/hooks/use-projects";
import { useUserLinks } from "@/hooks/use-links";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { formatDate, getInitials } from "@/lib/utils";
import {
  ArrowLeft,
  FolderKanban,
  Link as LinkIcon,
  Mail,
  MapPin,
  Briefcase,
  FileText,
  BookOpen,
} from "lucide-react";

export default function UserDetailPage() {
  const params = useParams();
  const userId = params.id as string;

  const { data: user, isLoading, error } = useUser(userId);
  const { data: projects, isLoading: projectsLoading } = useUserProjects(userId);
  const { data: links, isLoading: linksLoading } = useUserLinks(userId);

  if (error) {
    return (
      <div className="text-center py-12">
        <p className="text-destructive font-medium">Failed to load user</p>
        <p className="text-sm text-muted-foreground mt-1">{error.message}</p>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-8 w-48" />
        <div className="grid gap-6 md:grid-cols-3">
          <Card><CardContent className="p-6"><Skeleton className="h-40 w-full" /></CardContent></Card>
          <Card className="md:col-span-2"><CardContent className="p-6"><Skeleton className="h-40 w-full" /></CardContent></Card>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground">User not found</p>
      </div>
    );
  }

  const infoItems = [
    { icon: Mail, label: "Email", value: user.email },
    { icon: Briefcase, label: "Job Type", value: user.typeOfJop || "—" },
    { icon: MapPin, label: "Location", value: user.location || "—" },
    { icon: BookOpen, label: "Specialization", value: user.specialization || "—" },
    { icon: FileText, label: "Bio", value: user.bio || "—" },
  ];

  return (
    <div className="space-y-6">
      <Link href="/dashboard/users" className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground transition-colors">
        <ArrowLeft className="h-4 w-4" /> Back to Users
      </Link>

      <div className="grid gap-6 md:grid-cols-3">
        <Card>
          <CardContent className="p-6 flex flex-col items-center text-center">
            <Avatar className="h-24 w-24 border-2 mb-4">
              <AvatarImage src={user.image || ""} />
              <AvatarFallback className="text-2xl">{getInitials(user.fullName)}</AvatarFallback>
            </Avatar>
            <h2 className="text-xl font-bold">{user.fullName}</h2>
            <div className="flex gap-2 mt-2">
              <Badge variant={user.is_profile_active ? "success" : "secondary"}>
                {user.is_profile_active ? "Active" : "Inactive"}
              </Badge>
              <Badge variant={user.isVerified ? "success" : "secondary"}>
                {user.isVerified ? "Verified" : "Unverified"}
              </Badge>
            </div>
            <p className="text-xs text-muted-foreground mt-3">
              Joined {formatDate(user.created_at)}
            </p>
            <div className="flex gap-4 mt-4 pt-4 border-t w-full justify-center">
              <div className="text-center">
                <p className="text-lg font-bold">{user.project_count}</p>
                <p className="text-xs text-muted-foreground">Projects</p>
              </div>
              <div className="text-center">
                <p className="text-lg font-bold">{user.link_count}</p>
                <p className="text-xs text-muted-foreground">Links</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle>Profile Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {infoItems.map((item) => (
              <div key={item.label} className="flex items-start gap-3">
                <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-primary/10 shrink-0 mt-0.5">
                  <item.icon className="h-4 w-4 text-primary" />
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">{item.label}</p>
                  <p className="text-sm">{item.value}</p>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader className="flex flex-row items-center gap-2">
          <FolderKanban className="h-5 w-5 text-primary" />
          <CardTitle>Projects ({projects?.length || 0})</CardTitle>
        </CardHeader>
        <CardContent>
          {projectsLoading ? (
            <div className="space-y-3">
              {Array.from({ length: 3 }).map((_, i) => <Skeleton key={i} className="h-12 w-full" />)}
            </div>
          ) : !projects?.length ? (
            <p className="text-sm text-muted-foreground py-4 text-center">No projects</p>
          ) : (
            <div className="space-y-2">
              {projects.map((project) => (
                <div key={project.id} className="flex items-center justify-between p-3 rounded-lg border">
                  <div>
                    <p className="text-sm font-medium">{project.name}</p>
                    {project.description && (
                      <p className="text-xs text-muted-foreground">{project.description}</p>
                    )}
                  </div>
                  {project.link && (
                    <a href={project.link} target="_blank" rel="noopener noreferrer" className="text-xs text-primary hover:underline shrink-0">
                      Visit
                    </a>
                  )}
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center gap-2">
          <LinkIcon className="h-5 w-5 text-primary" />
          <CardTitle>Links ({links?.length || 0})</CardTitle>
        </CardHeader>
        <CardContent>
          {linksLoading ? (
            <div className="space-y-3">
              {Array.from({ length: 3 }).map((_, i) => <Skeleton key={i} className="h-12 w-full" />)}
            </div>
          ) : !links?.length ? (
            <p className="text-sm text-muted-foreground py-4 text-center">No links</p>
          ) : (
            <div className="space-y-2">
              {links.map((link) => (
                <div key={link.id} className="flex items-center justify-between p-3 rounded-lg border">
                  <p className="text-sm font-medium">{link.name}</p>
                  <a href={link.link} target="_blank" rel="noopener noreferrer" className="text-xs text-primary hover:underline shrink-0">
                    Visit
                  </a>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
