// import {
//   Table,
//   TableBody,
//   TableCell,
//   TableHeader,
//   TableRow,
// } from "../components/ui/table";
// import { fetchAdminLogs } from "../utils/Handlerfunctions/getdata";
// import TablePagination from "@mui/material/TablePagination";
// import { useState, useMemo, useEffect } from "react";

// import { TextField } from "@mui/material";

// interface Log {
//   id: number;
//   user_id: string;
//   user_name: string;
//   operation: string;
//   descr: string;
//   created_at: string;
// }
// const tableData: Aprovel[] = [
//   {
//     id: 1,
//     opration: "Delete",
//     Description: "Green Acres",
//     date: "12-03-2012",
//   },
//   {
//     id: 2,
//     opration: "Delete",
//     Description: "Skyline Residency",
//     date: "12-03-2012",
//   },
//   {
//     id: 3,
//     opration: "Delete",
//     Description: "Sunshine Valley",
//     date: "12-03-2012",
//   },
//   {
//     id: 4,
//     opration: "Delete",
//     date: "12-03-2012",
//     Description: "Emerald Heights",
//   },
//   {
//     id: 5,
//     opration: "Delete",
//     Description: "Harmony Homes",
//     date: "12-03-2012",
//   },
//   {
//     id: 6,
//     opration: "Delete",
//     Description: "Silver Estate",
//     date: "12-03-2012",
//   },
//   {
//     id: 7,
//     opration: "Delete",
//     Description: "Golden Villa",
//     date: "12-03-2012",
//   },
// ];
// export default function UserLog() {
//   const [page, setPage] = useState(0);
//   const [logs, setLogs] = useState<Log[]>([]);
//   const [rowsPerPage, setRowsPerPage] = useState(5);
//   const [selectedColumns, setSelectedColumns] = useState<string[]>([]);

//   const [search, setSearch] = useState("");
//   // const [siteFilter, setSiteFilter] = useState("");

//   //  useEffect(() => {
//   //     fetchAdminLogs(page, 12).then((res) => {
//   //       setLogs(res.data);
//   //       setPagination(res.pagination);
//   //     });
//   //   }, [page]);

//   useEffect(() => {
//     const loadLogs = async () => {
//       try {
//         const res = await fetchAdminLogs(); // no page/perPage
//         setLogs(res.data); // directly set logs
//       } catch (err) {
//         console.error("Failed to fetch logs", err);
//       }
//     };

//     loadLogs();
//   }, []);

//   const handleChangePage = (_: unknown, newPage: number) => {
//     setPage(newPage);
//   };

//   const isColumnVisible = (column: string) =>
//     selectedColumns.length === 0 || selectedColumns.includes(column);

//   const handleChangeRowsPerPage = (
//     event: React.ChangeEvent<HTMLInputElement>
//   ) => {
//     setRowsPerPage(parseInt(event.target.value, 10));
//     setPage(0);
//   };

//   const filteredData = useMemo(() => {
//     let data = [...tableData];

//     const searchTerm = search.trim().toLowerCase(); // 🔹 Trim spaces

//     if (searchTerm) {
//       data = data.filter((item) =>
//         Object.values(item).some((val) =>
//           String(val).toLowerCase().includes(searchTerm)
//         )
//       );
//     }

//     return data;
//   }, [search]);

//   const paginatedData = useMemo(() => {
//     return filteredData.slice(
//       page * rowsPerPage,
//       page * rowsPerPage + rowsPerPage
//     );
//   }, [filteredData, page, rowsPerPage]);

//   // const uniqueSites = [...new Set(tableData.map((item) => item.siteName))];

//   return (
//     <div className="font-poppins text-gray-800 dark:text-white">
//       <h3 className="text-lg font-semibold mb-5">User Log</h3>

//       <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white dark:bg-white/[0.03] px-4 pb-3 pt-4 sm:px-6">
//         <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
//           <div className="flex flex-wrap gap-2 items-center">
//             {/* <Button
//               size="small"
//               variant="contained"
//               className="!bg-green-600 hover:!bg-green-700 text-white"
//             >
//               Copy
//             </Button>
//             <Button
//               size="small"
//               variant="contained"
//               className="!bg-blue-600 hover:!bg-blue-700 text-white"
//             >
//               CSV
//             </Button> */}
//             {/* <Button
//               size="small"
//               variant="contained"
//               className="!bg-amber-500 hover:!bg-amber-600 text-white"
//             >
//               Print
//             </Button> */}

//             {/* Select Columns Dropdown */}
//             {/* <FormControl size="small" sx={{ minWidth: 200 }}>
//               <InputLabel
//                 className="text-gray-700 dark:text-white"
//                 sx={{ fontFamily: "Poppins" }}
//               ></InputLabel>
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
//                   "& .MuiSelect-select": {
//                     color: "#6B7280",
//                     fontWeight: 300,
//                   },
//                 }}
//                 MenuProps={{
//                   PaperProps: {
//                     sx: { maxHeight: 300, fontFamily: "Poppins" },
//                   },
//                 }}
//               >
//                 {[
//                   "siteName",
//                   "clientName",
//                   "contactNumber",
//                   "Email",
//                   "blocknumber",
//                   "blocknumberType",
//                   "receivedDate",
//                 ].map((col) => (
//                   <MenuItem
//                     key={col}
//                     value={col}
//                     sx={{ fontFamily: "Poppins" }}
//                   >
//                     <Checkbox checked={selectedColumns.includes(col)} />
//                     <ListItemText
//                       primary={
//                         {
//                           clientName: "Client Name",
//                           siteName: "Site Name",
//                           contactNumber: "contactNumber",
//                           Email: "Unit No.",
//                           blocknumber: "Received blocknumber",
//                           blocknumberType: "blocknumber Type",
//                           receivedDate: "Received Date",
//                         }[col]
//                       }
//                     />
//                   </MenuItem>
//                 ))}
//               </Select>
//             </FormControl> */}
//           </div>

//           {/* Right Column */}
//           <div className="flex flex-wrap gap-2 justify-start sm:justify-end items-center">
//             {/* Filter by Site Dropdown */}

//             {/* <FormControl size="small" sx={{ minWidth: 150 }}>
//               <InputLabel
//                 className="text-gray-500 dark:text-white"
//                 sx={{ fontFamily: "Poppins" }}
//               >
//                 Filter by Site
//               </InputLabel>
//               <Select
//                 value={siteFilter}
//                 label="Filter by Site"
//                 onChange={(e) => setSiteFilter(e.target.value)}
//                 sx={{ fontFamily: "Poppins" }}
//                 MenuProps={{
//                   PaperProps: {
//                     sx: { fontFamily: "Poppins", fontSize: "14px" },
//                   },
//                 }}
//               >
//                 <MenuItem value="">All Sites</MenuItem>
//                 {uniqueSites.map((site) => (
//                   <MenuItem
//                     key={site}
//                     value={site}
//                     sx={{ fontFamily: "Poppins", fontSize: "14px" }}
//                   >
//                     {site}
//                   </MenuItem>
//                 ))}
//               </Select>
//             </FormControl> */}

//             {/* Search Input */}

//             <TextField
//               size="small"
//               variant="outlined"
//               placeholder="Search..."
//               value={search}
//               onChange={(e) => setSearch(e.target.value.trimStart())}
//               sx={{ fontFamily: "Poppins" }}
//               InputProps={{ sx: { fontFamily: "Poppins", fontSize: "14px" } }}
//             />
//           </div>
//         </div>

//         <div className="max-w-full overflow-x-auto mt-8">
//           <Table>
//             <TableHeader>
//               <TableRow>
//                 <TableCell className="columtext">Sr. No</TableCell>

//                 {isColumnVisible("opration") && (
//                   <TableCell className="columtext">Opration</TableCell>
//                 )}

//                 {isColumnVisible("Description") && (
//                   <TableCell className="columtext">Description</TableCell>
//                 )}
//                 {isColumnVisible("date") && (
//                   <TableCell className="columtext">Date</TableCell>
//                 )}
//               </TableRow>
//             </TableHeader>

//             <TableBody>
//               {paginatedData.length === 0 ? (
//                 <TableRow>
//                   <TableCell
//                     // colSpan={}
//                     className="justify-between py-12 text-gray-500  "
//                     // style={{ fontSize: "16px" }}
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

//                     {isColumnVisible("operation") && (
//                       <TableCell className="rowtext">{logs.operation}</TableCell>
//                     )}

//                     {isColumnVisible("Description") && (
//                       <TableCell className="rowtext">
//                         {item.Description}
//                       </TableCell>
//                     )}

//                     {isColumnVisible("date") && (
//                       <TableCell className="rowtext">{item.date}</TableCell>
//                     )}
//                   </TableRow>
//                 ))
//               )}
//             </TableBody>
//           </Table>
//         </div>

//         <div className="mt-4 flex justify-between items-center w-full">
//           <div className="w-1/2">
//             <p className="text-sm">
//               Showing {filteredData.length === 0 ? 0 : page * rowsPerPage + 1}–
//               {Math.min((page + 1) * rowsPerPage, filteredData.length)} of{" "}
//               {filteredData.length} entries
//             </p>
//           </div>

//           <div className="w-1/2 flex justify-end">
//             <TablePagination
//               component="div"
//               count={filteredData.length}
//               page={page}
//               onPageChange={handleChangePage}
//               rowsPerPage={rowsPerPage}
//               onRowsPerPageChange={handleChangeRowsPerPage}
//               rowsPerPageOptions={[5, 10, 25]}
//               labelRowsPerPage="Rows per page:"
//               sx={{
//                 color: "inherit",
//                 ".MuiSelect-select": {
//                   color: "inherit",
//                   backgroundColor: "transparent",
//                 },
//                 ".MuiTablePagination-selectLabel, .MuiTablePagination-displayedRows":
//                   {
//                     color: "inherit",
//                   },
//                 ".MuiSvgIcon-root": {
//                   color: "inherit",
//                 },
//               }}
//             />
//           </div>
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
} from "../components/ui/table";
import { fetchAdminLogs } from "../utils/Handlerfunctions/getdata";
import TablePagination from "@mui/material/TablePagination";
import { useState, useMemo, useEffect } from "react";
import { TextField } from "@mui/material";

interface Log {
  id: number;
  user_id: string;
  user_name: string;
  operation: string;
  descr: string;
  created_at: string;
}

export default function UserLog() {
  const [page, setPage] = useState(0);
  const [logs, setLogs] = useState<Log[]>([]);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [selectedColumns, setSelectedColumns] = useState<string[]>([]);
  const [search, setSearch] = useState("");
  // const [siteFilter, setSiteFilter] = useState("");

  // 🔹 Fetch logs from API (without pagination API side)
  useEffect(() => {
  fetchAdminLogs().then((res) => {
    // map through logs to extract only date
    const updatedLogs = res.data.map((log: any) => ({
      ...log,
      created_at: log.created_at.split(" ")[0], // take only date part
    }));

    setLogs(updatedLogs);
  });
}, []);

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

  // 🔹 Filter logs (searching across all fields)
  const filteredData = useMemo(() => {
    let data = [...logs];

    const searchTerm = search.trim().toLowerCase();

    if (searchTerm) {
      data = data.filter((item) =>
        Object.values(item).some((val) =>
          String(val).toLowerCase().includes(searchTerm)
        )
      );
    }

    return data;
  }, [logs, search]);

  // 🔹 Slice logs for pagination
  const paginatedData = useMemo(() => {
    return filteredData.slice(
      page * rowsPerPage,
      page * rowsPerPage + rowsPerPage
    );
  }, [filteredData, page, rowsPerPage]);

  // const uniqueSites = [...new Set(tableData.map((item) => item.siteName))];

  return (
    <div className="font-poppins text-gray-800 dark:text-white">
      <h3 className="text-lg font-semibold mb-5">User Log</h3>

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

                {isColumnVisible("operation") && (
                  <TableCell className="columtext">Operation</TableCell>
                )}

                {isColumnVisible("descr") && (
                  <TableCell className="columtext">Description</TableCell>
                )}

                {isColumnVisible("created_at") && (
                  <TableCell className="columtext">Date</TableCell>
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

                    {isColumnVisible("operation") && (
                      <TableCell className="rowtext">{item.operation}</TableCell>
                    )}

                    {isColumnVisible("descr") && (
                      <TableCell className="rowtext">{item.descr}</TableCell>
                    )}

                    {isColumnVisible("created_at") && (
                      <TableCell className="rowtext">
                        {item.created_at}
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