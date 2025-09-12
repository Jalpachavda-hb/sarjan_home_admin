import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableRow,
} from "../ui/table";
import Badge from "../ui/badge/Badge";
import TablePagination from "@mui/material/TablePagination";
import { useState, useEffect } from "react";
import {
  TextField,
  Button,
  Select,
  MenuItem,
  InputLabel,
  FormControl,
  Checkbox,
  ListItemText,
} from "@mui/material";
import SiteFilter from "../../components/form/input/FilterbySite";
import { TodayReceivedpayment } from "../../utils/Handlerfunctions/getdata"; // ✅ import API fn
import { getAdminId } from "../../utils/Handlerfunctions/getdata";

interface Payment {
  id: number;
  name: string; // client name
  title: string; // site name
  block: string;
  block_number: string;
  received_amount: string;
  received_amount_type: string;
  received_payment_date: string;
}

export default function TodayReceivedpaymentTable() {
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [search, setSearch] = useState("");
  const [siteFilter, setSiteFilter] = useState("");
  const [selectedColumns, setSelectedColumns] = useState<string[]>([]);
  const [paymentData, setPaymentData] = useState<Payment[]>([]);

  // ✅ Fetch data on load & site change
  useEffect(() => {
    const fetchData = async () => {
      const adminId = getAdminId();
      if (!adminId) return;

      const res = await TodayReceivedpayment(siteFilter);
      if (res?.status === 200 && res.data) {
        setPaymentData(res.data);
      } else {
        setPaymentData([]);
      }
    };
    fetchData();
  }, [siteFilter]);

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

  // ✅ Search & filter
  const filteredData = paymentData.filter((item) => {
    const searchTerm = search.trim().toLowerCase();
    return Object.values(item)
      .map((val) => String(val).trim().toLowerCase())
      .join(" ")
      .includes(searchTerm);
  });

  const paginatedData = filteredData.slice(
    page * rowsPerPage,
    page * rowsPerPage + rowsPerPage
  );

  return (
    <div className="font-poppins text-gray-800 dark:text-white">
      <h3 className="text-lg font-semibold mb-5">Today's Received Payment</h3>

      <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white dark:bg-white/[0.03] px-4 pb-3 pt-4 sm:px-6">
        {/* Filters Row */}
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
            <Button
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

            {/* Select Columns Dropdown */}
            <FormControl size="small" sx={{ minWidth: 200 }}>
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
                  "name",
                  "title",
                  "block",
                  "block_number",
                  "received_amount",
                  "received_amount_type",
                  "received_payment_date",
                ].map((col) => (
                  <MenuItem key={col} value={col}>
                    <Checkbox checked={selectedColumns.includes(col)} />
                    <ListItemText
                      primary={
                        {
                          name: "Client Name",
                          title: "Site Name",
                          block: "Block",
                          block_number: "Unit No.",
                          received_amount: "Received Amount",
                          received_amount_type: "Amount Type",
                          received_payment_date: "Received Date",
                        }[col]
                      }
                    />
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </div>

          {/* Right Column */}
          <div className="flex flex-wrap gap-2 justify-start sm:justify-end items-center">
            <SiteFilter
              value={siteFilter}
              onChange={(e) => setSiteFilter(e.target.value)}
            />
            <TextField
              size="small"
              variant="outlined"
              placeholder="Search..."
              value={search}
              onChange={(e) => setSearch(e.target.value.trimStart())}
            />
          </div>
        </div>

        {/* Table */}
        <div className="max-w-full overflow-x-auto mt-8">
          <Table>
            <TableHeader>
              <TableRow>
                <TableCell className="columtext">Sr. No</TableCell>
                {isColumnVisible("name") && (
                  <TableCell className="columtext">Client Name</TableCell>
                )}
                {isColumnVisible("title") && (
                  <TableCell className="columtext">Site Name</TableCell>
                )}
                {isColumnVisible("block") && (
                  <TableCell className="columtext">Block</TableCell>
                )}
                {isColumnVisible("block_number") && (
                  <TableCell className="columtext">Unit No.</TableCell>
                )}
                {isColumnVisible("received_amount") && (
                  <TableCell className="columtext">Received Amount</TableCell>
                )}
                {isColumnVisible("received_amount_type") && (
                  <TableCell className="columtext">Amount Type</TableCell>
                )}
                {isColumnVisible("received_payment_date") && (
                  <TableCell className="columtext">Received Date</TableCell>
                )}
              </TableRow>
            </TableHeader>

            <TableBody>
              {paginatedData.map((item, index) => (
                <TableRow key={item.id}>
                  <TableCell className="rowtext">
                    {page * rowsPerPage + index + 1}
                  </TableCell>
                  {isColumnVisible("name") && (
                    <TableCell className="rowtext">{item.name}</TableCell>
                  )}
                  {isColumnVisible("title") && (
                    <TableCell className="rowtext">{item.title}</TableCell>
                  )}
                  {isColumnVisible("block") && (
                    <TableCell className="rowtext">{item.block}</TableCell>
                  )}
                  {isColumnVisible("block_number") && (
                    <TableCell className="rowtext">
                      {item.block_number}
                    </TableCell>
                  )}
                  {isColumnVisible("received_amount") && (
                    <TableCell className="rowtext">
                      {item.received_amount}
                    </TableCell>
                  )}
                  {isColumnVisible("received_amount_type") && (
                    <TableCell className="rowtext">
                      <Badge
                        size="sm"
                        color={
                          item.received_amount_type === "Principal Amount"
                            ? "success"
                            : item.received_amount_type === "GST Amount"
                            ? "warning"
                            : "error"
                        }
                      >
                        {item.received_amount_type}
                      </Badge>
                    </TableCell>
                  )}
                  {isColumnVisible("received_payment_date") && (
                    <TableCell className="rowtext">
                      {item.received_payment_date}
                    </TableCell>
                  )}
                </TableRow>
              ))}
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
