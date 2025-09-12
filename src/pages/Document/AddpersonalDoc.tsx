import React, { useState, useEffect } from "react";
import PageMeta from "../../components/common/PageMeta";
import ComponentCard from "../../components/common/ComponentCard";
import Label from "../../components/form/Label";
import Input from "../../components/form/input/InputField";
import FileInput from "../../components/form/input/FileInput";
import { toast } from "react-toastify";
import Button from "../../components/ui/button/Button";
import SiteSelector from "../../components/form/input/SelectSiteinput";
import Select from "../../components/form/Select"; // your custom Select
import { useNavigate } from "react-router-dom";
import { submitPersonalDocument } from "../../utils/Handlerfunctions/formSubmitHandlers";
import {
  fetchUnitNumbersBySite,
  fetchClientNamesByBlockId,
} from "../../utils/Handlerfunctions/getdata"; // new API handler

const AddpersonalDoc = () => {
  const [documentName, setDocumentName] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [receiptPreview, setReceiptPreview] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [clientOptions, setClientOptions] = useState([]);
  const [selectedSite, setSelectedSite] = useState<string>("");
  const [unitOptions, setUnitOptions] = useState<
    { value: string; label: string }[]
  >([]);
 
const [selectedUnit, setSelectedUnit] = useState<string>("");   // holds block_detail_id
const [selectedClient, setSelectedClient] = useState<string>(""); // holds client_id
  const navigate = useNavigate();

  // Fetch unit numbers when site changes
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

  useEffect(() => {
    if (!selectedSite) return;
    const loadBlocks = async () => {
      const units = await fetchUnitNumbersBySite(Number(selectedSite));
      setUnitOptions(units);
      setSelectedUnit(""); // reset when site changes
      setClientOptions([]);
      setSelectedClient("");
    };
    loadBlocks();
  }, [selectedSite]);

  useEffect(() => {
    if (!selectedUnit) return;
    const loadClients = async () => {
      const clients = await fetchClientNamesByBlockId(Number(selectedUnit));
      setClientOptions(clients);
      setSelectedClient(""); // reset when block changes
    };
    loadClients();
  }, [selectedUnit]);

  // File upload preview
  const handleReceiptChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const uploadedFile = e.target.files?.[0] || null;
    setFile(uploadedFile);
    if (uploadedFile) {
      setReceiptPreview(URL.createObjectURL(uploadedFile));
    }
  };

const handleSubmit = async () => {
  if (!selectedSite) {
    toast.error("Please select a site");
    return;
  }
  if (!selectedUnit) {
    toast.error("Please select a Unit Number");
    return;
  }
  if (!selectedClient) {
    toast.error("Please select a Client");
    return;
  }
  if (!documentName) {
    toast.error("Please enter a document name");
    return;
  }
  if (!file) {
    toast.error("Please upload a document file");
    return;
  }

  setLoading(true);
  try {
    const res = await submitPersonalDocument(
      file,
      documentName,
      Number(selectedSite),   // site_detail_id
      Number(selectedClient), // client_id ✅
      Number(selectedUnit)    // block_detail_id ✅
    );

    if (res) {
      toast.success("Document submitted successfully!");
      setDocumentName("");
      setFile(null);
      setReceiptPreview(null);
      setSelectedSite("");
      setSelectedUnit("");
      setSelectedClient("");
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
      <PageMeta title="Add Personal Document Details" />

      <div className="grid grid-cols-1 gap-6 xl:grid-cols-1">
        <div className="space-y-6">
          <ComponentCard title="Add Personal Document Details">
            <div className="space-y-6">
              {/* Select Site */}
              <SiteSelector value={selectedSite} onChange={setSelectedSite} />

              {/* Unit Number - shown only if site selected */}
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
              {selectedUnit && (
                <>
                  <Label>Select Client</Label>
                  <Select
                    options={clientOptions}
                    value={selectedClient}
                    onChange={setSelectedClient}
                    placeholder="Select Client"
                  />
                </>
              )}

              {/* Document Name */}
              <div>
                <Label>Enter Document Name</Label>
                <Input
                  placeholder="Enter document name"
                  value={documentName}
                  onChange={(e) => setDocumentName(e.target.value)}
                />
              </div>

              {/* Upload Document */}
              <div>
                <Label>Upload Document</Label>
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

      {/* Buttons */}
      <Button className="Submitbtn" onClick={handleSubmit} disabled={loading}>
        {loading ? "Submitting..." : "Submit"}
      </Button>
      <Button className="canclebtn" onClick={() => navigate(-1)}>
        Cancel
      </Button>
    </div>
  );
};

export default AddpersonalDoc;
