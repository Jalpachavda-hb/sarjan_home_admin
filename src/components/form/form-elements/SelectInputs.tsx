import { useState } from "react";

import MultiSelect from "../MultiSelect";

export default function SelectInputs() {
  const [selectedValues, setSelectedValues] = useState<string[]>([]);

  const multiOptions = [
    { value: "1", text: "Option 1", selected: false },
    { value: "2", text: "Option 2", selected: false },
    { value: "3", text: "Option 3", selected: false },
    { value: "4", text: "Option 4", selected: false },
  ];
  return (
    <div className="space-y-6">
      <div>
        <MultiSelect
          label=""
          options={multiOptions}
          onChange={(values) => setSelectedValues(values)}
        />
        <p className="sr-only">Selected Values: {selectedValues.join(", ")}</p>
      </div>
    </div>
  );
}
