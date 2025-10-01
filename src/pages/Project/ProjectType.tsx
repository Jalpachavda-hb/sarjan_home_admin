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
import { FaEdit } from "react-icons/fa";
import { TextField, Button } from "@mui/material";
import { fetchProjectTypes } from "../../utils/Handlerfunctions/getdata";
import { editProjectType } from "../../utils/Handlerfunctions/formEditHandlers";
import { deleteProjectType } from "../../utils/Handlerfunctions/formdeleteHandlers";
import { usePermissions } from "../../hooks/usePermissions";
import AccessDenied from "../../components/ui/AccessDenied";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from "@mui/material";

interface Projecttype {
  id: string; // ✅ keep ID as string
  name: string;
}

export default function ProjectType() {
  const [tableData, setTableData] = useState<Projecttype[]>([]);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [editOpen, setEditOpen] = useState(false);
  const [editData, setEditData] = useState<Projecttype | null>(null);
  const [search, setSearch] = useState("");
  const [selectedColumns, setSelectedColumns] = useState<string[]>([]);

  // 🔹 Fetch data from API on mount
  useEffect(() => {
    const loadData = async () => {
      try {
        const data = await fetchProjectTypes();
        setTableData(data || []);
      } catch (err) {
        console.error("Failed to fetch project types", err);
      }
    };
    loadData();
  }, []);

  const handleDelete = async (id: string) => {
    try {
      const res = await deleteProjectType(id);

      if (res.status === 200) {
        setTableData((prev) => prev.filter((row) => row.id !== id));
      }
    } catch (err) {
      console.error("Failed to delete project type", err);
    }
  };

  const handleEditClick = (row: Projecttype) => {
    setEditData({ ...row });
    setEditOpen(true);
  };

  const { canDelete, canEdit, canCreate, canView, loading: permissionLoading } = usePermissions();
  const canViewProperties = canView("Properties");
  const canCreateProperties = canCreate("Properties");
  const canEditProperties = canEdit("Properties");
  const canDeleteProperties = canDelete("Properties");
  const hasAnyActionPermission = canEditProperties || canDeleteProperties;

  const handleEditChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (editData) {
      setEditData({ ...editData, [e.target.name]: e.target.value });
    }
  };

  const handleEditSave = async () => {
    if (!editData) return;

    try {
      const res = await editProjectType("1", editData.id, editData.name);

      if (res.status === 200) {
        setTableData((prev) =>
          prev.map((row) =>
            row.id === editData.id ? { ...row, name: editData.name } : row
          )
        );
        setEditOpen(false);
      }
    } catch (err) {
      console.error("Failed to update project type", err);
    }
  };

  const isColumnVisible = (column: string) =>
    selectedColumns.length === 0 || selectedColumns.includes(column);

  const handleChangePage = (_: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  // 🔹 Filter data by search
  const filteredData = useMemo(() => {
    let data = [...tableData];
    const searchTerm = search.trim().toLowerCase();
    if (searchTerm) {
      data = data.filter((item) =>
        item.name.toLowerCase().includes(searchTerm)
      );
    }
    return data;
  }, [search, tableData]);

  // 🔹 Paginate
  const paginatedData = useMemo(() => {
    return filteredData.slice(
      page * rowsPerPage,
      page * rowsPerPage + rowsPerPage
    );
  }, [filteredData, page, rowsPerPage]);

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
      <AccessDenied message="You don't have permission to view project types." />
    );
  }

  return (
    <div className="font-poppins text-gray-800 dark:text-white">
      <h3 className="text-lg font-semibold mb-5">Project Type</h3>

      <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white dark:bg-white/[0.03] px-4 pb-3 pt-4 sm:px-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
          <div></div>
          <div className="flex flex-wrap gap-2 justify-end items-center">
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
                {isColumnVisible("no") && (
                  <TableCell className="columtext">Sr. No</TableCell>
                )}
                {isColumnVisible("ProjectName") && (
                  <TableCell className="columtext">Project Name</TableCell>
                )}
                {hasAnyActionPermission && isColumnVisible("Action") && (
                  <TableCell className="columtext">Action</TableCell>
                )}
              </TableRow>
            </TableHeader>

            <TableBody>
              {paginatedData.length === 0 ? (
                <TableRow>
                  <TableCell className="py-12 text-gray-500" colSpan={3}>
                    No data available
                  </TableCell>
                </TableRow>
              ) : (
                paginatedData.map((item, index) => (
                  <TableRow key={item.id}>
                    {isColumnVisible("no") && (
                      <TableCell className="rowtext">
                        {page * rowsPerPage + index + 1}
                      </TableCell>
                    )}
                    {isColumnVisible("ProjectName") && (
                      <TableCell className="rowtext">{item.name}</TableCell>
                    )}
                    {hasAnyActionPermission && isColumnVisible("Action") && (
                      <TableCell className="rowtext">
                        <div className="flex gap-2 mt-1">
                          {canDeleteProperties && (
                            <Badge variant="light" color="error">
                              <MdDelete
                                className="text-2xl cursor-pointer"
                                onClick={() => handleDelete(item.id)}
                              />
                            </Badge>
                          )}
                          {canEditProperties && (
                            <Badge variant="light">
                              <FaEdit
                                className="text-2xl cursor-pointer"
                                onClick={() => handleEditClick(item)}
                              />
                            </Badge>
                          )}
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

      {/* 🔹 Edit Dialog */}
      <Dialog
        className="swal2-container"
        open={editOpen}
        onClose={() => setEditOpen(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>Edit Project Type</DialogTitle>
        <DialogContent>
          <TextField
            fullWidth
            margin="dense"
            label="Project Type"
            name="name"
            value={editData?.name || ""}
            onChange={handleEditChange}
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
