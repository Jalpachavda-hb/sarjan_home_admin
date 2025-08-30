import { useEffect, useState } from "react";
import { FormControl, InputLabel, Select, MenuItem } from "@mui/material";
import { fetchSiteList } from "../../../utils/Handlerfunctions/getdata";

const SiteFilter = ({ value, onChange, label = "Filter by Site" }) => {
  const [siteOptions, setSiteOptions] = useState([]);

  useEffect(() => {
    const loadSites = async () => {
      const sites = await fetchSiteList(); // [{value, label}]
      setSiteOptions(sites);
    };
    loadSites();
  }, []);

  return (
    <FormControl size="small" sx={{ minWidth: 180 }}>
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

// import { useEffect, useState } from "react";
// import { FormControl, InputLabel, Select, MenuItem } from "@mui/material";
// import { fetchSiteList } from "../../../utils/Handlerfunctions/getdata";

// interface Site {
//   id: number;
//   title: string;
// }

// const SiteFilter = ({ value, onChange, label = "Filter by Site" }) => {
//   const [siteOptions, setSiteOptions] = useState<Site[]>([]);

//   useEffect(() => {
//     const loadSites = async () => {
//       const sites = await fetchSiteList();
//       setSiteOptions(sites || []);
//     };
//     loadSites();
//   }, []);

//   return (
//          <FormControl size="small" sx={{ minWidth: 180 }}>
//        <InputLabel>{label}</InputLabel>
//       <Select
//   value={value}
//   onChange={(e) => onChange(e.target.value)}   // ✅ extract only the value
//   label={label}
//   MenuProps={{
//     PaperProps: {
//       sx: { fontFamily: "Poppins", fontSize: "14px" },
//     },
//   }}
// >
//   <MenuItem value="">All Sites</MenuItem>
//   {siteOptions.map((site) => (
//     <MenuItem key={site.value} value={site.value}>
//       {site.label}
//     </MenuItem>
//   ))}
// </Select>

//     </FormControl>
//   );
// };

// export default SiteFilter;
