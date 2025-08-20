import React, { useState } from "react";
import { FiPlus, FiTrash2 } from "react-icons/fi";
// import Label from "../../components/form/Label";
// import Input from "../../components/form/input/InputField";
// import TextArea from "../../components/form/input/TextArea";
import Label from "../Label";
import Input from "../input/InputField";
import TextArea from "../input/TextArea";




const TitleDescriptionList = () => {
  const [fields, setFields] = useState([{ title: "", description: "" }]);

  // Handle change for title or description
  const handleFieldChange = (index, key, value) => {
    const updated = [...fields];
    updated[index][key] = value;
    setFields(updated);
  };

  // Add new row
  const handleAddField = () => {
    setFields([...fields, { title: "", description: "" }]);
  };

  // Delete row
  const handleDeleteField = (index) => {
    const updated = fields.filter((_, i) => i !== index);
    setFields(updated);
  };

  return (
    <div className="font-[Poppins] text-gray-600">
      {/* Label for Title & Description */}
      <Label className="mb-1 block">Add Speciality</Label>

      {fields.map((field, index) => (
        <div key={index} className="flex flex-col gap-2 mt-2 w-full border p-3 rounded-md">
          
          {/* Title Input */}
          <Input
            type="text"
            value={field.title}
            onChange={(e) => handleFieldChange(index, "title", e.target.value)}
            placeholder="Enter Title of Speciality"
            className="w-full"
          />

          {/* Description Textarea */}
          <TextArea
            value={field.description}
            onChange={(e) => handleFieldChange(index, "description", e.target.value)}
            placeholder="Enter Description"
            className="w-full"
          />

          {/* Action buttons row */}
          <div className="flex gap-2">
            {index === fields.length - 1 && (
              <button
                type="button"
                onClick={handleAddField}
                className="flex items-center gap-1 px-3 py-2 border rounded text-blue-600 hover:bg-blue-50 transition whitespace-nowrap"
              >
                <FiPlus /> Add
              </button>
            )}

            {index > 0 && (
              <button
                type="button"
                onClick={() => handleDeleteField(index)}
                className="px-3 py-2 border rounded text-red-500 hover:bg-red-50 transition"
              >
                <FiTrash2 />
              </button>
            )}
          </div>
        </div>
      ))}
    </div>
  );
};

export default TitleDescriptionList;
