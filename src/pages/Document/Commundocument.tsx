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
import { useState, useMemo, useEffect } from "react";
import { MdDelete } from "react-icons/md";
import {
  fetchCommonDocuments,
  getAdminId,
} from "../../utils/Handlerfunctions/getdata";
import { deleteCommonDocument } from "../../utils/Handlerfunctions/formdeleteHandlers";
import { FaRegEye } from "react-icons/fa";
import { TextField, Button } from "@mui/material";

interface CommonDocument {
  id: string;
  common_document_name: string;
  common_document_file: string;
  site_title: string;
}

export default function Commundocument() {
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [selectedColumns, setSelectedColumns] = useState<string[]>([]);
  const [documents, setDocuments] = useState<CommonDocument[]>([]);
  const [sortConfig, setSortConfig] = useState<{
    key: keyof Adminuser;
    direction: "asc" | "desc";
  } | null>(null);
  // use for search
  const [search, setSearch] = useState("");
  const [siteFilter, setSiteFilter] = useState("");

  const [newCategory, setNewCategory] = useState("");

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
    return documents.filter((item) => {
      const searchTerm = search.trim().toLowerCase();
      const matchesSearch =
        item.common_document_name.toLowerCase().includes(searchTerm) ||
        item.site_title.toLowerCase().includes(searchTerm);

      const matchesSite = siteFilter
        ? item.site_title.trim() === siteFilter.trim()
        : true;

      return matchesSearch && matchesSite;
    });
  }, [documents, search, siteFilter]);

  const paginatedData = useMemo(() => {
    return filteredData.slice(
      page * rowsPerPage,
      page * rowsPerPage + rowsPerPage
    );
  }, [filteredData, page, rowsPerPage]);

  useEffect(() => {
    const loadDocs = async () => {
      const adminId = getAdminId();
      if (!adminId) return;

      const data = await fetchCommonDocuments(adminId);
      setDocuments(data);
    };
    loadDocs();
  }, []);

  const handleDelete = async (id: string) => {
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
        await deleteCommonDocument(id);

        // ✅ Update state
        setDocuments((prev) => prev.filter((doc) => doc.id !== id));

        // ✅ Show success
        // toast.success("Document deleted successfully!");
      } catch (err) {
        console.error("Delete failed:", err);
        toast.error("Failed to delete document. Please try again.");
      }
    }
  };

  // ✅ View handler
  const handleView = (fileUrl: string) => {
    window.open(fileUrl, "_blank");
  };

  //   const uniqueSites = [...new Set(tableData.map((item) => item.siteName))];

  return (
    <div className="font-poppins text-gray-800 dark:text-white">
      <h3 className="text-lg font-semibold mb-5">Common Document Types</h3>

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
            <a href="/admin/common_documents/add">
              <Button
                size="small"
                variant="contained"
                className="!bg-indigo-700 hover:!bg-indigo-900 text-white"
              >
                + Add Common Doc Types
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

                {isColumnVisible("DocType") && (
                  <TableCell className="columtext">DocType</TableCell>
                )}

                {isColumnVisible("Action") && (
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
                    <TableCell className="rowtext">{item.site_title}</TableCell>
                    <TableCell className="rowtext">
                      {item.common_document_name}
                    </TableCell>
                    <TableCell className="rowtext">
                      <div className="flex gap-2 mt-1">
                        <Badge variant="light" color="error">
                          <MdDelete
                            className="text-2xl cursor-pointer"
                            onClick={() => handleDelete(item.id)}
                          />
                        </Badge>
                        <Badge variant="light">
                          <FaRegEye
                            className="text-2xl cursor-pointer"
                            onClick={() =>
                              handleView(item.common_document_file)
                            }
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
