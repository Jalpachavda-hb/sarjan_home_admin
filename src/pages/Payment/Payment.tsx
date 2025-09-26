
import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableRow,
} from "../../components/ui/table";

import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  MenuItem,
  InputLabel,
  FormControl,
  Checkbox,
  ListItemText,
  IconButton,
  // Select,
} from "@mui/material";
import { Select as MuiSelect } from "@mui/material";
import Label from "../../components/form/Label";
import Select from "../../components/form/Select";
import Input from "../../components/form/input/InputField";
import Badge from "../../components/ui/badge/Badge";
import { MdEdit, MdFileDownload, MdDelete } from "react-icons/md";
import TablePagination from "@mui/material/TablePagination";
import { useState, useEffect } from "react";
import {
  getAdminId,
  fetchPaymentDetails,
} from "../../utils/Handlerfunctions/getdata";
import { destroyPaymentDetails } from "../../utils/Handlerfunctions/formdeleteHandlers";
import { editPaymentfromAdmin } from "../../utils/Handlerfunctions/formEditHandlers";
import Swal from "sweetalert2";
import { toast } from "react-toastify";
import FileInput from "../../components/form/input/FileInput";
import SiteFilter from "../../components/form/input/FilterbySite";

interface Payment {
  id: number;
  clientName: string;
  siteName: string;
  unitNo: string;
  propertyAmount: string;
  gstAmount: string;
  receivedDate: string;
  receivedAmountType: string;
  receivedAmount: string;
  receiptUrl?: string;
}

export default function Payment() {
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [search, setSearch] = useState("");
  const [siteFilter, setSiteFilter] = useState("");
  const [dateFilter, setDateFilter] = useState("");
  const [selectedColumns, setSelectedColumns] = useState<string[]>([]);
  const [tableData, setTableData] = useState<Payment[]>([]);
  const [formError, setFormError] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedPayment, setSelectedPayment] = useState<Payment | null>(null);
  const [amountType, setAmountType] = useState("");
  const [receivedAmount, setReceivedAmount] = useState<number | "">("");
  const [paymentDate, setPaymentDate] = useState<string>("");
  const [receiptFile, setReceiptFile] = useState<File | null>(null);
  const [receiptPreview, setReceiptPreview] = useState<string | null>(null);
  const [oldReceiptUrl, setOldReceiptUrl] = useState<string>("");
  const [maxAllowedAmount, setMaxAllowedAmount] = useState<number>(0);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  useEffect(() => {
    const loadPayments = async () => {
      const adminId = getAdminId();
      if (!adminId) return;

      const data = await fetchPaymentDetails(
        adminId,
        siteFilter || "",
        dateFilter ? Number(dateFilter) : 0
      );
      setTableData(data);
    };
    loadPayments();
  }, [siteFilter, dateFilter]);

  const handleChangePage = (_: unknown, newPage: number) => {
    setPage(newPage);
  };

  const amountTypeOptions = [
    { value: "Principal Amount", label: "Principal Amount" },
    { value: "GST Amount", label: "GST Amount" },
  ];

  const handleDelete = async (payment_id: number) => {
    const result = await Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete it!",
    });

    if (result.isConfirmed) {
      try {
        await destroyPaymentDetails(payment_id);
        const adminId = getAdminId();
        const updatedData = await fetchPaymentDetails(adminId);
        setTableData(updatedData);

        toast.success("Deleted successfully!");
      } catch (err) {
        console.error("Delete failed:", err);
        toast.error("Failed to delete document. Please try again.");
      }
    }
  };

  const handleAmountChange = (val: number) => {
    setReceivedAmount(val);
    const errorMsg = validateAmount(val);
    setErrors((prev) => ({ ...prev, receivedAmount: errorMsg }));
  };

  const handleReceiptChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setReceiptFile(file);
      setReceiptPreview(URL.createObjectURL(file));
    }
  };

  const handleAmountTypeChange = (val: string) => {
    setAmountType(val);
    setErrors((prev) => ({ ...prev, amountType: "" }));

    if (selectedPayment) {
      const newMax =
        val === "GST Amount"
          ? Number(selectedPayment.gstAmount.replace(/[^0-9.-]+/g, ""))
          : Number(selectedPayment.propertyAmount.replace(/[^0-9.-]+/g, ""));
      setMaxAllowedAmount(newMax);

      if (receivedAmount > newMax) {
        setErrors((prev) => ({
          ...prev,
          receivedAmount: "Received amount exceeds balance",
        }));
      } else {
        setErrors((prev) => ({ ...prev, receivedAmount: "" }));
      }
    }
  };

  const handleChangeRowsPerPage = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const isColumnVisible = (column: string) =>
    selectedColumns.length === 0 || selectedColumns.includes(column);

  const filteredData = tableData.filter((item) => {
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

  const handleEdit = (payment: Payment) => {
    setSelectedPayment(payment);
    setAmountType(payment.receivedAmountType);

    // Extract numeric value from formatted string (e.g., "₹1,000" -> 1000)
    const numericValue = Number(
      payment.receivedAmount.replace(/[^0-9.-]+/g, "")
    );

    setReceivedAmount(numericValue || 0);
    setPaymentDate(payment.receivedDate.split(" ")[0]);
    setReceiptPreview(payment.receiptUrl || null);
    setOldReceiptUrl(payment.receiptUrl || "");
    setReceiptFile(null); // Reset file when opening modal
    setFormError(""); // Clear any previous errors

    // Set the maximum allowed amount based on amount type
    if (payment.receivedAmountType === "GST Amount") {
      const gstAmount = Number(payment.gstAmount.replace(/[^0-9.-]+/g, ""));
      setMaxAllowedAmount(gstAmount);
    } else {
      const propertyAmount = Number(
        payment.propertyAmount.replace(/[^0-9.-]+/g, "")
      );
      setMaxAllowedAmount(propertyAmount);
    }

    setIsModalOpen(true);
  };
  const validateDate = (date: string): string => {
    if (!date) return "Please select a payment date";

    // Regex for dd/mm/yyyy
    const regex = /^(0[1-9]|[12][0-9]|3[01])\/(0[1-9]|1[0-2])\/\d{4}$/;
    if (!regex.test(date)) return "Date must be in dd/mm/yyyy format";

    return "";
  };

  const validateAmount = (amount: number): string => {
    if (!amount || amount <= 0) {
      return "Please enter a valid amount";
    }

    if (amount > maxAllowedAmount) {
      if (amountType === "GST Amount") {
        return "Received GST amount exceeds balance";
      } else {
        return "Received principal amount exceeds balance";
      }
    }

    return "";
  };

  return (
    <div className="font-poppins text-gray-800 dark:text-white">
      <h3 className="text-lg font-semibold mb-5">Payment Details</h3>

      <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white dark:bg-white/[0.03] px-4 pb-3 pt-4 sm:px-6">
        {/* Filters */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
          <div className="flex flex-wrap gap-2 items-center">
            <Button
              size="small"
              variant="contained"
              className="!bg-amber-500 hover:!bg-amber-600 text-white"
            >
              Print
            </Button>

            {/* Select Columns */}
            <FormControl size="small" sx={{ minWidth: 200 }}>
              <MuiSelect
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
                sx={{
                  fontFamily: "Poppins",
                  "& .MuiSelect-select": {
                    color: "#6B7280",
                    fontWeight: 300,
                  },
                }}
              >
                {[
                  "clientName",
                  "siteName",
                  "unitNo",
                  "propertyAmount",
                  "gstAmount",
                  "receivedDate",
                  "receivedAmountType",
                  "receivedAmount",
                  "receiptUrl",
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
                          unitNo: "Unit Number",
                          propertyAmount: "Property Amount",
                          gstAmount: "GST Amount",
                          receivedDate: "Received Date",
                          receivedAmountType: "Received Amount Type",
                          receivedAmount: "Received Amount",
                          receiptUrl: "Payment Receipt",
                        }[col]
                      }
                    />
                  </MenuItem>
                ))}
              </MuiSelect>
            </FormControl>

            {/* Date Filter */}
            <FormControl size="small" sx={{ minWidth: 160 }}>
              <InputLabel
                id="date-filter-label"
                sx={{ fontFamily: "Poppins, sans-serif" }}
              >
                Filter by Date
              </InputLabel>
              <MuiSelect
                labelId="date-filter-label"
                value={dateFilter}
                onChange={(e) => setDateFilter(Number(e.target.value))}
                label="Filter by Date"
                sx={{ fontFamily: "Poppins, sans-serif", fontSize: "14px" }}
              >
                <MenuItem value={0} sx={{ fontFamily: "Poppins, sans-serif" }}>
                  All Dates
                </MenuItem>
                <MenuItem value={3} sx={{ fontFamily: "Poppins, sans-serif" }}>
                  Last 3 Days
                </MenuItem>
                <MenuItem value={7} sx={{ fontFamily: "Poppins, sans-serif" }}>
                  Last 7 Days
                </MenuItem>
              </MuiSelect>
            </FormControl>
          </div>

          <div className="flex flex-wrap gap-2 justify-start sm:justify-end items-center">
            {/* Site Filter */}
            <SiteFilter
              value={siteFilter}
              onChange={(e) => setSiteFilter(e.target.value)}
            />

            {/* Search */}
            <TextField
              size="small"
              placeholder="Search..."
              value={search}
              onChange={(e) => setSearch(e.target.value.trimStart())}
            />

            <a href="/admin/payments/add">
              <Button
                size="small"
                variant="contained"
                className="!bg-indigo-700 hover:!bg-indigo-900 text-white p-3 h-10"
              >
                + Add
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
                {isColumnVisible("Delete") && (
                  <TableCell className="columtext">Action</TableCell>
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
                    {isColumnVisible("clientName") && (
                      <TableCell className="rowtext">
                        {item.clientName}
                      </TableCell>
                    )}
                    {isColumnVisible("siteName") && (
                      <TableCell className="rowtext">{item.siteName}</TableCell>
                    )}
                    {isColumnVisible("unitNo") && (
                      <TableCell className="rowtext">{item.unitNo}</TableCell>
                    )}
                    {isColumnVisible("propertyAmount") && (
                      <TableCell className="rowtext">
                        {item.propertyAmount}
                      </TableCell>
                    )}
                    {isColumnVisible("gstAmount") && (
                      <TableCell className="rowtext">
                        {item.gstAmount}
                      </TableCell>
                    )}
                    {isColumnVisible("receivedDate") && (
                      <TableCell className="rowtext">
                        {item.receivedDate.split(" ")[0]}
                      </TableCell>
                    )}
                    {isColumnVisible("receivedAmountType") && (
                      <TableCell className="rowtext">
                        <Badge
                          size="sm"
                          color={
                            item.receivedAmountType === "Principal Amount"
                              ? "success"
                              : item.receivedAmountType === "GST Amount"
                              ? "warning"
                              : "error"
                          }
                        >
                          {item.receivedAmountType}
                        </Badge>
                      </TableCell>
                    )}
                    {isColumnVisible("receivedAmount") && (
                      <TableCell className="rowtext">
                        {item.receivedAmount}
                      </TableCell>
                    )}
                    {isColumnVisible("receiptUrl") && (
                      <TableCell>
                        {item.receiptUrl ? (
                          <a href={item.receiptUrl} target="_blank" download>
                            <IconButton color="primary">
                              <MdFileDownload />
                            </IconButton>
                          </a>
                        ) : (
                          <Badge size="sm" color={"error"}>
                            No Receipt
                          </Badge>
                        )}
                      </TableCell>
                    )}
                    {isColumnVisible("Delete") && (
                      <TableCell className="rowtext">
                        <Badge variant="light">
                          <MdEdit
                            className="text-2xl cursor-pointer"
                            onClick={() => handleEdit(item)}
                          />
                        </Badge>
                        <Badge variant="light" color="error">
                          <MdDelete
                            className="text-2xl cursor-pointer"
                            onClick={() => handleDelete(item.id)}
                          />
                        </Badge>
                      </TableCell>
                    )}
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell
                    colSpan={11}
                    className="text-center py-4 text-gray-500 font-poppins"
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

        {/* Edit Modal */}
        {/* Edit Modal */}
        <Dialog
          className="swal2-container"
          open={isModalOpen}
          onClose={() => {
            setIsModalOpen(false);
            setFormError("");
            setErrors({});
            setReceiptFile(null);
            setReceiptPreview(null);
          }}
          maxWidth="sm"
          fullWidth
        >
          <DialogTitle className="flex justify-between items-center">
            <span>Edit Payment</span>
            <Button
              onClick={() => {
                setIsModalOpen(false);
                setFormError("");
                setErrors({});
                setReceiptFile(null);
                setReceiptPreview(null);
              }}
            >
              ✕
            </Button>
          </DialogTitle>

          <DialogContent dividers>
            <div className="space-y-4">
              {/* Amount Type */}
              <div>
                <Label>
                  Amount Type <span className="text-red-500">*</span>
                </Label>
                <Select
                  options={amountTypeOptions}
                  defaultValue={amountType}
                  onChange={(val) => {
                    handleAmountTypeChange(val);
                    // Validate amount if it exceeds new max
                    if (receivedAmount > maxAllowedAmount) {
                      setErrors((prev) => ({
                        ...prev,
                        receivedAmount: "Received amount exceeds balance",
                      }));
                    } else {
                      setErrors((prev) => ({ ...prev, receivedAmount: "" }));
                    }
                  }}
                />
                {errors.amountType && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.amountType}
                  </p>
                )}
              </div>

              {/* Received Amount */}
              <div>
                <Label>
                  Received Amount <span className="text-red-500">*</span>
                </Label>
                <Input
                  type="number"
                  value={receivedAmount}
                  onChange={(e) => handleAmountChange(Number(e.target.value))}
                  placeholder="Enter amount"
                  className="mt-1"
                  error={!!errors.receivedAmount}
                />
                {errors.receivedAmount && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.receivedAmount}
                  </p>
                )}
                <p className="text-xs text-gray-500 mt-1">
                  Maximum allowed:{" "}
                  {maxAllowedAmount.toLocaleString("en-IN", {
                    style: "currency",
                    currency: "INR",
                  })}
                </p>
              </div>

              {/* Payment Date */}
              <div>
                <Label>
                  Received Payment Date <span className="text-red-500">*</span>
                </Label>
                <Input
                  type="text"
                  placeholder="dd/mm/yyyy"
                  value={paymentDate}
                  onChange={(e) => {
                    setPaymentDate(e.target.value);
                    // live validation (optional)
                    setErrors((prev) => ({
                      ...prev,
                      paymentDate: validateDate(e.target.value),
                    }));
                  }}
                  error={!!errors.paymentDate}
                />
                {errors.paymentDate && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.paymentDate}
                  </p>
                )}
              </div>

              {/* Receipt Upload */}
              <div>
                <Label>Upload Receipt</Label>
                <FileInput onChange={handleReceiptChange} />

                {(receiptPreview || oldReceiptUrl) && (
                  <div className="mt-2 w-40 h-40 border rounded overflow-hidden">
                    <img
                      src={receiptPreview || oldReceiptUrl}
                      alt="Receipt Preview"
                      className="w-full h-full object-contain"
                    />
                  </div>
                )}
              </div>
            </div>
          </DialogContent>

          <DialogActions>
            <Button
              onClick={() => {
                setIsModalOpen(false);
                setFormError("");
                setErrors({});
                setReceiptFile(null);
                setReceiptPreview(null);
              }}
            >
              Cancel
            </Button>

            <Button
              variant="contained"
              onClick={async () => {
                if (!selectedPayment) return;

                // Validate all fields
                const amountError = validateAmount(Number(receivedAmount));
                const dateError = paymentDate
                  ? ""
                  : "Please select a payment date";

                setErrors({
                  receivedAmount: amountError,
                  paymentDate: dateError,
                });

                if (amountError || dateError) return;

                try {
                  const res = await editPaymentfromAdmin(
                    getAdminId(),
                    selectedPayment.id.toString(),
                    amountType,
                    Number(receivedAmount),
                    paymentDate,
                    receiptFile
                  );

                  if (res.status === 200) {
                    toast.success(res.message);

                    // Refresh table data
                    const adminId = getAdminId();
                    const updatedData = await fetchPaymentDetails(adminId);
                    setTableData(updatedData);

                    // Reset modal
                    setIsModalOpen(false);
                    setFormError("");
                    setErrors({});
                    setReceiptFile(null);
                    setReceiptPreview(null);
                  }
                } catch (error: any) {
                  const msg =
                    error.response?.data?.message || "Failed to update payment";
                  setFormError(msg);
                  toast.error(msg);
                }
              }}
              disabled={
                !!errors.receivedAmount || !!errors.paymentDate || !amountType
              }
            >
              Save
            </Button>
          </DialogActions>
        </Dialog>
      </div>
    </div>
  );
}
