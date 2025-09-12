import React, { useState } from "react";
import PageMeta from "../../components/common/PageMeta";
import ComponentCard from "../../components/common/ComponentCard";
import Label from "../../components/form/Label";
import Input from "../../components/form/input/InputField";
import FileInput from "../../components/form/input/FileInput";
import SiteSelector from "../../components/form/input/SelectSiteinput";
import Button from "../../components/ui/button/Button";
import { toast } from "react-toastify";
import { submitCommonDocument } from "../../utils/Handlerfunctions/formSubmitHandlers";
import { useNavigate } from "react-router-dom";
const Addcommunoc = () => {
  const [receiptPreview, setReceiptPreview] = useState<string | null>(null);
  const [documentName, setDocumentName] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [selectedSite, setSelectedSite] = useState<string>("");
const navigate = useNavigate();
  const handleReceiptChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0] || null;
    if (selectedFile) {
      setFile(selectedFile);
      setReceiptPreview(URL.createObjectURL(selectedFile));
    }
  };

  const handleSubmit = async () => {
  if (!selectedSite) {
    toast.error("Please select a site");
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
    // Convert selectedSite to number because API expects site_detail_id as number
    const res = await submitCommonDocument(file, documentName, Number(selectedSite));
    if (res) {
      toast.success("Document submitted successfully!");

      // reset form
      setDocumentName("");
      setFile(null);
      setReceiptPreview(null);
      setSelectedSite("");

      // redirect to common documents page
      navigate("/admin/common_documents", { replace: true });
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
      <PageMeta title="Add Commun Document Details" />
      <div className="grid grid-cols-1 gap-6 xl:grid-cols-1">
        <div className="space-y-6">
          <ComponentCard title="Add Commun Document Details">
            <div className="space-y-6">
              {/* Select Site */}
              <SiteSelector value={selectedSite} onChange={setSelectedSite} />

              {/* Document Name */}
              <div>
                <Label>Enter Document Name</Label>
                <Input
                  placeholder="Enter document name"
                  value={documentName}
                  onChange={(e) => setDocumentName(e.target.value)}
                />
              </div>

              {/* File Upload */}
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

      <div className="mt-4 flex gap-2">
        <Button className="Submitbtn" onClick={handleSubmit} disabled={loading}>
          {loading ? "Submitting..." : "Submit"}
        </Button>
        <Button className="canclebtn" onClick={() => window.location.reload()}>
          Cancel
        </Button>
      </div>
    </div>
  );
};

export default Addcommunoc;
