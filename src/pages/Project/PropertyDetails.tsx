import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableRow,
} from "../../components/ui/table";
import Badge from "../../components/ui/badge/Badge";
import TablePagination from "@mui/material/TablePagination";
import { FaPlus } from "react-icons/fa6";
import { useState, useMemo, useEffect } from "react";
import { useNavigate, useLocation, useParams } from "react-router-dom";
import { MdDelete } from "react-icons/md";
import { FaEdit } from "react-icons/fa";
import { toast } from "react-toastify";
import { showPropertyDetailsList } from "../../utils/Handlerfunctions/getdata";
import { deletePropertyDetails } from "../../utils/Handlerfunctions/formdeleteHandlers";
import Pagination from "@mui/material/Pagination";
import Stack from "@mui/material/Stack";
import {
  TextField,
  Button,
  Select,
  MenuItem,
  Checkbox,
  ListItemText,
  FormControl,
} from "@mui/material";
import Swal from "sweetalert2";
interface PropertyDetailsType {
  id: number;
  siteName: string;
  unit: string;
  unitNumber: string;
}

export default function PropertyDetails() {
  const [page, setPage] = useState(0);
  const [tableData, setTableData] = useState<PropertyDetailsType[]>([]);
  const [loading, setLoading] = useState(false);
  const [rowsPerPage, setRowsPerPage] = useState(12);
  const [selectedColumns, setSelectedColumns] = useState<string[]>([]);
  const [search, setSearch] = useState("");
  const [totalRecords, setTotalRecords] = useState(0);
  const [selectedSite, setSelectedSite] = useState<number | string>(1);
  const { id } = useParams();
  const isColumnVisible = (column: string) =>
    selectedColumns.length === 0 || selectedColumns.includes(column);

  const fetchPageData = async (pageNumber = 1) => {
    setLoading(true);
    try {
      const res = await showPropertyDetailsList(selectedSite, pageNumber);
      if (res) {
        setTableData(res.data);
        setTotalRecords(res.total);
        setRowsPerPage(res.per_page);
        setPage(res.current_page - 1); // convert API 1-indexed to 0-indexed
      }
    } finally {
      setLoading(false);
    }
  };
  const navigate = useNavigate();
  useEffect(() => {
    fetchPageData(1);
  }, [selectedSite]);

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
      await deletePropertyDetails(id);
      fetchPageData();
    }
  };

  const filteredData = useMemo(() => {
    if (!search) return tableData;
    const term = search.toLowerCase();
    return tableData.filter(
      (item) =>
        item.siteName.toLowerCase().includes(term) ||
        item.unit.toLowerCase().includes(term) ||
        item.unitNumber.toLowerCase().includes(term)
    );
  }, [search, tableData]);
  return (
    <div className="font-poppins text-gray-800 dark:text-white">
      <h3 className="text-lg font-semibold mb-5">Property Details</h3>

      <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white dark:bg-white/[0.03] px-4 pb-3 pt-4 sm:px-6">
        {/* Controls */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
          <div className="flex flex-wrap gap-2 items-center">
            <Button
              size="small"
              variant="contained"
              className="!bg-blue-600 hover:!bg-blue-700 text-white"
            >
              Upload CSV
            </Button>

            {/* Column selector */}
            <FormControl size="small" sx={{ minWidth: 200 }}>
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
              >
                {[
                  { key: "siteName", label: "Site Name" },
                  { key: "unit", label: "Unit" },
                  { key: "unitNumber", label: "Unit Number" },
                  { key: "Action", label: "Action" },
                ].map((col) => (
                  <MenuItem
                    key={col.key}
                    value={col.key}
                    sx={{ fontFamily: "Poppins" }}
                  >
                    <Checkbox checked={selectedColumns.includes(col.key)} />
                    <ListItemText primary={col.label} />
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </div>

          {/* Search & Add */}
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
            <a
              href="add_property"
              className="text-blue-500 hover:text-blue-700"
            >
              <Button
                size="small"
                variant="contained"
                className="!bg-indigo-700 hover:!bg-indigo-900 text-white"
              >
                <FaPlus /> Add Property
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
                {isColumnVisible("siteName") && (
                  <TableCell className="columtext">Site Name</TableCell>
                )}
                {isColumnVisible("unit") && (
                  <TableCell className="columtext">Unit</TableCell>
                )}
                {isColumnVisible("unitNumber") && (
                  <TableCell className="columtext">Unit Number</TableCell>
                )}
                {isColumnVisible("Action") && (
                  <TableCell className="columtext">Action</TableCell>
                )}
              </TableRow>
            </TableHeader>

            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={5} className="py-12 text-center">
                    Loading...
                  </TableCell>
                </TableRow>
              ) : filteredData.length === 0 ? (
                <TableRow>
                  <TableCell
                    colSpan={5}
                    className="py-12 text-center text-gray-500"
                  >
                    No data
                  </TableCell>
                </TableRow>
              ) : (
                filteredData.map((item, index) => (
                  <TableRow key={item.id}>
                    <TableCell className="rowtext">
                      {page * rowsPerPage + index + 1}
                    </TableCell>
                    {isColumnVisible("siteName") && (
                      <TableCell className="rowtext">{item.siteName}</TableCell>
                    )}
                    
                    {isColumnVisible("unit") && (
                      <TableCell className="rowtext">{item.unit}</TableCell>
                    )}

                    {isColumnVisible("unitNumber") && (
                      <TableCell className="rowtext">
                        {item.unitNumber}
                      </TableCell>
                    )}
                    {isColumnVisible("Action") && (
                      <TableCell className="rowtext">
                        <div className="flex gap-2 mt-1">
                          <Badge variant="light" color="error">
                            <MdDelete
                              className="text-2xl cursor-pointer"
                              onClick={() => handleDelete(item.id)}
                            />
                          </Badge>
                          <Badge variant="light">
                            <FaEdit
                              className="text-2xl cursor-pointer"
                              onClick={() =>
                                navigate(
                                  `/admin/projects/add_property/${item.id}`
                                )
                              }
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

          {/* 🔹 Numbered Pagination */}
          <Stack spacing={2}>
            <Pagination
              count={Math.ceil(totalRecords / rowsPerPage)}
              page={page + 1}
              // onChange={(_, value) => setPage(value - 1)}
              onChange={(_, value) => {
                setPage(value - 1);
                fetchPageData(value);
              }}
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
