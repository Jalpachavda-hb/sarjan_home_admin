import { useEffect, useState } from "react";
import { FormControl, InputLabel, Select, MenuItem } from "@mui/material";
import { fetchSiteList } from "../../../utils/Handlerfunctions/getdata";

import { SelectChangeEvent } from "@mui/material";
interface SiteFilterProps {
  value: string;
  onChange: (event: SelectChangeEvent<string>) => void;
  label?: string;
  className?: string; 
}

const SiteFilter = ({
  value,
  onChange,
  label = "Filter by Site",
}: SiteFilterProps) => {
  const [siteOptions, setSiteOptions] = useState<
    { value: string; label: string }[]
  >([]);

  useEffect(() => {
    const loadSites = async () => {
      const sites = await fetchSiteList(); // [{value, label}]
      setSiteOptions(sites);
    };
    loadSites();
  }, []);

  return (
    <FormControl size="small" sx={{ minWidth: 180 }}  className="dark:bg-gray-200 rounded-md">
      <InputLabel>{label}</InputLabel>
      <Select
        value={value}
        onChange={onChange}
        label={label}
        MenuProps={{
          PaperProps: {
            sx: { fontFamily: "Poppins", fontSize: "14px" },
          },
        }}
      >
        <MenuItem value="">All Sites</MenuItem>
        {siteOptions.map((site) => (
          <MenuItem key={site.value} value={site.value}>
            {site.label}
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  );
};

export default SiteFilter;
