
import { useState, useEffect, useMemo } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableRow,
} from "../../components/ui/table";
import { FaRegEye, FaPlus } from "react-icons/fa6";
import Badge from "../../components/ui/badge/Badge";
import TablePagination from "@mui/material/TablePagination";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  Select,
  MenuItem,
  InputLabel,
  FormControl,
  Checkbox,
  ListItemText,
} from "@mui/material";

// ///
import {
  showTicketHistory,
  getTicketMessages,
  getUserRole,
} from "../../utils/Handlerfunctions/getdata";
import AccessDenied from "../../components/ui/AccessDenied";

interface MyTiket {
  id: number;
  clientName: string;
  unitNo: string;
  siteName: string;
  requestby: string;
  requestdate: string;
}

export default function Tikethistory() {
  const role = getUserRole();
  
  // Show Access Denied if user role is not 1
  if (role !== 1) {
    return <AccessDenied message="You don't have permission to view ticket history." />;
  }
  
  const [tickets, setTickets] = useState<MyTiket[]>([]);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [selectedColumns, setSelectedColumns] = useState<string[]>([]);
  const [replies, setReplies] = useState<any[]>([]);
  const [sortConfig] = useState<{
    key: keyof MyTiket;
    direction: "asc" | "desc";
  } | null>(null);
  const [search, setSearch] = useState("");
  const [siteFilter] = useState("");

  // modal state
  const [openModal, setOpenModal] = useState(false);
  const [selectedTicket, setSelectedTicket] = useState<any>(null);

  // open modal + fetch replies
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

  // fetch ticket history
  useEffect(() => {
    const fetchTickets = async () => {
      const res = await showTicketHistory();
      if (res?.status === 200 && res.data) {
        const mappedData = res.data.map((item: any) => ({
          id: item.id,
          clientName: item.client_name,
          unitNo: item.unit_number,
          siteName: item.site_name,
          requestby: item.request_by,
          requestdate: item.created_at,
        }));
        setTickets(mappedData);
      }
    };
    fetchTickets();
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

  // filtering + search + sort
  const filteredData = useMemo(() => {
    let data = [...tickets];
    if (siteFilter) {
      data = data.filter((item) => item.siteName === siteFilter);
    }
    const searchTerm = search.trim().toLowerCase();
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
        if (aValue < bValue) return sortConfig.direction === "asc" ? -1 : 1;
        if (aValue > bValue) return sortConfig.direction === "asc" ? 1 : -1;
        return 0;
      });
    }
    return data;
  }, [tickets, search, siteFilter, sortConfig]);

  // pagination
  const paginatedData = useMemo(
    () =>
      filteredData.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage),
    [filteredData, page, rowsPerPage]
  );

  // unique site names
 



  return (
    <div className="font-poppins text-gray-800 dark:text-white">
      <h3 className="text-lg font-semibold mb-5">Ticket History</h3>

      <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white dark:bg-white/[0.03] px-4 pb-3 pt-4 sm:px-6">
        {/* filters */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
          <div className="flex flex-wrap gap-2 items-center">

            {/* <SiteFilter
              value={siteFilter}
              onChange={(e: React.ChangeEvent<HTMLSelectElement>) =>
                setSiteFilter(e.target.value)
              }
            /> */}
           
            <FormControl size="small" sx={{ minWidth: 200 }}>
              <InputLabel>Select Columns</InputLabel>
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
                renderValue={() => "Select Columns"}
              >
                {[
                  "clientName",
                  "unitNo",
                  "siteName",
                  "requestby",
                  "requestdate",
                  "blocknumberType",
                ].map((col) => (
                  <MenuItem key={col} value={col}>
                    <Checkbox checked={selectedColumns.includes(col)} />
                    <ListItemText
                      primary={
                        {
                          clientName: "Client Name",
                          unitNo: "Unit No",
                          siteName: "Site Name",
                          requestby: "Request By",
                          requestdate: "Request Date",
                          blocknumberType: "Manage",
                        }[col]
                      }
                    />
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </div>

          {/* search + add new */}
          <div className="flex flex-wrap gap-2 justify-start sm:justify-end items-center">
            {/* <SiteFilter
              value={siteFilter}
              onChange={(e) => setSiteFilter(e.target.value)}
            /> */}

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

        {/* table */}
        <div className="max-w-full overflow-x-auto mt-8">
          <Table>
            <TableHeader>
              <TableRow>
                <TableCell className="columtext">Sr. No</TableCell>
                {isColumnVisible("clientName") && (
                  <TableCell className="columtext cursor-pointer">
                    Client Name
                  </TableCell>
                )}
                {isColumnVisible("unitNo") && (
                  <TableCell className="columtext cursor-pointer">
                    Unit No
                  </TableCell>
                )}
                {isColumnVisible("siteName") && (
                  <TableCell className="columtext cursor-pointer">
                    Site Name
                  </TableCell>
                )}
                {isColumnVisible("requestby") && (
                  <TableCell className="columtext cursor-pointer">
                    Request By
                  </TableCell>
                )}
                {isColumnVisible("requestdate") && (
                  <TableCell className="columtext cursor-pointer">
                    Request Date
                  </TableCell>
                )}
                {isColumnVisible("blocknumberType") && (
                  <TableCell className="columtext">Manage</TableCell>
                )}
              </TableRow>
            </TableHeader>

            <TableBody>
              {paginatedData.length === 0 ? (
                <TableRow>
                  <TableCell className="text-center py-12 text-gray-500">
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
                    {isColumnVisible("requestby") && (
                      <TableCell className="rowtext">
                        {item.requestby}
                      </TableCell>
                    )}
                    {isColumnVisible("requestdate") && (
                      <TableCell className="rowtext">
                        {item.requestdate.split("T")[0]}
                      </TableCell>
                    )}
                    {isColumnVisible("blocknumberType") && (
                      <TableCell className="rowtext">
                        <div className="flex gap-2 mt-1">
                          <button onClick={() => handleOpenModal(item)}>
                            <Badge variant="light" color="success">
                              View <FaRegEye />
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

        {/* pagination */}
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

      {/* reply modal */}
      <Dialog
        className="swal2-container "
        open={openModal}
        onClose={handleCloseModal}
        maxWidth="md"
        fullWidth
      >
        {/* <DialogTitle>Client Reply ({selectedTicket?.unitNo})
           <Button   onClick={handleCloseModal}>✕</Button>
        </DialogTitle> */}
        <DialogTitle className="flex justify-between items-center">
          <span>Client Reply ({selectedTicket?.unitNo})</span>
          <Button onClick={handleCloseModal}>✕</Button>
        </DialogTitle>
        <DialogContent dividers>
          {replies.length === 0 ? (
            <p className="text-gray-500">No replies found</p>
          ) : (
            replies.map((reply, idx) => (
              <div key={idx} className="mb-4">
                <div className="flex justify-between items-center">
                  <span className="font-semibold">{reply.request_by}</span>
                  <span className="text-sm text-gray-500">
                    {reply.created_at}
                  </span>
                </div>
                <span className="text-sm text-gray-500">{reply.user_type}</span>
                <div className="bg-gray-200 rounded-lg p-2 mt-1">
                  {reply.message}
                </div>
              </div>
            ))
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseModal} color="primary">
            Close
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}
