import { Check, RefreshCw, X } from "lucide-react";

import type { FeedbackNotification } from "./toast-context";

interface ToastProps {
  notification: FeedbackNotification;
}

export function Toast({ notification }: ToastProps) {
  const { type, message, isExiting } = notification;

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
      ? "bg-success/10 text-success"
      : type === "error"
        ? "bg-primary/10 text-primary"
        : "bg-warning/10 text-warning";

  return (
    <div
      className={`relative flex w-full max-w-lg items-center gap-4 overflow-hidden rounded-xl border border-border bg-surface px-5 py-4 shadow-xl ${
        isExiting
          ? "animate-[toast-out_0.3s_ease-in_forwards]"
          : "animate-[toast-in_0.35s_ease-out]"
      }`}
    >
      <div
        className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full ${iconClass}`}
      >
        {icon}
      </div>

      <p className="flex-1 text-sm font-medium leading-6 text-text-primary">
        {message}
      </p>
    </div>
  );
}
