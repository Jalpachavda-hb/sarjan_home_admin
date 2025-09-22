import React, { useState, useEffect } from "react";
import PageMeta from "../../components/common/PageMeta";
import ComponentCard from "../../components/common/ComponentCard";
import Label from "../../components/form/Label";
import Input from "../../components/form/input/InputField";
import FileInput from "../../components/form/input/FileInput";
import Select from "../../components/form/Select";
import DatePicker from "../../components/form/date-picker";
import Button from "../../components/ui/button/Button";
import SiteSelector from "../../components/form/input/SelectSiteinput";
import { toast } from "react-toastify";
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
  const [unitOptions, setUnitOptions] = useState<
    { value: string; label: string }[]
  >([]);
  const [selectedUnit, setSelectedUnit] = useState<string>("");
  const [clientOptions, setClientOptions] = useState<
    { value: string; label: string }[]
  >([]);
  const [selectedClient, setSelectedClient] = useState<string>("");

  const [receivedAmount, setReceivedAmount] = useState<number | "">("");
  const [amountType, setAmountType] = useState<string>("");
  const [paymentDate, setPaymentDate] = useState<string>("");
  const [receiptFile, setReceiptFile] = useState<File | null>(null);
  const [receiptPreview, setReceiptPreview] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

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

  const handleSubmit = async () => {
    const adminId = getAdminId();

    if (!selectedSite) return toast.error("Please select a site");
    if (!selectedUnit) return toast.error("Please select a Unit Number");
    if (!selectedClient) return toast.error("Please select a Client");
    if (!receivedAmount) return toast.error("Please enter the amount");
    if (!amountType) return toast.error("Please select amount type");
    if (!paymentDate) return toast.error("Please select payment date");

    setLoading(true);
    try {
      await addPaymentDetail({
        adminId, // replace with dynamic admin id
        clientId: selectedClient,
        siteDetailId: selectedSite,
        blockDetailsId: selectedUnit,
        receivedAmountType: amountType,
        receivedAmount,
        paymentDate,
        receiptFile,
      });

      toast.success("Payment added successfully!");
      // reset form
      setSelectedSite("");
      setSelectedUnit("");
      setSelectedClient("");
      setReceivedAmount("");
      setAmountType("");
      setPaymentDate("");
      setReceiptFile(null);
      setReceiptPreview(null);

      navigate("/admin/payments", { replace: true });
    } catch (err) {
      console.error(err);
      toast.error("Submission failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <PageMeta title="Add Payment Details" />
      <div className="grid grid-cols-1 gap-6 xl:grid-cols-1">
        <div className="space-y-6">
          <ComponentCard title="Add Payment Details">
            <div className="space-y-6">
              {/* Select Site */}
              <SiteSelector value={selectedSite} onChange={setSelectedSite} />

              {/* Unit Number */}
              {selectedSite && (
                <div>
                  <Label>Unit Number</Label>
                  <Select
                    options={unitOptions}
                    value={selectedUnit}
                    onChange={setSelectedUnit}
                    placeholder="Select Unit Number"
                  />
                </div>
              )}

              {/* Client */}
              {selectedUnit && (
                <div>
                  <Label>Select Client</Label>
                  <Select
                    options={clientOptions}
                    value={selectedClient}
                    onChange={setSelectedClient}
                    placeholder="Select Client"
                  />
                </div>
              )}

              {/* Amount */}
              <div>
                <Label>Received Amount</Label>
                <Input
                  type="number"
                  value={receivedAmount}
                  onChange={(e) => setReceivedAmount(Number(e.target.value))}
                  placeholder="Enter amount"
                />
              </div>

              {/* Amount Type */}
              <div>
                <Label>Amount Type</Label>
                <Select
                  options={amountTypeOptions}
                  value={amountType}
                  onChange={setAmountType}
                  placeholder="Select Amount Type"
                />
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
