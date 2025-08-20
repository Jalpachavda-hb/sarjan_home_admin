import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableRow,
} from "../ui/table";
import Badge from "../ui/badge/Badge";
import TablePagination from "@mui/material/TablePagination";
import { useState } from "react";
import {
  TextField,
  Button,
  Select,
  MenuItem,
  InputLabel,
  FormControl,
  Checkbox,
  ListItemText,
} from "@mui/material";

interface Payment {
  id: number;
  clientName: string;
  siteName: string;
  unit: string;
  unitNo: string;
  amount: string;
  amountType: "Cash" | "Cheque" | "Online";
  receivedDate: string;
}

const tableData: Payment[] = [
  {
    id: 1,
    clientName: "Ramesh Patel",
    siteName: "Green Acres",
    unit: "Bungalow",
    unitNo: "B-102",
    amount: "₹1,50,000",
    amountType: "Online",
    receivedDate: "2025-08-07",
  },
  {
    id: 2,
    clientName: "Sunita Sharma",
    siteName: "Skyline Residency",
    unit: "Flat",
    unitNo: "A-203",
    amount: "₹90,000",
    amountType: "Cheque",
    receivedDate: "2025-08-06",
  },
  {
    id: 3,
    clientName: "Manish Mehta",
    siteName: "Sunshine Valley",
    unit: "Villa",
    unitNo: "V-008",
    amount: "₹2,00,000",
    amountType: "Cash",
    receivedDate: "2025-08-05",
  },
  {
    id: 4,
    clientName: "Nirali Desai",
    siteName: "Emerald Heights",
    unit: "Apartment",
    unitNo: "C-301",
    amount: "₹1,20,000",
    amountType: "Online",
    receivedDate: "2025-08-07",
  },
  {
    id: 5,
    clientName: "Amit Shah",
    siteName: "Harmony Homes",
    unit: "Penthouse",
    unitNo: "PH-01",
    amount: "₹3,50,000",
    amountType: "Cheque",
    receivedDate: "2025-08-06",
  },
  {
    id: 6,
    clientName: "Kajal Trivedi",
    siteName: "Silver Estate",
    unit: "Villa",
    unitNo: "V-110",
    amount: "₹2,10,000",
    amountType: "Online",
    receivedDate: "2025-08-06",
  },
  {
    id: 7,
    clientName: "Devanshi Shah",
    siteName: "Golden Villa",
    unit: "Flat",
    unitNo: "D-302",
    amount: "₹1,10,000",
    amountType: "Cash",
    receivedDate: "2025-08-07",
  },
];

export default function TodayReceivedpayment() {
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [search, setSearch] = useState("");
  const [siteFilter, setSiteFilter] = useState("");
  const [selectedColumns, setSelectedColumns] = useState<string[]>([]);

  const handleChangePage = (_: unknown, newPage: number) => {
    setPage(newPage);
  };

  const isColumnVisible = (column: string) =>
    selectedColumns.length === 0 || selectedColumns.includes(column);

  const handleChangeRowsPerPage = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const filteredData = tableData.filter((item) => {
    const searchTerm = search.trim().toLowerCase(); // remove spaces at start & end

    const matchesSearch = Object.values(item)
      .map((val) => String(val).trim().toLowerCase()) // trim each value
      .join(" ")
      .includes(searchTerm);

    const matchesSite = siteFilter
      ? item.siteName.trim() === siteFilter.trim()
      : true;

    return matchesSearch && matchesSite;
  });
  const paginatedData = filteredData.slice(
    page * rowsPerPage,
    page * rowsPerPage + rowsPerPage
  );

  const uniqueSites = [...new Set(tableData.map((item) => item.siteName))];

  return (
    <div className="font-poppins text-gray-800 dark:text-white">
      <h3 className="text-lg font-semibold mb-5">Today's Received Payment</h3>

      <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white dark:bg-white/[0.03] px-4 pb-3 pt-4 sm:px-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
          {/* Left Column */}
          <div className="flex flex-wrap gap-2 items-center">
            <Button
              size="small"
              variant="contained"
              className="!bg-green-600 hover:!bg-green-700 text-white"
            >
              Copy
            </Button>
            <Button
              size="small"
              variant="contained"
              className="!bg-blue-600 hover:!bg-blue-700 text-white"
            >
              CSV
            </Button>
            <Button
              size="small"
              variant="contained"
              className="!bg-amber-500 hover:!bg-amber-600 text-white"
            >
              Print
            </Button>

            {/* Select Columns Dropdown */}
            <FormControl size="small" sx={{ minWidth: 200 }}>
              <InputLabel
                className="text-gray-700 dark:text-white"
                sx={{ fontFamily: "Poppins" }}
              >
                {/* Select Columns */}
              </InputLabel>
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
                    color: "#6B7280", // ✅ Your custom font color (e.g., Tailwind's gray-500)
                    fontWeight: 300, // Optional: boldness
                  },
                }}
                MenuProps={{
                  PaperProps: {
                    sx: { maxHeight: 300, fontFamily: "Poppins" },
                  },
                }}
              >
                {[
                  "clientName",
                  "siteName",
                  "unit",
                  "unitNo",
                  "amount",
                  "amountType",
                  "receivedDate",
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
                          unit: "Unit",
                          unitNo: "Unit No.",
                          amount: "Received Amount",
                          amountType: "Amount Type",
                          receivedDate: "Received Date",
                        }[col]
                      }
                    />
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </div>

          {/* Right Column */}
          <div className="flex flex-wrap gap-2 justify-start sm:justify-end items-center">
            {/* Filter by Site Dropdown */}
            <FormControl size="small" sx={{ minWidth: 150 }}>
              <InputLabel
                className="text-gray-500 dark:text-white"
                sx={{ fontFamily: "Poppins" }}
              >
                Filter by Site
              </InputLabel>
              <Select
                value={siteFilter}
                label="Filter by Site"
                onChange={(e) => setSiteFilter(e.target.value)}
                sx={{ fontFamily: "Poppins" }}
                MenuProps={{
                  PaperProps: {
                    sx: { fontFamily: "Poppins", fontSize: "14px" },
                  },
                }}
              >
                <MenuItem value="">All Sites</MenuItem>
                {uniqueSites.map((site) => (
                  <MenuItem
                    key={site}
                    value={site}
                    sx={{ fontFamily: "Poppins", fontSize: "14px" }}
                  >
                    {site}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            {/* Search Input */}
            <TextField
              size="small"
              variant="outlined"
              placeholder="Search..."
              value={search}
              onChange={(e) => setSearch(e.target.value.trimStart())}
              sx={{ fontFamily: "Poppins" }}
              InputProps={{ sx: { fontFamily: "Poppins", fontSize: "14px" } }}
            />
          </div>
        </div>

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
                {isColumnVisible("unit") && (
                  <TableCell className="columtext">Unit</TableCell>
                )}
                {isColumnVisible("unitNo") && (
                  <TableCell className="columtext">Unit No.</TableCell>
                )}
                {isColumnVisible("amount") && (
                  <TableCell className="columtext">Received Amount</TableCell>
                )}
                {isColumnVisible("amountType") && (
                  <TableCell className="columtext">Amount Type</TableCell>
                )}
                {isColumnVisible("receivedDate") && (
                  <TableCell className="columtext">Received Date</TableCell>
                )}
              </TableRow>
            </TableHeader>

            <TableBody>
              {paginatedData.map((item, index) => (
                <TableRow key={item.id}>
                  <TableCell className="rowtext">
                    {page * rowsPerPage + index + 1}
                  </TableCell>
                  {isColumnVisible("clientName") && (
                    <TableCell className="rowtext">{item.clientName}</TableCell>
                  )}
                  {isColumnVisible("siteName") && (
                    <TableCell className="rowtext">{item.siteName}</TableCell>
                  )}
                  {isColumnVisible("unit") && (
                    <TableCell className="rowtext">{item.unit}</TableCell>
                  )}
                  {isColumnVisible("unitNo") && (
                    <TableCell className="rowtext">{item.unitNo}</TableCell>
                  )}
                  {isColumnVisible("amount") && (
                    <TableCell className="rowtext">{item.amount}</TableCell>
                  )}
                  {isColumnVisible("amountType") && (
                    <TableCell className="rowtext">
                      <Badge
                        size="sm"
                        color={
                          item.amountType === "Online"
                            ? "success"
                            : item.amountType === "Cash"
                            ? "warning"
                            : "error"
                        }
                      >
                        {item.amountType}
                      </Badge>
                    </TableCell>
                  )}
                  {isColumnVisible("receivedDate") && (
                    <TableCell className="rowtext">
                      {item.receivedDate}
                    </TableCell>
                  )}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>

        <div className="mt-4 flex justify-between items-center w-full">
          <div className="w-1/2">
            <p className="text-sm">
              Showing {filteredData.length === 0 ? 0 : page * rowsPerPage + 1}–
              {Math.min((page + 1) * rowsPerPage, filteredData.length)} of{" "}
              {filteredData.length} entries
            </p>
          </div>

          <div className="w-1/2 flex justify-end">
            <TablePagination
              component="div"
              count={filteredData.length}
              page={page}
              onPageChange={handleChangePage}
              rowsPerPage={rowsPerPage}
              onRowsPerPageChange={handleChangeRowsPerPage}
              rowsPerPageOptions={[5, 10, 25]}
              labelRowsPerPage="Rows per page:"
              sx={{
                color: "inherit",
                ".MuiSelect-select": {
                  color: "inherit",
                  backgroundColor: "transparent",
                },
                ".MuiTablePagination-selectLabel, .MuiTablePagination-displayedRows":
                  {
                    color: "inherit",
                  },
                ".MuiSvgIcon-root": {
                  color: "inherit",
                },
              }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
