import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableRow,
} from "../../components/ui/table";
import { copyTableData, downloadCSV } from "../../utils/copy";
import { printTableData } from "../../utils/printTableData";
import { fetchSiteReports } from "../../utils/Handlerfunctions/getdata";
import { usePermissions } from "../../hooks/usePermissions";
import AccessDenied from "../../components/ui/AccessDenied";
import TablePagination from "@mui/material/TablePagination";
import { useState, useEffect, useMemo } from "react";

import {
  TextField,
  Button,
  Select,
  MenuItem,
  
  FormControl,
  Checkbox,
  ListItemText,
} from "@mui/material";

interface SiteReport {
  project_type: string;
  project_category_name: string;
  site_name: string;
  admin_name: string;
   id: string;
}
interface Column {
  key: keyof SiteReport; // ensures key is valid for SiteReport
  label: string;
}
export default function Sitereport() {
  const { canView, loading: permissionLoading } = usePermissions();
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [selectedColumns, setSelectedColumns] = useState<string[]>([]);
  const [tableData, setTableData] = useState<SiteReport[]>([]);
  // use for search
  const [search, setSearch] = useState("");
  const [siteFilter] = useState("");

  // Check permissions
  const canViewReports = canView("Reports");

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

  useEffect(() => {
    const loadReports = async () => {
      const data = await fetchSiteReports("1"); // Pass adminId dynamically
      setTableData(data);
    };
    loadReports();
  }, []);

  const filteredData = tableData.filter((item) => {
    const searchTerm = search.trim().toLowerCase(); // remove spaces at start & end

    const matchesSearch = Object.values(item)
      .map((val) => String(val).trim().toLowerCase()) // trim each value
      .join(" ")
      .includes(searchTerm);

    const matchesSite = siteFilter
      ? item.site_name.trim() === siteFilter.trim()
      : true;

    return matchesSearch && matchesSite;
  });

  const columns :Column[]  = [
    { key: "project_type", label: "Project Type" },
    { key: "project_category_name", label: "Project Category" },
    { key: "site_name", label: "Site Name" },
    { key: "admin_name", label: "Allocated User" },
  ];

  const paginatedData = useMemo(() => {
    return filteredData.slice(
      page * rowsPerPage,
      page * rowsPerPage + rowsPerPage
    );
  }, [filteredData, page, rowsPerPage]);

  // const uniqueSites = [...new Set(tableData.map((item) => item.site_name))];

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
      <AccessDenied message="You don't have permission to view site reports." />
    );
  }

  return (
    <div className="font-poppins text-gray-800 dark:text-white">
      <h3 className="text-lg font-semibold mb-5">Site Reports</h3>

      <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white dark:bg-white/[0.03] px-4 pb-3 pt-4 sm:px-6">
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
                  "site_report.csv"
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
                className="dark:bg-gray-200 rounded-md"
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

                {isColumnVisible("project_type") && (
                  <TableCell className="columtext">Project Type</TableCell>
                )}
                {isColumnVisible("project_category_name") && (
                  <TableCell className="columtext">Project Category</TableCell>
                )}
                {isColumnVisible("site_name") && (
                  <TableCell className="columtext">Site Name</TableCell>
                )}
                {isColumnVisible("admin_name") && (
                  <TableCell className="columtext">Allocated User</TableCell>
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

                    {isColumnVisible("project_type") && (
                      <TableCell className="rowtext">
                        {item.project_type}
                      </TableCell>
                    )}
                    {isColumnVisible("project_category_name") && (
                      <TableCell className="rowtext">
                        {item.project_category_name}
                      </TableCell>
                    )}
                    {isColumnVisible("site_name") && (
                      <TableCell className="rowtext">
                        {item.site_name}
                      </TableCell>
                    )}
                    {isColumnVisible("admin_name") && (
                      <TableCell className="rowtext">
                        {item.admin_name}
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
              rowsPerPageOptions={[5, 10, 25, 30, 35, 40, 50]}
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
