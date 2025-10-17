import React, { useState, useEffect } from "react";
import ComponentCard from "../../components/common/ComponentCard";
import Label from "../../components/form/Label";
import Input from "../../components/form/input/InputField";
import FileInput from "../../components/form/input/FileInput";
import Select from "../../components/form/Select";
import DatePicker from "../../components/form/date-picker";
import Button from "../../components/ui/button/Button";
import {
  fetchBookingDetails,
  fetchClientNameFromBlockId,
  getAdminId,
} from "../../utils/Handlerfunctions/getdata";
import { useNavigate, useLocation } from "react-router-dom";
import { addPaymentDetail } from "../../utils/Handlerfunctions/formSubmitHandlers";

const Addclientpayment = () => {
  const navigate = useNavigate();

  const [bookingDetails, setBookingDetails] = useState<any>(null);
  const [receivedAmount, setReceivedAmount] = useState<number | "">("");
  const [amountType, setAmountType] = useState<string>("");
  const [paymentDate, setPaymentDate] = useState<string>("");
  const [receiptFile, setReceiptFile] = useState<File | null>(null);
  const [receiptPreview, setReceiptPreview] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const [formError, setFormError] = useState<string>("");
  const [errors, setErrors] = useState<Record<string, string>>({});

  const location = useLocation();
  const { clientId, siteId, blockId } = location.state || {};

  const amountTypeOptions = [
    { value: "Principal Amount", label: "Principal Amount" },
    { value: "GST Amount", label: "GST Amount" },
  ];

  // ✅ Validation for received amount
  const validateAmount = (value: number): string => {
    if (!amountType || !bookingDetails) return "";

    let maxAllowed = 0;
    if (amountType === "Principal Amount") {
      maxAllowed = Number(bookingDetails.balance_principal) || 0;
    } else if (amountType === "GST Amount") {
      maxAllowed = Number(bookingDetails.balance_gst) || 0;
    }

    if (value < 1) return "Amount must be at least 1 INR";
    if (value > maxAllowed)
      return `Amount cannot exceed ₹${maxAllowed.toLocaleString("en-IN")}`;

    return "";
  };

  const handleReceiptChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    setReceiptFile(file);
    setReceiptPreview(file ? URL.createObjectURL(file) : null);
  };

  const loadBooking = async () => {
    if (!clientId || !siteId || !blockId) return;

    try {
      const bookingData = await fetchBookingDetails(clientId, siteId, blockId);
      const clientInfo = await fetchClientNameFromBlockId(blockId);

      if (bookingData && clientInfo) {
        setBookingDetails({
          ...bookingData,
          clientId: clientInfo.clientId,
          client_name: clientInfo.clientName,
        });
      }
    } catch (err) {
      console.error("Error loading booking details:", err);
    }
  };

  useEffect(() => {
    loadBooking();
  }, [clientId, siteId, blockId]);

  // ✅ Required field validation
  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    if (!amountType) newErrors.amountType = "Amount type is required";
    if (!receivedAmount) newErrors.amount = "Amount is required";
    if (!paymentDate) newErrors.date = "Payment date is required";
    return newErrors;
  };

  const handlesubmit = async () => {
    const adminId = getAdminId();
    const newErrors = validateForm();
    setErrors(newErrors);

    if (Object.keys(newErrors).length > 0) return;

    // validate amount limit
    const error = validateAmount(Number(receivedAmount));
    if (error) {
      setFormError(error);
      return;
    }

    setLoading(true);

    try {
      const res = await addPaymentDetail({
        adminId,
        clientId: bookingDetails?.clientId,
        siteDetailId: siteId,
        blockDetailsId: blockId,
        receivedAmountType: amountType,
        receivedAmount,
        paymentDate,
        receiptFile,
      });

      if (res?.status === 200) {
        // Reset form
        setReceivedAmount("");
        setAmountType("");
        setPaymentDate("");
        setReceiptFile(null);
        setReceiptPreview(null);
        setFormError("");
        setErrors({});
        navigate(-1);
      }
    } catch (err) {
      console.error("Error submitting payment:", err);
    } finally {
      setLoading(false);
    }
  };

  // clear single error
  const clearError = (field: string) => {
    if (errors[field]) {
      setErrors((prev) => {
        const updated = { ...prev };
        delete updated[field];
        return updated;
      });
    }
  };

  // ✅ Max allowed (based on type)
  const maxAllowedAmount =
    amountType === "Principal Amount"
      ? Number(bookingDetails?.balance_principal) || 0
      : amountType === "GST Amount"
      ? Number(bookingDetails?.balance_gst) || 0
      : 0;

  return (
    <div>
      <div className="grid grid-cols-1 gap-6 xl:grid-cols-1">
        <div className="space-y-6">
          <ComponentCard title="Add Payment Details">
            <div className="space-y-6"> 
              {/* Client Name */}
              <div>
                <Label>Client Name</Label>
                <Input disabled className="disabledInput"  value={bookingDetails?.client_name} />
              </div>

              {/* Summary */}
              <div className="grid grid-cols-3 gap-6">
                <div>
                  <Label>Principal Amount</Label>
                  <Input disabled className="disabledInput" value={bookingDetails?.property_amount} />
                </div>
                <div>
                  <Label>GST Amount</Label>
                  <Input disabled className="disabledInput" value={bookingDetails?.gst_amount} />
                </div>
                <div>
                  <Label>Total Amount</Label>
                  <Input disabled className="disabledInput" value={bookingDetails?.total_amount} />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-6">
                <div>
                  <Label>Total Received Principal</Label>
                  <Input disabled className="disabledInput" value={bookingDetails?.received_principal} />
                </div>
                <div>
                  <Label>Total Received GST</Label>
                  <Input disabled className="disabledInput" value={bookingDetails?.received_gst} />
                </div>
                <div>
                  <Label>Balance Principal</Label>
                  <Input disabled className="disabledInput" value={bookingDetails?.balance_principal} />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-6">
                <div>
                  <Label>Balance GST</Label>
                  <Input disabled className="disabledInput" value={bookingDetails?.balance_gst} />
                </div>
              </div>

              {/* Amount Type */}
              <div>
                <Label>
                  Amount Type <span className="text-red-500">*</span>
                </Label>
                <Select
                  options={amountTypeOptions}
                  value={amountType}
                  onChange={(val) => {
                    setAmountType(val);
                    setReceivedAmount("");
                    setFormError("");
                    clearError("amountType");
                  }}
                  placeholder="Select Amount Type"
                />
                {errors.amountType && (
                  <p className="text-red-500 text-sm">{errors.amountType}</p>
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
                  onChange={(e) => {
                    const value = Number(e.target.value);
                    setReceivedAmount(value);
                    clearError("amount");
                    const error = validateAmount(value);
                    setFormError(error);
                  }}
                  placeholder="Enter amount"
                />
                {errors.amount && (
                  <p className="text-red-500 text-sm">{errors.amount}</p>
                )}
                {formError && (
                  <p className="text-red-500 text-sm">{formError}</p>
                )}
                {amountType && (
                  <p className="text-xs text-gray-500">
                    Maximum allowed:{" "}
                    {maxAllowedAmount.toLocaleString("en-IN", {
                      style: "currency",
                      currency: "INR",
                    })}
                  </p>
                )}
              </div>

              {/* Payment Date */}
              <div>
                <Label>
                  Received Payment Date <span className="text-red-500">*</span>
                </Label>
                <DatePicker
                  id="payment-date"
                  placeholder="Select payment date"
                  onChange={(currentDateString) => {
                    setPaymentDate(currentDateString);
                    clearError("date");
                  }}
                />
                {errors.date && (
                  <p className="text-red-500 text-sm">{errors.date}</p>
                )}
              </div>

              {/* Upload Receipt (optional) */}
              <div>
                <Label>Upload Receipt</Label>
                <FileInput id="fileUpload" onChange={handleReceiptChange} />
                {receiptPreview && (
                  <div className="mt-2 w-40 h-40 border rounded overflow-hidden">
                    <img
                      src={receiptPreview}
                      alt="Receipt Preview"
                      className="w-full h-full object-contain"
                    />
                  </div>
                )}
              </div>
            </div>
          </ComponentCard>
        </div>
      </div>

      <Button className="Submitbtn" onClick={handlesubmit} disabled={loading}>
        {loading ? "Submitting..." : "Submit"}
      </Button>
      <Button className="canclebtn" onClick={() => navigate(-1)}>
        Cancel
      </Button>
    </div>
  );
};

export default Addclientpayment;
