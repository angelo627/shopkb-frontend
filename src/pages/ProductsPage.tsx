import { useState } from "react";
import { createProduct } from "../features/products/api/createProduct";
// import {
//   AlertTriangle,
//   ImagePlus,
//   Package,
//   Plus,
//   Search,
//   Zap,
// } from "lucide-react";

import { ImagePlus, Plus, Zap } from "lucide-react";

export function ProductsPage() {
  const [name, setName] = useState("");
  const [sku, setSku] = useState("");
  const [description, setDescription] = useState("");
  const [costPrice, setCostPrice] = useState("");
  const [sellingPrice, setSellingPrice] = useState("");
  const [stockQuantity, setStockQuantity] = useState("");
  const [minimumStock, setMinimumStock] = useState("");
  const [image, setImage] = useState<File | undefined>();

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [topQuickAccessOpen, setTopQuickAccessOpen] = useState(false);
  const [floatingQuickAccessOpen, setFloatingQuickAccessOpen] = useState(false);

  function handleImageChange(file?: File) {
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      setMessage("Please select a valid image file.");
      return;
    }

    setImage(file);
    setImagePreview(URL.createObjectURL(file));
    setMessage("");
  }

  function scrollToSection(id: string) {
    document.getElementById(id)?.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });

    setTopQuickAccessOpen(false);
    setFloatingQuickAccessOpen(false);
  }

  function handleRemoveImage() {
    setImage(undefined);
    setImagePreview(null);
  }

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    setMessage("");
    setLoading(true);

    try {
      await createProduct({
        name,
        sku,
        description: description || undefined,
        costPrice: Number(costPrice),
        sellingPrice: Number(sellingPrice),
        stockQuantity: stockQuantity ? Number(stockQuantity) : undefined,
        minimumStock: minimumStock ? Number(minimumStock) : undefined,
        image,
      });

      setMessage("Product created successfully.");

      // Clear form
      setName("");
      setSku("");
      setDescription("");
      setCostPrice("");
      setSellingPrice("");
      setStockQuantity("");
      setMinimumStock("");
      setImage(undefined);
      setImagePreview(null);
    } catch (error) {
      setMessage(
        error instanceof Error ? error.message : "Failed to create product.",
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-text-primary">Products</h1>

          <p className="mt-1 text-sm text-text-secondary">
            Create and manage products in your shop.
          </p>
        </div>

        <div className="relative">
          {/* Top Quick Access */}
          <button
            type="button"
            onClick={() => setTopQuickAccessOpen((open) => !open)}
            className="flex items-center gap-2 rounded-lg border border-border bg-surface px-4 py-2 text-sm font-medium text-text-primary transition hover:bg-background"
          >
            <Zap size={16} />
            Quick Access
            <span className="text-xs">{topQuickAccessOpen ? "▲" : "▼"}</span>
          </button>

          {topQuickAccessOpen && (
            <div className="absolute right-0 z-10 mt-2 w-56 rounded-xl border border-border bg-surface p-2 shadow-lg">
              <button
                type="button"
                onClick={() => scrollToSection("create-product")}
                className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-left text-sm text-text-primary transition hover:bg-background"
              >
                <Plus size={16} />

                <span>Create Product</span>
              </button>
            </div>
          )}
        </div>
      </div>

      <section
        id="create-product"
        className="rounded-xl border border-border bg-surface p-6"
      >
        <h2 className="text-lg font-semibold text-text-primary">
          Create product
        </h2>

        <form
          onSubmit={handleSubmit}
          className="mt-6 grid grid-cols-1 gap-5 md:grid-cols-2"
        >
          <div>
            <label className="text-sm font-medium text-text-primary">
              Product Name
            </label>

            <input
              type="text"
              value={name}
              onChange={(event) => setName(event.target.value)}
              placeholder="Enter product name"
              required
              className="mt-2 w-full rounded-lg border border-border bg-background px-3 py-2 text-sm outline-none focus:border-primary"
            />
          </div>

          <div>
            <label className="text-sm font-medium text-text-primary">SKU</label>

            <input
              type="text"
              value={sku}
              onChange={(event) => setSku(event.target.value)}
              placeholder="Enter product SKU"
              required
              className="mt-2 w-full rounded-lg border border-border bg-background px-3 py-2 text-sm outline-none focus:border-primary"
            />
          </div>

          <div className="md:col-span-2">
            <label className="text-sm font-medium text-text-primary">
              Description
            </label>

            <textarea
              value={description}
              onChange={(event) => setDescription(event.target.value)}
              placeholder="Enter product description"
              rows={4}
              className="mt-2 w-full rounded-lg border border-border bg-background px-3 py-2 text-sm outline-none focus:border-primary"
            />
          </div>

          <div>
            <label className="text-sm font-medium text-text-primary">
              Cost Price
            </label>

            <input
              type="number"
              min="0"
              value={costPrice}
              onChange={(event) => setCostPrice(event.target.value)}
              placeholder="Enter cost price"
              required
              className="mt-2 w-full rounded-lg border border-border bg-background px-3 py-2 text-sm outline-none focus:border-primary"
            />
          </div>

          <div>
            <label className="text-sm font-medium text-text-primary">
              Selling Price
            </label>

            <input
              type="number"
              min="0"
              value={sellingPrice}
              onChange={(event) => setSellingPrice(event.target.value)}
              placeholder="Enter selling price"
              required
              className="mt-2 w-full rounded-lg border border-border bg-background px-3 py-2 text-sm outline-none focus:border-primary"
            />
          </div>

          <div>
            <label className="text-sm font-medium text-text-primary">
              Stock Quantity
            </label>

            <input
              type="number"
              min="0"
              value={stockQuantity}
              onChange={(event) => setStockQuantity(event.target.value)}
              placeholder="Enter stock quantity"
              className="mt-2 w-full rounded-lg border border-border bg-background px-3 py-2 text-sm outline-none focus:border-primary"
            />
          </div>

          <div>
            <label className="text-sm font-medium text-text-primary">
              Minimum Stock
            </label>

            <input
              type="number"
              min="0"
              value={minimumStock}
              onChange={(event) => setMinimumStock(event.target.value)}
              placeholder="Enter minimum stock level"
              className="mt-2 w-full rounded-lg border border-border bg-background px-3 py-2 text-sm outline-none focus:border-primary"
            />
          </div>

          <div className="md:col-span-2">
            <label className="text-sm font-medium text-text-primary">
              Product Image
            </label>

            <div
              onDragOver={(event) => {
                event.preventDefault();
                setIsDragging(true);
              }}
              onDragLeave={() => {
                setIsDragging(false);
              }}
              onDrop={(event) => {
                event.preventDefault();
                setIsDragging(false);

                handleImageChange(event.dataTransfer.files?.[0]);
              }}
              className={`mt-2 rounded-xl border-2 border-dashed p-6 transition ${
                isDragging ? "border-primary bg-primary/5" : "border-border"
              }`}
            >
              {imagePreview ? (
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
                  <img
                    src={imagePreview}
                    alt="Product preview"
                    className="h-32 w-32 rounded-lg object-cover"
                  />

                  <div className="flex-1">
                    <p className="text-sm font-medium text-text-primary">
                      {image?.name}
                    </p>

                    {image && (
                      <p className="mt-1 text-xs text-text-secondary">
                        {(image.size / 1024 / 1024).toFixed(2)} MB
                      </p>
                    )}

                    <div className="mt-3 flex gap-3">
                      <label className="cursor-pointer rounded-lg border border-border px-3 py-2 text-sm font-medium text-text-primary transition hover:bg-background">
                        Change Image
                        <input
                          type="file"
                          accept="image/*"
                          className="hidden"
                          onChange={(event) =>
                            handleImageChange(event.target.files?.[0])
                          }
                        />
                      </label>

                      <button
                        type="button"
                        onClick={handleRemoveImage}
                        className="rounded-lg px-3 py-2 text-sm font-medium text-red-600 transition hover:bg-red-50"
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                </div>
              ) : (
                <label className="flex cursor-pointer flex-col items-center justify-center py-8 text-center">
                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-background">
                    <ImagePlus size={24} className="text-text-secondary" />
                  </div>

                  <p className="mt-4 text-sm font-medium text-text-primary">
                    Upload product image
                  </p>

                  <p className="mt-1 text-xs text-text-secondary">
                    Drag and drop an image here, or click to browse
                  </p>

                  <p className="mt-2 text-xs text-text-secondary">
                    PNG, JPEG, WEBP
                  </p>

                  <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={(event) =>
                      handleImageChange(event.target.files?.[0])
                    }
                  />
                </label>
              )}
            </div>
          </div>

          <div className="md:col-span-2">
            <button
              type="submit"
              disabled={loading}
              className="rounded-lg bg-primary px-5 py-2.5 text-sm font-medium text-white transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {loading ? "Creating..." : "Create Product"}
            </button>
          </div>

          {message && (
            <p className="md:col-span-2 text-sm text-text-secondary">
              {message}
            </p>
          )}
        </form>
      </section>

      {/* Floating Quick Access */}
      <div className="fixed bottom-6 right-6 z-50">
        {floatingQuickAccessOpen && (
          <div className="absolute bottom-14 right-0 w-56 rounded-xl border border-border bg-surface p-2 shadow-lg">
            <button
              type="button"
              onClick={() => scrollToSection("create-product")}
              className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-left text-sm text-text-primary transition hover:bg-background"
            >
              <Plus size={16} />

              <span>Create Product</span>
            </button>
          </div>
        )}

        <button
          type="button"
          onClick={() => setFloatingQuickAccessOpen((open) => !open)}
          className="flex h-12 w-12 items-center justify-center rounded-full bg-primary text-white shadow-lg transition hover:opacity-90"
          aria-label="Quick Access"
        >
          <Zap size={20} />
        </button>
      </div>
    </div>
  );
}
