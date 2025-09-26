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
import { fetchAdminUsers ,fetchProfile } from "../../utils/Handlerfunctions/getdata";
import { TextField, Button } from "@mui/material";
import Swal from "sweetalert2";
import { toast } from "react-toastify";
import { deleteAdminUser } from "../../utils/Handlerfunctions/formdeleteHandlers";
import { useNavigate } from "react-router-dom";

interface AdminUser {
  id: string;
  title: string;
  name: string;
  email: string;
  contact_no: number;
  role_id: number;
  created_at: string;
  updated_at: string;
}

export default function Adminuser() {
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [selectedColumns] = useState<string[]>([]);
  const [adminUsers, setAdminUsers] = useState<AdminUser[]>([]);
  const navigate = useNavigate();
const [currentAdminId, setCurrentAdminId] = useState<string | null>(null);
  // use for search
  const [search, setSearch] = useState("");
  const [siteFilter] = useState("");
  const [loading, setLoading] = useState(false);
  // const [newCategory, setNewCategory] = useState("");

useEffect(() => {
  fetchProfile()
    .then((data) => {
      setCurrentAdminId(data.admin_id); // store current admin ID
    })
    .catch((err) => console.error("Error fetching profile:", err));
}, []);


  const isColumnVisible = (column: string) =>
    selectedColumns.length === 0 || selectedColumns.includes(column);

  const handleChangePage = (_: unknown, newPage: number) => setPage(newPage);
  const handleChangeRowsPerPage = (e: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(parseInt(e.target.value, 10));
    setPage(0);
  };

  const handleDelete = async (id: string) => {
    if (!id) {
      toast.error("Invalid admin user ID");
      return;
    }
    const result = await Swal.fire({
      title: "Are you sure?",
      text: "You won’t be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, delete it!",
    });

    if (result.isConfirmed) {
      await deleteAdminUser(id);
      loadData();
    }
  };

  const loadData = async () => {
    setLoading(true);
    try {
      const res = await fetchAdminUsers();
      if (res?.status === 200) {
        setAdminUsers(res.data);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);


const filteredData = adminUsers
 .filter((item) => String(item.id) !== String(currentAdminId)) // exclude current login user
  .filter((item) => item.role_id !== 1) // exclude admin users with role_id 1
  .filter((item) => {
    const searchTerm = search.trim().toLowerCase();
    const matchesSearch = Object.values(item)
      .map((val) => String(val).trim().toLowerCase())
      .join(" ")
      .includes(searchTerm);
    const matchesSite = siteFilter ? item.title === siteFilter : true;
    return matchesSearch && matchesSite;
  });
  const paginatedData = useMemo(
    () =>
      filteredData.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage),
    [filteredData, page, rowsPerPage]
  );

  //   const uniqueSites = [...new Set(tableData.map((item) => item.siteName))];

  return (
    <div className="font-poppins text-gray-800 dark:text-white">
      <h3 className="text-lg font-semibold mb-5">Admin User</h3>

      <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white dark:bg-white/[0.03] px-4 pb-3 pt-4 sm:px-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
          <div className="flex flex-wrap gap-2 items-center"></div>

          {/* Right Column */}
          <div className="flex flex-wrap gap-2 justify-start sm:justify-end items-center">
            {/* Search Input */}
            <a href="/admin/admin_users/add">
              <Button
                size="small"
                variant="contained"
                className="!bg-indigo-700 hover:!bg-indigo-900 text-white"
              >
                + Add New admin user
              </Button>
            </a>
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

                {isColumnVisible("sitename") && (
                  <TableCell className="columtext">Site Name</TableCell>
                )}

                {isColumnVisible("name") && (
                  <TableCell className="columtext">Name</TableCell>
                )}
                {isColumnVisible("email") && (
                  <TableCell className="columtext">Email</TableCell>
                )}
                {isColumnVisible("contactnumber") && (
                  <TableCell className="columtext">Contact No</TableCell>
                )}
                {isColumnVisible("contactnumber") && (
                  <TableCell className="columtext">Action</TableCell>
                )}
              </TableRow>
            </TableHeader>

            <TableBody>
              {paginatedData.length === 0 ? (
                <TableRow>
                  <TableCell
                    // colSpan={}
                    className="justify-between py-12 text-gray-500  "
                    // style={{ fontSize: "16px" }}
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

                    {isColumnVisible("count") && (
                      <TableCell className="rowtext">{item.title}</TableCell>
                    )}

                    {isColumnVisible("count") && (
                      <TableCell className="rowtext">{item.name}</TableCell>
                    )}
                    {isColumnVisible("count") && (
                      <TableCell className="rowtext">{item.email}</TableCell>
                    )}
                    {isColumnVisible("count") && (
                      <TableCell className="rowtext">
                        {item.contact_no}
                      </TableCell>
                    )}

                    {isColumnVisible("Action") && (
                      <TableCell className="rowtext">
                        <div className="flex gap-2 mt-1">
                          <Badge variant="light" color="error">
                            <MdDelete
                              onClick={() => handleDelete(item.id)}
                              className="text-2xl cursor-pointer"
                            />
                          </Badge>
                          <Badge variant="light">
                            {/* <FaEdit className="text-2xl cursor-pointer" /> */}
                            <FaEdit
                              onClick={() => navigate(`/admin/admin_users/edit/${item.id}`)} 
                              className="text-2xl cursor-pointer"
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
