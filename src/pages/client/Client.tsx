import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableRow,
} from "../../components/ui/table";
import { MdFileDownload } from "react-icons/md";
import Swal from "sweetalert2";
import Badge from "../../components/ui/badge/Badge";
import Pagination from "@mui/material/Pagination";
import Stack from "@mui/material/Stack";
import { FaPlus } from "react-icons/fa6";
import { MdDelete } from "react-icons/md";
import { MdAddCard } from "react-icons/md";
import { FaEdit } from "react-icons/fa";
import { useState, useMemo, useEffect } from "react";
import { printTableData } from "../../utils/printTableData";
import {
  showclientlist,
  getUserRole,
} from "../../utils/Handlerfunctions/getdata";
import { useParams, Link, useLocation } from "react-router-dom";
import { toast } from "react-toastify";
import { TextField, Button } from "@mui/material";
import { deleteClient } from "../../utils/Handlerfunctions/formdeleteHandlers";
import {
  IconButton,
  // Select,
} from "@mui/material";
import { usePermissions } from "../../hooks/usePermissions";
import AccessDenied from "../../components/ui/AccessDenied";

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
  const {
    canDelete,
    canEdit,
    canCreate,
    canView,
    loading: permissionLoading,
  } = usePermissions();

  // Check permissions for Clients feature
  const canViewClient = canView("Clients");
  const canCreateClient = canCreate("Clients");
  const canEditClient = canEdit("Clients");
  const canDeleteClient = canDelete("Clients");

  // Check if user has any action permissions to show Manage column
  const hasAnyActionPermission = canEditClient || canDeleteClient;

  const [page, setPage] = useState(0);
  const [rowsPerPage] = useState(5);

  const [search, setSearch] = useState("");
  const [clients, setClients] = useState<Client[]>([]);
  const [totalRecords, setTotalRecords] = useState(0);
  const [loading, setLoading] = useState(false);
const location = useLocation();
const passedSiteName = location.state?.siteName || "";
const [siteName] = useState<string>(passedSiteName);

  const [sortConfig] = useState<{
    key: keyof Client;
    direction: "asc" | "desc";
  } | null>(null);

  const fetchClients = async () => {
    setLoading(true);
    try {
      const res = await showclientlist(id!, page + 1); // server-side page
      const details = res?.details || [];
      setClients(
        details.map((item: any) => ({
          id: item.id,
          clientName: item.name,
          block_detail_id: item.block_detail_id,
          site_detail_id: item.site_detail_id,
          unitNo: item.block_number,
          contactNumber: item.contact_no,
          email: item.email,
          adharCard: item.adhar_card,
          panCard: item.pan_card,
          client_milestone_id: item.client_milestone_id,
        }))
      );
      setTotalRecords(res?.totalRecords || details.length); // get total from API
    } catch (err) {
      console.error("Error fetching clients:", err);
      toast.error("Failed to load client list");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!id) return;

    fetchClients();
  }, [id, page, rowsPerPage]);

  // ✅ Sorting

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
          await fetchClients();

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
  const role = getUserRole();

  // Show Access Denied if user doesn't have view permission

  if (permissionLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!canViewClient) {
    return (
      <AccessDenied message="You don't have permission to view clients." />
    );
  }

  const columns = [
    { key: "clientName", label: "Client Name" },
    { key: "email", label: "Email" },
    { key: "contactNumber", label: "Contact" },
    { key: "unitNo", label: "Unit No" },
  ];

  return (
    <div className="font-poppins text-gray-800 dark:text-white">
      <h3 className="text-lg font-semibold mb-5 dark:text-white">
        {siteName ? `${siteName} - Clients List` : "Clients List"}
      </h3>

      <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white dark:bg-white/[0.03] px-4 pb-3 pt-4 sm:px-6">
        {/* Top Bar */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
          <div className="flex flex-wrap gap-2 items-center">
            <Button
              size="small"
              variant="contained"
              className="!bg-amber-500 hover:!bg-amber-600 text-white"
              onClick={() => printTableData(filteredData, columns)}
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

            {canCreateClient && (
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
            )}
          </div>
        </div>

        {/* Table */}
        <div className="max-w-full overflow-x-auto mt-8">
          <Table>
            <TableHeader>
              <TableRow>
                <TableCell className="columtext">Sr. No</TableCell>
                <TableCell className="columtext">Client Name</TableCell>
                <TableCell className="columtext">Email</TableCell>
                <TableCell className="columtext">Contact</TableCell>
                <TableCell className="columtext">Unit No</TableCell>
                <TableCell className="columtext">Pan</TableCell>
                <TableCell className="columtext">Aadhar</TableCell>
                {hasAnyActionPermission && (
                  <TableCell className="columtext">Manage</TableCell>
                )}
                {role === 1 && (
                  <TableCell className="columtext">Payment</TableCell>
                )}
              </TableRow>
            </TableHeader>

            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell
                    colSpan={
                      hasAnyActionPermission
                        ? role === 1
                          ? 9
                          : 8
                        : role === 1
                        ? 8
                        : 7
                    }
                  >
                    Loading...
                  </TableCell>
                </TableRow>
              ) : paginatedData.length === 0 ? (
                <TableRow>
                  <TableCell
                    colSpan={
                      hasAnyActionPermission
                        ? role === 1
                          ? 9
                          : 8
                        : role === 1
                        ? 8
                        : 7
                    }
                    className="text-gray-500"
                  >
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
                          download={`PAN_${item.clientName}.pdf`}
                          className="text-blue-600 underline"
                        >
                          <IconButton color="primary">
                            <MdFileDownload />
                          </IconButton>
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
                          download={`Aadhar_${item.clientName}.pdf`}
                          className="text-blue-600 underline"
                        >
                          <IconButton color="primary">
                            <MdFileDownload />
                          </IconButton>
                        </a>
                      ) : (
                        "-"
                      )}
                    </TableCell>
                    {hasAnyActionPermission && (
                      <TableCell className="rowtext">
                        <div className="flex gap-2">
                          {canEditClient && (
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
                          )}

                          {canDeleteClient && (
                            <Badge variant="light" color="error">
                              <MdDelete
                                onClick={() =>
                                  handleDelete(item.client_milestone_id)
                                }
                                className="text-xl cursor-pointer"
                              />
                            </Badge>
                          )}
                        </div>
                      </TableCell>
                    )}
                    {role === 1 && (
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
                    )}
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>

        {/* Pagination */}
        <div className="mt-4 flex justify-between items-center w-full border-t border-gray-200 dark:border-gray-700 pt-3">
          <p className="text-sm">
            {totalRecords === 0 ? (
              "Showing 0 entries"
            ) : (
              <>
                Showing {page * rowsPerPage + 1}–
                {page * rowsPerPage + filteredData.length} of {totalRecords}{" "}
                entries
              </>
            )}
          </p>

          <Stack spacing={2}>
            <Pagination
              count={Math.ceil(totalRecords / rowsPerPage)}
              page={page + 1}
              onChange={(_, value) => setPage(value - 1)} // server expects 1-indexed
              color="primary"
              shape="rounded"
              siblingCount={1}
              boundaryCount={1}
            />
          </Stack>
        </div>
      </div>
    </div>
  );
}
