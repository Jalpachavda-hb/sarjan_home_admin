import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableRow,
} from "../../components/ui/table";
import Badge from "../../components/ui/badge/Badge";
import { MdFileDownload } from "react-icons/md";
import TablePagination from "@mui/material/TablePagination";
import { useState, useEffect } from "react";
import { MdDelete } from "react-icons/md";
import { getAdminId } from "../../utils/Handlerfunctions/getdata";
import { fetchPaymentDetails } from "../../utils/Handlerfunctions/getdata";
import { destroyPaymentDetails } from "../../utils/Handlerfunctions/formdeleteHandlers";
import Swal from "sweetalert2";
import { toast } from "react-toastify";

import SiteFilter from "../../components/form/input/FilterbySite";
import {
  TextField,
  Button,
  Select,
  MenuItem,
  InputLabel,
  FormControl,
  Checkbox,
  ListItemText,
  IconButton,
} from "@mui/material";

interface Payment {
  id: number;
  clientName: string;
  siteName: string;
  unitNo: string;
  propertyAmount: string;
  gstAmount: string;
  receivedDate: string;
  receivedAmountType: string;
  receivedAmount: string;
  receiptUrl?: string;
}

export default function Payment() {
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [search, setSearch] = useState("");
  const [siteFilter, setSiteFilter] = useState("");
  const [dateFilter, setDateFilter] = useState("");
  const [selectedColumns, setSelectedColumns] = useState<string[]>([]);
  const [siteOptions, setSiteOptions] = useState<any[]>([]);
  const [tableData, setTableData] = useState<Payment[]>([]);

  useEffect(() => {
    const loadPayments = async () => {
      const adminId = getAdminId();
      if (!adminId) return;

      const data = await fetchPaymentDetails(
        adminId,
        siteFilter || "",
        dateFilter ? Number(dateFilter) : 0
      );
      setTableData(data);
    };
    loadPayments();
  }, [siteFilter, dateFilter]);
  const handleChangePage = (_: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleDelete = async (payment_id: number) => {
    const result = await Swal.fire({
      title: "Are you sure?",
      text: "You won’t be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete it!",
    });

    if (result.isConfirmed) {
      try {
        await destroyPaymentDetails(payment_id);

        // 🔥 Option 2 (better): refetch fresh data from backend
        const adminId = getAdminId();
        const updatedData = await fetchPaymentDetails(adminId);
        setTableData(updatedData);

        toast.success("Deleted successfully!");
      } catch (err) {
        console.error("Delete failed:", err);
        toast.error("Failed to delete document. Please try again.");
      }
    }
  };

  const handleChangeRowsPerPage = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const isColumnVisible = (column: string) =>
    selectedColumns.length === 0 || selectedColumns.includes(column);

  const filteredData = tableData.filter((item) => {
    const searchTerm = search.trim().toLowerCase();
    return Object.values(item)
      .map((val) => String(val).trim().toLowerCase())
      .join(" ")
      .includes(searchTerm);
  });

  const paginatedData = filteredData.slice(
    page * rowsPerPage,
    page * rowsPerPage + rowsPerPage
  );

  return (
    <div className="font-poppins text-gray-800 dark:text-white">
      <h3 className="text-lg font-semibold mb-5">Payment Details</h3>

      <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white dark:bg-white/[0.03] px-4 pb-3 pt-4 sm:px-6">
        {/* Filters */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
          <div className="flex flex-wrap gap-2 items-center">
            <Button
              size="small"
              variant="contained"
              className="!bg-amber-500 hover:!bg-amber-600 text-white"
            >
              Print
            </Button>

            {/* Select Columns */}
            <FormControl size="small" sx={{ minWidth: 200 }}>
              <InputLabel sx={{ fontFamily: "Poppins" }}></InputLabel>
              <Select
                multiple
                value={selectedColumns}
                onChange={(e) =>
                  setSelectedColumns(
                    typeof e.target.value === "string"
                      ? e.target.value.split(",")
                      : e.target.value
                  )
                }
                displayEmpty
                renderValue={() => "Select Columns"}
                sx={{
                  fontFamily: "Poppins",
                  "& .MuiSelect-select": {
                    color: "#6B7280",
                    fontWeight: 300,
                  },
                }}
              >
                {[
                  "clientName",
                  "siteName",
                  "unitNo",
                  "propertyAmount",
                  "gstAmount",
                  "receivedDate",
                  "receivedAmountType",
                  "receivedAmount",
                  "receiptUrl",
                ].map((col) => (
                  <MenuItem
                    key={col}
                    value={col}
                    sx={{ fontFamily: "Poppins" }}
                  >
                    <Checkbox checked={selectedColumns.includes(col)} />
                    <ListItemText
                      primary={
                        {
                          clientName: "Client Name",
                          siteName: "Site Name",
                          unitNo: "Unit Number",
                          propertyAmount: "Property Amount",
                          gstAmount: "GST Amount",
                          receivedDate: "Received Date",
                          receivedAmountType: "Received Amount Type",
                          receivedAmount: "Received Amount",
                          receiptUrl: "Payment Receipt",
                        }[col]
                      }
                    />
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            {/* Date Filter */}
            <FormControl size="small" sx={{ minWidth: 160 }}>
              <InputLabel
                id="date-filter-label"
                sx={{ fontFamily: "Poppins, sans-serif" }}
              >
                Filter by Date
              </InputLabel>
              <Select
                labelId="date-filter-label"
                value={dateFilter}
                onChange={(e) => setDateFilter(Number(e.target.value))}
                label="Filter by Date"
                sx={{ fontFamily: "Poppins, sans-serif", fontSize: "14px" }}
              >
                <MenuItem value={0} sx={{ fontFamily: "Poppins, sans-serif" }}>
                  All Dates
                </MenuItem>
                <MenuItem value={3} sx={{ fontFamily: "Poppins, sans-serif" }}>
                  Last 3 Days
                </MenuItem>
                <MenuItem value={7} sx={{ fontFamily: "Poppins, sans-serif" }}>
                  Last 7 Days
                </MenuItem>
              </Select>
            </FormControl>
          </div>

          <div className="flex flex-wrap gap-2 justify-start sm:justify-end items-center">
            {/* Site Filter */}
            <SiteFilter
              value={siteFilter}
              onChange={(e) => setSiteFilter(e.target.value)}
            />

            {/* Search */}
            <TextField
              size="small"
              placeholder="Search..."
              value={search}
              onChange={(e) => setSearch(e.target.value.trimStart())}
            />

            <a href="/admin/payments/add">
              <Button
                size="small"
                variant="contained"
                className="!bg-indigo-700 hover:!bg-indigo-900 text-white p-3 h-10"
              >
                + Add
              </Button>
            </a>
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
                {isColumnVisible("siteName") && (
                  <TableCell className="columtext">Site Name</TableCell>
                )}
                {isColumnVisible("unitNo") && (
                  <TableCell className="columtext">Unit Number</TableCell>
                )}
                {isColumnVisible("propertyAmount") && (
                  <TableCell className="columtext">Property Amount</TableCell>
                )}
                {isColumnVisible("gstAmount") && (
                  <TableCell className="columtext">GST Amount</TableCell>
                )}
                {isColumnVisible("receivedDate") && (
                  <TableCell className="columtext">Received Date</TableCell>
                )}
                {isColumnVisible("receivedAmountType") && (
                  <TableCell className="columtext">
                    Received Amount Type
                  </TableCell>
                )}
                {isColumnVisible("receivedAmount") && (
                  <TableCell className="columtext">Received Amount</TableCell>
                )}
                {isColumnVisible("receiptUrl") && (
                  <TableCell className="columtext">Receipt</TableCell>
                )}
                {isColumnVisible("Delete") && (
                  <TableCell className="columtext">Delete</TableCell>
                )}
              </TableRow>
            </TableHeader>

            <TableBody>
              {paginatedData.length > 0 ? (
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
                    {isColumnVisible("siteName") && (
                      <TableCell className="rowtext">{item.siteName}</TableCell>
                    )}
                    {isColumnVisible("unitNo") && (
                      <TableCell className="rowtext">{item.unitNo}</TableCell>
                    )}
                    {isColumnVisible("propertyAmount") && (
                      <TableCell className="rowtext">
                        {item.propertyAmount}
                      </TableCell>
                    )}
                    {isColumnVisible("gstAmount") && (
                      <TableCell className="rowtext">
                        {item.gstAmount}
                      </TableCell>
                    )}
                    {isColumnVisible("receivedDate") && (
                      <TableCell className="rowtext">
                        {item.receivedDate.split(" ")[0]} {/* Only show date */}
                      </TableCell>
                    )}
                    {isColumnVisible("receivedAmountType") && (
                      <TableCell className="rowtext">
                        <Badge
                          size="sm"
                          color={
                            item.receivedAmountType === "Principal Amount"
                              ? "success"
                              : item.receivedAmountType === "GST Amount"
                              ? "warning"
                              : "error"
                          }
                        >
                          {item.receivedAmountType}
                        </Badge>
                      </TableCell>
                    )}
                    {isColumnVisible("receivedAmount") && (
                      <TableCell className="rowtext">
                        {item.receivedAmount}
                      </TableCell>
                    )}
                    {isColumnVisible("receiptUrl") && (
                      <TableCell>
                        {item.receiptUrl ? (
                          <a href={item.receiptUrl} target="_blank" download>
                            <IconButton color="primary">
                              <MdFileDownload />
                            </IconButton>
                          </a>
                        ) : (
                          <Badge size="sm" color={"error"}>
                            No Receipt
                          </Badge>
                        )}
                      </TableCell>
                    )}
                    {isColumnVisible("Delete") && (
                      <TableCell className="rowtext">
                        <Badge variant="light" color="error">
                          <MdDelete
                            className="text-2xl cursor-pointer"
                            onClick={() => handleDelete(item.id)}
                          />
                        </Badge>
                      </TableCell>
                    )}
                  </TableRow>
                ))
              ) : (
                <TableRow className="rowtext">
                  <TableCell
                    colSpan={11}
                    className="text-center py-4 text-gray-500 font-poppins"
                  >
                    No data available
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>

        {/* Pagination */}
        <div className="mt-4 flex justify-between items-center w-full">
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
            rowsPerPageOptions={[5, 10, 25]}
          />
        </div>
      </div>
    </div>
  );
}
