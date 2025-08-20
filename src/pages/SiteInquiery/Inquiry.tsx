import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableRow,
} from "../../components/ui/table";
import { MdEmail } from "react-icons/md";
import Tooltip from "@mui/material/Tooltip";
import Badge from "../../components/ui/badge/Badge";
import { MdFileDownload } from "react-icons/md";
import TablePagination from "@mui/material/TablePagination";
import { useState } from "react";
import {
  TextField,
  Button,
  Select,
  MenuItem,
  InputLabel,
  FormControl,
  Checkbox,
  ListItemText,
  IconButton,
} from "@mui/material";
// import DownloadIcon from "@mui/icons-material/Download";

interface Inquiry {
  id: number;
  siteName: string;
  name: string;
  contactNumber: string;
  email: string;
  numberOfInquiry: number;
  inquiryThrough: string;
  remark: string;
  inquiryDate: string;
}
const tableData: Inquiry[] = [
  {
    id: 1,
    siteName: "Green Acres",
    name: "Ramesh Patel",
    contactNumber: "9876543210",
    email: "ramesh@example.com",
    numberOfInquiry: 3,
    inquiryThrough: "Facebook",
    remark: "Interested in 2BHK",
    inquiryDate: "2024-08-07",
  },
  {
    id: 2,
    siteName: "Skyline Residency",
    name: "Sunita Sharma",
    contactNumber: "9876501234",
    email: "sunita@example.com",
    numberOfInquiry: 1,
    inquiryThrough: "Walk-in",
    remark: "Asked for brochure",
    inquiryDate: "2024-08-06",
  },
];

export default function Inquiry() {
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [search, setSearch] = useState("");
  const [siteFilter, setSiteFilter] = useState("");
  const [dateFilter, setDateFilter] = useState("");
  const [selectedColumns, setSelectedColumns] = useState<string[]>([]);
  const [copiedEmailId, setCopiedEmailId] = useState<number | null>(null);
  const [inquiryThroughFilter, setInquiryThroughFilter] = useState("");
  const handleChangePage = (_: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const isColumnVisible = (column: string) =>
    selectedColumns.length === 0 || selectedColumns.includes(column);

  // const filteredData = tableData.filter((item) => {
  //   const searchTerm = search.trim().toLowerCase();
  //   const matchesSearch = Object.values(item)
  //     .map((val) => String(val).trim().toLowerCase())
  //     .join(" ")
  //     .includes(searchTerm);
  //   const matchesSite = siteFilter
  //     ? item.siteName.trim() === siteFilter.trim()
  //     : true;
  //   return matchesSearch && matchesSite;
  // });
  const filteredData = tableData.filter((item) => {
    const searchTerm = search.trim().toLowerCase();
    const matchesSearch = Object.values(item)
      .map((val) => String(val).trim().toLowerCase())
      .join(" ")
      .includes(searchTerm);

    const matchesSite = siteFilter
      ? item.siteName.trim() === siteFilter.trim()
      : true;

    const matchesDate = dateFilter
      ? (() => {
          const today = new Date();
          const filterDays = parseInt(dateFilter, 10);
          const cutoffDate = new Date(today);
          cutoffDate.setDate(today.getDate() - filterDays);

          const itemDate = new Date(item.receivedDate);
          return itemDate >= cutoffDate && itemDate <= today;
        })()
      : true;
const matchesInquiryThrough = inquiryThroughFilter
  ? item.inquiryThrough.trim() === inquiryThroughFilter.trim()
  : true;
   return matchesSearch && matchesSite && matchesDate && matchesInquiryThrough;
  });

  const paginatedData = filteredData.slice(
    page * rowsPerPage,
    page * rowsPerPage + rowsPerPage
  );

  const uniqueSites = [...new Set(tableData.map((item) => item.siteName))];

  return (
    <div className="font-poppins text-gray-800 dark:text-white">
      <h3 className="text-lg font-semibold mb-5">Site Inquiry</h3>

      <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white dark:bg-white/[0.03] px-4 pb-3 pt-4 sm:px-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
          {/* Left Column */}
          <div className="flex flex-wrap gap-2 items-center">
            <Button
              size="small"
              variant="contained"
              className="!bg-green-600 hover:!bg-green-700 text-white"
            >
              Copy
            </Button>
          {/*   <Button
              size="small"
              variant="contained"
              className="!bg-blue-600 hover:!bg-blue-700 text-white"
            >
              CSV
            </Button> 
            <Button
              size="small"
              variant="contained"
              className="!bg-amber-500 hover:!bg-amber-600 text-white"
            >
              Print
            </Button>
*/}
            {/* Select Columns Dropdown */}

            <FormControl size="small" sx={{ minWidth: 200 }}>
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
                  "name",
                  "contactNumber",
                  "email",
                  "numberOfInquiry",
                  "inquiryThrough",
                  "remark",
                  "inquiryDate",
                ].map((col) => (
                  <MenuItem key={col} value={col}>
                    <Checkbox checked={selectedColumns.includes(col)} />
                    <ListItemText
                      primary={
                        {
                          siteName: "Site Name",
                          name: "Name",
                          contactNumber: "Contact Number",
                          email: "Email",
                          numberOfInquiry: "Number of Inquiry",
                          inquiryThrough: "Inquiry Through",
                          remark: "Remark",
                          inquiryDate: "Inquiry Date",
                        }[col]
                      }
                    />
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            <FormControl size="small" sx={{ minWidth: 150 }}>
              <InputLabel>Filter by Date</InputLabel>
              <Select
                value={dateFilter}
                onChange={(e) => setDateFilter(e.target.value)}
                label="Filter by Date"
                MenuProps={{
                  PaperProps: {
                    sx: { fontFamily: "Poppins", fontSize: "14px" },
                  },
                }}
              >
                <MenuItem value="">All Dates</MenuItem>
                <MenuItem value="3">Last 3 Days</MenuItem>
                <MenuItem value="7">Last 7 Days</MenuItem>
                <MenuItem value="30">Last Month</MenuItem>
              </Select>
            </FormControl>
           
          </div>

          {/* Right Column */}
          <div className="flex flex-wrap gap-2 justify-start sm:justify-end items-center">
            {/* Filter by Site */}

            <FormControl size="small" sx={{ minWidth: 150 }}>
              <InputLabel>Filter by Site</InputLabel>
              <Select
                value={siteFilter}
                onChange={(e) => setSiteFilter(e.target.value)}
                label="Filter by Site"
                MenuProps={{
                  PaperProps: {
                    sx: { fontFamily: "Poppins", fontSize: "14px" },
                  },
                }}
              >
                <MenuItem value="">All Sites</MenuItem>
                {uniqueSites.map((site) => (
                  <MenuItem key={site} value={site}>
                    {site}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            {/* Search */}
            <TextField
              size="small"
              placeholder="Search..."
              value={search}
              onChange={(e) => setSearch(e.target.value.trimStart())}
            />
             <FormControl size="small" sx={{ minWidth: 160 }}>
              <InputLabel>Filter by Inquiry Type</InputLabel>
              <Select
                value={inquiryThroughFilter}
                onChange={(e) => setInquiryThroughFilter(e.target.value)}
                label="Filter by Inquiry Through"
                MenuProps={{
                  PaperProps: {
                    sx: { fontFamily: "Poppins", fontSize: "14px" },
                  },
                }}
              >
                <MenuItem value="">All Types</MenuItem>
                <MenuItem value="Walk-in">Walk-in</MenuItem>
                <MenuItem value="WhatsApp Marketing">
                  WhatsApp Marketing
                </MenuItem>
                <MenuItem value="MagicBricks">MagicBricks</MenuItem>
                <MenuItem value="Facebook">Facebook</MenuItem>
                <MenuItem value="Hoarding">Hoarding</MenuItem>
              </Select>
            </FormControl>
            {/* <Button
              size="small"
              variant="contained"
              className="!bg-indigo-700 hover:!bg-indigo-900 text-white p-3 h-10"
              // onClick={() => setAddOpen(true)}
            >
              + Add
            </Button> */}
          </div>
        </div>

        {/* Table */}
        <div className="max-w-full overflow-x-auto mt-8">
          <Table>
            {/* <TableHeader>
              <TableRow>
                <TableCell className="columtext">Sr. No</TableCell>
                {isColumnVisible("clientName") && (
                  <TableCell className="columtext">Client Name</TableCell>
                )}
                {isColumnVisible("siteName") && (
                  <TableCell className="columtext">Site Name</TableCell>
                )}
                {isColumnVisible("unitNo") && (
                  <TableCell className="columtext">Unit Number</TableCell>
                )}
                {isColumnVisible("propertyAmount") && (
                  <TableCell className="columtext">Property Amount</TableCell>
                )}
                {isColumnVisible("gstAmount") && (
                  <TableCell className="columtext">GST Amount</TableCell>
                )}
                {isColumnVisible("receivedDate") && (
                  <TableCell className="columtext">Received Date</TableCell>
                )}
                {isColumnVisible("receivedAmountType") && (
                  <TableCell className="columtext">
                    Received Amount Type
                  </TableCell>
                )}
                {isColumnVisible("receivedAmount") && (
                  <TableCell className="columtext">Received Amount</TableCell>
                )}
                {isColumnVisible("receiptUrl") && (
                  <TableCell className="columtext">Receipt</TableCell>
                )}
              </TableRow>
            </TableHeader> */}
            <TableHeader>
              <TableRow>
                <TableCell className="columtext">Sr. No</TableCell>
                {isColumnVisible("siteName") && (
                  <TableCell className="columtext">Site Name</TableCell>
                )}
                {isColumnVisible("name") && (
                  <TableCell className="columtext">Name</TableCell>
                )}
                {isColumnVisible("contactNumber") && (
                  <TableCell className="columtext">Contact Number</TableCell>
                )}
                {isColumnVisible("email") && (
                  <TableCell className="columtext">Email</TableCell>
                )}
                {isColumnVisible("numberOfInquiry") && (
                  <TableCell className="columtext">Number of Inquiry</TableCell>
                )}
                {isColumnVisible("inquiryThrough") && (
                  <TableCell className="columtext">Inquiry Through</TableCell>
                )}
                {isColumnVisible("remark") && (
                  <TableCell className="columtext">Remark</TableCell>
                )}
                {isColumnVisible("inquiryDate") && (
                  <TableCell className="columtext">Inquiry Date</TableCell>
                )}
              </TableRow>
            </TableHeader>

            <TableBody>
              {paginatedData.length > 0 ? (
                paginatedData.map((item, index) => (
                  <TableRow key={item.id}>
                    <TableCell className="rowtext">
                      {page * rowsPerPage + index + 1}
                    </TableCell>
                    {isColumnVisible("siteName") && (
                      <TableCell className="rowtext">{item.siteName}</TableCell>
                    )}
                    {isColumnVisible("name") && (
                      <TableCell className="rowtext">{item.name}</TableCell>
                    )}
                    {isColumnVisible("contactNumber") && (
                      <TableCell className="rowtext">
                        {item.contactNumber}
                      </TableCell>
                    )}
                    {isColumnVisible("email") && (
                      <TableCell className="rowtext">
                        <Tooltip
                        
                          title={`Copy Email: ${item.email}`}
                          arrow
                          placement="top"
                        >
                          <IconButton
                            onClick={() => {
                              navigator.clipboard.writeText(item.email);
                            }}
                          >
                            <MdEmail className="text-indigo-600" />
                          </IconButton>
                        </Tooltip>
                      </TableCell>
                    )}

                    {isColumnVisible("numberOfInquiry") && (
                      <TableCell className="rowtext">
                        {item.numberOfInquiry}
                      </TableCell>
                    )}
                    {isColumnVisible("inquiryThrough") && (
                      <TableCell className="rowtext">
                        {item.inquiryThrough}
                      </TableCell>
                    )}
                    {isColumnVisible("remark") && (
                      <TableCell className="rowtext">{item.remark}</TableCell>
                    )}
                    {isColumnVisible("inquiryDate") && (
                      <TableCell className="rowtext">
                        {item.inquiryDate}
                      </TableCell>
                    )}
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={9} className="text-center py-4 rowtext ">
                    No data available
                  </TableCell>
                </TableRow>
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
          />
        </div>
      </div>
    </div>
  );
}
