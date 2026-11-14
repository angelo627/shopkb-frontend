import type { ProductListItem } from "../../products/api/getProducts";

export interface SelectedSaleItem {
  product: ProductListItem;
  quantity: number;
}
