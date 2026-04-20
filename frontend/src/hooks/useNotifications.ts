"use client";

import { useEffect, useRef, useCallback, useState } from "react";
import { getSocket } from "@/hooks/useSocket";
import {
  getNotifications,
  markNotificationRead,
  markAllNotificationsRead,
  type AppNotification,
} from "@/lib/api";

export type NotificationState = {
  notifications: AppNotification[];
  unreadCount: number;
  loading: boolean;
  markRead: (id: string) => Promise<void>;
  markAllRead: () => Promise<void>;
};

export function useNotifications(token: string | null): NotificationState {
  const [notifications, setNotifications] = useState<AppNotification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [loading, setLoading] = useState(false);
  const fetchedRef = useRef(false);

  useEffect(() => {
    if (!token || fetchedRef.current) return;
    fetchedRef.current = true;

    setLoading(true);
    getNotifications()
      .then(({ data, unreadCount: count }) => {
        setNotifications(data);
        setUnreadCount(count);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [token]);

  useEffect(() => {
    if (!token) return;
    const socket = getSocket(token);

    function onNewNotification({ notification }: { notification: AppNotification }) {
      setNotifications((prev) => [notification, ...prev]);
      setUnreadCount((c) => c + 1);
    }

    socket.on("new_notification", onNewNotification);
    return () => {
      socket.off("new_notification", onNewNotification);
    };
  }, [token]);

  const markRead = useCallback(
    async (id: string) => {
      const wasUnread = notifications.find((n) => n._id === id && !n.lu);
      await markNotificationRead(id);
      setNotifications((prev) =>
        prev.map((n) => (n._id === id ? { ...n, lu: true } : n))
      );
      if (wasUnread) {
        setUnreadCount((c) => Math.max(0, c - 1));
      }
    },
    [notifications]
  );

  const markAllRead = useCallback(async () => {
    await markAllNotificationsRead();
    setNotifications((prev) => prev.map((n) => ({ ...n, lu: true })));
    setUnreadCount(0);
  }, []);

  return { notifications, unreadCount, loading, markRead, markAllRead };
}
