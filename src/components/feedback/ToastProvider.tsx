import { useCallback, useState, type ReactNode } from "react";

import {
  ToastContext,
  type FeedbackNotification,
  type ToastContextValue,
} from "./toast-context";

import { Toast } from "./Toast";

interface ToastProviderProps {
  children: ReactNode;
}

export function ToastProvider({ children }: ToastProviderProps) {
  const [notifications, setNotifications] = useState<FeedbackNotification[]>(
    [],
  );

  const notify = useCallback(
    (notification: Omit<FeedbackNotification, "id">) => {
      const id = crypto.randomUUID();

      setNotifications((currentNotifications) => [
        ...currentNotifications,
        {
          id,
          ...notification,
        },
      ]);

      setTimeout(() => {
        setNotifications((currentNotifications) =>
          currentNotifications.map((currentNotification) =>
            currentNotification.id === id
              ? {
                  ...currentNotification,
                  isExiting: true,
                }
              : currentNotification,
          ),
        );
      }, 3700);

      setTimeout(() => {
        setNotifications((currentNotifications) =>
          currentNotifications.filter(
            (currentNotification) => currentNotification.id !== id,
          ),
        );
      }, 4000);
    },
    [],
  );

  const value: ToastContextValue = {
    notify,
  };

  return (
    <ToastContext.Provider value={value}>
      {children}

      <div className="fixed left-1/2 top-4 z-50 flex w-full -translate-x-1/2 flex-col items-center gap-3 px-4">
        {notifications.map((notification) => (
          <Toast key={notification.id} notification={notification} />
        ))}
      </div>
    </ToastContext.Provider>
  );
}
