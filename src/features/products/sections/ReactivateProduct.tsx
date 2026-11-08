import { useState } from "react";
import { Power, X } from "lucide-react";

import type { ProductListItem } from "../api/getProducts";
import { reactivateProduct } from "../api/reactivateProduct";
import { useToast } from "../../../components/feedback/useToast";

interface ReactivateProductProps {
  product: ProductListItem | null;
  onSuccess: () => void;
  onClose: () => void;
}

export function ReactivateProduct({
  product,
  onSuccess,
  onClose,
}: ReactivateProductProps) {
  const { notify } = useToast();
  const [isReactivating, setIsReactivating] = useState(false);

  if (!product) return null;

  const productId = product.id;

  async function handleReactivate() {
    setIsReactivating(true);

    try {
      await reactivateProduct(productId);

      notify({
        type: "success",
        message: "Product reactivated successfully.",
      });

      onClose();
      onSuccess();
    } catch (error) {
      notify({
        type: "error",
        message:
          error instanceof Error
            ? error.message
            : "Failed to reactivate product.",
      });
    } finally {
      setIsReactivating(false);
    }
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
      onMouseDown={(event) => {
        if (
          !isReactivating &&
          event.target === event.currentTarget
        ) {
          onClose();
        }
      }}
    >
      <div
        role="alertdialog"
        aria-modal="true"
        aria-labelledby="reactivate-product-title"
        aria-describedby="reactivate-product-description"
        className="w-full max-w-md rounded-xl border border-border bg-surface p-6 shadow-xl"
      >
        <div className="flex items-center justify-between">
          <h2
            id="reactivate-product-title"
            className="text-lg font-semibold text-text-primary"
          >
            Reactivate Product
          </h2>

          <button
            type="button"
            disabled={isReactivating}
            onClick={onClose}
            aria-label="Close reactivation confirmation"
            className="rounded-lg p-2 text-text-secondary transition hover:bg-background hover:text-text-primary disabled:cursor-not-allowed disabled:opacity-50"
          >
            <X size={20} />
          </button>
        </div>

        <p
          id="reactivate-product-description"
          className="mt-3 text-sm text-text-secondary"
        >
          Are you sure you want to reactivate{" "}
          <span className="font-semibold text-text-primary">
            {product.name}
          </span>
          ?
        </p>

        <div className="mt-4 flex items-start gap-3 rounded-lg border border-emerald-500/20 bg-emerald-500/5 p-3">
          <Power
            size={18}
            className="mt-0.5 shrink-0 text-emerald-500"
          />

          <p className="text-sm text-text-secondary">
            This product will become active again. Its status
            will be determined by its current stock quantity.
          </p>
        </div>

        <div className="mt-6 flex justify-end gap-3">
          <button
            type="button"
            disabled={isReactivating}
            onClick={onClose}
            className="rounded-lg border border-border px-4 py-2 text-sm font-medium text-text-primary transition hover:bg-background disabled:cursor-not-allowed disabled:opacity-50"
          >
            Cancel
          </button>

          <button
            type="button"
            disabled={isReactivating}
            onClick={handleReactivate}
            className="rounded-lg bg-emerald-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-emerald-700 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {isReactivating ? "Reactivating..." : "Reactivate Product"}
          </button>
        </div>
      </div>
    </div>
  );
}