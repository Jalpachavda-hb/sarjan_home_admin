// import { useState } from "react";
// import ComponentCard from "../../common/ComponentCard";
// import Label from "../Label";
// import Select from "../Select";
// import MultiSelect from "../MultiSelect";

// export default function SelectInputs() {
//   const options = [
//     { value: "marketing", label: "Marketing" },
//     { value: "template", label: "Template" },
//     { value: "development", label: "Development" },
//   ];
//   const handleSelectChange = (value: string) => {
//     console.log("Selected value:", value);
//   };
//   const [selectedValues, setSelectedValues] = useState<string[]>([]);

//   const multiOptions = [
//     { value: "1", text: "Option 1", selected: false },
//     { value: "2", text: "Option 2", selected: false },
//     { value: "3", text: "Option 3", selected: false },
//     { value: "4", text: "Option 4", selected: false },
//   ];
//   return (
//     <div className="space-y-6">
//       <div>
//         <MultiSelect
//           options={multiOptions}
//           onChange={(values) => setSelectedValues(values)}
//         />
//         <p className="sr-only">Selected Values: {selectedValues.join(", ")}</p>
//       </div>
//     </div>
//   );
// }

import { useState, useEffect } from "react";
import ComponentCard from "../../common/ComponentCard";
import Label from "../Label";
import MultiSelect from "../MultiSelect";
import { fetchRolePermissions } from "../../../utils/Handlerfunctions/getdata";

export default function SelectInputs() {
  const [selectedValues, setSelectedValues] = useState<string[]>([]);
  const [rolePermissions, setRolePermissions] = useState<any[]>([]);

  useEffect(() => {
    const loadPermissions = async () => {
      try {
        const data = await fetchRolePermissions();
        if (data) setRolePermissions(data);
      } catch (error) {
        console.error("Error fetching role permissions:", error);
      }
    };
    loadPermissions();
  }, []);

  return (
    <div className="space-y-6">
      {rolePermissions.map((role, index) => (
        <div key={index}>
          <Label>{role.feature}</Label>
          <MultiSelect
            label={`Select permissions for ${role.feature}`}
            options={role.permission.map((perm: string) => ({
              value: perm,
              text: perm.charAt(0).toUpperCase() + perm.slice(1), // Capitalized
            }))}
            defaultSelected={[]}
            onChange={(values) => setSelectedValues(values)}
          />
        </div>
      ))}

      {/* Debug - show selected */}
      <p className="sr-only">Selected Values: {selectedValues.join(", ")}</p>
    </div>
  );
}
