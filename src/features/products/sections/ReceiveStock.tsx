import { useState } from "react";
import { PackagePlus, X } from "lucide-react";

import type { ProductListItem } from "../api/getProducts";
import { receiveStock } from "../api/receiveStock";
import { useToast } from "../../../components/feedback/useToast";

interface ReceiveStockProps {
  product: ProductListItem | null;
  onSuccess: () => void;
  onClose: () => void;
}

export function ReceiveStock({
  product,
  onSuccess,
  onClose,
}: ReceiveStockProps) {
  const { notify } = useToast();

  const [quantity, setQuantity] = useState("");
  const [notes, setNotes] = useState("");
  const [isReceiving, setIsReceiving] = useState(false);

  if (!product) return null;

  const productId = product.id;

  const parsedQuantity = Number(quantity);

  const isValidQuantity =
    Number.isInteger(parsedQuantity) && parsedQuantity > 0;

  async function handleReceiveStock() {
    if (!isValidQuantity) return;

    setIsReceiving(true);

    try {
      await receiveStock(productId, {
        quantity: parsedQuantity,
        ...(notes.trim() && { notes: notes.trim() }),
      });

      notify({
        type: "success",
        message: "Stock received successfully.",
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
            : "Failed to receive stock.",
      });
    } finally {
      setIsReceiving(false);
    }
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
      onMouseDown={(event) => {
        if (
          !isReceiving &&
          event.target === event.currentTarget
        ) {
          onClose();
        }
      }}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="receive-stock-title"
        className="w-full max-w-md rounded-xl border border-border bg-surface p-6 shadow-xl"
      >
        <div className="flex items-center justify-between">
          <h2
            id="receive-stock-title"
            className="text-lg font-semibold text-text-primary"
          >
            Receive Stock
          </h2>

          <button
            type="button"
            disabled={isReceiving}
            onClick={onClose}
            aria-label="Close receive stock modal"
            className="rounded-lg p-2 text-text-secondary transition hover:bg-background hover:text-text-primary disabled:cursor-not-allowed disabled:opacity-50"
          >
            <X size={20} />
          </button>
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
            htmlFor="receive-quantity"
            className="mb-2 block text-sm font-medium text-text-primary"
          >
            Quantity to receive
          </label>

          <input
            id="receive-quantity"
            type="number"
            min="1"
            step="1"
            required
            value={quantity}
            onChange={(event) => setQuantity(event.target.value)}
            placeholder="Enter quantity"
            disabled={isReceiving}
            className="w-full rounded-lg border border-border bg-surface px-3 py-2 text-sm text-text-primary outline-none transition focus:border-primary disabled:opacity-50"
          />
        </div>

        <div className="mt-4">
          <label
            htmlFor="receive-notes"
            className="mb-2 block text-sm font-medium text-text-primary"
          >
            Notes <span className="font-normal text-text-secondary">(Optional)</span>
          </label>

          <textarea
            id="receive-notes"
            rows={3}
            value={notes}
            onChange={(event) => setNotes(event.target.value)}
            placeholder="Add any relevant notes..."
            disabled={isReceiving}
            className="w-full resize-none rounded-lg border border-border bg-surface px-3 py-2 text-sm text-text-primary outline-none transition focus:border-primary disabled:opacity-50"
          />
        </div>

        <div className="mt-6 flex justify-end gap-3">
          <button
            type="button"
            disabled={isReceiving}
            onClick={onClose}
            className="rounded-lg border border-border px-4 py-2 text-sm font-medium text-text-primary transition hover:bg-background disabled:cursor-not-allowed disabled:opacity-50"
          >
            Cancel
          </button>

          <button
            type="button"
            disabled={!isValidQuantity || isReceiving}
            onClick={handleReceiveStock}
            className="flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-white transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
          >
            <PackagePlus size={16} />
            {isReceiving ? "Receiving..." : "Receive Stock"}
          </button>
        </div>
      </div>
    </div>
  );
}