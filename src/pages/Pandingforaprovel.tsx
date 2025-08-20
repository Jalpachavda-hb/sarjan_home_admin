import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableRow,
} from "../components/ui/table";
import Badge from "../components/ui/badge/Badge";
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

interface Aprovel {
  id: number;
  siteName: string;
  clientName: string;
  contactNumber: number;
  Email: string;
  blocknumber: string;
}

const tableData: Aprovel[] = [
  {
    id: 1,
    clientName: "Ramesh Patel",
    siteName: "Green Acres",
    contactNumber: 9313061960,
    Email: "RameshPatel@gmail.com",
    blocknumber: "1",
  },
  {
    id: 2,
    clientName: "Sunita Sharma",
    siteName: "Skyline Residency",
    contactNumber: 5259658569,
    Email: "sunitasharna@gmail.com",
    blocknumber: "90",
  },
  {
    id: 3,
    clientName: "Manish Mehta",
    siteName: "Sunshine Valley",
    contactNumber: 8596748596,
    Email: "manish@gmail.com",
    blocknumber: "2",
  },
  {
    id: 4,
    clientName: "Nirali Desai",
    siteName: "Emerald Heights",
    contactNumber: 8596965896,
    Email: "emerald@gmail.com",
    blocknumber: "1",
  },
  {
    id: 5,
    clientName: "Amita Shah",
    siteName: "Harmony Homes",
    contactNumber: 5698569569,
    Email: "amita@gmail.com",
    blocknumber: "3",
  },
  {
    id: 6,
    clientName: "Kajal Trivedi",
    siteName: "Silver Estate",
    contactNumber: 5689325896,
    Email: "kajal@gmail.com",
    blocknumber: "2",
  },
  {
    id: 7,
    clientName: "Devanshi Shah",
    siteName: "Golden Villa",
    contactNumber: 5896963526,
    Email: "devanshi@gmail.com",
    blocknumber: "1",
  },
];

export default function Pandingforaprovel() {
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [selectedColumns, setSelectedColumns] = useState<string[]>([]);
  const [sortConfig, setSortConfig] = useState<{
    key: keyof Aprovel;
    direction: "asc" | "desc";
  } | null>(null);
  // use for search
  const [search, setSearch] = useState("");
  const [siteFilter, setSiteFilter] = useState("");

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

  //       if (aValue < bValue) {
  //         return sortConfig.direction === "asc" ? -1 : 1;
  //       }
  //       if (aValue > bValue) {
  //         return sortConfig.direction === "asc" ? 1 : -1;
  //       }
  //       return 0;
  //     });
  //   }

  //   return data;
  // }, [search, sortConfig]);
  
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

  const handleSort = (key: keyof Aprovel) => {
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
      <h3 className="text-lg font-semibold mb-5">Pending for Approvals</h3>

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
            </Button> */}
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
                          contactNumber: "contactNumber",
                          Email: "Unit No.",
                          blocknumber: "Received blocknumber",
                          blocknumberType: "blocknumber Type",
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

            {/* <FormControl size="small" sx={{ minWidth: 150 }}>
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
            </FormControl> */}

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
                  <TableCell
                    // colSpan={}
                    className="justify-between py-12 text-gray-500  "
                    // style={{ fontSize: "16px" }}
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

                    {isColumnVisible("siteName") && (
                      <TableCell className="rowtext">{item.siteName}</TableCell>
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
