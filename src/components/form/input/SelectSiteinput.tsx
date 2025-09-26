import { useEffect, useState } from "react";
import Select from "../Select";
import Label from "../Label";
import { fetchSiteList } from "../../../utils/Handlerfunctions/getdata";

interface Option {
  value: string;
  label: string;
}

interface SiteSelectorProps {
  onChange: (value: string) => void;
  value: string;
  label?: string;
}

const SiteSelector: React.FC<SiteSelectorProps> = ({
  onChange,
  value,
  label = "Select Site",
}) => {
  const [siteOptions, setSiteOptions] = useState<Option[]>([]);

  useEffect(() => {
    const loadSites = async () => {
      const sites = await fetchSiteList();
      const options = sites.map((site) => ({
        value: site.value.toString(),
        label: site.label,
      }));
      setSiteOptions(options);
    };
    loadSites();
  }, []);

  return (
    <div>
      <Label>
        {label}
        <span className="text-red-500">*</span>
      </Label>
      <Select
        options={siteOptions}
        value={value}
        onChange={onChange}
        placeholder={label}
      />
    </div>
  );
};

export default SiteSelector;
