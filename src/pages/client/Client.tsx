import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableRow,
} from "../../components/ui/table";
import Swal from "sweetalert2";
import Badge from "../../components/ui/badge/Badge";
import TablePagination from "@mui/material/TablePagination";
import { FaPlus } from "react-icons/fa6";
import { MdDelete } from "react-icons/md";
import { MdAddCard } from "react-icons/md";
import { FaEdit } from "react-icons/fa";
import { useState, useMemo, useEffect } from "react";
import { showclientlist } from "../../utils/Handlerfunctions/getdata";
import { useParams, Link } from "react-router-dom";
import { toast } from "react-toastify";
import { TextField, Button } from "@mui/material";
import { deleteClient } from "../../utils/Handlerfunctions/formdeleteHandlers";
interface Client {
  id: string;
  clientName: string;
  unitNo: string;
  block_detail_id: string;
  site_detail_id: string;
  contactNumber: string;
  email: string;
  adharCard: string;
  panCard: string;
  client_milestone_id: string;
}

export default function ClientList() {
  const { id } = useParams(); // ✅ get site id from URL (/admin/clients/:id)

  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [sortConfig, setSortConfig] = useState<{
    key: keyof Client;
    direction: "asc" | "desc";
  } | null>(null);
  const [search, setSearch] = useState("");
  const [clients, setClients] = useState<Client[]>([]);
  const [loading, setLoading] = useState(false);

  // ✅ Fetch data from API when id changes
  useEffect(() => {
    if (!id) return;
    const fetchClients = async () => {
      setLoading(true);
      try {
        const res = await showclientlist(id); // now this passes as site_id
        const details = res?.details || [];
        setClients(
          details.map((item: any) => ({
            id: item.id,
            clientName: item.name,
            block_detail_id: item.block_detail_id,
            site_detail_id: item.site_detail_id,
            // 🔥 FIXED: make sure these fields match your API response
            // and contain full URLs for images if needed
            unitNo: item.block_number,
            contactNumber: item.contact_no,
            email: item.email,
            adharCard: item.adhar_card,
            panCard: item.pan_card,
            client_milestone_id: item.client_milestone_id,
          }))
        );
      } catch (err) {
        console.error("Error fetching clients:", err);
        toast.error("Failed to load client list");
      } finally {
        setLoading(false);
      }
    };
    fetchClients();
  }, [id]);

  // ✅ Pagination
  const handleChangePage = (_: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  // ✅ Sorting
  const handleSort = (key: keyof Client) => {
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

  // ✅ inside ClientList component
  const handleDelete = async (clientId: string) => {
    Swal.fire({
      title: "Are you sure?",
      text: "This action cannot be undone.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Yes, delete it!",
    }).then(async (result) => {
      if (result.isConfirmed) {
        const success = await deleteClient(clientId);
        if (success) {
          setClients((prev) => prev.filter((client) => client.id !== clientId));

          toast.success("Client deleted successfully!");
          Swal.fire("Deleted!", "The client has been removed.", "success");
        } else {
          toast.error("Failed to delete client!");
          Swal.fire("Error!", "Failed to delete client.", "error");
        }
      }
    });
  };

  // ✅ Search + Sort
  const filteredData = useMemo(() => {
    let data = [...clients];
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
  }, [search, sortConfig, clients]);

  // ✅ Paginate after filter/sort
  const paginatedData = useMemo(
    () =>
      filteredData.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage),
    [filteredData, page, rowsPerPage]
  );

  return (
    <div className="font-poppins text-gray-800 dark:text-white">
      <h3 className="text-lg font-semibold mb-5">Clients List</h3>

      <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white dark:bg-white/[0.03] px-4 pb-3 pt-4 sm:px-6">
        {/* Top Bar */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
          <div className="flex flex-wrap gap-2 items-center">
            <Button
              size="small"
              variant="contained"
              className="!bg-amber-500 hover:!bg-amber-600 text-white"
            >
              Print
            </Button>
          </div>

          {/* Search + Add Button */}
          <div className="flex flex-wrap gap-2 justify-start sm:justify-end items-center">
            <TextField
              size="small"
              variant="outlined"
              placeholder="Search..."
              value={search}
              onChange={(e) => setSearch(e.target.value.trimStart())}
              sx={{ fontFamily: "Poppins" }}
              InputProps={{ sx: { fontFamily: "Poppins", fontSize: "14px" } }}
            />

            <Link to={`/admin/clients/${id}/addnewclient`}>
              <Button
                size="small"
                variant="contained"
                className="!bg-indigo-700 hover:!bg-indigo-900 text-white"
              >
                <FaPlus />
                Add New Client
              </Button>
            </Link>
          </div>
        </div>

        {/* Table */}
        <div className="max-w-full overflow-x-auto mt-8">
          <Table>
            <TableHeader>
              <TableRow>
                <TableCell className="columtext">Sr. No</TableCell>
                <TableCell
                  className="columtext"
                  onClick={() => handleSort("clientName")}
                >
                  Client Name
                </TableCell>
                <TableCell className="columtext">Email</TableCell>
                <TableCell className="columtext">Contact</TableCell>
                <TableCell className="columtext">Unit No</TableCell>
                <TableCell className="columtext">Pan</TableCell>
                <TableCell className="columtext">Aadhar</TableCell>
                <TableCell className="columtext">Manage</TableCell>
                <TableCell className="columtext">Payment</TableCell>
              </TableRow>
            </TableHeader>

            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={8}>Loading...</TableCell>
                </TableRow>
              ) : paginatedData.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={8} className="text-gray-500">
                    No clients found
                  </TableCell>
                </TableRow>
              ) : (
                paginatedData.map((item, index) => (
                  <TableRow key={item.id}>
                    <TableCell className="rowtext">
                      {page * rowsPerPage + index + 1}
                    </TableCell>
                    <TableCell className="rowtext">{item.clientName}</TableCell>{" "}
                    {/* 🔥 FIXED */}
                    <TableCell className="rowtext">{item.email}</TableCell>
                    <TableCell className="rowtext">
                      {item.contactNumber}
                    </TableCell>
                    <TableCell className="rowtext">{item.unitNo}</TableCell>
                    <TableCell className="rowtext">
                      {item.panCard ? (
                        <a
                          href={item.panCard}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          <img
                            src={item.panCard}
                            alt="PAN"
                            style={{
                              width: "60px",
                              height: "40px",
                              objectFit: "cover",
                              borderRadius: "4px",
                              cursor: "pointer", // shows clickable pointer
                            }}
                          />
                        </a>
                      ) : (
                        "-"
                      )}
                    </TableCell>
                    <TableCell className="rowtext">
                      {item.adharCard ? (
                        <a
                          href={item.adharCard}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          <img
                            src={item.adharCard}
                            alt="Aadhar"
                            style={{
                              width: "60px",
                              height: "40px",
                              objectFit: "cover",
                              borderRadius: "4px",
                              cursor: "pointer",
                            }}
                          />
                        </a>
                      ) : (
                        "-"
                      )}
                    </TableCell>
                    <TableCell className="rowtext">
                      <div className="flex gap-2">
                        <Link
                          to={`${item.id}/edit`}
                          state={{
                            client_milestone_id: item.client_milestone_id,
                          }}
                        >
                          <Badge variant="light">
                            <FaEdit className="text-xl cursor-pointer" />
                          </Badge>
                        </Link>

                        <Badge variant="light" color="error">
                          <MdDelete
                            onClick={() =>
                              handleDelete(item.client_milestone_id)
                            }
                            className="text-xl cursor-pointer"
                          />
                        </Badge>
                      </div>
                    </TableCell>
                    <TableCell className="rowtext">
                      <div className="flex gap-2">
                        <Link
                          to={`${item.id}/payment_details/add`}
                          state={{
                            clientId: item.id,
                            siteId: item.site_detail_id,
                            blockId: item.block_detail_id,
                          }}
                        >
                          <Badge variant="light" color="success">
                            <MdAddCard className="text-xl cursor-pointer" />
                          </Badge>
                        </Link>
                      </div>
                    </TableCell>
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
          />
        </div>
      </div>
    </div>
  );
}
