import { useState } from "react";
import { FiPlus } from "react-icons/fi";
import { FiTrash2 } from "react-icons/fi";
import Label from "../Label";
import Input from "../input/InputField";

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
const handleInputChange = (index: number, value: string) => {
  const updatedInputs = [...inputs];
  updatedInputs[index] = value;
  setInputs(updatedInputs);
};

const handleDeleteInput = (index: number) => {
  setInputs(inputs.filter((_, i) => i !== index));
};
 
  return (
  <div className="font-[Poppins] text-gray-600">
    <Label className="mb-1 block">Add Amenities</Label>

    {inputs.map((input, index) => (
      <div key={index} className="flex gap-2 mt-2 items-center w-full">
        <div className="flex-1">
          <Input
            type="text"
            value={input}
            onChange={(e) => handleInputChange(index, e.target.value)}
            placeholder="Enter Amenity"
            className="w-full"
          />
        </div>

        {index === inputs.length - 1 && (
          <button
            type="button"
            onClick={handleAddInput}
            className="flex items-center gap-1 px-3 py-2 border rounded text-blue-600 hover:bg-blue-50 transition whitespace-nowrap"
          >
            <FiPlus /> Add More
          </button>
        )}

        {inputs.length > 1 && (
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
);}
export default DynamicInputFields;
