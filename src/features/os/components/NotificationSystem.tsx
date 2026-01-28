"use client";

import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, CheckCircle, AlertCircle, Info } from "lucide-react";

export interface Notification {
  id: string;
  title: string;
  message: string;
  type: "success" | "error" | "info" | "warning";
  duration?: number;
}

const notificationStore = React.createContext<{
  notifications: Notification[];
  addNotification: (notification: Omit<Notification, "id">) => void;
  removeNotification: (id: string) => void;
} | null>(null);

export function NotificationProvider({ children }: { children: React.ReactNode }) {
  const [notifications, setNotifications] = React.useState<Notification[]>([]);

  const addNotification = (notification: Omit<Notification, "id">) => {
    const id = `${Date.now()}-${Math.random()}`;
    const fullNotification: Notification = { ...notification, id };
    
    setNotifications((prev) => [...prev, fullNotification]);

    if (notification.duration !== 0) {
      setTimeout(
        () => removeNotification(id),
        notification.duration || 4000
      );
    }
  };

  const removeNotification = (id: string) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id));
  };

  return (
    <notificationStore.Provider value={{ notifications, addNotification, removeNotification }}>
      {children}
      <NotificationContainer />
    </notificationStore.Provider>
  );
}

export function useNotifications() {
  const context = React.useContext(notificationStore);
  if (!context) {
    throw new Error("useNotifications must be used within NotificationProvider");
  }
  return context;
}

function NotificationContainer() {
  const { notifications, removeNotification } = useNotifications();

  const getIcon = (type: Notification["type"]) => {
    const iconProps = { size: 20, className: "flex-shrink-0" };
    switch (type) {
      case "success":
        return <CheckCircle {...iconProps} className="text-green-400" />;
      case "error":
        return <AlertCircle {...iconProps} className="text-red-400" />;
      case "warning":
        return <AlertCircle {...iconProps} className="text-yellow-400" />;
      case "info":
      default:
        return <Info {...iconProps} className="text-blue-400" />;
    }
  };

  const getStyles = (type: Notification["type"]) => {
    switch (type) {
      case "success":
        return "bg-green-500/10 border-green-500/30";
      case "error":
        return "bg-red-500/10 border-red-500/30";
      case "warning":
        return "bg-yellow-500/10 border-yellow-500/30";
      case "info":
      default:
        return "bg-blue-500/10 border-blue-500/30";
    }
  };

  return (
    <div className="fixed bottom-6 left-6 z-[9998] pointer-events-none space-y-3 max-w-sm">
      <AnimatePresence mode="popLayout">
        {notifications.map((notification) => (
          <motion.div
            key={notification.id}
            initial={{ opacity: 0, x: -100, y: 20 }}
            animate={{ opacity: 1, x: 0, y: 0 }}
            exit={{ opacity: 0, x: -100, y: 20 }}
            transition={{ duration: 0.2 }}
            className={`flex items-start gap-3 px-4 py-3 rounded-lg border backdrop-blur-xl text-white pointer-events-auto ${getStyles(
              notification.type
            )}`}
          >
            {getIcon(notification.type)}
            <div className="flex-1 min-w-0">
              {notification.title && (
                <p className="font-semibold text-sm mb-0.5">{notification.title}</p>
              )}
              <p className="text-xs text-white/80">{notification.message}</p>
            </div>
            <button
              onClick={() => removeNotification(notification.id)}
              className="flex-shrink-0 text-white/40 hover:text-white/80 transition ml-2"
            >
              <X size={16} />
            </button>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}
