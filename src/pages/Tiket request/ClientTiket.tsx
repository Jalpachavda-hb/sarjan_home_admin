import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableRow,
} from "../../components/ui/table";
import Badge from "../../components/ui/badge/Badge";
import TablePagination from "@mui/material/TablePagination";
import { useState, useMemo } from "react";
import { FaPlus } from "react-icons/fa6";

import { FaRegEye } from "react-icons/fa";
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
} from "@mui/material";

interface MyTiket {
  id: number;
  clientName: string;
  unitNo: string;
  siteName: string;
  title: string;
  date: string;
  message: string;
  status: string;
}

const tableData: MyTiket[] = [
  {
    id: 1,
    clientName: "John Doe",
    unitNo: "A-101",
    siteName: "Downtown Complex",
    title: "Complaint",
    date: "2025-08-11",
    message: "hello",
    status: "Pending",
  },
  {
    id: 2,
    clientName: "Jane Smith",
    unitNo: "B-202",
    siteName: "Riverside Towers",
    title: "Maintenance Request",
    date: "2025-08-10",
    message: "hello",
    status: "Completed",
  },
];

export default function ClientTiket() {
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [selectedColumns, setSelectedColumns] = useState<string[]>([]);
  const [sortConfig, setSortConfig] = useState<{
    key: keyof MyTiket;
    direction: "asc" | "desc";
  } | null>(null);
  const [search, setSearch] = useState("");
  const [siteFilter, setSiteFilter] = useState("");

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

  //   if (siteFilter) {
  //     data = data.filter((item) => item.siteName === siteFilter);
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
  // }, [search, siteFilter, sortConfig]);

  const filteredData = useMemo(() => {
    let data = [...tableData];

    const searchTerm = search.trim().toLowerCase(); // 🔹 Trim spaces

    if (searchTerm) {
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

        if (aValue < bValue) {
          return sortConfig.direction === "asc" ? -1 : 1;
        }
        if (aValue > bValue) {
          return sortConfig.direction === "asc" ? 1 : -1;
        }
        return 0;
      });
    }

    return data;
  }, [search, sortConfig]);

  const paginatedData = useMemo(() => {
    return filteredData.slice(
      page * rowsPerPage,
      page * rowsPerPage + rowsPerPage
    );
  }, [filteredData, page, rowsPerPage]);

  const uniqueSites = [...new Set(tableData.map((item) => item.siteName))];

  const handleSort = (key: keyof MyTiket) => {
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
    <div className="font-poppins text-gray-800 dark:text-white">
      <h3 className="text-lg font-semibold mb-5">Client Ticket</h3>

      <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white dark:bg-white/[0.03] px-4 pb-3 pt-4 sm:px-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
          <div className="flex flex-wrap gap-2 items-center">
            {/* <Button
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
            </Button> */}

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
                  "unitNo",
                  "siteName",
                  "title",
                  "date",
                  "status",
                  "message",

                  "blocknumberType",
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
                          unitNo: "Unit No",
                          siteName: "Site Name",
                          title: "Title",
                          date: "Date",
                          status: "Status",
                          message: "message",

                          blocknumberType: "Manage",
                        }[col]
                      }
                    />
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
              
            <SiteFilter
              value={siteFilter}
              onChange={(e) => setSiteFilter(e.target.value)}
            />
          </div>

          <div className="flex flex-wrap gap-2 justify-start sm:justify-end items-center">
            <TextField
              size="small"
              variant="outlined"
              placeholder="Search..."
              value={search}
              onChange={(e) => setSearch(e.target.value.trimStart())}
            />
            <a
              href="/admin/ticket-request/mytiket/addtiket"
              className="text-blue-500 hover:text-blue-700"
            >
              <Button
                size="small"
                variant="contained"
                className="!bg-indigo-700 hover:!bg-indigo-900 text-white"
              >
                <FaPlus />
                Add New Ticket
              </Button>
            </a>
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
                {isColumnVisible("unitNo") && (
                  <TableCell className="columtext">Unit No</TableCell>
                )}
                {isColumnVisible("siteName") && (
                  <TableCell className="columtext">Site Name</TableCell>
                )}
                {isColumnVisible("title") && (
                  <TableCell className="columtext">Title</TableCell>
                )}
                {isColumnVisible("date") && (
                  <TableCell className="columtext">Date</TableCell>
                )}

                {isColumnVisible("message") && (
                  <TableCell className="columtext">Message</TableCell>
                )}

                {isColumnVisible("status") && (
                  <TableCell className="columtext">Status</TableCell>
                )}

                {isColumnVisible("blocknumberType") && (
                  <TableCell className="columtext">Action</TableCell>
                )}
              </TableRow>
            </TableHeader>

            <TableBody>
              {paginatedData.length === 0 ? (
                <TableRow>
                  <TableCell
                    // colSpan={8}
                    className="text-center py-12 text-gray-500"
                  >
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
                    {isColumnVisible("unitNo") && (
                      <TableCell className="rowtext">{item.unitNo}</TableCell>
                    )}
                    {isColumnVisible("siteName") && (
                      <TableCell className="rowtext">{item.siteName}</TableCell>
                    )}
                    {isColumnVisible("title") && (
                      <TableCell className="rowtext">{item.title}</TableCell>
                    )}
                    {isColumnVisible("date") && (
                      <TableCell className="rowtext">{item.date}</TableCell>
                    )}
                    {isColumnVisible("message") && (
                      <TableCell className="rowtext">{item.message}</TableCell>
                    )}
                    {isColumnVisible("status") && (
                      <TableCell className="rowtext">{item.status}</TableCell>
                    )}

                    {isColumnVisible("blocknumberType") && (
                      <TableCell className="rowtext">
                        <div className="flex gap-2 mt-1">
                          <button>
                            <Badge variant="light" color="success">
                              Approve
                            </Badge>
                          </button>
                          <button>
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
        </div>

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
            labelRowsPerPage="Rows per page:"
            sx={{
              color: "inherit",
              ".MuiSelect-select": {
                color: "inherit",
                backgroundColor: "transparent",
              },
              ".MuiTablePagination-selectLabel, .MuiTablePagination-displayedRows":
                { color: "inherit" },
              ".MuiSvgIcon-root": { color: "inherit" },
            }}
          />
        </div>
      </div>
    </div>
  );
}
