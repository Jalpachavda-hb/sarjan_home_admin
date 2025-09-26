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
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const navigate = useNavigate();
  const handleReceiptChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0] || null;
    if (selectedFile) {
      setFile(selectedFile);
      setReceiptPreview(URL.createObjectURL(selectedFile));
       setErrors({ ...errors, file: "" });
    }
  };

  const validateForm = () => {
    let newErrors: { [key: string]: string } = {};

    if (!selectedSite) newErrors.selectedSite = "Please select a site";
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
      const res = await submitCommonDocument(
        file!,
        documentName,
        Number(selectedSite)
      );
      if (res) {
        toast.success("Document submitted successfully!");

        // reset form
        setDocumentName("");
        setFile(null);
        setReceiptPreview(null);
        setSelectedSite("");
        setErrors({});

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
      <div className="grid grid-cols-1 gap-6 xl:grid-cols-1">
        <div className="space-y-6">
          <ComponentCard title="Add Commun Document Details">
            <div className="space-y-6">
              {/* Select Site */}
              <SiteSelector value={selectedSite}
              //  onChange={setSelectedSite}
               
               onChange={(val) => {
                      setSelectedSite(val);
                      setErrors((prev) => ({ ...prev, selectedSite: "" }));
                    }}




               />
              {errors.selectedSite && (
                <p className="text-red-500 text-sm ">{errors.selectedSite}</p>
              )}

              {/* Document Name */}
              <div>
                <Label>Enter Document Name  <span className="text-red-500">*</span></Label>
                <Input
                  placeholder="Enter document name"
                  value={documentName}
                  onChange={(e) => {
                    setDocumentName(e.target.value);
                    setErrors({ ...errors, documentName: "" }); // <-- remove this line
                  }}
                />
                {errors.documentName && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.documentName}
                  </p>
                )}
              </div>

              {/* File Upload */}
              <div>
                <Label>Upload Document  <span className="text-red-500">*</span></Label>
                <FileInput id="fileUpload" onChange={handleReceiptChange} />
                {errors.file && (
                  <p className="text-red-500 text-sm mt-1">{errors.file}</p>
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
