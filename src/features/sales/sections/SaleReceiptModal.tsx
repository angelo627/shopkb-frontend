import { useRef, useState } from "react";
import type { SaleReceiptResponse } from "../api/getSaleReceipt";
import { jsPDF } from "jspdf";
import { useToast } from "../../../components/feedback/useToast";

interface SaleReceiptModalProps {
  receipt: SaleReceiptResponse;
  onClose: () => void;
}

export function SaleReceiptModal({ receipt, onClose }: SaleReceiptModalProps) {
    const { notify } = useToast();
    
    const receiptRef = useRef<HTMLDivElement>(null);

    type PrintFormat = "a4" | "80mm" | "58mm";

    const [printFormat, setPrintFormat] = useState<PrintFormat>("80mm");


  const business = {
    name: "IG GENESIS & SONS",
    address: "Your Business Address",
    phone: "09033379306",
  };

  function formatCurrency(amount: string) {
    return `₦${Number(amount).toLocaleString("en-NG", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    })}`;
  }
  
  
  function handlePrint() {
    if (!receiptRef.current) return;
  
    const printContent = receiptRef.current.cloneNode(true) as HTMLDivElement;
    printContent.id = "sale-receipt-print";
  
    const printStyle = document.createElement("style");
  
    const pageSize =
      printFormat === "a4"
        ? "A4"
        : printFormat === "80mm"
          ? "80mm 300mm"
          : "58mm 150mm";

    const pageMargin = printFormat === "a4" ? "10mm" : "3mm";
  
    printStyle.textContent = `
      @media print {
        @page {
          size: ${pageSize};
          margin: ${pageMargin};
        }
      }
    `;
  
    document.head.appendChild(printStyle);
    document.body.appendChild(printContent);

    document.documentElement.setAttribute("data-receipt-format", printFormat);
  
    function cleanup() {
      printContent.remove();
      printStyle.remove();
      window.removeEventListener("afterprint", cleanup);
      document.documentElement.removeAttribute("data-receipt-format");
    }
  
    window.addEventListener("afterprint", cleanup);
  
    window.print();
  }

  function handleDownloadPDF() {
    try {
      const pageWidth = 80;
      const margin = 5;
      const contentWidth = pageWidth - margin * 2;

      // Calculate the required receipt height first.
      const measurePdf = new jsPDF({
        orientation: "portrait",
        unit: "mm",
        format: [80, 200],
      });

      let requiredHeight = 10;

      function measureText(
        text: string,
        width: number,
        size: number,
        bold = false,
      ) {
        measurePdf.setFont("helvetica", bold ? "bold" : "normal");
        measurePdf.setFontSize(size);

        return measurePdf.splitTextToSize(text, width).length;
      }

      // Business information
      requiredHeight += measureText(business.name, contentWidth, 12, true) * 6;
      requiredHeight += measureText(business.address, contentWidth, 8) * 4;
      requiredHeight += measureText(business.phone, contentWidth, 8) * 4;

      // Separator and transaction information
      requiredHeight += 7;

      const transactionDetails = [
        `Receipt No: ${receipt.saleId}`,
        `Date: ${receiptDate.toLocaleDateString("en-NG")}`,
        `Time: ${receiptDate.toLocaleTimeString("en-NG")}`,
        `Cashier: ${receipt.cashier.fullName}`,
      ];

      transactionDetails.forEach((detail) => {
        requiredHeight += measureText(detail, contentWidth, 8) * 4 + 1;
      });

      requiredHeight += 7;

      // Items heading
      requiredHeight += 7;

      // Purchased items
      receipt.items.forEach((item) => {
        const productLines = measureText(
          `${item.productName}\n${item.sku}\nUnit price: ${formatCurrency(String(item.unitPrice))}`,
          38,
          8,
        );

        requiredHeight += Math.max(productLines * 4, 4) + 2;
      });

      // Grand total and footer
      requiredHeight += 20;

      requiredHeight +=
        measureText("Thank you for shopping with us!", contentWidth, 8) * 4;

      requiredHeight +=
        measureText(
          "Please keep this receipt for your records.",
          contentWidth,
          7,
        ) * 3;

      requiredHeight += 10;

      // Create PDF using the calculated height.
      const pdf = new jsPDF({
        orientation: "portrait",
        unit: "mm",
        format: [pageWidth, requiredHeight],
      });

      let y = 10;

      function centerText(text: string, size = 9, bold = false) {
        pdf.setFont("helvetica", bold ? "bold" : "normal");
        pdf.setFontSize(size);

        const lines = pdf.splitTextToSize(text, contentWidth);

        pdf.text(lines, pageWidth / 2, y, {
          align: "center",
        });

        y += lines.length * (size * 0.45);
      }

      function separator() {
        y += 2;

        pdf.setLineDashPattern([1, 1], 0);
        pdf.line(margin, y, pageWidth - margin, y);
        pdf.setLineDashPattern([], 0);

        y += 5;
      }

      // Business information
      centerText(business.name, 12, true);
      centerText(business.address, 8);
      centerText(business.phone, 8);

      separator();

      // Transaction information
      pdf.setFont("helvetica", "normal");
      pdf.setFontSize(8);

      transactionDetails.forEach((detail) => {
        const lines = pdf.splitTextToSize(detail, contentWidth);
        pdf.text(lines, margin, y);
        y += lines.length * 4 + 1;
      });

      separator();

      // Purchased items heading
      pdf.setFont("helvetica", "bold");
      pdf.setFontSize(8);

      pdf.text("Item", margin, y);
      pdf.text("Qty", 49, y, { align: "center" });
      pdf.text("Amount", 75, y, { align: "right" });

      y += 5;

      // Purchased items
      pdf.setFont("helvetica", "normal");

      receipt.items.forEach((item) => {
        const productLines = pdf.splitTextToSize(
          `${item.productName}\n${item.sku}\nUnit price: ${formatCurrency(String(item.unitPrice))}`,
          38,
        );

        pdf.text(productLines, margin, y);

        pdf.text(String(item.quantity), 49, y, {
          align: "center",
        });

        pdf.text(formatCurrency(String(item.totalAmount)), 75, y, {
          align: "right",
        });

        y += productLines.length * 4 + 2;
      });

      separator();

      // Grand total
      pdf.setFont("helvetica", "bold");
      pdf.setFontSize(10);

      pdf.text("Grand Total", margin, y);

      pdf.text(formatCurrency(String(receipt.totalAmount)), 75, y, {
        align: "right",
      });

      y += 10;

      // Footer
      centerText("Thank you for shopping with us!", 8);
      centerText("Please keep this receipt for your records.", 7);

      pdf.save(`ShopKB-Receipt-${receipt.saleId}.pdf`);
    } catch (error) {
      notify({
        type: "error",
        message:
          error instanceof Error
            ? error.message
            : "PDF download failed. Please try again.",
      });
    }
  }
  

  const receiptDate = new Date(receipt.receiptDate);

  
  const itemsPerPage =
  printFormat === "a4" ? 30 : printFormat === "80mm" ? 15 : 8;

  const receiptPages = Array.from(
    { length: Math.ceil(receipt.items.length / itemsPerPage) },
    (_, index) =>
      receipt.items.slice(index * itemsPerPage, (index + 1) * itemsPerPage),
  );


  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
      role="dialog"
      aria-modal="true"
      aria-label="Sales receipt"
    >
      <div className="flex max-h-[90vh] w-full max-w-md flex-col overflow-hidden rounded-xl bg-surface shadow-xl">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-border p-4">
          <div>
            <h2 className="text-lg font-semibold text-text-primary">
              Sales Receipt
            </h2>
            <p className="text-sm text-text-secondary">
              Transaction completed successfully
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="rounded-lg p-2 text-text-secondary transition hover:bg-background hover:text-text-primary"
            aria-label="Close receipt"
          >
            ✕
          </button>
        </div>

        {/* Print Format */}
        <div className="border-b border-border p-4">
          <label
            htmlFor="print-format"
            className="mb-2 block text-sm font-medium text-text-primary"
          >
            Printer Format
          </label>

          <select
            id="print-format"
            value={printFormat}
            onChange={(e) => setPrintFormat(e.target.value as PrintFormat)}
            className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm text-text-primary outline-none focus:border-primary"
          >
            <option value="a4">A4 Printer</option>
            <option value="80mm">80mm Thermal Printer</option>
            <option value="58mm">58mm Mini Thermal Printer</option>
          </select>
        </div>

        {/* Receipt Preview */}
        <div className="overflow-y-auto p-5">
          <div
            ref={receiptRef}
            id="sale-receipt"
            data-print-format={printFormat}
            className="receipt-container"
          >
            {receiptPages.map((pageItems, pageIndex) => (
              <div
                key={pageIndex}
                className={`receipt-page mx-auto bg-white p-5 text-black ${
                  printFormat === "a4"
                    ? "w-full max-w-175"
                    : printFormat === "80mm"
                      ? "w-[80mm] max-w-full"
                      : "w-[58mm] max-w-full"
                }`}
              >
                {/* Business Information */}
                <div className="text-center">
                  <h3 className="text-xl font-bold">{business.name}</h3>
                  <p className="mt-1 text-xs text-gray-600">
                    {business.address}
                  </p>
                  <p className="text-xs text-gray-600">{business.phone}</p>
                </div>

                <div className="my-4 border-t border-dashed border-gray-400" />

                {/* Transaction Information */}
                <div className="space-y-1 text-xs">
                  <div className="flex justify-between">
                    <span>Receipt No:</span>
                    <span className="break-all text-right">
                      {receipt.saleId}
                    </span>
                  </div>

                  <div className="flex justify-between">
                    <span>Date:</span>
                    <span>{receiptDate.toLocaleDateString("en-NG")}</span>
                  </div>

                  <div className="flex justify-between">
                    <span>Time:</span>
                    <span>{receiptDate.toLocaleTimeString("en-NG")}</span>
                  </div>

                  <div className="flex justify-between">
                    <span>Cashier:</span>
                    <span>{receipt.cashier.fullName}</span>
                  </div>
                </div>

                <div className="my-4 border-t border-dashed border-gray-400" />

                {/* Purchased Items */}
                <table className="w-full text-xs">
                  <thead>
                    <tr className="border-b border-gray-300 text-left">
                      <th className="py-2">Item</th>
                      <th className="py-2 text-center">Qty</th>
                      <th className="py-2 text-right">Amount</th>
                    </tr>
                  </thead>

                  <tbody>
                    {pageItems.map((item) => (
                      <tr key={item.productId} className="align-top">
                        <td className="py-2 pr-2">
                          <p className="font-medium">{item.productName}</p>
                          <p className="text-gray-500">{item.sku}</p>
                          <p className="text-gray-500">
                            {formatCurrency(String(item.unitPrice))} each
                          </p>
                        </td>

                        <td className="py-2 text-center">{item.quantity}</td>

                        <td className="py-2 text-right font-medium">
                          {formatCurrency(String(item.totalAmount))}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>

                {/* Final Page Only */}
                {pageIndex === receiptPages.length - 1 && (
                  <>
                    <div className="my-3 border-t border-dashed border-gray-400" />

                    <div className="flex justify-between text-sm font-bold">
                      <span>Grand Total</span>
                      <span>{formatCurrency(String(receipt.totalAmount))}</span>
                    </div>

                    <div className="my-4 border-t border-dashed border-gray-400" />

                    <p className="text-center text-xs text-gray-600">
                      Thank you for shopping with us!
                    </p>

                    <p className="mt-1 text-center text-[10px] text-gray-500">
                      Please keep this receipt for your records.
                    </p>
                  </>
                )}

                {/* Page Number */}
                <p className="mt-4 text-center text-[10px] text-gray-500">
                  Page {pageIndex + 1} of {receiptPages.length}
                </p>
              </div>
            ))}
          </div>
        </div>

        <div className="flex gap-3 border-t border-border p-4">
          <button
            type="button"
            onClick={handlePrint}
            className="flex-1 rounded-lg border border-border px-4 py-3 text-sm font-semibold text-text-primary transition hover:bg-background"
          >
            Print Receipt
          </button>

          <button
            type="button"
            onClick={handleDownloadPDF}
            className="flex-1 rounded-lg bg-primary px-4 py-3 text-sm font-semibold text-white transition hover:opacity-90"
          >
            Download PDF
          </button>
        </div>
      </div>
    </div>
  );
}
