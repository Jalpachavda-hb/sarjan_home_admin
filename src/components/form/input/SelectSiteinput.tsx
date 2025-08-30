import { useEffect, useState } from "react";
import Select from "../Select";
import Label from "../Label"; 
import { fetchSiteList } from "../../../utils/Handlerfunctions/getdata"; 

const SiteSelector = ({ onChange }) => {
  const [siteOptions, setSiteOptions] = useState([]);

  useEffect(() => {
    const loadSites = async () => {
      const sites = await fetchSiteList(); // API call
      setSiteOptions(sites);              // [{ value, label }]
    };
    loadSites();
  }, []);

  return (
    <div>
      <Label>Select Site</Label>
      <Select
        options={siteOptions}
        placeholder="Select a site"
        className="dark:bg-dark-900"
        onChange={onChange} 
      
      />
    </div>
  );
};

export default SiteSelector;
