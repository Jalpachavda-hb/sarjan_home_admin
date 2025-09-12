import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableRow,
} from "../../components/ui/table";
import Badge from "../../components/ui/badge/Badge";
import TablePagination from "@mui/material/TablePagination";
import { useState, useMemo, useEffect } from "react";
import { FaRegEye } from "react-icons/fa";
import { TextField } from "@mui/material";
import { Link } from "react-router-dom";
import { getClientCountOfSite } from "../../utils/Handlerfunctions/getdata";

interface Aprovel {
  id: string;
  siteName: string;
  count: number;
}

export default function ClientProperty() {
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [selectedColumns, setSelectedColumns] = useState<string[]>([]);
  const [sortConfig, setSortConfig] = useState<{
    key: keyof Aprovel;
    direction: "asc" | "desc";
  } | null>(null);
  // use for search
  const [search, setSearch] = useState("");
  // const [siteFilter, setSiteFilter] = useState("");

  const [tableData, setTableData] = useState<Aprovel[]>([]);

  // 🔹 Fetch API data on mount
  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await getClientCountOfSite();
        setTableData(
          data.map((item: any) => ({
            id: item.id,
            siteName: item.title,
            count: item.clients_count,
          }))
        );
      } catch (err) {
        console.error("Failed to fetch site client counts:", err);
      }
    };

    fetchData();
  }, []);

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
  }, [search, sortConfig, tableData]);

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
      <h3 className="text-lg font-semibold mb-5">Site Details</h3>

      <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white dark:bg-white/[0.03] px-4 pb-3 pt-4 sm:px-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
          <div className="flex flex-wrap gap-2 items-center">
            {/* actions (copy/csv/print) */}
          </div>

          {/* Right Column */}
          <div className="flex flex-wrap gap-2 justify-start sm:justify-end items-center">
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
                  <TableCell
                    className="columtext"
                    onClick={() => handleSort("siteName")}
                  >
                    Site Name
                  </TableCell>
                )}

                {isColumnVisible("count") && (
                  <TableCell
                    className="columtext"
                    onClick={() => handleSort("count")}
                  >
                    Count
                  </TableCell>
                )}
                {isColumnVisible("blocknumberType") && (
                  <TableCell className="columtext">View Client</TableCell>
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
                      <TableCell className="rowtext">{item.siteName}</TableCell>
                    )}

                    {isColumnVisible("count") && (
                      <TableCell className="rowtext">{item.count}</TableCell>
                    )}

                    {isColumnVisible("blocknumberType") && (
                      <TableCell className="rowtext">
                        <div className="flex gap-2 mt-1">
                          <Link
                            to={`/admin/clients/${item.id}`}
                            className="text-blue-500 hover:text-blue-700"
                          >
                            <Badge variant="light" color="success">
                              View <FaRegEye />
                            </Badge>
                          </Link>
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
