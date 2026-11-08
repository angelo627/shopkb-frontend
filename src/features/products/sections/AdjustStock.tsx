import { useState } from "react";
import { SlidersHorizontal, X, TrendingUp, TrendingDown } from "lucide-react";
import type { ProductListItem } from "../api/getProducts";
import { adjustStock } from "../api/adjustStock";
import { useToast } from "../../../components/feedback/useToast";

interface AdjustStockProps {
  product: ProductListItem | null;
  onSuccess: () => void;
  onClose: () => void;
}

export function AdjustStock({
  product,
  onSuccess,
  onClose,
}: AdjustStockProps) {
  const { notify } = useToast();

  const [quantity, setQuantity] = useState("");
  const [notes, setNotes] = useState("");
  const [isAdjusting, setIsAdjusting] = useState(false);

  if (!product) return null;

  const productId = product.id;

  const parsedQuantity = Number(quantity);

  const isValidQuantity =
    Number.isInteger(parsedQuantity) &&
    parsedQuantity !== 0 &&
    product.stockQuantity + parsedQuantity >= 0;

  async function handleAdjustStock() {
    if (!isValidQuantity) return;

    setIsAdjusting(true);

    try {
      await adjustStock(productId, {
        quantity: parsedQuantity,
        ...(notes.trim() && { notes: notes.trim() }),
      });

      notify({
        type: "success",
        message: "Stock adjusted successfully.",
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
            : "Failed to adjust stock.",
      });
    } finally {
      setIsAdjusting(false);
    }
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
      onMouseDown={(event) => {
        if (!isAdjusting && event.target === event.currentTarget) {
          onClose();
        }
      }}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="adjust-stock-title"
        className="flex max-h-[85vh] w-full max-w-md flex-col overflow-hidden rounded-xl border border-border bg-surface shadow-xl"
      >
        <div className="overflow-y-auto p-6">
          <div>
            <div className="flex items-center justify-between gap-3">
              <div className="flex items-center gap-2">
                <div className="rounded-lg bg-blue-500/10 p-2">
                  <SlidersHorizontal size={18} className="text-blue-500" />
                </div>

                <h2
                  id="adjust-stock-title"
                  className="text-lg font-semibold text-text-primary"
                >
                  Adjust Stock
                </h2>
              </div>

              <button
                type="button"
                disabled={isAdjusting}
                onClick={onClose}
                aria-label="Close adjust stock modal"
                className="shrink-0 rounded-lg p-2 text-text-secondary transition hover:bg-background hover:text-text-primary disabled:cursor-not-allowed disabled:opacity-50"
              >
                <X size={20} />
              </button>
            </div>

            <div className="mt-3 rounded-lg border border-blue-500/20 bg-blue-500/5 p-3">
              <p className="text-sm font-medium text-text-primary">
                When should you use this?
              </p>

              <p className="mt-1 text-sm text-text-secondary">
                Correct your inventory records when the physical quantity of a
                product differs from the quantity recorded in the system.
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
              htmlFor="adjust-quantity"
              className="mb-2 block text-sm font-medium text-text-primary"
            >
              Adjustment quantity
            </label>

            <input
              id="adjust-quantity"
              type="number"
              step="1"
              required
              value={quantity}
              onChange={(event) => setQuantity(event.target.value)}
              placeholder="e.g. 10 or -5"
              disabled={isAdjusting}
              className="w-full rounded-lg border border-border bg-surface px-3 py-2 text-sm text-text-primary outline-none transition focus:border-primary disabled:opacity-50"
            />

            <div className="mt-2 flex gap-3 text-xs text-text-secondary">
              <span className="flex items-center gap-1">
                <TrendingUp size={14} className="text-green-500" />
                Positive (+) increases stock
              </span>

              <span className="flex items-center gap-1">
                <TrendingDown size={14} className="text-red-500" />
                Negative (-) decreases stock
              </span>
            </div>

            {quantity !== "" && (
              <p className="mt-2 text-sm text-text-secondary">
                {isValidQuantity
                  ? `New stock quantity: ${product.stockQuantity + parsedQuantity}`
                  : parsedQuantity === 0
                    ? "Adjustment quantity cannot be zero."
                    : "This adjustment cannot make stock quantity negative or contain decimals."}
              </p>
            )}
          </div>

          <div className="mt-4">
            <label
              htmlFor="adjust-notes"
              className="mb-2 block text-sm font-medium text-text-primary"
            >
              Notes{" "}
              <span className="font-normal text-text-secondary">
                (Optional)
              </span>
            </label>

            <textarea
              id="adjust-notes"
              rows={3}
              maxLength={500}
              value={notes}
              onChange={(event) => setNotes(event.target.value)}
              placeholder="Explain the reason for this adjustment..."
              disabled={isAdjusting}
              className="w-full resize-none rounded-lg border border-border bg-surface px-3 py-2 text-sm text-text-primary outline-none transition focus:border-primary disabled:opacity-50"
            />

            <p className="mt-1 text-right text-xs text-text-secondary">
              {notes.length}/500
            </p>
          </div>

          <div className="mt-6 flex justify-end gap-3">
            <button
              type="button"
              disabled={isAdjusting}
              onClick={onClose}
              className="rounded-lg border border-border px-4 py-2 text-sm font-medium text-text-primary transition hover:bg-background disabled:cursor-not-allowed disabled:opacity-50"
            >
              Cancel
            </button>

            <button
              type="button"
              disabled={!isValidQuantity || isAdjusting}
              onClick={handleAdjustStock}
              className="flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-white transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
            >
              <SlidersHorizontal size={16} />
              {isAdjusting ? "Adjusting..." : "Adjust Stock"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}