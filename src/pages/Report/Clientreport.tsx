import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableRow,
} from "../../components/ui/table";
import TablePagination from "@mui/material/TablePagination";
import { useState, useMemo, useEffect } from "react";
import { printTableData } from "../../utils/printTableData";
import { usePermissions } from "../../hooks/usePermissions";
import AccessDenied from "../../components/ui/AccessDenied";
import {
  TextField,
  Button,
  Select,
  MenuItem,
  FormControl,
  Checkbox,
  ListItemText,
} from "@mui/material";
import {
  fetchClientReports,
  fetchClientReportSummary,
} from "../../utils/Handlerfunctions/getdata";
import { copyTableData, downloadCSV } from "../../utils/copy";

// interface for your API response row
interface ClientReport {
  id: string;
  clientName: string;
  purchasedSiteName: string;
  unitType: string;
  unitNumber: string;
  principalAmount: string;
  gstAmount: string;
  receivedPrincipalAmount: string;
  receivedGstAmount: string;
  remainingPrincipalAmount: string;
  remainingGstAmount: string;
  ledger: string;
}
type ColumnConfig = {
  key: keyof ClientReport;
  label: string;
};

export default function Clientreport() {
  const { canView, loading: permissionLoading } = usePermissions();
  const canViewReports = canView("Reports");
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [selectedColumns, setSelectedColumns] = useState<string[]>([]);
  const [search, setSearch] = useState("");
  const [tableData, setTableData] = useState<ClientReport[]>([]);
  const [summary, setSummary] = useState({
    total_principal_amount: "₹0",
    total_gst_amount: "₹0",
    total_received_principal_amount: "₹0",
    total_received_gst_amount: "₹0",
    total_remaining_principal_amount: "₹0",
    total_remaining_gst_amount: "₹0",
  });

 const columns: ColumnConfig[] = [
    { key: "clientName", label: "Client Name" },
    { key: "purchasedSiteName", label: "Purchased Site Name" },
    { key: "unitType", label: "Unit Type" },
    { key: "unitNumber", label: "Unit Number" },
    { key: "principalAmount", label: "Principal Amount" },
    { key: "gstAmount", label: "GST Amount" },
    { key: "receivedPrincipalAmount", label: "Received Principal Amount" },
    { key: "receivedGstAmount", label: "Received GST Amount" },
    { key: "remainingPrincipalAmount", label: "Remaining Principal Amount" },
    { key: "remainingGstAmount", label: "Remaining GST Amount" },
    { key: "ledger", label: "Ledger" },
  ];

  // fetch reports
  useEffect(() => {
    const loadData = async () => {
      const reports = await fetchClientReports("1"); // pass adminId dynamically
      if (reports) {
        setTableData(reports);
      }
    };
    loadData();
  }, []);

  // fetch summary
  useEffect(() => {
    const loadSummary = async () => {
      const data = await fetchClientReportSummary("");
      if (data) {
        setSummary(data);
      }
    };
    loadSummary();
  }, []);

  const handleChangePage = (_: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const isColumnVisible = (column: string) =>
    selectedColumns.length === 0 || selectedColumns.includes(column);

  // Search filter
  const filteredData = tableData.filter((item) => {
    const searchTerm = search.trim().toLowerCase();
    const matchesSearch = Object.values(item)
      .map((val) => String(val).trim().toLowerCase())
      .join(" ")
      .includes(searchTerm);

    return matchesSearch;
  });

  const paginatedData = useMemo(() => {
    return filteredData.slice(
      page * rowsPerPage,
      page * rowsPerPage + rowsPerPage
    );
  }, [filteredData, page, rowsPerPage]);

  // Show loader while checking permissions
  if (permissionLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  // Show Access Denied if user doesn't have view permission
  if (!canViewReports) {
    return (
      <AccessDenied message="You don't have permission to view client reports." />
    );
  }

  return (
    <>
      <div className="font-poppins text-gray-800 dark:text-white">
        <h3 className="text-lg font-semibold mb-5">Client Purchase Reports</h3>

        <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white dark:bg-white/[0.03] px-4 pb-3 pt-4 sm:px-6">
          {/* Top Controls */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
            <div className="flex flex-wrap gap-2 items-center">
              <Button
                size="small"
                variant="contained"
                className="!bg-green-600 hover:!bg-green-700 text-white"
                onClick={() =>
                  copyTableData(filteredData, columns, selectedColumns)
                }
              >
                Copy
              </Button>
              <Button
                size="small"
                variant="contained"
                className="!bg-blue-600 hover:!bg-blue-700 text-white"
                onClick={() =>
                  downloadCSV(
                    filteredData,
                    columns,
                    selectedColumns,
                    "Client_report.csv"
                  )
                }
              >
                CSV
              </Button>
              <Button
                size="small"
                variant="contained"
                className="!bg-amber-500 hover:!bg-amber-600 text-white"
                onClick={() =>
                  printTableData(filteredData, columns, selectedColumns)
                }
              >
                Print
              </Button>

              {/* Select Columns Dropdown */}
              <FormControl size="small" sx={{ minWidth: 200 }}>
                <Select
                  multiple
                  value={selectedColumns}
                  onChange={(e) => {
                    const value = e.target.value;
                    setSelectedColumns(
                      typeof value === "string" ? value.split(",") : value
                    );
                  }}
                  displayEmpty
                  renderValue={() => "Select Columns"}
                  className="bg-white dark:bg-gray-200 rounded-md"
                  sx={{
                    fontFamily: "Poppins",
                    "& .MuiSelect-select": {
                      color: "#6B7280",
                      fontWeight: 300,
                    },
                  }}
                  MenuProps={{
                    PaperProps: {
                      sx: { maxHeight: 300, fontFamily: "Poppins" },
                    },
                  }}
                >
                  {columns.map((col) => (
                    <MenuItem key={col.key} value={col.key}>
                      <Checkbox checked={selectedColumns.includes(col.key)} />
                      <ListItemText primary={col.label} />
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </div>

            {/* Search */}
            <div className="flex justify-end items-center">
              <TextField
                size="small"
                variant="outlined"
                placeholder="Search..."
                value={search}
                onChange={(e) => setSearch(e.target.value.trimStart())}
              />
            </div>
          </div>

          {/* Table */}

          <div className="max-w-full overflow-x-auto mt-8">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableCell className="columtext">Sr. No</TableCell>
                  {isColumnVisible("clientName") && (
                    <TableCell className="columtext">Client Name</TableCell>
                  )}
                  {isColumnVisible("purchasedSiteName") && (
                    <TableCell className="columtext">
                      Purchased Site Name
                    </TableCell>
                  )}
                  {isColumnVisible("unitType") && (
                    <TableCell className="columtext">Unit Type</TableCell>
                  )}
                  {isColumnVisible("unitNumber") && (
                    <TableCell className="columtext">Unit Number</TableCell>
                  )}
                  {isColumnVisible("principalAmount") && (
                    <TableCell className="columtext">
                      Principal Amount
                    </TableCell>
                  )}
                  {isColumnVisible("gstAmount") && (
                    <TableCell className="columtext">GST Amount</TableCell>
                  )}
                  {isColumnVisible("receivedPrincipalAmount") && (
                    <TableCell className="columtext">
                      Received Principal Amount
                    </TableCell>
                  )}
                  {isColumnVisible("receivedGstAmount") && (
                    <TableCell className="columtext">
                      Received GST Amount
                    </TableCell>
                  )}
                  {isColumnVisible("remainingPrincipalAmount") && (
                    <TableCell className="columtext">
                      Remaining Principal Amount
                    </TableCell>
                  )}
                  {isColumnVisible("remainingPrincipalAmount") && (
                    <TableCell className="columtext">
                      Remaining GST Amount
                    </TableCell>
                  )}
                  {isColumnVisible("ledger") && (
                    <TableCell className="columtext">Ledger</TableCell>
                  )}
                </TableRow>
              </TableHeader>

              <TableBody>
                {paginatedData.length === 0 ? (
                  <TableRow>
                    <TableCell className="rowtext text-center py-12">
                      No data available
                    </TableCell>
                  </TableRow>
                ) : (
                  paginatedData.map((item, index) => (
                    <TableRow key={item.id}>
                      <TableCell className="rowtext">
                        {page * rowsPerPage + index + 1}
                      </TableCell>
                      {isColumnVisible("clientName") && (
                        <TableCell className="rowtext">
                          {item.clientName}
                        </TableCell>
                      )}
                      {isColumnVisible("purchasedSiteName") && (
                        <TableCell className="rowtext">
                          {item.purchasedSiteName}
                        </TableCell>
                      )}
                      {isColumnVisible("unitType") && (
                        <TableCell className="rowtext unitTypeCell">
                          {item.unitType}
                        </TableCell>
                      )}
                      {isColumnVisible("unitNumber") && (
                        <TableCell className="rowtext">
                          {item.unitNumber}
                        </TableCell>
                      )}
                      {isColumnVisible("principalAmount") && (
                        <TableCell className="rowtext">
                          {item.principalAmount}
                        </TableCell>
                      )}
                      {isColumnVisible("gstAmount") && (
                        <TableCell className="rowtext">
                          {item.gstAmount}
                        </TableCell>
                      )}
                      {isColumnVisible("receivedPrincipalAmount") && (
                        <TableCell className="rowtext">
                          {item.receivedPrincipalAmount}
                        </TableCell>
                      )}
                      {isColumnVisible("receivedGstAmount") && (
                        <TableCell className="rowtext">
                          {item.receivedGstAmount}
                        </TableCell>
                      )}
                      {isColumnVisible("remainingPrincipalAmount") && (
                        <TableCell className="rowtext">
                          {item.remainingPrincipalAmount}
                        </TableCell>
                      )}
                      {isColumnVisible("remainingGstAmount") && (
                        <TableCell className="rowtext">
                          {item.remainingGstAmount}
                        </TableCell>
                      )}
                      {isColumnVisible("ledger") && (
                        <TableCell className="rowtext">
                          {item.ledger ? (
                            <a
                              href={item.ledger}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-blue-600 underline"
                            >
                              View
                            </a>
                          ) : (
                            "-"
                          )}
                        </TableCell>
                      )}
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>

          {/* Footer */}
          <div className="mt-4 flex justify-between items-center">
            <p className="text-sm">
              Showing {filteredData.length === 0 ? 0 : page * rowsPerPage + 1}–
              {Math.min((page + 1) * rowsPerPage, filteredData.length)} of{" "}
              {filteredData.length} entries
            </p>
            <TablePagination
              component="div"
              count={filteredData.length}
              page={page}
              onPageChange={handleChangePage}
              rowsPerPage={rowsPerPage}
              onRowsPerPageChange={handleChangeRowsPerPage}
              rowsPerPageOptions={[5, 10, 25, 30]}
              labelRowsPerPage="Rows per page:"
            />
          </div>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 mt-4">
        {[
          {
            title: "Total Principal Amount",
            value: summary.total_principal_amount,
          },
          { title: "Total GST Amount", value: summary.total_gst_amount },
          {
            title: "Received Principal Amount",
            value: summary.total_received_principal_amount,
          },
          {
            title: "Received GST Amount",
            value: summary.total_received_gst_amount,
          },
          {
            title: "Remaining Principal Amount",
            value: summary.total_remaining_principal_amount,
          },
          {
            title: "Remaining GST Amount",
            value: summary.total_remaining_gst_amount,
          },
        ].map((item, index) => (
          <div
            key={index}
            className="bg-[#0d2250] text-white rounded-sm shadow-md p-5 flex flex-col justify-center"
          >
            <h6 className="text-sm font-semibold mb-1">{item.title}</h6>
            <p className="text-lg font-semibold">{item.value}</p>
          </div>
        ))}
      </div>
    </>
  );
}
