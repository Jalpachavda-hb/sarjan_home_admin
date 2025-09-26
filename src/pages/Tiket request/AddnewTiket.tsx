import { useState, useEffect } from "react";
import { toast } from "react-toastify";
import PageMeta from "../../components/common/PageMeta";
import ComponentCard from "../../components/common/ComponentCard";
import Label from "../../components/form/Label";
import Input from "../../components/form/input/InputField";
import Button from "../../components/ui/button/Button";
import TextArea from "../../components/form/input/TextArea";
import SiteSelector from "../../components/form/input/SelectSiteinput";
import Select from "../../components/form/Select";
import { useNavigate } from "react-router-dom";
import {
  fetchUnitNumbersBySite,
  fetchClientNamesByBlockId,
} from "../../utils/Handlerfunctions/getdata";
import { addnewTicket } from "../../utils/Handlerfunctions/formSubmitHandlers";

const AddnewTiket = () => {
  const [selectedSite, setSelectedSite] = useState<string>("");
  const [unitOptions, setUnitOptions] = useState<
    { value: string; label: string }[]
  >([]);
  const [selectedUnit, setSelectedUnit] = useState<string>("");
  const [clientOptions, setClientOptions] = useState<
    { value: string; label: string }[]
  >([]);
  const [selectedClient, setSelectedClient] = useState<string>("");
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");

  const [errors, setErrors] = useState<{
    site?: string;
    unit?: string;
    client?: string;
    title?: string;
    description?: string;
  }>({});

  const navigate = useNavigate();

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

  useEffect(() => {
    if (!selectedUnit) {
      setClientOptions([]);
      setSelectedClient("");
      return;
    }

    const loadClients = async () => {
      const clients = await fetchClientNamesByBlockId(Number(selectedUnit));
      setClientOptions(clients);
      setSelectedClient("");
    };

    loadClients();
  }, [selectedUnit]);

  const handleCancel = () => {
    setSelectedSite("");
    setSelectedUnit("");
    setSelectedClient("");
    setTitle("");
    setDescription("");
    setUnitOptions([]);
    setClientOptions([]);
    setErrors({});
    navigate("/admin/ticket-request/mytiket");
  };

  // Validate form
  const validateForm = () => {
    const newErrors: typeof errors = {};
    if (!selectedSite) newErrors.site = "Please select a site";
    if (!selectedUnit) newErrors.unit = "Please select a unit number";
    if (!selectedClient) newErrors.client = "Please select a client";
    if (!title.trim()) newErrors.title = "Title is required";
    if (!description.trim()) newErrors.description = "Description is required";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validateForm()) {
      // toast.error("Please fix the errors before submitting!");
      return;
    }

    try {
      const formData = new FormData();
      formData.append("site_detail_id", selectedSite);
      formData.append("unit_number", selectedUnit);
      formData.append("client_id", selectedClient);
      formData.append("title", title);
      formData.append("message", description);

      const res = await addnewTicket(formData);

      if (res.status === 200) {
        toast.success("Ticket submitted successfully!");
        navigate("/admin/ticket-request/mytiket");
      } else {
        toast.error("Failed to submit ticket");
      }
    } catch (error) {
      console.error(error);
      toast.error("Something went wrong!");
    }
  };

  // Helper to clear error when field changes
  const handleFieldChange = (field: string, value: string) => {
    switch (field) {
      case "site":
        setSelectedSite(value);
        if (errors.site) setErrors((prev) => ({ ...prev, site: undefined }));
        break;
      case "unit":
        setSelectedUnit(value);
        if (errors.unit) setErrors((prev) => ({ ...prev, unit: undefined }));
        break;
      case "client":
        setSelectedClient(value);
        if (errors.client)
          setErrors((prev) => ({ ...prev, client: undefined }));
        break;
      case "title":
        setTitle(value);
        if (errors.title) setErrors((prev) => ({ ...prev, title: undefined }));
        break;
      case "description":
        setDescription(value);
        if (errors.description)
          setErrors((prev) => ({ ...prev, description: undefined }));
        break;
    }
  };

  return (
    <div>
      <div className="grid grid-cols-1 gap-6 xl:grid-cols-1">
        <div className="space-y-6">
          <ComponentCard title="Add Ticket">
            <div className="space-y-6">
              {/* Step 1: Select Site */}
              <SiteSelector
                value={selectedSite}
                onChange={(val) => handleFieldChange("site", val)}
              />
              {errors.site && (
                <p className="text-red-600 text-sm mt-1">{errors.site}</p>
              )}

              {/* Step 2: Unit Number */}
              {selectedSite && (
                <div>
                  <Label>
                    Unit Number <span className="text-red-500">*</span>
                  </Label>
                  <Select
                    options={unitOptions}
                    value={selectedUnit}
                    onChange={(val) => handleFieldChange("unit", val)}
                    placeholder="Select Unit Number"
                  />
                  {errors.unit && (
                    <p className="text-red-600 text-sm mt-1">{errors.unit}</p>
                  )}
                </div>
              )}

              {/* Step 3: Select Client */}
              {selectedUnit && (
                <div>
                  <Label>
                    Select Client <span className="text-red-500">*</span>
                  </Label>
                  <Select
                    options={clientOptions}
                    value={selectedClient}
                    onChange={(val) => handleFieldChange("client", val)}
                    placeholder="Select Client"
                  />
                  {errors.client && (
                    <p className="text-red-600 text-sm mt-1">{errors.client}</p>
                  )}
                </div>
              )}

              {/* Title */}
              <div>
                <Label htmlFor="title">
                  Title <span className="text-red-500">*</span>
                </Label>
                <Input
                  type="text"
                  id="title"
                  placeholder="Enter Title"
                  value={title}
                  onChange={(e) => handleFieldChange("title", e.target.value)}
                />
                {errors.title && (
                  <p className="text-red-600 text-sm mt-1">{errors.title}</p>
                )}
              </div>

              {/* Description */}
              <div>
                <Label>
                  Description <span className="text-red-500">*</span>
                </Label>
                <TextArea
                  placeholder="Enter description"
                  value={description}
                  onChange={setDescription}
                />
                {errors.description && (
                  <p className="text-red-600 text-sm mt-1">
                    {errors.description}
                  </p>
                )}
              </div>
            </div>
          </ComponentCard>
        </div>
      </div>

      {/* Buttons */}
      <div className="mt-6 flex gap-4">
        <Button className="Submitbtn" onClick={handleSubmit}>
          Submit
        </Button>
        <Button className="canclebtn" onClick={handleCancel}>
          Cancel
        </Button>
      </div>
    </div>
  );
};

export default AddnewTiket;
