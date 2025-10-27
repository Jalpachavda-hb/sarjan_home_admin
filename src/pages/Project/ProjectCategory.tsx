import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableRow,
} from "../../components/ui/table";
import Swal from "sweetalert2";
import { toast } from "react-toastify";
import { editProjectCategory } from "../../utils/Handlerfunctions/formEditHandlers";
import {
  fetchProjectcategory,
  getAdminId,
} from "../../utils/Handlerfunctions/getdata";
import Badge from "../../components/ui/badge/Badge";
import TablePagination from "@mui/material/TablePagination";
import { useState, useMemo, useEffect } from "react";
import { MdDelete } from "react-icons/md";
import { FaEdit } from "react-icons/fa";
import { TextField, Button } from "@mui/material";
// import { useNavigate } from "react-router-dom";
import { deleteProjectCategory } from "../../utils/Handlerfunctions/formdeleteHandlers";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from "@mui/material";
// import { Navigate } from "react-router";
import { usePermissions } from "../../hooks/usePermissions";
import AccessDenied from "../../components/ui/AccessDenied";

// ✅ Match API response
interface ProjectCategoryType {
  id: number;
  name: string;
}

export default function ProjectCategory() {
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [editOpen, setEditOpen] = useState(false);
  const [editData, setEditData] = useState<ProjectCategoryType | null>(null);
  const [selectedColumns] = useState<string[]>([]);
  // const navigate = useNavigate();
  const [search, setSearch] = useState("");
  // const [ setShowForm] = useState(false);
  // const [formMode, setFormMode] = useState<"add" | "edit">("add");
  // const [selectedCategory, setSelectedCategory] = useState("");
  const [tableData, setTableData] = useState<ProjectCategoryType[]>([]);
  const [editError, setEditError] = useState<string>("");
  const handleChangePage = (_: unknown, newPage: number) => {
    setPage(newPage);
  };
  const { canDelete, canEdit, canCreate, canView, loading: permissionLoading } = usePermissions();
  const canViewProperties = canView("Properties");
  const canCreateProperties = canCreate("Properties");
  const canEditProperties = canEdit("Properties");
  const canDeleteProperties = canDelete("Properties");
  const hasAnyActionPermission = canEditProperties || canDeleteProperties;

  // ✅ Fetch data from API
  const fetchData = async () => {
    try {
      const data = await fetchProjectcategory();
      setTableData(data);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  // ✅ Fetch on mount
  useEffect(() => {
    fetchData();
  }, []);
  const isColumnVisible = (column: string) =>
    selectedColumns.length === 0 || selectedColumns.includes(column);

  const handleChangeRowsPerPage = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  // ✅ Search filter
  const filteredData = useMemo(() => {
    let data = [...tableData];

    const searchTerm = search.trim().toLowerCase();

    if (searchTerm) {
      data = data.filter((item) =>
        Object.values(item).some((val) =>
          String(val).toLowerCase().includes(searchTerm)
        )
      );
    }

    return data;
  }, [search, tableData]);

  // ✅ Pagination
  const paginatedData = useMemo(() => {
    return filteredData.slice(
      page * rowsPerPage,
      page * rowsPerPage + rowsPerPage
    );
  }, [filteredData, page, rowsPerPage]);

  const handleEditClick = (category: ProjectCategoryType) => {
    setEditData(category);
    setEditError("");
    setEditOpen(true);
    if (editError) setEditError("");
  };
  const handleEditChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!editData) return;
    const { name, value } = e.target;

    setEditData({ ...editData, [name]: value });

    // 🔹 remove validation error once user types something
    if (editError && value.trim()) {
      setEditError("");
    }
  };

  // const handleCancelForm = () => {
  //   setShowForm(false);
  // };

  const handleDelete = async (id: string) => {
    try {
      const confirm = await Swal.fire({
        title: "Are you sure?",
        text: "This action cannot be undone.",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#d33",
        cancelButtonColor: "#3085d6",
        confirmButtonText: "Yes, delete it!",
      });

      if (!confirm.isConfirmed) return;

      const adminId = getAdminId();
      if (!adminId) {
        toast.error("Admin ID not found");
        return;
      }

      const res = await deleteProjectCategory(id, adminId.toString());

      if (res?.status === 200 || res?.success) {
        toast.success("Category deleted successfully");
        fetchData();
      } else {
        toast.error(res?.message || "Failed to delete category");
      }
    } catch (error) {
      toast.error("Something went wrong while deleting");
      console.error("Delete error:", error);
    }
  };

  const handleEditSave = async () => {
    if (!editData?.name.trim()) {
      setEditError("Project Category is required");
      return;
    }

    try {
      const adminId = getAdminId(); // 🔹 get admin_id dynamically
      if (!adminId) {
        toast.error("Admin ID not found");
        return;
      }

      const formData = new FormData();
      formData.append("admin_id", adminId.toString());
      formData.append("id", editData.id.toString());
      formData.append("project_category_name", editData.name);

      const res = await editProjectCategory(formData);

      if (res?.status === 200) {
        setTableData((prev) =>
          prev.map((item) =>
            item.id === editData.id ? { ...item, name: editData.name } : item
          )
        );
        setEditOpen(false);
        toast.success("Project category updated successfully!");
      }
    } catch (error) {
      console.error("Update failed:", error);
    }
  };

  // Show loader while checking permissions
  if (permissionLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  // Show Access Denied if user doesn't have view permission
  if (!canViewProperties) {
    return (
      <AccessDenied message="You don't have permission to view project categories." />
    );
  }

  return (
    <div className="font-poppins text-gray-800 dark:text-white">
      <h3 className="text-lg font-semibold mb-5">Project Category</h3>

      <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white dark:bg-white/[0.03] px-4 pb-3 pt-4 sm:px-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
          <div className="flex flex-wrap gap-2 items-center"></div>

          {/* Right Column */}
          <div className="flex flex-wrap gap-2 justify-start sm:justify-end items-center">
            {/* <Button
              size="small"
              variant="contained"
              className="!bg-indigo-700 hover:!bg-indigo-900 text-white"
             
            >
              Add Category
            </Button> */}
            {canCreateProperties && (
            <a href="projects_category/addcategory">
              <Button
                size="small"
                variant="contained"
                className="!bg-indigo-700 hover:!bg-indigo-900 text-white"
              >
                + Add Category
              </Button>
            </a>
                     )}
            <TextField
              size="small"
              variant="outlined"
              placeholder="Search..."
              value={search}
              onChange={(e) => setSearch(e.target.value.trimStart())}
              sx={{ fontFamily: "Poppins" }}
              InputProps={{ sx: { fontFamily: "Poppins", fontSize: "14px" } }}
                className="dark:bg-gray-200 rounded-md"
            />
          </div>
        </div>

        <div className="max-w-full overflow-x-auto mt-8">
          <Table>
            <TableHeader>
              <TableRow>
                <TableCell className="columtext">Sr. No</TableCell>
                {isColumnVisible("name") && (
                  <TableCell className="columtext">Project Category</TableCell>
                )}
                {hasAnyActionPermission && isColumnVisible("action") && (
                  <TableCell className="columtext">Action</TableCell>
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
                    {isColumnVisible("name") && (
                      <TableCell className="rowtext">{item.name}</TableCell>
                    )}
                    {hasAnyActionPermission && isColumnVisible("action") && (
                      <TableCell className="rowtext">
                        <div className="flex gap-2 mt-1">
                          <Badge variant="light">
                            <FaEdit
                              className="text-2xl cursor-pointer"
                              onClick={() => handleEditClick(item)}
                            />
                          </Badge>
                          <Badge variant="light" color="error">
                            <MdDelete
                              className="text-2xl cursor-pointer"
                              onClick={() => handleDelete(item.id.toString())}
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
              rowsPerPageOptions={[5, 10, 25]}
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
      <Dialog
        className="swal2-container"
        open={editOpen}
        onClose={() => setEditOpen(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>Edit Project Category</DialogTitle>
        <DialogContent>
          <TextField
            fullWidth
            margin="dense"
            label="Project Category"
            name="name"
            value={editData?.name || ""}
            onChange={handleEditChange}
            error={!!editError} // ✅ red border
            helperText={editError}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setEditOpen(false)}>Cancel</Button>
          <Button
            onClick={handleEditSave}
            variant="contained"
            className="!bg-blue-600 hover:!bg-blue-700"
          >
            Save
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}
