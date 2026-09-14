import { Check, RefreshCw, X } from "lucide-react";

import type { FeedbackNotification } from "./toast-context";

interface ToastProps {
  notification: FeedbackNotification;
}

export function Toast({ notification }: ToastProps) {
  const { type, message } = notification;

  const icon =
    type === "success" ? (
      <Check className="h-5 w-5" />
    ) : type === "error" ? (
      <X className="h-5 w-5" />
    ) : (
      <RefreshCw className="h-5 w-5" />
    );

  const iconClass =
    type === "success"
      ? "text-success"
      : type === "error"
        ? "text-primary"
        : "text-warning";

  return (
    <div className="flex w-full max-w-md items-center gap-3 rounded-lg border border-border bg-surface px-4 py-3 shadow-lg">
      <div className={iconClass}>{icon}</div>

      <p className="flex-1 text-sm font-medium text-text-primary">{message}</p>
    </div>
  );
}
