// import React, { useState, useEffect } from "react";
// import ComponentCard from "../../components/common/ComponentCard";
// import Label from "../../components/form/Label";
// import Input from "../../components/form/input/InputField";
// import FileInput from "../../components/form/input/FileInput";
// import Select from "../../components/form/Select";
// import DatePicker from "../../components/form/date-picker";
// import Button from "../../components/ui/button/Button";
// import {
//   fetchBookingDetails,
//   fetchClientNameFromBlockId,
//   getAdminId,
// } from "../../utils/Handlerfunctions/getdata";
// import { toast } from "react-toastify";
// import { useNavigate, useParams } from "react-router-dom";
// import { addPaymentDetail } from "../../utils/Handlerfunctions/formSubmitHandlers";
// import { useLocation } from "react-router-dom";
// const Addclientpayment = () => {
//   const navigate = useNavigate();

//   const [bookingDetails, setBookingDetails] = useState<any>(null);
//   const [receivedAmount, setReceivedAmount] = useState<number | "">("");
//   const [amountType, setAmountType] = useState<string>("");
//   const [paymentDate, setPaymentDate] = useState<string>("");
//   const [receiptFile, setReceiptFile] = useState<File | null>(null);
//   const [receiptPreview, setReceiptPreview] = useState<string | null>(null);
//   const [loading, setLoading] = useState(false);
//   const location = useLocation();
//   const { clientId, siteId, blockId } = location.state || {};
//   const amountTypeOptions = [
//     { value: "Principal Amount", label: "Principal Amount" },
//     { value: "GST Amount", label: "GST Amount" },
//   ];

//   const handleReceiptChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//     const file = e.target.files?.[0] || null;
//     setReceiptFile(file);
//     setReceiptPreview(file ? URL.createObjectURL(file) : null);
//   };
//   const loadBooking = async () => {
//   if (!clientId || !siteId || !blockId) return;

//   try {
//     const bookingData = await fetchBookingDetails(clientId, siteId, blockId);
//     const clientInfo = await fetchClientNameFromBlockId(blockId);

//     if (bookingData && clientInfo) {
//       setBookingDetails({
//         ...bookingData,
//         clientId: clientInfo.clientId,   // ✅ correct client_id from API
//         client_name: clientInfo.clientName,
//       });
//     }
//   } catch (err) {
//     console.error("Error loading booking details:", err);
//     toast.error("Failed to load booking details");
//   }
// };
//   useEffect(() => {
//     loadBooking();
//   }, [clientId, siteId, blockId]);

//   // 🔹 Handle submit
//   const handlesubmit = async () => {
//     const adminId = getAdminId();

//     if (!amountType || !receivedAmount || !paymentDate) {
//       toast.error("Please fill in all required fields");
//       return;
//     }

//     setLoading(true);

//     try {
//       const res = await addPaymentDetail({
//         adminId,
//        clientId: bookingDetails?.clientId,
//         siteDetailId: siteId,
//         blockDetailsId: blockId,
//         receivedAmountType: amountType,
//         receivedAmount,
//         paymentDate,
//         receiptFile,
//       });

//       if (res?.status === 200) {
//         toast.success("Payment added successfully!");

//         // Reset form
//         setReceivedAmount("");
//         setAmountType("");
//         setPaymentDate("");
//         setReceiptFile(null);
//         setReceiptPreview(null);

//         navigate(-1); // go back after successful submission
//       } else {
//         toast.error(res?.message || "Failed to add payment");
//       }
//     } catch (err) {
//       console.error("Error submitting payment:", err);
//       toast.error("Submission failed");
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div>
//       <div className="grid grid-cols-1 gap-6 xl:grid-cols-1">
//         <div className="space-y-6">
//           <ComponentCard title="Add Payment Details">
//             <div className="space-y-6">
//               {/* Show client_id just for reference */}
//               <div>
//                 <Label>Client Name</Label>
//                 <Input
//                   disabled
//                   value={bookingDetails?.client_name}
//                   className="disabledInput"
//                 />
//               </div>

              // <div className="grid grid-cols-3 gap-6">
              //   <div>
              //     <Label>Principal Amount</Label>
              //     <Input
              //       disabled
              //       value={bookingDetails?.property_amount}
              //       className="disabledInput"
              //     />
              //   </div>

              //   <div>
              //     <Label>GST Amount</Label>
              //     <Input
              //       disabled
              //       value={bookingDetails?.gst_amount}
              //       className="disabledInput"
              //     />
              //   </div>

              //   <div>
              //     <Label>Total Amount</Label>
              //     <Input
              //       disabled
              //       value={bookingDetails?.total_amount}
              //       className="disabledInput"
              //     />
              //   </div>
              // </div>

              // <div className="grid grid-cols-3 gap-6">
              //   <div>
              //     <Label>Total Received Principal Amount</Label>
              //     <Input
              //       disabled
              //       value={bookingDetails?.received_principal}
              //       className="disabledInput"
              //     />
              //   </div>

              //   <div>
              //     <Label>Total Received GST Amount</Label>
              //     <Input
              //       disabled
              //       value={bookingDetails?.received_gst}
              //       className="disabledInput"
              //     />
              //   </div>

              //   <div>
              //     <Label>Balance Principal Amount</Label>
              //     <Input
              //       disabled
              //       value={bookingDetails?.balance_principal}
              //       className="disabledInput"
              //     />
              //   </div>
              // </div>

              // <div className="grid grid-cols-3 gap-6">
              //   <div>
              //     <Label>Balance GST Amount</Label>
              //     <Input
              //       disabled
              //       value={bookingDetails?.balance_gst}
              //       className="disabledInput"
              //     />
              //   </div>
              // </div>

//               {/* Amount Type */}
//               <div>
//                 <Label>Amount Type</Label>
//                 <Select
//                   options={amountTypeOptions}
//                   value={amountType}
//                   onChange={setAmountType}
//                   placeholder="Select Amount Type"
//                 />
//               </div>

//               {/* Received Amount */}
//               <div>
//                 <Label>Received Amount</Label>
//                 <Input
//                   type="number"
//                   value={receivedAmount}
//                   onChange={(e) => setReceivedAmount(Number(e.target.value))}
//                   placeholder="Enter amount"
//                 />
//               </div>

//               {/* Payment Date */}
//               <div>
//                 <Label>Received Payment Date</Label>
//                 <DatePicker
//                   id="payment-date"
//                   placeholder="Select payment date"
//                   onChange={(dates, currentDateString) =>
//                     setPaymentDate(currentDateString)
//                   }
//                 />
//               </div>

//               {/* Upload Receipt */}
//               <div>
//                 <Label>Upload Receipt</Label>
//                 <FileInput id="fileUpload" onChange={handleReceiptChange} />
//                 {receiptPreview && (
//                   <div className="mt-2 w-40 h-40 border rounded overflow-hidden">
//                     <img
//                       src={receiptPreview}
//                       alt="Receipt Preview"
//                       className="w-full h-full object-contain"
//                     />
//                   </div>
//                 )}
//               </div>
//             </div>
//           </ComponentCard>
//         </div>
//       </div>

//       <Button className="Submitbtn" onClick={handlesubmit} disabled={loading}>
//         {loading ? "Submitting..." : "Submit"}
//       </Button>
//       <Button className="canclebtn" onClick={() => navigate(-1)}>
//         Cancel
//       </Button>
//     </div>
//   );
// };

// export default Addclientpayment;
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
import { toast } from "react-toastify";
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

  const location = useLocation();
  const { clientId, siteId, blockId } = location.state || {};

  const amountTypeOptions = [
    { value: "Principal Amount", label: "Principal Amount" },
    { value: "GST Amount", label: "GST Amount" },
  ];

  // ✅ Validation function
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
      toast.error("Failed to load booking details");
    }
  };

  useEffect(() => {
    loadBooking();
  }, [clientId, siteId, blockId]);

  // ✅ Submit handler
  const handlesubmit = async () => {
    const adminId = getAdminId();

    if (!amountType || !receivedAmount || !paymentDate) {
      toast.error("Please fill in all required fields");
      return;
    }

    // validate before submit
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
        toast.success("Payment added successfully!");

        // Reset form
        setReceivedAmount("");
        setAmountType("");
        setPaymentDate("");
        setReceiptFile(null);
        setReceiptPreview(null);
        setFormError("");

        navigate(-1);
      } else {
        toast.error(res?.message || "Failed to add payment");
      }
    } catch (err) {
      console.error("Error submitting payment:", err);
      toast.error("Submission failed");
    } finally {
      setLoading(false);
    }
  };

  // ✅ Dynamically decide max allowed
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
                <Input
                  disabled
                  value={bookingDetails?.client_name}
                  className="disabledInput"
                />
              </div>
               <div className="grid grid-cols-3 gap-6">
                <div>
                  <Label>Principal Amount</Label>
                  <Input
                    disabled
                    value={bookingDetails?.property_amount}
                    className="disabledInput"
                  />
                </div>

                <div>
                  <Label>GST Amount</Label>
                  <Input
                    disabled
                    value={bookingDetails?.gst_amount}
                    className="disabledInput"
                  />
                </div>

                <div>
                  <Label>Total Amount</Label>
                  <Input
                    disabled
                    value={bookingDetails?.total_amount}
                    className="disabledInput"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-6">
                <div>
                  <Label>Total Received Principal Amount</Label>
                  <Input
                    disabled
                    value={bookingDetails?.received_principal}
                    className="disabledInput"
                  />
                </div>

                <div>
                  <Label>Total Received GST Amount</Label>
                  <Input
                    disabled
                    value={bookingDetails?.received_gst}
                    className="disabledInput"
                  />
                </div>

                <div>
                  <Label>Balance Principal Amount</Label>
                  <Input
                    disabled
                    value={bookingDetails?.balance_principal}
                    className="disabledInput"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-6">
                <div>
                  <Label>Balance GST Amount</Label>
                  <Input
                    disabled
                    value={bookingDetails?.balance_gst}
                    className="disabledInput"
                  />
                </div>
              </div>

              {/* Amount Type */}
              <div>
                <Label>Amount Type</Label>
                <Select
                  options={amountTypeOptions}
                  value={amountType}
                  onChange={(val) => {
                    setAmountType(val);
                    setReceivedAmount("");
                    setFormError("");
                  }}
                  placeholder="Select Amount Type"
                />
              </div>

              {/* Received Amount with validation */}
              <div>
                <Label>Received Amount</Label>
                <Input
                  type="number"
                  value={receivedAmount}
                  onChange={(e) => {
                    const value = Number(e.target.value);
                    setReceivedAmount(value);
                    const error = validateAmount(value);
                    setFormError(error);
                  }}
                  placeholder="Enter amount"
                  className="mt-1"
                />
                {formError && (
                  <p className="text-red-500 text-sm mt-1">{formError}</p>
                )}
                {amountType && (
                  <p className="text-xs text-gray-500 mt-1">
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
                <Label>Received Payment Date</Label>
                <DatePicker
                  id="payment-date"
                  placeholder="Select payment date"
                  onChange={(dates, currentDateString) =>
                    setPaymentDate(currentDateString)
                  }
                />
              </div>

              {/* Upload Receipt */}
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
