import { useEffect, useState } from "react";

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
import { useParams, useNavigate } from "react-router-dom";

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

  const [errors, setErrors] = useState<{ [key: string]: string }>({});

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

            let block = "";
            let blockNum = "";
            if (d.block_number) {
              if (/^[A-Za-z]-\d+$/.test(d.block_number)) {
                const parts = d.block_number.split("-");
                block = parts[0] || "";
                blockNum = parts[1] || "";
              } else {
                block = d.block || "";
                blockNum = d.block_number;
              }
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

  // Handle Unit input change - Only allow single letters
  const handleUnitChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    // Only allow single letters (A-Z, a-z) and convert to uppercase
    const singleLetter = value
      .replace(/[^a-zA-Z]/g, "")
      .charAt(0)
      .toUpperCase();

    setFormData({ ...formData, [name]: singleLetter });

    if (errors[name]) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  };

  // Handle other input changes
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    // For block_number, only allow numbers
    if (name === "block_number") {
      const numbersOnly = value.replace(/[^0-9]/g, "");
      setFormData({ ...formData, [name]: numbersOnly });
    } else if (name !== "block") {
      // Skip block field as it's handled by handleUnitChange
      setFormData({ ...formData, [name]: value });
    }

    if (errors[name]) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  };

  // Handle site change with error clearing
  const handleSiteChange = (siteId: string | number) => {
    setSelectedSite(siteId);

    if (errors.site) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors.site;
        return newErrors;
      });
    }
  };

  // Validation
  const validate = () => {
    const newErrors: { [key: string]: string } = {};
    if (!selectedSite) newErrors.site = "Site is required";
    if (!formData.block.trim()) newErrors.block = "Unit is required";
    if (!formData.block_number.trim())
      newErrors.block_number = "Unit Number is required";

    // Additional validation for Unit (should be exactly one letter)
    if (formData.block && formData.block.length !== 1) {
      newErrors.block = "Unit must be a single letter (A-Z)";
    }

    return newErrors;
  };

  // Submit handler - COMPLETELY FIXED VERSION
  const handleSubmit = async () => {
    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    try {
      if (mode === "add") {
        const payload = {
          block: formData.block, // Send the single letter (K, B, C)
          block_number: formData.block_number, // Send the combined format (K-301)
          rera_area: formData.rera_area,
          undivided_landshare: formData.undivided_landshare,
          balcony_area: formData.balcony_area,
          wash_area: formData.wash_area,
          terrace_area: formData.terrace_area,
          north: formData.north,
          south: formData.south,
          east: formData.east,
          west: formData.west,
          site_detail_id: selectedSite,
        };

        console.log("Add Payload:", payload); // Debug log

        const data = new FormData();
        Object.entries(payload).forEach(([key, value]) => {
          data.append(key, value as string);
        });

        const response = await addPropertyDetails(data);
        if (response?.status === 200) {
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
        } else {
          toast.error(response?.message || "Failed to add property details");
        }
      } else if (mode === "edit" && blockDetailId) {
        // For EDIT mode: Use the existing format
        // const completeBlockNumber = `${formData.block}-${formData.block_number}`;

        const payload = {
          block: formData.block, // Unit letter only
          block_number: formData.block_number,
          rera_area: formData.rera_area,
          undivided_landshare: formData.undivided_landshare,
          balcony_area: formData.balcony_area,
          wash_area: formData.wash_area,
          terrace_area: formData.terrace_area,
          north: formData.north,
          south: formData.south,
          east: formData.east,
          west: formData.west,
          site_detail_id: selectedSite,
        };

        console.log("Edit Payload:", payload); // Debug log

        const response = await updatePropertyDetails(blockDetailId, payload);
        if (response?.status === 200) {
          toast.success("Property details updated successfully!");
          navigate("/admin/projects/property_details");
        } else {
          toast.error(response?.message || "Failed to update property details");
        }
      }
    } catch (error: any) {
      console.error("Error:", error);
      toast.error(
        error.response?.data?.message ||
          error.message ||
          "An unexpected error occurred"
      );
    }
  };

  return (
    <div>
      <div className="grid grid-cols-1 gap-6 xl:grid-cols-1">
        <div className="space-y-6">
          <ComponentCard
            title={
              mode === "add" ? "Add Property Details" : "Edit Property Details"
            }
          >
            <div className="space-y-6">
              {/* Select Site + Unit */}
              <div className="grid grid-cols-2 gap-6 xl:grid-cols-2">
                {mode === "add" && (
                  <div>
                    <SiteSelector
                      value={String(selectedSite)}
                      onChange={handleSiteChange}
                    />
                    {errors.site && (
                      <p className="text-red-500 text-sm">{errors.site}</p>
                    )}
                  </div>
                )}

                {mode === "edit" && (
                  <div>
                    <Label>Site</Label>
                    <Input
                      value={siteName}
                      disabled
                      className="disabledInput"
                    />
                  </div>
                )}
                <div>
                  <Label>
                    Unit <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    name="block"
                    value={formData.block}
                    onChange={handleUnitChange}
                    placeholder="Enter Unit (e.g. A, B, C, K)"
                    disabled={mode === "edit"}
                    // maxLength={1}
                    className={`h-11 w-full rounded-lg border appearance-none px-4 py-2.5 text-sm shadow-theme-xs
              ${mode === "edit" ? "disabledInput" : ""}`}
                  />
                  {errors.block && (
                    <p className="text-red-500 text-sm">{errors.block}</p>
                  )}
                  <p className="text-xs text-gray-500 mt-1">
                    Enter a single letter (A-Z)
                  </p>
                </div>
              </div>

              {/* Unit Number + Balcony Area */}
              <div className="grid grid-cols-2 gap-6 xl:grid-cols-2">
                <FormControl fullWidth>
                  <Label>
                    Unit Number <span className="text-red-500">*</span>
                  </Label>
                  <OutlinedInput
                    name="block_number"
                    value={formData.block_number}
                    onChange={handleChange}
                    placeholder="Enter Unit Number (e.g. 001, 201, 304)"
                    disabled={mode === "edit"}
                    startAdornment={
                      <InputAdornment position="start">
                        {formData.block ? `${formData.block}-` : ""}
                      </InputAdornment>
                    }
                    className={inputClasses}
                  />
                  {errors.block_number && (
                    <p className="text-red-500 text-sm">
                      {errors.block_number}
                    </p>
                  )}
                  <p className="text-xs text-gray-500 mt-1">
                    Enter numbers only (001, 201, etc.)
                  </p>
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
              <div className="grid grid-cols-2 gap-6 xl:grid-cols-2">
                <div>
                  <Label>Rera Area</Label>
                  <Input
                    type="number"
                    name="rera_area"
                    value={formData.rera_area}
                    onChange={handleChange}
                    placeholder="Enter Rera Area"
                  />
                </div>
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
              </div>
              <div className="grid grid-cols-2 gap-6 xl:grid-cols-2">
                <div>
                  <Label>Terrace Area(if)</Label>
                  <Input
                    type="number"
                    name="terrace_area"
                    value={formData.terrace_area}
                    onChange={handleChange}
                    placeholder="Enter Terrace Area"
                  />
                </div>
                <div>
                  <Label>Undivided Landshare :</Label>
                  <Input
                    type="number"
                    name="undivided_landshare"
                    value={formData.undivided_landshare}
                    onChange={handleChange}
                    placeholder="Enter Undivided Landshare "
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-6 xl:grid-cols-2">
                <div>
                  <Label>North</Label>
                  <Input
                    type="number"
                    name="north"
                    value={formData.north}
                    onChange={handleChange}
                    placeholder="Enter North Area"
                  />
                </div>
                <div>
                  <Label>South </Label>
                  <Input
                    type="number"
                    name="south"
                    value={formData.south}
                    onChange={handleChange}
                    placeholder="Enter South Area"
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-6 xl:grid-cols-2">
                <div>
                  <Label>East</Label>
                  <Input
                    type="number"
                    name="east"
                    value={formData.east}
                    onChange={handleChange}
                    placeholder="Enter east Area"
                  />
                </div>
                <div>
                  <Label>West </Label>
                  <Input
                    type="number"
                    name="west"
                    value={formData.west}
                    onChange={handleChange}
                    placeholder="Enter west Area"
                  />
                </div>
              </div>

              {/* ... */}
            </div>
          </ComponentCard>
        </div>
      </div>

      {/* Buttons */}
      <div className="flex gap-4 mt-6">
        <Button className="Submitbtn" onClick={handleSubmit} disabled={loading}>
          {mode === "add" ? "Submit" : "Update"}
        </Button>
        <Button onClick={() => navigate(-1)} className="canclebtn">
          Cancel
        </Button>
      </div>
    </div>
  );
};

export default Addpropertydetails;
