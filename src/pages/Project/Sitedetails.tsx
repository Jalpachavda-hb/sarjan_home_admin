import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableRow,
} from "../../components/ui/table";
import Swal from "sweetalert2";
import { toast } from "react-toastify";
import Badge from "../../components/ui/badge/Badge";
import TablePagination from "@mui/material/TablePagination";
import { fetchSiteDetails } from "../../utils/Handlerfunctions/getdata";
import { MdDelete } from "react-icons/md";
import { FaEdit } from "react-icons/fa";
import { useEffect, useState, useMemo } from "react";
import { TextField, Button } from "@mui/material";
import {} from "@mui/material";
import { usePermissions } from "../../hooks/usePermissions";
import { deleteSite } from "../../utils/Handlerfunctions/formdeleteHandlers";
interface sitedetails {
  id: string;
  project_type: string;
  project_category_name: string;
  title: string;
}

export default function sitedetails() {
  const { canDelete, canEdit, canCreate, canView } = usePermissions();
  const canViewProperties = canView("Properties");

  const canCreateProperties = canCreate("Properties");
  const canEditProperties = canEdit("Properties");
  const canDeleteProperties = canDelete("Properties");
  const hasAnyActionPermission = canEditProperties || canDeleteProperties;

  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [selectedColumns, setSelectedColumns] = useState<string[]>([]);
  const [editOpen, setEditOpen] = useState(false);
  const [editData, setEditData] = useState<sitedetails | null>(null);
  const [tableData, setTableData] = useState<sitedetails[]>([]);
  // use for search
  const [search, setSearch] = useState("");
  const [siteFilter, setSiteFilter] = useState("");
  const [addOpen, setAddOpen] = useState(false);
  const [siteDetails, setSiteDetails] = useState<sitedetails[]>([]);
  const [newCategory, setNewCategory] = useState("");

  const handleEditClick = (row: sitedetails) => {
    setEditData({ ...row });
    setEditOpen(true);
  };
  const loadSiteDetails = async () => {
    try {
      const data = await fetchSiteDetails();
      setSiteDetails(data);
    } catch (error) {
      console.error("Error loading site details:", error);
    }
  };

  useEffect(() => {
    loadSiteDetails();
  }, []);


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

    const res = await deleteSite(id); // 🔹 API call

    if (res?.status === 200 || res?.success) {
      toast.success("Site deleted successfully ✅");
      // refresh UI (re-fetch list)
      loadSiteDetails();
    } else {
      toast.error(res?.message || "Failed to delete site ");
    }
  } catch (error) {
    toast.error("Something went wrong while deleting ");
    console.error("Delete error:", error);
  }
};

  const handleEditChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (editData) {
      setEditData({ ...editData, [e.target.name]: e.target.value });
    }
  };

  const handleEditSave = () => {
    if (editData) {
      // Here you would normally update in DB or state
      console.log("Updated data:", editData);
    }
    setEditOpen(false);
  };

  const handleChangePage = (_: unknown, newPage: number) => {
    setPage(newPage);
  };

  const isColumnVisible = (column: string) =>
    selectedColumns.length === 0 || selectedColumns.includes(column);

  const handleChangeRowsPerPage = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const filteredData = useMemo(() => {
    let data = [...siteDetails];

    const searchTerm = search.trim().toLowerCase(); // 🔹 Trim spaces

    if (searchTerm) {
      data = data.filter((item) =>
        Object.values(item).some((val) =>
          String(val).toLowerCase().includes(searchTerm)
        )
      );
    }

    return data;
  }, [search, siteDetails]);

  const paginatedData = useMemo(() => {
    return filteredData.slice(
      page * rowsPerPage,
      page * rowsPerPage + rowsPerPage
    );
  }, [filteredData, page, rowsPerPage]);

  //   const uniqueSites = [...new Set(siteDetails.map((item) => item.name))];

  // Show Access Denied if user doesn't have view permission

  return (
    <div className="font-poppins text-gray-800 dark:text-white">
      <h3 className="text-lg font-semibold mb-5">Site details</h3>

      <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white dark:bg-white/[0.03] px-4 pb-3 pt-4 sm:px-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
          <div className="flex flex-wrap gap-2 items-center">
            {/* <Button
              size="small"
              variant="contained"
              className="!bg-green-600 hover:!bg-green-700 text-white"
            >
              Copy
            </Button>
            <Button
              size="small"
              variant="contained"
              className="!bg-blue-600 hover:!bg-blue-700 text-white"
            >
              CSV
            </Button> */}
            {/* <Button
              size="small"
              variant="contained"
              className="!bg-amber-500 hover:!bg-amber-600 text-white"
            >
              Print
            </Button> */}

            {/* Select Columns Dropdown */}
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
                  "siteName",
                  "clientName",
                  "contactNumber",
                  "Email",
                  "blocknumber",
                  "blocknumberType",
                  "receivedDate",
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
                          siteName: "Site Name",
                          contactNumber: "contactNumber",
                          Email: "Unit No.",
                          blocknumber: "Received blocknumber",
                          blocknumberType: "blocknumber Type",
                          receivedDate: "Received Date",
                        }[col]
                      }
                    />
                  </MenuItem>
                ))}
              </Select>
            </FormControl> */}
          </div>

          {/* Right Column */}
          <div className="flex flex-wrap gap-2 justify-start sm:justify-end items-center">
            {/* Filter by Site Dropdown */}

            {/* <FormControl size="small" sx={{ minWidth: 150 }}>
              <InputLabel
                className="text-gray-500 dark:text-white"
                sx={{ fontFamily: "Poppins" }}
              >
                Filter by Site
              </InputLabel>
              <Select
                value={siteFilter}
                label="Filter by Site"
                onChange={(e) => setSiteFilter(e.target.value)}
                sx={{ fontFamily: "Poppins" }}
                MenuProps={{
                  PaperProps: {
                    sx: { fontFamily: "Poppins", fontSize: "14px" },
                  },
                }}
              >
                <MenuItem value="">All Sites</MenuItem>
                {uniqueSites.map((site) => (
                  <MenuItem
                    key={site}
                    value={site}
                    sx={{ fontFamily: "Poppins", fontSize: "14px" }}
                  >
                    {site}
                  </MenuItem>
                ))}
              </Select>
            </FormControl> */}

            {/* Search Input */}
            {canCreateProperties && (
              <a href="/admin/projects/site_details/Addsite">
                <Button
                  size="small"
                  variant="contained"
                  className="!bg-indigo-700 hover:!bg-indigo-900 text-white"
                  onClick={() => setAddOpen(true)}
                >
                  Add Site Details
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
            />
          </div>
        </div>

        <div className="max-w-full overflow-x-auto mt-8">
          <Table>
            <TableHeader>
              <TableRow>
                <TableCell className="columtext">Sr. No</TableCell>

                {isColumnVisible("projectype") && (
                  <TableCell className="columtext">Project Type</TableCell>
                )}

                {isColumnVisible("siteName") && (
                  <TableCell className="columtext">Project Category</TableCell>
                )}
                {isColumnVisible("siteName") && (
                  <TableCell className="columtext">Site Title</TableCell>
                )}
                {hasAnyActionPermission && isColumnVisible("Action") && (
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
                      <TableCell className="rowtext">
                        {item.project_type}
                      </TableCell>
                    )}

                    {isColumnVisible("count") && (
                      <TableCell className="rowtext">
                        {item.project_category_name}
                      </TableCell>
                    )}
                    {isColumnVisible("count") && (
                      <TableCell className="rowtext">{item.title}</TableCell>
                    )}

                    {/* {isColumnVisible("Action") && (
                      <TableCell className="rowtext">
                        <div className="flex gap-2 mt-1">
                          <Badge variant="light" color="error">
                            <MdDelete className="text-2xl cursor-pointer" />
                          </Badge>
                          <Badge variant="light">
                            <FaEdit
                              className="text-2xl cursor-pointer"
                              onClick={() => handleEditClick(item)}
                            />
                          </Badge>
                        </div>
                      </TableCell>
                    )}  */}
                    {hasAnyActionPermission && isColumnVisible("Action") && (
                      <TableCell className="rowtext">
                        <div className="flex gap-2 mt-1">
                          {canDeleteProperties && (
                            <Badge variant="light" color="error">
                              <MdDelete
                                className="text-2xl cursor-pointer"
                                onClick={() => handleDelete(item.id)}
                                title="Delete Property"
                              />
                            </Badge>
                          )}
                          {canEditProperties && (
                            <Badge variant="light">
                              <FaEdit
                                className="text-2xl cursor-pointer"
                                // onClick={() => handleEdit(item)}
                                title="Edit Property"
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
