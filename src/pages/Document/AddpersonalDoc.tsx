import React, { useState, useEffect } from "react";

import ComponentCard from "../../components/common/ComponentCard";
import Label from "../../components/form/Label";
import Input from "../../components/form/input/InputField";
import FileInput from "../../components/form/input/FileInput";
import { toast } from "react-toastify";
import Button from "../../components/ui/button/Button";
import SiteSelector from "../../components/form/input/SelectSiteinput";
import Select from "../../components/form/Select";
import { useNavigate } from "react-router-dom";
import { submitPersonalDocument } from "../../utils/Handlerfunctions/formSubmitHandlers";
import {
  fetchUnitNumbersBySite,
  fetchClientNamesByBlockId,
} from "../../utils/Handlerfunctions/getdata";

const AddpersonalDoc = () => {
  const [documentName, setDocumentName] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [receiptPreview, setReceiptPreview] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [clientOptions, setClientOptions] = useState<
    { value: string; label: string }[]
  >([]);
  const [selectedSite, setSelectedSite] = useState<string>("");
  const [unitOptions, setUnitOptions] = useState<
    { value: string; label: string }[]
  >([]);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [selectedUnit, setSelectedUnit] = useState<string>("");
  const [selectedClient, setSelectedClient] = useState<string>("");

  const navigate = useNavigate();

  // Load units when site changes
  useEffect(() => {
    const loadUnits = async () => {
      if (!selectedSite) {
        setUnitOptions([]);
        setSelectedUnit("");
        return;
      }
      const units = await fetchUnitNumbersBySite(Number(selectedSite));
      setUnitOptions(units);
    };
    loadUnits();
  }, [selectedSite]);

  // Load clients when unit changes
  useEffect(() => {
    if (!selectedUnit) return;
    const loadClients = async () => {
      const clients = await fetchClientNamesByBlockId(Number(selectedUnit));
      setClientOptions(clients);
      setSelectedClient(""); // reset client when unit changes
    };
    loadClients();
  }, [selectedUnit]);

  // File upload preview
  const handleReceiptChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const uploadedFile = e.target.files?.[0] || null;
    setFile(uploadedFile);
    if (uploadedFile) {
      setReceiptPreview(URL.createObjectURL(uploadedFile));
       setErrors({ ...errors, file: "" });
    }
  };

  // Validation on submit only
  const validateForm = () => {
    const newErrors: { [key: string]: string } = {};

    if (!selectedSite) newErrors.selectedSite = "Please select a site";
    if (!selectedUnit) newErrors.selectedUnit = "Please select a unit number";
    if (!selectedClient) newErrors.selectedClient = "Please select a client";
    if (!documentName.trim())
      newErrors.documentName = "Please enter a document name";
    if (!file) newErrors.file = "Please upload a document file";

    setErrors(newErrors);

    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;

    setLoading(true);
    try {
      const res = await submitPersonalDocument(
        file!,
        documentName,
        Number(selectedSite),
        Number(selectedClient),
        Number(selectedUnit)
      );

      if (res) {
        toast.success("Document submitted successfully!");
        // Reset form
        setDocumentName("");
        setFile(null);
        setReceiptPreview(null);
        setSelectedSite("");
        setSelectedUnit("");
        setSelectedClient("");
        setErrors({});
        navigate("/admin/personal_documents", { replace: true });
      }
    } catch (error) {
      console.error(error);
      toast.error("Submission failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
    

      <div className="grid grid-cols-1 gap-6 xl:grid-cols-1">
        <div className="space-y-6">
          <ComponentCard title="Add Personal Document Details">
            <div className="space-y-6">
              {/* Site Selector */}
              <div>
                <SiteSelector
                  value={selectedSite}
                  onChange={(val) => {
                    setSelectedSite(val);
                    setErrors((prev) => ({ ...prev, selectedSite: "" }));
                  }}
                />
                {errors.selectedSite && (
                  <p className="text-red-500 text-sm">{errors.selectedSite}</p>
                )}
              </div>

              {/* Unit Selector */}
              {selectedSite && (
                <div>
                  <Label>
                    Unit Number <span className="text-red-500">*</span>
                  </Label>
                  <Select
                    options={unitOptions}
                    value={selectedUnit}
                    // onChange={setSelectedUnit}

                    onChange={(val) => {
                      setSelectedUnit(val);
                      setErrors((prev) => ({ ...prev, selectedUnit: "" }));
                    }}
                    placeholder="Select Unit Number"
                  />
                  {errors.selectedUnit && (
                    <p className="text-red-500 text-sm">
                      {errors.selectedUnit}
                    </p>
                  )}
                </div>
              )}

              {/* Client Selector */}
              {selectedUnit && (
                <div>
                  <Label>
                    Select Client <span className="text-red-500">*</span>
                  </Label>
                  <Select
                    options={clientOptions}
                    value={selectedClient}
                    // onChange={setSelectedClient}

                    onChange={(val) => {
                      setSelectedClient(val);
                      setErrors((prev) => ({ ...prev, selectedClient: "" }));
                    }}
                    placeholder="Select Client"
                  />
                  {errors.selectedClient && (
                    <p className="text-red-500 text-sm">
                      {errors.selectedClient}
                    </p>
                  )}
                </div>
              )}

              {/* Document Name */}
              <div>
                <Label>
                  Document Name <span className="text-red-500">*</span>
                </Label>
                <Input
                  placeholder="Enter document name"
                  value={documentName}
                  // onChange={(e) => setDocumentName(e.target.value)}

                  onChange={(e) => {
                    setDocumentName(e.target.value);
                    setErrors({ ...errors, documentName: "" }); // <-- remove this line
                  }}
                />
                {errors.documentName && (
                  <p className="text-red-500 text-sm">{errors.documentName}</p>
                )}
              </div>

              {/* File Upload */}
              <div>
                <Label>
                  Upload Document <span className="text-red-500">*</span>
                </Label>
                <FileInput id="fileUpload"
                
                
                
                
                onChange={handleReceiptChange} 
                
                
                />
                {errors.file && (
                  <p className="text-red-500 text-sm">{errors.file}</p>
                )}
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

      {/* Buttons */}
      <div className="mt-4 flex gap-2">
        <Button className="Submitbtn" onClick={handleSubmit} disabled={loading}>
          {loading ? "Submitting..." : "Submit"}
        </Button>
        <Button className="canclebtn" onClick={() => navigate(-1)}>
          Cancel
        </Button>
      </div>
    </div>
  );
};

export default AddpersonalDoc;
