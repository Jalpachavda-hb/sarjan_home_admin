interface Column {
  key: string;
  label: string;
}

/**
 * Prints table data in a new window with basic styling.
 * @param data - Array of objects representing table rows
 * @param columns - Array of column definitions { key, label }
 * @param visibleColumns - Optional array of visible column keys
 */
export function printTableData<T extends object>(
  data: T[],
  columns: Column[],
  visibleColumns: string[] = []
) {
  if (!data || data.length === 0) {
    alert("No data available to print");
    return;
  }

  // Filter columns based on visibility
  const filteredColumns = columns.filter(
    (col) => visibleColumns.length === 0 || visibleColumns.includes(col.key)
  );

  // Create HTML table
  let html = `
    <html>
      <head>
        <title>Print Table</title>
        <style>
          body { font-family: Arial, sans-serif; padding: 20px; }
          table { width: 100%; border-collapse: collapse; }
          th, td { border: 1px solid #333; padding: 8px; text-align: left; }
          th { background-color: #f2f2f2; }
        </style>
      </head>
      <body>
        <h3>Table Data</h3>
        <table>
          <thead>
            <tr>
              <th>Sr. No</th>
              ${filteredColumns.map((col) => `<th>${col.label}</th>`).join("")}
            </tr>
          </thead>
          <tbody>
            ${data
              .map(
                (row, index) =>
                  `<tr>
                    <td>${index + 1}</td>
                    ${filteredColumns
                      .map((col) => `<td>${(row as any)[col.key]}</td>`)
                      .join("")}
                  </tr>`
              )
              .join("")}
          </tbody>
        </table>
      </body>
    </html>
  `;

  // Open new window and print
  const printWindow = window.open("", "_blank", "width=800,height=600");
  if (printWindow) {
    printWindow.document.write(html);
    printWindow.document.close();
    printWindow.focus();
    printWindow.print();
    // printWindow.close(); // optionally close after print
  }
}
