import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableRow,
} from "../../components/ui/table";
import { MdEmail } from "react-icons/md";

import {
  fetchSiteInquiry,
  fetchInquiryThrough,
} from "../../utils/Handlerfunctions/getdata";
import Tooltip from "@mui/material/Tooltip";
import TablePagination from "@mui/material/TablePagination";
import { useState, useEffect } from "react";
import SiteFilter from "../../components/form/input/FilterbySite";
import {
  TextField,
  Button,
  Select,
  MenuItem,
  InputLabel,
  FormControl,
  IconButton,
  Checkbox,
  ListItemText,
} from "@mui/material";
import { copyTableData } from "../../utils/copy";
import {printTableData} from "../../utils/printTableData"
interface Inquiry {
  id: number;
  siteName: string; // lowercase `siteName`
  name: string; // lowercase `name`
  contactNumber: string; // lowercase `contactNumber`
  email: string; // lowercase `email`
  numberOfInquiry: number; // lowercase `numberOfInquiry`
  inquiryThrough: string[]; // lowercase `inquiryThrough`
  remark: string; // lowercase `remark`
  inquiryDate: string; // lowercase `inquiryDate`
}
interface InquiryThroughCard {
  inquiry_through: string;
  count: number;
}

export default function Inquiry() {
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [search, setSearch] = useState("");
  const [siteFilter, setSiteFilter] = useState("");
  const [selectedColumns, setSelectedColumns] = useState<string[]>([]);
  const [inquiryThroughFilter, setInquiryThroughFilter] = useState("");
  const [dateFilter, setDateFilter] = useState<number>(0);
  const [inquiries, setInquiries] = useState<Inquiry[]>([]);

  const [inquiryThroughCards, setInquiryThroughCards] = useState<
    InquiryThroughCard[]
  >([]);
  const [inquiryThroughChoices, setInquiryThroughChoices] = useState<string[]>(
    []
  );

  // --- Helpers ---
  const normalizeCardLabel = (s: string | null | undefined): string => {
    if (!s) return "Not Selected";
    const t = s.trim();
    if (!t || t === "-" || t.toLowerCase() === "null") return "Not Selected";
    return t;
  };

  // robustly extract channel names from strings like
  // "X on 2025-04-16 Y on 2025-04-16 Z on 2025-04-16"
  const normalizeInquiryThrough = (
    raw: string | null | undefined
  ): string[] => {
    if (!raw) return ["Not Selected"];
    const s = raw.trim();
    if (!s || s === "-" || s.toLowerCase() === "null") return ["Not Selected"];

    // capture "Channel Name" before " on YYYY-MM-DD"
    const re = /(.+?)(?:\s+on\s+\d{4}-\d{2}-\d{2})/g;
    const found: string[] = [];
    let m: RegExpExecArray | null;
    while ((m = re.exec(s)) !== null) {
      const name = m[1].replace(/\s{2,}/g, " ").trim();
      if (name) found.push(name);
    }

    // If regex didn't match (no "on" parts), use the whole string
    const tokens = found.length ? found : [s];

    // Deduplicate and normalize "null"/"-"
    const unique = Array.from(
      new Set(
        tokens.map((x) => {
          const v = x.trim();
          if (!v || v === "-" || v.toLowerCase() === "null")
            return "Not Selected";
          return v;
        })
      )
    );

    return unique.length ? unique : ["Not Selected"];
  };

  // --- Load Site Inquiries (mount + filter change) ---
  useEffect(() => {
    const loadData = async () => {
      try {
        const data = await fetchSiteInquiry("", siteFilter, dateFilter); // 🔹 pass dateFilter here
        const mapped: Inquiry[] = data.map((item: any) => ({
          id: item.id,
          siteName: item.type,
          name: item.name,
          contactNumber: item.contact,
          email: item.email,
          numberOfInquiry: item.number_of_inquiry,
          inquiryThrough: normalizeInquiryThrough(item.inquiry_through),
          remark: item.remarks,
          inquiryDate: item.inquiry_date, // dd-mm-yyyy
        }));
        setInquiries(mapped);
      } catch (err) {
        console.error("Failed to load inquiries:", err);
      }
    };

    loadData();
  }, [siteFilter, dateFilter]);

  // --- Load Inquiry Through counts for cards (once) ---
  useEffect(() => {
    const loadInquiryThrough = async () => {
      try {
        const cards = await fetchInquiryThrough("1"); // [{ inquiry_through, count }]
        setInquiryThroughCards(cards);
      } catch (err) {
        console.error("Failed to load inquiry through options:", err);
      }
    };
    loadInquiryThrough();
  }, []);

  // --- Build filter choices (union of parsed table values + card labels) ---
  useEffect(() => {
    const fromInquiries = new Set(inquiries.flatMap((i) => i.inquiryThrough));
    const fromCards = new Set(
      inquiryThroughCards.map((c) => normalizeCardLabel(c.inquiry_through))
    );
    setInquiryThroughChoices(
      Array.from(new Set([...fromInquiries, ...fromCards])).sort()
    );
  }, [inquiries, inquiryThroughCards]);

  const handleChangePage = (_: unknown, newPage: number) => setPage(newPage);

  const handleChangeRowsPerPage = (e: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(parseInt(e.target.value, 10));
    setPage(0);
  };

  // --- Apply Filters ---
  const filteredData = inquiries.filter((item) => {
    const searchTerm = search.trim().toLowerCase();

    const matchesSearch = (
      [
        item.siteName,
        item.name,
        item.contactNumber,
        item.email,
        String(item.numberOfInquiry),
        item.inquiryThrough.join(", "),
        item.remark,
        item.inquiryDate,
      ].join(" ") as string
    )
      .toLowerCase()
      .includes(searchTerm);

    const matchesDate = dateFilter
      ? (() => {
          const today = new Date();
          const filterDays = parseInt(dateFilter, 10);
          const cutoffDate = new Date(today);
          cutoffDate.setDate(today.getDate() - filterDays);

          // item.inquiryDate is dd-mm-yyyy
          const [day, month, year] = item.inquiryDate.split("-").map(Number);
          const itemDate = new Date(year, month - 1, day);

          return itemDate >= cutoffDate && itemDate <= today;
        })()
      : true;

    const matchesInquiryThrough = inquiryThroughFilter
      ? item.inquiryThrough.includes(inquiryThroughFilter)
      : true;

    return matchesSearch && matchesDate && matchesInquiryThrough;
  });

  const paginatedData = filteredData.slice(
    page * rowsPerPage,
    page * rowsPerPage + rowsPerPage
  );

  const uniqueSites = [...new Set(inquiries.map((i) => i.siteName))].sort();

  const isColumnVisible = (column: string) =>
    selectedColumns.length === 0 || selectedColumns.includes(column);

  const columns = [
    { key: "siteName", label: "Site Name" },
    { key: "name", label: "Name" },
    { key: "contactNumber", label: "Contact Number" },
    { key: "email", label: "Email" },
    { key: "numberOfInquiry", label: "Number of Inquiry" },
    { key: "inquiryThrough", label: "Inquiry Through" },
    { key: "remark", label: "Remark" },
    { key: "inquiryDate", label: "Inquiry Date" },
  ];

  return (
    <>
      <div className="font-poppins text-gray-800 dark:text-white">
        <h3 className="text-lg font-semibold mb-5">Site Inquiry</h3>

        <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white dark:bg-white/[0.03] px-4 pb-3 pt-4 sm:px-6">
          {/* Filters */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
            {/* Left Column */}
            <div className="flex flex-wrap gap-2 items-center">
              <Button
                size="small"
                variant="contained"
                className="!bg-green-600 hover:!bg-green-700 text-white"
                onClick={() =>
                  copyTableData(filteredData, columns, selectedColumns)
                }
              >
                Copy
              </Button>

              <FormControl size="small" sx={{ minWidth: 160 }}>
                <InputLabel
                  id="date-filter-label"
                  sx={{ fontFamily: "Poppins, sans-serif" }}
                >
                  Filter by Date
                </InputLabel>
                <Select
                  labelId="date-filter-label"
                  value={dateFilter}
                  onChange={(e) => setDateFilter(Number(e.target.value))}
                  label="Filter by Date"
                  sx={{ fontFamily: "Poppins, sans-serif", fontSize: "14px" }}
                >
                  <MenuItem
                    value={0}
                    sx={{ fontFamily: "Poppins, sans-serif" }}
                  >
                    All Dates
                  </MenuItem>
                  <MenuItem
                    value={3}
                    sx={{ fontFamily: "Poppins, sans-serif" }}
                  >
                    Last 3 Days
                  </MenuItem>
                  <MenuItem
                    value={7}
                    sx={{ fontFamily: "Poppins, sans-serif" }}
                  >
                    Last 7 Days
                  </MenuItem>
                </Select>
              </FormControl>
              {/* Inquiry Through Filter */}
              <FormControl size="small" sx={{ minWidth: 210 }}>
                <InputLabel sx={{ fontFamily: "Poppins, sans-serif" }}>
                  Filter by Inquiry Type
                </InputLabel>
                <Select
                  value={inquiryThroughFilter}
                  onChange={(e) => setInquiryThroughFilter(e.target.value)}
                  label="Filter by Inquiry Type"
                  sx={{ fontFamily: "Poppins, sans-serif", fontSize: "14px" }}
                >
                  <MenuItem value="" sx={{ fontFamily: "Poppins, sans-serif" }}>
                    All Types
                  </MenuItem>
                  {inquiryThroughChoices.map((opt, i) => (
                    <MenuItem
                      key={i}
                      value={opt}
                      sx={{ fontFamily: "Poppins, sans-serif" }}
                    >
                      {opt}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </div>

            {/* Right Column */}
            <div className="flex flex-wrap gap-2 justify-start sm:justify-end items-center">
              {/* Filter by Site */}
              <SiteFilter
                value={siteFilter}
                onChange={(e) => setSiteFilter(e.target.value)} // 🔹 pick value not whole event
              />

              {/* <FormControl size="small" sx={{ minWidth: 200 }}>
                <InputLabel
                  className="text-gray-700 dark:text-white"
                  sx={{ fontFamily: "Poppins" }}
                />
                <Select
                  multiple
                  value={selectedColumns}
                  onChange={(e) =>
                    setSelectedColumns(
                      typeof e.target.value === "string"
                        ? e.target.value.split(",")
                        : e.target.value
                    )
                  }
                  displayEmpty
                  renderValue={() => "Select Columns"}
                  className="bg-white dark:bg-gray-200 rounded-md"
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
              </FormControl> */}

              {/* Search */}
              <TextField
                size="small"
                placeholder="Search..."
                value={search}
                onChange={(e) => setSearch(e.target.value.trimStart())}
                inputProps={{ style: { fontFamily: "Poppins, sans-serif" } }}
              />
            </div>
          </div>

          {/* Table */}
          <div className="max-w-full overflow-x-auto mt-8">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableCell className="columtext">Sr. No</TableCell>
                  {isColumnVisible("Sitename") && (
                    <TableCell className="columtext">Site Name</TableCell>
                  )}
                  {isColumnVisible("Name") && (
                    <TableCell className="columtext">Name</TableCell>
                  )}

                  {isColumnVisible("ContactNumber") && (
                    <TableCell className="columtext">Contact Number</TableCell>
                  )}
                  {isColumnVisible("Email") && (
                    <TableCell className="columtext">Email</TableCell>
                  )}
                  {isColumnVisible("NumberofInquiry") && (
                    <TableCell className="columtext">
                      Number of Inquiry
                    </TableCell>
                  )}
                  {isColumnVisible("InquiryThrough") && (
                    <TableCell className="columtext">Inquiry Through</TableCell>
                  )}

                  {isColumnVisible("Remark") && (
                    <TableCell className="columtext">Remark</TableCell>
                  )}
                  {isColumnVisible("InquiryDate") && (
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

                      {isColumnVisible("Sitename") && (
                        <TableCell className="rowtext">
                          {item.siteName}
                        </TableCell>
                      )}

                      {isColumnVisible("Name") && (
                        <TableCell className="rowtext">{item.name}</TableCell>
                      )}

                      {isColumnVisible("ContactNumber") && (
                        <TableCell className="rowtext">
                          {item.contactNumber}
                        </TableCell>
                      )}

                      {isColumnVisible("Email") && (
                        <TableCell className="rowtext">
                          <Tooltip
                            title={`Copy Email: ${item.email}`}
                            arrow
                            placement="top"
                          >
                            <IconButton
                              onClick={() =>
                                navigator.clipboard.writeText(item.email)
                              }
                            >
                              <MdEmail className="text-indigo-600" />
                            </IconButton>
                          </Tooltip>
                        </TableCell>
                      )}

                      {isColumnVisible("NumberofInquiry") && (
                        <TableCell className="rowtext">
                          {item.numberOfInquiry}
                        </TableCell>
                      )}
                      {isColumnVisible("InquiryThrough") && (
                        <TableCell className="rowtext">
                          {item.inquiryThrough.join(", ")}
                        </TableCell>
                      )}
                      {isColumnVisible("Remark") && (
                        <TableCell className="rowtext">{item.remark}</TableCell>
                      )}
                      {isColumnVisible("InquiryDate") && (
                        <TableCell className="rowtext">
                          {item.inquiryDate}
                        </TableCell>
                      )}
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell
                      colSpan={9}
                      className="text-center py-4 rowtext "
                    >
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

      {/* Cards: use API counts directly */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 mt-4">
        {inquiryThroughCards.map((opt, index) => (
          <div
            key={index}
            className="bg-[#0d2250] text-white rounded-sm shadow-md p-5 flex flex-col justify-center"
          >
            <h6 className="text-sm font-semibold mb-1">
              {normalizeCardLabel(opt.inquiry_through)}
            </h6>
            <p className="text-lg font-bold">{opt.count}</p>
          </div>
        ))}
      </div>
    </>
  );
}
