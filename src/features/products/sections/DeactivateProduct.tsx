import { useState } from "react";
import { AlertTriangle, X } from "lucide-react";

import type { ProductListItem } from "../api/getProducts";
import { deactivateProduct } from "../api/deactivateProduct";
import { useToast } from "../../../components/feedback/useToast";

interface DeactivateProductProps {
  product: ProductListItem | null;
  onSuccess: () => void;
  onClose: () => void;
}

export function DeactivateProduct({
  product,
  onSuccess,
  onClose,
}: DeactivateProductProps) {
  const { notify } = useToast();
  const [isDeactivating, setIsDeactivating] = useState(false);

  if (!product) return null;

  const productId = product.id;

  async function handleDeactivate() {
    setIsDeactivating(true);

    try {
      await deactivateProduct(productId);

      notify({
        type: "success",
        message: "Product deactivated successfully.",
      });

      onClose();
      onSuccess();
    } catch (error) {
      notify({
        type: "error",
        message:
          error instanceof Error
            ? error.message
            : "Failed to deactivate product.",
      });
    } finally {
      setIsDeactivating(false);
    }
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
      onMouseDown={(event) => {
        if (!isDeactivating && event.target === event.currentTarget) {
          onClose();
        }
      }}
    >
      <div
        role="alertdialog"
        aria-modal="true"
        aria-labelledby="deactivate-product-title"
        aria-describedby="deactivate-product-description"
        className="w-full max-w-md rounded-xl border border-border bg-surface p-6 shadow-xl"
      >
        <div className="flex items-center justify-between">
          <h2
            id="deactivate-product-title"
            className="text-lg font-semibold text-text-primary"
          >
            Deactivate Product
          </h2>

          <button
            type="button"
            disabled={isDeactivating}
            onClick={onClose}
            aria-label="Close deactivation confirmation"
            className="rounded-lg p-2 text-text-secondary transition hover:bg-background hover:text-text-primary disabled:cursor-not-allowed disabled:opacity-50"
          >
            <X size={20} />
          </button>
        </div>

        <p
          id="deactivate-product-description"
          className="mt-3 text-sm text-text-secondary"
        >
          Are you sure you want to deactivate{" "}
          <span className="font-semibold text-text-primary">
            {product.name}
          </span>
          ?
        </p>

        <div className="mt-4 flex items-start gap-3 rounded-lg border border-amber-500/20 bg-amber-500/5 p-3">
          <AlertTriangle size={18} className="mt-0.5 shrink-0 text-amber-500" />

          <p className="text-sm text-text-secondary">
            This product will become inactive and will no longer be available
            for normal product operations. You can activate it again later.
          </p>
        </div>

        <div className="mt-6 flex justify-end gap-3">
          <button
            type="button"
            disabled={isDeactivating}
            onClick={onClose}
            className="rounded-lg border border-border px-4 py-2 text-sm font-medium text-text-primary transition hover:bg-background disabled:cursor-not-allowed disabled:opacity-50"
          >
            Cancel
          </button>

          <button
            type="button"
            disabled={isDeactivating}
            onClick={handleDeactivate}
            className="rounded-lg bg-amber-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-amber-700 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {isDeactivating ? "Deactivating..." : "Deactivate Product"}
          </button>
        </div>
      </div>
    </div>
  );
}
