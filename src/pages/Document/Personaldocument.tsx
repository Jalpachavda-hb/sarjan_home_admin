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
import { MdDelete } from "react-icons/md";
import { FaRegEye, FaRegEdit } from "react-icons/fa";
import { fetchPersonalDocuments } from "../../utils/Handlerfunctions/getdata";
import { TextField, Button } from "@mui/material";
import { toast } from "react-toastify";
import Swal from "sweetalert2";
import { deletePersonalDocument } from "../../utils/Handlerfunctions/formdeleteHandlers";
import { usePermissions } from "../../hooks/usePermissions";
import AccessDenied from "../../components/ui/AccessDenied";

interface Adminuser {
  id: number;
  site_title: string;
  personal_document_name: string;
  client_name: string;
  personal_document_file?: string;
}

export default function Personaldocument() {
  const [tableData, setTableData] = useState<Adminuser[]>([]);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [selectedColumns, setSelectedColumns] = useState<string[]>([]);
  const [sortConfig, setSortConfig] = useState<{
    key: keyof Adminuser;
    direction: "asc" | "desc";
  } | null>(null);
  const [search, setSearch] = useState("");
  const [siteFilter, setSiteFilter] = useState("");
    const { canDelete, canEdit, canCreate, canView, loading: permissionLoading } = usePermissions();

 const canViewDocuments = canView("Documents");
  const canCreateDocuments = canCreate("Documents");
  const canEditDocuments = canEdit("Documents");
  const canDeleteDocuments = canDelete("Documents");

  // ✅ Load data
  useEffect(() => {
    const loadDocs = async () => {
      const data = await fetchPersonalDocuments();
      console.log("Personal Documents API Response:", data); // Debug log
      if (Array.isArray(data)) {
        setTableData(data);
      } else {
        toast.error("Failed to load documents");
      }
    };
    loadDocs();
  }, []);

  const handleChangePage = (_: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const isColumnVisible = (column: string) =>
    selectedColumns.length === 0 || selectedColumns.includes(column);

  const filteredData = useMemo(() => {
    let data = [...tableData];

    if (search) {
      const searchTerm = search.toLowerCase();
      data = data.filter((item) =>
        Object.values(item).some((val) =>
          String(val).toLowerCase().includes(searchTerm)
        )
      );
    }

    if (siteFilter) {
      data = data.filter(
        (item) => item.site_title.toLowerCase() === siteFilter.toLowerCase()
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
  }, [tableData, search, siteFilter, sortConfig]);

  const paginatedData = useMemo(() => {
    return filteredData.slice(
      page * rowsPerPage,
      page * rowsPerPage + rowsPerPage
    );
  }, [filteredData, page, rowsPerPage]);

  const handleSort = (key: keyof Adminuser) => {
    let direction: "asc" | "desc" = "asc";
    if (sortConfig && sortConfig.key === key && sortConfig.direction === "asc") {
      direction = "desc";
    }
    setSortConfig({ key, direction });
    setPage(0);
  };

  // ✅ Delete
  const handleDelete = async (id: number) => {
    const result = await Swal.fire({
      title: "Are you sure?",
      text: "You won’t be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete it!",
    });

    if (result.isConfirmed) {
      try {
        await deletePersonalDocument(id);
        setTableData((prev) => prev.filter((doc) => doc.id !== id));
        toast.success("Document deleted successfully!");
      } catch (err) {
        console.error("Delete failed:", err);
        toast.error("Failed to delete document. Please try again.");
      }
    }
  };


 const handleView = (item: Adminuser) => {
  console.log("Viewing document for item:", item);

  if (!item.personal_document_file) {
    toast.error("File not available");
    return;
  }

  window.open(item.personal_document_file, "_blank", "noopener,noreferrer");
};

  // ✅ Edit in new tab
  
  // Show loader while checking permissions
  if (permissionLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  // Show Access Denied if user doesn't have view permission
  if (!canViewDocuments) {
    return (
      <AccessDenied message="You don't have permission to view personal documents." />
    );
  }

  return (
    <div className="font-poppins text-gray-800 dark:text-white">
      <h3 className="text-lg font-semibold mb-5">Personal Document Types</h3>

      <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white dark:bg-white/[0.03] px-4 pb-3 pt-4 sm:px-6">
        {/* Top controls */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
          <div />
          <div className="flex flex-wrap gap-2 justify-start sm:justify-end items-center">
             {canCreateDocuments && (
            <a href="/admin/personal_documents/add">
              <Button
                size="small"
                variant="contained"
                className="!bg-indigo-700 hover:!bg-indigo-900 text-white"
              >
                + Add Document Types
              </Button>
            </a>)}
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

        {/* Table */}
        <div className="max-w-full overflow-x-auto mt-8">
          <Table>
            <TableHeader>
              <TableRow>
                <TableCell className="columtext">Sr. No</TableCell>
                {isColumnVisible("site_title") && (
                  <TableCell
                    className="columtext cursor-pointer"
                    onClick={() => handleSort("site_title")}
                  >
                    Site Name
                  </TableCell>
                )}
                {isColumnVisible("client_name") && (
                  <TableCell
                    className="columtext cursor-pointer"
                    onClick={() => handleSort("client_name")}
                  >
                    Client Name
                  </TableCell>
                )}
                {isColumnVisible("personal_document_name") && (
                  <TableCell
                    className="columtext cursor-pointer"
                    onClick={() => handleSort("personal_document_name")}
                  >
                    Personal Document Name
                  </TableCell>
                )}
                {isColumnVisible("action") && (
                  <TableCell className="columtext">Action</TableCell>
                )}
              </TableRow>
            </TableHeader>

            <TableBody>
              {paginatedData.length === 0 ? (
                <TableRow>
                  <TableCell className="py-12 text-gray-500">
                    No data available
                  </TableCell>
                </TableRow>
              ) : (
                paginatedData.map((item, index) => (
                  <TableRow key={item.id}>
                    <TableCell className="rowtext">
                      {page * rowsPerPage + index + 1}
                    </TableCell>
                    {isColumnVisible("site_title") && (
                      <TableCell className="rowtext">{item.site_title}</TableCell>
                    )}
                    {isColumnVisible("client_name") && (
                      <TableCell className="rowtext">{item.client_name}</TableCell>
                    )}
                    {isColumnVisible("personal_document_name") && (
                      <TableCell className="rowtext">
                        {item.personal_document_name}
                      </TableCell>
                    )}
                    {isColumnVisible("action") && (
                      <TableCell className="rowtext">
                        <div className="flex gap-2 mt-1">
                           {canDeleteDocuments && (
                          <Badge variant="light" color="error">
                            <MdDelete
                              className="text-2xl cursor-pointer"
                              onClick={() => handleDelete(item.id)}
                            />
                          </Badge>)}
                          <Badge variant="light" >
                            <FaRegEye
                              className="text-2xl cursor-pointer"
                              onClick={() => handleView(item)}
                            />
                          </Badge>
                         
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
                ".MuiSelect-select": { color: "inherit", backgroundColor: "transparent" },
                ".MuiTablePagination-selectLabel, .MuiTablePagination-displayedRows": { color: "inherit" },
                ".MuiSvgIcon-root": { color: "inherit" },
              }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
