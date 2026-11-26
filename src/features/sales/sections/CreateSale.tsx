import { useEffect, useState } from "react";
import {
  getProducts,
  type ProductListItem,
} from "../../products/api/getProducts";
import {
  getSaleReceipt,
  type SaleReceiptResponse,
} from "../api/getSaleReceipt";
import type { SelectedSaleItem } from "../types/sales.types";
import { useToast } from "../../../components/feedback/useToast";
import { createSale } from "../api/createSale";
import { SaleReceiptModal } from "./SaleReceiptModal";
import { X } from "lucide-react";

interface CreateSaleProps {
  onSaleCreated: () => void;
}

export function CreateSale({ onSaleCreated }: CreateSaleProps) {
  const { notify } = useToast();
  const [searchTerm, setSearchTerm] = useState("");
  const [searchResults, setSearchResults] = useState<ProductListItem[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [selectedItems, setSelectedItems] = useState<SelectedSaleItem[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [receipt, setReceipt] = useState<SaleReceiptResponse | null>(null);

  function handleAddProduct(product: ProductListItem) {
    setSelectedItems((prev) => {
      const alreadyAdded = prev.some((item) => item.product.id === product.id);

      if (alreadyAdded) return prev;

      return [...prev, { product, quantity: 1 }];
    });

    setSearchTerm("");
    setSearchResults([]);
    setIsSearching(false);
  }

  useEffect(() => {
    const query = searchTerm.trim();

    if (!query) return;

    let active = true;

    const timeout = setTimeout(async () => {
      setIsSearching(true);

      try {
        const response = await getProducts({
          page: 1,
          limit: 8,
          // status: "AVAILABLE",
          search: query,
        });

        if (active) {
          setSearchResults(response.items);
        }
      } catch (error) {
        if (active) {
          setSearchResults([]);

          notify({
            type: "error",
            message:
              error instanceof Error
                ? error.message
                : "Unable to search products. Please try again.",
          });
        }
      } finally {
        if (active) {
          setIsSearching(false);
        }
      }
    }, 300);

    return () => {
      active = false;
      clearTimeout(timeout);
    };
  }, [searchTerm, notify]);

  function handleQuantityChange(productId: string, quantity: number) {
    setSelectedItems((prev) =>
      prev.map((item) =>
        item.product.id === productId ? { ...item, quantity } : item,
      ),
    );
  }

  function handleRemoveProduct(productId: string) {
    setSelectedItems((prev) =>
      prev.filter((item) => item.product.id !== productId),
    );
  }

  const totalAmount = selectedItems.reduce(
    (total, item) => total + item.product.sellingPrice * item.quantity,
    0,
  );

  async function handleCompleteSale() {
    if (selectedItems.length === 0) return;

    setIsSubmitting(true);

    try {
      const sale = await createSale({
        items: selectedItems.map((item) => ({
          productId: item.product.id,
          quantity: item.quantity,
        })),
      });

      setSelectedItems([]);
      onSaleCreated();

      notify({
        type: "success",
        message: "Sale completed successfully.",
      });

      try {
        const receiptData = await getSaleReceipt(sale.id);
        setReceipt(receiptData);
      } catch {
        notify({
          type: "retry",
          message: "Sale completed, but receipt could not be retrieved.",
        });
      }
    } catch (error) {
      notify({
        type: "error",
        message:
          error instanceof Error
            ? error.message
            : "Unable to complete sale. Please try again.",
      });
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <section className="rounded-xl border border-border bg-surface p-6">
      <div className="mb-6">
        <h2 className="text-lg font-semibold text-text-primary">
          Create New Sale
        </h2>

        <p className="mt-1 text-sm text-text-secondary">
          Search for products and add them to this transaction.
        </p>
      </div>

      {/* Product Search */}
      <div className="mb-6">
        <label
          htmlFor="product-search"
          className="mb-2 block text-sm font-medium text-text-primary"
        >
          Search Products
        </label>

        <div className="relative">
          <input
            id="product-search"
            type="text"
            placeholder="Search by product name or SKU..."
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setSearchResults([]);
              setIsSearching(false);
            }}
            className="w-full rounded-lg border border-border bg-background px-4 py-3 text-sm text-text-primary outline-none transition focus:border-primary"
          />

          {searchTerm && (
            <button
              type="button"
              onClick={() => {
                setSearchTerm("");
                setSearchResults([]);
                setIsSearching(false);
              }}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-text-secondary transition hover:text-text-primary"
              aria-label="Clear search"
            >
              <X size={18} />
            </button>
          )}

          {searchTerm.trim() && (
            <div className="absolute left-0 right-0 top-full z-20 mt-2 max-h-72 overflow-y-auto rounded-xl border border-border bg-surface shadow-lg">
              {isSearching ? (
                <p className="p-4 text-center text-sm text-text-secondary">
                  Searching products...
                </p>
              ) : searchResults.length === 0 ? (
                <p className="p-4 text-center text-sm text-text-secondary">
                  No matching products found.
                </p>
              ) : (
                <div className="divide-y divide-border">
                  {searchResults.map((product) => {
                    const alreadyAdded = selectedItems.some(
                      (item) => item.product.id === product.id,
                    );

                    const isOutOfStock =
                      product.status === "OUT_OF_STOCK" ||
                      product.stockQuantity <= 0;

                    const isInactive = product.status === "INACTIVE";

                    const isUnavailable = isOutOfStock || isInactive;

                    return (
                      <button
                        key={product.id}
                        type="button"
                        disabled={alreadyAdded || isUnavailable}
                        onClick={() => handleAddProduct(product)}
                        className="flex w-full items-center justify-between gap-4 p-4 text-left transition hover:bg-background disabled:cursor-not-allowed disabled:opacity-50"
                      >
                        <div className="flex min-w-0 items-center gap-3">
                          {product.imageUrl ? (
                            <img
                              src={product.imageUrl}
                              alt={product.name}
                              className="h-12 w-12 shrink-0 rounded-lg border border-border object-cover"
                            />
                          ) : (
                            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-background text-xs text-text-secondary">
                              No image
                            </div>
                          )}

                          <div className="min-w-0">
                            <p className="truncate text-sm font-medium text-text-primary">
                              {product.name}
                            </p>

                            <p className="mt-1 text-xs text-text-secondary">
                              SKU: {product.sku} · Stock:{" "}
                              {product.stockQuantity}
                            </p>
                          </div>
                        </div>

                        <div className="shrink-0 text-right">
                          <p className="text-sm font-semibold text-text-primary">
                            ₦{product.sellingPrice.toLocaleString("en-NG")}
                          </p>

                          {/* <p className="mt-1 text-xs text-primary">
                            {alreadyAdded ? "Already added" : "Add product"}
                          </p> */}

                          <p
                            className={`mt-1 text-xs font-medium ${
                              isOutOfStock
                                ? "text-red-600"
                                : isInactive
                                  ? "text-text-secondary"
                                  : alreadyAdded
                                    ? "text-text-secondary"
                                    : "text-primary"
                            }`}
                          >
                            {isOutOfStock
                              ? "Out of Stock"
                              : isInactive
                                ? "Inactive"
                                : alreadyAdded
                                  ? "Already added"
                                  : "Add product"}
                          </p>
                        </div>
                      </button>
                    );
                  })}
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Selected Products */}
      <div className="space-y-4">
        <h3 className="text-sm font-semibold text-text-primary">
          Selected Products
        </h3>

        {selectedItems.length === 0 ? (
          <div className="rounded-lg border border-border p-6 text-center">
            <p className="text-sm text-text-secondary">
              No products added yet. Search and select products to begin.
            </p>
          </div>
        ) : (
          <div className="divide-y divide-border rounded-lg border border-border">
            {selectedItems.map((item) => (
              <div
                key={item.product.id}
                className="flex flex-wrap items-center justify-between gap-4 p-4"
              >
                <div className="flex min-w-0 flex-1 items-center gap-3">
                  {item.product.imageUrl ? (
                    <img
                      src={item.product.imageUrl}
                      alt={item.product.name}
                      className="h-16 w-16 shrink-0 rounded-lg border border-border object-cover"
                    />
                  ) : (
                    <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-lg bg-background text-xs text-text-secondary">
                      No image
                    </div>
                  )}

                  <div className="min-w-0">
                    <p className="truncate text-sm font-medium text-text-primary">
                      {item.product.name}
                    </p>

                    <p className="mt-1 text-xs text-text-secondary">
                      SKU: {item.product.sku}
                    </p>

                    <p className="mt-2 text-sm font-semibold text-text-primary">
                      ₦{item.product.sellingPrice.toLocaleString("en-NG")}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div className="flex items-center rounded-lg border border-border">
                    <button
                      type="button"
                      onClick={() =>
                        handleQuantityChange(item.product.id, item.quantity - 1)
                      }
                      disabled={item.quantity <= 1}
                      className="px-3 py-2 text-text-primary disabled:opacity-40"
                    >
                      −
                    </button>

                    <span className="min-w-8 text-center text-sm font-medium text-text-primary">
                      {item.quantity}
                    </span>

                    <button
                      type="button"
                      onClick={() =>
                        handleQuantityChange(item.product.id, item.quantity + 1)
                      }
                      disabled={item.quantity >= item.product.stockQuantity}
                      className="px-3 py-2 text-text-primary disabled:opacity-40"
                    >
                      +
                    </button>
                  </div>

                  <button
                    type="button"
                    onClick={() => handleRemoveProduct(item.product.id)}
                    className="text-sm font-medium text-red-600 hover:text-red-700"
                  >
                    Remove
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Sale Summary */}
      <div className="mt-6 border-t border-border pt-6">
        <div className="flex items-center justify-between">
          <span className="font-medium text-text-primary">Total Amount</span>

          <span className="text-xl font-bold text-text-primary">
            ₦
            {totalAmount.toLocaleString("en-NG", {
              minimumFractionDigits: 2,
              maximumFractionDigits: 2,
            })}
          </span>
        </div>

        <button
          type="button"
          onClick={handleCompleteSale}
          disabled={selectedItems.length === 0 || isSubmitting}
          className="mt-6 w-full rounded-lg bg-primary px-4 py-3 text-sm font-semibold text-white transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {isSubmitting ? "Processing Sale..." : "Complete Sale"}
        </button>
      </div>

      {receipt && (
        <SaleReceiptModal receipt={receipt} onClose={() => setReceipt(null)} />
      )}
    </section>
  );
}
