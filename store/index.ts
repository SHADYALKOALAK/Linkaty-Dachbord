import { create } from "zustand";

interface SidebarState {
  isOpen: boolean;
  toggle: () => void;
  setOpen: (open: boolean) => void;
}

export const useSidebar = create<SidebarState>((set) => ({
  isOpen: true,
  toggle: () => set((state) => ({ isOpen: !state.isOpen })),
  setOpen: (open) => set({ isOpen: open }),
}));

interface Notification {
  id: string;
  title: string;
  description: string;
  time: string;
  read: boolean;
  type: "info" | "success" | "warning" | "error";
}

interface NotificationState {
  notifications: Notification[];
  unreadCount: number;
  addNotification: (notification: Notification) => void;
  markAsRead: (id: string) => void;
  markAllAsRead: () => void;
  clearNotifications: () => void;
}

const defaultNotifications: Notification[] = [
  {
    id: "1",
    title: "New user registered",
    description: "John Doe has created an account",
    time: "2 minutes ago",
    read: false,
    type: "info",
  },
  {
    id: "2",
    title: "Project created",
    description: "New project 'Marketing Campaign' was created",
    time: "15 minutes ago",
    read: false,
    type: "success",
  },
  {
    id: "3",
    title: "Link click threshold",
    description: "Link 'Summer Sale' reached 1000 clicks",
    time: "1 hour ago",
    read: false,
    type: "warning",
  },
  {
    id: "4",
    title: "System update",
    description: "Platform will be under maintenance at 2 AM",
    time: "2 hours ago",
    read: true,
    type: "info",
  },
];

export const useNotifications = create<NotificationState>((set) => ({
  notifications: defaultNotifications,
  unreadCount: defaultNotifications.filter((n) => !n.read).length,
  addNotification: (notification) =>
    set((state) => ({
      notifications: [notification, ...state.notifications],
      unreadCount: state.unreadCount + (notification.read ? 0 : 1),
    })),
  markAsRead: (id) =>
    set((state) => ({
      notifications: state.notifications.map((n) =>
        n.id === id ? { ...n, read: true } : n
      ),
      unreadCount: state.notifications.filter((n) => !n.read).length - 1,
    })),
  markAllAsRead: () =>
    set((state) => ({
      notifications: state.notifications.map((n) => ({ ...n, read: true })),
      unreadCount: 0,
    })),
  clearNotifications: () => set({ notifications: [], unreadCount: 0 }),
}));
