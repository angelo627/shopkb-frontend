import { useState } from "react";
import { AlertTriangle, X } from "lucide-react";

import { cancelSale } from "../api/cancelSale";
import { useToast } from "../../../components/feedback/useToast";

interface CancelSaleProps {
  saleId: string;
  onSuccess: () => void;
  onClose: () => void;
}

export function CancelSale({ saleId, onSuccess, onClose }: CancelSaleProps) {
  const { notify } = useToast();
  const [isCancelling, setIsCancelling] = useState(false);

  async function handleCancel() {
    setIsCancelling(true);

    try {
      await cancelSale(saleId);

      notify({
        type: "success",
        message: "Sale cancelled successfully.",
      });

      onClose();
      onSuccess();
    } catch (error) {
      notify({
        type: "error",
        message:
          error instanceof Error ? error.message : "Failed to cancel sale.",
      });
    } finally {
      setIsCancelling(false);
    }
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
      onMouseDown={(event) => {
        if (!isCancelling && event.target === event.currentTarget) {
          onClose();
        }
      }}
    >
      <div
        role="alertdialog"
        aria-modal="true"
        aria-labelledby="cancel-sale-title"
        aria-describedby="cancel-sale-description"
        className="w-full max-w-md rounded-xl border border-border bg-surface p-6 shadow-xl"
      >
        <div className="flex items-center justify-between">
          <h2
            id="cancel-sale-title"
            className="text-lg font-semibold text-text-primary"
          >
            Cancel Sale
          </h2>

          <button
            type="button"
            disabled={isCancelling}
            onClick={onClose}
            aria-label="Close cancellation confirmation"
            className="rounded-lg p-2 text-text-secondary transition hover:bg-background hover:text-text-primary disabled:cursor-not-allowed disabled:opacity-50"
          >
            <X size={20} />
          </button>
        </div>

        <p
          id="cancel-sale-description"
          className="mt-3 text-sm text-text-secondary"
        >
          Are you sure you want to cancel this sale?
        </p>

        <div className="mt-4 flex items-start gap-3 rounded-lg border border-amber-500/20 bg-amber-500/5 p-3">
          <AlertTriangle size={18} className="mt-0.5 shrink-0 text-amber-500" />

          <p className="text-sm text-text-secondary">
            This action will mark the sale as cancelled and restore all sold
            product quantities to inventory. The cancellation will also be
            recorded in the activity log.
          </p>
        </div>

        <div className="mt-6 flex justify-end gap-3">
          <button
            type="button"
            disabled={isCancelling}
            onClick={onClose}
            className="rounded-lg border border-border px-4 py-2 text-sm font-medium text-text-primary transition hover:bg-background disabled:cursor-not-allowed disabled:opacity-50"
          >
            Keep Sale
          </button>

          <button
            type="button"
            disabled={isCancelling}
            onClick={handleCancel}
            className="rounded-lg bg-red-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {isCancelling ? "Cancelling..." : "Cancel Sale"}
          </button>
        </div>
      </div>
    </div>
  );
}
