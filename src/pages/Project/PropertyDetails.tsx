import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableRow,
} from "../../components/ui/table";
import Badge from "../../components/ui/badge/Badge";
import { FaPlus } from "react-icons/fa6";
import { useState, useMemo, useEffect } from "react";
import { useNavigate } from "react-router-dom";
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
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from "@mui/material";
import Swal from "sweetalert2";
import { usePermissions } from "../../hooks/usePermissions";
import AccessDenied from "../../components/ui/AccessDenied";
// import { downloadCSV } from "../../utils/copy";
// import { addPropertyDetails } from "../../utils/Handlerfunctions/formSubmitHandlers";
import { uploadcsv } from "../../utils/Handlerfunctions/formSubmitHandlers";
// import Papa from "papaparse";
import SiteSelector from "../../components/form/input/SelectSiteinput";
import Label from "../../components/form/Label";
interface PropertyDetailsType {
  id: number;
  siteName: string;
  unit: string;
  unitNumber: string;
}

export default function PropertyDetails() {
  // All hooks must be called unconditionally at the top
  const {
    canDelete,
    canEdit,
    canCreate,
    canView,
    loading: permissionLoading,
  } = usePermissions();
  const [page, setPage] = useState(0);
  const [tableData, setTableData] = useState<PropertyDetailsType[]>([]);
  const [loading, setLoading] = useState(false);
  const [rowsPerPage, setRowsPerPage] = useState(12);
  const [selectedColumns, setSelectedColumns] = useState<string[]>([]);
  const [search, setSearch] = useState("");
  const [totalRecords, setTotalRecords] = useState(0);
  // const [selectedSite, setSelectedSite] = useState<number | string>(1);
  const [csvModalOpen, setCsvModalOpen] = useState(false);
  const [csvSite, setCsvSite] = useState<string>("");
  const [csvFile, setCsvFile] = useState<File | null>(null);
  // const { id } = useParams();
  const navigate = useNavigate();

  // Check permissions for Properties feature (after hooks)
  const canViewProperties = canView("Properties");
  const canCreateProperties = canCreate("Properties");
  const canEditProperties = canEdit("Properties");
  const canDeleteProperties = canDelete("Properties");

  // Check if user has any action permissions to show Action column
  const hasAnyActionPermission = canEditProperties || canDeleteProperties;

  const isColumnVisible = (column: string) =>
    selectedColumns.length === 0 || selectedColumns.includes(column);

  // Calculate visible columns count for colspan
  // const visibleColumnsCount =
  //   1 + // Sr. No column
  //   (isColumnVisible("siteName") ? 1 : 0) +
  //   (isColumnVisible("unit") ? 1 : 0) +
  //   (isColumnVisible("unitNumber") ? 1 : 0) +
  //   (hasAnyActionPermission && isColumnVisible("Action") ? 1 : 0);

  const fetchPageData = async (pageNumber = 1) => {
    setLoading(true);
    try {
      const res = await showPropertyDetailsList( pageNumber);
      if (res) {
        setTableData(res.data || []);
        setTotalRecords(res.total || 0);
        setRowsPerPage(res.per_page || 12);
        setPage(res.current_page ? res.current_page - 1 : 0);
      }
    } catch (error) {
      console.error("Error fetching property details:", error);
      toast.error("Failed to load property details");
      setTableData([]);
      setTotalRecords(0);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPageData(1);
  }, []);

  const handleDelete = async (id: number) => {
    if (!id) {
      toast.error("Invalid property ID");
      return;
    }

    // Check delete permission before proceeding
    if (!canDeleteProperties) {
      toast.error("You don't have permission to delete properties");
      return;
    }

    const result = await Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, delete it!",
      cancelButtonText: "Cancel",
    });

    if (result.isConfirmed) {
      try {
        await deletePropertyDetails(id.toString());

        fetchPageData(page + 1);
      } catch (error) {
        toast.error("Failed to delete property");
      }
    }
  };

  const handleEdit = (item: PropertyDetailsType) => {
    if (!canEditProperties) {
      toast.error("You don't have permission to edit properties");
      return;
    }
    navigate(`/admin/projects/add_property/${item.id}`);
  };

  const filteredData = useMemo(() => {
    if (!search) return tableData;
    const term = search.toLowerCase();
    return tableData.filter(
      (item) =>
        item.siteName?.toLowerCase().includes(term) ||
        "" ||
        item.unit?.toLowerCase().includes(term) ||
        "" ||
        item.unitNumber?.toLowerCase().includes(term) ||
        ""
    );
  }, [search, tableData]);

  const handleCsvFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0] || null;
    setCsvFile(selectedFile);
  };

  const downloadSampleCsv = () => {
    const headers = [
      "unit_number",
      "rera_area",
      "balcony_area",
      "wash_area",
      "terrace_area",
      "undivided_landshare",
      "north",
      "south",
      "east",
      "west",
    ].join(",");

    const rows = [
      ["K-501", 5, 5, 5, 5, 5, 5, 5, 5, 5],
      ["K-502", 5, 5, 5, 5, 5, 5, 5, 5, 5],
      ["K-503", 5, 5, 5, 5, 5, 5, 5, 5, 5],
    ]
      .map((row) => row.join(","))
      .join("\n");

    const csvContent = headers + "\n" + rows;

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);

    const a = document.createElement("a");
    a.href = url;
    a.download = "sample_properties.csv";
    document.body.appendChild(a); // ensures Firefox compatibility
    a.click();
    document.body.removeChild(a);

    URL.revokeObjectURL(url);
  };
  const handleCsvUpload = async () => {
    if (!csvSite) return toast.error("Please select a site");
    if (!csvFile) return toast.error("Please select a CSV file");

    try {
      setLoading(true);

      const formData = new FormData();
      formData.append("site_detail_id", csvSite);
      formData.append("file", csvFile);
      const res = await uploadcsv(formData);

      if (res?.status === 200 || res?.success) {
        toast.success("CSV uploaded successfully!");
        setCsvModalOpen(false);
        setCsvFile(null);
        setCsvSite("");
        fetchPageData(1);
      } else {
        toast.error(res?.message || "Upload failed.");
      }
    } catch (error) {
      console.error("Upload failed:", error);
      toast.error((error as any)?.response?.data?.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  // Define columns for CSV export
  // const columns = [
  //   { key: "siteName", label: "Site Name" },
  //   { key: "unit", label: "Unit" },
  //   { key: "unitNumber", label: "Unit Number" },
  // ];

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
      <AccessDenied message="You don't have permission to view property details." />
    );
  }

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
              onClick={() => setCsvModalOpen(true)}
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
                renderValue={(selected) =>
                  selected.length === 0
                    ? "Select Columns"
                    : `${selected.length} selected`
                }
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
                    disabled={col.key === "Action" && !hasAnyActionPermission}
                  >
                    <Checkbox
                      checked={selectedColumns.includes(col.key)}
                      disabled={col.key === "Action" && !hasAnyActionPermission}
                    />
                    <ListItemText
                      primary={col.label}
                      sx={{
                        opacity:
                          col.key === "Action" && !hasAnyActionPermission
                            ? 0.5
                            : 1,
                      }}
                    />
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
              sx={{
                fontFamily: "Poppins",
                "& .MuiOutlinedInput-root": {
                  fontFamily: "Poppins",
                  fontSize: "14px",
                },
              }}
            />
            {canCreateProperties && (
              <Button
                size="small"
                variant="contained"
                className="!bg-indigo-700 hover:!bg-indigo-900 text-white"
                onClick={() => navigate("/admin/projects/add_property")}
                startIcon={<FaPlus />}
              >
                Add Property
              </Button>
            )}
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
                {hasAnyActionPermission && isColumnVisible("Action") && (
                  <TableCell className="columtext">Action</TableCell>
                )}
              </TableRow>
            </TableHeader>

            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell
                    className="py-12 text-center"
                    // colSpan={visibleColumnsCount}
                  >
                    Loading...
                  </TableCell>
                </TableRow>
              ) : filteredData.length === 0 ? (
                <TableRow>
                  <TableCell
                    className="py-12 text-center text-gray-500"
                    // colSpan={visibleColumnsCount}
                  >
                    {search
                      ? "No matching properties found"
                      : "No properties available"}
                  </TableCell>
                </TableRow>
              ) : (
                filteredData.map((item, index) => (
                  <TableRow key={item.id}>
                    <TableCell className="rowtext">
                      {page * rowsPerPage + index + 1}
                    </TableCell>
                    {isColumnVisible("siteName") && (
                      <TableCell className="rowtext">
                        {item.siteName || "-"}
                      </TableCell>
                    )}

                    {isColumnVisible("unit") && (
                      <TableCell className="rowtext">
                        {item.unit || "-"}
                      </TableCell>
                    )}

                    {isColumnVisible("unitNumber") && (
                      <TableCell className="rowtext">
                        {item.unitNumber || "-"}
                      </TableCell>
                    )}
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
                                onClick={() => handleEdit(item)}
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

        {/* Pagination */}
        <div className="mt-4 flex flex-col sm:flex-row justify-between items-center w-full border-t border-gray-200 dark:border-gray-700 pt-3 gap-4">
          <p className="text-sm text-gray-600 dark:text-gray-400">
            {totalRecords === 0 ? (
              "Showing 0 entries"
            ) : (
              <>
                Showing {page * rowsPerPage + 1}–
                {Math.min(
                  page * rowsPerPage + filteredData.length,
                  totalRecords
                )}{" "}
                of {totalRecords} entries
                {search && filteredData.length < tableData.length && (
                  <span className="ml-2 text-blue-600">
                    (filtered from {tableData.length} entries)
                  </span>
                )}
              </>
            )}
          </p>

          {/* Pagination Controls */}
          {totalRecords > 0 && (
            <Stack spacing={2}>
              <Pagination
                count={Math.ceil(totalRecords / rowsPerPage)}
                page={page + 1}
                onChange={(_, value) => {
                  setPage(value - 1);
                  fetchPageData(value);
                }}
                color="primary"
                shape="rounded"
                siblingCount={1}
                boundaryCount={1}
                showFirstButton
                showLastButton
              />
            </Stack>
          )}
        </div>
      </div>

      {/* CSV Upload Modal */}
      <Dialog
        open={csvModalOpen}
        onClose={() => setCsvModalOpen(false)}
        maxWidth="sm"
        className="swal2-container"
        fullWidth
      >
        <DialogTitle>Upload CSV File</DialogTitle>
        <DialogContent>
          <div className="space-y-4 pt-2">
            {/* Site Selector */}
            <div>
              <button
                type="button"
                className="px-3 py-2 bg-green-600 hover:bg-green-700 text-white rounded text-sm"
                onClick={downloadSampleCsv}
              >
                Download Sample CSV
              </button>
            </div>
            <div>
              <SiteSelector value={csvSite} onChange={setCsvSite} />
            </div>

            {/* Sample CSV Download */}

            {/* File Upload */}
            <div>
              <Label>
                Upload CSV File <span className="text-red-500">*</span>
              </Label>
              <input
                type="file"
                accept=".csv"
                onChange={handleCsvFileChange}
                className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
              />
            </div>
          </div>
        </DialogContent>
        <DialogActions>
          <button
            type="button"
            className="px-4 py-2 text-gray-600 hover:text-gray-800"
            onClick={() => setCsvModalOpen(false)}
          >
            Cancel
          </button>
          <button
            type="button"
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded disabled:opacity-50"
            onClick={handleCsvUpload}
            disabled={loading}
          >
            {loading ? "Uploading..." : "Upload"}
          </button>
        </DialogActions>
      </Dialog>
    </div>
  );
}
