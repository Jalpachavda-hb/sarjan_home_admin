
// import React, { useState, useEffect } from "react";

// import ComponentCard from "../../components/common/ComponentCard";
// import Label from "../../components/form/Label";
// import Input from "../../components/form/input/InputField";
// import FileInput from "../../components/form/input/FileInput";
// import Select from "../../components/form/Select";
// import DatePicker from "../../components/form/date-picker";
// import Button from "../../components/ui/button/Button";
// import SiteSelector from "../../components/form/input/SelectSiteinput";
// import { useNavigate } from "react-router-dom";
// import { addPaymentDetail } from "../../utils/Handlerfunctions/formSubmitHandlers";
// import {
//   fetchUnitNumbersBySite,
//   fetchClientNamesByBlockId,
//   getAdminId,
// } from "../../utils/Handlerfunctions/getdata";

// const AddPaymentDetails = () => {
//   const navigate = useNavigate();

//   const [selectedSite, setSelectedSite] = useState<string>("");
//   const [unitOptions, setUnitOptions] = useState<{ value: string; label: string }[]>([]);
//   const [selectedUnit, setSelectedUnit] = useState<string>("");
//   const [clientOptions, setClientOptions] = useState<{ value: string; label: string }[]>([]);
//   const [selectedClient, setSelectedClient] = useState<string>("");

//   const [receivedAmount, setReceivedAmount] = useState<number | "">("");
//   const [amountType, setAmountType] = useState<string>("");
//   const [paymentDate, setPaymentDate] = useState<string>("");
//   const [receiptFile, setReceiptFile] = useState<File | null>(null);
//   const [receiptPreview, setReceiptPreview] = useState<string | null>(null);
//   const [loading, setLoading] = useState(false);

//   // error state
//   const [errors, setErrors] = useState<Record<string, string>>({});

//   const amountTypeOptions = [
//     { value: "Principal Amount", label: "Principal Amount" },
//     { value: "GST Amount", label: "GST Amount" },
//   ];

//   // Fetch units when site changes
//   useEffect(() => {
//     if (!selectedSite) {
//       setUnitOptions([]);
//       setSelectedUnit("");
//       setClientOptions([]);
//       setSelectedClient("");
//       return;
//     }
//     const loadUnits = async () => {
//       const units = await fetchUnitNumbersBySite(Number(selectedSite));
//       setUnitOptions(units);
//       setSelectedUnit("");
//       setClientOptions([]);
//       setSelectedClient("");
//     };
//     loadUnits();
//   }, [selectedSite]);

//   // Fetch clients when unit changes
//   useEffect(() => {
//     if (!selectedUnit) return;
//     const loadClients = async () => {
//       const clients = await fetchClientNamesByBlockId(Number(selectedUnit));
//       setClientOptions(clients);
//       setSelectedClient("");
//     };
//     loadClients();
//   }, [selectedUnit]);

//   const handleReceiptChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//     const file = e.target.files?.[0] || null;
//     setReceiptFile(file);
//     setReceiptPreview(file ? URL.createObjectURL(file) : null);
//   };

//   const validateForm = () => {
//     const newErrors: Record<string, string> = {};
//     if (!selectedSite) newErrors.site = "Site is required";
//     if (!selectedUnit) newErrors.unit = "Unit number is required";
//     if (!selectedClient) newErrors.client = "Client is required";
//     if (!receivedAmount) newErrors.amount = "Amount is required";
//     if (!amountType) newErrors.amountType = "Amount type is required";
//     if (!paymentDate) newErrors.date = "Payment date is required";
//     return newErrors;
//   };

//   const handleSubmit = async () => {
//     const adminId = getAdminId();
//     const newErrors = validateForm();
//     setErrors(newErrors);

//     if (Object.keys(newErrors).length > 0) return;

//     setLoading(true);
//     try {
//       await addPaymentDetail({
//         adminId,
//         clientId: selectedClient,
//         siteDetailId: selectedSite,
//         blockDetailsId: selectedUnit,
//         receivedAmountType: amountType,
//         receivedAmount,
//         paymentDate,
//         receiptFile,
//       });

//       // reset form
//       setSelectedSite("");
//       setSelectedUnit("");
//       setSelectedClient("");
//       setReceivedAmount("");
//       setAmountType("");
//       setPaymentDate("");
//       setReceiptFile(null);
//       setReceiptPreview(null);
//       setErrors({});

//       navigate("/admin/payments", { replace: true });
//     } catch (err) {
//       console.error(err);
//     } finally {
//       setLoading(false);
//     }
//   };

//   // helper to clear errors on change
//   const clearError = (field: string) => {
//     if (errors[field]) {
//       setErrors((prev) => {
//         const updated = { ...prev };
//         delete updated[field];
//         return updated;
//       });
//     }
//   };

//   return (
//     <div>
//       <PageMeta title="Add Payment Details" description="Add new payment details" />
//       <div className="grid grid-cols-1 gap-6 xl:grid-cols-1">
//         <div className="space-y-6">
//           <ComponentCard title="Add Payment Details">
//             <div className="space-y-6">
//               {/* Select Site */}
//               <div>
             
//                 <SiteSelector
//                   value={selectedSite}
//                   onChange={(val) => {
//                     setSelectedSite(val);
//                     clearError("site");
//                   }}
//                 />
//                 {errors.site && <p className="text-red-500 text-sm">{errors.site}</p>}
//               </div>

//               {/* Unit Number */}
//               {selectedSite && (
//                 <div>
//                   <Label>
//                     Unit Number <span className="text-red-500">*</span>
//                   </Label>
//                   <Select
//                     options={unitOptions}
//                     value={selectedUnit}
//                     onChange={(val) => {
//                       setSelectedUnit(val);
//                       clearError("unit");
//                     }}
//                     placeholder="Select Unit Number"
//                   />
//                   {errors.unit && <p className="text-red-500 text-sm">{errors.unit}</p>}
//                 </div>
//               )}

//               {/* Client */}
//               {selectedUnit && (
//                 <div>
//                   <Label>
//                     Select Client <span className="text-red-500">*</span>
//                   </Label>
//                   <Select
//                     options={clientOptions}
//                     value={selectedClient}
//                     onChange={(val) => {
//                       setSelectedClient(val);
//                       clearError("client");
//                     }}
//                     placeholder="Select Client"
//                   />
//                   {errors.client && <p className="text-red-500 text-sm">{errors.client}</p>}
//                 </div>
//               )}

//               {/* Amount */}
//               <div>
//                 <Label>
//                   Received Amount <span className="text-red-500">*</span>
//                 </Label>
//                 <Input
//                   type="number"
//                   value={receivedAmount}
//                   onChange={(e) => {
//                     setReceivedAmount(Number(e.target.value));
//                     clearError("amount");
//                   }}
//                   placeholder="Enter amount"
//                 />
//                 {errors.amount && <p className="text-red-500 text-sm">{errors.amount}</p>}
//               </div>

//               {/* Amount Type */}
//               <div>
//                 <Label>
//                   Amount Type <span className="text-red-500">*</span>
//                 </Label>
//                 <Select
//                   options={amountTypeOptions}
//                   value={amountType}
//                   onChange={(val) => {
//                     setAmountType(val);
//                     clearError("amountType");
//                   }}
//                   placeholder="Select Amount Type"
//                 />
//                 {errors.amountType && (
//                   <p className="text-red-500 text-sm">{errors.amountType}</p>
//                 )}
//               </div>

//               {/* Payment Date */}
//               <div>
//                 <Label>
//                   Received Payment Date <span className="text-red-500">*</span>
//                 </Label>
//                 <DatePicker
//                   id="payment-date"
//                   placeholder="Select payment date"
//                   onChange={(_dates, currentDateString) => {
//                     setPaymentDate(currentDateString);
//                     clearError("date");
//                   }}
//                 />
//                 {errors.date && <p className="text-red-500 text-sm">{errors.date}</p>}
//               </div>

//               {/* Upload Receipt (optional) */}
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

//       <Button className="Submitbtn" onClick={handleSubmit} disabled={loading}>
//         {loading ? "Submitting..." : "Submit"}
//       </Button>
//       <Button className="canclebtn" onClick={() => navigate(-1)}>
//         Cancel
//       </Button>
//     </div>
//   );
// };

// export default AddPaymentDetails;


import React, { useState, useEffect } from "react";
import ComponentCard from "../../components/common/ComponentCard";
import Label from "../../components/form/Label";
import Input from "../../components/form/input/InputField";
import FileInput from "../../components/form/input/FileInput";
import Select from "../../components/form/Select";
import DatePicker from "../../components/form/date-picker";
import Button from "../../components/ui/button/Button";
import SiteSelector from "../../components/form/input/SelectSiteinput";
import { useNavigate } from "react-router-dom";
import { addPaymentDetail } from "../../utils/Handlerfunctions/formSubmitHandlers";
import {
  fetchUnitNumbersBySite,
  fetchClientNamesByBlockId,
  getAdminId,
} from "../../utils/Handlerfunctions/getdata";

const AddPaymentDetails = () => {
  const navigate = useNavigate();

  const [selectedSite, setSelectedSite] = useState<string>("");
  const [unitOptions, setUnitOptions] = useState<{ value: string; label: string }[]>([]);
  const [selectedUnit, setSelectedUnit] = useState<string>("");
  const [clientOptions, setClientOptions] = useState<{ value: string; label: string }[]>([]);
  const [selectedClient, setSelectedClient] = useState<string>("");

  const [receivedAmount, setReceivedAmount] = useState<number | "">("");
  const [amountType, setAmountType] = useState<string>("");
  const [paymentDate, setPaymentDate] = useState<string>("");
  const [receiptFile, setReceiptFile] = useState<File | null>(null);
  const [receiptPreview, setReceiptPreview] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const [errors, setErrors] = useState<Record<string, string>>({});

  const amountTypeOptions = [
    { value: "Principal Amount", label: "Principal Amount" },
    { value: "GST Amount", label: "GST Amount" },
  ];

  // Fetch units when site changes
  useEffect(() => {
    if (!selectedSite) {
      setUnitOptions([]);
      setSelectedUnit("");
      setClientOptions([]);
      setSelectedClient("");
      return;
    }
    const loadUnits = async () => {
      const units = await fetchUnitNumbersBySite(Number(selectedSite));
      setUnitOptions(units);
      setSelectedUnit("");
      setClientOptions([]);
      setSelectedClient("");
    };
    loadUnits();
  }, [selectedSite]);

  // Fetch clients when unit changes
  useEffect(() => {
    if (!selectedUnit) return;
    const loadClients = async () => {
      const clients = await fetchClientNamesByBlockId(Number(selectedUnit));
      setClientOptions(clients);
      setSelectedClient("");
    };
    loadClients();
  }, [selectedUnit]);

  const handleReceiptChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    setReceiptFile(file);
    setReceiptPreview(file ? URL.createObjectURL(file) : null);
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    if (!selectedSite) newErrors.site = "Site is required";
    if (!selectedUnit) newErrors.unit = "Unit number is required";
    if (!selectedClient) newErrors.client = "Client is required";
    if (!receivedAmount) newErrors.amount = "Amount is required";
    if (!amountType) newErrors.amountType = "Amount type is required";
    if (!paymentDate) newErrors.date = "Payment date is required";
    return newErrors;
  };

  const handleSubmit = async () => {
    const adminId = getAdminId();
    const newErrors = validateForm();
    setErrors(newErrors);
    if (Object.keys(newErrors).length > 0) return;

    setLoading(true);
    try {
      await addPaymentDetail({
        adminId,
        clientId: selectedClient,
        siteDetailId: selectedSite,
        blockDetailsId: selectedUnit,
        receivedAmountType: amountType,
        receivedAmount,
        paymentDate,
        receiptFile,
      });

      // Reset form
      setSelectedSite("");
      setSelectedUnit("");
      setSelectedClient("");
      setReceivedAmount("");
      setAmountType("");
      setPaymentDate("");
      setReceiptFile(null);
      setReceiptPreview(null);
      setErrors({});

      navigate("/admin/payments", { replace: true });
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const clearError = (field: string) => {
    if (errors[field]) {
      setErrors((prev) => {
        const updated = { ...prev };
        delete updated[field];
        return updated;
      });
    }
  };

  return (
    <div>
      <div className="grid grid-cols-1 gap-6 xl:grid-cols-1">
        <div className="space-y-6">
          <ComponentCard title="Add Payment Details">
            <div className="space-y-6">
              {/* Site Selector */}
              <div>
                <SiteSelector
                  value={selectedSite}
                  onChange={(val) => {
                    setSelectedSite(val);
                    clearError("site");
                  }}
                />
                {errors.site && <p className="text-red-500 text-sm">{errors.site}</p>}
              </div>

              {/* Unit Number */}
              {selectedSite && (
                <div>
                  <Label>
                    Unit Number <span className="text-red-500">*</span>
                  </Label>
                  <Select
                    options={unitOptions}
                    value={selectedUnit}
                    onChange={(val) => {
                      setSelectedUnit(val);
                      clearError("unit");
                    }}
                    placeholder="Select Unit Number"
                  />
                  {errors.unit && <p className="text-red-500 text-sm">{errors.unit}</p>}
                </div>
              )}

              {/* Client */}
              {selectedUnit && (
                <div>
                  <Label>
                    Select Client <span className="text-red-500">*</span>
                  </Label>
                  <Select
                    options={clientOptions}
                    value={selectedClient}
                    onChange={(val) => {
                      setSelectedClient(val);
                      clearError("client");
                    }}
                    placeholder="Select Client"
                  />
                  {errors.client && <p className="text-red-500 text-sm">{errors.client}</p>}
                </div>
              )}

              {/* Received Amount */}
              <div>
                <Label>
                  Received Amount <span className="text-red-500">*</span>
                </Label>
                <Input
                  type="number"
                  value={receivedAmount}
                  onChange={(e) => {
                    setReceivedAmount(Number(e.target.value));
                    clearError("amount");
                  }}
                  placeholder="Enter amount"
                />
                {errors.amount && <p className="text-red-500 text-sm">{errors.amount}</p>}
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
                    clearError("amountType");
                  }}
                  placeholder="Select Amount Type"
                />
                {errors.amountType && <p className="text-red-500 text-sm">{errors.amountType}</p>}
              </div>

              {/* Payment Date */}
              <div>
                <Label>
                  Received Payment Date <span className="text-red-500">*</span>
                </Label>
                <DatePicker
                  id="payment-date"
                  placeholder="Select payment date"
                  onChange={(dateStr: string) => {
                    setPaymentDate(dateStr);
                    clearError("date");
                  }}
                />
                {errors.date && <p className="text-red-500 text-sm">{errors.date}</p>}
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

      <Button className="Submitbtn" onClick={handleSubmit} disabled={loading}>
        {loading ? "Submitting..." : "Submit"}
      </Button>
      <Button className="canclebtn" onClick={() => navigate(-1)}>
        Cancel
      </Button>
    </div>
  );
};

export default AddPaymentDetails;
