import { useState } from "react";
import { PackageMinus, X } from "lucide-react";

import type { ProductListItem } from "../api/getProducts";
import { removeStock } from "../api/removeStock";
import { useToast } from "../../../components/feedback/useToast";

interface RemoveStockProps {
  product: ProductListItem | null;
  onSuccess: () => void;
  onClose: () => void;
}

export function RemoveStock({
  product,
  onSuccess,
  onClose,
}: RemoveStockProps) {
  const { notify } = useToast();

  const [quantity, setQuantity] = useState("");
  const [notes, setNotes] = useState("");
  const [isRemoving, setIsRemoving] = useState(false);

  if (!product) return null;

  const productId = product.id;

  const parsedQuantity = Number(quantity);

  const isValidQuantity =
    Number.isInteger(parsedQuantity) &&
    parsedQuantity > 0 &&
    parsedQuantity <= product.stockQuantity;

  async function handleRemoveStock() {
    if (!isValidQuantity) return;

    setIsRemoving(true);

    try {
      await removeStock(productId, {
        quantity: parsedQuantity,
        ...(notes.trim() && { notes: notes.trim() }),
      });

      notify({
        type: "success",
        message: "Stock removed successfully.",
      });

      setQuantity("");
      setNotes("");

      onClose();
      onSuccess();
    } catch (error) {
      notify({
        type: "error",
        message:
          error instanceof Error
            ? error.message
            : "Failed to remove stock.",
      });
    } finally {
      setIsRemoving(false);
    }
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
      onMouseDown={(event) => {
        if (!isRemoving && event.target === event.currentTarget) {
          onClose();
        }
      }}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="remove-stock-title"
        className="flex max-h-[85vh] w-full max-w-md flex-col overflow-hidden rounded-xl border border-border bg-surface shadow-xl"
      >
        <div className="overflow-y-auto p-6">
          <div>
            <div className="flex items-center justify-between gap-3">
              <div className="flex items-center gap-2">
                <div className="rounded-lg bg-red-500/10 p-2">
                  <PackageMinus size={18} className="text-red-500" />
                </div>

                <h2
                  id="remove-stock-title"
                  className="text-lg font-semibold text-text-primary"
                >
                  Remove Stock
                </h2>
              </div>

              <button
                type="button"
                disabled={isRemoving}
                onClick={onClose}
                aria-label="Close remove stock modal"
                className="shrink-0 rounded-lg p-2 text-text-secondary transition hover:bg-background hover:text-text-primary disabled:cursor-not-allowed disabled:opacity-50"
              >
                <X size={20} />
              </button>
            </div>

            <div className="mt-3 rounded-lg border border-red-500/20 bg-red-500/5 p-3">
              <p className="text-sm font-medium text-text-primary">
                When should you use this?
              </p>

              <p className="mt-1 text-sm text-text-secondary">
                Record products that are physically leaving your inventory, such
                as damaged, expired, lost, or discarded items.
              </p>
            </div>
          </div>

          <div className="mt-4 rounded-lg border border-border bg-background p-3">
            <p className="text-sm font-medium text-text-primary">
              {product.name}
            </p>

            <p className="mt-1 text-sm text-text-secondary">
              Current stock: {product.stockQuantity}
            </p>
          </div>

          <div className="mt-5">
            <label
              htmlFor="remove-quantity"
              className="mb-2 block text-sm font-medium text-text-primary"
            >
              Quantity to remove
            </label>

            <input
              id="remove-quantity"
              type="number"
              min="1"
              max={product.stockQuantity}
              step="1"
              required
              value={quantity}
              onChange={(event) => setQuantity(event.target.value)}
              placeholder="Enter quantity"
              disabled={isRemoving}
              className="w-full rounded-lg border border-border bg-surface px-3 py-2 text-sm text-text-primary outline-none transition focus:border-primary disabled:opacity-50"
            />

            <p className="mt-1 text-xs text-text-secondary">
              You can remove up to {product.stockQuantity} units.
            </p>
          </div>

          <div className="mt-4">
            <label
              htmlFor="remove-notes"
              className="mb-2 block text-sm font-medium text-text-primary"
            >
              Notes{" "}
              <span className="font-normal text-text-secondary">
                (Optional)
              </span>
            </label>

            <textarea
              id="remove-notes"
              rows={3}
              value={notes}
              onChange={(event) => setNotes(event.target.value)}
              placeholder="e.g. Damaged, expired, lost or other reasons..."
              disabled={isRemoving}
              className="w-full resize-none rounded-lg border border-border bg-surface px-3 py-2 text-sm text-text-primary outline-none transition focus:border-primary disabled:opacity-50"
            />
          </div>

          <div className="mt-6 flex justify-end gap-3">
            <button
              type="button"
              disabled={isRemoving}
              onClick={onClose}
              className="rounded-lg border border-border px-4 py-2 text-sm font-medium text-text-primary transition hover:bg-background disabled:cursor-not-allowed disabled:opacity-50"
            >
              Cancel
            </button>

            <button
              type="button"
              disabled={!isValidQuantity || isRemoving}
              onClick={handleRemoveStock}
              className="flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-white transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
            >
              <PackageMinus size={16} />
              {isRemoving ? "Removing..." : "Remove Stock"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}