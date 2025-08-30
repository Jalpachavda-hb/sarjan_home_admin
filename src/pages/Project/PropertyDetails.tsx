  // import {
  //   Table,
  //   TableBody,
  //   TableCell,
  //   TableHeader,
  //   TableRow,
  // } from "../../components/ui/table";
  // import Badge from "../../components/ui/badge/Badge";
  // import TablePagination from "@mui/material/TablePagination";
  // import { FaPlus } from "react-icons/fa6";
  // import { useState, useMemo, useEffect } from "react";
  // import { MdDelete } from "react-icons/md";
  // import { FaEdit } from "react-icons/fa";
  // import { showPropertyDetailsList } from "../../utils/Handlerfunctions/getdata";
  // import {
  //   TextField,
  //   Button,
  //   Select,
  //   MenuItem,
  //   Checkbox,
  //   ListItemText,
  //   FormControl,
  // } from "@mui/material";

  // interface PropertyDetailsType {
  //   id: number;
  //   siteName: string;
  //   unit: string;
  //   unitNumber: string;
  // }

  // export default function PropertyDetails() {
  //   const [page, setPage] = useState(0);
  //   const [tableData, setTableData] = useState<PropertyDetailsType[]>([]);
  //   const [loading, setLoading] = useState(true);

  //   const [rowsPerPage, setRowsPerPage] = useState(5);
  //   const [selectedColumns, setSelectedColumns] = useState<string[]>([]);
  //   const [search, setSearch] = useState("");
  //   const handleChangePage = (_: unknown, newPage: number) => setPage(newPage);
  //   const handleChangeRowsPerPage = (
  //     event: React.ChangeEvent<HTMLInputElement>
  //   ) => {
  //     setRowsPerPage(parseInt(event.target.value, 10));
  //     setPage(0);
  //   };

  //   const isColumnVisible = (column: string) =>
  //     selectedColumns.length === 0 || selectedColumns.includes(column);
  //   const filteredData = useMemo(() => {
  //     let data = [...tableData];

  //     if (search && search.trim() !== "") {
  //       const searchTerm = search.trim().toLowerCase(); // Trim spaces before/after
  //       data = data.filter((item) =>
  //         Object.values(item).some((val) =>
  //           String(val).toLowerCase().includes(searchTerm)
  //         )
  //       );
  //     }

  //     return data;
  //   }, [search, tableData]);

  // useEffect(() => {
  //   const fetchData = async () => {
  //     setLoading(true);
  //     try {
  //       const data = await showPropertyDetailsList(); // ✅ no params
  //     setTableData(data || []);
  //     } catch (err) {
  //       console.error("Error fetching property details:", err);
  //     } finally {
  //       setLoading(false);
  //     }
  //   };

  //   fetchData();
  // }, []);
  //   const paginatedData = useMemo(
  //     () =>
  //       filteredData.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage),
  //     [filteredData, page, rowsPerPage]
  //   );

  //   return (
  //     <div className="font-poppins text-gray-800 dark:text-white">
  //       <h3 className="text-lg font-semibold mb-5">Property Details</h3>

  //       <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white dark:bg-white/[0.03] px-4 pb-3 pt-4 sm:px-6">
  //         {/* Controls */}
  //         <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
  //           <div className="flex flex-wrap gap-2 items-center">
  //             <Button
  //               size="small"
  //               variant="contained"
  //               className="!bg-blue-600 hover:!bg-blue-700 text-white"
  //             >
  //               Upload CSV
  //             </Button>
  //             {/* Column selector */}
  //             <FormControl size="small" sx={{ minWidth: 200 }}>
  //               <Select
  //                 multiple
  //                 value={selectedColumns}
  //                 onChange={(e) => {
  //                   const value = e.target.value;
  //                   setSelectedColumns(
  //                     typeof value === "string" ? value.split(",") : value
  //                   );
  //                 }}
  //                 displayEmpty
  //                 renderValue={() => "Select Columns"}
  //                 className="bg-white dark:bg-gray-200 rounded-md"
  //                 sx={{
  //                   fontFamily: "Poppins",
  //                   "& .MuiSelect-select": { color: "#6B7280", fontWeight: 300 },
  //                 }}
  //               >
  //                 {[
  //                   { key: "siteName", label: "Site Name" },
  //                   { key: "unit", label: "Unit" },
  //                   { key: "unitNumber", label: "Unit Number" },
  //                   { key: "Action", label: "Action" },
  //                 ].map((col) => (
  //                   <MenuItem
  //                     key={col.key}
  //                     value={col.key}
  //                     sx={{ fontFamily: "Poppins" }}
  //                   >
  //                     <Checkbox checked={selectedColumns.includes(col.key)} />
  //                     <ListItemText primary={col.label} />
  //                   </MenuItem>
  //                 ))}
  //               </Select>
  //             </FormControl>
  //           </div>
  //           {/* Search & Add */}
  //           <div className="flex flex-wrap gap-2 justify-start sm:justify-end items-center">
  //             <TextField
  //               size="small"
  //               variant="outlined"
  //               placeholder="Search..."
  //               value={search}
  //               onChange={(e) => setSearch(e.target.value.trimStart())}
  //               sx={{ fontFamily: "Poppins" }}
  //               InputProps={{ sx: { fontFamily: "Poppins", fontSize: "14px" } }}
  //             />
  //             <a
  //               href="add_property"
  //               className="text-blue-500 hover:text-blue-700"
  //             >
  //               <Button
  //                 size="small"
  //                 variant="contained"
  //                 className="!bg-indigo-700 hover:!bg-indigo-900 text-white"
  //               >
  //                 <FaPlus /> Add Property
  //               </Button>
  //             </a>
  //           </div>
  //         </div>

  //         {/* Table */}
  //         <div className="max-w-full overflow-x-auto mt-8">
  //           <Table>
  //             <TableHeader>
  //               <TableRow>
  //                 <TableCell className="columtext">Sr. No</TableCell>
  //                 {isColumnVisible("siteName") && (
  //                   <TableCell className="columtext">Site Name</TableCell>
  //                 )}
  //                 {isColumnVisible("unit") && (
  //                   <TableCell className="columtext">Unit</TableCell>
  //                 )}
  //                 {isColumnVisible("unitNumber") && (
  //                   <TableCell className="columtext">Unit Number</TableCell>
  //                 )}
  //                 {isColumnVisible("Action") && (
  //                   <TableCell className="columtext">Action</TableCell>
  //                 )}
  //               </TableRow>
  //             </TableHeader>

  //             <TableBody>
  //               {loading ? (
  //                 <TableRow>
  //                   <TableCell colSpan={5} className="py-12 text-center">
  //                     Loading...
  //                   </TableCell>
  //                 </TableRow>
  //               ) : paginatedData.length === 0 ? (
  //                 <TableRow>
  //                   <TableCell
  //                     colSpan={5}
  //                     className="py-12 text-center text-gray-500"
  //                   >
  //                     No data available
  //                   </TableCell>
  //                 </TableRow>
  //               ) : (
  //                 paginatedData.map((item, index) => (
  //                   <TableRow key={item.id}>
  //                     <TableCell className="rowtext">
  //                       {page * rowsPerPage + index + 1}
  //                     </TableCell>
  //                     {isColumnVisible("siteName") && (
  //                       <TableCell className="rowtext">{item.title}</TableCell>
  //                     )}
  //                     {isColumnVisible("unit") && (
  //                       <TableCell className="rowtext">{item.block}</TableCell>
  //                     )}
  //                     {isColumnVisible("unitNumber") && (
  //                       <TableCell className="rowtext">
  //                         {item.block_number}
  //                       </TableCell>
  //                     )}
  //                     {isColumnVisible("Action") && (
  //                       <TableCell className="rowtext">
  //                         <div className="flex gap-2 mt-1">
  //                           <Badge variant="light" color="error">
  //                             <MdDelete className="text-2xl cursor-pointer" />
  //                           </Badge>
  //                           <Badge variant="light">
  //                             <FaEdit className="text-2xl cursor-pointer" />
  //                           </Badge>
  //                         </div>
  //                       </TableCell>
  //                     )}
  //                   </TableRow>
  //                 ))
  //               )}
  //             </TableBody>
  //           </Table>
  //         </div>
  //         {/* Pagination */}
  //         <div className="mt-4 flex justify-between items-center w-full">
  //           <p className="text-sm">
  //             Showing {filteredData.length === 0 ? 0 : page * rowsPerPage + 1}–
  //             {Math.min((page + 1) * rowsPerPage, filteredData.length)} of{" "}
  //             {filteredData.length} entries
  //           </p>
  //           <TablePagination
  //             component="div"
  //             count={filteredData.length}
  //             page={page}
  //             onPageChange={handleChangePage}
  //             rowsPerPage={rowsPerPage}
  //             onRowsPerPageChange={handleChangeRowsPerPage}
  //             rowsPerPageOptions={[5, 10, 25]}
  //             labelRowsPerPage="Rows per page:"
  //             sx={{
  //               color: "inherit", 
  //               ".MuiSelect-select": {
  //                 color: "inherit",
  //                 backgroundColor: "transparent",
  //               },
  //               ".MuiTablePagination-selectLabel, .MuiTablePagination-displayedRows":
  //                 { color: "inherit" },
  //               ".MuiSvgIcon-root": { color: "inherit" },
  //             }}
  //           />
  //         </div>
  //       </div>
  //     </div>
  //   );
  // }

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
import { MdDelete } from "react-icons/md";
import { FaEdit } from "react-icons/fa";
import { showPropertyDetailsList } from "../../utils/Handlerfunctions/getdata";
import {
  TextField,
  Button,
  Select,
  MenuItem,
  Checkbox,
  ListItemText,
  FormControl,
} from "@mui/material";

interface PropertyDetailsType {
  id: number;
  siteName: string;
  unit: string;
  unitNumber: string;
}

export default function PropertyDetails() {
  const [page, setPage] = useState(0);
  const [tableData, setTableData] = useState<PropertyDetailsType[]>([]);
  const [loading, setLoading] = useState(true);

  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [selectedColumns, setSelectedColumns] = useState<string[]>([]);
  const [search, setSearch] = useState("");

  const handleChangePage = (_: unknown, newPage: number) => setPage(newPage);
  const handleChangeRowsPerPage = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const isColumnVisible = (column: string) =>
    selectedColumns.length === 0 || selectedColumns.includes(column);

  const filteredData = useMemo(() => {
    let data = [...tableData];
    if (search && search.trim() !== "") {
      const searchTerm = search.trim().toLowerCase();
      data = data.filter((item) =>
        Object.values(item).some((val) =>
          String(val).toLowerCase().includes(searchTerm)
        )
      );
    }
    return data;
  }, [search, tableData]);

useEffect(() => {
  const fetchData = async () => {
    setLoading(true);
    try {
      const res = await showPropertyDetailsList(); // already mapped
      setTableData(res || []); // ✅ don't re-map
    } catch (err) {
      console.error("Error fetching property details:", err);
    } finally {
      setLoading(false);
    }
  };

  fetchData();
}, []);

  const paginatedData = useMemo(
    () =>
      filteredData.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage),
    [filteredData, page, rowsPerPage]
  );

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
                  <MenuItem key={col.key} value={col.key} sx={{ fontFamily: "Poppins" }}>
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
            <a href="add_property" className="text-blue-500 hover:text-blue-700">
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
              ) : paginatedData.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} className="py-12 text-center text-gray-500">
                    No data available
                  </TableCell>
                </TableRow>
              ) : (
                paginatedData.map((item, index) => (
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
                      <TableCell className="rowtext">{item.unitNumber}</TableCell>
                    )}
                    {isColumnVisible("Action") && (
                      <TableCell className="rowtext">
                        <div className="flex gap-2 mt-1">
                          <Badge variant="light" color="error">
                            <MdDelete className="text-2xl cursor-pointer" />
                          </Badge>
                          <Badge variant="light">
                            <FaEdit className="text-2xl cursor-pointer" />
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
            labelRowsPerPage="Rows per page:"
            sx={{
              color: "inherit",
              ".MuiSelect-select": { color: "inherit", backgroundColor: "transparent" },
              ".MuiTablePagination-selectLabel, .MuiTablePagination-displayedRows": {
                color: "inherit",
              },
              ".MuiSvgIcon-root": { color: "inherit" },
            }}
          />
        </div>
      </div>
    </div>
  );
}
