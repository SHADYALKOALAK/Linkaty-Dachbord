"use client";

import { Bell } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";
import { useNotifications } from "@/store";
import { motion, AnimatePresence } from "framer-motion";

export function NotificationsDropdown() {
  const { notifications, unreadCount, markAsRead, markAllAsRead } =
    useNotifications();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className="relative">
          <Bell className="h-[1.2rem] w-[1.2rem]" />
          {unreadCount > 0 && (
            <span className="absolute -top-0.5 -right-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-primary text-[10px] font-medium text-primary-foreground">
              {unreadCount}
            </span>
          )}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-80">
        <DropdownMenuLabel className="flex items-center justify-between">
          <span>Notifications</span>
          {unreadCount > 0 && (
            <button
              onClick={markAllAsRead}
              className="text-xs text-muted-foreground hover:text-foreground transition-colors"
            >
              Mark all as read
            </button>
          )}
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuGroup className="max-h-72 overflow-y-auto">
          <AnimatePresence initial={false}>
            {notifications.length === 0 ? (
              <div className="px-2 py-4 text-center text-sm text-muted-foreground">
                No notifications
              </div>
            ) : (
              notifications.map((notification) => (
                <motion.div
                  key={notification.id}
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                >
                  <DropdownMenuItem
                    onClick={() => markAsRead(notification.id)}
                    className={cn(
                      "flex flex-col items-start gap-1 px-3 py-2 cursor-pointer",
                      !notification.read && "bg-muted/30"
                    )}
                  >
                    <div className="flex items-start justify-between w-full">
                      <span
                        className={cn(
                          "text-sm",
                          !notification.read && "font-medium"
                        )}
                      >
                        {notification.title}
                      </span>
                      {!notification.read && (
                        <span className="h-2 w-2 rounded-full bg-primary mt-1.5 flex-shrink-0" />
                      )}
                    </div>
                    <span className="text-xs text-muted-foreground">
                      {notification.description}
                    </span>
                    <span className="text-xs text-muted-foreground/60">
                      {notification.time}
                    </span>
                  </DropdownMenuItem>
                </motion.div>
              ))
            )}
          </AnimatePresence>
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
