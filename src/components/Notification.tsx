'use client';

import { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";

// Define the shape of a notification
interface NotificationType {
  message: string;
}

export function Notification() {
  const [notifications, setNotifications] = useState<NotificationType[]>([]);

  useEffect(() => {
    const fetchNotifications = () => {
      fetch("/api/notifications")
        .then((res) => res.json())
        .then((data) => setNotifications(data.notifications));
    };

    fetchNotifications();

    const interval = setInterval(fetchNotifications, 10000); // fetch every 10s
    return () => clearInterval(interval);
  }, []);

  if (!notifications.length) return null;

  return (
    <div className="fixed top-4 right-4 space-y-2 z-50">
      {notifications.map((n, i) => (
        <Card key={i} className="p-4 bg-yellow-100">{n.message}</Card>
      ))}
    </div>
  );
}
