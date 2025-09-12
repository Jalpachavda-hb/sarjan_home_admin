import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableRow,
} from "../../components/ui/table";
import SiteFilter from "../../components/form/input/FilterbySite";
import Badge from "../../components/ui/badge/Badge";
import TablePagination from "@mui/material/TablePagination";
import { useState, useMemo, useEffect } from "react";
import { MdDelete } from "react-icons/md";
import { FaEdit } from "react-icons/fa";
import { FaPlus } from "react-icons/fa6";
import { fetchAdminTickets } from "../../utils/Handlerfunctions/getdata";
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

interface MyTicket {
  id: number;
  clientName: string;
  unitNo: string;
  siteName: string;
  title: string;
  date: string;
  status: string;
  reply?: string;
}

export default function MyTiket() {
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [selectedColumns, setSelectedColumns] = useState<string[]>([]);
  const [tickets, setTickets] = useState<MyTicket[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [siteFilter, setSiteFilter] = useState("");

  // Fetch API data
  useEffect(() => {
    const loadTickets = async () => {
      try {
        const res = await fetchAdminTickets();

        if (res?.status === 200 && Array.isArray(res.data)) {
          const mapped = res.data.map((t: any) => ({
            id: t.id,
            clientName: t.client_name,
            unitNo: t.unit_number,
            siteName: t.site_name,
            title: t.title,
            date: t.created_at,
            status: t.status,
            reply: t.is_read === "1" ? "Read" : "Unread",
          }));
          setTickets(mapped);
        } else {
          setTickets([]);
        }
      } catch (err) {
        console.error("Error loading tickets:", err);
        setTickets([]);
      } finally {
        setLoading(false);
      }
    };

    loadTickets();
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

  // Filtering
  const filteredData = useMemo(() => {
    let data = [...tickets];
    const searchTerm = search.trim().toLowerCase();

    if (searchTerm) {
      data = data.filter((item) =>
        Object.values(item).some((val) =>
          String(val).toLowerCase().includes(searchTerm)
        )
      );
    }

    if (siteFilter) {
      data = data.filter((item) => item.siteName === siteFilter);
    }

    return data;
  }, [tickets, search, siteFilter]);

  // Pagination
  const paginatedData = useMemo(() => {
    return filteredData.slice(
      page * rowsPerPage,
      page * rowsPerPage + rowsPerPage
    );
  }, [filteredData, page, rowsPerPage]);

  return (
    <div className="font-poppins text-gray-800 dark:text-white">
      <h3 className="text-lg font-semibold mb-5">My Ticket</h3>

      <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white dark:bg-white/[0.03] px-4 pb-3 pt-4 sm:px-6">
        {/* Filters + Actions */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
          <div className="flex flex-wrap gap-2 items-center">
            {/* Column Selector */}
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
                  "reply",
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
                          reply: "Reply",
                          blocknumberType: "Manage",
                        }[col]
                      }
                    />
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            {/* Site Filter */}
            <SiteFilter
              value={siteFilter}
              onChange={(e) => setSiteFilter(e.target.value)}
            />
          </div>

          {/* Search + Add New */}
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

        {/* Table */}
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
                {isColumnVisible("status") && (
                  <TableCell className="columtext">Status</TableCell>
                )}
                {isColumnVisible("reply") && (
                  <TableCell className="columtext">Reply</TableCell>
                )}
                {isColumnVisible("blocknumberType") && (
                  <TableCell className="columtext">Manage</TableCell>
                )}
              </TableRow>
            </TableHeader>

            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell
                    colSpan={9}
                    className="text-center py-12 text-gray-500"
                  >
                    Loading tickets...
                  </TableCell>
                </TableRow>
              ) : paginatedData.length === 0 ? (
                <TableRow>
                  <TableCell
                    colSpan={9}
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
                    {isColumnVisible("status") && (
                      <TableCell className="rowtext">{item.status}</TableCell>
                    )}
                    {isColumnVisible("reply") && (
                      <TableCell className="rowtext">{item.reply}</TableCell>
                    )}
                    {isColumnVisible("blocknumberType") && (
                      <TableCell className="rowtext">
                        <div className="flex gap-2 mt-1">
                          <button>
                            <Badge variant="light">
                              <FaEdit className="text-2xl cursor-pointer" />
                            </Badge>
                          </button>
                          <button>
                            <Badge variant="light" color="error">
                              <MdDelete className="text-2xl cursor-pointer" />
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
