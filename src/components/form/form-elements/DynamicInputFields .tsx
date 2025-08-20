import React, { useState } from "react";
import { FiPlus } from "react-icons/fi";
import { FiTrash2 } from "react-icons/fi";
import Label from "../Label";
import Input from "../input/InputField";
import Button from "../../ui/button/Button";
const DynamicInputFields = () => {
  const [inputs, setInputs] = useState([""]); // First input by default

  // Add new input
  const handleAddInput = () => {
    if (!inputs[0].trim()) {
      alert("Please fill the first task before adding more.");
      return;
    }
    setInputs([...inputs, ""]);
  };

  // Update input value
  const handleInputChange = (index, value) => {
    const updatedInputs = [...inputs];
    updatedInputs[index] = value;
    setInputs(updatedInputs);
  };

  // Delete input
  const handleDeleteInput = (index) => {
    const updatedInputs = inputs.filter((_, i) => i !== index);
    setInputs(updatedInputs);
  };

  return (
    <div className="font-[Poppins] text-gray-600">
      <Label className="mb-1 block">Add Aminities</Label>

      {inputs.map((input, index) => (
        <div key={index} className="flex gap-2 mt-2 w-full">
          {/* Full-width Input */}
          <div className="flex-1">
            <Input
              type="text"
              value={input}
              onChange={(e) => handleInputChange(index, e.target.value)}
              placeholder="Enter Aminity"
              className="w-full"
            />
          </div>

          {/* Add button only for last input */}
          {index === inputs.length - 1 && (
            <button
                
              onClick={handleAddInput}
              className="flex items-center gap-1  border rounded text-blue-600 hover:bg-blue-50 transition whitespace-nowrap"
            >
              <FiPlus /> Add More
            </button>
          )}

          {/* Delete icon for all except first input */}
          {index > 0 && (
            <button
              type="button"
              onClick={() => handleDeleteInput(index)}
              className="px-3 py-2 border rounded text-red-500 hover:bg-red-50 transition"
            >
              <FiTrash2 />
            </button>
          )}
        </div>
      ))}
    </div>
  );
};

export default DynamicInputFields;
