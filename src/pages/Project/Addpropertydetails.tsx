import { useEffect, useState } from "react";
import PageMeta from "../../components/common/PageMeta";
import ComponentCard from "../../components/common/ComponentCard";
import Label from "../../components/form/Label";
import Input from "../../components/form/input/InputField";
import Button from "../../components/ui/button/Button";
import SiteSelector from "../../components/form/input/SelectSiteinput";
import { addPropertyDetails } from "../../utils/Handlerfunctions/formSubmitHandlers";
import { toast } from "react-toastify";
import InputAdornment from "@mui/material/InputAdornment";
import OutlinedInput from "@mui/material/OutlinedInput";
import FormControl from "@mui/material/FormControl";
import { getpropertydetailsByblockId } from "../../utils/Handlerfunctions/getdata";
import { updatePropertyDetails } from "../../utils/Handlerfunctions/formEditHandlers";
import { useParams } from "react-router-dom";
import { useNavigate } from "react-router-dom";

interface Props {
  mode: "add" | "edit";
}

const Addpropertydetails = ({ mode }: Props) => {
  const [selectedSite, setSelectedSite] = useState<string | number>("");
  const [loading, setLoading] = useState(false);
  const { id } = useParams();
  const blockDetailId = id ? parseInt(id) : undefined;
  const [siteName, setSiteName] = useState("");
    const navigate = useNavigate();
  const [formData, setFormData] = useState({
    block: "", // only letter like "K"
    block_number: "", // only number part like "503"
    rera_area: "",
    undivided_landshare: "",
    balcony_area: "",
    wash_area: "",
    terrace_area: "",
    north: "",
    south: "",
    east: "",
    west: "",
  });

  let inputClasses = `h-11 w-full rounded-lg border appearance-none px-4 py-2.5 text-sm shadow-theme-xs placeholder:text-gray-200 
  focus:outline-hidden focus:ring-3 dark:bg-gray-900 dark:text-white/90 dark:placeholder:text-white/30`;

  // fetch details in edit mode
  useEffect(() => {
    if (mode === "edit" && blockDetailId) {
      (async () => {
        try {
          setLoading(true);
          const res = await getpropertydetailsByblockId(
            blockDetailId.toString()
          );
          if (res?.data?.status === 200) {
            const d = res.data.data;

            // Extract block and number separately
            let block = "";
            let blockNum = "";
            if (d.block_number) {
              const parts = d.block_number.split("-");
              block = parts[0] || "";
              blockNum = parts[1] || "";
            }

            setSelectedSite(d.site_detail_id);
            setFormData({
              block: block,
              block_number: blockNum,
              rera_area: d.rera_area || "",
              undivided_landshare: d.undivided_landshare || "",
              balcony_area: d.balcony_area || "",
              wash_area: d.wash_area || "",
              terrace_area: d.terrace_area || "",
              north: d.north || "",
              south: d.south || "",
              east: d.east || "",
              west: d.west || "",
            });
            setSiteName(d.site_title);
          }
        } catch (err) {
          toast.error("Failed to load property details");
        } finally {
          setLoading(false);
        }
      })();
    }
  }, [mode, blockDetailId]);

  // Handle input change
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Submit handler
  // Submit handler
  const handleSubmit = async () => {
    if (!selectedSite) {
      toast.error("Please select a site.");
      return;
    }

    // Combine block + number before sending
    const fullBlockNumber =
      formData.block && formData.block_number
        ? `${formData.block}-${formData.block_number}`
        : formData.block || formData.block_number;

    const payload = {
      ...formData,
      block: formData.block, 
      block_number: fullBlockNumber, 
      site_detail_id: selectedSite,
    };

    if (mode === "add") {
      const data = new FormData();
      Object.entries(payload).forEach(([key, value]) => {
        data.append(key, value as string);
      });

      const response = await addPropertyDetails(data);
      if (response) {
        toast.success("Property details added successfully!");
        navigate("/admin/projects/property_details");
        
        setFormData({
          block: "",
          block_number: "",
          rera_area: "",
          undivided_landshare: "",
          balcony_area: "",
          wash_area: "",
          terrace_area: "",
          north: "",
          south: "",
          east: "",
          west: "",
        });
        setSelectedSite("");
      }
    } else if (mode === "edit" && blockDetailId) {
      const response = await updatePropertyDetails(blockDetailId, payload);
      if (response) {
        toast.success("Property details updated successfully!");
         navigate("/admin/projects/property_details");
      }
    }
  };
  return (
    <div>
      <PageMeta
        title={mode === "add" ? "Add Project Details" : "Edit Project Details"}
      />

      <div className="grid grid-cols-1 gap-6 xl:grid-cols-1">
        <div className="space-y-6">
          <ComponentCard
            title={
              mode === "add" ? "Add Property Details" : "Edit Property Details"
            }
          >
            <div className="space-y-6">
              {/* Select Site + Block */}
              <div className="grid grid-cols-2 gap-6 xl:grid-cols-2">
                {mode === "add" && (
                  <SiteSelector
                    value={selectedSite}
                    onChange={(siteId: string | number) =>
                      setSelectedSite(siteId)
                    }
                  />
                )}

                {mode === "edit" && (
                  <div>
                    <Label>Site</Label>
                    <Input
                      value={siteName} // ✅ show site name instead of ID
                      disabled
                      className="disablefeildset h-11 w-full text-black- rounded-lg border appearance-none px-4 py-2.5 text-sm shadow-theme-xs dark:bg-gray-900 dark:text-white/90"
                    />
                  </div>
                )}
                <div>
                  <Label>Block</Label>
                  <Input
                    name="block"
                    value={formData.block}
                    onChange={handleChange}
                    placeholder="Enter Block (e.g. K)"
                    disabled={mode === "edit"}
                    className={`h-11 w-full rounded-lg border appearance-none px-4 py-2.5 text-sm shadow-theme-xs
              ${mode === "edit" ? "disablefeildset" : ""}`}
                  />
                </div>
              </div>

              {/* Block Number + Balcony Area */}
              <div className="grid grid-cols-2 gap-6 xl:grid-cols-2">
                <FormControl fullWidth>
                  <Label>Block Number</Label>
                  <OutlinedInput
                    name="block_number"
                    value={formData.block_number}
                    onChange={handleChange}
                    placeholder="Enter Block Number (e.g. 503)"
                    disabled={mode === "edit"}
                    startAdornment={
                      <InputAdornment position="start">
                        {formData.block ? `${formData.block}-` : ""}
                      </InputAdornment>
                    }
                    className={inputClasses}
                  />
                </FormControl>
                <div>
                  <Label>Balcony Area</Label>
                  <Input
                    type="number"
                    name="balcony_area"
                    value={formData.balcony_area}
                    onChange={handleChange}
                    placeholder="Enter Balcony Area"
                  />
                </div>
              </div>

              {/* Wash + Terrace */}
              <div className="grid grid-cols-2 gap-6 xl:grid-cols-2">
                <div>
                  <Label>Wash Area</Label>
                  <Input
                    type="number"
                    name="wash_area"
                    value={formData.wash_area}
                    onChange={handleChange}
                    placeholder="Enter Wash Area"
                  />
                </div>
                <div>
                  <Label>Terrace Area (if)</Label>
                  <Input
                    type="number"
                    name="terrace_area"
                    value={formData.terrace_area}
                    onChange={handleChange}
                    placeholder="Enter Terrace Area"
                  />
                </div>
              </div>

              {/* Landshare + North */}
              <div className="grid grid-cols-2 gap-6 xl:grid-cols-2">
                <div>
                  <Label>Undivided Landshare</Label>
                  <Input
                    type="number"
                    name="undivided_landshare"
                    value={formData.undivided_landshare}
                    onChange={handleChange}
                    placeholder="Enter Undivided Landshare"
                  />
                </div>
                <div>
                  <Label>North</Label>
                  <Input
                    name="north"
                    value={formData.north}
                    onChange={handleChange}
                    placeholder="Enter North description"
                  />
                </div>
              </div>

              {/* East + West + South */}
              <div className="grid grid-cols-2 gap-6 xl:grid-cols-2">
                <div>
                  <Label>East</Label>
                  <Input
                    name="east"
                    value={formData.east}
                    onChange={handleChange}
                    placeholder="Enter East description"
                  />
                </div>
                <div>
                  <Label>West</Label>
                  <Input
                    name="west"
                    value={formData.west}
                    onChange={handleChange}
                    placeholder="Enter West description"
                  />
                </div>
                <div>
                  <Label>South</Label>
                  <Input
                    name="south"
                    value={formData.south}
                    onChange={handleChange}
                    placeholder="Enter South description"
                  />
                </div>
              </div>
            </div>
          </ComponentCard>
        </div>
      </div>

      {/* Buttons */}
      <Button className="Submitbtn" onClick={handleSubmit} disabled={loading}>
        {mode === "add" ? "Submit" : "Update"}
      </Button>
      <Button className="canclebtn">Cancel</Button>
    </div>
  );
};

export default Addpropertydetails;
