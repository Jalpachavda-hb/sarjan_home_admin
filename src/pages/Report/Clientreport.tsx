import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableRow,
} from "../../components/ui/table";
import TablePagination from "@mui/material/TablePagination";
import { useState, useMemo } from "react";
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

interface Approval {
  id: number;
  clientName: string;
  purchasedSiteName: string;
  unitType: string;
  unitNumber: string;
  principalAmount: number;
  gstAmount: number;
  receivedPrincipalAmount: number;
  receivedGstAmount: number;
  remainingPrincipalAmount: number;
}

const tableData: Approval[] = [
  {
    id: 1,
    clientName: "Ramesh Patel",
    purchasedSiteName: "Green Acres",
    unitType: "2BHK",
    unitNumber: "A-101",
    principalAmount: 2500000,
    gstAmount: 125000,
    receivedPrincipalAmount: 1500000,
    receivedGstAmount: 75000,
    remainingPrincipalAmount: 1000000,
  },
  {
    id: 2,
    clientName: "Sunita Sharma",
    purchasedSiteName: "Skyline Residency",
    unitType: "3BHK",
    unitNumber: "B-203",
    principalAmount: 3200000,
    gstAmount: 160000,
    receivedPrincipalAmount: 2200000,
    receivedGstAmount: 110000,
    remainingPrincipalAmount: 1000000,
  },
];

export default function Clientreport() {
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [selectedColumns, setSelectedColumns] = useState<string[]>([]);
  const [sortConfig, setSortConfig] = useState<{
    key: keyof Approval;
    direction: "asc" | "desc";
  } | null>(null);
  const [search, setSearch] = useState("");

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

  // const filteredData = useMemo(() => {
  //   let data = [...tableData];

  //   if (search) {
  //     const searchTerm = search.toLowerCase();
  //     data = data.filter((item) =>
  //       Object.values(item).some((val) =>
  //         String(val).toLowerCase().includes(searchTerm)
  //       )
  //     );
  //   }

  //   if (sortConfig) {
  //     data.sort((a, b) => {
  //       const aValue = a[sortConfig.key];
  //       const bValue = b[sortConfig.key];
  //       if (aValue < bValue) return sortConfig.direction === "asc" ? -1 : 1;
  //       if (aValue > bValue) return sortConfig.direction === "asc" ? 1 : -1;
  //       return 0;
  //     });
  //   }

  //   return data;
  // }, [search, sortConfig]);

  const filteredData = tableData.filter((item) => {
    const searchTerm = search.trim().toLowerCase(); // remove spaces at start & end

    const matchesSearch = Object.values(item)
      .map((val) => String(val).trim().toLowerCase()) // trim each value
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

  const handleSort = (key: keyof Approval) => {
    let direction: "asc" | "desc" = "asc";
    if (
      sortConfig &&
      sortConfig.key === key &&
      sortConfig.direction === "asc"
    ) {
      direction = "desc";
    }
    setSortConfig({ key, direction });
    setPage(0);
  };

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
                  {[
                    "clientName",
                    "purchasedSiteName",
                    "unitType",
                    "unitNumber",
                    "principalAmount",
                    "gstAmount",
                    "receivedPrincipalAmount",
                    "receivedGstAmount",
                    "remainingPrincipalAmount",
                  ].map((col) => (
                    <MenuItem key={col} value={col}>
                      <Checkbox checked={selectedColumns.includes(col)} />
                      <ListItemText
                        primary={
                          {
                            clientName: "Client Name",
                            purchasedSiteName: "Purchased Site Name",
                            unitType: "Unit Type",
                            unitNumber: "Unit Number",
                            principalAmount: "Principal Amount",
                            gstAmount: "GST Amount",
                            receivedPrincipalAmount:
                              "Received Principal Amount",
                            receivedGstAmount: "Received GST Amount",
                            remainingPrincipalAmount:
                              "Remaining Principal Amount",
                          }[col]
                        }
                      />
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
                  {isColumnVisible("Ledger") && (
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
                        <TableCell className="rowtext">
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
                      {isColumnVisible("remainingPrincipalAmount") && (
                        <TableCell className="rowtext">
                          {item.remainingPrincipalAmount}
                        </TableCell>
                      )}
                      {isColumnVisible("remainingPrincipalAmount") && (
                        <TableCell className="rowtext">
                          {item.remainingPrincipalAmount}
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
              rowsPerPageOptions={[5, 10, 25]}
              labelRowsPerPage="Rows per page:"
            />
          </div>
        </div>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 mt-4">
        {[
          { title: "Total Principal Amount", value: "₹0" },
          { title: "Total GST Amount", value: "₹0" },
          { title: "Received Principal Amount", value: "₹0" },
          { title: "Received GST Amount", value: "₹0" },
          { title: "Remaining Principal Amount", value: "₹0" },
          { title: "Remaining GST Amount", value: "₹0" },
        ].map((item, index) => (
          <div
            key={index}
            className="bg-[#0d2250] text-white rounded-sm shadow-md p-5 flex flex-col justify-center"
          >
            <h6 className="text-sm font-semibold mb-1">{item.title}</h6>
            <p className="text-lg font-bold">{item.value}</p>
          </div>
        ))}
      </div>
    </>
  );
}
