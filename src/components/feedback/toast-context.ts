import { createContext } from "react";

export type FeedbackType = "success" | "error" | "retry";

export interface FeedbackNotification {
  id: string;
  type: FeedbackType;
  message: string;
}

export interface ToastContextValue {
  notify: (notification: Omit<FeedbackNotification, "id">) => void;
}

export const ToastContext = createContext<ToastContextValue | undefined>(
  undefined,
);
