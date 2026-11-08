import { useEffect, useRef, useState } from "react";
import { useToast } from "../components/feedback/useToast";
import { createProduct } from "../features/products/api/createProduct";
import type { Product } from "../features/products/api/createProduct";
import { updateProduct } from "../features/products/api/updateProduct";
import {
  getProducts,
  type ProductListItem,
} from "../features/products/api/getProducts";
import { deleteProduct } from "../features/products/api/deleteproduct";
import { DeactivateProduct } from "../features/products/sections/DeactivateProduct";
import { ReactivateProduct } from "../features/products/sections/ReactivateProduct";
import { ReceiveStock } from "../features/products/sections/ReceiveStock";

import {
  ImagePlus,
  Plus,
  Zap,
  Package,
  X,
  ChevronDown,
  ChevronUp,
  Pencil,
  AlignLeft,
  Trash2,
  AlertTriangle,
  Power,
  ChevronLeft,
  PackagePlus,
  PackageMinus,
  SlidersHorizontal,
} from "lucide-react";

type EditableProduct = Pick<
  Product,
  | "id"
  | "name"
  | "sku"
  | "description"
  | "imageUrl"
  | "costPrice"
  | "sellingPrice"
  | "minimumStock"
>;

export function ProductsPage() {
  const { notify } = useToast();
  const [name, setName] = useState("");
  const [sku, setSku] = useState("");
  const [description, setDescription] = useState("");
  const [costPrice, setCostPrice] = useState("");
  const [sellingPrice, setSellingPrice] = useState("");
  const [stockQuantity, setStockQuantity] = useState("");
  const [minimumStock, setMinimumStock] = useState("");
  const [image, setImage] = useState<File | undefined>();

  const [loading, setLoading] = useState(false);
  const [products, setProducts] = useState<ProductListItem[]>([]);
  const [isLoadingProducts, setIsLoadingProducts] = useState(true);
  const [refreshKey, setRefreshKey] = useState(0);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [topQuickAccessOpen, setTopQuickAccessOpen] = useState(false);
  const [floatingQuickAccessOpen, setFloatingQuickAccessOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [editingProduct, setEditingProduct] = useState<EditableProduct | null>(
    null,
  ); //Product
  const [openActionProductId, setOpenActionProductId] = useState<string | null>(
    null,
  );

  const [editName, setEditName] = useState("");
  const [editSku, setEditSku] = useState("");
  const [editDescription, setEditDescription] = useState("");
  const [editCostPrice, setEditCostPrice] = useState("");
  const [editSellingPrice, setEditSellingPrice] = useState("");
  const [editMinimumStock, setEditMinimumStock] = useState("");
  const [editImage, setEditImage] = useState<File | undefined>();
  const [editImagePreview, setEditImagePreview] = useState<string | null>(null);
  const [isUpdatingProduct, setIsUpdatingProduct] = useState(false);
  const [isEditDragging, setIsEditDragging] = useState(false);

  const productsSectionRef = useRef<HTMLElement | null>(null);

  const [deletingProduct, setDeletingProduct] = useState<ProductListItem | null>(null);
  const [isDeletingProduct, setIsDeletingProduct] = useState(false);
  const [deactivatingProduct, setDeactivatingProduct] = useState<ProductListItem | null>(null);
  const [reactivatingProduct, setReactivatingProduct] = useState<ProductListItem | null>(null);
  const [isManageStockOpen, setIsManageStockOpen] = useState(false);
  const [receivingProduct, setReceivingProduct] = useState<ProductListItem | null>(null);

  function handleImageChange(file?: File) {
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      notify({
        type: "error",
        message: "Please select a valid image file.",
      });
      return;
    }

    setImage(file);
    setImagePreview(URL.createObjectURL(file));
  }

  function handleEditImageChange(file?: File) {
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      notify({
        type: "error",
        message: "Please select a valid image file.",
      });
      return;
    }

    setEditImage(file);
    setEditImagePreview(URL.createObjectURL(file));
  }

  function handleRemoveEditImage() {
    setEditImage(undefined);
    setEditImagePreview(null);
  }

  function handleOpenEditModal(product: EditableProduct) {
    setEditingProduct(product);

    setEditName(product.name);
    setEditSku(product.sku);
    setEditDescription(product.description ?? "");
    setEditCostPrice(String(product.costPrice));
    setEditSellingPrice(String(product.sellingPrice));
    setEditMinimumStock(String(product.minimumStock));

    setEditImage(undefined);
    setEditImagePreview(product.imageUrl);
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

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      setDebouncedSearch(search);
    }, 300);

    return () => {
      clearTimeout(timeoutId);
    };
  }, [search]);

  useEffect(() => {
    let cancelled = false;

    async function fetchProducts() {
      try {
        const result = await getProducts({
          page,
          search: debouncedSearch.trim() || undefined,
        });

        if (cancelled) return;

        setProducts(result.items);
        setTotalPages(result.pagination.totalPages);
      } catch (error) {
        if (cancelled) return;

        notify({
          type: "error",
          message:
            error instanceof Error ? error.message : "Failed to load products.",
        });
      } finally {
        if (!cancelled) {
          setIsLoadingProducts(false);
        }
      }
    }

    fetchProducts();

    return () => {
      cancelled = true;
    };
  }, [page, refreshKey, debouncedSearch, notify]);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

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

      notify({
        type: "success",
        message: "Product created successfully.",
      });

      setPage(1);
      setRefreshKey((currentKey) => currentKey + 1);

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
      notify({
        type: "error",
        message:
          error instanceof Error ? error.message : "Failed to create product.",
      });
    } finally {
      setLoading(false);
    }
  }

  async function handleUpdateProduct(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!editingProduct) return;

    setIsUpdatingProduct(true);

    try {
      await updateProduct(editingProduct.id, {
        name: editName,
        sku: editSku,
        description: editDescription,
        costPrice: Number(editCostPrice),
        sellingPrice: Number(editSellingPrice),
        minimumStock: Number(editMinimumStock),
        image: editImage,
      });

      notify({
        type: "success",
        message: "Product updated successfully.",
      });

      setEditingProduct(null);
      setRefreshKey((currentKey) => currentKey + 1);
    } catch (error) {
      notify({
        type: "error",
        message:
          error instanceof Error ? error.message : "Failed to update product.",
      });
    } finally {
      setIsUpdatingProduct(false);
    }
  }

  const hasEditChanges =
    editingProduct !== null &&
    (editName !== editingProduct.name ||
      editSku !== editingProduct.sku ||
      editDescription !== (editingProduct.description ?? "") ||
      Number(editCostPrice) !== editingProduct.costPrice ||
      Number(editSellingPrice) !== editingProduct.sellingPrice ||
      Number(editMinimumStock) !== editingProduct.minimumStock ||
  editImage !== undefined);

  async function handleDeleteProduct() {
    if (!deletingProduct) return;

    setIsDeletingProduct(true);

    try {
      await deleteProduct(deletingProduct.id);

      notify({
        type: "success",
        message: "Product deleted successfully.",
      });

      setDeletingProduct(null);
      setRefreshKey((currentKey) => currentKey + 1);
    } catch (error) {
      notify({
        type: "error",
        message:
          error instanceof Error ? error.message : "Failed to delete product.",
      });
    } finally {
      setIsDeletingProduct(false);
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

              <button
                type="button"
                onClick={() => {
                  scrollToSection("products");
                  setTopQuickAccessOpen(false);
                }}
                className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-left text-sm text-text-primary transition hover:bg-background"
              >
                <Package size={16} />
                <span>Products</span>
              </button>
            </div>
          )}
        </div>
      </div>

      {/* create product section */}
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
        </form>
      </section>

      {/* get product section */}
      <section
        id="products"
        ref={productsSectionRef}
        className="rounded-xl border border-border bg-surface p-6"
      >
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <h2 className="text-lg font-semibold text-text-primary">Products</h2>

          <div className="relative w-full sm:max-w-sm">
            <input
              type="text"
              value={search}
              onChange={(event) => {
                setSearch(event.target.value);
                setPage(1);
              }}
              placeholder="Search by product name or SKU..."
              className="w-full rounded-lg border border-border bg-background px-4 py-2 pr-10 text-sm text-text-primary outline-none transition focus:border-primary"
            />

            {search && (
              <button
                type="button"
                onClick={() => {
                  setSearch("");
                  setPage(1);
                }}
                aria-label="Clear product search"
                className="group/clear absolute right-3 top-1/2 -translate-y-1/2 rounded p-1 text-text-secondary transition hover:bg-surface hover:text-text-primary"
              >
                <X size={16} />

                <span className="pointer-events-none absolute bottom-full left-1/2 mb-2 -translate-x-1/2 whitespace-nowrap rounded-md bg-gray-900 px-2.5 py-1.5 text-xs font-medium text-white opacity-0 shadow-lg transition-all duration-200 group-hover/clear:translate-y-0 group-hover/clear:opacity-100">
                  Clear search
                </span>
              </button>
            )}
          </div>
        </div>

        <div className="mt-6 space-y-3">
          {isLoadingProducts ? (
            <p className="py-8 text-center text-sm text-text-secondary">
              Loading products...
            </p>
          ) : products.length === 0 ? (
            <p className="py-8 text-center text-sm text-text-secondary">
              No products found.
            </p>
          ) : (
            products.map((product) => (
              <div
                key={product.id}
                className="rounded-lg border border-border p-4"
              >
                {/* Product header */}
                <div className="flex items-center gap-4">
                  {product.imageUrl ? (
                    <img
                      src={product.imageUrl}
                      alt={product.name}
                      className="h-16 w-16 rounded-lg object-cover"
                    />
                  ) : (
                    <div className="flex h-16 w-16 items-center justify-center rounded-lg bg-background text-xs text-text-secondary">
                      No image
                    </div>
                  )}

                  <div className="flex-1">
                    <p className="font-medium text-text-primary">
                      {product.name}
                    </p>

                    <p className="mt-1 text-sm text-text-secondary">
                      SKU: {product.sku}
                    </p>
                  </div>

                  <p className="text-sm font-medium text-text-primary">
                    {product.status}
                  </p>
                </div>

                {product.description && (
                  <div className="mt-3 flex items-start gap-2">
                    <AlignLeft
                      size={15}
                      className="mt-0.5 shrink-0 text-text-secondary"
                    />

                    <p className="text-sm text-text-secondary line-clamp-2">
                      {product.description}
                    </p>
                  </div>
                )}

                {/* Product details and actions */}
                <div className="mt-5 flex flex-wrap items-end justify-between gap-4">
                  <div className="grid flex-1 grid-cols-2 gap-4 text-sm md:grid-cols-4">
                    <div>
                      <p className="text-text-secondary">Cost Price</p>
                      <p className="font-medium text-text-primary">
                        {product.costPrice}
                      </p>
                    </div>

                    <div>
                      <p className="text-text-secondary">Selling Price</p>
                      <p className="font-medium text-text-primary">
                        {product.sellingPrice}
                      </p>
                    </div>

                    <div>
                      <p className="text-text-secondary">Stock</p>
                      <p className="font-medium text-text-primary">
                        {product.stockQuantity}
                      </p>
                    </div>

                    <div>
                      <p className="text-text-secondary">Minimum Stock</p>
                      <p className="font-medium text-text-primary">
                        {product.minimumStock}
                      </p>
                    </div>
                  </div>

                  {/* Product actions */}
                  <div className="relative">
                    <button
                      type="button"
                      onClick={() =>
                        setOpenActionProductId((current) =>
                          current === product.id ? null : product.id,
                        )
                      }
                      aria-expanded={openActionProductId === product.id}
                      className="flex items-center gap-2 rounded-lg border border-border px-3 py-1.5 text-sm text-text-primary transition hover:bg-background"
                    >
                      Actions
                      {openActionProductId === product.id ? (
                        <ChevronUp size={16} />
                      ) : (
                        <ChevronDown size={16} />
                      )}
                    </button>

                    {openActionProductId === product.id && (
                      <div className="absolute bottom-full right-0 z-10 mb-2 w-46 rounded-lg border border-border bg-surface p-2 shadow-lg">
                        {/* Manage Stock */}
                        <div
                          className="relative"
                          onMouseEnter={() => setIsManageStockOpen(true)}
                          onMouseLeave={() => setIsManageStockOpen(false)}
                        >
                          <button
                            type="button"
                            onClick={() =>
                              setIsManageStockOpen((current) => !current)
                            }
                            aria-expanded={isManageStockOpen}
                            className="flex w-full items-center justify-between rounded-md px-3 py-2 text-left text-sm text-text-primary transition hover:bg-background"
                          >
                            <span className="flex items-center gap-2">
                              <Package size={16} />
                              Manage Stock
                            </span>

                            <ChevronLeft size={16} />
                          </button>

                          {isManageStockOpen && (
                            <div className="absolute right-full top-0 z-20 mr-2 w-44 rounded-lg border border-border bg-surface p-2 shadow-lg">
                              {/* Receive Stock */}
                              <button
                                type="button"
                                onClick={() => {
                                  setReceivingProduct(product);
                                  setIsManageStockOpen(false);
                                  setOpenActionProductId(null);
                                }}
                                className="flex w-full items-center gap-2 rounded-md px-3 py-2 text-left text-sm text-text-primary transition hover:bg-background"
                              >
                                <PackagePlus size={16} />
                                Receive Stock
                              </button>

                              {/* Remove Stock */}
                              <button
                                type="button"
                                onClick={() => {
                                  // We'll implement this action next.
                                  setIsManageStockOpen(false);
                                  setOpenActionProductId(null);
                                }}
                                className="flex w-full items-center gap-2 rounded-md px-3 py-2 text-left text-sm text-text-primary transition hover:bg-background"
                              >
                                <PackageMinus size={16} />
                                Remove Stock
                              </button>

                              {/* Adjust Stock */}
                              <button
                                type="button"
                                onClick={() => {
                                  // We'll implement this action next.
                                  setIsManageStockOpen(false);
                                  setOpenActionProductId(null);
                                }}
                                className="flex w-full items-center gap-2 rounded-md px-3 py-2 text-left text-sm text-text-primary transition hover:bg-background"
                              >
                                <SlidersHorizontal size={16} />
                                Adjust Stock
                              </button>
                            </div>
                          )}
                        </div>

                        {/* ReactivateProduct */}
                        {product.status === "INACTIVE" && (
                          <button
                            type="button"
                            onClick={() => {
                              setReactivatingProduct(product);
                              setOpenActionProductId(null);
                            }}
                            className="flex w-full items-center gap-2 rounded-md px-3 py-2 text-left text-sm text-emerald-600 transition hover:bg-background"
                          >
                            <Power size={16} />
                            Activate
                          </button>
                        )}

                        {/* DeactivateProduct */}
                        {product.status !== "INACTIVE" && (
                          <button
                            type="button"
                            onClick={() => {
                              setDeactivatingProduct(product);
                              setOpenActionProductId(null);
                            }}
                            className="flex w-full items-center gap-2 rounded-md px-3 py-2 text-left text-sm text-amber-600 transition hover:bg-background"
                          >
                            <Power size={16} />
                            Deactivate
                          </button>
                        )}

                        {/* Delete action */}
                        <button
                          type="button"
                          onClick={() => {
                            setDeletingProduct(product);
                            setOpenActionProductId(null);
                          }}
                          className="flex w-full items-center gap-2 rounded-md px-3 py-2 text-left text-sm text-red-500 transition hover:bg-background"
                        >
                          <Trash2 size={16} />
                          Delete
                        </button>

                        <hr className="my-2 border-border" />

                        {/* Edit action */}
                        <button
                          type="button"
                          onClick={() => {
                            handleOpenEditModal(product);
                            setOpenActionProductId(null);
                          }}
                          className="flex w-full items-center gap-2 rounded-md px-3 py-2 text-left text-sm text-text-primary transition hover:bg-background"
                        >
                          <Pencil size={16} />
                          Edit
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))
          )}

          {/* ReceiveStockcomponent-- */}
          <ReceiveStock
            product={receivingProduct}
            onClose={() => setReceivingProduct(null)}
            onSuccess={() => {
              setRefreshKey((currentKey) => currentKey + 1);
            }}
          />

          {/* ReactivateProductcomponent-- */}
          <ReactivateProduct
            product={reactivatingProduct}
            onClose={() => setReactivatingProduct(null)}
            onSuccess={() => {
              setRefreshKey((currentKey) => currentKey + 1);
            }}
          />

          {/* DeactivateProductcomponent-- */}
          <DeactivateProduct
            product={deactivatingProduct}
            onClose={() => setDeactivatingProduct(null)}
            onSuccess={() => {
              setRefreshKey((currentKey) => currentKey + 1);
            }}
          />
        </div>

        <div className="mt-6 flex items-center justify-between border-t border-border pt-4">
          <p className="text-sm text-text-secondary">
            Page {page} of {totalPages}
          </p>

          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => {
                productsSectionRef.current?.scrollIntoView({
                  behavior: "smooth",
                  block: "start",
                });

                setIsLoadingProducts(true);
                setPage((currentPage) => currentPage - 1);
              }}
              disabled={page === 1 || isLoadingProducts}
              className="rounded-lg border border-border px-4 py-2 text-sm text-text-primary transition hover:bg-background disabled:cursor-not-allowed disabled:opacity-50"
            >
              Previous
            </button>

            <button
              type="button"
              onClick={() => {
                productsSectionRef.current?.scrollIntoView({
                  behavior: "smooth",
                  block: "start",
                });

                setIsLoadingProducts(true);
                setPage((currentPage) => currentPage + 1);
              }}
              disabled={page === totalPages || isLoadingProducts}
              className="rounded-lg border border-border px-4 py-2 text-sm text-text-primary transition hover:bg-background disabled:cursor-not-allowed disabled:opacity-50"
            >
              Next
            </button>
          </div>

          {editingProduct && (
            <div
              className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
              onMouseDown={(event) => {
                if (event.target === event.currentTarget) {
                  setEditingProduct(null);
                }
              }}
            >
              <div className="w-full max-w-2xl rounded-xl border border-border bg-surface p-6 shadow-xl">
                <div className="flex items-center justify-between">
                  <h2 className="text-lg font-semibold text-text-primary">
                    Edit Product
                  </h2>

                  <button
                    type="button"
                    onClick={() => setEditingProduct(null)}
                    aria-label="Close edit product modal"
                    className="rounded-lg p-2 text-text-secondary transition hover:bg-background hover:text-text-primary"
                  >
                    <X size={20} />
                  </button>
                </div>

                <p className="mt-1 text-sm text-text-secondary">
                  Update the details for {editingProduct.name}.
                </p>

                <form
                  onSubmit={handleUpdateProduct}
                  className="mt-6 grid max-h-[75vh] grid-cols-1 gap-5 overflow-y-auto pr-1 md:grid-cols-2"
                >
                  {/* Product name */}
                  <div>
                    <label className="text-sm font-medium text-text-primary">
                      Product Name
                    </label>
                    <input
                      type="text"
                      value={editName}
                      onChange={(event) => setEditName(event.target.value)}
                      required
                      className="mt-2 w-full rounded-lg border border-border bg-background px-3 py-2 text-sm outline-none focus:border-primary"
                    />
                  </div>

                  {/* SKU */}
                  <div>
                    <label className="text-sm font-medium text-text-primary">
                      SKU
                    </label>
                    <input
                      type="text"
                      value={editSku}
                      onChange={(event) => setEditSku(event.target.value)}
                      required
                      className="mt-2 w-full rounded-lg border border-border bg-background px-3 py-2 text-sm outline-none focus:border-primary"
                    />
                  </div>

                  {/* Description */}
                  <div className="md:col-span-2">
                    <label className="text-sm font-medium text-text-primary">
                      Description
                    </label>
                    <textarea
                      value={editDescription}
                      onChange={(event) =>
                        setEditDescription(event.target.value)
                      }
                      rows={3}
                      className="mt-2 w-full rounded-lg border border-border bg-background px-3 py-2 text-sm outline-none focus:border-primary"
                    />
                  </div>

                  {/* Cost price */}
                  <div>
                    <label className="text-sm font-medium text-text-primary">
                      Cost Price
                    </label>
                    <input
                      type="number"
                      min="0"
                      value={editCostPrice}
                      onChange={(event) => setEditCostPrice(event.target.value)}
                      required
                      className="mt-2 w-full rounded-lg border border-border bg-background px-3 py-2 text-sm outline-none focus:border-primary"
                    />
                  </div>

                  {/* Selling price */}
                  <div>
                    <label className="text-sm font-medium text-text-primary">
                      Selling Price
                    </label>
                    <input
                      type="number"
                      min="0"
                      value={editSellingPrice}
                      onChange={(event) =>
                        setEditSellingPrice(event.target.value)
                      }
                      required
                      className="mt-2 w-full rounded-lg border border-border bg-background px-3 py-2 text-sm outline-none focus:border-primary"
                    />
                  </div>

                  {/* Minimum stock */}
                  <div>
                    <label className="text-sm font-medium text-text-primary">
                      Minimum Stock
                    </label>
                    <input
                      type="number"
                      min="0"
                      value={editMinimumStock}
                      onChange={(event) =>
                        setEditMinimumStock(event.target.value)
                      }
                      required
                      className="mt-2 w-full rounded-lg border border-border bg-background px-3 py-2 text-sm outline-none focus:border-primary"
                    />
                  </div>

                  {/* Image upload */}
                  <div className="md:col-span-2">
                    <label className="text-sm font-medium text-text-primary">
                      Product Image
                    </label>

                    <div
                      onDragOver={(event) => {
                        event.preventDefault();
                        setIsEditDragging(true);
                      }}
                      onDragLeave={() => setIsEditDragging(false)}
                      onDrop={(event) => {
                        event.preventDefault();
                        setIsEditDragging(false);
                        handleEditImageChange(event.dataTransfer.files?.[0]);
                      }}
                      className={`mt-2 rounded-xl border-2 border-dashed p-5 transition ${
                        isEditDragging
                          ? "border-primary bg-primary/5"
                          : "border-border"
                      }`}
                    >
                      {editImagePreview ? (
                        <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
                          <img
                            src={editImagePreview}
                            alt="Product preview"
                            className="h-28 w-28 rounded-lg object-cover"
                          />

                          <div className="flex flex-wrap gap-3">
                            <label className="cursor-pointer rounded-lg border border-border px-3 py-2 text-sm font-medium text-text-primary transition hover:bg-background">
                              Change Image
                              <input
                                type="file"
                                accept="image/*"
                                className="hidden"
                                onChange={(event) =>
                                  handleEditImageChange(event.target.files?.[0])
                                }
                              />
                            </label>

                            <button
                              type="button"
                              onClick={handleRemoveEditImage}
                              className="rounded-lg px-3 py-2 text-sm font-medium text-red-600 transition hover:bg-red-50"
                            >
                              Remove
                            </button>
                          </div>
                        </div>
                      ) : (
                        <label className="flex cursor-pointer flex-col items-center justify-center py-6 text-center">
                          <ImagePlus
                            size={24}
                            className="text-text-secondary"
                          />
                          <p className="mt-3 text-sm font-medium text-text-primary">
                            Upload product image
                          </p>
                          <p className="mt-1 text-xs text-text-secondary">
                            Drag and drop an image here, or click to browse
                          </p>
                          <input
                            type="file"
                            accept="image/*"
                            className="hidden"
                            onChange={(event) =>
                              handleEditImageChange(event.target.files?.[0])
                            }
                          />
                        </label>
                      )}
                    </div>
                  </div>

                  {/* Modal actions */}
                  <div className="flex justify-end gap-3 md:col-span-2">
                    <button
                      type="button"
                      onClick={() => setEditingProduct(null)}
                      disabled={isUpdatingProduct}
                      className="rounded-lg border border-border px-4 py-2 text-sm text-text-primary transition hover:bg-background disabled:opacity-50"
                    >
                      Cancel
                    </button>

                    <button
                      type="submit"
                      disabled={isUpdatingProduct || !hasEditChanges}
                      className={`rounded-lg px-5 py-2.5 font-medium transition-colors ${
                        isUpdatingProduct || !hasEditChanges
                          ? "cursor-not-allowed bg-gray-400 text-gray-200 opacity-60"
                          : "bg-primary text-white hover:bg-primary/90"
                      }`}
                    >
                      {isUpdatingProduct ? "Saving..." : "Save Changes"}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}

          {deletingProduct && (
            <div
              className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
              onMouseDown={(event) => {
                if (
                  !isDeletingProduct &&
                  event.target === event.currentTarget
                ) {
                  setDeletingProduct(null);
                }
              }}
            >
              <div
                role="alertdialog"
                aria-modal="true"
                aria-labelledby="delete-product-title"
                aria-describedby="delete-product-description"
                className="w-full max-w-md rounded-xl border border-border bg-surface p-6 shadow-xl"
              >
                {/* Dialog heading */}
                <div className="flex items-center justify-between">
                  <h2
                    id="delete-product-title"
                    className="text-lg font-semibold text-text-primary"
                  >
                    Delete Product
                  </h2>

                  <button
                    type="button"
                    disabled={isDeletingProduct}
                    onClick={() => setDeletingProduct(null)}
                    aria-label="Close delete confirmation"
                    className="rounded-lg p-2 text-text-secondary transition hover:bg-background hover:text-text-primary disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    <X size={20} />
                  </button>
                </div>

                {/* Confirmation message */}
                <p
                  id="delete-product-description"
                  className="mt-3 text-sm text-text-secondary"
                >
                  Are you sure you want to delete{" "}
                  <span className="font-semibold text-text-primary">
                    {deletingProduct.name}
                  </span>
                  ? This action will remove the product from your product list.
                </p>

                <div className="mt-4 flex items-start gap-3 rounded-lg border border-red-500/20 bg-red-500/5 p-3">
                  <AlertTriangle
                    size={18}
                    className="mt-0.5 shrink-0 text-red-500"
                  />

                  <p className="text-sm text-red-600">
                    <span className="font-semibold">Important:</span> Once
                    deleted, this product cannot be recovered through the
                    application. Please make sure you want to continue.
                  </p>
                </div>

                {/* Dialog actions */}
                <div className="mt-6 flex justify-end gap-3">
                  <button
                    type="button"
                    disabled={isDeletingProduct}
                    onClick={() => setDeletingProduct(null)}
                    className="rounded-lg border border-border px-4 py-2 text-sm font-medium text-text-primary transition hover:bg-background disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    Cancel
                  </button>

                  <button
                    type="button"
                    disabled={isDeletingProduct}
                    onClick={handleDeleteProduct}
                    className="rounded-lg bg-red-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    {isDeletingProduct ? "Deleting..." : "Delete Product"}
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
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

            <button
              type="button"
              onClick={() => {
                scrollToSection("products");
                setFloatingQuickAccessOpen(false);
              }}
              className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-left text-sm text-text-primary transition hover:bg-background"
            >
              <Package size={16} />
              <span>Products</span>
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
