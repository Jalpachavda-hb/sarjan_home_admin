import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableRow,
} from "../../components/ui/table";
import { FaRegEye } from "react-icons/fa";
import SiteFilter from "../../components/form/input/FilterbySite";
import Badge from "../../components/ui/badge/Badge";
import TablePagination from "@mui/material/TablePagination";
import { useState, useMemo, useEffect } from "react";
import { FaPlus } from "react-icons/fa6";
import { showclientTicket } from "../../utils/Handlerfunctions/getdata";
import { closeTicket } from "../../utils/Handlerfunctions/formdeleteHandlers";
import { getTicketMessages } from "../../utils/Handlerfunctions/getdata";
import { replyToTicket } from "../../utils/Handlerfunctions/formSubmitHandlers";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from "@mui/material";
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
  const [openModal, setOpenModal] = useState(false);
  const [selectedTicket, setSelectedTicket] = useState<any>(null);
  const [replies, setReplies] = useState<any[]>([]);
  const [message, setMessage] = useState("");
  const loadTickets = async () => {
    setLoading(true);
    try {
      const res = await showclientTicket(siteFilter); // pass selected site

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

  // Fetch API data
  useEffect(() => {
    loadTickets();
  }, [siteFilter]);

  const handleClose = async (id: string) => {
    const res = await closeTicket(id);
    if (res.success) {
      // refresh ticket list
      loadTickets();
    }
  };

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

    return data;
  }, [tickets, search]);

  // Pagination
  const paginatedData = useMemo(() => {
    return filteredData.slice(
      page * rowsPerPage,
      page * rowsPerPage + rowsPerPage
    );
  }, [filteredData, page, rowsPerPage]);

  const handleOpenModal = async (ticket: any) => {
    setSelectedTicket(ticket);
    setOpenModal(true);

    try {
      const res = await getTicketMessages(ticket.id); // <-- API call
      if (res?.status === 200) {
        setReplies(res.data.data); // ✅ only the array
      }
    } catch (err) {
      console.error("Error fetching replies", err);
      setReplies([]); // fallback
    }
  };

  const handleCloseModal = () => {
    setOpenModal(false);
    setSelectedTicket(null);
    setReplies([]);
  };
  const handleSend = async () => {
    if (!message.trim() || !selectedTicket) return;

    const formData = new FormData();
    formData.append("ticket_id", selectedTicket.id.toString());
    formData.append("message", message);

    const res = await replyToTicket(formData);

    if (res) {
      // Update replies list instantly
      setReplies((prev) => [
        ...prev,
        {
          request_by: "Admin",
          user_type: "admin",
          message: message,
          created_at: new Date().toLocaleString(),
        },
      ]);
      setMessage(""); // clear input
    }
  };

  return (
    <div className="font-poppins text-gray-800 dark:text-white">
      <h3 className="text-lg font-semibold mb-5">Client Ticket</h3>

      <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white dark:bg-white/[0.03] px-4 pb-3 pt-4 sm:px-6">
        {/* Filters + Actions */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
          <div className="flex flex-wrap gap-2 items-center">
            {/* Column Selector */}
            {/* <FormControl size="small" sx={{ minWidth: 200 }}>
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
            </FormControl> */}

            {/* Site Filter */}
            {/* <SiteFilter
              value={siteFilter}
              onChange={(e) => setSiteFilter(e.target.value)}
            /> */}
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

                {isColumnVisible("siteName") && (
                  <TableCell className="columtext">Site Name</TableCell>
                )}
                {isColumnVisible("Message") && (
                  <TableCell className="columtext">Message</TableCell>
                )}

                {isColumnVisible("status") && (
                  <TableCell className="columtext">Status</TableCell>
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

                    {isColumnVisible("siteName") && (
                      <TableCell className="rowtext">{item.siteName}</TableCell>
                    )}

                    {isColumnVisible("Message") && (
                      <TableCell className="rowtext">
                        {/* {item.reply} */}
                        <button onClick={() => handleOpenModal(item)}>
                          <Badge variant="light" color="success">
                            View <FaRegEye />
                          </Badge>
                        </button>
                      </TableCell>
                    )}

                    {isColumnVisible("status") && (
                      <TableCell className="rowtext">
                        <Badge
                          variant="light"
                          color={item.status === "Active" ? "success" : "error"}
                        >
                          {item.status}
                        </Badge>
                      </TableCell>
                    )}

                    {isColumnVisible("blocknumberType") && (
                      <TableCell className="rowtext">
                        <div className="flex gap-2 mt-1">
                          <button onClick={() => handleClose(item.id)}>
                            <Badge variant="light" color="error">
                              Close Ticket
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
          <Dialog
            className="swal2-container"
            open={openModal}
            onClose={handleCloseModal}
            maxWidth="md"
            fullWidth
          >
            <DialogTitle className="flex justify-between items-center">
              <span>Client Reply ({selectedTicket?.unitNo})</span>
              <Button onClick={handleCloseModal}>✕</Button>
            </DialogTitle>

            <DialogContent
              dividers
              style={{ maxHeight: "400px", overflowY: "auto" }}
            >
              {replies.length === 0 ? (
                <p className="text-gray-500">No replies found</p>
              ) : (
                replies.map((reply, idx) => (
                  <div key={idx} className="mb-4">
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-500">
                        {reply.user_type}
                      </span>
                      <span className="text-sm text-gray-500">
                        {reply.created_at}
                      </span>
                    </div>

                    <div className="bg-gray-200 rounded-lg p-2 mt-1">
                      {reply.message}
                    </div>
                  </div>
                ))
              )}
            </DialogContent>

            {/* Input to send new message */}
            <div className="flex p-2 gap-2 border-t">
              <TextField
                fullWidth
                size="small"
                placeholder="Type your message..."
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSend()}
              />
              <Button variant="contained" color="primary" onClick={handleSend}>
                Send
              </Button>
            </div>

            <DialogActions>
              <Button onClick={handleCloseModal} color="primary">
                Close
              </Button>
            </DialogActions>
          </Dialog>
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
