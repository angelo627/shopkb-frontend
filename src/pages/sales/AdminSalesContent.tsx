import { useState } from "react";

import { CreateSale } from "../../features/sales/sections/CreateSale";
import { GetSales } from "../../features/sales/sections/GetSales";

export function AdminSalesContent() {
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  function handleSaleCreated() {
    setRefreshTrigger((previous) => previous + 1);
  }

  return (
    <>
      {/* Create Sale */}
      <CreateSale onSaleCreated={handleSaleCreated} />

      {/* Get Sales */}
      <GetSales refreshTrigger={refreshTrigger} />
    </>
  );
}
