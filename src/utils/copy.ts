// utils/copyTableData.ts
export function copyTableData<T extends object>(
  data: T[],
  columns: { key: keyof T; label: string }[],
  visibleColumns: string[] = []
) {
  if (!data || data.length === 0) {
    navigator.clipboard.writeText("No data available");
    return;
  }

  // Filter visible columns
  const filteredCols =
    visibleColumns.length > 0
      ? columns.filter((col) => visibleColumns.includes(col.key as string))
      : columns;

  // Build header row
  const header = filteredCols.map((col) => col.label).join("\t");

  // Build data rows
  const rows = data.map((row) =>
    filteredCols.map((col) => String(row[col.key] ?? "")).join("\t")
  );

  // Final table (TSV)
  const tableString = [header, ...rows].join("\n");

  // Copy to clipboard
  navigator.clipboard.writeText(tableString).then(() => {
    alert("✅ Table copied to clipboard!");
  });
}
  


// utils/downloadCSV.ts
export function downloadCSV<T extends object>(
  data: T[],
  columns: { key: keyof T; label: string }[],
  selectedColumns: string[] = [],
  fileName: string = "data.csv"
) {
  if (!data || data.length === 0) {
    alert("No data available to download");
    return;
  }

  // Filter columns based on selectedColumns
  const visibleColumns =
    selectedColumns.length > 0
      ? columns.filter((col) => selectedColumns.includes(col.key as string))
      : columns;

  // Create CSV header
  const header = visibleColumns.map((col) => `"${col.label}"`).join(",");

  // Create CSV rows
  const rows = data.map((row) =>
    visibleColumns
      .map((col) => {
        const cell = row[col.key] ?? "";
        // Escape quotes in cell values
        return `"${String(cell).replace(/"/g, '""')}"`;
      })
      .join(",")
  );

  const csvContent = [header, ...rows].join("\r\n");

  // Create a blob and trigger download
  const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.setAttribute("download", fileName);
  link.click();
  URL.revokeObjectURL(url);
}
