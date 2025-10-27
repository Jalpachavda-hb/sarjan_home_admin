import { useState, useEffect, useMemo } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableRow,
} from "../components/ui/table";
import Swal from "sweetalert2";
import { toast } from "react-toastify";
import Badge from "../components/ui/badge/Badge";
import TablePagination from "@mui/material/TablePagination";
import { printTableData } from "../utils/printTableData";
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
import { pendingForApprovals } from "../utils/Handlerfunctions/getdata"; // your API function
import { approve, reject } from "../utils/Handlerfunctions/formdeleteHandlers";
interface Aprovel {
  id: number;
  siteName: string;
  clientName: string;
  contactNumber: number;
  Email: string;
  blocknumber: string;
}

export default function Pandingforaprovel() {
  const [tableData, setTableData] = useState<Aprovel[]>([]);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [selectedColumns, setSelectedColumns] = useState<string[]>([]);
  const [sortConfig] = useState<{
    key: keyof Aprovel;
    direction: "asc" | "desc";
  } | null>(null);
  const [search, setSearch] = useState("");
  // const [siteFilter, setSiteFilter] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      const data = await pendingForApprovals();
      setTableData(data);
      setLoading(false);
    };
    fetchData();
  }, []);

  const handleChangePage = (_: unknown, newPage: number) => setPage(newPage);

  const handleChangeRowsPerPage = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const isColumnVisible = (column: string) =>
    selectedColumns.length === 0 || selectedColumns.includes(column);

  const filteredData = useMemo(() => {
    let data = [...tableData];

    if (search.trim()) {
      const searchTerm = search.trim().toLowerCase();
      data = data.filter((item) =>
        Object.values(item).some((val) =>
          String(val).toLowerCase().includes(searchTerm)
        )
      );
    }

    if (sortConfig) {
      data.sort((a, b) => {
        const aValue = a[sortConfig.key];
        const bValue = b[sortConfig.key];
        if (aValue < bValue) return sortConfig.direction === "asc" ? -1 : 1;
        if (aValue > bValue) return sortConfig.direction === "asc" ? 1 : -1;
        return 0;
      });
    }

    return data;
  }, [tableData, search, sortConfig]);

  const paginatedData = useMemo(() => {
    return filteredData.slice(
      page * rowsPerPage,
      page * rowsPerPage + rowsPerPage
    );
  }, [filteredData, page, rowsPerPage]);

  const columns = [
    { key: "siteName", label: "Site Name" },
    { key: "clientName", label: "Client Name" },
    { key: "contactNumber", label: "Contact Number" },
    { key: "Email", label: "Email" },
    { key: "blocknumber", label: "Block Number" },
    
  ];

  return (
    <div className="font-poppins text-gray-800 dark:text-white">
      <h3 className="text-lg font-semibold mb-5">Pending for Approvals</h3>

      <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white dark:bg-white/[0.03] px-4 pb-3 pt-4 sm:px-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
          <div className="flex flex-wrap gap-2 items-center">
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

            <FormControl size="small" sx={{ minWidth: 200 }}>
              <InputLabel
                className="text-gray-700 dark:text-white"
                sx={{ fontFamily: "Poppins" }}
              ></InputLabel>
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
                  "& .MuiSelect-select": { color: "#6B7280", fontWeight: 300 },
                }}
                MenuProps={{
                  PaperProps: { sx: { maxHeight: 300, fontFamily: "Poppins" } },
                }}
              >
                {[
                  "siteName",
                  "clientName",
                  "contactNumber",
                  "Email",
                  "blocknumber",
                  "blocknumberType",
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
                          contactNumber: "Contact Number",
                          Email: "Email",
                          blocknumber: "Block Number",
                          blocknumberType: "Manage",
                          receivedDate: "Received Date",
                        }[col]
                      }
                    />
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </div>

          <div className="flex flex-wrap gap-2 justify-start sm:justify-end items-center">
            <TextField
              size="small"
              variant="outlined"
              placeholder="Search..."
              value={search}
              onChange={(e) => setSearch(e.target.value.trimStart())}
              sx={{ fontFamily: "Poppins" }}
              InputProps={{ sx: { fontFamily: "Poppins", fontSize: "14px" } }}
                className="dark:bg-gray-200 rounded-md"
            />
          </div>
        </div>

        <div className="max-w-full overflow-x-auto mt-8">
          {loading ? (
            <p className="text-center py-12">Loading...</p>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableCell className="columtext">Sr. No</TableCell>
                  {isColumnVisible("siteName") && (
                    <TableCell className="columtext">Site Name</TableCell>
                  )}
                  {isColumnVisible("clientName") && (
                    <TableCell className="columtext">Client Name</TableCell>
                  )}
                  {isColumnVisible("contactNumber") && (
                    <TableCell className="columtext">Contact Number</TableCell>
                  )}
                  {isColumnVisible("Email") && (
                    <TableCell className="columtext">Email</TableCell>
                  )}
                  {isColumnVisible("blocknumber") && (
                    <TableCell className="columtext">Block Number</TableCell>
                  )}
                  {isColumnVisible("blocknumberType") && (
                    <TableCell className="columtext">Manage</TableCell>
                  )}
                </TableRow>
              </TableHeader>

              <TableBody>
                {paginatedData.length === 0 ? (
                  <TableRow>
                    <TableCell className="justify-between py-12 text-gray-500">
                      No data available
                    </TableCell>
                  </TableRow>
                ) : (
                  paginatedData.map((item, index) => (
                    <TableRow key={item.id}>
                      <TableCell className="rowtext">
                        {page * rowsPerPage + index + 1}
                      </TableCell>
                      {isColumnVisible("siteName") && (
                        <TableCell className="rowtext">
                          {item.siteName}
                        </TableCell>
                      )}
                      {isColumnVisible("clientName") && (
                        <TableCell className="rowtext">
                          {item.clientName}
                        </TableCell>
                      )}
                      {isColumnVisible("contactNumber") && (
                        <TableCell className="rowtext">
                          {item.contactNumber}
                        </TableCell>
                      )}
                      {isColumnVisible("Email") && (
                        <TableCell className="rowtext">{item.Email}</TableCell>
                      )}
                      {isColumnVisible("blocknumber") && (
                        <TableCell className="rowtext">
                          {item.blocknumber}
                        </TableCell>
                      )}
                      {isColumnVisible("blocknumberType") && (
                        <TableCell className="rowtext">
                          <div className="flex gap-2 mt-1">
                            <button
                              onClick={async () => {
                                const result = await Swal.fire({
                                  title: "Are you sure?",
                                  text: "Do you want to approve this item?",
                                  icon: "warning",
                                  showCancelButton: true,
                                  confirmButtonText: "Yes, approve it!",
                                  cancelButtonText: "Cancel",
                                });

                                if (result.isConfirmed) {
                                  try {
                                    await approve(item.id); // your API call
                                    toast.success("Approved successfully!");
                                    const updatedData =
                                      await pendingForApprovals();
                                    setTableData(updatedData);
                                  } catch (err) {
                                    console.error(err);
                                    toast.error("Failed to approve");
                                  }
                                }
                              }}
                            >
                              <Badge variant="light" color="success">
                                Approve
                              </Badge>
                            </button>

                            <button
                              onClick={async () => {
                                const result = await Swal.fire({
                                  title: "Are you sure?",
                                  text: "Do you want to reject this item?",
                                  icon: "warning",
                                  showCancelButton: true,
                                  confirmButtonText: "Yes, reject it!",
                                  cancelButtonText: "Cancel",
                                });

                                if (result.isConfirmed) {
                                  try {
                                    // Call the API here
                                    await reject(item.id); 
                                    toast.success("Rejected successfully!");

                                    // Refresh the table data
                                    const updatedData =
                                      await pendingForApprovals();
                                    setTableData(updatedData);
                                  } catch (err) {
                                    console.error(err);
                                    toast.error("Failed to reject");
                                  }
                                }
                              }}
                            >
                              <Badge variant="light" color="error">
                                Reject
                              </Badge>
                            </button>
                          </div>
                        </TableCell>
                      )}
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          )}
        </div>

        <div className="mt-4 flex justify-between items-center w-full">
          <div className="w-1/2">
            <p className="text-sm dark:text-gray-400">
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
              color: "#9CA3AF", // text-gray-400
              ".MuiSelect-select": {
                color: "#9CA3AF",
              },
              ".MuiTablePagination-selectLabel, .MuiTablePagination-displayedRows":
                {
                  color: "#9CA3AF",
                },
              ".MuiSvgIcon-root": {
                color: "#9CA3AF",
              },
              
              
            }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
