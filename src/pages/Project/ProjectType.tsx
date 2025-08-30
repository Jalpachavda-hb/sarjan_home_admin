

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

import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from "@mui/material";

interface Projecttype {
  id: number;
  name: string; // 👈 updated field (your API returns "name")
}

export default function ProjectType() {
  const [tableData, setTableData] = useState<Projecttype[]>([]);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [editOpen, setEditOpen] = useState(false);
  const [editData, setEditData] = useState<Projecttype | null>(null);
  const [search, setSearch] = useState("");

  // 🔹 Fetch data from API on mount
useEffect(() => {
  const loadData = async () => {
    const data = await fetchProjectTypes(); // directly returns []
    setTableData(data);
  };
  loadData();
}, []);

const handleDelete = async (id: string) => {
  try {
    const res = await deleteProjectType(id);

    if (res.status === 200) {
      // remove deleted row from UI
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

  const handleEditChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (editData) {
      setEditData({ ...editData, [e.target.name]: e.target.value });
    }
  };
const handleEditSave = async () => {
  if (!editData) return;

  try {
    const res = await editProjectType("1", editData.id.toString(), editData.name);

    if (res.status === 200) {
      // update UI immediately
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
                <TableCell className="columtext">Sr. No</TableCell>
                <TableCell className="columtext">Project Name</TableCell>
                <TableCell className="columtext">Action</TableCell>
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
                    <TableCell className="rowtext">{item.name}</TableCell>
                    <TableCell className="rowtext">
                      <div className="flex gap-2 mt-1">
                        <Badge variant="light" color="error">
                          <MdDelete className="text-2xl cursor-pointer"
                          onClick={() => handleDelete(item.id)} />
                        </Badge>
                        <Badge variant="light">
                          <FaEdit
                            className="text-2xl cursor-pointer"
                            onClick={() => handleEditClick(item)}
                          />
                        </Badge>
                      </div>
                    </TableCell>
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
      <Dialog className="swal2-container" open={editOpen} onClose={() => setEditOpen(false)} maxWidth="sm" fullWidth>
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
