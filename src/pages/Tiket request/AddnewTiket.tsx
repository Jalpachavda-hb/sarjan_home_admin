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

  // ✅ Load unit numbers when site changes
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

  // ✅ Load clients when unit changes
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

  // ✅ Handle submit

  // ✅ Handle cancel
  const handleCancel = () => {
    setSelectedSite("");
    setSelectedUnit("");
    setSelectedClient("");
    setTitle("");
    setDescription("");
    setUnitOptions([]);
    setClientOptions([]);
  };
  const navigate = useNavigate();
  const handleSubmit = async () => {
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

  return (
    <div>
      <PageMeta title="Add New Ticket" />

      <div className="grid grid-cols-1 gap-6 xl:grid-cols-1">
        <div className="space-y-6">
          <ComponentCard title="Add Ticket">
            <div className="space-y-6">
              {/* Step 1: Select Site */}
              <SiteSelector value={selectedSite} onChange={setSelectedSite} />

              {/* Step 2: Unit Number */}
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

              {/* Step 3: Select Client */}
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

              {/* Step 4: Title + Description */}

              <div>
                <Label htmlFor="title">Title</Label>
                <Input
                  type="text"
                  id="title"
                  placeholder="Enter Title"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                />
              </div>

              <div>
                <Label>Description</Label>
                <TextArea
                  placeholder="Enter description"
                  value={description}
                  onChange={setDescription}
                />
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
